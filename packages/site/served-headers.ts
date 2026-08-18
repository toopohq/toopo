/**
 * How the deployment must serve what the build writes, derived from the endpoints and from nothing
 * written here.
 * ADR-0100 is why the host rule names two shapes of another mechanism.
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
 * origin serves the same catalogue at a second address, under pages whose canonical links, sitemap and
 * `robots.txt` all name the first. A search engine that indexed it would hold this catalogue twice,
 * once at an address nothing here publishes, and indexing does not come back on request.
 *
 * **The harm changed when the domain was connected and the rule did not.** While the declared origin
 * answered 403, indexing the temporary address bought a set of dead links; now it buys a duplicate of
 * a live site. The second is the milder failure and it is the one that lasts, because dead links get
 * dropped and a duplicate competes.
 *
 * It matches on the host, so it **cannot** apply at the declared origin, and that is the whole reason
 * it is written this way rather than as a flag somebody turns off on the day the domain is connected.
 * A `noindex` left behind is the failure this shape removes.
 *
 * **And no guard here can establish that the pattern matches**, because a host pattern that matches
 * nothing is a file that looks correct and a deployment that is indexable. What settles it is a
 * request against the real deployment, reading the header back - the same measurement that settles
 * whether Cloudflare's splat spans a slash, which nothing in this repository can answer either.
 *
 * That request has been made for one of the two shapes. Measured at `27d1dbb`, on one address of each
 * class the tree writes: `toopo.pages.dev` answers `X-Robots-Tag: noindex` and `toopo.dev` answers no
 * such header, **read in one sweep because either half alone proves nothing** - an absent header at the
 * origin is equally what a rule matching nothing produces. The two-label shape has no live instance to
 * ask, so whether that pattern matches is unmeasured and stays so; ADR-0103 carries both.
 *
 * ---------------------------------------------------------------------------
 * A trap this file escapes by the shape of a splat and not by intention
 * ---------------------------------------------------------------------------
 *
 * Measured on a throwaway deployment of Workers static assets, the mechanism ADR-0100 refused: it
 * answers a path carrying `@` with a redirect to the percent-encoded form, and **a rule whose pattern
 * spells `@` applies to the redirect and not to its destination** - so the address that serves the
 * bytes falls through to whatever the platform sends. On that mechanism an address loses its address
 * and its headers together. Pages, which is what serves this tree, answers `@` directly - measured at
 * `27d1dbb` over every contract address - so the trap is not armed here today and the shape below is
 * what would keep it disarmed on a host that armed it again.
 *
 * Every rule here is `pathTo(endpoint, EVERY_ADDRESS)`, and none of the three arms puts a rendered
 * address in a pattern: the splat stands where `number/parse@1` would go, and it covers both spellings.
 * **So this file escapes the trap by the shape of the splat and not by intention, and nothing protects
 * it the day somebody writes a rule that names an address.** That is recorded here rather than guarded,
 * because the guard would have to know what a host normalises, which is a fact about somebody else's
 * software; ADR-0099 carries the measurement.
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
 * Every deployment that is not the origin the site declares.
 *
 * **Two patterns and not one, because the host answers at two shapes.** A production deployment is
 * `<project>.pages.dev` - one label - and a preview is `<branch-or-hash>.<project>.pages.dev` - two.
 * A placeholder in a host stops at a period, so one pattern cannot cover both, and the shape left out
 * is the one that stays indexable. Preview deployments are exactly the ones nobody looks at.
 *
 * Neither can match at the declared origin, which is not under `pages.dev`, and that is why this is
 * written as a host rule rather than as a setting somebody turns off on the day the domain is
 * connected: it retires itself.
 */
const NOT_THE_DECLARED_ORIGIN: readonly string[] = [
  `https://:project.pages.dev/${EVERY_ADDRESS}`,
  `https://:version.:project.pages.dev/${EVERY_ADDRESS}`,
]

/**
 * Every rule the deployment is given, in the order a reader of the file meets them.
 *
 * The host rule comes first because it is about where the response is being served from rather than
 * about what it is, and a reader who opens this file should meet the reason the deployment is closed
 * before meeting eight lines of arithmetic.
 */
export const theHeaderRules = (): readonly HeaderRule[] => [
  ...NOT_THE_DECLARED_ORIGIN.map((url) => ({
    url,
    headers: [['X-Robots-Tag', 'noindex']] as const,
  })),
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
