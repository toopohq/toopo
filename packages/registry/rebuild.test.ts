import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { renderContract } from './address.js'
import { THE_TOY } from './imagined-addresses.js'
import { rebindingFaults, renderBindings } from './rebinding.js'
import { ARevisionCannotBeRebuilt, THE_LEDGER_SCRIPT, bindingsAtRevision } from './rebuild.js'
import { EMPTY_LEDGER, publishContract } from './snapshot.js'

/**
 * Rebuilding a commit, measured against repositories built to be published from and then edited.
 *
 * **It is measured in temporary repositories rather than in this one, and that is the apparatus rather
 * than a convenience.** Asking this working tree would answer whatever the run happens to be at, and
 * the claim worth keeping is not a shape - it is *a commit is asked what it bound, and a commit that
 * cannot answer is refused*. A repository whose history can be written on purpose is the only place
 * either half can be seen red.
 *
 * What the subject here is not is a contract of this catalogue. The reader's whole contract with a past
 * commit is `npm run ledger` printing addresses and digests, so a repository honouring that contract
 * exercises every branch of it - and one that hashes a file of its own makes a digest that really moves
 * when the file really does. `frozen-for-life.test.ts` is where a real contract of the five is really
 * marked published and really edited.
 */

/** A `ledger` script with no dependencies, so that a toy repository needs nothing installed. */
const PRINTS_ITS_OWN_DIGEST = `import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const bytes = readFileSync(new URL('./thing.txt', import.meta.url))

process.stdout.write(
  \`${renderContract(THE_TOY)}\\t\${createHash('sha256').update(bytes).digest('hex')}\\n\`,
)
`

let toy: string
let asPublished: string
let afterTheEdit: string

const git = (root: string, ...arguments_: readonly string[]): string =>
  execFileSync('git', [...arguments_], { cwd: root, encoding: 'utf8' }).trim()

const aRepository = (manifest: Readonly<Record<string, unknown>>, files: Readonly<Record<string, string>>): string => {
  const root = mkdtempSync(join(tmpdir(), 'toopo-rebuild-'))

  git(root, 'init', '--quiet')
  git(root, 'config', 'user.email', 'guard@toopo.dev')
  git(root, 'config', 'user.name', 'a guard')
  writeFileSync(join(root, 'package.json'), JSON.stringify(manifest), 'utf8')
  for (const [path, text] of Object.entries(files)) writeFileSync(join(root, path), text, 'utf8')
  git(root, 'add', '-A')
  git(root, 'commit', '--quiet', '--no-gpg-sign', '-m', 'the first commit')

  return root
}

beforeAll(() => {
  toy = aRepository(
    { name: 'a-toy', type: 'module', scripts: { [THE_LEDGER_SCRIPT]: 'node print.ts' } },
    { 'print.ts': PRINTS_ITS_OWN_DIGEST, 'thing.txt': 'what was published\n' },
  )
  asPublished = git(toy, 'rev-parse', 'HEAD')

  writeFileSync(join(toy, 'thing.txt'), 'what it says now\n', 'utf8')
  git(toy, 'commit', '--quiet', '--no-gpg-sign', '-a', '-m', 'the edit')
  afterTheEdit = git(toy, 'rev-parse', 'HEAD')
})

afterAll(() => {
  rmSync(toy, { recursive: true, force: true })
})

