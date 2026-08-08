/**
 * Which licence covers what, and the two lines that say so on the one kind of file that leaves.
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
 */

import type { ContractAddress } from './address.js'
import { contractUrl, renderContract } from './address.js'

/** What this repository is under, and the value `package.json` carries. */
export const THE_REPOSITORY_LICENCE = 'MIT'

/** What the installer's copies are under. An SPDX identifier, because the marking has to be machine-read. */
export const THE_COPIED_LICENCE = 'MIT-0'

/**
 * The holder and the year, written once.
 *
 * A year here is a fact about authorship rather than about a build, so it is a literal and not a clock:
 * `CLOCK_DEPENDENCE_RULE` is about values that make two runs disagree, and this one does not move
 * between runs. It moves when somebody publishes a new contract in a new year, which is the correct
 * behaviour for a copyright line and the reason it is not derived from anything.
 */
export const THE_COPYRIGHT = 'Copyright (c) 2026 Mathis Perron'

/**
 * The two lines that head every file the installer copies, and the only place they are spelled.
 *
 * The files themselves carry a transcription of this, checked byte for byte by
 * `every-file-the-installer-copies-is-marked-mit-0`. That is the shape `the-five.ts` already has for a
 * transcribed signature: one declaration, N transcriptions, a guard resolving them - rather than a
 * build step, which would put a byte of an installed file behind something no reader can see.
 */
export const licenceHeaderOf = (address: ContractAddress): string =>
  `// ${renderContract(address)} - ${contractUrl(address)}\n` +
  `// ${THE_COPYRIGHT}. SPDX-License-Identifier: ${THE_COPIED_LICENCE}\n`

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
