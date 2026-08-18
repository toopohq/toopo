/**
 * The page a contract has, which is the only page of this site that carries the product.
 * ADR-0027 is what this page publishes and what it leaves out; ADR-0116 is the shape it takes and why
 * nothing on it is behind a fold.
 *
 *
 * ---------------------------------------------------------------------------
 * What the launch takes out, and why an absence is stated rather than rendered
 * ---------------------------------------------------------------------------
 *
 * The project specification describes a contract page for a mature catalogue: the implementations
 * competing under the contract, each with its benchmark figures, its size and its tags. Today there is
 * one implementation per contract and **no reference machine**, so every benchmark list is empty -
 * ADR-0063 says so and says why a figure from a developer laptop would be dishonest.
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
 * A card, and then everything, with nothing folded away
 * ---------------------------------------------------------------------------
 *
 * The page answers two readers who want opposite things. Somebody in a hurry needs the name, the
 * sentence, the command, the cost and the signature, and needs them above the fold; somebody who
 * arrived from a search for this exact behaviour needs the argument for every settled case. The card
 * serves the first without costing the second anything, which is why it is a card and not a summary
 * that repeats what follows.
 *
 * **Nothing is behind a disclosure control, and that is the one thing this page will not trade.**
 * Auditability is the product. A page whose argument is the product, hiding its argument by default,
 * gives up the only claim it makes - and at fifty cases the fold buys length a table of contents
 * already buys without hiding anything. ADR-0116 carries the trial that decided it.
 *
 * ---------------------------------------------------------------------------
 * Bytes exactly, not rounded
 * ---------------------------------------------------------------------------
 *
 * `packages/cli/report.ts` renders `4.2 kB`, and it is right to: a terminal line is read in passing. A page has
 * room for the number, and the number is the argument. `readableBytes` stays where it is.
 */

import { THE_INVOCATION, contractUrl, renderContract } from '../registry/address.js'
import { THE_COPIED_LICENCE } from '../registry/licence.js'
import type { CaseGroup } from '../catalogue/identifier.js'
import type {
  CaseRecord,
  CaseTableRecord,
  ExportRecord,
  UseCaseRecord,
} from '../registry/contract-record.js'
import type { FrozenContract } from '../registry/snapshot.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import { figure, grouped } from './quantity.js'
import type { Domain, Held } from './catalogue.js'
import type { MenuEntry } from './chrome.js'
import { beside, masthead } from './chrome.js'
import { literal } from './literal.js'
import { inline, marked, paragraph } from './marks.js'
import { THE_ENTRY_POINT, THE_REFERENCE_MODULE, pageOf, rootFrom } from './paths.js'
import type { PlaygroundField } from './playground.js'
import { playgroundOf, theCallOf, whatATextFieldCannotCarry } from './playground.js'

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

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/** A number with the thousands marked, because a byte count is read as a quantity. */

/*
 * What this page says about the playground below it is read off that playground rather than written
 * beside it, and the limit a text field imposes is declared on the case that causes it. ADR-0096.
 */

/**
 * The sentence about the fields that are not read as text, or nothing when every field is.
 *
 * Read off the fields rather than written per contract: three of the four pages say nothing here
 * because all their fields take text, and `date/add@1` names its one `Duration` field. A page
 * asserting `each field holds a literal` beside a form of text fields is the defect this whole unit
 * exists against, and it is not repaired by writing the opposite sentence somewhere a reader can
 * check it against nothing.
 */
const spelledFields = (fields: readonly PlaygroundField[]): string => {
  const spelled = fields.filter((field) => field.reads.kind === 'a-literal')
  if (spelled.length === 0) return ''

  const named = spelledOut(spelled.map((field) => field.name))
  const because = spelledOut([
    ...new Set(
      spelled.map((field) => (field.reads as { readonly because: string }).because),
    ),
  ])

  return (
    ` ${named} ${spelled.length === 1 ? 'is' : 'are'} written as a literal instead, exactly the way ` +
    `the cases above are written, because what it takes is ${because}.`
  )
}

