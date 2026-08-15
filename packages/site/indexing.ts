/**
 * The two files that exist for a crawler rather than for a reader.
 *
 * ---------------------------------------------------------------------------
 * Small, and without them nothing is indexed
 * ---------------------------------------------------------------------------
 *
 * Neither is a page and neither is read by a person. What they are is the difference between a site
 * that exists and a site that is found, and they fail in the one way that is invisible: nothing is
 * broken, nothing is red, and six weeks later the catalogue is nowhere.
 *
 * ---------------------------------------------------------------------------
 * Derived from the pages, never listed
 * ---------------------------------------------------------------------------
 *
 * The sitemap is built from the page map itself. A hand-written list would be a second statement of
 * what `theSite` already says, and the two failures it would produce are the two this whole file is
 * written against: **a page absent from the sitemap is a page nothing indexes**, and **an entry with
 * no page behind it is a 404 published to a crawler**. Both are silent, and the second is worse,
 * because a search engine that follows a broken URL learns something about the whole site.
 *
 * The URL of a page comes from `urlOf`, which is `linkTo` with the origin in front of it, so the
 * spelling a crawler is given and the spelling a reader follows are one function. Re-spelling the path
 * here - dropping the trailing slash, say - would publish a URL that redirects to the real one, and a
 * redirect is what would get indexed.
 *
 * ---------------------------------------------------------------------------
 * No `lastmod`, and the reason is a rule this repository already has
 * ---------------------------------------------------------------------------
 *
 * The protocol makes it optional, and it is exactly the field that invites a fabricated date. There is
 * no source of a date here that does not depend on the machine the build runs on: `build.ts` is the
 * one module that touches a disk and a file's mtime is a fact about a checkout rather than about a
 * page, and a clock is worse still. **A published file carrying a machine-dependent value is the
 * immutability defect this repository has already found twice**, and a `lastmod` that lies is worse
 * than no `lastmod` at all - a crawler that is told a page changed today re-fetches it, and one that
 * is told it changed a year ago may not come back.
 *
 * So it is omitted. Not deferred, not filled with the epoch: omitted, which is what the protocol is
 * for. The day a published snapshot carries the instant it was published, that is a real and
 * re-derivable date and this decision is worth taking again.
 */

import { ROBOTS, SITEMAP, THE_ORIGIN, urlOf } from './paths.js'

/**
 * The five characters XML reserves, escaped before anything else.
 *
 * No address in this catalogue holds one today - `number/parse@1` is the most exotic thing here, and
 * `@` is legal unescaped in a path segment. It is written anyway for the reason `document.ts` escapes
 * everything: an escape that is applied because the current data needs it is an escape that is
 * forgotten the day the data changes, and here the failure is a sitemap a parser rejects whole.
 */
const escaped = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

/** Every page, at the absolute URL the server answers on, in the order the site declares them. */
export const sitemapOf = (pages: readonly string[]): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map((page) => `  <url><loc>${escaped(urlOf(page))}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n')

/**
 * Everything is readable, and the sitemap is named.
 *
 * A `robots.txt` that blocks indexing is the launch failure that costs nothing to write by accident
 * and everything to find late, so this file says the opposite of it in as few words as it can. There
 * is nothing here to hide: `permanent rule 5` forbids hiding a contract's tests, and this site serves
 * a rendering of the catalogue and its own modules with the types stripped.
 */
export const robotsOf = (): string =>
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${THE_ORIGIN}/${SITEMAP}`, ''].join('\n')

/** The two of them, at the paths a crawler looks for them at, which are fixed by convention. */
export const theCrawlerFiles = (pages: readonly string[]): ReadonlyMap<string, string> =>
  new Map([
    [SITEMAP, sitemapOf(pages)],
    [ROBOTS, robotsOf()],
  ])
