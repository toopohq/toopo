// @vitest-environment happy-dom

/**
 * That a rule this stylesheet paints is a rule a page writes.
 * ADR-0197 is the sweep, what it deleted and what it does not reach.
 *
 * ---------------------------------------------------------------------------
 * Why the subject is a matcher over a document and never the text of a page
 * ---------------------------------------------------------------------------
 *
 * Whether a rule has anything to paint is a question about which elements a selector matches, and the
 * only thing that answers it correctly is the matcher a browser uses. `ul.chips a` names no class at
 * all, and `components.test.ts` records the measurement that settled the same question there.
 *
 * ---------------------------------------------------------------------------
 * What a reader can reach, which is three things and not one
 * ---------------------------------------------------------------------------
 *
 * A page as served paints 135 of this sheet's 165 selectors, measured at ADR-0197. Twenty-one more are
 * painted by what the module every page runs builds - the copy control, the manager row, the theme
 * button, the two search fields, the playground's form. **Nine are reached by neither, and are reached
 * by a reader acting**: both themes are a click on the theme button, the invitation and its examples
 * are the search field taking focus, and an answer with its name, summary and mark is a query that the
 * catalogue answers with a contract it turned down.
 *
 * So the guard drives what a reader drives. **The alternative was an exemption list, and it is the one
 * thing this claim may not be built on**: a list of selectors excused from having a subject is a list
 * that grows by one every time somebody writes a rule nothing paints, which is the defect rather than
 * the remedy.
 *
 * **The states are driven on one page rather than on all eight, and that is measured rather than
 * assumed**: a control's states do not vary by page, and driving them everywhere took the sweep from
 * 391 ms to 3.59 s for the same 165 selectors and the same 47 faults.
 *
 * ---------------------------------------------------------------------------
 * What this does not reach, published rather than discovered
 * ---------------------------------------------------------------------------
 *
 * The document is happy-dom's, so this inherits every limit `start.test.ts` carries in its own header -
 * a real clipboard, a secure context, a layout, a hit test, a tab order, and that a browser fetches the
 * module at all. Nothing here lays anything out: a rule that paints something invisible, off-screen or
 * behind another element is a rule with a subject as far as this is concerned.
 *
 * And a state no guard drives is a state this sweep cannot see. That is a property rather than a
 * blind spot: a rule written for such a state reddens here until somebody drives it, which is the
 * forcing direction. What it costs is that the day a state cannot be driven in this document at all,
 * the answer is not an exemption - it is that the rule is unverifiable here and belongs in a browser.
 */

import { describe, it, expect } from 'vitest'

import { theReferenceModules } from './browser.js'
import { heldByTheRegistry } from './catalogue.js'
import { toHtml } from './document.js'
import { answeredFromThisTree, localSource } from './local-source.js'
import { notFoundPage } from './not-found-page.js'
import { asAnElement, selectorsIn, theSheetAPageCarries } from './painting.js'
import { FRONT_PAGE, THE_NOT_FOUND_FILE, THE_REFERENCE_MODULE } from './paths.js'
import type { WhereTheCatalogueIs } from './searching.js'
import { arrivingOnce } from './searching.js'
import { theSite } from './site.js'
import {
  copyControl,
  managerControl,
  playgroundControl,
  searchControl,
  siftControl,
  themeControl,
} from './start.js'

/**
 * A query this catalogue answers with a contract it turned down.
 *
 * The mark is the one part of an answer that is conditional - `null` where a reader can install the
 * thing - so a query answering only installable contracts leaves that rule with no subject and the
 * sweep would report it. ADR-0142's refused contract is what makes the state reachable.
 */
const A_QUERY_ANSWERED_BY_A_REFUSAL = 'group by'

/** A query the catalogue holds nothing for, which is what paints the panel's own sentence. */
const A_QUERY_NOTHING_ANSWERS = 'zzq nothing answers this'

/**
 * A value a template literal was handed and could not resolve, which renders as the word itself.
 *
 * The token and not the substring, so a class or a property whose name happens to carry those nine
 * letters is not a fault.
 */
const THE_UNRESOLVED = /(^|[\s;{}])undefined([\s;{}]|$)/

const source = localSource()

/** Every page this site serves, including the one a reader arrives at by being wrong. */
const everyPage = (): ReadonlyMap<string, string> =>
  new Map<string, string>([
    ...[...theSite(source)].map(([path, page]) => [path, toHtml(page)] as const),
    [THE_NOT_FOUND_FILE, toHtml(notFoundPage())],
  ])

const declaredIn = (where: string): WhereTheCatalogueIs | null => {
  const slot = document.querySelector(where)
  const declared = slot instanceof HTMLElement ? slot.dataset['search'] : undefined

  return declared === undefined ? null : (JSON.parse(declared) as WhereTheCatalogueIs)
}

