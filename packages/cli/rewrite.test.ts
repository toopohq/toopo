import { describe, it, expect } from 'vitest'

import { rewrittenSources } from './rewrite.js'

/**
 * Pointing an import at where the file it names actually landed.
 *
 * The two reasons a file moves are one rule here, and these guards are what keep them one: an entry
 * file renamed to the name of its feature, and a shared blob written once in somebody else's folder,
 * are both *a file that did not land where the specifier said it would*.
 *
 * Every one of these parses with the TypeScript compiler in a temporary project of our own, which is
 * the whole reason the user's `tsconfig.json` can differ from ours without breaking an install.
 */

const THE_CATALOGUE_TREE = {
  'imagined-string/pad/reference.ts': 'imagined-string/pad.ts',
  'imagined-string/pad/digits.ts': 'imagined-string/pad/digits.ts',
  // A second file of `imagined-string/pad`'s own folder, which is the only kind of file this layout leaves
  // where the catalogue served it - and therefore the only one a specifier can already be right about.
  'imagined-string/pad/units.ts': 'imagined-string/pad/units.ts',
  'imagined-number/clamp/reference.ts': 'imagined-number/clamp.ts',
  // The second carrier of the shared blob, pointing at the copy that was kept.
  'imagined-number/clamp/digits.ts': 'imagined-string/pad/digits.ts',
}

const rewritten = (servedAt: string, text: string): string => {
  const result = rewrittenSources([{ servedAt, text }], THE_CATALOGUE_TREE)
  if ('faults' in result) throw new Error(result.faults.join('\n'))

  return result.sources.get(servedAt) as string
}

describe('pointing an import at where the file went', () => {
  /**
   * The parsing project is a directory of ours, and a served path composes a place inside it exactly
   * the way it composes one inside somebody's project - so it is confined by the same rule.
   *
   * It matters more here than the arithmetic suggests: this is the first thing an install writes, so a
   * path refused only later would already have put a file somewhere by the time it was refused.
   */
  it('a-served-path-that-leaves-the-parsing-project-is-refused-before-it-is-written', () => {
    const result = rewrittenSources(
      [{ servedAt: '../../elsewhere.ts', text: 'export const x = 1\n' }],
      THE_CATALOGUE_TREE,
    )

    expect('faults' in result && result.faults.length).toBe(1)
    expect('faults' in result && result.faults[0]).toContain('"../../elsewhere.ts"')
  })

  /**
   * The cost of naming the entry file after its feature, paid here. A published `imagined-number/clamp` names
   * its dependency as `../../imagined-string/pad/reference.js`, which is wrong the moment that file lands as
   * `imagined-string/pad.ts` - a level shallower as well as under another name.
   */
  it('a-renamed-entry-file-is-repointed', () => {
    const text = rewritten(
      'imagined-number/clamp/reference.ts',
      `import { pad } from '../../imagined-string/pad/reference.js'\n\nexport const clamp = pad\n`,
    )

    expect(text).toBe(`import { pad } from '../imagined-string/pad.js'\n\nexport const clamp = pad\n`)
  })

  /** The other half of the same rule: a file that was not written because somebody else carries it. */
  it('a-shared-blob-is-repointed-across-features', () => {
    const text = rewritten(
      'imagined-number/clamp/reference.ts',
      `import { DIGITS } from './digits.js'\n\nexport const clamp = DIGITS\n`,
    )

    expect(text).toBe(
      `import { DIGITS } from '../imagined-string/pad/digits.js'\n\nexport const clamp = DIGITS\n`,
    )
  })

  /**
   * A specifier that already names where the file went is left exactly as it was. An installer that
   * rewrote it anyway would change bytes for no reason, and every rewritten file is a file whose digest
   * stops matching what the registry served.
   *
   * **The subject is one file of a feature's folder naming another, and under ADR-0110 nothing else can
   * be.** An entry file lands a level above the folder it was served in, so every specifier it carries
   * moves - including one naming a file of its own feature. The files that stay put are the ones the
   * folder keeps, and this is the guard that says the rewriter leaves those alone.
   */
  it('an-unchanged-specifier-is-left-alone', () => {
    const source = `import { DIGITS } from './digits.js'\n\nexport const UNITS = DIGITS\n`

    expect(rewritten('imagined-string/pad/units.ts', source)).toBe(source)
  })

  /**
   * Six shapes name a module and a regular expression over `from '...'` misses four of them. This is
   * why the reader is `packages/validation/`'s and not a seventh one written here.
   */
  it('every-shape-of-import-is-repointed-and-not-only-the-obvious-one', () => {
    const text = rewritten(
      'imagined-number/clamp/reference.ts',
      `import type { Pad } from '../../imagined-string/pad/reference.js'
export { pad } from '../../imagined-string/pad/reference.js'
const later = () => import('../../imagined-string/pad/reference.js')
type Held = import('../../imagined-string/pad/reference.js').Pad

export const clamp = (value: Pad | Held) => later() ?? value
`,
    )

    expect(text.match(/\.\.\/imagined-string\/pad\.js/g)).toHaveLength(4)
    expect(text).not.toContain('reference.js')
  })

  /**
   * Permanent rule 2 forbids a feature from depending on anything outside the registry, so there is
   * nowhere for this installer to point a package import. It is refused rather than left alone, because
   * leaving it would write a file into somebody's project that imports something they do not have.
   */
  it('an-import-of-something-outside-the-registry-is-refused', () => {
    const result = rewrittenSources(
      [{ servedAt: 'imagined-string/pad/reference.ts', text: `import { join } from 'node:path'\n` }],
      THE_CATALOGUE_TREE,
    )

    expect('faults' in result && result.faults).toEqual([
      'imagined-string/pad/reference.ts imports `node:path`, which is not a registry feature. Permanent rule 2 ' +
        'forbids a feature from depending on anything else, so there is nowhere for this installer to ' +
        'point it.',
    ])
  })

  /** A relative import naming a file no snapshot of this install carries would land pointing at nothing. */
  it('an-import-of-a-file-this-install-does-not-carry-is-refused', () => {
    const result = rewrittenSources(
      [{ servedAt: 'imagined-string/pad/reference.ts', text: `import { x } from './missing.js'\n` }],
      THE_CATALOGUE_TREE,
    )

    expect('faults' in result && result.faults).toEqual([
      'imagined-string/pad/reference.ts imports `./missing.js`, and no file of this install is served at that ' +
        'path - so it would land pointing at nothing.',
    ])
  })

  /**
   * Three spellings of one file are legitimate - the `.js` a published source writes, the `.ts` this
   * repository's own configuration permits, and the extensionless form a bundler resolves - so the
   * installer is not the thing that decides which one an author may use.
   */
  it('the-three-spellings-of-one-file-all-resolve', () => {
    const spellings = ['./digits.js', './digits.ts', './digits']

    expect(
      spellings.map((specifier) =>
        rewritten('imagined-number/clamp/reference.ts', `export { DIGITS } from '${specifier}'\n`),
      ),
    ).toEqual(spellings.map(() => `export { DIGITS } from '../imagined-string/pad/digits.js'\n`))
  })
})
