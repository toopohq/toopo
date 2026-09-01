---
status: accepted
date: 2026-08-30
governs:
  - packages/registry/the-catalogue.ts
confirmed-by: []
---

# A refused contract leaves the surfaces somebody browses, and the reason it stays in the repository is written where a sweep will meet it

## Context and Problem Statement

`array/group-by@1` — the catalogue's one refusal — is on the front page, in the catalogue, and has a
page of its own. The owner's position is that a developer arrives to find functions they can use, and
that a refusal on a showcase is noise.

His first instruction was to remove it from the project entirely.

## Decision Outcome

**It leaves every surface somebody browses. It stays in `npx toopo search`. It stays in the
repository, and why it stays is written beside the entry rather than only here.**

### What deleting it would have cost, which is what changed the instruction

Three things, and two of them are mechanisms this repository would have lost on the day it lost them:

- **It is the only contract whose frozen half is still open.** Every other entry of `theCatalogue` is
  `PUBLISHED`. So it is the whole population of
  `no-two-profiles-of-an-unpublished-contract-are-indistinguishable`, the guard ADR-0171 wrote to stop
  the profile-name debt growing — deleting the contract would have left that guard born over nothing,
  which is the shape this repository is built against.
- **It is the whole of `/refusals`.** `refuseContract` is reached only from `never-published`, so
  removing the entry takes the refused count to zero, empties a served answer and stops the refusals
  page being emitted.
- It is the third prototype the contract format was settled on.

**The third is named and then set aside**, because it is not a reason to keep code: it is a fact about
the past, it cannot expire, and the past does not need the source to go on being true. It is written
down so nobody counts it twice.

### Browsing and searching are two different questions

**On a showcase a refusal is noise. In a search a refusal is an answer.** Somebody scrolling the front
page did not ask for `group-by`; somebody typing `toopo search group by` asked for that thing, and
silence would tell them the catalogue holds nothing on the subject when what it holds is a measured
argument against it.

So `the-catalogue-lists-every-contract-and-marks-the-one-it-refuses` and
`a-refused-contract-is-offered-no-install-line` do not move. They are the client's guards, their
subject is intact, and `/refusals` goes on being served — a document rather than a page, which is the
same split `methodology` already has.

**What lands in this unit is nothing.** Unit 2's front page lists only what is installable, so it never
had the refusal on it. The removal from the catalogue page and the deletion of `turned-down-page.ts`
are unit 4's, with the sweep of the guards that read them.

### The saying is beside the thing, and that is ADR-0174's rule rather than a preference

A contract nothing displays and only tests reach is exactly what a dead-code sweep proposes to delete.
[ADR-0174](0174-a-disappearance-nothing-noticed-is-a-question-and-not-a-verdict.md) settled what to do
about that: an unnoticed removal is a question with three answers, and the third is **declared
silent — leave it, and make the saying reachable from the thing**.

So the two surviving reasons are written above the entry in `theCatalogue`, **as conditions rather
than as facts**: the first ends the day an eighth contract is written and not yet published, the
second the day the catalogue refuses a second one. On either day the reason to keep this entry is a
different reason, and somebody has to know that.

### A fourth reason was offered and it was false

*The only instance of `the-marking-alone` a guard can exercise.* It was true when ADR-0159 wrote it,
and it stopped being true when `object/deep-equal@1` was published carrying the same banner form —
[ADR-0172](0172-the-front-page-showed-one-install-as-though-it-were-the-install.md) measured a real
install landing it.

**The comment in `theCatalogue` still said *the one contract*, and that is where the reason came
from.** It is repaired, with the event that expired it named. This is why the two surviving reasons
are conditions: a reason nobody re-reads is a reason that outlives its own truth, and this one
outlived it by three publications with nothing pointing at it.

## Consequences

`packages/registry/the-catalogue.ts` gains the paragraph and a repaired comment. **No digest moves** —
measured, `npm run freeze` is green across the change, and `contracts/typescript/array/group-by/` is
untouched to the byte.

Nothing is deleted, no page is removed, no served answer changes, and the 73 addresses are what they
were.

## Confirmation

**`confirmed-by` is empty, and that is the record's own subject rather than an omission.** What was
decided is that a thing stays. Nothing guards a thing staying; a guard fires on an event, and the
event here is somebody removing an entry, at which point two guards go quiet in ways that look like
success — one over an empty population, one over a refusals answer with no rows.

That is precisely why the reasons are written beside the entry: **the mechanism that keeps this
decision is a paragraph a person reads before they delete something**, and pretending otherwise by
naming a guard that does not check it would be the decorative confirmation this repository refuses.

What *is* measured is the price, and it is measured in the entry itself: the population is one because
every other lifecycle is `PUBLISHED`, and the refused count is one because `refuseContract` has one
caller condition. Both are readable from the file the paragraph sits in.

## What would reopen this

**An eighth contract written and not yet published.** The first reason ends there: the guard gains a
second population member, and this entry stops being what keeps it from being born empty.

**A second refusal.** The second reason ends there: `/refusals` stops depending on one row, and
deleting this entry stops emptying a served answer.

**Both at once, and the entry has no mechanical reason left.** On that day the question is whether a
prototype the format was settled on is worth its folder, and the answer is the owner's — but it is a
different question from the one this record answers, and nothing about today's answer carries over.

## More Information

- [ADR-0174](0174-a-disappearance-nothing-noticed-is-a-question-and-not-a-verdict.md) — the criterion
  this record applies, and the third verdict it is an instance of.
- [ADR-0159](0159-the-copyright-comes-out-of-the-file-that-lands-in-somebody-elses-project.md) — the two banner forms, and the
  sentence that expired.
- [ADR-0171](0171-a-profile-name-is-frozen-with-a-claim-nothing-reads-and-only-the-next-contract-can-still-be-held-to-it.md)
  — the guard whose population this entry is.
