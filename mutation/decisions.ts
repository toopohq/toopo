/**
 * Every reference a decision record and the code make to each other, read as data rather than as prose.
 *
 * ADR-0001.
 *
 * ---------------------------------------------------------------------------
 * What this closes, and the measurement that is the whole argument for it
 * ---------------------------------------------------------------------------
 *
 * `governs` and `confirmed-by` were introduced as *resolvable* back-links - that is the word ADR-0001's
 * own table uses, against a `Confirmation` section written in prose, which resolves nothing. Nothing
 * resolved them either. Measured on the sixteen records as they stood, in a first batch written and
 * reviewed in one sitting: **7 of the 25 files a decision governs never cite it back, and one entry is
 * a directory - 28 per cent of a link family broken in reviewed work.** That figure is the reason this
 * module exists, and it is what a reader should weigh against the eight guards it costs.
 *
 * Two of those breaks are worse than a dead path, because each is a declaration contradicting its
 * neighbour rather than merely pointing nowhere:
 *
 * - ADR-0010 carries `confirmed-by: []` and names its own guard's *file* under `governs`, while its
 *   `Confirmation` section says in prose that a guard keeps it. Two statements of one fact, and the
 *   resolvable one is the empty one.
 * - ADR-0008 names `a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands`, which is the
 *   title of no `it(...)` anywhere: it is an `it.each` whose written title ends `-%s`. Somebody
 *   grepping the name this record gave them finds nothing.
 *
 * ---------------------------------------------------------------------------
 * Four families, and both directions of each
 * ---------------------------------------------------------------------------
 *
 * A reference guarded in one direction is the defect moved rather than closed: a record naming a file
 * that has gone must redden, and a module citing a record that does not exist must redden too. So:
 *
 *     governs        -> the path resolves to a file, and that file cites the decision back
 *     confirmed-by   -> the pair names a guard the suite of that battery collects
 *     ADR-NNNN       -> the record it names exists
 *     an anchor      -> the text a battery quotes still occurs, once, in the file it names
 *
 * The fourth is `anchors.ts` promoted, and it is the family with the price already paid: C-19 and A-14
 * were each found by a replay, thirty-five minutes at a time, and each would have reddened here in
 * seconds.
 *
 * **The direction that looks like a fifth is refused, and it is refused on a measurement.** *Every file
 * citing a decision is governed by it* reads as the symmetric rule and is false: measured over the
 * thirty-three (file, decision) pairs this repository holds, **ten are a file pointing at a decision
 * that rules its neighbour** - `every-contract.ts` naming the record that carries the register it
 * obeys, `signature.ts` naming the one that says what the schema does not interpret, and this module
 * naming three records as examples of what its own guards found. Requiring the reverse would make a
 * scope declaration grow with every reference to it, which is the trap `identity.searchAliases` is
 * already argued against: *a phrase relates to a thing whenever anybody can explain the connection.*
 * So a citation is asked to name a record that exists, and never to be governed by it.
 *
 * A fifth family arrived with the reading. A record links another as `[ADR-0007](0007-....md)`, which
 * carries the address *and* a path, and nothing made the two agree - so a rename or a copied line
 * gives `[ADR-0007](0009-....md)`, which resolves perfectly while pointing at a decision it does not
 * name. Existence alone would let through the one error that misleads a reader, so both halves are
 * asked.
 *
 * ---------------------------------------------------------------------------
 * What is reused, and the one thing that is deliberately not
 * ---------------------------------------------------------------------------
 *
 * The address is reused whole: `GuardAddress`, `guardAddressFaults` and `renderGuard` from
 * `packages/registry/address.ts`, and `guardIdOf` from `packages/catalogue/identifier.ts`. There is no
 * second statement here of what a guard address is or of how a title is read.
 *
 * **`resolveGuard` is not called, and the reason is a measurement rather than a preference.** It
 * resolves against `BatteryRecord.guards`, whose documented meaning is every identifier a battery
 * *names* - pinned by a cell, declared out of reach, or declared unprobed. Run against the thirteen
 * pairs the records carry: **six do not resolve**, among them
 * `the-absorbed-state-is-constructible` and `a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence`,
 * which are real guards their suites collect and which no mutant happens to pin. Reusing the resolver
 * would have refused six true citations.
 *
 * That is not a fault in `resolveGuard`; it is the line `CLAUDE.md` already draws - *the pre-flight
 * resolves what a battery names; a suite guard resolves what a module declares*. Two questions about
 * two sets of data, which is resemblance and not duplication. Anybody about to fold the two together
 * should read this paragraph first.
 *
 * ---------------------------------------------------------------------------
 * Two limits, declared because each fails silently if it is not
 * ---------------------------------------------------------------------------
 *
 * **A title this reads is a literal.** Measured over the seventy-nine test files: sixty-three write
 * every title as a single-quoted literal and this reading agrees with their call sites exactly; the
 * sixteen that do not are all in `contracts/`, where a title is built in a loop over the case table or
 * the profile list. So a decision cannot cite a contract's own guard, and one that tried would be
 * refused rather than accepted - the closed direction. What would carry such a citation is a battery
 * pin, which `calibrate()` already resolves against the guards a run really collected.
 *
 * **An `it.each` is addressed by the identifier without its interpolation.** Thirty-eight titles are
 * templated, and all but one interpolate at the end, so the address is the title with a trailing `-%s`
 * removed. The exception is `the-call-of-%s-is-read-from-its-own-signature`, which interpolates in the
 * middle and is therefore not addressable by any decision; no record names it.
 *
 * **A citation is a run of digits after `ADR-`, and nothing here judges the sentence around it.** That
 * is deliberate - the alternative is a lint distinguishing a citation from a mention, which is a
 * judgement about prose and is the price at which this repository has already refused two rules. The
 * cost was paid immediately and by this file: an invented number written here as an *example* of a dead
 * citation reddened `every-decision-a-file-cites-exists`, correctly, and the sentence is written
 * without one. So no document of this repository can exhibit a broken citation, only describe one.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { guardIdOf } from '../packages/catalogue/identifier.ts'
import type { GuardAddress } from '../packages/registry/address.ts'
import { guardAddressFaults, renderGuard } from '../packages/registry/address.ts'
import { THE_REPOSITORY, trackedFiles } from './paths.ts'
import { THE_BATTERIES } from './published.ts'

/** Where the records live, which is MADR's own convention and ADR-0001 follows it rather than one of ours. */
export const THE_DECISIONS_FOLDER = 'docs/decisions'

