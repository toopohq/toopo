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
   * Two rules answer here and they answer differently, which is what the columns below are for.
   *
   * **A name the submission did not declare is refused unless it is permitted**, and that is not a
   * lexical reading at all: the compiler's binder says where a name is bound, so a capture, a
   * shorthand property and a read in a scope that does not hold the binding are all caught, while a
   * parameter that happens to be called `process` is not. Three of the entries below exist only
   * because of it - 8, 11 and 12 - and 12 is the one that would defeat any reader that asked whether
   * the *file* declares a name rather than whether this *read* is bound to it.
   *
   * **A forbidden method is read lexically**, and there the rule behind the rule still holds: the
   * holder is written down. A literal key under two casts and a `!` is caught because `when` is still
   * a name; the same spelling with the key in a variable is not.
   */
  it(
    'what-the-reader-sees',
    () => {
      // 1  (22): globalThis reached through a computed member - the holder is still named.
      // 2  (25): globalThis captured under another name - the capture itself is the reach.
      // 5  (39): a forbidden method under a literal key, through two `as` casts and a `!`.
      // 7  (46): indirect eval, `(0, eval)(text)`.
      // 8  (49): `eval` captured into a local. Nothing is built yet and there is no call to read.
      // 9  (53): the Function constructor, parenthesised.
      // 11 (61): `{ fetch }`, which declares a property and reads a global in one token.
      // 12 (70): a free read of a name another scope of the same file binds.
      expect(linesRefused()).toEqual([22, 25, 39, 46, 49, 53, 61, 70])
    },
    ANALYSIS_TIMEOUT_MS,
  )

  /**
   * What passes, pinned as passing.
   *
   * All three are evasions of one rule, and it is the rule that reads a *method* rather than a name:
   * the prototype reached as a member access, a method destructured into a free function, a key held
   * in a variable. `date/add@1` said so of its own requirement before any analyser existed - the
   * check is lexical and therefore evadable on purpose, written to catch the mistake while the
   * property catches the adversary.
   *
   * **The fourth line here is not an evasion and is the one that changed.** A parameter called
   * `process` reaches nothing, and the deny-list refused it because a deny-list can only read names.
   * The permitted-name rule asks the binder instead, so a local is a local. It is pinned as passing
   * because an over-refusal on legitimate code is a defect of this filter exactly as a hole is.
   */
  it(
    'what-the-reader-does-not-see',
    () => {
      const refused = linesRefused()

      // 3  (31): the prototype is a member access, so no name holds the forbidden method.
      // 4  (35): destructured into a free function, so no member call is left to read.
      // 6  (43): the key is in a variable.
      // 10 (57): a parameter named `process`, bound in the submission, reaching nothing.
      expect(refused).not.toContain(31)
      expect(refused).not.toContain(35)
      expect(refused).not.toContain(43)
      expect(refused).not.toContain(57)
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
      expect(linesRefused()).toHaveLength(8)
    },
    ANALYSIS_TIMEOUT_MS,
  )
})
