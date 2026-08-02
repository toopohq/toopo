/**
 * Experiment material. The `number/parse@1` mutation battery, P-01 to P-20, as data.
 *
 * The three cache mutants annotate the variable they store, `const result: T = ...`, rather than
 * letting it be inferred. Measured, and not a stylistic preference: under the union arm an inferred
 * `{ ok: false, reason: 'overflow' }` widens `reason` to `string`, the mutant stops compiling, and
 * the run reddens with no guard having observed anything. Both caches were reported as killed by the
 * union and survived by `null` on the first run, which is a difference between the two conventions
 * that does not exist.
 *
 * It is written down rather than retyped from memory because round 2 opened by discovering that
 * round 1's battery existed nowhere: not in a commit, not in a stash, not in an untracked file. A
 * battery that lives only in a conversation cannot be replayed, and a verdict that cannot be
 * replayed is an opinion. The two batteries also collided on the name `M17`, which meant two
 * different defects in two different contracts; the `P-` and `D-` prefixes exist so that a mutant
 * has one name in the whole project.
 *
 * Each mutant is expressed once per arm, because the same defect is not the same text in two error
 * conventions. Where a defect touches only the grammar, the trimming or the conversion, the two arms
 * share the edit; where it touches a return path, they cannot.
 */

import type { Battery, Edit, Mutant } from './run.ts'

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites, quoted from the two references
// ---------------------------------------------------------------------------

const GRAMMAR = `const DECIMAL_GRAMMAR = /^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?$/`
const TRIM = `  const trimmed = input.trim()`
const CONVERT = `  const value = Number(trimmed)`

const A_REJECT = `  if (!DECIMAL_GRAMMAR.test(trimmed)) return null`
const A_FINAL = `  return Number.isFinite(value) ? value : null`

const B_REJECT = `  if (!DECIMAL_GRAMMAR.test(trimmed)) return { ok: false, reason: 'not-decimal' }`
const B_FINAL = `  return Number.isFinite(value) ? { ok: true, value } : { ok: false, reason: 'overflow' }`

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

/** A defect that touches neither return path is one edit applied to both arms. */
const shared = (id: string, description: string, edits: readonly Edit[]): Mutant => ({
  id,
  description,
  arms: { A: edits, B: edits },
})

// ---------------------------------------------------------------------------
// The three caches - P-02, P-17 and P-19 differ only in where they are consulted
// and what they are built out of, which is the whole point of carrying all three
// ---------------------------------------------------------------------------

const bareCache = (key: string, arm: 'A' | 'B'): readonly Edit[] => {
  const type = arm === 'A' ? 'number | null' : 'ParseNumberResult'
  const final = arm === 'A' ? A_FINAL : B_FINAL
  const expression = final.replace('  return ', '')

  return [
    reference(GRAMMAR, `const CACHE: Record<string, ${type}> = {}\n\n${GRAMMAR}`),
    reference(
      key === 'input' ? TRIM : CONVERT,
      `  const cached = CACHE[${key}]\n  if (cached !== undefined) return cached\n\n` +
        `${key === 'input' ? TRIM : CONVERT}`,
    ),
    reference(
      final,
      `  const result: ${type} = ${expression}\n  CACHE[${key}] = result\n\n  return result`,
    ),
  ]
}

const mapCache = (arm: 'A' | 'B'): readonly Edit[] => {
  const type = arm === 'A' ? 'number | null' : 'ParseNumberResult'
  const final = arm === 'A' ? A_FINAL : B_FINAL
  const expression = final.replace('  return ', '')

  return [
    reference(GRAMMAR, `const CACHE = new Map<string, ${type}>()\n\n${GRAMMAR}`),
    reference(
      TRIM,
      `  const cached = CACHE.get(input)\n  if (cached !== undefined) return cached\n\n${TRIM}`,
    ),
    reference(
      final,
      `  const result: ${type} = ${expression}\n  CACHE.set(input, result)\n\n  return result`,
    ),
  ]
}

// ---------------------------------------------------------------------------
// The battery
// ---------------------------------------------------------------------------

