/**
 * The page a contract has, which is the only page of this site that carries the product.
 *
 * ---------------------------------------------------------------------------
 * What the launch takes out, and why an absence is stated rather than rendered
 * ---------------------------------------------------------------------------
 *
 * The project specification describes a contract page for a mature catalogue: the implementations
 * competing under the contract, each with its benchmark figures, its size and its tags. Today there is
 * one implementation per contract and **no reference machine**, so every benchmark list is empty -
 * `implementation-record.ts` says so and says why a figure from a developer laptop would be dishonest.
 *
 * A third of the described page is therefore a table of nothing, and rendering an empty section is
 * worse than not rendering it: it tells a reader something is missing without telling them what. So
 * there is no implementation section. What survives of it is the one figure that *is* measurable
 * today and is the most immediate thing a reader compares against an npm package - **how many bytes
 * land in their project** - and it is stated in the first screen rather than in a table further down.
 *
 * The profiles stay, without figures, because a profile is not a measurement: it is the contract
 * saying which shapes of input an implementation will be timed on, and that is frozen, published and
 * useful on its own.
 *
 * ---------------------------------------------------------------------------
 * Bytes exactly, not rounded
 * ---------------------------------------------------------------------------
 *
 * `cli/report.ts` renders `4.2 kB`, and it is right to: a terminal line is read in passing. A page has
 * room for the number, and the number is the argument. `readableBytes` stays where it is.
 */

import { renderContract } from '../registry/address.js'
import type { CaseRecord, CaseTableRecord, ExportRecord } from '../registry/contract-record.js'
import type { Document, Node } from './document.js'
import { el, text } from './document.js'
import type { Held } from './catalogue.js'
import { literal } from './literal.js'
import { pageOf, rootFrom } from './paths.js'

const NOTHING = {} as const

