/**
 * The `number/parse@1` battery.
 *
 * P-01 to P-20 are defects of behaviour and carry the mutation score. N-1 to N-5 are defects of
 * reason: they answer every call with the value the contract asks for and are wrong only about why
 * a refusal happened. X-1 is a probe - it asks whether two exports written independently can drift
 * apart - so it is kept out of the score.
 *
 * N-4 and N-5 police the `separator` literal from both sides: one stops producing it and lets every
 * separator mistake fall back into the residual reason, the other produces it for an ordinary space.
 * Neither changes a single value, which is what makes the blinded column the measurement it is.
 *
 * The three cache mutants annotate the variable they store, `const result: ParseAnalysis = ...`,
 * rather than letting it be inferred. Measured on an earlier round, and not a stylistic preference:
 * an inferred object literal widens the reason to `string`, the mutant stops compiling, and the run
 * reddens with no guard having observed anything - which reads exactly like a contract catching a
 * defect it never saw.
 *
 * The battery is measured under `UTC` for one reason only: so that two runs of it on two machines
 * are the same run. This contract reads a string and returns a number, and no verdict here depends
 * on the zone.
 *
 * The `reason-blind` lens reads the suite as if the diagnostic published only its presence and never
 * which reason it names. The difference between the two columns is the entire detection the reason
 * buys, isolated.
 */

import type { Battery, Edit, Expectation, Mutant } from './run.ts'

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites, quoted from `reference.ts`
// ---------------------------------------------------------------------------

const GRAMMAR = `const DECIMAL_GRAMMAR = /^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?$/`
const TRIM = `  const trimmed = input.trim()`
const CONVERT = `  const value = Number(trimmed)`

const EMPTY = `  if (trimmed === '') return { ok: false, reason: 'empty' }`
const REJECT = `  if (!DECIMAL_GRAMMAR.test(trimmed)) {
    return DECIMAL_GRAMMAR.test(withoutSeparators(trimmed))
      ? { ok: false, reason: 'separator' }
      : { ok: false, reason: 'not-decimal' }
  }`
const SEPARATOR_FAMILY = `input.replace(/[,_'\\u00A0\\u202F]/g, '')`
const FINAL = `  return Number.isFinite(value) ? { ok: true, value } : { ok: false, reason: 'overflow' }`

const PARSE_NUMBER = `export const parseNumber = (input: string): number | null => {
  const analysis = analyse(input)

  return analysis.ok ? analysis.value : null
}`

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

const COUPLING_PROPERTY = 'P4 - a string fails to parse exactly when it has a description'

const killed = (by?: readonly string[]): Expectation =>
  by === undefined ? { verdict: 'killed' } : { verdict: 'killed', by }

const survived: Expectation = { verdict: 'survived' }

/** A defect that is not about the reason: both lenses see it, and see it the same way. */
const behavioural = (
  id: string,
  description: string,
  edits: readonly Edit[],
  expected: Expectation,
): Mutant => ({
  id,
  kind: 'defect',
  description,
  arms: { C: edits },
  expected: { 'C/as-committed': expected, 'C/reason-blind': expected },
})

/**
 * A defect of reason. Every one of them answers every call with the value the contract asks for, so
 * the blinded column is what the bare `null` convention would have seen: nothing.
 */
const reasonDefect = (id: string, description: string, edits: readonly Edit[]): Mutant => ({
  id,
  kind: 'defect',
  description,
  arms: { C: edits },
  expected: { 'C/as-committed': killed(), 'C/reason-blind': survived },
})

// ---------------------------------------------------------------------------
// The three caches - P-02, P-17 and P-19 differ only in where they are consulted
// and what they are built out of, which is the whole point of carrying all three
// ---------------------------------------------------------------------------

const bareCache = (key: 'input' | 'trimmed'): readonly Edit[] => [
  reference(GRAMMAR, `const CACHE: Record<string, ParseAnalysis> = {}\n\n${GRAMMAR}`),
  reference(
    key === 'input' ? TRIM : CONVERT,
    `  const cached = CACHE[${key}]\n  if (cached !== undefined) return cached\n\n` +
      `${key === 'input' ? TRIM : CONVERT}`,
  ),
  reference(
    FINAL,
    `  const result: ParseAnalysis = ${FINAL.replace('  return ', '')}\n` +
      `  CACHE[${key}] = result\n\n  return result`,
  ),
]

