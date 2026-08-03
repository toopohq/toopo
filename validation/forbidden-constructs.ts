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
 * **A global is reached by name**, and here the check is genuinely lexical. It is written to catch
 * the mistake, not the adversary, and `date/add@1` already says so of its own requirement in as many
 * words - *lexical and therefore evadable on purpose*. Exactly where the boundary sits is measured
 * rather than asserted, in `the-boundary.test.ts`.
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
  isStringLiteral,
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
export const importSpecifiersIn = (source: ParsedSource): readonly ImportSpecifier[] =>
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
 * The globals a pure function may not name, each with what it reaches.
 *
 * Declared rather than regex-matched, and grouped by what the reach *is*, because a submitter who is
 * refused deserves to know which guarantee they crossed rather than a list they must interpret. The
 * catalogue's own vocabulary is used: `no ambient input` and `no ambient output` are two of the four
 * universal properties every contract answers, and `every-contract.ts` records that the second is not
 * reachable by any property - *the guarantee is obtained by static analysis in the validation
 * pipeline, which forbids a feature from reaching global state at all*. This is that sentence, made
 * executable.
 */
export const FORBIDDEN_GLOBALS: readonly { readonly name: string; readonly reaches: string }[] = [
  { name: 'process', reaches: 'the process: its environment, its arguments, its streams and its exit' },
  { name: 'require', reaches: 'the module loader, which is an import the specifier rule cannot see' },
  { name: '__dirname', reaches: 'the location of the installed file, which differs per installation' },
  { name: '__filename', reaches: 'the location of the installed file, which differs per installation' },

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

const GLOBAL_NAMES = new Set(FORBIDDEN_GLOBALS.map((entry) => entry.name))

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
 * The distinction is what stops the rule from refusing `{ fetch: 1 }.fetch` or a parameter somebody
 * called `document`. It is not a scope analysis: an identifier the submission itself declared is
 * still reported, and that is measured rather than glossed over in `the-boundary.test.ts`.
 */
const isReadAsAValue = (node: Node): boolean => {
  const parent = node.parent
  if (parent === undefined) return true

  if (isPropertyAccessExpression(parent) && parent.name === node) return false

  return !('name' in parent && parent.name === node)
}

const memberReached = (node: Node): { readonly holder: string; readonly member: string } | null => {
  if (isPropertyAccessExpression(node) && isIdentifier(node.expression)) {
    return { holder: node.expression.text, member: node.name.text }
  }

  if (isElementAccessExpression(node) && isIdentifier(node.expression)) {
    const argument = node.argumentExpression
    if (isStringLiteral(argument) || isNoSubstitutionTemplateLiteral(argument)) {
      return { holder: node.expression.text, member: argument.text }
    }
  }

  return null
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

    if (!isIdentifier(node) || !GLOBAL_NAMES.has(node.text) || !isReadAsAValue(node)) return []

    const global = FORBIDDEN_GLOBALS.find((entry) => entry.name === node.text)!

    return [
      findingAt(
        GLOBAL_RULE,
        node,
        source,
        `\`${global.name}\` reaches ${global.reaches}. A feature may read and write its arguments ` +
          `and its own module scope, and nothing else.`,
      ),
    ]
  })

// ---------------------------------------------------------------------------
// What a feature may not build at run time
// ---------------------------------------------------------------------------

export const EVALUATION_RULE = 'builds-no-code-at-run-time'

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
 */
export const codeBuiltAtRunTime = (source: ParsedSource): readonly Finding[] =>
  [...everyNode(source.file)].flatMap((node) => {
    if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === 'eval') {
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
      isIdentifier(node.expression) &&
      node.expression.text === 'Function'
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

    const called = memberReached(node.expression)
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
