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
 */

const WORKFLOWS = join(THE_REPOSITORY, '.github', 'workflows')

/** A commit as git renders one, which is the only form of `uses:` that names one thing for ever. */
const A_DIGEST = /^[0-9a-f]{40}$/

/** What a reader needs beside the digest: the version it was taken from, as a comment. */
const A_VERSION_COMMENT = /#\s*\S+/

type Reference = {
  readonly file: string
  readonly line: number
  /** The whole value, as written. */
  readonly uses: string
  /** Everything after it on the line, which is where the version comment lives. */
  readonly trailing: string
}

const references = (): readonly Reference[] =>
  readdirSync(WORKFLOWS)
    .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
    .flatMap((file) =>
      readFileSync(join(WORKFLOWS, file), 'utf8')
        .split('\n')
        .map((text, index) => ({ text, line: index + 1 }))
        .flatMap(({ text, line }) => {
          const found = /^\s*(?:-\s*)?uses:\s*(\S+)(.*)$/.exec(text)

          return found === null
            ? []
            : [{ file, line, uses: found[1] ?? '', trailing: found[2] ?? '' }]
        }),
    )

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
})
