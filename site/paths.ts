/**
 * Where a page lives, and the one rule that fixes it: **a page's address is the contract's address.**
 *
 * `packages/registry/address.ts` was written on the promise that the site would make a case identifier a URL
 * anchor - it says so in its own first paragraph - and `renderCase` has sat there unread ever since,
 * rendering `number/parse@1#ordinary-integer`. That string is now literally the URL of a case, which
 * is what turns the freeze of those identifiers from a discipline into a payment.
 *
 * So a contract page is `/number/parse@1/`, a case is `#ordinary-integer` inside it, and neither can
 * move without the address moving. Nothing here invents a slug: a slug would be a second name for a
 * thing that already has one, and the first time the two disagreed a link would break in silence.
 */

import type { ContractAddress } from '../packages/registry/address.js'
import { THE_ORIGIN, renderContract } from '../packages/registry/address.js'

/**
 * Where this site is published, re-exported rather than declared.
 *
 * It used to be declared here, and it moved to `packages/registry/address.ts` the day a second consumer
 * appeared: the licence header of an installed file carries the origin too, and a header is frozen
 * into somebody else's repository for ever. `the-origin-is-declared-once` grew with it — it used to
 * require the literal in this file and now requires it in no file of this folder at all, because the
 * declaration is one floor up and a re-export carries no spelling of its own.
 *
 * It is re-exported rather than imported at each use so that the pages go on naming their own folder's
 * vocabulary: everything about where this site lives is read from here, which is what makes this file
 * the one place to look.
 */
export { THE_ORIGIN }

/** The file a page is written to, relative to the root of the site. */
export const pageOf = (address: ContractAddress): string => `${renderContract(address)}/index.html`

export const REFUSALS_PAGE = 'refused/index.html'

export const CATALOGUE_PAGE = 'index.html'

/**
 * `/method/`, and the word is chosen against two better-looking ones.
 *
 * `/methodology/` is what the endpoint and the need are called, and it is the register of a document
 * nobody reads. `/verification/` names half the page - the half about this project's own tests - and
 * would make the other half, what a reader can check about the registry, look like an appendix.
 */
export const METHOD_PAGE = 'method/index.html'

/**
 * The module every page loads, and the implementation each one loads beside itself.
 *
 * They are paths, so they live here with the others rather than beside the code that strips them:
 * `contract-page.ts` needs the two strings and nothing else, and importing the stripper for them would
 * tie a rendering module to `node:module` to read two constants.
 *
 * `site/start.js` keeps the repository's own folder in the URL on purpose. The graph a browser loads
 * is this repository's modules with their types removed, resolved by the very `.js` specifiers the
 * source already writes - so the site's layout *is* the source's layout, and a reader who opens it
 * sees the file it came from rather than a bundle that corresponds to nothing.
 */
export const THE_ENTRY_POINT = 'site/start.js'

export const THE_REFERENCE_MODULE = 'reference.js'

/**
 * How to climb back to the root from a page.
 *
 * Derived from the path rather than written as `../../`, because the depth is a consequence of an
 * address having two segments and a constant would be wrong the day a domain gains one.
 */
export const rootFrom = (page: string): string => '../'.repeat(page.split('/').length - 1)

/**
 * The href a page is linked by, which is its folder rather than its file.
 *
 * `/number/parse@1/` and not `/number/parse@1/index.html`, because the second is a link that breaks
 * the day the server is configured differently and the first is one every static host already serves.
 */
export const linkTo = (page: string): string => page.replace(/index\.html$/, '')

/**
 * The absolute URL of a page, which is the only spelling of it a crawler is ever given.
 *
 * Built on `linkTo` rather than beside it, so the trailing slash a reader follows and the one a
 * sitemap publishes cannot come apart. **A sitemap URL that differs from the served URL by one
 * character gets a redirect indexed instead of the page**, and the character it always differs by is
 * this one.
 */
export const urlOf = (page: string): string => `${THE_ORIGIN}/${linkTo(page)}`

export const SITEMAP = 'sitemap.xml'

export const ROBOTS = 'robots.txt'
