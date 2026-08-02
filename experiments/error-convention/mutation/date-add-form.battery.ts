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
]

export const battery: Battery = {
  contractPath: 'contracts/date/add',
  arms: [{ id: 'A', ref: 'main', convention: 'failure reported as null' }],
  lenses: [{ id: 'as-committed', description: 'the arm as its commit left it', arms: ['A'], edits: [] }],
  mutants,
}
