/**
 * Every page there is, and the path each one lives at.
 * ADR-0090 is why `thePublication` takes a revision and why it is one arrangement rather than two.
 *
 * It is a value rather than a script, so that what the site *is* can be asked in a guard: how many
 * pages, at which addresses, saying what. `build.ts` writes this map to a disk and does nothing else,
 * which is what keeps the disk out of every other file in this folder.
 *
 * The refusals page is here only when something is refused. An empty one would be a heading telling a
 * reader something is missing without telling them what - the rule the contract page already follows
 * about benchmark figures, applied to the page that exists to publish a judgement.
 *
 * ---------------------------------------------------------------------------
 * The method page has two upstreams, and the second one is not the registry
 * ---------------------------------------------------------------------------
 *
 * Every other page here is a rendering of what the port answers. The method page is half that - what a
 * reader can check and what they must believe is `servedMethodology()`, straight through the port -
 * and half something the registry cannot serve at all: `packages/registry/verifiability.ts` says in as many
 * words that *the instrument measures the catalogue and is not part of it*, so no endpoint can carry
 * how this catalogue's own tests are measured.
 *
 * So it comes through `mutation/published.ts`, which is a declared door rather than a reach into
 * another folder: one module, named, deriving what may be published from the batteries themselves.
 * `source.test.ts` holds it to exactly that - no module of this folder may import anything else out of
 * `mutation/` - for the reason the serialisation frontier one paragraph along exists.
 */

import { theMeasurement } from '../../mutation/published.js'
import { emitted } from '../registry/emit.js'
import { localReadApi } from '../registry/local-read-api.js'
import { theReferenceModules } from './browser.js'
import type { Document } from './document.js'
import { toHtml, toMarkdown } from './document.js'
import { cataloguePage } from './catalogue-page.js'
import { contractPage } from './contract-page.js'
import { heldByTheRegistry } from './catalogue.js'
import { theCrawlerFiles } from './indexing.js'
import { localSource } from './local-source.js'
import { methodologyPage } from './methodology-page.js'
import {
  CATALOGUE_PAGE,
  METHOD_PAGE,
  REFUSALS_PAGE,
  THE_HEADERS_FILE,
  THE_NOT_FOUND_FILE,
  markdownOf,
  pageOf,
} from './paths.js'
import { notFoundPage } from './not-found-page.js'
import { refusalsPage } from './refusals-page.js'
import { renderHeaders, theHeaderRules } from './served-headers.js'
import type { RegistrySource } from './source.js'

export const theSite = (source: RegistrySource): ReadonlyMap<string, Document> => {
  const index = source.contractIndex()
  const refusals = source.refusals()

  return new Map<string, Document>([
    [CATALOGUE_PAGE, cataloguePage(index, refusals)],
    [METHOD_PAGE, methodologyPage(source.methodology(), theMeasurement())],
    ...(refusals.refusals.length === 0
      ? []
      : ([[REFUSALS_PAGE, refusalsPage(index, refusals)]] as const)),
    ...heldByTheRegistry(source).map(
      (held) => [pageOf(held.contract.address), contractPage(held)] as const,
    ),
  ])
}

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
  const root = listed.find((page) => page.path === CATALOGUE_PAGE)

  return theCrawlerFiles(listed, root ?? { path: CATALOGUE_PAGE, title: '', description: '' })
}
