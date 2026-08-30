/**
 * The rule permanent rule 6 states, made into something that can be red. ADR-0093.
 *
 * `AlreadyPublished` refuses rebinding an address inside one run and has no memory between two: the
 * ledger is rebuilt from the sources every time, so a contract whose bytes moved comes back with a new
 * digest and the registry does not rebind the address, it forgets the address was ever bound. The
 * memory is git, and this is what reads it.
 *
 * The past is a parameter rather than a call, so that the comparison and the rebuilding fail apart -
 * `rebuild.ts` is the one that spawns a process. It arrives as rendered addresses and digests rather
 * than a `Ledger`, which is the subset that decides the answer: ADR-0068's rule, and what keeps the
 * format crossing a process boundary down to something a reader can check by looking at it.
 */

import { renderContract, renderImplementation } from './address.js'
import { DIGEST } from './canonical.js'
import { REVISION, THE_UNPUBLISHED_REVISION } from './revision.js'
import type { Ledger } from './snapshot.js'

/**
 * What one revision of this repository bound, by rendered address.
 *
 * A map rather than a list, because the question asked of it is *what was this address bound to* and a
 * list would make every caller write the lookup. `bindingsOf` below is the only thing that builds one
 * from a ledger, so the two sides of a comparison are rendered by one function.
 */
export type FrozenBindings = ReadonlyMap<string, string>

/** How a past revision is reached. `rebuild.ts` is the implementation; a test supplies its own. */
export type BindingsAt = (revision: string) => FrozenBindings

/**
 * Two addresses of one ledger that render alike, which no comparison by rendering can survive.
 *
 * `snapshot.ts` warns that a comparison of two renderings can be right about two strings and wrong
 * about two artefacts, because `renderImplementation` joins an id and a version with `@` and nothing
 * refuses an id carrying one. A map keyed by the rendering would silently lose one of the two, and the
 * lost one is the one whose freeze stops being checked. So it is refused rather than tolerated, which
 * is the treatment [ADR-0070] gives a cycle: a ledger that cannot be read is corrupt, not tricky.
 */
export class RenderingsCollide extends Error {
  constructor(what: string) {
    super(
      `two bindings of this ledger both render as ${what}, so no lookup by address can tell them ` +
        `apart. A rendering is how a binding is addressed here, and two of them under one name means ` +
        `one artefact's freeze would go unchecked with nothing on screen to say which.`,
    )
    this.name = 'RenderingsCollide'
  }
}

/**
 * Every binding of a ledger, whichever unit it is, as the pair a freeze check needs.
 *
 * One walk over both lists because the rule is one rule - `refuseRebinding` is already written once
 * for two units, and a memory built for one half of it would be half a mechanism.
 */
const everyBinding = (ledger: Ledger): readonly AnchoredBinding[] => [
  ...ledger.contracts.map((entry) => ({
    what: renderContract(entry.address),
    digest: entry.digest,
    publishedFrom: entry.publishedFrom,
    publishedAt: entry.publishedAt,
  })),
  ...ledger.implementations.map((entry) => ({
    what: renderImplementation(entry.address),
    digest: entry.digest,
    publishedFrom: entry.publishedFrom,
    publishedAt: entry.publishedAt,
  })),
]

/**
 * A set of bindings, refusing two that answer to one address.
 *
 * Three callers reach it - a ledger in hand, a line format arriving from another process, and the
 * entry point that prints one - because "two bindings under one name is corrupt" is one rule and a
 * second copy of it is a rule that can come to disagree with itself.
 */
export const bindingsFrom = (pairs: Iterable<readonly [string, string]>): FrozenBindings => {
  const bindings = new Map<string, string>()

  for (const [what, digest] of pairs) {
    if (bindings.has(what)) throw new RenderingsCollide(what)
    bindings.set(what, digest)
  }

  return bindings
}

export const bindingsOf = (ledger: Ledger): FrozenBindings =>
  bindingsFrom(everyBinding(ledger).map((entry) => [entry.what, entry.digest] as const))

