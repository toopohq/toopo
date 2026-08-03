import { describe, it, expect } from 'vitest'

import { REPOSITORY_ROOT, serialiseContract } from './serialise.js'
import { eachContract } from './the-five.js'

/**
 * Nothing a contract declares is silently absent from its record.
 *
 * This is the guard that carries the most, and it is `unaccountedFor` from `mutation/attribution.ts`
 * applied to a schema instead of to a battery. There, a guard nothing reddens is either out of reach
 * or a debt, and both are declared while silence is refused. Here, an export no field of the record
 * carries is either a field this schema is missing or a piece of the executable half, and both are
 * declared while silence is refused.
 *
 * Without it a schema shrinks by inattention. Every field dropped for being hard to model would leave
 * a record that still typechecks, still serialises, still round-trips - and quietly publishes less of
 * a contract than the contract says. The five were written by hand so that this could be measured
 * rather than assumed, and this is where the measurement runs.
 *
 * The scope is the declarative half: `contract.ts` and `edge-cases.ts`. The executable half is hashed
 * rather than read, so `outcome.ts` and the test files are not silences - they are files in
 * `harness`, with their bytes and their digest.
 */

/**
 * Which field of the record carries an export. The names are the contract's, the fields are the
 * schema's, and this map is the join between them - written out so that a reader can check the
 * schema's claim to be complete without running anything.
 */
const CARRIED_BY: Readonly<Record<string, string>> = {
  identity: 'identity',
  targetEnvironments: 'environments',
  propertyRuns: 'properties.runs',
  universalProperties: 'properties.universal',
  benchmarkProfiles: 'benchmarks.profiles',
  failureReasons: 'surface.failureReasons',
  couplingRule: 'surface.couplingRule',
  catalogueAdmission: 'lifecycle',
}

describe('a record accounts for everything its contract declares', () => {
  it.each(eachContract)(
    'every-export-is-carried-or-declared-uncarried-%s',
    (name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)

      const carriedByName = new Set(Object.keys(CARRIED_BY))
      for (const declaration of record.ownDeclarations) carriedByName.add(declaration.name)
      for (const table of source.caseTables) carriedByName.add(tableExportOf(table.name, source))

      const declared = source.declares.flatMap((module) => Object.keys(module))
      const excused = new Set(source.notCarried.map((entry) => entry.name))

      const silent = declared.filter((exported) => {
        if (carriedByName.has(exported)) return false
        if (excused.has(exported)) return false

        return true
      })

      expect(silent, `${name} declares exports no field of the record carries`).toEqual([])
    },
  )

  it.each(eachContract)(
    'every-uncarried-export-carries-a-reason-%s',
    (_name, source) => {
      const unexplained = source.notCarried.filter((entry) => entry.reason.trim() === '')

      expect(unexplained.map((entry) => entry.name)).toEqual([])
    },
  )

  it.each(eachContract)(
    'every-uncarried-export-exists-%s',
    (_name, source) => {
      const declared = new Set(source.declares.flatMap((module) => Object.keys(module)))
      const stale = source.notCarried.filter((entry) => !declared.has(entry.name))

      expect(stale.map((entry) => entry.name)).toEqual([])
    },
  )

  /**
   * An own declaration that no longer exists would otherwise be a name in a record and nothing else.
   * The serialiser already refuses one, so this states the rule where a reader looks for it rather
   * than leaving it to a stack trace.
   */
  it.each(eachContract)(
    'every-own-declaration-is-an-export-%s',
    (_name, source) => {
      const missing = source.ownDeclarations.filter(
        (declaration) => source.module[declaration.name] === undefined,
      )

      expect(missing.map((declaration) => declaration.name)).toEqual([])
    },
  )
})

/**
 * Which export of `edge-cases.ts` a table came from. The registry names a table for the site and the
 * contract names it for TypeScript, so the join is stated once here rather than guessed twice.
 */
const tableExportOf = (table: string, source: { readonly address: { readonly name: string } }): string => {
  if (table === 'edge-cases') return 'edgeCases'
  if (source.address.name === 'date/add') return 'untypedEdgeCases'

  return 'untypedCallerCases'
}
