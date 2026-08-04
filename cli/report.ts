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

import { renderContract, sameContract } from '../registry/address.js'
import type { Lockfile } from '../registry/implementation-record.js'
import type { ServedIndexEntry, ServedRefusals } from '../registry/response.js'
import type { Configuration } from './configuration.js'
import { renderCount } from './diff.js'
import type { InstalledEntry, Installation } from './install.js'
import type { Listing } from './list.js'
import type { FeatureOutcome, FileOutcome, FileVerdict, Reconciliation } from './reconcile.js'
import type { Removal } from './remove.js'
import { listed } from './remove.js'
import type { Displayed, Result, Search } from './search.js'

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

/**
 * What `init` says, and the one sentence that is here to stop a silent trap rather than to explain a
 * setting.
 *
 * **The installed folder is committed, and so is the lockfile.** Nothing about toopo enforces it and
 * nothing can: what a project ignores is the project's business, and reading `.gitignore` would mean
 * spawning git inside somebody else's repository to answer a question we can ask better by saying it
 * once. What happens when the folder is not committed is that the next person to clone gets a lockfile
 * describing files that are not there, their build fails on an import long before they think to run
 * `toopo update`, and nothing anywhere tells them why. This is the moment they are choosing the folder,
 * which is the moment the sentence is worth reading; `renderUpdate` catches the symptom for whoever
 * arrives after it was not.
 */
const whatToCommit = (configuration: Configuration): string =>
  `Commit toopo.json, toopo.lock and ${configuration.directory}/ - what toopo installs is source ` +
  `code in your project, not a dependency your package manager restores.`

export const renderInit = (configuration: Configuration, existed: boolean): string =>
  [
    '',
    `${INDENT}toopo.json  ${existed ? 'updated' : 'written'}`,
    `${INDENT}features    ${configuration.directory}`,
    '',
    ...paragraph(whatToCommit(configuration)).map((line) => `${INDENT}${line}`),
    '',
    `${INDENT}Change the folder with  toopo init --dir <path>`,
    `${INDENT}Install something with  toopo add string/slugify`,
    '',
  ].join('\n')

/**
 * The mark on a file's line: what happened to it, in one character.
 *
 * `=` is a file that was already there holding exactly these bytes, and it is a different mark from
 * `+` because it is a different event. Printing `+` under it would say this install put it there,
 * when the install found it there and wrote nothing - and a report that describes something other
 * than what happened is one more thing that has to be true and is not.
 */
const markOf = (write: Installation['writes'][number]): string => (write.alreadyOnDisk ? '=' : '+')

export const renderInstallation = (
  installation: Installation,
  configuration: Configuration,
): string => {
  const { cost } = installation
  const found = installation.writes.filter((write) => write.alreadyOnDisk).length
  const notes = new Map<string, string>()
  for (const file of installation.shared) {
    notes.set(file.path, `shared with ${file.alsoCarriedBy.join(', ')}`)
  }
  for (const write of installation.writes) {
    if (write.alreadyOnDisk) notes.set(write.path, 'already there, byte for byte')
    else if (write.repointed && !notes.has(write.path)) notes.set(write.path, 'import repointed')
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
        ? `${INDENT}  ${markOf(write)} ${path}`
        : `${INDENT}  ${markOf(write)} ${path.padEnd(width)}  ${note}`
    }),
    '',
    ...(found === 0
      ? []
      : [
          ...paragraph(
            `${countOf(found, 'file was', 'files were')} already on disk holding exactly these ` +
              `bytes. Nothing was written over ${found === 1 ? 'it' : 'them'}, and ` +
              `${found === 1 ? 'it is' : 'they are'} now recorded in toopo.lock.`,
          ).map((line) => `${INDENT}${line}`),
          '',
        ]),
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
  // No sentence, because *why* a file goes is a fact about its feature and not about the file: under
  // `update` its feature stopped being imported, under `remove` its feature may be the one that was
  // named. The feature line says which, once, and it used to say it twice with one of the two wrong.
  removed: ['-', ''],
  // Two verdicts share the `!` mark and each needs its own sentence to be told apart, but neither
  // restates the feature's own reason above it: a `conflict` line says which file changed on both
  // sides, and the line above says what that means for the feature.
  kept: ['!', 'your version is kept - the registry did not change this file'],
  conflict: ['!', 'changed on both sides'],
  'kept-orphan': ['!', 'your version is kept'],
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

