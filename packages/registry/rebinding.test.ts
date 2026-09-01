import { describe, expect, it } from 'vitest'

import { renderContract } from './address.js'
import { theLocalLedger } from './local-read-api.js'
import {
  BindingsAreNotReadable,
  RenderingsCollide,
  bindingsFrom,
  bindingsOf,
  misdatedBindings,
  readBindings,
  rebindingFaults,
  renderBindings,
  unanchoredBindings,
} from './rebinding.js'
import { THE_UNPUBLISHED_REVISION } from './revision.js'
import type { ContractStanding, Ledger, PublishedContract } from './snapshot.js'
import { EMPTY_LEDGER, publishContract, withContractStanding } from './snapshot.js'

/**
 * The rule permanent rule 6 states, with the past supplied rather than rebuilt.
 *
 * **The reader is a stub here and that is deliberate.** Rebuilding a commit is a process and a
 * checkout; the rule is a comparison. Written together, one guard would cover two claims and neither
 * would say anything on the day they disagree. `rebuilt.test.ts` is where the reader is asked to
 * produce a real digest from a real commit, on a repository built to be published from and edited.
 *
 * What no guard in this file can establish is that the rule holds for *this* catalogue at *this*
 * commit. Every fault above is computed with the past handed in, so what is proved is the comparison
 * and never the rebuilding. `against-what-was-published/` is where the two are put together over the
 * eight bindings this tree really mints, and it is a suite of its own because it spawns a checkout and
 * a process per revision - ADR-0107.
 *
 * What is left here is the cheap half, which a battery may replay sixty times for nothing: the
 * population is not empty. That guard used to assert the opposite, and its own comment named the day
 * it would become false; the sentence is kept where it stands, one screen down.
 */

const ADDRESS = { language: 'typescript' as const, name: 'number/parse', major: 1 }
const OTHER = { ...ADDRESS, name: 'date/add' }

const A_COMMIT = 'a'.repeat(40)

const AS_PUBLISHED = 'c'.repeat(64)
const AS_IT_STANDS = 'd'.repeat(64)

const PUBLISHED: ContractStanding = { lifecycle: { state: 'published' } }

/** What a commit this fixture's reader knows about was authored at, in an offset that is not UTC. */
const WHEN_A_COMMIT_WAS_AUTHORED = '2026-08-16T02:00:00+02:00'

/** The same instant as the line above, spelled the way the registry serves one. */
const THE_SAME_INSTANT = '2026-08-16T00:00:00.000Z'

const entry = (
  address: typeof ADDRESS,
  digest: string,
  publishedFrom: string,
  publishedAt: string = THE_SAME_INSTANT,
): PublishedContract => ({
  address,
  digest,
  publishedAt,
  publishedFrom,
  standing: PUBLISHED,
})

/** A past that binds exactly what it is told to, so that a guard supplies its own disagreement. */
const aPastBinding = (pairs: readonly (readonly [string, string])[]) => () => bindingsFrom(pairs)

const ledgerOf = (...entries: readonly PublishedContract[]): Ledger =>
  entries.reduce(publishContract, EMPTY_LEDGER)

