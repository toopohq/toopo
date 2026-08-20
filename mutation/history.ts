/**
 * What git holds about this repository, asked of git rather than declared beside it. ADR-0095.
 *
 * Three questions, and the reason they are one module is that each is answered by walking what git
 * has rather than what a file says: which commits exist, what those commits carry, and which trees
 * are registered against them.
 *
 *     a citation      -> an identifier this repository may still edit names a commit of it
 *     an address      -> no commit and no tag carries an address this repository refuses to publish
 *     a worktree      -> the only checkout registered here is this repository's own root
 *
 * ---------------------------------------------------------------------------
 * `git rev-parse` is not this guard, and the difference is the whole of it
 * ---------------------------------------------------------------------------
 *
 * The obvious spelling is to hand each identifier to git and accept whatever resolves. It passes an
 * identifier that has left the history, because a rewrite does not delete the objects it replaced -
 * they survive in the object database until a `gc` nobody schedules, and `rev-parse` answers for them.
 *
 * That is not a hypothesis. Measured on this repository the day this module was written, over the
 * three commits a rewrite and two amendments had just replaced:
 *
 *     git rev-parse --verify --quiet <identifier>^{commit}     resolved all three
 *     git rev-list --all                                       held none of the three
 *
 * **So a guard built on `rev-parse` would have been green on all sixty-eight citations the morning
 * after `filter-repo` ran** - which is the one morning it existed to be red on. The population is
 * therefore `git rev-list --all`, and an identifier is live when exactly one commit of that population
 * begins with it. `--all` rather than `HEAD` because seventeen commits of this repository are reached
 * only by its `evidence/*` tags, and a sweep standing on a branch would let a defect leave by that
 * door.
 *
 * Exactly one, rather than at least one: an abbreviation matching two commits addresses neither, and
 * silently resolving it to the first would publish an identifier that sends a reader to a commit the
 * sentence around it is not about.
 *
 * ---------------------------------------------------------------------------
 * What a citation looks like, which was measured rather than chosen
 * ---------------------------------------------------------------------------
 *
 * Not every run of hexadecimal digits is a commit. This repository writes a truncated digest, a
 * decimal constant, a repeated letter and a deliberately fake identifier, and a guard that reddened on
 * those would become a list of exceptions nobody rereads.
 *
 * The distinction is not invented here; the repository already had it and nobody had noticed. Over
 * every hexadecimal run of seven or more digits in the tracked files, classified by whether git could
 * resolve it at all:
 *
 *     `<seven digits>` closed by a backtick     58 of the 68 citations,  0 of the 29 benign runs
 *
 * A truncated digest is written `bfcc6145...` with the ellipsis inside the quoting, so the closing
 * backtick never follows the digits; a decimal constant is not seven digits long; and a fake
 * identifier is a single-quoted string in a test rather than prose. **Nothing is excluded by name.**
 *
 * Two spellings are reached without widening it. A revision suffix inside the quoting is read here.
 * The values of `QUOTING` in `published.ts` are a declaration that those strings are commit
 * identifiers, and that declaration is read as one.
 *
 * **What is not reached is an identifier written bare, and this paragraph used to say it was.** It
 * claimed that the identifiers the form misses are named elsewhere in their own file, so that
 * resolving distinct identifiers arrives at them anyway. That was true of the two instances it was
 * written about, and records added since write identifiers bare inside a fenced block - a `git log`
 * excerpt, the table `npm run hands` prints - where nothing quotes them. `style.ts` writes two in
 * ordinary comments. **No rank is published for it**, on the rule that a sentence which can be true
 * without counting does not count, and because the population is not stable: what a reader may take
 * is that the gap is real and that this command names it.
 *
 *     git grep -nE '\b[0-9a-f]{7,40}\b' -- '*.ts' '*.md'
 *
 * It is on `CLAUDE.md`'s list of what this repository declares and nothing keeps, with what would
 * close it. The rewrite of ADR-0124 is what found it: every one of those bare identifiers had to be
 * translated by hand, and this guard would have been green with all of them dead.
 *
 * ---------------------------------------------------------------------------
 * Two limits, declared because each fails silently if it is not
 * ---------------------------------------------------------------------------
 *
 * **A sentence can be about an identifier without writing it, and no reading here sees that.** *the
 * commit whose whole subject is one word of one comment* is a claim about a commit, and it goes stale
 * exactly as a citation does. Those sentences were reformulated by hand in the unit before this one
 * and nothing keeps them reformulated. It is half the field, and it is written here rather than left
 * for a reader to assume covered - the alternative is a lint judging prose, which is the price
 * `decisions.ts` already refused twice.
 *
 * **This module cannot exhibit a dead identifier, only describe one.** A citation is a citation
 * wherever it is written, so an example of a broken one written in the form above would redden the
 * guard that reads it - correctly. That is why the measurement above is transcribed as the output of
 * two commands rather than quoted with its subject, and it is the guard working rather than a gap in
 * it. `decisions.ts` paid this exact cost first, on an invented record number.
 *
 * ---------------------------------------------------------------------------
 * Why the refused address is a digest and not itself
 * ---------------------------------------------------------------------------
 *
 * The rule cannot be *every commit carries the project address*: an outside contributor legitimately
 * commits under their own, and a rule refusing that refuses contribution. What is checkable is the
 * negative, and the negative needs the address named.
 *
 * Naming it in plain text would take the address out of the history and put it into the source, which
 * is the same address published for the same length of time by a different door. So what is declared
 * is a digest, and every address git holds is digested and compared. The decisive argument is not
 * secrecy but harvesting: a robot reads, it does not guess.
 *
 * **The limit, written here because it is the one a reader would otherwise assume away: a digest of a
 * guessable string is not a secret. It stops the address being republished; it does not stop anybody
 * who already suspects it from confirming it.** That is the whole of what this buys, and it is what
 * the entry asked for.
 *
 * A fault names the digest and never the address, so that a red run does not print in its output the
 * thing this declaration exists to keep out of the repository.
 */

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { theCatalogue } from '../packages/registry/the-catalogue.ts'
import { THE_REPOSITORY, answered, git, strayWorktrees, trackedSources } from './paths.ts'
import { THE_COMMITS_QUOTED } from './published.ts'

