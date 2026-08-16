/**
 * What a reader is told at an address this site serves nothing at.
 * ADR-0101 is why the sentence says what it says, and which two stronger sentences were measured false.
 *
 * ---------------------------------------------------------------------------
 * It is the fifth file found by convention, and it is not a page
 * ---------------------------------------------------------------------------
 *
 * It has no address of its own, no Markdown twin and no entry in the sitemap, because none of the three
 * would be true: a reader does not navigate here, they arrive by having been wrong. What puts it in the
 * tree is a convention of the host - a top-level `404.html` is how a static host is told that this is
 * not a single-page application - and that is the same thing `robots.txt`, `sitemap.xml`, `llms.txt`
 * and `_headers` are in the tree for.
 *
 * **Measured before it existed**: without it the deployment answered `200` and the front page, byte for
 * byte, at every address holding nothing - including `/typescript/array/group-by@1/contract-binding`,
 * which a client reaches by following the index. `emit.ts` states that a static host answers 404 for a
 * file that is not there *so the absence is the answer*, and that sentence was false for as long as
 * this file did not exist.
 *
 * ---------------------------------------------------------------------------
 * Why the link to the catalogue is absolute
 * ---------------------------------------------------------------------------
 *
 * Every other document here climbs to the root with `rootFrom`, because every other document knows its
 * own depth. This one is served at whatever address was mistyped, so it has no depth - a relative link
 * would point somewhere different on every error. It is the same reason the head carries no
 * `rel="alternate"`, which is why `Document` now says whether a document has a twin instead of
 * assuming it.
 */

import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node => el(tag, attributes, text(value))

/**
 * The one sentence this page exists for, and the two stronger ones that were measured false.
 *
 * **Nothing is served here, and this registry withdraws nothing** - permanent rule 6, which freezes a
 * published version for life. Those two together say what a 404 means and, more usefully, what it can
 * never mean: not *this was taken down*, because nothing here ever is.
 *
 * It says nothing about what the registry *holds* and nothing about what the catalogue *publishes as
 * questions*, and both omissions were paid for. Each of those sets overspills the served set, on a
 * different side, and each overspill was found by measurement rather than by reading - ADR-0101 carries
 * the two and what refuted them.
 */
export const notFoundPage = (): Document => ({
  title: 'Nothing is served at this address',
  description:
    'This registry withdraws nothing, so a 404 here never means that something was taken down. It ' +
    'means nothing has ever been served at this address.',
  servedBesideItsMarkdown: false,
  /** A judgement about an address is not a thing schema.org has a vocabulary for. */
  structuredData: null,
  body: [
    line('h1', 'Nothing is served at this address'),
    line(
      'p',
      'This registry withdraws nothing. A contract major is frozen for the life of the catalogue: ' +
        'what has been served once is served for ever, and an incompatible change becomes a new ' +
        'address beside the old one rather than a replacement of it.',
    ),
    line(
      'p',
      'So this page never means that something was taken down. It means nothing has ever been ' +
        'served at this address.',
    ),
    el('p', NOTHING, el('a', { href: '/' }, text('The catalogue'))),
  ],
})
