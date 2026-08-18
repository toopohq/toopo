import { describe, it, expect } from 'vitest'

import { rootDocument, theCatalogueRecords } from './root-documents.ts'
import { FIELD_MAP } from '../packages/registry/field-map.ts'
import type { ContractRecord } from '../packages/registry/contract-record.ts'
import {
  CONTRACT_METHOD_RULE,
  EVALUATION_RULE,
  GLOBAL_RULE,
  IMPORT_RULE,
} from '../packages/validation/forbidden-constructs.ts'
import { OWN_SIGNATURE_RULE } from '../packages/validation/states-its-own-signature.ts'

/**
 * What `CONTRIBUTING.md` publishes, resolved against the catalogue and the filter it describes.
 *
 * It is `readme.test.ts` aimed at the other root document, for the reason that file gives: Markdown
 * cannot compute anything, so every number in it is a transcription, and a guard is what stops a
 * transcription from becoming the false half of a true page. The difference is the upstream. The
 * README's figures come from the instrument; these come from the five contract records and from the
 * rule identifiers stage 1 refuses under.
 *
 * **It lives here rather than in `packages/registry/` or `packages/validation/`, and the placement is an argument
 * rather than a convenience.** Both of those folders are injected into by a battery, and a battery
 * measures whether the catalogue's own tests catch defects in the catalogue. A guard over a Markdown
 * file is not that, so putting it there would force `registry-storage` to declare a document as an
 * unprobed region of the registry - the data arranged to suit the tool. `mutation/` is the one folder
 * no battery injects into, which is `verifiability.ts`'s line and not an escape from one.
 */

const CONTRIBUTING = (): string => rootDocument('CONTRIBUTING.md')

/**
 * Each family the document counts, addressed by the path the schema already gives it.
 *
 * The path is not decoration: `FIELD_MAP` is the registry's own vocabulary for a field, and resolving
 * these against it is what makes a schema rename redden here instead of leaving the census counting a
 * field by a name nothing else uses.
 *
 * **What it does not do is notice a family that arrives**, and that is stated rather than dressed as a
 * mechanism. A frozen identifier added to the record is not counted until somebody names it below, and
 * no total map over `FIELD_MAP` would fix it: what separates these paths from the fifty others is
 * whether a *contract author decides the value*, and a digest, a byte count and a sample count are all
 * frozen without anybody choosing them.
 */
const FROZEN: Readonly<Record<string, (record: ContractRecord) => number>> = {
  'caseTables[].cases[].id': (record) =>
    record.caseTables.reduce((count, table) => count + table.cases.length, 0),
  'caseTables[].groups[].id': (record) =>
    record.caseTables.reduce((count, table) => count + table.groups.length, 0),
  'benchmarks.profiles[].name': (record) => record.benchmarks.profiles.length,
  'surface.failureReasons[]': (record) => record.surface.failureReasons?.length ?? 0,
  'surface.exports[].name': (record) => record.surface.exports.length,
  'surface.supportingTypes[].name': (record) => record.surface.supportingTypes.length,
}

/**
 * The two the document calls corrigible, and the verdict that is deliberately in neither column.
 *
 * `properties.universal[].reason` is prose and is corrected the day it reads badly. The `applicable`
 * beside it is not here, because it can be weakened and not strengthened: declaring an applicable
 * property inapplicable narrows what the contract claims, and the other direction turns a conformant
 * implementation into a non-conformant one, which permanent rule 6 forbids.
 */
const CORRIGIBLE: Readonly<Record<string, (record: ContractRecord) => number>> = {
  'identity.searchAliases[]': (record) => record.identity.searchAliases.length,
  'properties.universal[].reason': (record) => record.properties.universal.length,
}

const over = (
  held: readonly ContractRecord[],
  count: (record: ContractRecord) => number,
): number => held.reduce((total, record) => total + count(record), 0)

const totalOf = (
  held: readonly ContractRecord[],
  family: Readonly<Record<string, (record: ContractRecord) => number>>,
): number => Object.values(family).reduce((total, count) => total + over(held, count), 0)