// ---------------------------------------------------------------------------
// The population
// ---------------------------------------------------------------------------

/** Every commit reachable from any ref of this repository, which is what *this repository* means. */
export const theHistory = (): readonly string[] => answered(git('rev-list', '--all'))

/**
 * Every file a published contract freezes, derived from what the registry serves rather than listed.
 *
 * A published contract's digest covers its seven declared files and every file they reach outside the
 * folder, byte for byte, comments included. `sharedHarness` is inside `contractSnapshot.frozen`, so
 * one character changed in either shared file rebinds every published address at once.
 */
const frozenByAPublishedContract = (): readonly string[] =>
  theCatalogue
    .filter((source) => source.lifecycle.state === 'published')
    .flatMap((source) => [...source.files.map((file) => `${source.folder}/${file}`), ...source.shared])

/**
 * The tracked sources this repository may still edit, which is the population a citation guard has.
 *
 * ---------------------------------------------------------------------------
 * This is a category and not an exemption, and the difference is what it can promise
 * ---------------------------------------------------------------------------
 *
 * A citation goes stale and is repaired; that is the whole loop this guard drives. **Inside a file a
 * published contract freezes there is no repair**, because permanent rule 6 forbids the edit that
 * would make one - so a citation written there is dead the moment the history is rewritten and stays
 * dead for the life of the major. Sweeping it anyway would not catch a defect: it would assert
 * something no action can satisfy, and a guard whose red has no green is a permanent red rather than
 * a guard.
 *
 * So what is swept is named for what it is. A repository cannot answer for what it no longer has the
 * right to modify, and saying so is more honest than claiming a sweep over a whole one part of which
 * is out of reach. **The set is derived from the registry and never typed**, so a sixth contract
 * publishing a sixth folder narrows this on its own.
 *
 * What it costs is on `CLAUDE.md`'s list of what this repository declares and nothing keeps, with its
 * population and what would close it: the two shared files carry three identifiers of a history that
 * no longer exists, they are served with the contract, and nothing stops the next frozen file
 * carrying a fourth. ADR-0124.
 */
