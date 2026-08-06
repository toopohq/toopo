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
 * **Nothing here claims anything about a project this tool could not read.** One paragraph depends on
 * an answer from the user's git, and its third outcome - *cannot say* - prints the advice that was
 * always printed rather than a hedged version of the other one. A reader cannot check that particular
 * claim themselves, which is what makes a wrong one cost more than none.
 *
 * **A conditional sentence is printed under its own condition, and the outcome comes before what
 * explains it.** Both halves were paid for by walking a real project rather than by reading this file.
 * A screen told somebody their feature *was there as a dependency* on a run where it had not been -
 * an assertion about their project contradicted by the lockfile this tool had just read - because the
 * flag it was printed under answered a different question that happened to coincide. Two more of the
 * same shape were found by re-reading every conditional here and asking what makes it true: a cause
 * claimed where only an effect was known, and *Nothing to do* said on a run that dropped a lockfile
 * entry. And a feature held back read `leaves the project · ... · held back`, four segments where the
 * fourth reverses the second - the thing the reader will act on cannot be last.
 *
 * No colour, and it is not an omission. Colour needs either a dependency or an escape-code table of
 * our own, it is wrong in a pipe, wrong in a log and wrong for whoever cannot see it - and none of the
 * three lines above needs it to work.
 */

import { renderContract, sameContract } from '../registry/address.js'
import type { Lockfile } from '../registry/implementation-record.js'
import type { ServedIndexEntry, ServedRefusals } from '../registry/response.js'
import type { Configuration } from './configuration.js'
import { CONFIGURATION_FILE } from './configuration.js'
import type { CommitStanding } from './ignored.js'
import { renderCount } from './diff.js'
import type { InstalledEntry, Installation } from './install.js'
import type { Listing } from './list.js'
import type { FeatureOutcome, FileOutcome, FileVerdict, Reconciliation } from './reconcile.js'
import { commitChangesSomething } from './reconcile.js'
import type { Relocation } from './relocate.js'
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
 * What has to be committed, or - when the project will not accept it - that it will not.
 *
 * **The installed folder is committed, and so is the lockfile.** What happens when it is not is that
 * the next person to clone gets a lockfile describing files that are not there, their build fails on
 * an import long before they think to run `toopo update`, and nothing anywhere tells them why. That
 * description was written before anything could detect the case and it was exactly right.
 *
 * **What was wrong was the remedy, and it was measured wrong.** *Say it once* produces, in a project
 * whose `.gitignore` holds `lib/`, an instruction the project makes impossible to follow - printed on
 * the very screen that just wrote into that folder. `git add -A` then commits `toopo.json` and
 * `toopo.lock` and leaves the source behind, which is the trap happening while its own warning is on
 * screen. So `ignored.ts` asks git, and this says which of the two sentences applies.
 *
 * `ignores` is `null` when git cannot say - it is not installed, or this is not a repository - and
 * then the advice is the one that was always printed. **Never a claim about a project this tool could
 * not read**, because the reader cannot check this one themselves.
 */
const whatToCommit = (configuration: Configuration, git: CommitStanding): string => {
  if (git.directory !== true) {
    return (
      `Commit toopo.json, toopo.lock and ${configuration.directory}/ - what toopo installs is ` +
      `source code in your project, not a dependency your package manager restores.`
    )
  }

  /**
   * The lockfile's own standing, asked rather than assumed.
   *
   * *and toopo.lock will be* was the tool predicting what the user's git would do with a second path
   * it had never been asked about, and the whole warning rests on it: the trap is a committed lockfile
   * naming files that were not committed. A project that ignores both has no trap and is owed the
   * other sentence - which is worth more than the first, because ignoring `toopo.lock` is the exact
   * mistake this product exists to argue against.
   */
  const lockfile =
    git.lockfile === true
      ? 'git ignores toopo.lock as well, so nothing toopo wrote will be committed at all.'
      : git.lockfile === false
        ? 'toopo.lock is not ignored, so whoever clones this next gets a lockfile naming files ' +
          'that are not there.'
        : ''

  return (
    `git ignores ${configuration.directory}/, so what was just written will not be committed. ` +
    `${lockfile} What toopo installs is source code in your project, not a dependency your ` +
    `package manager restores: un-ignore ${configuration.directory}/, or pick a folder that is ` +
    `committed with toopo init --dir <path> and add it again.`
  )
}

