import { readFileSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import type { ExportRecord } from '../registry/contract-record.js'
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
  playgroundOf,
  theCallOf,
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

const ROOT = join(import.meta.dirname, '..')

const source = localSource()
const held = heldByTheRegistry(source)

const answerOf = (contract: FrozenContract): ExportRecord =>
  contract.surface.exports.find((entry) => entry.role === 'the-answer') as ExportRecord

/** The very module `build.ts` writes, imported without touching a disk. */
const shipped = async (one: Held): Promise<Record<string, (...args: readonly unknown[]) => unknown>> => {
  const path = `${renderContract(one.contract.address)}/${THE_REFERENCE_MODULE}`
  const js = theReferenceModules(source, [one]).get(path) as string

  return import(`data:text/javascript;base64,${Buffer.from(js, 'utf8').toString('base64')}`)
}

describe('the playground, against the catalogue it opens on', () => {
  it('every-case-replays-through-the-stripped-artefact-a-browser-runs', async () => {
    const faults: string[] = []

    for (const one of held) {
      const module = await shipped(one)
      const answer = answerOf(one.contract)
      const call = module[answer.name] as (...args: readonly unknown[]) => unknown

      for (const table of one.contract.caseTables) {
        for (const entry of table.cases) {
          const { written, answered } = theCallOf(entry, answer)
          const settled = literal((answered[0] as (typeof answered)[number]).value)
          const made = `${renderContract(one.contract.address)}#${entry.id}: ${answer.name}(${written.join(', ')})`

          /**
           * Caught rather than left to propagate, and that is about the failure being readable: the
           * module under test is imported from a `data:` URL, so an escaping stack trace carries the
           * whole base64 of a contract's implementation - ten thousand characters in which the one
           * line that matters cannot be found. It was seen once, which is why this is here.
           */
          try {
            const got = answerWritten(call(...argumentsOf(answer.parameters, written)))
            if (got !== settled) faults.push(`${made} answers ${got} where the case settles ${settled}`)
          } catch (thrown) {
            faults.push(`${made} throws ${thrown instanceof Error ? thrown.message : String(thrown)}`)
          }
        }
      }
    }

    // The bound, so that a run reaching no case at all cannot pass with an empty list of faults.
    expect(held.map((one) => one.contract.caseTables.flatMap((table) => table.cases).length > 0)).toEqual(
      held.map(() => true),
    )
    expect(faults).toEqual([])
  })

  /**
   * A type the form cannot build stops the site rather than rendering a page without a playground.
   *
   * The sixth contract is derived from a real one rather than written out, because exactly one
   * decision is under test - what a parameter is declared as - and a hand-written record would put
   * ninety-six other decisions behind the same red.
   */
  it('a-parameter-type-the-form-cannot-build-stops-the-site-and-names-itself', () => {
    const one = held[0] as Held
    const answer = answerOf(one.contract)
    const sixth: FrozenContract = {
      ...one.contract,
      surface: {
        ...one.contract.surface,
        exports: one.contract.surface.exports.map((entry) =>
          entry === answer
            ? { ...entry, parameters: entry.parameters.map((p) => ({ ...p, type: 'Comparator' })) }
            : entry,
        ),
      },
    }

    expect(() => playgroundOf(sixth, 'the sixth')).toThrow(ThePlaygroundCannotBeBuilt)
    expect(() => playgroundOf(sixth, 'the sixth')).toThrow('Comparator')
    expect(() => playgroundOf(one.contract, 'a real one')).not.toThrow()
  })

  /**
   * Every page opens on a call, and the call it opens on is one of that contract's own cases.
   *
   * An empty field is what this exists to prevent: a reader who has to invent an input before seeing
   * anything happen has been given a text box, not a playground.
   */
  it('every-playground-opens-on-a-case-of-its-own-contract', () => {
    for (const one of held) {
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
   */
  it('a-field-refuses-a-value-of-the-wrong-type-before-the-contract-is-called', () => {
    const string = [{ name: 'input', type: 'string' }]

    expect(() => argumentsOf(string, ['42'])).toThrow(UnusableArgument)
    expect(() => argumentsOf(string, ['42'])).toThrow('input is declared string')
    expect(() => argumentsOf(string, ['42'])).toThrow('a number')
    expect(() => argumentsOf(string, ["'42'"])).not.toThrow()

    expect(() => argumentsOf([{ name: 'duration', type: 'Duration' }], ["'a'"])).toThrow(
      UnusableArgument,
    )
    expect(() => argumentsOf([{ name: 'date', type: 'Date' }], ['{}'])).toThrow(UnusableArgument)
  })

  /** A Date is the one argument this site constructs, and it is constructed from the text. */
  it('a-date-is-the-one-argument-this-site-constructs', () => {
    const built = argumentsOf(
      [
        { name: 'date', type: 'Date' },
        { name: 'duration', type: 'Duration' },
      ],
      ["'2024-01-31T00:00:00.000Z'", '{ months: 1 }'],
    )

    expect(built[0]).toBeInstanceOf(Date)
    expect((built[0] as Date).toISOString()).toBe('2024-01-31T00:00:00.000Z')
    expect(built[1]).toEqual({ months: 1 })
  })
})
