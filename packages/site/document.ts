/**
 * A page, and the projections of it that must never disagree.
 * ADR-0024 is why a page is a value with projections rather than a string; ADR-0025 is what goes
 * between two of its elements in a reading; ADR-0094 is what the third projection is for and what it
 * was measured to be worth; ADR-0101 is why a document declares whether it has a Markdown twin rather
 * than every one being assumed to.
 *
 *
 * ---------------------------------------------------------------------------
 * Why a page is a tree and not a string
 * ---------------------------------------------------------------------------
 *
 * The one thing this unit had to be able to measure is **the reading order, stripped of markup**: what
 * a search engine indexes, what a screen reader announces, and the closest thing there is to *what a
 * stranger understands in ten seconds*. A generator that concatenated HTML could only be measured by
 * parsing its own output back, which means a second implementation of HTML - and a bug in the reader
 * would read as a bug in the page.
 *
 * So a page is a value, and `toHtml`, `toText` and `toMarkdown` are projections of it. Reading the page
 * as text stops being a thing somebody remembers to do and becomes something a guard can hold: they are
 * statements about one tree, and their disagreement is a defect rather than a formatting difference.
 * `every-word-of-the-page-is-in-every-projection` is that guard, and the mutant it exists for is a
 * projection that quietly drops what the HTML shows - the only defect in this folder that could blind
 * the instrument this unit is measured with.
 *
 * **The third projection is what makes the shape pay for itself a second time.** A Markdown rendering of
 * a page is the obvious place for a second generator, and a second generator is two statements of one
 * document that drift until one of them lies. Here it is a table: `THE_READING` and `THE_MARKDOWN` are
 * two total maps over the same closed tag set, walked by one function, so what they can disagree about
 * is decoration and never content.
 *
 * ---------------------------------------------------------------------------
 * The escaping is the security boundary, and it is total by construction
 * ---------------------------------------------------------------------------
 *
 * Everything on a contract page is contract prose: rationales carrying quotes and backslashes, a
 * declared output alphabet that is a regular expression, inputs holding `<`. There is no node kind
 * that carries raw markup, so there is nowhere for an escape to be forgotten - the stylesheet, which is
 * the one thing that must not be escaped, is not a node and never passes through here.
 *
 * That is the shape this repository prefers over a rule in a header: the wrong thing is unwritable
 * rather than forbidden.
 */

import { THE_MARKDOWN_FILE } from './paths.js'
import { THE_SERVED_STYLESHEET } from './served-stylesheet.js'
import { THE_THEME_SCRIPT } from './theme.js'

export type Attributes = Readonly<Record<string, string>>

/**
 * Every tag this repository builds a node with, closed so that a projection cannot forget one.
 *
 * It used to be `string`, and the separator table was a partial record falling back to *no separator* -
 * which is the exact shape of the defect W-64 published: an element that carried no separator was put
 * where a block belonged, and the element after it began mid-line, on the first screen of the site. A
 * partial table cannot fail to be silent about a tag nobody entered.
 *
 * With the set closed, a total map over it is the shape ADR-0054 asks for: **one more tag does not
 * compile until every projection has said what it does with it.**
 * That is worth more here than anywhere else in this folder, because there are now three projections
 * and the cost of forgetting one is a reading that is quietly wrong rather than a page that breaks.
 *
 * Every one of them has a call site, which is a property of the set rather than a count of it: all but
 * `section` are written by a page, and that one occurs in `document.test.ts`, which builds nesting no
 * page happens to write today.
 *
 * **The last two arrived for the same reason, one at each end of the content.** `main` came with the
 * rail: a page carrying a masthead and a table of contents makes whoever navigates by landmark cross
 * both before reaching a word of the contract, and the remedy for that is the landmark rather than a
 * rule about how many links may come first. `aside` came with the column beside it, and the argument
 * is that rule read backwards - matter a reader may skip has to be skippable, and `complementary` is
 * what says so to somebody who is not looking at the columns. ADR-0116, ADR-0123.
 * Eight tags the separator table used to carry - `table`, `tr`, `ol`, `dl`, `dt`, `dd`, `header`,
 * `footer` - had no call site at all and went with it, because an entry nothing exercises is an entry
 * nothing keeps honest.
 *
 * **Two of the eight came back, and what brought them back is the rule that removed them.** The
 * artboard draws a banner at the top of the page and a contentinfo at the foot; both are now written by
 * `chrome.ts`, so both have a call site and neither is an entry nobody exercises. Five tags entered
 * with them - `span`, `svg`, `rect`, `path` for the marks the design draws, and `footer` for the foot -
 * and the compiler refused each until both projections had said what it does, which is the whole of
 * what this union is for. ADR-0182.
 */
