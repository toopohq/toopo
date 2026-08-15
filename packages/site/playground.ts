/**
 * What a playground is made of: the call a reader edits, and the two translations around it.
 *
 * ---------------------------------------------------------------------------
 * What a playground demonstrates, which is not "expected against actual"
 * ---------------------------------------------------------------------------
 *
 * Both halves of that comparison would be ours, and the expected half is already on the page two
 * centimetres higher, on the case's own line. What a page cannot do without running something is
 * answer **the input the reader typed** - so that is the whole of what this computes, and the expected
 * answer is deliberately not shown beside it.
 *
 * ---------------------------------------------------------------------------
 * The field holds a literal, and that is a measurement rather than a taste
 * ---------------------------------------------------------------------------
 *
 * `contracts/typescript/number/parse/edge-cases.ts` says why in its own source: `'1 000'` with a no-break space
 * and `'1 000'` with an ordinary one are the same eight glyphs on screen and carry opposite answers in
 * that table. A field holding raw text reintroduces, in the playground, exactly the ambiguity the
 * contract refuses to have in its own bytes - a reader checking the no-break case would type an
 * ordinary space, get the other reason, and have no way to see why. The playground would contradict
 * the page it lives on.
 *
 * It is also the only thing that covers the contract. `date/add@1` publishes four cases whose caller is
 * untyped - `{ day: 1 }` is one - and a form derived from the declared type cannot express them at all.
 *
 * ---------------------------------------------------------------------------
 * One table, and a type it does not know stops the build
 * ---------------------------------------------------------------------------
 *
 * Reading a literal gives the *declared* value, which is what the registry models. Turning that into an
 * argument is a second step, and exactly one type of this catalogue needs it: `date/add@1` declares
 * `Date` and writes its instants as ISO strings, because `packages/registry/value.ts` refuses to model a Date at
 * all. So `new Date(...)` here is the one place in this whole site where a Date comes into existence,
 * and it is written on the line beside the field for whoever is reading.
 *
 * The table is closed. A parameter declared as something not in it stops the site being built and names
 * the type - no fallback, no empty field, no page rendered with a playground quietly missing. That is
 * the shape `packages/registry/value.ts` already takes one floor down for a value it does not model, and the
 * reason is the same: a page that silently drops half of what it promised is worse than a build that
 * refuses.
 */

import type { CaseRecord, ExportRecord, ParameterRecord } from '../registry/contract-record.js'
import type { EncodedField } from '../registry/value.js'
import type { FrozenContract } from '../registry/snapshot.js'
import { encode } from '../registry/value.js'
import { literal } from './literal.js'
import { read } from './read-literal.js'

export class ThePlaygroundCannotBeBuilt extends Error {
  constructor(what: string, detail: string) {
    super(
      `the playground for ${what} cannot be built, and ${detail}. Rendering the page without it ` +
        `would publish a contract page that silently lacks the one thing on it a reader can try, ` +
        `so the build stops here instead.`,
    )
    this.name = 'ThePlaygroundCannotBeBuilt'
  }
}

export class UnusableArgument extends Error {
  constructor(name: string, type: string, spelled: string, wanted: string) {
    super(
      `${name} is declared ${type}, and what this field spells is ${spelled}. Write ${wanted}.`,
    )
    this.name = 'UnusableArgument'
  }
}

/** What a value is, in the words a refusal uses. Enough to tell somebody what they wrote. */
const natureOf = (value: unknown): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'a list'
  if (value instanceof Date) return 'a Date'

  return typeof value === 'object' ? 'an object' : `a ${typeof value}`
}

/**
 * How a declared value becomes an argument, by the type the signature declares.
 *
 * Measured over the five: three types, and one of them is not the identity. Nothing speculative is
 * listed - a `number` parameter is not here because no contract has one, and adding it in advance
 * would be the speculative field `field-map.ts` deletes.
 *
 * **`spelledBy` is here because a real browser produced `input.trim is not a function`.** A reader who
 * types `42` into a field declared `string` was handed the number straight to the implementation,
 * which failed somewhere inside itself and reported it in its own words. An error from the contract's
 * source is not an answer to a reader: the field knows what it is declared as, so it is the field that
 * says so, before anything is called.
 */
