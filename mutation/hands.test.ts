import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { handsOn, proseOf } from './hands.ts'
import { THE_REPOSITORY, trackedSources } from './paths.ts'

/**
 * What `npm run hands` swept, asked of something other than the sweep.
 *
 * The reading this module guards reports where prose has stopped having an author, and its failure
 * mode is not a wrong answer but a silent one: an extraction that returns nothing for every file
 * prints *0 at 3 hands or more*, which is exactly what a clean tree prints. That is the shape
 * `CLAUDE.md` keeps an entry for - ignored is not failed, and the two are indistinguishable to
 * anything that counts a total.
 *
 * **So neither guard below reads `HandsReading.visited`.** That field is the list of paths the
 * reading was handed, so comparing it against `trackedSources()` would establish that the derivation
 * is self-consistent, which is true of a derivation with a hole in it. ADR-0087. What is compared
 * instead is the extractor's answer against a statement of *does this file hold prose at all* that
 * shares no code with it.
 */

/** Does this file hold prose, decided without the line machine `proseOf` runs on. */
const looksLikeProse = (path: string, source: string): boolean =>
  path.endsWith('.md')
    ? source.split(/\r?\n/).some((line) => /^[A-Za-z*`_[]/.test(line))
    : source.includes('/**') || /^\s*\/\//m.test(source)

describe('the prose every reading of hands claims to have swept', () => {
  /**
   * Seen red by inverting the test that tells prose from an indented sample, so that only samples
   * were gathered: 343 of the 362 tracked sources yielded nothing, and the report printed a
   * distribution and a clean list rather than an error.
   *
   * The two sides are independent by construction: one runs the paragraph machine, the other asks
   * whether the bytes contain a comment opener or a line of Markdown at all. A change that empties
   * the first cannot empty the second.
   */
  it('every-source-that-holds-prose-yields-a-paragraph', () => {
    const missed = trackedSources().filter((path) => {
      const source = readFileSync(join(THE_REPOSITORY, path), 'utf8')

      return looksLikeProse(path, source) && proseOf(path).length === 0
    })

    expect(missed).toEqual([])
  })

  /**
   * Seen red by widening the porcelain pattern to a 64-digit identifier, which is what a git that
   * had moved to a longer object name would hand this reading.
   *
   * `handsOn` refuses a paragraph attributed to nobody rather than counting it at zero, so the red
   * arrives as that refusal naming the first paragraph it reached - `mutation/paths.ts:2-3`. One
   * file is read and not the tree: the condition is whether blame parses at all, and every file
   * answers that identically at the price of a process apiece.
   */
  it('every-paragraph-a-reading-reports-is-attributed-to-a-commit', () => {
    const paragraphs = handsOn('mutation/paths.ts')

    expect(paragraphs.length).toBeGreaterThan(0)
    expect(paragraphs.filter((paragraph) => paragraph.hands < 1)).toEqual([])
  })
})
