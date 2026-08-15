/**
 * Every evasion that was tried against stage 1, written out so that the boundary is measured rather
 * than assumed.
 *
 * **This is a fixture, not a template**, and it is the adversarial one. Each numbered spelling below
 * reaches something the rules refuse, by a route the rules may or may not read. Which ones pass is not
 * decided here - it is measured by `the-boundary.test.ts`, which pins both columns, so a rule that
 * later closes one of these turns that test red and somebody has to move it from one column to the
 * other deliberately.
 *
 * `date/add@1` already says of its own static analysis requirement that the check is *lexical and
 * therefore evadable on purpose* - written to catch the mistake, while the property catches the
 * adversary. This file is where "on purpose" stops being a word and becomes a list.
 *
 * It is typechecked by nothing, like `refused.ts` beside it: several spellings below are a type error
 * as well as a refusal, and the analyser reads them under the fixtures' own configuration.
 */

declare const untrusted: string

// 1. The global reached through a computed member. The holder is still named.
export const one = (): unknown => (globalThis as unknown as Record<string, () => unknown>)['fe' + 'tch']!()

// 2. The global captured under another name first.
const captured = globalThis as unknown as Record<string, () => unknown>
export const two = (): unknown => captured['fetch']!()

// 3. A forbidden method reached through the prototype with a computed key. The holder is a member
//    access rather than a name.
export const three = (when: Date): number =>
  (Date.prototype as unknown as Record<string, (this: Date) => number>)['get' + 'Month']!.call(when)

// 4. A forbidden method destructured off the prototype, then called as a free function.
const { getMonth } = Date.prototype
export const four = (when: Date): number => getMonth.call(when)

// 5. A forbidden method reached by a literal key.
export const five = (when: Date): number =>
  (when as unknown as Record<string, () => number>)['getMonth']!()

// 6. The same, with the key in a variable.
const key = 'getMonth'
export const six = (when: Date): number => (when as unknown as Record<string, () => number>)[key]!()

// 7. Indirect eval, which runs in global scope rather than in this module's.
export const seven = (): unknown => (0, eval)(untrusted)

// 8. eval captured under another name.
const evaluate = eval
export const eight = (): unknown => evaluate(untrusted)

// 9. The Function constructor, parenthesised.
export const nine = (): unknown => new (Function)('return 1')()

// 10. A local binding that shadows a global. Nothing ambient is reached at all, and the rule has to
//     say so: this is the only entry here that is not an evasion.
export const ten = (process: string): string => process

// 11. The value read that is spelled as a declaration. `{ fetch }` names a property and reads the
//     global beside it, so a reader that stops at "this identifier is its parent's name" is blind.
export const eleven = (): unknown => ({ fetch })

// 12. The same name, bound in one scope and free in another. A reader that asked whether the file
//     declares `crypto` anywhere would answer yes and let the second one through.
export const twelveDeclares = (): string => {
  const crypto = 'a local, and this one reaches nothing'

  return crypto
}
export const twelve = (): unknown => crypto
