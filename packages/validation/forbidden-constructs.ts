/**
 * The security filter, and the thesis it rests on.
 *
 * The project specification states it in one sentence: *in a pure function, malicious code has
 * nowhere to hide.* The catalogue's perimeter - pure functions, zero dependencies - is not an
 * aesthetic choice, it is what makes static analysis sufficient. A catalogue that accepted I/O would
 * need a sandbox; this one needs a reader of syntax trees.
 *
 * Three families, and they are not read the same way.
 *
 * **An import is refused by its module specifier, and a specifier cannot be aliased away.**
 * `import { readFileSync as rf } from 'node:fs'` is caught by `node:fs` whatever the local name is,
 * which is what makes this family robust at the syntactic level. Permanent rule 2 says a feature
 * depends only on other registry features and on native language and runtime APIs - so the rule is
 * not a list of forbidden packages, which would be a race nobody wins. It is the opposite: a relative
 * path is the only thing allowed, and everything else is refused by default. A list of the bad names
 * fails open on the name nobody thought of; a list of the one good shape fails closed.
 *
 * **A name a feature has not declared is refused unless it is permitted**, which is the same shape as
 * the import rule and was arrived at the same way. A list of the bad names fails open on the global
 * nobody thought of, and *nobody thought of it* is the failure mode that matters rather than the one
 * already written down. On the mechanism that carries this project's supply-chain argument, failing
 * closed is the only defensible direction.
 *
 * What makes the closed form affordable is the catalogue's perimeter rather than any cleverness here.
 * Pure functions with no dependency need a small, enumerable set of names, and it was measured rather
 * than assumed: **the five reference implementations between them read seven free identifiers -
 * `Array`, `Date`, `Map`, `Math`, `Number`, `Object`, `undefined` - and every `.ts` file of
 * `contracts/` adds only seven more**: `String`, `Set`, `Error`, `Symbol`, `JSON`, `WeakMap` and
 * `globalThis`, the last of which appears twice, in a property test that writes to it on purpose.
 *
 * Exactly where the boundary sits is measured rather than asserted, in `the-boundary.test.ts`.
 *
 * **A method a contract forbids** is named by that contract and by no other, so the rule takes the
 * list rather than holding it. `date/add@1` publishes twenty local-time methods; a second contract
 * will publish something else, and a rule that hard-coded the first contract's list would be a rule
 * about dates living in the pipeline.
 */

import type { Finding } from './finding.js'
import { findingAt } from './finding.js'
import type { ParsedSource } from './source.js'
import { everyNode } from './source.js'
import { TYPESCRIPT_SURFACE } from './typescript-api.js'
import type { Node } from './typescript-api.js'

const {
  isBinaryExpression,
  isCallExpression,
  isElementAccessExpression,
  isExportDeclaration,
  isExternalModuleReference,
  isIdentifier,
  isImportDeclaration,
  isImportEqualsDeclaration,
  isImportTypeNode,
  isLiteralTypeNode,
  isMetaProperty,
  isNewExpression,
  isNoSubstitutionTemplateLiteral,
  isPropertyAccessExpression,
  isShorthandPropertyAssignment,
  isStringLiteral,
  isTypeNode,
  skipOuterExpressions,
} = TYPESCRIPT_SURFACE

// ---------------------------------------------------------------------------
// What a feature may import
// ---------------------------------------------------------------------------

export const IMPORT_RULE = 'imports-only-a-registry-feature'

/**
 * The only shape an import may take: a relative path to another file of the submission or to another
 * registry feature. A bare specifier is an npm package or a runtime module, and both are refused by
 * permanent rules 2 and 1 respectively.
 */
const isRelative = (specifier: string): boolean =>
  specifier.startsWith('./') || specifier.startsWith('../')

const IMPORT_REASON =
  'a feature may import another registry feature and nothing else. A bare specifier is an external ' +
  'package or a runtime module, and permanent rule 2 forbids the first while permanent rule 1 ' +
  'forbids the second: the only indirection a feature carries is a relative import path, resolved ' +
  'when it is installed.'

