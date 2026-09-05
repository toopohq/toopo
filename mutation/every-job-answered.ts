/**
 * Whether every job a run needed actually answered, and what to do when the question cannot be asked.
 *
 * ---------------------------------------------------------------------------
 * The fault this exists for
 * ---------------------------------------------------------------------------
 *
 * **A job killed by its own `timeout-minutes` reports `cancelled`, and `cancelled` is not `failure`.**
 * So the run conclusion is `cancelled`, nothing is red, and a reader who is looking for a red finds
 * none. Measured: `batteries (registry-storage)` was killed by the 40-minute bound on six pushes of
 * `main` between `1238833` and `3078f81`, and in the five pushes between them the selection chose no
 * battery at all - so the greens either side say nothing about it. The battery has not completed since
 * `6d03933`, which finished at 39 min 49 s, eleven seconds under the bound.
 *
 * A bound that is too small and a crossing nobody sees are one fault, not two. ADR-0162 is the
 * precedent in this repository and it says so in as many words: the buffer that killed a red run
 * before vitest could report, and the bound that was never there, were one fault. Raising a bound
 * without this is a reprieve, because the next crossing is silent again.
 *
 * ---------------------------------------------------------------------------
 * Why `skipped` is not a failure, and why an empty answer is
 * ---------------------------------------------------------------------------
 *
 * `skipped` is how this workflow says *this job had nothing to do*: `batteries` is skipped when the
 * selection is empty, and the two `every-battery` legs are skipped on every push that does not
 * publish. Refusing it would redden almost every push.
 *
 * **An answer with no jobs in it is refused, and that is the half that matters.** `toJSON(needs)` is
 * an expression, and an expression that resolves to nothing produces `{}` rather than an error - at
 * which point *no job failed to answer* is true, vacuously, and the gate reports exactly what a
 * healthy run reports. It is the same shape as a pre-flight answering *nought faults* over a
 * measurement it never read. ADR-0222.
 */

/** What a job may report and still be said to have answered. */
export const HOW_A_JOB_ANSWERS: readonly string[] = ['success', 'skipped']

export type JobOutcome = { readonly result?: unknown }

/**
 * Why the results are not something a verdict can be taken from, or `null`.
 *
 * A sentence rather than a boolean, because a gate that refuses without saying what it could not read
 * is the silence it was written to replace.
 */
export const whyTheResultsAreUnreadable = (parsed: unknown): string | null => {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return 'it is not an object of jobs'
  }

  const entries = Object.entries(parsed as Record<string, unknown>)
  if (entries.length === 0) {
    return 'it names no job at all, so "every job answered" would be true of nothing'
  }

  const malformed = entries.find(
    ([, outcome]) =>
      typeof outcome !== 'object' ||
      outcome === null ||
      typeof (outcome as JobOutcome).result !== 'string',
  )

  return malformed === undefined ? null : `${malformed[0]} carries no result`
}

/** The jobs that did not answer, each with what it reported instead. */
export const jobsThatDidNotAnswer = (
  needs: Readonly<Record<string, JobOutcome>>,
): readonly string[] =>
  Object.entries(needs)
    .filter(([, outcome]) => !HOW_A_JOB_ANSWERS.includes(String(outcome.result)))
    .map(([name, outcome]) => `${name}: ${String(outcome.result)}`)
    .sort()
