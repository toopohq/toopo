/**
 * The `number/parse@1` battery.
 *
 * P-01 to P-20 are defects of behaviour and carry the mutation score. N-1 to N-3 are defects of
 * reason. X-1 is a probe: it asks whether two exports written independently can drift apart, which
 * is a question about the shape of the contract rather than a defect of its arithmetic, so it stays
 * out of the score.
 *
 * The three cache mutants annotate the variable they store, `const result: T = ...`, rather than
 * letting it be inferred. Measured on an earlier round, and not a stylistic preference: under a form
 * where the reason travels in the returned value, an inferred object literal widens the reason to
 * `string`, the mutant stops compiling, and the run reddens with no guard having observed anything -
 * which reads exactly like a convention catching a defect another one missed.
 *
 * The battery is measured under `UTC` for one reason only: so that two runs of it on two machines
 * are the same run. This contract reads a string and returns a number, and no verdict here depends
 * on the zone.
 */

import type { Battery, Edit, Expectation, Mutant } from './run.ts'

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites, quoted from `reference.ts`
// ---------------------------------------------------------------------------

const GRAMMAR = `const DECIMAL_GRAMMAR = /^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?$/`
const TRIM = `  const trimmed = input.trim()`
const CONVERT = `  const value = Number(trimmed)`

const REJECT = `  if (!DECIMAL_GRAMMAR.test(trimmed)) return null`
const FINAL = `  return Number.isFinite(value) ? value : null`

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

const killed: Expectation = { verdict: 'killed' }
const survived: Expectation = { verdict: 'survived' }
const notApplicable: Expectation = { verdict: 'not-applicable' }

const defect = (
  id: string,
  description: string,
  edits: readonly Edit[],
  expected: Expectation,
): Mutant => ({ id, kind: 'defect', description, arms: { A: edits }, expected: { 'A/as-committed': expected } })

/** A defect this arm cannot carry, because it is about a reason the form does not publish. */
const reasonDefect = (id: string, description: string): Mutant => ({
  id,
  kind: 'defect',
  description,
  arms: {},
  expected: { 'A/as-committed': notApplicable },
})

// ---------------------------------------------------------------------------
// The three caches - P-02, P-17 and P-19 differ only in where they are consulted
// and what they are built out of, which is the whole point of carrying all three
// ---------------------------------------------------------------------------

const bareCache = (key: 'input' | 'trimmed'): readonly Edit[] => [
  reference(GRAMMAR, `const CACHE: Record<string, number | null> = {}\n\n${GRAMMAR}`),
  reference(
    key === 'input' ? TRIM : CONVERT,
    `  const cached = CACHE[${key}]\n  if (cached !== undefined) return cached\n\n` +
      `${key === 'input' ? TRIM : CONVERT}`,
  ),
  reference(
    FINAL,
    `  const result: number | null = ${FINAL.replace('  return ', '')}\n` +
      `  CACHE[${key}] = result\n\n  return result`,
  ),
]

const mapCache = (): readonly Edit[] => [
  reference(GRAMMAR, `const CACHE = new Map<string, number | null>()\n\n${GRAMMAR}`),
  reference(
    TRIM,
    `  const cached = CACHE.get(input)\n  if (cached !== undefined) return cached\n\n${TRIM}`,
  ),
  reference(
    FINAL,
    `  const result: number | null = ${FINAL.replace('  return ', '')}\n` +
      `  CACHE.set(input, result)\n\n  return result`,
  ),
]

