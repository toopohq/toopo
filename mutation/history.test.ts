import { describe, it, expect } from 'vitest'

import {
  THE_COMMIT_DECLARATION,
  THE_REFUSED_ADDRESSES,
  addressSites,
  citationsMade,
  deadCitationFaults,
  digestOf,
  refusedAddressFaults,
  strayWorktreeFaults,
  theHistory,
} from './history.ts'

/**
 * What this repository says about its own history, resolved against what git holds. ADR-0095.
 *
 * It is `decisions.test.ts` aimed at a fourth kind of reference, and it lives here for the reason that
 * file gives: `mutation/` is the folder no battery injects into, so a guard over a document does not
 * force a battery to declare a Markdown file an unprobed region of something it measures.
 *
 * **Three of the nine resolve a reference, four keep the readings that feed them honest, and two fire
 * a refusal this repository cannot produce.** A resolver whose sweep reaches nothing is green for ever
 * and says nothing, which is the shape this whole module exists against: `THE_COMMITS_QUOTED` looked
 * like a guard on exactly these identifiers for a year and never asked git a question about any of
 * them.
 *
 * The last two are not a weaker kind. Each hands its reading a population of its own because the real
 * one cannot exhibit the case: seven hexadecimal digits do not collide over three hundred and
 * ninety-four commits, and the declaration cannot be exercised with the address it declares without
 * writing that address into this file. What they perturb is the claim - an identifier two commits
 * answer to, an address written where a person writes one - and never something computed from it.
 */

describe('what this repository cites of its own history', () => {
  /**
   * The direction that starts in the prose, over every file this repository tracks.
   *
   * `git rev-list --all` is the population and not `git rev-parse`, because the objects a rewrite
   * replaces outlive it: measured on this repository, the three commits an amendment and a rewrite had
   * just replaced were all resolved by `rev-parse` and held by none of `--all`. A guard on the first
   * would have been green the morning it existed to be red.
   */
  it('every-commit-this-repository-cites-is-one-it-has :: an identifier in the prose resolves', () => {
    expect(deadCitationFaults()).toEqual([])
  })

  /**
   * The reading beneath that guard, which is green and empty in exactly the same way.
   *
   * Both halves are named because they fail apart: a regex that stopped matching leaves the prose
   * unresolved, and a declaration that stopped being read leaves `published.ts`'s five identifiers
   * unresolved while the prose still passes.
   */
  it('the-citation-sweep-reaches-the-prose-and-the-declaration :: neither half is empty', () => {
    const made = citationsMade()

    expect(made.filter((citation) => citation.by.endsWith('.md'))).not.toEqual([])
    expect(made.filter((citation) => citation.by.endsWith('.ts'))).not.toEqual([])
    expect(made.filter((citation) => citation.by === THE_COMMIT_DECLARATION)).not.toEqual([])
  })

  /**
   * The refusal the guard above cannot produce: an abbreviation two commits answer to.
   *
   * Seven hexadecimal digits collide about once in fourteen thousand commits and this repository has
   * three hundred and ninety-four, so the branch would ship asserted and never seen. It is the branch
   * that matters as the graph grows, and resolving such an identifier to the first match would send a
   * reader to a commit the sentence around it is not about.
   */
  it('an-identifier-two-commits-answer-to-is-refused :: exactly one, never at least one', () => {
    const shared = 'a'.repeat(7)
    const twins = [`${shared}${'0'.repeat(33)}`, `${shared}${'1'.repeat(33)}`]

    expect(deadCitationFaults([{ identifier: shared, by: 'somewhere' }], twins)).toEqual([
      `somewhere cites ${shared}, which 2 commits answer to`,
    ])
    expect(deadCitationFaults([{ identifier: shared, by: 'somewhere' }], [twins[0] as string])).toEqual(
      [],
    )
  })
})

