import { describe, it, expect } from 'vitest'

import { imaginedSource } from './imagined-source.js'
import type { Installation } from './install.js'
import { prepareInstallation } from './install.js'
import { localSource } from './local-source.js'
import { readableBytes, renderImportLine, renderInstallation, renderRefusal } from './report.js'
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

const anInstallation = (): Installation => {
  const project = aProject()
  try {
    const outcome = prepareInstallation(imaginedSource(), {
      root: project.root,
      configuration: CONFIGURATION,
      lockfile: EMPTY_LOCKFILE,
      contract: 'number/round',
      implementation: null,
      at: A_PINNED_INSTANT,
    })

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
  it('the-cost-is-stated-before-the-files', () => {
    const lines = renderInstallation(anInstallation(), CONFIGURATION).split('\n')
    const cost = lines.findIndex((line) => line.includes('depth'))
    const firstFile = lines.findIndex((line) => line.includes('+ src/lib/toopo/'))

    expect(lines[cost]?.trim()).toBe('5 files · 820 B · depth 2')
    expect(cost).toBeLessThan(firstFile)
  })

  /**
   * A shared file and a repointed import are both things that happened to somebody's code, so each is
   * said on the line of the file it happened to - and a shared file names the feature it is now shared
   * with, because a name tells the reader what their project looks like where "written once" only tells
   * them what the installer did.
   */
  it('a-line-says-what-was-done-to-that-file', () => {
    const rendered = renderInstallation(anInstallation(), CONFIGURATION)
    const lines = rendered.split('\n').filter((line) => line.includes('+ src/lib/toopo/'))

    expect(lines.map((line) => line.trim())).toEqual([
      '+ src/lib/toopo/string/pad/pad.ts',
      '+ src/lib/toopo/string/pad/digits.ts   shared with number/clamp@1',
      '+ src/lib/toopo/number/clamp/clamp.ts  import repointed',
      '+ src/lib/toopo/number/sign/sign.ts    import repointed',
      '+ src/lib/toopo/number/round/round.ts  import repointed',
    ])
    // A line with nothing to say carries nothing after the path, padding included.
    expect(rendered.split('\n').filter((line) => line !== line.trimEnd())).toEqual([])
  })

  /**
   * The reader's next question after a refusal is always whether their project is now half-changed, so
   * the answer comes before the reason rather than after it.
   */
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
  it('an-import-line-is-printed-ready-to-copy', () => {
    const line = renderInstallation(anInstallation(), CONFIGURATION)
      .split('\n')
      .find((held) => held.includes('import {'))

    expect(line?.trim()).toBe(
      `import { round } from './src/lib/toopo/number/round/round.js'`,
    )
  })

  it('the-import-line-follows-the-configured-directory', () => {
    const elsewhere = { version: 1, directory: 'lib/toopo' } as const
    const line = renderImportLine(anInstallation().entry, elsewhere).find((held) =>
      held.includes('import {'),
    )

    expect(line?.trim()).toBe(`import { round } from './lib/toopo/number/round/round.js'`)
  })

  /**
   * A contract that publishes a diagnostic beside its answer names both. Somebody who does not know
   * `describeParseFailure` exists writes their own error message instead, which is the error convention
   * being sold and not delivered.
   */
  it('an-import-line-names-the-diagnostic-beside-the-answer', () => {
    const project = aProject()
    try {
      const outcome = prepareInstallation(localSource(), {
        root: project.root,
        configuration: CONFIGURATION,
        lockfile: EMPTY_LOCKFILE,
        contract: 'number/parse',
        implementation: null,
        at: A_PINNED_INSTANT,
      })

      if (!('installation' in outcome)) throw new Error('number/parse no longer installs')

      expect(renderImportLine(outcome.installation.entry, CONFIGURATION)[0]?.trim()).toBe(
        `import { parseNumber, describeParseFailure } from ` +
          `'./src/lib/toopo/number/parse/parse.js'`,
      )
    } finally {
      project.remove()
    }
  })
})
