/**
 * The catalogue's own search, answered in somebody's browser.
 * ADR-0137 is why the site runs the registry's matching rule rather than a second one; ADR-0157 is why
 * the reader is handed in rather than reached for.
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
 * The reader is a parameter, and the separation was made for this
 * ---------------------------------------------------------------------------
 *
 * `fetch` was reached for directly until ADR-0157, which made this file exactly as unverifiable as
 * `start.ts`: four exported names, no test importing it, no mutant able to kill anything in it - and
 * unlike `start.ts` it was *reachable* the whole time and simply not reached.
 *
 * ADR-0137 wrote the condition under which the split from `start.ts` would start to pay: *the two are
 * one file's worth of separation that only matters once something else runs a query.* **A guard is
 * that something else.** So the port is the one `packaging/what-npm-holds.ts` already uses - a status
 * and a body and nothing else, because a port handing back a `Response` lets a caller reach for the
 * network again.
 *
 * `ReadOneAnswer` is that module's `ReadOneAddress` written a second time, and the resemblance is
 * named rather than shared. Sharing it means a home neither folder owns - `packages/registry/`, which
 * both already reach - and that is one new module, four files edited in a folder this unit has no
 * business in, for a type of one line. Priced and not taken; what it would cost to leave is one
 * declaration, and what it would cost to take is a refactor decided by whoever most wanted a guard.
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
 * the one failure this whole rule is built to avoid. The three ways of not knowing are separated for
 * that reason: nothing answered, the host answered something else, and the host answered with what is
 * not JSON.
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

/**
 * One address, read.
 *
 * A status and a body and nothing else, for the reason the header gives: everything this module
 * decides it decides from those two.
 */
export type ReadOneAnswer = (at: string) => Promise<{ readonly status: number; readonly body: string }>

/** `fetch`, reduced to the two things this module reads. */
export const overHttp: ReadOneAnswer = async (at) => {
  const answer = await fetch(at)

  return { status: answer.status, body: await answer.text() }
}

/** Both answers the search runs against. */
export type TheCatalogue = {
  readonly index: ServedIndex
  readonly refusals: ServedRefusals
}

const fetched = async <T>(read: ReadOneAnswer, at: string): Promise<T> => {
  let answer: { readonly status: number; readonly body: string }
  try {
    answer = await read(at)
  } catch (thrown: unknown) {
    throw new TheCatalogueCouldNotBeReached(
      at,
      thrown instanceof Error ? thrown.message : 'no answer',
    )
  }

  if (answer.status !== 200) {
    throw new TheCatalogueCouldNotBeReached(at, `the host answered ${answer.status}`)
  }

  try {
    return JSON.parse(answer.body) as T
  } catch {
    throw new TheCatalogueCouldNotBeReached(at, 'the host answered with something that is not JSON')
  }
}

/** Both answers, asked for as often as a reader types and fetched at most once. */
export type TheCatalogueAsItArrives = (where: WhereTheCatalogueIs) => Promise<TheCatalogue>

/**
 * Both answers, fetched once and kept for the life of one page.
 *
 * The promise is held rather than the value, so that a reader typing three characters before the
 * first answer arrives makes one request and not three. A rejected promise is *not* kept: the next
 * keystroke asks again, because the failure a reader meets most is a connection that came back.
 *
 * **The cache is a closure and not a module-level binding**, which is what makes both of those
 * sentences checkable. State living in the module is shared by everything that imports it, so a guard
 * over the second sentence would be reading whatever the guard before it left behind - and the repair
 * for that is a way to reset the cache, which is a door in the product that exists for the tests. One
 * page builds one of these; one guard builds one of these.
 */
export const arrivingOnce = (read: ReadOneAnswer): TheCatalogueAsItArrives => {
  let arriving: Promise<TheCatalogue> | null = null

  return (where) => {
    if (arriving === null) {
      arriving = Promise.all([
        fetched<ServedIndex>(read, where.index),
        fetched<ServedRefusals>(read, where.refusals),
      ])
        .then(([index, refusals]) => ({ index, refusals }))
        .catch((thrown: unknown) => {
          arriving = null
          throw thrown
        })
    }

    return arriving
  }
}

/** What the catalogue answers to what somebody typed. */
export const answering = async (
  arriving: TheCatalogueAsItArrives,
  where: WhereTheCatalogueIs,
  query: string,
): Promise<Search> => {
  const { index, refusals } = await arriving(where)

  return search(index, refusals, query)
}