/**
 * A binding whose freeze this repository can be asked about, and the coordinate that lets it.
 *
 * The stand-ins mint `THE_UNPUBLISHED_REVISION` - forty zeros, git's own spelling of *no object* - so
 * every binding of a working tree today lands outside this list. That is the honest answer rather than
 * an empty one: nothing has been published, so there is nothing whose freeze could have been broken,
 * and `unanchoredBindings` below says so by name rather than by returning no faults.
 */
export type AnchoredBinding = {
  readonly what: string
  readonly digest: string
  readonly publishedFrom: string
  /** What the registry answers about when this was bound, which the commit above is what settles. */
  readonly publishedAt: string
}

/**
 * Whether a binding names a commit this repository can be rebuilt at.
 *
 * Forty zeros is not a near miss, it is the stand-ins saying *no object* on purpose, and a malformed
 * revision is the same silence with worse manners. Both land on the same side, because what decides
 * the partition is whether there is anything to go and look at.
 */
const isAnchored = (entry: AnchoredBinding): boolean =>
  entry.publishedFrom !== THE_UNPUBLISHED_REVISION && REVISION.test(entry.publishedFrom)

/** The bindings this repository cannot be asked about, named so that an empty check is never silent. */
export const unanchoredBindings = (ledger: Ledger): readonly string[] =>
  everyBinding(ledger)
    .filter((entry) => !isAnchored(entry))
    .map((entry) => entry.what)

const faultFor = (entry: AnchoredBinding, held: string | undefined): string | null => {
  if (held === undefined) {
    return (
      `${entry.what} records that it was published from ${entry.publishedFrom}, and the registry at ` +
      `that commit binds no such address. Either the coordinate names the wrong commit, or a ` +
      `publication was recorded that never happened - and a binding nobody can rebuild is one whose ` +
      `freeze nothing will ever check again.`
    )
  }

  if (held === entry.digest) return null

  return (
    `${entry.what} was published from ${entry.publishedFrom} bound to ${held}, and this tree now ` +
    `produces ${entry.digest}. A published version is frozen for life, so the repair is not to ` +
    `update the binding: it is to put back what moved, or to publish the change as a new major ` +
    `beside this one. \`git diff ${entry.publishedFrom} HEAD\` is what moved it, and every byte of ` +
    `the contract's declared files is inside the digest - comments included.`
  )
}

/**
 * Why this repository may not be what it says it published. Empty when it is.
 *
 * The past is read once per distinct revision rather than once per binding, because rebuilding a
 * revision is the expensive half and two artefacts published together share a commit.
 */
export const rebindingFaults = (ledger: Ledger, bindingsAt: BindingsAt): readonly string[] => {
  // For its refusal: a ledger two of whose bindings render alike cannot be checked by address at all.
  bindingsOf(ledger)

  const past = new Map<string, FrozenBindings>()

  return everyBinding(ledger)
    .filter(isAnchored)
    .flatMap((entry) => {
      const held = past.get(entry.publishedFrom) ?? bindingsAt(entry.publishedFrom)
      past.set(entry.publishedFrom, held)

      const fault = faultFor(entry, held.get(entry.what))

      return fault === null ? [] : [fault]
    })
}

/**
 * How a commit's own date is read. `the-freeze.test.ts` supplies git; a test supplies its own.
 *
 * The reader is a parameter for the reason `BindingsAt` above is one: asking git is a process, and the
 * rule is a comparison. Written together, one guard would cover two claims and neither would say
 * anything on the day they disagree.
 */
export type DateOfCommit = (revision: string) => string

/**
 * One instant, however it was spelled, or `null` when it is not an instant at all.
 *
 * Both sides are normalised before they are compared, because git renders a commit date in the offset
 * it was made in and the registry serves UTC - `2026-08-17T12:57:32+02:00` and
 * `2026-08-17T10:57:32.000Z` are one moment written twice. **The spelling is deliberately not this
 * rule's subject**: what is claimed is that the registry dates a binding by the commit it names, and a
 * claim about which of the two forms is served would be a second one, wanted by nobody yet.
 */
const instantOf = (written: string): string | null => {
  const parsed = Date.parse(written)

  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString()
}