const mapCache = (): readonly Edit[] => [
  reference(GRAMMAR, `const CACHE = new Map<string, ParseAnalysis>()\n\n${GRAMMAR}`),
  reference(
    TRIM,
    `  const cached = CACHE.get(input)\n  if (cached !== undefined) return cached\n\n${TRIM}`,
  ),
  reference(
    FINAL,
    `  const result: ParseAnalysis = ${FINAL.replace('  return ', '')}\n` +
      `  CACHE.set(input, result)\n\n  return result`,
  ),
]

// ---------------------------------------------------------------------------
// P-01 to P-20 - defects of behaviour
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  behavioural(
    'P-01',
    'normalises negative zero to zero',
    [
      reference(
        FINAL,
        `  return Number.isFinite(value)\n` +
          `    ? { ok: true, value: value === 0 ? 0 : value }\n` +
          `    : { ok: false, reason: 'overflow' }`,
      ),
    ],
    killed(),
  ),
  behavioural(
    'P-02',
    'memoises into a bare object, consulted after the grammar guard',
    bareCache('trimmed'),
    survived,
  ),
  behavioural(
    'P-03',
    'returns NaN instead of reporting failure',
    [
      reference(REJECT, `  if (!DECIMAL_GRAMMAR.test(trimmed)) return { ok: true, value: Number.NaN }`),
      reference(
        FINAL,
        `  return Number.isFinite(value) ? { ok: true, value } : { ok: true, value: Number.NaN }`,
      ),
    ],
    killed(),
  ),
  behavioural(
    'P-04',
    'drops the finiteness guard, so overflow escapes as Infinity',
    [reference(FINAL, `  return { ok: true, value }`)],
    killed(),
  ),
  behavioural('P-05', 'omits the trim', [reference(TRIM, `  const trimmed = input`)], killed()),
  behavioural(
    'P-06',
    'uses parseFloat instead of Number',
    [reference(CONVERT, `  const value = parseFloat(trimmed)`)],
    survived,
  ),
  behavioural(
    'P-07',
    'guards with !Number.isNaN instead of Number.isFinite, so Infinity passes',
    [
      reference(
        FINAL,
        `  return !Number.isNaN(value) ? { ok: true, value } : { ok: false, reason: 'overflow' }`,
      ),
    ],
    killed(),
  ),
  behavioural(
    'P-08',
    'adds the global flag to the grammar, which then carries a lastIndex between calls',
    [reference(`?$/`, `?$/g`)],
    killed(),
  ),
  behavioural(
    'P-09',
    'accepts "1_000" by stripping underscores first',
    [reference(TRIM, `  const trimmed = input.trim().replace(/_/g, '')`)],
    killed(),
  ),
  behavioural(
    'P-10',
    'strips every whitespace character rather than only the surrounding ones',
    [reference(TRIM, `  const trimmed = input.replace(/\\s/g, '')`)],
    killed(),
  ),
  behavioural(
    'P-11',
    'requires an integer part, rejecting ".5"',
    [reference(`(?:\\d+(?:\\.\\d*)?|\\.\\d+)`, `(?:\\d+(?:\\.\\d*)?)`)],
    killed(),
  ),
  behavioural('P-12', 'leaves the grammar unanchored on the right', [reference(`?$/`, `?/`)], killed()),
  behavioural(
    'P-13',
    'rounds to fifteen significant digits',
    [reference(CONVERT, `  const value = Number(Number(trimmed).toPrecision(15))`)],
    killed(),
  ),
  behavioural(
    'P-14',
    'uses the global isFinite instead of Number.isFinite',
    [reference(`Number.isFinite(value)`, `isFinite(value)`)],
    survived,
  ),
  behavioural(
    'P-15',
    'trims only the start',
    [reference(TRIM, `  const trimmed = input.trimStart()`)],
    killed(),
  ),
  behavioural(
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
  {
    id: 'P-17',
    kind: 'defect',
    description:
      'memoises into a bare object, consulted first - so an inherited key such as "constructor" is ' +
      'served from Object.prototype. Measured, and the one place where publishing a reason changed ' +
      'which guard catches a defect rather than adding one: under the bare `null` convention the ' +
      'poisoned entry was the answer, and `parseNumber("constructor")` returned a function, so the ' +
      'named case caught it on the value. Here the poisoned entry is an analysis whose `ok` is ' +
      'undefined, so `parseNumber` answers null - which is the right answer - and only the ' +
      'diagnostic still sees anything, returning undefined where the contract requires ' +
      '"not-decimal". The blinded column is what this contract would catch if it published no ' +
      'reason at all: nothing',
    arms: { C: bareCache('input') },
    expected: { 'C/as-committed': killed(), 'C/reason-blind': survived },
  },
  behavioural(
    'P-18',
    'reports failure for every input',
    [reference(REJECT, `  if (trimmed.length >= 0) return { ok: false, reason: 'not-decimal' }\n${REJECT}`)],
    killed(),
  ),
  behavioural(
    'P-19',
    'memoises into a Map, consulted first - the same cache without the inherited keys',
    mapCache(),
    survived,
  ),
  behavioural(
    'P-20',
    'writes the trim by hand as /^\\s+|\\s+$/g',
    [reference(TRIM, `  const trimmed = input.replace(/^\\s+|\\s+$/g, '')`)],
    survived,
  ),
]

