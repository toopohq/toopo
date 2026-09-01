// @vitest-environment happy-dom

/**
 * That a component is drawn by itself, and by nothing standing round it.
 * ADR-0183 is the layer; the fault it is written against is measured in `components.ts`'s own header.
 *
 * ---------------------------------------------------------------------------
 * Why the second guard asks a matcher rather than reading the text
 * ---------------------------------------------------------------------------
 *
 * The defect that opened this unit was `ul.chips a` painting a pill, and **that selector never names
 * the pill**: it reaches it by tag and ancestry. So no sweep for a component's class finds it, and no
 * reading of selector text can - whether a selector paints a component is a question about which
 * elements it matches, and the only thing that answers it correctly is the matcher a browser uses.
 *
 * happy-dom has one, and it was measured before this guard was written rather than assumed: over the
 * markup the front page really emits, `element.matches('ul.chips a')` answers **true** for the domain
 * pill and **false** for the one drawn as a span, which is exactly the asymmetry that let the defect
 * live.
 *
 * The environment is this file's own. Every other guard of this folder but `start.test.ts` runs under
 * node, and `vitest.config.ts` says why that is worth keeping.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { THE_COMPONENTS, classOf, paintedBy } from './components.js'
import type { Component } from './components.js'
import { toHtml } from './document.js'
import { localSource } from './local-source.js'
import { asAnElement, selectorsIn, theSheetAPageCarries } from './painting.js'
import { theSite } from './site.js'

/** The same root `served-modules.test.ts` counts from, and for the reason ADR-0059 states. */
const ROOT = join(import.meta.dirname, '..', '..')

const EVERY_COMPONENT = Object.keys(THE_COMPONENTS) as readonly Component[]

/**
 * Whether a selector is the document's own typography rather than a rule aimed at something.
 *
 * A bare tag - `p`, `code`, `a` - is the default a document gives every element of that kind, and a
 * component standing in the flow is subject to it exactly as any other element is. `*` is the same
 * category rather than an exception to it: the reset every element carries, components included.
 * Anything more specific than either, reaching a component without naming it, is the fault this unit
 * removes - so the line is drawn here and nowhere finer. `body > *` is deliberately on the far side of
 * it, being a placement and not a default.
 */
const isTheDocumentsOwn = (selector: string): boolean =>
  /^[a-z][a-z0-9]*$/i.test(selector.trim()) || selector.trim() === '*'

