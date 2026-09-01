/**
 * Which addresses the origin still publishes, asked as a listing.
 * ADR-0125 is why an address this tree has served goes on being written, and why the reading is taken
 * before a deployment rather than after one. ADR-0188 is why that is now asked of an address a contract
 * was published at and not of every address: the promise was narrowed to what its own argument covers,
 * and this gate was narrowed with it rather than lifted — twice, the second time on a reading against
 * the live origin.
 *
 * ---------------------------------------------------------------------------
 * The listing is the sitemap, and it is the only listing there is
 * ---------------------------------------------------------------------------
 *
 * `what-npm-holds.ts` states the rule this rests on, and it was bought on a deletion that reported
 * failure: **a request answers about content, only a listing answers about existence.** Applied here it
 * names exactly one document. The origin publishes a `sitemap.xml` derived from the page map itself,
 * and nothing else it serves enumerates anything - every other address answers about itself, so a 404
 * there says what is absent now and never what was present before.
 *
 * **So the population is the pages and not the tree**, and that is a scope rather than an oversight.
 * The named answers, the nine modules and the five files found by convention sit at addresses no
 * sitemap carries. What a reader can have followed from a search is what the sitemap carries, and that
 * is what this promise is about.
 *
 * ---------------------------------------------------------------------------
 * A 404 is refused here and is an answer next door, and the direction is the whole reason
 * ---------------------------------------------------------------------------
 *
 * `theVersionsNpmHolds` reads a 404 as *no such package*, which is safe in the one direction that
 * decides: if it were ever wrong, npm refuses the publication on the version and the run is red.
 *
 * Here the same reading would be safe in the wrong direction. An origin answering 404 for its own
 * sitemap would list nothing, nothing could then be found missing from it, and the deployment that
 * drops every page at once is precisely the one this exists to refuse. **A reading whose failure mode
 * is a green is not a reading.**
 *
 * So only 200 with a document naming something is an answer. Everything else is not knowing, and not
 * knowing is not the same as knowing there is nothing.
 */

import { THE_ORIGIN } from '../packages/registry/address.js'
import { THE_PUBLICATIONS } from '../packages/registry/publication.js'
import { SITEMAP } from '../packages/site/paths.js'
import type { ReadOneAddress } from './what-npm-holds.js'
// The same reduction of a throw to a sentence, imported from the module that wrote it rather than
// copied: it says nothing about npm and a second spelling of it is the copy that drifts.
import { theFirstLineOf } from './what-npm-holds.js'

/**
 * The origin was asked what it lists and the answer was not one.
 *
 * **It never reports the body it read**, on `WhatNpmHoldsCannotBeRead`'s own argument: a body printed
 * into a run log is a body published with this repository the day it becomes public. The address and
 * the status are what a person can act on.
 */
export class WhatTheOriginListsCannotBeRead extends Error {
  constructor(url: string, said: string) {
    super(
      `${url} was asked which addresses it lists and ${said}. Nothing about a lost address is ` +
        `established by an answer nobody got: what this reading refuses is a deployment that stops ` +
        `writing an address already being served, and an unread listing leaves every one of them ` +
        `looking kept.`,
    )
    this.name = 'WhatTheOriginListsCannotBeRead'
  }
}

/**
 * The five characters `indexing.ts` escapes, read back.
 *
 * `&amp;` is undone last or it is undone twice: `&amp;lt;` is a sitemap naming an address that holds
 * the four characters `&lt;`, and unescaping the ampersand first turns it into `<`. It is the exact
 * mirror of `escaped` doing the ampersand first, and neither order is a preference.
 *
 * No address of this catalogue holds one of the five today. This inverts the whole set anyway, for the
 * reason `indexing.ts` escapes the whole set: an escape applied because today's data needs it is one
 * that is forgotten the day the data changes.
 */
const unescaped = (value: string): string =>
  value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&')

/**
 * Every address a sitemap names, or a refusal.
 *
 * **This half is where the module can be wrong, so it is the half that takes a string.** A caller with
 * a document reaches it without a network, which is what lets the guards over it be replayed by a
 * battery - the split `what-npm-holds.ts` made for the same reason, one level finer because both sides
 * of the comparison this serves are documents: the origin's over a wire, this tree's off the disk the
 * deployment is about to upload.
 *
 * A body is refused rather than read leniently. `<urlset` is what makes a document a sitemap, and a
 * sitemap naming nothing is refused for the reason a listing with no versions is: an empty answer and
 * an unreadable one decide opposite things, and they must not arrive as the same value.
 */
export const theAddressesListedIn = (url: string, body: string): ReadonlySet<string> => {
  if (!body.includes('<urlset')) {
    throw new WhatTheOriginListsCannotBeRead(url, 'it answered something that is not a sitemap')
  }

  const listed = [...body.matchAll(/<loc>([^<]*)<\/loc>/g)].map((found) => unescaped(found[1] ?? ''))

  if (listed.length === 0) {
    throw new WhatTheOriginListsCannotBeRead(url, 'it answered a sitemap that names no address')
  }

  return new Set(listed)
}

