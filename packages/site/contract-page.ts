/**
 * The page a contract has, implemented from the owner's artboard - the `isDetail` state of
 * `Toopo.dc.html`. ADR-0187 is this page and what it costs; ADR-0027 is what a contract page
 * publishes and what it leaves out; ADR-0182 is the order of authority every page of the redesign is
 * built under.
 *
 * Four decisions bind what is written here and are cited where they bite: ADR-0096 is how a
 * playground field is read, ADR-0151 is why the frozen half and the standing half are never one
 * section, ADR-0180 is the sentence a card makes about a contract, and ADR-0183 is why this page
 * composes components and draws nothing.
 *
 * ---------------------------------------------------------------------------
 * The artboard is the specification, and what outranks it is the same three things
 * ---------------------------------------------------------------------------
 *
 * The order of authority is `front-page.ts`'s, restated because this is the second page built under
 * it. **The artboard decides every size, colour, spacing, word and order.** Three things outrank it:
 * the page is readable with no JavaScript; every pair of the palette clears the contrast floor; and
 * the 73 addresses of the origin do not move. Where this page departs for any other reason, the
 * departure is named with what forced it - *I did not notice* is not a reason available.
 *
 * ---------------------------------------------------------------------------
 * What left the page, and where it still lives
 * ---------------------------------------------------------------------------
 *
 * The settled cases, the properties, the benchmark profiles, the re-examinations against the
 * language, the checking sentence and the batteries' own measurement stopped being laid out here.
 * **The data is not withdrawn**: `snapshot/`, `contract-binding` and `implementation-bindings` go on
 * publishing every one of them, which is the same division `refusals` and the method page already
 * make - the repository and the origin carry the proof, and the site sells what is used. The owner
 * ruled the removal; the rulings on the two halves still open - the playground, and the card's four
 * figures - are awaited, so both are still rendered below and neither is the artboard's.
 *
 * What the artboard adds that this page never had is the source itself: the file `toopo add` writes,
 * whole, in the six syntax inks, checked against the digest the snapshot announces before a byte of
 * it is rendered - `catalogue.ts` is the frontier that refuses a blob that does not hash to its
 * address.
 *
 * ---------------------------------------------------------------------------
 * Three corrections to the artboard, each from a recorded decision
 * ---------------------------------------------------------------------------
 *
 * The breadcrumb reads `catalogue` where the artboard writes `catalog`, because this project spells
 * the word once and spells it that way everywhere (ADR-0140). The signature is the record's own form
 * - `type Parse = (text: string) => number | null` - and never the artboard's composed declaration,
 * because composing one would need the type parsed and ADR-0026 refuses a second parser in as many
 * words. And the aside's `Tests` block says what is served rather than what the artboard imagines:
 * no test count exists in the registry, so the block states the settled cases - frozen for life -
 * and links the frozen definition the origin already publishes, which is a sentence only this
 * catalogue can say. The `N tests passing` dot is gone with it: a green dot is a verdict, and the
 * accent never means one (ADR-0115).
 *
 * The artboard's `Rust - soon` and `pip - soon` rows are not rendered at all. A second language is
 * recorded in this repository as a thing that does not exist, and a *soon* nobody decided is a
 * declaration nothing keeps - the exact class this repository refuses.
 */

import { THE_WAYS_TO_RUN_IT, contractUrl, renderContract } from '../registry/address.js'
import { endpointOf, pathTo } from '../registry/endpoints.js'
import { THE_COPIED_LICENCE } from '../registry/licence.js'
import type { ExportRecord, UseCaseRecord } from '../registry/contract-record.js'
import type { Domain, Held } from './catalogue.js'
import { footer, masthead } from './chrome.js'
import type { MenuEntry } from './chrome.js'
import {
  callout,
  crumbs,
  eyebrow,
  frozenBadge,
  languageBadge,
  pill,
  snippet,
} from './components.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import { highlighted } from './highlight.js'
import { literal } from './literal.js'
import { paragraph } from './marks.js'
import { THE_REFERENCE_MODULE, pageOf, rootFrom } from './paths.js'
import type { PlaygroundField } from './playground.js'
import { playgroundOf, theCallOf } from './playground.js'
import { figure, grouped, readableDate } from './quantity.js'
import { theAnswerOf, whatACardSays } from './what-a-card-says.js'

const NOTHING = {} as const

