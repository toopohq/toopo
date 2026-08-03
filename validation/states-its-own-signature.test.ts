import { describe, it, expect } from 'vitest'
import { join } from 'node:path'

import { readSources } from './source.js'
import { OWN_SIGNATURE_RULE, importsItsOwnContract } from './states-its-own-signature.js'

/**
 * The rule the catalogue has carried since its first contract and that nothing enforced.
 *
 * `referenceImplementationRules` in `catalogue/every-contract.ts` states it with its reason and is
 * imported by nothing executable - one of the three declarations the sweep of this unit found in that
 * state. This is the guard that changes that.
 */
const FIXTURES = join(import.meta.dirname, 'fixtures')
const FIXTURE_PROJECT = join(FIXTURES, 'tsconfig.json')

const ANALYSIS_TIMEOUT_MS = 15_000

const analyse = (file: string): readonly string[] =>
  readSources({ project: FIXTURE_PROJECT, files: [join(FIXTURES, file)] }, (sources) =>
    importsItsOwnContract(sources[0]!).map((finding) => `${finding.rule} ${finding.quoted}`),
  )

describe('an implementation states its own signature', () => {
  /**
   * The submission runs correctly and its whole suite is green. What it has done is make
   * `signature.test-d.ts` unable to fail, and `verbatimModuleSyntax` erases the import entirely - so
   * there is nothing left at run time for anything to observe. Only a reader of the source can see
   * it, which is the whole argument for stage 1 existing before anything is executed.
   */
  it(
    'a-type-imported-from-the-contract-is-refused',
    () => {
      expect(analyse('imports-its-contract.ts')).toEqual([`${OWN_SIGNATURE_RULE} './contract.js'`])
    },
    ANALYSIS_TIMEOUT_MS,
  )

  /**
   * The other half. A relative import of something that is not the contract is how a multi-file
   * implementation is written at all, and the schema already models implementations carrying several
   * files with shared dependencies between them. A rule that refused every relative import would
   * refuse those.
   */
  it(
    'a-relative-import-of-anything-else-is-not-refused',
    () => {
      expect(analyse('refused.ts')).toEqual([])
    },
    ANALYSIS_TIMEOUT_MS,
  )
})
