import { describe, expect, it } from 'vitest'

import { deciding, withoutAsking } from './fixpoint.js'
import { httpSource } from './http-source.js'
import { imaginedSource } from './imagined-source.js'
import { prepareInstallation } from './install.js'
import type { InstallOutcome } from './install.js'
import { servingOverHttp } from './serving-over-http.js'
import type { Serving } from './serving-over-http.js'
import type { HeldRegistry, RegistrySource } from './source.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject } from './temporary-project.js'

/**
 * A registry that is really remote, and the property `command.ts` would lose first.
 *
 * **The acceptance criterion of this folder is not that an install works over HTTP.** It is that
 * *everything this tool decides is reachable from a guard, with no process, no working directory and no
 * clock* survives a registry that answers over a socket. What makes that checkable rather than
 * assertable is the shape `fixpoint.ts` takes: the decision is synchronous and the loop around it is
 * not, so the same decision can be taken a second time against the answers the first one gathered - no
 * network, no loop - and required to produce the identical plan.
 *
 * Everything below is served by `node:http` on a port the operating system picks, inside this process.
 * There is nothing deployed and nothing to host.
 */

const withARegistry = async <T>(
  use: (serving: Serving, source: RegistrySource) => Promise<T>,
  misrouted?: ReadonlyMap<string, string>,
): Promise<T> => {
  const serving = await servingOverHttp(imaginedSource(), misrouted)
  try {
    return await use(serving, httpSource(serving.origin))
  } finally {
    await serving.close()
  }
}

/** `toopo add` decided against whatever registry it is handed, in one project. */
const installing = (
  root: string,
  held: HeldRegistry,
  contract = 'number/round',
): InstallOutcome =>
  prepareInstallation(held, {
    root,
    configuration: { version: 1, directory: 'src/lib/toopo' },
    lockfile: EMPTY_LOCKFILE,
    contract,
    implementation: null,
    at: A_PINNED_INSTANT,
  })

const writesOf = (outcome: InstallOutcome): readonly string[] => {
  if ('faults' in outcome) throw new Error(outcome.faults.join('\n'))
  if ('unchanged' in outcome) throw new Error('nothing was installed')

  return outcome.installation.writes.map((write) => write.path)
}

/** The addresses this install fetched bytes by, which is what a misrouting registry answers wrongly. */
const digestsFetched = (outcome: InstallOutcome): readonly string[] => {
  if ('faults' in outcome) throw new Error(outcome.faults.join('\n'))
  if ('unchanged' in outcome) throw new Error('nothing was installed')

  return outcome.installation.features.flatMap((feature) =>
    feature.files.map((file) => file.served.sha256),
  )
}

