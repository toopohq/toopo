import { describe, it, expect } from 'vitest'

import {
  THE_COMMITS_QUOTED,
  THE_PINS_ARE_AN_ASSERTION,
  THE_REPLAY,
  CAUGHT_MEANS_WHERE_THE_DEFECT_EXISTS,
  WHAT_A_SURVIVOR_MEANS_TO_A_READER,
  survivorsByKind,
  theMeasurement,
} from '../../mutation/published.js'
import {
  THE_INVOCATION,
  THE_WAYS_TO_RUN_IT,
  contractUrl,
  renderCase,
  renderContract,
} from '../registry/address.js'
import { THE_COPIED_LICENCE } from '../registry/licence.js'
import { isASentence, stringsIn } from '../registry/contract-record.js'
import { search } from '../registry/search.js'
import { ThePageCannotBeBuilt, domainsOf, heldByTheRegistry } from './catalogue.js'
import { THE_EXAMPLES } from './chrome.js'
import { whatRunsInYourBrowser } from './contract-page.js'
import type { Element, Node } from './document.js'
import { escapedForMarkdown, readingOf, toHtml, toMarkdown, toText, wordsOf } from './document.js'
import { literal } from './literal.js'
import { localSource } from './local-source.js'
import { inline } from './marks.js'
import { theCallOf } from './playground.js'
import {
  CATALOGUE_PAGE,
  FRONT_PAGE,
  METHOD_PAGE,
  REFUSALS_PAGE,
  WHAT_A_CONTRACT_IS_PAGE,
  domainPageOf,
  linkTo,
  pageOf,
  rootFrom,
  urlOf,
} from './paths.js'
import { theSite } from './site.js'

/**
 * The pages themselves, built from the five contracts of this working tree.
 *
 * They are built in memory. Nothing here writes a file, which is what keeps everything the generator
 * decides reachable from a guard - the property `packages/cli/command.ts` states for the installer, and the one
 * `build.ts` is the single exception to.
 */

const source = localSource()
const index = source.contractIndex()

/**
 * Built inside each guard rather than once at the top of the file, and that is the apparatus talking
 * rather than taste: a defect that makes `theSite` throw would otherwise stop the whole file from
 * collecting, and the mutation instrument reads a file that collected nothing as a run that measured
 * part of the suite. W-20 is the mutant that found it - it builds a page for the contract that has no
 * binding - and one guard failing is the answer, not nine disappearing.
 */
const pages = (): ReturnType<typeof theSite> => theSite(source)

const page = (path: string): Parameters<typeof toHtml>[0] =>
  pages().get(path) as NonNullable<ReturnType<ReturnType<typeof theSite>['get']>>

const html = (path: string): string => toHtml(page(path))

/**
 * A sentence written for a reader of source, as a reader of a page sees it.
 *
 * Every guard that requires one has to ask for it this way, because a page parses the two marks these
 * sentences are written with and the literal they were read from still carries them. It is one
 * function rather than four: `every-surviving-cell-is-published-with-its-own-battery-sentence` used to
 * strip the marks by hand, which is a copy of `inline` that goes stale the day it learns a third, and
 * `every-kind-of-survivor-shown-is-explained-in-the-instruments-own-words` compared the literal, which
 * is right only for as long as no entry of that vocabulary gains a mark.
 *
 * **It moved out of the method page's block when the catalogue's own prose started being parsed too.**
 * Two guards over a contract page were looking a group title and a rationale up in the reading by
 * their literal, and `separators-the-family-does-not-cover` is the row that found it: the title holds
 * a mark, so the search was for a string no reader is shown. That is the same defect this helper was
 * written for, one page along - which is the argument for one function and against a second spelling
 * of it here. ADR-0117.
 */
const asRead = (prose: string): string => inline(prose).map(readingOf).join('')

/**
 * What a reader reads under each `h2` of a page, by the title of that `h2`.
 *
 * **It walks the value because searching the reading stopped working, and the reason is worth having
 * written down.** A contract page now carries a table of contents, so every section title occurs
 * twice in the reading — once as a link in the rail, once as the heading — and two guards that looked
 * a title up with `indexOf` silently found the rail, which sits before everything. One of them then
 * required a sentence to come *before* `Properties` and was reading the rail's entry for it.
 *
 * A separator would not have saved them either. A heading ends a reading with a blank line and a list
 * item with a single newline, so the two look distinguishable — until the last item of a list, which
 * is followed by the list's own newline and reads exactly like a heading. The disambiguation is
 * structural or it is luck.
 *
 * Only the level that holds the headings is descended into, which is what keeps the rail out: its
 * `nav` carries no `h2`, so nothing under it is ever attributed to a section. ADR-0116.
 */
const underEachHeading = (document: Parameters<typeof toText>[0]): ReadonlyMap<string, string> => {
  const found = new Map<string, string>()

  const walk = (nodes: readonly Parameters<typeof readingOf>[0][]): void => {
    let heading: string | null = null

    for (const node of nodes) {
      if (node.kind !== 'element') continue

      if (node.tag === 'h2') {
        heading = readingOf(node).trim()
        found.set(heading, '')
        continue
      }

      if (heading === null) walk(node.children)
      else found.set(heading, (found.get(heading) as string) + readingOf(node))
    }
  }

  walk(document.body)

  return found
}

