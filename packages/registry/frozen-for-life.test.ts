import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { renderContract } from './address.js'
import { rebindingFaults } from './rebinding.js'
import { THE_REBUILD_FOLDER, bindingsAtRevision } from './rebuild.js'
import { REPOSITORY_ROOT } from './serialise.js'
import { theFive } from './the-five.js'
import { EMPTY_LEDGER, publishContract } from './snapshot.js'

/**
 * A contract of this catalogue, really marked published and really edited afterwards.
 *
 * **Nothing is published, so the subject is built rather than found - and the building is the evidence
 * rather than a preliminary to it.** A freeze check written against the five would compute every one
 * of its answers over an empty set, go green for ever, and be read by nobody until the day it was
 * needed. So `string/slugify@1` is marked `published` in a clone, and the three things that can happen
 * to it afterwards are each committed and each measured: a comment reworded inside its harness, a
 * standing change, and prose outside the seven files.
 *
 * The clone is `--shared` and costs about a tenth of a second, and it is a clone rather than this
 * repository because the subject has to be *published from* a commit and then *edited* - two commits
 * this repository must not carry, on a contract this catalogue must not ship as published.
 */

const SLUGIFY = theFive.find((source) => source.address.name === 'string/slugify')
if (SLUGIFY === undefined) throw new Error('the catalogue holds no string/slugify')

const WHAT = renderContract(SLUGIFY.address)

/** One line of one comment of a declared harness file. The whole of what `4a3bce5` did. */
const A_COMMENT = {
  path: join(SLUGIFY.folder, 'properties.test.ts'),
  find: '**The margin is the point rather than the figure**',
  replace: '**The margin is the point, rather than the figure**',
}

const NOT_YET_PUBLISHED = 'lifecycle: NOT_YET_PUBLISHED,\n    folder: \'contracts/typescript/string/slugify\''
const PUBLISHED = 'lifecycle: { state: \'published\' },\n    folder: \'contracts/typescript/string/slugify\''
const ABSORBED = `lifecycle: {
      state: 'absorbed-by-the-language',
      answeredBy: 'a future proposal, named here by nothing',
      measurement: 'none: this subject exists to be a standing change, not a claim about the language',
    },
    folder: 'contracts/typescript/string/slugify'`

let subject: string
let asPublished: string
let afterTheComment: string
let afterTheStanding: string
let atHead: string

const git = (root: string, ...arguments_: readonly string[]): string =>
  execFileSync('git', [...arguments_], { cwd: root, encoding: 'utf8' }).trim()

const rewrite = (path: string, find: string, replace: string): void => {
  const full = join(subject, path)
  const text = readFileSync(full, 'utf8')
  if (!text.includes(find)) throw new Error(`${path} does not carry the text this subject rewrites`)

  writeFileSync(full, text.replace(find, replace), 'utf8')
}

const commit = (message: string): string => {
  git(subject, 'commit', '--quiet', '--no-gpg-sign', '-a', '-m', message)

  return git(subject, 'rev-parse', 'HEAD')
}

/**
 * The digest each commit of the subject bound, rebuilt once each.
 *
 * Rebuilding is a checkout and a process - about a second and a half apiece over a clone of this
 * repository - and this suite is replayed once per cell of `registry-storage`. So the four rebuilds
 * this file needs happen in `beforeAll` and the guards below compare strings, which is the difference
 * between four seconds a cell and eleven.
 */
const digests = new Map<string, string>()

const digestAt = (revision: string): string => {
  const held = digests.get(revision)
  if (held === undefined) throw new Error(`${revision} was not rebuilt`)

  return held
}

const rebuild = (root: string, revision: string): void => {
  const held = bindingsAtRevision(root, revision).get(WHAT)
  if (held === undefined) throw new Error(`${revision} binds no ${WHAT}`)

  digests.set(revision, held)
}

/** The ledger a publishing tool would have written, with the digest this tree now produces. */
const asItStands = (publishedFrom: string, digest: string) =>
  publishContract(EMPTY_LEDGER, {
    address: SLUGIFY.address,
    digest,
    publishedAt: '2026-08-16T00:00:00.000Z',
    publishedFrom,
    standing: { lifecycle: { state: 'published' } },
  })

/** The past comes from the memo, so a guard costs a comparison rather than a checkout. */
const faultsAt = (publishedFrom: string, standsNow: string): readonly string[] =>
  rebindingFaults(asItStands(publishedFrom, standsNow), (revision) =>
    new Map([[WHAT, digestAt(revision)]]),
  )

