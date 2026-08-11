/**
 * How a synchronous decision is taken in front of a registry that answers over a network.
 *
 * ---------------------------------------------------------------------------
 * The property this exists to keep
 * ---------------------------------------------------------------------------
 *
 * `command.ts` says *everything this tool decides is reachable from a guard, with no process, no
 * working directory and no clock*, and it is what let `toopo add` be measured end to end without a
 * sandbox. Making the registry remote puts an `await` somewhere, and the only question worth asking is
 * *where*. Put it inside a decision and the property is gone silently: every guard over `resolve.ts`,
 * `plan.ts` and `reconcile.ts` becomes a guard over a promise, and the folder that could be read
 * without a process stops being one.
 *
 * So the `await` is **here**, in a loop around a decision that never sees it.
 *
 * ---------------------------------------------------------------------------
 * Fetch first and decide after is not available, so this is a fixpoint
 * ---------------------------------------------------------------------------
 *
 * There is no list of what an installation needs. `resolve.ts` walks the edges each snapshot carries,
 * so which snapshot is fetched next is decided by the snapshot before it; and `plan.ts` deduplicates by
 * digest, so which blobs are fetched at all is decided by a plan that exists only once every snapshot
 * has arrived. A prefetch that knew the list in advance would be a second statement of that walk -
 * which is exactly what `packaging/freeze.ts` refuses to write, and for the same reason.
 *
 * The shape is therefore **decide, note what was missing, fetch all of it, decide again from nothing**.
 * `decide` is the caller's own function, unchanged and synchronous, run against a view over what has
 * arrived so far. Its verdict on any round but the last is thrown away; only `missing` is read.
 *
 * It terminates because a round writes *every* missing key into the cache, so the cache grows by at
 * least one entry per round and no key is ever missing twice. **That is why a cache has to tell *not
 * asked* from *asked, and the registry holds no such thing* apart** - collapsing the two makes a
 * genuinely absent answer missing for ever and the loop never ends. Presence in the map is the first;
 * a `null` value is the second.
 *
 * ---------------------------------------------------------------------------
 * The decision may not write, and this is the file that says so
 * ---------------------------------------------------------------------------
 *
 * A loop that replays a decision may only replay something that changes nothing. `prepareInstallation`,
 * `reconcileProject`, `prepareRemoval`, `prepareUpdate` and `search` read the disk and change none of
 * it, and `commit` is called by `command.ts` **outside** this loop. The moment writing moves into the
 * thing being replayed, an interrupted fetch writes a project once per round.
 *
 * The cost of replaying is not what it looks like, because every replay but the last refuses at the
 * first answer it does not hold: the disk hashing, the diffing and the import rewriting happen once.
 * It is `Found<T>` being paid for somewhere nobody wrote it for - a step that answers *what it found or
 * why it refused, never an absence* is a step a loop can re-enter for nothing.
 */

import type { ContractAddress } from '../registry/address.js'
import { renderContract } from '../registry/address.js'
import type { ServedIndex, ServedRefusals } from '../registry/response.js'
import type { HeldRegistry, RegistrySource } from './source.js'

/**
 * One question a decision asks a registry, carrying the arguments it was asked with.
 *
 * **A union rather than a method and a string**, because the alternative is a key that has to be parsed
 * back into an address before the port can be asked - a second parser of `renderContract`, which is the
 * thing this repository refuses on the grounds that a copy of a parser is not a second opinion. Here an
 * address is carried as an address and rendered only to be used as a cache key.
 */
export type Question =
  | { readonly method: 'contractIndex' }
  | { readonly method: 'refusals' }
  | { readonly method: 'implementationBindings'; readonly address: ContractAddress }
  | { readonly method: 'snapshot'; readonly digest: string }
  | { readonly method: 'blob'; readonly sha256: string }

/**
 * The address a question names, rendered - or `''` where the method names none.
 *
 * Total over the union by the compiler: a question added without saying what it is addressed by does
 * not compile, because the missing arm makes this function able to return `undefined`.
 */
export const addressAsked = (question: Question): string => {
  switch (question.method) {
    case 'contractIndex':
    case 'refusals':
      return ''
    case 'implementationBindings':
      return renderContract(question.address)
    case 'snapshot':
      return question.digest
    case 'blob':
      return question.sha256
  }
}

/**
 * The address a question is cached under.
 *
 * One function, because a cache written under one spelling and read under another answers the wrong
 * question with a straight face - and every key in this module goes through here.
 */
export const asked = (question: Question): string => `${question.method} ${addressAsked(question)}`

/**
 * Every answer that has arrived, keyed by `asked`.
 *
 * A key that is **absent** has not been asked. A key holding `null` was asked, and the registry holds
 * no such thing. The header says why those two may never collapse.
 */
export type WhatArrived = ReadonlyMap<string, unknown>

/** What the port answers where a registry holds nothing, so that a miss is not a fabricated answer. */
const NOTHING_HELD: ServedIndex = { addressing: 'named', entries: [] }
const NOTHING_REFUSED: ServedRefusals = { addressing: 'named', refusals: [], absorbed: [] }

