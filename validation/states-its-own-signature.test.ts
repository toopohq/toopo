import { describe, it, expect } from 'vitest'
import { join } from 'node:path'

import { STATES_ITS_OWN_SIGNATURE } from '../packages/catalogue/reference-implementation.js'
import { readSources } from './source.js'
import { OWN_SIGNATURE_RULE, importsItsOwnContract } from './states-its-own-signature.js'

/**
 * The rule the catalogue has carried since its first contract and that nothing enforced.
 *
 * `referenceImplementationRules` states it with its reason and was imported by nothing executable -
 * one of the three declarations the sweep of the previous unit found in that state. It is now read by
 * the rule below, which is why the guard here also asserts that the catalogue's own sentence reaches
 * a submitter: a rule that was enforced while its published reason was retold in the tool's words
 * would be two sentences one rewording apart.
 */
const FIXTURES = join(import.meta.dirname, 'fixtures')
const FIXTURE_PROJECT = join(FIXTURES, 'tsconfig.json')

const ANALYSIS_TIMEOUT_MS = 15_000

const analyse = (file: string): readonly string[] =>
  readSources({ project: FIXTURE_PROJECT, files: [join(FIXTURES, file)] }, (sources) =>
    importsItsOwnContract(sources[0]!).map((finding) => `${finding.rule} ${finding.quoted}`),
  )

const whyOf = (file: string): readonly string[] =>
  readSources({ project: FIXTURE_PROJECT, files: [join(FIXTURES, file)] }, (sources) =>
    importsItsOwnContract(sources[0]!).map((finding) => finding.why),
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

  /**
   * The refusal a submitter reads carries the catalogue's own published reason, not a retelling of
   * it. Without this the two could be reworded apart and the pipeline would go on enforcing a rule
   * while explaining a different one - which is exactly the drift `analyse.ts` refuses by reading
   * `staticAnalysisRequirements` off the contract instead of transcribing it.
   */
  it(
    'the-refusal-carries-the-catalogues-own-reason',
    () => {
      expect(whyOf('imports-its-contract.ts')).toEqual([
        expect.stringContaining(STATES_ITS_OWN_SIGNATURE.reason),
      ])
    },
    ANALYSIS_TIMEOUT_MS,
  )
})