/** Long enough for a stand-in that resolves at once to have painted what it decides. */
const settled = async (): Promise<void> => {
  for (let turn = 0; turn < 3; turn += 1) await new Promise((done) => setTimeout(done, 0))
}

/**
 * One page loaded into the document with every control the module builds, as a reader first meets it.
 *
 * The playground's reference is handed over as a `data:` URL for the reason `start.test.ts` records:
 * the builder resolves it against `document.baseURI`, which here is a scheme node's loader refuses.
 * The module is derived from the page's own address, so each playground runs its own contract - taking
 * it by filename instead ran all six on whichever reference came first, and every form but one failed
 * to build.
 */
const asAReaderFirstMeetsIt = async (
  path: string,
  html: string,
  references: ReadonlyMap<string, string>,
): Promise<void> => {
  document.open()
  document.write(html)
  document.close()

  copyControl()
  managerControl()
  themeControl()

  const masthead = declaredIn('.masthead .search')
  if (masthead !== null) searchControl(arrivingOnce(answeredFromThisTree(source, masthead)))

  const shelf = declaredIn('.find')
  if (shelf !== null) siftControl(arrivingOnce(answeredFromThisTree(source, shelf)))

  const slot = document.getElementById('playground')
  const declared = slot instanceof HTMLElement ? slot.dataset['playground'] : undefined
  if (slot !== null && declared !== undefined) {
    const js = references.get(path.replace(/index\.html$/, THE_REFERENCE_MODULE))
    if (js === undefined) throw new Error(`no reference module beside ${path}`)

    slot.dataset['playground'] = JSON.stringify({
      ...(JSON.parse(declared) as Record<string, unknown>),
      module: `data:text/javascript;base64,${Buffer.from(js, 'utf8').toString('base64')}`,
    })
  }

  await playgroundControl()
}

