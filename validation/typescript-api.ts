/**
 * The one module in this repository that imports a TypeScript compiler API.
 *
 * ---------------------------------------------------------------------------
 * Why the import path says `unstable`
 * ---------------------------------------------------------------------------
 *
 * Stage 1 of the validation pipeline reads source. Reading source correctly means a syntax tree, and
 * a syntax tree means a parser. Measured on the version this repository pins:
 *
 *     $ node --input-type=module -e "import ts from 'typescript'; console.log(Object.keys(ts))"
 *     [ 'version', 'versionMajorMinor' ]
 *
 * TypeScript 7 is the native port. `ts.createSourceFile` and the rest of the classic compiler API are
 * gone from the package root; what the package publishes instead are `typescript/unstable/ast` - the
 * node predicates, `SyntaxKind`, the scanner - and `typescript/unstable/sync`, which spawns the
 * compiler and hands back real syntax trees and a checker. Measured end to end on a contract of the
 * catalogue: 78 ms to spawn and load the project, one further millisecond to walk the 646 nodes of
 * `contracts/date/add/reference.ts`.
 *
 * Three alternatives were considered and are recorded as refused rather than left unmentioned.
 *
 * *Regular expressions.* A lexical filter written by hand is evaded by a space, a comment, an import
 * alias or an indirect access, and it would give the appearance of a filter. On the mechanism that
 * carries this project's supply-chain argument, an approximation is the worst possible thing to ship.
 *
 * *The scanner alone.* `typescript/unstable/ast/scanner` is exactly as unstable and loses the
 * structure that makes a tree worth having. No gain.
 *
 * *TypeScript 5.x, where `createSourceFile` is a long-standing stable API.* Refused, and the reason is
 * not the work: it would mean revalidating 735 guards under a different compiler, and it would settle
 * the project's supported-TypeScript matrix as a side effect of one static-analysis unit. That matrix
 * is an open decision and does not get taken as collateral damage.
 *
 * So the word `unstable` describes the stability of the API, not of the parser, and there is no other
 * correct TypeScript parser inside the permitted perimeter - a fifth dev dependency is forbidden, and
 * a hand-written parser is absurd. The cost is paid in two places, deliberately: `package.json` pins
 * `typescript` to an exact version rather than a range, and the surface this module depends on is
 * declared below and guarded.
 *
 * ---------------------------------------------------------------------------
 * Why the surface is an object rather than a list
 * ---------------------------------------------------------------------------
 *
 * An exact version pin protects against a deliberate upgrade. It does not protect against a
 * reinstall that resolves differently, a refreshed lockfile, or a package whose `exports` map moves
 * a path. A dependency assumption nothing checks is an assumption that will drift, and this one
 * carries the security filter.
 *
 * The obvious form - a list of required names beside the code that uses them - has the failure this
 * repository keeps finding: two statements that can be edited apart, so the analyser could reach for
 * something the list does not name. `TYPESCRIPT_SURFACE` is therefore not a list *about* the surface,
 * it *is* the surface. Everything the analyser uses is read off this object, so a name the package
 * stopped exporting arrives here as `undefined`, and `missingFromTheSurface` names it.
 */

import { API } from 'typescript/unstable/sync'
import * as ast from 'typescript/unstable/ast'

export type { Node, SourceFile } from 'typescript/unstable/ast'
export { API }

/**
 * Every part of the TypeScript API this repository depends on, gathered so that a package which
 * stopped exporting one cannot be discovered by a wrong answer three phases later.
 *
 * `SyntaxKind` is an object and the rest are functions, which is what `missingFromTheSurface`
 * checks: a path that resolved to something of the wrong shape is as broken as one that resolved to
 * nothing, and `undefined` is only the loudest of the two.
 */
export const TYPESCRIPT_SURFACE = {
  SyntaxKind: ast.SyntaxKind,

  isSourceFile: ast.isSourceFile,
  isIdentifier: ast.isIdentifier,
  isStringLiteral: ast.isStringLiteral,
  isNoSubstitutionTemplateLiteral: ast.isNoSubstitutionTemplateLiteral,

  isCallExpression: ast.isCallExpression,
  isNewExpression: ast.isNewExpression,
  isTaggedTemplateExpression: ast.isTaggedTemplateExpression,
  isPropertyAccessExpression: ast.isPropertyAccessExpression,
  isElementAccessExpression: ast.isElementAccessExpression,
  isBinaryExpression: ast.isBinaryExpression,
  isTemplateExpression: ast.isTemplateExpression,

  isImportDeclaration: ast.isImportDeclaration,
  isImportEqualsDeclaration: ast.isImportEqualsDeclaration,
  isExportDeclaration: ast.isExportDeclaration,
  isImportTypeNode: ast.isImportTypeNode,
  isImportSpecifier: ast.isImportSpecifier,
  isNamespaceImport: ast.isNamespaceImport,
  isMetaProperty: ast.isMetaProperty,
  isLiteralTypeNode: ast.isLiteralTypeNode,
  isExternalModuleReference: ast.isExternalModuleReference,

  isTypeReferenceNode: ast.isTypeReferenceNode,
  isTypeAliasDeclaration: ast.isTypeAliasDeclaration,
  isVariableDeclaration: ast.isVariableDeclaration,
  isBindingElement: ast.isBindingElement,
  isObjectBindingPattern: ast.isObjectBindingPattern,
  isQualifiedName: ast.isQualifiedName,

  /**
   * Parentheses, `as`, `satisfies` and `!` wrap an expression without changing what it is, and every
   * one of them was measured defeating a rule that read the expression directly:
   * `(when as Record<string, () => number>)['getMonth']()` and `new (Function)('...')` both passed a
   * reader that asked for an identifier and found a wrapper.
   */
  skipOuterExpressions: ast.skipOuterExpressions,
} as const

/**
 * The names above that the installed package did not provide, or provided as something other than
 * what they are used as. Empty when the entry point is intact.
 *
 * It is a function rather than a constant so that the failure is a guard's red and not a module that
 * throws while it is being imported - which would arrive as a collection error naming a file rather
 * than as a sentence naming the dependency.
 */
export const missingFromTheSurface = (): readonly string[] =>
  Object.entries(TYPESCRIPT_SURFACE)
    .filter(([name, value]) =>
      name === 'SyntaxKind' ? typeof value !== 'object' || value === null : typeof value !== 'function',
    )
    .map(([name]) => name)