export type Tag =
  | 'header'
  | 'footer'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'pre'
  | 'ul'
  | 'li'
  | 'div'
  | 'section'
  | 'nav'
  | 'main'
  | 'aside'
  | 'a'
  | 'code'
  | 'strong'
  | 'span'
  | 'svg'
  | 'rect'
  | 'path'
  | 'script'

export type TextNode = { readonly kind: 'text'; readonly text: string }

export type Element = {
  readonly kind: 'element'
  readonly tag: Tag
  readonly attributes: Attributes
  readonly children: readonly Node[]
}

export type Node = TextNode | Element

/**
 * A whole page: what it is called, what it is about, and what it says.
 *
 * The title and the description are part of the document rather than of the renderer, because both are
 * read *first* - by a search engine, by a tab, by whoever is deciding whether to keep reading - so
 * leaving them out of the text projection would measure the reading order of everything except its
 * opening.
 */
/**
 * What a page publishes about itself in the one vocabulary a search engine reads as data.
 *
 * **`SoftwareSourceCode` and nothing else, because it is the only type here any page can fill
 * truthfully.** A contract page is about the source of one function; the catalogue is a list, the
 * method page is an argument, and the refusals page is a judgement. Giving those three a
 * `SoftwareSourceCode` because the field exists would publish a false `@type` in the one part of a page
 * written for machines, which is the class this repository spends its length removing - so the field is
 * total and they answer `null`, which is a statement rather than an omission.
 *
 * Every value is derived from what the page already renders, and the two that could have been
 * transcribed are the two that matter most. `license` is `THE_COPIED_LICENCE` - what a reader *takes*
 * is MIT-0, where the repository is MIT, and writing the repository's licence here would tell a machine
 * the wrong thing about the code it is looking at. `url` is `contractUrl`, which is already the address
 * a licence header freezes into other people's repositories.
 */
export type StructuredData = {
  readonly '@context': 'https://schema.org'
  readonly '@type': 'SoftwareSourceCode'
  readonly name: string
  readonly description: string
  readonly programmingLanguage: string
  readonly license: string
  readonly url: string
}

export type Document = {
  readonly title: string
  readonly description: string
  /**
   * Whether this document is served beside its Markdown twin, which is what decides the
   * `rel="alternate"` in its head.
   *
   * A field rather than an assumption, because `toHtml` used to emit that link for every document it
   * rendered - true of every page, and false of the one document this site serves that is not a page.
   * **The 404 file is served at whatever address a reader mistyped**, so a relative `index.md` beside
   * it would resolve to a different place on every error and to nothing on all of them.
   *
   * Required rather than optional, so that a document added without an opinion does not compile: the
   * shape ADR-0054 asks for, on the one declaration a reader's tooling follows.
   */
  readonly servedBesideItsMarkdown: boolean
  /** `null` where a page has nothing true to say about itself in schema.org's vocabulary. */
  readonly structuredData: StructuredData | null
  readonly body: readonly Node[]
}

export const text = (value: string): Node => ({ kind: 'text', text: value })

export const el = (tag: Tag, attributes: Attributes, ...children: readonly Node[]): Node => ({
  kind: 'element',
  tag,
  attributes,
  children,
})

const escapeText = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const escapeAttribute = (value: string): string => escapeText(value).replaceAll('"', '&quot;')

const renderNode = (node: Node): string => {
  if (node.kind === 'text') return escapeText(node.text)

  const attributes = Object.entries(node.attributes)
    .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
    .join('')

  return `<${node.tag}${attributes}>${node.children.map(renderNode).join('')}</${node.tag}>`
}

/**
 * Whether an element is chrome rather than content.
 *
 * `aria-hidden` is not a device invented here: it is the declaration that a screen reader skips this
 * element, and the text projection claims to be what a screen reader hears. So the two answer to one
 * statement rather than to a rule about classes - the anchor beside a case is a `#` that means
 * *nothing at all* read aloud, and it is marked as such for a reader before it is dropped from a
 * measurement.
 */
const isChrome = (node: Node): boolean =>
  node.kind === 'element' && node.attributes['aria-hidden'] === 'true'

/**
 * How one element turns the reading of what it holds into its own.
 *
 * It takes the element and not only its tag, because a link's destination is an attribute and a
 * projection that carries structure has to reach it. Everything else here is a function of the tag
 * alone, and the two helpers below say which is which at a glance.
 */
type Decorate = (element: Element, children: string) => string

