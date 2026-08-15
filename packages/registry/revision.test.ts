import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { REVISION, THE_UNPUBLISHED_REVISION, TheRevisionCannotBeNamed, theRevision } from './revision.js'

/**
 * What the registry stamps on every named answer, measured against a repository built for it.
 *
 * It is measured in a temporary repository rather than in this one, and that is the whole apparatus.
 * Asking this working tree would answer whatever the run happens to be at, so the only thing a guard
 * could assert about it is a shape - and the claim worth keeping is not *forty hexadecimal digits*, it
 * is **the revision is refused unless the tree is exactly that commit**. A tree that can be dirtied on
 * purpose is the only place that claim can be seen red.
 */

let repository: string

const git = (...arguments_: readonly string[]): string =>
  execFileSync('git', [...arguments_], { cwd: repository, encoding: 'utf8' }).trim()

beforeAll(() => {
  repository = mkdtempSync(join(tmpdir(), 'toopo-revision-'))

  git('init', '--quiet')
  git('config', 'user.email', 'guard@toopo.dev')
  git('config', 'user.name', 'a guard')
  writeFileSync(join(repository, 'a-contract.ts'), 'export const one = 1\n', 'utf8')
  git('add', '-A')
  git('commit', '--quiet', '--no-gpg-sign', '-m', 'the first commit')
})

afterAll(() => {
  rmSync(repository, { recursive: true, force: true })
})

describe('the revision a set of answers was produced from', () => {
  it('the-revision-of-a-clean-tree-is-the-commit-git-names', () => {
    expect(theRevision(repository)).toBe(git('rev-parse', 'HEAD'))
    expect(REVISION.test(theRevision(repository))).toBe(true)
  })

  /**
   * The claim this module exists for. A revision stamped on a tree that does not agree with its commit
   * names a state nobody can obtain, so every answer carrying it would publish a durability promise
   * that fails the first time somebody tries it.
   *
   * Both spellings of disagreement are measured, because they are two different questions to git and
   * only one of them is obvious. A tracked file edited is the one anybody thinks of; an **untracked**
   * file is the one that matters here, since a contract added and not committed is exactly the change
   * that would be served and then be unfindable.
   */
  it('a-tree-that-does-not-agree-with-its-commit-names-no-revision', () => {
    writeFileSync(join(repository, 'a-contract.ts'), 'export const one = 2\n', 'utf8')
    expect(() => theRevision(repository)).toThrow(TheRevisionCannotBeNamed)
    git('checkout', '--', 'a-contract.ts')

    expect(theRevision(repository)).toBe(git('rev-parse', 'HEAD'))

    writeFileSync(join(repository, 'another-contract.ts'), 'export const two = 2\n', 'utf8')
    expect(() => theRevision(repository)).toThrow(/another-contract\.ts/)
    rmSync(join(repository, 'another-contract.ts'))
  })

  it('a-folder-that-is-no-repository-names-no-revision', () => {
    const outside = mkdtempSync(join(tmpdir(), 'toopo-not-a-repository-'))
    try {
      expect(() => theRevision(outside)).toThrow(TheRevisionCannotBeNamed)
    } finally {
      rmSync(outside, { recursive: true, force: true })
    }
  })

  /**
   * A stand-in's answer, and it is visibly not a publication for the reason `0.0.0-local` is: a
   * plausible-looking value would name a state that exists nowhere and leave nobody able to tell it
   * from one that does.
   */
  it('the-unpublished-revision-is-shaped-like-one-and-names-nothing', () => {
    expect(THE_UNPUBLISHED_REVISION).toBe('0'.repeat(40))
    expect(REVISION.test(THE_UNPUBLISHED_REVISION)).toBe(true)
    expect(theRevision(repository)).not.toBe(THE_UNPUBLISHED_REVISION)
  })
})
