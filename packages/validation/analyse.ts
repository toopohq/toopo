/**
 * Stage 1, composed.
 * ADR-0058 is what a contribution can be, and why the five rules are named in CONTRIBUTING.md.
 *
 *
 * The rules are written apart because they read different surfaces; they are applied together because
 * a submission is refused or it is not. What this module adds to the four rule functions is the one
 * thing none of them can know on its own: **which requirements the contract under submission
 * publishes.**
 *
 * `date/add@1` declares twenty forbidden local-time methods in `staticAnalysisRequirements`, in
 * public, *because a requirement that lives only inside a tool nobody can read is not part of a
 * contract whose whole product is auditability*. Until this module existed nothing read that
 * declaration - `the-catalogue.ts` classified it `one-directional` and said so in as many words: *nothing
 * refuses an implementation that calls `getMonth`, because the check is the validation pipeline's and
 * the pipeline does not exist.*
 *
 * So the requirements are read off the contract's own module rather than transcribed here. A
 * transcription would be a second copy that can drift, and a pipeline holding its own list of what
 * `date/add@1` forbids would have taken the declaration away from the contract that publishes it.
 *
 * **Reading a declaration is not reading an implementation.** This module evaluates the *contract*,
 * which is the specification the registry already holds and already serves; it never evaluates the
 * submission, which is the thing being vetted. That distinction is the whole of `source.ts`'s
 * opening paragraph and it survives here intact.
 */

import type { Finding } from './finding.js'
import {
  ambientStateReached,
  codeBuiltAtRunTime,
  contractForbiddenMethods,
  importsOutsideTheRegistry,
} from './forbidden-constructs.js'
import type { ParsedSource } from './source.js'
import { importsItsOwnContract } from './states-its-own-signature.js'

/**
 * One requirement a contract publishes about what its implementations may not call.
 *
 * The shape is `date/add@1`'s, because that contract is the only one that has published such a
 * requirement and inventing a wider vocabulary from one exemplar is the mistake three hand-written
 * contracts were spent avoiding. A requirement with no forbidden method is carried rather than
 * dropped: `no global state` is the second entry of that contract's list, it names no method, and it
 * is answered by `reaches-no-ambient-state` rather than by this rule.
 */
export type StaticAnalysisRequirement = {
  readonly name: string
  readonly forbiddenMethods: readonly string[]
  readonly reason: string
}

/**
 * The requirements a contract module publishes, or none.
 *
 * Read defensively because the export is optional across the catalogue - four of the five publish
 * nothing here - and a missing export is the normal case rather than an error.
 */
export const requirementsOf = (
  contractModule: Readonly<Record<string, unknown>>,
): readonly StaticAnalysisRequirement[] => {
  const declared = contractModule['staticAnalysisRequirements']
  if (!Array.isArray(declared)) return []

  return declared.filter(
    (entry): entry is StaticAnalysisRequirement =>
      typeof entry === 'object' &&
      entry !== null &&
      typeof (entry as StaticAnalysisRequirement).name === 'string' &&
      Array.isArray((entry as StaticAnalysisRequirement).forbiddenMethods) &&
      typeof (entry as StaticAnalysisRequirement).reason === 'string',
  )
}

/**
 * Every refusal stage 1 has for one file of a submission.
 *
 * The order is the order a reader wants: what the file imports, what it reaches, what it builds, and
 * last what its own contract forbids it - general to particular.
 */
export const analyseImplementation = (
  source: ParsedSource,
  requirements: readonly StaticAnalysisRequirement[],
): readonly Finding[] => [
  ...importsOutsideTheRegistry(source),
  ...importsItsOwnContract(source),
  ...ambientStateReached(source),
  ...codeBuiltAtRunTime(source),
  ...requirements.flatMap((requirement) =>
    contractForbiddenMethods(source, requirement.forbiddenMethods, requirement.reason),
  ),
]
