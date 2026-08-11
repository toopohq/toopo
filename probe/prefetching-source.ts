/**
 * A registry that is reached over the network, decided against synchronously.
 *
 * **The property under measurement.** `cli/command.ts` says *everything this tool decides is reachable
 * from a guard, with no process, no working directory and no clock*, and it is what let `toopo add` be
 * measured end to end without a sandbox. Making the registry remote puts an `await` somewhere; the only
 * question worth asking before the repository is split is *where*.
 *
 * ---------------------------------------------------------------------------
 * Fetch first, decide after - and why that cannot be one fetch
 * ---------------------------------------------------------------------------
 *
 * There is no list of what an installation needs. `resolve.ts` walks the edges each snapshot carries,
 * so which snapshot is fetched next is decided by the snapshot before it; and `plan.ts` deduplicates by
 * digest, so which blobs are fetched at all is decided by a plan that only exists once every snapshot
 * has arrived. A prefetch that knew the list in advance would be a second statement of that walk -
 * exactly what `packaging/freeze.ts` refuses to write, and for the same reason.
 *
 * So the shape is not *fetch, then decide*. It is **decide, note what was missing, fetch all of it,
 * decide again from nothing** - a fixpoint. `decide` is the installer's own function, unchanged,
 * synchronous, and run against a source that answers out of a cache. The `await` is in the loop around
 * it and never inside it, which is the whole of what the property asks.
 *
 * It terminates because a round trip writes *every* missing key into the cache, so the cache grows by
 * at least one entry per round and no key is ever missing twice. **That is why the cache has to tell
 * *not fetched* from *fetched, and the registry holds no such thing* apart**: collapsing the two makes a
 * genuinely absent answer missing for ever and the loop never ends.
 *
 * ---------------------------------------------------------------------------
 * A content-addressed answer is addressed by the question, never by what arrived
 * ---------------------------------------------------------------------------
 *
 * `servedBlob(bytes)` computes `addressedBy` from the bytes it is handed, and `servedBlobFaults`
 * compares `addressedBy` against a recompute of those same bytes. Locally that is sound, because both
 * implementations look the answer up *by* its digest in a map keyed on it. Over a wire it is a
 * tautology: whatever arrives hashes to whatever it hashes to, and the check passes on any bytes at all.
 *
 * It is `cli/artefact.ts`'s own sentence arriving one layer up - *digests recomputed from whatever is on
 * disk certify themselves and prove nothing*. So a remote source addresses every content-addressed
 * answer by the digest it **asked for**, which turns `servedSnapshotFaults` and `servedBlobFaults` into
 * the check `resolve.ts` always believed it was making. `AddressedBy` names both spellings because the
 * measurement needs the second: a claim that a verification is load-bearing is worth nothing until the
 * other arm has been watched letting a corrupted byte through.
 */

import type {
  ServedBlob,
  ServedImplementationBinding,
  ServedIndex,
  ServedRefusals,
  ServedSnapshot,
} from '../registry/response.js'
import { servedBlob } from '../registry/response.js'
import { renderContract } from '../registry/address.js'
import type { RegistrySource } from '../cli/source.js'
import type { Arrived, Wanted } from './registry-over-http.js'
import { asked, fetchOne } from './registry-over-http.js'

/**
 * Which digest a content-addressed answer claims to be.
 *
 * `by-the-question` is the only defensible one and is what a real client must do. `by-what-arrived` is
 * the control - the spelling a client falls into by reaching for `servedBlob` - and it is here to be
 * seen letting a corrupted file through.
 */
export type AddressedBy = 'by-the-question' | 'by-what-arrived'

/** What the port answers when a registry holds nothing, so that a miss is not a fabricated answer. */
const NO_INDEX: ServedIndex = { addressing: 'named', entries: [] }
const NO_REFUSALS: ServedRefusals = { addressing: 'named', refusals: [], absorbed: [] }

const bodyOf = <T>(arrived: Arrived): T | null =>
  arrived !== null && 'json' in arrived ? (arrived.json as T) : null

/**
 * A synchronous source over what has been fetched, writing down every question it could not answer.
 *
 * A miss answers exactly what the port says a registry with nothing in it answers, and never throws:
 * the decision has to be allowed to run on past a miss, because the questions *after* it are the ones a
 * single round trip is trying to gather. Its verdict on such a round is discarded - only `missing` is
 * read - and the last round is the one that asks for nothing.
 */
