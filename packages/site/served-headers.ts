/**
 * How the deployment must serve what the build writes, derived from the endpoints and from nothing
 * written here.
 * ADR-0100 is why the host rule names two shapes of another mechanism.
 * ADR-0097 is why this exists, why the deployment is closed to robots, and what no guard here reaches.
 * ADR-0170 is why there are two families rather than one, why a space is the first segment of an
 * address, and what the origin answered when it was asked how a splat matches.
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
 * And the second declaration nobody served, which is what an answer *is*
 * ---------------------------------------------------------------------------
 *
 * `contentTypeOf` has said since the read API was designed that a blob travels as its own octets and
 * every other answer as JSON. Nothing turned it into a header either. Measured against the declared
 * origin at `501e32a`, on one address of each class: **every answer of the read API arrived as
 * `application/octet-stream` and none of them compressed**, where the pages, the modules and
 * `llms.txt` all arrived `Content-Encoding: br`. An answer with no extension is a file a host has no
 * opinion about, and the opinion this repository holds was in a function no deployment read.
 *
 * The whole of what this second family buys is the twenty answers that are documents - 210 409 B
 * against 42 488 B in brotli over the five, measured on the emitted tree. The thirty blobs stay
 * `application/octet-stream`, which is not an omission: it is `contentTypeOf`'s own arm for the one
 * endpoint that serves bytes rather than a document about them.
 *
 * **What this cannot establish is that a declared type is compressed**, which is a fact about
 * somebody else's software and is settled by a request against the real deployment - the same limit
 * the host rule below carries, for the same reason. The reading is below, beside the one that settled
 * the host rule.
 *
 * **The argument for it lives here and not in a record, which is the rule rather than an omission.**
 * A record exists for what will not fit beside the line, and the whole of why this header exists is
 * why a function nobody read decided nothing - that argument is these four paragraphs. ADR-0137
 * records only that the open entry closed with that unit, because a search is what made the
 * uncompressed document worth the trip.
 *
 * ---------------------------------------------------------------------------
 * Two families, because two different questions decide the two headers
 * ---------------------------------------------------------------------------
 *
 * **What an answer is** is a fact about an endpoint: `contentTypeOf` reads `serves`, and the pattern
 * is `pathTo(endpoint, EVERY_ADDRESS)` - the same function that decides where an answer lives, called
 * with a splat where a real address goes, the shape `pathShapeOf` already takes with `{...}` for a
 * reader. Its three arms give the right pattern for free: an answer about the catalogue ignores the
 * address and matches exactly, one about a contract matches a splat followed by the endpoint's own
 * identifier, and one addressed by content matches that identifier followed by a splat. **No prefix is
 * written here, so a rule cannot describe a path the emission does not write.** Total over `ENDPOINTS`,
 * which is what makes an endpoint added without a rule impossible rather than unlikely.
 *
 * **How long it may be held** is not a fact about an endpoint at all, and that is what this file got
 * wrong for its whole life. A page, a Markdown twin, a browser module and `robots.txt` are answers no
 * endpoint names, and every one of them is addressed by a *name*: the content moves at every
 * deployment and the address does not. So the second family is one rule per **space** - the first
 * segment of an address - with `cachePolicyFor` reading the class that space is addressed by.
 *
 * A first segment is a total function of a path, so **two rules of that family cannot match one
 * address**. That is the property the whole file rests on, and it is disjointness by construction
 * rather than by vigilance.
 *
 * ---------------------------------------------------------------------------
 * Why the two families may not both carry `Cache-Control`, which is a fact about the host
 * ---------------------------------------------------------------------------
 *
 * Cloudflare's documentation for this file says two things that together forbid the obvious shape:
 * *"An incoming request which matches multiple rules' URL patterns will inherit all rules' headers"*
 * and *"If a header is applied twice in the `_headers` file, the values are joined with a comma
 * separator"*. **Two matching rules do not settle a header between them; they add up**, and no order
 * within the file is specified.
 *
 * So agreeing on the value is not enough. The rule for the `typescript` space and the rule for a
 * contract's binding - a splat between two slashes, spelled here as prose because a block comment
 * cannot hold it - both match that binding, and both would say
 * `public, max-age=0, must-revalidate`; what the host would send
 * is that string twice, joined - a `Cache-Control` carrying `max-age` two times, which RFC 9111 leaves
 * a cache free to read either way. **The defect would be invisible to anybody reading this file**,
 * because each rule is right on its own.
 *
 * That is also what refuses the two shapes that look cheaper. A catch-all `/*` carrying the named
 * policy collides with `/snapshot/*` on the one policy this file exists to buy. And the `! ` prefix
 * that detaches *"a header which has been added by a more pervasive rule"* would answer it, except
 * that *more pervasive* is not *earlier* and the documentation specifies no order - so it would rest
 * on something nobody here can measure.
 *
 * The way out is that the two families carry **different header names**: an endpoint's rule says what
 * its answers are, a space's rule says how long they may be held, and no address is ever told either
 * thing twice. `every-address-is-told-each-thing-once` is what keeps that true.
 *
 * ---------------------------------------------------------------------------
 * The rules come from the declarations and never from the tree, and the guard is why
 * ---------------------------------------------------------------------------
 *
 * `_headers` is written into the tree it describes, so a derivation reading the finished tree would be
 * circular. It would also be worse than circular: a coverage guard over rules derived from the tree
 * **could not fail**, being the derivation compared with itself, which is ADR-0087's rule arriving on
 * a whole file. So every space here is read off a declaration - the pages this site has of its own,
 * the files found by convention, the browser graph, `Language`, and `ENDPOINTS` - and
 * `every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose` is a real comparison
 * between what is declared here and what the emission writes.
 *
 * `attestations` is emitted by nothing today and carries a rule anyway: the day the closure reaches
 * it, the rule is already right, which is the shape ADR-0055 prefers to one that covers what the data
 * happens to hold. `REFUSALS_PAGE` is declared on the same argument one folder over.
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
 * request against the real deployment, reading the header back.
 *
 * ---------------------------------------------------------------------------
 * How a splat matches, measured at last, because a family of rules now rests on it
 * ---------------------------------------------------------------------------
 *
 * This file used to say that whether a splat spans a slash was a question nothing here could answer.
 * It is answered, by the origin rather than by a reading of the documentation, and both halves were
 * needed before the second family could be written.
 *
 * **A splat spans a slash.** Measured at `7e3f64a`: `/typescript/number/parse@1/contract-binding`
 * arrives `Content-Type: application/json`, which only `/*` + `/contract-binding` can produce - three
 * segments stand where the splat is - while the front page arrives `text/html` from the host's own
 * guess, no rule covering it. The documentation agrees and separates the two spellings: a splat
 * *"will greedily match all characters"*, where a placeholder *"match[es] all characters apart from
 * the delimiter"*.
 *
 * **A splat also takes an empty remainder**, which is what lets one rule cover a space and the page at
 * its root. `/blob/` and `/snapshot/` answer 404 and carry `application/octet-stream` and
 * `application/json`; the control is `/typescript/` and `/packages/site/`, which answer 404 carrying
 * the 404 page's own `text/html`. So `/catalogue/*` covers `/catalogue/`, and **an exact rule written
 * beside it would be the doubling above rather than a belt and braces.**
 *
 * The same reading says a rule reaches a 404's `Content-Type` and not its `Cache-Control`: every
 * address nothing is served at answers `no-store` whatever this file declares, which is what ADR-0101
 * wants and is therefore recorded rather than fought.
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

import type { Language } from '../registry/address.js'
import { ENDPOINTS, contentTypeOf, pathTo } from '../registry/endpoints.js'
import type { AddressingClass } from '../registry/response.js'
import { cacheControlOf, cachePolicyFor } from '../registry/response.js'
import { THE_BROWSER_GRAPH } from './browser.js'
import { THE_FONT_ADDRESS } from './font.js'
import {
  THE_FILES_FOUND_BY_CONVENTION,
  THE_PAGES_THE_SITE_HAS_OF_ITS_OWN,
  linkTo,
  markdownOf,
} from './paths.js'

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
 * The space an address is in, which is its first segment and nothing else.
 */
