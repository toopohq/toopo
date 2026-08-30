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
import { THE_SERVED_STYLESHEET } from './served-stylesheet.js'
import { theSite } from './site.js'

/** The same root `served-modules.test.ts` counts from, and for the reason ADR-0059 states. */
const ROOT = join(import.meta.dirname, '..', '..')

const EVERY_COMPONENT = Object.keys(THE_COMPONENTS) as readonly Component[]

/**
 * The selectors a block of CSS declares: what stands before each `{` at the top level.
 *
 * A scan and not a parser, which is enough because the population is this repository's own stylesheet
 * and every rule in it is flat - there is no nesting, and the two at-rules that do nest are handled by
 * tracking depth rather than by understanding them.
 */
const selectorsIn = (css: string): readonly string[] => {
  const found: string[] = []
  let depth = 0
  let since = 0

  for (let at = 0; at < css.length; at += 1) {
    if (css[at] === '{') {
      if (depth === 0) found.push(css.slice(since, at))
      depth += 1
      continue
    }

    if (css[at] === '}') {
      depth -= 1
      if (depth === 0) since = at + 1
    }
  }

  return found
    .flatMap((one) => one.split(','))
    .map((one) => one.replace(/\/\*[^]*?\*\//g, '').trim())
    .filter((one) => one.length > 0 && !one.startsWith('@'))
}

/**
 * A selector with the states stripped, because a static document answers no question about a hover.
 *
 * `:hover` and `:focus-visible` cannot match anything here, so asking the matcher about them would
 * report every stateful rule as unreachable rather than as what it is. What is left is the shape the
 * rule paints when the state is on, which is the thing worth asking about.
 */
const STATES = /::?(?:hover|focus|focus-visible|focus-within|active|visited|target|empty|first-of-type|last-child|placeholder|-webkit-[a-z-]+)/g

const withoutStates = (selector: string): string => selector.replace(STATES, '')

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
   * a component's class, every selector of the served sheet that matches it must be either one that
   * component declared or the document's own typography.
   *
   * The population is every page and every component element on it - 17 pages at the time of writing,
   * and it grows with the site rather than with this file.
   *
   * Seen red before it was believed: with `ul.chips a` restored to the sheet and the front page's
   * container named `chips` again, the fault names that selector against the four domain pills.
   */
  it('a-component-is-painted-by-its-own-rules-and-by-nothing-else', () => {
    const sheet = selectorsIn(THE_SERVED_STYLESHEET)
    const declared = new Map<Component, ReadonlySet<string>>(
      EVERY_COMPONENT.map((component) => [
        component,
        new Set(selectorsIn(paintedBy(component)).map(withoutStates)),
      ]),
    )

    const foreign = sheet.map(withoutStates).filter((selector) => !isTheDocumentsOwn(selector))

    const pages = theSite(localSource())
    const faults: string[] = []
    let painted = 0

    for (const [path, document] of pages) {
      const parsed = new DOMParser().parseFromString(toHtml(document), 'text/html')

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
   * The class the browser writes on a copy control is the one this registry paints.
   *
   * `copy` is the one component whose markup this module does not build: `start.ts` creates the button
   * in the reader's browser, on every `pre.install`. So the two halves are a literal over there and a
   * union member over here, and nothing but this compares them.
   *
   * It is why the component exists at all. The markup was already single-sourced and the *paint* was
   * two - `pre.install .copy` and `.offers .install .copy` - which is the fault with the one half that
   * usually prevents it already in place.
   *
   * Seen red before it was believed: with `start.ts` writing `copy-button`, the fault reads that the
   * module writes no class this registry paints.
   */
  it('the-class-the-browser-writes-on-a-copy-control-is-the-one-this-registry-paints', () => {
    const start = readFileSync(join(ROOT, 'packages', 'site', 'start.ts'), 'utf8')
    const written = [...start.matchAll(/\bbutton\.className = '([^']+)'/g)].map(
      (found) => found[1] as string,
    )

    expect(written.length, 'no class assignment to read in start.ts').toBeGreaterThan(0)

    // `start.ts` writes several classes and only one of them is a component's. What is asked is that
    // the registry's name for the copy control is among them: rename either half and this is red,
    // which is the whole of what the two halves owe each other.
    expect(
      written,
      'the browser writes no class on a control that this registry paints as the copy control',
    ).toContain(classOf('copy'))
  })
})
