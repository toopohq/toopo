---
status: accepted
date: 2026-08-21
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/snapshot.ts
  - packages/registry/field-map.ts
  - packages/registry/serialise.ts
  - packages/registry/response.ts
  - packages/registry/the-catalogue.ts
  - packages/site/contract-page.ts
confirmed-by:
  - battery: registry-storage
    guard: every-re-examination-carries-the-commit-it-was-taken-at
  - battery: site
    guard: a-re-examination-reaches-the-reader
---

# A frozen contract cannot say where it stands against a language that moved, so the registry says it

## Context and Problem Statement

`array/group-by@1` established a rule when it was refused admission, and `CLAUDE.md` records it: *the
language moves, so the catalogue re-examines itself against it. Clearing rule 7 is not a property a
contract acquires once and keeps.*

The language moved. Temporal reached TC39 stage 4 in March 2026, is part of ES2026, and Node 26 ships
it unflagged. The contract it stands next to is `date/add@1`, which is published and frozen for life.

So the rule fired for the first time on a contract that had already shipped, and the question is what
the catalogue does about it — which turned out to be a question about what a frozen contract is still
able to say.

### The obvious place is shut, and it was measured rather than reasoned about

`identity.relationToTheLanguage` is the field a contract uses to say where it stands. `contractSnapshot`
freezes `identity` whole. Measured at `ee2d1c1`, adding that field to `date/add@1` moves its contract
digest from `94c5acc7…` to `043afd7d…`, which
`every-published-binding-still-hashes-to-what-it-was-published-as` refuses and permanent rule 6 forbids.

**The second half of the same debt is shut too, and nobody had measured that.**
`packages/catalogue/every-contract.ts` records the gap as *one debt with two symptoms* — the missing
field, and the missing divergence replay — on exactly `date/add@1` and `number/parse@1`. The replay is
a file, a declared file enters `harness`, and `harness` is inside the snapshot: measured, declaring
`language.test.ts` moves `date/add@1` to `ed7f8eeb…` and `number/parse@1` from `d5071a58…` to
`c8ca3819…`.

`number/round@1` carries its replay because it declared it *before* it was published. The window shut
on the four founding contracts on the day the catalogue was published, and the debt describing it
became unpayable through either symptom on the same day.

**And the sentence recording the debt is frozen with them.** `every-contract.ts` is one of
`THE_SHARED_FILES`, so a byte in it moves every contract digest at once — measured, all six, the five
published included. A debt described in a file nobody may correct, naming two repairs nobody may make.

## Considered Options

- Move `date/add@1` to `absorbed-by-the-language`.
- Publish `date/add@2`.
- A record only, leaving the page as it is.
- A field of the standing, filled for `date/add@1`.

## Decision Outcome

**A field of the standing: `againstTheLanguage`, a list of re-examinations, filled for `date/add@1`
and for no other contract.**

`CONTRACT_STANDING_FIELDS` named two candidates on paper before either existed — *anything the registry
curates about a contract*, and *anything a later measurement attaches to an artefact published without
it*. `useCases` filled the first. A measurement taken against Temporal, attached to a contract published
before Temporal existed, is the second, literally. The field is what that comment predicted, and leaving
it on paper on its own instance would be the decorative declaration this repository refuses everywhere
else.

Measured on the finished tree: all six contract digests are byte-for-byte what they were before this
change, and `npm run freeze` is green.

### Why not `absorbed-by-the-language`

Because it would be false, and the measurement is what says so rather than an opinion about Temporal.

Block 4.4 of `date/add@1` was replayed against Temporal at `ee2d1c1` — all forty-three cases of both
tables, the call bridged through `Date.prototype.toTemporalInstant` and `ZonedDateTime.add` under
`constrain`. **Thirty-eight agree and five part, for three causes**: the empty duration, which Temporal
refuses and this contract answers as the neutral element, and which carries three of the five rows;
fields of opposite sign, which Temporal rejects outright; and a field carrying `NaN`, which this
contract refuses and Temporal answered as zero.

