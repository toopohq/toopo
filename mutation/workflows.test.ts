import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { THE_REPOSITORY } from './paths.ts'

/**
 * What the continuous integration is allowed to run, resolved against what it says it runs.
 *
 * ---------------------------------------------------------------------------
 * Why a tag is not an address
 * ---------------------------------------------------------------------------
 *
 * `uses: actions/checkout@v7` names a *tag*, and a tag is a pointer somebody else can move. Whoever
 * owns that repository can repoint it at any commit, after which this repository runs code it has
 * never seen, on a runner holding whatever secrets the job was given. It is the same defect this
 * catalogue refuses one floor down and sells the refusal of: **a name resolves to whatever the other
 * side currently says it resolves to, and only a digest is an address.** A lockfile pins every npm
 * dependency here by integrity hash; the workflow pinned nothing.
 *
 * It was a risk with no consequence while nothing on this runner was worth stealing. ADR-0097 put a
 * Cloudflare API token into this repository's secrets, and the risk acquired one - so the guard and the
 * thing it guards arrive in the same change, which is the rule `CLAUDE.md` states about a declaration
 * and the mechanism that keeps it.
 *
 * ---------------------------------------------------------------------------
 * The second guard, and why a bare digest is not enough
 * ---------------------------------------------------------------------------
 *
 * Forty hexadecimal digits tell a reader nothing about what they are looking at, and a workflow nobody
 * can read is a workflow nobody updates. So a pinned reference carries the version it was pinned at, as
 * a trailing comment, and that comment is a *rendering* rather than a second address: it is checked for
 * being present and never for agreeing with the digest, because agreement is a question only the other
 * repository can answer and a guard pretending otherwise would be reading a comment as though it were
 * data.
 *
 * ---------------------------------------------------------------------------
 * The five about publishing, and why the first of them is the one that matters
 * ---------------------------------------------------------------------------
 *
 * ADR-0109 put `npm publish` on a runner, and ADR-0111 took the person out of the trigger. Four things
 * about that job are what stop a publication being made from a red tree, from a branch, with a stolen
 * secret, or over a version that is already out there - and all four are declared in a file, which is
 * the shape this repository has learned to distrust: `CLAUDE.md` asserted *no runner holds an npm
 * credential* in prose for as long as it was true, and prose is what goes on saying it afterwards.
 *
 * **The first guard is the one that keeps the other three from being vacuous**, and it is written first
 * for that reason rather than for tidiness. `only-the-job-that-publishes…` and
 * `the-job-that-publishes…` both sweep a population derived from *finding* a publishing job; delete the
 * job and the population is empty, every fault list is empty, and three guards go green on a repository
 * that publishes nothing. So the count is pinned separately, which is the same argument
 * `the-archive-reaches-the-network-from-exactly-one-module` makes one folder over, and the same reason a
 * second job publishing quietly is a red here.
 *
 * **Comments are dropped before any of them reads a line, and that is load-bearing.** This file is
 * mostly prose about gates, so a sweep that counted a paragraph would find `npm publish` in the sentence
 * saying it is not passed a flag, and a job whose only `if` was in a comment would pass. What is read is
 * what the host reads.
 *
 * **What none of them reaches is npm's own configuration**, which is where the branch is not written and
 * where the workflow filename and the environment are pinned. `CLAUDE.md` carries that as an entry in
 * what this repository declares and nothing keeps, with what closing it would cost.
 */

const WORKFLOWS = join(THE_REPOSITORY, '.github', 'workflows')

/** A commit as git renders one, which is the only form of `uses:` that names one thing for ever. */
const A_DIGEST = /^[0-9a-f]{40}$/

/** What a reader needs beside the digest: the version it was taken from, as a comment. */
const A_VERSION_COMMENT = /#\s*\S+/

/**
 * One workflow, read whole.
 *
 * The population is the folder rather than a list, for the reason the first guard's comment gives, and it
 * is read here rather than in each guard because every guard below sweeps the same lines.
 */
type Workflow = {
  readonly file: string
  readonly lines: readonly string[]
}

