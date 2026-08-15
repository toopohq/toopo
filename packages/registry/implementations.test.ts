import { describe, it, expect } from 'vitest'

import { renderContract, sameContract } from './address.js'
import type { LockedFeature, Lockfile } from './implementation-record.js'
import { LOCKFILE_VERSION, dependencyDepthOf } from './implementation-record.js'
import { THE_UNPUBLISHED_REVISION } from './revision.js'
import { REPOSITORY_ROOT, referenceImplementationOf, serialiseContract } from './serialise.js'
import { eachContract, theFive } from './the-five.js'

/**
 * The implementation half of the schema, filled from the only implementations that exist.
 *
 * Every contract of the catalogue has exactly one today - its own reference - and the list is still a
 * list. The founder writes everything and the launch is closed, so nothing here is exercised by
 * competition; what the guards below establish is that the fields an open registry needs are filled
 * from something real rather than described in a comment. A type with no instance is prose.
 *
 * The lockfile is checked as a *projection* rather than as a second vocabulary. Every part of it is
 * already an address or a digest the registry holds, which is what stops the CLI from having to
 * invent a way to name an implementation - and stops the two from drifting the first time either
 * changes.
 */

/**
 * The lockfile entry an install of this implementation would write, if nothing were rewritten on the
 * way in - which is true of all five, none of which depends on anything.
 *
 * `path` and `served.path` coincide here and are two fields for a reason: an installer that renames a
 * file or points an import at a shared copy makes them differ, and `packages/cli/` is where that happens.
 */
const lockedFeatureOf = (
  implementation: ReturnType<typeof referenceImplementationOf>,
  version: string,
  installedAt: string,
): LockedFeature => ({
  contract: implementation.contract,
  implementation: { id: implementation.id, version },
  files: implementation.files.map((file) => ({
    path: file.path,
    served: file,
    sha256: file.sha256,
    bytes: file.bytes,
  })),
  installedAt,
  locallyModified: false,
  askedFor: true,
  servedFrom: THE_UNPUBLISHED_REVISION,
})

describe('the implementations under the five contracts', () => {
  it.each(eachContract)(
    'the-reference-files-are-the-declared-ones-and-are-hashed-%s',
    (_name, source) => {
      const implementation = referenceImplementationOf(REPOSITORY_ROOT, source)

      expect(implementation.files.map((file) => file.path)).toEqual(['reference.ts'])
      expect(implementation.files[0]?.sha256).toMatch(/^[0-9a-f]{64}$/)
      expect(implementation.files[0]?.bytes).toBeGreaterThan(0)
    },
  )

  it.each(eachContract)(
    'the-implementation-belongs-to-its-contract-%s',
    (_name, source) => {
      const implementation = referenceImplementationOf(REPOSITORY_ROOT, source)

      expect(sameContract(implementation.contract, source.address)).toBe(true)
    },
  )

  /**
   * Permanent rule 2 forbids an external dependency inside a feature, so this is a fact a reader can
   * check rather than a promise. A submission that is not zero is refused by a rule and not by taste.
   *
   * The edges and the depth are both asserted, and the depth is the *derived* one: a record that
   * carried its own depth could disagree with its own edges, which is the reason the field was
   * replaced. Here the two cannot disagree, so what the second line adds is that the derivation
   * answers zero on an empty graph rather than throwing on it.
   */
  it('every-reference-has-no-dependencies :: permanent rule 2, as edges and as a number', () => {
    const implementations = theFive.map((source) =>
      referenceImplementationOf(REPOSITORY_ROOT, source),
    )

    expect(implementations.map((entry) => entry.dependsOn)).toEqual([[], [], [], [], []])
    expect(implementations.map((entry) => dependencyDepthOf(entry, implementations))).toEqual([
      0, 0, 0, 0, 0,
    ])
  })

  /**
   * The two figures nothing has measured, asserted as absent rather than left to be assumed present.
   * A minified size needs a minifier the repository does not have, and a benchmark needs a reference
   * machine that does not exist - so the honest record says so, and this guard reddens the day either
   * one is quietly filled with a number nobody produced.
   */
  it('nothing-is-measured-yet :: no minified size, no benchmark figure, no version', () => {
    const implementations = theFive.map((source) =>
      referenceImplementationOf(REPOSITORY_ROOT, source),
    )

    expect(implementations.filter((entry) => entry.minifiedBytes !== null)).toEqual([])
    expect(implementations.flatMap((entry) => entry.benchmarks)).toEqual([])
    expect(implementations.filter((entry) => entry.version !== null)).toEqual([])
  })

  /**
   * The digest the lockfile compares against is the digest the record serves, byte for byte. If these
   * two ever came from different reads, "never update user code silently" would be a promise the CLI
   * could not keep.
   */
  it.each(eachContract)(
    'the-lockfile-holds-what-the-registry-served-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const implementation = referenceImplementationOf(REPOSITORY_ROOT, source)
      const locked = lockedFeatureOf(implementation, '1.0.0', '2026-08-03T00:00:00.000Z')

      const inTheHarness = record.harness.find((file) => file.path === 'reference.ts')

      expect(locked.files.map((file) => file.served)).toEqual([inTheHarness])
      expect(renderContract(locked.contract)).toBe(renderContract(record.address))
    },
  )

  it('a-lockfile-is-json :: it lives on the user disk and nothing decodes it', () => {
    const lockfile: Lockfile = {
      version: LOCKFILE_VERSION,
      features: theFive.map((source) =>
        lockedFeatureOf(
          referenceImplementationOf(REPOSITORY_ROOT, source),
          '1.0.0',
          '2026-08-03T00:00:00.000Z',
        ),
      ),
    }

    // Plain JSON on purpose, and it is the one thing in this schema that has to be: `toopo.lock` is
    // read by a person deciding whether to accept a diff, so it may not carry a tagged encoding.
    expect(JSON.parse(JSON.stringify(lockfile))).toEqual(lockfile)
  })
})