describe('a published version is frozen for life, and this is what says so', () => {
  /**
   * The claim of the unit. A contract published at a commit, whose frozen half now hashes to something
   * else, is an address that has been rebound - and every lockfile holding the old digest would start
   * resolving to other bytes with nothing on screen.
   */
  it('a-binding-whose-digest-moved-since-its-publication-is-refused :: the address was rebound', () => {
    const faults = rebindingFaults(
      ledgerOf(entry(ADDRESS, AS_IT_STANDS, A_COMMIT)),
      aPastBinding([[renderContract(ADDRESS), AS_PUBLISHED]]),
    )

    expect(faults).toHaveLength(1)
    expect(faults[0]).toContain(AS_PUBLISHED)
    expect(faults[0]).toContain(AS_IT_STANDS)
    expect(faults[0]).toContain(A_COMMIT)
  })

  /**
   * The control. Without it the guard above would pass on a rule that refused everything, which is the
   * failure this repository has paid for on other checks: a refusal that is always right is a refusal
   * that decides nothing.
   */
  it('a-binding-that-still-hashes-to-what-it-was-published-as-is-accepted :: nothing moved', () => {
    expect(
      rebindingFaults(
        ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT)),
        aPastBinding([[renderContract(ADDRESS), AS_PUBLISHED]]),
      ),
    ).toEqual([])
  })

  /**
   * The operation the whole standing/frozen separation exists for, asked of the freeze check rather
   * than of the ledger. `absorbed-by-the-language` is a state a contract enters *after* publication, so
   * a check that reddened on it would make permanent rule 6 and ADR-0007 unable to both hold.
   */
  it('a-standing-change-rebinds-nothing :: the lifecycle is outside every digest', () => {
    const published = ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT))
    const absorbed = withContractStanding(published, ADDRESS, {
      lifecycle: {
        state: 'absorbed-by-the-language',
        answeredBy: 'a future proposal, named here by nothing',
        measurement: 'none: this is the shape of the operation, not a claim about the language',
      },
    })
    const past = aPastBinding([[renderContract(ADDRESS), AS_PUBLISHED]])

    expect(rebindingFaults(absorbed, past)).toEqual([])
    expect(absorbed.contracts[0]?.digest).toBe(published.contracts[0]?.digest)
  })

  /**
   * A coordinate naming a commit that bound nothing under this address. It is refused rather than
   * skipped, because the alternative is a binding that quietly stops being checked - which is the state
   * this whole unit exists to make impossible to reach in silence.
   */
  it('a-binding-published-from-a-commit-that-binds-no-such-address-is-refused :: nothing to compare', () => {
    const faults = rebindingFaults(
      ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT)),
      aPastBinding([[renderContract(OTHER), AS_PUBLISHED]]),
    )

    expect(faults).toHaveLength(1)
    expect(faults[0]).toContain('binds no such address')
  })

  /**
   * Two artefacts published together share a commit, and rebuilding one is the expensive half. The
   * count is read off a reader that records its own calls rather than asserted beside it.
   */
  it('the-past-is-read-once-per-commit-however-many-bindings-share-it :: rebuilding is the cost', () => {
    const asked: string[] = []
    const past = (revision: string) => {
      asked.push(revision)

      return bindingsFrom([
        [renderContract(ADDRESS), AS_PUBLISHED],
        [renderContract(OTHER), AS_PUBLISHED],
      ])
    }

    expect(
      rebindingFaults(
        ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT), entry(OTHER, AS_PUBLISHED, A_COMMIT)),
        past,
      ),
    ).toEqual([])
    expect(asked).toEqual([A_COMMIT])
  })

  /**
   * The stand-ins' answer is forty zeros, git's own spelling of *no object*, so no binding of a working
   * tree is asked about at all - and a reader that was never called is what proves it, rather than an
   * empty fault list that would look the same if the rule did nothing.
   */
  it('a-binding-that-names-no-commit-is-not-asked-about :: forty zeros is not a near miss', () => {
    let asked = 0
    const past = (revision: string) => {
      asked += 1

      return bindingsFrom([[revision, AS_PUBLISHED]])
    }

    expect(
      rebindingFaults(
        ledgerOf(
          entry(ADDRESS, AS_IT_STANDS, THE_UNPUBLISHED_REVISION),
          entry(OTHER, AS_IT_STANDS, 'not-a-commit'),
        ),
        past,
      ),
    ).toEqual([])
    expect(asked).toBe(0)
  })
})

