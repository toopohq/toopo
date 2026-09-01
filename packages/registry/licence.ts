/**
 * Which licence covers what, and the two lines that say so on the one kind of file that leaves.
 * ADR-0047 is which licence covers what, and why the perimeter is derived rather than listed.
 *
 *
 * ---------------------------------------------------------------------------
 * Two licences, and the asymmetry that produces them
 * ---------------------------------------------------------------------------
 *
 * This repository is MIT. What `toopo add` copies into somebody's project is MIT-0 - the MIT licence
 * with its attribution clause removed - and the asymmetry is the product's own: a tool is a dependency
 * you install, and a contract's implementation is source code that becomes yours to read, edit and
 * maintain.
 *
 * MIT's clause requires the copyright notice *and the permission notice* - the whole paragraph, about
 * 1 100 characters - to travel with every substantial portion of the software. An installed file here
 * is 2 259 bytes at its smallest, so satisfying that clause literally means a licence taking a third of
 * what the user receives, on the one figure a contract page sells. Satisfying it with a one-line
 * identifier is the ordinary convention and is not what the clause asks for, which would leave every
 * user quietly non-compliant for a function they now maintain themselves. MIT-0 removes the question
 * rather than answering it badly.
 *
 * ---------------------------------------------------------------------------
 * The header is provenance first, and a licence marking second
 * ---------------------------------------------------------------------------
 *
 * Under MIT-0 nothing obliges a user to keep these two lines, and they may delete them the moment the
 * file lands. What they buy is the first line: the address of the contract that file was verified
 * against, so that whoever finds it in six months can look up what it is meant to do and check that it
 * still does. That is the whole reason this catalogue exists, printed on the artefact.
 *
 * **The address and not a slug**, because `renderContract` is frozen with the major version - so the
 * header cannot drift from what it names. **No implementation version**, because a version is minted by
 * whatever serves the file (`0.0.0-local` today) and does not exist in the source: writing one here
 * would be a second declaration of it, and a false one.
 *
 * **ASCII only.** A hyphen and not an en dash, for the reason ` :: ` is ASCII in a guard title and for
 * one more that is specific to this file: these two lines are the only bytes of this repository that
 * land in a codebase whose encoding, editor and toolchain nobody here can see.
 *
 * ---------------------------------------------------------------------------
 * The perimeter is derived, never written down
 * ---------------------------------------------------------------------------
 *
 * Which files are MIT-0 is not a list of paths in this file. It is whatever `referenceImplementationOf`
 * says the installer copies, and `publication.test.ts` resolves the two against each other in both
 * directions. A hand-written perimeter would be a legal boundary kept by a declaration nothing
 * enforces - and the day a contract gains a second file, the installer would copy a file this
 * repository believes is MIT into somebody else's project under a header saying MIT-0. Getting a
 * licence wrong inside somebody else's repository is more expensive than any defect this project has
 * repaired so far, and it is silent.
 *
 * ---------------------------------------------------------------------------
 * Why `Banner` is a declaration and is not that perimeter
 * ---------------------------------------------------------------------------
 *
 * A contract declares which of two banner forms its copied file carries, and that declaration is
 * per-contract rather than derived. It is set beside the refusal above rather than filed in a record,
 * because a module that refuses a list and then holds one owes the distinction where the refusal is
 * written.
 *
 * **The refusal above is a safety property and this declaration cannot violate it.** A wrong entry in
 * a list of *paths* ships a file under a licence the project did not choose, silently, into somebody
 * else's repository. A wrong entry here ships an MIT-0 file under the other MIT-0 header: both forms
 * carry `SPDX-License-Identifier: MIT-0`, both are the same licence, and being wrong mislicences
 * nothing. What it would do instead is print a copyright line on a file that should not carry one, or
 * leave one off a file that does - and `every-file-the-installer-copies-is-marked-mit-0` compares
 * every copied file against this composition byte for byte, so a wrong declaration is red before it is
 * anything else. **The boundary the refusal protects is enforced by a guard that already exists; the
 * declaration sits inside it.**
 *
 * **Why there is a second form at all.** The front page promises, in as many words, that *the source
 * lands in your repository and it is yours*, and the second line of the file that lands said
 * `Copyright (c) 2026 <the author>`. MIT-0 requires no attribution, so there was never anything to
 * enforce - but nobody reads a licence, and everybody reads the first two lines of the file they have
 * just pasted. The promise was contradicted by the artefact.
 *
 * **And why the old form survives rather than being replaced.** The five published contracts have
 * their `reference.ts` frozen by a digest a lockfile in somebody else's project already holds, so
 * their bytes cannot change and permanent rule 6 is why. The discriminator between the two forms is
 * therefore a date - written before or after the day the copyright came out - and nothing in this
 * repository's data derives a date in history. That is why it is declared rather than computed, and
 * it is the whole reason this module carries a declaration at all. ADR-0159.
 */

import type { ContractAddress } from './address.js'
import { contractUrl, renderContract } from './address.js'