type Argument = {
  /** Whether the value the field spells is one this type can be built from. */
  readonly spelledBy: (declared: unknown) => boolean
  readonly build: (declared: unknown) => unknown
  /** What to write instead, in the refusal. */
  readonly wanted: string
  /** What the field does with the text, shown beside it when it is not simply the value spelled. */
  readonly note: string | null
}

const AS_AN_ARGUMENT: Readonly<Record<string, Argument>> = {
  string: {
    spelledBy: (declared) => typeof declared === 'string',
    build: (declared) => declared,
    wanted: "a string between single quotes — '42' rather than 42",
    note: null,
  },
  Duration: {
    spelledBy: (declared) => typeof declared === 'object' && declared !== null && !Array.isArray(declared),
    build: (declared) => declared,
    wanted: 'an object — { days: 1 }, or {} for none',
    note: null,
  },
  Date: {
    spelledBy: (declared) => typeof declared === 'string',
    build: (declared) => new Date(declared as string),
    wanted: "a string holding an instant — '2024-01-31T00:00:00.000Z'",
    note: 'a string, then new Date(…) — the only place this site makes a Date',
  },
}

/**
 * A live answer, back in the declarative form the registry models.
 *
 * The single non-identity entry above, inverted, and nothing else: everything the four contracts
 * answer is already something `encode` carries. An *invalid* Date is deliberately left alone rather
 * than given a spelling of its own - it falls through to `encode`, which refuses it by name, which is
 * the refusal that already exists for exactly this.
 */
const asADeclaredValue = (answer: unknown): unknown =>
  answer instanceof Date && !Number.isNaN(answer.getTime()) ? answer.toISOString() : answer

/**
 * The fields of a case, parted where the signature stops.
 *
 * `packages/registry/signature.ts` reads the call and `packages/registry/serialise.ts` refuses a contract whose cases do
 * not begin with it, so what is left after the parameters is the answer. Written once and used twice -
 * by the page that renders a case and by the playground that opens on one - because two slices at one
 * boundary are one statement that would come apart.
 */
export const theCallOf = (
  entry: CaseRecord,
  answer: ExportRecord,
): { readonly written: readonly string[]; readonly answered: readonly EncodedField[] } => {
  const fields = entry.data.kind === 'record' ? entry.data.fields : []

  return {
    written: fields.slice(0, answer.parameters.length).map((field) => literal(field.value)),
    answered: fields.slice(answer.parameters.length),
  }
}

/** One field of the form: what it is called, what it is declared as, and what it opens holding. */
export type PlaygroundField = {
  readonly name: string
  readonly type: string
  readonly opensOn: string
  /** How the text becomes the argument, when that is not simply the value it spells. */
  readonly constructedBy: string | null
}

export type Playground = {
  readonly calls: string
  /**
   * The diagnostic called when the answer is `null`, or `null` on a contract that publishes none.
   *
   * **A playground that called only `calls` would show half the contract, and it would undo the
   * measurement the whole site rests on.** The error convention is `T | null` beside a diagnostic
   * owned by the contract, so on a refused input the answer is `null` and everything that
   * distinguishes one refusal from another is in the other export. `'1 000'` with a no-break space
   * and `'1 000'` with an ordinary one are the two rows that argued the field should hold a literal -
   * they are the same eight glyphs on screen and carry opposite answers - and against `calls` alone
   * both print `null` and the distinction a reader came to see is invisible.
   *
   * It is called only when the answer is `null`, because the coupling property of both fallible
   * contracts is that a call fails exactly when it has a description: printing `→ null` under every
   * answered call would be a line that is always the same.
   */
  readonly describes: string | null
  readonly fields: readonly PlaygroundField[]
  /** The case the form opens on, so that a reader edits a call that works. */
  readonly opensOnCase: string
}

/**
 * The playground of a contract, or a refusal naming what stopped it.
 *
 * It opens on the first case of the first table - the one the contract itself puts first - so that a
 * reader arrives on a call that works and edits it rather than facing an empty field.
 */