describe('the site', () => {
  /**
   * Five pages for five contracts, four for the domains the index files them under, and three that are
   * about no contract at all.
   *
   * **This guard was `every-installable-contract-has-a-page-and-a-refused-one-does-not` and the rename
   * is the decision rather than a tidying.** ADR-0027 settled that a refused contract has no page, on
   * an argument about what such a page would be missing; ADR-0127 reverses it, because the page a
   * refusal gets is not a contract page with a hole where the digest goes - it is a page about a
   * decision, and it says in a sentence that the frozen half is absent and why. The old name would have
   * gone on asserting the opposite of what the file does, which is the one thing a guard's address must
   * never do. `confirmed-by` of ADR-0027 and ADR-0121 moved with it, which is the cost and is what the
   * meta suite would otherwise have refused.
   *
   * **What ADR-0027 keeps is asserted by another guard and not weakened here.**
   * `nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed` is what holds that a
   * refused contract is never offered, and it was written for the catalogue's list before this page
   * existed - so it arrived at the new page already holding the one thing it must not do.
   *
   * **A refused contract is at `pageOf` and never at a second spelling.** A refusal is a state of a
   * contract, so it is at the address the contract has: a reader who searches for `group-by` lands
   * where they would have landed had it been published. Asserting the whole key set from the index is
   * what makes an extra page and a missing one the same failure.
   *
   * The four pages that are not about one contract are named here, so that a page appearing or
   * disappearing is this guard's business rather than nobody's - which is what it was for when
   * ADR-0129 added the fourth, and the only guard that noticed.
   */
  it('every-contract-the-index-lists-has-a-page-at-its-own-address', () => {
    const refused = index.entries.filter((entry) => !entry.installable)

    expect([...pages().keys()].sort()).toEqual(
      [
        FRONT_PAGE,
        CATALOGUE_PAGE,
        METHOD_PAGE,
        REFUSALS_PAGE,
        WHAT_A_CONTRACT_IS_PAGE,
        ...new Set(index.entries.map((entry) => domainPageOf(entry.address))),
        ...index.entries.map((entry) => pageOf(entry.address)),
      ].sort(),
    )
    expect(refused.map((entry) => pages().has(pageOf(entry.address)))).toEqual([true])
    expect(refused.map((entry) => pages().has(domainPageOf(entry.address)))).toEqual([true])
    expect(refused.length).toBe(1)
  })

  /**
   * What a domain page is built from is what the index files under that domain.
   *
   * **This guard was cited by `catalogue.ts` for three units and did not exist.** Its comment read
   * *what keeps them from disagreeing is that `a-domain-page-lists-every-contract-the-index-files-under-it`
   * compares the two sides*, and nothing did: `every-guard-a-decision-names-is-one-its-suite-collects`
   * resolves the guards a **decision record** names and has no opinion about the ones a comment names.
   * Found by ADR-0126 naming it in a `confirmed-by`, where the meta suite does look.
   *
   * The two sides are two splits of one string in two folders. `packages/registry/response.ts` cuts
   * `ServedIndexEntry.domain` out of a contract's name; `catalogue.ts` cuts it again, because a `Held`
   * carries a frozen contract and no index entry, so the two are reached from different values and
   * neither reads the other.
   *
   * **Both halves are asserted, and the second is why this is not an internal check.** The first
   * compares the grouping against the index. The second reads the page a reader is served.
   *
   * **The second half was decorative when it was written and a measurement is what said so.** It
   * required every contract filed under the domain to be *named* on the page — and the column beside
   * the content names every contract of the domain too, so a page that dropped an entry from its main
   * list still carried the name. Seen green with `domain.held.slice(1)` rendering the list, which is a
   * page missing a contract entirely. What only the main list carries is the install command, so that
   * is what is required of a contract the domain publishes, and the reason it was turned down for one
   * it refused. ADR-0126.
   */
  it('a-domain-page-lists-every-contract-the-index-files-under-it', () => {
    const domains = domainsOf(source, heldByTheRegistry(source))
    const shortNameOf = (name: string): string => name.slice(name.indexOf('/') + 1)

    expect(domains.length, 'the catalogue files contracts under some domain').toBeGreaterThan(0)

    for (const domain of domains) {
      const filed = index.entries.filter((entry) => entry.domain === domain.name)
      const built = [
        ...domain.held.map((one) => one.contract.address.name),
        ...domain.turnedDown.map((one) => one.refusal.address.name),
      ]

      expect(
        built.slice().sort(),
        `${domain.name}: what its page is built from, against what the index files under it`,
      ).toEqual(filed.map((entry) => entry.address.name).sort())

      const said = toText(page(domainPageOf(domain.address)))

      expect(
        domain.held.map(
          (one) => `${one.contract.address.name}: ${said.includes(`add ${one.contract.address.name}`)}`,
        ),
        `${domain.name}: every contract it publishes is listed with the command that takes it`,
      ).toEqual(domain.held.map((one) => `${one.contract.address.name}: true`))

      expect(
        domain.turnedDown.map(
          (one) =>
            `${one.refusal.address.name}: ${said.includes(shortNameOf(one.refusal.address.name)) && said.includes(one.refusal.decidedAgainst)}`,
        ),
        `${domain.name}: every contract it turned down is named with what it was turned down for`,
      ).toEqual(domain.turnedDown.map((one) => `${one.refusal.address.name}: true`))
    }
  })

  /**
   * The sentence a domain page opens on is computed from the contracts it lists.
   *
   * ADR-0121 refuses a hand-written line there. It would be a fifth statement of what is in a domain -
   * beside the list under it, the served index, the sitemap and each contract's own summary - and the
   * one a reader believes, because it is at the top and the list is below the fold. What replaces it
   * carries how many contracts, how many cases they settle and what they weigh, all four read off the
   * registry.
   *
   * **What this establishes and what it does not, stated rather than implied.** The event it fires on
   * is somebody writing prose in that slot: prose does not carry these three numbers, so the guard
   * reddens. It does **not** establish that the derivation is right - the sentence and this guard
   * compute from the same `Held`, so a hole in that computation moves both together and stays green,
   * which is ADR-0087's warning arriving where it cannot be avoided. The half that cannot be got this
   * way is bought instead by there being no second source: nothing in `domain-page.ts` holds a figure
   * that is not read from a contract.
   *
   * Seen red before it was believed, on the mutant it is written for: with the opening replaced by
   * *Four contracts over text held in memory*, the fault reads that 2 is not in the sentence.
   */
  it('the-sentence-a-domain-page-opens-on-is-computed-from-what-it-lists', () => {
    const domains = domainsOf(source, heldByTheRegistry(source))
    expect(domains.length, 'the catalogue publishes in some domain').toBeGreaterThan(0)

    for (const domain of domains) {
      // The block after the title, found by the title rather than by a position: what comes before it
      // is the masthead, and how many blocks that is is not this guard's business.
      const blocks = toText(page(domainPageOf(domain.address))).split('\n\n')
      const opening = blocks[blocks.indexOf(domain.name) + 1] ?? ''

      const cases = domain.held.reduce(
        (total, held) => total + held.contract.caseTables.reduce((n, table) => n + table.cases.length, 0),
        0,
      )
      const bytes = domain.held.reduce(
        (total, held) => total + held.implementation.files.reduce((n, file) => n + file.bytes, 0),
        0,
      )

      /**
       * A domain that publishes nothing states one figure and not four, and the arm is here rather
       * than in a widened loop.
       *
       * The three above are read off what is published, so on `array` they are `0`, `0` and `0` - and
       * a guard requiring the sentence to carry `0` is satisfied by *This domain publishes 0
       * contracts, settling 0 named edge cases*, which is the sentence ADR-0126 refused for saying
       * nothing correctly. What that page does state is how many contracts were turned down, so that
       * is what is required of it. ADR-0126.
       */
      const owed =
        domain.held.length === 0
          ? ([['how many it turned down', String(domain.turnedDown.length)]] as const)
          : ([
              ['how many contracts', String(domain.held.length)],
              ['how many cases they settle', String(cases)],
              ['what they weigh', bytes.toLocaleString('en-US').replaceAll(',', ' ')],
            ] as const)

      for (const [what, value] of owed) {
        expect(opening, `${domain.name}: the opening does not say ${what}`).toContain(value)
      }
    }
  })

  /**
   * **The payment of a decision taken ten units ago.** A case identifier was frozen with the major
   * version so that a URL could anchor on it, and `renderCase` has rendered
   * `number/parse@1#ordinary-integer` since `packages/registry/address.ts` was written, read by nothing. That
   * string is now the address of a case on the web: the page is the part before the `#` and the anchor
   * is the part after it.
   *
   * A page that anchored on anything else - a slug, an index, a rendering of the case's own data -
   * would be a second name for a thing that already has one, and the two would come apart.
   */
  it('every-case-is-anchored-by-the-identifier-its-address-is-made-of', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))

      for (const table of held.contract.caseTables) {
        for (const entry of table.cases) {
          const address = renderCase({ contract: held.contract.address, case: entry.id })

          expect(address).toBe(`${renderContract(held.contract.address)}#${entry.id}`)
          expect(rendered).toContain(` id="${entry.id}"`)
          expect(rendered).toContain(`href="#${entry.id}"`)
        }
      }
    }
  })

  /**
   * A group is a heading with its own address, and a case sits under the heading it names.
   *
   * The reading is the measurement, not the markup: `toText` is what a stranger, a crawler and a
   * screen reader get, so the guard asks that every group title appears there, in the order the
   * record declares, and that the cases following a title are exactly that group's - which is the
   * one thing a reader can check at a glance and a presence guard cannot.
   *
   * The mutant it exists for renders every case under the first heading. Every title is still on the
   * page, every case is still on the page, every anchor still resolves, and the reading is a lie.
   */
  it('every-group-is-a-heading-and-its-cases-follow-it', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))
      const reading = toText(page(pageOf(held.contract.address)))

      for (const table of held.contract.caseTables) {
        for (const group of table.groups) {
          expect(rendered).toContain(` id="${group.id}" class="group">`)
          expect(rendered).toContain(`href="#${group.id}"`)
        }

        // Where each title sits in the reading, and where each of its cases sits after it.
        const titles = table.groups.map((group) => ({
          group,
          at: reading.indexOf(`\n${group.title}\n`),
        }))

        expect(titles.filter(({ at }) => at < 0).map(({ group }) => group.id)).toEqual([])
        expect(titles.map(({ at }) => at)).toEqual([...titles.map(({ at }) => at)].sort((a, b) => a - b))

        for (const entry of table.cases) {
          const own = titles.findIndex(({ group }) => group.id === entry.group)
          const after = titles[own + 1]?.at ?? reading.length
          const sits = reading.indexOf(asRead(entry.rationale))

          expect(
            sits > (titles[own] as (typeof titles)[number]).at && sits < after,
            `${entry.id} does not read under ${entry.group}`,
          ).toBe(true)
        }
      }
    }
  })

  /**
   * A group's note reaches the reading, between its heading and its first case.
   *
   * The field exists because putting that prose in a comment took it off the page it asked to be on,
   * so a guard that only checked the field was carried would be checking the thing that was already
   * true. What has to hold is that a reader sees it, and where.
   *
   * **The note is compared through `asRead`, like the rationale one line below it.** It was compared
   * raw until a note carried a mark: every note that existed happened to be plain prose, so a guard
   * that searched a converted reading for unconverted text was green for want of an instance.
   *
   * A minority of groups carry one, and the count is not asserted: it is a number that grows
   * whenever somebody has something to say, which is exactly the shape a guard must not pin.
   */
  it('a-group-note-is-read-between-the-heading-and-the-first-case', () => {
    for (const held of heldByTheRegistry(source)) {
      const reading = toText(page(pageOf(held.contract.address)))

      for (const table of held.contract.caseTables) {
        for (const group of table.groups) {
          if (group.note === null) continue

          const first = table.cases.find((entry) => entry.group === group.id)
          const title = reading.indexOf(`\n${group.title}\n`)
          const note = reading.indexOf(asRead(group.note))

          expect(note, `${group.id}: the note is not in the reading`).toBeGreaterThan(-1)
          expect(note, `${group.id}: the note reads before its heading`).toBeGreaterThan(title)
          expect(
            note,
            `${group.id}: the note reads after its first case`,
          ).toBeLessThan(reading.indexOf(asRead((first as NonNullable<typeof first>).rationale)))
        }
      }
    }
  })

  /**
   * A heading is a title, and a table's purpose is only a title when it separates two tables.
   *
   * On the three contracts carrying one table the purpose is a sentence in the lower case a sentence
   * is written in, and a heading that is not a title enters the document outline and is announced as
   * a section by a screen reader - with nothing on the other side of it, because there is no second
   * table. So it is a paragraph there, and the groups take `h3`; where two tables genuinely separate
   * something, the purpose keeps its heading and the groups sit at `h4`.
   */
  it('a-table-purpose-is-a-heading-only-when-it-separates-two-tables', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))
      const alone = held.contract.caseTables.length === 1
      const level = alone ? 'h3' : 'h4'

      for (const table of held.contract.caseTables) {
        expect(rendered.includes(`<h3 class="table">${table.purpose}</h3>`)).toBe(!alone)

        for (const group of table.groups) {
          expect(rendered).toContain(`<${level} id="${group.id}" class="group">`)
        }
      }
    }
  })

  /**
   * No two things on one page answer to one `#id`.
   *
   * A group and a case are anchored in the same space, so a duplicate is a link that silently lands
   * on the wrong element - the failure that only shows up once somebody has shared the link.
   * `every-case-is-addressed` asks this of a contract's data; this asks it of the document, which is
   * where the collision would actually happen and which carries every table at once.
   */
  /**
   * The rail of a contract page names every section of it, in order, and names nothing else.
   *
   * **What this is worth, and what it is not, stated rather than left to a reader.** Both halves are
   * built from one array in `contract-page.ts`, so today the guard cannot fail — which is exactly the
   * trap ADR-0087 names: perturbing an object derived from a claim establishes that the derivation is
   * self-consistent, and a derivation with a hole in it is self-consistent too.
   *
   * It is written anyway, and for a named event rather than for today: **a rail written out by hand.**
   * That is the ordinary way a table of contents comes into existence, it is what the first draft of
   * this page nearly was, and its cost is a section a reader cannot reach on the page that will be
   * most of this site — silently, because every link still resolves and every heading is still there.
   * The day somebody writes `['What it does', 'Signature', ...]` beside the sections, this reddens on
   * the first section added after it. ADR-0116.
   */
  it('the-rail-of-a-page-names-every-section-of-it-and-only-those', () => {
    for (const held of heldByTheRegistry(source)) {
      const document = page(pageOf(held.contract.address))
      const railed: string[] = []
      const sectioned: string[] = []

      const walk = (node: Parameters<typeof readingOf>[0], inRail: boolean): void => {
        if (node.kind !== 'element') return

        const rail = inRail || node.attributes['class'] === 'rail'
        const href = node.attributes['href']
        const id = node.attributes['id']

        if (rail && node.tag === 'a' && href !== undefined) railed.push(href.replace('#', ''))
        if (!rail && node.tag === 'h2' && id !== undefined) sectioned.push(id)

        for (const child of node.children) walk(child, rail)
      }

      for (const node of document.body) walk(node, false)

      expect(sectioned.length, `${held.contract.address.name}: the page has no addressed sections`)
        .toBeGreaterThan(0)
      expect(railed, `${held.contract.address.name}: the rail and the sections disagree`).toEqual(
        sectioned,
      )
    }
  })

  it('every-anchor-on-a-page-is-held-by-one-element', () => {
    for (const [path, document] of pages()) {
      const ids = [...toHtml(document).matchAll(/ id="([^"]+)"/g)].map((found) => found[1] as string)
      const twice = [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))]

      expect(twice, `${path} anchors the same address twice`).toEqual([])
    }
  })

  /**
   * A case is rendered as the call it is, which is what the parameter names were carried into the
   * record for. The arguments come from the signature, in the signature's order, and what is left is
   * the answer.
   */
  it('a-case-is-rendered-as-the-call-its-signature-declares', () => {
    const parse = toText(
      page(pageOf({ language: 'typescript', name: 'number/parse', major: 1 })),
    )
    const distance = toText(
      page(pageOf({ language: 'typescript', name: 'string/levenshtein', major: 1 })),
    )

    // Two answer fields, so both are named; one answer field, so it is written bare.
    expect(parse).toContain("parseNumber('42') → expected 42, reason null")
    expect(distance).toContain("levenshtein('kitten', 'sitting') → 3")

    // The two arguments of a two-parameter signature, in the signature's order and not the table's.
    expect(distance).toContain("levenshtein('abc', '') → 3")
    expect(distance).toContain("levenshtein('', 'abc') → 3")

    // And an input a page must never print as it is, because another case prints the same glyphs.
    expect(parse).toContain("parseNumber('1\\u00A0000') → expected null, reason 'separator'")
    expect(parse).toContain("parseNumber('1 000') → expected null, reason 'not-decimal'")
  })

  /**
   * A use case reaches the reader as the call, its answer, and the warning that goes with it.
   *
   * **This is the half `every-use-case-replays-through-the-stripped-artefact-a-browser-runs` cannot
   * see, and the distinction is worth stating because it is easy to think one guard covers both.**
   * That one asks the record: it calls the shipped module with the declared arguments and refuses a
   * declared answer the function does not produce. It never looks at a page. So a rendering that
   * printed the argument where the answer goes, or dropped the caveat, would publish a false
   * demonstration with the replay green - which is exactly the shape of defect this catalogue exists
   * to refuse. `a-case-is-rendered-as-the-call-its-signature-declares` is the same guard for the
   * settled cases, and this is its counterpart for the cards above them.
   *
   * The caveat is asserted by name rather than by counting the cards, because the caveat is the field
   * a use case is worth reading for: a card without it is four confident lines telling somebody that
   * `C++` and `C#` both answer `c` is fine. ADR-0118.
   */
  it('a-use-case-shows-its-call-its-answer-and-its-caveat', () => {
    const faults: string[] = []
    const declaring = heldByTheRegistry(source).filter((held) => held.binding.useCases !== undefined)

    for (const held of declaring) {
      const what = renderContract(held.contract.address)
      const reading = toText(page(pageOf(held.contract.address)))
      const answer = held.contract.surface.exports.find(
        (entry) => entry.role === 'the-answer',
      ) as (typeof held.contract.surface.exports)[number]

      for (const entry of held.binding.useCases ?? []) {
        const { written, answered } = theCallOf(entry, answer)
        const call = `${answer.name}(${written.join(', ')}) → ${answered
          .map((field) => literal(field.value))
          .join(', ')}`

        if (!reading.includes(call)) faults.push(`${what}: the page does not read \`${call}\``)
        if (!reading.includes(asRead(entry.caveat))) {
          faults.push(`${what}: the caveat of "${entry.name}" does not reach the reader`)
        }
        if (!reading.includes(asRead(entry.situation))) {
          faults.push(`${what}: the situation of "${entry.name}" does not reach the reader`)
        }
      }
    }

    expect(declaring.length).toBeGreaterThan(0)
    expect(faults).toEqual([])
  })

  /**
   * A re-examination reaches the reader whole, all three statements of it.
   *
   * The registry can hold this and the page can drop it, and the failure would be silent in the worst
   * way available here: a contract page that says nothing about the language is exactly what a contract
   * page said before ADR-0150, so nothing would look wrong. What a reader loses is the answer to the
   * question they arrived with.
   *
   * **All three are asserted rather than the block being counted**, because they are three different
   * kinds of statement and losing any one of them leaves something worse than silence. Without
   * `whatMoved` the measurement has no subject; without `measurement` the conclusion is the assertion
   * ADR-0042 refuses; without `whatItEstablishes` a reader is handed a divergence count and left to
   * infer that the contract is obsolete, which is the opposite of what it says.
   *
   * `a-use-case-shows-its-call-its-answer-and-its-caveat` is the same guard one section along, and the
   * neighbour worth naming is `every-re-examination-carries-the-commit-it-was-taken-at`: that one is
   * about what the registry holds, this one about what arrives on screen, and neither can see the
   * other's defect.
   */
  it('a-re-examination-reaches-the-reader', () => {
    const faults: string[] = []
    const declaring = heldByTheRegistry(source).filter(
      (held) => held.binding.againstTheLanguage !== undefined,
    )

    for (const held of declaring) {
      const what = renderContract(held.contract.address)
      const reading = toText(page(pageOf(held.contract.address)))

      for (const entry of held.binding.againstTheLanguage ?? []) {
        for (const [field, prose] of Object.entries(entry)) {
          if (!reading.includes(asRead(prose))) {
            faults.push(`${what}: the ${field} of a re-examination does not reach the reader`)
          }
        }
      }
    }

    expect(declaring.length).toBeGreaterThan(0)
    expect(faults).toEqual([])
  })

  /**
   * A correction to a frozen sentence reaches the reader, and reaches them beside that sentence.
   *
   * **Two claims and the second is the one worth a guard.** That the correction appears at all is the
   * shape `a-re-examination-reaches-the-reader` already keeps for its own field. That it appears
   * *inside the case it corrects* is what this repair is for: a reader who reads a rationale and meets
   * its correction three screens down has already believed the rationale, and a correction they meet
   * afterwards repairs nothing.
   *
   * The second half is read by cutting the page at the case's own anchor and requiring the correction
   * to be on the near side of the next one - which is the weakest true statement of *beside*, and the
   * strongest this file can make without transcribing a layout into an expectation.
   *
   * **What it does not check is that the frozen sentence is still there.** It has to be, and nothing
   * here could remove it: it comes out of the digest. `a-correction-names-a-case-the-contract-settles-and-quotes-what-it-says`
   * is the neighbour, and it reads the registry where this reads the screen. ADR-0161.
   */
  it('a-correction-reaches-the-reader-beside-the-sentence-it-corrects', () => {
    const faults: string[] = []
    const declaring = heldByTheRegistry(source).filter(
      (held) => held.binding.correctionsToFrozenProse !== undefined,
    )

    for (const held of declaring) {
      const what = renderContract(held.contract.address)
      const reading = toText(page(pageOf(held.contract.address)))
      const cases = held.contract.caseTables.flatMap((table) => table.cases)

      for (const entry of held.binding.correctionsToFrozenProse ?? []) {
        const at = reading.indexOf(asRead(entry.published))
        if (at === -1) {
          faults.push(`${what}: the sentence ${entry.about} corrects does not reach the reader`)
          continue
        }

        for (const [field, prose] of Object.entries(entry)) {
          if (field === 'about') continue
          if (!reading.includes(asRead(prose))) {
            faults.push(`${what}: the ${field} of the correction to ${entry.about} does not reach the reader`)
          }
        }

        // The next case's rationale, whichever it is, bounds what counts as beside.
        const after = cases
          .map((one) => reading.indexOf(asRead(one.rationale)))
          .filter((where) => where > at)
        const bound = after.length === 0 ? reading.length : Math.min(...after)
        const said = reading.indexOf(asRead(entry.whatItEstablishes))

        if (said < at || said > bound) {
          faults.push(`${what}: the correction to ${entry.about} is not beside the case it corrects`)
        }
      }
    }

    expect(declaring.length).toBeGreaterThan(0)
    expect(faults).toEqual([])
  })

  /**
   * What the contract freezes and what the registry may rewrite are never read under one heading.
   *
   * A contract page carries two kinds of prose that look identical on screen. `identity.description`
   * and `identity.inputDomain` are inside `contractSnapshot`, so they are frozen for the life of the
   * major and a reader may rely on them. A use case and a re-examination are standing, which is the
   * mechanism ADR-0118 built precisely so the registry could change its mind about them. A heading
   * that carries both makes one promise out of two, and it is the weaker one that a reader is left
   * believing about the whole.
   *
   * **It was red before ADR-0151 and it names what was wrong there.** `againstTheLanguage` rendered as
   * three paragraphs at the tail of *What it does*, immediately after the frozen description and in the
   * same weight, so the page said *this function adds a duration to a Date* and *Temporal parts from it
   * on five rows* in one breath, with nothing telling a reader which of the two is bound.
   *
   * **The neighbour is `a-re-examination-reaches-the-reader`, and neither can see the other's defect.**
   * That one asks whether all three statements arrive on the page and is indifferent to where; this one
   * asks nothing about arrival and everything about company. Moving the block back under *What it does*
   * leaves that guard green and reddens this one; dropping `whatItEstablishes` does the reverse.
   */
  it('what-is-frozen-and-what-the-registry-may-rewrite-are-never-one-section', () => {
    const faults: string[] = []
    const declaring: string[] = []

    for (const held of heldByTheRegistry(source)) {
      const what = renderContract(held.contract.address)
      const { identity } = held.contract
      const frozen = [identity.description, identity.inputDomain, identity.relationToTheLanguage]
      const standing = [
        ...(held.binding.useCases ?? []).flatMap((entry) => [entry.situation, entry.caveat]),
        ...(held.binding.againstTheLanguage ?? []).flatMap((entry) => [
          entry.whatMoved,
          entry.measurement,
          entry.whatItEstablishes,
        ]),
      ]

      if (standing.length > 0) declaring.push(what)

      for (const [heading, reading] of underEachHeading(page(pageOf(held.contract.address)))) {
        const carries = (prose: readonly (string | undefined)[]): boolean =>
          prose.some((one) => one !== undefined && reading.includes(asRead(one)))

        if (carries(frozen) && carries(standing)) {
          faults.push(`${what}: "${heading}" reads a frozen sentence and a revisable one as one`)
        }
      }
    }

    // Without a contract declaring standing prose there is no pair to separate, and a guard whose
    // population is empty passes for the reason ADR-0087 refuses.
    expect(declaring.length).toBeGreaterThan(0)
    expect(faults).toEqual([])
  })

  /**
   * A contract the catalogue refused must be findable and must never be offered - the rule
   * `toopo search` already follows on the terminal, arriving on the page where somebody would click.
   */
  it('nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed', () => {
    const refused = index.entries.find((entry) => !entry.installable)
    const everyPage = [...pages().values()].map(toText).join('\n')

    expect(refused).toBeDefined()
    expect(everyPage).not.toContain(`toopo add ${refused?.address.name}`)
    /**
     * **The front page links it, which is what findable means and is not what this asked before.**
     *
     * It required the rendered address to occur in the page's HTML, and that was satisfied for as
     * long as the catalogue printed it as the link's own text. The front page now names contracts by
     * their short name under the domain each belongs to - so the rendered address survives only in
     * the `href`, the assertion went on passing, and a reader could no longer see the string it was
     * looking for. The guard was green for a reason that had stopped being its claim.
     *
     * A link is the stronger form either way: a string in the markup can be in a script, an
     * attribute or a comment, and only a link is something a reader can follow.
     */
    expect(html(CATALOGUE_PAGE)).toContain(
      `href="${rootFrom(CATALOGUE_PAGE)}${linkTo(pageOf(refused?.address as never))}"`,
    )
    expect(toText(page(REFUSALS_PAGE))).toContain(
      renderContract(refused?.address as never),
    )
  })

  /**
   * Every command the site tells a reader to run carries the invocation this code declares.
   *
   * **This is the defect a visitor met, and a contract page is where they met it.** The four contract
   * pages and the catalogue printed `toopo add …`, which answers `command not found` for anybody who
   * has installed nothing - and somebody who has installed nothing is exactly who a contract page is
   * for. It was the first thing they were told to do, and it failed.
   *
   * **The subject is the install command and nothing else, which is narrower than it first looked and
   * is where two wider readings were measured and refused.** Sweeping every occurrence of a command
   * went red on nine, and sweeping every line that starts with one went red on four: all thirteen are
   * mutant descriptions the method page publishes - `so \`toopo remove imagined-string/pad\` on a …`, and four
   * that open a sentence with the command they are about. Those name a command as the subject of a
   * sentence; prefixing them would be false, because nobody is being told to run anything.
   *
   * So the sweep is over what the site actually instructs, and an install instruction is recognisable
   * by construction rather than by punctuation.
   *
   * **It used to recognise one by the fact that it names a contract of this catalogue, and that broke
   * the day the front page printed the shape of every command at once.** `add domain/function` names
   * no contract, so a guard keyed to the five names carried no opinion about the one command a reader
   * meets before they know what a contract is called - which is the surface the original defect was
   * found on. The recognition is now the shape of an *address* rather than the list of them: `add`
   * followed by a slash-separated pair. That is strictly wider, it needs nothing added when a sixth
   * contract is published, and it is still not a lint over prose - the thirteen mutant descriptions
   * that made the two wider sweeps red name a command as the subject of a sentence and never hand it
   * an address, which is what the slash tests for.
   *
   * Measured before it was believed: 24 occurrences of `toopo add` across the eleven pages of the
   * tree, 24 of them carrying the invocation, and the fault reads `toopo add domain/function` with the
   * front page's command written bare.
   */
  it('every-command-the-site-tells-a-reader-to-run-carries-the-invocation', () => {
    const everyPage = [...pages().values()].map(toText).join('\n')
    const installable = index.entries
      .filter((entry) => entry.installable)
      .map((entry) => entry.address.name)

    // Total over the catalogue: every installable contract is offered, and offered runnably.
    expect(installable).not.toEqual([])
    expect(
      installable.filter((name) => !everyPage.includes(`${THE_INVOCATION} add ${name}`)),
    ).toEqual([])

    // Total over the surface: no install instruction anywhere is written bare, named or generic.
    expect(
      everyPage.match(/(?<!npx )toopo add \S+\/\S+/g) ?? [],
      'an install command a reader cannot run',
    ).toEqual([])
  })

  /**
   * The cost on the page is the cost of running the command, which is the implementation's own file
   * and not the harness. The two differ by an order of magnitude - `number/parse@1` serves 57 684
   * bytes of harness and installs 4 154 - so a page that stated the wrong one would publish the
   * project's most immediate comparative claim as a number ten times too large.
   */
  it('the-cost-a-page-states-is-what-lands-and-not-what-is-served', () => {
    for (const held of heldByTheRegistry(source)) {
      const installed = held.implementation.files.reduce((total, file) => total + file.bytes, 0)
      const served = held.contract.harness.reduce((total, file) => total + file.bytes, 0)
      const reading = toText(page(pageOf(held.contract.address)))

      expect(installed).toBeLessThan(served)
      expect(reading).toContain(`${installed.toLocaleString('en-US').replaceAll(',', ' ')} bytes`)
      expect(held.implementation.files.map((file) => file.path)).toEqual(['reference.ts'])
    }
  })

  /**
   * Every figure of the card counts one thing, and a proportion is stated where its breakdown is.
   *
   * The card used to carry `2 / 4` under `properties checked`, beside three figures that each answer a
   * question a reader arrived with - what am I taking on, what does it pull in, is this serious. A
   * bare ratio answers none of them and is read as a count of holes, which is the same defect
   * `the-readme-never-gives-a-survivor-total-without-its-split` keeps one repository over.
   *
   * **The two halves are one claim and not two.** Taking the ratio off the card would be a page
   * hiding an unflattering number if the number were not somewhere a reader can act on it; leaving it
   * on the card would be a proportion published away from its own breakdown. So the guard requires
   * both at once: nothing on the card is a proportion, and the section that lists every property with
   * its verdict and its reason states how many of them are checked.
   *
   * **It perturbs the claim and not the record.** Both the sentence and the list below it are derived
   * from `properties.universal`, so moving that record moves the two together and a guard comparing
   * them would be green over a derivation with a hole in it - ADR-0087. What is asserted here is what
   * the card is *for*: a figure is a quantity, which is a statement about the card that no amount of
   * consistency between two derived things establishes.
   *
   * Seen red before it was believed, on both halves: with the figure put back the card carries
   * `2 / 4`, and with the count taken out of the sentence the section no longer names it.
   */
  /**
   * The command and the signature are two labelled blocks, and this keeps the half of that a
   * document can carry.
   *
   * They were two `pre`s of the same size in matching frames, stacked one under the other, and the
   * owner could not tell which of them to run on a page he had just been shown. A visitor arriving
   * from a search wants the first.
   *
   * **What the stylesheet now does is not readable here, and saying so is the point.** The accent,
   * the ground, the heavy edge and the larger face are a browser reading; what a document can be
   * asked is that each block exists, that each is labelled, and that the two labels differ. This
   * guard does not pretend to the other half.
   *
   * Its red event is somebody flattening the card back to two bare `pre`s or dropping a label -
   * which is the state this page was in, and the one no stylesheet can repair from the outside.
   *
   * **The neighbour it is not**:
   * `nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed` asks whether the
   * command is there at all and carries no opinion about what stands beside it. This one asks what
   * the two blocks are, and is blind to whether the command is the right one -
   * `every-command-the-site-tells-a-reader-to-run-carries-the-invocation` owns that.
   *
   * The refused contract is rendered by another page entirely, so the assertion over it is that none
   * of these four parts is present rather than that some of them are.
   */
  it('the-command-and-the-signature-of-a-card-are-two-labelled-blocks', () => {
    const installable = new Set(
      index.entries
        .filter((entry) => entry.installable)
        .map((entry) => renderContract(entry.address)),
    )

    const partsOf = (document: Parameters<typeof toText>[0]): readonly string[] => {
      const found: string[] = []
      const walk = (node: Parameters<typeof readingOf>[0], within: string | null): void => {
        if (node.kind !== 'element') return

        const own = node.attributes['class'] ?? ''
        const block = own === 'get' || own === 'sig' ? own : within

        if (block !== null && own === 'label') found.push(`${block} is labelled ${readingOf(node).trim()}`)
        if (block !== null && node.tag === 'pre') found.push(`${block} holds pre.${own}`)

        for (const child of node.children) walk(child, block)
      }

      for (const node of document.body) walk(node, null)

      return found
    }

    for (const held of heldByTheRegistry(source)) {
      const rendered = renderContract(held.contract.address)
      const parts = partsOf(page(pageOf(held.contract.address)))

      expect(parts, rendered).toEqual(
        installable.has(rendered)
          ? [
              'get is labelled Install',
              'get holds pre.install',
              'sig is labelled Signature',
              'sig holds pre.answer',
            ]
          : [],
      )
    }
  })

  /**
   * The ways a page hands over are the registry's own, and the one it prints is one that runs.
   *
   * **The defect this is against is the one a visitor already met**, and it was met on the first
   * thing they tried: four surfaces printed a command that answers `command not found`. Offering a
   * choice of package manager multiplies that surface by four, and three of the four spellings were
   * never measured by this repository until they were. `yarn dlx` is the one that does not work.
   *
   * So two things are asserted and they fail differently. **The table is handed over rather than
   * written**, deep-equal to `THE_WAYS_TO_RUN_IT`, so a page cannot carry a fifth manager somebody
   * typed into a template - which is where an unmeasured form would arrive. And **the spelling the
   * page prints is one declared to run**, and specifically the invocation, so no edit can make the
   * served command a refused one.
   *
   * What it does not reach: whether a spelling in that table really runs. That is a measurement
   * against the published package, it is written in the table's own comment with the versions it was
   * taken at, and no guard here can take it. ADR-0138 says so rather than implying coverage.
   *
   * The refused contract has no install block, so it hands over no ways - which is asserted rather
   * than skipped.
   */
  it('the-ways-a-page-hands-over-are-the-declared-ways-and-the-one-it-prints-runs', () => {
    const installable = new Set(
      index.entries
        .filter((entry) => entry.installable)
        .map((entry) => renderContract(entry.address)),
    )

    const handedOver = (document: Parameters<typeof toText>[0]): string | null => {
      let found: string | null = null
      const walk = (node: Parameters<typeof readingOf>[0]): void => {
        if (node.kind !== 'element') return
        if (node.attributes['data-ways'] !== undefined) found = node.attributes['data-ways']
        for (const child of node.children) walk(child)
      }

      for (const node of document.body) walk(node)

      return found
    }

    for (const held of heldByTheRegistry(source)) {
      const rendered = renderContract(held.contract.address)
      const document = page(pageOf(held.contract.address))
      const declared = handedOver(document)

      if (!installable.has(rendered)) {
        expect(declared, `${rendered} offers nothing to run`).toBeNull()
        continue
      }

      expect(declared, `${rendered} hands its ways over`).not.toBeNull()
      expect(JSON.parse(declared as string), rendered).toEqual(THE_WAYS_TO_RUN_IT)

      const printed = toText(document)
      const runs = THE_WAYS_TO_RUN_IT.filter((way) => way.refusedBecause === undefined)

      expect(runs.map((way) => way.spelling), 'the invocation is a way that runs').toContain(
        THE_INVOCATION,
      )
      expect(printed, `${rendered} prints a command that runs`).toContain(
        `${THE_INVOCATION} add ${held.contract.address.name}`,
      )
    }
  })

  /**
   * A figure of the card is a count, and a proportion belongs beside its breakdown rather than in it.
   *
   * **Half of it was disabled for the whole of its life, and a mutant is what said so.** The refusal
   * of the word reads `/\bof\b|\//`, and the two word boundaries were sitting in the file as literal
   * backspace characters - the collapse an escape suffers when a source is edited through a shell
   * heredoc rather than through an editor. The file compiled, the guard collected, it went green on
   * every run, and it refused a slash and nothing else. It was found while a second guard of this same
   * session was born the same way and stayed green with the defect it exists for injected.
   *
   * **The class is worth more than the instance.** Nothing here reads a source for a control character,
   * and the only reason this one surfaced is that a `\b` written the same way and perturbed the same
   * afternoon failed to redden. A guard whose text is quietly narrowed does not look narrowed: it looks
   * like a guard. Seen red before this note was believed, with ` of ` put into a figure's own rendering:
   * the fault reads `"4 299 of bytes, one file" is one count and not a proportion`.
   */
  it('every-figure-of-the-card-is-a-quantity-and-a-proportion-sits-with-its-breakdown', () => {
    const figures = (document: Parameters<typeof toText>[0]): readonly string[] => {
      const found: string[] = []
      const walk = (node: Parameters<typeof readingOf>[0]): void => {
        if (node.kind !== 'element') return
        if (node.attributes['class'] === 'figure') found.push(readingOf(node).trim())
        else for (const child of node.children) walk(child)
      }

      for (const node of document.body) walk(node)

      return found
    }

    for (const held of heldByTheRegistry(source)) {
      const document = page(pageOf(held.contract.address))

      const shown = figures(document)
      expect(shown.length, 'the card states some figures').toBeGreaterThan(0)

      for (const reading of shown) {
        /** A figure is a number and then what it counts, so what comes first is a number or nothing. */
        const value = (/^[\d ]+/.exec(reading) ?? [''])[0].replaceAll(' ', '')
        expect(value, `"${reading}" opens on a quantity`).toMatch(/^\d+$/)
        expect(reading, `"${reading}" is one count and not a proportion`).not.toMatch(/\bof\b|\//)
      }

      const properties = held.contract.properties.universal
      const checked = properties.filter((property) => property.applicable).length
      const said = underEachHeading(document).get('Properties') ?? ''

      /**
       * The opening sentence and not the whole section, because the whole section holds every reason
       * written out and a stray digit anywhere in it would satisfy a search for a count. It is the
       * sentence rather than a transcription of it: a guard holding a copy of the words goes stale on
       * the first reword, which is what `asRead` exists one file along to stop.
       */
      const opening = `${said.split('.')[0] as string}.`

      expect(opening, 'the opening names how many are checked').toContain(String(checked))
      expect(opening, 'the opening names how many there are').toContain(String(properties.length))
      for (const property of properties) {
        expect(said, `${property.name} carries its verdict`).toContain(property.name)
      }
    }
  })

  /**
   * A page that renders an answer nobody checked undoes the argument the whole registry rests on. The
   * generator is the consumer with the most to lose by skipping the check: it publishes the definition
   * to everybody, and nothing downstream ever asks again.
   */
  it('a-snapshot-that-does-not-hash-to-its-own-address-stops-the-build', () => {
    const tampered = {
      ...source,
      snapshot: (digest: string) => {
        const answer = source.snapshot(digest)

        return answer === null ? null : { ...answer, canonicalText: answer.canonicalText.replace('a', 'b') }
      },
    }

    expect(() => heldByTheRegistry(tampered)).toThrow(ThePageCannotBeBuilt)
  })

  /**
   * The sentence about what a browser actually runs is on the playground, once, and nowhere else.
   *
   * `browser.ts` strips the types off a contract's `reference.ts`, so the JavaScript that answers a
   * reader is neither the file the registry serves nor the file the digest covers. That is worth
   * exactly one sentence, in the one place somebody is looking at an answer it produced - saying it
   * again under *What you can check yourself* would blur the section that is about the frozen
   * definition, where nothing has changed at all.
   */
  it('what-runs-in-your-browser-is-said-once-and-beside-the-playground', () => {
    for (const path of pages().keys()) {
      const reading = toText(page(path))
      const entry = index.entries.find((one) => pageOf(one.address) === path)

      /**
       * A page with no playground must not say it, which is what this arm always held and what a
       * turned-down contract joined rather than was exempted from. `browser.ts` strips a
       * `reference.ts`, and a contract the catalogue refused has no reference module to strip - so the
       * sentence would be about something that does not exist. The discriminator is therefore whether
       * the contract is installable and no longer whether the path is a contract's. ADR-0127.
       */
      if (entry === undefined || !entry.installable) {
        expect(reading).not.toContain('types stripped')
        continue
      }

      const said = whatRunsInYourBrowser(entry.address.name)

      const sections = underEachHeading(page(path))

      expect(reading.split(said)).toHaveLength(2)
      expect(
        sections.get('Try it on your own input'),
        `${path}: it is not said beside the playground`,
      ).toContain(said)
      expect(
        [...sections].filter(
          ([title, under]) => title !== 'Try it on your own input' && under.includes(said),
        ),
        `${path}: it is said under a second heading as well`,
      ).toEqual([])
    }
  })

  /**
   * With no JavaScript a page is prose, never a control that does nothing.
   *
   * The form is built by `start.ts` rather than served inert, so what a reader without JavaScript
   * meets is two paragraphs saying what the playground would do. A served `<input>` nobody can use is
   * the same defect as an empty section - it tells a reader something is there and it is not - and it
   * is the one this arrangement exists to avoid.
   *
   * The `script` node carries attributes and no children, which is what keeps `document.ts`'s rule
   * that no node holds raw markup true with a script on the page.
   */
  it('a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))
      expect(rendered).not.toContain('<input')
      expect(rendered).not.toContain('<form')
      expect(rendered).toMatch(/<div id="playground" data-playground="[^"]+"><\/div>/)
      expect(rendered).toMatch(/<script type="module" src="[^"]+"><\/script>/)

      // What a reader without JavaScript meets where the form would be: a sentence, not a gap.
      expect(
        underEachHeading(page(pageOf(held.contract.address))).get('Try it on your own input'),
      ).toContain('What you type into a field is the value')
    }
  })

  /**
   * Every page runs the one module this site has, and serves the search as a slot rather than a
   * control.
   *
   * **It is every page since the masthead gained a field**, where it used to be the four with a
   * playground - so the claim moved from *a contract page runs something* to *this site runs
   * something*, and the guard moved with it. What is served is a `div` carrying two addresses and no
   * children: a reader with no JavaScript meets a masthead with nothing extra in it, which is what
   * `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` asks for one floor up.
   *
   * **The `input` is asserted absent on every page and not only where a form is**, which is the
   * neighbouring claim rather than a repetition: the guard above says a contract page serves no
   * playground field, and this says no page serves a *search* field. They would come apart the day
   * somebody served the box instead of building it, and only this one would see it.
   */
  it('every-page-runs-the-one-module-and-serves-the-search-as-a-slot', () => {
    const built = [...pages()]

    expect(built.length).toBeGreaterThan(1)
    expect(
      built
        .filter(([path]) => !/<script type="module" src="[^"]*"><\/script>/.test(html(path)))
        .map(([path]) => path),
    ).toEqual([])
    expect(
      built
        .filter(([path]) => !/<div class="search" data-search="[^"]+"><\/div>/.test(html(path)))
        .map(([path]) => path),
    ).toEqual([])
    expect(built.filter(([path]) => html(path).includes('<input')).map(([path]) => path)).toEqual([])
  })

  /**
   * The three queries the masthead offers before anybody types are three this catalogue answers.
   *
   * **An example that finds nothing is the defect a visitor met on the install command** - found by
   * them, on the first thing they tried, rather than by a sweep. Here it is worse: the example is this
   * site's own demonstration that describing a need finds a function, so one that answers nothing
   * disproves the claim it was put there to make.
   *
   * Each is required to reach a *different* contract, which is what the set is for. Three examples
   * that all landed on `string/slugify@1` would answer this guard's first half and show a reader one
   * thing three times.
   */
  it('every-example-the-masthead-offers-is-answered-by-the-catalogue', () => {
    const index = source.contractIndex()
    const refusals = source.refusals()
    const answered = THE_EXAMPLES.map(
      (query) => [query, search(index, refusals, query).results] as const,
    )

    expect(THE_EXAMPLES.length).toBeGreaterThan(0)
    expect(answered.filter(([, results]) => results.length === 0).map(([query]) => query)).toEqual([])
    expect(
      new Set(answered.map(([, results]) => renderContract((results[0] as { address: Parameters<typeof renderContract>[0] }).address))).size,
    ).toBe(THE_EXAMPLES.length)
  })

  /**
   * The page a reader arrives at is a name and two doors, and it tells nobody to run anything.
   *
   * **It is the third version of that page and the owner said he would not look at a fourth**, so what
   * this keeps is the decision rather than a property of it: a static element carrying the name, one
   * way into the catalogue, one way to understand what is in there. A block added to it is the event,
   * and the event is cheap to cause - every page of this site grew by somebody having one more true
   * thing to say, which is exactly how the two rejected versions were built.
   *
   * **The second half is the defect a visitor actually met.** The first version printed the shape of
   * every command at once, `add domain/function`, so that no contract was privileged on the page that
   * represents them all. The constraint was right and its form was a template, which a reader sees.
   * A command belongs to a contract, so it is on every contract's page and on none of the pages that
   * are about the catalogue - and `every-command-the-site-tells-a-reader-to-run-carries-the-invocation`
   * has no opinion here, because it asks whether a command is *runnable* and this asks that there be
   * none.
   *
   * **Written beside the guard above it**, which is about the site staying connected: that one would be
   * green with a fourth door, a paragraph and a command on this page, because everything it reaches is
   * still reached. ADR-0140.
   */
  it('the-page-a-reader-arrives-at-is-a-name-and-two-doors', () => {
    const elementsOf = (nodes: readonly Node[]): readonly Element[] =>
      nodes.filter((node): node is Element => node.kind === 'element')

    const mainOf = (node: Node): readonly Node[] | null => {
      if (node.kind === 'text') return null
      if (node.tag === 'main') return node.children

      for (const child of node.children) {
        const found = mainOf(child)
        if (found !== null) return found
      }

      return null
    }

    const inside = elementsOf(
      page(FRONT_PAGE)
        .body.map(mainOf)
        .find((found) => found !== null) ?? [],
    )

    // The name, the line under it, and the doors - and no fourth block.
    expect(inside.map((node) => node.tag)).toEqual(['h1', 'p', 'div'])
    expect(elementsOf(inside[2]?.children ?? []).map((node) => node.tag)).toEqual(['a', 'a'])

    // And nothing here tells a reader to run anything: a command belongs to a contract.
    const commands = /toopo (add|remove|update|init|search|list)\b/g

    expect(toText(page(FRONT_PAGE)).match(commands) ?? []).toEqual([])
  })

  /**
   * Every page the site holds is reached from the front page by following links, and no link leaves it.
   *
   * **Asked of the anchors in the body rather than of every `href` in the served string**, and the
   * alternate link is what forced the distinction: a page's head now declares that its own Markdown
   * exists, which is an `href` a reader can never click and which this guard duly counted as
   * navigation. The repair is the discipline `document.ts` is built on - ask the value, not the markup -
   * and it makes the guard say what it always meant: *what can somebody follow from here*.
   *
   * **A walk and no longer one hop, and the change is what the front page became.** It used to require
   * the front page to link every other page, which was true while the front page was the catalogue and
   * is false of a door: `/` offers two ways in and the masthead a third, and everything else is reached
   * through them. The claim was never *the front page links everything* - it is *no page of this site
   * is an orphan* - and one hop was the cheapest way to keep it while the site was flat.
   *
   * So it follows links from page to page until nothing new is reached, and its red event is stronger
   * than the old one: a page nobody links to, from anywhere, rather than a page the front page forgot.
   * **Seen red on it before it was believed**, by registering a page and pointing nothing at it.
   *
   * **The second half is what the one-hop form kept by accident and a walk would have dropped.**
   * Comparing the front page's hrefs against the list of pages refused an address outside the site,
   * because such an address was in the first list and not in the second; a walk that skipped what it
   * could not resolve would have lost that silently. So it is stated: every href of every page, and
   * not only of the one being walked from, resolves to a page of this site. `catalogue-page.ts` names
   * this guard for exactly that, and the pages have no absolute address to write. ADR-0140.
   */
  it('every-page-is-reachable-from-the-front-page', () => {
    const linksOf = (path: string): readonly string[] => {
      const found: string[] = []
      const walk = (node: Parameters<typeof readingOf>[0]): void => {
        if (node.kind === 'text') return

        const href = node.attributes['href']
        if (node.tag === 'a' && href !== undefined) found.push(href)

        for (const child of node.children) walk(child)
      }

      for (const node of page(path).body) walk(node)

      return found
    }

    /**
     * A page's links are written from where it stands, so they are resolved from where it stands -
     * against this site's own origin, which is where they will be resolved for real.
     */
    const byHref = new Map([...pages().keys()].map((path) => [`/${linkTo(path)}`, path]))
    const reached = new Set([FRONT_PAGE])
    const waiting = [FRONT_PAGE]
    const leadingNowhere: string[] = []

    for (const path of pages().keys())
      for (const href of linksOf(path))
        if (!href.startsWith('#') && !byHref.has(new URL(href, urlOf(path)).pathname))
          leadingNowhere.push(`${path} links ${href}`)

    while (waiting.length > 0) {
      const from = waiting.pop() as string
      for (const href of linksOf(from)) {
        const resolved = byHref.get(new URL(href, urlOf(from)).pathname)
        if (resolved !== undefined && !reached.has(resolved)) {
          reached.add(resolved)
          waiting.push(resolved)
        }
      }
    }

    // No orphan: every page is arrived at from the front page by following links.
    expect([...pages().keys()].filter((path) => !reached.has(path))).toEqual([])
    // And no link out: an address that is not a page of this site cannot be written on one.
    expect(leadingNowhere).toEqual([])
  })

  /**
   * The reading order is what a search engine indexes and what a screen reader announces, and it is the
   * measurement this unit was steered by. A page whose first three lines say the same sentence three
   * times wastes the only part a stranger reads - which is what the first draft did, and this is what
   * stops it coming back.
   */
  it('the-opening-of-a-page-says-three-different-things', () => {
    for (const path of pages().keys()) {
      const document = page(path)
      const [title, description, first] = toText(document).split('\n\n')

      // Distinct is not enough, and neither is containment: a title of `<name> — <summary>` and a
      // description that merely *begins* with the summary are two strings saying one thing twice,
      // which is what the first draft did and what reading the page in document order caught. So the
      // summary itself is what must not appear a second time.
      expect([title, description, first].every((part) => part !== undefined)).toBe(true)
      expect(new Set([title, description, first]).size).toBe(3)

      for (const entry of index.entries) {
        if (path !== pageOf(entry.address)) continue

        expect(title).toContain(entry.summary)
        expect(description).not.toContain(entry.summary)
      }
    }
  })

  /**
   * A page is addressed by the contract it is about, major version and all.
   *
   * Two independent statements: the path this generator writes, and the address the registry renders.
   * A page path that dropped the major would still be internally consistent - every link would be
   * built from the same wrong function, so a link check cannot see it - and `number/parse@2` would one
   * day be published over the page of `number/parse@1`. That is the mutant W-15 is, and it is why this
   * guard compares the path against `renderContract` rather than against another page.
   */
  it('a-page-is-addressed-by-the-contract-it-is-about', () => {
    for (const entry of index.entries) {
      expect(pageOf(entry.address)).toBe(`${renderContract(entry.address)}/index.html`)
      expect(pageOf(entry.address)).toContain(`@${entry.address.major}/`)
    }
  })

  /**
   * What a contract page says to a machine is what it renders to a person, field by field.
   *
   * **The two fields that could have been transcribed are the two this guard is really about.**
   * `license` is the one a machine reads as a fact about the code in front of it, and this repository is
   * MIT while what a reader *takes* is MIT-0 - so a page publishing `MIT` here would tell every scanner
   * the wrong thing about a file somebody now maintains themselves, which ADR-0047 names as the most
   * expensive defect this project can produce and the only one invisible from here. `url` is the address
   * a licence header freezes into repositories nobody here will see again.
   *
   * Nothing is compared against a literal: each side is read from the record the page was built from, so
   * a field that stopped being derived is what reddens rather than a field that changed value.
   */
  it('the-structured-data-a-page-publishes-is-the-record-it-renders', () => {
    for (const held of heldByTheRegistry(source)) {
      const { contract } = held

      expect(page(pageOf(contract.address)).structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: renderContract(contract.address),
        description: contract.identity.summary,
        programmingLanguage: contract.address.language,
        license: THE_COPIED_LICENCE,
        url: contractUrl(contract.address),
      })
    }
  })

  /**
   * Only a page about one contract says it is about source code.
   *
   * The catalogue is a list, the method page is an argument, and the refusals page is a judgement -
   * none of them is a `SoftwareSourceCode`, and filling the field on all seven because the field exists
   * would publish a false `@type` in the one part of a page written to be believed without being read.
   * A machine has no way to tell that claim from a true one, which is what makes it worth a guard rather
   * than care.
   */
  it('only-a-page-about-one-contract-says-it-is-source-code', () => {
    const describing = [...pages()]
      .filter(([, document]) => document.structuredData !== null)
      .map(([path]) => path)

    expect(describing.sort()).toEqual(
      heldByTheRegistry(source)
        .map((held) => pageOf(held.contract.address))
        .sort(),
    )
  })

  /** Nothing a reader can see is lost between the projections, on every real page. */
  /**
   * No sentence any page renders reaches a reader carrying its own markup.
   *
   * The sentences are written for a reader of source - `mutation/` writes `**this**` and `` `that` ``,
   * and so does a contract's own prose - and *printed as they are, a reader of the page sees the
   * punctuation*. That rule was declared, implemented in `inline`, and then broken by two call sites
   * reaching for `line` instead of `paragraph`: the method page published
   * `**No share of any of those steps is attributed to anything**` and `` `cli-install` `` with the
   * marks showing, on the page whose whole subject is rigour.
   *
   * Neither mark is legitimate content, which is what makes the assertion exact rather than a
   * heuristic: a backtick becomes `code` and an asterisk pair becomes `strong`, so a parsed page has
   * none of either left in its reading.
   *
   * **It asked this of the method page alone until ADR-0117, and the four contract pages were
   * publishing 220 backticks between them** - 110 on `string/slugify@1`, where 51 `code` elements were
   * being produced correctly beside them. ADR-0026 scoped it to one page because the register of the
   * catalogue's own text was an open question and nothing mechanical settled it; what settled it is
   * that every one of those 220 is paired, so there is no mark to guess at. The population is every
   * page `theSite` builds, which is what makes the widening a sweep rather than four more call sites
   * somebody has to remember.
   */
  it('no-mark-a-sentence-carries-reaches-the-reader-as-itself', () => {
    for (const [path, document] of pages()) {
      const reading = toText(document)

      expect(reading.match(/\*\*[^*]+\*\*/g) ?? [], `unparsed bold on ${path}`).toEqual([])
      expect(reading.match(/`[^`]+`/g) ?? [], `unparsed code on ${path}`).toEqual([])
    }
  })

  it('every-word-of-every-page-survives-every-projection', () => {
    for (const path of pages().keys()) {
      const held = page(path)
      const reading = toText(held)
      const markdown = toMarkdown(held)

      expect(wordsOf(held).filter((word) => !reading.includes(word))).toEqual([])
      expect(
        wordsOf(held).filter(
          (word) => !markdown.includes(word) && !markdown.includes(escapedForMarkdown(word)),
        ),
      ).toEqual([])
    }
  })

  /**
   * The outline of a page survives into the projection that exists to carry it.
   *
   * **This is the one claim `toText` cannot make**, and it is the whole reason there is a third
   * projection rather than a served reading. Every word of a page is already in the reading, and a
   * heading there is a line among lines: what tells a retriever that *Signature* titles the block under
   * it and `slugify('Ελληνικά') → 'ελληνικα'` is a call rather than a sentence is the markup, and
   * throwing it away is exactly what `toText` is for.
   *
   * So the assertion is over the heading *level* and not over the presence of the title. A projection
   * emitting every heading as a paragraph loses nothing a word count can see, reads identically, and
   * publishes a document with no structure at all - which is the mutant, and it is the tidier output of
   * the two.
   *
   * The population is walked out of the tree rather than listed, so a page that gains a section is
   * covered by this guard on the day it gains it and not on the day somebody remembers.
   *
   * **The two sides are counted from different things on purpose.** One is a walk of the tree, the
   * other a scan of the produced lines, and neither is derived from the projection under test - a guard
   * that asked `toMarkdown` what it had written would move with the very decoration a mutant edits and
   * stay green, which is `GUARD_PERTURBATION_RULE` arriving on a projection. It is also why nothing here
   * compares a heading's *text*: the front page writes a contract's name as a link inside its heading,
   * so the content is the Markdown of a subtree and reconstructing it would be that same derivation.
   *
   * Lines inside a fenced block are dropped before counting, because a `pre` holding a shell comment
   * would otherwise be read as a heading. No page carries one today; the day one does, this stays a
   * statement about headings rather than a false red nobody can place.
   */
  it('every-heading-of-a-page-is-a-heading-in-its-markdown', () => {
    const LEVEL: Readonly<Record<string, number>> = { h1: 1, h2: 2, h3: 3, h4: 4 }

    /** A heading opens a line, allowing the indentation and the marker a list item puts in front. */
    const OPENS_A_HEADING = /^ {0,6}(?:- )?(#{1,6}) /

    for (const [path, document] of pages()) {
      const declared = new Map<number, number>()
      const written = new Map<number, number>()
      const tally = (into: Map<number, number>, level: number): void =>
        void into.set(level, (into.get(level) ?? 0) + 1)

      const walk = (node: Parameters<typeof readingOf>[0]): void => {
        if (node.kind === 'text') return

        const level = LEVEL[node.tag]
        if (level !== undefined) tally(declared, level)

        for (const child of node.children) walk(child)
      }

      for (const node of document.body) walk(node)

      let fenced = false
      for (const written_line of toMarkdown(document).split('\n')) {
        if (/^`{3,}$/.test(written_line)) {
          fenced = !fenced
          continue
        }
        if (fenced) continue

        const opened = OPENS_A_HEADING.exec(written_line)
        if (opened !== null) tally(written, (opened[1] as string).length)
      }

      expect([...written].sort(), `${path} does not publish its outline as an outline`).toEqual(
        [...declared].sort(),
      )
    }
  })

  /**
   * Two elements that each carry content are two things in the reading, never one sentence.
   *
   * **This is the class, and the guard below it is two of its instances.** Both were found by reading a
   * page in document order and by nothing else: `not applicableThe signature takes a single string` on
   * a contract page, and `typescript/number/parse@1Convert a string to a finite number` on the front
   * page - the second of them a year of guards later, on the first screen of the product. Every word is
   * present in both, so `every-word-of-every-page-survives-every-projection` is green; what is wrong is
   * that an element with no separator was put where a block belonged, and the element after it began
   * mid-line.
   *
   * The two siblings must both be **elements**, and that is a measurement rather than a caution. With
   * text nodes admitted the predicate holds 53 pairs across the seven pages and 48 of them are ordinary
   * inline markup - `<strong>...</strong>: the sentence continues`, `<code>x</code>, ` - where the
   * author writes the spacing into the prose and is right to. Restricted to element pairs it held
   * exactly the five defects and nothing else. It is also what keeps the guard true of a link written
   * *inside* a sentence, which is `text + a + text` and correctly invisible here: the question of what
   * an inline anchor becomes in a projection never arises, because its neighbours carry the spaces.
   */
  it('no-element-runs-into-the-one-beside-it', () => {
    for (const [path, document] of pages()) {
      const collide: string[] = []

      const walk = (node: Parameters<typeof readingOf>[0]): void => {
        if (node.kind === 'text') return

        const carrying = node.children
          .map((child) => ({ child, reading: readingOf(child) }))
          .filter((seen) => seen.reading !== '')

        for (const [at, left] of carrying.entries()) {
          const right = carrying[at + 1]

          if (right === undefined) continue
          if (left.child.kind !== 'element' || right.child.kind !== 'element') continue
          if (/\s$/.test(left.reading) || /^\s/.test(right.reading)) continue

          collide.push(
            `<${node.tag}>: <${left.child.tag}> runs into <${right.child.tag}> — ` +
              `"${left.reading.slice(-30)}|${right.reading.slice(0, 30)}"`,
          )
        }

        for (const child of node.children) walk(child)
      }

      for (const node of document.body) walk(node)

      expect(collide, `${path} reads two elements as one sentence`).toEqual([])
    }
  })

  /**
   * A value the registry carries, printed as a paragraph of its own, is a sentence.
   *
   * **This is the guard above met one level down, and the measurement is why it had to be a second
   * one rather than a widening.** Both defects it exists for sit in a `<p>` with a single text child -
   * `left sibling: none, right sibling: none` - so there is no pair of elements for
   * `no-element-runs-into-the-one-beside-it` to look at, and one level up the paragraph's own
   * neighbours are a `<p>` and an `<h2>`, both of which separate. That guard's subject is the boundary
   * *between two elements*; these are boundaries *inside one string*, and no predicate over element
   * pairs can reach them. The two were found by reading the pages, as the five before them were.
   *
   * The population is derived from the two things that already exist - every string the record carries,
   * and every paragraph of the page - so there is no list of prose fields anywhere and no second
   * statement to drift. What that derivation buys is the exclusions: `couplingRule` and a table's
   * `purpose` are punctuated *by the page*, so the paragraph's reading is not the carried string and
   * they fall out on their own, correctly, without being named. Measured over the four pages: 212
   * paragraphs are a carried string, and before the repair 6 of them were fragments - the two values of
   * `identity.relationToTheLanguage`, and `NO_AMBIENT_OUTPUT_FINDING` opening a reason on four pages.
   *
   * The other half of the class is `a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands`
   * in `packages/registry/against-the-catalogue.test.ts`. A value is standing alone or it is embedded; this guard
   * cannot see an embedded one, because the string it lands in is a sentence whatever the seam does.
   */
  it('a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence', () => {
    for (const held of heldByTheRegistry(source)) {
      const carried = stringsIn(held.contract)
      const fragments: string[] = []

      const walk = (node: Parameters<typeof readingOf>[0]): void => {
        if (node.kind === 'text') return

        const reading = readingOf(node).trim()
        if (node.tag === 'p' && carried.has(reading) && !isASentence(reading)) fragments.push(reading)

        for (const child of node.children) walk(child)
      }

      for (const node of page(pageOf(held.contract.address)).body) walk(node)

      expect(fragments, `${held.contract.address.name} prints a fragment as a paragraph`).toEqual([])
    }
  })

  /**
   * A label and the sentence under it are two lines, not one.
   *
   * Two instances of the class above, kept for the half that is not separation: these assert the label's
   * own *rendering* - the em dash, and the words `checked` and `not applicable` - so a label reformatted
   * without breaking apart reddens here and nowhere else. Neither guard subsumes the other, which is why
   * both are affordable: this one is blind to the front page, and that one is blind to the em dash.
   */
  it('a-label-and-the-sentence-under-it-are-two-lines', () => {
    for (const held of heldByTheRegistry(source)) {
      const reading = toText(page(pageOf(held.contract.address)))

      for (const property of held.contract.properties.universal) {
        expect(reading).toContain(
          `${property.name} — ${property.applicable ? 'checked' : 'not applicable'}\n`,
        )
      }
      for (const profile of held.contract.benchmarks.profiles) {
        expect(reading).toContain(`${profile.name} — ${profile.class}\n`)
      }
    }
  })
})

