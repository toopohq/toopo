import { readFileSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import type {
  CaseRecord,
  ExportRecord,
  UseCaseRecord,
  WrittenAsACall,
} from '../registry/contract-record.js'
import type { FrozenContract } from '../registry/snapshot.js'
import { THE_BROWSER_GRAPH, asABrowserModule, theReferenceModules } from './browser.js'
import type { Held } from './catalogue.js'
import { heldByTheRegistry } from './catalogue.js'
import { literal } from './literal.js'
import { localSource } from './local-source.js'
import { THE_REFERENCE_MODULE } from './paths.js'
import {
  ThePlaygroundCannotBeBuilt,
  UnusableArgument,
  answerWritten,
  argumentsOf,
  callWritten,
  declaredBy,
  playgroundOf,
  theCallOf,
  theFieldsFor,
  whatATextFieldCannotCarry,
} from './playground.js'

/**
 * The playground, against the catalogue it opens on.
 *
 * ---------------------------------------------------------------------------
 * The replay runs the artefact, not the module it came from
 * ---------------------------------------------------------------------------
 *
 * What a browser executes is `reference.ts` with its types stripped, and importing the TypeScript
 * module here would measure something adjacent to what is shipped: it would establish that the
 * arguments are built correctly and leave the one thing stripping can break - that the JavaScript
 * answers what the TypeScript did - unmeasured. So the module under test is fetched by digest through
 * the port, stripped by the site's own function, and imported from a `data:` URL, which needs no disk
 * because a reference imports nothing.
 *
 * That is also what turns `stripTypeScriptTypes` being experimental from a declared risk into a thing
 * measured on every run.
 *
 * ---------------------------------------------------------------------------
 * Both sides of the comparison are literals in one notation
 * ---------------------------------------------------------------------------
 *
 * The arguments come from the case's own published literals, and the answer is written by the same
 * `literal(encode(…))` the case table is rendered with. So a case passes when the string the
 * playground would print equals the string its own row prints - which is the promise a reader is
 * being made, checked as a string rather than through a comparison of our own devising.
 *
 * **The reading it rests on, which the schema does not carry.** `data` is deliberately uninterpreted
 * past the parameters, so nothing says which of the remaining fields is the *answer's* rather than the
 * diagnostic's. Measured over the four served contracts: it is the first, on 157 of 157 - and this
 * guard is what measures it, in the way `signature.ts` is checked by the cases rather than by a second
 * copy of itself. A contract writing its reason first would redden here rather than publish a
 * playground that disagrees with its own table.
 */

const ROOT = join(import.meta.dirname, '..', '..')

const source = localSource()

/**
 * Gathered inside each guard rather than once at the top of the file, for the reason `pages.test.ts`
 * states and W-20 measures: a defect that makes `heldByTheRegistry` throw would stop this file from
 * collecting at all, and the instrument reads a file that collected nothing as a run that measured
 * part of the suite. One guard failing is the answer; seven disappearing is not.
 */
const theHeld = (): readonly Held[] => heldByTheRegistry(source)

const answerOf = (contract: FrozenContract): ExportRecord =>
  contract.surface.exports.find((entry) => entry.role === 'the-answer') as ExportRecord

const diagnosticOf = (contract: FrozenContract): ExportRecord | undefined =>
  contract.surface.exports.find((entry) => entry.role === 'the-diagnostic')

/**
 * One row, replayed through the artefact a browser runs: the answer, and the reason underneath it.
 *
 * Faults are returned rather than asserted so that a bad row names itself instead of stopping the
 * sweep at the first one, which is what makes the list at the end readable.
 *
 * **`cited` is passed rather than read off the row, and that is what lets a use case through here.** A
 * case is addressed by a frozen identifier and a use case is deliberately addressed by nothing, so
 * there is no one field to read - and inventing an identifier for a use case, only so that this
 * function could go on reading `entry.id`, would be minting an address for a thing this repository
 * has just argued must not have one. ADR-0118.
 */
const replayed = (
  one: Held,
  module: Record<string, (...args: readonly unknown[]) => unknown>,
  entry: WrittenAsACall,
  cited: string,
): readonly string[] => {
  const what = renderContract(one.contract.address)
  const answer = answerOf(one.contract)
  const diagnostic = diagnosticOf(one.contract)
  const { written, answered } = theCallOf(entry, answer)
  const held = theFieldsFor(entry, answer, what)
  const made = `${what}#${cited}: ${answer.name}(${written.join(', ')})`
  const wanted = diagnostic === undefined ? 1 : 2

  if (answered.length !== wanted) {
    return [`${made} leaves ${answered.length} field(s) after the call where ${wanted} is expected`]
  }

  /**
   * Caught rather than left to propagate, and that is about the failure being readable: the module
   * under test is imported from a `data:` URL, so an escaping stack trace carries the whole base64 of
   * a contract's implementation - ten thousand characters in which the one line that matters cannot
   * be found. It was seen once, which is why this is here.
   */
  try {
    const given = argumentsOf(answer.parameters, held)
    const got = answerWritten((module[answer.name] as (...args: readonly unknown[]) => unknown)(...given))
    const settled = literal(answered[0].value)

    if (got !== settled) return [`${made} answers ${got} where the row declares ${settled}`]
    if (diagnostic === undefined) return []

    const described = module[diagnostic.name] as (...args: readonly unknown[]) => unknown
    const reason = answerWritten(described(...given))
    const settledReason = literal(answered[1].value)

    return reason === settledReason
      ? []
      : [`${made} is described ${reason} where the row declares ${settledReason}`]
  } catch (thrown) {
    return [`${made} throws ${thrown instanceof Error ? thrown.message : String(thrown)}`]
  }
}

/** The very module `build.ts` writes, imported without touching a disk. */
const shipped = async (one: Held): Promise<Record<string, (...args: readonly unknown[]) => unknown>> => {
  const path = `${renderContract(one.contract.address)}/${THE_REFERENCE_MODULE}`
  const js = theReferenceModules(source, [one]).get(path) as string

  return import(`data:text/javascript;base64,${Buffer.from(js, 'utf8').toString('base64')}`)
}

describe('the playground, against the catalogue it opens on', () => {
  it('every-case-replays-through-the-stripped-artefact-a-browser-runs', async () => {
    const faults: string[] = []
    const held = theHeld()

    for (const one of held) {
      const module = await shipped(one)

      for (const table of one.contract.caseTables) {
        for (const entry of table.cases) faults.push(...replayed(one, module, entry, entry.id))
      }
    }

    // The bound, so that a run reaching no case at all cannot pass with an empty list of faults.
    expect(held.map((one) => one.contract.caseTables.flatMap((table) => table.cases).length > 0)).toEqual(
      held.map(() => true),
    )
    expect(faults).toEqual([])
  })

  /**
   * Every use case a page shows, run against the module that page ships.
   *
   * **A use case is a demonstration, and a demonstration nothing runs is what this page exists to be
   * the opposite of.** ADR-0114 took exactly that out of the README - a call and an answer written
   * beside each other by somebody careful, with nothing keeping the second true of the first - and
   * the contract page is the worst place in this catalogue to put it back, because everything else on
   * it was checked. So a use case replays through `replayed`, the same function and the same shipped
   * artefact as the 41 settled cases, and an answer that does not come back reddens here.
   *
   * **The bound is over the contracts that declare use cases and not over all of them**, which is the
   * difference between this and the guard above. Use cases are optional by design, so requiring every
   * contract to carry one would be this guard inventing a rule the schema does not state; and
   * asserting an empty fault list over a catalogue that happens to declare none would be the check
   * that goes green for ever. What is asserted is that the contracts declaring them are not zero and
   * that each declares at least one - so the day the field is emptied by accident, this fails rather
   * than passing quietly. ADR-0118.
   */
  it('every-use-case-replays-through-the-stripped-artefact-a-browser-runs', async () => {
    const faults: string[] = []
    const declaring = theHeld().filter((one) => one.binding.useCases !== undefined)

    for (const one of declaring) {
      const module = await shipped(one)

      for (const entry of one.binding.useCases as readonly UseCaseRecord[]) {
        faults.push(...replayed(one, module, entry, entry.name))
      }
    }

    expect(declaring.length).toBeGreaterThan(0)
    expect(declaring.map((one) => (one.binding.useCases as readonly UseCaseRecord[]).length > 0)).toEqual(
      declaring.map(() => true),
    )
    expect(faults).toEqual([])
  })

  /**
   * The two spellings of `1 000` answer the same thing and are described differently, and that is the
   * pair this whole section exists for.
   *
   * `contracts/typescript/number/parse/edge-cases.ts` names its separator characters instead of pasting them
   * because a no-break space and an ordinary one are the same glyph on screen, and that argument is
   * what settled the field holding a literal. Against the answer alone both rows print `null`, so the
   * playground would have contradicted the page it sits on. This is that pair, replayed by identifier
   * rather than by position, so the guard names the rows it is about.
   */
  it('two-inputs-that-look-alike-are-described-apart', async () => {
    const one = theHeld().find(
      (candidate) => renderContract(candidate.contract.address) === 'typescript/number/parse@1',
    ) as Held
    const module = await shipped(one)
    const cases = one.contract.caseTables.flatMap((table) => table.cases)
    const alike = ['no-break-space-grouping', 'an-ordinary-space-between-digits'].map(
      (id) => cases.find((entry) => entry.id === id) as CaseRecord,
    )
    const described = module[diagnosticOf(one.contract)?.name as string] as (
      ...args: readonly unknown[]
    ) => unknown

    expect(alike.map((entry) => entry?.id)).toEqual([
      'no-break-space-grouping',
      'an-ordinary-space-between-digits',
    ])
    expect(alike.flatMap((entry) => replayed(one, module, entry, entry.id))).toEqual([])

    const reasons = alike.map((entry) => {
      const held = theFieldsFor(entry, answerOf(one.contract), 'typescript/number/parse@1')

      return answerWritten(described(...argumentsOf(answerOf(one.contract).parameters, held)))
    })

    // Both are refused, and the whole point is that they are refused for different reasons.
    expect(reasons[0]).not.toBe(reasons[1])
  })

  /**
   * A type the form cannot build stops the site rather than rendering a page without a playground.
   *
   * The sixth contract is derived from a real one rather than written out, because exactly one
   * decision is under test - what a parameter is declared as - and a hand-written record would put
   * ninety-six other decisions behind the same red.
   *
   * **Every export is retyped, not only the answer**, and that is what keeps the one decision alone:
   * retyping the answer and leaving the diagnostic behind makes the two signatures disagree, which is
   * a *different* refusal, and it fires first. Measured - it did, and it took W-37 from killed to
   * survived while this guard stayed green.
   */
  it('a-parameter-type-the-form-cannot-build-stops-the-site-and-names-itself', () => {
    const one = theHeld()[0] as Held
    const sixth: FrozenContract = {
      ...one.contract,
      surface: {
        ...one.contract.surface,
        exports: one.contract.surface.exports.map((entry) => ({
          ...entry,
          parameters: entry.parameters.map((p) => ({ ...p, type: 'Comparator' })),
        })),
      },
    }

    expect(() => playgroundOf(sixth, 'the sixth')).toThrow(ThePlaygroundCannotBeBuilt)
    expect(() => playgroundOf(sixth, 'the sixth')).toThrow('Comparator')
    expect(() => playgroundOf(one.contract, 'a real one')).not.toThrow()
  })

  /**
   * A playground names the diagnostic of a contract that publishes one, and nothing of a contract
   * that does not.
   *
   * Both halves are asserted because both are ways of getting it wrong, and they fail on opposite
   * pages: a playground that never names a diagnostic prints `null` for every refused input on the two
   * contracts where the reason is the whole answer, and one that invents a name for the other two
   * calls an export that is not there.
   */
  it('a-playground-names-the-diagnostic-of-a-contract-that-publishes-one', () => {
    const held = theHeld()
    const named = held.map((one) => ({
      contract: renderContract(one.contract.address),
      describes: playgroundOf(one.contract, renderContract(one.contract.address)).describes,
      publishes: diagnosticOf(one.contract)?.name ?? null,
    }))

    expect(named.map((one) => one.describes)).toEqual(named.map((one) => one.publishes))

    // The bound: this says nothing at all unless the catalogue actually holds one of each.
    expect(named.some((one) => one.describes !== null)).toBe(true)
    expect(named.some((one) => one.describes === null)).toBe(true)
  })

  /**
   * A diagnostic the form cannot call stops the site, for the reason a parameter type it cannot build
   * does: the form has one field per parameter of the *answer*, and nothing in the schema requires the
   * diagnostic to declare the same ones. They agree on two of two today, which is a measurement rather
   * than a rule, so it is checked instead of assumed.
   */
  it('a-diagnostic-the-form-cannot-call-stops-the-site-and-names-itself', () => {
    const one = theHeld().find((candidate) => diagnosticOf(candidate.contract) !== undefined) as Held
    const diagnostic = diagnosticOf(one.contract) as ExportRecord
    const sixth: FrozenContract = {
      ...one.contract,
      surface: {
        ...one.contract.surface,
        exports: one.contract.surface.exports.map((entry) =>
          entry === diagnostic ? { ...entry, parameters: [{ name: 'other', type: 'string' }] } : entry,
        ),
      },
    }

    expect(() => playgroundOf(sixth, 'the sixth')).toThrow(ThePlaygroundCannotBeBuilt)
    expect(() => playgroundOf(sixth, 'the sixth')).toThrow(diagnostic.name)
    expect(() => playgroundOf(one.contract, 'a real one')).not.toThrow()
  })

  /**
   * Every page opens on a call, and the call it opens on is one of that contract's own cases.
   *
   * An empty field is what this exists to prevent: a reader who has to invent an input before seeing
   * anything happen has been given a text box, not a playground.
   */
  it('every-playground-opens-on-a-case-of-its-own-contract', () => {
    for (const one of theHeld()) {
      const playground = playgroundOf(one.contract, renderContract(one.contract.address))
      const ids = one.contract.caseTables.flatMap((table) => table.cases.map((entry) => entry.id))

      expect(ids).toContain(playground.opensOnCase)
      expect(playground.fields.map((field) => field.name)).toEqual(
        answerOf(one.contract).parameters.map((parameter) => parameter.name),
      )
      expect(playground.fields.every((field) => field.opensOn.length > 0)).toBe(true)
    }
  })

  /**
   * The module graph a browser loads is closed: every import that survives stripping names a file the
   * site writes.
   *
   * `THE_BROWSER_GRAPH` is a hand-written list, so it is a second statement about the graph and this
   * is what keeps the two together. The mutant it exists for is a fifth module arriving through an
   * import nobody added to the list, which no page would report and every browser would.
   */
  it('every-import-a-browser-module-keeps-is-a-module-the-site-writes', () => {
    const written = new Set(THE_BROWSER_GRAPH.map((path) => path.replace(/\.ts$/, '.js')))

    const faults = THE_BROWSER_GRAPH.flatMap((relative) => {
      const js = asABrowserModule(readFileSync(join(ROOT, relative), 'utf8'))
      const specifiers = [...js.matchAll(/from\s+'([^']+)'/g)].map((found) => found[1] as string)

      return specifiers
        .map((specifier) => posix.join(posix.dirname(relative.replaceAll('\\', '/')), specifier))
        .filter((resolved) => !written.has(resolved))
        .map((resolved) => `${relative} imports ${resolved}, which the site does not write`)
    })

    expect(faults).toEqual([])
    expect(THE_BROWSER_GRAPH.every((path) => path.endsWith('.ts'))).toBe(true)
    expect(dirname(ROOT).length).toBeGreaterThan(0)
  })

  /**
   * `-0` is why the answer is written through `literal(encode(…))` rather than through `String`.
   * `number/parse@1` settles a case on it, and `String(-0)` is `0`.
   */
  it('an-answer-is-written-the-way-the-case-table-writes-one', () => {
    expect(answerWritten(-0)).toBe('-0')
    expect(answerWritten(null)).toBe('null')
    expect(answerWritten(new Date('2024-02-29T00:00:00.000Z'))).toBe("'2024-02-29T00:00:00.000Z'")
    expect(answerWritten(`1${String.fromCharCode(0x00a0)}000`)).toBe("'1\\u00A0000'")
  })

  /**
   * A field says what it is declared as, before anything is called.
   *
   * Found in a real browser and by nothing else: typing `42` into a field declared `string` used to
   * answer `input.trim is not a function`, which is the implementation reporting a failure in its own
   * words to somebody who has no idea what `input` is. A static check cannot see it - every type was
   * satisfied - and only opening the page and typing did.
   *
   * **The subject moved to the one field that still spells a value, and the address did not.** A text
   * field cannot receive the wrong type, because what a reader types is a string and both types read
   * as text are spelled as strings - so the refusal now belongs to `Duration` alone, which is exactly
   * where a literal can still spell anything at all. ADR-0096.
   */
  it('a-field-refuses-a-value-of-the-wrong-type-before-the-contract-is-called', () => {
    const duration = [{ name: 'duration', type: 'Duration' }]

    expect(() => argumentsOf(duration, ["'a'"])).toThrow(UnusableArgument)
    expect(() => argumentsOf(duration, ["'a'"])).toThrow('duration is declared Duration')
    expect(() => argumentsOf(duration, ["'a'"])).toThrow('a string')
    expect(() => argumentsOf(duration, ['[1]'])).toThrow('a list')
    expect(() => argumentsOf(duration, ['{ days: 1 }'])).not.toThrow()
  })

  /**
   * A text field hands the contract what was typed, character for character.
   *
   * The three spellings that used to be a refusal are the whole of the change a reader meets: `42`,
   * `hello` and the empty field are answers to *what string?* and none of them is a notation error.
   * The no-break space is here because it is the pair the page rests on - the field carries it whole,
   * measured in Chrome, and what tells it from an ordinary space is the printed call and not the field.
   */
  it('a-text-field-hands-over-what-was-typed', () => {
    const string = [{ name: 'input', type: 'string' }]
    const spaced = `1${String.fromCharCode(0x00a0)}000`

    expect(argumentsOf(string, ['42'])).toEqual(['42'])
    expect(argumentsOf(string, ['hello'])).toEqual(['hello'])
    expect(argumentsOf(string, [''])).toEqual([''])
    expect(argumentsOf(string, ["'42'"])).toEqual(["'42'"])
    expect(argumentsOf(string, [spaced])).toEqual([spaced])
  })

  /** A Date is the one argument this site constructs, and it is constructed from the text. */
  it('a-date-is-the-one-argument-this-site-constructs', () => {
    const built = argumentsOf(
      [
        { name: 'date', type: 'Date' },
        { name: 'duration', type: 'Duration' },
      ],
      ['2024-01-31T00:00:00.000Z', '{ months: 1 }'],
    )

    expect(built[0]).toBeInstanceOf(Date)
    expect((built[0] as Date).toISOString()).toBe('2024-01-31T00:00:00.000Z')
    expect(built[1]).toEqual({ months: 1 })
  })

  /**
   * The line the output prints, which is where an invisible code point is named.
   *
   * **This is a defect being repaired and not a feature being added.** The output said
   * `parseNumber(…) → null`, where `(…)` was three literal dots: the one computed thing on this site
   * said nothing whatever about what it had received. Both spellings of `1 000` answer `null`, so a
   * reader who typed either could not tell which the page had read.
   *
   * It is computed from the arguments and never conditioned on what they hold, which is what makes it
   * unable to miss one - a line asking *is anything invisible here* can be wrong about its question,
   * and a line derived from what arrived cannot. ADR-0043, ADR-0096.
   */
  it('an-invisible-code-point-a-reader-typed-is-named-in-the-output', () => {
    const spaced = `1${String.fromCharCode(0x00a0)}000`

    expect(callWritten('parseNumber', [spaced])).toBe("parseNumber('1\\u00A0000')")
    expect(callWritten('parseNumber', ['1 000'])).toBe("parseNumber('1 000')")
    expect(callWritten('parseNumber', [spaced])).not.toBe(callWritten('parseNumber', ['1 000']))

    expect(callWritten('parseNumber', ['42'])).toBe("parseNumber('42')")
    expect(callWritten('levenshtein', ['a', 'b'])).toBe("levenshtein('a', 'b')")
    expect(callWritten('addToDate', [new Date('2024-01-31T00:00:00.000Z'), { months: 1 }])).toBe(
      "addToDate('2024-01-31T00:00:00.000Z', { months: 1 })",
    )
  })

  /**
   * The playground writes a call exactly as the case table two centimetres above writes one.
   *
   * **This is the guard the browser found and the suite had not.** Printing from the built arguments
   * rather than from what the fields spell made `date/add@1` answer `a Date, which the registry does
   * not model` to anybody typing something that is not an instant — `encode` refusing an invalid
   * Date, which is right for an answer and wrong for an argument the contract settles a case on. One
   * hundred guards were green and only opening the page found it.
   *
   * Over every case rather than over the one that broke: the two renderings agree by construction or
   * they do not, and a row-by-row comparison is what says which.
   */
  it('the-playground-writes-a-call-the-way-the-case-table-writes-one', () => {
    const faults = theHeld().flatMap((one) => {
      const what = renderContract(one.contract.address)
      const answer = answerOf(one.contract)

      return one.contract.caseTables
        .flatMap((table) => table.cases)
        .flatMap((entry) => {
          const { written } = theCallOf(entry, answer)
          const settled = `${answer.name}(${written.join(', ')})`

          // Caught for the reason `replayed` catches, and the same one: a bad row names itself
          // instead of stopping the sweep, which is what makes the list at the end readable.
          try {
            const printed = callWritten(
              answer.name,
              declaredBy(answer.parameters, theFieldsFor(entry, answer, what)),
            )

            return printed === settled ? [] : [`${what}#${entry.id}: ${printed} against ${settled}`]
          } catch (thrown) {
            const said = thrown instanceof Error ? thrown.message : String(thrown)

            return [`${what}#${entry.id}: printing ${settled} throws ${said}`]
          }
        })
    })

    expect(faults).toEqual([])
    // The bound, so that a run reaching no case cannot pass on an empty list.
    expect(
      theHeld().flatMap((one) => one.contract.caseTables.flatMap((table) => table.cases)).length,
    ).toBeGreaterThan(100)
  })

  /**
   * The cases a reader cannot retype, named on their own rows and computed from the cases themselves.
   *
   * Measured in Chrome: an `<input>` drops a line feed and a carriage return and keeps everything
   * else, and a `<textarea>` still drops the carriage return - so one case of the whole catalogue
   * cannot be typed back into the form. The bound is the point of the second half: were this to answer
   * *every* case, or none, the page would be saying something about the form rather than about the
   * catalogue.
   */
  it('a-case-a-text-field-cannot-carry-is-the-one-that-carries-a-line-break', () => {
    const held = theHeld()
    const named = held.flatMap((one) => {
      const what = renderContract(one.contract.address)
      const answer = answerOf(one.contract)
      const { fields } = playgroundOf(one.contract, what)

      return one.contract.caseTables
        .flatMap((table) => table.cases)
        .flatMap((entry) =>
          whatATextFieldCannotCarry(entry, answer, fields).map(
            (field) => `${what}#${entry.id}.${field.name}: ${field.lost.join(' ')}`,
          ),
        )
    })

    expect(named).toEqual(['typescript/number/parse@1#tabs-and-newlines.input: \\n \\r'])
  })
})