The criterion is `array/group-by@1`'s own, and it is exacting: *Map.groupBy answers what this contract
requires on all thirty cases of block 4.4* — every case, replayed. Five is not zero.

**And Temporal parts before it can even be asked.** The declared signature is
`(date: Date, duration: Duration) => Date | null`. Temporal takes no `Date` and returns none; it offers
a replacement type. The bridge the measurement went through had to be written by hand, which is the
difference between a language that shipped this function and a language that shipped a different way to
do the job. `ADR-0007`'s reopening trigger — *the language absorbing a published contract* — has not
fired.

### What the measurement does not establish, carried on every figure of it

**The reading was taken on V8 13.6**, which is what Node 24.15.0 exposes behind `--harmony-temporal`.
That build predates stage 4 by a long way and still carries the `Temporal.TimeZone` and
`Temporal.Calendar` the specification removed. Node 25.6.0 on the same machine has no Temporal at all,
flagged or not, and Node 26 was not available to measure.

So the third cause is **a suspicion and not an established divergence**: the specification requires a
duration field that is not integral to be rejected, so a runtime answering zero for `NaN` was wrong
rather than different. The first two causes are the two this contract already knew about and wrote down
when it was authored.

**The two directions are not symmetrical and the record says which is which.** That the contract stands
is robust to the caveat — a later Temporal that rejects `NaN` parts from this contract on *more* rows,
never fewer, since this contract refuses `NaN` too. What the caveat threatens is only the count.

### A finding about the replay debt, from inside it

The header of `edge-cases.ts` says every answer was computed by two independent oracles, Temporal under
`constrain` and luxon, and that *they agreed on every case except the two where this contract knowingly
takes a side*. The replay above finds five partings, of which three reduce to one of those two. **The
fifth is marked nowhere.**

This is not a claim that the header is false. It is that **the oracle's protocol is written nowhere**,
so nothing can say whether the bridge above is the bridge that was used. That is exactly what a declared
replay buys and a sentence about an oracle does not, and it is the strongest argument this repository
has for the file `date/add@1` is now unable to declare.

### Why `date/add@1` and not `number/parse@1`, which owes the same debt

They are two cases, and [ADR-0128](0128-what-a-contract-refuses-to-be-is-published-and-frozen-already.md) is what
separates them rather than taste.

`number/parse@1`'s language has not moved: `Number`, `parseFloat` and `parseInt` are ES1-era and nothing
at TC39 touches them. And its `description` — inside the frozen half — already enumerates the
divergences: `Number("")` returns 0, `Number("0x1F")` returns 31, `parseFloat("1.2.3")` returns 1.2,
`parseInt("1e3")` returns 1. A standing field restating them would be a second statement **one half of
which permanent rule 6 makes unremovable for the life of the major**, which is the duplication ADR-0128
refuses and for its exact reason: neither side could ever be repaired.

`date/add@1`'s frozen half says nothing whatever about Temporal, because Temporal did not exist when it
was written. There is nothing to restate.

**So the test for a seventh contract reaching for this field is not *has its language moved* but *does
its frozen half already say so*.** Where the frozen half speaks, the field is refused; where the frozen
half is silent because the language moved afterwards, it is the only place an answer can go.

### Why not `date/add@2`

Nothing about the contract is wrong. A major exists for an incompatible evolution, and a re-examination
that concludes *this stands* is the opposite of one.

### Why not a record alone

The conclusion of this record is what makes the field necessary. A reader arriving on
`/typescript/date/add/` from a search in 2027, knowing Temporal exists, asks one question before any
other, and a record in `docs/decisions/` is not where they are standing. Publishing the reasoning and
leaving the page mute would put the answer everywhere except where the question is asked.

## Consequences

