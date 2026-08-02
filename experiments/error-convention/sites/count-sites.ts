/**
 * Experiment material. Counts the six call sites in the three forms.
 *
 *   node experiments/error-convention/sites/count-sites.ts
 *
 * Counted rather than eyeballed, and counted the same way for the three forms, because the whole
 * claim of the site measurement is a comparison of sizes. Every metric below is defined so that a
 * reader can check it against the source by hand.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

const SITES = [
  { id: '1 default value', base: 'site-1-default-value', extension: 'ts' },
  { id: '2 form message', base: 'site-2-form-message', extension: 'ts' },
  { id: '3 csv import', base: 'site-3-csv-import', extension: 'ts' },
  { id: '4 environment var', base: 'site-4-environment-variable', extension: 'ts' },
  { id: '5 composition', base: 'site-5-composition', extension: 'ts' },
  { id: '6 plain javascript', base: 'site-6-plain-javascript', extension: 'js' },
  { id: 'chain of four', base: 'chain-renewal', extension: 'ts' },
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
  occurrences(body, ['parseNumber(', 'describeFailure(', 'addToDate('])

/** Contract logic restated in the caller. The grammar is the only one any site copies. */
const grammarRestatements = (body: string): number => occurrences(body, ['DECIMAL_GRAMMAR ='])

const rows = SITES.flatMap((site) =>
  FORMS.map((form) => {
    const source = readFileSync(
      join(HERE, `${site.base}.${form}.${site.extension}`),
      'utf8',
    ).replace(/\r\n/g, '\n')

    const body = codeLines(source).join('\n')

    return {
      site: site.id,
      form,
      lines: codeLines(source).length,
      unwrappings: unwrappings(body),
      calls: registryCalls(body),
      grammar: grammarRestatements(source),
    }
  }),
)

const column = (label: string, width: number) => label.padEnd(width)

process.stdout.write(
  `${column('site', 20)}${column('form', 6)}${column('lines', 7)}${column('unwrap', 8)}` +
    `${column('calls', 7)}grammar copied\n`,
)

for (const row of rows) {
  process.stdout.write(
    `${column(row.site, 20)}${column(row.form, 6)}${column(String(row.lines), 7)}` +
      `${column(String(row.unwrappings), 8)}${column(String(row.calls), 7)}${row.grammar}\n`,
  )
}

process.stdout.write('\n')

for (const form of FORMS) {
  const of = rows.filter((row) => row.form === form)
  const sum = (key: 'lines' | 'unwrappings' | 'calls' | 'grammar') =>
    of.reduce((total, row) => total + row[key], 0)

  process.stdout.write(
    `total ${form}   lines ${String(sum('lines')).padStart(3)}   ` +
      `unwrappings ${String(sum('unwrappings')).padStart(3)}   ` +
      `registry calls ${String(sum('calls')).padStart(3)}   ` +
      `grammar copies ${sum('grammar')}\n`,
  )
}
