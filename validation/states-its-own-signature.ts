/**
 * The refusal that is invisible at run time.
 *
 * An implementation never imports the type its contract declares. `catalogue/every-contract.ts` has
 * carried the rule and its reason since the first contract was written, in
 * `referenceImplementationRules`, and nothing has ever enforced it:
 *
 *   > A reference that annotated its export with the contract's own type would make the compiler
 *   > enforce conformance at authoring time and leave `signature.test-d.ts` unable to fail - a guard
 *   > that proves nothing. An implementation declares what it is; the contract checks it.
 *
 * **This is the most dangerous thing stage 1 refuses, and it is dangerous because it is quiet.** Every
 * other rule here refuses something that does something. A submission that imports its contract's type
 * runs correctly, answers every case, satisfies every property, and ships a signature check that
 * cannot go red - so the one guard the contract has over its own shape is neutralised, and the whole
 * suite stays green while saying nothing. A submission does not have to be malicious to do it: it is
 * the obvious thing to write.
 *
 * **A second reason, independent of the first, and it bites even for a value import.** An
 * implementation is installed alone - `registry/implementations.test.ts` requires the reference of
 * each of the five to be exactly one file - so an import of `./contract.js` resolves in this
 * repository and dangles in the user's codebase. The catalogue is distributed as source copied into
 * somebody else's project; a feature that reached back into the folder it was published from would
 * arrive broken.
 *
 * So the rule is the whole contract module and not only its types: a reference imports nothing from
 * the folder that specifies it. Measured on the catalogue, that is what all five already do - four of
 * them import nothing at all.
 */

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

export const importsItsOwnContract = (source: ParsedSource): readonly Finding[] =>
  importSpecifiersIn(source).flatMap((specifier) => {
    if (!namesTheContractModule(resolvedAgainst(source.path, specifier.text))) return []

    return [
      findingAt(
        OWN_SIGNATURE_RULE,
        specifier.at,
        source,
        'an implementation states its own signature and never imports the one its contract ' +
          'declares. Annotating an export with the contract\'s own type makes the compiler enforce ' +
          'conformance while it is being written, which leaves `signature.test-d.ts` unable to fail - ' +
          'so the submission would neutralise its own signature check and stay green. An ' +
          'implementation is also installed alone, so this import resolves here and dangles in the ' +
          'codebase it is copied into.',
      ),
    ]
  })