const misdatingFor = (entry: AnchoredBinding, authored: string): string | null => {
  const commit = instantOf(authored)
  if (commit === null) {
    return (
      `${entry.what} records that it was published from ${entry.publishedFrom}, and asking that ` +
      `commit for its date answered \`${authored}\`, which is not an instant. A date nobody can read ` +
      `is not a date the registry can be held to.`
    )
  }

  const served = instantOf(entry.publishedAt)
  if (served === null) {
    return (
      `${entry.what} is served as published at \`${entry.publishedAt}\`, which is not an instant. ` +
      `\`publishedAt\` is what a reader is told about when this address was bound, and an unreadable ` +
      `one is worse than none: it looks like an answer.`
    )
  }

  if (served === commit) return null

  return (
    `${entry.what} is served as published at ${served} and was published from ${entry.publishedFrom}, ` +
    `which was authored at ${commit}. \`CONTRACT_BINDING_NATURES\` classes this field bound-for-life, ` +
    `so what is wrong is the answer and never the promise: either the coordinate names the wrong ` +
    `commit, or the instant beside it was not moved when the commit was. \`THE_PUBLICATIONS\` in ` +
    `\`publication.ts\` is where the two are declared together, and \`git show -s --format=%aI ` +
    `${entry.publishedFrom}\` is what settles it.`
  )
}

/**
 * Why the registry may be dating a binding by something other than the commit it names. Empty when it
 * is not. ADR-0177.
 *
 * **This is the neighbour of `rebindingFaults` and it is about the other field of the same pair.**
 * That one asks whether the *digest* a binding records is still what its commit produces; this one
 * asks whether the *instant* it records is when that commit happened. The two were one declaration
 * split across two files until ADR-0177, and the class of defect this closes is exactly what that
 * split allowed: a second publication added a commit to one half while the other half went on
 * answering for the first - measured, `number/round@1` and `object/deep-equal@1` were served as
 * published on 17 August, three and seven days before the commits that bound them.
 *
 * **A binding that anchors nothing is not asked**, which is `isAnchored`'s partition doing the same
 * work it does above: a stand-in mints forty zeros on purpose, there is no commit to ask, and
 * `unanchoredBindings` is what refuses to let that emptiness go unnamed.
 *
 * The commit is read once per distinct revision, because two artefacts published together share one -
 * and asking git is the expensive half here exactly as rebuilding is above.
 */
export const misdatedBindings = (ledger: Ledger, dateOf: DateOfCommit): readonly string[] => {
  const anchored = everyBinding(ledger).filter(isAnchored)
  const authored = new Map<string, string>()

  return anchored.flatMap((entry) => {
    const when = authored.get(entry.publishedFrom) ?? dateOf(entry.publishedFrom)
    authored.set(entry.publishedFrom, when)

    const fault = misdatingFor(entry, when)

    return fault === null ? [] : [fault]
  })
}

/**
 * The line format the two processes agree on, and the reason it is not JSON.
 *
 * What crosses the boundary is read out of a checkout by one program and into a comparison by another,
 * so it is input and gets a schema. A `Ledger` parsed back would be a whole record to validate for a
 * pair of strings the comparison actually uses; two fields and a tab is a format whose validator is
 * three refusals long and whose failure is legible in a terminal.
 */
export const renderBindings = (bindings: FrozenBindings): string =>
  [...bindings].map(([what, digest]) => `${what}\t${digest}\n`).join('')

export class BindingsAreNotReadable extends Error {
  constructor(line: string, why: string) {
    super(
      `the registry at a past commit answered \`${line}\`, and ${why}. This is the one thing in the ` +
        `freeze check that crosses a process boundary, so it is refused rather than interpreted: a ` +
        `line nobody can read is not a binding that agrees.`,
    )
    this.name = 'BindingsAreNotReadable'
  }
}

export const readBindings = (text: string): FrozenBindings =>
  bindingsFrom(
    text
      .split('\n')
      .filter((line) => line !== '')
      .map((line) => {
        const [what, digest, ...rest] = line.split('\t')

        if (what === undefined || what === '' || digest === undefined || rest.length > 0) {
          throw new BindingsAreNotReadable(
            line,
            'a binding is an address and a digest separated by one tab',
          )
        }
        if (!DIGEST.test(digest)) {
          throw new BindingsAreNotReadable(
            line,
            `"${digest}" is not a sha-256 digest in lower-case hex`,
          )
        }

        return [what, digest] as const
      }),
  )