// ---------------------------------------------------------------------------
// P-01 to P-20 - defects of behaviour
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  defect(
    'P-01',
    'normalises negative zero to zero',
    [reference(FINAL, `  return Number.isFinite(value) ? (value === 0 ? 0 : value) : null`)],
    killed,
  ),
  defect(
    'P-02',
    'memoises into a bare object, consulted after the grammar guard',
    bareCache('trimmed'),
    survived,
  ),
  defect(
    'P-03',
    'returns NaN instead of reporting failure',
    [
      reference(REJECT, `  if (!DECIMAL_GRAMMAR.test(trimmed)) return Number.NaN`),
      reference(FINAL, `  return Number.isFinite(value) ? value : Number.NaN`),
    ],
    killed,
  ),
  defect(
    'P-04',
    'drops the finiteness guard, so overflow escapes as Infinity',
    [reference(FINAL, `  return value`)],
    killed,
  ),
  defect('P-05', 'omits the trim', [reference(TRIM, `  const trimmed = input`)], killed),
  defect(
    'P-06',
    'uses parseFloat instead of Number',
    [reference(CONVERT, `  const value = parseFloat(trimmed)`)],
    survived,
  ),
  defect(
    'P-07',
    'guards with !Number.isNaN instead of Number.isFinite, so Infinity passes',
    [reference(FINAL, `  return !Number.isNaN(value) ? value : null`)],
    killed,
  ),
  defect(
    'P-08',
    'adds the global flag to the grammar, which then carries a lastIndex between calls',
    [reference(`?$/`, `?$/g`)],
    killed,
  ),
  defect(
    'P-09',
    'accepts "1_000" by stripping underscores first',
    [reference(TRIM, `  const trimmed = input.trim().replace(/_/g, '')`)],
    killed,
  ),
  defect(
    'P-10',
    'strips every whitespace character rather than only the surrounding ones',
    [reference(TRIM, `  const trimmed = input.replace(/\\s/g, '')`)],
    killed,
  ),
  defect(
    'P-11',
    'requires an integer part, rejecting ".5"',
    [reference(`(?:\\d+(?:\\.\\d*)?|\\.\\d+)`, `(?:\\d+(?:\\.\\d*)?)`)],
    killed,
  ),
  defect('P-12', 'leaves the grammar unanchored on the right', [reference(`?$/`, `?/`)], killed),
  defect(
    'P-13',
    'rounds to fifteen significant digits',
    [reference(CONVERT, `  const value = Number(Number(trimmed).toPrecision(15))`)],
    killed,
  ),
  defect(
    'P-14',
    'uses the global isFinite instead of Number.isFinite',
    [reference(`Number.isFinite(value)`, `isFinite(value)`)],
    survived,
  ),
  defect('P-15', 'trims only the start', [reference(TRIM, `  const trimmed = input.trimStart()`)], killed),
  defect(
    'P-16',
    'writes a call counter onto globalThis',
    [
      reference(
        TRIM,
        `  const counters = globalThis as unknown as { __parseNumberCalls?: number }\n` +
          `  counters.__parseNumberCalls = (counters.__parseNumberCalls ?? 0) + 1\n\n${TRIM}`,
      ),
    ],
    survived,
  ),
  defect(
    'P-17',
    'memoises into a bare object, consulted first - so an inherited key such as "constructor" is ' +
      'served from Object.prototype and a function leaves the function',
    bareCache('input'),
    killed,
  ),
  defect(
    'P-18',
    'reports failure for every input',
    [reference(REJECT, `  if (trimmed.length >= 0) return null\n${REJECT}`)],
    killed,
  ),
  defect(
    'P-19',
    'memoises into a Map, consulted first - the same cache without the inherited keys',
    mapCache(),
    survived,
  ),
  defect(
    'P-20',
    'writes the trim by hand as /^\\s+|\\s+$/g',
    [reference(TRIM, `  const trimmed = input.replace(/^\\s+|\\s+$/g, '')`)],
    survived,
  ),
]

// ---------------------------------------------------------------------------
// N-1 to N-3 - defects of reason, and X-1 - the coupling probe
//
// None of them can be written against this arm: a form with no reason cannot be wrong about one,
// and a form with one export has nothing for a second to drift from.
// ---------------------------------------------------------------------------

const reasons: readonly Mutant[] = [
  reasonDefect('N-1', 'right value, wrong reason: overflow reported as not-decimal'),
  reasonDefect(
    'N-2',
    'a plausible but false reason: the empty string reported as not-decimal, which it also is',
  ),
  reasonDefect(
    'N-3',
    'collapse: every reason reported as one. The form carrying exactly as much information as null ' +
      'while looking like it carries more',
  ),
]

const probes: readonly Mutant[] = [
  {
    id: 'X-1',
    kind: 'probe',
    description:
      'the two exports written independently, and drifting. Not expressible here: this arm has one ' +
      'export, so there is nothing for it to drift from',
    arms: {},
    expected: { 'A/as-committed': notApplicable },
  },
]

export const battery: Battery = {
  name: 'number-parse',
  contractPath: 'contracts/number/parse',
  timeZone: 'UTC',
  calibrationMutant: 'P-18',

  arms: [{ id: 'A', ref: 'HEAD', convention: 'failure reported as null, with no diagnostic' }],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['A'],
      edits: [],
    },
  ],

  mutants: [...behaviour, ...reasons, ...probes],
}