describe('a registry reached over a socket', () => {
  /**
   * **The guard this unit exists for.**
   *
   * The decision runs once through the loop, against a source that answers over HTTP, and once again
   * against the cache that run left behind - synchronously, with nothing on the network and no process.
   * The two plans are compared whole, and the second run is required to have asked for nothing.
   *
   * That last requirement is what makes the comparison mean something. Without it, a decision that
   * quietly refetched would still be compared - and it would be compared against the very answers it
   * had just been given, which is a round trip a guard cannot see.
   */
  it('the-same-decision-against-a-warm-cache-and-no-network-is-the-same-plan', async () => {
    const project = aProject()

    try {
      const { networked, offline, wanted } = await withARegistry(async (_serving, source) => {
        const overTheWire = await deciding(source, (held) => installing(project.root, held))
        const again = withoutAsking(overTheWire.arrived, (held) => installing(project.root, held))

        return { networked: overTheWire.answer, offline: again.answer, wanted: again.wanted }
      })

      expect(wanted).toEqual([])
      expect(offline).toEqual(networked)
      expect(writesOf(offline)).toEqual([
        'string/pad/pad.ts',
        'string/pad/digits.ts',
        'number/clamp/clamp.ts',
        'number/sign/sign.ts',
        'number/round/round.ts',
      ])
    } finally {
      project.remove()
    }
  })

  /**
   * What a registry over a wire answers is what a registry in this process answers.
   *
   * The comparison is the plan and not the bytes of one file, because a plan is where deduplication,
   * repointing and ordering all land - `string/pad/digits.ts` is written once and two carriers are
   * pointed at it, and that is a property of the whole answer rather than of any one file in it.
   */
  it('an-install-over-http-plans-exactly-what-the-same-registry-plans-in-process', async () => {
    const project = aProject()

    try {
      const local = await deciding(imaginedSource(), (held) => installing(project.root, held))
      const remote = await withARegistry(
        async (_serving, source) =>
          (await deciding(source, (held) => installing(project.root, held))).answer,
      )

      expect(remote).toEqual(local.answer)
    } finally {
      project.remove()
    }
  })

  /**
   * The round trips, counted at the wire rather than by the client.
   *
   * `serving-over-http.ts` records what it answered, because a client counting its own requests would
   * be counting its intentions.
   *
   * **Two depths, so the shape is measured rather than fitted to one point.** A contract that depends
   * on nothing costs four round trips; the imagined graph at depth two costs six - so a level of the
   * graph is one round trip and the cost is `4 + depth`. That is a fact about the endpoints and not
   * about this walk: a snapshot digest arrives inside a binding or inside an edge, so nobody can write
   * a walk that learns a level without a fetch.
   *
   * **The batching is what the per-round list makes visible**, and a total could not: round four fetches
   * the two edges of a frontier together and round six fetches all five files at once. A walk that asked
   * one question per round trip would answer the same total and take eleven.
   *
   * These figures are what the edge digest bought. Before `9f11770` the same install cost **8 round
   * trips and 14 requests**, because the walk asked `implementation-bindings` for every edge to learn
   * which digest it resolved to; the digest is inside the snapshot now and the closure hangs off the
   * root's alone.
   */
  it('the-walk-costs-one-round-trip-per-level-and-fetches-each-frontier-at-once', async () => {
    const project = aProject()

    try {
      const deep = await withARegistry(async (serving, source) => {
        const walked = await deciding(source, (held) => installing(project.root, held))

        return { rounds: walked.fetchedPerRoundTrip, requests: serving.asked.length }
      })

      const flat = await withARegistry(async (serving, source) => {
        const walked = await deciding(source, (held) =>
          installing(project.root, held, 'string/pad'),
        )

        return { rounds: walked.fetchedPerRoundTrip, requests: serving.asked.length }
      })

      expect(deep).toEqual({ rounds: [1, 1, 1, 2, 1, 5], requests: 11 })
      // Four round trips and five requests: `string/pad@1` depends on nothing and carries two files,
      // which the last round fetches together - the count of files is not the count of round trips.
      expect(flat).toEqual({ rounds: [1, 1, 1, 2], requests: 5 })
    } finally {
      project.remove()
    }
  })

  /**
   * **A content-addressed answer is addressed by the question, and this is what says so.**
   *
   * The registry answers a blob request with somebody else's bytes, honestly served at the address that
   * was asked for. `servedBlobFaults` compares `addressedBy` against a recompute of the bytes beside it,
   * so a client that built its answer with `servedBlob(whatArrived)` would be checking that the bytes
   * hash to their own hash and would install the wrong file with nothing objecting.
   *
   * It is the one failure no local source can have: `localSource` and `packagedSource` look an answer up
   * *by* its digest in a map keyed on it, so the pairing is held by a data structure. On a wire it is
   * held by whatever the server chooses to send.
   */
  it('bytes-served-at-the-address-that-was-asked-for-are-refused-when-they-are-not-that', async () => {
    const project = aProject()

    try {
      // Two files this graph really serves, so that one address is answered with the other's bytes -
      // honestly, at the address that was asked for, which is the answer no local source can give.
      const honest = await deciding(imaginedSource(), (held) => installing(project.root, held))
      const [asked, instead] = digestsFetched(honest.answer)
      if (asked === undefined || instead === undefined) throw new Error('the graph lost its files')

      const outcome = await withARegistry(
        async (_serving, source) =>
          (await deciding(source, (held) => installing(project.root, held))).answer,
        new Map([[asked, instead]]),
      )

      expect('faults' in outcome).toBe(true)
      expect('faults' in outcome && outcome.faults.join('\n')).toContain(
        `and not to ${asked}`,
      )
    } finally {
      project.remove()
    }
  })

  /**
   * A registry that cannot answer refuses loudly rather than answering an absence.
   *
   * `null` is *this registry holds no such thing* and is spelled `404`. Anything else that is not the
   * answer throws - because a refusal arriving as an absence is the failure `packages/validation/source.ts`
   * records one folder along, a thing that was not read passing every check for the wrong reason. An
   * installer told `null` by a registry that is merely broken would report the file as one nobody
   * publishes, which is a diagnostic naming a cause no measurement establishes.
   *
   * **Both halves on one method, because the guard is the difference between them.** The first draft
   * pointed the client at a dead port, which makes `fetch` reject before any status exists - so it
   * asserted that a connection failure throws and was named for a status it never saw. A name that
   * renders a claim its assertion does not make is the class this repository has spent its length
   * removing, and it arrived here in a guard written to close a different one.
   */
  it('a-status-that-is-neither-the-answer-nor-a-404-is-an-error-and-not-an-absence', async () => {
    const nothingIsServedAt = '0'.repeat(64)

    const absent = await withARegistry(async (_serving, source) => source.blob(nothingIsServedAt))

    expect(absent).toBe(null)

    // The same question to a registry that fails answering it: 500 rather than 404, and the client may
    // not turn that into the `null` above.
    const breaking = await servingOverHttp({
      ...imaginedSource(),
      blob: () => Promise.reject(new Error('this registry is having a bad day')),
    })

    try {
      await expect(httpSource(breaking.origin).blob(nothingIsServedAt)).rejects.toThrow(
        /answered 500/,
      )
    } finally {
      await breaking.close()
    }
  })
})