beforeAll(() => {
  subject = join(REPOSITORY_ROOT, THE_REBUILD_FOLDER, 'the-published-subject')
  mkdirSync(join(REPOSITORY_ROOT, THE_REBUILD_FOLDER), { recursive: true })
  rmSync(subject, { recursive: true, force: true })

  execFileSync('git', ['clone', '--quiet', '--shared', '--no-checkout', REPOSITORY_ROOT, subject])
  git(subject, 'checkout', '--quiet', git(REPOSITORY_ROOT, 'rev-parse', 'HEAD'))
  git(subject, 'config', 'user.email', 'guard@toopo.dev')
  git(subject, 'config', 'user.name', 'a guard')

  rewrite('packages/registry/the-five.ts', NOT_YET_PUBLISHED, PUBLISHED)
  asPublished = commit('string/slugify@1 is published')

  rewrite(A_COMMENT.path, A_COMMENT.find, A_COMMENT.replace)
  afterTheComment = commit('one comment of a declared harness file is reworded')

  rewrite(A_COMMENT.path, A_COMMENT.replace, A_COMMENT.find)
  rewrite('packages/registry/the-five.ts', PUBLISHED, ABSORBED)
  rewrite('README.md', '# Toopo', '# Toopo\n\nA sentence outside every declared file.')
  afterTheStanding = commit('the standing moves and so does prose outside the seven files')

  atHead = git(REPOSITORY_ROOT, 'rev-parse', 'HEAD')
  for (const revision of [asPublished, afterTheComment, afterTheStanding]) rebuild(subject, revision)
  rebuild(REPOSITORY_ROOT, atHead)
}, 180_000)

afterAll(() => {
  rmSync(subject, { recursive: true, force: true })
})

describe('a contract of this catalogue, published and then edited', () => {
  /**
   * **The claim of the unit, on a real contract.** One comment of `properties.test.ts` reworded, which
   * is exactly what `4a3bce5` did to this very file, and the check refuses it: the address was bound to
   * one artefact and the tree now produces another.
   *
   * Both digests are asserted rather than the count, because a count alone is satisfied by the other
   * branch of `faultFor` - a coordinate naming a commit that binds no such address - and that is a
   * different defect wearing this one's clothes.
   */
  it('a-comment-reworded-in-a-published-contract-is-refused :: the seven files are frozen whole', () => {
    const wasPublished = digestAt(asPublished)
    const standsNow = digestAt(afterTheComment)

    expect(standsNow).not.toBe(wasPublished)

    const faults = faultsAt(asPublished, standsNow)

    expect(faults).toHaveLength(1)
    expect(faults[0]).toContain(WHAT)
    expect(faults[0]).toContain(`bound to ${wasPublished}`)
    expect(faults[0]).toContain(`produces ${standsNow}`)
    expect(faults[0]).toContain('comments included')
  })

  /**
   * The control. Without it the guard above passes on a check that refuses everything, which is the
   * failure this repository has paid for elsewhere: a refusal that is always right decides nothing.
   */
  it('a-published-contract-nothing-touched-is-accepted :: the freeze lets its own subject through', () => {
    expect(faultsAt(asPublished, digestAt(asPublished))).toEqual([])
  })

  /**
   * The two changes a published contract may still take, in one commit so that neither can pass by
   * being absent. `absorbed-by-the-language` is a state entered *after* publication, so a check that
   * reddened on it would make permanent rule 6 and ADR-0007 unable to both hold; and prose outside the
   * seven declared files reaches no digest at all.
   */
  it('a-standing-change-and-prose-outside-the-harness-are-accepted :: what stays possible', () => {
    const wasPublished = digestAt(asPublished)

    expect(digestAt(afterTheStanding)).toBe(wasPublished)
    expect(faultsAt(asPublished, digestAt(afterTheStanding))).toEqual([])
  })

  /**
   * Deciding to publish is not itself a change to the artefact. It is asserted because the subject
   * above rests on it: if marking the contract `published` had moved the digest, every measurement
   * here would be about that edit rather than about the ones it was written for.
   */
  it('the-decision-to-publish-moves-no-digest :: the lifecycle is the standing half', () => {
    expect(digestAt(asPublished)).toBe(digestAt(atHead))
  })
})
