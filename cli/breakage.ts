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
      'the path is named, the sentence says it is not ours to overwrite, and nothing is written at all',
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
    situation: '`toopo add` is run before `toopo init`',
    verdict: 'refused-cleanly',
    guard: 'add-before-init-says-what-to-run',
    detail: 'the refusal names `toopo init` and says it takes no answer and writes one file',
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
