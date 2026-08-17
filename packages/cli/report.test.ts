import { describe, it, expect } from 'vitest'

import type { CommitStanding } from './ignored.js'
import { GIT_WAS_NOT_ASKED } from './ignored.js'
import { deciding } from './fixpoint.js'
import { imaginedSource } from './imagined-source.js'
import type { Installation } from './install.js'
import { prepareInstallation } from './install.js'
import { localSource } from './local-source.js'
import {
  readableBytes,
  renderImportLine,
  renderInit,
  renderInstallation,
  renderRefusal,
} from './report.js'
import type { Relocation } from './relocate.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject } from './temporary-project.js'

/**
 * The text a user reads, guarded because it is the product's first surface and because everything else
 * in this folder guards a value.
 *
 * Three claims, and they are the three the file was written around: the cost is stated before the
 * files, anything the installer did to a file is said on the line of that file, and a refusal says
 * that nothing was written.
 */

const CONFIGURATION = { version: 1, directory: 'src/lib/toopo' } as const

/**
 * The three answers git gives, as `whatGitIgnores` pairs them.
 *
 * `lockfile` is `null` wherever the folder is not ignored, because that is the only branch on which
 * the second question is asked - a pair saying otherwise would be a fixture describing a run this
 * tool cannot have.
 */
const GIT_TRACKS_THE_FOLDER: CommitStanding = { directory: false, lockfile: null }
const GIT_IGNORES_THE_FOLDER: CommitStanding = { directory: true, lockfile: false }
const GIT_IGNORES_BOTH: CommitStanding = { directory: true, lockfile: true }

/** Two files carried across and one the disk has not got, which is what separates the lines from the claims. */
const A_RELOCATION: Relocation = {
  from: 'lib/toopo',
  to: 'src/lib/toopo',
  moves: [
    { path: 'number/round.ts', verdict: 'moved', bytes: Buffer.from('a', 'utf8') },
    { path: 'string/pad.ts', verdict: 'already-moved', bytes: null },
    { path: 'number/sign.ts', verdict: 'not-on-disk', bytes: null },
  ],
}

const anInstallation = async (): Promise<Installation> => {
  const project = aProject()
  try {
    const { answer: outcome } = await deciding(imaginedSource(), (held) =>
      prepareInstallation(held, {
        root: project.root,
        configuration: CONFIGURATION,
        lockfile: EMPTY_LOCKFILE,
        contract: 'number/round',
        implementation: null,
        at: A_PINNED_INSTANT,
      }),
    )

    if (!('installation' in outcome)) throw new Error('the imagined graph no longer installs')

    return outcome.installation
  } finally {
    project.remove()
  }
}

