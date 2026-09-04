/**
 * What the pre-flight is held to.
 *
 * Every guard here is about one of two things: that a fault a replay would refuse on is reported, and
 * that a question this reading cannot ask is never answered as though it had been. The second half is
 * the one the module exists for - ADR-0212's predictor implemented two of the three refusals and
 * reported *nought faults*, which is the shape of a healthy battery, and the replay then refused at
 * the end of forty-two minutes.
 *
 * The battery below is built by hand rather than taken from `THE_BATTERIES`, because every guard here
 * needs to move one declaration and hold the rest still. A real battery would make each of them a
 * statement about that contract as well.
 */

import { describe, expect, it } from 'vitest'

import type { StoredMeasurement } from './attribution.ts'
import {
  EXIT,
  exitCodeFor,
  predictionFor,
  renderPrediction,
  whyAMeasurementIsUnreadable,
} from './prediction.ts'
import type { Battery, GuardIdentity, Mutant, RunResult } from './run.ts'

const guard = (id: string): GuardIdentity => ({
  id,
  title: id,
  suite: 'a suite',
  file: 'toy/toy.test.ts',
})

const THE_GUARDS: readonly GuardIdentity[] = [guard('a-loud-guard'), guard('a-silent-guard')]

const THE_MUTANT: Mutant = {
  id: 'T-01',
  kind: 'defect',
  description: 'a toy defect',
  arms: { A: [{ file: 'reference.ts', find: 'a', replace: 'b' }] },
  expected: { 'A/as-committed': { verdict: 'killed', by: ['a-loud-guard'] } },
}

const pinnedAt = (expected: Mutant['expected']): Mutant => ({ ...THE_MUTANT, expected })

const aBattery = (over: Partial<Battery> = {}): Battery => ({
  name: 'toy',
  contractPath: 'toy',
  timeZone: 'UTC',
  calibrationMutant: 'T-01',
  arms: [{ id: 'A', ref: 'HEAD', convention: 'as committed' }],
  lenses: [
    { id: 'as-committed', description: 'the contract as committed', arms: ['A'], edits: [] },
  ],
  mutants: [THE_MUTANT],
  unreachableGuards: [],
  unprobedRegions: [
    { nature: 'claims detection', guards: ['a-silent-guard'], reason: 'no mutant reaches it' },
  ],
  ...over,
})

const aMeasurement = (over: Partial<StoredMeasurement> = {}): StoredMeasurement => ({
  results: [
    {
      mutant: 'T-01',
      arm: 'A',
      lens: 'as-committed',
      verdict: 'killed',
      failedGuards: ['a-loud-guard'],
      expected: { verdict: 'killed', by: ['a-loud-guard'] },
      agrees: true,
    } satisfies RunResult,
  ],
  guards: { 'A/as-committed': THE_GUARDS },
  platform: 'posix',
  ...over,
})