/**
 * The specifier of every import-like construct in a file, with the node that carries it.
 *
 * Six forms rather than one, because there are six ways to name a module in TypeScript and a rule
 * that knew about `import ... from` alone would be evaded by the other five. A dynamic `import()`
 * whose argument is not a literal is a seventh case and is handled by the evaluation rule below,
 * where it belongs: what is wrong with it is not which module it names but that nothing static can
 * say.
 */
const specifierOf = (node: Node): { readonly text: string; readonly at: Node } | null => {
  if (isImportDeclaration(node) || isExportDeclaration(node)) {
    const specifier = node.moduleSpecifier
    return specifier !== undefined && isStringLiteral(specifier)
      ? { text: specifier.text, at: specifier }
      : null
  }

  if (isImportTypeNode(node)) {
    const argument = node.argument
    return isLiteralTypeNode(argument) && isStringLiteral(argument.literal)
      ? { text: argument.literal.text, at: argument.literal }
      : null
  }

  if (isImportEqualsDeclaration(node)) {
    const reference = node.moduleReference
    return isExternalModuleReference(reference) && isStringLiteral(reference.expression)
      ? { text: reference.expression.text, at: reference.expression }
      : null
  }

  if (isCallExpression(node) && node.expression.kind === TYPESCRIPT_SURFACE.SyntaxKind.ImportKeyword) {
    const argument = node.arguments[0]
    if (argument !== undefined && (isStringLiteral(argument) || isNoSubstitutionTemplateLiteral(argument))) {
      return { text: argument.text, at: argument }
    }
  }

  return null
}

/** One module a file names, and the node that names it. */
export type ImportSpecifier = { readonly text: string; readonly at: Node }

/**
 * Every module a file names, in every shape it can name one.
 *
 * Exported because two rules ask the same question of a file - which modules does it name - and read
 * different answers out of it: this file refuses the ones outside the registry,
 * `states-its-own-signature.ts` refuses the one that is the submission's own contract. Two
 * traversals of the same six forms would be the duplication that lets one of them learn about a
 * seventh and the other not.
 */
/**
 * Every module this file names, whatever shape the naming took.
 *
 * The parameter is the syntax tree and not a whole `ParsedSource`, because the syntax tree is all this
 * reads - it never asks where a name is bound. A second consumer is what made the difference visible:
 * `packages/cli/rewrite.ts` has a file and no submission, since repointing an import at a shared copy is a
 * question about text rather than about scope, and requiring the wider type would have meant handing it
 * a `bindingOf` it has nothing to answer with. A `ParsedSource` still satisfies this.
 */
export const importSpecifiersIn = (
  source: Pick<ParsedSource, 'file'>,
): readonly ImportSpecifier[] =>
  [...everyNode(source.file)].flatMap((node) => {
    const specifier = specifierOf(node)

    return specifier === null ? [] : [specifier]
  })

export const importsOutsideTheRegistry = (source: ParsedSource): readonly Finding[] =>
  importSpecifiersIn(source).flatMap((specifier) =>
    isRelative(specifier.text) ? [] : [findingAt(IMPORT_RULE, specifier.at, source, IMPORT_REASON)],
  )

// ---------------------------------------------------------------------------
// What a feature may reach
// ---------------------------------------------------------------------------

export const GLOBAL_RULE = 'reaches-no-ambient-state'

/**
 * Every name a feature may read without having declared it.
 *
 * **This list decides, and nothing else does.** A free identifier that is not here is refused,
 * whatever it is and whether or not anybody anticipated it - which is what makes the rule fail closed
 * and is the only reason it is worth more than the twenty-three names it replaced.
 *
 * The line it draws is the ECMAScript standard library, minus what reaches beyond the call. That is a
 * frontier a reader can check rather than a curation: everything below is a pure value API by
 * specification, and everything the language ships that is *not* below is absent for a reason
 * recorded in `WHAT_A_REFUSED_NAME_REACHES`. Whole families of host globals - `fetch`, `document`,
 * `localStorage`, `crypto`, `performance`, `require`, `__dirname` - need no entry anywhere to be
 * refused, and neither does the one nobody has thought of.
 *
 * The catalogue's own vocabulary is what this serves: `no ambient input` and `no ambient output` are
 * two of the four universal properties every contract answers, and `every-contract.ts` records that
 * the second is not reachable by any property - *the guarantee is obtained by static analysis in the
 * validation pipeline, which forbids a feature from reaching global state at all*. This is that
 * sentence, made executable.
 */