/** The section ADR-0001 requires beyond MADR's own, because a decision with no trigger is frozen by accident. */
export const THE_REOPENING_SECTION = '## What would reopen this'

// ---------------------------------------------------------------------------
// Reading a record
// ---------------------------------------------------------------------------

/** A link from one record to another, which carries an address and a path that need not agree. */
export type RecordLink = {
  /** The number inside the label, or `null` where the label is prose rather than an address. */
  readonly cited: string | null
  /** The file the link points at, as written. */
  readonly target: string
}

/**
 * One decision record, reduced to the references it makes.
 *
 * `governs` and `confirmedBy` are `null` for a field that is absent or malformed, never an empty
 * array standing in for one. A field nobody wrote and a field declaring nothing are different
 * mistakes, and collapsing them would make every guard below quietly pass on a record whose front
 * matter somebody deleted - `declarationFaults` is what keeps the other seven from being vacuous.
 */
export type Decision = {
  /** The address, which is the number and never the slug. */
  readonly id: string
  readonly file: string
  readonly governs: readonly string[] | null
  readonly confirmedBy: readonly GuardAddress[] | null
  readonly links: readonly RecordLink[]
  readonly reopens: boolean
}

type Block = {
  /** Whatever follows the key on its own line: `[]` for an empty sequence, and empty for a block. */
  readonly inline: string
  readonly entries: readonly string[]
}