export const theEditableSources = (): readonly string[] => {
  const frozen = new Set(frozenByAPublishedContract())

  return trackedSources().filter((path) => !frozen.has(path))
}

// ---------------------------------------------------------------------------
// A citation
// ---------------------------------------------------------------------------

/**
 * Seven lowercase hexadecimal digits closed by a backtick, with the revision suffix a citation of a
 * parent carries inside the same quoting.
 */
const A_CITATION = /`([0-9a-f]{7})(?:\^|~\d+)?`/g

/** The declaration `published.ts` carries, named as itself because that is what a reader greps for. */
export const THE_COMMIT_DECLARATION = 'THE_COMMITS_QUOTED'

/** One identifier and where it is written, distinct: a file citing one commit five times says it once. */
export type Citation = {
  readonly identifier: string
  /** A tracked file, or the declaration that carries an identifier as data rather than as prose. */
  readonly by: string
}

const distinct = (citations: readonly Citation[]): readonly Citation[] => [
  ...new Map(citations.map((citation) => [`${citation.by} ${citation.identifier}`, citation])).values(),
]

/** Every commit this repository names, in its prose and in the one place it declares them as data. */
export const citationsMade = (): readonly Citation[] =>
  distinct([
    ...theEditableSources().flatMap((path) =>
      [...readFileSync(join(THE_REPOSITORY, path), 'utf8').matchAll(A_CITATION)].map((found) => ({
        identifier: found[1] as string,
        by: path,
      })),
    ),
    ...THE_COMMITS_QUOTED.map((identifier) => ({ identifier, by: THE_COMMIT_DECLARATION })),
  ])

/**
 * A citation naming no commit of this repository, or naming more than one.
 *
 * Both readings are arguments so that each refusal can be seen firing, which is `readAnchors`' shape
 * and is here for a reason of the same kind: **an abbreviation answered by two commits cannot be
 * produced on this repository's population.** Seven hexadecimal digits over three hundred and
 * ninety-four commits collide about once in fourteen thousand, so the branch would ship asserted and
 * never demonstrated - and it is the branch that matters as the graph grows.
 */
export const deadCitationFaults = (
  citations: readonly Citation[] = citationsMade(),
  history: readonly string[] = theHistory(),
): readonly string[] =>
  citations.flatMap((citation) => {
    const answering = history.filter((commit) => commit.startsWith(citation.identifier)).length
    if (answering === 1) return []

    return [
      answering === 0
        ? `${citation.by} cites ${citation.identifier}, and no commit of this repository answers to it`
        : `${citation.by} cites ${citation.identifier}, which ${answering} commits answer to`,
    ]
  })

// ---------------------------------------------------------------------------
// An address
// ---------------------------------------------------------------------------

/**
 * The addresses no commit of this repository may carry, each as the digest of its lowercased self.
 *
 * One entry, and what it digests is a statement rather than a measurement: nothing in this repository
 * still carries the address this refuses, so nothing here can confirm which address it is. The
 * declaration is the author's, the mechanism is below, and `the-declaration-refuses-something` is what
 * keeps this list from silently becoming empty.
 */
export const THE_REFUSED_ADDRESSES: readonly string[] = [
  '6f3fff748cf7cf5afb4b35547f4760bfd939ded8d9bc8e6176658277a24b508c',
]

/** An address as it is written in a header or a trailer, delimited by what never occurs inside one. */
const AN_ADDRESS = /[^\s<>,;()[\]]+@[^\s<>,;()[\]]+/g

