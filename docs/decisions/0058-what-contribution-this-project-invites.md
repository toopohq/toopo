---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/validation/analyse.ts
confirmed-by:
  - battery: meta
    guard: every-figure-in-contributing-is-the-one-the-five-contracts-declare
  - battery: meta
    guard: the-ratio-contributing-argues-from-is-the-one-the-counts-give
  - battery: meta
    guard: every-rule-stage-1-applies-is-named-in-contributing
  - battery: meta
    guard: contributing-names-no-rule-stage-1-does-not-have
  - battery: meta
    guard: every-family-the-census-counts-is-a-field-of-the-record
---

# What contribution this project invites

## Context and Problem Statement

There was no `CONTRIBUTING.md` at all, and the README sent a stranger to `CLAUDE.md` and called it the
project specification — which is the one of its three jobs it does worst.

## Considered Options

- Accept contributions of every kind and review them.
- Invite an implementation, a counter-example and an alias correction, and never a contract.

## Decision Outcome

**An implementation, a counter-example, an alias correction — and never a contract.** It is not a
policy about who is trusted. Counted over the five, the values a contract freezes for the life of its
major outnumber the ones that can be put right by more than three to one, so reviewing a contract means
being right once and for ever about several hundred addresses a later correction cannot reach.
Nobody can do that at the speed a queue arrives at, and a queue reviewed at that speed would freeze its
mistakes into the one thing this registry sells. An implementation freezes nothing: it competes under a
contract that already exists, is judged by running it, and being wrong costs a revision.

**No figure from that census is restated here, and that is this repository's own rule applied at its first
opportunity.** `mutation/contributing.test.ts` derives every one of them from the five records and
requires `CONTRIBUTING.md` to publish it, so a case added tomorrow reddens the document rather than
ageing it. A count copied into a second document would be the part of a true sentence that goes false
while nobody is looking, which is the failure recorded four times over. **When the figure is held by a
guard, the journal names the guard.**

**The corrigible column was right for the wrong reason, and that is the finding.** The obvious split is
the aliases and the twenty universal-property answers — and an *answer* is not corrigible. Declaring an
applicable property inapplicable narrows what the contract claims and breaks nobody; the other
direction turns a conformant implementation into a non-conformant one, which is exactly what permanent
rule 6 forbids. What is corrigible is the **reason** beside each verdict, which is prose. There are as
many reasons as verdicts, so the total never moved — **an error that leaves the arithmetic intact is one
nothing but reading the column can catch**, and the verdict now sits in neither column with the
asymmetry stated.

**The cheapest contribution is the one nobody has ever made.** Adding a case to a group that already
exists costs nothing — no address moves, no caller breaks — and the schema has carried
`found-in-the-wild` beside `specified` and `found-by-mutation` since the day it was written. Measured
over the whole of block 4.4: **183 `specified`, 4 `found-by-mutation`, 0 `found-in-the-wild`.** Every
edge case here was found by writing a contract or by mutating an implementation, and not one came from
somebody using the thing. That is why the counter-example leads the document rather than the
implementation.

## Consequences

**What the document may not do is promise a pipeline that is not there**, on the page that invites
people in. Stage 1 exists and stages 2 to 7 do not; `analyseImplementation` has no caller outside its
own folder's tests, measured rather than assumed. So the five rules are named by their frozen
identifiers and resolved **in both directions** — every rule the modules export occurs in the document,
and every rule-shaped identifier the document's own stage-1 section quotes is one of them. The second
is the dangerous direction: a document naming a filter nobody wrote sends a contributor looking for it,
which is *a diagnostic that names a cause no measurement establishes* arriving on a Markdown file.
**What no mechanism keeps is a sixth rule**, added to that composition and named nowhere — enumerating
them would be a second statement of what `analyseImplementation` composes. It is declared, and it fails
in the safe direction.

**The guard lives in `mutation/` and the placement is an argument rather than a convenience.** Both
folders that own its upstreams are injected into by a battery, and a battery measures whether the
catalogue's own tests catch defects in the catalogue. A guard over a Markdown file is not that, so
putting it in `registry/` would have made `registry-storage` declare a document as an unprobed region
of the registry — the data arranged to suit the tool. `mutation/` is the one folder no battery injects
into, which is `verifiability.ts`'s line and not an escape from a cost.

**The site's section carries no link, and the page's own guard is what makes that structural.**
`every-page-is-reachable-from-the-front-page` compares every `href` on the front page against the set
of pages, so an address outside the site cannot be written there at all — and there is none to write,
because this repository has no public remote and inventing a URL to fill the gap is the class this
project spends its length removing. The file is named and not linked. It carries no figure either: the
ratio is held by a guard one folder away, and restating it would be a second statement of one
measurement on the surface that cannot compute it. **The heading is *What a contribution can be* and
not *What we accept*,** because the front page already carries *What we refuse* two screens up and that
one is about contracts the catalogue turned down.

**And a defect was found by reading the front page in document order and deliberately not repaired.**
The contract list reads `typescript/number/parse@1Convert a string to a finite number…` — the anchor and
the summary under it are one sentence with every word present, which is `not applicableThe signature
takes a single string` on a second page. It is **not** a one-line repair: `a` has no entry in
`document.ts`'s `SEPARATOR`, and giving it one changes the text projection of every anchor on six pages
including the ones inside a sentence. What would close it is a decision about which anchors are labels
and which are inline, and the site battery replayed after it. That is a unit; folding it into a
documentation change would have been the silent widening this repository refuses in the other direction.

It closed in [ADR-0025](0025-what-separates-two-elements-in-a-reading.md).

## Confirmation

Five guards, and they partition what this document can get wrong: a figure that is not the one the
records give, a ratio that is not the one the counts give, a rule stage 1 applies and the document does
not name, a rule the document names and stage 1 does not have, and a family the census counts that is
not a field of the record.

## What would reopen this

Stages 2 to 7 of the validation pipeline, which is what would let a contract be reviewed at the speed a
queue arrives at. The refusal above is about review capacity and about what a major freezes, so it
moves when the review is mechanical rather than when somebody is willing.

## More Information

- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — why no figure of that census is
  restated anywhere.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