/** A list as a sentence reads one, which is the last pair joined by a word and not by a comma. */
const spelledOut = (parts: readonly string[]): string =>
  parts.length < 2
    ? (parts[0] ?? '')
    : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1] as string}`

/**
 * One case: the call it is, the address it answers to, and the argument for the answer.
 *
 * The fields of a case begin with the arguments of the contract's own signature, in the signature's
 * order - `packages/registry/signature.ts` reads that call and `packages/registry/serialise.ts` refuses a contract where
 * it stops being true - so what is left after them is the answer. A single answer field is written
 * bare, because there is nothing to tell it apart from; two or more are named.
 *
 * **The identifier is shown rather than hidden behind a bare `#`, and that is a repair and not a
 * decoration.** `number/parse@1#ordinary-integer` is the address of this case - what a bug report
 * cites, what the batteries pin, what the major freezes - and the page publishing it was rendering it
 * into an attribute and a one-character link. Shown, the link needs no separate marker, so the
 * standalone `#` beside a case is gone rather than added to.
 *
 * It is written `#ordinary-integer` and not `ordinary-integer`, which is the fragment a reader appends
 * to this page's URL and is also what keeps the line honest:
 * `a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence` refuses a carried value standing alone in
 * a paragraph, and it is right to - an identifier is an address and not prose. The `#` is what says
 * so.
 *
 * The two halves are wrapped because the layout puts them in two columns and a grid cannot place
 * children it has to interleave. They are wrappers for a reason a reader can see, which is the only
 * kind this file writes.
 */
const renderedCase = (
  entry: CaseRecord,
  answer: ExportRecord,
  fields: readonly PlaygroundField[],
): Node => {
  const { written: call, answered } = theCallOf(entry, answer)

  const result =
    answered.length === 1
      ? literal((answered[0] as (typeof answered)[number]).value)
      : answered.map((field) => `${field.name} ${literal(field.value)}`).join(', ')

  return el(
    'div',
    { id: entry.id, class: 'case' },
    el(
      'div',
      { class: 'what' },
      el('p', { class: 'call' }, line('code', `${answer.name}(${call.join(', ')}) → ${result}`)),
      el('p', { class: 'case-id' }, el('a', { href: `#${entry.id}` }, text(`#${entry.id}`))),
    ),
    el(
      'div',
      { class: 'argument' },
      paragraph(entry.rationale),
      ...whatATextFieldCannotCarry(entry, answer, fields).map((field) =>
        line(
          'p',
          `A text field drops ${spelledOut(field.lost)}, so the ${field.name} field cannot be retyped ` +
            `in the playground below. The answer above is what this contract settles for it.`,
          { class: 'meta' },
        ),
      ),
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
    ),
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
 * A heading that carries its own address.
 *
 * The tag is the outline and the class is the appearance, and they are separated on purpose: how
 * deeply a group is nested depends on whether its contract has one table or two, and how a group
 * *looks* must not.
 */
const addressed = (tag: Tag, id: string, title: string): Node =>
  el(tag, { id, class: 'group' }, anchorTo(id), ...inline(title))

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
  fields: readonly PlaygroundField[],
  heading: Tag,
): readonly Node[] => [
  addressed(heading, group.id, group.title),
  ...(group.note === null ? [] : [paragraph(group.note, { class: 'why' })]),
  el(
    'div',
    { class: 'cases' },
    ...table.cases
      .filter((entry) => entry.group === group.id)
      .map((entry) => renderedCase(entry, answer, fields)),
  ),
]

/**
 * The jump bar over one table's groups, carrying each group's own title and how many cases it holds.
 *
 * **The title is the group's, in full, and never a shortened one.** The mock-up this page is derived
 * from prints `the surprise` where the group is called `The surprise, in front`, which is a second
 * name for something that already has one - the defect ADR-0017 is about, arriving as a nicety. A
 * long title wraps.
 *
 * One bar per table rather than one per page: `date/add@1` sorts twelve groups under two tables, and
 * a single bar would flatten the one distinction those two tables exist to make.
 *
 * A list rather than a run of anchors, which is the reading and not the look: two elements that each
 * carry content and neither of which separates are one sentence to whoever is listening, and
 * `no-element-runs-into-the-one-beside-it` is the guard that says so.
 */
const theGroupBar = (table: CaseTableRecord): Node =>
  el(
    'ul',
    { class: 'chips' },
    ...table.groups.map((group) =>
      el(
        'li',
        NOTHING,
        el(
          'a',
          { href: `#${group.id}` },
          ...inline(group.title),
          text(` ${table.cases.filter((entry) => entry.group === group.id).length}`),
        ),
      ),
    ),
  )

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
  fields: readonly PlaygroundField[],
  alone: boolean,
): readonly Node[] => [
  alone
    ? paragraph(`${table.purpose}.`, { class: 'meta' })
    : marked('h3', table.purpose, { class: 'table' }),
  theGroupBar(table),
  ...table.groups.flatMap((group) =>
    renderedGroup(group, table, answer, fields, alone ? 'h3' : 'h4'),
  ),
]

