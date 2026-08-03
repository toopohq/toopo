import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'

import { caseAddressFaults, contractAddressFaults, renderContract } from './address.js'
import { REPOSITORY_ROOT, serialiseContract } from './serialise.js'
import { eachContract, theFive } from './the-five.js'

/**
 * A record cannot drift from the contract it describes.
 *
 * Almost everything in a record is read from the module, so almost nothing can drift. What can is
 * what a module cannot hold: a declared *type* is not a value, and neither is the union a profile's
 * class comes from, so both are transcribed - and a transcription with no guard on it is exactly the
 * decorative claim this repository sells against. The guards below are what make transcription
 * acceptable.
 *
 * The whitespace normalisation is not laxity. `GroupBy` and `Duration` are written over several
 * lines in their contracts and rendered on one line by a page; requiring byte equality would make a
 * reformatting of `contract.ts` break a record that still says the same thing.
 */

const sourceOf = (folder: string, file: string): string =>
  readFileSync(join(REPOSITORY_ROOT, folder, file), 'utf8').replace(/\r\n/g, '\n')

const flattened = (text: string): string => text.replace(/\s+/g, ' ').trim()

describe('the five, read against their own source', () => {
  it.each(eachContract)(
    'every-declared-type-occurs-in-the-contract-%s',
    (_name, source) => {
      const contract = flattened(sourceOf(source.folder, 'contract.ts'))
      const declarations = [
        ...source.exports.map((entry) => ({ name: entry.typeName, text: entry.text })),
        ...source.supportingTypes,
      ]

      const missing = declarations
        .filter((entry) => !contract.includes(flattened(`export type ${entry.name} = ${entry.text}`)))
        .map((entry) => entry.name)

      expect(missing).toEqual([])
    },
  )

  it.each(eachContract)(
    'the-answer-is-the-export-the-identity-names-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const answer = record.surface.exports.find((entry) => entry.role === 'the-answer')

      expect(answer?.name).toBe(record.identity.exportName)
    },
  )

  /**
   * Both directions, because each one catches a different mistake. A class a profile uses and the
   * vocabulary does not declare is a transcription that missed a member; a class declared and used by
   * nothing is a member that was renamed in the contract and left behind here.
   */
  it.each(eachContract)(
    'the-profile-vocabulary-and-the-profiles-agree-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const declared = record.benchmarks.vocabulary.map((entry) => entry.name)
      const used = record.benchmarks.profiles.map((profile) => profile.class)

      expect({
        usedButNotDeclared: [...new Set(used.filter((entry) => !declared.includes(entry)))],
        declaredButNotUsed: declared.filter((entry) => !used.includes(entry)),
      }).toEqual({ usedButNotDeclared: [], declaredButNotUsed: [] })
    },
  )

  /**
   * `provenanceOf` already refuses a citation it cannot resolve, so this is green by construction
   * today. It is written anyway, and named for what it measures rather than for what it asserts: the
   * count is the thing worth reading. Four cases of one hundred and eighty-seven cite a mutant, and a
   * reader of the registry should be able to see that number without counting the table by hand.
   */
  it('every-mutation-provenance-resolves :: four cases of the five cite a battery cell', () => {
    const cited = theFive.flatMap((source) =>
      serialiseContract(REPOSITORY_ROOT, source)
        .caseTables.flatMap((table) => table.cases)
        .filter((entry) => entry.provenance.kind === 'found-by-mutation'),
    )

    expect(cited).toHaveLength(4)
  })

  /**
   * A case identifier is unique within the *contract*, not within the table it sits in - which is
   * what makes it an address the site can anchor on and the API can cite. Two of the five carry two
   * tables, so this is the only place the pair is checked across both of them.
   */
  it.each(eachContract)(
    'every-case-is-addressable-across-the-whole-contract-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const ids = record.caseTables.flatMap((table) => table.cases.map((entry) => entry.id))

      expect({
        malformed: ids.flatMap((id) => caseAddressFaults({ contract: record.address, case: id })),
        duplicated: [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))],
      }).toEqual({ malformed: [], duplicated: [] })
    },
  )

  it.each(eachContract)(
    'the-address-is-well-formed-%s',
    (_name, source) => {
      expect(contractAddressFaults(source.address)).toEqual([])
    },
  )

  it('no-two-contracts-share-an-address :: an address is what the whole registry is keyed on', () => {
    const rendered = theFive.map((source) => renderContract(source.address))

    expect(new Set(rendered).size).toBe(rendered.length)
  })

  /**
   * The one transcribed thing in the pointing arm of `ProfileSamples`.
   *
   * Same discipline as a declared type, for the same reason and with the same normalisation: a
   * contract that stopped producing its samples would take the expression out of `contract.ts` and
   * redden this. What it cannot see is a text that survives for another reason, which is why the
   * field is `one-directional` and why `the-five.ts` names the one instance in the five.
   */
  it.each(eachContract)(
    'every-produced-expression-occurs-in-the-contract-%s',
    (_name, source) => {
      const contract = flattened(sourceOf(source.folder, 'contract.ts'))
      const missing = Object.entries(source.benchmarks.producedBy ?? {})
        .filter(([, expression]) => !contract.includes(flattened(expression)))
        .map(([profile]) => profile)

      expect(missing).toEqual([])
    },
  )

  /**
   * A profile the source names and the contract does not have would be a pointing arm attached to
   * nothing, and the record would silently keep carrying the samples it was meant to omit.
   */
  it.each(eachContract)(
    'every-produced-profile-exists-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const known = new Set(record.benchmarks.profiles.map((profile) => profile.name))
      const named = Object.keys(source.benchmarks.producedBy ?? {})

      expect(named.filter((name) => !known.has(name))).toEqual([])
    },
  )

  it.each(eachContract)(
    'every-harness-file-is-hashed-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const wrong = record.harness.filter(
        (file) => !/^[0-9a-f]{64}$/.test(file.sha256) || file.bytes <= 0,
      )

      expect(wrong.map((file) => file.path)).toEqual([])
    },
  )
})
