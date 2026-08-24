/**
 * What a playground is made of: the call a reader edits, and the two translations around it.
 * ADR-0028 is what a playground demonstrates and what it refuses to show.
 * ADR-0096 is which of the two readings each field gets, and why the answer names its own call.
 * ADR-0157 is why the form's own decisions are here rather than in `start.ts` or beside the other
 * controls: nine of the thirteen pages never fetch this module, and a decision about a form belongs
 * with the form rather than in what every page loads.
 *
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
 * How a field is read is a property of the type it is declared as
 * ---------------------------------------------------------------------------
 *
 * *A value is typed* and *a value is spelled* are different questions, and the table below is where
 * each type answers the second. A `string` field takes the text itself, because somebody answering a
 * string types `hello` and being refused for not writing `'hello'` teaches a notation where the page
 * meant to ask a question. A `Duration` field takes a literal, because an object with named fields has
 * no spelling as a line of text - and `read-literal.ts` is what reads it.
 *
 * The ambiguity that reading raw text reintroduces is real and is answered rather than avoided:
 * `'1 000'` with a no-break space and `'1 000'` with an ordinary one are the same eight glyphs on
 * screen and carry opposite answers in `contracts/typescript/number/parse/edge-cases.ts`. What tells
 * them apart is that the answer names the call it made, written through `literal` - so the two spellings
 * print differently the moment either is typed. ADR-0096.
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

import type {
  CaseRecord,
  ExportRecord,
  ParameterRecord,
  WrittenAsACall,
} from '../registry/contract-record.js'
import type { EncodedField } from '../registry/value.js'
import type { FrozenContract } from '../registry/snapshot.js'
import { decode, encode, encodeTogether, labelsIn } from '../registry/value.js'
import { escaped, hasASpelling, literal } from './literal.js'
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
 * What a reader writes in a field, in two forms with no way to spell a third.
 *
 * The refusal machinery lives *inside* the literal arm rather than beside both, and that is the shape
 * doing the work: a field that takes the text itself cannot receive the wrong type, because the text a
 * reader types is a string and the two types reading it are the two the catalogue spells as strings.
 * `UnusableArgument` exists because a literal can spell anything at all, so it belongs where that is
 * true and nowhere else.
 */
type Reading =
  | {
      readonly kind: 'the-text-itself'
      /**
       * The declared value of the case the form opens on, as the text the field holds - or `null`
       * where this type cannot spell it, which stops the build.
       *
       * It is the inverse of `build` and it is required rather than optional, on the same rule as
       * the reading itself: a type added here decides how it opens, and there is no member to leave
       * out. Coercing instead would be the silent `[object Object]` this module refuses one function
       * below.
       */
      readonly opensOn: (value: unknown) => string | null
      /**
       * The text a reader typed, as the value a case row would print - which is the half a page
       * prints, because a case row two centimetres higher prints the declared value and not the
       * argument.
       *
       * It is the inverse of `opensOn` and the step before `build`: text, then declared, then
       * argument. For the two types the catalogue spells as text the first step is the identity;
       * for `number` it is where the conversion belongs, so that a page prints `round(1.005, 2)`
       * and not `round('1.005', '2')`.
       */
      readonly declares: (text: string) => unknown
    }
  | {
      readonly kind: 'a-literal'
      /** Whether the value the field spells is one this type can be built from. */
      readonly spelledBy: (declared: unknown) => boolean
      /** What to write instead, in the refusal. */
      readonly wanted: string
      /** Why this type has no spelling as a line of text, said beside the field. */
      readonly because: string
    }

/**
 * How a field becomes an argument, by the type the signature declares.
 *
 * Four types, two readings, and two `build`s that are not the identity. Nothing speculative is
 * listed: each entry is here because a contract declares that type, which is the discipline
 * `field-map.ts` deletes a speculative field for.
 *
 * **A type added here has to choose a reading, and there is no member to leave out.** That is the rule
 * ADR-0054 asks for before a rule is written in prose: a sixth contract declaring a fourth type does
 * not compile until somebody has decided whether that type is typed or spelled. `number` is that
 * fourth type and the decision is recorded on it.
 */