export const PERMITTED_GLOBALS: readonly {
  readonly family: string
  readonly why: string
  readonly names: readonly string[]
}[] = [
  {
    family: 'the value properties of the global object',
    why: 'constants. `undefined` in particular is a name no submission can avoid reading',
    names: ['undefined', 'NaN', 'Infinity'],
  },
  {
    family: 'the global functions',
    why: 'total conversions between text and numbers, and between text and its percent-encoding',
    names: [
      'isFinite',
      'isNaN',
      'parseFloat',
      'parseInt',
      'decodeURI',
      'decodeURIComponent',
      'encodeURI',
      'encodeURIComponent',
    ],
  },
  {
    family: 'the fundamental objects',
    why: 'operations on values a caller already handed over, and on nothing else',
    names: ['Object', 'Boolean', 'Symbol', 'Reflect', 'Proxy'],
  },
  {
    family: 'numbers, dates and text',
    why:
      'the arithmetic and the parsing three of the five contracts are built on. `Math.random` and ' +
      '`Date.now` are the two members that turn one of these into ambient input, and they are ' +
      'refused below rather than their holders',
    names: ['Number', 'BigInt', 'Math', 'Date', 'String', 'RegExp'],
  },
  {
    family: 'collections',
    why: 'containers a feature builds from its arguments and returns',
    names: ['Array', 'Map', 'Set', 'WeakMap', 'WeakSet'],
  },
  {
    family: 'binary data',
    why: 'buffers a feature allocates for itself. `SharedArrayBuffer` is not here and says why below',
    names: [
      'ArrayBuffer',
      'DataView',
      'Int8Array',
      'Uint8Array',
      'Uint8ClampedArray',
      'Int16Array',
      'Uint16Array',
      'Int32Array',
      'Uint32Array',
      'Float32Array',
      'Float64Array',
      'BigInt64Array',
      'BigUint64Array',
    ],
  },
  {
    family: 'errors',
    why: 'the catalogue answers `T | null` rather than throwing, but a feature may still be handed one',
    names: [
      'Error',
      'AggregateError',
      'EvalError',
      'RangeError',
      'ReferenceError',
      'SyntaxError',
      'TypeError',
      'URIError',
    ],
  },
  { family: 'structured text', why: 'a total encoding of values, reaching nothing', names: ['JSON'] },
  {
    family: 'deferred work',
    why:
      'no contract of the five is asynchronous, and a promise still reaches nothing: it defers a ' +
      'computation over values already in hand. The scheduler that would - `setTimeout`, ' +
      '`queueMicrotask` - is a host global and is absent',
    names: ['Promise'],
  },
  {
    family: 'the call itself',
    why:
      'the one thing a feature is unconditionally allowed to read. It is here because refusing it ' +
      'would be refusing a parameter under another spelling, not because anything needs it: `...rest` ' +
      'is what the five write',
    names: ['arguments'],
  },
]

const PERMITTED = new Set(PERMITTED_GLOBALS.flatMap((family) => family.names))

/**
 * What a refused name reaches, for the names where saying so is worth more than the general refusal.
 *
 * **This does not decide anything.** The list above does, and a name absent from both is refused with
 * the general sentence. What this buys is the half of the refusal a submitter is owed: *which
 * guarantee did I cross*, which "not in the permitted set" cannot answer.
 *
 * It matters most for the names that are language APIs and are still refused. A submitter told that
 * `Intl` is "not a language API" would be told something false; told that every `Intl` constructor
 * falls back to the host's default locale when none is supplied, they know what to do about it.
 *
 * Nothing here may be permitted above, and `forbidden-constructs.test.ts` refuses the overlap - two
 * lists that can be edited apart is the failure this repository keeps finding.
 */
