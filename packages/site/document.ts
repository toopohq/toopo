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

export type Attributes = Readonly<Record<string, string>>

/**
 * Every tag this repository builds a node with, closed so that a projection cannot forget one.
 *
 * It used to be `string`, and the separator table was a partial record falling back to *no separator* -
 * which is the exact shape of the defect W-64 published: an element that carried no separator was put
 * where a block belonged, and the element after it began mid-line, on the first screen of the site. A
 * partial table cannot fail to be silent about a tag nobody entered.
 *
 * With the set closed, a total map over it is the shape ADR-0054 asks for: **a sixteenth tag does not
 * compile until every projection has said what it does with it.**
 * That is worth more here than anywhere else in this folder, because there are now three projections
 * and the cost of forgetting one is a reading that is quietly wrong rather than a page that breaks.
 *
 * The set is what has a call site, measured rather than remembered: fifteen occur on the seven pages
 * and `section` occurs in `document.test.ts`, which builds nesting no page happens to write today.
 * `main` is the sixteenth and arrived with the rail: a page carrying a masthead and a table of
 * contents makes whoever navigates by landmark cross both before reaching a word of the contract, and
 * the remedy for that is the landmark rather than a rule about how many links may come first.
 * ADR-0116.
 * Eight tags the separator table used to carry - `table`, `tr`, `ol`, `dl`, `dt`, `dd`, `header`,
 * `footer` - had no call site at all and are gone with it, because an entry nothing exercises is an
 * entry nothing keeps honest.
 */
export type Tag =
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
  | 'a'
  | 'code'
  | 'strong'
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
    a: ends(''),
    code: ends(''),
    strong: ends(''),
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
 * The stylesheet, which is the whole of what this site loads beyond the page itself.
 * ADR-0115 is the system it declares: the scale, the unit, the roles and the one accent.
 *
 * Inline rather than a file, and that is a measurement about the launch rather than a preference:
 * seven pages served once each, where a second request costs a round trip and a cache entry buys
 * nothing until somebody reads a second page. **The arithmetic that will overturn it is known and is
 * not today's**: this text is repeated in every page of the tree, so a catalogue of a thousand
 * contracts carries a thousand copies, and at that size a file and one request is the cheaper half by
 * orders of magnitude. It is written here rather than acted on because seven copies is not a problem
 * and because a file would be a second address with a cache policy nothing here derives.
 *
 * No image, and no web font: ADR-0115 carries what the second refusal costs and what would reverse
 * it, measured rather than assumed.
 *
 * **This paragraph used to end "and no script", and the playground took that clause and not the one
 * after it.** What it was actually protecting survives untouched: *a contract page that needs
 * JavaScript to be read is a page a crawler and a screen reader read differently from a person.* A
 * page is still read without a line of it - the signature, the settled cases, the properties, the
 * profiles and the digest are all in the served HTML. What the script adds is the one thing static
 * HTML cannot do, which is answer an input nobody wrote down in advance, and `start.ts` builds its
 * own form so that a reader without JavaScript meets prose rather than a control that does nothing.
 *
 * ---------------------------------------------------------------------------
 * Six sizes, one unit, and roles rather than colours
 * ---------------------------------------------------------------------------
 *
 * The scale is six steps and there is no seventh: a page that needs one more size is a page that has
 * stopped distinguishing things and started decorating them. Every length that separates anything is
 * a multiple of `--s`, declared as such rather than rounded to it, so the rhythm is a consequence of
 * one number instead of a habit.
 *
 * The colours are named for what they *do* - paper, wash, card, rule, edge, ink, body, dim - so that
 * the dark palette is the same document with different values and never a second stylesheet.
 *
 * **There are two greys and not three, and a measurement is what removed the third.** The mock-ups
 * carry a `faint` below `dim`, and it was carrying the case identifier, the rail's label and the page
 * you are on. Read in a browser: 2.64:1 on light paper, 3.37:1 on dark, and 2.37:1 on a case somebody
 * had just followed a link to - against the 4.5:1 that text under 24px owes a reader. `dim` itself is
 * 5.45:1, so there was no room underneath it for a fourth legible step, and a colour that is only
 * *nearly* legible is worse than one step fewer. What tells the identifier apart from the argument
 * beside it is now the size and the face, which is what a scale is for.
 *
 * `dim` itself is a shade lighter in the dark palette than the mock-ups draw it, for the same reason
 * and on the same reading: `#8b857d` clears 4.5:1 on paper and on wash and answers **4.24:1 on a case
 * somebody has just followed a link to**, which is the one row where a reader is certain to be looking.
 * A ground that lifts is a ground the ink has to lift with.
 * `system-ui` and `ui-monospace` first, so the page is set in whatever the reader's own system uses
 * and downloads nothing. The measure is capped in `ch` rather than pixels because what has to stay
 * readable is a line of prose and a line of code, both of which are counted in characters.
 *
 * ---------------------------------------------------------------------------
 * The accent never says a status
 * ---------------------------------------------------------------------------
 *
 * One accent, and it means *you can act on this or you are here*: a link, a focus ring, a hover, the
 * page you are on, the case you followed a link to. It never means good or bad, and there is no
 * second colour that could.
 *
 * **A catalogue that publishes its failures does not tint them red.** The method page names 35
 * surviving mutants beside 632 caught ones, and every contract page carries cases that exist because
 * a defect got past the suite. Colouring those would sort this repository's own evidence into things
 * a reader is meant to feel bad about, which is the opposite of why they are published - and it would
 * make the reading and the page say different things, since a colour survives neither `toText` nor
 * `toMarkdown`. Caught and surviving are told apart by the word.
 */
