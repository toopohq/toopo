/**
 * Which line of which file every anchor of every battery quotes.
 *
 * ---------------------------------------------------------------------------
 * What this is for, and what it cost not to have
 * ---------------------------------------------------------------------------
 *
 * A mutant is an edit written as a *quotation* of the source it injects into, so a change that moves
 * a quoted line breaks the battery rather than the code. Nothing says so until a replay reaches that
 * cell, and by then the change is committed: C-19 and A-14 were each found that way, at a replay a
 * time. This asks the same question in seconds and before the change.
 *
 *     npm run anchors                              every anchor, by file
 *     npm run anchors -- packages/registry/foo.ts   the lines of one file a battery quotes
 *
 * The lines it names are the lines a refactor moves at its peril - or moves the anchor with, which is
 * the repair `applyEdits` cannot suggest because by then it only knows that the quotation is gone.
 *
 * **It reads the working tree, and what makes that legitimate is checked rather than assumed.** An
 * anchor is applied after the arm's ref is checked out, so the text it must match is that ref's. Every
 * arm of every battery is `HEAD`, so the working tree is that text; an arm that named another ref
 * would make this report quietly wrong about it, and `refusingAnArmThatIsNotHead` is what stops it.
 *
 * **Lenses are anchors too.** `runCell` applies the lens's edits before the mutant's, so a lens quotes
 * a test file exactly as a mutant quotes an implementation, and a lens whose quotation has moved
 * breaks every cell of its column rather than one. They are walked here for that reason.
 *
 * It is a diagnostic and not a guard. Promoting it costs one of the seven suite totals, which is the
 * unit that promotes it and not this one; until then it is run by hand, by whoever is about to move a
 * line.
 */

import { join } from 'node:path'

import { THE_REPOSITORY } from './paths.ts'
import { THE_BATTERIES } from './published.ts'
import { anchoredText, locateAnchor } from './run.ts'
import type { Battery } from './run.ts'

/** One quotation, addressed the way `applyEdits` labels it and a reader greps for it. */
export type Anchor = {
  readonly battery: string
  /** `mutant I-30 on arm I`, `lens table-blind` - the label a failure to apply would carry. */
  readonly by: string
  /** Repository-relative and forward-slashed, which is how a battery writes it. */
  readonly path: string
}

export type ResolvedAnchor = Anchor & { readonly from: number; readonly to: number }

/** An anchor whose file does not hold its text exactly once, with what was found instead. */
export type LooseAnchor = Anchor & { readonly occurrences: number }

export type AnchorReading = {
  readonly resolved: readonly ResolvedAnchor[]
  readonly loose: readonly LooseAnchor[]
}

type Quotation = Anchor & { readonly find: string }

const quotationsOf = (battery: Battery): readonly Quotation[] => {
  const at = (by: string, file: string, find: string): Quotation => ({
    battery: battery.name,
    by,
    path: `${battery.contractPath}/${file}`,
    find,
  })

  const ofMutants = battery.mutants.flatMap((mutant) =>
    Object.entries(mutant.arms).flatMap(([arm, edits]) =>
      edits.map((edit) => at(`mutant ${mutant.id} on arm ${arm}`, edit.file, edit.find)),
    ),
  )

  const ofLenses = battery.lenses.flatMap((lens) =>
    lens.edits.map((edit) => at(`lens ${lens.id}`, edit.file, edit.find)),
  )

  return [...ofMutants, ...ofLenses]
}

/**
 * The one thing this reading assumes, refused rather than left to be true by luck.
 *
 * A quotation is matched against the arm's ref, and this reads the working tree. The two are the same
 * text only while every arm is `HEAD`.
 */
const refusingAnArmThatIsNotHead = (battery: Battery): void => {
  const elsewhere = battery.arms.filter((arm) => arm.ref !== 'HEAD')

  if (elsewhere.length > 0) {
    throw new Error(
      `${battery.name}: arm ${elsewhere.map((arm) => `${arm.id} is at ${arm.ref}`).join(', ')}, and ` +
        `this reads the working tree. An anchor is matched against its arm's ref, so the lines ` +
        `reported for that arm would be somebody else's.`,
    )
  }
}