/**
 * One way of reading a page: what a text node becomes, which tags hold content rather than prose, and
 * what every tag writes around what it holds.
 *
 * **The element table is total over `Tag`, and that is the whole reason the tag set is closed.** Three
 * projections now answer the same tree, and the failure that costs most is not a projection that
 * breaks - it is one that quietly says nothing about a tag, which reads as a tidier page.
 */
type Projection = {
  /** What a text node reads as when it is prose. */
  readonly prose: (value: string) => string
  /** The tags whose children are content to be reproduced rather than prose to be marked up. */
  readonly verbatim: ReadonlySet<Tag>
  readonly element: Readonly<Record<Tag, Decorate>>
}

/** An element that writes nothing of its own and only ends what it holds. */
const ends =
  (separator: string): Decorate =>
  (_, children) =>
    children + separator

/** An element that writes itself around what it holds. */
const wraps =
  (before: string, after: string): Decorate =>
  (_, children) =>
    before + children + after

/**
 * The reading: the markup thrown away, and the structure kept as white space.
 *
 * The separator is a property of the element and not of the renderer, because it is the only thing
 * that carries *structure* into a projection that has thrown the markup away. Without it a heading
 * runs into its paragraph and the reading order is a wall - which would make the measurement this file
 * exists for unreadable, and therefore useless.
 */
const THE_READING: Projection = {
  prose: (value) => value,
  verbatim: new Set(),
  element: {
    header: ends('\n\n'),
    footer: ends('\n\n'),
    h1: ends('\n\n'),
    h2: ends('\n\n'),
    h3: ends('\n\n'),
    h4: ends('\n\n'),
    p: ends('\n\n'),
    pre: ends('\n\n'),
    ul: ends('\n'),
    li: ends('\n'),
    div: ends(''),
    section: ends('\n\n'),
    nav: ends('\n\n'),
    main: ends('\n\n'),
    aside: ends('\n\n'),
    a: ends(''),
    code: ends(''),
    strong: ends(''),
    span: ends(''),
    svg: ends(''),
    rect: ends(''),
    path: ends(''),
    script: ends(''),
  },
}

/**
 * What one node reads as under one projection.
 *
 * The verbatim flag is carried down rather than looked up, because what decides whether a string is
 * prose is an *ancestor* and not the string: the text inside a `code` is the contract's own answer and
 * a backslash in it is a backslash, where the same characters in the paragraph beside it are syntax.
 */
const projected = (node: Node, how: Projection, verbatim: boolean): string => {
  if (node.kind === 'text') return verbatim ? node.text : how.prose(node.text)
  if (isChrome(node)) return ''

  const inside = verbatim || how.verbatim.has(node.tag)

  return how.element[node.tag](
    node,
    node.children.map((child) => projected(child, how, inside)).join(''),
  )
}

/**
 * What a reader reads of one node, separator included.
 *
 * Exported because the whole-page projection cannot answer the question two elements raise about each
 * other: `toText` trims and collapses, so by the time a page is a string the boundary between two
 * siblings has become indistinguishable from the boundary inside one. A guard asking whether two
 * elements run together needs each one's reading *with its own trailing separator still on it*, which
 * is exactly this and is nothing more than the step `toText` is built out of.
 */
export const readingOf = (node: Node): string => projected(node, THE_READING, false)

/**
 * The structured data, as a value that becomes JSON rather than as markup a page carries.
 *
 * **It is in the head and not in the tree, and that was measured rather than preferred.** Written as a
 * text node it goes through `escapeText`, and the content of a `script` is raw text in HTML - no entity
 * in it is ever decoded - so the payload parses as JSON and every string in it carries `&amp;` and
 * `&lt;` where the page shows `&` and `<`. Valid structured data, corrupt values, and nothing red. The
 * second half is worse: a text node reaches `toText`, so the instrument this whole folder is measured
 * by would be reading a JSON blob as part of the page.
 *
 * So it sits beside the title, which is the other thing a page says about itself and does not say to a
 * reader, and no projection sees it. `document.ts`'s rule that no node holds raw markup is untouched -
 * this is not a node.
 *
 * The one escape is `<` as its JSON code point, which is what stops a value holding `</script` from
 * closing the element early. It is a JSON escape and not an HTML one, so a consumer reads back exactly
 * the character the page shows.
 */
const asJsonLd = (data: StructuredData): string =>
  `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`

/**
 * What every page declares about the Markdown beside it.
 *
 * A bare file name, because the two are siblings by construction - so this is the same string on every
 * page of the site, whatever its depth, and there is no path arithmetic to get wrong.
 */