type Argument = {
  readonly readAs: Reading
  /** What the reading produced, as the argument the contract is called with. */
  readonly build: (value: unknown) => unknown
  /** What the field does with the text, shown beside it when it is not simply what was typed. */
  readonly note: string | null
}

/** A value that already is the text a field opens on, which is what two of the four spell. */
const THE_TEXT_AS_WRITTEN = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

/** And its inverse for those two: what was typed is already the value a row would print. */
const THE_TEXT_DECLARES_ITSELF = (text: string): unknown => text

const AS_AN_ARGUMENT: Readonly<Record<string, Argument>> = {
  string: {
    readAs: {
      kind: 'the-text-itself',
      opensOn: THE_TEXT_AS_WRITTEN,
      declares: THE_TEXT_DECLARES_ITSELF,
    },
    build: (value) => value,
    note: null,
  },
  Duration: {
    readAs: {
      kind: 'a-literal',
      spelledBy: (declared) => typeof declared === 'object' && declared !== null && !Array.isArray(declared),
      wanted: 'an object — { days: 1 }, or {} for none',
      because: 'an object with named fields, which a line of text cannot spell',
    },
    build: (value) => value,
    note: null,
  },
  Date: {
    readAs: {
      kind: 'the-text-itself',
      opensOn: THE_TEXT_AS_WRITTEN,
      declares: THE_TEXT_DECLARES_ITSELF,
    },
    build: (value) => new Date(value as string),
    note: 'the text, then new Date(…) — the only place this site makes a Date',
  },
  /**
   * **The fourth type, and the decision the header above asked for in advance.**
   *
   * It is `the-text-itself` and not `a-literal`, on the pattern `Date` already sets: a number spells
   * on one line, so nothing about it forces a reader into a literal.
   *
   * **What settles it is what a typo does.** `Number` answers `NaN` for text that is not a number,
   * and `number/round@1` declares `value-not-finite` and refuses it - so a mistyped field is answered
   * by the contract's own refusal, which is the one thing this page exists to show. A field that
   * refused first would put an unverified refusal in front of a verified one, on the page whose whole
   * subject is the contract answering. **A contract refusing is the contract answering**, and showing
   * it refuse is worth more than keeping it from being called. ADR-0144.
   */
  number: {
    readAs: {
      kind: 'the-text-itself',
      /**
       * `String(-0)` is `"0"`, and `Number("0")` is not negative zero - so the one value this
       * contract settles a case on precisely because its sign is not recoverable from its text is
       * the one value the identity would lose. It is spelled the way the case table spells it.
       */
      opensOn: (value) =>
        typeof value !== 'number' ? null : Object.is(value, -0) ? '-0' : String(value),
      declares: (text) => Number(text),
    },
    build: (value) => value,
    note: 'the text, then Number(…) — so 1.005 is the double a caller who typed it would hold',
  },
  /**
   * **The fifth type, and the first that is not a type at all.** `object/deep-equal@1` declares
   * `(left: unknown, right: unknown)`, because what it compares is any value a program holds - so the
   * field cannot narrow what it accepts without narrowing the contract.
   *
   * It is `a-literal` for the reason `Duration` is: a `Set`, a `Map`, a nested object and a `Date` do
   * not spell on one line of text, and this contract settles cases on every one of them. The notation
   * is `packages/site/literal.ts`'s, which is what the case table beside the form already prints, so a
   * reader edits the call they can see rather than learning a second spelling.
   *
   * **`spelledBy` is total and its message is therefore unreachable, which is said here rather than
   * hidden behind a plausible-looking predicate.** Every value that reads back is a usable argument to
   * a function taking `unknown`; what a reader can still get wrong is the *notation*, and that is
   * refused one step earlier by `read` with a message naming the column. `wanted` is carried because
   * the shape requires it and it is what a reader would be told if this type ever narrowed.
   */
  unknown: {
    readAs: {
      kind: 'a-literal',
      spelledBy: () => true,
      wanted: 'any value — 42, `a`, { a: 1 }, new Set([1]), new Date(0)',
      because: 'any value at all, which is what this contract compares',
    },
    build: (value) => value,
    note: null,
  },
}


