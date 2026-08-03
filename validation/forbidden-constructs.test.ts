import { describe, it, expect } from 'vitest'
import { join } from 'node:path'

import {
  CONTRACT_METHOD_RULE,
  EVALUATION_RULE,
  GLOBAL_RULE,
  IMPORT_RULE,
  ambientStateReached,
  codeBuiltAtRunTime,
  contractForbiddenMethods,
  importsOutsideTheRegistry,
} from './forbidden-constructs.js'
import type { Finding } from './finding.js'
import type { ParsedSource } from './source.js'
import { readSources } from './source.js'
import { staticAnalysisRequirements } from '../contracts/date/add/contract.js'

/**
 * Every rule of the security filter, seen refusing a real construction and seen leaving a legitimate
 * one alone.
 *
 * Both halves, always. A filter is two claims - it catches what it says it catches, and it does not
 * catch what it says it does not - and only the first is usually written down. The second is where a
 * filter that refuses the catalogue it protects would show, and `permitted.ts` is what asks it: a
 * `Date` used correctly is one character from a `Date` used ambiently, and `Math.min` sits beside
 * `Math.random`.
 *
 * The forbidden method list is imported from `date/add@1` rather than transcribed. That contract has
 * published twenty local-time methods since it was written and nothing has ever refused an
 * implementation that called one; taking the list from the contract is what makes this the guard that
 * closes it rather than a second copy that can drift from it.
 */
const FIXTURES = join(import.meta.dirname, 'fixtures')
const FIXTURE_PROJECT = join(FIXTURES, 'tsconfig.json')
const REFUSED = join(FIXTURES, 'refused.ts')
const PERMITTED = join(FIXTURES, 'permitted.ts')

const ANALYSIS_TIMEOUT_MS = 15_000

const LOCAL_TIME_METHODS = staticAnalysisRequirements[0].forbiddenMethods
const LOCAL_TIME_REASON = staticAnalysisRequirements[0].reason

const analyse = (file: string, rules: (source: ParsedSource) => readonly Finding[]): readonly Finding[] =>
  readSources({ project: FIXTURE_PROJECT, files: [file] }, (sources) => rules(sources[0]!))

const allRules = (source: ParsedSource): readonly Finding[] => [
  ...importsOutsideTheRegistry(source),
  ...ambientStateReached(source),
  ...codeBuiltAtRunTime(source),
  ...contractForbiddenMethods(source, LOCAL_TIME_METHODS, LOCAL_TIME_REASON),
]

const rulesFiring = (findings: readonly Finding[]): readonly string[] =>
  [...new Set(findings.map((finding) => finding.rule))].sort()

describe('the security filter refuses what it says it refuses', () => {
  it(
    'every-rule-fires-on-a-real-construction',
    () => {
      expect(rulesFiring(analyse(REFUSED, allRules))).toEqual(
        [CONTRACT_METHOD_RULE, EVALUATION_RULE, GLOBAL_RULE, IMPORT_RULE].sort(),
      )
    },
    ANALYSIS_TIMEOUT_MS,
  )

  /**
   * The specifier is what is read, so an alias cannot evade it - and every shape a module can be
   * named by is read, because a rule that knew about `import ... from` alone would be evaded by the
   * five others. The relative import in the same file must not be among them.
   */
  it(
    'every-shape-of-import-is-read-and-a-relative-one-is-not-refused',
    () => {
      const quoted = analyse(REFUSED, importsOutsideTheRegistry).map((finding) => finding.quoted)

      // Quoted verbatim, single quotes and all: a refusal that renormalised what it quotes could be
      // wrong about the source it is refusing.
      expect(quoted.sort()).toEqual([
        "'node:crypto'",
        "'node:fs'",
        "'node:fs'",
        "'node:os'",
        "'node:path'",
        "'node:util'",
      ])
    },
    ANALYSIS_TIMEOUT_MS,
  )

  it(
    'the-ambient-reaches-are-named-one-by-one',
    () => {
      const quoted = analyse(REFUSED, ambientStateReached).map((finding) => finding.quoted)

      expect(quoted.sort()).toEqual(['Date.now', 'Math.random', 'URL', 'fetch', 'globalThis', 'process'])
    },
    ANALYSIS_TIMEOUT_MS,
  )

  it(
    'the-four-ways-of-building-code-are-refused',
    () => {
      const quoted = analyse(REFUSED, codeBuiltAtRunTime).map((finding) => finding.quoted)

      expect(quoted.sort()).toEqual([
        'eval(input)',
        'import(input)',
        'import.meta',
        'new Function(\'return 1\')',
      ])
    },
    ANALYSIS_TIMEOUT_MS,
  )

  /**
   * The `getUTC*` family sits one character from the `get*` family, which is why the rule matches a
   * call rather than a substring - and why the fixture calls `getUTCMonth` beside `getMonth`.
   */
  it(
    'a-contract-forbidden-method-is-refused-and-its-utc-twin-is-not',
    () => {
      const quoted = analyse(
        REFUSED,
        (source) => contractForbiddenMethods(source, LOCAL_TIME_METHODS, LOCAL_TIME_REASON),
      ).map((finding) => finding.quoted)

      expect(quoted.sort()).toEqual(['when.getDate()', 'when.getMonth()'])
    },
    ANALYSIS_TIMEOUT_MS,
  )
})

describe('the security filter refuses nothing else', () => {
  /**
   * The half that would show a filter refusing the catalogue it protects. `permitted.ts` uses `Date`,
   * `Math`, the `getUTC*` family and a relative import - every one of them one step from something
   * refused above.
   */
  it(
    'a-legitimate-submission-is-answered-with-nothing',
    () => {
      expect(analyse(PERMITTED, allRules)).toEqual([])
    },
    ANALYSIS_TIMEOUT_MS,
  )
})
