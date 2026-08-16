/**
 * How the deployment must serve what the build writes, derived from the endpoints and from nothing
 * written here.
 * ADR-0097 is why this exists, why the deployment is closed to robots, and what no guard here reaches.
 *
 * ---------------------------------------------------------------------------
 * What this closes, and the measurement that says it was open
 * ---------------------------------------------------------------------------
 *
 * `cachePolicyFor` has declared since the storage unit that a content-addressed answer may be cached
 * for a year and a named one must be revalidated before every use. Every guard behind it asked whether
 * the function returned the right record; **no guard and no host ever turned one into a header**, so
 * the declaration decided nothing that reached a reader.
 *
 * Measured on the platform this is written for: Cloudflare serves a static asset
 * `public, max-age=0, must-revalidate` by default - which is the named policy exactly. So the default
 * was already right for the twelve named answers and wrong for the thirty-six addressed by content,
 * and those thirty-six are the two endpoints `endpoints.test.ts` singles out as carrying the bulk. The
 * whole of what this file buys is those thirty-six, and it is worth having: a snapshot is 32 to 50 kB
 * over the five, and revalidating one on every request is the cost of a declaration nobody served.
 *
 * ---------------------------------------------------------------------------
 * A rule is an endpoint's own address with the address left open
 * ---------------------------------------------------------------------------
 *
 * `pathTo(endpoint, EVERY_ADDRESS)` is the same function that decides where an answer lives, called
 * with a splat where a real address goes - the shape `pathShapeOf` already takes with `{...}` for a
 * reader. Its three arms give the right pattern for free: an answer about the catalogue ignores the
 * address and matches exactly, one about a contract matches a splat followed by the endpoint's own
 * identifier, and one addressed by content matches that identifier followed by a splat. **No prefix is
 * written here, so a rule cannot describe a path the emission does not write.**
 *
 * Total over `ENDPOINTS`, which is what makes an endpoint added without a cache rule impossible rather
 * than unlikely. `attestations` is emitted by nothing today and carries a rule anyway: the day the
 * closure reaches it, the rule is already right, which is the shape ADR-0055 prefers to one that
 * covers what the data happens to hold.
 *
 * ---------------------------------------------------------------------------
 * The one rule that is not derived, and what keeps it honest
 * ---------------------------------------------------------------------------
 *
 * `NOT_THE_DECLARED_ORIGIN` names a host, and a host is not something this repository can derive: the
 * registry declares `THE_ORIGIN` one floor up, and every other address this tree is reachable at is
 * somebody else's fact. What can be said is why the rule exists - a deployment that is not the declared
 * origin still publishes pages whose canonical links, sitemap and `robots.txt` all name that origin, so
 * a search engine that indexed one would hold an address whose every link answers 403. Indexing does
 * not come back on request.
 *
 * It matches on the host, so it **cannot** apply at the declared origin, and that is the whole reason
 * it is written this way rather than as a flag somebody turns off on the day the domain is connected.
 * A `noindex` left behind is the failure this shape removes.
 *
 * **And no guard here can establish that the pattern matches**, because a host pattern that matches
 * nothing is a file that looks correct and a deployment that is indexable. What settles it is a
 * request against the real deployment, reading the header back - the same measurement that settles
 * whether Cloudflare's splat spans a slash, which nothing in this repository can answer either.
 */

import { ENDPOINTS, pathTo } from '../registry/endpoints.js'
import { cacheControlOf, cachePolicyFor } from '../registry/response.js'

/** One block of the file: a URL pattern, and what a response matching it carries. */
export type HeaderRule = {
  readonly url: string
  readonly headers: readonly (readonly [name: string, value: string])[]
}

/**
 * The splat, where an endpoint's own address goes.
 *
 * Cloudflare allows one per pattern and matches it greedily, which is what a rendered contract address
 * needs: `number/parse@1` is three segments and two of them are a splat's job.
 */
const EVERY_ADDRESS = '*'

/**
 * Any deployment that is not the origin the site declares.
 *
 * The two placeholders are labels rather than names of anything: a Worker answers at
 * `<worker>.<subdomain>.workers.dev` and a version preview at `<prefix>-<worker>.<subdomain>`, so both
 * are two labels in front of `workers.dev`. A placeholder in a host stops at a period, which is what
 * makes this match the deployment and nothing under the declared origin.
 */
const NOT_THE_DECLARED_ORIGIN = `https://:worker.:subdomain.workers.dev/${EVERY_ADDRESS}`

/**
 * Every rule the deployment is given, in the order a reader of the file meets them.
 *
 * The host rule comes first because it is about where the response is being served from rather than
 * about what it is, and a reader who opens this file should meet the reason the deployment is closed
 * before meeting eight lines of arithmetic.
 */
export const theHeaderRules = (): readonly HeaderRule[] => [
  { url: NOT_THE_DECLARED_ORIGIN, headers: [['X-Robots-Tag', 'noindex']] },
  ...ENDPOINTS.map((endpoint) => ({
    url: pathTo(endpoint, EVERY_ADDRESS),
    headers: [['Cache-Control', cacheControlOf(cachePolicyFor(endpoint.addressing))]] as const,
  })),
]

/**
 * The rules as the file the host parses.
 *
 * Two spaces of indent and one blank line between blocks, which is the format the documentation writes
 * and the only thing here that is a transcription of somebody else's syntax. It carries no comment:
 * a generated file explaining itself would be a second statement of what this module's header already
 * says, at the one address where nobody can correct it.
 */
export const renderHeaders = (rules: readonly HeaderRule[]): string =>
  `${rules
    .map(
      ({ url, headers }) =>
        `${url}\n${headers.map(([name, value]) => `  ${name}: ${value}`).join('\n')}`,
    )
    .join('\n\n')}\n`