**The page answers the question above the line.** The three statements render as paragraphs under *What
it does*, beside `identity.relationToTheLanguage` — which is where the four contracts that carry that
field already answer it — so the re-examination costs no rail entry and no section.
[ADR-0119](0119-the-page-is-read-in-two-halves.md) drew the line between what a reader needs
before deciding and the evidence below it; *is this still the thing to use* is above it.

**Three fields, because they are three kinds of statement.** What moved is a fact about somebody else's
specification; the measurement is a reading with its coordinates and its limits; what it establishes is
a conclusion. [ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) is why the last two
are not one field: a conclusion offered without its premise is assertion, and folding them together is
how a report comes to name a cause no measurement carries. `a-re-examination-reaches-the-reader` asserts
all three by name for the same reason — losing any one leaves something worse than silence, and losing
`whatItEstablishes` leaves a reader holding a divergence count and inferring the opposite of what it
says.

**The stamp is prose and not a field, so that something already resolves it.** The commit is written
into `measurement` in backticks, which is the spelling `citationFaults` sweeps over
`theEditableSources()`; `the-catalogue.ts` is tracked and frozen by nothing, so it is inside that
population already. A `measuredAt` field would have been a coordinate nothing checked.
`every-re-examination-carries-the-commit-it-was-taken-at` is about *presence*, `citationFaults` is about
*reference*, and neither can see the other's defect.

**All three fields are `documentary`, and that is a statement about what can be checked rather than
about what was wanted.** The reading behind them is executable and is not here — see below.

**One anchor of `registry-storage` moved, both halves, and it is the second time for one reason.** I-12
attaches to the last member of the contract binding, because the defect it injects *adds* a member. The
standing gaining `useCases` moved it once and `againstTheLanguage` has moved it again, so it is a cost
per field the standing ever gains rather than an accident. The replacement was applied by hand and the
mutant was injected by hand to check it still means what it says: it reddens exactly its six pinned
`a-contract-binding-carries-only-the-address` guards.

## Confirmation

`every-re-examination-carries-the-commit-it-was-taken-at` in
`packages/registry/against-the-catalogue.test.ts` refuses a re-examination with no coordinate; seen red
at `ee2d1c1` with the stamp taken out of `date/add@1`, naming the contract.
`a-re-examination-reaches-the-reader` in `packages/site/pages.test.ts` refuses a rendering that drops
any of the three; seen red with `whatItEstablishes` removed from the page, naming the field.

The partition guards of `snapshot.test.ts` are what forced the field to be declared as standing rather
than frozen, and `every-standing-field-a-contract-declares-is-carried-by-one` is what stops it being
declared and left unfilled.

## What would reopen this

**The executable replay, which is blocked on a runtime and not on a decision.** The suite matrix is
`['22.18.0', '24']` and neither has Temporal. `array/group-by@1`'s `language.test.ts` sets the rule a
replay here would have to follow — *a runtime without the function fails loudly instead of skipping,
because a guard that did not run is not a guard that passed* — so a replay written today reddens both
legs. It reopens the day the matrix reaches Node 26, and what it will have to answer then is that a
frozen folder cannot hold it: it would live outside `contracts/typescript/date/add/`, which is the cost
below.

**A second contract of the catalogue whose language moves under it.** The test it has to pass is the one
above — whether its own frozen half already says so — and not merely that something moved.

**Temporal on a runtime this repository can reach.** Every figure here is V8 13.6's, and the `NaN` cause
is the one a later reading would most likely settle.

## More Information

**What this costs, stated rather than smoothed: two published contracts, two levels of verifiability,
for a reason of calendar.** An auditor who fetches the snapshot of `number/round@1` receives
`language.test.ts` with it and can replay what the contract claims about the language. An auditor who
fetches the snapshot of `date/add@1` receives seven files and no replay, and the re-examination reaches
them only if they ask the registry rather than the artefact — which is the one thing every other proof
here is built to avoid needing.

The debt itself, and the fact that it is now unpayable by either symptom, is recorded in `CLAUDE.md`
among what this repository declares and nothing keeps.
