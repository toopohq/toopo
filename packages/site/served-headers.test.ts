import { describe, it, expect } from 'vitest'

import { ENDPOINTS, askedAt, pathTo } from '../registry/endpoints.js'
import { THE_ORIGIN } from './paths.js'
import type { HeaderRule } from './served-headers.js'
import { isAboutAPath, renderHeaders, theHeaderRules } from './served-headers.js'

/** The rules that are about a host rather than about a path, which is how the file spells the two. */
const aboutAHost = (): readonly HeaderRule[] => theHeaderRules().filter((rule) => !isAboutAPath(rule))

const aboutAPath = (): readonly HeaderRule[] => theHeaderRules().filter(isAboutAPath)

const valueOf = (rule: HeaderRule, name: string): string | null =>
  rule.headers.find(([carried]) => carried === name)?.[1] ?? null

/**
 * The rules that say what an answer is, which is the family an endpoint owns.
 *
 * Told apart by what a rule carries rather than by which function wrote it, for the reason
 * `published-tree.test.ts` gives beside its own copy of this question: the file is merged into one
 * block per pattern before anybody reads it.
 */
const whatAnAnswerIs = (): readonly HeaderRule[] =>
  aboutAPath().filter((rule) => valueOf(rule, 'Content-Type') !== null)

/**
 * The host a pattern is about, taken apart by hand because `new URL` refuses one.
 *
 * A placeholder in the authority - `:worker` - is a port to a URL parser, so the one parser this
 * repository would otherwise reach for cannot read these. It is two `split`s rather than a parser, and
 * it is the only thing here that knows a pattern is not a URL.
 */
const hostOf = (url: string): string => (url.split('://')[1] ?? '').split('/')[0] ?? ''