describe('the population this check runs over, named rather than counted', () => {
  /**
   * **A guard that wrote down the day it would become false, and then became false on that day.**
   *
   * It read `the-five-anchor-nothing-and-the-check-says-which`, and what it asserted was that every
   * binding of this working tree lay outside the freeze check - because nothing was published, so every
   * fault list above was computed over an empty set, which is the shape of a check that goes green for
   * ever and is read by nobody until the day it is needed. Rather than leave that emptiness as a green
   * tick over no rows, it was asserted from the other side, and its own comment carried the sentence:
   * *the day somebody publishes, this reddens - and that is the day the guards above stop being
   * vacuous, which is exactly when a reader needs to be looking.*
   *
   * **Somebody published, and it reddened.** The sentence is kept here in full rather than deleted with
   * the assertion it described, because a guard that names in advance the event which will falsify it,
   * and is then falsified by exactly that event, is the best demonstration of this discipline the
   * repository can give - and it is worth more than the four lines it replaced.
   *
   * What stands here now is the inverse and it is not vacuous either: the eight bindings this tree
   * mints are anchored, so the fault lists above are computed over all of them.
   * `against-what-was-published/` is where they are computed against a real rebuild, and this is the
   * cheap half - a statement about the population, in memory, that a battery may replay sixty times
   * without spawning anything.
   */
  it('every-binding-anchors-a-commit-and-the-check-reaches-all-of-them :: the population is not empty', () => {
    const ledger = theLocalLedger()

    expect(unanchoredBindings(ledger)).toEqual([])
    expect(bindingsOf(ledger).size).toBeGreaterThan(0)
    expect(ledger.contracts.every((held) => held.publishedFrom !== THE_UNPUBLISHED_REVISION)).toBe(
      true,
    )
    expect(
      ledger.implementations.every((held) => held.publishedFrom !== THE_UNPUBLISHED_REVISION),
    ).toBe(true)
  })
})

/**
 * The other field of the pair a binding records, with the commit's date supplied rather than asked for.
 *
 * **The reader is a stub here for the reason it is a stub above.** Asking git is a process; the rule is
 * a comparison of two instants. What no guard in this file can establish is that the rule holds for
 * *this* catalogue at *this* commit - `against-what-was-published/` is where the real commits are asked,
 * and it is a suite of its own because it spawns.
 *
 * **What is being kept out is a class that survived two publications in silence.** The commit lived in
 * a map keyed by address and the instant lived one file over as a single constant, so the second and
 * third publications added a row to the map and left the constant answering for the first - and the
 * registry served *17 August* for bindings minted on the 20th and the 24th. Nothing was red: the field
 * is in no digest, no lockfile and no page. ADR-0177.
 */
