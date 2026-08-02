/**
 * Experiment material. Counts the three `date/add@1` call sites in the three forms.
 *
 *   node experiments/error-convention/sites/count-sites.ts
 *
 * Counted rather than eyeballed, and counted the same way for the three forms, because the whole
 * claim of the site measurement is a comparison of sizes. Every metric below is defined so that a
 * reader can check it against the source by hand.
 *
 * The metric definitions are round 2's, unchanged, so that these rows can be read next to the
 * thirteen sites that round measured. Two things are added rather than altered: a row for code that
 * exists in one form only and is counted once, and a count of branches that exist solely to satisfy
 * a type whose impossible state the contract has already excluded.
 *
 * One known impurity, left in place rather than patched, because comparability with round 2 is worth
 * more than tidiness: `?? ` counts as an unwrapping, and site 8 uses it once per form for a Map
 * default that unwraps nothing. It adds one to each of the three columns and changes no comparison.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

const SITES = [
  { id: '7 schedule form', base: 'site-7-schedule-form' },
  { id: '8 batch report', base: 'site-8-batch-report' },
  { id: '9 backoff cap', base: 'site-9-backoff-cap' },
] as const

/**
 * Code a form needs that is not a call site: the caller-side reconstruction of the failure reason,
 * which only form A requires. Counted once, which is the strongest version of form A - a developer
 * needing the reason at two sites factors it out after the second.
 */
const SHARED = [
  { id: 'caller-side reason', form: 'a', path: 'forms/classify-add-failure.ts' },
] as const

const FORMS = ['a', 'b', 'c'] as const

/** Lines that carry code: not blank, not a comment, not an import. */
const codeLines = (source: string): readonly string[] =>
  source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .filter((line) => !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*'))
    .filter((line) => !line.startsWith('import ') && !line.startsWith('} from'))

const occurrences = (source: string, needles: readonly string[]): number =>
  needles.reduce((total, needle) => total + (source.split(needle).length - 1), 0)

/**
 * Steps that exist only to reach the payload: testing the discriminant, or reading through it.
 * `?? default` counts as one: it is the null form's whole unwrapping, written as an operator.
 */
const unwrappings = (body: string): number =>
  occurrences(body, ['.ok', '.value', '.reason', '.date', '?? ', '=== null', '!== null'])

/** Calls into the registry, counted in the source rather than at runtime. */
const registryCalls = (body: string): number =>
  occurrences(body, ['addToDate(', 'describeAddFailure('])

/** Calls into the caller's own reimplementation of the contract. Only form A has any. */
const reconstructionCalls = (body: string): number => occurrences(body, ['classifyAddFailure('])

/**
 * Branches the caller must write for a state the contract has already excluded. Form C's diagnostic
 * export returns `reason | null` and the `null` cannot occur after a refusal, but the type carries
 * it and the compiler cannot be told about the coupling.
 */
const unreachableGuards = (body: string): number => occurrences(body, ["'unreachable:"])

const measure = (relativePath: string) => {
  const source = readFileSync(join(HERE, relativePath), 'utf8').replace(/\r\n/g, '\n')
  const body = codeLines(source).join('\n')

  return {
    lines: codeLines(source).length,
    unwrappings: unwrappings(body),
    calls: registryCalls(body),
    reconstruction: reconstructionCalls(body),
    unreachable: unreachableGuards(body),
  }
}

const rows = [
  ...SITES.flatMap((site) =>
    FORMS.map((form) => ({ site: site.id, form, ...measure(`${site.base}.${form}.ts`) })),
  ),
  ...SHARED.map((shared) => ({ site: shared.id, form: shared.form, ...measure(shared.path) })),
]

const column = (label: string, width: number) => label.padEnd(width)

process.stdout.write(
  `${column('site', 22)}${column('form', 6)}${column('lines', 7)}${column('unwrap', 8)}` +
    `${column('calls', 7)}${column('rebuild', 9)}unreachable\n`,
)

for (const row of rows) {
  process.stdout.write(
    `${column(row.site, 22)}${column(row.form, 6)}${column(String(row.lines), 7)}` +
      `${column(String(row.unwrappings), 8)}${column(String(row.calls), 7)}` +
      `${column(String(row.reconstruction), 9)}${row.unreachable}\n`,
  )
}

process.stdout.write('\n')

for (const form of FORMS) {
  const of = rows.filter((row) => row.form === form)
  const sum = (key: 'lines' | 'unwrappings' | 'calls' | 'reconstruction' | 'unreachable') =>
    of.reduce((total, row) => total + row[key], 0)

  process.stdout.write(
    `total ${form}   lines ${String(sum('lines')).padStart(3)}   ` +
      `unwrappings ${String(sum('unwrappings')).padStart(3)}   ` +
      `registry calls ${String(sum('calls')).padStart(2)}   ` +
      `reconstruction calls ${sum('reconstruction')}   ` +
      `unreachable branches ${sum('unreachable')}\n`,
  )
}
