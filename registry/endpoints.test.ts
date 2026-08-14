import { describe, it, expect } from 'vitest'

import { isFrozenIdentifier } from '../packages/catalogue/identifier.js'
import {
  ENDPOINTS,
  MISSING_FROM_THE_INDICATIVE_LIST,
  THE_INDICATIVE_LIST,
} from './endpoints.js'
import { NEEDS } from './needs.js'
import { cachePolicyFor } from './response.js'

/**
 * The endpoints answer the needs, the needs are all answered, and the indicative list is checked
 * against the result rather than copied into it.
 *
 * The first two guards are the pair that makes "derive from the needs" executable instead of
 * intentional. They only work because `needs.ts` names no endpoint and `endpoints.ts` names the needs:
 * two independent statements, and these are their disagreement. A `Need` that carried its own answer
 * would make the first guard compare a list with itself.
 */

const NEED_IDS = new Set(NEEDS.map((need) => need.id))
const ENDPOINT_IDS = new Set(ENDPOINTS.map((endpoint) => endpoint.id))

describe('the needs and the endpoints answer each other', () => {
  /**
   * The half that catches a real mistake: an endpoint derived from nothing. Every one of these has to
   * exist because somebody has to do something, and an endpoint that answers no need is an endpoint
   * copied from a list.
   */
  it('every-endpoint-answers-a-need-somebody-has', () => {
    const answering = ENDPOINTS.filter((endpoint) => endpoint.answers.length === 0)

    expect(answering.map((endpoint) => endpoint.id)).toEqual([])

    const invented = ENDPOINTS.flatMap((endpoint) =>
      endpoint.answers.filter((need) => !NEED_IDS.has(need)).map((need) => `${endpoint.id} -> ${need}`),
    )

    expect(invented, 'an endpoint claims to answer a need nobody declared').toEqual([])
  })

  /**
   * The other half, and the one that would have let this unit ship an API that cannot install
   * anything: a need nothing answers. `answeredWithoutTheApi` is the only way out, and it is exclusive
   * - a need answered both ways is a sentence nobody rechecked, which is the failure
   * `FIELD_MAP.unfilledBecause` is already guarded against in both directions.
   */
  it('every-need-is-answered-exactly-once :: by an endpoint, or by something that is not the api', () => {
    const answered = new Set(ENDPOINTS.flatMap((endpoint) => endpoint.answers))

    const unanswered = NEEDS.filter(
      (need) => !answered.has(need.id) && need.answeredWithoutTheApi === undefined,
    )

    expect(
      unanswered.map((need) => need.id),
      'a consumer has to do this and nothing tells it how',
    ).toEqual([])

    const answeredTwice = NEEDS.filter(
      (need) => answered.has(need.id) && need.answeredWithoutTheApi !== undefined,
    )

    expect(
      answeredTwice.map((need) => need.id),
      'this need says the api does not answer it, and an endpoint says it does',
    ).toEqual([])
  })

  it('every-identifier-is-an-address :: frozen, kebab-case, unique', () => {
    const malformed = [...NEED_IDS, ...ENDPOINT_IDS].filter((id) => !isFrozenIdentifier(id))

    expect(malformed).toEqual([])
    expect(NEED_IDS.size).toBe(NEEDS.length)
    expect(ENDPOINT_IDS.size).toBe(ENDPOINTS.length)
  })

  /**
   * The needs answered on the user's own machine, named rather than counted. One more appearing
   * silently would mean something moved off the API without anyone saying so, which is how a
   * capability quietly disappears - so the guard pins which ones they are, and the list is the pin.
   *
   * **This guard was called `three-needs-are-answered-without-the-api` and had to be renamed.** A
   * fourth had already appeared: the assertion below lists four, the identifier said three, and the
   * two were edited apart because nothing makes a name answer for the data underneath it. The guard
   * written to detect a silent change was blinded by its own name.
   */
  it('the-needs-answered-without-the-api :: and each one says what answers it', () => {
    const elsewhere = NEEDS.filter((need) => need.answeredWithoutTheApi !== undefined)

    expect(elsewhere.map((need) => need.id).sort()).toEqual([
      'detect-a-local-modification-by-hash',
      'point-an-import-at-the-shared-copy',
      'report-a-conflict-instead-of-overwriting',
      'show-the-install-command',
    ])
  })
})