describe('the components', () => {
  /**
   * Every selector a component declares is rooted at that component's own class.
   *
   * A drawing writes `&`, and `paintedBy` is the only thing that turns it into a class - so a
   * component has no way to spell a selector aimed at something else. This guard is what says that
   * property is real rather than merely conventional, because `&` is a string and a string can be
   * left out.
   *
   * **The neighbour it is not**: the guard below asks whether anything *outside* a component paints
   * it. This one asks whether a component paints anything outside itself. They are opposite
   * directions and neither implies the other - a drawing could name `body` while nothing named it
   * back.
   *
   * Seen red before it was believed: with the pill's hover written `ul.pills a:hover` instead of
   * `&:hover`, the fault reads that selector.
   */
  it('every-selector-a-component-declares-is-rooted-at-its-own-class', () => {
    const strays = EVERY_COMPONENT.flatMap((component) =>
      selectorsIn(THE_COMPONENTS[component].rules)
        .filter((selector) => !selector.startsWith('&'))
        .map((selector) => `${component}: ${selector}`),
    )

    // A drawing that declared nothing would satisfy the filter above by having no rows to fail it.
    expect(
      EVERY_COMPONENT.every((component) => selectorsIn(THE_COMPONENTS[component].rules).length > 0),
      'a component declares no selector at all',
    ).toBe(true)

    expect(strays, 'a component declares a selector that is not rooted at its own class').toEqual([])
  })

  /**
   * Nothing but a component's own rules paints a component, on any page this site emits.
   *
   * This is the half no type reaches and the half the defect came through. For every element carrying
   * a component's class, every selector of the sheet that page carries must be either one that
   * component declared or the document's own typography.
   *
   * The population is every page and every component element on it, and it grows with the site rather
   * than with this file.
   *
   * **The sheet is the page's own and was imported until ADR-0197.** Importing it made the subject of
   * this guard a consequence of the order of the import list above: this file names `./components.js`
   * first, so what it read was the sheet with its component rules replaced by the word `undefined`,
   * and every rule one component writes about another was outside the population. Measured with
   * `& .badge { color: red }` added to the offer's drawing - a component painting a component, which is
   * the fault this guard is named for: **green** reading the imported sheet, **red** reading the page's.
   *
   * Seen red before it was believed: with `ul.chips a` restored to the sheet and the front page's
   * container named `chips` again, the fault names that selector against the four domain pills.
   */
  it('a-component-is-painted-by-its-own-rules-and-by-nothing-else', () => {
    const declared = new Map<Component, ReadonlySet<string>>(
      EVERY_COMPONENT.map((component) => [
        component,
        new Set(selectorsIn(paintedBy(component)).map(asAnElement)),
      ]),
    )

    const pages = theSite(localSource())
    const faults: string[] = []
    let painted = 0

    for (const [path, document] of pages) {
      const html = toHtml(document)
      const parsed = new DOMParser().parseFromString(html, 'text/html')
      const foreign = selectorsIn(theSheetAPageCarries(html))
        .map(asAnElement)
        .filter((selector) => !isTheDocumentsOwn(selector))

      for (const component of EVERY_COMPONENT) {
        const own = declared.get(component) as ReadonlySet<string>

        for (const element of parsed.querySelectorAll(`.${classOf(component)}`)) {
          painted += 1

          for (const selector of foreign) {
            if (own.has(selector)) continue

            let reaches = false
            try {
              reaches = element.matches(selector)
            } catch {
              // A selector this matcher cannot read is reported rather than passed over, because a
              // guard that quietly skips what it cannot parse is one whose population shrinks in
              // silence.
              faults.push(`${path}: ${selector} could not be read by the matcher`)
              continue
            }

            if (reaches) faults.push(`${path}: ${selector} paints .${classOf(component)}`)
          }
        }
      }
    }

    // Without this the guard passes on a site that renders no component at all, which is how a sweep
    // goes green by losing what it sweeps.
    expect(painted, 'no component element on any page to sweep').toBeGreaterThan(0)

    expect([...new Set(faults)], 'something outside a component paints it').toEqual([])
  })

  /**
   * Every component class the browser writes is one this registry paints, and every one it is said to
   * write it writes.
   *
   * Four components are built in the reader's browser rather than by a page: `start.ts` creates the
   * copy control on every install block, the primary control on the one that declares the ways to run
   * it, a field for each argument of the playground, and the box the playground answers in. A browser
   * module may not import the component layer - `components.ts` reaches `document.ts`, which is the
   * generator's - so each of the four is a literal over there and a union member over here, and
   * nothing but this compares them.
   *
   * **It asked one direction about one component until the playground was redrawn**, and that was the
   * hole: it required `copy` to be among the classes written and had no opinion about the rest, so
   * `prime` was added and painted with nothing tying the literal to the union. Both directions are
   * asked now - a component class written and not declared here, and a class declared here the module
   * has stopped writing.
   *
   * The declaration is a list in this guard rather than a constant in `start.ts`, because what it
   * states is a fact about *two* files and belongs to neither: a constant over there would be the
   * module marking its own paper.
   *
   * Seen red before it was believed, in both directions: with `start.ts` writing `copy-button` the
   * fault names `copy` as declared and unwritten, and with the answer's `snippet` taken out of the
   * list below it names `snippet` as written and undeclared.
   */
  it('every-component-class-the-browser-writes-is-one-this-registry-paints', () => {
    /** The components `start.ts` builds, which is what this guard is the second statement of. */
    const THE_BROWSER_PAINTS: readonly Component[] = ['copy', 'prime', 'field', 'snippet']

    const start = readFileSync(join(ROOT, 'packages', 'site', 'start.ts'), 'utf8')
    const written = [...start.matchAll(/\.className = '([^']+)'/g)].map((found) => found[1] as string)

    expect(written.length, 'no class assignment to read in start.ts').toBeGreaterThan(0)

    // Only the ones that are component names: the module writes page classes too - the panel, the
    // refusal, the row of managers - and those are the page's own, not this layer's.
    const painted = new Set(written.filter((name) => EVERY_COMPONENT.includes(name as Component)))

    expect(
      [...painted].sort(),
      'the component classes the browser writes are not the ones declared here',
    ).toEqual([...THE_BROWSER_PAINTS].sort())
  })
})
