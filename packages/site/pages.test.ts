import { describe, it, expect } from 'vitest'

import {
  THE_INVOCATION,
  THE_WAYS_TO_RUN_IT,
  contractUrl,
  renderContract,
} from '../registry/address.js'
import { askedAt } from '../registry/endpoints.js'
import { THE_COPIED_LICENCE } from '../registry/licence.js'
import { THE_SOURCE_REPOSITORY } from '../registry/publication.js'
import { isASentence, stringsIn } from '../registry/contract-record.js'
import { search } from '../registry/search.js'
import { ThePageCannotBeBuilt, heldByTheRegistry } from './catalogue.js'
import { whatACardSays } from './what-a-card-says.js'
import { THE_EXAMPLES } from './chrome.js'
import { whatRunsInYourBrowser } from './contract-page.js'
import type { Element, Node } from './document.js'
import { escapedForMarkdown, readingOf, toHtml, toMarkdown, toText, wordsOf } from './document.js'
import { literal } from './literal.js'
import { localSource } from './local-source.js'
import { inline } from './marks.js'
import { theCallOf } from './playground.js'
import { FRONT_PAGE, linkTo, pageOf, urlOf } from './paths.js'
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
 * The characters that read as part of a word, for `no-element-runs-into-the-one-beside-it`.
 *
 * Letters, numbers and combining marks, rather than `[A-Za-z0-9]`: this catalogue settles cases on
 * `日本語`, `हिन्दी` and `٤٢`, and an ASCII class would read every one of them as punctuation - which
 * is to say as a separator - and go quiet on the pages that carry the most of them. Combining marks
 * are in because a seam falling between a letter and its own mark is inside a grapheme, which is the
 * same defect one floor down.
 */
const WORD_MATTER = /[\p{L}\p{N}\p{M}]/u