describe('the host is told how to serve every answer', () => {
  /**
   * Total over the endpoints, which is the whole mechanism: a rule list assembled by hand would be
   * right about the eight that exist and silent about the ninth, and an answer served with no type
   * declared is a document a host has no opinion about.
   *
   * **Which endpoint a rule names is asked of `askedAt`, and that is the load-bearing half.** It is
   * `pathTo`'s own inverse, held to that in `endpoints.test.ts`, so a pattern this file gets wrong -
   * `/blobs/*` for `/blob/*`, a segment too many, an identifier that is no endpoint - resolves to
   * nothing and reddens here. A comparison against patterns rebuilt from `pathTo` would agree with
   * itself whatever either of them said.
   *
   * **It used to be named for the cache rule and is not any more**, because the two headers stopped
   * being one family: how long an answer may be held is decided by the space it is in and not by the
   * endpoint that names it, so what an endpoint now carries at its own address is what its answers
   * *are*. The claim, the population and the mechanism are otherwise the ones this guard has always
   * had.
   */
  it('every-endpoint-carries-a-rule-at-an-address-that-names-it', () => {
    const covered = new Set(whatAnAnswerIs().map((rule) => askedAt(rule.url)?.endpoint.id))

    expect(covered.has(undefined)).toBe(false)
    expect(ENDPOINTS.filter((endpoint) => !covered.has(endpoint.id)).map((one) => one.id)).toEqual([])
  })

  /**
   * Which rules promise a year, written out rather than derived.
   *
   * It is `the-endpoints-that-carry-the-bulk-are-the-cacheable-ones` asked one floor down, about the
   * strings a host reads instead of the record a function returns - and it is written as an answer
   * because deriving it from `cachePolicyFor` on both sides would make it incapable of failing.
   *
   * **It used to be named for the two endpoints and there are three spaces now, one of which is not an
   * endpoint at all.** `/font/*` holds one file whose address is its own digest, so it is
   * `content-addressed` by the same rule the other two are and gets the same year for the same reason.
   * The name moved because it had stopped being true: the claim is about how an address is *made*, and
   * an endpoint was only ever the way that had happened so far. ADR-0176.
   */
  it('only-what-is-addressed-by-its-content-is-cached-for-a-year', () => {
    const forEver = aboutAPath()
      .filter((rule) => valueOf(rule, 'Cache-Control')?.includes('immutable') === true)
      .map((rule) => rule.url)

    expect(forEver.sort()).toEqual(['/blob/*', '/font/*', '/snapshot/*'])
  })

  /**
   * Every other rule revalidates, asked as a partition rather than as a second list.
   *
   * The two guards together say *these two and no others*, which is the sentence a deployment needs:
   * a space that quietly became immutable would pass the one above by leaving those two intact.
   *
   * **The whole file carries exactly two policies and the guard says so as two spellings**, which is
   * the form that survived the second family arriving. Counting the rules against `ENDPOINTS` was the
   * old shape and it stopped being a claim the day a rule stopped being an endpoint's: what is claimed
   * now is that more spaces are covered than there are endpoints - the reason this family exists - and
   * that no third policy has appeared anywhere in the file.
   */
  it('every-other-answer-is-revalidated-before-it-is-used', () => {
    const policies = aboutAPath()
      .map((rule) => valueOf(rule, 'Cache-Control'))
      .filter((value): value is string => value !== null)

    expect(policies.length).toBeGreaterThan(ENDPOINTS.length)
    expect([...new Set(policies)].sort()).toEqual([
      'public, max-age=0, must-revalidate',
      'public, max-age=31536000, immutable',
    ])
  })

  /**
   * Every endpoint tells the host what its answers are, and the answer is what `contentTypeOf` says.
   *
   * **It is the same defect the cache rule above was written for, on the second declaration this file
   * derives from.** `contentTypeOf` has said since the read API was designed that a blob travels as
   * its own octets and every other answer as JSON, and no deployment read it: measured against the
   * declared origin at `501e32a`, every answer arrived `application/octet-stream` - a file with no
   * extension is one a host has no opinion about - while the pages and the modules arrived
   * `Content-Encoding: br`. A type nothing declares is a document nothing compresses.
   *
   * **The claim is perturbed and not the derivation.** Asking whether the rule holds
   * `contentTypeOf(endpoint)` would establish that this file agrees with itself and would pass over a
   * file that declared the octets for everything. So the two arms are named: exactly the endpoint
   * that serves bytes carries the octets, and every other carries JSON - which is `serves` read
   * independently of the function that reads it.
   */
  it('every-endpoint-tells-the-host-what-its-answers-are', () => {
    const rules = whatAnAnswerIs()

    expect(rules.length).toBe(ENDPOINTS.length)
    expect(rules.filter((rule) => valueOf(rule, 'Content-Type') === null).map((rule) => rule.url)).toEqual([])

    const octets = ENDPOINTS.filter((endpoint) => endpoint.serves === 'served bytes').map(
      (endpoint) => pathTo(endpoint, '*'),
    )

    expect(
      rules
        .filter((rule) => valueOf(rule, 'Content-Type') === 'application/octet-stream')
        .map((rule) => rule.url),
    ).toEqual(octets)
    expect(
      rules
        .filter((rule) => !octets.includes(rule.url))
        .filter((rule) => valueOf(rule, 'Content-Type') !== 'application/json')
        .map((rule) => rule.url),
    ).toEqual([])
  })

  /**
   * The rule that closes the deployment, and the one mistake in it a guard can still catch.
   *
   * Whether the pattern *matches* is Cloudflare's answer and only a real request settles it. What is
   * settled here is the failure that would be silent and permanent: a `noindex` written against the
   * declared origin, which would publish the catalogue's own pages as unindexable for ever while the
   * temporary address stayed open. The two hosts must differ, and this is what says so.
   */
  it('the-deployment-is-closed-to-robots-and-the-declared-origin-is-not', () => {
    const closed = aboutAHost()

    const declared = new URL(THE_ORIGIN).hostname

    expect(closed.length).toBeGreaterThan(0)
    expect([...new Set(closed.map((rule) => valueOf(rule, 'X-Robots-Tag')))]).toEqual(['noindex'])
    expect(closed.filter((rule) => hostOf(rule.url).endsWith(declared))).toEqual([])
  })

  /**
   * Every shape the host answers at, and not only the one a person visits.
   *
   * A production deployment is one label in front of the vendor's domain and a preview is two, and a
   * placeholder in a host stops at a period - so one pattern cannot close both. **The shape left out
   * would be the preview**, which is the one nobody looks at and therefore the one that would stay
   * open for months. Counted by depth rather than compared against the two strings, so what the guard
   * says is *both shapes are closed* and not *these two lines are present*.
   */
  it('both-the-published-shape-and-the-preview-shape-are-closed', () => {
    const depths = aboutAHost().map((rule) => hostOf(rule.url).split('.').length)

    expect([...new Set(depths)].sort()).toEqual([3, 4])
  })

  /**
   * Somebody else's limits, kept here so that they are met by a red guard rather than by a deployment
   * that silently drops the hundred-and-first rule. Both are Cloudflare's published figures for this
   * file, and both grow with the catalogue rather than with anything written here.
   */
  it('the-file-stays-inside-the-limits-the-host-parses-it-under', () => {
    const rendered = renderHeaders(theHeaderRules())

    expect(theHeaderRules().length).toBeLessThanOrEqual(100)
    expect(rendered.split('\n').filter((line) => line.length > 2000)).toEqual([])
  })

  /**
   * That the rendering carries every rule, in the shape the parser wants: the URL at the margin, its
   * headers indented beneath it. A rendering that lost a block would leave the policy declared, every
   * guard above green, and the header unsent - which is the exact failure this whole file is about.
   */
  it('the-rendering-carries-every-rule-with-its-headers-indented-beneath-it', () => {
    const lines = renderHeaders(theHeaderRules()).split('\n')

    expect(lines.filter((line) => line !== '' && !line.startsWith(' '))).toEqual(
      theHeaderRules().map((rule) => rule.url),
    )
    expect(lines.filter((line) => line.startsWith(' ')).length).toBe(
      theHeaderRules().reduce((total, rule) => total + rule.headers.length, 0),
    )
  })
})
