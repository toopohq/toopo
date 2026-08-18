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
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ContractRecord } from '../packages/registry/contract-record.ts'
import { REPOSITORY_ROOT, serialiseContract } from '../packages/registry/serialise.ts'
import { theFive } from '../packages/registry/the-five.ts'
import { THE_REPOSITORY } from './paths.ts'

/** The Markdown documents at the root of this repository that a guard here resolves. */
export type RootDocument = 'README.md' | 'CONTRIBUTING.md'

export const rootDocument = (name: RootDocument): string =>
  readFileSync(join(THE_REPOSITORY, name), 'utf8')

/**
 * Every contract of the catalogue, serialised, which is the form both documents count over.
 *
 * Read through the serialiser rather than off the modules, because what a document publishes is what
 * the registry would serve: a lifecycle, a case table and a surface are fields of a record, and a
 * count taken off `contract.ts` would be counting something no reader can ask the registry for.
 */
export const theCatalogueRecords = (): readonly ContractRecord[] =>
  theFive.map((source) => serialiseContract(REPOSITORY_ROOT, source))
