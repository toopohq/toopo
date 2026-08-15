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

import { renderContract } from '../packages/registry/address.js'
import type { CaseGroup } from '../packages/catalogue/identifier.js'
import type { CaseRecord, CaseTableRecord, ExportRecord } from '../packages/registry/contract-record.js'
import type { Document, Node } from './document.js'
import { el, text } from './document.js'
import type { Held } from './catalogue.js'
import { literal } from './literal.js'
import { THE_ENTRY_POINT, THE_REFERENCE_MODULE, pageOf, rootFrom } from './paths.js'
import { playgroundOf, theCallOf } from './playground.js'

const NOTHING = {} as const

/**
 * The one sentence this site makes about the gap between what is hashed and what runs.
 *
 * It belongs beside the playground and nowhere else - not under *What you can check yourself*, which
 * is about the frozen definition and stays exactly as true as it was. This is the only place on the
 * site where a reader is looking at an answer that transformation produced, so this is the only place
 * the transformation is worth a reader's attention.
 *
 * Exported because `pages.test.ts` asserts both halves of that - present here, absent everywhere else -
 * and a guard matching a sentence it had transcribed would be a second copy going stale on the first
 * reword.
 */
export const whatRunsInYourBrowser = (name: string): string =>
  `The JavaScript this runs is ${name}'s own reference.ts with its types stripped. That is neither ` +
  `the file the registry serves nor the file its digest covers: both are TypeScript, and no browser ` +
  `runs TypeScript. It is also the only part of this page that needs JavaScript at all.`