const movedTo = (feature: FeatureOutcome, whyItLeaves: string): string => {
  if (feature.now === null) return `leaves the project · ${whyItLeaves}`
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
const versionMovedAlone = (feature: FeatureOutcome): boolean =>
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

const theirsToResolve = (feature: FeatureOutcome): boolean =>
  feature.files.some((file) => THEIRS.has(file.verdict))

/**
 * One feature's block, and `whyItLeaves` is the one sentence the two commands do not share.
 *
 * It is a parameter rather than a branch on which command is rendering, because the answer is not a
 * property of the command: a removal takes out the feature that was named *and* whatever only it
 * pulled in, and those two leave for different reasons on the same screen.
 */
const featureBlock = (
  feature: FeatureOutcome,
  configuration: Configuration,
  whyItLeaves: string,
): readonly string[] => {
  const lines = feature.files.flatMap((file) => fileLine(file, configuration))
  if (lines.length === 0 && feature.heldBack === null && !versionMovedAlone(feature)) return []

  return [
    `${INDENT}${renderContract(feature.contract)} · ${movedTo(feature, whyItLeaves)}` +
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
 * How much moved, read off the same verdicts the lines above are rendered from.
 *
 * Shared by the two commands that write, because a tally that disagreed with the lines it summarises
 * would be the one number the reader checks against everything else on the screen.
 */
const theTally = (reconciliation: Reconciliation): string => {
  const held = reconciliation.features.filter((feature) => feature.heldBack !== null)
  const touched = reconciliation.writes.length + reconciliation.removals.length
  const moved = reconciliation.features.filter(
    (feature) =>
      feature.heldBack === null && feature.files.some((file) => file.verdict !== 'unchanged'),
  )

  return (
    `${INDENT}${countOf(touched, 'file', 'files')} in ${countOf(moved.length, 'feature', 'features')}` +
    `${held.length === 0 ? '' : ` · ${countOf(held.length, 'feature', 'features')} held back`}`
  )
}

/**
 * The two ways a report that may or may not have been applied ends.
 *
 * The command to type is a parameter because it is the only part that differs, and a second copy of
 * these three lines would be a second place for the discipline they enforce to be softened.
 */
const theClosing = (applied: boolean, applyWith: string): readonly string[] =>
  applied
    ? [`${INDENT}Written, and recorded in toopo.lock`]
    : [`${INDENT}Nothing has been written.`, '', `${INDENT}Apply it with  ${applyWith}`]

/**
 * The symptom of a folder nobody committed, said where it can still be acted on.
 *
 * Not one file missing - **every** file the lockfile claims. A project somebody deleted a folder from
 * has some of its files; a checkout that never received the folder has none of them, and the repair
 * this command performs is what hides the cause: it works, the build goes green, and the next person
 * to clone meets exactly the same thing.
 */
const THE_FOLDER_IS_NOT_COMMITTED =
  'Every file toopo.lock claims was missing from disk. If this is a fresh checkout, the installed ' +
  'folder is not committed - what toopo writes is source code in your project rather than a ' +
  'dependency your package manager restores, so it belongs in version control with the rest of it. ' +
  'Otherwise something removed it, and this run puts it back.'

/**
 * What was found, and what was or was not done about it.
 *
 * `applied` is the whole of the difference between the two commands. It is a parameter rather than two
 * renderers because the body is the same body - what changes is one closing sentence, and two renderers
 * would be two places for that body to drift.
 */
export const renderUpdate = (
  update: Reconciliation,
  configuration: Configuration,
  applied: boolean,
): string =>
  [
    '',
    ...update.features.flatMap((feature) =>
      featureBlock(feature, configuration, 'nothing imports it any more'),
    ),
    theTally(update),
    '',
    ...(update.everyClaimedFileIsMissing
      ? [...paragraph(THE_FOLDER_IS_NOT_COMMITTED, 72).map((line) => `${INDENT}${line}`), '']
      : []),
    ...theClosing(applied, 'toopo update --apply'),
    '',
  ].join('\n')

// ---------------------------------------------------------------------------
// `toopo remove`
// ---------------------------------------------------------------------------

/**
 * What a removal does, and the case it is most careful about is the one where nothing goes.
 *
 * A feature another root still imports **stays**, and stops being something the user asked for. That
 * is the right answer and it is also the moment somebody decides this tool cannot be trusted, because
 * *I asked to take it out and it is still there* is what it looks like from outside. So it is never
 * left to be read off a report with nothing in it: the feature is named, what still imports it is
 * named, and what did change is said in the same breath - it is no longer a root, so it leaves on its
 * own the day nothing reaches it.
 */
export const renderRemoval = (
  removal: Removal,
  configuration: Configuration,
  applied: boolean,
): string => {
  const what = renderContract(removal.named)
  const applyWith = `toopo remove ${removal.named.name} --apply`

  if (removal.departure === 'stays-as-a-dependency') {
    return [
      '',
      ...paragraph(
        `${what} stays where it is: ${listed(removal.stillReachedBy)} ` +
          `${removal.stillReachedBy.length === 1 ? 'imports' : 'import'} it.`,
      ).map((line) => `${INDENT}${line}`),
      '',
      ...paragraph(
        'What changes is that it is no longer something you asked for, so it goes on its own the ' +
          'day nothing imports it. No file moves.',
      ).map((line) => `${INDENT}${line}`),
      '',
      ...(applied
        ? [`${INDENT}Recorded in toopo.lock`]
        : [`${INDENT}Nothing has been written.`, '', `${INDENT}Apply it with  ${applyWith}`]),
      '',
    ].join('\n')
  }

  return [
    '',
    ...removal.reconciliation.features.flatMap((feature) =>
      featureBlock(
        feature,
        configuration,
        sameContract(feature.contract, removal.named)
          ? 'you asked for it to go'
          : `only ${what} pulled it in`,
      ),
    ),
    theTally(removal.reconciliation),
    '',
    ...theClosing(applied, applyWith),
    '',
  ].join('\n')
}

/**
 * Rows aligned on their widest column, with a note only where there is one.
 *
 * A padded line with nothing after it is trailing whitespace, which is the report's own rule, so the
 * padding is trimmed off the end rather than applied conditionally in four places.
 */
const aligned = (rows: readonly (readonly [string, string, string])[]): readonly string[] => {
  const first = Math.max(...rows.map(([what]) => what.length), 0)
  const second = Math.max(...rows.map(([, standing]) => standing.length), 0)

  return rows.map(([what, standing, note]) =>
    `${INDENT}  ${what.padEnd(first)}  ${standing.padEnd(second)}  ${note}`.trimEnd(),
  )
}

const standingOf = (feature: FeatureOutcome): string =>
  feature.now === null ? 'leaves the project' : `${feature.now.id}@${feature.now.version}`

/**
 * Nothing to do, and every feature named while saying so.
 *
 * It used to be three sentences and no name: *every feature is at the version the registry serves*,
 * with the features left to the reader's memory. That is the shape of an answer nobody can check - the
 * command that knows what the project holds is the one refusing to say it - and it was the measured
 * gap that `toopo list` closes for good. This says it too, because somebody who has just run an update
 * should not have to run a second command to see what it was talking about.
 */
export const renderUpToDate = (update: Reconciliation): string =>
  [
    '',
    `${INDENT}Every feature is at the version the registry serves, and every file is as it was written.`,
    '',
    ...aligned(
      update.features.map(
        (feature) =>
          [
            renderContract(feature.contract),
            standingOf(feature),
            feature.files.some((file) => file.verdict === 'kept') ? 'your own changes are kept' : '',
          ] as const,
      ),
    ),
    '',
    `${INDENT}Nothing to do.`,
    '',
  ].join('\n')

// ---------------------------------------------------------------------------
// `toopo list`
// ---------------------------------------------------------------------------

/** What a file's standing is called on the screen. `as-written` says nothing, because it is the norm. */
const STANDINGS: Readonly<Record<Listing['features'][number]['files'][number]['standing'], string>> = {
  'as-written': '',
  edited: 'edited',
  missing: 'missing',
}

/**
 * What this project holds, and no import line anywhere on the screen.
 *
 * The export names live in the contract and reach the installer through the served index, so printing
 * an import line here would mean asking a registry - which would make the one command that answers
 * from the project alone fail when the registry is unreachable. `toopo add <name>` on something already
 * installed prints the line and writes nothing, which is where somebody who has forgotten it should be
 * sent, and the closing line sends them.
 */
export const renderList = (listing: Listing, configuration: Configuration): string => {
  if (listing.features.length === 0) {
    return [
      '',
      `${INDENT}toopo.lock records nothing installed.`,
      '',
      `${INDENT}Find something with   toopo search`,
      `${INDENT}Install it with       toopo add string/slugify`,
      '',
    ].join('\n')
  }

  const missing = listing.features.flatMap((feature) =>
    feature.files.filter((file) => file.standing === 'missing'),
  )

  return [
    '',
    `${INDENT}${countOf(listing.features.length, 'feature', 'features')} · ` +
      `${countOf(listing.files, 'file', 'files')} · ${readableBytes(listing.bytes)}`,
    '',
    ...listing.features.flatMap((feature) => [
      `${INDENT}${renderContract(feature.contract)} · ` +
        `${feature.implementation.id}@${feature.implementation.version} · ` +
        `${feature.askedFor ? 'you asked for it' : 'pulled in as a dependency'}`,
      ...aligned(
        feature.files.map(
          (file) =>
            [
              `${configuration.directory}/${file.path}`,
              readableBytes(file.bytes),
              STANDINGS[file.standing],
            ] as const,
        ),
      ),
      '',
    ]),
    ...(missing.length === 0
      ? []
      : [
          ...paragraph(
            `${countOf(missing.length, 'file is', 'files are')} missing. ` +
              `\`toopo update --apply\` puts ${missing.length === 1 ? 'it' : 'them'} back.`,
            72,
          ).map((line) => `${INDENT}${line}`),
          '',
        ]),
    `${INDENT}Take one out with     toopo remove <domain>/<name>`,
    `${INDENT}See its import line   toopo add <domain>/<name>`,
    '',
  ].join('\n')
}

/**
 * A refusal, with the sentences that say what was wrong and that nothing was written.
 *
 * **A fault that carries its own newlines is laid out rather than reflowed.** Most faults are a
 * sentence and want wrapping; one is a sentence *and* a list of commands to type, and running those
 * together into a paragraph would hand the reader a line they cannot copy. Each line keeps whatever
 * indentation it was written with, so a fault can indent a command under its own explanation.
 */
// ---------------------------------------------------------------------------
// `toopo search`
// ---------------------------------------------------------------------------

/** The summary, wrapped and cut to at most `most` lines, with the cut marked. */
const shortened = (text: string, width: number, most: number): readonly string[] => {
  const lines = paragraph(text, width)
  if (lines.length <= most) return lines

  return [...lines.slice(0, most - 1), `${lines[most - 1] as string}...`]
}

const SUMMARY_WIDTH = 70
const SUMMARY_LINES = 3

/**
 * One result: what it is called, what it does, and what you would import.
 *
 * The name sits alone on its line and the rest is indented under it, so the eye runs down the left
 * edge and reads only the names until it wants one. A two-column layout was tried and read worse: at
 * the width `string/levenshtein@1` forces, the summary is cut before it has said what the contract
 * distinguishes itself by.
 *
 * The exports are here because they are how somebody found this in the first place - a search for
 * `parseNumber` that answered a contract without ever printing `parseNumber` would leave the reader
 * checking whether they got the right thing.
 */
const resultBlock = (result: Displayed, alone: boolean): readonly string[] => [
  `${INDENT}${renderContract(result.address)}${result.installable ? '' : '   not installable'}`,
  ...shortened(result.summary, SUMMARY_WIDTH, SUMMARY_LINES).map((line) => `${INDENT}    ${line}`),
  `${INDENT}    exports  ${result.exports.join(', ')}`,
  ...(result.refusal === null || !alone
    ? []
    : [
        '',
        ...paragraph(
          `Decided against, and the catalogue publishes why: ${result.refusal.measurement}`,
          SUMMARY_WIDTH,
        ).map((line) => `${INDENT}    ${line}`),
      ]),
  '',
]

/**
 * What was found, or what was not.
 *
 * **A refused contract is never offered an install line**, and that is the defect reading the first
 * draft of this output caught: it printed `toopo add array/group-by` directly under a result it had
 * just labelled `not installable`, which is a command that refuses when you run it. What goes there
 * instead is the measurement the catalogue decided on - for `Map.groupBy`, that the language ships
 * this now, which is the most useful thing the whole catalogue can tell that reader.
 *
 * A miss names the words no contract carries. It is short, it is true, and it teaches the rule this
 * search works by in one line - which is worth more to the next query than a guess would have been.
 */
export const renderSearch = (found: Search): string => {
  if (found.results.length === 0) {
    return [
      '',
      ...paragraph(`Nothing in the catalogue answers "${found.query}".`, 72).map(
        (line) => `${INDENT}${line}`,
      ),
      '',
      ...(found.unknownWords.length === 0
        ? [`${INDENT}Every word is known, and no one contract carries them all.`]
        : paragraph(`No contract mentions: ${found.unknownWords.join(', ')}`, 72).map(
            (line) => `${INDENT}${line}`,
          )),
      '',
    ].join('\n')
  }

  const alone = found.results.length === 1
  const first = found.results[0] as Result

  return [
    '',
    ...found.results.flatMap((result) => resultBlock(result, alone)),
    ...(alone
      ? first.installable
        ? [`${INDENT}toopo add ${first.address.name}`, '']
        : []
      : [
          `${INDENT}${countOf(found.results.length, 'result', 'results')} - install one with  ` +
            `toopo add <name>`,
          '',
        ]),
  ].join('\n')
}

/**
 * The whole catalogue, which is what `toopo search` with no words answers.
 *
 * **It used to be a refusal** - *`search` needs something to look for* - which is the tool answering
 * "you must already know what you want" to somebody who has just arrived, and *what have you got* is
 * the first question anybody asks. At five contracts it costs one screen.
 *
 * The refused contract is shown with the others and marked, rather than hidden: a catalogue that
 * listed only what it sells would be publishing its decisions nowhere, and the reason `array/group-by@1`
 * is not installable is the most useful thing this whole listing has to say to somebody about to write
 * their own grouper. `alone` is false here, so the measurement itself is one search away rather than
 * on a screen that would then be five paragraphs of argument.
 */
export const renderCatalogue = (entries: readonly Displayed[]): string =>
  [
    '',
    `${INDENT}The catalogue holds ${countOf(entries.length, 'contract', 'contracts')}.`,
    '',
    ...entries.flatMap((entry) => resultBlock(entry, false)),
    `${INDENT}Install one with  toopo add <domain>/<name>`,
    `${INDENT}Or search         toopo search convert string to number`,
    '',
  ].join('\n')

export const renderRefusal = (faults: readonly string[]): string =>
  [
    '',
    `${INDENT}Refused, and nothing was written.`,
    '',
    ...faults.flatMap((fault) => [
      ...fault.split('\n').flatMap((line) => {
        const indented = line.length - line.trimStart().length

        return paragraph(line.trimStart(), 72 - indented).map(
          (wrapped) => `${INDENT}  ${' '.repeat(indented)}${wrapped}`,
        )
      }),
      '',
    ]),
  ].join('\n')

