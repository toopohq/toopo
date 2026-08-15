/**
 * The refusal that is invisible at run time.
 *
 * An implementation never imports the type its contract declares. The catalogue has carried the rule
 * and its reason since the first contract was written, in `referenceImplementationRules`, and nothing
 * enforced it - so the reason is **read from that declaration** rather than restated here. A
 * transcription is a second sentence that can drift from the one the catalogue publishes, which is
 * the failure `analyse.ts` already refuses for `staticAnalysisRequirements`.
 *
 * **This is the most dangerous thing stage 1 refuses, and it is dangerous because it is quiet.** Every
 * other rule here refuses something that does something. A submission that imports its contract's type
 * runs correctly, answers every case, satisfies every property, and ships a signature check that
 * cannot go red - so the one guard the contract has over its own shape is neutralised, and the whole
 * suite stays green while saying nothing. A submission does not have to be malicious to do it: it is
 * the obvious thing to write.
 *
 * **A second reason, independent of the first, and it bites even for a value import.** An
 * implementation is installed alone - `packages/registry/implementations.test.ts` requires the reference of
 * each of the five to be exactly one file - so an import of `./contract.js` resolves in this
 * repository and dangles in the user's codebase. The catalogue is distributed as source copied into
 * somebody else's project; a feature that reached back into the folder it was published from would
 * arrive broken.
 *
 * So the rule is the whole contract module and not only its types: a reference imports nothing from
 * the folder that specifies it. Measured on the catalogue, that is what all five already do - four of
 * them import nothing at all.
 */

import { STATES_ITS_OWN_SIGNATURE } from '../packages/catalogue/reference-implementation.js'

import type { Finding } from './finding.js'
import { findingAt } from './finding.js'
import { importSpecifiersIn } from './forbidden-constructs.js'
import type { ParsedSource } from './source.js'

export const OWN_SIGNATURE_RULE = 'states-its-own-signature'

/** The file a contract's declarative half lives in, which is the same in every contract folder. */
const CONTRACT_MODULE = 'contract'

/**
 * Resolve a relative specifier against the file that wrote it, without touching the disk.
 *
 * Path arithmetic rather than module resolution, because the question is not what the specifier
 * resolves to in this checkout - it is what the submission wrote. A submission whose contract import
 * failed to resolve would still have written one.
 */
const resolvedAgainst = (from: string, specifier: string): string => {
  const segments = from.replaceAll('\\', '/').split('/').slice(0, -1)

  for (const step of specifier.split('/')) {
    if (step === '.' || step === '') continue
    if (step === '..') segments.pop()
    else segments.push(step)
  }

  return segments.join('/')
}

/** `./contract.js`, `./contract.ts` and `../add/contract.js` are one thing under three spellings. */
const namesTheContractModule = (resolved: string): boolean => {
  const last = resolved.slice(resolved.lastIndexOf('/') + 1)

  return last === CONTRACT_MODULE || last.startsWith(`${CONTRACT_MODULE}.`)
}

/**
 * The catalogue's own sentence, and the one the catalogue does not carry.
 *
 * The first half is `referenceImplementationRules[0].reason`, read rather than retold, so a rule
 * reworded in the catalogue is reworded in every refusal this pipeline makes. The second half is the
 * pipeline's: it is about where a submission is *installed*, which is a fact about distribution and
 * not about how a reference is written, so putting it in the catalogue would be putting the registry's
 * business inside a rule that governs a file.
 */
const WHY = `an implementation ${STATES_ITS_OWN_SIGNATURE.name}. ${STATES_ITS_OWN_SIGNATURE.reason} An implementation is also installed alone, so this import resolves here and dangles in the codebase it is copied into.`

export const importsItsOwnContract = (source: ParsedSource): readonly Finding[] =>
  importSpecifiersIn(source).flatMap((specifier) => {
    if (!namesTheContractModule(resolvedAgainst(source.path, specifier.text))) return []

    return [findingAt(OWN_SIGNATURE_RULE, specifier.at, source, WHY)]
  })
