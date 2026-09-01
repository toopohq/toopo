import { describe, expect, it } from 'vitest'

import { THE_ORIGIN } from '../packages/registry/address.js'
import { THE_PUBLICATIONS } from '../packages/registry/publication.js'
import { sitemapOf } from '../packages/site/indexing.js'
import { SITEMAP, urlOf } from '../packages/site/paths.js'
import type { ReadOneAddress } from './what-npm-holds.js'
import {
  WhatTheOriginListsCannotBeRead,
  theAddressesListedIn,
  theAddressesTheOriginLists,
  whatNoDeploymentMayStopServing,
  whatWouldStopBeingServed,
} from './what-the-origin-lists.js'

/**
 * What the origin lists, resolved without asking the origin.
 *
 * **No guard here opens a socket**, which is the shape `what-npm-holds.test.ts` established and the
 * reason both modules take their reader as a parameter: a guard reaching the live origin could not be
 * replayed by a battery and would put this suite's verdicts behind somebody else's uptime. What can be
 * wrong in the module is how it reads an answer, so an answer is what it is handed.
 *
 * **The first guard reaches `packages/site/` on purpose, and it is the only one that does.** The
 * reader's job is to invert `indexing.ts` - the writer escapes five characters and this reads them
 * back - so a guard over a document this file composed by hand would establish that the reader agrees
 * with whatever somebody typed here. The round trip is against the function that really writes the
 * sitemap, or it is not a round trip.
 */

/**
 * Every character `indexing.ts` escapes, in one address, and one of them written as an entity.
 *
 * **The `&lt;` in the middle is the whole fixture and it was measured rather than reasoned about.**
 * The five characters written side by side do not exercise the order at all: `a&b<c>` escapes to
 * `a&amp;b&lt;c&gt;` and comes back identical whichever end the ampersand is undone from, because no
 * `&lt;` the writer produced sits inside an `&amp;` it produced. Seen green with the ampersand undone
 * first, which is the defect this guard exists for.
 *
 * An address holding the four characters `&lt;` is what separates them: it escapes to `&amp;lt;`, and
 * undoing the ampersand first turns that into `&lt;` and then into `<` - a silently different address,
 * which is the one failure of this pair that no status code and no refusal would catch.
 */
const A_PAGE_HOLDING_ALL_FIVE = `a&lt;b&c<d>e"f'g/index.html`

const THE_PAGES = ['index.html', 'method/index.html', 'typescript/number/parse@1/index.html']

const answering = (status: number, body: string): ReadOneAddress => async () => ({ status, body })