describe('what the contributing guide publishes about the catalogue', () => {
  /**
   * Every figure, against the value the five records give for it.
   *
   * A table of claims rather than one assertion per figure, so that the guard names which one drifted
   * instead of failing on the first.
   */
  it('every-figure-in-contributing-is-the-one-the-five-contracts-declare', () => {
    const held = theCatalogueRecords()
    const text = CONTRIBUTING()

    const claims = [
      `**${totalOf(held, FROZEN)} frozen.**`,
      `${over(held, FROZEN['caseTables[].cases[].id']!)} case identifiers`,
      `${over(held, FROZEN['caseTables[].groups[].id']!)} group identifiers`,
      `${over(held, FROZEN['benchmarks.profiles[].name']!)} benchmark profile names`,
      `${over(held, FROZEN['surface.failureReasons[]']!)} failure-reason literals`,
      `${over(held, FROZEN['surface.exports[].name']!)} export names`,
      `${over(held, FROZEN['surface.supportingTypes[].name']!)} supporting type name`,
      `**${totalOf(held, CORRIGIBLE)} corrigible.**`,
      `${over(held, CORRIGIBLE['identity.searchAliases[]']!)} search aliases`,
      `${over(held, CORRIGIBLE['properties.universal[].reason']!)} reasons a contract gives`,
      `${over(held, (record) => record.ownDeclarations.length)} declarations belong to one contract`,
    ]

    expect(claims.filter((claim) => !text.includes(claim))).toEqual([])
  })

  /**
   * The ratio the document draws its conclusion from, checked as arithmetic rather than as a string.
   *
   * It is published as a bound and not as a decimal, which is what makes it worth guarding: a decimal
   * would have to be edited on the day a case is added, and a bound only when the balance actually
   * moves. The floor is what goes red in both directions - at four the sentence understates, at two it
   * overstates - so the claim cannot quietly become true of nothing.
   */
  it('the-ratio-contributing-argues-from-is-the-one-the-counts-give', () => {
    const held = theCatalogueRecords()

    expect(Math.floor(totalOf(held, FROZEN) / totalOf(held, CORRIGIBLE))).toBe(3)
    expect(CONTRIBUTING()).toContain('More than three frozen for every one')
  })

  /**
   * Every family the census counts is a field the schema still calls by that name.
   *
   * Without it the two lists above are a private vocabulary that goes on counting correctly under a
   * path nothing else in the repository uses, which is how a census stops being about the schema it
   * claims to describe.
   */
  it('every-family-the-census-counts-is-a-field-of-the-record', () => {
    const named = [...Object.keys(FROZEN), ...Object.keys(CORRIGIBLE)]

    expect(named.filter((path) => !(path in FIELD_MAP))).toEqual([])
  })
})

describe('what the contributing guide publishes about stage 1', () => {
  /**
   * The five rules stage 1 applies, resolved in both directions against the modules that own them.
   *
   * The imports are what keep the *names* honest - renaming an exported constant stops this file
   * compiling - and the first assertion keeps the *values*, since a rule identifier corrected before
   * publication would leave the document naming a rule no report will ever cite. The second is the
   * dangerous direction: a document naming a filter that does not exist sends a contributor looking
   * for it, which is the class this repository refuses on every other surface.
   *
   * **What no mechanism here keeps is a sixth rule**, added to `analyseImplementation` and named
   * neither in the document nor in this file. Enumerating stage 1's rules would need a second
   * statement of what that function composes, and a second statement is the thing this guard exists to
   * remove. The gap is declared rather than closed, and it fails in the safe direction: the document
   * understates the filter instead of promising one that is not there.
   */
  const THE_RULES = [
    IMPORT_RULE,
    OWN_SIGNATURE_RULE,
    GLOBAL_RULE,
    EVALUATION_RULE,
    CONTRACT_METHOD_RULE,
  ]

  it('every-rule-stage-1-applies-is-named-in-contributing', () => {
    const text = CONTRIBUTING()

    expect(THE_RULES.filter((rule) => !text.includes(`\`${rule}\``))).toEqual([])
  })

  it('contributing-names-no-rule-stage-1-does-not-have', () => {
    const text = CONTRIBUTING()
    const opens = text.indexOf('## What exists of the validation pipeline')
    const section = text.slice(opens, text.indexOf('\n## ', opens + 1))

    // A backticked kebab-case token with a hyphen in it, which is the shape of every rule identifier
    // and of nothing else the section quotes: a global is one word and a path carries a dot or a slash.
    const named = [...section.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)+)`/g)].map((match) => match[1]!)

    expect(opens).toBeGreaterThan(-1)
    expect([...new Set(named)].filter((rule) => !THE_RULES.includes(rule))).toEqual([])
  })
})
