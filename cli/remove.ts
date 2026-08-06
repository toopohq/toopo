/**
 * `toopo remove` - the way out, and the reason a tool needs one.
 *
 * Before this existed the only way to uninstall a feature was to edit `toopo.lock` by hand: the folder
 * could be deleted, and the next `toopo update --apply` put it straight back under the verdict
 * `restored` - *it was gone, and this puts it back* - because `askedFor` is sticky towards true and a
 * root never stops being one. That is a contradiction at the middle of the client. The lockfile is the
 * one file whose whole value is that nobody edits it by hand, and it was the only exit. **A tool you
 * cannot leave is a tool you do not enter.**
 *
 * ---------------------------------------------------------------------------
 * A removal is a reconciliation with one feature demoted, and that is the whole of it
 * ---------------------------------------------------------------------------
 *
 * Asking for a feature to go is asking for it to stop being a root. Everything else follows from
 * re-planning what remains: what only it pulled in leaves with it, a shared blob another carrier still
 * needs is rewritten in that carrier's folder, a file the user edited is not deleted, and the feature
 * itself stays if something else still reaches it. None of that is written here - it is `reconcile.ts`,
 * shared with `update`, and this module supplies two things: the name of the feature that stops being a
 * root, and the binding policy `as-the-lockfile-records-it`.
 *
 * **The name, and not a lockfile with the demotion already applied.** This module used to clear
 * `askedFor` itself and hand the modified file over, which made one value answer both *what does the
 * project hold* and *what does this command want as roots*. A held-back feature then recorded the
 * demotion while the screen said nothing had changed - the lockfile moved on a run reported as having
 * moved nothing. `ReconcileRequest.demoted` is the repair, and it is the reason a removal can now say
 * *nothing changed* and be right.
 *
 * **The policy is the load-bearing half.** A removal that re-planned the remaining roots at *today's*
 * publication would not merely update four features nobody asked about; it would decide which files
 * leave from a graph that is not the one on disk. A root republished without a dependency, or without
 * a file it used to share, would have that file planned away and deleted - while the version actually
 * installed goes on importing it.
 *
 * ---------------------------------------------------------------------------
 * Four answers, and the one that matters most is not a refusal
 * ---------------------------------------------------------------------------
 *
 *   not in the lockfile        refused, with what the project does hold
 *   held, never asked for      refused, naming the feature that imports it
 *   asked for, still reached   it stays, it stops being a root, and the screen says so
 *   asked for, reached by none it goes, and so does what only it pulled in
 *
 * The third is the one this file is most careful about. *I asked to take it out and it is still there*
 * is the exact moment somebody stops trusting a tool, so it is never left to be inferred from a report
 * with nothing in it: the feature is named, the reason is named, and what did change - it is no longer
 * a root, so it leaves the day nothing imports it - is said in the same breath.
 *
 * The second is a refusal rather than a silent demotion because there is nothing to demote: the user
 * never asked for it, so clearing a flag that is already false would write nothing and report nothing,
 * and answering "done" to that is answering a question nobody asked.
 */

import type { ContractAddress } from '../registry/address.js'
import { renderContract } from '../registry/address.js'
import type { LockedFeature, Lockfile } from '../registry/implementation-record.js'
import type { Configuration } from './configuration.js'
import type { Reconciliation } from './reconcile.js'
import { reconcileProject } from './reconcile.js'
import { contractTyped } from './resolve.js'
import type { RegistrySource } from './source.js'

export type RemoveRequest = {
  readonly root: string
  readonly configuration: Configuration
  readonly lockfile: Lockfile
  /** As the user typed it: `domain/name` or `domain/name@major`. */
  readonly contract: string
  /** The instant recorded in the lockfile, supplied rather than read, so a guard is reproducible. */
  readonly at: string
}

/**
 * What the removal *decided* about the feature that was named.
 *
 * A decision and not an outcome, and the two come apart in one case: a feature whose file the user
 * edited is held back, so it is decided to leave and stays on disk. That is not a third member here -
 * being held back is a property of a feature in any reconciliation, it is already on its
 * `FeatureOutcome`, and duplicating it into this union would be two places to read one fact.
 */
export type Departure =
  | 'leaves'
  /** Still reached by another root, so it stays and stops being one. */
  | 'stays-as-a-dependency'

export type Removal = {
  readonly named: ContractAddress
  readonly departure: Departure
  /** The roots that still reach it, for a feature that stays. Empty for one that leaves. */
  readonly stillReachedBy: readonly ContractAddress[]
  readonly reconciliation: Reconciliation
}