export const overWhatIsHeld = (
  held: ReadonlyMap<string, Arrived>,
  missing: Map<string, Wanted>,
  addressedBy: AddressedBy = 'by-the-question',
): RegistrySource => {
  const answering = (wanted: Wanted): Arrived => {
    const key = asked(wanted)
    if (!held.has(key)) {
      missing.set(key, wanted)

      return null
    }

    return held.get(key) ?? null
  }

  return {
    contractIndex: () =>
      bodyOf<ServedIndex>(answering({ method: 'contractIndex', key: '' })) ?? NO_INDEX,

    refusals: () => bodyOf<ServedRefusals>(answering({ method: 'refusals', key: '' })) ?? NO_REFUSALS,

    implementationBindings: (address) =>
      bodyOf<readonly ServedImplementationBinding[]>(
        answering({ method: 'implementationBindings', key: renderContract(address) }),
      ) ?? [],

    snapshot: (digest) => {
      const served = bodyOf<ServedSnapshot>(answering({ method: 'snapshot', key: digest }))
      if (served === null) return null

      return addressedBy === 'by-the-question' ? { ...served, addressedBy: digest } : served
    },

    blob: (sha256) => {
      const arrived = answering({ method: 'blob', key: sha256 })
      if (arrived === null || !('bytes' in arrived)) return null

      // The control is `servedBlob` verbatim, because that is the function a client reaches for and
      // the whole of what makes the check a tautology: it addresses the answer by hashing the answer.
      return addressedBy === 'by-the-question'
        ? ({ addressing: 'content-addressed', addressedBy: sha256, bytes: arrived.bytes } satisfies ServedBlob)
        : servedBlob(arrived.bytes)
    },
  }
}

export type Rounds<T> = {
  readonly answer: T
  /** How many times the decision ran. The last of them asked for nothing it did not already hold. */
  readonly decisions: number
  /** How many times the process waited on the network - always one fewer than the decisions. */
  readonly roundTrips: number
  /** What each round trip fetched, so that the walk widening is visible rather than summarised. */
  readonly fetchedPerRoundTrip: readonly number[]
  /**
   * Milliseconds inside each replay of the decision, and the whole call beside them.
   *
   * Per replay rather than summed, because the sum cannot tell a warm-up from a cost that is paid
   * again on every round - and only the second scales with the catalogue.
   */
  readonly msPerDecision: readonly number[]
  readonly totalMs: number
  /**
   * Everything that was fetched, so that the real command can be run against it afterwards.
   *
   * **The seam this exposes is the finding, not a convenience.** The loop replays the decision from
   * nothing on every round, so the decision may not write: `prepareInstallation` and `reconcileProject`
   * read the disk and change none of it, and `command.ts` - which commits - must stay *outside* the
   * loop. A warm cache is how the real entry point is then run exactly once, synchronously.
   */
  readonly held: ReadonlyMap<string, Arrived>
}

/**
 * Run a decision against a remote registry, giving it everything it turns out to ask for.
 *
 * `decide` is the installer's own entry point - `prepareInstallation`, `reconcileProject`, `search` -
 * passed in unchanged and called with a plain `RegistrySource`. Nothing it does is asynchronous, and
 * nothing about it knows a network exists.
 */
export const decidingOverTheNetwork = async <T>(
  origin: string,
  decide: (source: RegistrySource) => T,
  addressedBy: AddressedBy = 'by-the-question',
): Promise<Rounds<T>> => {
  const held = new Map<string, Arrived>()
  const fetchedPerRoundTrip: number[] = []
  const startedAt = performance.now()
  const msPerDecision: number[] = []

  for (let decisions = 1; ; decisions += 1) {
    const missing = new Map<string, Wanted>()
    const before = performance.now()
    const answer = decide(overWhatIsHeld(held, missing, addressedBy))
    msPerDecision.push(performance.now() - before)

    if (missing.size === 0) {
      return {
        answer,
        decisions,
        roundTrips: fetchedPerRoundTrip.length,
        fetchedPerRoundTrip,
        held,
        msPerDecision,
        totalMs: performance.now() - startedAt,
      }
    }

    fetchedPerRoundTrip.push(missing.size)

    const arrived = await Promise.all(
      [...missing.values()].map(
        async (wanted) => [asked(wanted), await fetchOne(origin, wanted)] as const,
      ),
    )

    for (const [key, answered] of arrived) held.set(key, answered)
  }
}
