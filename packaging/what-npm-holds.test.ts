import { describe, expect, it } from 'vitest'

import {
  THE_NPM_REGISTRY,
  WhatNpmHoldsCannotBeRead,
  theVersionsNpmHolds,
} from './what-npm-holds.js'
import type { ReadOneAddress } from './what-npm-holds.js'

/**
 * What npm holds, resolved without asking npm.
 *
 * **No guard here opens a socket, and that is the whole shape of this file.** A guard that reached the
 * live registry could not be replayed by a battery and would put another suite's verdicts behind
 * somebody else's uptime - which is why `packaging/against-the-origin/` is a folder of its own and is
 * kept out of every battery. What can be wrong in the module is how it reads an answer, so an answer is
 * what it is handed.
 *
 * **The listing below is the document npm really serves**, read at `8dab5d4`: the four keys, the three
 * versions, and a `dist-tags` naming one of them. It is written out rather than reduced to what each
 * guard needs, because the one defect worth catching here is reading the pointer instead of the
 * listing, and a fixture with no pointer in it could not catch that.
 */
const THE_LISTING_NPM_SERVES = JSON.stringify({
  name: 'toopo',
  'dist-tags': { latest: '1.0.2' },
  versions: { '1.0.0': {}, '1.0.1': {}, '1.0.2': {} },
  modified: '2026-08-17T20:53:00.000Z',
})

const answering = (status: number, body: string): ReadOneAddress => async () => ({ status, body })

describe('what npm holds', () => {
  it('the-versions-npm-holds-are-every-key-of-the-listing', async () => {
    const held = await theVersionsNpmHolds('toopo', answering(200, THE_LISTING_NPM_SERVES))

    expect([...held].sort()).toEqual(['1.0.0', '1.0.1', '1.0.2'])
  })

  /**
   * The one answer that is not a failure. npm says *no such package* until a package exists, so this is
   * the state every first publication is decided in - and reading it as emptiness is safe in the
   * direction that matters: if it were ever wrong, npm refuses the publication on the version.
   */
  it('a-name-npm-has-never-heard-of-holds-no-versions', async () => {
    const held = await theVersionsNpmHolds('toopo', answering(404, '{"error":"Not found"}'))

    expect([...held]).toEqual([])
  })

  it('the-address-asked-is-the-name-under-the-origin', async () => {
    const asked: string[] = []
    const recording: ReadOneAddress = async (url) => {
      asked.push(url)

      return { status: 200, body: THE_LISTING_NPM_SERVES }
    }

    await theVersionsNpmHolds('toopo', recording)

    expect(asked).toEqual([`${THE_NPM_REGISTRY}/toopo`])
  })

  it('an-answer-that-lists-no-versions-is-refused', async () => {
    const documents = [
      '{"name":"toopo","dist-tags":{"latest":"1.0.2"}}',
      '{"name":"toopo","versions":null}',
      '<!doctype html><title>502 Bad Gateway</title>',
      '',
    ]

    for (const body of documents) {
      await expect(theVersionsNpmHolds('toopo', answering(200, body))).rejects.toThrow(
        WhatNpmHoldsCannotBeRead,
      )
    }
  })

  it('a-status-that-is-not-an-answer-is-refused', async () => {
    for (const status of [301, 403, 429, 500, 503]) {
      await expect(
        theVersionsNpmHolds('toopo', answering(status, THE_LISTING_NPM_SERVES)),
      ).rejects.toThrow(WhatNpmHoldsCannotBeRead)
    }
  })

  /**
   * **The guard this file exists for.** Not knowing what npm holds and knowing it holds nothing are the
   * same value if a refusal is read as an empty set, and they decide opposite things: the first must
   * stop a run, the second is what every first publication is. A module that swallowed this would
   * answer *publish* to a registry that never spoke.
   */
  it('a-reader-that-could-not-read-is-refused-and-never-read-as-emptiness', async () => {
    const offline: ReadOneAddress = async () => {
      throw new Error('getaddrinfo ENOTFOUND registry.npmjs.org')
    }

    await expect(theVersionsNpmHolds('toopo', offline)).rejects.toThrow(WhatNpmHoldsCannotBeRead)
  })
})
