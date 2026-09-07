import { describe, expect, it } from 'vitest'

import { theCatalogue } from '../packages/registry/the-catalogue.ts'
import { CENSUS, THE_CONTRACTS_SUITE } from './census.ts'
import { THE_BATTERIES } from './published.ts'

/**
 * Every contract of the catalogue is measured by something, and this is what says so. ADR-0250.
 *
 * ---------------------------------------------------------------------------
 * The event it exists for, which nothing here could see before
 * ---------------------------------------------------------------------------
 *
 * `vitest.config.ts` collects `contracts/**` and nothing else, and its own header says why: the
 * instrument runs that suite once per injected defect and reads its exit status as a verdict, so
 * anything collected in excess enters every one of those runs. **The mirror of that sentence had no
 * keeper.** A contract taken *out* of the glob - which is the one thing that would let a contributor
 * on a supported runtime run `npm test` green while a contract needing a runtime they have not got
 * sits in the tree - leaves the measurement silently, and every suite, every battery and every gate
 * stays green about it.
 *
 * That is the shape this repository refuses everywhere else: a population that shrinks with nothing
 * reporting it. `unaccountedFor` refuses it for guards, `every-served-field-is-classified` refuses it
 * for fields, and until this file nothing refused it for contracts.
 *
 * ---------------------------------------------------------------------------
 * Two independent statements, which is what makes it a comparison rather than a restatement
 * ---------------------------------------------------------------------------
 *
 * The catalogue declares what files a contract is made of; `census.ts` declares what each
 * configuration collects; `published.ts` declares which battery reads which configuration. Nothing
 * derives any of the three from the others, so the guards below are their disagreement - the shape
 * `visibility.test.ts` runs on for `publicContract` against `FIELD_MAP`, one folder over.
 *
 * **What is deliberately not asserted is a count.** `census.ts` argues at length why the per-file
 * integers are hand-written and not derived, and re-stating one here would be a second copy of an
 * integer that grows with the catalogue. What is asserted is that a file is *named*, which is the
 * claim that goes false when a contract leaves.
 */

const isATest = (name: string): boolean =>
  name.endsWith('.test.ts') || name.endsWith('.test-d.ts')

/** Every test file every contract of the catalogue declares, as the census would address it. */
const theContractsTestFiles = (): readonly string[] =>
  theCatalogue.flatMap((source) =>
    source.files.filter(isATest).map((name) => `${source.folder}/${name}`),
  )

const censusKeysNaming = (file: string): readonly string[] =>
  Object.entries(CENSUS)
    .filter(([, files]) => Object.keys(files).includes(file))
    .map(([key]) => key)

/** Which configuration each battery reads, a battery that names none reading the contracts' own. */
const theConfigurationsBatteriesRead = (): ReadonlySet<string> =>
  new Set(THE_BATTERIES.map((battery) => battery.vitestConfig ?? THE_CONTRACTS_SUITE))

describe('what answers for a contract', () => {
  /**
   * Every contract is collected by exactly one configuration, and a battery reads that configuration.
   *
   * **Both halves in one guard because they are one claim** - *this contract is measured* - and either
   * alone is satisfiable while it is false: a file named by no key has left the measurement, and a
   * file named by a key no battery reads is a configuration nothing runs. The second is the state a
   * contract would land in the day somebody gave it a configuration of its own and stopped there,
   * which is the likelier of the two mistakes rather than the exotic one.
   *
   * **Named in full rather than counted**, because the two faults are different defects wearing each
   * other's clothes and a count is satisfied by either.
   */
  it('every-contract-of-the-catalogue-is-collected-by-a-configuration-a-battery-reads', () => {
    const read = theConfigurationsBatteriesRead()

    const unmeasured = theContractsTestFiles().flatMap((file) => {
      const keys = censusKeysNaming(file)
      if (keys.length === 0) return [`${file}: no configuration collects it`]
      if (keys.length > 1) return [`${file}: ${keys.length} configurations collect it - ${keys.join(', ')}`]

      const [key] = keys

      return key !== undefined && read.has(key)
        ? []
        : [`${file}: collected by \`${key}\`, which no battery reads`]
    })

    expect(
      unmeasured,
      'a contract the instrument does not measure is one that left the measurement in silence. A ' +
        'contract needing a runtime this repository does not run on may leave `vitest.config.ts` - ' +
        'and when it does, something has to collect it and a battery has to read that something.',
    ).toEqual([])
  })

  /**
   * And the other direction, which is what stops the census from describing a catalogue that moved.
   *
   * A row naming a contract file nothing declares any more is a count nobody can reach, and it fails
   * open: `assertTheCensusHolds` reports `declared N, collected 0`, which reads as a suite that broke
   * rather than as a row that outlived its contract.
   */
  it('every-contract-file-the-census-names-is-one-the-catalogue-declares', () => {
    const declared = new Set(theContractsTestFiles())

    const stale = Object.entries(CENSUS).flatMap(([key, files]) =>
      Object.keys(files)
        .filter((file) => file.startsWith('contracts/') && !declared.has(file))
        .map((file) => `${file} in \`${key}\``),
    )

    expect(stale, 'a census row that outlived the contract it counts').toEqual([])
  })
})