/** `fetch`, reduced to the two things this module reads, and asking for nothing in particular. */
export const overHttp: ReadOneAddress = async (url) => {
  const answer = await fetch(url)

  return { status: answer.status, body: await answer.text() }
}

/**
 * Every address the origin lists, read from the one address a sitemap is looked for at.
 *
 * The name of that file is a convention and never a choice, so it is imported from the module that
 * writes it rather than spelled here - a second literal is a reading of a document nobody publishes.
 */
export const theAddressesTheOriginLists = async (
  read: ReadOneAddress,
  origin: string = THE_ORIGIN,
): Promise<ReadonlySet<string>> => {
  const url = `${origin}/${SITEMAP}`

  let answer: { readonly status: number; readonly body: string }
  try {
    answer = await read(url)
  } catch (error) {
    throw new WhatTheOriginListsCannotBeRead(url, `nothing answered (${theFirstLineOf(error)})`)
  }

  if (answer.status !== 200) {
    throw new WhatTheOriginListsCannotBeRead(url, `it answered ${answer.status}`)
  }

  return theAddressesListedIn(url, answer.body)
}

/**
 * What a deployment of this tree would stop answering, in the order the origin lists it.
 *
 * **The comparison is one-directional and that is the promise rather than a weakening of it.** An
 * address this tree writes and the origin does not is a page being added, which is every ordinary
 * unit; an address the origin serves and this tree does not write is a reader following a link into
 * a 404 that tells them nothing was ever there. Only the second is a fault, so only the second is
 * looked for.
 */
export const whatWouldStopBeingServed = (
  served: ReadonlySet<string>,
  written: ReadonlySet<string>,
): readonly string[] => [...served].filter((address) => !written.has(address))

/**
 * Of those, the ones no deployment may drop: the addresses a contract was *published* at.
 *
 * ---------------------------------------------------------------------------
 * The promise is the one the 404 argues for, and it argues about published contracts
 * ---------------------------------------------------------------------------
 *
 * `not-found-page.ts` gave its reason in the sentence before its conclusion — *a contract major is
 * frozen for the life of the catalogue* — and then concluded about every address this site has ever
 * served. The justification covers contracts; the conclusion covered the site's own pages too, which
 * nothing freezes. ADR-0188 cut the conclusion back to its own argument.
 *
 * **It was cut back once more the next day, and by a measurement rather than by a reading.** Run
 * against the live origin, this refused `/typescript/array/group-by@1/` — the page a contract the
 * catalogue *turned down* had. That address has the grammar of a contract and no publication behind
 * it: no digest, no binding, no lockfile in the world holds it, and permanent rule 6 says nothing
 * about it. So the classification is what the registry has bound and not what an address looks like.
 *
 * ---------------------------------------------------------------------------
 * A register and never a list, which is the whole of why this is not the inversion refused before
 * ---------------------------------------------------------------------------
 *
 * ADR-0188 refused to key this on what the catalogue holds, because a contract *withdrawn* from the
 * catalogue is exactly the case this exists to refuse — such a reading would go green on the one
 * deployment it is for. That argument is untouched and `THE_PUBLICATIONS` is not that reading.
 *
 * **The catalogue is a list somebody edits; `THE_PUBLICATIONS` is a table a suite rebuilds row by row
 * at each row's own commit.** Measured rather than asserted: removing `number/round@1` does not
 * compile, because its publication constant has one use; removing `string/levenshtein@1`, whose
 * constant three other rows share, compiles and reddens
 * `nothing-this-tree-binds-escapes-the-freeze-check`, which names the contract binding *and* its
 * implementation binding as unanchored. A row cannot leave quietly, so an address cannot stop being
 * protected quietly.
 *
 * ---------------------------------------------------------------------------
 * An address that cannot be read is refused rather than allowed
 * ---------------------------------------------------------------------------
 *
 * A `<loc>` that is not a URL cannot be classified, and the two ways to treat it are not symmetric:
 * allowing it makes a malformed listing a way past this gate, and refusing it makes a malformed
 * listing a red somebody reads. It is the direction this module already chose for a 404 — **a reading
 * whose failure mode is a green is not a reading** — applied one level down, to a single entry
 * instead of the whole document.
 */
export const whatNoDeploymentMayStopServing = (dropped: readonly string[]): readonly string[] =>
  dropped.filter((address) => {
    let path: string
    try {
      path = new URL(address).pathname
    } catch {
      return true
    }

    return THE_PUBLICATIONS[path.replace(/^\/+/, '').replace(/\/+$/, '')] !== undefined
  })
