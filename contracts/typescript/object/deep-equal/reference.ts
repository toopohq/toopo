// typescript/object/deep-equal@1 - https://toopo.dev/typescript/object/deep-equal@1/
// SPDX-License-Identifier: MIT-0

/**
 * The reference implementation of `object/deep-equal@1`.
 *
 * Nothing here is annotated with the contract's own types. `signature.test-d.ts` is what asserts that
 * this function has the declared type, and an annotation would make the compiler enforce it at
 * authoring time - which turns that file into a guard that cannot fail. `states-its-own-signature`
 * refuses it in as many words, and it caught this file once already.
 *
 * ---------------------------------------------------------------------------
 * Two things decide the shape, and both are clauses of the contract
 * ---------------------------------------------------------------------------
 *
 * **Ordinary structure is walked on an explicit stack.** Objects and arrays cost no call frames, so
 * the depth a caller can pass is bounded by the heap rather than by the runtime's stack. Measured on
 * Node 24.15.0: at least a million levels, where the five shipped implementations answer between
 * about one thousand and about eight thousand. Nesting *through a collection* still costs one frame
 * per level, because a candidate member has to be settled completely before it can be claimed, and
 * that bound is declared rather than discovered - about fifteen hundred levels, where `dequal`
 * reaches about twice as far.
 *
 * **The pairs under comparison are a path and not a memo.** They are entered on the way down and left
 * on the way up, and a speculative walk that fails takes back everything it opened. Memoising instead
 * answers `true` for a pair that a failed candidate happened to try: given
 * `{ s: Set([{v:1},{v:2}]), also: [{v:1}] }` against `{ s: Set([{v:2},{v:1}]), also: [{v:2}] }` the
 * answer is `false`, a memo answers `true`, and it answers `false` again when the two keys are
 * declared in the other order. That is `a-failed-candidate-leaves-nothing-behind` and its transposed
 * neighbour, and both rows exist because the author of this contract wrote the memo first.
 *
 * ---------------------------------------------------------------------------
 * Why the dispatch reads a tag and not a prototype
 * ---------------------------------------------------------------------------
 *
 * `Object.prototype.toString` reads the internal slot; `instanceof` reads the prototype chain, and
 * the two part exactly where it matters. `Object.create(Number.prototype)` passes `instanceof Number`
 * and has no slot to read, so a walk that trusted the prototype would call `valueOf` on it and throw.
 *
 * The built-ins that carry their value in a slot have no own property at all, so a walk that
 * enumerates keys sees two empty objects and answers `true`. That is the second fault this file was
 * written with, and it is why `a-boxed-number-carries-a-number` and its neighbours are rows.
 */

/** Pairs on the current comparison path, so a cycle terminates without writing to either argument. */
type Underway = Map<object, Set<object>>

/**
 * A comparison still to make, or a pair to take off the path once everything under it is done.
 *
 * The second member is what makes the path work on an explicit stack: there is no return to hang the
 * exit on, so the exit is pushed as work.
 */
type Step =
  | { readonly kind: 'compare'; readonly a: unknown; readonly b: unknown }
  | { readonly kind: 'leave'; readonly a: object; readonly b: object }

const isReference = (value: unknown): value is object =>
  (typeof value === 'object' && value !== null) || typeof value === 'function'

const onThePath = (underway: Underway, a: object, b: object): boolean =>
  underway.get(a)?.has(b) ?? false

const enter = (underway: Underway, a: object, b: object): void => {
  const against = underway.get(a)

  if (against === undefined) underway.set(a, new Set([b]))
  else against.add(b)
}

const leave = (underway: Underway, a: object, b: object): void => {
  underway.get(a)?.delete(b)
}

/**
 * Every pair a failed walk had entered and not yet left, taken back off the path.
 *
 * A walk that returns `false` abandons its remaining work, and what is left in that work is exactly
 * the set of pairs it opened and did not close. Draining it restores the path to what it was before
 * the attempt, which is what a speculative match owes its caller.
 */
const unwind = (pending: readonly Step[], underway: Underway): void => {
  for (const step of pending) {
    if (step.kind === 'leave') leave(underway, step.a, step.b)
  }
}