export const readAnchors = (batteries: readonly Battery[] = THE_BATTERIES): AnchorReading => {
  const resolved: ResolvedAnchor[] = []
  const loose: LooseAnchor[] = []
  const read = new Map<string, string>()

  for (const battery of batteries) {
    refusingAnArmThatIsNotHead(battery)

    for (const { find, ...anchor } of quotationsOf(battery)) {
      const source = read.get(anchor.path) ?? anchoredText(join(THE_REPOSITORY, anchor.path))
      read.set(anchor.path, source)

      const site = locateAnchor(source, find)
      if (site.applies) resolved.push({ ...anchor, from: site.from, to: site.to })
      else loose.push({ ...anchor, occurrences: site.occurrences })
    }
  }

  return { resolved, loose }
}

const spanOf = (anchors: readonly ResolvedAnchor[]): string => {
  const lines = anchors.flatMap((anchor) => [anchor.from, anchor.to])
  return `${Math.min(...lines)}-${Math.max(...lines)}`
}

const byPath = (anchors: readonly ResolvedAnchor[]): ReadonlyMap<string, ResolvedAnchor[]> => {
  const gathered = new Map<string, ResolvedAnchor[]>()
  for (const anchor of anchors) gathered.set(anchor.path, [...(gathered.get(anchor.path) ?? []), anchor])

  return gathered
}

/** One anchor is an anchor. Written once because all three reports below count the same thing. */
const anchorsCounted = (count: number): string => `${count} anchor${count === 1 ? '' : 's'}`

/** Every file a battery quotes, which is the list a refactor is planned against. */
export const renderEveryFile = (reading: AnchorReading): string => {
  const gathered = [...byPath(reading.resolved)].sort(([left], [right]) => left.localeCompare(right))
  const lines = gathered.map(
    ([path, anchors]) => `  ${String(anchors.length).padStart(3)}  ${path}  lines ${spanOf(anchors)}`,
  )
  const head = `${anchorsCounted(reading.resolved.length)} across ${gathered.length} files`

  return `${head}\n${lines.join('\n')}\n`
}

/**
 * The anchors of one file, which is what somebody about to edit that file needs.
 *
 * *No anchor quotes this file* is read as permission to move any line in it, so it is answered over
 * the loose anchors as well: one that has stopped applying still means a battery is written against
 * this file, and it is the report above that says which.
 */
export const renderOneFile = (reading: AnchorReading, path: string): string => {
  const anchors = reading.resolved.filter((anchor) => anchor.path === path)
  const loose = reading.loose.filter((anchor) => anchor.path === path).length

  if (anchors.length === 0) {
    return loose === 0
      ? `no anchor of any battery quotes ${path}\n`
      : `no anchor still applies to ${path}, though ${anchorsCounted(loose)} quoted it\n`
  }

  const lines = anchors.map(
    (anchor) => `  ${anchor.battery} ${anchor.by}  lines ${anchor.from}-${anchor.to}`,
  )
  const held = `${anchorsCounted(anchors.length)} quote ${path}, at lines ${spanOf(anchors)}`
  const gone = loose === 0 ? '' : `, beside ${anchorsCounted(loose)} that stopped applying`

  return `${held}${gone}\n${lines.join('\n')}\n`
}

/** What a replay would have said, at the end of a replay. */
export const renderLoose = (reading: AnchorReading): string => {
  const lines = reading.loose.map(
    (anchor) =>
      `  ${anchor.battery} ${anchor.by}  ${anchor.path}: quoted text occurs ` +
      `${anchor.occurrences} times, and must occur once`,
  )

  return `${anchorsCounted(reading.loose.length)} stopped applying\n${lines.join('\n')}\n`
}
