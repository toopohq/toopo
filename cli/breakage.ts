/**
 * What happens to a real project, sorted into what is refused cleanly and what breaks badly.
 *
 * This list is the answer to a question a test suite does not ask: *not what breaks in a guard, what
 * breaks for somebody*. It is written down here rather than left in a report because the founder will
 * meet every one of these himself, and a list he reads before meeting them is worth more than one
 * written afterwards.
 *
 * Two verdicts, and the difference is the whole point.
 *
 * `refused-cleanly` means the installer says what is wrong in a sentence and writes nothing. Each of
 * these names the guard that keeps it. **Whether that identifier still addresses a guard is not checked
 * here**, and cannot be: a guard cannot enumerate the tests vitest collected. The mechanism that would
 * close it - a pre-flight refusal of a pin naming a guard no guard carries - is the debt `CLAUDE.md`
 * records, and this list is one more thing waiting for it.
 *
 * `breaks-badly` means the process throws whatever the operating system threw. Each one says what the
 * user would see. They are not guarded, they are *declared*, and the reason each is declared rather
 * than closed is written beside it - because a list of failures somebody chose to leave open is worth
 * more than a list of failures nobody looked for.
 */

export type Breakage = {
  /** What the user did. */
  readonly situation: string
  readonly verdict: 'refused-cleanly' | 'breaks-badly'
  /**
   * The guard that keeps this, for a clean refusal. Absent on the others, and its absence is what
   * `every-breakage-is-classified` reads.
   */
  readonly guard?: string
  /** What the user sees, and for a bad break why it was left open. */
  readonly detail: string
}

