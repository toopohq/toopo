import { describe, expect, it } from 'vitest'

import { canonical } from './canonical.js'
import type { ContractRecord } from './contract-record.js'
import { servedIndex } from './response.js'
import {
  ARuntimeRequirementIsMalformed,
  THE_RUNTIME_CAPABILITIES,
  UnknownRuntimeCapability,
  requiredRuntimeOf,
} from './runtime-capability.js'
import { REPOSITORY_ROOT, serialiseContract } from './serialise.js'
import { EMPTY_LEDGER, contractSnapshot, digestOfSnapshot } from './snapshot.js'
import { eachContract, theCatalogue } from './the-catalogue.js'

/**
 * What a contract requires of the runtime, and the two refusals that make it more than a word.
 *
 * ADR-0248 measured that a field of the frozen half costs a published digest nothing, and ADR-0249
 * is why this one exists rather than a second meaning loaded onto `environments`. The argument
 * against that reuse was that `environments` is read by nothing to decide anything - so a field that
 * landed here unread would refute its own record, and these are the guards that stop it.
 */

const aContract = (): ContractRecord => {
  const [first] = theCatalogue
  if (first === undefined) throw new Error('the catalogue is empty')

  return serialiseContract(REPOSITORY_ROOT, first)
}

const theFrozenHalf = (record: ContractRecord): Readonly<Record<string, unknown>> =>
  contractSnapshot(record).frozen as unknown as Readonly<Record<string, unknown>>

describe('what a contract requires of the runtime', () => {
  /**
   * A word the catalogue cannot state stops the contract, by name.
   *
   * **This is the whole difference from `environments` one field up**, which is
   * `read<readonly string[]>(module, 'targetEnvironments')` - a cast, so no value is wrong. Here the
   * vocabulary is closed and the refusal names both the word it was given and the words it has, so
   * somebody who invented one is told what the catalogue can say instead of being told nothing.
   */
  it('a-runtime-capability-outside-the-vocabulary-is-refused-by-name :: and the vocabulary is named back', () => {
    let thrown: unknown
    try {
      requiredRuntimeOf(['sorcery'], 'typescript/date/add')
    } catch (error) {
      thrown = error
    }

    expect(thrown).toBeInstanceOf(UnknownRuntimeCapability)
    const said = thrown instanceof Error ? thrown.message : ''
    expect(said).toContain('sorcery')
    expect(said).toContain('typescript/date/add')
    for (const capability of THE_RUNTIME_CAPABILITIES) expect(said).toContain(capability)
  })

  /**
   * And a requirement that is present without saying anything is refused too.
   *
   * The four arms are one rule - *a contract requiring nothing of the runtime declares nothing at
   * all* - and they are asserted together because a count would be satisfied by any one of them.
   * `THE_RUNTIME_CAPABILITIES[0]` rather than the word, so the duplicate arm cannot rot into a test
   * of a literal the vocabulary no longer holds.
   */
  it('a-runtime-requirement-is-absent-rather-than-empty :: and it is a list of distinct words', () => {
    const first = THE_RUNTIME_CAPABILITIES[0]
    expect(first).toBeDefined()

    for (const declared of [[], 'temporal', { temporal: true }, [first, first]]) {
      expect(() => requiredRuntimeOf(declared, 'typescript/date/add')).toThrow(
        ARuntimeRequirementIsMalformed,
      )
    }
  })

  /**
   * No contract of this catalogue requires anything, and its frozen half says so by holding no key.
   *
   * **The canonical text is read as well as the object**, because the key is what a digest is taken
   * over: `canonicalAt` builds a record out of `Object.keys`, so a key present with an `undefined`
   * value would be refused outright and a key present with a value would rebind six addresses. This
   * is the guard that would redden if somebody wrote the field unconditionally. ADR-0248.
   */
  it.each(eachContract)(
    'a-contract-that-requires-nothing-freezes-no-such-field-%s',
    (_name, source) => {
      const frozen = theFrozenHalf(serialiseContract(REPOSITORY_ROOT, source))

      expect(Object.keys(frozen)).not.toContain('requiresOfTheRuntime')
      expect(canonical(frozen, 'frozen')).not.toContain('requiresOfTheRuntime')
    },
  )

  /**
   * And a contract that does require something carries it into the digest and onto the index.
   *
   * Both halves in one guard because they are one claim - *the requirement travels* - and they fail
   * apart: the digest is what makes it permanent, the index is what puts it where the client reads
   * it without a second request. Without this the guard above passes on a field nothing can ever
   * carry, which is a population of nought wearing a green.
   */
  it('a-required-runtime-is-inside-the-digest-and-on-the-index :: it travels to both', () => {
    const record = aContract()
    const requiring: ContractRecord = { ...record, requiresOfTheRuntime: ['temporal'] }

    expect(Object.keys(theFrozenHalf(requiring))).toContain('requiresOfTheRuntime')
    expect(digestOfSnapshot(contractSnapshot(requiring))).not.toBe(
      digestOfSnapshot(contractSnapshot(record)),
    )

    const [entry] = servedIndex('0'.repeat(40), EMPTY_LEDGER, [
      {
        address: requiring.address,
        summary: requiring.identity.summary,
        searchAliases: requiring.identity.searchAliases,
        requiresOfTheRuntime: requiring.requiresOfTheRuntime,
        exports: [],
      },
    ]).entries

    expect(entry?.requiresOfTheRuntime).toEqual(['temporal'])
  })
})