/**
 * One section of the page: the address a reader can link, the title they read, and what is under it.
 *
 * **The table of contents is derived from these and never written beside them.** A rail listing the
 * sections and a body rendering them are two statements of one outline, and the day a section is
 * added the rail is the half that does not move - which is the class this repository spends its
 * length removing. So the sections are a value, `theRail` reads it, and the headings are read off the
 * same list.
 *
 * The identifier is a literal beside the title rather than a slug of it, which is ADR-0017 arriving
 * on a page anchor: a name that is a rendering of the data it addresses moves when the data moves,
 * and `41 settled cases` gains a case every time somebody settles one.
 */
type Section = {
  readonly id: string
  readonly title: string
  readonly body: readonly Node[]
}

/**
 * The page in the two halves a reader reads it in. ADR-0119.
 *
 * **The length did not go down, it got sorted**, and that is the whole of what this type does.
 * Measured at `f05951f` on `string/slugify@1`: 3 800 visible words across eight sections of one
 * weight, of which 2 482 - a little over two thirds of everything under a heading - were the settled
 * cases. A reader who says the page is long is reading one section and being given no way to know
 * that. So the sections are declared in two lists, the first answering *is this the function I want*
 * and the second *what exactly is it bound to do*.
 *
 * **Nothing is folded away, and that is a decision this type has to keep rather than a side effect.**
 * ADR-0116 settled that on a differential trial, and the mock-up this cut came from proposed the
 * opposite in its own Reference lede - *it opens by group and every group states its size before you
 * open it*. That line is not implemented and must not arrive by a later mock-up: a group behind a
 * fold is a case a reader cannot find with the browser's own search, on a page whose argument is that
 * every case is there.
 *
 * The divider is derived from this shape rather than declared beside it, for the reason `theRail` is:
 * a heading listed in one place and rendered from another is two statements of one outline.
 */
type Halves = {
  readonly summary: readonly Section[]
  readonly reference: {
    readonly lede: readonly Node[]
    readonly sections: readonly Section[]
  }
}

/** The address the Reference half answers to, used by the rail, the heading and nothing else. */
const REFERENCE = 'reference'

const rendered = (section: Section): readonly Node[] => [
  marked('h2', section.title, { id: section.id }),
  ...section.body,
]

/**
 * The table of contents, as the sections themselves say they are.
 *
 * The reference entries are marked with a class and not nested in a second list, because the page's
 * outline is flat: those sections are `h2`s beside the divider rather than under it, and a nested
 * list would claim a nesting the document does not have. ADR-0025 - the tag is the outline and the
 * class is the look.
 */