/**
 * The advice, printed under its own condition, which is not the same condition for its two halves.
 *
 * *Commit this* is worth saying at the moment the folder is chosen and pointless on every run
 * afterwards, so it follows `wroteConfiguration`. *git ignores this* is worth saying **every** time
 * something lands in a folder that will not be committed - the project configured last week is the one
 * most likely to have grown the pattern since - so it follows the answer itself.
 */
const commitAdvice = (
  configuration: Configuration,
  git: CommitStanding,
  wroteConfiguration: boolean,
): readonly string[] =>
  git.directory === true || wroteConfiguration
    ? [...paragraph(whatToCommit(configuration, git)).map((line) => `${INDENT}${line}`), '']
    : []

/**
 * Every file that moved, named one by one, and the one part of the work that is left to the user.
 *
 * **The lines are file by file because this is the tool moving things inside somebody else's
 * repository.** A count would say how much and this has to say what: a folder change that reported *3
 * files moved* would be more frightening than the truth and impossible to check.
 *
 * **The sentence about imports is not politeness, it is the whole reason this screen exists.** The
 * user wrote `import { slugify } from './lib/toopo/...'` and that path has just stopped existing.
 * Toopo never touches the user's own code, so nothing can repair it for them - and if this does not
 * say so, their build fails on an import and nothing anywhere tells them why. That is the exact trap
 * `whatToCommit` above is written for, one floor up, and it is worth the same sentence: **the one part
 * of the work that stays theirs must not be the one part nobody mentions.**
 *
 * A file the lockfile claims and the disk does not hold is absent from these lines and from the count.
 * It did not move, saying it did would be false, and `toopo update` is what puts it back - under the
 * new folder, which is where it now belongs.
 */
const relocationLines = (relocation: Relocation, leftBehind: string | null): readonly string[] => {
  const moved = relocation.moves.filter((move) => move.verdict !== 'not-on-disk')
  if (moved.length === 0) return []

  return [
    `${INDENT}${relocation.from}  ->  ${relocation.to}`,
    '',
    // The two folders are named once and each file by the path they share, which is the path the
    // lockfile records. Printing both sides on every line would repeat the move as many times as
    // there are files and leave the reader comparing two long strings to find the one difference.
    ...moved.map((move) => `${INDENT}  ~ ${move.path}`),
    '',
    `${INDENT}${moved.length} ${moved.length === 1 ? 'file' : 'files'} moved`,
    ...(leftBehind === null
      ? []
      : [
          '',
          // Not *something toopo did not put there*: what `rmdir` refused establishes that the folder
          // is not empty and nothing about what is in it. A run killed part-way leaves our own
          // `.toopo-part` files exactly there, which `write.ts` says in as many words.
          ...paragraph(
            `${leftBehind}/ is not empty, so it was left where it is. Everything toopo had written ` +
              `is now under ${relocation.to}/.`,
          ).map((line) => `${INDENT}${line}`),
        ]),
    '',
    ...paragraph(
      `Imports in your own code naming ${relocation.from}/ have to be changed to ` +
        `${relocation.to}/ - toopo never reads or edits your sources, so this is the one part of ` +
        `the move it cannot do for you.`,
    ).map((line) => `${INDENT}${line}`),
    '',
  ]
}