/**
 * The method page, which is the one page here that can destroy the thing it argues for.
 *
 * Its subject is rigour and nobody can check it at a glance, so it is where a project overstates. Each
 * guard below is a way of overstating that this repository has either already committed somewhere else
 * or would not be able to see.
 */
describe('the page that says how we verify', () => {
  const reading = (): string => toText(page(METHOD_PAGE))

  /**
   * **No figure on this page is typed into a sentence.**
   *
   * The defect is not a wrong number, it is a *right* number that goes wrong later: somebody writes
   * "34 survive", a battery gains a mutant, and the page keeps saying 34 while the catalogue says 35.
   * That is the failure this repository has caught in its own prose four times and never in code.
   *
   * So every run of digits a reader can see must occur in what the page was built from - the two
   * answers and the constants beside them - or be a count derived from them. A literal that happens to
   * match today is still refused tomorrow, which is the whole point: the day the data moves, the
   * literal stops being in the set and this goes red.
   *
   * **And the set it is matched against must hold figures and nothing else**, which is the half this
   * guard got wrong and W-47 found. The data moved *towards* a stale literal instead of away from it,
   * so the guard went quiet rather than red - the one direction that costs nothing to nobody until
   * somebody reads the page.
   */
  it('every-figure-on-the-method-page-comes-from-what-it-was-built-from', () => {
    const measured = theMeasurement()
    const methodology = source.methodology()
    const counts = [
      measured.batteries,
      measured.lenses,
      measured.outOfReach.length,
      measured.unprobed.length,
      Object.keys(methodology.fields).length,
      ...[measured.defects, measured.probes].flatMap((population) => [
        population.cells,
        population.killed,
        population.surviving.length,
        ...Object.values(survivorsByKind(population)),
        ...[...new Set(population.surviving.map((one) => `${one.battery} ${one.mutant}`))].map(
          (_, at) => at + 1,
        ),
      ]),
      ...Object.values(methodology.strata).map(
        (_, at) =>
          Object.values(methodology.fields).filter(
            (stratum) => stratum === Object.keys(methodology.strata)[at],
          ).length,
      ),
    ].map(String)

    /**
     * A commit identifier is an address and not a figure, so it comes off both sides rather than
     * being allowed on either.
     *
     * **The rule this is an instance of, stated because the next guard over published digits will
     * need it and there is no mechanism to hand it over.** An address that is rendered leaks into
     * this comparison from *both* directions at once: it joins the pool as though something had
     * derived it, and it joins the reading as though the page had published it. Either side alone
     * would be caught - a figure with no derivation reddens, and a derivation nothing renders is
     * unread - and it is the pair that is silent, because the two leaks cancel. So **every address
     * comes off both sides before the comparison, and it is the rendering that decides which strings
     * are addresses**, not their shape: a digit run is not evidence of a figure.
     *
     * Measured: `THE_REPLAY.measuredAt` then held a stamp whose digit runs were `0`, `8` and **`41`**
     * - and `41` occurred nowhere else in this data. So stamping that commit handed the pool a figure
     * nothing had derived, and W-47, which writes the literal `41` into a derived sentence, stopped
     * being killed the moment the stamp landed. Taking it off the reading as well is what keeps the
     * honest page passing, since it is rendered there.
     *
     * **It used to name the one address this data carries, and the data had carried two for some
     * time.** `THE_REPLAY.spread` quotes the commit of every reading it compares, and only
     * `measuredAt` was ever taken off - the others leaked into both sides and cancelled, silently,
     * which is the exact mechanism this paragraph describes happening to the guard that describes it.
     * They were absorbed rather than caught because their digit runs occur elsewhere in the data,
     * which is luck and not a design.
     *
     * `THE_COMMITS_QUOTED` is the repair, and it is a record the prose interpolates rather than a list
     * beside it: a commit cannot be quoted in that spread without being in it, so there is nothing
     * here to drift.
     *
     * **What the stripping is load-bearing for is not the honest page, and that was measured rather
     * than assumed.** Taking it away entirely leaves this guard green: a rendered address is in the
     * pool *and* in the reading, so its digit runs cancel and the honest page passes either way. What
     * it is for is the pool - measured on a page publishing a run that occurs nowhere but inside a
     * quoted stamp: green with no stripping, and red naming that run with it.
     *
     * ---------------------------------------------------------------------------
     * What this establishes, and the half it cannot
     * ---------------------------------------------------------------------------
     *
     * **It asks whether a figure a reader can see occurs somewhere in the data. It cannot ask whether
     * it is the figure that sentence derives.** A page saying *41 such readings* passes while the
     * lenses number 24, provided 41 is some other count in the same data - and that is not
     * hypothetical: `measured.unprobed.length` reached exactly 41 when three batteries declared a
     * transport they cannot reach, and W-47 went from killed to survived without one line of this page
     * changing. The pool is every derived integer, so it grows with the catalogue and excuses more
     * literals every time it does.
     *
     * Closing it means each rendered figure carrying which derivation produced it, and this comparing
     * the pair rather than the set - a change to how the page emits every number it has. It is priced
     * here and not bought, which is what this repository does with a mechanism it can name and cannot
     * afford. What stands in the meantime is that W-47's literal is chosen to be underivable rather
     * than merely absent.
     */
    const withoutAnAddress = (text: string): string =>
      THE_COMMITS_QUOTED.reduce((left, commit) => left.replaceAll(commit, ''), text)

    const fromTheData = new Set([
      ...counts,
      ...(withoutAnAddress(
        JSON.stringify([methodology, measured, THE_REPLAY, THE_PINS_ARE_AN_ASSERTION]),
      ).match(/\d+/g) ?? []),
    ])

    expect(
      (withoutAnAddress(reading()).match(/\d+/g) ?? []).filter((figure) => !fromTheData.has(figure)),
    ).toEqual([])
  })

  /**
   * The aggregate never appears without the split.
   *
   * A count of surviving cells published as one number is read as that many known holes, and
   * exactly one of them is a debt. A page that prints the total and drops the breakdown is not
   * shorter, it is a different and worse claim - and it is the shape a page takes when somebody tidies
   * it.
   *
   * **The block is found by a phrase only that sentence can carry, and it was not.** It used to be
   * found by the cell count and the word `cells,` in the same paragraph - two fragments any prose
   * about a replay can put together by accident, and the paragraph above this one duly did the day it
   * gained the words *these 606 cells, which ran from*. The guard then reddened on a paragraph that
   * has no business carrying a breakdown, which is a red pointing at the wrong thing: expensive,
   * because somebody goes and looks. The anchor is the renderer's own `cells, <killed> caught.`, and
   * if that wording changes this fails on `toBeDefined` rather than on a stranger's sentence.
   */
  it('a-count-of-survivors-is-never-shown-without-its-breakdown', () => {
    const measured = theMeasurement()

    for (const population of [measured.defects, measured.probes]) {
      const byKind = survivorsByKind(population)
      const sentence = reading()
        .split('\n\n')
        .find((block) => block.includes(`cells, ${population.killed} caught.`))

      expect(sentence).toBeDefined()
      expect(sentence).toContain(`${population.cells}`)
      expect(sentence).toContain(`${population.surviving.length}`)

      for (const [why, many] of Object.entries(byKind)) {
        if (many === 0) continue
        expect(sentence).toContain(`${many} ${why.replaceAll('-', ' ')}`)
      }
    }
  })

  /** Every survivor is on the page. A list that silently stops short reads exactly like a short list. */
  it('every-surviving-cell-is-published-with-its-own-battery-sentence', () => {
    const measured = theMeasurement()
    const shown = reading()

    for (const population of [measured.defects, measured.probes]) {
      for (const survivor of population.surviving) {
        expect(shown).toContain(`${survivor.battery} · ${survivor.mutant}`)
        expect(shown).toContain(survivor.cell)
        expect(shown).toContain(asRead(survivor.description))
      }
    }
  })

  /**
   * Every kind the vocabulary declares and this page uses is explained on it, in the words
   * `mutation/published.ts` holds - never in words invented here, which would be a second statement of
   * one judgement, in the file most likely to drift from the data.
   */
  it('every-kind-of-survivor-shown-is-explained-in-the-instruments-own-words', () => {
    const measured = theMeasurement()
    const shown = reading()
    const used = new Set(
      [measured.defects, measured.probes].flatMap((population) =>
        population.surviving.map((one) => one.why),
      ),
    )

    for (const why of used) expect(shown).toContain(asRead(WHAT_A_SURVIVOR_MEANS_TO_A_READER[why]))
  })

  /**
   * The count on this page says what *caught* means where a defect does not exist on every machine.
   *
   * Every figure here is derived from the pins as written, so none of them moves with the machine the
   * site was built on - and that is exactly what makes the coordinate necessary rather than optional:
   * a number that is the same everywhere and is only true of one platform is the shape ADR-0018 names,
   * on the measurement this project rests on. ADR-0147.
   *
   * **Asserted in both directions rather than skipped when the list is empty.** A guard that returned
   * early on an empty list would pass vacuously the day the last such cell leaves, which is the
   * population-shrinks-in-silence shape this repository keeps an entry for. So the sentence must be on
   * the page exactly when there is something for it to be about.
   */
  it('the-method-page-says-what-caught-means-where-a-defect-is-not-everywhere', () => {
    const measured = theMeasurement()
    const shown = reading()

    expect(shown.includes(asRead(CAUGHT_MEANS_WHERE_THE_DEFECT_EXISTS))).toBe(
      measured.whereThePlatformDecides.length > 0,
    )

    for (const one of measured.whereThePlatformDecides) {
      expect(shown).toContain(`${one.battery} · ${one.mutant}`)
      expect(shown).toContain(asRead(one.because))
    }
  })

  /**
   * A reader is told which of an assertion and an observation they are holding, and what the second
   * one costs.
   *
   * The two coincide, so nothing here is false without it - and a page that publishes pins as though
   * somebody had watched them happen is doing the exact thing it spends the rest of its length arguing
   * against.
   *
   * The spread is read alongside the duration rather than instead of it, because a stamped figure is
   * still read as a period: a duration on its own says the replay *takes* that long, and what it says
   * is that one run of it did.
   *
   * **Every value of `THE_REPLAY` is required on the page, rather than the four somebody remembered.**
   * A field carried and not shown is the state `coverage.test.ts` already refuses on a record, and a
   * list of the fields to check is a second statement of what the type holds - so the walk is over the
   * object. A field added there and left out of the sentence does not pass, which is the reason this
   * is a loop and not five lines.
   *
   * Each value is asked for **as a reader sees it** rather than as it is written, because these
   * sentences carry the two marks `inline` parses and the page no longer prints them. Stripping the
   * marks here instead would be a copy of that function going stale on the day it learns a third.
   */
  it('the-page-separates-what-is-asserted-from-what-a-run-would-observe', () => {
    const shown = reading()

    expect(shown).toContain(asRead(THE_PINS_ARE_AN_ASSERTION))
    for (const value of Object.values(THE_REPLAY)) expect(shown).toContain(asRead(value))
  })

  /**
   * The limit of the method is read before the figure it limits, and this is a guard about *order*
   * rather than presence.
   *
   * A mutation score reads as a correctness claim to somebody meeting it cold, and the sentence that
   * says it is not one is worth nothing after the number - which is exactly where a page like this
   * puts it, as a footnote, having said the impressive part first.
   */
  it('what-the-score-does-not-prove-is-read-before-the-score', () => {
    const shown = reading()
    const limit = shown.indexOf('It says the tests notice the defects that were tried')
    const figure = shown.indexOf(`${theMeasurement().defects.cells} defect cells`)

    expect(limit).toBeGreaterThan(-1)
    expect(figure).toBeGreaterThan(-1)
    expect(limit).toBeLessThan(figure)
  })
})
