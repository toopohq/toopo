/**
 * What stage 1 answers with.
 *
 * A refusal names the rule, quotes what it refuses, and says where. All three, because a validation
 * report is read by somebody who has to repair a submission: a rule identifier alone leaves them
 * looking, a position alone leaves them guessing which rule, and a sentence alone cannot be addressed
 * by an API response, a page anchor, or a battery pinning what a mutant must produce.
 *
 * `rule` is an identifier of the same shape as every other address in this repository - kebab-case,
 * frozen - because the registry will address a refusal by the pair `(rule, submission)` exactly as it
 * addresses a case by `(contract, case)`.
 */

import type { ParsedSource } from './source.js'
import { positionOf, textOf } from './source.js'
import type { Node } from './typescript-api.js'

export type Finding = {
  /** The rule that refused. Kebab-case, frozen with the pipeline's major. */
  readonly rule: string
  /** `file:line`, so the refusal can be opened rather than searched for. */
  readonly at: string
  /** What was written, verbatim and bounded. A refusal that paraphrases can be wrong about the code. */
  readonly quoted: string
  /** Why this is refused, in the words a submitter is owed. */
  readonly why: string
}

/**
 * A quotation is bounded, because a node can be a whole module and a report that pastes one back is
 * not a report. The elision is marked so that nobody reads a truncation as the whole of what was
 * written.
 */
const QUOTATION_LIMIT = 120

export const quote = (node: Node, source: ParsedSource): string => {
  const text = textOf(node, source).replaceAll(/\s+/g, ' ')

  return text.length <= QUOTATION_LIMIT ? text : `${text.slice(0, QUOTATION_LIMIT)}...`
}

export const findingAt = (
  rule: string,
  node: Node,
  source: ParsedSource,
  why: string,
): Finding => ({
  rule,
  at: positionOf(node, source),
  quoted: quote(node, source),
  why,
})

/** One refusal, as a line a person reads. */
export const renderFinding = (finding: Finding): string =>
  `${finding.at}  ${finding.rule}\n    ${finding.quoted}\n    ${finding.why}`