export const WHAT_BREAKS: readonly Breakage[] = [
  // -------------------------------------------------------------------------
  // Refused cleanly
  // -------------------------------------------------------------------------
  {
    situation: 'the target folder already holds a file of the same name that toopo did not write',
    verdict: 'refused-cleanly',
    guard: 'a-file-we-did-not-write-is-never-overwritten',
    detail:
      'the path is named, the sentence says it is not ours to overwrite, and nothing is written at ' +
      'all. What decides it is the *bytes* and never the absence of a claim: a file already holding ' +
      'exactly what toopo would write is ours, or an exact copy of ours, and is recorded rather than ' +
      'refused - which is the pair below.',
  },
  {
    situation: 'a file is already there holding exactly the bytes toopo would write',
    verdict: 'refused-cleanly',
    guard: 'a-file-already-holding-our-bytes-is-claimed-and-not-rewritten',
    detail:
      'not a refusal at all, and listed here because it is the other half of the entry above. Byte ' +
      'identity over a source file is not a coincidence anybody meets, so the file is claimed, not ' +
      'written, and reported with `=` rather than `+` - two different events, said apart. It is the ' +
      'same rule `toopo update` carries as `already-written`, and it is what makes the lockfile ' +
      'refusal below survivable.',
  },
  {
    situation: 'toopo.lock was written before `askedFor` existed',
    verdict: 'refused-cleanly',
    guard: 'a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run',
    detail:
      'refused rather than migrated, because the missing field is not derivable from anything on ' +
      'disk - both ways of guessing it are recorded as wrong in `implementation-record.ts`. The ' +
      'refusal names every feature the file holds and the `toopo add` line for each, and the entry ' +
      'above is what makes those lines cost nothing: no file is rewritten and no edit is at risk. ' +
      'Both shapes shipped under `"version": 1`, which is what made the number worth nothing.',
  },
  {
    situation: 'a file was edited after it was installed',
    verdict: 'refused-cleanly',
    guard: 'an-edited-file-is-never-replaced',
    detail:
      'permanent rule 4, answered offline: the lockfile holds the digest of what was written and the ' +
      'file on disk hashes to something else. The refusal says to move the change aside or skip the ' +
      'install, and never offers to overwrite.',
  },
  {
    situation: 'the same feature is installed a second time',
    verdict: 'refused-cleanly',
    guard: 'reinstalling-what-is-already-there-changes-nothing',
    detail: 'answered as "already installed, nothing to do" rather than rewritten',
  },
  {
    situation: '`toopo add` is run in a project that was never initialised',
    verdict: 'refused-cleanly',
    guard: 'add-with-no-configuration-writes-one-and-says-so',
    detail:
      'not a refusal at all, and the entry a reader most needs changed. It used to stop and name ' +
      '`toopo init`, which stopped somebody for nothing: the only thing an install needs to know is ' +
      'a folder and `proposeDirectory` deduces one. So the proposed configuration is written, the ' +
      'feature is installed, and **the screen says a file appeared** - `toopo.json` is committed by ' +
      'the user, so a run that writes one puts a file in front of their whole team.',
  },
  {
    situation: 'toopo.lock records features and toopo.json is gone',
    verdict: 'refused-cleanly',
    guard: 'a-lockfile-with-no-configuration-is-refused-with-the-folder-to-name',
    detail:
      'the case the refusal above was covering by accident, and it survived removing it. A lockfile ' +
      "records each file's path relative to the configured directory and never the directory itself, " +
      'so nothing on disk says where the installed features are: proposing a folder would install ' +
      'beside them rather than over them, leaving two copies and a lockfile describing one. The ' +
      'refusal names `toopo init --dir` and says why only the user can answer it.',
  },
  {
    situation: 'toopo.lock is not JSON, or was written by a later toopo',
    verdict: 'refused-cleanly',
    guard: 'an-unreadable-lockfile-stops-the-install',
    detail:
      'refused rather than ignored: an installer that read a malformed lockfile as an absent one ' +
      'would decide a file it did not write was safe to overwrite',
  },
  {
    situation: 'toopo.json carries a setting this toopo does not honour',
    verdict: 'refused-cleanly',
    guard: 'a-field-this-toopo-does-not-honour-is-refused',
    detail: 'a setting that is written and ignored is a promise not kept, so it is named and refused',
  },
  {
    situation: 'the project has no package.json',
    verdict: 'refused-cleanly',
    guard: 'a-project-with-no-package-json-installs-normally',
    detail:
      'not a breakage at all, and listed because a reader would assume it is one. `toopo.json` is the ' +
      'marker of a project; nothing here needs a package manager to have been used.',
  },
  {
    situation: 'the project path contains a space',
    verdict: 'refused-cleanly',
    guard: 'a-path-with-a-space-installs-normally',
    detail:
      'no shell ever sees a path: every file operation goes through `node:path` and `node:fs`, and ' +
      'the one subprocess this repository spawns for parsing is given a directory it made itself',
  },
  {
    situation: "the project's tsconfig.json does not carry the options the catalogue is written under",
    verdict: 'refused-cleanly',
    guard: 'the-users-tsconfig-is-never-read',
    detail:
      'nothing in an install reads it. Imports are parsed in a temporary project with a configuration ' +
      'of our own, and what lands is source the user compiles with whatever they use.',
  },
  {
    situation: 'the target folder cannot be written to',
    verdict: 'refused-cleanly',
    guard: 'a-file-where-a-folder-must-go-is-refused-with-nothing-staged',
    detail:
      'the failure happens while staging, where nothing has been committed, so it is a sentence ' +
      'naming the path and a project that was not touched. It used to be an unhandled EACCES. What ' +
      'closed it is not a pre-flight writability check - a check that passes and is then contradicted ' +
      'by the write is two answers to one question - it is that the write itself now happens in a ' +
      'phase whose whole property is that abandoning it costs nothing. **What the guard measures is a ' +
      'file sitting where one of our folders has to go**, which fails on the same line, in the same ' +
      'phase, through the same catch; a permission denial is not something a guard can arrange on ' +
      'every platform this runs on, and claiming it was measured would be claiming more than was.',
  },
  {
    situation: 'a directory sits where an installed file should go',
    verdict: 'refused-cleanly',
    guard: 'a-directory-where-a-file-goes-is-refused-by-name',
    detail:
      'measured on Windows, renaming onto a directory is EPERM and says nothing a caller can act on, ' +
      'so the kind of what sits at the destination is asked before staging. A question about a kind, ' +
      'not a prediction about permissions.',
  },
  {
    situation: 'a feature the user never asked for is asked to be removed',
    verdict: 'refused-cleanly',
    guard: 'a-feature-that-was-never-asked-for-is-refused-with-what-imports-it',
    detail:
      'the refusal names the feature that imports it, which is the difference between an answer ' +
      'somebody can act on and one they argue with. "It is a dependency" is a sentence nobody can do ' +
      'anything about; `number/round@1 imports it` is one they can. It comes out of the same ' +
      'resolution the removal was already making rather than from a second walk.',
  },
  {
    situation: 'a feature another root still imports is asked to be removed',
    verdict: 'refused-cleanly',
    guard: 'a-feature-another-root-still-imports-stays-and-stops-being-a-root',
    detail:
      'not a refusal at all, and the entry a reader most needs. It **stays**, and it stops being ' +
      'something the user asked for - so it leaves on its own the day nothing imports it. From ' +
      'outside that looks exactly like nothing happened, which is the moment somebody stops trusting ' +
      'a tool, so the screen names the feature, names what keeps it here, and says what did change. ' +
      'The lockfile moves and no file does.',
  },
  {
    situation: 'a file the user edited belongs to the feature being removed',
    verdict: 'refused-cleanly',
    guard: 'a-file-the-user-edited-is-not-deleted-by-a-removal',
    detail:
      'permanent rule 4 on the one command that deletes: the file stays, its feature is held back ' +
      'whole, and so is everything that feature imports - because the code left on disk is the old ' +
      'code and the old code still imports it. That second half was missing and was found by this ' +
      'suite: the rule was asked of the features still in the plan, and a feature held back while ' +
      'leaving is in nobody\'s plan.',
  },
  {
    situation: 'the registry cannot answer for a version toopo.lock records, during a removal',
    verdict: 'refused-cleanly',
    guard: 'a-removal-that-cannot-reach-the-registry-refuses-and-explains',
    detail:
      'a removal decides which files leave by re-planning what stays, and what the remaining features ' +
      'import is not in the lockfile - **it never was, and no field would put it there**. A shared ' +
      'file is written once and the other carrier is repointed at it, so that carrier\'s entry does ' +
      'not name the file it imports; deciding from the lockfile alone would delete it. Measured on ' +
      'the fixture graph: `number/clamp@1` records one file and imports `../../string/pad/digits.js`, ' +
      'and three files that stay would have imported something that was gone. So the refusal explains ' +
      'rather than reports a failure - *this needs to know what the features that stay import, and ' +
      'only the registry knows* - and it degrades without destroying: the files stay, nothing breaks, ' +
      'and the removal works when the registry answers. **Measured, 8 of 64 removals over both graphs ' +
      'need no registry at all, and they are exactly the ones that take out a project\'s last root.** ' +
      'A published version is served for life, so a withdrawn artefact is not a case that exists; ' +
      'only a registry that cannot answer right now.',
  },
  {
    situation: 'a file is deduplicated away by a plan that sees two features carrying it',
    verdict: 'refused-cleanly',
    guard: 'a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it',
    detail:
      '`add` plans one root at a time, so two features carrying one file are written twice and each ' +
      'copy is claimed. The first update afterwards is the first plan that sees both: it repoints one ' +
      'at the other and drops the file from that entry. It used to leave the copy on disk claimed by ' +
      'nothing, and the next command that wanted to write there refused with *it is already there and ' +
      'toopo.lock does not claim it* - about a file toopo had written itself two commands earlier. ' +
      'The copy now goes with the claim, unless the user edited it.',
  },
  {
    situation: 'the installed folder is not committed, and somebody else checks the project out',
    verdict: 'refused-cleanly',
    guard: 'every-file-missing-at-once-says-the-folder-is-not-committed',
    detail:
      'the trap is silent and its victim has no way to reach the cause: the build fails on an import ' +
      'long before anybody thinks to run `toopo update`, and the update then repairs it perfectly and ' +
      'says nothing - so the next person to clone meets the same thing. What this catches is the ' +
      '**symptom**: every file the lockfile claims missing at once, which is what a checkout that ' +
      'never received the folder looks like and what deleting a file does not. The *cause* is caught ' +
      'one step earlier now - `ignored.ts` asks git whether the folder will be committed, on the run ' +
      'that writes into it - and the two are kept apart on purpose, because a project can meet either ' +
      'without the other.',
  },
  {
    situation: 'the configured folder is changed while features are installed',
    verdict: 'refused-cleanly',
    guard: 'every-installed-file-moves-and-not-one-byte-changes',
    detail:
      'not a breakage at all, and the entry a reader would most expect to be one. **It used to be**: ' +
      'the installed copy stayed where it was, claimed by nobody, because `toopo.lock` records each ' +
      "file's path relative to the configured directory and never the directory itself - so the entry " +
      'went on being valid and pointed somewhere else. `toopo list` then called every file missing, ' +
      '`toopo update --apply` put a second copy in the new folder, and the first sat in the folder git ' +
      'ignores where nothing would mention it again. It was found by following this tool\'s own advice: ' +
      'the sentence above about an ignored folder says to pick one that is committed. **`init` is the ' +
      'only command that can ever see both folders** - after it writes, the old path is recoverable ' +
      'from nothing on disk - so it moves the tree itself. A renaming and no more: measured, the ' +
      'lockfile comes out identical byte for byte, no import is repointed and no registry is asked. ' +
      'The screen names every file and says the one part that stays the user\'s, which is the imports ' +
      'in their own code.',
  },
  {
    situation: 'the folder a change would move into already holds a file of that name',
    verdict: 'refused-cleanly',
    guard: 'a-destination-holding-something-else-refuses-the-whole-move',
    detail:
      'the other half of the entry above, and the same rule as the first entry of this list: a file ' +
      'that is not ours is not overwritten, whatever is in it. The **whole** relocation is refused ' +
      'rather than the offending file skipped, because a project half in one folder and half in ' +
      'another is a state no command afterwards could describe. A destination already holding exactly ' +
      'the bytes that were about to be written is the exception and is not a refusal - it is the move ' +
      'already having happened, which is what a run killed between the renames and the removals leaves ' +
      'behind, and without it the retry would be refused by the rule that exists to protect it.',
  },
  {
    situation: 'the folder that was left still holds something the user put there',
    verdict: 'refused-cleanly',
    guard: 'the-folder-that-was-left-stays-when-it-holds-something-else',
    detail:
      'the emptied folder is taken, because the screen says the files moved and a folder carrying this ' +
      "tool's name still sitting there contradicts it. One that is not empty is left alone and named. " +
      'It is not the rule `emptiedFolders` carries in `write.ts`: `remove` and `update` must never ' +
      'delete the configured folder, because it goes on being the configured folder - here it stops ' +
      'being one, and an abandoned folder is not an emptied folder.',
  },
  {
    situation: 'the process is killed between the first file and the lockfile',
    verdict: 'refused-cleanly',
    guard: 'a-file-already-equal-to-what-we-would-write-is-not-a-conflict',
    detail:
      'a single file is never half-written - it is renamed or it is not - and the lockfile is renamed ' +
      'last, so the window always resolves backwards: the lockfile still describes the old install. ' +
      '`toopo update` finishes the job on the next run without a journal, because a file whose bytes ' +
      'are exactly the ones we are about to write is a write that already happened rather than an ' +
      'edit. What is *not* claimed: the files staged by the killed run are left behind under ' +
      '`.toopo-part`, inert and under our own folder, and the next run overwrites them.',
  },

  // -------------------------------------------------------------------------
  // Breaks badly, and left open deliberately
  // -------------------------------------------------------------------------
  {
    situation: 'a rename fails after every file has been staged',
    verdict: 'breaks-badly',
    detail:
      'a file held open by another process is the realistic case on Windows. It throws rather than ' +
      'answering a sentence, and some files already carry the new bytes when it does. Nothing is ' +
      'lost - it resolves backwards like any interruption, and the run above finishes it - but it is ' +
      'a stack trace. Closing it would mean every rename being reversible, which is a journal, and ' +
      'the interruption above is what a journal would otherwise have been for.',
  },
  {
    situation: 'the working tree is edited while an install is reading it',
    verdict: 'breaks-badly',
    detail:
      'a named refusal - `ServedBytesDisagree` - with a stack trace rather than a sentence, because ' +
      'it is a fault of the local stand-in for a registry and not of the install. It disappears the ' +
      'day a server exists, which is why it was not given a report of its own.',
  },

  // -------------------------------------------------------------------------
  // Not ours, and the person who meets it does not care whose it is
  // -------------------------------------------------------------------------
  {
    situation: 'a feature of more than one file is run under node\'s own TypeScript, with no compiler',
    verdict: 'breaks-badly',
    detail:
      'ERR_MODULE_NOT_FOUND on an import *inside* an installed file. Node strips types and does not ' +
      'remap a `.js` specifier to its `.ts` sibling, and a published source has to write `.js` - it ' +
      'is the only spelling `tsc` resolves under bundler, node16 and nodenext alike. So a feature ' +
      'that carries a second file cannot be run by node directly, however the user spells their own ' +
      'import. Measured on node v24.15.0 with `"type": "module"`: an entry spelled `.ts` importing ' +
      '`./digits.ts` runs, and the same entry whose own file imports `./digits.js` does not. ' +
      'Invisible today because all five contracts are one file, and certain to bite on the first one ' +
      'that is not. It is a limit of node rather than of us, and `cli/toopo.ts` shows what it costs ' +
      'to work around - fifteen lines of `node:module` that this repository can register for itself ' +
      'and cannot register inside somebody else\'s program. Declared rather than discovered, because ' +
      'whoever meets it wants to know it is known.',
  },
]
