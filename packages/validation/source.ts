/**
 * Reading a submission without running it.
 *
 * ---------------------------------------------------------------------------
 * The constraint the whole stage is built on
 * ---------------------------------------------------------------------------
 *
 * **Stage 1 never imports what it analyses.** Importing is executing, and stage 1 is the filter that
 * runs *before* anything executes: it is what stands between a submission and every later stage that
 * does run code. A checker that imported the module it was vetting would have handed control to the
 * submission before deciding whether the submission was allowed to have it.
 *
 * That is not a precaution about this repository's own five contracts, which are trusted. It is the
 * shape of the filter, and it decides what stage 1 can and cannot check. Everything below is read off
 * source text through a syntax tree. Anything that would need the *value* of a declaration - the
 * fields of an identity object, the entries of a case table, the answers in `universalProperties` - is
 * out of reach here by construction, whatever else recommends it, and belongs to a stage that has
 * already decided the code is safe to evaluate.
 *
 * Building a program is not running one. The compiler resolves imports and binds symbols; it never
 * evaluates a module body.
 *
 * **The binder is on this side of that line, and the permitted-name rule is built on it.** Asking
 * where a name is bound is asking the compiler what it resolved, not what the module computes: a
 * submission that never runs still has parameters, locals and imports. What that buys is the
 * difference between a parameter somebody called `process` and a read of the real one, which no
 * amount of reading names can tell apart.
 *
 * ---------------------------------------------------------------------------
 * Why the reading is scoped
 * ---------------------------------------------------------------------------
 *
 * The API spawns a compiler process. A caller that forgot to close it would leak one per analysis,
 * and a validation pipeline analyses one submission after another. So a reading is handed to a
 * callback and closed in a `finally`, which is the only shape where forgetting is not possible.
 */

import { API, TYPESCRIPT_SURFACE, missingFromTheChecker } from './typescript-api.js'
import type { Checker, Node, Program, SourceFile } from './typescript-api.js'

const { isShorthandPropertyAssignment } = TYPESCRIPT_SURFACE

/**
 * Where the name an identifier reads is bound.
 *
 * `free` covers two cases that are one question here: a name declared outside the submission - a
 * library type, an ambient declaration, a package - and a name declared nowhere at all. `globalThis`
 * is the measured instance of the second: the checker resolves it to a symbol with no declaration.
 * Neither is something the submission brought with it, and that is the whole of what the rule asks.
 */
export type Binding = 'the-submission' | 'free'

/** One file of a submission, parsed. `path` is as the caller named it. */
export type ParsedSource = {
  readonly path: string
  readonly file: SourceFile
  /**
   * Where the name this identifier reads is bound, relative to the whole submission rather than to
   * this file: a submission of several files imports between them by relative path, and a name that
   * arrived that way is as local as a parameter.
   */
  readonly bindingOf: (identifier: Node) => Binding
}

export type SourceRequest = {
  /** The `tsconfig.json` the files are read under, absolute. */
  readonly project: string
  /** The files to parse, absolute. */
  readonly files: readonly string[]
}

/**
 * A file the compiler did not put in the program is refused rather than skipped.
 *
 * A missing file that came back as an empty analysis would be a submission passing every rule by not
 * being read - which is the same family as an anchor that matches nothing in the mutation instrument,
 * and it is refused for the same reason: what it leaves behind looks exactly like a result.
 */
export class UnreadableSource extends Error {
  constructor(project: string, missing: readonly string[]) {
    super(
      `${missing.length} file(s) are not in the program of ${project}, so nothing can be ` +
        `established about them. A file that is not read passes every rule for the wrong reason.\n` +
        missing.map((path) => `  ${path}`).join('\n'),
    )
    this.name = 'UnreadableSource'
  }
}

/**
 * A checker that does not answer to what the analyser reads off it is refused before any rule runs.
 *
 * The same failure `missingFromTheSurface` exists for, arriving through the other half of the
 * dependency: a method the package moved would leave the permitted-name rule resolving nothing, and
 * a rule that resolves nothing calls every name free - so a clean submission would be refused
 * wholesale rather than silently accepted. Loud either way is not the point; being a named refusal
 * rather than an avalanche of findings is.
 */
