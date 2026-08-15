/**
 * Every page there is, and the path each one lives at.
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

import { theMeasurement } from '../mutation/published.js'
import type { Document } from './document.js'
import { toHtml } from './document.js'
import { cataloguePage } from './catalogue-page.js'
import { contractPage } from './contract-page.js'
import { heldByTheRegistry } from './catalogue.js'
import { theCrawlerFiles } from './indexing.js'
import { methodologyPage } from './methodology-page.js'
import { CATALOGUE_PAGE, METHOD_PAGE, REFUSALS_PAGE, pageOf } from './paths.js'
import { refusalsPage } from './refusals-page.js'
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
 */
export const thePublishedTree = (
  pages: ReadonlyMap<string, Document>,
  modules: ReadonlyMap<string, string>,
  answers: ReadonlyMap<string, Buffer>,
): ReadonlyMap<string, string | Buffer> =>
  new Map<string, string | Buffer>([
    ...[...pages].map(([path, page]) => [path, toHtml(page)] as const),
    ...modules,
    ...theCrawlerFilesOf(pages),
    ...answers,
  ])

/**
 * What a crawler reads, derived from what the site *is* rather than listed beside it.
 *
 * It takes the page map instead of the source, and that is the whole of why it lives here: a second
 * function that rebuilt the pages could be given a different source, or a filtered one, and would
 * publish a sitemap of a site nobody serves. Taking the map makes the sitemap a projection of exactly
 * the thing `build.ts` writes, and the two cannot be about different sets.
 */
export const theCrawlerFilesOf = (pages: ReadonlyMap<string, Document>): ReadonlyMap<string, string> =>
  theCrawlerFiles([...pages.keys()])
