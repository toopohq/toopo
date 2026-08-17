/**
 * The parameters of a declared signature - what each one is called and what it is declared to be -
 * read off the signature itself.
 *
 * ---------------------------------------------------------------------------
 * What was missing, and how a consumer found it
 * ---------------------------------------------------------------------------
 *
 * A case of block 4.4 is a *call* - ADR-0011 - and until this file existed the registry could not say
 * so. It held the fields of a case as `data` it deliberately does not interpret, and ADR-0004 names
 * the consequence in as many words: no query can ask which field is the answer. A contract page
 * inherits that and cannot render `parseNumber('  42  ')` at all - it can only list `input`,
 * `expected`, `reason` as three fields of equal standing, which is a form of a table and not a call.
 *
 * Measured over the five, on all seven of their case tables: the fields of every case begin with the
 * parameter names of the answer's signature, in the signature's own order, and what remains is the
 * answer. Seven of seven, in order, no exception. So the correspondence was already there, held by
 * nothing.
 *
 * ---------------------------------------------------------------------------
 * Derived rather than declared, and that is the whole design
 * ---------------------------------------------------------------------------
 *
 * The obvious repair is a `parameters` field beside the transcribed type, filled by hand in
 * `the-five.ts` where every other transcription lives. It was refused for the reason
 * `implementation-record.ts` refuses a declared depth and `serialise.ts` refuses a declared sample
 * count: a value read off what it describes is a fact with no second statement to disagree with, and a
 * value written beside it is a claim that can be wrong. A transcribed parameter list would also have
 * left the diagnostic's parameters guarded by nothing at all - the case fields answer for the *answer's*
 * signature and for no other - so the field would have carried two strengths under one classification.
 *
 * What checks the reading is not a second copy of it. It is `serialise.ts`, which refuses a contract
 * whose cases do not begin with the call this file reads: two independent statements - a declared type,
 * and the field names of a hundred and eighty-seven cases - and the guard is their disagreement.
 *
 * ---------------------------------------------------------------------------
 * The limit of reading a type without a compiler, stated rather than discovered
 * ---------------------------------------------------------------------------
 *
 * `packages/validation/typescript-api.ts` records that a hand-written lexical reading is refused where the
 * security filter is concerned, because there an approximation is evaded. This is not that: the text
 * read here is written by this repository, pinned to the contract's own `contract.ts` by
 * `against-the-five.test.ts`, and a misreading cannot be silent - the case fields stop lining up and the
 * serialisation refuses the contract. The direction of failure is what makes the reading affordable.
 *
 * It counts brackets rather than recognising syntax, so what it cannot read it refuses by name. The
 * known limit is a type-parameter list holding a parenthesis before the value parameters begin -
 * `<T extends (x: number) => void>(a: T)` - which none of the five writes; `=>` is skipped while angle
 * brackets are counted, so a function type inside a type parameter is not what breaks it.
 */

import type { ParameterRecord } from './contract-record.js'

export class UnreadableSignature extends Error {
  constructor(text: string, detail: string) {
    super(
      `the declared signature \`${text}\` cannot be read as a function type, and ${detail}. A ` +
        `contract's cases are calls, so the registry has to know what the call's arguments are ` +
        `called; extend packages/registry/signature.ts deliberately rather than leaving a page to render ` +
        `fields it cannot name.`,
    )
    this.name = 'UnreadableSignature'
  }
}

const OPENING = '([{'
const CLOSING = ')]}'

/**
 * How far into `text` the value parameters begin.
 *
 * A generic signature opens with its type parameters, and they hold commas of their own. `=>` is
 * skipped so that a function type inside a type parameter does not close the list early.
 */
const afterTypeParameters = (text: string): number => {
  if (!text.startsWith('<')) return 0

  let depth = 0
  for (let at = 0; at < text.length; at += 1) {
    const character = text[at]
    if (character === '<') depth += 1
    else if (character === '>') {
      if (text[at - 1] === '=') continue
      depth -= 1
      if (depth === 0) return at + 1
    }
  }

  throw new UnreadableSignature(text, 'its type parameter list is never closed')
}

