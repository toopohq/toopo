import { describe, it, expect } from 'vitest'

import type { Document, StructuredData } from './document.js'
import { el, escapedForMarkdown, text, toHtml, toMarkdown, toText, wordsOf } from './document.js'
import { THE_MARKDOWN_FILE } from './paths.js'

/**
 * The three projections, and the escaping that stands between contract prose and each of them.
 *
 * The guard this file exists for is `every-word-of-the-page-is-in-every-projection`. A projection that
 * quietly drops what the HTML shows is the only defect in this folder that could blind the instrument
 * this whole unit was measured with - the reading order, stripped of markup, read as a stranger - so it
 * is the one that gets a guard rather than a habit.
 *
 * **It used to be named `...-in-both-projections`, and the third projection is what made the name a
 * defect rather than a wording.** A name that renders how many of a thing there are goes false when the
 * count moves, and falsifying it is then not the same event as reddening the guard - which is
 * ADR-0017's own criterion, met on this folder's own guard names.
 */

const page = (...body: Parameters<typeof el>[2][]): Document => ({
  title: 'a title',
  description: 'a description',
  structuredData: null,
  body,
})

/** A page that does say something about itself to a machine, for the two guards that ask what. */
const describing = (data: Partial<StructuredData>, ...body: Parameters<typeof el>[2][]): Document => ({
  ...page(...body),
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'string/slugify@1',
    description: 'Turn text into a URL-safe identifier',
    programmingLanguage: 'typescript',
    license: 'MIT-0',
    url: 'https://toopo.dev/typescript/string/slugify@1/',
    ...data,
  },
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
   * The guard the tree exists for. Every string a reader can see reaches all three projections -
   * escaped one way in the HTML, another way in the Markdown, bare in the reading - so a projection
   * that dropped content would be caught rather than producing a shorter reading that looked like a
   * tidier page.
   *
   * The Markdown side accepts either spelling of a word, and that is the shape of `wordsOf` rather than
   * a weakening: it collects text nodes without saying which of them sat inside a `code`, and a word
   * that did is reproduced verbatim while a word that did not is escaped. Whether the escaping is
   * *right* is the business of the two guards below, which ask it in both directions on data chosen for
   * it; this one asks only that nothing is lost.
   */
  it('every-word-of-the-page-is-in-every-projection', () => {
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
    const markdown = toMarkdown(whole)

    expect(wordsOf(whole)).toEqual(['A heading', 'first', 'a < b'])
    expect(wordsOf(whole).filter((word) => !reading.includes(word))).toEqual([])
    expect(
      wordsOf(whole).filter((word) => !html.includes(word.replaceAll('&', '&amp;').replaceAll('<', '&lt;'))),
    ).toEqual([])
    expect(
      wordsOf(whole).filter(
        (word) => !markdown.includes(word) && !markdown.includes(escapedForMarkdown(word)),
      ),
    ).toEqual([])
  })

  /**
   * The projection that keeps the structure, which is the whole of what it is for.
   *
   * `toText` answers what a stranger understands and throws the outline away; this answers the same
   * page to a retriever that has to know a heading from a paragraph. The mutant it exists for is a
   * Markdown projection that emits prose - every word present, the reading identical, and the one thing
   * the file was written to carry silently gone.
   */
  it('the-markdown-projection-keeps-the-structure-and-changes-the-markup', () => {
    const rendered = toMarkdown(
      page(
        el('h2', {}, text('Heading')),
        el('p', {}, text('Body.')),
        el('ul', {}, el('li', {}, text('one')), el('li', {}, text('two'))),
        el('p', {}, el('a', { href: 'number/parse@1/' }, text('the contract'))),
      ),
    )

    expect(rendered).toBe(
      'a title\n\na description\n\n## Heading\n\nBody.\n\n- one\n- two\n\n' +
        '[the contract](number/parse@1/)\n',
    )
  })

  /**
   * The escaping, in both directions, which is the only form in which it can be kept.
   *
   * A guard over one direction alone is satisfied by escaping everything or by escaping nothing - the
   * argument `a-visible-character-is-printed-as-itself` already makes about the literal escaping, met
   * again one projection along. What decides which direction applies is an ancestor and never the
   * string: the same backtick is syntax in a rationale and content in a rendered call.
   */
  it('a-mark-in-prose-is-escaped-and-a-mark-in-code-is-not', () => {
    const rendered = toMarkdown(
      page(
        el('p', {}, text('the `Intl` API, *not* a table [see below]')),
        el('p', {}, el('code', {}, text("slugify('a*b') → 'a-b'"))),
        el('p', {}, text('- this opens no list')),
      ),
    )

    // Prose: every mark carries a backslash, so none of them is read as syntax.
    expect(rendered).toContain('the \\`Intl\\` API, \\*not\\* a table \\[see below\\]')
    // Code: the contract's own answer, character for character, inside a span it cannot close.
    expect(rendered).toContain("`slugify('a*b') → 'a-b'`")
    // A block marker at the head of a line, which no inline rule reaches.
    expect(rendered).toContain('\\- this opens no list')
  })

  /**
   * A code span is closed by a run the code itself cannot write.
   *
   * No value in this catalogue holds a backtick today, which is what makes this worth a guard rather
   * than a comment: nothing about the current output can tell whether the derivation was dropped for a
   * single backtick, and the day a contract settles a case on a template literal the span would close
   * early and publish the rest of the answer as prose. It is `a-path-that-would-break-the-xml-is-escaped`
   * one projection along.
   */
  it('a-code-span-is-delimited-by-a-run-the-code-cannot-close', () => {
    const rendered = toMarkdown(
      page(
        el('p', {}, el('code', {}, text('const a = `x${y}`'))),
        el('pre', {}, text('```\nnot a fence\n```')),
      ),
    )

    expect(rendered).toContain('`` const a = `x${y}` ``')
    expect(rendered).toContain('````\n```\nnot a fence\n```\n````')
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
   * No external request, no font, and nothing of the page's own that executes. It is a fact about
   * referencing and a declaration at once, and it is cheap to state and easy to lose - a single tag
   * added for a metric would take it.
   *
   * **It was `not.toMatch(/<script|<link|.../)` and the head now holds a `link`, so the assertion had to
   * be reopened - which is the most dangerous edit in this unit and is written down as one.** A regular
   * expression over the served string was an approximant of the claim: what a page must not do is
   * *fetch* and *execute*, and `rel="alternate"` does neither - it declares that another representation
   * of this same page exists, which a reader follows or does not. So the claim is now stated in three
   * parts, each of which is the thing it means.
   *
   * The criterion for the reopening was that the mutant it existed for stays red, and W-24 - the
   * stylesheet moved out into a file - is refused by the second part rather than by the first, because
   * `/site.css` is relative and no absolute address appears. That is checked below on the mutant's own
   * edit rather than argued.
   */
  it('a-page-loads-nothing-and-runs-nothing', () => {
    const html = toHtml(page(el('p', {}, text('x'))))

    // Nothing is fetched: no absolute address, no import, no url() reaching out of the document.
    expect(html).not.toMatch(/https?:\/\/|@import|url\(/)
    // The only thing linked is this page's own Markdown, beside it, and a link is not a fetch.
    expect(html.match(/<link[^>]*>/g)).toEqual([
      `<link rel="alternate" type="text/markdown" href="${THE_MARKDOWN_FILE}">`,
    ])
    // Nothing of the page's own runs: a page that publishes no structured data carries no script.
    expect(html).not.toContain('<script')
  })

  /**
   * The structured data is a value in the head, and the one escape it needs is a JSON escape.
   *
   * **Measured before it was designed**: written as a text node in the body it goes through
   * `escapeText`, and the content of a `script` is raw text that no browser decodes - so a payload
   * carrying `&` reads back as `&amp;` to every consumer, which is valid structured data saying
   * something the page does not. `<` is the escape that belongs to the format the value is in, so
   * what a machine parses is the character the page shows.
   */
  it('the-structured-data-is-json-a-consumer-reads-back-as-what-the-page-shows', () => {
    const html = toHtml(
      describing({ description: 'accents & marks folded, </script> refused' }, el('p', {}, text('x'))),
    )
    const payload = (/<script type="application\/ld\+json">([^]*?)<\/script>/.exec(html) ?? [])[1]

    expect(payload).toBeDefined()
    expect(payload).not.toContain('&amp;')
    expect(payload).not.toContain('</script')
    expect(JSON.parse(payload as string)).toMatchObject({
      '@type': 'SoftwareSourceCode',
      description: 'accents & marks folded, </script> refused',
    })
  })

  /**
   * What a page says to a machine is said to a machine and to nobody else.
   *
   * The second half of the same measurement: a payload in the body would reach `toText`, which is the
   * instrument this whole folder is steered by, and a reader of a page would meet a JSON blob in the
   * reading order. Being in the head is what makes that impossible rather than unlikely, and this is
   * what says it is still there.
   */
  it('the-structured-data-is-in-no-projection-a-reader-meets', () => {
    const held = describing({}, el('p', {}, text('the sentence')))

    expect(toText(held)).not.toContain('schema.org')
    expect(toMarkdown(held)).not.toContain('schema.org')
    expect(wordsOf(held)).toEqual(['the sentence'])
    expect(toHtml(held)).toContain('schema.org')
  })
})
