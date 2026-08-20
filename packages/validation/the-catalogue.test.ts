import { describe, it, expect } from 'vitest'
import { dirname, join } from 'node:path'

import { analyseImplementation, requirementsOf } from './analyse.js'
import { renderFinding } from './finding.js'
import { readSources } from './source.js'
import { eachContract, theCatalogue } from '../registry/the-catalogue.js'

/**
 * The catalogue, put through its own filter.
 *
 * **This is the guard that decides whether stage 1 is worth anything.** A filter nothing legitimate
 * passes is not a filter, it is a wall; a filter everything passes is decoration. The five contracts
 * are the only submissions this repository has, they were written by hand over five units with no
 * static analysis in existence, and none of them was written to satisfy this.
 *
 * The list of five is imported from `packages/registry/the-catalogue.ts` rather than restated. It is the one place
 * the catalogue's membership is declared, and a second list here would be a second statement that can
 * drift - which is the failure this repository has now found in a count, in a stratum and in a guard
 * identifier.
 *
 * Every guard here spawns a compiler process, so it declares its own timeout: the catalogue's clock
 * rule, applied to the folder that will enforce the catalogue's rules.
 */
const REPOSITORY_ROOT = dirname(dirname(import.meta.dirname))
const PROJECT = join(REPOSITORY_ROOT, 'tsconfig.json')

const ANALYSIS_TIMEOUT_MS = 30_000

describe('the five reference implementations pass stage 1', () => {
  it.each(eachContract)(
    'the-reference-crosses-no-rule-%s',
    (_name, source) => {
      const file = join(REPOSITORY_ROOT, source.folder, 'reference.ts')
      const requirements = requirementsOf(source.module)

      const findings = readSources({ project: PROJECT, files: [file] }, (sources) =>
        analyseImplementation(sources[0]!, requirements),
      )

      expect(findings.map(renderFinding)).toEqual([])
    },
    ANALYSIS_TIMEOUT_MS,
  )

  /**
   * The debt this unit was written to close, asserted as *applied* rather than as *declared*.
   *
   * `date/add@1` has published twenty forbidden local-time methods since it was written, and until
   * this folder existed the only guard over them required their reason to be non-empty.
   * `the-catalogue.ts` classified the field `one-directional` and said why in as many words: nothing
   * refused an implementation that called `getMonth`, because the check was the pipeline's and the
   * pipeline did not exist.
   *
   * What this asserts is that the requirement reached the analyser from the contract that publishes
   * it - not that a list somewhere has twenty entries. A pipeline holding its own copy of what
   * `date/add@1` forbids would have taken the declaration away from the contract.
   */
  it('a-published-requirement-reaches-the-analyser', () => {
    const withRequirements = theCatalogue.filter((source) => requirementsOf(source.module).length > 0)

    expect(withRequirements.map((source) => source.address.name)).toEqual(['date/add'])

    const [dateAdd] = withRequirements
    const methods = requirementsOf(dateAdd!.module).flatMap((entry) => entry.forbiddenMethods)

    expect(methods).toContain('getMonth')
    expect(methods).toContain('getTimezoneOffset')
    expect(methods).not.toContain('getUTCMonth')
  })

  /**
   * The other half, and the one that would show the requirement being read but not applied. An
   * implementation of `date/add@1` that calls `getMonth` is refused, and the refusal carries the
   * contract's own published reason rather than a sentence invented here.
   *
   * The perturbation goes into the *claim* - a submission calling the forbidden method - rather than
   * into the object derived from it, which is `GUARD_PERTURBATION_RULE` applied to this folder's
   * first guard over a contract's declaration.
   */
  it(
    'an-implementation-that-calls-a-forbidden-method-is-refused',
    () => {
      const file = join(import.meta.dirname, 'fixtures', 'refused.ts')
      const dateAdd = theCatalogue.find((source) => source.address.name === 'date/add')!
      const requirements = requirementsOf(dateAdd.module)

      const findings = readSources(
        { project: join(import.meta.dirname, 'fixtures', 'tsconfig.json'), files: [file] },
        (sources) => analyseImplementation(sources[0]!, requirements),
      )

      const refusedMethods = findings.filter(
        (finding) => finding.rule === 'calls-no-method-its-contract-forbids',
      )

      expect(refusedMethods.map((finding) => finding.quoted).sort()).toEqual([
        'when.getDate()',
        'when.getMonth()',
      ])
      expect(refusedMethods[0]?.why).toContain('ambient input the signature does not declare')
    },
    ANALYSIS_TIMEOUT_MS,
  )
})