export const WHAT_A_REFUSED_NAME_REACHES: readonly {
  readonly name: string
  readonly reaches: string
}[] = [
  { name: 'eval', reaches: 'the evaluator, which runs text as code, so what a feature does is not what it says' },
  { name: 'Function', reaches: 'the evaluator under another name, compiling text into a function in global scope' },
  {
    name: 'Intl',
    reaches:
      'the host\'s default locale, which every constructor of it falls back to when no locale is ' +
      'supplied - ambient input the signature does not declare',
  },
  {
    name: 'WeakRef',
    reaches: 'the garbage collector\'s timing, so two identical calls may legitimately disagree',
  },
  {
    name: 'FinalizationRegistry',
    reaches: 'the garbage collector\'s timing, so two identical calls may legitimately disagree',
  },
  { name: 'SharedArrayBuffer', reaches: 'memory shared with other agents, which is ambient output' },
  { name: 'Atomics', reaches: 'memory shared with other agents, which is ambient output' },

  { name: 'process', reaches: 'the process: its environment, its arguments, its streams and its exit' },
  { name: 'require', reaches: 'the module loader, which is an import the specifier rule cannot see' },
  { name: '__dirname', reaches: 'the location of the installed file, which differs per installation' },
  { name: '__filename', reaches: 'the location of the installed file, which differs per installation' },
  { name: 'console', reaches: 'the process output stream, which is ambient output' },

  { name: 'globalThis', reaches: 'global state, both to read it and to write it' },
  { name: 'global', reaches: 'global state, under the name Node gives it' },
  { name: 'window', reaches: 'global state, under the name a browser gives it' },
  { name: 'self', reaches: 'global state, under the name a worker gives it' },
  { name: 'document', reaches: 'the document, which is neither an argument nor a language API' },
  { name: 'navigator', reaches: 'the machine: its language, its platform, its network' },
  { name: 'localStorage', reaches: 'storage that outlives the call' },
  { name: 'sessionStorage', reaches: 'storage that outlives the call' },
  { name: 'indexedDB', reaches: 'storage that outlives the call' },

  { name: 'fetch', reaches: 'the network' },
  { name: 'XMLHttpRequest', reaches: 'the network' },
  { name: 'WebSocket', reaches: 'the network' },
  { name: 'EventSource', reaches: 'the network' },
  { name: 'Request', reaches: 'the network' },
  { name: 'Response', reaches: 'the network' },
  { name: 'URL', reaches: 'a constructed address, which the specification names as a refusal of its own' },
  { name: 'URLSearchParams', reaches: 'a constructed address, which the specification names as a refusal of its own' },

  { name: 'performance', reaches: 'the clock, which is ambient input the signature does not declare' },
  { name: 'crypto', reaches: 'the entropy source, so two calls with one argument may disagree' },
]

/**
 * Members of an otherwise permitted global that reach ambient state.
 *
 * `Math` and `Date` are language APIs a feature is allowed to use - `date/add@1` is built on `Date`
 * and `Math.min` - so the ban cannot be on the object. It is on the two members that turn a pure
 * call into an impure one, and naming them here rather than banning their holders is what keeps the
 * rule from refusing the catalogue it exists to protect.
 */
export const FORBIDDEN_MEMBERS: readonly {
  readonly holder: string
  readonly member: string
  readonly reaches: string
}[] = [
  { holder: 'Math', member: 'random', reaches: 'the entropy source, so a call is not deterministic' },
  { holder: 'Date', member: 'now', reaches: 'the clock, which is ambient input the signature does not declare' },
]

/**
 * A name used as a value rather than as a property or a declaration.
 *
 * The distinction is what stops the rule from refusing `{ fetch: 1 }.fetch`, where the name is a
 * member of an object the submission wrote and reaches nothing.
 *
 * **The shorthand property is the exception, and it is the one the general form gets wrong.**
 * `{ fetch }` is a declaration *and* a read: it names a property and it reads the value beside it.
 * A reader that stopped at "this identifier is its parent's name" would let it through, which is
 * evasion 11 of `fixtures/the-boundary.ts`.
 */
const isReadAsAValue = (node: Node): boolean => {
  const parent = node.parent
  if (parent === undefined) return true

  if (isShorthandPropertyAssignment(parent) && parent.name === node) return true

  if (isPropertyAccessExpression(parent) && parent.name === node) return false

  return !('name' in parent && parent.name === node)
}