const workflows = (): readonly Workflow[] =>
  readdirSync(WORKFLOWS)
    .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
    .map((file) => ({ file, lines: readFileSync(join(WORKFLOWS, file), 'utf8').split('\n') }))

/**
 * A line the host does not read, and neither does anything here.
 *
 * This file is mostly prose about what the jobs may do, so every sweep below would otherwise find its
 * subject in a sentence describing it. A comment naming `npm publish` is not a publication.
 */
const isAComment = (line: string): boolean => line.trimStart().startsWith('#')

type Reference = {
  readonly file: string
  readonly line: number
  /** The whole value, as written. */
  readonly uses: string
  /** Everything after it on the line, which is where the version comment lives. */
  readonly trailing: string
}

const references = (): readonly Reference[] =>
  workflows().flatMap(({ file, lines }) =>
    lines.flatMap((text, index) => {
      const found = /^\s*(?:-\s*)?uses:\s*(\S+)(.*)$/.exec(text)

      return found === null
        ? []
        : [{ file, line: index + 1, uses: found[1] ?? '', trailing: found[2] ?? '' }]
    }),
  )

/**
 * A job, as the two coordinates that let a sweep over a whole file say what a line belongs to.
 *
 * **The structure read from the format is the smallest one that answers the question**, and it is read by
 * indentation rather than by a parser because this repository has no YAML parser and will not gain a
 * dependency to hold four guards. A job identifier is what GitHub allows one to be - letters, digits,
 * `-` and `_` - which is stricter than *anything before a colon* and is what keeps a two-space comment
 * ending in a colon from being collected as a job.
 */
type Job = {
  readonly file: string
  readonly name: string
  /** The whole file, so a fault can be addressed by line and a sweep can ask what contains it. */
  readonly lines: readonly string[]
  /** Index of the first line under the job's header. */
  readonly from: number
  /** Index one past the job's last line. */
  readonly to: number
}

const A_JOB_HEADER = /^ {2}([A-Za-z0-9_-]+):\s*$/

/** A key of the document rather than of a job, which is where the jobs stop. */
const opensAtTheLeftMargin = (line: string): boolean => /^\S/.test(line) && !isAComment(line)

const jobs = (): readonly Job[] =>
  workflows().flatMap(({ file, lines }) => {
    const opens = lines.findIndex((line) => /^jobs:\s*$/.test(line))

    if (opens < 0) return []

    const under = opens + 1
    const closes = lines.slice(under).findIndex(opensAtTheLeftMargin)
    const end = closes < 0 ? lines.length : under + closes

    const headers = lines.slice(under, end).flatMap((line, index) => {
      const found = A_JOB_HEADER.exec(line)

      return found === null ? [] : [{ name: found[1] ?? '', at: under + index }]
    })

    return headers.map((header, position) => ({
      file,
      name: header.name,
      lines,
      from: header.at + 1,
      to: headers[position + 1]?.at ?? end,
    }))
  })

/**
 * What a job declares, with the comments dropped and every run of whitespace collapsed.
 *
 * The collapse is the discipline `CLAUDE.md` states about reading text: a check that depends on where a
 * line wraps depends on something nobody can see. The publishing job's condition is one expression over
 * three lines, and re-flowing it must not be an event.
 */
const declarationOf = (job: Job): string =>
  job.lines
    .slice(job.from, job.to)
    .filter((line) => !isAComment(line))
    .join(' ')
    .replace(/\s+/g, ' ')

/** The command, as it has to be written to run. */
const A_PUBLICATION = /\bnpm\s+publish\b/

/**
 * A credential for npm, in the three spellings one has to take to work.
 *
 * A secret whose name mentions npm, the variable npm's own setup writes into a configuration, and the
 * configuration key itself - which is what a `run:` line would set directly. A Cloudflare token does not
 * match, and it is deliberately not covered: ADR-0098 put that one here and the deployment needs it.
 */
const A_CREDENTIAL_FOR_NPM = /secrets\.\w*NPM\w*|NODE_AUTH_TOKEN|_authToken/i