/** The lines belonging to one top-level key of the front matter, or `null` where it has none. */
const blockOf = (frontMatter: string, key: string): Block | null => {
  const lines = frontMatter.split('\n')
  const at = lines.findIndex((line) => line.startsWith(`${key}:`))
  if (at === -1) return null

  const after = lines.slice(at + 1)
  const ends = after.findIndex((line) => line !== '' && !line.startsWith(' '))

  return {
    inline: (lines[at] as string).slice(key.length + 1).trim(),
    entries: (ends === -1 ? after : after.slice(0, ends)).filter((line) => line.trim() !== ''),
  }
}

const governsOf = (block: Block | null): readonly string[] | null => {
  if (block === null) return null
  if (block.inline === '[]') return []
  if (block.inline !== '') return null

  const paths = block.entries.map((line) => /^ {2}- (\S.*)$/.exec(line)?.[1])

  return paths.every((path) => path !== undefined) ? (paths as readonly string[]) : null
}

/**
 * The pairs, read two lines at a time.
 *
 * A guard is named by the pair and never by the identifier alone, so a `- guard:` with no battery
 * above it is not a lenient case to recover from - it is the unpaired form `address.ts` refuses to
 * publish a type for, arriving as text.
 */
const confirmedByOf = (block: Block | null): readonly GuardAddress[] | null => {
  if (block === null) return null
  if (block.inline === '[]') return []
  if (block.inline !== '' || block.entries.length % 2 !== 0) return null

  const pairs = block.entries.flatMap((line, at) => {
    if (at % 2 === 1) return []

    const battery = /^ {2}- battery: (\S.*)$/.exec(line)?.[1]
    const guard = /^ {4}guard: (\S.*)$/.exec(block.entries[at + 1] as string)?.[1]

    return battery === undefined || guard === undefined ? [] : [{ battery, guard }]
  })

  return pairs.length === block.entries.length / 2 ? pairs : null
}

const A_RECORD_FILE = /^(\d{4})-[a-z0-9-]+\.md$/
const A_LINK_TO_A_RECORD = /\[([^\]]+)\]\((\d{4}-[a-z0-9-]+\.md)\)/g
const AN_ADDRESS = /^ADR-(\d{4})$/

const linksOf = (text: string): readonly RecordLink[] =>
  [...text.matchAll(A_LINK_TO_A_RECORD)].map((link) => ({
    cited: AN_ADDRESS.exec(link[1] as string)?.[1] ?? null,
    target: link[2] as string,
  }))

/** Every record, in the order the folder gives them, which is the order of their addresses. */
export const readDecisions = (): readonly Decision[] =>
  readdirSync(join(THE_REPOSITORY, THE_DECISIONS_FOLDER))
    .filter((file) => A_RECORD_FILE.test(file))
    .sort()
    .map((file) => {
      const text = readFileSync(join(THE_REPOSITORY, THE_DECISIONS_FOLDER, file), 'utf8')
      const closes = text.indexOf('\n---', 4)
      const frontMatter = text.startsWith('---\n') && closes !== -1 ? text.slice(4, closes) : ''

      return {
        id: (A_RECORD_FILE.exec(file) as RegExpExecArray)[1] as string,
        file,
        governs: governsOf(blockOf(frontMatter, 'governs')),
        confirmedBy: confirmedByOf(blockOf(frontMatter, 'confirmed-by')),
        links: linksOf(text.slice(closes === -1 ? 0 : closes)),
        reopens: text.includes(`\n${THE_REOPENING_SECTION}\n`),
      }
    })

// ---------------------------------------------------------------------------
// The universe a guard address resolves against
// ---------------------------------------------------------------------------