const theRail = (halves: Halves): Node =>
  el(
    'nav',
    { class: 'rail', 'aria-label': 'On this page' },
    line('p', 'On this page', { class: 'rail-label' }),
    el(
      'ul',
      { class: 'toc' },
      ...halves.summary.map((section) =>
        el('li', NOTHING, el('a', { href: `#${section.id}` }, text(section.title))),
      ),
      el('li', { class: 'divides' }, el('a', { href: `#${REFERENCE}` }, text('Reference'))),
      ...halves.reference.sections.map((section) =>
        el('li', { class: 'under' }, el('a', { href: `#${section.id}` }, text(section.title))),
      ),
    ),
  )

/** One use case: the job, the call as somebody makes it, and the warning that makes it worth reading. */
const renderedUseCase = (entry: UseCaseRecord, answer: ExportRecord): Node => {
  const { written, answered } = theCallOf(entry, answer)
  const result = answered.map((field) => literal(field.value)).join(', ')

  return el(
    'div',
    { class: 'use-case' },
    /**
     * No identifier, which is the decision showing through to the reader rather than an omission.
     * Every other heading on this page carries the address a link anchors on; this one carries none,
     * because a use case is prose the registry may rewrite and an address that may come to name
     * something else is worse than no address at all. ADR-0118.
     */
    line('h3', entry.name),
    paragraph(entry.situation),
    el('p', { class: 'call' }, line('code', `${answer.name}(${written.join(', ')}) → ${result}`)),
    paragraph(entry.caveat, { class: 'why' }),
  )
}


/**
 * How many of a contract's properties are checked, said where the reasons are.
 *
 * **This used to be a figure of the card, reading `2 / 4` under `properties checked`, and it was the
 * one figure there that answered no question a reader had.** The other three answer what am I taking
 * on, what does it pull in, and is this serious. A bare ratio answers none of them and reads as a
 * confession - *only half of it is verified* - where what it says is *we refuse to write two
 * decorative tests*. It is the class
 * `the-readme-never-gives-a-survivor-total-without-its-split` keeps elsewhere: a ratio without its
 * breakdown is read as a count of holes.
 *
 * So it is here, at the head of the section whose list gives every property its verdict and its
 * reason in full, which is the breakdown. The figure did not leave the site; it left the card.
 *
 * **The sentence it replaces was false.** It read *every property below is checked on N generated
 * cases per run*, on a page listing two properties that are not checked at all - the same defect one
 * floor down, a total asserted over a set that has exceptions in it. Nothing counts here that the
 * record does not already carry, so the sentence cannot come apart from the list under it.
 */
const theStandingOfTheProperties = (properties: FrozenContract['properties']): string => {
  const total = properties.universal.length
  const checked = properties.universal.filter((property) => property.applicable).length
  const trial = `${grouped(properties.runs)} generated cases per run, re-seeded each time`

  if (checked === total) {
    return `All ${total} of them are checked on ${trial}.`
  }

  const unchecked = total - checked
  const why =
    `not applicable to this contract, and ${unchecked === 1 ? 'says' : 'each says'} why below.`

  return checked === 0
    ? `None of these ${total} is checked. All ${total} are ${why}`
    : `${checked} of these ${total} ${checked === 1 ? 'is' : 'are'} checked on ${trial}. ` +
        `The other ${unchecked === 1 ? 'one is' : `${unchecked} are`} ${why}`
}