/**
 * The fields of a case, parted where the signature stops.
 *
 * `packages/registry/signature.ts` reads the call and `packages/registry/serialise.ts` refuses a contract whose rows do
 * not begin with it, so what is left after the parameters is the answer. Written once and reached
 * from four places - the page that renders a case, the playground that opens on one, the page that
 * renders a use case and the replay that checks one - because four slices at one boundary are one
 * statement that would come apart.
 *
 * It takes `WrittenAsACall` and not `CaseRecord`, which is the one field it has ever read.
 */
export const theCallOf = (
  entry: WrittenAsACall,
  answer: ExportRecord,
): {
  readonly given: readonly EncodedField[]
  readonly written: readonly string[]
  readonly answered: readonly EncodedField[]
} => {
  const fields = entry.data.kind === 'record' ? entry.data.fields : []
  const given = fields.slice(0, answer.parameters.length)

  return {
    given,
    written: given.map((field) => literal(field.value)),
    answered: fields.slice(answer.parameters.length),
  }
}

/**
 * One field of the form: what it is called, what it is declared as, and what it opens holding.
 *
 * `reads` is the union above with its functions gone, because this crosses into a browser as JSON. It
 * is carried rather than re-derived there: `start.ts` builds the control and `contract-page.ts` says
 * beside a literal field why it is one, and both would otherwise hold a second copy of a table only
 * this module owns.
 */
