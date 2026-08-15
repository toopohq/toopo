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
  'string/pad/reference.ts': 'string/pad/pad.ts',
  'string/pad/digits.ts': 'string/pad/digits.ts',
  'number/clamp/reference.ts': 'number/clamp/clamp.ts',
  // The second carrier of the shared blob, pointing at the copy that was kept.
  'number/clamp/digits.ts': 'string/pad/digits.ts',
}

const rewritten = (servedAt: string, text: string): string => {
  const result = rewrittenSources([{ servedAt, text }], THE_CATALOGUE_TREE)
  if ('faults' in result) throw new Error(result.faults.join('\n'))

  return result.sources.get(servedAt) as string
}

describe('pointing an import at where the file went', () => {
  /**
   * The cost of naming the entry file after its feature, paid here. A published `number/clamp` names
   * its dependency as `../../string/pad/reference.js`, which is wrong the moment that file lands as
   * `pad.ts`.
   */
  it('a-renamed-entry-file-is-repointed', () => {
    const text = rewritten(
      'number/clamp/reference.ts',
      `import { pad } from '../../string/pad/reference.js'\n\nexport const clamp = pad\n`,
    )

    expect(text).toBe(`import { pad } from '../../string/pad/pad.js'\n\nexport const clamp = pad\n`)
  })

  /** The other half of the same rule: a file that was not written because somebody else carries it. */
  it('a-shared-blob-is-repointed-across-features', () => {
    const text = rewritten(
      'number/clamp/reference.ts',
      `import { DIGITS } from './digits.js'\n\nexport const clamp = DIGITS\n`,
    )

    expect(text).toBe(
      `import { DIGITS } from '../../string/pad/digits.js'\n\nexport const clamp = DIGITS\n`,
    )
  })

  /**
   * A specifier that already names where the file went is left exactly as it was. An installer that
   * rewrote it anyway would change bytes for no reason, and every rewritten file is a file whose digest
   * stops matching what the registry served.
   */
  it('an-unchanged-specifier-is-left-alone', () => {
    const source = `import { DIGITS } from './digits.js'\n\nexport const pad = DIGITS\n`

    expect(rewritten('string/pad/reference.ts', source)).toBe(source)
  })

  /**
   * Six shapes name a module and a regular expression over `from '...'` misses four of them. This is
   * why the reader is `packages/validation/`'s and not a seventh one written here.
   */
  it('every-shape-of-import-is-repointed-and-not-only-the-obvious-one', () => {
    const text = rewritten(
      'number/clamp/reference.ts',
      `import type { Pad } from '../../string/pad/reference.js'
export { pad } from '../../string/pad/reference.js'
const later = () => import('../../string/pad/reference.js')
type Held = import('../../string/pad/reference.js').Pad

export const clamp = (value: Pad | Held) => later() ?? value
`,
    )

    expect(text.match(/string\/pad\/pad\.js/g)).toHaveLength(4)
    expect(text).not.toContain('reference.js')
  })

  /**
   * Permanent rule 2 forbids a feature from depending on anything outside the registry, so there is
   * nowhere for this installer to point a package import. It is refused rather than left alone, because
   * leaving it would write a file into somebody's project that imports something they do not have.
   */
  it('an-import-of-something-outside-the-registry-is-refused', () => {
    const result = rewrittenSources(
      [{ servedAt: 'string/pad/reference.ts', text: `import { join } from 'node:path'\n` }],
      THE_CATALOGUE_TREE,
    )

    expect('faults' in result && result.faults).toEqual([
      'string/pad/reference.ts imports `node:path`, which is not a registry feature. Permanent rule 2 ' +
        'forbids a feature from depending on anything else, so there is nowhere for this installer to ' +
        'point it.',
    ])
  })

  /** A relative import naming a file no snapshot of this install carries would land pointing at nothing. */
  it('an-import-of-a-file-this-install-does-not-carry-is-refused', () => {
    const result = rewrittenSources(
      [{ servedAt: 'string/pad/reference.ts', text: `import { x } from './missing.js'\n` }],
      THE_CATALOGUE_TREE,
    )

    expect('faults' in result && result.faults).toEqual([
      'string/pad/reference.ts imports `./missing.js`, and no file of this install is served at that ' +
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
        rewritten('number/clamp/reference.ts', `export { DIGITS } from '${specifier}'\n`),
      ),
    ).toEqual(spellings.map(() => `export { DIGITS } from '../../string/pad/digits.js'\n`))
  })
})