const line = (tag: string, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/** A number with the thousands marked, because a byte count is read as a quantity. */
const grouped = (value: number): string => value.toLocaleString('en-US').replaceAll(',', ' ')

/**
 * One case, as the call it is.
 *
 * The fields of a case begin with the arguments of the contract's own signature, in the signature's
 * order - `packages/registry/signature.ts` reads that call and `packages/registry/serialise.ts` refuses a contract where
 * it stops being true - so what is left after them is the answer. A single answer field is written
 * bare, because there is nothing to tell it apart from; two or more are named.
 */
const renderedCase = (entry: CaseRecord, answer: ExportRecord): Node => {
  const { written: call, answered } = theCallOf(entry, answer)

  const result =
    answered.length === 1
      ? literal((answered[0] as (typeof answered)[number]).value)
      : answered.map((field) => `${field.name} ${literal(field.value)}`).join(', ')

  return el(
    'div',
    { id: entry.id },
    anchorTo(entry.id),
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

/**
 * The link back to an element's own address.
 *
 * `aria-hidden` is one statement and not two: a screen reader skips it and the text projection drops
 * it, because a `#` on its own means nothing read aloud.
 */
const anchorTo = (id: string): Node =>
  el('a', { class: 'anchor', href: `#${id}`, 'aria-hidden': 'true' }, text('#'))

/**
 * A heading that carries its own address, the way a case does.
 *
 * The tag is the outline and the class is the appearance, and they are separated on purpose: how
 * deeply a group is nested depends on whether its contract has one table or two, and how a group
 * *looks* must not.
 */
const addressed = (tag: string, id: string, title: string): Node =>
  el(tag, { id, class: 'group' }, anchorTo(id), text(title))

/**
 * One group of a table: its heading, then the cases that sit under it.
 *
 * The cases are selected by their group rather than sliced by position. `serialise.ts` has already
 * refused a table whose groups are not contiguous, so the two agree - and a filter says what this
 * renders, where an index would say only where it found it.
 *
 * A `note` is rendered whenever the group carries one. There is no state where a note is declared
 * and not shown: the field is what reaches the page, and a sentence stored and never served would
 * be the class `coverage.test.ts` refuses on the record.
 */
const renderedGroup = (
  group: CaseGroup,
  table: CaseTableRecord,
  answer: ExportRecord,
  heading: string,
): readonly Node[] => [
  addressed(heading, group.id, group.title),
  ...(group.note === null ? [] : [line('p', group.note, { class: 'why' })]),
  el(
    'div',
    { class: 'cases' },
    ...table.cases
      .filter((entry) => entry.group === group.id)
      .map((entry) => renderedCase(entry, answer)),
  ),
]

/**
 * A table, as its purpose and then its groups - and the purpose is a heading only when there is
 * something for it to separate.
 *
 * **A contract with one table gets two levels, not three.** Its `purpose` is a sentence in the lower
 * case a sentence is written in, and a heading that is not a title is a real defect rather than an
 * untidy one: it enters the document outline, a screen reader announces it as a section, and there
 * is nothing on the other side of it because there is no second table. So it is a paragraph, and the
 * groups move up to `h3`.
 *
 * `date/add@1` and `array/group-by@1` carry two tables, and there the purpose separates something a
 * reader has to know they have crossed - typed callers against callers no type reaches - so it stays
 * a heading and the groups sit under it at `h4`.
 */
const renderedTable = (
  table: CaseTableRecord,
  answer: ExportRecord,
  alone: boolean,
): readonly Node[] => [
  alone
    ? line('p', `${table.purpose}.`, { class: 'meta' })
    : line('h3', table.purpose, { class: 'table' }),
  ...table.groups.flatMap((group) => renderedGroup(group, table, answer, alone ? 'h3' : 'h4')),
]

export const contractPage = (held: Held): Document => {
  const { contract, implementation } = held
  const name = renderContract(contract.address)
  const answer = contract.surface.exports.find((entry) => entry.role === 'the-answer') as ExportRecord
  const cases = contract.caseTables.reduce((count, table) => count + table.cases.length, 0)
  const bytes = implementation.files.reduce((total, file) => total + file.bytes, 0)
  const playground = playgroundOf(contract, name)

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
      ...contract.caseTables.flatMap((table) =>
        renderedTable(table, answer, contract.caseTables.length === 1),
      ),

      line('h2', 'Try it on your own input'),
      line(
        'p',
        `This calls ${playground.calls} on whatever you type. Each field holds a literal, written ` +
          `exactly the way the cases above are written, and the form opens on ${playground.opensOnCase} ` +
          `so there is a call that works to edit. What comes back is what the function answered — the ` +
          `settled answer is on the case's own line above, and is deliberately not repeated here.` +
          (playground.describes === null
            ? ''
            : ` When it answers nothing, ${playground.describes} is called on the same input and its ` +
              `reason is printed underneath: the two exports are one surface, and every input this ` +
              `contract turns down answers ${playground.calls} alike.`),
      ),
      line('p', whatRunsInYourBrowser(contract.address.name), { class: 'meta' }),
      el('div', {
        id: 'playground',
        'data-playground': JSON.stringify({
          calls: playground.calls,
          describes: playground.describes,
          module: THE_REFERENCE_MODULE,
          fields: playground.fields,
        }),
      }),

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
            el(
              'p',
              { class: 'call' },
              line('code', `${property.name} — ${property.applicable ? 'checked' : 'not applicable'}`),
            ),
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
            el('p', { class: 'call' }, line('code', `${profile.name} — ${profile.class}`)),
            line('p', profile.description, { class: 'why' }),
          ),
        ),
      ),

      line('h2', 'What you can check yourself'),
      line(
        'p',
        /**
         * It used to end *so you can fetch them*, and there is nowhere to fetch them from: no server
         * is published, and the archive `toopo` ships in deliberately carries only what a command
         * reads. What content addressing really buys is the sentence below - a copy obtained from
         * anywhere can be checked against this definition before it is trusted - and that is true
         * today, of any copy, from any source, which is the whole point of a digest.
         */
        `This definition is frozen. Its canonical text hashes to ${held.binding.digest}, and the ` +
          `${contract.harness.length} files of its test harness are listed inside it with their own ` +
          `hashes — so a copy of the harness can be checked against this definition before it is ` +
          `trusted, then run against any implementation, without taking our word for any of it.`,
      ),
      line('p', `Written for ${contract.environments.join(', ')}.`, { class: 'meta' }),

      /**
       * Last, and carrying no content of its own: a `script` node holds attributes and no children,
       * so the rule that no node of this document carries raw markup survives the playground intact.
       * Both projections see an element with nothing in it, which is exactly what it is.
       */
      el('script', {
        type: 'module',
        src: `${rootFrom(pageOf(contract.address))}${THE_ENTRY_POINT}`,
      }),
    ],
  }
}