/**
 * Whether a name is part of a type rather than of the code that runs.
 *
 * A type is erased, so it reaches nothing and refusing one would buy nothing. What it would cost is
 * the whole of `lib.*.d.ts` in the permitted list: measured on the catalogue and the fixtures, the
 * free identifiers in type position are `Record`, `Date`, `Map` and `InspectOptions` - three library
 * types and one that arrives through `import('node:util')`, which the import rule refuses by its
 * specifier and in no way needs this rule's help with.
 */
const inATypePosition = (node: Node): boolean => {
  for (let at = node.parent; at !== undefined; at = at.parent) {
    if (isTypeNode(at)) return true
  }

  return false
}

/**
 * The expression under its wrappers.
 *
 * Parentheses, `as`, `satisfies` and `!` change nothing about what an expression *is*, and each of
 * them was measured defeating a rule that asked for an identifier and found a wrapper:
 * `(when as Record<string, () => number>)['getMonth']()` and `new (Function)('return 1')` both passed
 * before this existed. Unwrapping is the compiler's own `skipOuterExpressions`, so the set of things
 * that count as a wrapper is TypeScript's rather than a list maintained here.
 */
const under = (node: Node): Node => skipOuterExpressions(node)

const memberReached = (node: Node): { readonly holder: string; readonly member: string } | null => {
  if (isPropertyAccessExpression(node)) {
    const holder = under(node.expression)
    if (isIdentifier(holder)) return { holder: holder.text, member: node.name.text }
  }

  if (isElementAccessExpression(node)) {
    const holder = under(node.expression)
    const argument = under(node.argumentExpression)
    if (isIdentifier(holder) && (isStringLiteral(argument) || isNoSubstitutionTemplateLiteral(argument))) {
      return { holder: holder.text, member: argument.text }
    }
  }

  return null
}

/** The closing half of every refusal this rule makes, so that the two forms end the same way. */
const WHAT_A_FEATURE_MAY_REACH =
  'A feature may read and write its arguments and its own module scope, and nothing else.'

const whyThisNameIsRefused = (name: string): string => {
  const known = WHAT_A_REFUSED_NAME_REACHES.find((entry) => entry.name === name)

  return known === undefined
    ? `\`${name}\` is not a parameter, a local, an import of this submission, or one of the names ` +
        `\`PERMITTED_GLOBALS\` admits, so nothing establishes what it reaches. ${WHAT_A_FEATURE_MAY_REACH}`
    : `\`${name}\` reaches ${known.reaches}. ${WHAT_A_FEATURE_MAY_REACH}`
}

export const ambientStateReached = (source: ParsedSource): readonly Finding[] =>
  [...everyNode(source.file)].flatMap((node) => {
    const member = memberReached(node)
    const forbiddenMember = FORBIDDEN_MEMBERS.find(
      (entry) => member !== null && entry.holder === member.holder && entry.member === member.member,
    )
    if (forbiddenMember !== undefined) {
      return [
        findingAt(
          GLOBAL_RULE,
          node,
          source,
          `\`${forbiddenMember.holder}.${forbiddenMember.member}\` reaches ${forbiddenMember.reaches}.`,
        ),
      ]
    }

    if (!isIdentifier(node) || !isReadAsAValue(node) || inATypePosition(node)) return []
    if (PERMITTED.has(node.text)) return []
    if (source.bindingOf(node) === 'the-submission') return []

    return [findingAt(GLOBAL_RULE, node, source, whyThisNameIsRefused(node.text))]
  })

// ---------------------------------------------------------------------------
// What a feature may not build at run time
// ---------------------------------------------------------------------------

export const EVALUATION_RULE = 'builds-no-code-at-run-time'

/**
 * Whether an expression is the named evaluator, under whatever it is wrapped in.
 *
 * `(0, eval)(text)` and `new (Function)('...')` are the two spellings that were measured passing a
 * reader that asked the expression to *be* an identifier. The comma form is not a wrapper - it is a
 * sequence whose value is its last operand, and it is the documented way to obtain *indirect* eval,
 * which runs in global scope rather than in the caller's - so it is unwrapped here deliberately and
 * not as a side effect.
 */
