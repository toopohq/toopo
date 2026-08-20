import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { renderContract } from './address.js'
import { rebindingFaults } from './rebinding.js'
import { THE_REBUILD_FOLDER, bindingsAtRevision } from './rebuild.js'
import { REPOSITORY_ROOT } from './serialise.js'
import { theCatalogue } from './the-catalogue.js'
import { EMPTY_LEDGER, publishContract } from './snapshot.js'

/**
 * A contract of this catalogue, published for real and really edited afterwards.
 *
 * **The subject stopped being built and started being found**, which is the whole of what the
 * publication changed here. This file used to mark `string/slugify@1` as `published` in a clone,
 * because a freeze check written against a catalogue where nothing was published would compute every
 * answer over an empty set and go green for ever. The four contracts are published now, so the clone's
 * own head *is* the published subject and there is nothing to mark: what is committed into the clone is
 * only the four things that can happen to a published contract afterwards.
 *
 * They are committed rather than written into the working tree because each one has to be *rebuilt at a
 * commit*, and because two of them are edits this repository must never carry: a reworded comment
 * inside a frozen harness, and a contract of this catalogue put back to `not-yet-published`.
 *
 * The clone is `--shared` and costs about a tenth of a second.
 *
 * **`the-decision-to-publish-moves-no-digest` is the guard that gained a job rather than lost one.** It
 * used to assert that the marking this file performed was not itself a change to the artefact, so that
 * the measurements around it were about the edits they were written for. It now carries the claim that
 * lets a binding name a commit taken *before* the publication: the lifecycle is the standing half, no
 * state of it reaches the digest, and the direction the subject moves in is therefore immaterial. It is
 * asked here over all three states a contract of this catalogue can carry.
 */

const SLUGIFY = theCatalogue.find((source) => source.address.name === 'string/slugify')
if (SLUGIFY === undefined) throw new Error('the catalogue holds no string/slugify')

const WHAT = renderContract(SLUGIFY.address)

/** One line of one comment of a declared harness file. The whole of what `3844729` did. */
const A_COMMENT = {
  path: join(SLUGIFY.folder, 'properties.test.ts'),
  find: '**The margin is the point rather than the figure**',
  replace: '**The margin is the point, rather than the figure**',
}

/**
 * The three lifecycle states this subject is moved through, each anchored on the address line above
 * it - `lifecycle: PUBLISHED,` occurs once per installable contract and only this pair is unique.
 *
 * **It was anchored on the `folder` line beneath instead, until something was declared between the
 * two.** ADR-0118 put a use case there, and this file broke with a message about text the source does
 * not carry - which is right and is not what the reader needs to hear. Anchoring upward is not merely
 * the other side: `address: SLUGIFY` names the contract this subject is *about*, where `folder` was a
 * neighbour that happened to be adjacent, so what the pair now depends on is that a contract's entry
 * begins with its address.
 */
const PUBLISHED = 'address: SLUGIFY,\n    lifecycle: PUBLISHED,'
const ABSORBED = `address: SLUGIFY,
    lifecycle: {
      state: 'absorbed-by-the-language',
      answeredBy: 'a future proposal, named here by nothing',
      measurement: 'none: this subject exists to be a standing change, not a claim about the language',
    },`
const NOT_YET_PUBLISHED = 'address: SLUGIFY,\n    lifecycle: { state: \'not-yet-published\' },'

let subject: string
let asPublished: string
let afterTheComment: string
let afterTheStanding: string
let beforeTheDecision: string

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

  // Nothing is marked: the head of this clone is this catalogue, and this catalogue is published.
  asPublished = git(subject, 'rev-parse', 'HEAD')

  rewrite(A_COMMENT.path, A_COMMENT.find, A_COMMENT.replace)
  afterTheComment = commit('one comment of a declared harness file is reworded')

  rewrite(A_COMMENT.path, A_COMMENT.replace, A_COMMENT.find)
  rewrite('packages/registry/the-catalogue.ts', PUBLISHED, ABSORBED)
  rewrite('README.md', '# Toopo', '# Toopo\n\nA sentence outside every declared file.')
  afterTheStanding = commit('the standing moves and so does prose outside the seven files')

  // The third state, reached from the second, so that what moves between these two commits is the
  // lifecycle and nothing else. The prose of the commit before it stays where it is: it reaches no
  // digest, which is what the guard above this one has just established.
  rewrite('packages/registry/the-catalogue.ts', ABSORBED, NOT_YET_PUBLISHED)
  beforeTheDecision = commit('the subject is put back to the state it was published from')

  for (const revision of [asPublished, afterTheComment, afterTheStanding, beforeTheDecision]) {
    rebuild(subject, revision)
  }
}, 180_000)

afterAll(() => {
  rmSync(subject, { recursive: true, force: true })
})

describe('a contract of this catalogue, published and then edited', () => {
  /**
   * **The claim of the unit, on a real contract.** One comment of `properties.test.ts` reworded, which
   * is exactly what `3844729` did to this very file, and the check refuses it: the address was bound to
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
   * Deciding to publish is not a change to the artefact, in either direction, from any state.
   *
   * **This is what lets a binding name a commit taken before the publication, and that is a real
   * consequence rather than a tidy one.** `publishedFrom` records a commit whose registry produced the
   * digest, and the commit that marked this catalogue published cannot name itself - so what it names
   * is the commit before it, at which these four contracts read `not-yet-published`. That is honest
   * exactly to the extent that the state is outside the snapshot, which is what is asserted here:
   * three states, one digest, measured over commits rather than argued from `contractSnapshot`'s
   * field list.
   *
   * The three are asserted against one value rather than pairwise, because what is claimed is that the
   * lifecycle has no reach at all - a pairwise reading would be satisfied by two states agreeing and a
   * third quietly not being looked at.
   */
  it('the-decision-to-publish-moves-no-digest :: the lifecycle is the standing half', () => {
    const wasPublished = digestAt(asPublished)

    expect(digestAt(afterTheStanding)).toBe(wasPublished)
    expect(digestAt(beforeTheDecision)).toBe(wasPublished)
  })
})