describe('what a replay would refuse on, read before paying for one', () => {
  /**
   * A battery that agrees with its own measurement predicts nothing **and says so**.
   *
   * The four empty fields are what every guard below perturbs one at a time; the sentence is what
   * only this guard claims, and it is why the guard can be red alone. It is not decoration: a reader
   * who is shown nothing cannot tell a clean reading from a reading that printed nothing, and this
   * whole module exists because those two look alike.
   */
  it('a-battery-that-agrees-with-its-own-measurement-predicts-nothing-and-says-so', () => {
    const prediction = predictionFor(aBattery(), aMeasurement(), 'posix')

    expect(prediction.faults).toEqual([])
    expect(prediction.unread).toEqual([])
    expect(prediction.notCovered).toEqual([])
    expect(prediction.stale).toEqual([])
    expect(renderPrediction(prediction)).toContain('every cell of this measurement agrees')
  })

  /**
   * The first of the three refusals: a pin that names a guard the measurement does not show reddening.
   *
   * It reads today's pin and never the one the measurement stored, which is the whole reason a
   * pre-flight can say anything at all - a reading built on the stored expectation agrees with itself
   * for ever. Seen red by pointing `by` at the guard that was silent.
   */
  it('a-pin-naming-a-guard-the-measurement-does-not-redden-is-a-fault', () => {
    const battery = aBattery({
      mutants: [pinnedAt({ 'A/as-committed': { verdict: 'killed', by: ['a-silent-guard'] } })],
    })

    const prediction = predictionFor(battery, aMeasurement(), 'posix')

    expect(prediction.faults).toHaveLength(1)
    expect(prediction.faults[0]).toContain('a-silent-guard')
  })

  /** The same refusal reached by the verdict rather than by the guards it names. */
  it('a-pin-whose-verdict-the-measurement-contradicts-is-a-fault', () => {
    const battery = aBattery({
      mutants: [pinnedAt({ 'A/as-committed': { verdict: 'survived' } })],
    })

    expect(predictionFor(battery, aMeasurement(), 'posix').faults).toHaveLength(1)
  })

  /**
   * The second refusal: a declaration of silence that a measured red contradicts.
   *
   * Seen red by declaring the guard that does redden. This is a declaration going stale, which is the
   * commonest way a battery module drifts away from the tree beneath it.
   */
  it('a-guard-reddening-where-the-battery-declares-silence-is-a-fault', () => {
    const battery = aBattery({
      unprobedRegions: [
        { nature: 'claims detection', guards: ['a-loud-guard'], reason: 'no mutant reaches it' },
      ],
    })

    const faults = predictionFor(battery, aMeasurement(), 'posix').faults

    expect(faults.some((fault) => fault.includes('a-loud-guard'))).toBe(true)
  })

  /**
   * The third refusal, and the one ADR-0212's predictor did not implement: a guard nothing reddens
   * that no declaration accounts for.
   *
   * Seen red by taking the region away, which is the state `409ab48` was really in.
   */
  it('a-guard-nothing-reddens-and-nothing-accounts-for-is-a-fault', () => {
    const battery = aBattery({ unprobedRegions: [] })

    const faults = predictionFor(battery, aMeasurement(), 'posix').faults

    expect(faults.some((fault) => fault.includes('a-silent-guard'))).toBe(true)
  })
})

