/**
 * What the user reads. The first surface of this product anybody will ever see.
 *
 * Three rules, and they are the whole file.
 *
 * **The cost is stated before the files are.** How many files, how many bytes, how deep - it is a
 * promise this project makes about what installing something costs, and a promise printed after the
 * list is a promise the reader has already stopped looking for.
 *
 * **Anything the installer did to a file is said on the line of that file.** A shared file written
 * once, an import repointed - both are things that happened to somebody's code, and a tool that
 * silently improved their code would be the tool permanent rule 4 exists to forbid.
 *
 * **A refusal says what was refused and that nothing was written.** The second half matters more than
 * it looks: the reader's next question is always whether their project is now half-changed.
 *
 * No colour, and it is not an omission. Colour needs either a dependency or an escape-code table of
 * our own, it is wrong in a pipe, wrong in a log and wrong for whoever cannot see it - and none of the
 * three lines above needs it to work.
 */

import { renderContract } from '../registry/address.js'
import type { Configuration } from './configuration.js'
import { renderCount } from './diff.js'
import type { InstalledEntry, Installation } from './install.js'
import type { FileOutcome, FileVerdict, Update } from './update.js'

/**
 * Bytes as a person reads them. Decimal thousands, because that is what a file manager shows and this
 * figure is a claim about size rather than about memory.
 */
