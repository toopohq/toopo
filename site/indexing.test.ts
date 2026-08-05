import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { robotsOf, sitemapOf } from './indexing.js'
import { localSource } from './local-source.js'
import { ROBOTS, SITEMAP, THE_ORIGIN, linkTo } from './paths.js'
import { theCrawlerFilesOf, theSite } from './site.js'

/**
 * The two files nobody reads, which decide whether anything is found.
 *
 * They fail differently from every other artefact here. A wrong page is wrong in front of somebody; a
 * wrong `robots.txt` is a site that works perfectly and is nowhere, discovered six weeks later by
 * somebody wondering why there is no traffic. Every guard below is aimed at a failure with no symptom.
 */

const HERE = import.meta.dirname

const source = localSource()
const pages = (): ReturnType<typeof theSite> => theSite(source)
const crawlerFiles = (): ReadonlyMap<string, string> => theCrawlerFilesOf(pages())

const sitemap = (): string => crawlerFiles().get(SITEMAP) ?? ''
const robots = (): string => crawlerFiles().get(ROBOTS) ?? ''

const locations = (xml: string): readonly string[] =>
  [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1] ?? '')

describe('what a crawler reads', () => {
  /**
   * Both directions, because the two failures are different and both are silent.
   *
   * A page missing from the sitemap is a page nothing indexes. An entry with no page behind it is a
   * 404 published to a crawler, which is the worse of the two: a search engine that follows a broken
   * URL learns something about the whole site.
   */
  it('every-page-is-in-the-sitemap-and-nothing-else-is', () => {
    expect([...locations(sitemap())].sort()).toEqual(
      [...pages().keys()].map((path) => `${THE_ORIGIN}/${linkTo(path)}`).sort(),
    )
  })

  /**
   * Each URL, read back as a path, lands on a file this site writes.
   *
   * **It is a decoding, and that is the whole reason it is here beside the comparison above.** That
   * one builds what it expects with `linkTo`, which is the function the sitemap itself is built from,
   * so a re-spelling applied on both sides would agree with it perfectly. This one goes the other way:
   * it takes the string a crawler is given, strips the origin, and requires what is left to name a
   * page in the map. Nothing it does is shared with the code that wrote the URL.
   *
   * A sitemap URL that differs from the served URL by one character gets a redirect indexed instead of
   * the page, and the character it always differs by is the trailing slash - which here turns
   * `number/parse@1/` into `number/parse@1index.html` and names nothing.
   */
  it('every-url-in-the-sitemap-decodes-to-a-page-this-site-writes', () => {
    const written = pages()

    expect(
      locations(sitemap())
        .map((loc) => `${loc.slice(`${THE_ORIGIN}/`.length)}index.html`)
        .filter((path) => !written.has(path)),
    ).toEqual([])
  })

  /**
   * No `lastmod`, and it is omitted rather than filled.
   *
   * The protocol makes it optional and it is the field that invites a fabricated date. Nothing here
   * can derive one: a file's mtime is a fact about a checkout and a clock is a fact about the machine
   * the build ran on, and **a published file carrying a machine-dependent value is the immutability
   * defect this repository has already found twice**. A `lastmod` that lies is worse than none - a
   * crawler told a page changed a year ago may not come back for it.
   *
   * The guard is over the whole document rather than over the tag, so a date arriving under any other
   * name is caught by the same statement.
   */
  it('the-sitemap-carries-no-date-this-repository-cannot-derive', () => {
    expect(sitemap()).not.toContain('lastmod')
    expect(sitemap().match(/\d{4}-\d{2}-\d{2}/g)).toBeNull()
  })

  /** A relative URL in a sitemap is not a URL at all, and a crawler is entitled to ignore the file. */
  it('every-url-a-crawler-is-given-is-absolute-and-on-the-published-origin', () => {
    const given = [...locations(sitemap()), `${THE_ORIGIN}/${SITEMAP}`]

    expect(given.filter((url) => !url.startsWith(`${THE_ORIGIN}/`))).toEqual([])
    expect(robots()).toContain(`Sitemap: ${THE_ORIGIN}/${SITEMAP}`)
  })

  /**
   * **The one that matters, and the one nobody sees.** A `robots.txt` that blocks indexing is the
   * classic launch failure: it costs nothing to write by accident, everything works, and it is found
   * six weeks later by noticing the site is nowhere. There is nothing here to hide - permanent rule 5
   * forbids hiding a contract's tests - so the file says so and this requires it to keep saying so.
   */
  it('robots-txt-lets-a-crawler-read-everything-and-names-the-sitemap', () => {
    expect(robots()).toContain('User-agent: *')
    expect(robots()).toContain('Allow: /')
    expect(robots()).not.toMatch(/^Disallow: \S/m)
    expect(robots()).not.toContain('noindex')
  })

  /**
   * A path that would break the XML is escaped, checked on a path this catalogue does not hold.
   *
   * Nothing here needs it today: `number/parse@1` is the most exotic address in the catalogue and `@`
   * is legal unescaped in a path segment. That is exactly why it is checked on a synthetic input - an
   * escape applied because the current data needs it is one that is forgotten when the data changes,
   * and the failure here is not a wrong character but a document a parser rejects whole.
   */
  it('a-path-that-would-break-the-xml-is-escaped', () => {
    const written = sitemapOf(['a&b<c>d/index.html'])

    expect(written).toContain('<loc>https://toopo.dev/a&amp;b&lt;c&gt;d/</loc>')
    expect(locations(written)).toEqual(['https://toopo.dev/a&amp;b&lt;c&gt;d/'])
  })

  /**
   * The origin is written once in this folder and everything else derives from it.
   *
   * It is an address, not a setting: changing it changes every URL this site has ever published. Two
   * spellings of it would be two statements of one fact, and the second would be a published URL
   * nobody notices is wrong until a crawler follows it.
   *
   * **Any occurrence, not one at the head of a literal.** The first version of this required a quote
   * in front of the origin and stayed green on the defect written to break it - a second spelling
   * inside a template, which is the only shape the mistake ever takes, because that is where a URL is
   * assembled. A comment naming the domain is refused too, and deliberately: it is the same fact
   * written twice, and the copy in prose is the one nobody edits.
   */
  it('the-origin-is-declared-once', () => {
    const declaring = readdirSync(HERE)
      .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
      .filter((name) => readFileSync(join(HERE, name), 'utf8').includes(THE_ORIGIN))

    expect(declaring).toEqual(['paths.ts'])
  })

  /** Nothing about a second domain reaches this repository: a name that redirects is a fact about DNS. */
  it('the-generator-knows-of-no-domain-but-the-one-it-publishes-on', () => {
    const elsewhere = readdirSync(HERE)
      .filter((name) => name.endsWith('.ts'))
      .flatMap((name) =>
        [...readFileSync(join(HERE, name), 'utf8').matchAll(/https?:\/\/([\w.-]+)/g)]
          .map((match) => match[1] ?? '')
          .filter((host) => host !== 'toopo.dev' && host !== 'www.sitemaps.org')
          .map((host) => `${name} names ${host}`),
      )

    expect(elsewhere).toEqual([])
  })

  /** The two files are what `build.ts` writes beside the pages, at the paths a crawler looks for. */
  it('the-two-crawler-files-are-at-the-addresses-a-crawler-looks-for', () => {
    expect([...crawlerFiles().keys()].sort()).toEqual(['robots.txt', 'sitemap.xml'])
    expect(robotsOf()).toBe(robots())
  })
})
