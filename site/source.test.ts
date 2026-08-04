import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { ENDPOINTS, portFaults } from '../registry/endpoints.js'
import { NEEDS } from '../registry/needs.js'
import { THE_UNPUBLISHED_VERSION as THE_INSTALLERS_VERSION } from '../cli/local-source.js'
import { THE_UNPUBLISHED_VERSION, localSource } from './local-source.js'
import { NOT_THIS_UNIT, THE_ENDPOINT_BEHIND } from './source.js'

/**
 * The port, and the frontier between a generator and the working tree it happens to be sitting in.
 *
 * The frontier guard is the load-bearing one, exactly as it is one folder along: `source.ts` states in
 * prose that serialising this repository stands in for a publication and is never a route by which
 * anything is installed, and a sentence in a header is the kind of rule this repository keeps finding
 * nothing behind. What keeps it is that one module reaches the serialisation and every other module of
 * this folder would fail this guard for doing so.
 */

const HERE = import.meta.dirname

const THE_SERIALISATION = ['registry/the-five', 'registry/serialise']

describe('where the generator gets what it publishes', () => {
  it('every-method-of-the-port-answers-an-endpoint-that-exists', () => {
    const known = new Set(ENDPOINTS.map((endpoint) => endpoint.id))

    expect(Object.values(THE_ENDPOINT_BEHIND).filter((endpoint) => !known.has(endpoint))).toEqual([])
    expect(portFaults(THE_ENDPOINT_BEHIND, localSource())).toEqual([])
  })

  /**
   * A source reaching past the read API is the failure a port exists to prevent.
   *
   * The example used to be `blob`, and the playground took it: a page that runs an implementation
   * fetches its bytes, so `blob` is now declared here and would no longer be caught. `attestations` is
   * the replacement and is a better one - it is an endpoint that exists, that no page has ever had a
   * need for, and that nothing in this folder is one refactor away from wanting.
   */
  it('a-source-carrying-more-than-the-port-declares-is-refused', () => {
    const wider = { ...localSource(), attestations: () => null }

    expect(portFaults(THE_ENDPOINT_BEHIND, wider)).toEqual([
      'the source carries `attestations`, which the port does not declare - a client reaching for it ' +
        'would be reaching past the read API',
    ])
  })

  /**
   * Every need the site has is answered by an endpoint this port carries, answered on the reader's own
   * machine, or declared out of this unit with what it is waiting for. Two statements, one partition,
   * and the disagreement between them is what would say that a page had grown a dependency nobody
   * wrote down - or that a scope decision had quietly stopped being one.
   *
   * `list-the-whole-catalogue` is here because this guard is what found its absence: the site consumed
   * the index for its front page and no need in the registry said so.
   *
   * What this deliberately does **not** require is that a deferred need be unanswerable by the port.
   * Two of the three are answerable and are deferred anyway - `NOT_THIS_UNIT` says which and why - and
   * an earlier version of this guard demanded the opposite, which would have forced the port to be
   * narrower than the endpoints it legitimately uses.
   */
  it('the-needs-of-the-site-are-answered-or-deferred-with-a-reason', () => {
    const mine = NEEDS.filter((need) => need.consumer === 'the-site')
    const answered = new Set(
      ENDPOINTS.filter((endpoint) => Object.values(THE_ENDPOINT_BEHIND).includes(endpoint.id)).flatMap(
        (endpoint) => endpoint.answers,
      ),
    )

    expect({
      unaccountedFor: mine
        .filter(
          (need) =>
            !answered.has(need.id) &&
            need.answeredWithoutTheApi === undefined &&
            NOT_THIS_UNIT[need.id] === undefined,
        )
        .map((need) => need.id),
      deferredAndUnknown: Object.keys(NOT_THIS_UNIT).filter(
        (id) => !mine.some((need) => need.id === id),
      ),
    }).toEqual({ unaccountedFor: [], deferredAndUnknown: [] })
  })

  /**
   * A text search over the source rather than a syntax tree, and that is the same deliberate limit the
   * installer's frontier guard carries: this is a discipline about which module may know about the
   * working tree, not a security filter, and the one thing it has to catch is a second module
   * importing the serialisation because it was convenient.
   */
  it('nothing-but-the-local-adapter-reaches-the-serialisation', () => {
    const reaching = readdirSync(HERE)
      .filter((name) => name.endsWith('.ts'))
      .filter((name) => {
        const text = readFileSync(join(HERE, name), 'utf8')

        return THE_SERIALISATION.some((module) => text.includes(`from '../${module}.js'`))
      })

    expect(reaching).toEqual(['local-source.ts'])
  })

  /**
   * This repository has one visibly-false version and two stand-ins that bind at it.
   *
   * The constant is written twice on purpose - a client may not import another client, and a published
   * registry has no notion of a stand-in - so what keeps them in step is this rather than a comment.
   * It is worth having precisely because nothing the generator renders shows the version: a
   * disagreement would be invisible on every page and would surface the day either stand-in becomes a
   * server.
   */
  it('both-stand-ins-bind-the-same-visibly-unpublished-version', () => {
    expect(THE_UNPUBLISHED_VERSION).toBe('0.0.0-local')
    expect(THE_UNPUBLISHED_VERSION).toBe(THE_INSTALLERS_VERSION)
  })

  /**
   * A contract the catalogue refused has no binding, so it has no contract page - and it is in the
   * index, because somebody who has heard of it must be told the catalogue considered it.
   */
  it('a-refused-contract-is-in-the-index-and-resolves-to-no-binding', () => {
    const source = localSource()
    const refused = source
      .contractIndex()
      .entries.filter((entry) => !entry.installable)
      .map((entry) => entry.address)

    expect(refused.map((address) => address.name)).toEqual(['array/group-by'])
    expect(refused.map((address) => source.contractBinding(address))).toEqual([null])
  })
})