const THE_ALTERNATE_LINK = `<link rel="alternate" type="text/markdown" href="${THE_MARKDOWN_FILE}">`

/**
 * The head of a page, and what is worth saying about it is now two things rather than one.
 *
 * **It names one thing a browser has to go and fetch, and it is a face.** That sentence read *nothing*
 * until ADR-0176: no stylesheet link, no font, no script but the playground's own module, no image.
 * What changed is the font, and the shape of the change is smaller than the sentence makes it sound -
 * the fetch is declared inside the stylesheet rather than by an element here, so the head still names
 * one link and it is still this page's own Markdown. That link being the only one is what refuses W-24,
 * the stylesheet moved out into a file, and nothing in this unit went near it.
 *
 * **It carries one script, inline, and it is the theme.** `theme.ts` holds why it is here rather than
 * in the deferred module beside every other control: it sets an attribute before the first paint, and
 * a reader who chose a theme against their system would otherwise watch the page turn on every
 * navigation. It fetches nothing, and it is not needed to read - the palette answers
 * `prefers-color-scheme` in CSS, so a reader with no JavaScript gets their own system's theme.
 *
 * That is ADR-0115's decision arriving here, half kept and half overruled, rather than a habit of this
 * file. The system it decides lives in `style.ts`; what is left of it at this end is the `style`
 * element, which is the whole reason the rest of that record can be true of a page served once from a
 * static host. `a-page-loads-nothing-and-runs-nothing` is what holds the part that stands, and it
 * names the two fetches this page makes rather than denying that it makes any.
 *
 * **The sheet arrives here already stripped of its prose, and this file does not know that.** What
 * `served-stylesheet.ts` hands over is one string, exactly as `style.ts` used to hand one over; the
 * argument for the removal and what it is worth live there, where the removal is. ADR-0141.
 */

export const toHtml = (document: Document): string =>
  [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeText(document.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(document.description)}">`,
    ...(document.servedBesideItsMarkdown ? [THE_ALTERNATE_LINK] : []),
    ...(document.structuredData === null ? [] : [asJsonLd(document.structuredData)]),
    `<script>${THE_THEME_SCRIPT}</script>`,
    `<style>${THE_SERVED_STYLESHEET}</style>`,
    '</head>',
    '<body>',
    document.body.map(renderNode).join(''),
    '</body>',
    '</html>',
    '',
  ].join('\n')

// ---------------------------------------------------------------------------
// The third projection: the same page, with the structure kept and the markup changed
// ---------------------------------------------------------------------------
//
// A retriever that opens a contract page pays for the markup around the prose. Measured over the four
// contract pages, the reading is 59 % to 64 % of the served HTML - so what a Markdown projection saves
// is about a third, and it is arithmetic rather than a claim about what any robot does. What it buys
// beyond the bytes is the half `toText` throws away: a heading is still a heading, a list is still a
// list, and a case's call is still code.
//
// Nothing here selects what to publish. The Markdown is the same tree as the HTML, decorated
// differently, and the one declaration that removes anything is `aria-hidden` - which both projections
// already obey, and which says a screen reader skips it rather than *this renderer skips it*.

/**
 * The characters CommonMark reads as syntax wherever they stand in a paragraph.
 *
 * Escaped for the reason `escapeText` escapes markup rather than the characters today's data happens
 * to hold: measured over the seven pages, **53 of 790 prose nodes carry a backtick**, ten an asterisk
 * and five a bracket - so a contract's own rationale opens a code span, and the sentence after it is
 * published as code. The set is CommonMark's, not this catalogue's, so it cannot go stale against data
 * it has never seen.
 */
const INLINE_SYNTAX = /[\\`*_[\]<&]/g

/**
 * A block marker at the head of a text node, which is the other half and needs its own rule.
 *
 * A line opening with `- ` is a list item however the paragraph was meant, and **a line can only ever
 * begin where a decoration ended or where a text node begins** - so escaping the head of every prose
 * node is total, without a pass over the assembled string that could not tell a real bullet from a
 * quoted one. Measured cost of that totality: four of 790 nodes are escaped mid-sentence, where the
 * marker was harmless and a backslash renders as nothing.
 *
 * The asterisk is absent because `INLINE_SYNTAX` has already escaped it, and an alternative that can
 * never match is one nobody can measure.
 */
const OPENS_A_BLOCK = /^(\s{0,3})([-+#>]|\d{1,9}[.)])/

/**
 * Exported for `every-word-of-the-page-is-in-every-projection`, which has to accept either spelling of
 * a word and would otherwise transcribe this rule into a guard - a copy that goes stale the day the
 * syntax set moves, in the file whose whole subject is that two statements of one thing drift.
 */
export const escapedForMarkdown = (value: string): string =>
  value
    .replace(INLINE_SYNTAX, (character) => `\\${character}`)
    .replace(
      OPENS_A_BLOCK,
      (_, indent: string, marker: string) =>
        `${indent}${/^\d/.test(marker) ? marker.replace(/.$/, '\\$&') : `\\${marker}`}`,
    )

/** The longest run of backticks in a value, which is what a fence around it has to beat. */
const longestFence = (value: string): number =>
  (value.match(/`+/g) ?? []).reduce((most, run) => Math.max(most, run.length), 0)