// ---------------------------------------------------------------------------
// N-1 to N-3 - defects of reason
// ---------------------------------------------------------------------------

const reasons: readonly Mutant[] = [
  reasonDefect('N-1', 'right value, wrong reason: overflow reported as not-decimal', [
    reference(`reason: 'overflow' }`, `reason: 'not-decimal' }`),
  ]),
  reasonDefect(
    'N-2',
    'a plausible but false reason: the empty string reported as not-decimal, which it also is',
    [reference(EMPTY, `  if (trimmed === '') return { ok: false, reason: 'not-decimal' }`)],
  ),
  reasonDefect(
    'N-3',
    'collapse: every reason reported as one. The form carrying exactly as much information as null ' +
      'while looking like it carries more',
    [
      reference(EMPTY, `  if (trimmed === '') return { ok: false, reason: 'not-decimal' }`),
      reference(`reason: 'overflow' }`, `reason: 'not-decimal' }`),
    ],
  ),
  reasonDefect(
    'N-4',
    'the separator literal declared and never produced: the second look is dropped and every ' +
      'separator mistake falls back into the residual reason. No value changes, because both ' +
      'branches refuse - this is what the contract looked like before the literal existed, and it ' +
      'is the shape a later optimisation of the refusing path would reach by accident',
    [reference(REJECT, `  if (!DECIMAL_GRAMMAR.test(trimmed)) return { ok: false, reason: 'not-decimal' }`)],
  ),
  reasonDefect(
    'N-5',
    'the separator family widened to whitespace, so "4 2" is reported as a separator mistake. It ' +
      'polices the line block 4.4 draws from the other side: the family is the formatting a ' +
      'document emits, never the ordinary space, and without this mutant that line would be a ' +
      'sentence rather than a measurement',
    [reference(SEPARATOR_FAMILY, `input.replace(/[,_'\\s\\u00A0\\u202F]/g, '')`)],
  ),
]

// ---------------------------------------------------------------------------
// The coupling probe
// ---------------------------------------------------------------------------

const probes: readonly Mutant[] = [
  {
    id: 'X-1',
    kind: 'probe',
    description:
      'the two exports written independently, and drifting. `parseNumber` gets its own grammar - ' +
      'the obvious shape when the parsing path is optimised - and `analyse`, which now only ' +
      '`describeParseFailure` reaches, acquires a length cap. Every named case still answers ' +
      'correctly on both, because none of them is longer than twenty characters; only the coupling ' +
      'property can see it',
    arms: {
      C: [
        reference(EMPTY, `${EMPTY}\n  if (trimmed.length > 20) return { ok: false, reason: 'not-decimal' }`),
        reference(
          PARSE_NUMBER,
          `export const parseNumber = (input: string): number | null => {
  const trimmed = input.trim()
  if (!DECIMAL_GRAMMAR.test(trimmed)) return null

  const value = Number(trimmed)

  return Number.isFinite(value) ? value : null
}`,
        ),
      ],
    },
    expected: {
      'C/as-committed': killed([COUPLING_PROPERTY]),
      'C/reason-blind': killed([COUPLING_PROPERTY]),
    },
  },
]

export const battery: Battery = {
  name: 'number-parse',
  contractPath: 'contracts/number/parse',
  timeZone: 'UTC',
  calibrationMutant: 'P-18',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention: 'failure reported as null, with the reason published beside the return channel',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['C'],
      edits: [],
    },
    {
      id: 'reason-blind',
      description:
        'the diagnostic read as if only its presence were published, never which reason it names',
      arms: ['C'],
      edits: [
        {
          file: 'edge-cases.test.ts',
          find: '      expect(describeParseFailure(input)).toBe(reason)',
          replace: '      expect(describeParseFailure(input) === null).toBe(reason === null)',
        },
      ],
    },
  ],

  mutants: [...behaviour, ...reasons, ...probes],
}
