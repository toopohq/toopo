import { lstatSync, mkdirSync, mkdtempSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { lockfileFaults } from './lockfile.js'
import { staysInside, under } from './where-a-file-may-land.js'

/**
 * The one rule about where a file may land, and the two questions it answers.
 *
 * The shapes below are a declaration rather than a handful somebody thought of, because the alphabet is
 * what makes them one answer: every row is refused by *not being spelled out of* `A_PATH_INSIDE`, and a
 * row added to the table is a row the same expression already decides. A list of clauses would need a
 * clause per row and would be finished only until somebody found a spelling nobody had.
 *
 * They are separated by what they are *about* rather than by platform, because that is what a reader
 * checking the table has to be able to do: a drive letter is not a Windows row, it is a row about a path
 * that names a volume, and it is refused on both.
 */
const WHAT_IS_NOT_A_PLACE_INSIDE: Readonly<Record<string, readonly string[]>> = {
  'a step upwards': ['../x.ts', 'a/../../x.ts', '..', 'a/..'],
  'a path from the root': ['/etc/x.ts', '//server/share/x.ts'],
  'a volume of its own': ['C:/x.ts', 'C:x.ts'],
  'a separator this catalogue does not write': ['a\\..\\x.ts', '..\\x.ts'],
  'nothing at all': ['', ' ', './'],
  'a character no served file carries': ['a\u0000b.ts', 'a:b.ts', 'a\nb.ts'],
}

const A_LOCKFILE_NAMING = (path: string): unknown => ({
  version: 3,
  features: [
    {
      contract: { language: 'typescript', name: 'string/slugify', major: 1 },
      implementation: { id: 'reference', version: '1.0.0' },
      files: [{ path, sha256: 'a'.repeat(64), bytes: 1, served: { path: 'reference.ts', sha256: 'a'.repeat(64), bytes: 1 } }],
      installedAt: '2026-01-01T00:00:00.000Z',
      locallyModified: false,
      askedFor: true,
      servedFrom: 'b'.repeat(40),
    },
  ],
})

describe('where a file may land', () => {
  it('every-shape-that-is-not-a-place-inside-is-refused', () => {
    const admitted = Object.entries(WHAT_IS_NOT_A_PLACE_INSIDE).flatMap(([about, spellings]) =>
      spellings.filter(staysInside).map((spelling) => `${about}: ${JSON.stringify(spelling)}`),
    )

    expect(admitted).toEqual([])
  })

  /**
   * The other direction, so that the guard above cannot be satisfied by a rule that refuses everything.
   *
   * `string/slugify/reference.ts` is the shape every served file really has, and `a..b.ts` is the one
   * this rule is most likely to take with it by accident: `..` is refused as a *segment*, and a filename
   * that merely contains two dots is not one.
   */
  it('every-shape-a-served-answer-really-carries-is-admitted', () => {
    const refused = ['x.ts', 'string/slugify.ts', 'string/slugify/reference.ts', 'a..b.ts', 'a.b-c_d.ts'].filter(
      (path) => !staysInside(path),
    )

    expect(refused).toEqual([])
  })

  /**
   * A directory that is a link is the one question no rule about a string can answer.
   *
   * The link is made rather than mocked, because what is under measurement is what the filesystem says
   * and not what this repository believes it says. Where the platform will not make one - Windows
   * without the privilege - the guard says so rather than passing: a guard that quietly becomes vacuous
   * on a platform is the shape this repository refuses.
   */
  it('a-directory-that-leads-out-of-the-project-is-not-a-place-a-file-may-land', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'toopo-confinement-'))
    const root = join(sandbox, 'project')
    const elsewhere = join(sandbox, 'elsewhere')
    mkdirSync(join(root, 'lib'), { recursive: true })
    mkdirSync(elsewhere, { recursive: true })

    let made = false
    try {
      symlinkSync(elsewhere, join(root, 'lib', 'toopo'), 'junction')
      made = lstatSync(join(root, 'lib', 'toopo')).isSymbolicLink()
    } catch {
      made = false
    }

    expect({ theLinkWasMade: made, where: under(root, 'lib/toopo', 'ordinary.ts') }).toEqual({
      theLinkWasMade: true,
      where: null,
    })
  })

  /** The same directory, unlinked, so the guard above is about the link and not about the arithmetic. */
  it('an-ordinary-directory-is-a-place-a-file-may-land', () => {
    const root = mkdtempSync(join(tmpdir(), 'toopo-confinement-'))

    expect(under(root, 'lib/toopo', 'string/slugify.ts')).toBe(
      join(root, 'lib/toopo', 'string/slugify.ts'),
    )
  })

  /**
   * The boundary, which is the half a composition cannot answer for.
   *
   * A `toopo.lock` arrives in a repository somebody cloned, so its `path` is somebody else's string in
   * exactly the way a served one is. Refusing it where the file is read means every later reader of that
   * entry - the plan, the diff, the relocation, the removal - is holding a path this rule has passed.
   */
  it('a-lockfile-naming-a-file-outside-the-configured-directory-is-unusable', () => {
    expect(lockfileFaults(A_LOCKFILE_NAMING('../../../elsewhere.ts'))).toEqual([
      'string/slugify file 0 does not name a file inside the configured directory',
    ])
    expect(lockfileFaults(A_LOCKFILE_NAMING('string/slugify.ts'))).toEqual([])
  })
})