export const renderInit = (
  configuration: Configuration,
  existed: boolean,
  git: CommitStanding,
  relocation: Relocation | null,
  leftBehind: string | null,
): string =>
  [
    '',
    `${INDENT}${CONFIGURATION_FILE}  ${existed ? 'updated' : 'written'}`,
    `${INDENT}features    ${configuration.directory}`,
    '',
    ...(relocation === null ? [] : relocationLines(relocation, leftBehind)),
    ...paragraph(whatToCommit(configuration, git)).map((line) => `${INDENT}${line}`),
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

/**
 * What was installed, and - when this run was also the one that configured the project - that a file
 * appeared.
 *
 * **`wroteConfiguration` is announced rather than left to be found.** `toopo.json` is committed by the
 * user, so a run that writes one puts a file in front of their whole team. A file that appears without
 * being asked for and without being mentioned is a bad surprise; the same file announced is a
 * convenience, and the line says which folder was chosen so that changing it is one edit away.
 *
 * It is the installation's own lines that move to make room, not a second report: the two lines are the
 * ones `renderInit` prints, and `whatToCommit` is the same sentence rather than a second copy of it.
 */
export const renderInstallation = (
  installation: Installation,
  configuration: Configuration,
  wroteConfiguration: boolean,
  git: CommitStanding,
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
    ...(wroteConfiguration
      ? [
          `${INDENT}${CONFIGURATION_FILE}  written`,
          `${INDENT}features    ${configuration.directory}`,
          '',
        ]
      : []),
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
    ...commitAdvice(configuration, git, wroteConfiguration),
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
/**
 * What `add` says about something the project already holds, and `promoted` is the only thing that
 * lets it say the second sentence.
 *
 * **That sentence used to be printed from "did the lockfile change at all", and it was a lie on every
 * re-add.** *It was there as a dependency* is a claim about the reader's own project, and it was
 * contradicted by `toopo.lock`, by `toopo list`, and by the `add` that had put it there. A conditional
 * printed under something other than its own condition is the shape; this is where it was found.
 */
export const renderUnchanged = (
  what: string,
  entry: InstalledEntry,
  configuration: Configuration,
  promoted: boolean,
): string =>
  [
    '',
    `${INDENT}${what} is already installed, and every file is as it was written.`,
    ...(promoted
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
  /**
   * The two facts, and not the run that is the likeliest way to arrive at them.
   *
   * It read *an interrupted run had already written it*. What `verdictOf` measures is that the file
   * holds the bytes this run would write and that `toopo.lock` records different ones - a state an
   * interruption produces, and so does a `toopo.lock` that came out of a merge holding the old digest
   * while a colleague's files were committed. Nobody was interrupted there, and the reader is sent
   * looking for a crash that never happened.
   */
  'already-written': ['+', 'it already held these bytes, which toopo.lock did not record'],
  // No sentence, because *why* a file goes is a fact about its feature and not about the file: under
  // `update` its feature stopped being imported, under `remove` its feature may be the one that was
  // named. The feature line says which, once, and it used to say it twice with one of the two wrong.
  removed: ['-', ''],
  /**
   * Two verdicts share the `!` mark and each needs its own sentence to be told apart, but neither
   * restates the feature's own reason above it: a `conflict` line says which file changed on both
   * sides, and the line above says what that means for the feature.
   *
   * **None of the three names who changed the file, and `conflict` never did.** *Your version* was
   * read off `sha256` differing from what was written, which establishes that the bytes moved and
   * nothing at all about the hand that moved them: a formatter running on save, a merge, a colleague.
   * Telling somebody whose Prettier reindented a file that they edited it is naming an agent no
   * measurement designates, and `changed on both sides` had been carrying the honest form all along.
   */
  kept: ['!', 'kept as it is - the registry did not change this file'],
  conflict: ['!', 'changed on both sides'],
  'kept-orphan': ['!', 'kept as it is'],
}

/**
 * The two ways out of a file the reader put something into, and the second half is not the same
 * sentence for both commands.
 *
 * Under an update, taking ours means the file the registry now serves and a change to re-apply on top
 * of it. Under a removal there is no new file: taking ours means letting it go. **The removal wording
 * was measured by running it** - the screen offered *put your change back on top of the new one* to
 * somebody who had asked for the feature to be deleted, which is advice about a file that is not going
 * to exist.
 */
const THE_WAYS_OUT: Readonly<Record<'update' | 'removal', string>> = {
  update:
    'Two ways out. Keep the file as it is: do nothing, this feature stays where it is and everything ' +
    'else still updates. Or take ours: delete the file, run this again, and put the change back ' +
    'on top of the new one.',
  removal:
    'Two ways out. Keep the file as it is: do nothing, this feature stays where it is and nothing ' +
    'else is affected. Or let it go: delete the file and run this again, and the removal goes through.',
}

/**
 * A diff line as it is read rather than as it would be applied.
 *
 * The right-hand end is trimmed, which a unified diff proper would not do - a context line for an
 * empty source line is a single space, and this makes it an empty line. Nothing here is ever fed to
 * `patch`; it is indented, which already disqualifies it. What it is fed to is a terminal, where the
 * report's own rule holds: a line with nothing after it carries nothing after it.
 */
const diffLine = (text: string): string => `${INDENT}      ${text}`.trimEnd()

/**
 * One file's line, and the blank that follows it only when something followed the line.
 *
 * A bare mark - a `-` with no sentence and no diff - is one line, and separating two of them with a
 * blank puts air between two facts that belong together. It used to be unconditional, because every
 * verdict carried a sentence; the day `removed` stopped carrying one, a removal taking two files out
 * of a folder printed them a line apart. Found by reading the screen rather than the code.
 */
const fileLine = (outcome: FileOutcome, configuration: Configuration): readonly string[] => {
  if (outcome.verdict === 'unchanged') return []

  const [mark, sentence] = VERDICTS[outcome.verdict]
  const count = outcome.change === null ? '' : renderCount(outcome.change)
  const where = `${configuration.directory}/${outcome.path}`
  const body = [
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
  ]

  return body.length === 1 ? body : [...body, '']
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
  waysOut: string,
): readonly string[] => {
  const lines = feature.files.flatMap((file) => fileLine(file, configuration))
  if (lines.length === 0 && feature.heldBack === null && !versionMovedAlone(feature)) return []

  return [
    /**
     * The thing that happened is the second word, and what was going to happen comes after it.
     *
     * It used to read `string/slugify@1 · leaves the project · you asked for it to go · held back` -
     * four segments of equal weight where the fourth reverses the second. A reader scanning builds an
     * expectation from *leaves the project* and has it overturned at the end of the line, if they get
     * to the end of the line. **The outcome cannot be the last of four equal segments**: it is the
     * only part they will act on.
     *
     * So a held-back feature says so and stops. What it would have done is not lost - the reason
     * underneath names it, and the reason is the thing that explains the outcome rather than competing
     * with it.
     */
    `${INDENT}${renderContract(feature.contract)} · ` +
      `${feature.heldBack === null ? movedTo(feature, whyItLeaves) : 'held back, nothing changed'}`,
    ...(feature.heldBack === null
      ? []
      : paragraph(feature.heldBack, 72).map((line) => `${INDENT}  ${line}`)),
    /**
     * What is known, and not what is likely.
     *
     * It read *republished against a dependency that moved* - a cause, printed under a condition that
     * establishes only an effect: the version moved and no byte of this feature did. A publisher may
     * republish identical bytes for any reason, so the sentence was true of the case that produces it
     * here and not entailed by it. And it was triggered by `no file lines and nothing held back`,
     * which implies the version moved alone only through a branch three lines above - so a change to
     * that branch would have printed a cause for a feature whose version had not moved at all.
     */
    ...(versionMovedAlone(feature) && lines.length === 0 && feature.heldBack === null
      ? [`${INDENT}  the same bytes, at a version the registry moved`]
      : []),
    '',
    ...lines,
    // Exactly one blank closes the block, whether the last file printed its own or not.
    ...(lines.length === 0 || lines.at(-1) === '' ? [] : ['']),
    ...(feature.heldBack === null || !theirsToResolve(feature)
      ? []
      : [...paragraph(waysOut, 72).map((line) => `${INDENT}  ${line}`), '']),
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
 * The three ways a report that may or may not have been applied ends.
 *
 * The command to type is a parameter because it is the only part that differs, and a second copy of
 * these three lines would be a second place for the discipline they enforce to be softened.
 *
 * **`changed` is the third way, and it exists because the first was read off the wrong fact.** *Written,
 * and recorded in toopo.lock* used to be printed whenever `--apply` had been typed, which is a fact
 * about the command line and not about the project: a removal whose every feature is held back writes
 * no byte and leaves a byte-identical lockfile, and closed by announcing a write, two lines under
 * *held back, nothing changed*. The two sentences were on one screen and only one of them could be
 * true. It is now `commitChangesSomething`, which is the same walk the caller commits.
 */
const theClosing = (
  before: Lockfile,
  after: Reconciliation,
  applied: boolean,
  applyWith: string,
): readonly string[] => {
  if (!applied) return [`${INDENT}Nothing has been written.`, '', `${INDENT}Apply it with  ${applyWith}`]

  if (!commitChangesSomething(before, after)) {
    return [`${INDENT}Nothing was written - the project is exactly as it was.`]
  }

  // *Written* is about bytes, so it is said when bytes moved and not when the run only re-recorded.
  // A removal that demotes a feature nothing takes off disk lands here, and so does an update whose
  // only change is a version the registry moved without changing a byte - which used to close by
  // announcing a write that had not happened.
  return [
    `${INDENT}${
      after.writes.length + after.removals.length === 0
        ? 'Recorded in toopo.lock'
        : 'Written, and recorded in toopo.lock'
    }`,
  ]
}

/**
 * The observation, said where it can still be acted on, and no account of how it came about.
 *
 * Not one file missing - **every** file the lockfile claims. That is worth saying because the repair
 * this command performs is what hides it: the files come back, the build goes green, and the next
 * person to clone meets exactly the same thing.
 *
 * **It used to end *Otherwise something removed it*, and nothing had.** The measurement is that no
 * claimed file is on disk; who or what took them is not in it, and a folder change alone produced a
 * run where neither half of that sentence was true. Naming a cause the tool has not established sends
 * its reader hunting for a deletion that never happened - and replacing one invented cause with a list
 * of candidates would be the same fault wearing a hedge. So this states what was seen and what is
 * worth looking at, which is all anybody can act on.
 */
const EVERY_CLAIMED_FILE_WAS_MISSING =
  'Every file toopo.lock claims was missing from disk, and this run puts them back. A project whose ' +
  'installed folder is not committed looks exactly like this from here, so it is worth checking ' +
  'before the next person clones: what toopo writes is source code in your project rather than a ' +
  'dependency your package manager restores, and it belongs in version control with the rest of it.'

/**
 * What was found, and what was or was not done about it.
 *
 * `applied` is the whole of the difference between the two commands. It is a parameter rather than two
 * renderers because the body is the same body - what changes is one closing sentence, and two renderers
 * would be two places for that body to drift.
 */
export const renderUpdate = (
  update: Reconciliation,
  before: Lockfile,
  configuration: Configuration,
  applied: boolean,
  git: CommitStanding,
): string =>
  [
    '',
    ...update.features.flatMap((feature) =>
      featureBlock(feature, configuration, 'nothing imports it any more', THE_WAYS_OUT.update),
    ),
    theTally(update),
    '',
    ...(update.everyClaimedFileIsMissing
      ? [...paragraph(EVERY_CLAIMED_FILE_WAS_MISSING, 72).map((line) => `${INDENT}${line}`), '']
      : []),
    // Two different observations, both printed when both hold: every claimed file missing, and a
    // folder git has been asked about and will not accept. Neither is offered as the reason for the
    // other - the second is measured, and the first is a state with more than one way of arising.
    ...commitAdvice(configuration, git, false),
    ...theClosing(before, update, applied, 'toopo update --apply'),
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
  before: Lockfile,
  configuration: Configuration,
  applied: boolean,
): string => {
  const what = renderContract(removal.named)
  const applyWith = `toopo remove ${removal.named.name} --apply`

  if (removal.departure === 'stays-as-a-dependency') {
    /**
     * The demotion is claimed only where it happened, and it does not happen to a held-back feature.
     *
     * *It is no longer something you asked for* is a statement about the lockfile, and it was printed
     * from the departure alone - which says the feature stays and says nothing about whether this run
     * was allowed to touch its entry. A feature whose file is conflicted is held back whole, entry
     * included, so the demotion is exactly what did **not** happen and the reader is owed the reason
     * instead.
     */
    const outcome = removal.reconciliation.features.find((feature) =>
      sameContract(feature.contract, removal.named),
    )
    const heldBack = outcome?.heldBack ?? null

    return [
      '',
      ...paragraph(
        `${what} stays where it is: ${listed(removal.stillReachedBy)} ` +
          `${removal.stillReachedBy.length === 1 ? 'imports' : 'import'} it.`,
      ).map((line) => `${INDENT}${line}`),
      '',
      ...paragraph(
        heldBack === null
          ? 'What changes is that it is no longer something you asked for, so it goes on its own the ' +
              'day nothing imports it. No file moves.'
          : `Nothing changed, because ${heldBack}. It is still something you asked for. Run this ` +
              `again once that file is settled.`,
      ).map((line) => `${INDENT}${line}`),
      '',
      ...theClosing(before, removal.reconciliation, applied, applyWith),
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
        THE_WAYS_OUT.removal,
      ),
    ),
    theTally(removal.reconciliation),
    '',
    ...theClosing(before, removal.reconciliation, applied, applyWith),
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
            feature.files.some((file) => file.verdict === 'kept') ? 'kept as it is' : '',
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
          // *`toopo update --apply` puts them back* was a prediction this command cannot make: a
          // missing file whose feature carries a conflict elsewhere is held back whole and comes
          // back on no run at all. What is true is what that command does first, which is show.
          ...paragraph(
            `${countOf(missing.length, 'file is', 'files are')} missing. ` +
              `\`toopo update\` shows what would be put back.`,
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

