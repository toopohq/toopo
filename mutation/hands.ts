/**
 * How many commits wrote each paragraph of prose this repository holds. ADR-0112.
 *
 * A paragraph **has an author** when one commit's blame covers every one of its lines. It stops
 * having one the moment two are needed, and the count of distinct commits over a paragraph is what
 * this module calls its *hands*. Nothing else here is a judgement: a paragraph with three hands is
 * one three units edited without any of them touching what the others left, which is where a
 * sentence continuing a clause four commits above it comes from. Whether that paragraph is damaged
 * is a reading, and the report says where to read rather than what is wrong.
 *
 * ---------------------------------------------------------------------------
 * Why this reports and refuses nothing
 * ---------------------------------------------------------------------------
 *
 * A guard over hands would be satisfied most cheaply by a reflow. `git blame` attributes a line to
 * the commit that last changed it, so a commit that rewraps a paragraph returns it to one hand with
 * the prose untouched - and a check whose cheapest satisfaction is a whitespace change converts a
 * signal into a ritual. ADR-0112 carries that argument and the entry `CLAUDE.md` keeps for the class.
 *
 * What is guarded is this module's own coverage, not the tree's prose: `hands.test.ts` asks whether
 * the extraction visited every source it claims to have swept, because a reading that silently saw
 * nothing is indistinguishable from a clean tree.
 *
 *     npm run hands                    the distribution, and every paragraph at three hands or more
 *     npm run hands -- CLAUDE.md       the paragraphs of one file, with the hands on each
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { THE_REPOSITORY, git, trackedSources } from './paths.ts'

/** A run of prose read as one unit: a paragraph of a record, or one of a comment block. */
export type Paragraph = {
  /** Repository-relative and forward-slashed, as git spells it. */
  readonly path: string
  readonly from: number
  readonly to: number
  /** The prose, joined and with its wrapping collapsed, so a re-flow is not a different paragraph. */
  readonly text: string
}

export type HandedParagraph = Paragraph & { readonly hands: number }

export type HandsReading = {
  /** Every file the extraction visited, including those holding no prose at all. */
  readonly visited: readonly string[]
  readonly paragraphs: readonly HandedParagraph[]
}

/**
 * Which of this repository's bodies of prose a file belongs to.
 *
 * Derived from the path rather than listed, for the reason `paths.ts` gives about asking git: a
 * typed list of what this repository contains is a second statement of it, free to drift from the
 * first. A new folder therefore lands in a named population without anybody choosing one.
 */
export const populationOf = (path: string): string => {
  if (path.startsWith('mutation/')) return 'instrument'
  if (path.startsWith('docs/decisions/')) return 'records'
  if (path.endsWith('.md')) return 'prose'
  if (path.endsWith('.test.ts') || path.endsWith('.test-d.ts')) return 'guards'

  return 'production'
}

const collapsed = (lines: readonly string[]): string => lines.join(' ').replace(/\s+/g, ' ').trim()

type Line = { readonly number: number; readonly text: string; readonly indented: boolean }

/**
 * A paragraph is a run of non-empty lines, and a sample is not prose.
 *
 * An indented run inside a comment is a shell transcript or a code sample - `paths.ts` and
 * `anchors.ts` both carry one - and its lines are neither wrapped nor argued, so counting hands on
 * it would report a formatting change as an edit to an argument.
 */
const paragraphsOf = (path: string, lines: readonly Line[]): readonly Paragraph[] => {
  const gathered: Paragraph[] = []
  let run: Line[] = []

  const close = (): void => {
    const prose = run.length > 0 && !run.every((line) => line.indented)
    if (prose)
      gathered.push({
        path,
        from: run[0].number,
        to: run[run.length - 1].number,
        text: collapsed(run.map((line) => line.text)),
      })
    run = []
  }

  for (const line of lines) {
    if (line.text.trim() === '') close()
    else run.push(line)
  }
  close()

  return gathered.filter((paragraph) => paragraph.text !== '')
}

const THE_COMMENT_MARGIN = /^\*\/?\s?/