/**
 * A synchronous view over what has arrived, writing down every question it could not answer.
 *
 * A miss answers exactly what the port says a registry with nothing in it answers, and never throws.
 * The decision has to be allowed to run on past a miss, because **the questions after it are the ones
 * this round exists to gather** - a view that threw would fetch one answer per round trip and turn a
 * walk of depth two into a walk of its own length.
 */
export const overWhatArrived = (
  arrived: WhatArrived,
  missing: Map<string, Question>,
): HeldRegistry => {
  /**
   * The one cast in this module, and what stands behind it.
   *
   * A cache over five methods answering five types is heterogeneous, so something has to carry the
   * pairing of a key with the shape stored under it. Here it is the single line of `deciding` that
   * writes this map: it stores `ask(source, question)` under `asked(question)`, for the same
   * `question`, and it is the only write there is. `ask` is total over the union, so what that line
   * stores is the port's own answer to the method the key names - and the only way to break the
   * pairing would be to spell a key two ways, which is what `asked` being one function prevents.
   */
  const answering = <T>(question: Question, whereNothingIsHeld: T): T => {
    const key = asked(question)
    if (!arrived.has(key)) {
      missing.set(key, question)

      return whereNothingIsHeld
    }

    return arrived.get(key) as T
  }

  return {
    contractIndex: () => answering({ method: 'contractIndex' }, NOTHING_HELD),

    refusals: () => answering({ method: 'refusals' }, NOTHING_REFUSED),

    implementationBindings: (address) =>
      answering({ method: 'implementationBindings', address }, []),

    snapshot: (digest) => answering({ method: 'snapshot', digest }, null),

    blob: (sha256) => answering({ method: 'blob', sha256 }, null),
  }
}

/**
 * A question put to the port.
 *
 * Total over the union by the compiler, for the reason `addressAsked` is. It is the other half of what
 * `THE_ENDPOINT_BEHIND` states one file along: that one says which endpoint answers a method, this one
 * says how the method is called.
 */
const ask = (source: RegistrySource, question: Question): Promise<unknown> => {
  switch (question.method) {
    case 'contractIndex':
      return source.contractIndex()
    case 'refusals':
      return source.refusals()
    case 'implementationBindings':
      return source.implementationBindings(question.address)
    case 'snapshot':
      return source.snapshot(question.digest)
    case 'blob':
      return source.blob(question.sha256)
  }
}

/** A decision, and what it took to reach it. */
export type Gathered<T> = {
  readonly answer: T
  /**
   * How many answers each round trip fetched, in order.
   *
   * The walk widening is visible rather than summarised, which is what makes a batched frontier
   * distinguishable from a walked one. Its length is the number of round trips, and the decision ran
   * once more than that - both read off it rather than carried beside it, because a field restating a
   * length is a second statement of one fact.
   */
  readonly fetchedPerRoundTrip: readonly number[]
  /** Everything that arrived, so that the same decision can be taken again against nothing. */
  readonly arrived: WhatArrived
}

/**
 * Run a synchronous decision against a registry, giving it everything it turns out to ask for.
 *
 * A round fetches every missing answer **in parallel**, because they are missing at the same moment and
 * nothing about one decides another - the sequential form would turn a frontier into a queue and pay a
 * latency per file rather than per level.
 */
export const deciding = async <T>(
  source: RegistrySource,
  decide: (held: HeldRegistry) => T,
): Promise<Gathered<T>> => {
  const arrived = new Map<string, unknown>()
  const fetchedPerRoundTrip: number[] = []

  for (;;) {
    const missing = new Map<string, Question>()
    const answer = decide(overWhatArrived(arrived, missing))

    if (missing.size === 0) return { answer, fetchedPerRoundTrip, arrived }

    fetchedPerRoundTrip.push(missing.size)

    const fetched = await Promise.all(
      [...missing.values()].map(
        async (question) => [asked(question), await ask(source, question)] as const,
      ),
    )

    for (const [key, answered] of fetched) arrived.set(key, answered)
  }
}

/** A decision taken against what is already held, and every question it turned out not to cover. */
export type WithoutAsking<T> = {
  readonly answer: T
  /** The questions the cache did not hold. Empty means the decision needed nothing new. */
  readonly wanted: readonly string[]
}

/**
 * The same decision, against a cache that already holds the answers - no loop, no network, no process.
 *
 * **It is what the acceptance guard of this unit is written against**, and it is production code rather
 * than test scaffolding because `packaging/freeze.ts` takes exactly this shape: warm the cache with the
 * walk, then make one synchronous pass over it.
 *
 * A cache that turns out not to hold everything is answered rather than thrown, because *which
 * questions were not covered* is the useful sentence and an exception carries one of them at best.
 */
export const withoutAsking = <T>(
  arrived: WhatArrived,
  decide: (held: HeldRegistry) => T,
): WithoutAsking<T> => {
  const missing = new Map<string, Question>()
  const answer = decide(overWhatArrived(arrived, missing))

  return { answer, wanted: [...missing.keys()] }
}