/**
 * The one sentence this site makes about the gap between what is hashed and what runs.
 *
 * It belongs beside the playground and nowhere else - not under the source, which is the frozen
 * file itself and stays exactly as true as its digest. This is the only place on the site where a
 * reader is looking at an answer that transformation produced, so this is the only place the
 * transformation is worth a reader's attention.
 *
 * Exported because `pages.test.ts` asserts both halves of that - present here, absent everywhere
 * else - and a guard matching a sentence it had transcribed would be a second copy going stale on
 * the first reword.
 */
export const whatRunsInYourBrowser = (name: string): string =>
  `The JavaScript this runs is ${name}'s own reference.ts with its types stripped. That is neither ` +
  `the file the registry serves nor the file its digest covers: both are TypeScript, and no browser ` +
  `runs TypeScript. It is also the only part of this page that needs JavaScript at all.`

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/**
 * The sentence about the fields that are not read as text, or nothing when every field is.
 *
 * Read off the fields rather than written per contract: a page asserting `each field holds a
 * literal` beside a form of text fields is the defect ADR-0157 exists against, and it is not
 * repaired by writing the opposite sentence somewhere a reader can check it against nothing.
 *
 * Which fields those are is the playground's own reading of the contract, and ADR-0096 is the rule
 * it makes: a field is typed or it is spelled, and the type decides.
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
    `the examples above are written, because what it takes is ${because}.`
  )
}

/** A list as a sentence reads one, which is the last pair joined by a word and not by a comma. */
const spelledOut = (parts: readonly string[]): string =>
  parts.length < 2
    ? (parts[0] ?? '')
    : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1] as string}`

/**
 * One example: the call as somebody makes it, its answer as a comment, and the one thing to know
 * before relying on it.
 *
 * The artboard writes every answer as a comment on the call's own line, which is what the comment
 * ink exists for. **The caveat under the block is not the artboard's and it stays**: ADR-0118 made
 * it a required field because it is what a use case is worth reading for, and the owner ruled that
 * an artboard silent about caveats is silent because its author did not know them - a mock-up that
 * says nothing does not overrule a record. The use case's name and situation stop being laid out
 * with the cases' own sections; they stay served.
 */
const renderedExample = (entry: UseCaseRecord, answer: ExportRecord): Node => {
  const { written, answered } = theCallOf(entry, answer)
  const result = answered.map((field) => literal(field.value)).join(', ')

  return el(
    'div',
    { class: 'example' },
    snippet(highlighted(`${answer.name}(${written.join(', ')})  // ${result}`)),
    paragraph(entry.caveat, { class: 'why' }),
  )
}

