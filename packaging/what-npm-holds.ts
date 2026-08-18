/**
 * Which versions of a package npm already holds, asked as a listing.
 * ADR-0111 is why a publication is decided against this rather than against the previous commit.
 *
 * ---------------------------------------------------------------------------
 * Why a listing and not a request
 * ---------------------------------------------------------------------------
 *
 * The question a publication turns on is whether npm *has* a version, and this repository has already
 * paid for asking that badly: a deletion was proved by fetching a page, reading 404 and concluding
 * absence, and the thing was still there. **A request answers about content; only a listing answers
 * about existence.** So what is read is the document holding every version of the package, and the
 * answer is its key set - never `GET /toopo/1.0.3`, which is a request about one address, and never
 * `dist-tags.latest`, which is a *pointer* and would start meaning something else the day a second
 * channel exists.
 *
 * ---------------------------------------------------------------------------
 * What is asked for, and what it costs
 * ---------------------------------------------------------------------------
 *
 * npm serves two documents at one address and the `Accept` header chooses between them. Measured at
 * `d8a25ae` against `registry.npmjs.org`, on this package:
 *
 *     GET /toopo                                       200   18 521 bytes
 *     GET /toopo  with the abbreviated Accept           200    2 597 bytes
 *
 * Both carry `versions` and both carry the same keys, so this is a size choice and not a correctness
 * one - which is why no guard reads the header. The full document additionally carries every published
 * manifest in full, and this asks a question that needs none of them.
 *
 * ---------------------------------------------------------------------------
 * The reader is a parameter, and that is what keeps this out of `against-the-origin/`
 * ---------------------------------------------------------------------------
 *
 * A guard that opens a socket cannot be replayed by a battery and cannot be depended on by another
 * suite's verdicts - which is the whole reason `packaging/against-the-origin/` is a folder of its own.
 * The refusals below are where this module can be wrong, so they are the half that has to be measured,
 * and they are measured by handing it an answer instead of a network. `overHttp` is what is left once
 * that is taken out: two lines with nothing in them to get wrong, and no arm of its own.
 *
 * **It is the second module of this repository that opens a socket, and the guard about that is
 * unaffected.** `the-archive-reaches-the-network-from-exactly-one-module` sweeps what the *archive*
 * carries; `tsconfig.dist.json` compiles only what `packages/cli/published.ts` reaches and `files`
 * ships only `dist`, so nothing here can enter a tarball. The rule that guard states is about a client
 * talking to something nobody decided it should, and this talks to npm from a runner.
 */

/** What npm's own documentation calls the abbreviated packument, and what it saves is measured above. */
const A_LISTING_AND_NOT_EVERY_MANIFEST = 'application/vnd.npm.install-v1+json'

/** The public registry, which is the only one this repository publishes to. */
export const THE_NPM_REGISTRY = 'https://registry.npmjs.org'

/**
 * One address, read.
 *
 * A status and a body and nothing else, because everything this module decides it decides from those
 * two - and a port that handed back a `Response` would let a caller reach for the network again.
 */
export type ReadOneAddress = (url: string) => Promise<{ readonly status: number; readonly body: string }>

/**
 * npm was asked what it holds and the answer was not one.
 *
 * **It never reports what it read**, and the reason is the direction this failure has to fail in: a
 * body printed into a run log is a body published with the repository the day it becomes public, and
 * this one comes from somewhere else. The address and the status are what a person can act on.
 */
export class WhatNpmHoldsCannotBeRead extends Error {
  constructor(url: string, said: string) {
    super(
      `${url} was asked which versions it holds and ${said}. Nothing can be published against an ` +
        `answer nobody got: a publication decided here is a version somebody receives, and a guess ` +
        `at what is already out there is a guess at whether this run would be overwriting one.`,
    )
    this.name = 'WhatNpmHoldsCannotBeRead'
  }
}

/**
 * The first line of whatever was thrown, because a stack trace is not a sentence a refusal can carry.
 *
 * Exported the day a second reader in this folder needed it, and it stays here rather than moving to a
 * module of its own: it says nothing about npm, and one declaration two callers reach is what a shared
 * sentence costs. `what-the-origin-lists.ts` is that caller.
 */
export const theFirstLineOf = (error: unknown): string =>
  error instanceof Error ? (error.message.split('\n')[0] ?? error.name) : String(error)

/** `fetch`, reduced to the two things this module reads. It has no arm, by design; the comment above says why. */
export const overHttp: ReadOneAddress = async (url) => {
  const answer = await fetch(url, { headers: { accept: A_LISTING_AND_NOT_EVERY_MANIFEST } })

  return { status: answer.status, body: await answer.text() }
}

/**
 * Every version npm holds under a name, or the empty set where it holds the name itself.
 *
 * **A 404 is an answer and not a failure**, and it is the one every first publication meets: npm says
 * *no such package* until a package exists. Reading it as *nothing is published* is safe in the one
 * direction that matters - if npm were ever wrong about that, the publication that followed would be
 * refused by npm on the version, which is a red and not a wrong archive.
 *
 * Everything else is refused. A body that is not JSON, a document with no `versions`, a status that is
 * neither 200 nor 404, and a reader that threw are four ways of not knowing, and not knowing is not the
 * same as knowing there is nothing.
 */
export const theVersionsNpmHolds = async (
  packageName: string,
  read: ReadOneAddress,
  origin: string = THE_NPM_REGISTRY,
): Promise<ReadonlySet<string>> => {
  const url = `${origin}/${packageName}`

  let answer: { readonly status: number; readonly body: string }
  try {
    answer = await read(url)
  } catch (error) {
    throw new WhatNpmHoldsCannotBeRead(url, `nothing answered (${theFirstLineOf(error)})`)
  }

  if (answer.status === 404) return new Set()
  if (answer.status !== 200) throw new WhatNpmHoldsCannotBeRead(url, `it answered ${answer.status}`)

  let listing: unknown
  try {
    listing = JSON.parse(answer.body)
  } catch {
    throw new WhatNpmHoldsCannotBeRead(url, `it answered 200 with something that is not JSON`)
  }

  const versions =
    typeof listing === 'object' && listing !== null
      ? (listing as { readonly versions?: unknown }).versions
      : undefined

  if (typeof versions !== 'object' || versions === null) {
    throw new WhatNpmHoldsCannotBeRead(url, `it answered 200 with a document that lists no versions`)
  }

  return new Set(Object.keys(versions))
}
