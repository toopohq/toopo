/**
 * The battery over the screen `toopo search` puts on a terminal.
 *
 * **It measured the matching rule as well until ADR-0136, and what is left is the half that is a
 * screen.** The rule - what a query answers, what it must not, and the order - is a function of
 * `contract-index` and `refusals` and of nothing a client holds, so it moved to
 * `packages/registry/search.ts` and its eighteen anchors and twenty-one cells went with it, into
 * `registry-storage`. **They kept their identifiers**, because a mutant is addressed by the pair
 * `(battery, id)` and never by the id alone, so `S-01` there and `S-19` here name different things
 * and always did.
 *
 * **They went into an existing battery rather than a new one, and the reason is a duplication rather
 * than a preference.** A battery accounts for every guard of the suite it runs - witnessed or
 * declared - and `registry-storage` already carries that accounting for the registry's suite, at 182
 * guard names. A second battery over the same folder would have to state it again, and a second
 * statement of what a folder holds is the thing that drifts. So the scope of a battery is the folder
 * and the suite, never the theme, and that battery's name is now narrower than its contents.
 *
 * ---------------------------------------------------------------------------
 * What the mutants here are aimed at
 * ---------------------------------------------------------------------------
 *
 * **What the reader is handed.** An install line under a contract that cannot be installed is the
 * defect reading the first draft of this output caught by eye, so it gets a mutant rather than a
 * memory. Losing the mark that says a contract is not installable is the same defect from the other
 * side, and a summary cut with nothing saying so reads as the whole of what a contract claims.
 *
 * **Three cells and no more, because three is what a screen is.** Everything else this command does
 * is a decision, and a decision is measured where the decision lives.
 *
 * The numbering starts at S-19 and the gap below it is left rather than closed. The identifiers are
 * addresses: renumbering them would make every citation of this battery's history point at something
 * else, and a battery's own past is worth eighteen missing numbers.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'S', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const reportFile = (find: string, replace: string) => ({ file: 'report.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const A_REFUSED_CONTRACT_IS_OFFERED_NO_INSTALL_LINE = `      ? first.installable
        ? [\`\${INDENT}\${THE_INVOCATION} add \${first.address.name}\`, '']
        : []`
const THE_MARK_SAYS_IT_IS_NOT_INSTALLABLE = `  \`\${INDENT}\${renderContract(result.address)}\${result.installable ? '' : '   not installable'}\`,`
const A_SUMMARY_IS_CUT_RATHER_THAN_DROPPED = `  return [...lines.slice(0, most - 1), \`\${lines[most - 1] as string}...\`]`

const mutants: readonly Mutant[] = [
  // -------------------------------------------------------------------------
  // The silence: every way of making a search answer more than it should
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-19',
    'offers `toopo add` under a contract it has just called not installable - the command refuses ' +
      'when the reader runs it, and this is the defect reading the first draft of the output caught ' +
      'by eye',
    [
      reportFile(
        A_REFUSED_CONTRACT_IS_OFFERED_NO_INSTALL_LINE,
        `      ? [\`\${INDENT}\${THE_INVOCATION} add \${first.address.name}\`, '']`,
      ),
    ],
    killed(['a-refused-contract-is-offered-no-install-line']),
  ),

  sameOnEveryLens(
    'S-20',
    'stops marking a refused contract, so the one result the catalogue will not serve looks exactly ' +
      'like the four it will',
    [reportFile(THE_MARK_SAYS_IT_IS_NOT_INSTALLABLE, `  \`\${INDENT}\${renderContract(result.address)}\`,`)],
    killed(['a-refused-contract-is-offered-no-install-line']),
  ),

  sameOnEveryLens(
    'S-21',
    'drops the rest of a summary instead of marking that it was cut, so a sentence ends mid-thought ' +
      'and reads as the whole of what the contract claims',
    [reportFile(A_SUMMARY_IS_CUT_RATHER_THAN_DROPPED, `  return lines.slice(0, most)`)],
    killed(['a-cut-summary-says-that-it-was-cut']),
  ),
]

export const battery: Battery = {
  name: 'cli-search',
  contractPath: 'packages/cli',
  vitestConfig: 'packages/cli/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'S-19',

  arms: [
    {
      id: 'S',
      ref: 'HEAD',
      convention:
        'the search command as committed: what a query matches, what it must not, the order, and ' +
        'the screen the reader gets',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['S'], edits: [] },
  ],

  mutants,

  unreachableGuards: [],

  /**
   * `packages/cli/` is one folder measured by four batteries, and this is what the other three hold.
   *
   * `toopo remove` and `toopo list` added twenty-five guards and **all twenty-four that touch a
   * project are here**, which is the cleanest division of the four: the other two batteries each
   * absorbed most of that unit, because a removal parses through the same grammar and plans through
   * the same arithmetic. A query does neither.
   *
   * The division is clean because a screen shares nothing with them: it writes no file, reads no
   * project, and touches neither the plan nor the lockfile. Every guard below is over something the
   * three cells here cannot reach, and every one of them is probed by `cli-install` or `cli-update`,
   * which is what makes this a declaration of division rather than a debt.
   *
   * **Nothing was added below when the matching rule left**, and that is a fact about where the
   * guards went rather than a claim about coverage: the eleven this battery used to redden by
   * measuring the rule moved out of `packages/cli/` with the module, so they are collected by another
   * suite entirely and are neither witnessed here nor missing here. The three that stayed are in
   * `search.test.ts` beside this file's own subject.
   *
   * The two guards of the argument grammar that a query added are the exception, and they are not
   * here: the reason no mutant is written for them is that the grammar is `cli-install`'s region, and
   * splitting a region across batteries is how two batteries come to disagree about who probes what.
   */
  unprobedRegions: [
    /**
     * How a command ends, which `command.ts` decides and this battery injects nowhere near.
     *
     * All three, in the same words as `cli-remove` and `cli-update` - and the uniformity is bought
     * rather than assumed. The control ran `add` first, which reaches the plan, the rewrite, the
     * lockfile, the configuration and the git question, so it reddened on a set of cells that differed
     * by platform and once on a cell with no causal path to it at all. It asks for a search now, which
     * fetches, succeeds, and touches nothing else - so no mutant of this folder's other three batteries
     * reaches any of the three, and the declaration is one sentence everywhere instead of three.
     *
     * ADR-0168 is the defect they exist for; `cli-install` carries it with C-73, C-74 and C-75.
     */
    {
      nature: 'claims detection',
      reason:
        'how a command ends, which `command.ts` decides and this battery injects nowhere near - it ' +
        'edits `report.ts` alone. `cli-install` carries all three defects over that frame: C-73 and ' +
        'C-74 on a refusal that had reached the registry, and C-75 on a command that did what was ' +
        'asked. ADR-0168',
      guards: [
        'a-command-that-did-what-was-asked-exits-zero-and-ends-the-same-way',
        'a-refusal-lets-the-process-end-rather-than-stopping-it',
        'a-refusal-that-reached-the-registry-exits-one-and-says-nothing-on-the-error-stream',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the acceptance of the emitted tree. The two sides of each comparison share every decision ' +
        'and differ in exactly one thing - which registry they read: the installer stand-in on one ' +
        'side, the emitted tree on the other. So a defect in a decision changes both sides ' +
        'identically and the comparison is green on it, and what separates them is a defect in ' +
        'local-source.ts, which cli-install carries with C-17, C-18, C-22 and C-42. This battery ' +
        'injects into neither that stand-in nor the emission it is compared against.',
      guards: [
        'a-refused-contract-answers-no-binding-and-an-empty-list-of-implementations',
        'add-decides-the-same-thing-against-the-emitted-tree',
        'every-byte-the-registry-serves-arrives-unchanged',
        'remove-decides-the-same-thing-against-the-emitted-tree',
        'search-decides-the-same-thing-against-the-emitted-tree',
        'update-decides-the-same-thing-against-the-emitted-tree',
      ],
    },

    {
      nature: 'claims detection',
      reason:
        'everything that touches a project. Installing, updating, diffing, staging, renaming, moving ' +
        'the configured folder, the lockfile and what a plan does with a shared file - a query ' +
        'reaches none of it, and the three batteries next door carry ninety-odd defects over exactly ' +
        'these. `search` is the one command that reads no project, so the division needs no argument ' +
        'beyond that sentence. The registry over HTTP is in the list on a second one: a query does go ' +
        'through the fixpoint, but every defect this battery injects is in `search.ts` and in the ' +
        'screen it renders, so none of them reaches the loop or the transport under it. The rule ' +
        'that decides where a file may land is in the list on the same sentence and needs no second ' +
        'one: this battery edits `report.ts` alone, and nothing in that file composes a path. ' +
        '`cli-install` carries all ten of its guards with C-76, C-77 and C-78.',
      guards: [
        'a-blob-that-is-not-what-its-address-names-is-refused',
        'a-command-that-takes-nothing-is-read-and-refuses-an-argument',
        'a-command-with-no-flag-is-read',
        'a-commit-leaves-no-staged-file-behind',
        'a-commit-writes-the-files-and-the-lockfile-together',
        'a-configuration-round-trips-through-the-file',
        'a-conflicted-feature-is-held-back-whole',
        'a-contract-the-catalogue-refused-is-not-installable',
        'a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it',
        'a-count-is-read-off-the-lines-it-summarises',
        'a-deduplicated-copy-the-user-edited-is-kept-rather-than-taken',
        'a-dependency-that-left-the-closure-is-removed',
        'a-destination-already-holding-our-bytes-is-a-move-that-happened',
        'a-destination-holding-something-else-refuses-the-whole-move',
        'a-directory-a-reader-typed-is-shown-as-they-typed-it',
        'a-directory-that-does-not-travel-is-refused',
        'a-directory-that-travels-is-accepted',
        'a-directory-that-leads-out-of-the-project-is-not-a-place-a-file-may-land',
        'a-directory-where-a-file-goes-is-refused-by-name',
        'a-feature-another-root-still-imports-stays-and-stops-being-a-root',
        'a-feature-nothing-else-holds-leaves-with-everything-it-pulled-in',
        'a-feature-pulled-in-and-then-asked-for-becomes-a-root',
        'a-feature-that-imports-a-held-back-one-is-held-back-too',
        'a-feature-that-was-never-asked-for-is-refused-with-what-imports-it',
        'a-feature-with-no-dependency-lands-exactly-as-it-was-served',
        'a-field-this-toopo-does-not-honour-is-refused',
        'a-file-already-equal-to-what-we-would-write-is-not-a-conflict',
        'a-file-already-holding-our-bytes-is-claimed-and-not-rewritten',
        'a-file-changed-on-both-sides-is-a-conflict',
        'a-file-that-is-gone-is-named-with-what-puts-it-back',
        'a-file-that-is-not-json-is-refused-by-name',
        'a-file-that-was-deleted-is-put-back',
        'a-file-the-lockfile-claims-and-the-disk-has-not-got-moves-nothing',
        'a-file-the-registry-did-not-change-keeps-your-version',
        'a-file-the-user-edited-is-not-deleted-by-a-removal',
        'a-file-the-user-edited-moves-with-the-edit-in-it',
        'a-file-toopo-did-not-write-is-never-overwritten-by-an-update',
        'a-file-we-did-not-write-is-never-overwritten',
        'a-file-where-a-folder-must-go-is-refused-with-nothing-staged',
        'a-flag-and-its-value-are-read',
        'a-flag-with-no-value-is-refused',
        'a-folder-change-names-every-file-that-moved',
        'a-folder-change-says-the-imports-are-the-users-to-change',
        'a-folder-that-could-not-be-taken-is-named',
        'a-folder-that-is-not-moving-and-a-project-with-nothing-to-move-both-move-nothing',
        'a-held-back-feature-keeps-its-lockfile-entry-exactly',
        'a-held-back-feature-says-so-before-it-says-anything-else',
        'a-held-back-removal-leaves-the-lockfile-exactly-as-it-was',
        'a-hunk-header-counts-the-lines-it-covers',
        'a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk',
        'a-line-only-the-first-text-has-is-a-minus',
        'a-line-only-the-second-text-has-is-a-plus',
        'a-line-says-what-was-done-to-that-file',
        'a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run',
        'a-lockfile-from-before-the-revision-is-refused-with-the-command-to-run',
        'a-lockfile-naming-a-file-outside-the-configured-directory-is-unusable',
        'a-lockfile-with-no-configuration-is-refused-with-the-folder-to-name',
        'a-lockfile-with-no-root-has-nowhere-to-start',
        'a-missing-final-newline-is-said-rather-than-lost',
        'a-name-the-catalogue-does-not-hold-is-refused',
        'a-name-the-project-does-not-hold-is-refused-with-what-it-does',
        'a-path-with-a-space-installs-normally',
        'a-project-holding-nothing-says-so-rather-than-printing-a-blank-screen',
        'a-project-is-removed-while-another-process-still-holds-it',
        'a-project-that-was-never-initialised-answers-nothing',
        'a-project-with-no-package-json-installs-normally',
        'a-project-with-nothing-in-it-is-configured-rather-than-refused',
        'a-refusal-leaves-no-staged-file-behind',
        'a-refusal-leaves-the-project-exactly-as-it-was',
        'a-refusal-says-nothing-was-written-before-it-says-why',
        'a-refused-commit-does-not-touch-the-file-it-would-replace',
        'a-refused-contract-is-in-the-index-and-is-not-installable',
        'a-refused-directory-is-named-by-where-it-came-from',
        'a-refused-directory-is-told-what-in-it-was-refused',
        'a-refused-folder-change-leaves-the-configuration-naming-the-old-folder',
        'a-registry-that-does-not-answer-is-a-sentence-a-person-can-read',
        'a-registry-that-has-not-moved-changes-nothing',
        'a-registry-that-sends-the-client-elsewhere-is-refused-by-name-rather-than-followed',
        'a-relocation-leaves-the-lockfile-exactly-as-it-was',
        'a-relocation-of-a-path-that-leaves-the-folder-is-refused',
        'a-removal-leaves-a-folder-that-still-holds-something',
        'a-removal-shows-and-writes-nothing-until-it-is-applied',
        'a-removal-that-cannot-reach-the-registry-refuses-and-explains',
        'a-removal-that-leaves-the-directory-is-refused-before-anything-is-written',
        'a-removal-tidies-the-folder-it-emptied',
        'a-renamed-entry-file-is-repointed',
        'a-repeated-flag-and-a-stray-word-are-refused',
        'a-root-stays-one-when-something-else-pulls-it-in',
        'a-served-path-that-leaves-the-directory-is-refused-by-the-plan',
        'a-served-path-that-leaves-the-parsing-project-is-refused-before-it-is-written',
        'a-shared-blob-is-repointed-across-features',
        'a-shared-file-is-written-once-and-still-appears-in-the-plan',
        'a-shared-file-moves-into-the-folder-of-a-carrier-that-stays',
        'a-size-is-read-the-way-a-file-manager-shows-it',
        'a-snapshot-that-is-not-what-its-digest-names-is-refused',
        'a-source-carrying-more-than-the-port-declares-is-refused',
        'a-status-that-is-neither-the-answer-nor-a-404-is-an-error-and-not-an-absence',
        'a-switch-takes-no-value-and-swallows-nothing',
        'a-version-that-moved-with-no-byte-changing-is-recorded-anyway',
        'a-version-this-toopo-does-not-write-is-refused',
        'a-write-that-leaves-the-directory-is-refused-with-nothing-staged',
        'add-with-a-lockfile-and-no-configuration-writes-nothing',
        'add-with-no-configuration-writes-one-and-says-so',
        'add-without-a-contract-is-refused',
        'an-edge-the-registry-does-not-hold-is-refused',
        'an-edge-whose-digest-names-another-artefact-is-refused',
        'an-edit-that-keeps-a-leaving-feature-keeps-what-it-imports-too',
        'an-edited-file-is-never-replaced',
        'an-entry-file-is-named-after-its-feature',
        'an-entry-file-is-never-deduplicated',
        'an-ignored-folder-is-told-about-instead-of-being-told-to-commit-it',
        'an-import-line-is-printed-ready-to-copy',
        'an-import-line-names-the-diagnostic-beside-the-answer',
        'an-import-of-a-file-this-install-does-not-carry-is-refused',
        'an-import-of-something-outside-the-registry-is-refused',
        'an-init-says-what-has-to-be-committed',
        'an-install-over-http-plans-exactly-what-the-same-registry-plans-in-process',
        'an-install-records-the-revision-the-registry-answered-from',
        'an-installation-is-the-same-with-git-and-without',
        'an-installed-file-imports-what-was-installed',
        'an-ordinary-directory-is-a-place-a-file-may-land',
        'an-unchanged-specifier-is-left-alone',
        'an-unknown-command-and-an-unknown-flag-are-refused',
        'an-unreadable-lockfile-stops-the-install',
        'an-update-keeps-the-implementation-the-lockfile-names',
        'an-update-writes-the-bytes-the-registry-now-serves',
        'applying-an-update-twice-changes-nothing-the-second-time',
        'bytes-served-at-the-address-that-was-asked-for-are-refused-when-they-are-not-that',
        'each-side-says-for-itself-that-it-has-no-final-newline',
        'every-breakage-is-classified',
        'every-clean-refusal-resolves-to-the-guard-it-names',
        'every-contract-of-the-catalogue-installs-one-file-named-after-itself',
        'every-feature-the-install-writes-gets-its-own-lockfile-entry',
        'every-file-missing-at-once-says-the-folder-is-not-committed',
        'every-installed-feature-is-named-with-whether-it-was-asked-for',
        'every-installed-file-moves-and-not-one-byte-changes',
        'every-method-of-the-port-answers-an-endpoint-that-exists',
        'every-shape-a-served-answer-really-carries-is-admitted',
        'every-shape-of-import-is-repointed-and-not-only-the-obvious-one',
        'every-shape-that-is-not-a-place-inside-is-refused',
        'git-answers-whether-the-folder-is-ignored-and-says-nothing-when-it-cannot',
        'nothing-at-all-is-refused',
        'nothing-but-the-local-adapter-reaches-the-serialisation',
        'nothing-is-removed-while-a-feature-is-held-back',
        'nothing-to-do-is-said-only-when-the-lockfile-does-not-move',
        'one-file-missing-is-not-a-folder-nobody-committed',
        'only-the-feature-that-was-asked-for-is-a-root',
        'only-the-lines-around-a-change-are-shown',
        'only-what-the-removed-feature-alone-pulled-in-goes-with-it',
        're-adding-what-you-asked-for-changes-nothing-and-claims-nothing',
        'reinstalling-what-is-already-there-changes-nothing',
        'remove-without-a-contract-is-refused',
        'remove-writes-only-when-it-is-asked-to',
        'taking-out-the-last-root-asks-the-registry-nothing',
        'the-commands-that-reach-the-registry-are-these-and-no-others',
        'the-cost-is-stated-before-the-files',
        'the-cost-is-the-files-the-bytes-and-the-depth',
        'the-diff-op-codes-are-what-node-answers',
        'the-features-that-stay-are-planned-at-the-version-the-lockfile-records',
        'the-folder-init-is-given-is-one-this-toopo-can-read',
        'the-folder-that-was-left-goes-when-it-is-empty',
        'the-folder-that-was-left-stays-when-it-holds-something-else',
        'the-graph-lands-as-a-tree-of-features',
        'the-import-line-follows-the-configured-directory',
        'the-listing-hashes-the-disk-rather-than-reading-what-we-recorded',
        'the-local-source-binds-the-version-the-registry-published',
        'the-lockfile-holds-what-was-served-and-what-was-written',
        'the-lockfile-standing-is-asked-and-not-predicted',
        'the-plan-is-in-the-resolutions-order',
        'the-port-answers-every-need-behind-it-and-nothing-else',
        'the-proposed-directory-follows-the-shape-of-the-project',
        'the-same-decision-against-a-warm-cache-and-no-network-is-the-same-plan',
        'the-three-spellings-of-one-file-all-resolve',
        'the-updated-lockfile-holds-what-was-served-and-what-was-written',
        'the-users-tsconfig-is-never-read',
        'the-walk-costs-one-round-trip-per-level-and-fetches-each-frontier-at-once',
        'the-ways-out-are-offered-only-where-the-reader-put-something',
        'two-changes-far-apart-are-two-hunks',
        'two-different-files-on-one-destination-are-refused',
        'two-edges-naming-one-address-at-two-digests-are-refused',
        'two-identical-texts-have-nothing-to-show',
        'two-named-answers-from-two-revisions-refuse-the-install',
        'two-versions-of-one-feature-are-refused',
        'two-versions-of-one-feature-are-refused-before-anything-is-written',
        'update-writes-only-when-it-is-asked-to',
      ],
    },
  ],
}
