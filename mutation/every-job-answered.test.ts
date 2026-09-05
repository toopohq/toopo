/**
 * What the gate over a run's own jobs is held to.
 *
 * The guards split in two, and the second half is the reason the gate is a node script rather than a
 * `contains(needs.*.result, 'cancelled')` written into the workflow: that expression is *false* when
 * `needs` resolves to nothing, so a gate reading an empty answer passes, and passes with exactly the
 * output a healthy run produces. Refusing that is not expressible in the condition; it is expressible
 * here. ADR-0222.
 */

import { describe, expect, it } from 'vitest'

import {
  HOW_A_JOB_ANSWERS,
  jobsThatDidNotAnswer,
  whyTheResultsAreUnreadable,
} from './every-job-answered.ts'

const aRun = (results: Readonly<Record<string, string>>): Record<string, { result: string }> =>
  Object.fromEntries(Object.entries(results).map(([name, result]) => [name, { result }]))

describe('a job that did not answer', () => {
  /**
   * The outcome this gate exists for. A job killed by `timeout-minutes` reports `cancelled`, the run
   * concludes `cancelled`, and `cancelled` is not `failure` - so nothing reddens.
   *
   * Seen red by counting `cancelled` as an answer.
   */
  it('a-job-its-own-timeout-cancelled-is-a-job-that-did-not-answer', () => {
    const silent = jobsThatDidNotAnswer(
      aRun({ suites: 'success', 'batteries (registry-storage)': 'cancelled' }),
    )

    expect(silent).toEqual(['batteries (registry-storage): cancelled'])
  })

  /**
   * `skipped` is how this workflow says a job had nothing to do - `batteries` when the selection is
   * empty, the two `every-battery` legs on every push that does not publish. Refusing it would redden
   * almost every push of this repository.
   *
   * Seen red by dropping `skipped` from what counts as an answer.
   */
  it('a-job-with-nothing-to-do-is-not-a-job-that-failed', () => {
    expect(jobsThatDidNotAnswer(aRun({ batteries: 'skipped', publish: 'skipped' }))).toEqual([])
    expect(HOW_A_JOB_ANSWERS).toContain('skipped')
  })

  /**
   * The gate is total over what a job can report rather than about the one word it was written for,
   * and it names them in a fixed order so a run's output does not depend on how GitHub happened to
   * order `needs`.
   *
   * It deliberately carries no cancelled job: the guard above owns that claim, and two guards
   * asserting one thing are one guard with two names. Seen red by refusing only `cancelled`.
   */
  it('a-job-that-failed-is-named-too-and-the-order-does-not-follow-the-input', () => {
    const silent = jobsThatDidNotAnswer(
      aRun({ site: 'failure', suites: 'success', batteries: 'failure' }),
    )

    expect(silent).toEqual(['batteries: failure', 'site: failure'])
  })
})

describe('an answer this gate cannot take a verdict from', () => {
  /**
   * **The guard the shape of this gate was chosen for.** `toJSON(needs)` resolves to `{}` rather than
   * to an error when it names nothing, and *no job failed to answer* is then true of nothing - which
   * is byte for byte what a healthy run reports.
   *
   * Seen red by treating an empty object as readable.
   */
  it('an-answer-that-names-no-job-is-refused-rather-than-read-as-well', () => {
    expect(whyTheResultsAreUnreadable({})).toContain('names no job at all')
  })

  /** File and environment content is checked rather than trusted, and the refusal says what it read. */
  it('an-answer-that-is-not-a-set-of-job-results-is-named-rather-than-parsed', () => {
    expect(whyTheResultsAreUnreadable(aRun({ suites: 'success' }))).toBeNull()
    expect(whyTheResultsAreUnreadable(null)).toBe('it is not an object of jobs')
    expect(whyTheResultsAreUnreadable([])).toBe('it is not an object of jobs')
    expect(whyTheResultsAreUnreadable({ suites: {} })).toBe('suites carries no result')
    expect(whyTheResultsAreUnreadable({ suites: { result: 7 } })).toBe('suites carries no result')
  })
})
