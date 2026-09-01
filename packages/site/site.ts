/**
 * Every page there is, and the path each one lives at.
 * ADR-0090 is why `thePublication` takes a revision and why it is one arrangement rather than two.
 *
 * It is a value rather than a script, so that what the site *is* can be asked in a guard: how many
 * pages, at which addresses, saying what. `build.ts` writes this map to a disk and does nothing else,
 * which is what keeps the disk out of every other file in this folder.
 *
 * ---------------------------------------------------------------------------
 * Every page here is a rendering of what the port answers, and that is new
 * ---------------------------------------------------------------------------
 *
 * This folder used to hold one exception. The method page's upstream was half the port and half
 * something no endpoint can carry - `packages/registry/verifiability.ts` says in as many words that
 * *the instrument measures the catalogue and is not part of it* - so `theSite` reached
 * `mutation/published.ts` for it, and the front page's own figures came through the same door.
 *
 * **Both readers went with the pages, so the door is shut.** ADR-0189 leaves the site with a shelf
 * and a contract page, and neither states a figure about this repository's own tests. What was a
 * declared exception is now no exception at all, and `nothing-of-the-instrument-reaches-this-folder`
 * says so without an exemption for the one module that used to be allowed - which is a stronger claim
 * than the one it replaces, on a population that did not shrink.
 */

import { emitted } from '../registry/emit.js'
import { localReadApi } from '../registry/local-read-api.js'
import { theReferenceModules } from './browser.js'
import type { Document } from './document.js'
import { el, toHtml, toMarkdown } from './document.js'
import { frontPage } from './front-page.js'
import { theMenu } from './chrome.js'
import { contractPage } from './contract-page.js'
import { domainsOf, heldByTheRegistry } from './catalogue.js'
import { THE_FONT_ADDRESS, THE_FONT_BYTES } from './font.js'
import { theCrawlerFiles } from './indexing.js'
import { localSource } from './local-source.js'
import {
  FRONT_PAGE,
  THE_ENTRY_POINT,
  THE_HEADERS_FILE,
  THE_NOT_FOUND_FILE,
  markdownOf,
  pageOf,
  rootFrom,
} from './paths.js'
import { notFoundPage } from './not-found-page.js'
import { renderHeaders, theHeaderRules } from './served-headers.js'
import type { RegistrySource } from './source.js'

export const theSite = (source: RegistrySource): ReadonlyMap<string, Document> => {
  const index = source.contractIndex()

  /**
   * The masthead's destinations, decided once here because this is the one place that knows which
   * pages exist.
   */
  const menu = theMenu()

  /**
   * The domains, built once and given to every page that renders navigation.
   *
   * A contract page's column names its siblings and the other domains, so it needs the whole set -
   * and building it per page would be the walk over the index taken eight times to answer one
   * question. It is the same argument `theMenu` above is built on, one level down.
   */
  const domains = domainsOf(source, heldByTheRegistry(source))

  const pages = new Map<string, Document>([
    [FRONT_PAGE, frontPage(index, domains, menu)],
    /**
     * Walked through the domains rather than over the contracts, so that the domain a contract page
     * renders its column from is the one it is in by construction. The order is unchanged: both
     * lists are the index's order, and grouping one by the other's first segment preserves it.
     */
    ...domains.flatMap((domain) =>
      domain.held.map(
        (one) => [pageOf(one.contract.address), contractPage(one, domain, menu)] as const,
      ),
    ),
  ])

  return new Map([...pages].map(([at, page]) => [at, running(at, page)]))
}

/**
 * One page with the module every page runs appended to it.
 *
 * **Here rather than in each page's own builder**, for the reason the menu is decided here: this is
 * the one place that knows what the set of pages is, and seven builders each remembering to append a
 * script is seven places for the eighth to forget. It used to be one - a contract page appended it
 * because a contract page was the only one with anything to run - and the masthead gaining a field
 * made it every page at once.
 *
 * **The 404 is not among them and must not be.** It is rendered outside this map, and the reason is
 * the one `servedBesideItsMarkdown` already carries: that document is served at whatever address a
 * reader mistyped, so a relative `src` on it resolves somewhere different on every error. A search
 * field there would be a control pointing at an address that does not exist.
 *
 * The node carries attributes and no children, which is what keeps `document.ts`'s rule that no node
 * of this document holds raw markup true with a script on the page. Both projections see an element
 * with nothing in it, which is exactly what it is.
 */
const running = (own: string, page: Document): Document => ({
  ...page,
  body: [
    ...page.body,
    el('script', { type: 'module', src: `${rootFrom(own)}${THE_ENTRY_POINT}` }),
  ],
})