const theSpaceOf = (address: string): string => address.split('/')[0]

/**
 * The rule that covers a space, written from any address in it.
 *
 * An address with no segment above it is its own space and takes an exact rule; anything deeper takes
 * its first segment and a splat. The front page is the case that makes this worth a function: its
 * address is `index.html` and a reader asks for `/`, so the rule is written from `linkTo` and not from
 * the file.
 */
const theRuleCovering = (address: string): string =>
  address.includes('/') ? `/${theSpaceOf(address)}/${EVERY_ADDRESS}` : `/${address}`

/**
 * Where a language's contracts live: the first segment `renderContract` gives every address of one.
 *
 * Total over `Language` by the compiler, which is the only way to enumerate a union at runtime and is
 * what makes a second language unable to compile until somebody has said which space its pages, its
 * answers and its reference modules are held under. **That the space is spelled like the language is
 * `renderContract`'s arrangement rather than a law** - nothing here would notice if that function put
 * something else first, and the guard over the emitted tree would.
 */
const THE_SPACE_A_LANGUAGE_LIVES_IN: Readonly<Record<Language, string>> = {
  typescript: 'typescript',
}

/**
 * Every space the emission writes, with the class the addresses in it are addressed by.
 *
 * Read off the declarations and never off the tree, for the two reasons the header gives: `_headers`
 * is written into the tree it describes, and a coverage guard over rules derived from that tree could
 * not fail.
 *
 * The browser graph is read as it is declared, in `.ts`, because a space is the first segment and an
 * extension is not one - the emission swapping the extension cannot move a module out of `packages/`.
 */
