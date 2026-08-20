import { describe, expect, it } from 'vitest'

import { renderContract } from './address.js'
import { theLocalLedger } from './local-read-api.js'
import {
  BindingsAreNotReadable,
  RenderingsCollide,
  bindingsFrom,
  bindingsOf,
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
const ANOTHER_COMMIT = 'b'.repeat(40)

const AS_PUBLISHED = 'c'.repeat(64)
const AS_IT_STANDS = 'd'.repeat(64)

const PUBLISHED: ContractStanding = { lifecycle: { state: 'published' } }

const entry = (
  address: typeof ADDRESS,
  digest: string,
  publishedFrom: string,
): PublishedContract => ({
  address,
  digest,
  publishedAt: '2026-08-16T00:00:00.000Z',
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