export const readableBytes = (bytes: number): string =>
  bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} kB`

const INDENT = '  '

const paragraph = (text: string, width = 76): readonly string[] => {
  const lines: string[] = []
  let line = ''

  for (const word of text.split(/\s+/).filter((entry) => entry !== '')) {
    if (line === '') line = word
    else if (line.length + 1 + word.length <= width) line = `${line} ${word}`
    else {
      lines.push(line)
      line = word
    }
  }
  if (line !== '') lines.push(line)

  return lines
}

/**
 * The line the user has to write, ready to copy, and the two facts that stop it from being wrong.
 *
 * **The path is written from the project root**, and it says so, because the specifier depends on which
 * file the import is written in and this tool does not read the user's sources. The measured mistake it
 * closes is the one made by somebody with this source code in front of them: `./src/lib/toopo/...`
 * typed into a project where `init` had chosen `lib/toopo`. Printing the configured directory - rather
 * than a plausible one - is what makes that impossible to get wrong twice.
 *
 * **The extension is `.js`, and there is only one.** It is not a property of the user's toolchain, it
 * is a property of what this installer writes: our own files import each other with `.js`, so a line
 * suggesting anything else would tell the user to spell one thing one way while our files spell it
 * another. Measured under TypeScript 7.0.2 with `"type": "module"`, `./x.js` is the one spelling that
 * resolves under `bundler`, `node16` and `nodenext` alike - `./x.ts` is TS5097 under all three unless
 * `allowImportingTsExtensions` is set, and `./x` is TS2835 under two of them.
 */
export const renderImportLine = (
  entry: InstalledEntry,
  configuration: Configuration,
): readonly string[] => [
  `${INDENT}import { ${entry.exports.map((held) => held.name).join(', ')} } from ` +
    `'./${configuration.directory}/${entry.path.replace(/\.ts$/, '.js')}'`,
  '',
  ...paragraph(
    'Written from the project root. The extension is .js although the file is .ts, which is the ' +
      'one spelling TypeScript and every bundler resolve.',
  ).map((line) => `${INDENT}${line}`),
]

export const renderInit = (configuration: Configuration, existed: boolean): string =>
  [
    '',
    `${INDENT}toopo.json  ${existed ? 'updated' : 'written'}`,
    `${INDENT}features    ${configuration.directory}`,
    '',
    `${INDENT}Change the folder with  toopo init --dir <path>`,
    `${INDENT}Install something with  toopo add string/slugify`,
    '',
  ].join('\n')

export const renderInstallation = (
  installation: Installation,
  configuration: Configuration,
): string => {
  const { cost } = installation
  const notes = new Map<string, string>()
  for (const file of installation.shared) {
    notes.set(file.path, `shared with ${file.alsoCarriedBy.join(', ')}`)
  }
  for (const write of installation.writes) {
    if (write.repointed && !notes.has(write.path)) notes.set(write.path, 'import repointed')
  }

  // Wide enough to align the notes, and applied only to the lines that have one - a padded line with
  // nothing after it is trailing whitespace in the first output anybody sees.
  const width = Math.max(
    ...installation.writes
      .filter((write) => notes.has(write.path))
      .map((write) => `${configuration.directory}/${write.path}`.length),
    0,
  )

  return [
    '',
    `${INDENT}${renderContract(installation.contract)} · ` +
      `${installation.implementation.id}@${installation.implementation.version}`,
    '',
    ...paragraph(installation.summary).map((line) => `${INDENT}${line}`),
    '',
    `${INDENT}${cost.files} ${cost.files === 1 ? 'file' : 'files'} · ` +
      `${readableBytes(cost.bytes)} · depth ${cost.depth}`,
    '',
    ...installation.writes.map((write) => {
      const path = `${configuration.directory}/${write.path}`
      const note = notes.get(write.path)

      return note === undefined
        ? `${INDENT}  + ${path}`
        : `${INDENT}  + ${path.padEnd(width)}  ${note}`
    }),
    '',
    ...(installation.dependencies.length === 0
      ? []
      : [
          `${INDENT}  pulled in: ` +
            installation.dependencies.map((held) => renderContract(held.contract)).join(', '),
          '',
        ]),
    ...renderImportLine(installation.entry, configuration),
    '',
    `${INDENT}Recorded in toopo.lock`,
    '',
  ].join('\n')
}

/**
 * Nothing to do, and the import line anyway.
 *
 * Running `toopo add` on something already installed is most often somebody who has forgotten how to
 * import it, so answering "nothing to do" and stopping would be answering the question they did not ask.
 */
export const renderUnchanged = (
  what: string,
  entry: InstalledEntry,
  configuration: Configuration,
  recorded: boolean,
): string =>
  [
    '',
    `${INDENT}${what} is already installed, and every file is as it was written.`,
    ...(recorded
      ? [
          '',
          `${INDENT}It was there as a dependency. toopo.lock now records that you asked for it, so`,
          `${INDENT}it stays even if nothing imports it any more.`,
        ]
      : []),
    '',
    ...renderImportLine(entry, configuration),
    '',
  ].join('\n')

// ---------------------------------------------------------------------------
// `toopo update`
// ---------------------------------------------------------------------------

/**
 * The mark and the sentence for each verdict, in one place.
 *
 * A mark alone is a legend the reader has to be taught, and a sentence alone makes every line as long
 * as the widest case. Both, and the mark carries the scanning while the sentence carries the meaning.
 * `unchanged` has neither because a file nothing happens to is not printed at all.
 */
const VERDICTS: Readonly<Record<Exclude<FileVerdict, 'unchanged'>, readonly [string, string]>> = {
  updated: ['~', ''],
  restored: ['+', 'it was gone, and this puts it back'],
  'already-written': ['+', 'an interrupted run had already written it'],
  removed: ['-', 'nothing imports it any more'],
  // Three verdicts share the `!` mark and each needs its own sentence to be told apart, but none of
  // them restates the feature's own reason above it: a `conflict` line says which file changed on both
  // sides, and the line above says what that means for the feature.
  kept: ['!', 'your version is kept - the registry did not change this file'],
  conflict: ['!', 'changed on both sides'],
  'kept-orphan': ['!', 'your version is kept - nothing imports it any more'],
}

const THE_WAYS_OUT =
  'Two ways out. Keep your version: do nothing, this feature stays where it is and everything ' +
  'else still updates. Or take ours: delete the file, run this again, and put your change back ' +
  'on top of the new one.'

/**
 * A diff line as it is read rather than as it would be applied.
 *
 * The right-hand end is trimmed, which a unified diff proper would not do - a context line for an
 * empty source line is a single space, and this makes it an empty line. Nothing here is ever fed to
 * `patch`; it is indented, which already disqualifies it. What it is fed to is a terminal, where the
 * report's own rule holds: a line with nothing after it carries nothing after it.
 */
const diffLine = (text: string): string => `${INDENT}      ${text}`.trimEnd()

const fileLine = (outcome: FileOutcome, configuration: Configuration): readonly string[] => {
  if (outcome.verdict === 'unchanged') return []

  const [mark, sentence] = VERDICTS[outcome.verdict]
  const count = outcome.change === null ? '' : renderCount(outcome.change)
  const where = `${configuration.directory}/${outcome.path}`

  return [
    `${INDENT}  ${mark} ${where}${count === '' ? '' : `  ${count}`}`,
    ...(sentence === '' ? [] : [`${INDENT}      ${sentence}`]),
    ...(outcome.change === null
      ? []
      : [
          '',
          ...outcome.change.hunks.flatMap((hunk) => [
            diffLine(hunk.header),
            ...hunk.lines.map(diffLine),
          ]),
        ]),
    '',
  ]
}

const movedTo = (feature: Update['features'][number]): string => {
  if (feature.now === null) return 'leaves the project'
  if (feature.was === null) return `new · ${feature.now.id}@${feature.now.version}`
  if (feature.was.version === feature.now.version) return `${feature.now.id}@${feature.now.version}`

  return `${feature.was.id}@${feature.was.version} -> ${feature.now.id}@${feature.now.version}`
}

/**
 * Whether this feature has anything to say at all.
 *
 * A version that moved with no file changing is worth a line, and finding that out was worth the
 * measurement: two of the four features of the imagined graph are republished against a dependency
 * that moved, without a byte of their own changing. Saying nothing about them would leave the lockfile
 * recording a version the user was never told about - a silent update of a record, which is the same
 * rule as a silent update of a file.
 */
const versionMovedAlone = (feature: Update['features'][number]): boolean =>
  feature.was !== null && feature.now !== null && feature.was.version !== feature.now.version

/**
 * Whether this reader has anything to resolve about this feature.
 *
 * A feature is held back for two kinds of reason and only one of them is theirs: their own edit. Held
 * back because something it imports is, or because something else in the project is, leaves them
 * nothing to do about *this* one - and printing the two ways out under it would tell somebody to
 * delete a file they never touched. Read off the verdicts rather than off the sentence, so that
 * rewording a reason cannot change what is offered.
 */
const THEIRS: ReadonlySet<FileVerdict> = new Set<FileVerdict>(['conflict', 'kept-orphan'])

const theirsToResolve = (feature: Update['features'][number]): boolean =>
  feature.files.some((file) => THEIRS.has(file.verdict))

const featureBlock = (
  feature: Update['features'][number],
  configuration: Configuration,
): readonly string[] => {
  const lines = feature.files.flatMap((file) => fileLine(file, configuration))
  if (lines.length === 0 && feature.heldBack === null && !versionMovedAlone(feature)) return []

  return [
    `${INDENT}${renderContract(feature.contract)} · ${movedTo(feature)}` +
      `${feature.heldBack === null ? '' : ' · held back'}`,
    ...(feature.heldBack === null
      ? []
      : paragraph(feature.heldBack, 72).map((line) => `${INDENT}  ${line}`)),
    ...(lines.length === 0 && feature.heldBack === null
      ? [`${INDENT}  the same bytes, republished against a dependency that moved`]
      : []),
    '',
    ...lines,
    ...(feature.heldBack === null || !theirsToResolve(feature)
      ? []
      : [...paragraph(THE_WAYS_OUT, 72).map((line) => `${INDENT}  ${line}`), '']),
  ]
}

const countOf = (things: number, one: string, many: string): string =>
  `${things} ${things === 1 ? one : many}`

/**
 * What was found, and what was or was not done about it.
 *
 * `applied` is the whole of the difference between the two commands. It is a parameter rather than two
 * renderers because the body is the same body - what changes is one closing sentence, and two renderers
 * would be two places for that body to drift.
 */
export const renderUpdate = (
  update: Update,
  configuration: Configuration,
  applied: boolean,
): string => {
  const held = update.features.filter((feature) => feature.heldBack !== null)
  const touched = update.writes.length + update.removals.length

  return [
    '',
    ...update.features.flatMap((feature) => featureBlock(feature, configuration)),
    `${INDENT}${countOf(touched, 'file', 'files')} in ` +
      `${countOf(update.features.filter((feature) => feature.heldBack === null && feature.files.some((file) => file.verdict !== 'unchanged')).length, 'feature', 'features')}` +
      `${held.length === 0 ? '' : ` · ${countOf(held.length, 'feature', 'features')} held back`}`,
    '',
    ...(applied
      ? [`${INDENT}Written, and recorded in toopo.lock`]
      : [
          `${INDENT}Nothing has been written.`,
          '',
          `${INDENT}Apply it with  toopo update --apply`,
        ]),
    '',
  ].join('\n')
}

export const renderUpToDate = (held: readonly string[]): string =>
  [
    '',
    `${INDENT}Every feature is at the version the registry serves, and every file is as it was written.`,
    ...(held.length === 0
      ? []
      : ['', `${INDENT}Your own changes are kept in: ${held.join(', ')}`]),
    '',
    `${INDENT}Nothing to do.`,
    '',
  ].join('\n')

export const renderRefusal = (faults: readonly string[]): string =>
  [
    '',
    `${INDENT}Refused, and nothing was written.`,
    '',
    ...faults.flatMap((fault) => [...paragraph(fault, 72).map((line) => `${INDENT}  ${line}`), '']),
  ].join('\n')