describe('what the user reads', () => {
  /**
   * The cost is a promise this project makes about what installing something costs. A promise printed
   * after the list is a promise the reader has already stopped looking for.
   */
  it('the-cost-is-stated-before-the-files', async () => {
    const lines = renderInstallation(await anInstallation(), CONFIGURATION, false, GIT_WAS_NOT_ASKED).split('\n')
    const cost = lines.findIndex((line) => line.includes('depth'))
    const firstFile = lines.findIndex((line) => line.includes('+ src/lib/toopo/'))

    expect(lines[cost]?.trim()).toBe('5 files · 794 B · depth 2')
    expect(cost).toBeLessThan(firstFile)
  })

  /**
   * A shared file and a repointed import are both things that happened to somebody's code, so each is
   * said on the line of the file it happened to - and a shared file names the feature it is now shared
   * with, because a name tells the reader what their project looks like where "written once" only tells
   * them what the installer did.
   */
  it('a-line-says-what-was-done-to-that-file', async () => {
    const rendered = renderInstallation(await anInstallation(), CONFIGURATION, false, GIT_WAS_NOT_ASKED)
    const lines = rendered.split('\n').filter((line) => line.includes('+ src/lib/toopo/'))

    // Read with the runs of whitespace collapsed, because the claim is which note sits on which file
    // and the column width is presentation. Transcribing the alignment would make this guard red on a
    // re-flow and repair it by declaring the layout a second time.
    expect(lines.map((line) => line.trim().replace(/\s+/g, ' '))).toEqual([
      '+ src/lib/toopo/string/pad.ts import repointed',
      '+ src/lib/toopo/string/pad/digits.ts shared with typescript/number/clamp@1',
      '+ src/lib/toopo/number/clamp.ts import repointed',
      '+ src/lib/toopo/number/sign.ts import repointed',
      '+ src/lib/toopo/number/round.ts import repointed',
    ])
    // No line of the screen carries trailing whitespace, padding included. **This fixture no longer
    // exercises the padding**: ADR-0110 put every entry file a level above its own folder, so all five
    // lines now have a note and the one that used to have nothing after the path is gone. It is kept as
    // an invariant over the whole screen rather than deleted, and what it was written for is recorded
    // here so that nobody reads it as still covering that case.
    expect(rendered.split('\n').filter((line) => line !== line.trimEnd())).toEqual([])
  })

  /**
   * The reader's next question after a refusal is always whether their project is now half-changed, so
   * the answer comes before the reason rather than after it.
   */
  /**
   * `init` says what has to be committed, at the moment the folder is being chosen - or says that the
   * project will not accept it, which is the same sentence's job on a project where it is false.
   *
   * The trap is that a project whose installed folder is ignored by git hands the next person a
   * lockfile describing files that are not there, and their build fails on an import long before
   * anybody thinks to run `toopo update`. **This used to be the only prevention on offer, on the
   * argument that the trap could not be detected**; `ignored.ts` carries the measurement that reversed
   * it, and the third answer - git cannot say - is the one printed here, which is why `null` gives the
   * sentence that was always given.
   */
  it('an-init-says-what-has-to-be-committed', () => {
    const screen = renderInit(CONFIGURATION, false, GIT_WAS_NOT_ASKED, null, null)

    expect(screen).toContain('Commit toopo.json, toopo.lock and src/lib/toopo/')
    expect(screen).toContain('source code in your project')
    expect(
      renderInit({ version: 1, directory: 'app/vendor' }, true, GIT_TRACKS_THE_FOLDER, null, null),
    ).toContain('toopo.lock and app/vendor/')

    const ignored = renderInit(CONFIGURATION, false, GIT_IGNORES_THE_FOLDER, null, null)

    expect(ignored).toContain('git ignores src/lib/toopo/')
    expect(ignored).not.toContain('Commit toopo.json, toopo.lock and')
  })

  /**
   * The trap is a committed lockfile beside an uncommitted folder, so the lockfile's own standing is
   * asked rather than predicted - and a project that ignores both is told the other thing.
   *
   * *and toopo.lock will be* was this tool guessing what the user's git would do with a second path it
   * had never been given. The whole warning rests on that guess: with `toopo.lock` ignored too there is
   * no lockfile naming files that are not there, because there is no committed lockfile at all. The
   * sentence that replaces it is worth more than the one it replaces, since ignoring `toopo.lock` is
   * the exact mistake this product argues against.
   */
  it('the-lockfile-standing-is-asked-and-not-predicted', () => {
    const tracked = renderInit(CONFIGURATION, false, GIT_IGNORES_THE_FOLDER, null, null)
    const neither = renderInit(CONFIGURATION, false, GIT_IGNORES_BOTH, null, null)

    expect(tracked).toContain('toopo.lock is not ignored, so whoever clones this next gets a')
    expect(tracked).not.toContain('nothing toopo wrote will be committed at all')

    expect(neither).toContain('git ignores toopo.lock as well')
    expect(neither).not.toContain('whoever clones this next')

    // Git having no answer says nothing about either path, which is the third outcome `ignored.ts`
    // exists to keep: never a claim about a project this tool could not read.
    const silent = renderInit(CONFIGURATION, false, GIT_WAS_NOT_ASKED, null, null)
    expect(silent).not.toContain('toopo.lock is not ignored')
    expect(silent).not.toContain('git ignores toopo.lock')
  })

  /**
   * A folder change names every file it moved, because this is the tool moving things inside somebody
   * else's repository. A count would say how much where this has to say what, and a reader cannot check
   * a number against their own project.
   *
   * A file the lockfile claims and the disk has not got is absent from the lines and from the count: it
   * did not move, and saying it did would be false about the one thing this screen is for.
   */
  it('a-folder-change-names-every-file-that-moved', () => {
    const screen = renderInit(CONFIGURATION, true, GIT_WAS_NOT_ASKED, A_RELOCATION, null)

    expect(screen).toContain('lib/toopo  ->  src/lib/toopo')
    expect(screen).toContain('~ number/round.ts')
    expect(screen).toContain('~ string/pad.ts')
    expect(screen).not.toContain('number/sign.ts')
    expect(screen).toContain('2 files moved')
  })

  /**
   * And says the one part of the move it cannot make: the user's own imports.
   *
   * They wrote `from './lib/toopo/...'` and that path has just stopped existing. Toopo never reads or
   * edits their sources, so nothing can repair it for them - and a screen that stays silent leaves
   * their build failing on an import with nothing anywhere saying why. That is the trap `whatToCommit`
   * is written for, one floor up, and **the one part of the work that stays theirs must not be the one
   * part nobody mentions.**
   */
  it('a-folder-change-says-the-imports-are-the-users-to-change', () => {
    const screen = renderInit(CONFIGURATION, true, GIT_WAS_NOT_ASKED, A_RELOCATION, null)

    expect(screen).toContain('Imports in your own code naming lib/toopo/')
    expect(screen).toContain('src/lib/toopo/')
    expect(screen).toContain('cannot do for you')
  })

  /**
   * A folder that could not be taken because the user had put something of their own in it is named.
   *
   * Left silent it is the orphan defect with the roles reversed: a folder this tool has stopped naming,
   * still holding somebody's file, mentioned by nothing ever again.
   */
  it('a-folder-that-could-not-be-taken-is-named', () => {
    // *still holds something toopo did not put there* named what is in the folder, where `rmdir`
    // refusing establishes only that it is not empty - and a run killed part-way leaves our own
    // `.toopo-part` files exactly there.
    expect(renderInit(CONFIGURATION, true, GIT_WAS_NOT_ASKED, A_RELOCATION, 'lib/toopo')).toContain(
      'lib/toopo/ is not empty, so it was left where it is',
    )
    expect(renderInit(CONFIGURATION, true, GIT_WAS_NOT_ASKED, A_RELOCATION, null)).not.toContain('still holds')
  })

  it('a-refusal-says-nothing-was-written-before-it-says-why', () => {
    const lines = renderRefusal(['the reason it was refused']).split('\n').filter((line) => line !== '')

    expect(lines[0]?.trim()).toBe('Refused, and nothing was written.')
    expect(lines[1]?.trim()).toBe('the reason it was refused')
  })

  it('a-size-is-read-the-way-a-file-manager-shows-it', () => {
    expect([0, 999, 1000, 3183].map(readableBytes)).toEqual(['0 B', '999 B', '1.0 kB', '3.2 kB'])
  })

  /**
   * The line that makes `add` usable, and the mistake it closes was made by somebody with this source
   * code in front of them: a file system path is not what anybody writes in an import.
   *
   * Three things are load-bearing and each of them was got wrong once. The path comes from the
   * *configured* directory rather than from a plausible one. The extension is `.js` although the file
   * on disk is `.ts`. And the exports are the contract's, because an export name is not derivable from
   * an address - `number/parse` exports `parseNumber`.
   */
  it('an-import-line-is-printed-ready-to-copy', async () => {
    const line = renderInstallation(await anInstallation(), CONFIGURATION, false, GIT_WAS_NOT_ASKED)
      .split('\n')
      .find((held) => held.includes('import {'))

    expect(line?.trim()).toBe(`import { round } from './src/lib/toopo/number/round.js'`)
  })

  it('the-import-line-follows-the-configured-directory', async () => {
    const elsewhere = { version: 1, directory: 'lib/toopo' } as const
    const line = renderImportLine((await anInstallation()).entry, elsewhere).find((held) =>
      held.includes('import {'),
    )

    expect(line?.trim()).toBe(`import { round } from './lib/toopo/number/round.js'`)
  })

  /**
   * A contract that publishes a diagnostic beside its answer names both. Somebody who does not know
   * `describeParseFailure` exists writes their own error message instead, which is the error convention
   * being sold and not delivered.
   */
  it('an-import-line-names-the-diagnostic-beside-the-answer', async () => {
    const project = aProject()
    try {
      const { answer: outcome } = await deciding(localSource(), (held) =>
        prepareInstallation(held, {
          root: project.root,
          configuration: CONFIGURATION,
          lockfile: EMPTY_LOCKFILE,
          contract: 'number/parse',
          implementation: null,
          at: A_PINNED_INSTANT,
        }),
      )

      if (!('installation' in outcome)) throw new Error('number/parse no longer installs')

      expect(renderImportLine(outcome.installation.entry, CONFIGURATION)[0]?.trim()).toBe(
        `import { parseNumber, describeParseFailure } from './src/lib/toopo/number/parse.js'`,
      )
    } finally {
      project.remove()
    }
  })
})
