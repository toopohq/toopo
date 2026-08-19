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
  servedBesideItsMarkdown: true,
  structuredData: null,
  body,
})

/** A page that does say something about itself to a machine, for the two guards that ask what. */
const describing = (data: Partial<StructuredData>, ...body: Parameters<typeof el>[2][]): Document => ({
  ...page(...body),
  servedBesideItsMarkdown: true,
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
   *
   * **This guard's population lost 25 007 B when ADR-0141 stopped serving the stylesheet's comments,
   * and the loss is nil.** That is a decision rather than a discovery, because this repository has
   * already paid for a population that shrank while nobody was told - so it is written here where
   * somebody can disagree with it. The claim is *this page goes and fetches nothing*, and a comment
   * fetches nothing: what left the sweep was never in the population for what the sweep asserts. A
   * real `url(` is CSS, it survives the removal, and it is refused exactly as it was before. What
   * would make this wrong is a served page carrying prose that is not CSS, and there is none.
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
   * Every colour the stylesheet paints with is a role it declared, and the roles are declared in two
   * places: the palette, and the palette again in the dark.
   *
   * **This is the executable half of the rule that the accent never says a status.** That rule cannot
   * be stated as *no rule is red*, because red is not the point - what is, is that a colour arrives on
   * this site by being named as a role, in one of two blocks a reader can hold in their head. A rule
   * that reached for a literal would be a second palette, invisible, wherever somebody happened to
   * need one; and *tint the surviving mutants* is exactly the edit that would reach for one.
   *
   * What it does not keep is stated rather than implied: somebody may still declare a `--danger` in
   * the palette and use it. What changes is that the declaration is in the block where the vocabulary
   * lives instead of buried in a rule, so it is an act somebody takes rather than one they slip into.
   *
   * The mutant it exists for is a colour literal in a rule. Seen red before it was believed: with
   * `color: #c0392b` added to `.why`, the fault reads `#c0392b outside the palette`.
   */
  it('every-colour-the-stylesheet-paints-with-is-a-role-it-declared', () => {
    const style = (/<style>([^]*?)<\/style>/.exec(toHtml(page(el('p', {}, text('x'))))) ?? [])[1] ?? ''
    const palettes = [...style.matchAll(/:root\s*\{([^}]*)\}/g)].map((found) => found[1] as string)

    // Two and only two: the palette, and the palette again under `prefers-color-scheme: dark`.
    expect(palettes).toHaveLength(2)

    // The rules are what is left once the two palettes are taken out, and no colour may survive there
    // — including one that repeats a palette value, which is a second declaration of the same role.
    const rules = style.replace(/:root\s*\{[^}]*\}/g, '')

    expect(rules.match(/#[0-9a-fA-F]{3,8}/g) ?? [], 'a colour outside the palette').toEqual([])

    // One accent per palette, so that a second hue cannot be introduced as a second name.
    for (const block of palettes) expect(block.match(/--accent:/g) ?? []).toHaveLength(1)
  })

  /**
   * Every ceiling a box carries is derived from a declared length, and never typed as one.
   *
   * **This is the palette guard's shape on the other axis, and it exists because that axis cost this
   * site its whole width.** A colour arrives here by being named as a role; a width arrives by being
   * derived from the measure, the rail or the spacing unit. Two ceilings had been typed instead -
   * `45rem` on the content column and `78rem` on the shell - and at 2 560px they left the contract
   * pages holding 38.7% of the screen and the four pages with no rail holding 17.5%. Neither number
   * named a question, and nothing could have told anybody so. ADR-0122.
   *
   * **What it does not reach is stated rather than implied.** It reads `max-width` and nothing else,
   * so a ceiling written as the second argument of `minmax()` or of `fit-content()` is outside it.
   * Those are one occurrence apiece today and reading them means carrying a balanced-paren scan for a
   * form nobody has yet got wrong, where the two that *were* wrong were both `max-width`.
   *
   * `100%` is admitted and is not an exception: it is the containing block, which is what a box that
   * must not overflow its parent has to say, and it bounds nothing on its own.
   *
   * The mutant it exists for is a ceiling typed as a length. Seen red before it was believed: with
   * `.shell` returned to `max-width: 78rem`, the fault reads `78rem`.
   */
  it('every-ceiling-on-a-box-is-derived-and-never-typed', () => {
    const style = (/<style>([^]*?)<\/style>/.exec(toHtml(page(el('p', {}, text('x'))))) ?? [])[1] ?? ''

    // The palettes hold no width, and taking them out keeps this guard reading rules only.
    const rules = style.replace(/:root\s*\{[^}]*\}/g, '')
    const ceilings = [...rules.matchAll(/max-width:\s*([^;}]+)/g)].map((found) => (found[1] as string).trim())

    // Without this the guard passes on a stylesheet that declares no ceiling at all, which is the way
    // a guard over a population goes green by losing its population.
    expect(ceilings.length, 'no ceiling to sweep').toBeGreaterThan(0)

    const typed = ceilings.filter((value) => !value.includes('var(--') && value !== '100%')

    expect(typed, 'a ceiling typed as a length rather than derived from a declared one').toEqual([])
  })

  /**
   * Every track of a layout is a fraction, a floor, or a length this stylesheet declared.
   *
   * **The ceiling guard above says in as many words that it reads `max-width` and nothing else, and
   * this unit is what turned that limit from a note into a hole.** The layout used to be one ceiling
   * on one column; it is now three arrangements of grid tracks, and a rail typed as `240px` in a track
   * would be ADR-0122's whole defect arriving through the door that guard declines to watch. So the
   * claim is split rather than widened: a ceiling is derived, and a track is a fraction of what is
   * left, a floor under a track that grows, or a length with a name.
   *
   * **A floor is admitted and is not an exception.** `minmax(8.5rem, 1fr)` and
   * `minmax(min(22rem, 100%), 1fr)` say *do not go under this*, which is a statement about when a
   * second column may appear rather than about how wide the layout is - the two are opposite claims
   * and only the second is what a page's width is decided by. The maximum of both is `1fr`.
   *
   * The scan is a regular expression and not a parser, which is what kept the guard above from
   * reaching into `minmax()` at all: a literal is admitted where it opens a `minmax()`, directly or
   * through a `min()`, and refused anywhere else in the declaration. That is total over the four forms
   * this stylesheet writes and needs no balanced parentheses.
   *
   * Born green, and the event it is written for is named: somebody sizing a column by a number. Seen
   * red before it was believed - with the three-column arrangement typed as
   * `240px minmax(0, 1fr) 268px`, the fault reads both lengths.
   */
  it('every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length', () => {
    const style = (/<style>([^]*?)<\/style>/.exec(toHtml(page(el('p', {}, text('x'))))) ?? [])[1] ?? ''
    const rules = style.replace(/:root\s*\{[^}]*\}/g, '')
    const tracks = [...rules.matchAll(/grid-template-columns:\s*([^;}]+)/g)].map((found) =>
      (found[1] as string).trim(),
    )

    // The same refusal the ceiling guard makes: a sweep whose population has left is a sweep that
    // passes by having nothing to look at.
    expect(tracks.length, 'no track to sweep').toBeGreaterThan(0)

    const typed = tracks.filter((value) =>
      [...value.matchAll(/\d*\.?\d+(?:rem|px|em|ch|vw|vh)/g)].some(
        (found) => !/minmax\(\s*(?:min\(\s*)?$/.test(value.slice(0, found.index)),
      ),
    )

    expect(typed, 'a track sized by a typed length rather than by a declared one').toEqual([])
  })

  /**
   * Every ink this palette can put on every ground it can paint clears the contrast a reader is owed.
   *
   * **Not born green, and that is the whole argument for it: it would have been red twice today.** The
   * mock-ups' fourth grey answered 2.64:1 on light paper and 2.37:1 on a case somebody had just
   * followed a link to, while carrying the case identifier; and the value they draw `dim` at answers
   * 4.24:1 on that same targeted case. Both were found by reading the built pages in a browser, which
   * is a thing somebody remembers to do. This is the same reading as arithmetic, and it is arithmetic
   * because the palette is eight hex values — a browser was needed to *find* the defect and is not
   * needed to keep it out.
   *
   * The two lists are the vocabulary rather than a second statement of it: a ground is a surface a
   * page paints, an ink is something it writes with, and the guard requires every one of them to be
   * present in both palettes. Without that half, renaming a token would drop it out of the sweep and
   * leave this green over the pairs that remain.
   *
   * 4.5:1 is what WCAG 2.2 asks of text below 24px, which every one of these inks is used at
   * somewhere: `dim` at 11px on a case identifier is the smallest. No exception is made for the
   * accent, which is a link and is read.
   */
  it('every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible', () => {
    const GROUNDS = ['paper', 'wash', 'card', 'target']
    const INKS = ['ink', 'body', 'dim', 'accent']
    /** A line, which owes 3:1 as a non-text distinction and is never a ground or an ink. */
    const NEITHER = ['rule', 'edge']

    const luminance = (hex: string): number => {
      const channels = [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16) / 255)
      const linear = channels.map((one) =>
        one <= 0.03928 ? one / 12.92 : ((one + 0.055) / 1.055) ** 2.4,
      )

      return (
        0.2126 * (linear[0] as number) +
        0.7152 * (linear[1] as number) +
        0.0722 * (linear[2] as number)
      )
    }

    const contrast = (one: string, other: string): number => {
      const [lighter, darker] = [luminance(one), luminance(other)].sort((a, b) => b - a)

      return ((lighter as number) + 0.05) / ((darker as number) + 0.05)
    }

    const style = (/<style>([^]*?)<\/style>/.exec(toHtml(page(el('p', {}, text('x'))))) ?? [])[1] ?? ''
    const palettes = [...style.matchAll(/:root\s*\{([^}]*)\}/g)].map((found) => found[1] as string)
    const failures: string[] = []

    for (const [at, block] of palettes.entries()) {
      const scheme = at === 0 ? 'light' : 'dark'
      const declared = new Map(
        [...block.matchAll(/--([a-z]+):\s*(#[0-9a-fA-F]{6})/g)].map((found) => [
          found[1] as string,
          found[2] as string,
        ]),
      )

      // Total over the palette in both directions: a role that left the palette stops being swept,
      // and a colour that joined it is one nobody classed. `faint` is how the first half happened.
      const classed = new Set([...GROUNDS, ...INKS, ...NEITHER])

      for (const role of classed) {
        if (!declared.has(role)) failures.push(`${scheme}: no --${role} in the palette`)
      }
      for (const role of declared.keys()) {
        if (!classed.has(role)) failures.push(`${scheme}: --${role} is neither a ground nor an ink`)
      }

      for (const ground of GROUNDS) {
        for (const ink of INKS) {
          const two = [declared.get(ink), declared.get(ground)]
          if (two.some((one) => one === undefined)) continue

          const ratio = contrast(two[0] as string, two[1] as string)
          if (ratio < 4.5) failures.push(`${scheme}: ${ink} on ${ground} is ${ratio.toFixed(2)}:1`)
        }
      }
    }

    expect(failures, 'an ink a reader cannot read on a ground this palette paints').toEqual([])
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
