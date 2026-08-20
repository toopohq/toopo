import { describe, it, expect } from 'vitest'

import {
  backCitationFaults,
  citationFaults,
  confirmationFaults,
  declarationFaults,
  guardFileFaults,
  linkFaults,
  pathFaults,
  readDecisions,
  reopeningFaults,
} from './decisions.ts'

/**
 * The references this repository makes to its own decisions, resolved in both directions.
 *
 * It is `readme.test.ts` and `contributing.test.ts` aimed at a third kind of document, and it lives
 * here for the reason those two give: `mutation/` is the one folder no battery injects into, so a
 * guard over a document does not force a battery to declare a Markdown file an unprobed region of
 * something it measures.
 *
 * **Eight guards rather than one, because eight different things break.** A path that disappears and a
 * file that never cited back are not one failure, and a guard that answered both would name whichever
 * it found first. Each below has been seen red on its own condition, and each one alone.
 *
 * `decisions.ts` carries what they resolve against, why `resolveGuard` is reused as an address and not
 * as a resolver, and the two limits of reading a title off a source.
 */

const decisions = () => readDecisions()

describe('what a decision record declares', () => {
  /**
   * The shape, which is what stops the seven guards after it from passing over a record silently.
   *
   * Every fault below is counted over declared entries, so a front matter somebody deleted would leave
   * them all green with nothing to iterate. This is the one that fails instead.
   */
  it('every-decision-declares-what-it-governs-and-what-keeps-it', () => {
    expect(declarationFaults(decisions())).toEqual([])
  })

  /**
   * A guard belongs to `confirmed-by`, where it is a resolvable pair, and never to `governs`, where it
   * is a path.
   *
   * Demonstrated by an instance rather than argued: ADR-0010 named `against-the-catalogue.test.ts` under
   * `governs` while declaring `confirmed-by: []`, so the record said in an unresolvable form that a
   * guard kept it and in a resolvable one that none did. That is the drift, arrived, in the first
   * batch of records this repository wrote.
   */
  it('no-decision-governs-a-guard-file', () => {
    expect(guardFileFaults(decisions())).toEqual([])
  })

  /**
   * The trigger ADR-0001 requires beyond MADR's own sections.
   *
   * Its argument is `DeferredNeed.until`'s: a deferral aimed at the wrong event is one nobody
   * revisits, and a reason ages into a description of the past where a trigger stays checkable. It was
   * a required section that nothing required, in the folder whose subject is declarations that hold.
   */
  it('every-decision-says-what-would-reopen-it', () => {
    expect(reopeningFaults(decisions())).toEqual([])
  })
})

describe('what a decision names, and what names a decision', () => {
  /** A decision naming code that has gone. */
  it('every-path-a-decision-governs-exists', () => {
    expect(pathFaults(decisions())).toEqual([])
  })

  /**
   * The other half of the same link, and the half ADR-0001's own `Confirmation` named and nothing
   * kept.
   *
   * Measured on the sixteen records as this guard was written: seven of the twenty-five files named
   * did not cite their decision back, and one entry was a directory. A back-link with no forward link
   * is reachable from the record and invisible from the code, which is the wrong way round - somebody
   * editing a file learns a decision governs it from the file, or never.
   */
  it('every-file-a-decision-governs-cites-it-back', () => {
    expect(backCitationFaults(decisions())).toEqual([])
  })

  /** A pair naming a guard no suite carries, which is a `Confirmation` that confirms nothing. */
  it('every-guard-a-decision-names-is-one-its-suite-collects', () => {
    expect(confirmationFaults(decisions())).toEqual([])
  })

  /**
   * The direction that starts in the code, over every file this repository tracks.
   *
   * The population is asked of git rather than walked, so that a citation surviving in `dist/` - which
   * holds a compiled copy of every comment in `packages/` - can never stand in for one in the source.
   */
  it('every-decision-a-file-cites-exists', () => {
    expect(citationFaults(decisions())).toEqual([])
  })

  /**
   * A link from one record to another, whose label and target must be about the same decision.
   *
   * Existence alone would pass `[ADR-0007](0009-....md)`, which is the one error of this family that
   * misleads rather than breaks: the reader is told a number, sent to a different record, and nothing
   * anywhere disagrees.
   */
  it('every-decision-a-record-links-to-is-the-one-it-names', () => {
    expect(linkFaults(decisions())).toEqual([])
  })
})
