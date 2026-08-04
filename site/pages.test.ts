import { describe, it, expect } from 'vitest'

import { renderCase, renderContract } from '../registry/address.js'
import { ThePageCannotBeBuilt, heldByTheRegistry } from './catalogue.js'
import { toHtml, toText, wordsOf } from './document.js'
import { localSource } from './local-source.js'
import { CATALOGUE_PAGE, REFUSALS_PAGE, linkTo, pageOf } from './paths.js'
import { theSite } from './site.js'

/**
 * The pages themselves, built from the five contracts of this working tree.
 *
 * They are built in memory. Nothing here writes a file, which is what keeps everything the generator
 * decides reachable from a guard - the property `cli/command.ts` states for the installer, and the one
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

describe('the site', () => {
  /**
   * Four pages for four contracts, and the fifth contract has none.
   *
   * `array/group-by@1` was decided against *before* publication, so `refuseContract` records the
   * argument and binds no digest: there is no frozen definition to render and nothing about it a
   * reader could check. What the catalogue publishes about it is the refusal, and the refusals page is
   * where that goes. A contract page with no digest behind it would be a contract page missing the
   * only half that makes this registry worth anything.
   */
  it('every-installable-contract-has-a-page-and-a-refused-one-does-not', () => {
    const installable = index.entries.filter((entry) => entry.installable)
    const refused = index.entries.filter((entry) => !entry.installable)

    expect([...pages().keys()].sort()).toEqual(
      [CATALOGUE_PAGE, REFUSALS_PAGE, ...installable.map((entry) => pageOf(entry.address))].sort(),
    )
    expect(refused.map((entry) => pages().has(pageOf(entry.address)))).toEqual([false])
    expect(refused.length).toBe(1)
  })

  /**
   * **The payment of a decision taken ten units ago.** A case identifier was frozen with the major
   * version so that a URL could anchor on it, and `renderCase` has rendered
   * `number/parse@1#ordinary-integer` since `registry/address.ts` was written, read by nothing. That
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
          expect(rendered).toContain(`<div id="${entry.id}">`)
          expect(rendered).toContain(`href="#${entry.id}"`)
        }
      }
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
   * A contract the catalogue refused must be findable and must never be offered - the rule
   * `toopo search` already follows on the terminal, arriving on the page where somebody would click.
   */
  it('nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed', () => {
    const refused = index.entries.find((entry) => !entry.installable)
    const everyPage = [...pages().values()].map(toText).join('\n')

    expect(refused).toBeDefined()
    expect(everyPage).not.toContain(`toopo add ${refused?.address.name}`)
    expect(html(CATALOGUE_PAGE)).toContain(renderContract(refused?.address as never))
    expect(toText(page(REFUSALS_PAGE))).toContain(
      renderContract(refused?.address as never),
    )
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

  /** Every page the site holds is reachable from the front page, in one click or two. */
  it('every-page-is-reachable-from-the-front-page', () => {
    const front = html(CATALOGUE_PAGE)
    const linked = [...front.matchAll(/href="([^"]+)"/g)].map((match) => match[1])

    expect([...pages().keys()].filter((path) => path !== CATALOGUE_PAGE).map(linkTo).sort()).toEqual(
      [...new Set(linked)].sort(),
    )
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

  /** Nothing a reader can see is lost between the two projections, on every real page. */
  it('every-word-of-every-page-survives-both-projections', () => {
    for (const path of pages().keys()) {
      const held = page(path)
      const reading = toText(held)

      expect(wordsOf(held).filter((word) => !reading.includes(word))).toEqual([])
    }
  })
})
