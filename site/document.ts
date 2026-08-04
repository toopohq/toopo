/**
 * A page, and the two projections of it that must never disagree.
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
 * So a page is a value, and `toHtml` and `toText` are two projections of it. Reading the page as text
 * stops being a thing somebody remembers to do and becomes something a guard can hold: they are two
 * statements about one tree, and their disagreement is a defect rather than a formatting difference.
 * `every-word-of-the-page-is-in-both-projections` is that guard, and the mutant it exists for is a
 * text projection that quietly drops what the HTML shows - the only defect in this folder that could
 * blind the instrument this unit is measured with.
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

export type Attributes = Readonly<Record<string, string>>

export type Node =
  | { readonly kind: 'text'; readonly text: string }
  | {
      readonly kind: 'element'
      readonly tag: string
      readonly attributes: Attributes
      readonly children: readonly Node[]
    }

/**
 * A whole page: what it is called, what it is about, and what it says.
 *
 * The title and the description are part of the document rather than of the renderer, because both are
 * read *first* - by a search engine, by a tab, by whoever is deciding whether to keep reading - so
 * leaving them out of the text projection would measure the reading order of everything except its
 * opening.
 */
export type Document = {
  readonly title: string
  readonly description: string
  readonly body: readonly Node[]
}

export const text = (value: string): Node => ({ kind: 'text', text: value })

export const el = (tag: string, attributes: Attributes, ...children: readonly Node[]): Node => ({
  kind: 'element',
  tag,
  attributes,
  children,
})

/** The elements that close themselves. Only the ones this site writes. */
const VOID_ELEMENTS = new Set(['meta', 'br', 'hr'])

/**
 * How much white space an element leaves behind it in the text projection.
 *
 * It is a property of the element and not of the renderer, because it is the only thing that carries
 * *structure* into a projection that has thrown the markup away. Without it a heading runs into its
 * paragraph and the reading order is a wall - which would make the measurement this file exists for
 * unreadable, and therefore useless.
 */
const SEPARATOR: Readonly<Record<string, string>> = {
  h1: '\n\n',
  h2: '\n\n',
  h3: '\n\n',
  h4: '\n\n',
  p: '\n\n',
  pre: '\n\n',
  ul: '\n',
  ol: '\n',
  dl: '\n',
  li: '\n',
  dt: '\n',
  dd: '\n',
  section: '\n\n',
  header: '\n\n',
  footer: '\n\n',
  nav: '\n\n',
  table: '\n\n',
  tr: '\n',
}

const escapeText = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const escapeAttribute = (value: string): string => escapeText(value).replaceAll('"', '&quot;')

const renderNode = (node: Node): string => {
  if (node.kind === 'text') return escapeText(node.text)

  const attributes = Object.entries(node.attributes)
    .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
    .join('')

  if (VOID_ELEMENTS.has(node.tag)) return `<${node.tag}${attributes}>`

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

const textOfNode = (node: Node): string => {
  if (node.kind === 'text') return node.text
  if (isChrome(node)) return ''

  return node.children.map(textOfNode).join('') + (SEPARATOR[node.tag] ?? '')
}

/**
 * The stylesheet, which is the whole of what this site loads beyond the page itself.
 *
 * Inline rather than a file, and that is a measurement about the launch rather than a preference:
 * seven pages served once each, where a second request costs a round trip and a cache entry buys
 * nothing until somebody reads a second page. No web font, no image, no script - a contract page that
 * needs JavaScript to be read is a page a crawler and a screen reader read differently from a person,
 * and this project cannot publish the byte cost of every feature and then serve a heavy page.
 *
 * `system-ui` first, so the page is set in whatever the reader's own system uses and downloads
 * nothing. The measure is capped in `ch` rather than pixels because what has to stay readable is a
 * line of prose and a line of code, both of which are counted in characters.
 */
const STYLE = `
:root { --ink: #16161a; --dim: #55555f; --rule: #dcdce4; --wash: #f6f6f9; --link: #1c4fd8 }
@media (prefers-color-scheme: dark) {
  :root { --ink: #e8e8ee; --dim: #a0a0ad; --rule: #33333c; --wash: #1c1c21; --link: #8fb0ff }
}
* { box-sizing: border-box }
body {
  margin: 0 auto; padding: 2.5rem 1.25rem 6rem; max-width: 74ch;
  font: 1rem/1.6 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  color: var(--ink); background: Canvas;
}
h1 { font-size: 1.6rem; margin: 0 0 .25rem; letter-spacing: -.01em }
h2 { font-size: 1.15rem; margin: 2.75rem 0 .75rem; padding-top: .75rem; border-top: 1px solid var(--rule) }
h3, h4 { font-size: 1rem; margin: 2rem 0 .25rem; font-weight: 600 }
/* The tag is the outline and the class is the look: a group sits at h3 or at h4 depending on
   whether its contract has one table or two, and it must read the same either way. */
.table { color: var(--dim); font-weight: 600; margin: 1.75rem 0 .5rem }
.group:target { background: var(--wash); box-shadow: 0 0 0 .5rem var(--wash); border-radius: 3px }
p { margin: 0 0 1rem }
a { color: var(--link) }
code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .875em }
pre {
  margin: 0 0 1rem; padding: .75rem 1rem; overflow-x: auto;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 6px;
}
.lede { font-size: 1.15rem; color: var(--dim); margin: 0 0 1.5rem }
.meta { color: var(--dim); font-size: .875rem }
.cases { margin: 0 }
.cases > div { padding: .85rem 0; border-top: 1px solid var(--rule) }
.cases > div:target { background: var(--wash); box-shadow: 0 0 0 .75rem var(--wash); border-radius: 3px }
.call { display: block; margin-bottom: .3rem }
.why { margin: 0; color: var(--dim) }
.anchor { color: var(--dim); text-decoration: none; font-size: .8rem; float: right }
.anchor:hover { color: var(--link); text-decoration: underline }
ul.plain { list-style: none; padding: 0; margin: 0 0 1rem }
ul.plain > li { padding: .5rem 0; border-top: 1px solid var(--rule) }
`.trim()

export const toHtml = (document: Document): string =>
  [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeText(document.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(document.description)}">`,
    `<style>${STYLE}</style>`,
    '</head>',
    '<body>',
    document.body.map(renderNode).join(''),
    '</body>',
    '</html>',
    '',
  ].join('\n')

/**
 * The same page with the markup thrown away, in document order.
 *
 * Runs of blank lines are collapsed, because an element that separates and contains an element that
 * separates would otherwise leave a gap proportional to the nesting - which is a fact about the tree
 * and not about the reading.
 */
export const toText = (document: Document): string =>
  [document.title, '', document.description, '', ...document.body.map(textOfNode)]
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n'

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
