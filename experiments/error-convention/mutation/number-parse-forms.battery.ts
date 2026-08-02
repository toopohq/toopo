/**
 * Experiment material. Reason defects on `number/parse@1`, measured against the two forms that can
 * carry a reason at all.
 *
 *   arm B - the reason travels inside the returned value (round 1's discriminated union)
 *   arm C - the reason is published beside the return channel (`describeFailure`)
 *
 * `main` has no arm here. That is the measurement: a form with no reason cannot be wrong about one.
 *
 * X-1 is the coupling probe rather than a reason defect. It exists because the reference cannot
 * violate the coupling - `parseNumber` is defined through `describeFailure` - and a property that
 * the reference cannot fail has to be shown red on something before it can be trusted.
 */

import type { Battery, Edit, Mutant } from './run.ts'

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

const C_PARSE_NUMBER = `export const parseNumber = (input: string): number | null =>
  describeFailure(input) === null ? Number(input.trim()) : null`

const C_EMPTY = `  if (trimmed === '') return 'empty'`
const C_OVERFLOW = `  return Number.isFinite(Number(trimmed)) ? null : 'overflow'`

const B_EMPTY = `  if (trimmed === '') return { ok: false, reason: 'empty' }`
const B_OVERFLOW = `: { ok: false, reason: 'overflow' }`

export const mutants: readonly Mutant[] = [
  {
    id: 'X-1',
    description:
      'the two exports written independently, and drifting. `parseNumber` gets its own grammar - ' +
      'the obvious shape when the parsing path is optimised - and `describeFailure` acquires a ' +
      'length cap. Every named case still answers correctly on both, because none of them is longer ' +
      'than twenty characters; only the coupling property can see it',
    arms: {
      C: [
        reference(
          C_PARSE_NUMBER,
          `export const parseNumber = (input: string): number | null => {
  const trimmed = input.trim()
  if (!DECIMAL_GRAMMAR.test(trimmed)) return null

  const value = Number(trimmed)

  return Number.isFinite(value) ? value : null
}`,
        ),
        reference(C_EMPTY, `${C_EMPTY}\n  if (trimmed.length > 20) return 'not-decimal'`),
      ],
    },
  },
  {
    id: 'N-1',
    description: 'right value, wrong reason: overflow reported as not-decimal',
    arms: {
      B: [reference(B_OVERFLOW, `: { ok: false, reason: 'not-decimal' }`)],
      C: [reference(C_OVERFLOW, `  return Number.isFinite(Number(trimmed)) ? null : 'not-decimal'`)],
    },
  },
  {
    id: 'N-2',
    description:
      'a plausible but false reason: the empty string reported as not-decimal, which it also is',
    arms: {
      B: [reference(B_EMPTY, `  if (trimmed === '') return { ok: false, reason: 'not-decimal' }`)],
      C: [reference(C_EMPTY, `  if (trimmed === '') return 'not-decimal'`)],
    },
  },
  {
    id: 'N-3',
    description:
      'collapse: all three reasons reported as one. The form carrying exactly as much information ' +
      'as null while looking like it carries more',
    arms: {
      B: [
        reference(B_EMPTY, `  if (trimmed === '') return { ok: false, reason: 'not-decimal' }`),
        reference(B_OVERFLOW, `: { ok: false, reason: 'not-decimal' }`),
      ],
      C: [
        reference(C_EMPTY, `  if (trimmed === '') return 'not-decimal'`),
        reference(C_OVERFLOW, `  return Number.isFinite(Number(trimmed)) ? null : 'not-decimal'`),
      ],
    },
  },
]

export const battery: Battery = {
  contractPath: 'contracts/number/parse',

  arms: [
    {
      id: 'B',
      ref: 'experiment/discriminated-union',
      convention: 'the reason travels inside the returned value',
    },
    { id: 'C', ref: 'HEAD', convention: 'the reason is published beside the return channel' },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['B', 'C'],
      edits: [],
    },
  ],

  mutants,
}
