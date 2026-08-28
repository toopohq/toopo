import { describe, it, expect } from 'vitest'

import { askedAt } from '../registry/endpoints.js'
import { THE_UNPUBLISHED_REVISION } from '../registry/revision.js'
import { THE_BROWSER_GRAPH } from './browser.js'
import { notFoundPage } from './not-found-page.js'
import { THE_HEADERS_FILE, THE_NOT_FOUND_FILE, linkTo, markdownOf } from './paths.js'
import type { HeaderRule } from './served-headers.js'
import { covers, isAboutAPath, theHeaderRules } from './served-headers.js'
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

/**
 * The rules about a path that carry one header, which is how the two families are told apart.
 *
 * By what a rule *says* rather than by which function produced it: `theHeaderRules` merges the two
 * families into one block per pattern, so an endpoint's own space carries both headers in one rule,
 * and asking which family a rule came from would need the merge undone to answer a question the
 * merged file already answers.
 */
const rulesCarrying = (header: string): readonly HeaderRule[] =>
  theHeaderRules()
    .filter(isAboutAPath)
    .filter((rule) => rule.headers.some(([name]) => name === header))

/**
 * A relative address as a browser resolves it: against the folder of the document that carries it.
 *
 * Written here rather than reached for, because `paths.ts` composes addresses and never resolves one -
 * `rootFrom` climbs and this descends, and a function that inverted the other would be the second
 * statement neither of them needs.
 */
const resolvedFrom = (page: string, at: string): string => {
  const where = page.split('/').slice(0, -1)

  for (const segment of at.split('/')) {
    if (segment === '..') where.pop()
    else if (segment !== '.' && segment !== '') where.push(segment)
  }

  return where.join('/')
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
  /**
   * Every address a page hands its search resolves to a file this tree writes.
   *
   * **The claim is perturbed rather than the derivation**, which is the trap ADR-0087 names: asking
   * whether `data-search` holds what `pathTo` returns would establish that one function agrees with
   * itself, and it would be green over a tree that writes neither answer. So the address is resolved
   * the way a browser resolves it - against the folder of the page that declared it - and looked up
   * in the keys of the emitted tree.
   *
   * Two pages of different depth are the reason it is every page rather than one: the front page asks
   * for `contract-index` and a contract page asks for `../../../contract-index`, and only one of those
   * spellings can be got wrong by a constant.
   */
  it('every-address-a-page-hands-its-search-is-one-the-tree-writes', () => {
    const held = theTree()
    const asked = [...held]
      .filter(([path]) => path.endsWith('.html'))
      .flatMap(([path, body]) => {
        const declared = /<div class="search" data-search="([^"]*)"><\/div>/.exec(String(body))
        if (declared === null) return []

        const where = JSON.parse((declared[1] as string).replaceAll('&quot;', '"')) as {
          readonly index: string
          readonly refusals: string
        }

        return [where.index, where.refusals].map((at) => [path, at] as const)
      })

    expect(asked.length).toBeGreaterThan(0)
    expect(
      asked
        .filter(([from, at]) => !held.has(resolvedFrom(from, at)))
        .map(([from, at]) => `${from} asks for ${at}, which is ${resolvedFrom(from, at)}`),
    ).toEqual([])
  })

  it('the-tree-carries-the-file-the-host-reads-to-serve-it', () => {
    expect(paths().filter((path) => path === THE_HEADERS_FILE)).toEqual([THE_HEADERS_FILE])
  })

  /**
   * Every emitted answer falls under the rule for the endpoint it answers.
   *
   * **The check re-implements Cloudflare's matching where it used to state a necessary condition of
   * it**, and what makes that trade acceptable is that both halves of the semantics have since been
   * measured against the real deployment rather than read off a page: a splat spans a slash, and a
   * splat takes an empty remainder. `served-headers.ts` carries both readings and `covers` is their
   * one spelling. `endpoints.test.ts` holds `askedAt` to being `pathTo`'s inverse, which is what lets
   * a rule and a file be resolved to the same endpoint without either being rebuilt from the other.
   *
   * It asks only about the family that says what an answer *is*, which is the one an endpoint owns.
   * How long an answer may be held is a fact about the space it is in, and the two guards below are
   * what keep that.
   */
  it('every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint', () => {
    const ruleFor = new Map(
      rulesCarrying('Content-Type').map((rule) => [askedAt(rule.url)?.endpoint.id, rule.url]),
    )
    const answers = paths()
      .map((path) => ({ path, asked: askedAt(`/${path}`) }))
      .filter(({ asked }) => asked !== null)

    expect(answers.length).toBeGreaterThan(0)
    expect(
      answers
        .filter(({ path, asked }) => {
          const url = ruleFor.get(asked?.endpoint.id)

          return url === undefined || !covers(url, `/${path}`)
        })
        .map(({ path }) => path),
    ).toEqual([])
  })

  /**
   * The entry this closes, as a guard: **every address the tree writes is told how long it may be
   * held, by this repository rather than by whatever the host does that morning.**
   *
   * Measured at `7e3f64a`, before the second family existed: the tree wrote 128 addresses and the
   * rules covered 73, so 55 - every page, every Markdown twin, all sixteen modules and all five files
   * found by convention - fell through to a platform default. Seventeen of them answered
   * `max-age=14400` at the declared origin, which is written in no file of this repository.
   *
   * **It can fail, and that is the whole reason the rules are read off declarations rather than off
   * this tree.** A derivation that walked the emission would agree with the emission by construction
   * and this guard would be the derivation compared with itself - green on every defect it exists to
   * catch, which is ADR-0087's rule arriving on a file rather than on an object. What it compares are
   * two independent statements: the spaces `served-headers.ts` declares, and the addresses `site.ts`
   * writes.
   *
   * A page is asked for at `linkTo`'s spelling and not at its file's, because that is the address a
   * reader's browser sends and therefore the one the host matches: the front page is written
   * `index.html` and requested at `/`.
   */
  it('every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose', () => {
    const told = rulesCarrying('Cache-Control')

    expect(paths().length).toBeGreaterThan(0)
    expect(
      paths().filter((path) => !told.some((rule) => covers(rule.url, `/${linkTo(path)}`))),
    ).toEqual([])
  })

  /**
   * And no address is told either thing twice, which is a fact about the host and not about taste.
   *
   * Cloudflare's documentation for this file says that a request matching several rules *"will
   * inherit all rules' headers"* and that a header applied twice has *"the values joined with a comma
   * separator"*. **So two rules are not a precedence question, they are an addition**: two matching
   * `Cache-Control` rules that agree perfectly would send `max-age` twice in one header, and no order
   * within the file is specified that would let anybody reason about which won.
   *
   * That is why the two families carry different header names and why the space family is keyed on a
   * first segment - a total function of a path, so two of its rules cannot reach one address. This
   * guard is what says the construction held, over what the tree really writes rather than over the
   * shape somebody intended.
   */
  it('every-address-is-told-each-thing-once', () => {
    const twice = paths()
      .map((path) => ({
        path,
        headers: theHeaderRules()
          .filter(isAboutAPath)
          .filter((rule) => covers(rule.url, `/${linkTo(path)}`))
          .flatMap((rule) => rule.headers.map(([name]) => name)),
      }))
      .filter(({ headers }) => new Set(headers).size !== headers.length)

    expect(paths().length).toBeGreaterThan(0)
    expect(twice.map(({ path, headers }) => `${path} is told ${headers.join(', ')}`)).toEqual([])
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