/** What a node is called in a fault, which a text node has no tag to answer. */
const nameOf = (node: Node): string => (node.kind === 'text' ? 'prose' : `<${node.tag}>`)

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
   * **A refused contract now has no page at all, and this guard is where that is stated.** ADR-0127
   * gave it one and ADR-0189 takes it away, for a reason about the surface rather than about the
   * refusal: this site is what a reader can install, and a refusal is an answer to a question - so it
   * stays in `toopo search`, with its mark and its reason, and leaves the shelf. Asserting the whole
   * key set from the index is what makes an extra page and a missing one the same failure, and it is
   * what turns that decision into a red the day somebody renders a turned-down contract again.
   *
   * **The one page that is not about a contract is named here**, so that a page appearing or
   * disappearing is this guard's business rather than nobody's - which is what it was for when
   * ADR-0129 added a fourth, and the only guard that noticed.
   */
  it('every-contract-the-index-lists-has-a-page-at-its-own-address', () => {
    const refused = index.entries.filter((entry) => !entry.installable)

    expect([...pages().keys()].sort()).toEqual(
      [
        FRONT_PAGE,
        ...index.entries.filter((entry) => entry.installable).map((entry) => pageOf(entry.address)),
      ].sort(),
    )
    expect(refused.map((entry) => pages().has(pageOf(entry.address)))).toEqual([false])
    expect(refused.length).toBe(1)
  })

  /**
   * No two things on one page answer to one `#id`.
   *
   * A group and a case are anchored in the same space, so a duplicate is a link that silently lands
   * on the wrong element - the failure that only shows up once somebody has shared the link.
   * `every-case-is-addressed` asks this of a contract's data; this asks it of the document, which is
   * where the collision would actually happen and which carries every table at once.
   */
  it('every-anchor-on-a-page-is-held-by-one-element', () => {
    for (const [path, document] of pages()) {
      const ids = [...toHtml(document).matchAll(/ id="([^"]+)"/g)].map((found) => found[1] as string)
      const twice = [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))]

      expect(twice, `${path} anchors the same address twice`).toEqual([])
    }
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
   * The caveat is asserted by name rather than by counting the blocks, because the caveat is the
   * field a use case is worth reading for: an example without it is a confident line telling
   * somebody that `C++` and `C#` both answer `c` is fine. ADR-0118.
   *
   * **The situation is deliberately no longer asserted.** The redesign renders an example as the
   * artboard draws one - the call with its answer as a comment - and the owner ruled that the calls
   * and the caveats reach the reader; the name and the situation stay served and stop being laid
   * out, exactly as the settled cases did.
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
        const call = `${answer.name}(${written.join(', ')})  // ${answered
          .map((field) => literal(field.value))
          .join(', ')}`

        if (!reading.includes(call)) faults.push(`${what}: the page does not read \`${call}\``)
        if (!reading.includes(asRead(entry.caveat))) {
          faults.push(`${what}: the caveat of "${entry.name}" does not reach the reader`)
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
   * A contract the catalogue refused is never offered here, and since ADR-0189 is never named here.
   *
   * **The other half of this guard is gone, and it is a decision rather than a loss of coverage.** It
   * used to require the refusal to be *findable* on this site as well as unoffered, which is why the
   * catalogue page linked it and the refusals page printed its address. The owner's ruling is that a
   * refusal is noise on a shelf and an answer in a search: it keeps its mark and its reason in
   * `toopo search`, and it leaves the site. So what is asked here is the stronger half of what was
   * asked before - not merely *no install command*, but *no mention at all* - over every page rather
   * than over the two that used to carry it.
   *
   * **Where the findable half went is a guard of another folder**, and that is what makes this a move
   * rather than a deletion: `packages/cli/` holds what a search answers about a contract it may not
   * install, and nothing here weakens it. This guard's own red event is a page that starts rendering
   * a turned-down contract again, which is exactly the thing the ruling forbids.
   */
  it('nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed', () => {
    const refused = index.entries.find((entry) => !entry.installable)
    const everyPage = [...pages().values()].map(toText).join('\n')
    const everyMarkup = [...pages().values()].map(toHtml).join('\n')

    expect(refused).toBeDefined()
    expect(everyPage).not.toContain(`toopo add ${refused?.address.name}`)
    // Asked of the markup and not of the reading, because a link a reader cannot see is still a link.
    expect(everyMarkup).not.toContain(renderContract(refused?.address as never))
    expect(everyMarkup).not.toContain(linkTo(pageOf(refused?.address as never)))
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
   * The command a reader runs and the signature they read are two shapes, and this keeps the half of
   * that a document can carry.
   *
   * They were two `pre`s of the same size in matching frames, stacked one under the other, and the
   * owner could not tell which of them to run on a page he had just been shown. The artboard settles
   * it with two different things - a bar the primary control lands in, and a section titled
   * Signature whose block is set in the syntax inks - and what a document can be asked is that both
   * exist in exactly those shapes: the command inside the block that declares the ways to run it,
   * and the signature under its own addressed heading, as a snippet and never as a bare `pre`.
   *
   * Its red event is somebody flattening the page back to two indistinguishable `pre`s - the state
   * this page was in, and the one no stylesheet can repair from the outside.
   *
   * The refused contract is rendered by another page entirely, so the assertion over it is that
   * neither shape is present rather than that some of them are.
   */
  it('the-command-a-reader-runs-and-the-signature-they-read-are-two-shapes', () => {
    const installable = new Set(
      index.entries
        .filter((entry) => entry.installable)
        .map((entry) => renderContract(entry.address)),
    )

    const partsOf = (document: Parameters<typeof toText>[0]): readonly string[] => {
      const found: string[] = []
      const walk = (node: Parameters<typeof readingOf>[0], within: string | null): void => {
        if (node.kind !== 'element') return

        /** The section is recognised by the addressed heading it opens on, which is the address a
         * reader links and therefore the one part of the shape that cannot quietly move. */
        const opensOnTheSignature =
          node.tag === 'section' &&
          node.children.some(
            (child) => child.kind === 'element' && child.attributes['id'] === 'signature',
          )

        const block =
          node.attributes['data-ways'] !== undefined
            ? 'the install bar'
            : opensOnTheSignature
              ? 'the signature section'
              : within

        if (block !== null && node.tag === 'pre') {
          found.push(
            block === 'the install bar'
              ? `the install bar holds pre.${node.attributes['class'] ?? ''}`
              : `the signature is pre.${node.attributes['class'] ?? ''}`,
          )
        }

        for (const child of node.children) walk(child, block)
      }

      for (const node of document.body) walk(node, null)

      return found
    }

    for (const held of heldByTheRegistry(source)) {
      const rendered = renderContract(held.contract.address)
      const document = page(pageOf(held.contract.address))

      expect(partsOf(document), rendered).toEqual(
        installable.has(rendered)
          ? ['the install bar holds pre.install', 'the signature is pre.snippet']
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
   * The page a reader arrives at is every contract they can install, and nothing they cannot.
   *
   * **It was `the-page-a-reader-arrives-at-is-a-name-and-two-doors` and the owner overruled it**, which
   * is why this is a rewrite rather than a deletion: the page's claim changed and the guard's subject
   * followed it. That version's own comment read *it is the third version of that page and the owner
   * said he would not look at a fourth*, and this is the fourth - kept in view because a guard whose
   * premise expired is worth more read than struck out.
   *
   * **The half of ADR-0140 that was argued survives and is enforced elsewhere.** That record refused
   * `add domain/function` on this page because *the constraint was right and its form was a template,
   * which is a thing a reader sees*. Every command here names a real contract, and
   * `every-command-the-site-tells-a-reader-to-run-carries-the-invocation` is what asks that each one
   * runs. What fell is the sentence it generalised to - *a command belongs on no page about the
   * catalogue* - and what this asserts in its place is stronger, because it is about coverage rather
   * than about absence.
   *
   * **Four claims, and the third is the one a heading could quietly break.** Every installable
   * contract is here; nothing refused is; the count is exhaustive rather than a selection; and every
   * card carries the signature its contract froze. A shelf showing four of six would satisfy the first
   * two and be a page that had started choosing - which is what `Popular functions` would have been,
   * on data this repository does not have. ADR-0181.
   *
   * **Written beside the guard below it**, which is about the site staying connected: that one is green
   * whatever this page holds, as long as the links go somewhere. This one is about what a reader is
   * shown; that one is about what they can reach.
   */
  it('the-page-a-reader-arrives-at-is-every-contract-they-can-install', () => {
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

    /**
     * The four sections the artboard draws, in its order, and nothing else.
     *
     * The opening, the catalogue, what arrived last, and why any of it is worth taking.
     *
     * **The fifth child is gone and its own comment is what removed it.** ADR-0182 added a paragraph
     * pointing at the pages this page did not list, and said in as many words that it was not on the
     * artboard and was there for a constraint - *a page nothing links to is one
     * `every-page-is-reachable-from-the-front-page` refuses*. ADR-0189 retired those pages, so the
     * constraint it satisfied no longer exists and the page is the artboard's again. A workaround
     * outliving the thing it worked around is the drift this repository keeps finding; this one said
     * out loud what would end it.
     */
    expect(inside.map((node) => node.tag)).toEqual(['section', 'section', 'section', 'section'])

    const reading = toText(page(FRONT_PAGE))
    const index = source.contractIndex()
    const installable = index.entries.filter((entry) => entry.installable)
    const refused = index.entries.filter((entry) => !entry.installable)

    // Every contract a reader can install is on the shelf, with the command that installs it.
    expect(
      installable.filter((entry) => !reading.includes(`${THE_INVOCATION} add ${entry.address.name}`)),
    ).toEqual([])

    // And nothing the catalogue turned down is, by name or by command.
    expect(refused.filter((entry) => reading.includes(entry.address.name))).toEqual([])

    /**
     * Every command on the shelf names a contract, which is the half of ADR-0140 that was argued.
     *
     * That record refused `add domain/function` here because *the constraint was right and its form
     * was a template, which is a thing a reader sees*. A shelf privileges no contract by showing all
     * of them, so the reason to print a template is gone - and the refusal is kept in the form that
     * suits the page: what follows `add` is an address this catalogue holds.
     *
     * `every-command-the-site-tells-a-reader-to-run-carries-the-invocation` cannot stand in for it.
     * It recognises an install command *by* the fact that it names a contract, so a template is not a
     * command to it at all and it passes over one in silence.
     */
    const named = new Set(index.entries.map((entry) => entry.address.name))

    /**
     * **An install command is recognised by the fact that it names an address**, which is the rule
     * `every-command-the-site-tells-a-reader-to-run-carries-the-invocation` already uses and which
     * this guard dropped when it was written.
     *
     * The page says `npx toopo add copies plain source into lib/toopo/` in one of its three closing
     * arguments - the artboard's own sentence - and a sweep for whatever follows `add` read `copies`
     * as a contract. That is a false positive, and the repair is the discrimination the site already
     * had: what follows names a domain and a function, so it carries a slash.
     */
    const printed = [...reading.matchAll(/toopo add (\S+\/\S+)/g)].map((found) => found[1] as string)

    expect(printed.filter((one) => !named.has(one))).toEqual([])
    expect(printed).toHaveLength(installable.length)

    /**
     * The shelf is exhaustive over the installable half rather than a selection of it.
     *
     * **This is the half a heading could quietly break.** The artboard's own heading is
     * `Popular functions`, and a page that showed four of six under it would satisfy every other
     * assertion here - each card would be right, each command would run, and nothing refused would
     * appear. What this refuses is a shelf that has started choosing, which is the claim
     * `WHAT_THE_SHELF_IS` makes and the one nothing in this repository could compute.
     */
    const shelf = inside.find((node) => (node.attributes as Record<string, string>)['class'] === 'listing')
    const grid = elementsOf(shelf?.children ?? []).find((node) => node.tag === 'ul')
    const cards = elementsOf(grid?.children ?? [])

    expect(cards).toHaveLength(installable.length)

    // Every card carries the signature its contract froze, in the form the record holds.
    for (const held of heldByTheRegistry(source)) {
      expect(reading).toContain(whatACardSays(held).signature)
    }
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

    /**
     * The one address this site sends a reader away to, and it is the one npm already publishes.
     *
     * **The claim was *no link out at all*, and the artboard put a repository link in the masthead.**
     * Widening it to *no link out but this one* keeps every tooth it had: an address nobody decided
     * on is still refused, a typo is still refused, and the exemption is not a string typed here - it
     * is `THE_SOURCE_REPOSITORY`, the field the manifest publishes, put through the same derivation
     * `chrome.ts` links with. So a second external address cannot arrive without this line moving,
     * and this line cannot name somewhere the package does not. ADR-0182.
     */
    const theRepository = THE_SOURCE_REPOSITORY.replace(/^git\+/, '').replace(/\.git$/, '')

    /**
     * A link to an answer the origin serves is a link inside this site, not a link out.
     *
     * The contract page's aside links the frozen definition - `snapshot/{digest}` - which is one of
     * the answers the emitted tree writes and no page. `askedAt` is the registry's own inverse of
     * `pathTo`, so the recognition is the one statement of what an answer's address looks like; and
     * a content-addressed answer is admitted only when the registry resolves the address, because a
     * shape alone would let an invented digest read as a served document.
     */
    const servedBesideThePages = (pathname: string): boolean => {
      const asked = askedAt(pathname)
      if (asked === null) return false

      return asked.endpoint.id !== 'snapshot' || source.snapshot(asked.address) !== null
    }

    for (const path of pages().keys())
      for (const href of linksOf(path))
        if (
          !href.startsWith('#') &&
          href !== theRepository &&
          !byHref.has(new URL(href, urlOf(path)).pathname) &&
          !servedBesideThePages(new URL(href, urlOf(path)).pathname)
        )
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
    /**
     * The prose alone, because the claim is about sentences and the page now shows source whole:
     * a contract's own `reference.ts` is full of backticks in its comments, and every one of them
     * is the file's content rather than a mark somebody failed to parse. `pre` and `code` are the
     * two elements whose text is verbatim by declaration - the same pair `toMarkdown` fences - so
     * the sweep walks the tree and reads everything outside them.
     */
    const proseOf = (node: Parameters<typeof readingOf>[0]): string => {
      if (node.kind === 'text') return node.text
      if (node.tag === 'pre' || node.tag === 'code') return ''

      return node.children.map(proseOf).join(' ')
    }

    for (const [path, document] of pages()) {
      const reading = document.body.map(proseOf).join(' ')

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
   * **What separates the two siblings is asked of the seam, and what counts as separation depends on
   * whether a person wrote the character there.** The guard used to require both siblings to be
   * elements, on a reading that reproduces under no rule this repository can state - ADR-0193 measured
   * `53 pairs, 48 of them ordinary inline markup` against every kind of pair with `pre` skipped at 22,
   * with `pre` admitted at 570, and element-against-element at 0. What that restriction cost is
   * measured instead: with the kind test off, **22 pairs**, of which **5 were a defect a reader met on
   * the front page** and 17 are correct by construction.
   *
   * So there are two questions and one subject - *is this boundary visible to somebody reading a
   * projection?*
   *
   * - **Between two elements, only white space can make it visible.** An element boundary is not a
   *   character: `toText` and `toMarkdown` throw the markup away, and two boxes with nothing between
   *   them become one string. Any missing white space is therefore a collision, which is what this
   *   guard has always said and is unchanged.
   * - **Between an element and prose, the character the author typed can make it visible too.** All
   *   seventeen are that shape: an address split for highlighting, `<span>number/</span>parse`, and a
   *   `code` followed by its punctuation, `<code>toFixed</code>, which answers a string`. The `/` and
   *   the `,` *are* the boundary, and a space beside either would be wrong. What has nothing making it
   *   visible is a seam between two word characters, which is one word broken in half - `all|6`.
   *
   * `WORD_MATTER` is letters, numbers and combining marks rather than `[A-Za-z0-9]`, because this
   * catalogue settles cases on `日本語`, `हिन्दी` and `٤٢`, and a rule that reads those as punctuation
   * would go quiet on the pages that need it most.
   *
   * **Seen red on the five before they were repaired and green on the seventeen throughout**, which is
   * the pair that matters: a guard catching the five by reporting the seventeen would be worse than the
   * one it replaces. ADR-0194.
   *
   * It is still true of a link written *inside* a sentence, which is `text + a + text`: the question of
   * what an inline anchor becomes in a projection never arises, because its neighbours carry the
   * spaces and the white-space test retires the pair before either arm is asked.
   */
  it('no-element-runs-into-the-one-beside-it', () => {
    for (const [path, document] of pages()) {
      const collide: string[] = []

      const walk = (node: Parameters<typeof readingOf>[0]): void => {
        if (node.kind === 'text') return
        /**
         * Inside a `pre` the text is verbatim and the elements are the syntax inks, so two
         * adjacent spans are two colours of one program and never two sentences run together -
         * the code separates itself, character by character, and the reading is the code.
         */
        if (node.tag === 'pre') return

        const carrying = node.children
          .map((child) => ({ child, reading: readingOf(child) }))
          .filter((seen) => seen.reading !== '')

        for (const [at, left] of carrying.entries()) {
          const right = carrying[at + 1]

          if (right === undefined) continue
          if (/\s$/.test(left.reading) || /^\s/.test(right.reading)) continue

          const bothElements = left.child.kind === 'element' && right.child.kind === 'element'
          const runsTogether =
            WORD_MATTER.test(left.reading.at(-1) as string) &&
            WORD_MATTER.test(right.reading[0] as string)

          if (!bothElements && !runsTogether) continue

          collide.push(
            `<${node.tag}>: ${nameOf(left.child)} runs into ${nameOf(right.child)} — ` +
              `"${left.reading.slice(-30)}|${right.reading.slice(0, 30)}"`,
          )
        }

        for (const child of node.children) walk(child)
      }

      for (const node of document.body) walk(node)

      expect(collide, `${path} reads two things beside each other as one`).toEqual([])
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

})

/**
 * The method page, which is the one page here that can destroy the thing it argues for.
 *
 * Its subject is rigour and nobody can check it at a glance, so it is where a project overstates. Each
 * guard below is a way of overstating that this repository has either already committed somewhere else
 * or would not be able to see.
 */