export const contractPage = (
  held: Held,
  here: Domain,
  domains: readonly Domain[],
  menu: readonly MenuEntry[],
): Document => {
  const { contract, implementation } = held
  const name = renderContract(contract.address)
  const own = pageOf(contract.address)
  const answer = contract.surface.exports.find((entry) => entry.role === 'the-answer') as ExportRecord
  const cases = contract.caseTables.reduce((count, table) => count + table.cases.length, 0)
  const bytes = implementation.files.reduce((total, file) => total + file.bytes, 0)
  const files = implementation.files.length
  const imports = implementation.dependsOn.length
  const playground = playgroundOf(contract, name)

  /**
   * The short name the heading takes, which is the last segment of the contract's own name.
   *
   * The address sits above it and the document title carries it in full, so nothing is lost - and a
   * heading that repeats an address a reader has just read spends the largest type on the page saying
   * one thing twice.
   */
  const shortName = contract.address.name.split('/').at(-1) as string

  const useCases = held.binding.useCases ?? []

  const summary: readonly Section[] = [
    {
      id: 'what-it-does',
      title: 'What it does',
      body: [
        paragraph(contract.identity.description),
        ...(contract.identity.relationToTheLanguage === undefined
          ? []
          : [paragraph(contract.identity.relationToTheLanguage)]),
        /**
         * Under *What it does* rather than beside it, which is the one section this cut merged.
         *
         * The two answer one question - what this function is for - and a reader deciding whether to
         * install it reads them together. It keeps its own address, so every link written to
         * `#what-it-is-for` still resolves; what it loses is a line in the rail, and a rail entry is
         * not an address.
         */
        marked('h3', 'What it is for, and what it is not', { id: 'what-it-is-for' }),
        paragraph(contract.identity.inputDomain),
      ],
    },
    {
      id: 'try-it',
      title: 'Try it on your own input',
      body: [
        line(
          'p',
          `This calls ${playground.calls} on whatever you type. What you type into a field is the ` +
            `value, character for character, and the form opens on ${playground.opensOnCase} so there ` +
            `is a call that works to edit.${spelledFields(playground.fields)} What comes back is what ` +
            `the function answered, under the call it was made from — invisible characters are named ` +
            `there, so two inputs that look alike on screen do not print alike. The settled answer is ` +
            `on the case's own line below, and is deliberately not repeated here.` +
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
      ],
    },
    /**
     * Absent on a contract that declares none, rather than an empty heading. The registry serves the
     * field only when it holds something, so there is no state where this renders a promise with
     * nothing under it.
     */
    ...(useCases.length === 0
      ? []
      : [
          {
            id: 'in-practice',
            title: 'In practice',
            body: [
              /**
               * The sentence does not count the cards, and that is ADR-0018 arriving on a page rather
               * than on a comment: *four jobs* is a figure that goes wrong the day somebody adds a
               * fifth, and nothing would catch it because a reader cannot check a number against a
               * list they have not counted.
               */
              line(
                'p',
                `The jobs this function is written for, each with the call as you would make it and ` +
                  `the one thing to know before you rely on it. Nothing here is part of the ` +
                  `contract: the settled cases below are what is guaranteed, and these are only how ` +
                  `the guarantee gets used.`,
              ),
              el('div', { class: 'use-cases' }, ...useCases.map((entry) => renderedUseCase(entry, answer))),
            ],
          },
        ]),
  ]

  const referenceSections: readonly Section[] = [
    {
      id: 'signature',
      title: 'Signature',
      body: [
        line('p', `You get ${spelledOut(contract.surface.exports.map((entry) => entry.name))}.`, {
          class: 'meta',
        }),
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
          : [paragraph(`${contract.surface.couplingRule}.`)]),
      ],
    },
    {
      id: 'settled-cases',
      title: `${cases} settled cases`,
      body: [
        line(
          'p',
          `Every one of them is named, frozen with the major version, and linkable. This is what the ` +
            `contract decides, one input at a time.`,
        ),
        ...contract.caseTables.flatMap((table) =>
          renderedTable(table, answer, playground.fields, contract.caseTables.length === 1),
        ),
      ],
    },
    {
      id: 'properties',
      title: 'Properties',
      body: [
        line('p', theStandingOfTheProperties(contract.properties)),
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
              paragraph(property.reason, { class: 'why' }),
            ),
          ),
        ),
      ],
    },
    {
      id: 'profiles',
      title: 'Benchmark profiles',
      body: [
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
              paragraph(profile.description, { class: 'why' }),
            ),
          ),
        ),
      ],
    },
    {
      id: 'checking',
      title: 'What you can check yourself',
      body: [
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
      ],
    },
  ]

  const halves: Halves = {
    summary,
    reference: {
      lede: [
        line(
          'p',
          `Everything above answers whether this function does what you need. Everything below is ` +
            `what it is bound to do, in full. It is long on purpose, and none of it is folded away: ` +
            `a case a reader cannot find with their browser's own search is a case this catalogue ` +
            `did not really publish.`,
        ),
      ],
      sections: referenceSections,
    },
  }

  return {
    title: `${name} — ${contract.identity.summary}`,
    servedBesideItsMarkdown: true,
    /**
     * Every field is the value the page already renders, read from the same record.
     *
     * `license` is what a reader *takes* and not what this repository is under - the asymmetry ADR-0047
     * establishes, arriving on the one field a machine reads as a fact about the code in front of it.
     * `programmingLanguage` is the language coordinate of the address rather than a prettier spelling
     * of it, because a rendering of an address is a second name for it.
     */
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name,
      description: contract.identity.summary,
      programmingLanguage: contract.address.language,
      license: THE_COPIED_LICENCE,
      url: contractUrl(contract.address),
    },
    /**
     * Composed rather than borrowed from the summary, which the title already carries. A search
     * result showing one sentence twice wastes the only two lines it gets, and the differentiator -
     * how many decisions are settled, and what installing costs - is the half a reader cannot guess.
     */
    description:
      `${cases} named edge cases, settled and frozen. TypeScript source copied into your project: ` +
      `${files === 1 ? 'one file' : `${files} files`}, ` +
      `${grouped(bytes)} bytes, no dependencies.`,
    body: [
      masthead(own, menu),

      el(
        'div',
        { class: 'shell' },
        el(
          'main',
          NOTHING,
          /**
           * The card, which is the whole of what this page owes somebody in a hurry: what it is
           * called, what it does, how to get it, what it costs, and what it answers.
           */
          el(
            'div',
            { class: 'card' },
            el('p', { class: 'address' }, line('code', name)),
            line('h1', shortName),
            paragraph(contract.identity.summary, { class: 'lede' }),
            line('pre', `${THE_INVOCATION} add ${contract.address.name}`, { class: 'install' }),
            el(
              'div',
              { class: 'figures' },
              figure(grouped(bytes), `bytes, ${files === 1 ? 'one file' : `${files} files`}`),
              figure(String(imports), imports === 1 ? 'import' : 'imports'),
              figure(String(cases), 'settled cases'),
            ),
            line('pre', `type ${answer.typeName} = ${answer.text}`, { class: 'answer' }),
          ),

          ...halves.summary.flatMap(rendered),

          /**
           * The line the page is read in two halves across, rendered from the shape rather than
           * written beside it: it is an `h2` with an address like every other section heading, so the
           * rail lists it and `the-rail-of-a-page-names-every-section-of-it-and-only-those` holds
           * over it too.
           */
          marked('h2', 'Reference', { id: REFERENCE, class: 'divides' }),
          ...halves.reference.lede,
          ...halves.reference.sections.flatMap(rendered),
        ),
        /**
         * The column: where this contract sits in the catalogue, and then this page's own sections.
         *
         * **After `main` in the document and to the left of it on a wide screen**, which the grid
         * places rather than `order` reorders. A reader on a phone meets the contract and then the
         * navigation; a screen reader and `toText` follow the document, and those two agreeing is
         * what `order` would have broken.
         *
         * The domain is a parameter and never looked up here. A search would have to answer *what if
         * no domain holds this contract*, which is a question with no honest answer at a rendering
         * site - and `site.ts` builds these pages by walking the domains, so the contract being in
         * the domain it is rendered under is the loop rather than a claim.
         */
        beside(own, here, domains, [theRail(halves)]),
      ),

      /**
       * Last, and carrying no content of its own: a `script` node holds attributes and no children,
       * so the rule that no node of this document carries raw markup survives the playground intact.
       * Both projections see an element with nothing in it, which is exactly what it is.
       */
      el('script', {
        type: 'module',
        src: `${rootFrom(own)}${THE_ENTRY_POINT}`,
      }),
    ],
  }
}