/**
 * The suites of this repository, each as the folder whose test files it collects.
 *
 * **The first coordinate of a guard address names a suite, and nineteen of the twenty names are
 * batteries.** The twentieth is `meta`, and it is not a widening of the vocabulary but the correction
 * of one that was short: `readme.test.ts` and `contributing.test.ts` have been guards for as long as
 * this folder has existed, no battery injects here, and a coordinate with nineteen values therefore
 * made two existing guards unaddressable.
 *
 * **What it costs is a difference in strength, and it is written here so that nobody reads the twenty
 * as equals.** A guard addressed under a battery has its detection power measured - mutants say what
 * it catches, and a cell that stops catching is a red. A guard addressed under `meta` has nothing that
 * measures what it is worth, because no battery injects into `mutation/` - which is
 * `packages/registry/verifiability.ts`'s line, that the instrument measures the catalogue and is not
 * part of it. A decision confirmed by `meta` is confirmed by a guard that runs; a decision confirmed
 * by a battery is confirmed by a guard that has been shown to catch something.
 *
 * A folder is read without descending into it, and that is measured rather than assumed: of the twenty
 * suites, `mutation` is the only one holding a folder with test files under it, and that folder is
 * `mutation/fixture`, which is a suite of its own with its own configuration. Every other suite's
 * files are flat.
 */
export const THE_SUITES: Readonly<Record<string, string>> = {
  ...Object.fromEntries(THE_BATTERIES.map((battery) => [battery.name, battery.contractPath])),
  meta: 'mutation',
}

/**
 * A title as it is written, with the interpolation an `it.each` puts at the end taken off.
 *
 * `guardIdOf` reads the address half of the title; this reads the address half of a *family* of
 * titles, which is the shape five contracts' worth of `it.each(eachContract)` gives a guard that asks
 * one question of every contract.
 */
const addressOf = (title: string): string => guardIdOf(title).replace(/-%s$/, '')

/** `it('x'` and `it.each(...)('x'`, whose argument list may itself hold brackets and arrows. */
const A_GUARD_TITLE = /\bit(?:\.each\([\s\S]*?\)\s*)?\(\s*'([^']+)'/g

const A_TEST_FILE = /\.test(-d)?\.ts$/

/** Every guard identifier the suite of one folder carries, read off its sources. */
export const guardsCollectedIn = (folder: string): ReadonlySet<string> => {
  const at = join(THE_REPOSITORY, folder)
  if (!existsSync(at)) return new Set()

  return new Set(
    readdirSync(at)
      .filter((file) => A_TEST_FILE.test(file))
      .flatMap((file) => [...readFileSync(join(at, file), 'utf8').matchAll(A_GUARD_TITLE)])
      .map((title) => addressOf(title[1] as string)),
  )
}

// ---------------------------------------------------------------------------
// What each reference is asked
// ---------------------------------------------------------------------------

const of = (decision: Decision, fault: string): string => `ADR-${decision.id}: ${fault}`

/**
 * Whether a repository-relative path is a file we can read.
 *
 * A directory answers `existsSync` and then throws `EISDIR` on being read, so the two questions are
 * asked as one here: `pathFaults` owns the refusal, and every guard after it reads only what this
 * admits rather than each one rediscovering the distinction.
 */
const isFile = (path: string): boolean => {
  const at = join(THE_REPOSITORY, path)

  return existsSync(at) && statSync(at).isFile()
}

/**
 * A record whose front matter does not declare both fields, well formed.
 *
 * `governs` is required **and non-empty**: after this repository's own sweep no decision governs
 * nothing, so a member for declaring that absence would be a shape with no instance. The day one
 * exists, what it takes is an absence declared with its reason - never a field left out, which reads
 * exactly like a field forgotten.
 */
export const declarationFaults = (decisions: readonly Decision[]): readonly string[] =>
  decisions.flatMap((decision) => [
    ...(decision.governs === null ? [of(decision, 'governs is absent or malformed')] : []),
    ...(decision.governs?.length === 0 ? [of(decision, 'governs declares nothing')] : []),
    ...(decision.confirmedBy === null ? [of(decision, 'confirmed-by is absent or malformed')] : []),
  ])

/**
 * A record naming a guard's file where it should name the guard.
 *
 * A test file under `governs` states, in a form nothing can resolve, what `confirmed-by` states as a
 * pair. Two statements of one fact drift, and this one already had: ADR-0010 named
 * `against-the-five.test.ts` there while declaring that no guard confirmed it.
 */
export const guardFileFaults = (decisions: readonly Decision[]): readonly string[] =>
  decisions.flatMap((decision) =>
    (decision.governs ?? [])
      .filter((path) => A_TEST_FILE.test(path))
      .map((path) =>
        of(decision, `governs ${path}, which holds guards - a guard is named under confirmed-by`),
      ),
  )

