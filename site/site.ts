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
 */

import type { Document } from './document.js'
import { cataloguePage } from './catalogue-page.js'
import { contractPage } from './contract-page.js'
import { heldByTheRegistry } from './catalogue.js'
import { CATALOGUE_PAGE, REFUSALS_PAGE, pageOf } from './paths.js'
import { refusalsPage } from './refusals-page.js'
import type { RegistrySource } from './source.js'

export const theSite = (source: RegistrySource): ReadonlyMap<string, Document> => {
  const index = source.contractIndex()
  const refusals = source.refusals()

  return new Map<string, Document>([
    [CATALOGUE_PAGE, cataloguePage(index, refusals)],
    ...(refusals.refusals.length === 0
      ? []
      : ([[REFUSALS_PAGE, refusalsPage(index, refusals)]] as const)),
    ...heldByTheRegistry(source).map(
      (held) => [pageOf(held.contract.address), contractPage(held)] as const,
    ),
  ])
}
