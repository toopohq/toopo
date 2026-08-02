/**
 * Experiment material. Probes about the *form* of `date/add@1`'s output rather than about its
 * arithmetic, kept apart from the D battery so they never enter a mutation score.
 *
 * They exist to settle one question the audit raised: D-10 returns an Invalid Date and P1 - the
 * property whose statement is "returns null or a valid Date, never an Invalid Date" - stays green
 * on it. Two explanations fit, and they are not the same defect:
 *
 *   the property is written in a form that cannot see it, or
 *   the property is written correctly and its generators never reach the input that would show it.
 *
 * F-1 separates them. It produces an Invalid Date on the neutral duration, which the generators draw
 * often, instead of past the representable range, which they cannot reach: `anyDate` spans 1700 to
 * 2400, at most 1.4e13 ms from the epoch, and the widest duration the arbitraries can draw is about
 * 6e9 ms and 90 months. The range ends at 8.64e15. No draw can leave it, by arithmetic.
 */

import type { Battery, Mutant } from './run.ts'

const A_FINAL = `  return Number.isFinite(result.getTime()) ? result : null`

/** The totals of the private analysis, the one place a diagnostic-only guard has both to hand. */
const C_TOTALS = `  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')
  const elapsed = elapsedMilliseconds(duration)`

const C_ADD_TO_DATE = `export const addToDate = (date: Date, duration: Duration): Date | null => {
  const analysis = analyse(date, duration)

  return analysis.ok ? analysis.date : null
}`

export const mutants: readonly Mutant[] = [
  {
    id: 'F-1',
    description:
      'returns an Invalid Date on the neutral duration - the same defect as D-10, moved off the ' +
      'representable-range boundary and onto an input the generators were assumed to draw',
    arms: {
      A: [
        {
          file: 'reference.ts',
          find: A_FINAL,
          replace:
            `  if (totalMonths === 0 && elapsed === 0) return new Date(Number.NaN)\n\n${A_FINAL}`,
        },
      ],
    },
  },
  {
    id: 'F-2',
    description:
      'returns an Invalid Date for every call. The control that separates "P1 cannot fail" from ' +
      '"P1 was never reached": if F-2 does not redden P1, the property is decorative; if it does, ' +
      'the property is sound and its generators are the defect',
    arms: {
      A: [{ file: 'reference.ts', find: A_FINAL, replace: `  return new Date(Number.NaN)` }],
    },
  },
  {
    id: 'X-2',
    description:
      'the two exports written independently, and drifting. `addToDate` gets its own arithmetic - ' +
      'the obvious shape when the answering path is optimised and the diagnostic one is left alone ' +
      '- and `analyse`, which now only `describeAddFailure` reaches, acquires a rule that a week ' +
      'cannot be combined with a calendar unit. Every entry of both tables still answers correctly ' +
      'on both exports, because no named case carries weeks and months at once; only the coupling ' +
      'property can see it. The analogue of X-1 on `number/parse@1`',
    arms: {
      C: [
        // The guard is injected before `addToDate` is rewritten. The independent implementation
        // names its locals differently, so neither edit can turn the other's anchor ambiguous - the
        // instrument would refuse rather than inject half a defect, which is how the naive ordering
        // announces itself.
        {
          file: 'reference.ts',
          find: C_TOTALS,
          replace:
            `${C_TOTALS}\n\n` +
            `  if (totalMonths !== 0 && valueOf(duration, 'weeks') !== 0) {\n` +
            `    return { ok: false, reason: 'field-not-whole' }\n` +
            `  }`,
        },
        {
          file: 'reference.ts',
          find: C_ADD_TO_DATE,
          replace: `export const addToDate = (date: Date, duration: Duration): Date | null => {
  const start = date.getTime()
  if (!Number.isFinite(start)) return null

  if (!hasOnlyDeclaredFields(duration)) return null
  if (!DECLARED_FIELDS.every((field) => isExactWholeNumber(duration[field]))) return null

  const months = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')
  const ms = elapsedMilliseconds(duration)
  if (!Number.isSafeInteger(months) || !Number.isSafeInteger(ms)) return null

  const result = new Date((months === 0 ? start : monthShiftedTimestamp(start, months)) + ms)

  return Number.isFinite(result.getTime()) ? result : null
}`,
        },
      ],
    },
  },
]

export const battery: Battery = {
  contractPath: 'contracts/date/add',
  arms: [
    { id: 'A', ref: 'main', convention: 'failure reported as null' },
    { id: 'C', ref: 'HEAD', convention: 'the reason is published beside the return channel' },
  ],
  lenses: [{ id: 'as-committed', description: 'the arm as its commit left it', arms: ['A', 'C'], edits: [] }],
  mutants,
}