export const mutants: readonly Mutant[] = [
  {
    id: 'P-01',
    description: 'normalises negative zero to zero',
    arms: {
      A: [reference(A_FINAL, `  return Number.isFinite(value) ? (value === 0 ? 0 : value) : null`)],
      B: [
        reference(
          B_FINAL,
          `  return Number.isFinite(value)\n` +
            `    ? { ok: true, value: value === 0 ? 0 : value }\n` +
            `    : { ok: false, reason: 'overflow' }`,
        ),
      ],
    },
  },
  {
    id: 'P-02',
    description: 'memoises into a bare object, consulted after the grammar guard',
    arms: { A: bareCache('trimmed', 'A'), B: bareCache('trimmed', 'B') },
  },
  {
    id: 'P-03',
    description: 'returns NaN instead of reporting failure',
    arms: {
      A: [
        reference(A_REJECT, `  if (!DECIMAL_GRAMMAR.test(trimmed)) return Number.NaN`),
        reference(A_FINAL, `  return Number.isFinite(value) ? value : Number.NaN`),
      ],
      B: [
        reference(
          B_REJECT,
          `  if (!DECIMAL_GRAMMAR.test(trimmed)) return { ok: true, value: Number.NaN }`,
        ),
        reference(
          B_FINAL,
          `  return Number.isFinite(value) ? { ok: true, value } : { ok: true, value: Number.NaN }`,
        ),
      ],
    },
  },
  {
    id: 'P-04',
    description: 'drops the finiteness guard, so overflow escapes as Infinity',
    arms: {
      A: [reference(A_FINAL, `  return value`)],
      B: [reference(B_FINAL, `  return { ok: true, value }`)],
    },
  },
  shared('P-05', 'omits the trim', [reference(TRIM, `  const trimmed = input`)]),
  shared('P-06', 'uses parseFloat instead of Number', [
    reference(CONVERT, `  const value = parseFloat(trimmed)`),
  ]),
  {
    id: 'P-07',
    description: 'guards with !Number.isNaN instead of Number.isFinite, so Infinity passes',
    arms: {
      A: [reference(A_FINAL, `  return !Number.isNaN(value) ? value : null`)],
      B: [
        reference(
          B_FINAL,
          `  return !Number.isNaN(value) ? { ok: true, value } : { ok: false, reason: 'overflow' }`,
        ),
      ],
    },
  },
  shared('P-08', 'adds the global flag to the grammar, which then carries a lastIndex between calls', [
    reference(`?$/`, `?$/g`),
  ]),
  shared('P-09', 'accepts "1_000" by stripping underscores first', [
    reference(TRIM, `  const trimmed = input.trim().replace(/_/g, '')`),
  ]),
  shared('P-10', 'strips every whitespace character rather than only the surrounding ones', [
    reference(TRIM, `  const trimmed = input.replace(/\\s/g, '')`),
  ]),
  shared('P-11', 'requires an integer part, rejecting ".5"', [
    reference(`(?:\\d+(?:\\.\\d*)?|\\.\\d+)`, `(?:\\d+(?:\\.\\d*)?)`),
  ]),
  shared('P-12', 'leaves the grammar unanchored on the right', [reference(`?$/`, `?/`)]),
  shared('P-13', 'rounds to fifteen significant digits', [
    reference(CONVERT, `  const value = Number(Number(trimmed).toPrecision(15))`),
  ]),
  shared('P-14', 'uses the global isFinite instead of Number.isFinite', [
    reference(`Number.isFinite(value)`, `isFinite(value)`),
  ]),
  shared('P-15', 'trims only the start', [reference(TRIM, `  const trimmed = input.trimStart()`)]),
  shared('P-16', 'writes a call counter onto globalThis', [
    reference(
      TRIM,
      `  const counters = globalThis as unknown as { __parseNumberCalls?: number }\n` +
        `  counters.__parseNumberCalls = (counters.__parseNumberCalls ?? 0) + 1\n\n${TRIM}`,
    ),
  ]),
  {
    id: 'P-17',
    description:
      'memoises into a bare object, consulted first - so an inherited key such as "constructor" ' +
      'is served from Object.prototype and a function leaves the function',
    arms: { A: bareCache('input', 'A'), B: bareCache('input', 'B') },
  },
  {
    id: 'P-18',
    description: 'reports failure for every input',
    arms: {
      A: [reference(A_REJECT, `  if (trimmed.length >= 0) return null\n${A_REJECT}`)],
      B: [
        reference(
          B_REJECT,
          `  if (trimmed.length >= 0) return { ok: false, reason: 'not-decimal' }\n${B_REJECT}`,
        ),
      ],
    },
  },
  {
    id: 'P-19',
    description: 'memoises into a Map, consulted first - the same cache without the inherited keys',
    arms: { A: mapCache('A'), B: mapCache('B') },
  },
  shared('P-20', 'writes the trim by hand as /^\\s+|\\s+$/g', [
    reference(TRIM, `  const trimmed = input.replace(/^\\s+|\\s+$/g, '')`),
  ]),
]

// ---------------------------------------------------------------------------
// Arms and lenses
// ---------------------------------------------------------------------------

export const battery: Battery = {
  contractPath: 'contracts/number/parse',

  arms: [
    { id: 'A', ref: 'main', convention: 'failure reported as null' },
    {
      id: 'B',
      ref: 'experiment/discriminated-union',
      convention: 'failure reported as a discriminated union carrying a reason',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['A', 'B'], edits: [] },
    {
      id: 'faithful-p1',
      description:
        'P1 rewritten to enumerate the licit output forms instead of testing a discriminant it ' +
        'assumes exists. Round 1 translated `result === null || Number.isFinite(result)` as ' +
        '`!result.ok || Number.isFinite(result.value)`, which passes on any value whose `ok` is ' +
        'absent - exactly the values P1 exists to catch.',
      arms: ['B'],
      edits: [
        {
          file: 'properties.test.ts',
          find: `        return !result.ok || Number.isFinite(result.value)`,
          replace: `        return result.ok === false || (result.ok === true && Number.isFinite(result.value))`,
        },
      ],
    },
  ],

  mutants,
}
