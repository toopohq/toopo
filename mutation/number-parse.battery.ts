/**
 * The `number/parse@1` battery.
 *
 * P-01 to P-20 are defects of behaviour and carry the mutation score. N-1 to N-5 are defects of
 * reason: they answer every call with the value the contract asks for and are wrong only about why
 * a refusal happened. F-3, F-4 and X-1 are probes rather than defects - they ask whether a property
 * can reach the region it claims to guard, and whether two exports can drift apart - so they are
 * kept out of the score.
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

import type { Battery, Edit, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, probe, reference, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: ['reason-blind'] }

const { behavioural, onlySeenUnblinded } = mutantsOn(UNDER)

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

const COUPLING_PROPERTY = 'P4 - a string fails to parse exactly when it has a description'

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
  onlySeenUnblinded(
    'P-17',
    'memoises into a bare object, consulted first - so an inherited key such as "constructor" is ' +
      'served from Object.prototype. Measured, and the one place where publishing a reason changed ' +
      'which guard catches a defect rather than adding one: under the bare `null` convention the ' +
      'poisoned entry was the answer, and `parseNumber("constructor")` returned a function, so the ' +
      'named case caught it on the value. Here the poisoned entry is an analysis whose `ok` is ' +
      'undefined, so `parseNumber` answers null - which is the right answer - and only the ' +
      'diagnostic still sees anything, returning undefined where the contract requires ' +
      '"not-decimal". The blinded column is what this contract would catch if it published no ' +
      'reason at all: nothing',
    bareCache('input'),
  ),
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
  onlySeenUnblinded('N-1', 'right value, wrong reason: overflow reported as not-decimal', [
    reference(`reason: 'overflow' }`, `reason: 'not-decimal' }`),
  ]),
  onlySeenUnblinded(
    'N-2',
    'a plausible but false reason: the empty string reported as not-decimal, which it also is',
    [reference(EMPTY, `  if (trimmed === '') return { ok: false, reason: 'not-decimal' }`)],
  ),
  onlySeenUnblinded(
    'N-3',
    'collapse: every reason reported as one. The form carrying exactly as much information as null ' +
      'while looking like it carries more',
    [
      reference(EMPTY, `  if (trimmed === '') return { ok: false, reason: 'not-decimal' }`),
      reference(`reason: 'overflow' }`, `reason: 'not-decimal' }`),
    ],
  ),
  onlySeenUnblinded(
    'N-4',
    'the separator literal declared and never produced: the second look is dropped and every ' +
      'separator mistake falls back into the residual reason. No value changes, because both ' +
      'branches refuse - this is what the contract looked like before the literal existed, and it ' +
      'is the shape a later optimisation of the refusing path would reach by accident',
    [reference(REJECT, `  if (!DECIMAL_GRAMMAR.test(trimmed)) return { ok: false, reason: 'not-decimal' }`)],
  ),
  onlySeenUnblinded(
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

const NO_STRAY_VALUE = 'P1 - returns null or a finite number, never NaN and never Infinity'

const probes: readonly Mutant[] = [
  probe(
    UNDER,
    'F-3',
    'returns NaN for every call, accepted or refused. The control that separates "P1 cannot fail" ' +
      'from "P1 was never reached", written here because `date/add@1` carries the same pair and this ' +
      'contract carried neither: if F-3 does not redden P1, the property is decorative whatever its ' +
      'generators draw; if it does, the property is sound and only its support is in question. ' +
      'Measured, it reddens P1 and P3 and nothing else among the properties - not P2, because ' +
      'Object.is calls NaN equal to NaN so a uniformly broken answer is still insensitive to ' +
      'whitespace, and not the coupling, because a call that never refuses never disagrees with a ' +
      'diagnostic that never describes',
    [
      reference(EMPTY, `  if (trimmed === '') return { ok: true, value: Number.NaN }`),
      reference(
        REJECT,
        `  if (!DECIMAL_GRAMMAR.test(trimmed)) return { ok: true, value: Number.NaN }`,
      ),
      reference(FINAL, `  return { ok: true, value: Number.NaN }`),
    ],
    killed([NO_STRAY_VALUE]),
  ),
  probe(
    UNDER,
    'F-4',
    'returns NaN on the overflow path and nowhere else - the same forbidden value as F-3, moved ' +
      'off every input the named cases pin and onto the one region P1 exists to police at its ' +
      'boundary. It asks the question F-1 asked of `date/add@1` and answered against it there: are ' +
      'the generators reaching the region, or is the named case 1e400 the only thing standing ' +
      'between this contract and a stray value? Measured, P1 reddens on its own, so the answer is ' +
      'the opposite of the one F-1 got: the arbitraries really do build an exponent past 308 - ' +
      '`wellFormedDecimal` draws up to twelve exponent digits - and this contract does not carry ' +
      'the gap that made `date/add@1` widen the support of its P1. The named case 1e400 is not the ' +
      'only thing standing between this contract and a stray value',
    [
      reference(
        FINAL,
        `  return Number.isFinite(value) ? { ok: true, value } : { ok: true, value: Number.NaN }`,
      ),
    ],
    killed([NO_STRAY_VALUE]),
  ),
  probe(
    UNDER,
    'X-1',
    'the two exports written independently, and drifting. `parseNumber` gets its own grammar - ' +
      'the obvious shape when the parsing path is optimised - and `analyse`, which now only ' +
      '`describeParseFailure` reaches, acquires a length cap. Every named case still answers ' +
      'correctly on both, because none of them is longer than twenty characters; only the coupling ' +
      'property can see it',
    [
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
    killed([COUPLING_PROPERTY]),
  ),
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

  unreachableGuards: [
    {
      reason:
        'over the contract\'s own declarations rather than over the implementation. This battery ' +
        'injects into `reference.ts`, so nothing it can do reaches a guard that reads the table, the ' +
        'profile list or the universal-property declarations.',
      titles: [
        'settles each input exactly once',
        'names a case for every declared reason, and declares every reason it names',
        'publishes a rationale for every decision',
        'declares a non-empty sample set for every profile',
        'keeps the inapplicable universal properties declared as such',
      ],
    },
  ],

  unwitnessedGuards: [
    {
      reason:
        'block 4.2 has no defect in this battery. These four are reachable - `array/group-by@1` ' +
        'carries S-1 to S-8 and every one of them reddens the equivalent guard there - and simply ' +
        'unwritten, which is the debt this attribution exists to make visible rather than to hide.',
      titles: [
        'matches the type declared by the contract',
        'accepts a string and nothing else',
        'returns a number that may be absent, never NaN-as-number-only',
        'publishes the diagnostic surface with the type the contract declares',
      ],
    },
  ],

  mutants: [...behaviour, ...reasons, ...probes],
}