const line = (tag: string, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/** A number with the thousands marked, because a byte count is read as a quantity. */
const grouped = (value: number): string => value.toLocaleString('en-US').replaceAll(',', ' ')

/**
 * One case, as the call it is.
 *
 * The fields of a case begin with the arguments of the contract's own signature, in the signature's
 * order - `registry/signature.ts` reads that call and `registry/serialise.ts` refuses a contract where
 * it stops being true - so what is left after them is the answer. A single answer field is written
 * bare, because there is nothing to tell it apart from; two or more are named.
 */
const renderedCase = (entry: CaseRecord, answer: ExportRecord): Node => {
  const fields = entry.data.kind === 'record' ? entry.data.fields : []
  const call = fields.slice(0, answer.parameters.length).map((field) => literal(field.value))
  const answered = fields.slice(answer.parameters.length)

  const result =
    answered.length === 1
      ? literal((answered[0] as (typeof answered)[number]).value)
      : answered.map((field) => `${field.name} ${literal(field.value)}`).join(', ')

  return el(
    'div',
    { id: entry.id },
    el('a', { class: 'anchor', href: `#${entry.id}`, 'aria-hidden': 'true' }, text('#')),
    el('p', { class: 'call' }, line('code', `${answer.name}(${call.join(', ')}) → ${result}`)),
    line('p', entry.rationale, { class: 'why' }),
    ...(entry.provenance.kind === 'found-by-mutation'
      ? [
          line(
            'p',
            `This case exists because a mutant survived without it: ` +
              `${entry.provenance.mutant.battery}/${entry.provenance.mutant.mutant}.`,
            { class: 'meta' },
          ),
        ]
      : []),
  )
}

const renderedTable = (table: CaseTableRecord, answer: ExportRecord): readonly Node[] => [
  line('h3', table.purpose),
  el('div', { class: 'cases' }, ...table.cases.map((entry) => renderedCase(entry, answer))),
]

export const contractPage = (held: Held): Document => {
  const { contract, implementation } = held
  const name = renderContract(contract.address)
  const answer = contract.surface.exports.find((entry) => entry.role === 'the-answer') as ExportRecord
  const cases = contract.caseTables.reduce((count, table) => count + table.cases.length, 0)
  const bytes = implementation.files.reduce((total, file) => total + file.bytes, 0)

  return {
    title: `${name} — ${contract.identity.summary}`,
    /**
     * Composed rather than borrowed from the summary, which the title already carries. A search
     * result showing one sentence twice wastes the only two lines it gets, and the differentiator -
     * how many decisions are settled, and what installing costs - is the half a reader cannot guess.
     */
    description:
      `${cases} named edge cases, settled and frozen. TypeScript source copied into your project: ` +
      `${implementation.files.length === 1 ? 'one file' : `${implementation.files.length} files`}, ` +
      `${grouped(bytes)} bytes, no dependencies.`,
    body: [
      el('nav', NOTHING, el('a', { href: rootFrom(pageOf(contract.address)) }, text('Toopo'))),

      line('h1', name),
      line('p', contract.identity.summary, { class: 'lede' }),

      line('pre', `toopo add ${contract.address.name}`),
      line(
        'p',
        `${implementation.files.length === 1 ? 'One file' : `${implementation.files.length} files`}, ` +
          `${grouped(bytes)} bytes, copied into your project. It imports nothing. ` +
          `You get ${contract.surface.exports.map((entry) => entry.name).join(' and ')}.`,
        { class: 'meta' },
      ),

      line('h2', 'What it does'),
      line('p', contract.identity.description),
      ...(contract.identity.relationToTheLanguage === undefined
        ? []
        : [line('p', contract.identity.relationToTheLanguage)]),

      line('h2', 'What it is for, and what it is not'),
      line('p', contract.identity.inputDomain),

      line('h2', 'Signature'),
      ...contract.surface.exports.map((entry) =>
        line('pre', `type ${entry.typeName} = ${entry.text}`),
      ),
      ...contract.surface.supportingTypes.map((entry) =>
        line('pre', `type ${entry.name} = ${entry.text}`),
      ),
      ...(contract.surface.failureReasons === undefined
        ? []
        : [
            line(
              'p',
              `A call fails for one of ${contract.surface.failureReasons.length} reasons, and the ` +
                `set is frozen with the major version: ` +
                `${contract.surface.failureReasons.map((reason) => `"${reason}"`).join(', ')}.`,
            ),
          ]),
      ...(contract.surface.couplingRule === undefined
        ? []
        : [line('p', `${contract.surface.couplingRule}.`)]),

      line('h2', `${cases} settled cases`),
      line(
        'p',
        `Every one of them is named, frozen with the major version, and linkable. This is what the ` +
          `contract decides, one input at a time.`,
      ),
      ...contract.caseTables.flatMap((table) => renderedTable(table, answer)),

      line('h2', 'Properties'),
      line(
        'p',
        `Every property below is checked on ${grouped(contract.properties.runs)} generated cases per ` +
          `run, re-seeded each time.`,
      ),
      el(
        'ul',
        { class: 'plain' },
        ...contract.properties.universal.map((property) =>
          el(
            'li',
            NOTHING,
            line('code', `${property.name} — ${property.applicable ? 'checked' : 'not applicable'}`),
            line('p', property.reason, { class: 'why' }),
          ),
        ),
      ),

      line('h2', 'Benchmark profiles'),
      line(
        'p',
        `The shapes of input an implementation is timed on. No figures yet: there is no reference ` +
          `machine, and a number produced on a developer laptop would be a number with nothing ` +
          `behind it.`,
      ),
      el(
        'ul',
        { class: 'plain' },
        ...contract.benchmarks.profiles.map((profile) =>
          el(
            'li',
            NOTHING,
            line('code', `${profile.name} — ${profile.class}`),
            line('p', profile.description, { class: 'why' }),
          ),
        ),
      ),

      line('h2', 'What you can check yourself'),
      line(
        'p',
        `This definition is frozen. Its canonical text hashes to ${held.binding.digest}, and the ` +
          `${contract.harness.length} files of its test harness are listed inside it with their own ` +
          `hashes — so you can fetch them, run them against any implementation, and never take our ` +
          `word for any of it.`,
      ),
      line('p', `Written for ${contract.environments.join(', ')}.`, { class: 'meta' }),
    ],
  }
}
