import { describe, it, expect } from 'vitest'

import type { SuiteRun } from './run.ts'
import { verdictOf, whyARunMeasuredNothing, whyARunReddened } from './run.ts'

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
      printed: '',
      reportSaysGreen: null,
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

/** The separator `calibrate` indents its refusal with, spelled once for the four guards below. */
const THE_LINE_BREAK = '\n'

/**
 * A red run that named no guard: the shape the whole of the block below is about.
 *
 * It is a `SuiteRun` and not a fixture of convenience - the fields are the ones `runSuite` really
 * fills, so a field added to that type arrives here as a compile error rather than as a row nobody
 * updated.
 */
const aRedRun: SuiteRun = {
  green: false,
  failedGuards: [],
  testsSeen: 3,
  guards: [],
  unansweredGuards: [],
  reportedFiles: {},
  notMeasured: null,
  printed: '',
  reportSaysGreen: true,
}

/**
 * A control that reddens says what reddened it. ADR-0201.
 *
 * These read one pure function and need no tree, for the reason the block above gives: `calibrate`
 * asserts a clean working tree, so a guard that lives beside it is one nobody can watch under a
 * perturbation of `run.ts`. These can be watched, and the perturbation that reddens every one of them
 * is the one line this repair replaced.
 */
describe('a red this instrument can explain', () => {
  /**
   * A red that named no guard used to be handed to a reader as the empty string.
   *
   * `calibrate` printed `failedGuards.join()`, and that string is empty exactly when the report holds
   * no failure - which is the state ADR-0200 measured a type error in a runtime test file producing:
   * `success: true`, every assertion passed, and the process gone at exit 1, because the typechecker's
   * complaint arrives as an *Unhandled Source Error* that vitest prints and never reports. So the one
   * place the cause was ever written was the child's own output, and the instrument threw it away.
   *
   * The assertion to watch is the third: it is the *child's own words* reaching the refusal. The first
   * two could be satisfied by a sentence somebody wrote here; only the third fails when the output is
   * discarded again.
   */
  it('a-red-that-names-no-guard-is-answered-by-what-the-run-printed', () => {
    const said = whyARunReddened({
      ...aRedRun,
      reportSaysGreen: true,
      printed: [
        'Test Files  4 passed (4)',
        'Unhandled Source Error',
        "TypeCheckError: Type 'string' is not assignable to type 'number'.",
      ].join(THE_LINE_BREAK),
    })

    expect(said).toContain('names no guard that failed and says the run succeeded')
    expect(said).toContain('is not an account of this run')
    expect(said).toContain("TypeCheckError: Type 'string' is not assignable to type 'number'.")
  })

  /**
   * Both sources are reported and neither is preferred.
   *
   * **The three answers are three claims and not one claim with two edge cases**, which is why they
   * are asserted apart. A report that says the run succeeded is not an account of it; one that agrees
   * the run failed is an account in which something other than a guard gave way; one that says nothing
   * leaves the exit code with nothing to be held against. A version that collapsed them would put a
   * reader back where the empty string left them, which is knowing only that something happened.
   *
   * The fourth row is the one that must not move: a run that named guards goes on answering with its
   * guards, so this repair costs the ordinary red nothing.
   */
  it('the-report-and-the-exit-code-are-both-reported-and-neither-is-preferred', () => {
    expect(whyARunReddened({ ...aRedRun, reportSaysGreen: true })).toContain('says the run succeeded')
    expect(whyARunReddened({ ...aRedRun, reportSaysGreen: false })).toContain('agrees that it failed')
    expect(whyARunReddened({ ...aRedRun, reportSaysGreen: null })).toContain('gives no verdict')

    expect(whyARunReddened({ ...aRedRun, failedGuards: ['a-guard', 'another-guard'] })).toBe(
      `a-guard${THE_LINE_BREAK}  another-guard`,
    )
  })

  /**
   * A quotation says what it left out.
   *
   * The cause of such a red sits in vitest's unhandled-errors block, which its default reporter writes
   * last, while the file listing that grows with the suite sits at the top - so the quotation is a
   * tail. Nothing here names the bound: what is asserted is that the end survives, that the beginning
   * does not, and that the reader is told the difference. A reader who cannot see that a quotation was
   * cut has no way to know there is more, which is a silence of the same family as the one being
   * repaired.
   */
  it('a-quotation-of-a-run-says-what-it-left-out', () => {
    const printed = Array.from({ length: 200 }, (_, line) => `line ${line + 1}`)
    const said = whyARunReddened({ ...aRedRun, printed: printed.join(THE_LINE_BREAK) })

    expect(said).toContain('line 200')
    expect(said).not.toContain('line 1' + THE_LINE_BREAK)
    expect(said).toContain('of 200 lines')
  })

  /**
   * A run that printed nothing says so, rather than trailing off after a colon.
   *
   * It is reachable: `execFileSync` gives back what it captured, and a child killed before it wrote
   * anything captures nothing. The heading promises the reader the cause is below it, so a heading
   * with nothing below it is a promise the refusal cannot keep.
   */
  it('a-run-that-printed-nothing-says-that-rather-than-promising-a-cause', () => {
    const said = whyARunReddened({ ...aRedRun, printed: '' })

    expect(said).toContain('the run printed nothing either')
    expect(said).not.toContain('is the only place its cause was written')
  })
})
