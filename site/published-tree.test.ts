import { describe, it, expect } from 'vitest'

import { emitted } from '../registry/emit.js'
import { localReadApi } from '../registry/local-read-api.js'
import { THE_BROWSER_GRAPH, theReferenceModules } from './browser.js'
import { heldByTheRegistry } from './catalogue.js'
import { localSource } from './local-source.js'
import { thePublishedTree, theSite } from './site.js'

/**
 * The tree that is deployed, as one set of paths.
 *
 * **This is the class a static emission finds and a process never meets.** A server answers
 * `/typescript/number/parse@1` and `/typescript/number/parse@1/implementations` without noticing that
 * one path is a file and the other needs it to be a directory; a filesystem holds one or the other. It
 * is why the answers about a contract live *inside* that contract's folder rather than under a
 * `/contracts` prefix beside the pages, and this is where that decision is kept.
 *
 * The browser modules arrive as paths with no contents, and that is the one thing supplied rather than
 * built: reading this repository's own modules off a disk is `build.ts`'s single exception to
 * everything being reachable from a guard, and a claim about *paths* has no business reopening it.
 */

/**
 * Built once and lazily rather than at the top of the file: a mutant that makes the generator or the
 * serialisation throw would otherwise stop this file collecting, and the instrument reads a file that
 * collected nothing as a run that measured part of the suite. It is the lesson `pages.test.ts` records
 * against W-20, and I-01 is where it was met again.
 */
let published: readonly string[] | null = null

const paths = (): readonly string[] => {
  if (published !== null) return published

  const source = localSource()
  const modules = new Map<string, string>([
    ...THE_BROWSER_GRAPH.map((relative) => [relative.replace(/\.ts$/, '.js'), ''] as const),
    ...theReferenceModules(source, heldByTheRegistry(source)),
  ])

  published = [...thePublishedTree(theSite(source), modules, emitted(localReadApi())).keys()]

  return published
}

/** The characters no Windows filesystem will open a file with, and the separator of the other one. */
const FORBIDDEN = new RegExp('[<>:"|?*\\\\]')

/** Every folder a path implies, which is what a write has to be able to create. */
const foldersOf = (path: string): readonly string[] =>
  path
    .split('/')
    .slice(0, -1)
    .map((_, depth, segments) => segments.slice(0, depth + 1).join('/'))

describe('what a host is given', () => {
  it('no-path-is-both-a-file-and-a-directory', () => {
    const written = paths()
    const folders = new Set(written.flatMap(foldersOf))

    expect(written.filter((path) => folders.has(path))).toEqual([])
  })

  /**
   * A tree written on one operating system and served from another, so the alphabet is the narrower of
   * the two. `@` is legal everywhere and is already in every page address; what is refused here is the
   * set Windows will not open a file with, a segment that means something to a path resolver, and the
   * device names that are not files at all.
   */
  it('every-path-is-one-a-filesystem-can-hold', () => {
    const reserved = /^(con|prn|aux|nul|com\d|lpt\d)(\.|$)/i
    const unholdable = (segment: string): boolean =>
      segment === '' ||
      segment === '.' ||
      segment === '..' ||
      FORBIDDEN.test(segment) ||
      [...segment].some((character) => (character.codePointAt(0) ?? 0) < 32) ||
      segment !== segment.trim() ||
      segment.endsWith('.') ||
      reserved.test(segment)

    expect(paths().filter((path) => path.split('/').some(unholdable))).toEqual([])
  })

  /**
   * The answers are a third of what is deployed and none of what is rendered, so a build that stopped
   * emitting them would publish a site whose every contract page tells a reader to run a command that
   * cannot resolve. The count is not asserted - it moves with the catalogue - but the presence of each
   * kind is.
   */
  it('the-tree-carries-pages-modules-crawler-files-and-answers', () => {
    const written = paths()

    expect({
      pages: written.some((path) => path.endsWith('index.html')),
      modules: written.some((path) => path.endsWith('.js')),
      crawlers: written.includes('sitemap.xml') && written.includes('robots.txt'),
      answers: written.includes('contract-index'),
    }).toEqual({ pages: true, modules: true, crawlers: true, answers: true })
  })
})
