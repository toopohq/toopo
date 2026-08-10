import { describe, it, expect } from 'vitest'

import { HOLDINGS, IMAGINED_VERSION, clamp, pad, round, sign } from '../registry/imagined-graph.js'
import type { ImplementationRecord } from '../registry/implementation-record.js'
import { resolveDependencies } from '../registry/implementation-record.js'
import type { FrozenImplementation } from '../registry/snapshot.js'
import { implementationSnapshot } from '../registry/snapshot.js'
import { planInstall } from './plan.js'

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
   * The entry file is named after the feature and not after what it was in our catalogue. `reference`
   * says what the file was to us; in the user's editor every installed feature would otherwise open a
   * tab called `reference.ts`.
   */
  it('an-entry-file-is-named-after-its-feature', () => {
    expect(planned().files.map((file) => file.path)).toEqual([
      'string/pad/pad.ts',
      'string/pad/digits.ts',
      'number/clamp/clamp.ts',
      'string/pad/digits.ts',
      'number/sign/sign.ts',
      'number/round/round.ts',
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
    const digits = planned().files.filter((file) => file.path === 'string/pad/digits.ts')

    expect(digits.map((file) => file.servedAt)).toEqual([
      'string/pad/digits.ts',
      'number/clamp/digits.ts',
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
      'string/pad/pad.ts',
      'string/pad/digits.ts',
      'number/sign/sign.ts',
    ])
  })

  /**
   * Two dependents published against two versions of one feature is a graph a real catalogue will
   * eventually hold, and both addresses resolve because they *are* two artefacts. What cannot happen is
   * both landing: one feature is one folder, so the second write would overwrite the first and whichever
   * dependent asked for it would silently get the other one's code.
   */
  it('two-versions-of-one-feature-are-refused', () => {
    const newer: ImplementationRecord = { ...pad, version: '1.0.1' }
    const result = planInstall([frozen(pad), frozen(newer), frozen(clamp)])

    expect('faults' in result && result.faults).toEqual([
      `typescript/string/pad@1 is asked for at two versions in one install - typescript/string/pad@1/reference@${IMAGINED_VERSION} ` +
        `and typescript/string/pad@1/reference@1.0.1. One feature is one folder, so the second would overwrite ` +
        `the first and whichever dependent asked for it would silently get the other one's code.`,
    ])
  })

  /**
   * The other collision, one level down: two different files of one feature that would land on one
   * path. It is reachable the day an implementation carries a file named after its own feature beside
   * the entry file the installer renames to that name.
   */
  it('two-different-files-on-one-destination-are-refused', () => {
    const collides: ImplementationRecord = {
      ...pad,
      files: [
        ...pad.files,
        { path: 'pad.ts', sha256: 'a-digest-that-is-not-the-entry-files', bytes: 12 },
      ],
    }

    const result = planInstall([frozen(collides)])

    expect('faults' in result && result.faults).toEqual([
      'two different files would both be written to string/pad/pad.ts: the one served as ' +
        'string/pad/pad.ts and another with a different digest. An install that overwrote one with ' +
        'the other would leave the project holding code no lockfile describes.',
    ])
  })

  /**
   * The order is the resolution's and this must not re-sort it: it is what decides which carrier of a
   * shared blob keeps it, and an installer with a second opinion about the order would be deciding that
   * twice.
   */
  it('the-plan-is-in-the-resolutions-order', () => {
    expect(planned().features.map((feature) => feature.implementation.contract.name)).toEqual([
      'string/pad',
      'number/clamp',
      'number/sign',
      'number/round',
    ])
  })
})