export class UnusableChecker extends Error {
  constructor(missing: readonly string[]) {
    super(
      `the TypeScript checker does not provide ${missing.join(', ')}, so where a name is bound ` +
        `cannot be established and no rule that asks would mean anything.`,
    )
    this.name = 'UnusableChecker'
  }
}

/** Absolute paths reach the compiler with forward slashes whatever the platform wrote them with. */
const normalised = (path: string): string => path.replaceAll('\\', '/')

/**
 * Where a name is bound, asked of the compiler rather than reconstructed.
 *
 * A declaration comes back as a handle carrying the path of the file that holds it, and the program's
 * own lookup turns that path into the very `SourceFile` object the submission was parsed into. So the
 * comparison is object identity and never string arithmetic - which matters more than it looks:
 * measured on this platform, a handle's path is lower-cased (`c:/users/...`) where the file's own
 * `fileName` is not, so comparing the two as text would answer `free` for every local in the
 * submission.
 *
 * A shorthand property is asked differently because it is two things at once. `{ fetch }` declares a
 * property *and* reads a value, and `getSymbolAtLocation` answers with the property - so the value
 * would come back bound to the object literal the submission just wrote.
 */
const bindingIn = (
  program: Program,
  checker: Checker,
  submission: ReadonlySet<SourceFile>,
  identifier: Node,
): Binding => {
  const parent = identifier.parent
  const symbol =
    parent !== undefined && isShorthandPropertyAssignment(parent) && parent.name === identifier
      ? checker.getShorthandAssignmentValueSymbol(parent)
      : checker.getSymbolAtLocation(identifier)

  const brought = (symbol?.declarations ?? []).some((handle) => {
    const declaring = program.getSourceFile(handle.path)

    return declaring !== undefined && submission.has(declaring)
  })

  return brought ? 'the-submission' : 'free'
}

/**
 * Parse the requested files and hand them to `use`, closing the compiler afterwards whatever
 * happens.
 *
 * The files of one call are one submission. That is what makes a name imported from a sibling file
 * local rather than free, and it is why a caller hands over everything the submission is made of
 * rather than one file at a time.
 */
export const readSources = <T>(
  request: SourceRequest,
  use: (sources: readonly ParsedSource[]) => T,
): T => {
  const project = normalised(request.project)
  const api = new API({ cwd: project.slice(0, project.lastIndexOf('/')) })

  try {
    const snapshot = api.updateSnapshot({ openProjects: [project] })
    const loaded = snapshot.getProject(project)
    if (loaded === undefined) {
      throw new UnreadableSource(project, request.files)
    }

    const unusable = missingFromTheChecker(loaded.checker)
    if (unusable.length > 0) {
      throw new UnusableChecker(unusable)
    }

    const missing: string[] = []
    const read: { readonly path: string; readonly file: SourceFile }[] = []
    for (const path of request.files) {
      const file = loaded.program.getSourceFile(normalised(path))
      if (file === undefined) missing.push(path)
      else read.push({ path, file })
    }

    if (missing.length > 0) {
      throw new UnreadableSource(project, missing)
    }

    const submission = new Set(read.map((entry) => entry.file))

    return use(
      read.map((entry) => ({
        ...entry,
        bindingOf: (identifier: Node): Binding =>
          bindingIn(loaded.program, loaded.checker, submission, identifier),
      })),
    )
  } finally {
    api.close()
  }
}

/**
 * Every node of a file, the file itself included.
 *
 * Written as a generator so that a rule states what it is looking for and never how to walk, and so
 * that two rules over one file cost one traversal each rather than one shared traversal nobody can
 * read. A rule is a filter over this sequence.
 */
export function* everyNode(from: Node): Generator<Node> {
  yield from

  const children: Node[] = []
  from.forEachChild((child) => {
    children.push(child)
  })

  for (const child of children) yield* everyNode(child)
}

/** The text a node occupies in its own file, for a refusal that quotes what it refuses. */
export const textOf = (node: Node, source: ParsedSource): string => node.getText(source.file)

/** Where a node sits, as `file:line`, so a refusal can be opened rather than searched for. */
export const positionOf = (node: Node, source: ParsedSource): string => {
  const { line } = source.file.getLineAndCharacterOfPosition(node.getStart(source.file))

  return `${source.path}:${line + 1}`
}
