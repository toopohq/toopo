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
 * ---------------------------------------------------------------------------
 * Why the reading is scoped
 * ---------------------------------------------------------------------------
 *
 * The API spawns a compiler process. A caller that forgot to close it would leak one per analysis,
 * and a validation pipeline analyses one submission after another. So a reading is handed to a
 * callback and closed in a `finally`, which is the only shape where forgetting is not possible.
 */

import { API, TYPESCRIPT_SURFACE } from './typescript-api.js'
import type { Node, SourceFile } from './typescript-api.js'

const { isSourceFile } = TYPESCRIPT_SURFACE

/** One file of a submission, parsed. `path` is as the caller named it. */
export type ParsedSource = {
  readonly path: string
  readonly file: SourceFile
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

/** Absolute paths reach the compiler with forward slashes whatever the platform wrote them with. */
const normalised = (path: string): string => path.replaceAll('\\', '/')

/**
 * Parse the requested files and hand them to `use`, closing the compiler afterwards whatever
 * happens.
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

    const read = request.files.map((path) => ({
      path,
      file: loaded.program.getSourceFile(normalised(path)),
    }))

    const missing = read.filter((entry) => entry.file === undefined).map((entry) => entry.path)
    if (missing.length > 0) {
      throw new UnreadableSource(project, missing)
    }

    return use(read as readonly ParsedSource[])
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

export const isAFile = (node: Node): boolean => isSourceFile(node)