/**
 * What prose puts round an address and no address carries.
 *
 * The two headers are exact - git hands the address on its own - so this is entirely about the message
 * beside them, where somebody writes an address into a sentence. Measured over the bodies of this
 * graph, the spelling that occurs is `*hello@toopo.dev*`, emphasised: **both ends, which is why this
 * strips both.** A first version took the trailing mark only, and the address went on digesting to
 * something no declaration could equal - found by the guard below rather than by reading this.
 *
 * The bracketing forms need no entry: `AN_ADDRESS` already stops on them, so they never reach here.
 */
const A_SURROUNDING_MARK = /^[*_"'`]+|[.,;:!?*_"'`]+$/g

const addressesIn = (text: string): readonly string[] =>
  (text.match(AN_ADDRESS) ?? []).map((found) => found.replace(A_SURROUNDING_MARK, ''))

export const digestOf = (address: string): string =>
  createHash('sha256').update(address.trim().toLowerCase()).digest('hex')

/** One object of the graph that can hold an address, and how a reader is sent back to it. */
export type AddressSite = {
  readonly at: string
  readonly text: string
}

/**
 * Every commit of the graph, as the text of everything about it that a person wrote.
 *
 * The author and committer headers are the two the entry named. The message is swept beside them
 * because a `Co-Authored-By` trailer is an address in a commit by any reading, and reaching it costs
 * one more field in the same format string.
 *
 * Records are separated by a NUL, which is the one byte a commit message cannot contain.
 */
const everyCommit = (): readonly AddressSite[] =>
  git('log', '--all', '-z', '--format=%H%n%ae%n%ce%n%B')
    .split('\0')
    .map((record) => record.replace(/^\n+/, ''))
    .filter((record) => record !== '')
    .map((record) => {
      const lines = record.split('\n')

      return { at: `commit ${(lines[0] as string).slice(0, 7)}`, text: lines.slice(1).join('\n') }
    })

/**
 * Every annotated tag, whose tagger and message no walk over commits reaches.
 *
 * A lightweight tag is left alone deliberately: it is a name for a commit and holds no header of its
 * own, and the commit it names is already in the sweep above.
 */
const everyAnnotatedTag = (): readonly AddressSite[] =>
  answered(git('for-each-ref', '--format=%(objecttype) %(refname)', 'refs/tags'))
    .filter((line) => line.startsWith('tag '))
    .map((line) => line.slice('tag '.length))
    .map((reference) => ({ at: reference, text: git('cat-file', '-p', reference) }))

/** Everything git holds that a person wrote an address into. */
export const addressSites = (): readonly AddressSite[] => [...everyCommit(), ...everyAnnotatedTag()]

/**
 * An object of the graph carrying an address this repository refuses to publish.
 *
 * Both readings are arguments for the reason `deadCitationFaults` gives, and here the reason is
 * sharper: **the declaration cannot be exercised with the address it declares, because writing that
 * address into a test is the thing the declaration exists to prevent.** So the guard that establishes
 * this fires at all hands it a site and a refusal of its own, and what it proves - that an address is
 * found in free text, digested, and matched - is every step this one takes.
 */
export const refusedAddressFaults = (
  sites: readonly AddressSite[] = addressSites(),
  refused: readonly string[] = THE_REFUSED_ADDRESSES,
): readonly string[] => {
  const declared = new Set(refused)

  // Distinct after digesting rather than before: two spellings of one address are one fault, and
  // `digestOf` is what decides that they are one address.
  return sites.flatMap((site) =>
    [...new Set(addressesIn(site.text).map(digestOf))]
      .filter((digest) => declared.has(digest))
      .map((digest) => `${site.at} carries the address declared at ${digest}`),
  )
}

// ---------------------------------------------------------------------------
// A worktree
// ---------------------------------------------------------------------------

/**
 * A checkout registered against this repository other than its root.
 *
 * `run.ts` refuses to start a replay on the same reading. Here it is reported at the cadence of the
 * suite instead, so the answer arrives before a commit rather than at the next thing to read git.
 */
export const strayWorktreeFaults = (): readonly string[] =>
  strayWorktrees().map(
    (path) =>
      `${path} is registered as a worktree of this repository. Only its root may be, because a ` +
      `registration outliving its run leaves the tree clean and walks past every check that reads it`,
  )
