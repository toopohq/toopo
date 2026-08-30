import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { contractUrl } from '../registry/address.js'
import { robotsOf, sitemapOf } from './indexing.js'
import { localSource } from './local-source.js'
import {
  FRONT_PAGE,
  LLMS_TXT,
  ROBOTS,
  SITEMAP,
  THE_ORIGIN,
  linkTo,
  markdownOf,
  pageOf,
  urlOf,
} from './paths.js'
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
const llms = (): string => crawlerFiles().get(LLMS_TXT) ?? ''

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

  /**
   * **The one that matters, and the one nobody sees.** A `robots.txt` that blocks indexing is the
   * classic launch failure: it costs nothing to write by accident, everything works, and it is found
   * six weeks later by noticing the site is nowhere. There is nothing here to hide - permanent rule 5
   * forbids hiding a contract's tests - so the file says so and this requires it to keep saying so.
   *
   * The `Sitemap:` line is here rather than in a guard of its own, and that is a correction the
   * attribution forced: a guard over the absoluteness of every published URL was written first and
   * could not be the only red on anything, because the comparison above already pins each location as
   * an exact string with the origin in it. What was genuinely unguarded was this one line, which no
   * comparison over the sitemap can see - so it moved to the file it is about.
   */
  it('robots-txt-lets-a-crawler-read-everything-and-names-the-sitemap', () => {
    expect(robots()).toContain('User-agent: *')
    expect(robots()).toContain('Allow: /')
    expect(robots()).not.toMatch(/^Disallow: \S/m)
    expect(robots()).not.toContain('noindex')
    expect(robots()).toContain(`Sitemap: ${THE_ORIGIN}/${SITEMAP}`)
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
    // The three characters and not the whole URL: an expectation carrying a rendered address would
    // redden on any defect that moved an address, which is how this guard stopped a different one
    // from ever being the only red on its own mutant.
    expect(sitemapOf(['a&b<c>d/index.html'])).toContain('a&amp;b&lt;c&gt;d')
  })

  /**
   * No file of this folder spells the origin, because the declaration is one floor up.
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
   *
   * **It was `the-origin-is-declared-once` and admitted `paths.ts`.** The declaration moved to
   * `packages/registry/address.ts` when a second consumer appeared - a licence header, frozen into somebody
   * else's repository - and this guard now expects the literal in no file here at all. The name moved
   * with the assertion rather than surviving it: a name that renders a count outlives the data it
   * counted, and *declared once* is exactly that name once the count is zero.
   */
  it('no-file-of-this-folder-spells-the-origin', () => {
    const declaring = readdirSync(HERE)
      .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
      .filter((name) => readFileSync(join(HERE, name), 'utf8').includes(THE_ORIGIN))

    expect(declaring).toEqual([])
  })

  /**
   * The URL a header freezes and the URL this site publishes are one string.
   *
   * Two derivations exist and only one of them can be repaired: `urlOf(pageOf(...))` builds a page's
   * address out of a file path and a trailing-slash rule, `contractUrl` builds it out of an address for
   * the two lines at the top of an installed file. A redirect fixes the first for everybody at once and
   * fixes the second for nobody, because the second is already in somebody's repository and frozen
   * there. This is the only place both are reachable: `packages/registry/` may not import a client of itself.
   */
  it('the-url-a-licence-header-freezes-is-the-page-this-site-publishes', () => {
    const addresses = source.contractIndex().entries.map((entry) => entry.address)

    expect(addresses.map((address) => urlOf(pageOf(address)))).toEqual(
      addresses.map((address) => contractUrl(address)),
    )
  })

  /**
   * Nothing about a second domain reaches this repository: a name that redirects is a fact about DNS.
   *
   * **Five hosts are admitted and none of them is an address of this site**, which is the distinction
   * the guard is about rather than a list of exceptions. `toopo.dev` is where the site lives.
   * `www.sitemaps.org` and `schema.org` are the identifiers of two vocabularies: neither is ever
   * fetched - no served page carries an absolute address, which is the first thing
   * `a-page-loads-nothing-and-runs-nothing` reads - and JSON-LD requires that exact IRI as the value of
   * `@context`, so writing a different one would publish structured data no consumer reads.
   *
   * **The two that arrived with the face are each required rather than convenient, and that is why
   * they are admitted rather than deleted.** `geist.ts` redistributes a font under the SIL Open Font
   * License, whose clause 2 requires the copyright notice to travel with any copy - and the notice as
   * its authors published it names their own repository, on `github.com`, inside the parentheses.
   * Editing a host out of a copyright notice is modifying the notice. `fonts.gstatic.com` is where the
   * exact bytes in that module came from, and it is what makes the digest beside them checkable: a
   * reader who wants to know that this repository did not alter a typeface fetches that address and
   * compares. Both are provenance, which is the opposite of a second name for this catalogue.
   *
   * **This guard caught its own comment on the first run, which is worth a sentence.** The paragraph
   * above quoted the copyright notice in full, absolute address and all, and the sweep reads every
   * `.ts` in this folder including this one. It is the rule holding against the person writing the
   * exemption for it. ADR-0176.
   *
   * What stays refused is what the guard was written for: a second name for this catalogue, in code or
   * in a comment, which is one fact written twice with the copy in prose being the one nobody edits.
   */
  it('the-generator-knows-of-no-domain-but-the-one-it-publishes-on', () => {
    const VOCABULARIES = ['www.sitemaps.org', 'schema.org']
    /** Where the face came from, and who holds its licence. `geist.ts` carries both and needs both. */
    const THE_FACES_PROVENANCE = ['fonts.gstatic.com', 'github.com']

    const elsewhere = readdirSync(HERE)
      .filter((name) => name.endsWith('.ts'))
      .flatMap((name) =>
        [...readFileSync(join(HERE, name), 'utf8').matchAll(/https?:\/\/([\w.-]+)/g)]
          .map((match) => match[1] ?? '')
          .filter(
            (host) =>
              host !== 'toopo.dev' &&
              !VOCABULARIES.includes(host) &&
              !(name === 'geist.ts' && THE_FACES_PROVENANCE.includes(host)),
          )
          .map((host) => `${name} names ${host}`),
      )

    expect(elsewhere).toEqual([])
  })

  /**
   * The files a machine looks for are where it looks, and every one of them is found by convention.
   *
   * The name used to render how many there were, which is the one thing an address must never do: a
   * third file arrived and the name went false without the guard noticing, because a name is not
   * checked by anything. What the guard says instead is the property - *found by convention and by
   * nothing else* - which is as true of three as it was of two.
   */
  it('every-file-found-by-convention-is-at-the-address-that-convention-fixes', () => {
    expect([...crawlerFiles().keys()].sort()).toEqual(['llms.txt', 'robots.txt', 'sitemap.xml'])
    expect(robotsOf()).toBe(robots())
  })

  /**
   * The index a retriever reads opens on what the front page already says this site is.
   *
   * It is the lookup in `theCrawlerFilesOf` made checkable: that function finds the front page in the
   * map rather than composing a heading of its own, and a lookup that found nothing would publish an
   * empty title and an empty summary - a file that exists, parses, and says nothing at all, which is
   * the silent shape every guard in this file is written against.
   */
  it('the-index-a-retriever-reads-opens-on-the-front-pages-own-words', () => {
    const front = pages().get(FRONT_PAGE) as NonNullable<ReturnType<ReturnType<typeof theSite>['get']>>

    expect(llms()).toContain(`# ${front.title}`)
    expect(llms()).toContain(`> ${front.description}`)
  })

  /**
   * Both directions again, and the reason is the sitemap's: a page absent from the index is a page a
   * retriever never opens, and an entry with no file behind it is a 404 published to one.
   *
   * Every link names the Markdown twin rather than the page, because the twin is the whole reason this
   * file exists - an index pointing a retriever at the HTML would be a file whose only effect is to
   * make it pay for the markup twice.
   */
  it('every-page-is-listed-for-a-retriever-as-the-markdown-beside-it', () => {
    const listed = [...llms().matchAll(/^- \[[^\]]*\]\(([^)]*)\)/gm)].map((found) => found[1] ?? '')

    expect(listed.sort()).toEqual(
      [...pages().keys()].map((path) => `${THE_ORIGIN}/${markdownOf(path)}`).sort(),
    )
  })
})