const jobsThatPublish = (): readonly Job[] =>
  jobs().filter((job) => A_PUBLICATION.test(declarationOf(job)))

/** The command a battery is started by, which is the one the header of `suites.yml` argues for. */
const A_REPLAY = /\bnpm run battery\b/

const jobsThatReplayABattery = (): readonly Job[] =>
  jobs().filter((job) => A_REPLAY.test(declarationOf(job)))

/**
 * The jobs a job waits for, in both spellings the format allows for one key.
 *
 * A single dependency is written bare and several are written as a list, so a sweep that knew only one
 * of the two would read a job that gained a second `needs` as a job that had lost its first.
 */
const jobsWaitedForBy = (job: Job): readonly string[] => {
  const found = /\bneeds:\s*(\[[^\]]*\]|[A-Za-z0-9_-]+)/.exec(declarationOf(job))
  const written = found?.[1] ?? ''

  return (written.startsWith('[') ? written.slice(1, -1).split(',') : [written])
    .map((name) => name.trim())
    .filter((name) => name !== '')
}

const containing = (file: string, index: number): Job | undefined =>
  jobsThatPublish().find((job) => job.file === file && index >= job.from && index < job.to)

describe('what the continuous integration is allowed to run', () => {
  /**
   * The population is read off the folder rather than listed, so a workflow added is swept by the fact
   * of existing. A list here would be the second statement this repository refuses everywhere, and the
   * file it forgot would be the one running unpinned code beside a token.
   */
  it('there-is-a-workflow-to-sweep-and-it-uses-something', () => {
    expect(references().length).toBeGreaterThan(0)
  })

  it('every-action-a-workflow-uses-is-pinned-to-a-digest', () => {
    const loose = references()
      .filter((reference) => !A_DIGEST.test(reference.uses.split('@')[1] ?? ''))
      .map((reference) => `${reference.file}:${reference.line} uses ${reference.uses}`)

    expect(loose).toEqual([])
  })

  /**
   * A digest with no version beside it is unreadable, and an unreadable pin is one nobody raises. The
   * comment is required to be there and is never compared against the digest: only the other repository
   * can say whether they agree, and a guard that checked it would be reporting a comment as data.
   */
  it('every-pinned-action-says-which-version-it-was-pinned-at', () => {
    const silent = references()
      .filter((reference) => !A_VERSION_COMMENT.test(reference.trailing))
      .map((reference) => `${reference.file}:${reference.line} pins ${reference.uses} and says nothing`)

    expect(silent).toEqual([])
  })

  /**
   * The address is pinned rather than counted, which is what the two guards after this one need from it:
   * both sweep a population found by looking for a publishing job, so both are green on a repository that
   * has stopped publishing. A second job publishing is the other half, and it is the more likely one -
   * a publication copied into a workflow of its own would hold none of the gates argued for here.
   */
  it('exactly-one-job-of-this-repository-publishes-to-npm', () => {
    expect(jobsThatPublish().map((job) => `${job.file}:${job.name}`)).toEqual(['suites.yml:publish'])
  })

  /**
   * The three coordinates of one gate, each reported separately so a repair knows which was removed.
   *
   * `needs` reaches every suite and the deployment through the job it names, so a red tree cannot publish.
   * The branch keeps a publication on `main`. The environment is the half GitHub enforces and npm pins,
   * and it is the only one of the three that survives this file being rewritten on a branch - which is
   * exactly why the other two are checked here, where a rewrite is a red before it is merged.
   */
  it('the-job-that-publishes-to-npm-is-gated-by-the-suites-the-branch-and-the-environment', () => {
    const ungated = jobsThatPublish().flatMap((job) => {
      const declared = declarationOf(job)

      return [
        { held: /\bneeds:/.test(declared), fault: 'waits for no other job' },
        { held: declared.includes('refs/heads/main'), fault: 'names no branch' },
        { held: /\benvironment:/.test(declared), fault: 'runs in no environment' },
      ]
        .filter(({ held }) => !held)
        .map(({ fault }) => `${job.file}:${job.name} ${fault}`)
    })

    expect(ungated).toEqual([])
  })

  /**
   * The fourth coordinate, which is the one that replaced a person typing a word.
   *
   * A publication is asked for by the version number, and the reading that decides it is taken by
   * another job - so the gate is a reference across two jobs, and a reference has two ends. **Both are
   * checked, because either end alone is green on a repository that publishes on nothing**: an `if`
   * naming a job that does not exist is an expression GitHub evaluates to an empty string, and a `needs`
   * that no condition reads is a job whose answer is thrown away.
   *
   * What it deliberately does not read is *which* answer, or how the other job computed it. That job's
   * own guards are in `packaging/what-npm-holds.test.ts`, and a second statement of them here would be
   * this file asserting something it cannot see.
   */
  it('the-job-that-publishes-to-npm-is-gated-by-a-job-that-read-the-version', () => {
    const everyJob = new Set(jobs().map((job) => `${job.file}:${job.name}`))

    const ungated = jobsThatPublish().flatMap((job) => {
      const consulted = [
        ...declarationOf(job).matchAll(/\bneeds\.([A-Za-z0-9_-]+)\.outputs\.[A-Za-z0-9_-]+/g),
      ].map((match) => match[1] as string)

      if (consulted.length === 0) {
        return [`${job.file}:${job.name} asks no job whether the version is one to publish`]
      }

      const waitedFor = new Set(jobsWaitedForBy(job))

      return consulted.flatMap((name) => [
        ...(waitedFor.has(name)
          ? []
          : [`${job.file}:${job.name} reads ${name}'s answer without waiting for it`]),
        ...(everyJob.has(`${job.file}:${name}`)
          ? []
          : [`${job.file}:${job.name} reads ${name}, which is no job of ${job.file}`]),
      ])
    })

    expect(ungated).toEqual([])
  })

  /**
   * The fifth coordinate, and the one a published version being frozen for life is what buys.
   *
   * `CONTRIBUTING.md` names the occasion in as many words - *a full replay is worth its price on
   * exactly two occasions: before a release, and before anything is published to a registry, because
   * that is the last commit at which a wrong verdict is still correctable.* This is that sentence made
   * executable in the one direction it can be: nothing publishes without having waited for a job that
   * replays a battery.
   *
   * **The population is derived and never typed.** A job that replays is one whose declaration runs
   * `npm run battery`, so renaming the gate does not weaken this and deleting it reddens it. What it
   * deliberately does not read is *how many* batteries that job replays: a matrix comes from an
   * expression evaluated by GitHub, and a guard claiming to know its length would be reading a string
   * as though it were data. `the-entry-point-answers-for-the-whole-instrument-as-well-as-for-the-selection`
   * is where that half is kept, one folder over and against the declaration itself. ADR-0146.
   */
  it('nothing-publishes-to-npm-without-waiting-for-a-battery-to-be-replayed', () => {
    const replaying = new Set(jobsThatReplayABattery().map((job) => `${job.file}:${job.name}`))

    expect(replaying.size).toBeGreaterThan(0)

    const ungated = jobsThatPublish()
      .filter(
        (job) => !jobsWaitedForBy(job).some((name) => replaying.has(`${job.file}:${name}`)),
      )
      .map((job) => `${job.file}:${job.name} publishes without waiting for any replay`)

    expect(ungated).toEqual([])
  })

  /**
   * Every job that fires exactly when a publication fires is one the publication waits for.
   *
   * Its neighbour above asks whether a publication waits for *a* replay, and the fault it catches is a
   * publication that waits for none. This catches a gate added beside the existing one and left out of
   * that list - at which point the neighbour is still green and still true to its own name, and the new
   * gate runs *alongside* the publication instead of in front of it, which is a job that gates nothing
   * while looking exactly like one that does.
   *
   * **It is not a hypothetical.** `every-battery-on-windows` is the second such job, and it exists
   * because one cell of `cli-install` is exercised on no other runner: off Windows `C-64` is not
   * injected at all. A publication that ran beside it would go out without the only replay that can
   * answer for that pin. ADR-0169.
   *
   * **The population is *the publication's own condition* and not *runs a battery*, and that is a
   * repair rather than a choice.** Written over the jobs that replay, it reported
   * `publish publishes without waiting for batteries` - correctly, and about a job that must not be
   * waited for: the first gate is skipped when a push selects nothing, and a skipped dependency skips
   * its dependent, so `needs` on it would skip a publication whenever the push before it was quiet.
   * What separates the two is not the command they run but the reading they fire on.
   *
   * The condition is found rather than spelled: the publishing job's `if` names the job whose answer it
   * reads, and any job in the same file reading that same answer is one that fires with it. The
   * comparison is within a file because `needs` is.
   */
  it('every-job-gated-on-the-version-is-one-the-publication-waits-for', () => {
    const found = jobsThatPublish().flatMap((job) => {
      const consulted = [
        ...new Set(
          [
            ...declarationOf(job).matchAll(/\bneeds\.([A-Za-z0-9_-]+)\.outputs\.[A-Za-z0-9_-]+/g),
          ].map((match) => match[1] as string),
        ),
      ]

      const waitedFor = new Set(jobsWaitedForBy(job))

      const alongside = jobs()
        .filter((other) => other.file === job.file && other.name !== job.name)
        .filter((other) =>
          consulted.some((name) =>
            new RegExp(`\\bneeds\\.${name}\\.outputs\\.`).test(declarationOf(other)),
          ),
        )

      return {
        job,
        alongside,
        faults: alongside
          .filter((other) => !waitedFor.has(other.name))
          .map(
            (other) =>
              `${job.file}:${job.name} fires on the same reading as ${other.name} and does not ` +
              `wait for it`,
          ),
      }
    })

    // A publication sharing its condition with nothing is the state this is written against, so an
    // empty population is a fault of its own rather than a silent pass. It is a floor and never a
    // count: pinning how many gates there are would be a number somebody has to edit to add one.
    expect(
      found
        .filter(({ alongside }) => alongside.length === 0)
        .map(({ job }) => `${job.file}:${job.name} shares its condition with no gate at all`),
    ).toEqual([])
    expect(found.flatMap(({ faults }) => faults)).toEqual([])
  })

  /**
   * npm accepts this token as the package's publisher, so where it can be minted is where the package can
   * be published from. Granted at the top of a workflow it reaches every job of every pull request, and
   * the sweep is therefore over whole files rather than over jobs: the line that would do the damage is
   * the one that belongs to no job at all.
   */
  it('only-the-job-that-publishes-to-npm-can-mint-an-identity-token', () => {
    const minting = workflows().flatMap(({ file, lines }) =>
      lines
        .map((text, index) => ({ text, index }))
        .filter(({ text }) => !isAComment(text) && /id-token:\s*write/.test(text))
        .filter(({ index }) => containing(file, index) === undefined)
        .map(({ index }) => `${file}:${index + 1} mints an identity token outside the job that publishes`),
    )

    expect(minting).toEqual([])
  })

  /**
   * The sentence `CLAUDE.md` used to assert in prose, made a red.
   *
   * A publication here is an exchange of a short-lived identity token, so there is nothing to store and
   * nothing to steal. The regression is one line - an environment variable, or a token written into an
   * npm configuration by a `run:` - and npm caps a granular write token at ninety days, so the pressure
   * to add that line arrives four times a year rather than never.
   *
   * The fault names where and never what: a guard that printed the match would put a secret's name in
   * every log that failed, which is the treatment `refusedAddressFaults` already gives one floor up.
   */
  it('no-workflow-authenticates-to-npm-with-a-long-lived-credential', () => {
    const holding = workflows().flatMap(({ file, lines }) =>
      lines
        .map((text, index) => ({ text, index }))
        .filter(({ text }) => !isAComment(text) && A_CREDENTIAL_FOR_NPM.test(text))
        .map(({ index }) => `${file}:${index + 1} hands npm a credential of its own`),
    )

    expect(holding).toEqual([])
  })
})
