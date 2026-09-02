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
import { THE_SERVED_STYLESHEET } from './served-stylesheet.js'
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
   * that is nothing but a state left as the empty string. All five redden this guard.
   *
   * **Read over the whole site suite rather than over this file, they redden 2, 1, 3, 2 and 3 guards**
   * — and the population matters, because measured over this file alone the first two look like reds
   * of their own. The one that is genuinely alone is the depth stack, and W-166 is the cell for it.
   * What the others carry with them is `a-component-is-painted-by-its-own-rules-and-by-nothing-else`,
   * which asks this same reader what a sheet declares, and the sweep below, which is fed by it.
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
   * **Two things, compared, and that is the whole of why this arm reads the way it does.** What a page
   * carries is the run of characters between its `style` tags; what this site composes is
   * `THE_SERVED_STYLESHEET`. They are equal by construction - `toHtml` interpolates one into the
   * other - so what the equality is about is the *rendering* and never the sheet's content: a defect
   * inside `served-stylesheet.ts` moves both sides together and belongs to that file's own three
   * guards, and a defect on the way into the page moves them apart and belongs here. Serving `STYLE`
   * where the stripped sheet belongs, or letting the sheet through `escapeText`, are the two shapes
   * that separate them, and the second is the escaping boundary `document.ts` rests its header on.
   *
   * ---------------------------------------------------------------------------
   * What this arm replaced, and why the obvious stronger form is refused
   * ---------------------------------------------------------------------------
   *
   * It used to refuse a sheet holding the word `undefined`, which was the shape ADR-0197's cycle
   * produced: `document.ts` imported the served sheet, which imported `style.ts`, which imported
   * `components.ts`, which imported `document.ts`, and a graph entered through the wrong module
   * rendered an unresolved binding as those nine characters. **ADR-0198 cut that cycle, and the arm
   * died with it** - measured over the three interpolations that reach this sheet, `THE_FONT_FACE`,
   * `THE_SANS_STACK` and `THE_COMPONENT_RULES`, every one a `const` of a module that now imports
   * nothing or imports only leaves. A cycle was their only producer, and there is no cycle.
   *
   * **The stronger form ADR-0197 wanted is refused, and by a measurement rather than by its price.**
   * That form asks the sheet to contain `THE_COMPONENT_RULES`, which the cut makes importable here at
   * last. It compares a value with itself: both sides are read out of one graph, so a defect in the
   * rules moves them together. Measured at ADR-0198 with `paintedBy` leaving `&` unresolved - a
   * component layer painting fifty selectors no element matches, a real defect a reader would meet -
   * **the strong form passes**. It is `GUARD_PERTURBATION_RULE` exactly: it perturbs the object derived
   * from the claim and not the claim. Its only red in this repository's history came from the load
   * order the cut removed.
   *
   * **The two neighbouring defects are the compiler's, measured rather than assumed.** Deleting the
   * interpolation is `TS6133: 'THE_COMPONENT_RULES' is declared but its value is never read`, and
   * rewriting `components.ts` to take `el` and `text` from `./document.js` again - the one-line way
   * back to the cycle - is `TS2305`, because those two names live in `tree.ts` now. Both flags are
   * ADR-0174's.
   *
   * **It is red on W-24, and the instrument is what said so.** That cell serves the stylesheet as a
   * link instead of carrying it, so a page carries no sheet at all - which is this claim in its
   * strongest form, and eight other guards' as well. It was declared under the battery's
   * `unprobedRegions` on the grounds that no rewritten line could reach it; the replay refused the run
   * under *declared silent and reddened anyway*, which is the half of that field costing nothing to
   * get wrong and never noticed. The declaration was written from a reading of the defect rather than
   * of the battery, which is this repository's own recurring class arriving on that unit.
   */
  it('the-sheet-a-page-carries-is-the-whole-sheet-this-site-composes', () => {
    const pages = [...everyPage()]

    expect(pages.length, 'no page to read a stylesheet from').toBeGreaterThan(0)

    // Asked before the sheet is read, so a page serving none fails on this sentence rather than on
    // the reader throwing inside a map, which is a red that says the wrong thing.
    expect(
      pages.filter(([, html]) => !html.includes('<style>')).map(([path]) => path),
      'a page carries no stylesheet at all',
    ).toEqual([])

    const sheets = pages.map(([path, html]) => [path, theSheetAPageCarries(html)] as const)

    expect(
      sheets.filter(([, sheet]) => sheet !== THE_SERVED_STYLESHEET).map(([path]) => path),
      'a page carries a stylesheet that is not the one this site composes',
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