/** What this repository is under, and the value `package.json` carries. */
export const THE_REPOSITORY_LICENCE = 'MIT'

/** What the installer's copies are under. An SPDX identifier, because the marking has to be machine-read. */
export const THE_COPIED_LICENCE = 'MIT-0'

/**
 * Whose name the frozen headers carry, and the one place in this repository it is still spelled.
 *
 * **It was the author of the package until ADR-0190 and it is not one any more.** A single constant
 * fed both, on the argument that two literals of one person's name agree on the day they are written
 * and are two things to correct afterwards. What that argument did not carry is that only one of the
 * two can ever be corrected: this string is inside the contract and implementation digests of the
 * five contracts published while `a-copyright-beside-the-marking` was the current banner, so it is
 * frozen for the life of those majors, where the manifest's `author` is rewritten by any release. A
 * shared literal between a frozen value and a free one does not keep the two equal - it holds the
 * free one still.
 *
 * So the name is spelled here, reaches the line below and reaches nothing else. `THE_AUTHOR` composes
 * the manifest's own field from the project's name, which is what a reader of `package.json` is
 * looking for and what a personal name was standing in for.
 *
 * **The recomposition needs no guard of its own**: `every-file-the-installer-copies-is-marked-mit-0`
 * compares every copied file against `licenceHeaderOf` byte for byte, so a composition off by a
 * character is already red - and `every-published-binding-still-hashes-to-what-it-was-published-as`
 * refuses it a second time, rebuilding each of the five at the commit it was published from.
 */
export const THE_COPYRIGHT_HOLDER = 'Mathis Perron'

/**
 * The holder and the year, written once.
 *
 * A year here is a fact about authorship rather than about a build, so it is a literal and not a clock:
 * `CLOCK_DEPENDENCE_RULE` is about values that make two runs disagree, and this one does not move
 * between runs. It moves when somebody publishes a new contract in a new year, which is the correct
 * behaviour for a copyright line and the reason it is not derived from anything.
 *
 * **It reaches fewer files than it used to and it is not dead code.** Only the contracts declaring
 * `a-copyright-beside-the-marking` compose from it now - the published ones, whose bytes are frozen -
 * and every one of them carries this exact string, so `every-file-the-installer-copies-is-marked-mit-0`
 * holds it as tightly as it ever did.
 */
export const THE_COPYRIGHT = `Copyright (c) 2026 ${THE_COPYRIGHT_HOLDER}`

/**
 * Which of the two second lines a contract's copied file carries.
 *
 * The vocabulary names what the line *is* rather than which era it belongs to, because an era is a
 * fact about this repository's calendar and the line is a fact about the file. A reader meeting
 * `a-copyright-beside-the-marking` on a contract knows what they will see at the top of the file
 * without having to know when it was written.
 */
export type Banner = 'a-copyright-beside-the-marking' | 'the-marking-alone'

/**
 * What a contract written from now on carries, and the only value a contract that is not yet
 * published may declare.
 *
 * `a-contract-not-yet-published-carries-the-current-banner` is what holds that, and the condition is
 * about the bytes rather than about the calendar: an unpublished contract's `reference.ts` is bound by
 * no digest, so it has no reason to keep a superseded header and every reason not to ship one.
 */
export const THE_CURRENT_BANNER: Banner = 'the-marking-alone'

/**
 * The two lines that head every file the installer copies, and the only place they are spelled.
 *
 * The files themselves carry a transcription of this, checked byte for byte by
 * `every-file-the-installer-copies-is-marked-mit-0`. That is the shape `the-catalogue.ts` already has for a
 * transcribed signature: one declaration, N transcriptions, a guard resolving them - rather than a
 * build step, which would put a byte of an installed file behind something no reader can see.
 *
 * The banner is a parameter and not a lookup, so this module holds no list and every caller has to
 * have found out which form it is asking about. `ContractSource.banner` is where the answer is
 * declared, and it is required, so a contract that does not declare one does not compile.
 */
export const licenceHeaderOf = (address: ContractAddress, banner: Banner): string =>
  `// ${renderContract(address)} - ${contractUrl(address)}\n` +
  (banner === 'a-copyright-beside-the-marking'
    ? `// ${THE_COPYRIGHT}. SPDX-License-Identifier: ${THE_COPIED_LICENCE}\n`
    : `// SPDX-License-Identifier: ${THE_COPIED_LICENCE}\n`)

/**
 * Whether a file is marked at all, asked of its own first two lines rather than of its whole text.
 *
 * A marking is a header, so it is read where a header sits. `LICENSE` quotes the two lines as an
 * example and `README.md` may too; neither is marked, and neither needs naming in an exception list -
 * which is the point, because an exception list is the hand-written perimeter this file refuses.
 */
export const isMarked = (text: string): boolean => {
  const [first, second] = text.split('\n')

  return first?.startsWith('// ') === true && second?.includes('SPDX-License-Identifier:') === true
}