/**
 * The parameter list, from the opening parenthesis to the one that matches it.
 *
 * Angle brackets are counted alongside the three bracket pairs, because `Map<K, T[]>` as a parameter
 * type carries a comma that separates nothing - and a reading that split on it would name half a type
 * as a parameter.
 */
const parameterList = (text: string, from: number): string => {
  if (text[from] !== '(') {
    throw new UnreadableSignature(text, 'no parameter list opens where one has to')
  }

  let brackets = 0
  let angles = 0
  for (let at = from; at < text.length; at += 1) {
    const character = text[at] as string
    if (OPENING.includes(character)) brackets += 1
    else if (character === '<') angles += 1
    else if (character === '>' && text[at - 1] !== '=') angles -= 1
    else if (CLOSING.includes(character)) {
      brackets -= 1
      if (brackets === 0 && angles === 0) return text.slice(from + 1, at)
    }
  }

  throw new UnreadableSignature(text, 'its parameter list is never closed')
}

/** The commas that separate parameters, which are the ones no bracket encloses. */
const splitParameters = (list: string): readonly string[] => {
  const parts: string[] = []
  let brackets = 0
  let angles = 0
  let start = 0

  for (let at = 0; at < list.length; at += 1) {
    const character = list[at] as string
    if (OPENING.includes(character)) brackets += 1
    else if (CLOSING.includes(character)) brackets -= 1
    else if (character === '<') angles += 1
    else if (character === '>' && list[at - 1] !== '=') angles -= 1
    else if (character === ',' && brackets === 0 && angles === 0) {
      parts.push(list.slice(start, at))
      start = at + 1
    }
  }
  parts.push(list.slice(start))

  // A trailing comma leaves an empty part, and `array/group-by@1` writes one.
  return parts.map((part) => part.trim()).filter((part) => part !== '')
}

/**
 * One parameter, split at the colon its own declaration carries.
 *
 * **The type comes back with the name because a consumer needed it, and it cost no new statement.**
 * The site's playground has to build an argument out of text, and what it builds depends on what the
 * parameter is declared to be - a `string` is the text, a `Date` is constructed from it. Reading it
 * here is the same walk that already finds the name: the colon that ends the name begins the type.
 *
 * The alternative was a client re-reading `export.text` for itself, which is precisely the state this
 * field was created to end. Two readings of one source drift; one reading, served, cannot.
 *
 * Whitespace is normalised inside the type, because `array/group-by@1` declares its signature over
 * four lines and a type carrying a newline is the same type as one that does not.
 */
const parameterOf = (text: string, part: string): { name: string; type: string } => {
  let brackets = 0
  let angles = 0

  for (let at = 0; at < part.length; at += 1) {
    const character = part[at] as string
    if (OPENING.includes(character)) brackets += 1
    else if (CLOSING.includes(character)) brackets -= 1
    else if (character === '<') angles += 1
    else if (character === '>' && part[at - 1] !== '=') angles -= 1
    else if (character === ':' && brackets === 0 && angles === 0) {
      return {
        name: part
          .slice(0, at)
          .trim()
          .replace(/^\.{3}/, '')
          .replace(/\?$/, '')
          .trim(),
        type: part.slice(at + 1).replace(/\s+/g, ' ').trim(),
      }
    }
  }

  throw new UnreadableSignature(text, `its parameter \`${part.trim()}\` declares no type`)
}

/**
 * What a caller writes between the parentheses, in order, each with the type it is declared as.
 * Empty for a function that takes nothing.
 *
 * The whitespace of the declared text is irrelevant here and is not normalised away first: the readers
 * above skip it wherever it can occur, and `array/group-by@1` declares its signature over four lines.
 */
export const parametersOf = (text: string): readonly ParameterRecord[] => {
  const trimmed = text.trim()
  const list = parameterList(trimmed, afterTypeParameters(trimmed))

  return splitParameters(list).map((part) => parameterOf(trimmed, part))
}