const STYLE = `
:root {
  --s: .25rem;
  --s2: calc(var(--s) * 2); --s3: calc(var(--s) * 3); --s4: calc(var(--s) * 4);
  --s5: calc(var(--s) * 5); --s6: calc(var(--s) * 6); --s8: calc(var(--s) * 8);
  --s10: calc(var(--s) * 10); --s12: calc(var(--s) * 12); --s16: calc(var(--s) * 16);
  --s24: calc(var(--s) * 24);

  --t1: 1.625rem; --t2: 1.1875rem; --t3: 1rem; --t4: .9375rem; --t5: .8125rem; --t6: .6875rem;

  --paper: #fbfaf8; --wash: #f3f1ec; --card: #f6f4f0; --rule: #e2ded7; --edge: #d3cfc7;
  --ink: #1c1b19; --body: #3a3833; --dim: #6b6660;
  --accent: #a0491d; --target: #f6ece4;

  --sans: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #171614; --wash: #201f1c; --card: #201f1c; --rule: #34322e; --edge: #45423c;
    --ink: #e8e5df; --body: #c5c0b8; --dim: #918b83;
    --accent: #e2905d; --target: #2a231d;
  }
}
* { box-sizing: border-box }
/* A full-bleed column: everything sits in a measure, and the two elements that lay themselves out
   span the whole width. It is one declaration rather than a wrapper on every page. */
body {
  display: grid; grid-template-columns: 1fr min(74ch, calc(100% - var(--s10))) 1fr;
  margin: 0; padding: 0 0 var(--s24);
  font: var(--t3)/1.62 var(--sans); color: var(--body); background: var(--paper);
  /* A contract's digest is 64 characters with nothing to break at, and it is prose rather than code:
     without this the sentence carrying it pushes the whole page sideways on a narrow screen. */
  overflow-wrap: break-word;
}
body > * { grid-column: 2 }
body > .masthead, body > .shell { grid-column: 1 / -1 }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }
a { color: var(--accent) }
h1, h2, h3, h4 { color: var(--ink) }
h1 { font-size: var(--t1); font-weight: 600; letter-spacing: -.02em; margin: 0 0 var(--s3) }
/* A page whose title is a direct child of the body has no card and no main to stand it off the
   masthead, and measured in a browser the two were touching at a gap of 0. */
body > h1 { margin-top: var(--s10) }
h2 {
  font-size: var(--t3); font-weight: 600; margin: var(--s12) 0 0;
  padding-top: var(--s4); border-top: 1px solid var(--rule); scroll-margin-top: var(--s16);
}
h3, h4 { font-size: var(--t4); font-weight: 600; margin: var(--s8) 0 0; scroll-margin-top: var(--s16) }
h2 + p, h2 + ul, h3 + p, h4 + p { margin-top: var(--s3) }
p { margin: 0 0 var(--s4) }
code, pre { font-family: var(--mono); font-size: .875em }
pre {
  margin: 0 0 var(--s4); padding: var(--s3) var(--s4); overflow-x: auto;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 6px; color: var(--ink);
}
.lede { font-size: var(--t2); line-height: 1.45; color: var(--body); margin: 0 0 var(--s5); max-width: 60ch }
.meta { color: var(--dim); font-size: var(--t5) }
.why { margin: 0; color: var(--dim) }
/* The tag is the outline and the class is the look: a group sits at h3 or at h4 depending on
   whether its contract has one table or two, and it must read the same either way. */
.table { color: var(--dim); font-weight: 600; margin: var(--s10) 0 0 }
.group:target { background: var(--target); box-shadow: 0 0 0 var(--s2) var(--target); border-radius: 2px }
.anchor { color: var(--dim); text-decoration: none; font-size: var(--t6); float: right }
.anchor:hover { color: var(--accent) }
/* The title line of a list item, at whatever tag the outline asks for: a contract's name on the front
   page is a heading because it titles a section, and must not take the standing margin of one. */
.call { display: block; margin: 0 0 var(--s2) }
ul.plain { list-style: none; padding: 0; margin: 0 0 var(--s4) }
ul.plain > li { padding: var(--s3) 0; border-top: 1px solid var(--rule) }

.masthead {
  display: flex; align-items: baseline; gap: var(--s6);
  padding: var(--s3) var(--s6); margin: 0; border-bottom: 1px solid var(--rule);
  position: sticky; top: 0; z-index: 20; background: var(--paper);
}
.wordmark { margin: 0; font-family: var(--mono); font-size: var(--t3); color: var(--ink) }
.wordmark a { color: var(--ink); text-decoration: none }
ul.menu { display: flex; flex-wrap: wrap; gap: var(--s5); list-style: none; padding: 0; margin: 0 0 0 auto; font-size: var(--t5) }
ul.menu a { color: var(--body); text-decoration: none }
ul.menu a:hover { color: var(--accent) }
ul.menu .here { color: var(--dim) }

.shell { display: grid; grid-template-columns: minmax(0, 1fr); max-width: 78rem; margin: 0 auto; width: 100% }
.rail { padding: var(--s6) var(--s6) 0 }
.rail-label {
  margin: 0 0 var(--s2); font-family: var(--mono); font-size: var(--t6);
  letter-spacing: .06em; text-transform: uppercase; color: var(--dim);
}
ul.toc { list-style: none; padding: 0; margin: 0 }
ul.toc > li { padding: var(--s) 0 }
ul.toc a { color: var(--dim); text-decoration: none; font-size: var(--t5) }
ul.toc a:hover { color: var(--ink) }
main { padding: var(--s6) var(--s6) 0; min-width: 0; display: block }

.card { border: 1px solid var(--edge); border-radius: 10px; background: var(--card); padding: var(--s6) }
.address { margin: 0 0 var(--s2); font-size: var(--t5); color: var(--dim) }
/* The mono face names what the registry addresses - a contract, a command, a value - and never a
   sentence. A contract page's title is a function's name; "Nothing is served at this address" is not. */
.card h1 { font-family: var(--mono); font-weight: 500; margin: 0 0 var(--s3) }
pre.install { display: flex; align-items: center; gap: var(--s4); background: var(--paper); max-width: 44ch; font-size: var(--t4) }
pre.install .copy {
  margin-left: auto; border: 0; border-left: 1px solid var(--edge); background: none;
  padding: var(--s2) 0 var(--s2) var(--s4); font: inherit; font-size: var(--t5);
  color: var(--dim); cursor: pointer;
}
pre.install .copy:hover { color: var(--accent) }
pre.answer { margin: var(--s5) 0 0; background: var(--paper); font-size: var(--t4) }
.figures {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr)); gap: var(--s4);
  margin: var(--s5) 0 0; padding-top: var(--s5); border-top: 1px solid var(--rule);
}
.figure { margin: 0; font-size: var(--t5); color: var(--dim) }
.figure strong { display: block; font-family: var(--mono); font-size: var(--t2); font-weight: 500; color: var(--ink) }

ul.chips { display: flex; flex-wrap: wrap; gap: var(--s2); list-style: none; padding: 0; margin: var(--s4) 0 0 }
ul.chips a {
  display: inline-block; font-family: var(--mono); font-size: var(--t6); color: var(--body);
  border: 1px solid var(--edge); border-radius: 1rem; padding: var(--s) var(--s3); text-decoration: none;
}
ul.chips a:hover { border-color: var(--accent); color: var(--ink) }

/* The line the page is read in two halves across. It is heavier than a section rule and takes the
   largest step of the scale above it, because what it separates is not two sections but two ways of
   reading: everything above answers "is this the one", everything below is the binding itself. */
h2.divides { font-size: var(--t2); margin-top: var(--s16); padding-top: var(--s5); border-top-width: 2px; border-top-color: var(--ink) }
ul.toc > li.divides { margin-top: var(--s3); padding-top: var(--s3); border-top: 1px solid var(--rule) }
ul.toc > li.divides a { color: var(--body) }
ul.toc > li.under { padding-left: var(--s3) }

/* One card per job. The grid is the look; what makes these read differently from a case is that they
   carry a sans-serif heading and no address, which is the record's own decision showing through. */
/* The track is wide enough that four cards land two by two rather than three and an orphan, which is
   what 17rem gave at 1240 and is the only thing about this section a browser had to be asked. The
   min() is what keeps one column from overflowing a narrow viewport: auto-fit honours the minimum
   even when the container is smaller than it. No backtick in this comment - the whole stylesheet is
   one template literal, and one would end it. */
.use-cases { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr)); gap: var(--s4); margin: 0 0 var(--s4) }
.use-case { border: 1px solid var(--edge); border-radius: 9px; background: var(--card); padding: var(--s5) }
.use-case h3 { margin: 0 0 var(--s2); font-size: var(--t4) }
.use-case > p { margin: 0 0 var(--s3); font-size: var(--t4) }
.use-case .call {
  margin: 0 0 var(--s3); padding: var(--s3); background: var(--paper);
  border: 1px solid var(--rule); border-radius: 6px;
}
.use-case .call code { color: var(--ink); line-height: 1.55; overflow-wrap: anywhere }
.use-case .why { margin: 0; font-size: var(--t5) }

.cases { margin: 0 }
.case {
  display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s2) var(--s10);
  padding: var(--s5) 0; border-top: 1px solid var(--rule); scroll-margin-top: var(--s16);
}
.case:target { background: var(--target); box-shadow: 0 0 0 var(--s3) var(--target); border-radius: 2px }
.what { min-width: 0 }
.what .call { margin: 0 0 var(--s2) }
.what code { color: var(--ink); line-height: 1.55; overflow-wrap: anywhere }
.case-id { margin: 0; font-size: var(--t6) }
.case-id a { font-family: var(--mono); color: var(--dim); text-decoration: none }
.case-id a:hover { color: var(--accent) }
.argument > p { margin: 0 0 var(--s2); font-size: var(--t4) }
.argument > p:last-child { margin-bottom: 0 }

#playground { display: block; margin: var(--s4) 0 0; padding: var(--s4); background: var(--wash); border: 1px solid var(--edge); border-radius: 8px }
#playground p { margin: 0 0 var(--s3) }
#playground label { display: block; color: var(--dim); font-size: var(--t5); font-family: var(--mono); margin-bottom: var(--s) }
#playground .why { display: block; font-size: var(--t6); margin-top: var(--s) }
#playground input {
  width: 100%; padding: var(--s2) var(--s3); color: var(--ink); background: var(--paper);
  border: 1px solid var(--edge); border-radius: 6px; font-family: var(--mono); font-size: var(--t4);
}
#playground pre { margin: 0; background: var(--paper); border-color: var(--edge) }

@media (min-width: 64rem) {
  .shell { grid-template-columns: 15rem minmax(0, 1fr); gap: var(--s6); padding: 0 var(--s6) }
  .rail { position: sticky; top: var(--s12); align-self: start; padding: var(--s10) 0 0 }
  main { padding: var(--s10) 0 0 }
}
@media (min-width: 52rem) {
  .case { grid-template-columns: minmax(0, 34ch) minmax(0, 1fr) }
}
`.trim()

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
    `<style>${STYLE}</style>`,
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
    a: (element, children) => {
      const href = element.attributes['href']

      return href === undefined ? children : `[${children}](${destination(href)})`
    },
    code: (_, children) => codeSpan(children),
    strong: wraps('**', '**'),
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