const theSpacesTheEmissionWrites = (): ReadonlyMap<string, AddressingClass> => {
  const named = (address: string): readonly [string, AddressingClass] => [
    theRuleCovering(linkTo(address)),
    'named',
  ]

  return new Map<string, AddressingClass>([
    ...THE_PAGES_THE_SITE_HAS_OF_ITS_OWN.flatMap((page) => [named(page), named(markdownOf(page))]),
    ...THE_FILES_FOUND_BY_CONVENTION.map(named),
    ...THE_BROWSER_GRAPH.map(named),
    /**
     * The face, which is the only thing this site serves that is addressed by its own digest.
     *
     * It is written as the space rather than as the file for the reason `theRuleCovering` encodes: an
     * address with a segment above it takes a splat, so the day the face is replaced - which moves its
     * digest, which moves its address - the rule that covers it does not move at all. `font.ts` carries
     * why a font is `content-addressed` and what that buys a returning reader.
     */
    [theRuleCovering(THE_FONT_ADDRESS), 'content-addressed'],
    ...Object.values(THE_SPACE_A_LANGUAGE_LIVES_IN).map((space) => named(`${space}/`)),
    ...ENDPOINTS.flatMap((endpoint) => {
      const address = pathTo(endpoint, EVERY_ADDRESS).slice(1)

      // A splat standing where the space would be says the address decides it, so the endpoint owns no
      // space: those answers live in the space of the contract they are about, which the language
      // above already covers.
      return theSpaceOf(address) === EVERY_ADDRESS
        ? []
        : [[theRuleCovering(address), endpoint.addressing] as const]
    }),
  ])
}

/** What an answer is, at the address that names it. Total over `ENDPOINTS`. */
const whatAnAnswerIs = (): readonly HeaderRule[] =>
  ENDPOINTS.map((endpoint) => ({
    url: pathTo(endpoint, EVERY_ADDRESS),
    headers: [['Content-Type', contentTypeOf(endpoint)]] as const,
  }))

/** How long an answer may be held, one rule per space. Total over what the emission writes. */
const howLongItMayBeHeld = (): readonly HeaderRule[] =>
  [...theSpacesTheEmissionWrites()].map(([url, addressing]) => ({
    url,
    headers: [['Cache-Control', cacheControlOf(cachePolicyFor(addressing))]] as const,
  }))

/**
 * One block per pattern, so a reader of `_headers` meets each address once.
 *
 * The two families overlap on the spaces the endpoints own - `/snapshot/*` is where the bytes are and
 * how long they may be held - and writing the pattern twice would be correct and unreadable. Nothing
 * here removes a collision: two rules setting one header name are still two values joined by the host,
 * and it is disjointness that prevents that, not this.
 */
const merged = (rules: readonly HeaderRule[]): readonly HeaderRule[] => {
  const byUrl = new Map<string, HeaderRule>()

  for (const rule of rules) {
    const held = byUrl.get(rule.url)

    byUrl.set(
      rule.url,
      held === undefined ? rule : { url: rule.url, headers: [...held.headers, ...rule.headers] },
    )
  }

  return [...byUrl.values()]
}

/**
 * Whether a rule is about a path rather than about the host a response is served from.
 *
 * The two kinds are told apart by the scheme, which is the only thing a host pattern carries that a
 * path pattern cannot. It is exported because both files that ask questions of this one have to make
 * the split, and a second spelling of it in either would be a second statement of what a host rule is.
 */
export const isAboutAPath = (rule: HeaderRule): boolean => !rule.url.includes('://')

/**
 * Whether a rule about a path covers an address, by the two things the origin was asked.
 *
 * **It is a re-implementation of somebody else's matcher and it is one on purpose**, where the guard
 * it serves used to state a necessary condition instead. What made that trade acceptable is that both
 * halves of the semantics are now measured against the real deployment rather than read off a page:
 * a splat spans a slash, and a splat takes an empty remainder. The header carries both readings.
 *
 * It is exported because three guards ask this question and a second spelling of it would be a second
 * opinion about a host, which is exactly the thing none of them is entitled to have.
 */
export const covers = (rule: string, path: string): boolean => {
  const [before, ...rest] = rule.split(EVERY_ADDRESS)
  if (rest.length === 0) return path === before

  const after = rest.join(EVERY_ADDRESS)

  return (
    path.length >= before.length + after.length && path.startsWith(before) && path.endsWith(after)
  )
}

/**
 * Every rule the deployment is given, in the order a reader of the file meets them.
 *
 * The host rule comes first because it is about where the response is being served from rather than
 * about what it is, and a reader who opens this file should meet the reason the deployment is closed
 * before meeting the arithmetic. What an answer *is* comes before how long it may be held, because
 * the first is a property of the answer and the second is a consequence of how it is addressed.
 */
export const theHeaderRules = (): readonly HeaderRule[] =>
  merged([
    ...NOT_THE_DECLARED_ORIGIN.map((url) => ({
      url,
      headers: [['X-Robots-Tag', 'noindex']] as const,
    })),
    ...whatAnAnswerIs(),
    ...howLongItMayBeHeld(),
  ])

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