/**
 * A path that does not resolve to a file.
 *
 * A file rather than any entry, because the field is the code a decision rules and a reader follows it
 * to a line. A directory was the one entry that was not one, and it was ADR-0001 naming the folder of
 * the records themselves - which made it govern itself.
 */
export const pathFaults = (decisions: readonly Decision[]): readonly string[] =>
  decisions.flatMap((decision) =>
    (decision.governs ?? [])
      .filter((path) => !isFile(path))
      .map((path) => of(decision, `governs ${path}, and no file is there`)),
  )

/**
 * A file a decision rules that never names it.
 *
 * This is the direction ADR-0001's own `Confirmation` named and nothing kept, and it is the half that
 * matters to somebody who arrives at the code rather than at the record: a decision they cannot learn
 * about from the file it governs is one they will break without knowing it existed.
 */
export const backCitationFaults = (decisions: readonly Decision[]): readonly string[] =>
  decisions.flatMap((decision) =>
    (decision.governs ?? [])
      .filter(isFile)
      .filter((path) => !readFileSync(join(THE_REPOSITORY, path), 'utf8').includes(`ADR-${decision.id}`))
      .map((path) => of(decision, `governs ${path}, and nothing in it cites ADR-${decision.id}`)),
  )

/** A pair that is not the address of a guard the suite of that battery collects. */
export const confirmationFaults = (decisions: readonly Decision[]): readonly string[] =>
  decisions.flatMap((decision) =>
    (decision.confirmedBy ?? []).flatMap((address) => {
      const malformed = guardAddressFaults(address)
      if (malformed.length > 0) return [of(decision, `${renderGuard(address)}: ${malformed.join('; ')}`)]

      const folder = THE_SUITES[address.battery]
      if (folder === undefined) {
        return [of(decision, `${renderGuard(address)}: no suite of this repository answers to that name`)]
      }

      return guardsCollectedIn(folder).has(address.guard)
        ? []
        : [of(decision, `${renderGuard(address)}: ${folder} collects no guard under that identifier`)]
    }),
  )

/** An `ADR-NNNN` written anywhere in this repository that names no record. */
export const citationFaults = (decisions: readonly Decision[]): readonly string[] => {
  const held = new Set(decisions.map((decision) => decision.id))

  return trackedFiles()
    .filter((path) => path.endsWith('.ts') || path.endsWith('.md'))
    .flatMap((path) => {
      const cited = [...readFileSync(join(THE_REPOSITORY, path), 'utf8').matchAll(/ADR-(\d{4})/g)]

      return [...new Set(cited.map((match) => match[1] as string))]
        .filter((id) => !held.has(id))
        .map((id) => `${path} cites ADR-${id}, and no such decision exists`)
    })
}

/**
 * A link between two records that does not resolve, or that names one record and points at another.
 *
 * The second half is what the first cannot see. A Markdown link carries the address in its label and
 * the file in its target, so a rename or a copied line leaves `[ADR-0007](0009-....md)` - which
 * resolves perfectly, and sends a reader to a decision the sentence around it is not about.
 */
export const linkFaults = (decisions: readonly Decision[]): readonly string[] =>
  decisions.flatMap((decision) =>
    decision.links.flatMap((link) => {
      if (!existsSync(join(THE_REPOSITORY, THE_DECISIONS_FOLDER, link.target))) {
        return [of(decision, `links ${link.target}, and no such record exists`)]
      }

      const points = (A_RECORD_FILE.exec(link.target) as RegExpExecArray)[1] as string

      return link.cited === null || link.cited === points
        ? []
        : [of(decision, `links ADR-${link.cited} and points at ADR-${points}`)]
    }),
  )

/** A record with no trigger, which is a decision frozen by accident rather than on purpose. */
export const reopeningFaults = (decisions: readonly Decision[]): readonly string[] =>
  decisions
    .filter((decision) => !decision.reopens)
    .map((decision) => of(decision, `carries no ${THE_REOPENING_SECTION} section`))
