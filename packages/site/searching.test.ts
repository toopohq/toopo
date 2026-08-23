import { describe, it, expect } from 'vitest'

import { search } from '../registry/search.js'
import { localSource } from './local-source.js'
import type { ReadOneAnswer, WhereTheCatalogueIs } from './searching.js'
import { TheCatalogueCouldNotBeReached, answering, arrivingOnce } from './searching.js'

/**
 * The transport under the search, against the catalogue it fetches.
 *
 * ---------------------------------------------------------------------------
 * This file was reachable for three units and reached by nobody
 * ---------------------------------------------------------------------------
 *
 * `searching.ts` exported four names and no test imported it, which is a different state from
 * `start.ts` and worse in one direction: `start.ts` exports nothing, so nothing *could* reach it,
 * where this could be reached at any time and simply was not. The declaration it carried about a
 * rejected promise - *the next keystroke asks again* - was a sentence with nothing behind it.
 *
 * ADR-0137 named the condition under which the split from `start.ts` would pay: *the two are one
 * file's worth of separation that only matters once something else runs a query.* A guard is that
 * something else, and these are it.
 *
 * ---------------------------------------------------------------------------
 * The reader is handed in and the network is never opened here
 * ---------------------------------------------------------------------------
 *
 * Every guard below drives `arrivingOnce` with a `ReadOneAnswer` written for it, on the pattern
 * `packaging/what-npm-holds.ts` established: a status and a body and nothing else. `overHttp` is the
 * one implementation that touches a socket and no guard here calls it - which is what stops this
 * suite from being a reading of somebody's network.
 */

const source = localSource()

const THE_INDEX = JSON.stringify(source.contractIndex())
const THE_REFUSALS = JSON.stringify(source.refusals())

const WHERE: WhereTheCatalogueIs = {
  index: '/api/contract-index.json',
  refusals: '/api/refusals.json',
  root: '/',
  examples: [],
}

/** A reader that answers both addresses and records every one it was asked for. */
const recording = (): { readonly read: ReadOneAnswer; readonly asked: string[] } => {
  const asked: string[] = []

  return {
    asked,
    read: async (at) => {
      asked.push(at)

      return {
        status: 200,
        body: at === WHERE.index ? THE_INDEX : THE_REFUSALS,
      }
    },
  }
}

describe('the transport under the search', () => {
  /**
   * Both answers are fetched once, however often a reader types.
   *
   * The promise is held rather than the value, so a reader typing three characters before the first
   * answer arrives makes one request and not three. Without it the catalogue is downloaded per
   * keystroke, which nothing on the page would look wrong about.
   */
  it('both-answers-are-fetched-once-however-often-a-reader-types', async () => {
    const { read, asked } = recording()
    const arriving = arrivingOnce(read)

    const [first, second, third] = await Promise.all([
      answering(arriving, WHERE, 'slug'),
      answering(arriving, WHERE, 'slugi'),
      answering(arriving, WHERE, 'slugif'),
    ])
    await answering(arriving, WHERE, 'slugify')

    expect(asked).toEqual([WHERE.index, WHERE.refusals])
    expect(first?.query).toBe('slug')
    expect(second?.query).toBe('slugi')
    expect(third?.query).toBe('slugif')
  })

  /**
   * A catalogue that failed is asked again on the next keystroke, rather than remembered as broken.
   *
   * **The failure a reader meets most is a connection that came back.** A rejected promise kept in the
   * cache is a page that answers *the catalogue could not be read* for the rest of the session, on a
   * network that recovered a second later, with a reload as the only repair.
   */
  it('a-catalogue-that-failed-is-asked-again-on-the-next-keystroke', async () => {
    let attempts = 0
    const flaky: ReadOneAnswer = async (at) => {
      attempts += 1
      if (attempts <= 2) throw new Error('the network went away')

      return { status: 200, body: at === WHERE.index ? THE_INDEX : THE_REFUSALS }
    }

    const arriving = arrivingOnce(flaky)

    await expect(answering(arriving, WHERE, 'slugify')).rejects.toThrow(
      TheCatalogueCouldNotBeReached,
    )

    const found = await answering(arriving, WHERE, 'slugify')

    expect(found.query).toBe('slugify')
    expect(attempts).toBe(4)
  })

  /**
   * The three ways of not knowing are told apart, and none of them is an empty catalogue.
   *
   * A search that quietly reported *nothing found* when it had asked nobody is the one failure this
   * whole rule is built to avoid, so each of the three throws and each says which of the three it was.
   * They redden separately: a reader that never throws kills the first, `response.ok` in place of the
   * status kills the second, and a body taken as JSON without a guard kills the third.
   */
  it('nothing-answering-is-told-apart-from-a-host-that-answered-something-else', async () => {
    const said = async (read: ReadOneAnswer): Promise<string> => {
      try {
        await answering(arrivingOnce(read), WHERE, 'slugify')
      } catch (thrown) {
        return thrown instanceof Error ? thrown.message : String(thrown)
      }

      throw new Error('the catalogue answered where it should have refused')
    }

    const silent = await said(async () => {
      throw new Error('failed to fetch')
    })
    const wrongStatus = await said(async () => ({ status: 503, body: 'the host is unwell' }))
    const notJson = await said(async () => ({ status: 200, body: '<html>a login page</html>' }))

    for (const message of [silent, wrongStatus, notJson]) expect(message).toContain(WHERE.index)

    expect(silent).toContain('failed to fetch')
    expect(wrongStatus).toContain('503')
    expect(notJson).toContain('not JSON')
    expect(new Set([silent, wrongStatus, notJson]).size).toBe(3)
  })

  /**
   * A search on this site runs the registry's own rule against what arrived, and never a second one.
   *
   * ADR-0137's whole argument is that a reader typing here and a reader typing into a terminal get one
   * answer by construction. This is that sentence as a comparison: the same two answers through the
   * same function, taken twice.
   */
  it('a-search-on-this-site-runs-the-registrys-own-rule-against-what-arrived', async () => {
    const { read } = recording()
    const arriving = arrivingOnce(read)

    for (const query of ['turn a title into a url', 'group by', 'yaml frontmatter', 'slugify']) {
      expect(await answering(arriving, WHERE, query)).toEqual(
        search(source.contractIndex(), source.refusals(), query),
      )
    }
  })
})