export const playgroundOf = (contract: FrozenContract, what: string): Playground => {
  const answer = contract.surface.exports.find((entry) => entry.role === 'the-answer')
  if (answer === undefined) {
    throw new ThePlaygroundCannotBeBuilt(what, 'the contract publishes no export that answers')
  }

  const table = contract.caseTables[0]
  const opening = table?.cases[0]
  if (opening === undefined) {
    throw new ThePlaygroundCannotBeBuilt(what, 'the contract settles no case to open on')
  }

  const { written } = theCallOf(opening, answer)
  if (written.length !== answer.parameters.length) {
    throw new ThePlaygroundCannotBeBuilt(
      what,
      `its case \`${opening.id}\` writes ${written.length} of the ${answer.parameters.length} ` +
        `arguments the signature declares`,
    )
  }

  /**
   * The fields are built before the diagnostic is looked up, and the order is written down rather
   * than left to the evaluation order of an object literal.
   *
   * Both steps refuse, and a contract tripping both should be told about the parameter it declared
   * first: that is the more basic fact, and the diagnostic's signature is only interesting once the
   * form can be built at all. Leaving it implicit cost a real regression - W-37 of the site battery,
   * which neuters `refuseAnUnknownType`, went from killed to survived the moment the diagnostic was
   * looked up first, because the second refusal fired in the first one's place and the guard could no
   * longer tell them apart.
   */
  const fields = answer.parameters.map((parameter, index) => ({
    name: parameter.name,
    type: parameter.type,
    opensOn: written[index] as string,
    constructedBy: refuseAnUnknownType(parameter, what),
  }))

  return {
    calls: answer.name,
    describes: theDiagnosticOf(contract, answer, what),
    opensOnCase: opening.id,
    fields,
  }
}

const spelledCall = (parameters: readonly ParameterRecord[]): string =>
  parameters.map((parameter) => `${parameter.name}: ${parameter.type}`).join(', ')

/**
 * The diagnostic, and the refusal that lets the form call it with the answer's own arguments.
 *
 * The form is built out of the answer's parameters, so a diagnostic declaring anything else could not
 * be called from it at all - and the schema does not require the two to agree. Measured over the
 * catalogue: they agree on two of two, exactly. So the reading is checked rather than assumed, and a
 * contract that broke it would stop the build instead of publishing a playground that calls one export
 * with another's arguments.
 */
const theDiagnosticOf = (
  contract: FrozenContract,
  answer: ExportRecord,
  what: string,
): string | null => {
  const diagnostic = contract.surface.exports.find((entry) => entry.role === 'the-diagnostic')
  if (diagnostic === undefined) return null

  if (spelledCall(diagnostic.parameters) !== spelledCall(answer.parameters)) {
    throw new ThePlaygroundCannotBeBuilt(
      what,
      `its diagnostic \`${diagnostic.name}\` takes (${spelledCall(diagnostic.parameters)}) where ` +
        `\`${answer.name}\` takes (${spelledCall(answer.parameters)}), and the form has one field per ` +
        `parameter of the answer - so there is nothing to call the diagnostic with`,
    )
  }

  return diagnostic.name
}

const refuseAnUnknownType = (parameter: ParameterRecord, what: string): string | null => {
  const known = AS_AN_ARGUMENT[parameter.type]
  if (known === undefined) {
    throw new ThePlaygroundCannotBeBuilt(
      what,
      `its parameter \`${parameter.name}\` is declared \`${parameter.type}\`, which no field of this ` +
        `site knows how to build. Extend AS_AN_ARGUMENT in packages/site/playground.ts deliberately, the way ` +
        `packages/registry/value.ts is extended for a value it does not model`,
    )
  }

  return known.note
}

// ---------------------------------------------------------------------------
// What runs in the browser
// ---------------------------------------------------------------------------

/** The arguments a call is made with, from what a reader typed into each field. */
export const argumentsOf = (
  parameters: readonly ParameterRecord[],
  typed: readonly string[],
): readonly unknown[] =>
  parameters.map((parameter, index) => {
    const known = AS_AN_ARGUMENT[parameter.type]
    if (known === undefined) {
      throw new ThePlaygroundCannotBeBuilt(
        parameter.name,
        `it is declared \`${parameter.type}\`, which no field of this site knows how to build`,
      )
    }

    const declared = read(typed[index] ?? '')
    if (!known.spelledBy(declared)) {
      throw new UnusableArgument(parameter.name, parameter.type, natureOf(declared), known.wanted)
    }

    return known.build(declared)
  })

/**
 * The answer, written the way the case table above writes one.
 *
 * `literal(encode(…))` rather than `String(…)`, and that is not tidiness: `parseNumber('-0')` answers a
 * negative zero, `String` prints it `0`, and the contract settles a case on the two being different.
 */
export const answerWritten = (answer: unknown): string =>
  literal(encode(asADeclaredValue(answer), 'the answer'))
