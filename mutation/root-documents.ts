/**
 * What a guard over one of this repository's root documents reads.
 *
 * `README.md` and `CONTRIBUTING.md` are the two pages a stranger meets, and they are Markdown, which
 * computes nothing. So every figure in them is a transcription, and `readme.test.ts` and
 * `contributing.test.ts` are what stop a transcription from becoming the false half of a true page.
 * This is the apparatus those two share: the document itself, and the catalogue they both transcribe
 * from.
 *
 * **It exists because the second guard needed the first's upstream.** `contributing.test.ts` has
 * counted the five records since it was written; ADR-0113 gave the README a figure over the same
 * records, and writing the same four lines a second time would have been two statements of one
 * question about one set - which is exactly the duplication `paths.ts` refuses one folder along, in
 * those words.
 *
 * The name is a union rather than a string, on the rule ADR-0054 states: where a shape can make a
 * wrong value fail to compile, that shape is reached for before a sentence is written. A third root
 * document adds a member here and nothing else.
 *
 * **`theCatalogue` is read here and nowhere else under `mutation/`**, which is the whole of why this module
 * exists and is why the second reader below sits beside the first rather than in the guard that wants
 * it. One asks the catalogue a question about all of it and the other about one member of it; both are
 * questions a root document asks, and answering them from two copies of the same import is how the two
 * come to disagree about what the catalogue is. ADR-0114.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderContract } from '../packages/registry/address.ts'
import type { ContractRecord } from '../packages/registry/contract-record.ts'
import { localReadApi } from '../packages/registry/local-read-api.ts'
import type { ContractSource } from '../packages/registry/serialise.ts'
import { REPOSITORY_ROOT, serialiseContract } from '../packages/registry/serialise.ts'
import { theCatalogue } from '../packages/registry/the-catalogue.ts'
import { THE_REPOSITORY } from './paths.ts'

/** The Markdown documents at the root of this repository that a guard here resolves. */
export type RootDocument = 'README.md' | 'CONTRIBUTING.md'

export const rootDocument = (name: RootDocument): string =>
  readFileSync(join(THE_REPOSITORY, name), 'utf8')

/**
 * One section of a root document, collapsed, from its heading to the next heading of the same level.
 *
 * **A guard about a paragraph needs an address for it, and a heading is the only one a hand-written
 * page has.** Asking whether a claim is *somewhere* in a document is answered by any copy of it, and
 * these documents repeat themselves by design: `README.md` names every contract of the catalogue in
 * one table and one contract in its demonstration, so a guard reading the whole page cannot tell the
 * demonstration from the table. That is the shape ADR-0130 records, met here on prose rather than on
 * a rendered page.
 *
 * Collapsed, on the discipline the two guard files already follow: where a paragraph wraps is not a
 * fact about anything asserted in it, and an expectation carrying a column width is one that reddens
 * on a re-flow.
 *
 * It answers `''` for a heading that is not there, and a caller refuses that rather than sweeping it -
 * a population built from a heading somebody retitled is empty, and an empty population is the one
 * shape that passes while establishing nothing. ADR-0172.
 */
export const theSectionOn = (name: RootDocument, heading: string): string => {
  const document = rootDocument(name)
  const opens = document.indexOf(`## ${heading}\n`)
  if (opens === -1) return ''

  const body = document.slice(opens + heading.length + 4)
  const closes = body.indexOf('\n## ')

  return (closes === -1 ? body : body.slice(0, closes)).replace(/\s+/g, ' ')
}

/**
 * The contracts a reader can install, each with the banner its copied file carries.
 *
 * **What a document may claim about an installed file is bounded by what a reader can install**, so
 * the population is the served index's own `installable` rather than the catalogue: `array/group-by@1`
 * is refused, nobody receives its header, and counting it would let a form nobody meets answer for a
 * form somebody does.
 *
 * It is here rather than in the guard that wants it for this module's own reason: `theCatalogue` is
 * read here and nowhere else under `mutation/`, and a second import of it is how two answers to one
 * question about the catalogue come to disagree. ADR-0114, ADR-0172.
 */
export const installableContracts = (): readonly ContractSource[] => {
  const served = new Set(
    localReadApi()
      .contractIndex()
      .entries.filter((entry) => entry.installable)
      .map((entry) => renderContract(entry.address)),
  )

  return theCatalogue.filter((source) => served.has(renderContract(source.address)))
}

/**
 * Every contract of the catalogue, serialised, which is the form both documents count over.
 *
 * Read through the serialiser rather than off the modules, because what a document publishes is what
 * the registry would serve: a lifecycle, a case table and a surface are fields of a record, and a
 * count taken off `contract.ts` would be counting something no reader can ask the registry for.
 */
export const theCatalogueRecords = (): readonly ContractRecord[] =>
  theCatalogue.map((source) => serialiseContract(REPOSITORY_ROOT, source))

/**
 * One contract of the catalogue, addressed by the folder it lives in.
 *
 * A document that shows what a contract *is* has to read one, and the folder is what a guard already
 * holds: `THE_SUITES` maps a battery's name to the path of the contract it measures, so the caller
 * names a contract once and this resolves it. Serialised for the reason above - what a document shows
 * of a contract is what the registry would serve of it, and the declaration on disk is one step
 * upstream of that.
 */
export const theCatalogueSourceIn = (folder: string): ContractSource | undefined =>
  theCatalogue.find((entry) => entry.folder === folder)

export const theCatalogueRecordIn = (folder: string): ContractRecord | undefined => {
  const source = theCatalogueSourceIn(folder)

  return source === undefined ? undefined : serialiseContract(REPOSITORY_ROOT, source)
}
