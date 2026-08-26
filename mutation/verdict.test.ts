import { describe, it, expect } from 'vitest'

import type { SuiteRun } from './run.ts'
import { verdictOf, whyARunMeasuredNothing } from './run.ts'

/**
 * What a run says about the mutant that was in the tree while it ran, and what it says when it could
 * not say anything.
 *
 * ---------------------------------------------------------------------------
 * Why these two are not in `instrument.test.ts`
 * ---------------------------------------------------------------------------
 *
 * That file calls `calibrate` at module scope, and `calibrate` asserts a clean working tree - so
 * nothing in it collects while a source is modified, and **a guard that cannot be watched under a
 * perturbation is one nobody can see red**. These read two pure functions and need no tree at all, so
 * they are here where breaking `run.ts` on purpose still runs them. ADR-0162.
 */
describe('a verdict this instrument did not measure', () => {
  /**
   * A run cut short is told from a run that reddened.
   *
   * **This is the guard for the trap, and the trap is the order of the terms.** `verdictOf` reads
   * `killed-by-typecheck` off an *absence* - red, with no guard named - and a run that was cut short
   * before it could write a report is red with no guard named. So a bound added without a verdict to
   * carry it would have turned every hanging cell into one more `killed-by-typecheck`, and the repair
   * would have measured nothing while looking finished.
   *
   * The three inputs are node's own, measured at `505fddb` rather than assumed: `ETIMEDOUT` for a run
   * past its bound, `ENOBUFS` for one past its buffer, and no code at all for an ordinary non-zero
   * exit. `signal` is `SIGTERM` for both bounded cases and separates neither; `killed` is `undefined`
   * in all of them, so the field that looks like the answer is not one.
   */
  it('a-run-cut-short-is-told-from-a-run-that-reddened', () => {
    expect(whyARunMeasuredNothing('ETIMEDOUT')).toContain('did not finish')
    expect(whyARunMeasuredNothing('ENOBUFS')).toContain('printed more than')

    // An ordinary red carries no `code`, and neither does a spawn that failed for a reason this
    // instrument has no name for - both are left to be read as what the report says.
    expect(whyARunMeasuredNothing(undefined)).toBeNull()
    expect(whyARunMeasuredNothing('EACCES')).toBeNull()
  })

  /**
   * The absence is asked about before anything reads it as evidence.
   *
   * A run that measured nothing carries exactly the shape `killed-by-typecheck` is derived from - not
   * green, and no failed guard - so the two rows below differ in one field and must not answer the
   * same. Written as a pair rather than as one assertion, because what is at stake is the *order* of
   * the terms and a single row cannot show an order.
   */
  it('a-verdict-is-asked-of-the-absence-before-the-evidence', () => {
    const nothingLearned: SuiteRun = {
      green: false,
      failedGuards: [],
      testsSeen: null,
      guards: [],
      unansweredGuards: [],
      reportedFiles: {},
      notMeasured: 'the run did not finish',
    }

    expect(verdictOf(nothingLearned)).toBe('not-measured')
    expect(verdictOf({ ...nothingLearned, notMeasured: null })).toBe('killed-by-typecheck')

    // And the other two terms are unmoved by it, so the repair costs no verdict it did not owe.
    expect(verdictOf({ ...nothingLearned, notMeasured: null, green: true })).toBe('survived')
    expect(verdictOf({ ...nothingLearned, notMeasured: null, failedGuards: ['a-guard'] })).toBe(
      'killed',
    )
  })
})
