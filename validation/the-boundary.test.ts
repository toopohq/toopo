import { describe, it, expect } from 'vitest'
import { join } from 'node:path'

import { analyseImplementation, requirementsOf } from './analyse.js'
import { readSources } from './source.js'
import { theFive } from '../registry/the-five.js'

/**
 * Where the filter stops.
 *
 * **Both columns are pinned, and that is the whole point of this file.** A test that asserted only
 * what the rules catch would let the boundary drift silently in either direction: a rule that later
 * closed an evasion would go unnoticed, and a rule that quietly stopped catching one would too. Here
 * the passes are asserted as passes, so closing one is a red test and a deliberate move from one list
 * to the other.
 *
 * The evasions are in `fixtures/the-boundary.ts`, numbered, and each is a spelling somebody would
 * actually reach for. What is measured below is which of them the reader sees.
 *
 * `date/add@1` wrote the honest version of this sentence before any analyser existed: the check is
 * *lexical and therefore evadable on purpose* - written to catch the mistake, while the property
 * catches the adversary. Stage 1 is a filter, not a proof, and the four stages that follow it exist
 * because of exactly this list.
 */
const FIXTURES = join(import.meta.dirname, 'fixtures')
const BOUNDARY = join(FIXTURES, 'the-boundary.ts')

const ANALYSIS_TIMEOUT_MS = 15_000

const dateAdd = theFive.find((source) => source.address.name === 'date/add')!
const REQUIREMENTS = requirementsOf(dateAdd.module)

/** The evasions the reader sees, as the line each was written on. */
const linesRefused = (): readonly number[] =>
  readSources({ project: join(FIXTURES, 'tsconfig.json'), files: [BOUNDARY] }, (sources) =>
    [
      ...new Set(
        analyseImplementation(sources[0]!, REQUIREMENTS).map((finding) =>
          Number(finding.at.slice(finding.at.lastIndexOf(':') + 1)),
        ),
      ),
    ].sort((a, b) => a - b),
  )

describe('the boundary of the lexical filter', () => {
  /**
   * What is caught, and by which route.
   *
   * Five evasions are caught and they are caught for one reason, worth naming because it is the rule
   * behind the rules: **the holder is still written down.** A computed member, a captured binding, a
   * literal key under two casts and a `!`, a parenthesised constructor - each of them still leaves
   * `globalThis`, `eval`, `Function` or a named receiver in the source, and the reader reads names.
   * What defeats it is never the computation; it is putting the *holder* out of reach of a name.
   *
   * Three of the five were closed during this unit rather than described. `(0, eval)(text)`,
   * `new (Function)('...')` and `(when as Record<string, () => number>)['getMonth']!()` all passed a
   * reader that asked an expression to *be* an identifier and found a wrapper. The compiler's own
   * `skipOuterExpressions` is what closed them, so the set of things that count as a wrapper is
   * TypeScript's rather than a list maintained here.
   */
  it(
    'what-the-reader-sees',
    () => {
      // 1 (19): globalThis reached through a computed member - the holder is still named.
      // 2 (22): globalThis captured under another name - the capture itself is the reach.
      // 5 (36): a forbidden method under a literal key, through two `as` casts and a `!`.
      // 7 (43): indirect eval, `(0, eval)(text)`.
      // 9 (50): the Function constructor, parenthesised.
      // 10 (53): a parameter named `process`, which reaches nothing. See below.
      expect(linesRefused()).toEqual([19, 22, 36, 43, 50, 53])
    },
    ANALYSIS_TIMEOUT_MS,
  )

  /**
   * What passes, pinned as passing.
   *
   * Every one of them puts the holder beyond a name: the prototype reached as a member access rather
   * than as an identifier, a method destructured into a free function, a key held in a variable, and
   * `eval` bound to a local before it is called. The one family that is not an evasion at all is the
   * last: a parameter that happens to be named `process` reaches nothing, and the rule refuses it -
   * an over-refusal rather than a hole, and the only one measured here.
   *
   * A scope-aware or symbol-aware reading would close some of these. What it buys is measured rather
   * than assumed, and the measurement is reported with this unit rather than promised.
   */
  it(
    'what-the-reader-does-not-see',
    () => {
      const refused = linesRefused()

      // 3 (28): the prototype is a member access, so no name holds the forbidden method.
      // 4 (32): destructured into a free function, so no member call is left to read.
      // 6 (40): the key is in a variable.
      // 8 (47): `eval` bound to a local before it is called.
      expect(refused).not.toContain(28)
      expect(refused).not.toContain(32)
      expect(refused).not.toContain(40)
      expect(refused).not.toContain(47)
    },
    ANALYSIS_TIMEOUT_MS,
  )

  /**
   * The boundary is a number, and pinning it is what makes a later rule's effect visible. A rule that
   * closed two evasions would move this, and moving it is a decision somebody takes rather than a
   * side effect nobody noticed.
   */
  it(
    'the-boundary-is-a-measurement-and-not-a-claim',
    () => {
      expect(linesRefused()).toHaveLength(6)
    },
    ANALYSIS_TIMEOUT_MS,
  )
})