describe('what the graph carries', () => {
  /** An address this repository refuses to publish, written into a commit or into a tag. */
  it('no-object-of-the-graph-carries-a-refused-address :: the negative, swept over --all', () => {
    expect(refusedAddressFaults()).toEqual([])
  })

  /**
   * That the sweep above reaches every commit there is, and the tags beside them.
   *
   * The commit half is total rather than a sample: seventeen commits of this repository are reached
   * only by its `evidence/*` tags, and a sweep that quietly stood on a branch is the exact door the
   * unit before this one found open.
   */
  it('the-address-sweep-reaches-the-commits-and-the-annotated-tags :: over the whole graph', () => {
    const swept = new Set(addressSites().map((site) => site.at))

    expect(theHistory().filter((commit) => !swept.has(`commit ${commit.slice(0, 7)}`))).toEqual([])
    expect([...swept].filter((at) => at.startsWith('refs/tags/'))).not.toEqual([])
  })

  /**
   * A declaration that refuses nothing, or that refuses something no digest can equal.
   *
   * Both are silent: the guard above stays green and stops being about anything. A digest is
   * unreadable by eye, so the shape is what a mistyped one is caught by.
   */
  it('a-refused-address-is-declared-as-a-well-formed-digest :: and there is one', () => {
    expect(THE_REFUSED_ADDRESSES).not.toEqual([])
    expect(THE_REFUSED_ADDRESSES.filter((digest) => !/^[0-9a-f]{64}$/.test(digest))).toEqual([])
  })

  /**
   * That the digest column really is sha-256 of the lowercased address, against a fixed vector.
   *
   * The vector is the project's own published address, which every commit here carries and which this
   * declaration must never hold. It settles both halves at once: a `digestOf` that stopped hashing, or
   * stopped normalising, answers something other than this string.
   */
  it('an-address-is-digested-from-its-lowercased-self :: against a fixed vector', () => {
    expect(digestOf('  HELLO@Toopo.dev  ')).toBe(
      'dabc3e5acf151779bacea535e5a71e919d40dd7333f8113b4e80895be9da0e9d',
    )
    expect(THE_REFUSED_ADDRESSES).not.toContain(digestOf('hello@toopo.dev'))
  })

  /**
   * That the sweep really finds an address, digests it and matches it — every step of the one above.
   *
   * The declaration cannot be exercised with the address it declares, because writing that address
   * into this file is what the declaration exists to prevent. So the site and the refusal are both
   * this guard's own, and the address it uses is the project's published one. What it establishes is
   * that a header and a trailer are both reached, that two spellings of one address are one fault, and
   * that a site carrying nothing declared is silent.
   */
  it('an-address-in-free-text-is-found-and-matched :: the declaration fires', () => {
    const digest = digestOf('hello@toopo.dev')
    const carrying = {
      at: 'commit 0000000',
      text: 'somebody <hello@toopo.dev>\n\nCo-Authored-By: Somebody Else <HELLO@toopo.dev>',
    }
    const inProse = { at: 'commit 2222222', text: 'the address is *hello@toopo.dev*, and it moved.' }
    const clean = { at: 'commit 1111111', text: 'somebody <nobody@example.invalid>' }

    expect(refusedAddressFaults([carrying], [digest])).toEqual([
      `commit 0000000 carries the address declared at ${digest}`,
    ])
    expect(refusedAddressFaults([inProse], [digest])).toEqual([
      `commit 2222222 carries the address declared at ${digest}`,
    ])
    expect(refusedAddressFaults([clean], [digest])).toEqual([])
  })
})

describe('what is registered against this repository', () => {
  /**
   * A checkout that outlived the run that made it.
   *
   * `run.ts` refuses to start on the same reading; this reports it at the cadence of the suite, so the
   * answer arrives before a commit rather than at the next thing to read git. The state it names was
   * found here twice by hand, once naming a commit that was no longer the head.
   */
  it('no-worktree-is-registered-beside-this-repository :: only the root may be', () => {
    expect(strayWorktreeFaults()).toEqual([])
  })
})