describe('a binding is dated by the commit it names, and this is what says so', () => {
  /**
   * The claim of the unit. An instant that is not the commit's is the registry answering a question
   * about its own past with something nobody measured, on a field it declares bound-for-life.
   */
  it('a-binding-dated-by-something-other-than-its-own-commit-is-refused :: the instant is not the commit\'s', () => {
    const faults = misdatedBindings(
      ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT, '2026-08-17T00:00:00.000Z')),
      () => WHEN_A_COMMIT_WAS_AUTHORED,
    )

    expect(faults).toHaveLength(1)
    expect(faults[0]).toContain(renderContract(ADDRESS))
    expect(faults[0]).toContain('2026-08-17T00:00:00.000Z')
  })

  /**
   * And the green direction, which is the one that proves the comparison is about instants.
   *
   * The two sides are written in different offsets on purpose: git renders a commit date where it was
   * made and the registry serves UTC, so a rule comparing strings would refuse a correct pair. **The
   * spelling is deliberately not this rule's subject** - what is claimed is the moment.
   */
  it('a-binding-dated-by-its-own-commit-is-accepted-whatever-the-offset :: two spellings, one moment', () => {
    expect(
      misdatedBindings(
        ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT, THE_SAME_INSTANT)),
        () => WHEN_A_COMMIT_WAS_AUTHORED,
      ),
    ).toEqual([])
  })

  /**
   * A stand-in anchors nothing, so there is no commit to date it against and none is asked for.
   *
   * A reader that was never called is what proves it, rather than an empty fault list - which would
   * look the same if the rule did nothing at all. It is the same partition `isAnchored` draws for the
   * rebinding check, and it has to hold here too: every binding of a working tree is unanchored, so a
   * rule that asked anyway would spawn git on forty zeros on every run of the site's own build.
   */
  it('a-binding-that-names-no-commit-is-not-dated-against-one :: nothing to ask', () => {
    let asked = 0
    const authored = () => {
      asked += 1

      return WHEN_A_COMMIT_WAS_AUTHORED
    }

    expect(
      misdatedBindings(
        ledgerOf(
          entry(ADDRESS, AS_PUBLISHED, THE_UNPUBLISHED_REVISION, '2026-08-17T00:00:00.000Z'),
          entry(OTHER, AS_PUBLISHED, 'not-a-commit', '2026-08-17T00:00:00.000Z'),
        ),
        authored,
      ),
    ).toEqual([])
    expect(asked).toBe(0)
  })

  /**
   * A commit git cannot date is refused by name rather than compared against.
   *
   * The event this catches is a reader asking git for the wrong thing - `%aI` mistyped, or traded for
   * a format that renders a name - at which point every binding would disagree at once and the message
   * would be about six mismatched instants instead of about the one reader that stopped working.
   */
  it('a-commit-whose-date-cannot-be-read-is-refused :: an unreadable answer is not a mismatch', () => {
    const faults = misdatedBindings(
      ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT)),
      () => 'An Author Name',
    )

    expect(faults).toHaveLength(1)
    expect(faults[0]).toContain('which is not an instant')
  })

  /**
   * And an instant the registry serves that nobody can read is refused on its own side.
   *
   * It is the neighbour of the guard above and it is a different defect: that one is this repository
   * failing to ask git properly, and this one is what it would be serving to a reader. An unreadable
   * `publishedAt` is worse than an absent one, because it looks like an answer.
   */
  it('a-binding-serving-an-instant-nobody-can-read-is-refused :: it looks like an answer', () => {
    const faults = misdatedBindings(
      ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT, 'the day it was decided')),
      () => WHEN_A_COMMIT_WAS_AUTHORED,
    )

    expect(faults).toHaveLength(1)
    expect(faults[0]).toContain('is not an instant')
    expect(faults[0]).toContain('the day it was decided')
  })

  /**
   * The commit is asked once however many bindings share it, which is the cost this check has.
   *
   * A contract and its reference are published together, so every commit here dates two addresses -
   * and asking git is a spawn. It is the same claim `the-past-is-read-once-per-commit-…` makes one
   * screen up about a far more expensive reader, and it is worth making twice because the two
   * memoisations are two pieces of code.
   *
   * **The verdict is deliberately not asserted here.** It was, and a perturbation of the normalisation
   * one guard up reddened this one as well - which is a guard covering its neighbour's claim rather
   * than its own, and it says nothing on the day the two disagree. What is claimed here is the count.
   */
  it('the-commit-is-asked-once-however-many-bindings-share-it :: spawning is the cost', () => {
    let asked = 0
    const authored = () => {
      asked += 1

      return WHEN_A_COMMIT_WAS_AUTHORED
    }

    misdatedBindings(
      ledgerOf(entry(ADDRESS, AS_PUBLISHED, A_COMMIT), entry(OTHER, AS_PUBLISHED, A_COMMIT)),
      authored,
    )

    expect(asked).toBe(1)
  })
})

describe('what crosses a process boundary is input, and gets a schema', () => {
  it('a-rendered-set-of-bindings-reads-back-as-itself :: the wire format round-trips', () => {
    const bindings = bindingsOf(theLocalLedger())

    expect(readBindings(renderBindings(bindings))).toEqual(bindings)
  })

  it.each([
    ['typescript/number/parse@1', 'a binding is an address and a digest separated by one tab'],
    [`typescript/number/parse@1\tnot-a-digest`, 'not a sha-256 digest'],
    [`typescript/number/parse@1\t${AS_PUBLISHED}\textra`, 'separated by one tab'],
    [`\t${AS_PUBLISHED}`, 'a binding is an address'],
  ])('a-line-that-is-not-a-binding-is-refused-%# :: the past is read, never interpreted', (line, why) => {
    expect(() => readBindings(line)).toThrow(BindingsAreNotReadable)
    expect(() => readBindings(line)).toThrow(new RegExp(why))
  })

  /**
   * `renderImplementation` joins an id and a version with `@` and nothing in this schema refuses an id
   * carrying one, so two addresses can render alike. A map keyed by the rendering would lose one of
   * them, and the lost one is the one whose freeze stops being checked.
   */
  it('two-bindings-that-render-alike-are-a-corrupt-ledger :: a lookup that loses one checks neither', () => {
    const what = renderContract(ADDRESS)

    expect(() =>
      bindingsFrom([
        [what, AS_PUBLISHED],
        [what, AS_IT_STANDS],
      ]),
    ).toThrow(RenderingsCollide)
    expect(() => readBindings(`${what}\t${AS_PUBLISHED}\n${what}\t${AS_IT_STANDS}\n`)).toThrow(
      RenderingsCollide,
    )
  })
})