describe('what a past commit of this repository bound', () => {
  /**
   * The claim. A commit is checked out and asked, and what comes back is that commit's answer rather
   * than the working tree's - which is the whole of why the check is worth running.
   */
  it('a-commit-is-asked-what-it-bound-rather-than-the-tree :: the past answers for itself', () => {
    const what = renderContract(THE_TOY)
    const published = bindingsAtRevision(toy, asPublished)
    const now = bindingsAtRevision(toy, afterTheEdit)

    expect([...published.keys()]).toEqual([what])
    expect(published.get(what)).not.toBe(now.get(what))
  })

  /**
   * End to end, on an artefact whose digest really moved because a file really did: the ledger says it
   * was published at one commit, the tree now produces something else, and the rule refuses.
   *
   * The two digests are asserted rather than the count, because the count alone is satisfied by the
   * *other* fault - a coordinate naming a commit that binds no such address - and that one is a
   * different defect wearing this one's clothes.
   */
  it('an-artefact-edited-after-its-publication-is-refused-end-to-end :: the reader and the rule', () => {
    const what = renderContract(THE_TOY)
    const wasPublished = bindingsAtRevision(toy, asPublished).get(what)
    const standsNow = bindingsAtRevision(toy, afterTheEdit).get(what)
    if (wasPublished === undefined || standsNow === undefined) throw new Error('the toy bound nothing')

    const faults = rebindingFaults(
      publishContract(EMPTY_LEDGER, {
        address: THE_TOY,
        digest: standsNow,
        publishedAt: '2026-08-16T00:00:00.000Z',
        publishedFrom: asPublished,
        standing: { lifecycle: { state: 'published' } },
      }),
      (revision) => bindingsAtRevision(toy, revision),
    )

    expect(faults).toHaveLength(1)
    expect(faults[0]).toContain(`bound to ${wasPublished}`)
    expect(faults[0]).toContain(`produces ${standsNow}`)
    expect(faults[0]).toContain('frozen for life')
  })

  /**
   * The control beside it: the same reader, the same repository, the digest the publication commit
   * really answered. Without it the guard above passes on a rule that refuses everything.
   */
  it('an-artefact-that-was-not-touched-after-its-publication-is-accepted :: the control', () => {
    const wasPublished = bindingsAtRevision(toy, asPublished).get(renderContract(THE_TOY))
    if (wasPublished === undefined) throw new Error('the toy bound nothing')

    expect(
      rebindingFaults(
        publishContract(EMPTY_LEDGER, {
          address: THE_TOY,
          digest: wasPublished,
          publishedAt: '2026-08-16T00:00:00.000Z',
          publishedFrom: asPublished,
          standing: { lifecycle: { state: 'published' } },
        }),
        (revision) => bindingsAtRevision(toy, revision),
      ),
    ).toEqual([])
  })

  /**
   * A commit that cannot answer is refused rather than skipped, and every branch of *cannot* is a
   * separate sentence: what a reader has to do about a missing script is not what they have to do about
   * a script that runs something else.
   */
  it.each([
    [{ name: 'no-scripts', type: 'module' }, {}, 'declares no `ledger` script'],
    [
      { name: 'wrong-runner', type: 'module', scripts: { [THE_LEDGER_SCRIPT]: 'tsx print.ts' } },
      { 'print.ts': PRINTS_ITS_OWN_DIGEST },
      'node <one path>',
    ],
    [
      { name: 'two-arguments', type: 'module', scripts: { [THE_LEDGER_SCRIPT]: 'node print.ts --now' } },
      { 'print.ts': PRINTS_ITS_OWN_DIGEST },
      'node <one path>',
    ],
    [
      { name: 'prints-nonsense', type: 'module', scripts: { [THE_LEDGER_SCRIPT]: 'node print.ts' } },
      { 'print.ts': 'process.stdout.write("not a binding\\n")\n' },
      'answered nothing this reader could use',
    ],
  ])(
    'a-commit-that-cannot-say-what-it-bound-is-refused-%# :: the branches of cannot are not one',
    (manifest, files, why) => {
      const broken = aRepository(manifest, files)
      try {
        expect(() => bindingsAtRevision(broken, git(broken, 'rev-parse', 'HEAD'))).toThrow(
          ARevisionCannotBeRebuilt,
        )
        expect(() => bindingsAtRevision(broken, git(broken, 'rev-parse', 'HEAD'))).toThrow(
          new RegExp(why.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        )
      } finally {
        rmSync(broken, { recursive: true, force: true })
      }
    },
  )

  /**
   * A checkout left registered would make the next `git status` disagree with its commit, which is the
   * one thing `theRevision` refuses - so a run that refused is asked to have tidied up after itself.
   */
  it('a-rebuild-leaves-no-checkout-behind-it :: a worktree outlives nothing', () => {
    expect(() => bindingsAtRevision(toy, 'f'.repeat(40))).toThrow(ARevisionCannotBeRebuilt)

    expect(git(toy, 'worktree', 'list').split('\n')).toHaveLength(1)
    expect(git(toy, 'status', '--porcelain')).toBe('')
  })

  it('a-rendered-binding-is-what-a-past-commit-prints :: one format, written once', () => {
    expect(renderBindings(bindingsAtRevision(toy, asPublished))).toBe(
      `${renderContract(THE_TOY)}\t${bindingsAtRevision(toy, asPublished).get(renderContract(THE_TOY)) ?? ''}\n`,
    )
  })
})