describe('what this stylesheet paints', () => {
  /**
   * What this reads as a selector is what a browser reads as one.
   *
   * Five rows, each a hazard rather than an example.
   *
   * **The third is the one that bit.** With `focus` written before `focus-visible` in the alternation,
   * `:focus-visible` loses its head and leaves `-visible` welded to the element beside it, so
   * `input:focus-visible` reaches the matcher as `input-visible`, matches nothing, and is reported as
   * a rule painting nothing. Four such reports were in the first reading this unit took.
   *
   * **The fourth is the one that threw.** A selector that is nothing but a state reduces to the empty
   * string, and a matcher throws on that - so a sweep would have to catch and skip, which is a
   * population shrinking in silence. `*` is what such a rule is about and what it now answers.
   *
   * Seen red before it was believed, one perturbation per row: the comma split removed, the depth
   * stack dropped, the at-rule prelude kept, `focus` written before `focus-visible`, and a selector
   * that is nothing but a state left as the empty string. All five redden this guard; **the first two
   * redden it alone**, and the other three redden the sweep below with it, which is what a reader
   * feeding a population looks like when it goes wrong.
   */
  it('what-this-reads-as-a-selector-is-what-a-browser-reads-as-one', () => {
    // A comma group is as many selectors as it has members, because one can die without the other.
    expect(selectorsIn('h2.call, h3.call { color: red }')).toEqual(['h2.call', 'h3.call'])

    // A rule inside a grouping at-rule is a rule, and the prelude that grouped it is not a selector.
    expect(selectorsIn('@media (min-width: 50rem) { main { padding: 0 } }')).toEqual(['main'])

    // A state is stripped whole, longest alternative first, or its tail welds itself to the element.
    expect(asAnElement('input:focus-visible')).toBe('input')

    // A rule that is nothing but a state is about every element, which is what a matcher can be asked.
    expect(asAnElement(':focus-visible')).toBe('*')

    // A block whose body holds declarations yields none of them, however much it looks like a rule.
    expect(selectorsIn('@font-face { font-family: Geist; src: url(a) }')).toEqual([])
  })

  /**
   * The sheet a page carries is the whole sheet this site composes.
   *
   * **Born green and justified by an event that has already happened once.** `document.ts` imports the
   * served sheet, which imports `style.ts`, which imports `components.ts`, which imports `document.ts`;
   * in a module graph entered through `components.js` the interpolation that puts the component rules
   * into the sheet resolves to nothing, and a template literal renders that as the word `undefined`.
   * Measured at ADR-0197 over two files differing only in the order of their imports: **27 036 B
   * against 21 096 B, the 5 949 B of component rules replaced by nine characters**, with nothing thrown
   * and nothing reported.
   *
   * That is why this stands beside the sweep below rather than inside it. The sweep's population is
   * this sheet; a sheet missing a sixth of itself would make it pass over rules it has no opinion
   * about, and the pass would look exactly like a healthy one.
   *
   * **The neighbouring defect is the compiler's and not this guard's, which was measured rather than
   * assumed.** A sheet losing the component rules because somebody deleted the interpolation is
   * `TS6133: 'THE_COMPONENT_RULES' is declared but its value is never read`, which ADR-0174's flags
   * turned on - so the removal is refused before a page is built and this guard is aimed at the one
   * shape the compiler cannot see, which is the interpolation resolving to nothing at all.
   *
   * **What it does not reach is the stronger form, and the reason is the cycle itself.** Asking that
   * the sheet contain `THE_COMPONENT_RULES` would catch both shapes, and it needs an import of
   * `./components.js` - which, in a list written alphabetically beside `./document.js`, is the graph
   * entry that truncates the sheet. Measured: with that import added, this guard reddens on all eight
   * pages. So the strong form is unavailable until the cycle is broken, and ADR-0197 prices that.
   *
   * Seen red before it was believed: with `./components.js` imported above the others in this file,
   * the fault names all eight pages. **It is not seen red alone and cannot be**, because a sheet
   * carrying an unresolved value is also a sheet whose selectors run into it - the sweep below reddens
   * on the same perturbation, naming the corrupted prelude. Two guards over one fault have nothing to
   * say on the day they disagree, and these two do not: this one says what is wrong with the sheet and
   * that one says what it did to the population.
   */
  it('the-sheet-a-page-carries-is-the-whole-sheet-this-site-composes', () => {
    const sheets = [...everyPage()].map(([path, html]) => [path, theSheetAPageCarries(html)] as const)

    expect(sheets.length, 'no page to read a stylesheet from').toBeGreaterThan(0)

    expect(
      sheets.filter(([, sheet]) => THE_UNRESOLVED.test(sheet)).map(([path]) => path),
      'a page carries a stylesheet holding a value that failed to resolve',
    ).toEqual([])
  })

  /**
   * Every rule this sheet paints is a rule a page writes.
   *
   * The population is every selector of the sheet a page carries, one per comma-separated member, with
   * its states and pseudo-elements taken off so the matcher is asked about an element. The subject is
   * the DOM a reader holds: the eight documents this site serves, the controls the module builds on
   * each, and the states a reader reaches by acting.
   *
   * **It was red on 47 selectors when it was written**, which is the rare shape: a guard that is not
   * born green. ADR-0197 lists them and deletes them - the shell and the navigation column no page has
   * built since ADR-0189, the lists of the retired catalogue and domain pages, `h4` on a site that
   * writes none, and the marked entry of a masthead menu that has been empty since ADR-0185.
   *
   * **A selector the matcher cannot read is reported and never skipped**, because a sweep that quietly
   * passes over what it cannot parse is one whose population shrinks without saying so.
   */
  it('every-rule-this-sheet-paints-is-one-a-page-writes', async () => {
    const pages = everyPage()
    const references = theReferenceModules(source, heldByTheRegistry(source))
    // The union over every page rather than one page's, so nothing here assumes the eight agree.
    const asked = [
      ...new Set(
        [...pages.values()].flatMap((html) =>
          selectorsIn(theSheetAPageCarries(html)).map(asAnElement),
        ),
      ),
    ]

    const reached = new Set<string>()
    const unreadable = new Set<string>()

    const sweep = (): void => {
      for (const selector of asked) {
        if (reached.has(selector)) continue

        try {
          if (document.querySelector(selector) !== null) reached.add(selector)
        } catch {
          unreadable.add(selector)
        }
      }
    }

    for (const [path, html] of pages) {
      await asAReaderFirstMeetsIt(path, html, references)
      sweep()

      // The states are a control's and not a page's, so one page is where a reader is stood in for.
      if (path !== FRONT_PAGE) continue

      const button = document.querySelector('.theme-button')
      if (button instanceof HTMLElement) {
        button.click()
        sweep()
        button.click()
        sweep()
      }

      const field = document.querySelector('.masthead .search input')
      if (!(field instanceof HTMLInputElement)) throw new Error('the masthead built no search field')

      // An empty field taking focus is the invitation, which is the panel a reader meets first.
      field.dispatchEvent(new FocusEvent('focus'))
      await settled()
      sweep()

      for (const query of [A_QUERY_ANSWERED_BY_A_REFUSAL, A_QUERY_NOTHING_ANSWERS]) {
        field.value = query
        field.dispatchEvent(new Event('input', { bubbles: true }))
        await settled()
        sweep()
      }
    }

    expect(asked.length, 'no selector to sweep').toBeGreaterThan(0)
    expect([...unreadable], 'a selector of the served sheet could not be read by the matcher').toEqual(
      [],
    )

    expect(
      asked.filter((selector) => !reached.has(selector)),
      'a rule of the served sheet paints nothing a reader can reach',
    ).toEqual([])
  })
})
