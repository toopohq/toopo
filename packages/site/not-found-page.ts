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
 * Why every link on it is absolute
 * ---------------------------------------------------------------------------
 *
 * Every other document here climbs to the root with `rootFrom`, because every other document knows its
 * own depth. This one is served at whatever address was mistyped, so it has no depth - a relative link
 * would point somewhere different on every error. That is why the two answers it points at are
 * `pathTo` used raw, where a page would strip the leading slash and prefix its own way up. It is the same reason the head carries no
 * `rel="alternate"`, which is why `Document` now says whether a document has a twin instead of
 * assuming it.
 */

import { endpointOf, pathTo } from '../registry/endpoints.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node => el(tag, attributes, text(value))

/**
 * The one sentence this page exists for, and the four stronger ones that were measured false.
 *
 * **Nothing is served here, and no contract is ever withdrawn** - permanent rule 6, which freezes a
 * published major for life. Those two together say what a 404 means about a contract and, more
 * usefully, what it can never mean: not *this contract was taken down*, because no contract here ever
 * is.
 *
 * It says nothing about what the registry *holds* and nothing about what the catalogue *publishes as
 * questions*, and both omissions were paid for. Each of those sets overspills the served set, on a
 * different side, and each overspill was found by measurement rather than by reading - ADR-0101 carries
 * the two and what refuted them.
 *
 * ---------------------------------------------------------------------------
 * The third one was this page's own conclusion, and its own argument is what refuted it
 * ---------------------------------------------------------------------------
 *
 * It read *what has been served once is served for ever* and, from that, *this page never means that
 * something was taken down.* The reason given is about a **contract major**; the conclusion was about
 * **every address this site has ever served**, which includes the pages the site invented for itself
 * and which nothing freezes. The sentence had generalised past the thing it cited for itself, and
 * saying so is cheaper than discovering it: the site retired ten pages one unit later, and this page
 * would have told every reader arriving from a search that nothing had ever been served there.
 *
 * So the promise is the one its argument supports, and the gate in
 * `packaging/what-the-origin-lists.ts` was narrowed in the same commit rather than lifted - a promise
 * cut back with its guard removed is a declaration nothing keeps.
 *
 * ---------------------------------------------------------------------------
 * And a fourth, one day later, on a reading against the live origin
 * ---------------------------------------------------------------------------
 *
 * The repaired sentence said *a contract*, and the gate refused to retire
 * `/typescript/array/group-by@1/` - the page a contract the catalogue **turned down** had. That
 * address has a contract's grammar and no publication behind it: no digest, no binding, no lockfile in
 * the world holds it. So the word is `published`, and the paragraph below says in as many words what a
 * turned-down contract's address is, because somebody may have bookmarked that one.
 *
 * **Four shrinkings, all four measured and none of them chosen**, which is what makes this a series
 * rather than four concessions: ADR-0101 took the two about what the registry *holds* and what the
 * catalogue *publishes as questions*, and ADR-0188 took the two about which addresses are frozen. Each
 * time the repair was the same - make the sentence match what a mechanism keeps. ADR-0188.
 */
export const notFoundPage = (): Document => ({
  title: 'Nothing is served at this address',
  description:
    'No published contract is ever withdrawn, so the address one stands at is served for life. A ' +
    'page this site writes about itself carries no such promise and may have been retired.',
  servedBesideItsMarkdown: false,
  /** A judgement about an address is not a thing schema.org has a vocabulary for. */
  structuredData: null,
  body: [
    line('h1', 'Nothing is served at this address'),
    line(
      'p',
      'No published contract is ever withdrawn. A contract major is frozen for the life of the ' +
        'catalogue: the address a published contract stands at is served for ever, and an ' +
        'incompatible change becomes a new address beside the old one rather than a replacement of ' +
        'it. So a link to a published contract still leads to that contract.',
    ),
    /**
     * The word that was missing, and the address that found it.
     *
     * A contract the catalogue *considered and turned down* had a page here, at an address with a
     * contract's own shape — and nothing about it was ever frozen. Without `published` the sentence
     * above is false for whoever bookmarked it, and with the word it is exact. ADR-0188.
     */
    line(
      'p',
      'A contract the catalogue considered and turned down was never published, so nothing was ' +
        'frozen at its address and this site does not keep a page for it. It is still in the ' +
        'catalogue this project publishes, with the reason it was refused.',
    ),
    /**
     * The half the old sentence claimed and could not support.
     *
     * It is written as what this site *may* do rather than as what it *has* done, and that is the
     * whole care in it: a page saying *some pages have been retired* is false on the day it is
     * written and true a week later, which is the drift this repository spends its time closing. What
     * a reader needs is which of the two kinds of address they are standing at, and that does not
     * change.
     */
    line(
      'p',
      'The pages this site writes about itself are its own, and it may retire one. If ' +
        'you followed a link to one of those, it is the site that changed and not the catalogue.',
    ),
    el(
      'p',
      NOTHING,
      text('How this catalogue is verified, and what it has refused, are served as data: '),
      el('a', { href: pathTo(endpointOf('methodology')) }, text('the methodology')),
      text(' and '),
      el('a', { href: pathTo(endpointOf('refusals')) }, text('the refusals')),
      text('.'),
    ),
    el('p', NOTHING, el('a', { href: '/' }, text('The catalogue'))),
  ],
})