/** The prose of a TypeScript file: what its comments say, with the margin every line carries taken off. */
const commentProse = (path: string, source: string): readonly Paragraph[] => {
  const lines: Line[] = []
  let inside = false

  source.split(/\r?\n/).forEach((raw, index) => {
    const trimmed = raw.trim()
    const opening = !inside && trimmed.startsWith('/*')
    if (opening) inside = true

    if (inside) {
      const body = opening ? trimmed.replace(/^\/\*+/, '') : trimmed.replace(THE_COMMENT_MARGIN, '')
      const text = body.replace(/\*\/$/, '').trim()
      lines.push({ number: index + 1, text, indented: /^\s*\*\s{4,}\S/.test(raw) })
      if (trimmed.includes('*/')) {
        inside = false
        lines.push({ number: index + 1, text: '', indented: false })
      }
      return
    }

    if (trimmed.startsWith('//')) {
      lines.push({ number: index + 1, text: trimmed.replace(/^\/\/+\s?/, ''), indented: false })
      return
    }

    lines.push({ number: index + 1, text: '', indented: false })
  })

  return paragraphsOf(path, lines)
}

const A_FENCE = /^\s*```/
const A_HEADING = /^#{1,6}\s/
const A_LIST_ITEM = /^\s*(?:[-*]\s|\d+\.\s)/
const THE_FRONT_MATTER_RULE = '---'

/**
 * The prose of a record or of `CLAUDE.md`.
 *
 * A list item is a paragraph of its own, because that is the unit an entry of `CLAUDE.md`'s debts is
 * written and rewritten as. A heading is not prose and a fenced block is not wrapped, so neither is
 * counted; both close the paragraph before them.
 *
 * **A record's front matter is skipped, and that is a boundary rather than a convenience.** ADR-0001
 * settles the fields a record carries above the rule - `status`, `governs`, `confirmed-by` - and they
 * are structured data whose lines are edited one at a time by whatever moves the thing they name. Read
 * as prose they form a paragraph that gains a hand every time a guard is renamed, which reports a
 * field edit as an edit to an argument.
 */
const markdownProse = (path: string, source: string): readonly Paragraph[] => {
  const lines: Line[] = []
  const rows = source.split(/\r?\n/)
  const opensFrontMatter = rows[0]?.trim() === THE_FRONT_MATTER_RULE
  let fenced = false
  let inFrontMatter = opensFrontMatter

  rows.forEach((raw, index) => {
    const blank = { number: index + 1, text: '', indented: false }
    if (inFrontMatter) {
      if (index > 0 && raw.trim() === THE_FRONT_MATTER_RULE) inFrontMatter = false
      lines.push(blank)
      return
    }
    if (A_FENCE.test(raw)) {
      fenced = !fenced
      lines.push(blank)
      return
    }
    if (fenced || A_HEADING.test(raw)) {
      lines.push(blank)
      return
    }
    if (A_LIST_ITEM.test(raw) && lines.length > 0) lines.push(blank)

    lines.push({ number: index + 1, text: raw.replace(A_LIST_ITEM, '').trim(), indented: false })
  })

  return paragraphsOf(path, lines)
}

export const proseOf = (path: string): readonly Paragraph[] => {
  const source = readFileSync(join(THE_REPOSITORY, path), 'utf8')

  return path.endsWith('.md') ? markdownProse(path, source) : commentProse(path, source)
}

const A_BLAME_LINE = /^([0-9a-f]{40}) \d+ (\d+)/

/** Which commit last wrote each line of a file, as git answers it. */
const blameOf = (path: string): ReadonlyMap<number, string> => {
  const attributed = new Map<number, string>()

  for (const row of git('blame', '--line-porcelain', '--', path).split('\n')) {
    const header = A_BLAME_LINE.exec(row)
    if (header !== null) attributed.set(Number(header[2]), header[1])
  }

  return attributed
}

/**
 * The one thing this reading assumes, refused rather than left to be true by luck.
 *
 * A paragraph git attributes to nobody would be counted at zero hands and would sit below every
 * threshold a reader applies, so a blame this module failed to parse would report a clean tree
 * rather than a failure. That is the shape `CLAUDE.md` keeps an entry for - ignored is not failed,
 * and the two are indistinguishable to anything that counts.
 */
const refusingAnUnattributedParagraph = (paragraph: HandedParagraph): void => {
  if (paragraph.hands === 0)
    throw new Error(
      `${paragraph.path}:${paragraph.from}-${paragraph.to} is attributed to no commit at all, so ` +
        `this reading would report it as the cleanest prose in the repository. git blame answered ` +
        `nothing for those lines.`,
    )
}

export const handsOn = (path: string): readonly HandedParagraph[] => {
  const attributed = blameOf(path)

  return proseOf(path).map((paragraph) => {
    const commits = new Set<string>()
    for (let line = paragraph.from; line <= paragraph.to; line++) {
      const commit = attributed.get(line)
      if (commit !== undefined) commits.add(commit)
    }

    const handed = { ...paragraph, hands: commits.size }
    refusingAnUnattributedParagraph(handed)

    return handed
  })
}

/** Every paragraph of every tracked source, with the count of commits that wrote it. */
export const readHands = (paths: readonly string[] = trackedSources()): HandsReading => ({
  visited: paths,
  paragraphs: paths.flatMap((path) => handsOn(path)),
})

/**
 * How many hands are worth reporting, and why the number is not a verdict.
 *
 * Two hands is a paragraph somebody corrected, which is ordinary and was measured to be: a sample of
 * the two-hand paragraphs at `50cc54f` reads clean. Three is the first count at which two separate
 * units have edited a paragraph without either touching what the other left. It is where the report
 * starts listing, and ADR-0112 publishes what a reading of the list found: of the twenty-two at
 * `50cc54f`, some needed rewriting and some did not.
 */
export const THE_REPORTING_DEPTH = 3

const byPopulation = (
  paragraphs: readonly HandedParagraph[],
): ReadonlyMap<string, HandedParagraph[]> => {
  const gathered = new Map<string, HandedParagraph[]>()
  for (const paragraph of paragraphs) {
    const population = populationOf(paragraph.path)
    gathered.set(population, [...(gathered.get(population) ?? []), paragraph])
  }

  return gathered
}

const distribution = (paragraphs: readonly HandedParagraph[]): string => {
  const counted = new Map<number, number>()
  for (const paragraph of paragraphs)
    counted.set(paragraph.hands, (counted.get(paragraph.hands) ?? 0) + 1)

  return [...counted]
    .sort(([left], [right]) => left - right)
    .map(([hands, count]) => `${hands}:${count}`)
    .join('  ')
}

/** The distribution per population, then every paragraph a reader is being asked to go and read. */
export const renderHands = (reading: HandsReading): string => {
  const populations = [...byPopulation(reading.paragraphs)].sort(([left], [right]) =>
    left.localeCompare(right),
  )
  const rows = populations.map(
    ([population, paragraphs]) =>
      `  ${population.padEnd(12)} ${String(paragraphs.length).padStart(5)} paragraphs   ` +
      distribution(paragraphs),
  )

  const deep = reading.paragraphs
    .filter((paragraph) => paragraph.hands >= THE_REPORTING_DEPTH)
    .sort((left, right) => right.hands - left.hands || left.path.localeCompare(right.path))
  const listed = deep.map(
    (paragraph) =>
      `  [${paragraph.hands}] ${paragraph.path}:${paragraph.from}-${paragraph.to}\n` +
      `      ${paragraph.text.slice(0, 140)}`,
  )

  return (
    `${reading.paragraphs.length} paragraphs across ${reading.visited.length} tracked sources\n` +
    `${rows.join('\n')}\n\n` +
    `${deep.length} at ${THE_REPORTING_DEPTH} hands or more\n${listed.join('\n')}\n`
  )
}

/** The paragraphs of one file, which is what somebody about to rewrite that file needs. */
export const renderOneFile = (path: string): string => {
  const paragraphs = handsOn(path)
  if (paragraphs.length === 0) return `${path} holds no prose this reads\n`

  const lines = paragraphs.map(
    (paragraph) =>
      `  [${paragraph.hands}] lines ${paragraph.from}-${paragraph.to}  ` +
      `${paragraph.text.slice(0, 110)}`,
  )

  return `${paragraphs.length} paragraphs in ${path}\n${lines.join('\n')}\n`
}