/** Own keys a caller can read, symbols included, which is where four shipped implementations stop. */
const enumerableKeysOf = (value: object): readonly (string | symbol)[] =>
  Reflect.ownKeys(value).filter(
    (key) => Object.getOwnPropertyDescriptor(value, key)?.enumerable === true,
  )

/** The key sets compared here and the values deferred, so their depth costs no frame. */
const deferKeys = (a: object, b: object, pending: Step[]): boolean => {
  const keys = enumerableKeysOf(a)

  if (keys.length !== enumerableKeysOf(b).length) return false

  const left = a as Record<string | symbol, unknown>
  const right = b as Record<string | symbol, unknown>

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false
    pending.push({ kind: 'compare', a: left[key], b: right[key] })
  }

  return true
}

/**
 * Elements compared with `Object.is`, which is the rule the first case group settles.
 *
 * A typed array holding `NaN` is equal to its own structured clone, and one holding `-0` is not equal
 * to one holding `0`. Three of the five shipped implementations compare elements with `===` and
 * answer the first of those wrongly.
 */
const sameElements = (a: ArrayLike<unknown>, b: ArrayLike<unknown>): boolean => {
  if (a.length !== b.length) return false

  for (let at = 0; at < a.length; at += 1) {
    if (!Object.is(a[at], b[at])) return false
  }

  return true
}

const sameBytes = (a: ArrayBufferLike, b: ArrayBufferLike): boolean =>
  a.byteLength === b.byteLength && sameElements(new Uint8Array(a), new Uint8Array(b))

const sameViews = (a: ArrayBufferView, b: ArrayBufferView): boolean => {
  if (a instanceof DataView) return sameBytes(a.buffer, (b as DataView).buffer)

  return sameElements(a as unknown as ArrayLike<unknown>, b as unknown as ArrayLike<unknown>)
}

/**
 * Members matched without regard to order, and this is the one place the call stack is spent.
 *
 * A candidate has to be settled completely before it can be claimed, so the recursion is in the
 * matching rather than in the walk. It is also the only quadratic path in the contract: a member of
 * one collection is tried against the unclaimed members of the other until one answers.
 */
const sameMembers = (a: readonly unknown[], b: readonly unknown[], underway: Underway): boolean => {
  if (a.length !== b.length) return false

  const unclaimed = new Set(b.keys())

  for (const left of a) {
    let claimed = false

    for (const at of unclaimed) {
      if (!compare(left, b[at], underway)) continue

      unclaimed.delete(at)
      claimed = true
      break
    }

    if (!claimed) return false
  }

  return true
}

/**
 * The built-ins whose value lives in an internal slot, keyed by the tag that proves the slot is there.
 *
 * A `String` object also carries indexed own properties, so `deferKeys` would answer it correctly by
 * accident. It is here anyway, because being right by accident on one of five is not a rule.
 */
const BOXED: Readonly<Record<string, ((value: object) => unknown) | undefined>> = {
  '[object Number]': (value) => Number.prototype.valueOf.call(value),
  '[object String]': (value) => String.prototype.valueOf.call(value),
  '[object Boolean]': (value) => Boolean.prototype.valueOf.call(value),
  '[object BigInt]': (value) => BigInt.prototype.valueOf.call(value),
  '[object Symbol]': (value) => Symbol.prototype.valueOf.call(value),
}

/**
 * Built-ins whose contents no caller can read, so nothing but identity could make two of them equal.
 *
 * `false` rather than a throw: the caller asked a question that has an answer, and these are not the
 * same value. Answering `true` - which a key walk does, because none of them has an own property - is
 * the silent wrong answer this whole contract is written against.
 */
const OPAQUE: ReadonlySet<string> = new Set([
  '[object Promise]',
  '[object WeakMap]',
  '[object WeakSet]',
  '[object WeakRef]',
])

