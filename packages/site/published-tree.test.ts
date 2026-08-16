import { describe, it, expect } from 'vitest'

import { askedAt } from '../registry/endpoints.js'
import { THE_UNPUBLISHED_REVISION } from '../registry/revision.js'
import { THE_BROWSER_GRAPH } from './browser.js'
import { notFoundPage } from './not-found-page.js'
import { THE_HEADERS_FILE, THE_NOT_FOUND_FILE, markdownOf } from './paths.js'
import { theHeaderRules } from './served-headers.js'
import { thePublication } from './site.js'

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
let built: ReadonlyMap<string, string | Buffer> | null = null
let published: readonly string[] | null = null

const theTree = (): ReadonlyMap<string, string | Buffer> =>
  (built ??= thePublication(
    THE_UNPUBLISHED_REVISION,
    new Map(THE_BROWSER_GRAPH.map((relative) => [relative.replace(/\.ts$/, '.js'), ''])),
  ))

const paths = (): readonly string[] => (published ??= [...theTree().keys()])

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
  /**
   * Every named answer a deployment carries says which revision produced it, and it is the revision the
   * publication was asked for.
   *
   * **It is the guard the two stand-ins' defaults are safe because of.** `localSource` and
   * `localReadApi` fall back to the unpublished revision, which is the honest answer for every guard in
   * this repository and a lie in exactly one place - a deployment. `thePublication` is now the single
   * arrangement and takes the revision with no default, so the omission cannot be written; this is what
   * says the parameter actually reaches the answers rather than being carried and dropped.
   *
   * The bodies are read back out of the tree rather than off the port, which is the same discipline
   * `the-emitted-tree-is-closed` runs on: a guard that asked the read API what it answered would be
   * green for exactly the path where the composition dropped it.
   */
  it('every-named-answer-in-the-tree-names-the-revision-it-was-built-from', () => {
    const A_REVISION = 'c'.repeat(40)
    const tree = thePublication(
      A_REVISION,
      new Map(THE_BROWSER_GRAPH.map((relative) => [relative.replace(/\.ts$/, '.js'), ''])),
    )

    const named: { readonly addressing: string; readonly servedFrom?: unknown }[] = []

    for (const contents of tree.values()) {
      if (!Buffer.isBuffer(contents)) continue

      let body: unknown
      try {
        body = JSON.parse(contents.toString('utf8'))
      } catch {
        continue
      }

      for (const one of Array.isArray(body) ? body : [body]) {
        if (one !== null && typeof one === 'object' && 'addressing' in one) {
          named.push(one as { readonly addressing: string })
        }
      }
    }

    const answers = named.filter((one) => one.addressing === 'named')

    expect(answers.length).toBeGreaterThan(0)
    expect(answers.filter((one) => one.servedFrom !== A_REVISION)).toEqual([])
    // The control: a content-addressed answer says which revision produced it nowhere at all, which is
    // what lets a host cache it for a year under an address that is the digest of its own body.
    expect(
      named
        .filter((one) => one.addressing === 'content-addressed')
        .filter((one) => 'servedFrom' in one),
    ).toEqual([])
  })

  /**
   * That what tells the host how to serve the tree travels inside it, at the root where the host looks.
   *
   * `build.ts` wipes its output folder before writing this map, so a `_headers` produced anywhere else
   * is either deleted on the next build or is a second statement of a policy that has moved. The
   * coverage half - that every answer falls under the rule for its own endpoint - is one screen down;
   * this is the half that says the file is written at all.
   */
  it('the-tree-carries-the-file-the-host-reads-to-serve-it', () => {
    expect(paths().filter((path) => path === THE_HEADERS_FILE)).toEqual([THE_HEADERS_FILE])
  })

  /**
   * Every emitted answer falls under the rule for the endpoint it answers.
   *
   * The check is a necessary condition of Cloudflare's matching and not a re-implementation of it: a
   * splat matches greedily, so a path a rule covers must carry the text on either side of the splat at
   * the ends the rule puts them. **If this is red the host certainly does not match; that it is green
   * is not proof the host does**, and what settles that is a request against the real deployment.
   * `endpoints.test.ts` holds `askedAt` to being `pathTo`'s inverse, which is what lets a rule and a
   * file be resolved to the same endpoint without either being rebuilt from the other.
   */
  it('every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint', () => {
    const ruleFor = new Map(
      theHeaderRules()
        .filter((rule) => !rule.url.includes('://'))
        .map((rule) => [askedAt(rule.url)?.endpoint.id, rule.url]),
    )
    const answers = paths()
      .map((path) => ({ path, asked: askedAt(`/${path}`) }))
      .filter(({ asked }) => asked !== null)

    expect(answers.length).toBeGreaterThan(0)
    expect(
      answers.filter(({ path, asked }) => {
        const url = ruleFor.get(asked?.endpoint.id)
        if (url === undefined) return true
        const [before, after] = url.split('*')

        return !(
          `/${path}`.startsWith(before) &&
          `/${path}`.endsWith(after ?? '') &&
          path.length + 1 >= before.length + (after ?? '').length
        )
      }),
    ).toEqual([])
  })

  /**
   * The file a host reads when it holds nothing at an address, and the three things it must not be.
   *
   * **Measured before it existed**: without a top-level `404.html` the deployment answered 200 and the
   * front page, byte for byte, at every address holding nothing - including
   * `/typescript/array/group-by@1/contract-binding`, which a client reaches by following the index. So
   * `emit.ts`'s *a static host answers 404 for a file that is not there, so the absence is the answer*
   * was false for as long as this file was missing.
   *
   * It is not a page and the three assertions say so in the three ways it could accidentally become
   * one: a twin would be written beside it, the sitemap would list it, and its head would declare a
   * Markdown alternate that resolves differently at every address it is served at. ADR-0101.
   */
  it('the-file-for-an-address-nothing-is-served-at-is-not-a-page', () => {
    const written = new Set(paths())
    const rendered = theTree().get(THE_NOT_FOUND_FILE)

    expect(written.has(THE_NOT_FOUND_FILE)).toBe(true)
    // `markdownOf` is the identity on anything that is not a page - it swaps `index.html` alone - so
    // asking it for this file's twin asks whether this file exists. The stem is swapped here instead,
    // and that difference is why the first spelling of this guard passed for the wrong reason.
    expect(written.has(THE_NOT_FOUND_FILE.replace(/\.html$/, '.md'))).toBe(false)
    expect(notFoundPage().servedBesideItsMarkdown).toBe(false)
    expect(typeof rendered === 'string' && rendered.includes('rel="alternate"')).toBe(false)
  })

  it('the-tree-carries-pages-modules-crawler-files-and-answers', () => {
    const written = paths()

    expect({
      pages: written.some((path) => path.endsWith('index.html')),
      markdown: written.some((path) => path.endsWith('.md')),
      modules: written.some((path) => path.endsWith('.js')),
      crawlers:
        written.includes('sitemap.xml') &&
        written.includes('robots.txt') &&
        written.includes('llms.txt'),
      answers: written.includes('contract-index'),
    }).toEqual({ pages: true, markdown: true, modules: true, crawlers: true, answers: true })
  })

  /**
   * Every page has its Markdown beside it, at the same address, and neither exists without the other.
   *
   * **It is what lets a page's head carry a bare file name.** `rel="alternate"` points at `index.md`
   * with no path in front of it, which is right exactly because the two are siblings - so a page whose
   * twin was written elsewhere, or not written at all, would publish a link to a 404 in the one tag a
   * retriever follows. Nothing about the served HTML would look wrong.
   *
   * Both directions, because the failures are different: a page with no twin is a broken declaration,
   * and a twin with no page is a file nothing points at and nothing serves as anything.
   */
  it('every-page-has-its-markdown-beside-it-at-the-same-address', () => {
    const written = new Set(paths())
    const pages = paths().filter((path) => path.endsWith('index.html'))
    const markdown = paths().filter((path) => path.endsWith('.md'))

    expect(pages.length).toBeGreaterThan(0)
    expect(pages.map(markdownOf).filter((twin) => !written.has(twin))).toEqual([])
    expect(markdown.sort()).toEqual(pages.map(markdownOf).sort())
    // The twin is a different file: a projection written at its page's own address would overwrite it.
    expect(pages.filter((path) => markdownOf(path) === path)).toEqual([])
  })
})