export type PlaygroundField = {
  readonly name: string
  readonly type: string
  readonly opensOn: string
  readonly reads:
    | { readonly kind: 'the-text-itself' }
    | { readonly kind: 'a-literal'; readonly because: string }
  /** How the text becomes the argument, when that is not simply what was typed. */
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

/** The export a call is made against, which every reading of a case has to start from. */
const theAnsweringExport = (contract: FrozenContract): ExportRecord | undefined =>
  contract.surface.exports.find((entry) => entry.role === 'the-answer')

/**
 * `whatKeepsARowFromTheForm` asked of a case rather than of an encoded row, which is how a guard over
 * the catalogue asks it: the answering export is what turns one into the other, and it is read here so
 * that nothing outside this file has to.
 */
export const whatKeepsACaseFromTheForm = (
  entry: WrittenAsACall,
  contract: FrozenContract,
): string | null => {
  const answer = theAnsweringExport(contract)

  return answer === undefined
    ? 'the contract publishes no export that answers'
    : whatKeepsARowFromTheForm(theCallOf(entry, answer).given)
}

/**
 * The playground of a contract, or a refusal naming what stopped it.
 *
 * It opens on the first case a form can hold - which for every contract but the seventh is the first
 * case there is - so that a reader arrives on a call that works and edits it rather than facing an
 * empty field.
 */
export const playgroundOf = (contract: FrozenContract, what: string): Playground => {
  const answer = theAnsweringExport(contract)
  if (answer === undefined) {
    throw new ThePlaygroundCannotBeBuilt(what, 'the contract publishes no export that answers')
  }

  /**
   * The first case the form can actually hold, which for every contract written before
   * `object/deep-equal@1` is the first case there is.
   *
   * It used to be `caseTables[0].cases[0]` outright. A contract whose opening row holds a function or
   * a value shared between its arguments would have opened the form on text that means nothing - so
   * the row is chosen by the same rule that keeps such a row out of the replay, rather than by
   * position and a hope.
   */
  const opening = contract.caseTables
    .flatMap((table) => table.cases)
    .find((entry) => whatKeepsARowFromTheForm(theCallOf(entry, answer).given) === null)

  if (opening === undefined) {
    throw new ThePlaygroundCannotBeBuilt(what, 'the contract settles no case a form can hold')
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
  // One field per parameter of the answer, in the signature's own order, opening on the values the
  // first case writes: the form is the call a case already is. ADR-0011.
  const held = theFieldsFor(opening, answer, what)
  const fields = answer.parameters.map((parameter, index) => {
    const known = theArgumentFor(parameter, what)

    return {
      name: parameter.name,
      type: parameter.type,
      opensOn: held[index] as string,
      reads:
        known.readAs.kind === 'a-literal'
          ? ({ kind: 'a-literal', because: known.readAs.because } as const)
          : ({ kind: 'the-text-itself' } as const),
      constructedBy: known.note,
    }
  })

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

const theArgumentFor = (parameter: ParameterRecord, what: string): Argument => {
  const known = AS_AN_ARGUMENT[parameter.type]
  if (known === undefined) {
    throw new ThePlaygroundCannotBeBuilt(
      what,
      `its parameter \`${parameter.name}\` is declared \`${parameter.type}\`, which no field of this ` +
        `site knows how to build. Extend AS_AN_ARGUMENT in packages/site/playground.ts deliberately, the way ` +
        `packages/registry/value.ts is extended for a value it does not model`,
    )
  }

  return known
}

/**
 * What one field holds for one case, which is the case's own value under one reading and its literal
 * under the other.
 *
 * A text field holding a literal would publish the notation it exists to stop teaching - the field
 * would say `'42'` and mean `42`. So the value is decoded for a text field, and a case writing
 * something that is not a string in a position read as text stops the build rather than being coerced:
 * a form silently opening on `[object Object]` is the same defect as a page rendered with a playground
 * quietly missing.
 */
const theTextFor = (
  reading: Reading,
  opening: EncodedField | undefined,
  written: string,
  parameter: ParameterRecord,
  what: string,
): string => {
  if (reading.kind === 'a-literal') return written

  const value = opening === undefined ? undefined : decode(opening.value)
  const text = reading.opensOn(value)
  if (text === null) {
    throw new ThePlaygroundCannotBeBuilt(
      what,
      `its parameter \`${parameter.name}\` is declared \`${parameter.type}\` and read as text, and ` +
        `the case it opens on writes ${natureOf(value)} there - which this type has no spelling for`,
    )
  }

  return text
}

/**
 * Why a row cannot be loaded into the form, or `null` when it can.
 *
 * **It is derived from what the value is made of, never from a list of cases.** A hand-written
 * perimeter is the shape this repository has refused twice - once in `packages/registry/licence.ts` and once
 * here - because it is right on the day it is written and silently wrong afterwards. Both clauses read
 * the encoded row.
 *
 * **A value with no spelling** is one `packages/site/literal.ts` prints a word for: a function, a promise
 * or a weak collection, an instance of a class. There is no expression that builds the value the
 * contract settled a case about - a rewritten function is a different function, which is the very
 * thing `two-functions-are-not-compared` is about - so the form would open on text that means nothing
 * and the page would teach a notation that does not exist. The case still renders in the table above,
 * where a word is the honest rendering.
 *
 * **A value shared between two arguments** is readable in a row and unreadable in a form. The row is
 * one value and numbers its labels once, so `deepEqual({ [#1 = Symbol('s')]: 1 }, { [#1]: 2 })` says
 * one symbol keys both objects; the form is two independent boxes, and `#1` typed into the second
 * means nothing there. It is a property of the form and not of the notation. ADR-0160.
 */
export const whatKeepsARowFromTheForm = (given: readonly EncodedField[]): string | null => {
  const wordless = given.find((field) => !hasASpelling(field.value))
  if (wordless !== undefined) {
    return `its ${wordless.name} argument has no JavaScript spelling`
  }

  const shared = given.find((field) => {
    const { defined, referred } = labelsIn(field.value)

    return [...referred].some((label) => !defined.has(label))
  })

  return shared === undefined
    ? null
    : `its ${shared.name} argument shares a value with another argument, which two fields cannot spell`
}

/**
 * What every field of the form holds for one row, in the signature's order.
 *
 * Written once and reached three times - by the form, which opens on a case, and by the replay, which
 * drives every case and every use case through the same reading a reader's browser would. Two
 * statements of *what a field holds* would be free to disagree exactly where it matters: on the
 * notation a reader is being taught.
 */
export const theFieldsFor = (
  entry: WrittenAsACall,
  answer: ExportRecord,
  what: string,
): readonly string[] => {
  const { given, written } = theCallOf(entry, answer)

  return answer.parameters.map((parameter, index) =>
    theTextFor(
      theArgumentFor(parameter, what).readAs,
      given[index],
      written[index] as string,
      parameter,
      what,
    ),
  )
}

// ---------------------------------------------------------------------------
// What runs in the browser
// ---------------------------------------------------------------------------

/**
 * What each field spells, which is the form of a value the registry models and the case table prints.
 *
 * **This is the boundary `theCallOf` draws on a case, drawn on a form.** A declared value and an
 * argument are one step apart and the step is not the identity, so the two are one reading with two
 * projections rather than two readings - and what a page *prints* is always the declared half, because
 * that is what a case row prints two centimetres higher.
 *
 * Found in a browser, and by nothing else: printing the built arguments made `date/add@1` answer
 * `a Date, which the registry does not model` to anybody who typed something that is not an instant.
 * That is `encode` refusing an invalid Date - correct for an *answer*, where an invalid Date would
 * violate the contract, and wrong for an *argument*, where `an-input-that-is-not-a-date` is a case
 * this contract settles and publishes. ADR-0096.
 */
export const declaredBy = (
  parameters: readonly ParameterRecord[],
  typed: readonly string[],
): readonly unknown[] =>
  parameters.map((parameter, index) => {
    const known = theArgumentFor(parameter, parameter.name)
    const text = typed[index] ?? ''
    if (known.readAs.kind === 'the-text-itself') return known.readAs.declares(text)

    const declared = read(text)
    if (!known.readAs.spelledBy(declared)) {
      throw new UnusableArgument(
        parameter.name,
        parameter.type,
        natureOf(declared),
        known.readAs.wanted,
      )
    }

    return declared
  })

/** The arguments a call is made with, which is what each field spells put through its type. */
export const argumentsOf = (
  parameters: readonly ParameterRecord[],
  typed: readonly string[],
): readonly unknown[] =>
  declaredBy(parameters, typed).map((declared, index) =>
    theArgumentFor(parameters[index] as ParameterRecord, 'a call').build(declared),
  )

/**
 * A live value, written the way the case table above writes one.
 *
 * `literal(encode(…))` rather than `String(…)`, and that is not tidiness: `parseNumber('-0')` answers a
 * negative zero, `String` prints it `0`, and the contract settles a case on the two being different.
 */
const asALiteral = (value: unknown, path: string): string => literal(encode(value, path))

/**
 * A live answer, back in the declarative form the *row* models - which is not the same thing for every
 * contract, and that is the whole of it.
 *
 * `date/add@1` answers a `Date` and declares its rows as ISO strings, because when it was written
 * `packages/registry/value.ts` had no instant to encode one as. It has since, so a contract written today
 * declares a real `Date` and `object/deep-equal@1` does.
 *
 * **This used to be applied to the arguments as well, and that was the defect.** An argument arrives
 * here already in the form its own row declares - `declaredBy` gives `date/add@1` the text of its date
 * field and `object/deep-equal@1` the value its literal spells - so converting there turned
 * `deepEqual(new Date(0), …)` into `deepEqual('1970-01-01T00:00:00.000Z', …)`, against a row spelling a
 * date. An *invalid* Date is deliberately left alone: it falls through to `encode`, which models it.
 * ADR-0160.
 */
const asADeclaredAnswer = (answer: unknown): unknown =>
  answer instanceof Date && !Number.isNaN(answer.getTime()) ? answer.toISOString() : answer

export const answerWritten = (answer: unknown): string =>
  asALiteral(asADeclaredAnswer(answer), 'the answer')

/**
 * The call that was just made, named with the arguments it was made with.
 *
 * **This replaces an ellipsis rather than adding a line.** The output said `parseNumber(…) → null`,
 * where `(…)` is a literal three dots and not a summary - so the one part of this site that is computed
 * said nothing at all about what it had received. `'1 000'` with a no-break space and `'1 000'` with an
 * ordinary one are the same eight glyphs on screen, both answer `null`, and a reader had no way to tell
 * which of the two the page had read. Written through `literal`, whose escaping is exactly the class of
 * code points that is invisible or that renders on top of its neighbour, the two print apart.
 *
 * It is computed from what arrived and never conditioned on what it contains: a line derived from the
 * arguments cannot fail to name an invisible one, where a test for `is there anything invisible here`
 * can be wrong about its own question. ADR-0043, ADR-0096.
 */
export const callWritten = (name: string, given: readonly unknown[]): string =>
  `${name}(${encodeTogether(given, 'the arguments').map(literal).join(', ')})`

/** How a field is named above the box it is typed into: what the parameter is called, and its type. */
export const theFieldLabelFor = (field: PlaygroundField): string => `${field.name}: ${field.type}`

/**
 * Both halves of the surface, and the second only when there is one to show.
 *
 * A contract answers `T | null` and publishes its reason beside it, so on a refused input the call
 * alone prints `null` and everything that tells one refusal from another is in the other export. The
 * coupling property is that a call fails exactly when it has a description, which is why the second
 * line appears exactly when the first is `null` rather than always.
 *
 * **The diagnostic arrives as something to call rather than as something already called**, and that
 * is what makes the sentence above checkable rather than asserted. A caller evaluating it eagerly
 * would run a contract's diagnostic on every keystroke of every successful call - the reader would
 * never know, both lines would read correctly, and no comparison of the two strings could say so.
 * Handed a thunk, *not calling it* is an observable.
 */
export const theAnswerShown = (
  spelled: readonly unknown[],
  call: { readonly name: string; readonly answered: unknown },
  diagnostic: { readonly name: string; readonly describes: () => unknown } | null,
): readonly string[] => {
  const lines = [`${callWritten(call.name, spelled)} → ${answerWritten(call.answered)}`]

  if (call.answered === null && diagnostic !== null) {
    lines.push(`${callWritten(diagnostic.name, spelled)} → ${answerWritten(diagnostic.describes())}`)
  }

  return lines
}

/**
 * What the form prints when the call threw, which is the thrown value's own words.
 *
 * `String(thrown)` for anything that is not an `Error`, rather than a sentence of this site's: a
 * playground exists to show what a contract does with what somebody typed, and substituting our
 * wording for what it threw is the one thing that would make it lie. `what-a-control-says.ts` answers
 * a fixed sentence to the same shape one door along, and the two are not one rule written twice - a
 * catalogue that cannot be fetched is a failure of ours, and this is the contract speaking.
 */
export const theWhatWentWrong = (thrown: unknown): string =>
  thrown instanceof Error ? thrown.message : String(thrown)

/**
 * What an `<input>` drops, measured rather than read off the specification.
 *
 * Measured in Chrome: setting a field's value to `'\t\n 7 \r\n'` reads back `'\t 7 '` - both the line
 * feed and the carriage return are gone, and the tab survives. A `<textarea>` is not the escape it
 * looks like: it keeps the line feed and still drops the carriage return, so it cannot carry that
 * string either. Every other invisible code point this catalogue settles a case on - a no-break space,
 * a narrow no-break space, a byte order mark, a combining mark, a zero-width joiner, a lone surrogate -
 * survives a text field whole.
 */
const STRIPPED_BY_A_TEXT_FIELD = /[\r\n]/

/** One field of one case that a reader could not retype, with the code points that would be lost. */
export type UntypeableField = {
  readonly name: string
  readonly lost: readonly string[]
}

/**
 * The fields of a case a reader cannot type back into the form, computed from the case itself.
 *
 * The limit is declared on the case that causes it rather than paid for by a control on every field:
 * one case of the catalogue carries a line break, and a sentence on its own row is where somebody
 * meets the question. Computed rather than authored, so a case gaining a line break says so on the day
 * it does and a case losing one stops saying it - which is the difference between a rule and a remark.
 */
export const whatATextFieldCannotCarry = (
  entry: CaseRecord,
  answer: ExportRecord,
  fields: readonly PlaygroundField[],
): readonly UntypeableField[] =>
  theCallOf(entry, answer).given.flatMap((argument, at) => {
    const field = fields[at]
    if (field === undefined || field.reads.kind === 'a-literal') return []

    const value = decode(argument.value)
    if (typeof value !== 'string') return []

    const lost = [...new Set([...value].filter((one) => STRIPPED_BY_A_TEXT_FIELD.test(one)))]

    return lost.length === 0 ? [] : [{ name: field.name, lost: lost.map(escaped) }]
  })