/**
 * A code span, delimited by a run derived from the code rather than assumed.
 *
 * No value in this catalogue holds a backtick today, and that is exactly what makes the derivation
 * worth writing instead of a single backtick: nothing about the current output can tell whether it was
 * dropped, and the day a contract settles a case on a template literal the span would close early and
 * publish the rest of the answer as prose. It is `indexing.ts`'s argument for escaping an ampersand no
 * address holds, on the delimiter of a span.
 */
const codeSpan = (code: string): string => {
  const fence = '`'.repeat(longestFence(code) + 1)
  const padding = /^`|`$/.test(code) ? ' ' : ''

  return `${fence}${padding}${code}${padding}${fence}`
}

/** A fenced block, on the same derivation, and never carrying a language this projection invented. */
const codeBlock = (code: string): string => {
  const fence = '`'.repeat(Math.max(3, longestFence(code) + 1))

  return `${fence}\n${code}\n${fence}\n\n`
}

/** A destination holding white space or a bracket is written between angle brackets. */
const destination = (href: string): string => (/[\s()<>]/.test(href) ? `<${href}>` : href)

/** Everything after the first line of a block, moved under the marker that opened it. */
const indented = (block: string): string => block.replaceAll('\n', '\n  ')

const THE_MARKDOWN: Projection = {
  prose: escapedForMarkdown,
  verbatim: new Set(['code', 'pre']),
  element: {
    header: ends('\n\n'),
    footer: ends('\n\n'),
    h1: wraps('# ', '\n\n'),
    h2: wraps('## ', '\n\n'),
    h3: wraps('### ', '\n\n'),
    h4: wraps('#### ', '\n\n'),
    p: ends('\n\n'),
    pre: (_, children) => codeBlock(children),
    ul: ends('\n'),
    li: (_, children) => `- ${indented(children.trimEnd())}\n`,
    div: ends(''),
    section: ends('\n\n'),
    nav: ends('\n\n'),
    main: ends('\n\n'),
    aside: ends('\n\n'),
    a: (element, children) => {
      const href = element.attributes['href']

      return href === undefined ? children : `[${children}](${destination(href)})`
    },
    code: (_, children) => codeSpan(children),
    strong: wraps('**', '**'),
    span: ends(''),
    svg: ends(''),
    rect: ends(''),
    path: ends(''),
    script: ends(''),
  },
}

/**
 * A whole page under one projection: the two things a reader meets before anything else, then the body.
 *
 * Runs of blank lines are collapsed, because an element that separates and contains an element that
 * separates would otherwise leave a gap proportional to the nesting - which is a fact about the tree
 * and not about the reading.
 *
 * **The title takes no heading of its own, in either projection, and that is the one place a renderer
 * would have been free to invent.** A `<title>` is not an `h1`: every page here carries both and
 * `the-opening-of-a-page-says-three-different-things` requires them to say different things, so marking
 * the title as `#` would publish two top-level headings where the document declares one, and the
 * renderer would have decided which of the two is really the title.
 */
const assembled = (document: Document, how: Projection): string =>
  [
    how.prose(document.title),
    '',
    how.prose(document.description),
    '',
    ...document.body.map((node) => projected(node, how, false)),
  ]
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n'

/** The same page with the markup thrown away, in document order. */
export const toText = (document: Document): string => assembled(document, THE_READING)

/** The same page again, with its structure kept in the one syntax a retriever reads without a parser. */
export const toMarkdown = (document: Document): string => assembled(document, THE_MARKDOWN)

/** Every string a reader of this page can see, in document order. */
export const wordsOf = (document: Document): readonly string[] => {
  const collected: string[] = []

  const walk = (node: Node): void => {
    if (node.kind === 'text') {
      if (node.text.trim() !== '') collected.push(node.text.trim())
      return
    }
    if (isChrome(node)) return
    for (const child of node.children) walk(child)
  }

  for (const node of document.body) walk(node)

  return collected
}