// The title is ASCII, and the section sign would have been the first non-ASCII code point in any
// title in this catalogue - the measurement `mutation/run.ts` records when it chose ` :: ` over an
// em dash. It is spelled out rather than dropped.
describe('the indicative list of section 6.2, checked against what the needs produced', () => {
  it('every-entry-became-an-endpoint-that-exists', () => {
    const dangling = THE_INDICATIVE_LIST.flatMap((entry) =>
      entry.became
        .filter((id) => !ENDPOINT_IDS.has(id))
        .map((id) => `${entry.entry} -> ${id}`),
    )

    expect(dangling).toEqual([])

    const emptied = THE_INDICATIVE_LIST.filter((entry) => entry.became.length === 0)

    expect(
      emptied.map((entry) => entry.entry),
      'an entry that became nothing served a need nobody has, and this list has no such entry',
    ).toEqual([])
  })

  /**
   * The finding, as two statements that must coincide. The derived half is what the list left out; the
   * declared half is what this unit says it left out. Deriving it alone would leave nobody having
   * committed to an answer, and a list that grew silently would read as a list somebody checked.
   */
  it('the-endpoints-no-entry-anticipated :: three, and they are the ones named', () => {
    const anticipated = new Set(THE_INDICATIVE_LIST.flatMap((entry) => entry.became))
    const missing = ENDPOINTS.filter((endpoint) => !anticipated.has(endpoint.id)).map(
      (endpoint) => endpoint.id,
    )

    expect(missing.sort()).toEqual([...MISSING_FROM_THE_INDICATIVE_LIST].sort())
  })

  /**
   * The sentence the whole confrontation comes down to: nothing the indicative list carried survives
   * unchanged into a content-addressed endpoint. Every entry that held is a named answer, so a reader
   * who fetched all five and checked everything checkable would have checked nothing.
   */
  it('nothing-that-held-is-content-addressed :: the list serves no verifiable answer', () => {
    const byId = new Map(ENDPOINTS.map((endpoint) => [endpoint.id, endpoint]))

    const verifiable = THE_INDICATIVE_LIST.filter((entry) => entry.verdict === 'held').flatMap(
      (entry) =>
        entry.became.filter((id) => byId.get(id)?.addressing === 'content-addressed'),
    )

    expect(verifiable).toEqual([])
  })

  it('a-refused-entry-is-answered-by-endpoints-that-exist-for-other-reasons', () => {
    const refused = THE_INDICATIVE_LIST.filter((entry) => entry.verdict === 'refused')

    expect(refused.map((entry) => entry.became.length > 0)).toEqual([true])

    // The harness entry, and it is the only one refused. A second refusal appearing would mean the
    // list was wrong twice over, which is worth having to say out loud.
    expect(refused).toHaveLength(1)
  })

  it('every-entry-says-why :: a verdict with no reason is a preference', () => {
    const silent = THE_INDICATIVE_LIST.filter((entry) => entry.reason.trim() === '')

    expect(silent.map((entry) => entry.entry)).toEqual([])
  })
})

describe('the cache follows from the addressing and from nothing else', () => {
  /**
   * The consequence the storage unit's separation buys, made executable. A content-addressed answer is
   * never wrong, so it is never revalidated; a named answer outlives what it points at, so it always
   * is. If either half of this were declared per endpoint, the first disagreement would be a CDN
   * serving a binding that had moved.
   */
  it('a-content-addressed-answer-is-cached-for-ever', () => {
    const policy = cachePolicyFor('content-addressed')

    expect(policy.immutable).toBe(true)
    expect(policy.mustRevalidate).toBe(false)
    expect(policy.maxAgeSeconds).toBeGreaterThan(0)
  })

  it('a-named-answer-is-always-revalidated', () => {
    const policy = cachePolicyFor('named')

    expect(policy.immutable).toBe(false)
    expect(policy.mustRevalidate).toBe(true)
    expect(policy.maxAgeSeconds).toBe(0)
  })

  /**
   * Which endpoints pay the revalidation, stated rather than left to be discovered on the first
   * traffic bill: the two that carry the bulk - a record is 32 to 50 kB over the five - are the two
   * that are never revalidated.
   */
  it('the-endpoints-that-carry-the-bulk-are-the-cacheable-ones', () => {
    const forEver = ENDPOINTS.filter(
      (endpoint) => cachePolicyFor(endpoint.addressing).immutable,
    ).map((endpoint) => endpoint.id)

    expect(forEver.sort()).toEqual(['blob', 'snapshot'])
  })
})
