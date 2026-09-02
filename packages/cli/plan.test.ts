import { describe, it, expect } from 'vitest'

import { HOLDINGS, IMAGINED_VERSION, clamp, pad, round, sign } from '../registry/imagined-graph.js'
import type { ImplementationRecord } from '../registry/implementation-record.js'
import { resolveDependencies } from '../registry/implementation-record.js'
import type { FrozenImplementation } from '../registry/snapshot.js'
import { implementationSnapshot } from '../registry/snapshot.js'
import { THE_ENTRY_FILE, planInstall } from './plan.js'

/**
 * Where every file lands, decided before a byte is written.
 *
 * These guards run on the imagined graph and could not run on the catalogue: none of the five contracts
 * depends on anything, so recursive resolution and deduplication - the two mechanisms the distribution
 * model is *for* - have no case in the catalogue at all. Shipping them measured only against the five
 * would be shipping two decorative guards in the unit that proves the model.
 *
 * The plan is built from `FrozenImplementation`s, which is what an installer actually holds: a snapshot
 * is a projection with no standing in it, and a plan that needed a whole record would need an installer
 * to invent a status, a tag list and a benchmark it was never given.
 */

const frozen = (record: ImplementationRecord): FrozenImplementation => {
  const snapshot = implementationSnapshot(record)
  if (snapshot.unit !== 'implementation') throw new Error('an implementation snapshot is not one')

  return snapshot.frozen
}

const graph = HOLDINGS.map(frozen)

const installOrder = (): readonly FrozenImplementation[] => [
  ...resolveDependencies(frozen(round), graph),
  frozen(round),
]

const planned = () => {
  const result = planInstall(installOrder())
  if ('faults' in result) throw new Error(result.faults.join('\n'))

  return result.plan
}

describe('where every file lands', () => {
  /**
   * The registry decides both halves of a destination - the contract's name and the file's path - so
   * the plan is where a served answer stops being able to name a place of its own choosing.
   */
  it('a-served-path-that-leaves-the-directory-is-refused-by-the-plan', () => {
    const hostile = frozen({
      ...pad,
      files: [{ path: '../../../../elsewhere.ts', sha256: 'c'.repeat(64), bytes: 1 }],
    })

    const result = planInstall([hostile])

    expect('faults' in result && result.faults.length).toBe(1)
    expect('faults' in result && result.faults[0]).toContain('elsewhere.ts')
  })

  /**
   * The entry file is named after the feature and not after what it was in our catalogue. `reference`
   * says what the file was to us; in the user's editor every installed feature would otherwise open a
   * tab called `reference.ts`.
   */
  it('an-entry-file-is-named-after-its-feature', () => {
    expect(planned().files.map((file) => file.path)).toEqual([
      'imagined-string/pad.ts',
      'imagined-string/pad/digits.ts',
      'imagined-number/clamp.ts',
      'imagined-string/pad/digits.ts',
      'imagined-number/sign.ts',
      'imagined-number/round.ts',
    ])
  })

  /**
   * The dedup that matters, and the one a depth could not have expressed: `digits.ts` is carried by two
   * implementations, under a path that is the same in both folders, and is written once.
   *
   * It stays in the plan with `written: false` rather than being filtered out, because the *other*
   * carrier's imports still have to be pointed at where it went - and the file holding those imports is
   * written.
   */
  it('a-shared-file-is-written-once-and-still-appears-in-the-plan', () => {
    const digits = planned().files.filter((file) => file.path === 'imagined-string/pad/digits.ts')

    expect(digits.map((file) => file.servedAt)).toEqual([
      'imagined-string/pad/digits.ts',
      'imagined-number/clamp/digits.ts',
    ])
    expect(digits.map((file) => file.written)).toEqual([true, false])
  })

  /**
   * A feature's entry file is its identity, so it is never collapsed into another feature's - even when
   * the two answer byte for byte. Dropping one would leave a folder with no file named after it and an
   * import of that feature pointing into somebody else's folder.
   */
  it('an-entry-file-is-never-deduplicated', () => {
    const twins = [pad, sign].map((record) => ({
      ...record,
      files: record.files.map((file) => ({ ...file, sha256: 'the-same-digest-for-both-of-them' })),
    }))

    const result = planInstall(twins.map(frozen))
    if ('faults' in result) throw new Error(result.faults.join('\n'))

    expect(result.plan.files.filter((file) => file.written).map((file) => file.path)).toEqual([
      'imagined-string/pad.ts',
      'imagined-string/pad/digits.ts',
      'imagined-number/sign.ts',
    ])
  })

  /**
   * Two dependents published against two versions of one feature is a graph a real catalogue will
   * eventually hold, and both addresses resolve because they *are* two artefacts. What cannot happen is
   * both landing: one feature lands in one place, so the second write would overwrite the first and whichever
   * dependent asked for it would silently get the other one's code.
   */
  it('two-versions-of-one-feature-are-refused', () => {
    const newer: ImplementationRecord = { ...pad, version: '1.0.1' }
    const result = planInstall([frozen(pad), frozen(newer), frozen(clamp)])

    expect('faults' in result && result.faults).toEqual([
      `typescript/imagined-string/pad@1 is asked for at two versions in one install - typescript/imagined-string/pad@1/reference@${IMAGINED_VERSION} ` +
        `and typescript/imagined-string/pad@1/reference@1.0.1. One feature lands in one place, so the second ` +
        `would overwrite the first and whichever dependent asked for it would silently get the other ` +
        `one's code.`,
    ])
  })

  /**
   * The other collision, and ADR-0110 changed which case reaches it. Two majors of one feature are two
   * contracts - `seenContracts` is keyed on the rendering, which carries the major - and the path
   * deliberately is not, so both entry files want `imagined-string/pad.ts`. `name@2` beside `name@1` is
   * permanent rule 6's own repair, which makes this the collision the design actually admits.
   *
   * **The case this fixture used to carry is unreachable now and was not replaced by a contrivance.**
   * It was one implementation carrying a file named after its own feature beside the entry file the
   * installer renamed to that name. Under the flat entry the two can no longer meet: an entry lands at
   * `<domain>/<name>.ts` and any other file of that feature at `<domain>/<name>/<file>.ts`, which is a
   * segment longer whatever it is called.
   */
  it('two-different-files-on-one-destination-are-refused', () => {
    // Only the entry file's digest moves. A second major really would differ throughout, but a
    // differing `digits.ts` collides on its own and would make this guard report two faults about two
    // files - and the subject here is the entry, which is the one the layout decides the path of.
    const asTwo: ImplementationRecord = {
      ...pad,
      contract: { ...pad.contract, major: 2 },
      files: pad.files.map((file) =>
        file.path === THE_ENTRY_FILE ? { ...file, sha256: `${file.sha256}-of-the-second-major` } : file,
      ),
    }

    const result = planInstall([frozen(pad), frozen(asTwo)])

    expect('faults' in result && result.faults).toEqual([
      'two different files would both be written to imagined-string/pad.ts: the one served as ' +
        'imagined-string/pad/reference.ts and another with a different digest. An install that overwrote one ' +
        'with the other would leave the project holding code no lockfile describes.',
    ])
  })

  /**
   * The order is the resolution's and this must not re-sort it: it is what decides which carrier of a
   * shared blob keeps it, and an installer with a second opinion about the order would be deciding that
   * twice.
   */
  it('the-plan-is-in-the-resolutions-order', () => {
    expect(planned().features.map((feature) => feature.implementation.contract.name)).toEqual([
      'imagined-string/pad',
      'imagined-number/clamp',
      'imagined-number/sign',
      'imagined-number/round',
    ])
  })
})
