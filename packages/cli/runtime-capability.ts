/**
 * Whether the runtime this client is standing in carries what a contract requires of one. ADR-0249.
 *
 * ---------------------------------------------------------------------------
 * Why the reading is a shape and not a presence
 * ---------------------------------------------------------------------------
 *
 * `typeof Temporal !== 'undefined'` is the obvious reading and it answers **yes** on a runtime that
 * carries the draft rather than the language. Measured at `7fcd444` on node v24.15.0, V8
 * 13.6.233.17: under `--harmony-temporal` the global exists and has eleven own property names,
 * `Calendar` and `TimeZone` among them - the two the erratum removed. A contract written against the
 * published specification would find those two and every one of its answers would still be wrong.
 *
 * So the reading is the shape the specification settled, expressed as the absence of what it took
 * out. That is also the whole argument for a capability over a version, one folder along: a version
 * cannot separate those two runtimes, because they are the same version.
 *
 * ---------------------------------------------------------------------------
 * Why a host is a parameter
 * ---------------------------------------------------------------------------
 *
 * `command.ts` states the property this folder protects: everything this tool decides is reachable
 * from a guard, with no process, no working directory and no clock. A reading of `globalThis` is
 * ambient input, so it is taken once at the edge and travels as a value - which is what
 * `InstallRequest.at` already does for the instant, and for the same reason.
 */

import type { RuntimeCapability } from '../registry/runtime-capability.js'
import {
  THE_RUNTIME_CAPABILITIES,
  WHAT_A_CAPABILITY_NEEDS,
} from '../registry/runtime-capability.js'

/** A runtime, reduced to the only thing this client may ask of one: what it has on its global. */
export type TheHost = Readonly<Record<string, unknown>>

/**
 * What `Temporal` carried before the erratum, and carries nowhere the language published it.
 *
 * Either name is enough to decide, and both are named because a runtime shipping one of the two is
 * a runtime nobody here has seen and is not one this reading should call *the language*.
 */
const WITHDRAWN_FROM_TEMPORAL: readonly string[] = ['Calendar', 'TimeZone']

/**
 * How each capability is looked for, keyed by the vocabulary.
 *
 * Total by construction: a capability added to the registry's union does not compile here until
 * somebody has said how a runtime is asked for it. That join is the whole of what stops the field
 * being a word nothing looks for - which is the state `environments` has been in since it was
 * written.
 */
export const THE_READING_FOR: Readonly<
  Record<RuntimeCapability, (host: TheHost) => boolean>
> = {
  temporal: (host) => {
    const temporal = host['Temporal']
    if (typeof temporal !== 'object' || temporal === null) return false

    const names = new Set(Object.getOwnPropertyNames(temporal))

    return WITHDRAWN_FROM_TEMPORAL.every((withdrawn) => !names.has(withdrawn))
  },
}

export const whatARuntimeCarries = (host: TheHost): ReadonlySet<RuntimeCapability> =>
  new Set(THE_RUNTIME_CAPABILITIES.filter((capability) => THE_READING_FOR[capability](host)))

/** The one ambient reading, taken at the edge so that every decision under it is a function. */
export const whatThisRuntimeCarries = (): ReadonlySet<RuntimeCapability> =>
  whatARuntimeCarries(globalThis as unknown as TheHost)

/**
 * A runtime carrying none of the vocabulary, which is what every runtime this repository runs on is.
 *
 * Named rather than written out at each of fifteen call sites, and it is the honest value there: the
 * matrix is node 22.18 and 24, neither carries Temporal, and a guard that wrote `new Set()` would be
 * saying the same thing without saying which runtime it meant.
 */
export const A_RUNTIME_CARRYING_NOTHING: ReadonlySet<RuntimeCapability> = new Set()

export const whatTheRuntimeLacks = (
  required: readonly RuntimeCapability[],
  carried: ReadonlySet<RuntimeCapability>,
): readonly RuntimeCapability[] => required.filter((capability) => !carried.has(capability))

/**
 * The refusal, as a door rather than a wall. ADR-0039.
 *
 * It names the contract, what is missing, what that capability means, and the one thing the reader
 * can do about it - because the alternative is somebody installing a file that does not compile and
 * throws, which is the defect ADR-0247 measured and this field exists to prevent.
 *
 * **What it is honest about is which runtime it read.** The client cannot see the runtime the
 * installed source will run on; it can see the one it is standing in, which is the same proxy `npm`
 * uses for `engines` and, for `npx toopo add`, is the project's own. A reader whose project targets
 * a runtime this one is not runs the command under that runtime, and the sentence says so.
 */
export const theRuntimeRefuses = (
  contract: string,
  required: readonly RuntimeCapability[],
  carried: ReadonlySet<RuntimeCapability>,
): readonly string[] => {
  const lacking = whatTheRuntimeLacks(required, carried)
  if (lacking.length === 0) return []

  return lacking.map(
    (capability) =>
      `${contract} requires \`${capability}\` of the runtime, and this one does not carry it. ` +
      `It needs ${WHAT_A_CAPABILITY_NEEDS[capability]}. Nothing was written. Run the command under ` +
      `the runtime your project targets, and it will install there.`,
  )
}
