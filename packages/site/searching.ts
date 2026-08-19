/**
 * The catalogue's own search, answered in somebody's browser.
 * ADR-0137 is why the site runs the registry's matching rule rather than a second one.
 *
 * ---------------------------------------------------------------------------
 * One rule, two surfaces, and no second implementation
 * ---------------------------------------------------------------------------
 *
 * `packages/registry/search.ts` is the matching rule, and this file is not a version of it - it is a
 * transport. What arrives here is `contract-index` and `refusals`, the same two answers `toopo search`
 * reads, and what runs is the same function against them. The site's port declared for three units
 * that a search here would be *a second implementation of the one the client holds*, and it would
 * have been; what removed that objection is the module moving to the registry rather than anything
 * built here.
 *
 * So a reader typing on this site and a reader typing into their terminal get the same answer by
 * construction, and the day the rule changes they change together. There is nothing to keep in step.
 *
 * ---------------------------------------------------------------------------
 * Where the two answers live is handed over rather than computed
 * ---------------------------------------------------------------------------
 *
 * `pathTo` is the one statement of where an answer lives, and reaching it from here would pull
 * `endpoints.ts` into the browser - with `needs.ts` and `response.ts` behind it - to read two strings.
 * So the page writes them into `data-search`, resolved against its own depth, exactly as a contract
 * page hands over the module its playground runs. The addresses stay derived from `pathTo`; what
 * changes is which side of the wire derives them.
 *
 * ---------------------------------------------------------------------------
 * What arrives is taken as it comes, and the endpoint says why
 * ---------------------------------------------------------------------------
 *
 * Neither answer is checked on arrival, and that is the read API's own declaration rather than an
 * omission here: `contract-index` publishes `whatAReaderCanCheck` as **nothing** - it is the registry
 * saying what it holds, and an index that omitted a contract would be indistinguishable from a
 * catalogue that never had it. `http-source.ts` casts the same two answers for the same reason. What
 * *is* checkable is content-addressed, and neither of these is.
 *
 * A fetch that fails is not an empty catalogue. It throws, and the caller renders the failure rather
 * than an answer, because a search that quietly reported *nothing found* when it had asked nobody is
 * the one failure this whole rule is built to avoid.
 */

import type { ServedIndex, ServedRefusals } from '../registry/response.js'
import type { Search } from '../registry/search.js'
import { search } from '../registry/search.js'

/** What the page hands over in `data-search`, written by `chrome.ts`. */
export type WhereTheCatalogueIs = {
  /** The `contract-index` answer, at an address relative to the page that declared it. */
  readonly index: string
  /** The `refusals` answer, at an address relative to the same page. */
  readonly refusals: string
  /**
   * How to climb back to the root from the page that declared this, so a result can be linked to.
   *
   * A contract's page is its address, so the href of a result is the root plus what `renderContract`
   * renders - which is the rule `paths.ts` states and not a second one invented for a link.
   */
  readonly root: string
  /** Queries this catalogue answers, shown before anybody has typed. */
  readonly examples: readonly string[]
}

export class TheCatalogueCouldNotBeReached extends Error {
  constructor(at: string, why: string) {
    super(`the catalogue at ${at} could not be read: ${why}`)
    this.name = 'TheCatalogueCouldNotBeReached'
  }
}

const fetched = async <T>(at: string): Promise<T> => {
  const response = await fetch(at).catch((thrown: unknown) => {
    throw new TheCatalogueCouldNotBeReached(at, thrown instanceof Error ? thrown.message : 'no answer')
  })

  if (!response.ok) throw new TheCatalogueCouldNotBeReached(at, `the host answered ${response.status}`)

  return (await response.json()) as T
}

type TheCatalogue = {
  readonly index: ServedIndex
  readonly refusals: ServedRefusals
}

/**
 * Both answers, fetched once and kept for the life of the page.
 *
 * The promise is held rather than the value, so that a reader typing three characters before the
 * first answer arrives makes one request and not three. A rejected promise is *not* kept: the next
 * keystroke asks again, because the failure a reader meets most is a connection that came back.
 */
let arriving: Promise<TheCatalogue> | null = null

export const theCatalogue = (where: WhereTheCatalogueIs): Promise<TheCatalogue> => {
  if (arriving === null) {
    arriving = Promise.all([
      fetched<ServedIndex>(where.index),
      fetched<ServedRefusals>(where.refusals),
    ])
      .then(([index, refusals]) => ({ index, refusals }))
      .catch((thrown: unknown) => {
        arriving = null
        throw thrown
      })
  }

  return arriving
}

/** What the catalogue answers to what somebody typed. */
export const answering = async (
  where: WhereTheCatalogueIs,
  query: string,
): Promise<Search> => {
  const { index, refusals } = await theCatalogue(where)

  return search(index, refusals, query)
}
