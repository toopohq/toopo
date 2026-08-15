import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'

import * as catalogue from '../catalogue/every-contract.js'
import { caseAddressFaults, contractAddressFaults, renderContract } from './address.js'
import { isASentence, stringsIn } from './contract-record.js'
import type { CaseTableSource, ContractSource } from './serialise.js'
import {
  CaseIsNotACall,
  GroupAddressIsTaken,
  GroupingIsNotAPartition,
  REPOSITORY_ROOT,
  serialiseContract,
} from './serialise.js'
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

  /**
   * A sentence the catalogue shares is a whole sentence wherever a contract puts it.
   *
   * **The half of the register that no guard over a field can hold.** `contract-record.ts` settles
   * that a string a page prints as a paragraph is a sentence, and `packages/site/pages.test.ts` asks it of every
   * such paragraph - but a shared value is *embedded*, so the string it lands in is a sentence whatever
   * the seam does. `DETERMINISM_ORDERING_FINDING` was a clause composed as
   * `` `...its own first answer. ${it} - L-20 is that mutant here.` `` on five of five, and every
   * contract page read *…from its own first answer. ordered under `no ambient input`…*: a sentence
   * beginning in lower case after a full stop, in the middle of a paragraph that opens and closes
   * perfectly well.
   *
   * The population is derived twice over and no constant is listed here. What the catalogue shares is
   * whatever it exports; what is *prose* is whatever carries a space, which is the one thing an
   * identifier of this repository can never do - `CLAUDE.md` chooses ` :: ` as a separator on exactly
   * that argument. Measured: nine exported strings, five of them prose, and two of the five occur in a
   * record. A sixth shared sentence is covered the day it is written.
   *
   * What is asked of an occurrence rather than of the constant, and the difference is load-bearing: a
   * clause the catalogue shares is legitimate until it lands in prose, and `CLOCK_DEPENDENCE_RULE`
   * and `GUARD_PERTURBATION_RULE` are two that never do.
   */
  it.each(eachContract)(
    'a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const shared = Object.values(catalogue).filter(
        (value): value is string => typeof value === 'string' && value.includes(' '),
      )

      const seams = [...stringsIn(record)].flatMap((carried) =>
        shared
          .filter((value) => carried.includes(value))
          .filter((value) => {
            const at = carried.indexOf(value)
            const opens = at === 0 || /[.!?] $/.test(carried.slice(at - 2, at))
            const after = carried.slice(at + value.length)

            return !(isASentence(value) && opens && (after === '' || after.startsWith(' ')))
          })
          .map((value) => `${value.slice(0, 40)}… in "…${carried.slice(0, 40)}…"`),
      )

      expect(seams).toEqual([])
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

  /**
   * The other half of the parameter reading, and the reason the reading needs no second transcription
   * to be checked against.
   *
   * A hundred and eighty-seven cases across seven tables begin with their contract's call today, so
   * every one of them is a statement about `parametersOf`'s answer - written years before it existed,
   * by five contracts that were not asked. What this guard adds is the *refusal*: a contract whose
   * cases stop being calls does not reach a record, so a page can never be asked to render arguments
   * whose names it does not have.
   *
   * `number/parse@1` with one case reordered, which is the smallest thing that can go wrong and the
   * likeliest: a sixth contract's author writing the answer before the argument.
   */
  it('a-case-that-is-not-a-call-is-refused', () => {
    const [first] = theFive as readonly ContractSource[]
    const reordered: ContractSource = {
      ...(first as ContractSource),
      caseTables: [
        {
          name: 'edge-cases',
          purpose: 'one case, written answer first',
          groups: [{ id: 'baseline', title: 'Baseline', note: null }],
          cases: [
            {
              id: 'the-answer-before-the-argument',
              group: 'baseline',
              expected: 42,
              input: '42',
              reason: null,
              provenance: 'specified',
              rationale: 'A case whose fields do not begin with the call.',
            },
          ],
        },
      ],
    }

    expect(() => serialiseContract(REPOSITORY_ROOT, reordered)).toThrow(CaseIsNotACall)
  })

  /**
   * A grouping that is not a partition does not reach a record.
   *
   * The contracts' own suite asserts the same thing through `every-case-is-grouped`, over the same
   * `groupingFaults`, and this is the *refusal* rather than the assertion: a page renders a heading
   * for every group and puts every case under one, so a table the serialiser let through with a
   * group nothing sits in would publish a heading over nothing at all.
   *
   * Four faults and one guard, because they are one question and the error names which way it gave
   * way. Written as four tables of one contract rather than four contracts, so that what differs
   * between the cases is only the fault.
   */
  it('a-grouping-that-is-not-a-partition-is-refused', () => {
    const [first] = theFive as readonly ContractSource[]
    const withTable = (table: CaseTableSource): ContractSource => ({
      ...(first as ContractSource),
      caseTables: [table],
    })

    const only = (group: string): Readonly<Record<string, unknown>> => ({
      id: 'ordinary-integer',
      group,
      input: '42',
      expected: 42,
      reason: null,
      provenance: 'specified',
      rationale: 'One case, so that the grouping is the only thing under test.',
    })

    const baseline = { id: 'baseline', title: 'Baseline', note: null }
    const sign = { id: 'sign', title: 'Sign', note: null }
    const purpose = 'one table, grouped wrongly'

    // Distinct addresses throughout, so that the grouping is what each table fails on: the address
    // check runs first, and a reused identifier would refuse for the other reason.
    const interrupted = [
      only('baseline'),
      { ...only('sign'), id: 'leading-plus-sign', input: '+42' },
      { ...only('baseline'), id: 'negative-zero', input: '-0', expected: -0 },
    ]

    const faults: readonly CaseTableSource[] = [
      { name: 'edge-cases', purpose, groups: [baseline], cases: [only('whitspace')] },
      { name: 'edge-cases', purpose, groups: [baseline, sign], cases: [only('baseline')] },
      { name: 'edge-cases', purpose, groups: [baseline, sign], cases: interrupted },
      { name: 'edge-cases', purpose, groups: [{ ...baseline, id: 'Baseline' }], cases: [only('Baseline')] },
    ]

    for (const table of faults) {
      expect(() => serialiseContract(REPOSITORY_ROOT, withTable(table))).toThrow(
        GroupingIsNotAPartition,
      )
    }
  })

  /**
   * A group and a case never answer to one address.
   *
   * Both are rendered as `#id` on one page, so the duplicate is a link that lands on the wrong
   * element - and it is only visible from the contract, because the two may sit in different tables.
   * Two of the forty-eight collided the day the grouping was derived, which is why the refusal exists
   * rather than the possibility being assumed away.
   */
  it('a-group-that-takes-a-case-address-is-refused', () => {
    const [first] = theFive as readonly ContractSource[]
    const contract = first as ContractSource
    const [table] = contract.caseTables as readonly CaseTableSource[]
    const taken = (table as CaseTableSource).cases[0]?.['id'] as string

    const collided: ContractSource = {
      ...contract,
      caseTables: contract.caseTables.map((entry) => ({
        ...entry,
        groups: entry.groups.map((group, at) => (at === 0 ? { ...group, id: taken } : group)),
        cases: entry.cases.map((one) =>
          one['group'] === (table as CaseTableSource).groups[0]?.id ? { ...one, group: taken } : one,
        ),
      })),
    }

    expect(() => serialiseContract(REPOSITORY_ROOT, collided)).toThrow(GroupAddressIsTaken)
  })

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
