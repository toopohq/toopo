import { describe, expect, it } from 'vitest'

import { renderContract } from '../registry/address.js'
import { heldByTheRegistry } from './catalogue.js'
import { highlighted } from './highlight.js'
import { localSource } from './local-source.js'
import { whatACardSays } from './what-a-card-says.js'

/**
 * Sources chosen for the hazards ADR-0156 enumerated, so the totality guard does not rest on what
 * the catalogue happens to spell: a regular expression against division on one line, a template
 * whose substitution holds braces and a nested template, and a comment full of the backticks this
 * repository's prose is made of.
 */
const THE_HAZARDS: readonly string[] = [
  'const re = /a\\/b[^/]*/g; const x = a / b / c',
  'const s = `a${x ? `${y({ z: 1 })}` : "w"}b`',
  '/* a comment of ` backticks ` and ${holes} */ const s = "\\"esc\\"" // and / a tail',
]

/**
 * The ink at the first occurrence of a word, resolved by position rather than by run text: runs of
 * one ink merge - `(text: ` is a single plain run - so an exact-text lookup would answer nothing for
 * precisely the words expected to be plain.
 */
const inkOn = (source: string, word: string): string | null | undefined => {
  const runs = highlighted(source)
  const at = source.indexOf(word)
  let cursor = 0

  for (const run of runs) {
    if (at < cursor + run.text.length) return run.ink
    cursor += run.text.length
  }

  return undefined
}

describe('the six inks a contract page sets code in', () => {
  /**
   * Every character of a highlighted source reaches the reader, in order, to the byte.
   *
   * The population is every file an installable contract serves, its signature as the card states
   * it, and the hazard corpus above - so the claim covers what the page will actually set as well
   * as the shapes that defeat a lesser reader. A page that dropped or duplicated a character would
   * be showing a source the digest does not cover, on the page whose subject is that the digest
   * covers it.
   */
  it('every-character-of-a-highlighted-source-reaches-the-reader', () => {
    const source = localSource()
    const held = heldByTheRegistry(source)
    expect(held.length, 'no contract to sweep').toBeGreaterThan(0)

    const sources: string[] = [...THE_HAZARDS]
    for (const one of held) {
      const what = renderContract(one.contract.address)

      for (const file of one.implementation.files) {
        const blob = source.blob(file.sha256)
        expect(blob, `${what} serves no blob for ${file.path}`).not.toBeNull()
        if (blob !== null) sources.push(blob.bytes.toString('utf8'))
      }

      sources.push(whatACardSays(one).signature)
    }

    for (const text of sources) {
      expect(highlighted(text).map((run) => run.text).join('')).toBe(text)
    }
  })

  /**
   * The reason the inks exist at all: the artboard writes every example's answer as a comment, so
   * the comment ink is the one a reader meets on every call this page shows. The call before the
   * answer keeps its own inks, which is what says the comment did not swallow the line.
   */
  it('an-answer-written-as-a-comment-takes-the-comment-ink', () => {
    const call = 'parse("12px")      // null'
    const runs = highlighted(call)

    expect(runs[runs.length - 1]).toEqual({ ink: 'comment', text: '// null' })
    expect(runs[0]).toEqual({ ink: 'function', text: 'parse' })
    expect(inkOn(call, '"12px"')).toBe('string')
  })

  /**
   * The first of the two ambiguities the drive resolves, read through the ink a reader sees: a
   * slash that divides is plain text, and one that opens a regular expression is set as a string.
   * The artboard's own scanner gets exactly this wrong-way-round when the previous-token rule is
   * dropped, which is what the battery's mutant on the drive establishes from the other side.
   */
  it('a-slash-is-inked-for-what-it-does', () => {
    const divided = highlighted('const x = a / b / c')
    expect(divided.filter((run) => run.ink === 'string')).toEqual([])

    expect(inkOn('const re = /ab+c/g', '/ab+c/g')).toBe('string')
  })

  /**
   * The second ambiguity: after a substitution the template resumes in the string ink, and the
   * substitution itself keeps the page's own. The head carries its `${` and the tail its `}`,
   * which is the scanner's own split and what makes the three runs tile the line.
   */
  it('a-template-resumes-in-the-string-ink-after-its-substitution', () => {
    const template = 'const s = `a${b}c`'

    expect(inkOn(template, '`a${')).toBe('string')
    expect(inkOn(template, 'b}')).toBe(null)
    expect(inkOn(template, '}c`')).toBe('string')
  })

  /**
   * A word is inked for what it says: a keyword takes the keyword ink wherever it stands, a word of
   * the artboard's type list takes the type ink even where the scanner calls it a keyword, and a
   * name takes the function ink exactly when its parenthesis is adjacent - the artboard's own
   * lookahead, so `parse (x)` reads as a name and not a call.
   */
  it('a-word-takes-the-ink-of-what-it-says', () => {
    const declared = 'export function parse(text: string): Date { return NaN }'

    expect(inkOn(declared, 'export')).toBe('keyword')
    expect(inkOn(declared, 'return')).toBe('keyword')
    expect(inkOn(declared, 'string')).toBe('type')
    expect(inkOn(declared, 'Date')).toBe('type')
    expect(inkOn(declared, 'NaN')).toBe('type')
    expect(inkOn(declared, 'parse')).toBe('function')
    expect(inkOn(declared, 'text')).toBe(null)

    expect(inkOn('parse (x)', 'parse')).toBe(null)
  })
})
