import { describe, it, expect } from 'vitest'

import { REPOSITORY_ROOT, UndeclaredHarness, harnessOf } from './serialise.js'
import { eachContract } from './the-catalogue.js'

/**
 * A contract is made of exactly the files it declares, and nothing else is served.
 *
 * These guards sit apart from `against-the-catalogue.test.ts` because they answer a different question.
 * That file asks whether a record can drift from the contract it describes; this one asks what an
 * installation receives, which is a property of the storage rather than of the schema - and the
 * battery that probes it is `registry-storage`, not a schema battery that does not exist yet.
 *
 * The guard these replace asked only that the seven expected files were *present*, and that half is
 * now unfalsifiable: `harnessOf` refuses a folder that does not match its list, so a test asserting
 * the match would compare the list against itself. What is worth asserting is the refusal.
 */

describe('the files a contract is made of', () => {
  /**
   * A file nobody declared is a file that would be shipped to every installation. Measured before the
   * list was closed: two `.js` files emitted beside the sources entered every contract's harness with
   * their digests and the whole suite stayed green.
   */
  it.each(eachContract)('an-undeclared-file-is-refused-%s', (_name, source) => {
    expect(() => harnessOf(REPOSITORY_ROOT, source.folder, source.files.slice(1))).toThrow(
      UndeclaredHarness,
    )
  })

  /** The other side, and a different mistake: a contract missing a piece of itself. */
  it.each(eachContract)('a-declared-file-that-is-gone-is-refused-%s', (_name, source) => {
    expect(() =>
      harnessOf(REPOSITORY_ROOT, source.folder, [...source.files, 'nothing-is-here.ts']),
    ).toThrow(UndeclaredHarness)
  })
})
