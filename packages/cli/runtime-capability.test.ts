import { describe, expect, it } from 'vitest'

import type { RegistrySource } from './source.js'
import { deciding } from './fixpoint.js'
import { imaginedSource } from './imagined-source.js'
import { prepareInstallation } from './install.js'
import {
  A_RUNTIME_CARRYING_NOTHING,
  THE_READING_FOR,
  theRuntimeRefuses,
  whatARuntimeCarries,
} from './runtime-capability.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE } from './temporary-project.js'

/**
 * The half of ADR-0249 that a reader meets: a contract requiring something this runtime has not got.
 *
 * The registry refuses a word it cannot state; this refuses a runtime that cannot answer for one. The
 * two are the reason the field is not `environments` written twice - that one is read by nothing to
 * decide anything, and these are what stop this one landing in the same state.
 */

/** The nine own names the specification settled, which is what a runtime carrying the language has. */
const AS_THE_LANGUAGE_PUBLISHED_IT = {
  Temporal: Object.fromEntries(
    ['Duration', 'Instant', 'Now', 'PlainDate', 'PlainDateTime', 'PlainMonthDay', 'PlainTime',
      'PlainYearMonth', 'ZonedDateTime'].map((name) => [name, {}]),
  ),
}

/**
 * The eleven names node v24.15.0 answers under `--harmony-temporal`, measured at `7fcd444`.
 *
 * `Calendar` and `TimeZone` are the two the erratum removed, and their presence is the whole reason
 * this reading is a shape rather than a `typeof`.
 */
const AS_A_FLAG_STILL_SERVES_IT = {
  Temporal: {
    ...AS_THE_LANGUAGE_PUBLISHED_IT.Temporal,
    Calendar: {},
    TimeZone: {},
  },
}

/** The imagined registry, with every contract of it requiring a capability nothing here carries. */
const requiringTemporal = (): RegistrySource => {
  const base = imaginedSource()

  return {
    ...base,
    contractIndex: async () => {
      const index = await base.contractIndex()

      return {
        ...index,
        entries: index.entries.map((entry) => ({
          ...entry,
          requiresOfTheRuntime: ['temporal'] as const,
        })),
      }
    },
  }
}

describe('a contract that needs something of the runtime', () => {
  /**
   * A runtime serving the draft is not a runtime carrying the language, and the reading says so.
   *
   * **This is what a version could not express.** The two hosts below are one node version a flag
   * apart - measured at `7fcd444`, v24.15.0 answers `undefined` plain and an eleven-name object under
   * `--harmony-temporal` - so any rule written over a version range answers the same thing for both
   * and is wrong for one of them.
   */
  it('a-runtime-serving-the-withdrawn-names-does-not-carry-temporal :: presence is not the reading', () => {
    expect(THE_READING_FOR.temporal(AS_THE_LANGUAGE_PUBLISHED_IT)).toBe(true)
    expect(THE_READING_FOR.temporal(AS_A_FLAG_STILL_SERVES_IT)).toBe(false)
    expect(THE_READING_FOR.temporal({})).toBe(false)
    expect(THE_READING_FOR.temporal({ Temporal: 'a string' })).toBe(false)

    expect([...whatARuntimeCarries(AS_THE_LANGUAGE_PUBLISHED_IT)]).toEqual(['temporal'])
    expect([...whatARuntimeCarries(AS_A_FLAG_STILL_SERVES_IT)]).toEqual([])
  })

  /**
   * And the installer reads the field rather than carrying it, which is the whole unit.
   *
   * **The refusal is asserted through `prepareInstallation` and not only on the pure function**,
   * because what would make this field a second `environments` is precisely that nothing calls it.
   * Nothing is fetched and nothing is written: the refusal is the first thing after the contract is
   * resolved, so the root below never has to exist.
   */
  it('an-install-is-refused-when-this-runtime-lacks-what-a-contract-requires :: and nothing is written', async () => {
    const outcome = (
      await deciding(requiringTemporal(), (held) =>
        prepareInstallation(held, {
          carries: A_RUNTIME_CARRYING_NOTHING,
          root: 'a-project-this-guard-never-reaches',
          configuration: { version: 1, directory: 'src/lib/toopo' },
          lockfile: EMPTY_LOCKFILE,
          contract: 'imagined-number/round',
          implementation: null,
          at: A_PINNED_INSTANT,
        }),
      )
    ).answer

    expect('faults' in outcome).toBe(true)
    const said = 'faults' in outcome ? outcome.faults.join('\n') : ''
    expect(said).toContain('temporal')
    expect(said).toContain('imagined-number/round')

    // The same runtime carrying it installs, so the refusal is about the capability and not the fixture.
    expect(theRuntimeRefuses('x', ['temporal'], whatARuntimeCarries(AS_THE_LANGUAGE_PUBLISHED_IT))).toEqual(
      [],
    )
  })
})
