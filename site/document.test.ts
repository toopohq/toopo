import { describe, it, expect } from 'vitest'

import type { Document } from './document.js'
import { el, text, toHtml, toText, wordsOf } from './document.js'

/**
 * The two projections, and the escaping that stands between contract prose and a browser.
 *
 * The guard this file exists for is `every-word-of-the-page-is-in-both-projections`. A text projection
 * that quietly drops what the HTML shows is the only defect in this folder that could blind the
 * instrument this whole unit was measured with - the reading order, stripped of markup, read as a
 * stranger - so it is the one that gets a guard rather than a habit.
 */

const page = (...body: Parameters<typeof el>[2][]): Document => ({
  title: 'a title',
  description: 'a description',
  body,
})

describe('a page and its two projections', () => {
  it('a-text-node-is-escaped-in-the-html', () => {
    const html = toHtml(page(el('p', {}, text('a < b && c > d'))))

    expect(html).toContain('<p>a &lt; b &amp;&amp; c &gt; d</p>')
    expect(html).not.toContain('<p>a < b')
  })

  /**
   * An attribute is the other half, and it is the half a case identifier travels through: an `id` is
   * written into the markup and a `href` beside it, so a contract that named a case with a quote in it
   * would otherwise close the attribute and open whatever came next.
   */
  it('an-attribute-value-is-escaped-including-its-quotes', () => {
    const html = toHtml(page(el('div', { id: 'a"b<c' }, text('x'))))

    expect(html).toContain('<div id="a&quot;b&lt;c">x</div>')
  })

  it('the-text-projection-keeps-the-words-and-drops-the-markup', () => {
    const rendered = toText(page(el('h1', {}, text('Heading')), el('p', {}, text('Body.'))))

    expect(rendered).toBe('a title\n\na description\n\nHeading\n\nBody.\n')
  })

  /**
   * `aria-hidden` is the declaration that a screen reader skips an element, and the text projection
   * claims to be what a screen reader hears. So the anchor beside a case - a `#` that means nothing at
   * all read aloud - is dropped by the same statement that hides it from a reader, rather than by a
   * rule about class names.
   */
  it('chrome-marked-as-hidden-is-in-the-html-and-not-in-the-reading', () => {
    const chrome = page(
      el('p', {}, el('a', { href: '#x', 'aria-hidden': 'true' }, text('#')), text('the sentence')),
    )

    expect(toHtml(chrome)).toContain('<a href="#x" aria-hidden="true">#</a>')
    expect(toText(chrome)).not.toContain('#')
    expect(toText(chrome)).toContain('the sentence')
  })

  /**
   * The guard the tree exists for. Every string a reader can see reaches both projections - escaped in
   * one, bare in the other - so a projection that dropped content would be caught rather than
   * producing a shorter reading that looked like a tidier page.
   */
  it('every-word-of-the-page-is-in-both-projections', () => {
    const whole = page(
      el(
        'section',
        {},
        el('h2', {}, text('A heading')),
        el('ul', {}, el('li', {}, text('first'), el('code', {}, text('a < b')))),
        el('a', { href: '#gone', 'aria-hidden': 'true' }, text('chrome')),
      ),
    )

    const reading = toText(whole)
    const html = toHtml(whole)

    expect(wordsOf(whole)).toEqual(['A heading', 'first', 'a < b'])
    expect(wordsOf(whole).filter((word) => !reading.includes(word))).toEqual([])
    expect(
      wordsOf(whole).filter((word) => !html.includes(word.replaceAll('&', '&amp;').replaceAll('<', '&lt;'))),
    ).toEqual([])
  })

  /**
   * Nesting is a fact about the tree and not about the reading: a section that separates, holding a
   * paragraph that separates, would otherwise leave a gap proportional to the depth.
   */
  it('nesting-does-not-widen-the-gap-between-two-blocks', () => {
    const nested = page(
      el('section', {}, el('p', {}, text('one'))),
      el('section', {}, el('p', {}, text('two'))),
    )

    expect(toText(nested)).toBe('a title\n\na description\n\none\n\ntwo\n')
  })

  it('the-page-declares-its-language-its-charset-and-its-description', () => {
    const html = toHtml(page(el('p', {}, text('x'))))

    expect(html).toContain('<html lang="en">')
    expect(html).toContain('<meta charset="utf-8">')
    expect(html).toContain('<meta name="description" content="a description">')
    expect(html).toContain('<title>a title</title>')
  })

  /**
   * No script, no external request, no font. It is a fact about referencing and a declaration at once,
   * and it is cheap to state and easy to lose - a single tag added for a metric would take it.
   */
  it('a-page-loads-nothing-and-runs-nothing', () => {
    const html = toHtml(page(el('p', {}, text('x'))))

    expect(html).not.toMatch(/<script|<link|https?:\/\/|@import|url\(/)
  })
})