/**
 * Whether the pair agrees on whatever it carries in a slot, or `null` where it carries nothing there.
 *
 * **This answers about the slot and never about the whole value**, because a built-in can carry an own
 * property beside its slot and every branch here would otherwise stop before looking. Measured: with
 * each branch answering for itself, a `Date`, a `RegExp`, a `Set`, a `Map`, an `ArrayBuffer` and a
 * typed array all compared equal to the same value carrying an extra own key - six wrong answers out
 * of eight, all of them a silent `true`. `lodash` gets all eight wrong; `util.isDeepStrictEqual` gets
 * all eight right.
 *
 * It is the third time this file was written with a branch that stopped at what its author was
 * thinking about, and `settle` is where the third repair goes so that there is no fourth: the own keys
 * are compared once, on the way out, for every kind of value.
 */
const asBuiltIn = (a: object, b: object, underway: Underway, pending: Step[]): boolean | null => {
  if (typeof a === 'function') return false

  const tag = Object.prototype.toString.call(a)

  if (OPAQUE.has(tag)) return false

  const valueIn = BOXED[tag]

  if (valueIn !== undefined) return Object.is(valueIn(a), valueIn(b))

  if (a instanceof Date) return Object.is(a.getTime(), (b as Date).getTime())

  if (a instanceof RegExp) {
    const other = b as RegExp

    // `lastIndex` is excluded, and not on a show of hands. The declared domain is the values
    // `structuredClone` carries and the admission oracle is that a value equals its own clone;
    // measured, `structuredClone(/a/g)` resets `lastIndex` to 0 while keeping source and flags, so
    // reading it here would make this contract fail the oracle it was admitted on.
    // `util.isDeepStrictEqual` reads it and is bound by no such domain.
    return a.source === other.source && a.flags === other.flags
  }

  if (a instanceof Map) return sameMembers([...a], [...(b as Map<unknown, unknown>)], underway)
  if (a instanceof Set) return sameMembers([...a], [...(b as Set<unknown>)], underway)
  if (ArrayBuffer.isView(a)) return sameViews(a, b as ArrayBufferView)
  if (a instanceof ArrayBuffer) return sameBytes(a, b as ArrayBuffer)

  if (a instanceof Error) {
    const other = b as Error

    if (a.name !== other.name || a.message !== other.message) return false

    // `cause` is walked as data rather than compared by identity, and `stack` is not read at all: it
    // names where an error was constructed rather than what it says, and two errors built at two call
    // sites for one reason are one reason.
    pending.push({ kind: 'compare', a: a.cause, b: other.cause })

    return true
  }

  return null
}

/** One pair: settled outright, or deferred by pushing what it is made of. */
const settle = (a: unknown, b: unknown, underway: Underway, pending: Step[]): boolean => {
  if (Object.is(a, b)) return true
  if (!isReference(a) || !isReference(b)) return false
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false
  if (onThePath(underway, a, b)) return true

  enter(underway, a, b)

  // Pushed before anything that can answer `false`, so that a failure always leaves an exit for
  // `unwind` to find. A pair entered without one would stay on the path after a speculative walk gave
  // up, which is the memo this implementation exists not to be.
  pending.push({ kind: 'leave', a, b })

  // A slot that disagrees settles the pair; a slot that agrees settles only the slot. Every value
  // reaches the key comparison below, whatever it carries elsewhere, and that is the whole repair for
  // a built-in hiding an own property.
  if (asBuiltIn(a, b, underway, pending) === false) return false

  // An array's own keys carry its holes, so `[,1]` and `[undefined,1]` differ here. The length is
  // asked separately because two arrays can hold the same keys and different lengths: `[1,2]` against
  // `[1,2,,]`.
  if (Array.isArray(a) && a.length !== (b as readonly unknown[]).length) return false

  return deferKeys(a, b, pending)
}

const compare = (a: unknown, b: unknown, underway: Underway): boolean => {
  const pending: Step[] = [{ kind: 'compare', a, b }]

  while (pending.length > 0) {
    const step = pending.pop() as Step

    if (step.kind === 'leave') {
      leave(underway, step.a, step.b)
      continue
    }

    if (!settle(step.a, step.b, underway, pending)) {
      unwind(pending, underway)

      return false
    }
  }

  return true
}

/**
 * Whether two values carry the same data.
 *
 * The path is shared with every nested walk a collection starts, which is what makes a cycle through
 * a `Set` terminate: the outer pair is already on it by the time its members are matched.
 */
export const deepEqual = (left: unknown, right: unknown): boolean =>
  compare(left, right, new Map())