describe('what the origin lists', () => {
  /**
   * The reader inverts the writer, over the five characters that make the two functions non-trivial.
   *
   * `&amp;` is the one that decides the order: undone first, a sitemap naming an address that holds
   * the literal `&lt;` comes back holding `<` instead - a silently different address, which is the one
   * failure mode of this pair that no status code and no refusal would catch.
   */
  it('every-address-a-sitemap-names-is-read-back-from-it', () => {
    const pages = [...THE_PAGES, A_PAGE_HOLDING_ALL_FIVE]

    const read = theAddressesListedIn('a sitemap this repository wrote', sitemapOf(pages))

    expect([...read].sort()).toEqual(pages.map(urlOf).sort())
  })

  /**
   * **A sitemap index is what makes `<urlset` load-bearing**, and the other three fixtures do not: an
   * error page, a feed and a JSON document all carry no `<loc>` at all, so they are refused by the
   * count whether or not anything reads the root element. Measured - the check removed, those three
   * stay red and this one goes green.
   *
   * It is a document of the same protocol, and every `<loc>` in it is the address of *another sitemap*
   * rather than of a page. Read as a page list it would report that every real address had been
   * dropped, on the one day this catalogue crossed fifty thousand URLs and the emission started
   * writing one.
   */
  it('a-document-that-is-not-a-sitemap-is-refused', () => {
    const documents = [
      '<!doctype html><title>502 Bad Gateway</title>',
      '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel></channel></rss>',
      '{"pages":["https://toopo.dev/"]}',
      '',
      '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="x">' +
        `<sitemap><loc>${THE_ORIGIN}/sitemap-1.xml</loc></sitemap></sitemapindex>`,
    ]

    for (const body of documents) {
      expect(() => theAddressesListedIn('somewhere', body)).toThrow(WhatTheOriginListsCannotBeRead)
    }
  })

  /**
   * An empty listing is not knowledge, which is `an-answer-that-lists-no-versions-is-refused` one
   * module along: a sitemap naming nothing and a sitemap nobody could read decide the same thing here,
   * and both of them must stop a deployment rather than clear it.
   */
  it('a-sitemap-naming-no-address-is-refused', () => {
    const empty = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="x"></urlset>\n'

    expect(() => theAddressesListedIn('somewhere', empty)).toThrow(WhatTheOriginListsCannotBeRead)
  })

  /**
   * **The guard this file exists for, and it is the arm that differs from npm's.**
   * `theVersionsNpmHolds` reads a 404 as *no such package*, and that is safe because a wrong reading
   * ends in npm refusing the publication. Here a 404 read as emptiness would mean the origin lists
   * nothing, nothing could be found missing from it, and the deployment that drops every page at once
   * would be cleared by the reading written to refuse it. A reading whose failure mode is a green is
   * not a reading.
   */
  it('a-404-for-a-sitemap-is-refused-and-never-read-as-an-empty-site', async () => {
    await expect(theAddressesTheOriginLists(answering(404, 'nothing here'))).rejects.toThrow(
      WhatTheOriginListsCannotBeRead,
    )
  })

  it('a-status-that-is-not-an-answer-refuses-the-reading', async () => {
    const sitemap = sitemapOf(THE_PAGES)

    for (const status of [301, 403, 429, 500, 503]) {
      await expect(theAddressesTheOriginLists(answering(status, sitemap))).rejects.toThrow(
        WhatTheOriginListsCannotBeRead,
      )
    }
  })

  it('an-origin-that-could-not-be-read-establishes-nothing', async () => {
    const offline: ReadOneAddress = async () => {
      throw new Error('getaddrinfo ENOTFOUND toopo.dev')
    }

    await expect(theAddressesTheOriginLists(offline)).rejects.toThrow(
      WhatTheOriginListsCannotBeRead,
    )
  })

  /**
   * The address asked is the sitemap's, under the origin, and both halves are read from where they are
   * declared: a literal here would be this file's opinion of where a sitemap lives rather than the
   * convention the tree is written to.
   */
  it('the-address-asked-is-the-sitemap-under-the-origin', async () => {
    const asked: string[] = []
    const recording: ReadOneAddress = async (url) => {
      asked.push(url)

      return { status: 200, body: sitemapOf(THE_PAGES) }
    }

    await theAddressesTheOriginLists(recording)

    expect(asked).toEqual([`${THE_ORIGIN}/${SITEMAP}`])
  })

  /**
   * The comparison runs in one direction, and the guard holds both halves of that.
   *
   * An address this tree writes and the origin does not is a page being added, which is what an
   * ordinary unit does and must never stop a deployment. An address the origin serves and this tree
   * drops is a reader following a link into a 404 that tells them nothing was ever there. A guard over
   * the second alone would be satisfied by reporting everything.
   */
  it('only-an-address-the-origin-serves-and-this-tree-drops-is-reported', () => {
    const served = new Set([`${THE_ORIGIN}/`, `${THE_ORIGIN}/refused/`, `${THE_ORIGIN}/method/`])
    const written = new Set([`${THE_ORIGIN}/`, `${THE_ORIGIN}/method/`, `${THE_ORIGIN}/typescript/`])

    expect(whatWouldStopBeingServed(served, written)).toEqual([`${THE_ORIGIN}/refused/`])
    expect(whatWouldStopBeingServed(written, written)).toEqual([])
  })

  /**
   * Of the addresses that would stop being served, the ones no deployment may drop.
   *
   * **The two halves fail in opposite directions and only one of them is quiet.** Refusing too much
   * stops a deployment and somebody reads the list; refusing too little lets a published contract's
   * address go, and what a reader then meets is a 404 saying nothing was ever served at an address
   * this catalogue promised to serve for ever. So the guard states both.
   *
   * **The refused contract is the row this guard exists for now.** ADR-0188 classified by the grammar
   * of an address, and `array/group-by@1` has that grammar and no publication behind it — so the gate
   * refused to retire the page a *turned-down* contract had, which nothing freezes. That was found by
   * running the real comparison against the live origin, and it is the row that would go green again
   * if somebody keyed this back to what an address looks like.
   *
   * **The published half is derived from `THE_PUBLICATIONS` rather than typed**, so a seventh contract
   * enters this guard's population with nobody editing it; and the addresses are built with `urlOf`,
   * for the reason the first guard in this file reaches `packages/site/`: what is being classified is
   * the string the sitemap really carries, including the trailing slash `urlOf` exists to get right.
   *
   * The last row is the unreadable one, and it is refused rather than allowed. A `<loc>` that is not a
   * URL cannot be classified, and of the two ways to treat that only one fails safely: allowing it
   * makes a malformed listing a way past this gate.
   */
  it('a-deployment-may-retire-a-page-and-never-an-address-a-contract-was-published-at', () => {
    const PUBLISHED = Object.keys(THE_PUBLICATIONS).map((address) => urlOf(`${address}/index.html`))

    const RETIRABLE = [
      urlOf('index.html'),
      urlOf('catalogue/index.html'),
      urlOf('method/index.html'),
      urlOf('what-a-contract-is/index.html'),
      urlOf('refused/index.html'),
      urlOf('typescript/number/index.html'),
      // The page a contract the catalogue turned down had, at an address it was never published at.
      urlOf('typescript/array/group-by@1/index.html'),
    ]

    const UNREADABLE = 'not a url at all'

    expect(PUBLISHED.length).toBeGreaterThan(0)
    expect(whatNoDeploymentMayStopServing([...RETIRABLE, ...PUBLISHED])).toEqual(PUBLISHED)
    expect(whatNoDeploymentMayStopServing(RETIRABLE)).toEqual([])
    expect(whatNoDeploymentMayStopServing([UNREADABLE])).toEqual([UNREADABLE])
  })
})