const isEvaluator = (expression: Node, name: string): boolean => {
  const called = under(expression)
  if (isIdentifier(called)) return called.text === name

  return isBinaryExpression(called) && isEvaluator(called.right, name)
}

/**
 * Code that is not there to be read.
 *
 * Every rule above reads what is written. These three constructs decide what runs *while* it runs, so
 * nothing written can be read about them - which makes them the one family where the filter cannot
 * be lexical-and-good-enough. They are refused outright rather than inspected.
 *
 * A dynamic `import()` with a literal specifier is not here: it names a module, so the import rule
 * reads it like any other. One whose argument is computed is here, because that is the case where
 * nothing static can say which module it is.
 *
 * **`eval` and `Function` are refused twice over, and that is deliberate rather than left over.**
 * Since the permitted-name rule became a closed list, naming either of them is already a refusal -
 * and that rule is the one that catches `const evaluate = eval`, where nothing is built yet and there
 * is no call to read. This rule catches the construct: a submitter who writes `eval(input)` is owed
 * the sentence that names what they did, not only the one that names a list they are not on. Two
 * rules answer two questions about one line, both answers are true, and repairing the line removes
 * both findings.
 */
export const codeBuiltAtRunTime = (source: ParsedSource): readonly Finding[] =>
  [...everyNode(source.file)].flatMap((node) => {
    if (isCallExpression(node) && isEvaluator(node.expression, 'eval')) {
      return [
        findingAt(
          EVALUATION_RULE,
          node,
          source,
          '`eval` runs text as code, so what this feature does is not what it says.',
        ),
      ]
    }

    if (
      (isNewExpression(node) || isCallExpression(node)) &&
      isEvaluator(node.expression, 'Function')
    ) {
      return [
        findingAt(
          EVALUATION_RULE,
          node,
          source,
          'the `Function` constructor compiles text into a function, which is `eval` under another ' +
            'name and reaches global scope rather than this module\'s.',
        ),
      ]
    }

    if (
      isCallExpression(node) &&
      node.expression.kind === TYPESCRIPT_SURFACE.SyntaxKind.ImportKeyword &&
      specifierOf(node) === null
    ) {
      return [
        findingAt(
          EVALUATION_RULE,
          node,
          source,
          'a dynamic import whose module is computed names something no reader can determine, so ' +
            'the import rule cannot be applied to it at all.',
        ),
      ]
    }

    if (isMetaProperty(node)) {
      return [
        findingAt(
          EVALUATION_RULE,
          node,
          source,
          '`import.meta` carries the location and the loader of the installed file, which differ ' +
            'per installation.',
        ),
      ]
    }

    return []
  })

// ---------------------------------------------------------------------------
// What a particular contract forbids
// ---------------------------------------------------------------------------

export const CONTRACT_METHOD_RULE = 'calls-no-method-its-contract-forbids'

/**
 * Method calls a contract names as forbidden, matched as calls so that a family sharing a prefix is
 * untouched.
 *
 * `date/add@1` requires this of its implementations and states the requirement as data in public,
 * *because a requirement that lives only inside a tool nobody can read is not part of a contract
 * whose whole product is auditability*. Twenty method names, and the `getUTC*` and `setUTC*` families
 * next to them are the whole point of matching a call rather than a substring.
 *
 * The computed form - `d['get' + 'Month']()` - is not reached, and `date/add@1` says so of its own
 * requirement before this analyser existed: the check is lexical and therefore evadable on purpose,
 * written to catch the mistake while the property catches the adversary. `the-boundary.test.ts`
 * measures exactly which spellings pass.
 */
export const contractForbiddenMethods = (
  source: ParsedSource,
  methods: readonly string[],
  because: string,
): readonly Finding[] => {
  const forbidden = new Set(methods)

  return [...everyNode(source.file)].flatMap((node) => {
    if (!isCallExpression(node)) return []

    const called = memberReached(under(node.expression))
    if (called === null || !forbidden.has(called.member)) return []

    return [
      findingAt(
        CONTRACT_METHOD_RULE,
        node,
        source,
        `this contract forbids \`${called.member}\`: ${because}`,
      ),
    ]
  })
}