/**
 * Everything that is deployed, by the path it is deployed at: the pages as they are served, the
 * modules a browser loads, what a crawler reads, and every answer the registry can be asked for.
 *
 * **One statement of what the tree is**, so that the guard over it and the build cannot be looking at
 * two different sets - the argument `theCrawlerFilesOf` already makes about taking the page map. It
 * takes what it composes rather than building it: the modules are read off a disk and the answers come
 * from the registry's own emission, and a rendering module has no business reaching for either.
 *
 * The pages and the answers share a folder on purpose. `/typescript/number/parse@1/` is the page and
 * every answer about that contract is a leaf beside it, which is what lets a reader open by hand the
 * exact URL a client asked - and it is what makes *no path is both a file and a directory* a question
 * about this map rather than about two trees nobody compares.
 *
 * **`_headers` is in here rather than beside the deployment, and the reason is `build.ts`**: it wipes
 * its output folder and writes this map, so a file left next to the tree by hand would be deleted on
 * the first build or, worse, survive as a second statement of a policy that had moved. What tells the
 * host how to serve the tree is part of the tree.
 *
 * **The face is here for the same reason and it is the one entry that is not text.** The map has
 * carried `string | Buffer` since the answers arrived, so nothing about the type changed; what did is
 * that a reader of this list can no longer assume every value is something they could open. It is a
 * single entry rather than a set because there is one face - ADR-0176 puts Geist on the prose and
 * leaves the monospace to the system stack, so a second face is a decision and not an addition.
 */
export const thePublishedTree = (
  pages: ReadonlyMap<string, Document>,
  modules: ReadonlyMap<string, string>,
  answers: ReadonlyMap<string, Buffer>,
): ReadonlyMap<string, string | Buffer> =>
  new Map<string, string | Buffer>([
    ...[...pages].map(([path, page]) => [path, toHtml(page)] as const),
    ...[...pages].map(([path, page]) => [markdownOf(path), toMarkdown(page)] as const),
    ...modules,
    ...theCrawlerFilesOf(pages),
    [THE_HEADERS_FILE, renderHeaders(theHeaderRules())],
    [THE_NOT_FOUND_FILE, toHtml(notFoundPage())],
    [THE_FONT_ADDRESS, THE_FONT_BYTES],
    ...answers,
  ])

/**
 * Everything a deployment holds, composed once, from one revision.
 *
 * **It exists because the composition was written twice and one of the copies decided a supply chain.**
 * `build.ts` built the pages, the reference modules and the answers, and `published-tree.test.ts` built
 * them again to ask a question about paths - two statements of one arrangement, which is the shape this
 * repository refuses everywhere else. It became load-bearing when a named answer started carrying the
 * revision it was served from: the two stand-ins take a revision and default it to the unpublished one,
 * so a `localReadApi()` written here and not there would publish a whole site of answers claiming to
 * come from a tree of forty zeros, and every guard would stay green.
 *
 * So there is one arrangement, `servedFrom` is a parameter of it with no default, and the omission
 * cannot be written down. The browser modules are supplied rather than read, because reading this
 * repository's own files off a disk is `build.ts`'s single exception and a composition has no business
 * reopening it.
 */
export const thePublication = (
  servedFrom: string,
  browserModules: ReadonlyMap<string, string>,
): ReadonlyMap<string, string | Buffer> => {
  const source = localSource(servedFrom)
  const modules = new Map<string, string>([
    ...browserModules,
    ...theReferenceModules(source, heldByTheRegistry(source)),
  ])

  return thePublishedTree(theSite(source), modules, emitted(localReadApi(servedFrom)))
}

/**
 * What a crawler reads, derived from what the site *is* rather than listed beside it.
 *
 * It takes the page map instead of the source, and that is the whole of why it lives here: a second
 * function that rebuilt the pages could be given a different source, or a filtered one, and would
 * publish a sitemap of a site nobody serves. Taking the map makes the sitemap a projection of exactly
 * the thing `build.ts` writes, and the two cannot be about different sets.
 */
export const theCrawlerFilesOf = (pages: ReadonlyMap<string, Document>): ReadonlyMap<string, string> => {
  const listed = [...pages].map(([path, page]) => ({
    path,
    title: page.title,
    description: page.description,
  }))

  /**
   * The front page is the root of the index a retriever reads, and it is looked up rather than
   * composed: what this site *is* is already written once, as the sentence a reader meets first, and a
   * second statement of it here would be the copy that goes stale.
   * `the-index-a-retriever-reads-opens-on-the-front-pages-own-words` is what says the lookup found it.
   */
  const root = listed.find((page) => page.path === FRONT_PAGE)

  return theCrawlerFiles(listed, root ?? { path: FRONT_PAGE, title: '', description: '' })
}
