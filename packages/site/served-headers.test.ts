import { describe, it, expect } from 'vitest'

import { ENDPOINTS, askedAt } from '../registry/endpoints.js'
import { THE_ORIGIN } from './paths.js'
import type { HeaderRule } from './served-headers.js'
import { renderHeaders, theHeaderRules } from './served-headers.js'

/** The rules that are about a host rather than about a path, which is how the file spells the two. */
const aboutAHost = (): readonly HeaderRule[] =>
  theHeaderRules().filter((rule) => rule.url.includes('://'))

const aboutAPath = (): readonly HeaderRule[] =>
  theHeaderRules().filter((rule) => !rule.url.includes('://'))

const valueOf = (rule: HeaderRule, name: string): string | null =>
  rule.headers.find(([carried]) => carried === name)?.[1] ?? null

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
   * right about the eight that exist and silent about the ninth, and a named answer served without
   * `must-revalidate` is a CDN free to hand out a binding that has moved.
   *
   * **Which endpoint a rule names is asked of `askedAt`, and that is the load-bearing half.** It is
   * `pathTo`'s own inverse, held to that in `endpoints.test.ts`, so a pattern this file gets wrong -
   * `/blobs/*` for `/blob/*`, a segment too many, an identifier that is no endpoint - resolves to
   * nothing and reddens here. A comparison against patterns rebuilt from `pathTo` would agree with
   * itself whatever either of them said.
   */
  it('every-endpoint-carries-a-cache-rule-at-an-address-that-names-it', () => {
    const covered = new Set(aboutAPath().map((rule) => askedAt(rule.url)?.endpoint.id))

    expect(covered.has(undefined)).toBe(false)
    expect(ENDPOINTS.filter((endpoint) => !covered.has(endpoint.id)).map((one) => one.id)).toEqual([])
  })

  /**
   * Which rules promise a year, written out rather than derived.
   *
   * It is `the-endpoints-that-carry-the-bulk-are-the-cacheable-ones` asked one floor down, about the
   * strings a host reads instead of the record a function returns - and it is written as an answer
   * because deriving it from `cachePolicyFor` on both sides would make it incapable of failing.
   */
  it('only-the-two-content-addressed-endpoints-are-cached-for-a-year', () => {
    const forEver = aboutAPath()
      .filter((rule) => valueOf(rule, 'Cache-Control')?.includes('immutable') === true)
      .map((rule) => rule.url)

    expect(forEver.sort()).toEqual(['/blob/*', '/snapshot/*'])
  })

  /**
   * Every other rule revalidates, asked as a partition rather than as a second list.
   *
   * The two guards together say *these two and no others*, which is the sentence a deployment needs:
   * an endpoint that quietly became immutable would pass the one above by leaving those two intact.
   */
  it('every-other-answer-is-revalidated-before-it-is-used', () => {
    const stale = aboutAPath()
      .filter((rule) => valueOf(rule, 'Cache-Control')?.includes('immutable') !== true)
      .map((rule) => valueOf(rule, 'Cache-Control'))

    expect(stale.length).toBe(ENDPOINTS.length - 2)
    expect([...new Set(stale)]).toEqual(['public, max-age=0, must-revalidate'])
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

    expect(closed.length).toBe(1)
    expect(closed.map((rule) => valueOf(rule, 'X-Robots-Tag'))).toEqual(['noindex'])
    expect(closed.map((rule) => hostOf(rule.url).endsWith(declared))).toEqual([false])
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