export const contractPage = (
  held: Held,
  here: Domain,
  menu: readonly MenuEntry[],
): Document => {
  const { contract } = held
  const name = renderContract(contract.address)
  const own = pageOf(contract.address)
  /**
   * The sentence every surface that shows this contract makes about it, decided once. ADR-0180 is
   * why the arithmetic is shared and the markup is not - a card on this page, on a domain page and
   * on the front page are three outlines of one sentence.
   */
  const says = whatACardSays(held)
  const answer = theAnswerOf(held)
  const { cases, bytes, files, imports } = says.costs
  const playground = playgroundOf(contract, name)
  const useCases = held.binding.useCases ?? []

  /**
   * The short name the heading carries beside its greyed domain, which is the artboard's own
   * `{curCatSlash}{curLeaf}` and the split the offer cards already draw.
   */
  const shortName = contract.address.name.split('/').at(-1) as string

  /**
   * Where the frozen definition is served, from this page. The aside links it because the owner's
   * ruling on the artboard's `View test suite` was to link what exists: the snapshot is the
   * document every claim on this page hashes back to.
   */
  const theFrozenDefinition = `${rootFrom(own)}${pathTo(endpointOf('snapshot'), held.binding.digest).slice(1)}`

  return {
    title: `${name} — ${contract.identity.summary}`,
    servedBesideItsMarkdown: true,
    /**
     * Every field is the value the page already renders, read from the same record.
     *
     * `license` is what a reader *takes* and not what this repository is under - the asymmetry
     * ADR-0047 establishes, arriving on the one field a machine reads as a fact about the code in
     * front of it. `programmingLanguage` is the language coordinate of the address rather than a
     * prettier spelling of it, because a rendering of an address is a second name for it.
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
        'main',
        { class: 'detail' },
        /**
         * The path down to this contract, with its middle step carrying no link.
         *
         * **`catalogue` is the front page** and not a page of its own: the shelf lists every contract
         * a reader can install, so the catalogue is what a reader arrives at rather than somewhere
         * they go on to. **The domain is a level and not a destination** — it is a real segment of the
         * address and there is nothing at it, which is the state `pageless` exists for. ADR-0189.
         */
        crumbs([
          { label: 'catalogue', href: rootFrom(own) },
          {
            label: here.name,
            pageless: 'a domain is a segment of a contract address and this site serves no page at it',
          },
          { label: shortName, youAreHere: true },
        ]),
        el(
          'div',
          { class: 'columns' },
          el(
            'div',
            { class: 'chief' },
            /**
             * The name, and beside it what the name is frozen as. The badges are blocks in a list
             * rather than spans in a run, because `no-element-runs-into-the-one-beside-it` reads a
             * run of phrasing elements as one word - the same repair the offer card carries.
             */
            el(
              'div',
              { class: 'named' },
              el(
                'h1',
                NOTHING,
                el('span', { class: 'of' }, text(`${says.domain}/`)),
                text(shortName),
              ),
              el(
                'ul',
                { class: 'badges' },
                el('li', NOTHING, frozenBadge('stable contract')),
                el('li', NOTHING, languageBadge('TS · npm')),
              ),
            ),
            /**
             * What the function is, then the boundary it draws. Both are the frozen half -
             * `identity.description` and `identity.inputDomain` - and the boundary is rendered
             * because *not a locale-aware parser* is prose a reader has to meet before installing,
             * not after. `relationToTheLanguage` follows where a contract declares it.
             */
            paragraph(contract.identity.summary, { class: 'lede' }),
            /**
             * The ways to run it are handed over as data and never as controls, the arrangement the
             * masthead's search already has: what is served is the one spelling that works, as
             * prose, and `start.ts` builds the choice and the primary copy control into it. A
             * reader without JavaScript is told nothing about yarn, and that is right rather than a
             * gap: they are not offered it either. ADR-0138.
             */
            el(
              'div',
              { class: 'get', 'data-ways': JSON.stringify(THE_WAYS_TO_RUN_IT) },
              line('pre', says.command, { class: 'install' }),
            ),
            /**
             * The four figures, which the artboard does not draw and this page still does. They
             * left the front page with the redesign, so this row is the last place the site states
             * what landing costs - `no imports` and the byte count are the most immediate thing a
             * reader compares against an npm package. Whether they leave is the owner's question,
             * asked and not yet answered; until it is, removing them would be a decision taken by
             * omission.
             */
            el(
              'div',
              { class: 'figures' },
              figure(grouped(bytes), `bytes, ${files === 1 ? 'one file' : `${files} files`}`),
              figure(String(imports), imports === 1 ? 'import' : 'imports'),
              figure(String(cases), 'settled cases'),
            ),
            callout(
              'Frozen contract',
              text(`The signature and behaviour of `),
              el('code', NOTHING, text(shortName)),
              text(
                ` will never change — not in a minor release, not in a major one. Updates may ` +
                  `only fix internal defects while preserving the contract, held to its ` +
                  `${cases} settled cases on every commit.`,
              ),
            ),
            /**
             * What the function is for, which the artboard does not draw because its own data has
             * no such field.
             *
             * **It is frozen prose and it is under a heading of its own, which ADR-0151 requires.**
             * The caveats under Examples are standing - the registry may rewrite them - and one
             * heading carrying both makes one promise out of two, leaving a reader believing the
             * weaker of them about the whole. It is the frozen half - `identity.description`, the relation to the
             * language where one is declared, and the boundary `identity.inputDomain` draws - and a
             * reader has to meet all three before relying on the thing, so it is on the page and
             * not in the aside.
             *
             * **It sits after the command rather than before it.** The artboard puts the install
             * bar directly under the one-sentence summary, and this prose standing between the two
             * put 25 lines of required reading between a visitor and the one thing they can act on:
             * measured at 1440, the bar sat at about 700px where the artboard draws it at about 265.
             * The summary is what a reader decides on; this is what they read once they have.
             */
            el(
              'section',
              NOTHING,
              eyebrow('section', 'h2', 'What it does', { id: 'what-it-does' }),
              paragraph(contract.identity.description, { class: 'says' }),
              ...(contract.identity.relationToTheLanguage === undefined
                ? []
                : [paragraph(contract.identity.relationToTheLanguage, { class: 'says' })]),
              paragraph(contract.identity.inputDomain, { class: 'bounds' }),
            ),
            el(
              'section',
              NOTHING,
              eyebrow('section', 'h2', 'Signature', { id: 'signature' }),
              snippet(highlighted(says.signature)),
            ),
            /**
             * The source, whole, at the address `toopo add` writes it to. The path shown is the
             * entry file's - ADR-0110's `lib/toopo/<name>.ts` - and every installable contract is
             * one file today, measured; the day one carries a second, this section renders a
             * snippet per file already and the labelling of the extras is that unit's to decide
             * with the installer's own relocation in view.
             */
            el(
              'section',
              NOTHING,
              el(
                'div',
                { class: 'source-head' },
                eyebrow('section', 'h2', 'Source', { id: 'source' }),
                el(
                  'p',
                  { class: 'lands-at' },
                  line('code', `lib/toopo/${contract.address.name}.ts`),
                ),
              ),
              ...held.sources.map((source) => snippet(highlighted(source.text))),
            ),
            ...(useCases.length === 0
              ? []
              : [
                  el(
                    'section',
                    NOTHING,
                    eyebrow('section', 'h2', 'Examples', { id: 'examples' }),
                    ...useCases.map((entry) => renderedExample(entry, answer)),
                  ),
                ]),
            /**
             * The playground, kept in place while the owner decides what try-it becomes: it is a
             * capability rather than documentation, and a capability is not removed by a mock-up
             * that does not show it.
             */
            el(
              'section',
              NOTHING,
              eyebrow('section', 'h2', 'Try it on your own input', { id: 'try-it' }),
              line(
                'p',
                `This calls ${playground.calls} on whatever you type. What you type into a field is ` +
                  `the value, character for character, and the form opens on ${playground.opensOnCase} ` +
                  `so there is a call that works to edit.${spelledFields(playground.fields)} What ` +
                  `comes back is what the function answered, under the call it was made from — ` +
                  `invisible characters are named there, so two inputs that look alike on screen do ` +
                  `not print alike.` +
                  (playground.describes === null
                    ? ''
                    : ` When it answers nothing, ${playground.describes} is called on the same input ` +
                      `and its reason is printed underneath: the two exports are one surface, and ` +
                      `every input this contract turns down answers ${playground.calls} alike.`),
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
            ),
          ),
          el(
            'aside',
            { class: 'about' },
            el(
              'section',
              NOTHING,
              eyebrow('field', 'p', 'Category'),
              // A mark and no longer a way in, for the reason the crumb above carries no link either.
              pill(here.name, null, null),
            ),
            el(
              'section',
              NOTHING,
              eyebrow('field', 'p', 'Added'),
              line('p', readableDate(held.binding.publishedAt), { class: 'datum' }),
            ),
            /**
             * The artboard writes `N tests passing` over a green dot, and neither half survives
             * contact with what is served: no test count exists in the registry, and a green dot is
             * a verdict the accent never means. What is served is stronger - the settled cases are
             * frozen for the life of the major, and the frozen definition is a document a reader
             * can fetch - so the block says that.
             */
            el(
              'section',
              NOTHING,
              eyebrow('field', 'p', 'Verification'),
              line('p', `${cases} settled cases, frozen for life`, { class: 'datum' }),
              el(
                'p',
                { class: 'datum' },
                el('a', { href: theFrozenDefinition }, text('The frozen definition')),
              ),
            ),
            el(
              'section',
              NOTHING,
              eyebrow('field', 'p', 'Ecosystem'),
              /**
               * A list rather than a run, because a badge and the word beside it are two things a
               * reading has to keep apart - the same repair the offer card's marks carry.
               */
              el(
                'ul',
                { class: 'channel' },
                el('li', NOTHING, languageBadge('npm')),
                el('li', NOTHING, line('p', 'TypeScript', { class: 'datum' })),
              ),
            ),
            /**
             * Version and date, and no invented note: the registry holds those two and nothing
             * else about a version, so the artboard's per-version sentences are not composed. A
             * version can be absent on an implementation the catalogue has not bound, and the
             * honest rendering of no version is no list.
             */
            ...(held.implementation.version === null
              ? []
              : [
                  el(
                    'section',
                    NOTHING,
                    eyebrow('field', 'p', 'Versions'),
                    el(
                      'p',
                      { class: 'datum' },
                      el('code', NOTHING, text(held.implementation.version)),
                      text(` · ${readableDate(held.binding.publishedAt)}`),
                    ),
                  ),
                ]),
          ),
        ),
      ),
      footer(own, menu),
    ],
  }
}