export type RemoveOutcome =
  | { readonly removal: Removal }
  | { readonly faults: readonly string[] }

/**
 * Contracts as a sentence names them, so that a refusal reads and does not enumerate.
 *
 * There is no name for an empty list here, and there used to be: `something else`, which would have
 * been this tool inventing a subject for a claim about somebody's project. Nothing calls it with an
 * empty list - both call sites derive theirs from `reachedBy` and act only when it holds something -
 * so the fallback existed for a state that cannot occur and could only have printed a falsehood.
 */
export const listed = (contracts: readonly ContractAddress[]): string => {
  const names = contracts.map(renderContract)

  return names.length <= 1
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} and ${names.at(-1) as string}`
}

/**
 * The feature the user named, found in the lockfile and never in the catalogue.
 *
 * A removal names something the project holds, so the project is what answers. Resolving through the
 * index instead would make a feature unremovable the day the catalogue stopped serving it, which is
 * the tool refusing to let go of something it put there.
 */
const theOneNamed = (
  lockfile: Lockfile,
  typed: string,
): { readonly feature: LockedFeature } | { readonly faults: readonly string[] } => {
  const wanted = contractTyped(typed)
  if (Number.isNaN(wanted.major)) {
    return {
      faults: [`\`${typed}\` does not name a major version, which is a whole number from 1 upwards`],
    }
  }

  const held = lockfile.features.filter(
    (feature) =>
      feature.contract.name === wanted.name &&
      (wanted.major === null || feature.contract.major === wanted.major),
  )

  const first = held[0]
  if (first === undefined) {
    const installed = lockfile.features.map((feature) => renderContract(feature.contract))

    return {
      faults: [
        `toopo.lock does not record \`${typed}\`, so there is nothing of it to take out.` +
          (installed.length === 0
            ? ''
            : `\nThis project holds:\n${installed.map((what) => `  ${what}`).join('\n')}`),
      ],
    }
  }

  if (held.length > 1) {
    return {
      faults: [
        `\`${typed}\` names ${held.length} majors this project holds - ` +
          `${held.map((feature) => renderContract(feature.contract)).join(', ')}. Ask for one of them.`,
      ],
    }
  }

  return { feature: first }
}

export const prepareRemoval = (source: RegistrySource, request: RemoveRequest): RemoveOutcome => {
  const named = theOneNamed(request.lockfile, request.contract)
  if ('faults' in named) return named

  const address = named.feature.contract
  const outcome = reconcileProject(source, {
    root: request.root,
    configuration: request.configuration,
    lockfile: request.lockfile,
    demoted: address,
    boundAs: 'as-the-lockfile-records-it',
    at: request.at,
  })

  if ('faults' in outcome) return outcome

  const { reconciliation } = outcome
  const what = renderContract(address)

  /**
   * Whether it stays is read off the very list that says who keeps it, and not off a second one.
   *
   * The two agree by construction - `reachedBy` holds every implementation of every root's closure,
   * which is exactly what the plan holds - and asking them separately is how they come to disagree.
   * It also removes a sentence that could only ever be false: with `stays` derived from the planned
   * features, an empty `stillReachedBy` reached the screen that names what imports it, and the only
   * thing to name was a fallback reading *something else imports it*.
   */
  const stillReachedBy = reconciliation.reachedBy.get(what) ?? []

  if (stillReachedBy.length === 0) {
    return {
      removal: { named: address, departure: 'leaves', stillReachedBy: [], reconciliation },
    }
  }

  /**
   * Refused rather than demoted, because it was never a root and there is nothing to clear.
   *
   * The sentence names the feature that imports it, which is the whole difference between an answer
   * somebody can act on and one they argue with. It comes out of the reconciliation's own resolution
   * rather than from a second walk, which is why `reachedBy` exists at all.
   */
  if (!named.feature.askedFor) {
    return {
      faults: [
        `${what} is in this project because ${listed(stillReachedBy)} ${
          stillReachedBy.length === 1 ? 'imports' : 'import'
        } it, and you never asked for it yourself - so there is nothing of yours to take back. ` +
          `Removing ${stillReachedBy.length === 1 ? 'that feature' : 'those features'} is what would ` +
          `take this one with it.`,
      ],
    }
  }

  return {
    removal: { named: address, departure: 'stays-as-a-dependency', stillReachedBy, reconciliation },
  }
}