describe('a question this reading cannot ask is never answered', () => {
  /**
   * **The guard this module exists inside.** `attributionOf` answers an empty attribution for a column
   * it has no guard list for, and an empty attribution yields no disagreement - so a measurement
   * written before guard identities were stored would report *no faults*, which is byte for byte what
   * a healthy battery reports.
   *
   * Seen red by defaulting the guard list to `[]` instead of refusing: the prediction then comes back
   * clean and this guard is the only thing that says otherwise.
   */
  it('a-measurement-with-no-guard-identities-is-unread-and-never-clean', () => {
    const { guards: _dropped, ...withoutGuards } = aMeasurement()

    const prediction = predictionFor(aBattery({ unprobedRegions: [] }), withoutGuards, 'posix')

    expect(prediction.faults).toEqual([])
    expect(prediction.unread).toHaveLength(1)
    expect(prediction.unread[0]).toContain('npm run battery')
  })

  /** The same hole one floor down: some columns carry a guard list and one does not. */
  it('a-column-with-no-guard-list-is-unread-even-beside-columns-that-have-one', () => {
    const prediction = predictionFor(
      aBattery({ unprobedRegions: [] }),
      aMeasurement({ guards: { 'B/another-lens': THE_GUARDS } }),
      'posix',
    )

    expect(prediction.faults).toEqual([])
    expect(prediction.unread).toHaveLength(1)
    expect(prediction.unread[0]).toContain('A/as-committed')
  })

  /**
   * A measurement taken on the other platform family cannot judge a pin that names one, so it is not
   * judged at all. Seen red by reading a posix measurement as though it were this machine's.
   */
  it('a-measurement-taken-on-another-platform-is-unread', () => {
    const prediction = predictionFor(aBattery(), aMeasurement({ platform: 'posix' }), 'windows')

    expect(prediction.faults).toEqual([])
    expect(prediction.unread).toHaveLength(1)
    expect(prediction.unread[0]).toContain('posix')
  })

  /**
   * File content is checked rather than trusted, and the refusal says what it could not read - a
   * reading that declines without a reason is the silence this module replaces.
   */
  it('a-measurement-that-is-not-a-measurement-is-named-rather-than-parsed', () => {
    expect(whyAMeasurementIsUnreadable(aMeasurement())).toBeNull()
    expect(whyAMeasurementIsUnreadable(null)).toBe('it is not an object')
    expect(whyAMeasurementIsUnreadable({})).toBe('it carries no `results` array')
    expect(whyAMeasurementIsUnreadable({ results: [] })).toBe('it carries no cell at all')
    expect(whyAMeasurementIsUnreadable({ results: [{ mutant: 'T-01' }] })).toBe(
      'cell 0 is not a measured cell',
    )
  })

  /**
   * A reading that was taken and found nothing is not a reading that could not be taken, and the exit
   * code is what carries that outwards.
   *
   * **Its predictions are written out rather than produced**, and that is a choice rather than a
   * convenience. Built through `predictionFor`, this guard leaned on whichever mechanism it used to
   * manufacture a fault, so a defect in *that* mechanism reddened this guard as well as the one whose
   * claim it is - measured twice, on the third refusal and then on the pin. Its subject is the code,
   * not how a fault arises, so it is handed the three shapes directly.
   */
  it('a-reading-that-could-not-be-taken-exits-differently-from-one-that-found-nothing', () => {
    const nothing = { battery: 'toy', notCovered: [], stale: [] }
    const clean = { ...nothing, faults: [], unread: [] }
    const unread = { ...nothing, faults: [], unread: ['a question nobody could ask'] }
    const faulty = { ...nothing, faults: ['a fault a replay would refuse on'], unread: [] }

    expect(exitCodeFor([clean])).toBe(EXIT.agreed)
    expect(exitCodeFor([unread])).toBe(EXIT.unread)
    expect(exitCodeFor([faulty])).toBe(EXIT.faults)
    expect(exitCodeFor([unread, faulty])).toBe(EXIT.faults)
    expect(exitCodeFor([clean, unread])).toBe(EXIT.unread)
  })
})

describe('what a stored measurement does not cover', () => {
  /**
   * A cell the battery declares that the measurement does not hold is named and never judged. Without
   * it, a battery that gained a mutant would report a coverage it does not have - the reading would be
   * exactly as clean as one that had checked everything.
   */
  it('a-cell-the-measurement-does-not-hold-is-named-and-never-judged', () => {
    const battery = aBattery({
      mutants: [THE_MUTANT, { ...THE_MUTANT, id: 'T-02', description: 'a second toy defect' }],
    })

    const prediction = predictionFor(battery, aMeasurement(), 'posix')

    expect(prediction.notCovered).toEqual(['T-02 on A/as-committed'])
    expect(prediction.faults).toEqual([])
  })

  /** The other direction: a measurement holding a cell this battery no longer declares. */
  it('a-cell-the-battery-no-longer-declares-is-named', () => {
    const measurement = aMeasurement({
      results: [
        ...aMeasurement().results,
        {
          mutant: 'T-99',
          arm: 'A',
          lens: 'as-committed',
          verdict: 'killed',
          failedGuards: ['a-loud-guard'],
          expected: { verdict: 'killed' },
          agrees: true,
        } satisfies RunResult,
      ],
    })

    const prediction = predictionFor(aBattery(), measurement, 'posix')

    expect(prediction.stale).toEqual(['T-99 on A/as-committed'])
    expect(prediction.faults).toEqual([])
  })
})
