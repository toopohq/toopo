---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A frozen field that is a constant refuses nothing, and the runtime nobody measured ships the language

> **This record writes no contract, takes none of the three repairs it prices, and moves no digest.**
> It answers the question ADR-0218 and ADR-0219 left standing — what it would cost for ADR-0216's
> candidate to be writable — and it settles the floor that was expected to refuse it before pricing
> anything else, because if that floor refuses then the other two are moot.

## Context and Problem Statement

ADR-0217 narrowed ADR-0216's residue to one shape and said the choice was the owner's. ADR-0218
priced the playground and named three repairs. ADR-0219 refuted the cheap route round the first of
them. What none of the three did is ask whether the catalogue can **declare** the runtime such a
contract needs, and that question was put ahead of the pricing on the ground that a contract whose
required environment cannot be stated honestly is one this catalogue cannot publish at all — a
fourteenth refusal ground, proposed the way R13 and R2 were proposed, before the candidate rather
than after it.

The reading that motivated it: `environments` is inside `contractSnapshot`, its vocabulary carries
runtimes and never versions, and a Temporal contract would therefore declare three runtimes of which
two would be false, for life, in a field nothing executes.

**The premise is refuted, the ground does not exist, and the obstacle is one floor down.** A second
reading, taken because the first floor came back clear, refutes a claim this repository has been
carrying unmeasured since ADR-0150.

## Decision Drivers

* A floor that refuses makes the others moot, so it is settled first and alone.
* A refusal ground is worth more than a candidate, and a fourth negative would have been the most
  informative of the four. It is not manufactured for that reason.
* Nothing here is repaired: `value.ts` is the freeze's own encoder, `environments` is frozen, and the
  matrix is what the owner pays for in CI. All three are his.

## Decision Outcome

### The floor that was to refuse it — settled, and it does not

Measured at `a0bbf86`. The four readings put to this record all hold:

| reading | result |
| --- | --- |
| `serialise.ts:855` — `environments` reads `targetEnvironments` | holds |
| `the-sixth-contract.test.ts:134` — `['node', 'browser', 'bun']` | holds |
| `field-map.ts:205` — `verification: 'documentary'` | holds |
| the vocabulary carries runtimes, never versions | holds, and it is prose alone |

What they do not say is the half that decides. Swept over the tree:

* `contract-record.ts:475` declares `readonly environments: readonly string[]` — **no union, no
  vocabulary type, nothing a value could fail to be.**
* `snapshot.ts:122` puts it in `FrozenContract` and `snapshot.ts:306` in `contractSnapshot`. It is
  inside the digest.
* **Nothing reads it.** Zero occurrences in `packages/validation/`, zero in `packages/site/`, zero in
  `packages/cli/`. Stage 1 does not see it, no page renders it, no client fetches it.
* **All seven contracts declare the same three.** `array/group-by`, `date/add`, `number/parse`,
  `number/round`, `object/deep-equal`, `string/levenshtein` and `string/slugify` each write
  `['node', 'browser', 'bun'] as const`. The field is a constant.
* **No comment in this repository declares what it means.** `contract-record.ts:475` is a bare line
  between two documented siblings; `every-contract.ts:58` names it only as one of the seven exported
  names; no `contract.ts` carries a comment above it.

The meaning is declared in exactly one place, and it is a record: [ADR-0006](0006-the-shape-is-neutral-and-the-content-is-typescript.md)
says `environments` is *a vocabulary of JavaScript runtimes* and *the runtimes the contract is written
for*, and it observed the constant at the time — *five of five carry the same three*.

**So the premise inverts.** Under the only declared meaning there is, none of the three would be false
on a Temporal contract: such a contract *is* written for node, browser and bun. What it needs is a
**version** of each, and a version is not in the field's vocabulary by ADR-0006's own words. The falsity
the question expects requires reading the field as *runs today on*, and no sentence in this repository
says that.

The sharper form of the same fact: **a constant cannot be contradicted.** The field distinguishes
nothing across seven contracts, so there is nothing in it for an eighth to make false.

On the middle issue — whether the field could gain a version — the answer is measured on both sides
and they disagree. `readonly string[]` **admits** `'node>=26'`; ADR-0006 **refuses** it, a version
predicate not being a runtime; and **nothing executes either**, the field being `documentary`. So it
is a type workaround whose only refusal is a sentence in a record no mechanism reads. That is the
answer to *legitimate or a contournement*: it is a contournement, and the repository cannot tell you
so.

### The fourteenth ground, and why there is not one

The proposed form — *a function whose required environment is not declarable is one this catalogue
cannot publish honestly* — fails on its own population.

**The requirement is declarable.** `identity.description` and `identity.inputDomain` are inside the
frozen half and are where every other statement of what a contract is for and refuses already lives;
`number/parse@1` says *not a locale-aware parser* there, and `string/levenshtein@1` says *not a
similarity ratio, not a phonetic match*. A Temporal contract can say *requires a runtime implementing
Temporal* in the same field, at the same grade of verification as everything else it says.

**And a ground that refused a candidate for being undeclarable-by-mechanism would refuse all seven
published contracts**, whose entire prose surface is undeclarable-by-mechanism. That is the test that
kills it, and it is the same test ADR-0207's four clauses were calibrated against: a ground must
refuse the refused and admit the admitted.

What survives is not a ground and is not new either. It is a **cost**, and it belongs to an entry the
open list already carries — *that a field the digest freezes is one something reads*, which names
`environments[]` among the ten frozen-and-unread paths no entry had reached. Before this candidate the
emptiness cost nothing, because all seven contracts really do run everywhere. **This candidate is the
first that would make it cost something**: an auditor fetching the eighth snapshot receives the same
three runtimes as the first seven, and nothing in the structured half says the eighth needs a runtime
the others do not. That entry gains its first consequence, and it gains it from a candidate rather
than from a sweep.

### The runtime — where the claim was, and where the obstacle is

The floor above came back clear, so the matrix was priced. Doing so refutes a claim this repository
has carried since ADR-0150, in that record's own words: line 24 publishes *Node 26 ships it unflagged*
and line 101 says *Node 26 was not available to measure*.

**It is measured now.** Node 26.8.1, released 2026-08-26, V8 14.6.202.34, downloaded into a scratchpad
outside the tree and run there. ADR-0215's own guard against the draft engine — re-implemented from
that record rather than assumed — passes exactly:

    own property names (9): Duration, Instant, Now, PlainDate, PlainDateTime,
                            PlainMonthDay, PlainTime, PlainYearMonth, ZonedDateTime
    removed-before-stage-4 still present: none
    of the specification's nine, missing: none
    beyond the nine: none

So Node 26 serves **the language** and not V8 13.6's draft, which node v24.15.0 still serves behind
`--harmony-temporal` with `TimeZone` and `Calendar` intact. ADR-0150's unmeasured claim holds.

**ADR-0216's three central readings reproduce on it**, which is that record's own reopening trigger
firing: `PlainDate.add({ days: 1, dayz: 9 })` answers `2026-01-16`, `PlainDate.add({ hours: 5 })`
answers the input unchanged, and `PlainYearMonth.add({ hours: 5 })` throws `RangeError`. The residue
survives the move from draft to shipped specification. **The narrowing is stated rather than
smoothed**: ADR-0216 asked for *a second engine* and this is a second **V8 build**, not a second
implementation — no SpiderMonkey and no JavaScriptCore reading was taken.

**And the whole repository already runs there.** All eight suites of a `suites` leg, under Node 26.8.1:

| step | files | tests |
| --- | --- | --- |
| contracts | 30 | 718 |
| meta | 11 | 124 |
| registry | 24 | 467 |
| validation | 6 | 29 |
| cli | 22 | 196 |
| site | 18 | 187 |
| packaging | 3 | 24 |
| the freeze | 1 | 3 |
| **total** | **115** | **1 748** |

Green, `--typecheck` included, in **81 s** of wall clock for the seven timed together on this machine.
`meta` and `freeze` have now run on a runtime no leg of this matrix has ever used. One reading
calibrates nothing, which is this repository's own rule, so that span is a reading and not a bound.

**So a Node 26 leg costs one matrix entry, no repair, and no critical path** — matrix legs run in
parallel and `needs` waits for the longest, so a third leg the length of the other two extends
nothing. By ADR-0169's reading of the ubuntu job that is about 125 runner-seconds.

**That is not the cost, and the cost is the two legs that exist.** A Temporal contract's `reference.ts`
names a global that is `undefined` on both `22.18.0` and `24`, so `contracts` — the first step of the
leg — fails on both. Three ways out, none of them seconds:

* **Raise the contributor floor to 26.** It deletes the `22.18.0` leg, whose stated job in
  `suites.yml` is *the day the floor rises, this leg reddens*, and it makes the floor a runtime
  nodejs.org marks `lts=no` while 24 is `lts=Krypton`.
* **Skip where the function is absent.** Refused by `array/group-by@1`'s established rule, *a runtime
  without the function fails loudly instead of skipping*.
* **Scope one contract's suite to one leg.** `npm run test` is one vitest run over `contracts/`.
  Per-contract runtime scoping is machinery that does not exist.

**The eighth contract is therefore a decision about this repository's contributor floor**, which is
the owner's and is not taken here.

### The downstream, and the multiplier nobody fixed

ADR-0218 named three prices and ADR-0219 refuted the route round the first. What this unit adds is the
**arity**, which neither record fixes and without which item 1 cannot be sized at all.

Measured on Node 26.8.1: of the nine members of the namespace, **`PlainMonthDay` carries no `add`**,
which is why ADR-0216's table has seven rows and not eight. `Instant` and `ZonedDateTime` are the two
that are not zone-free. So the population is seven, and the zone-free subset is at most five —
`Duration`, `PlainDate`, `PlainDateTime`, `PlainTime`, `PlainYearMonth` — while ADR-0216's R13 clause
names **four** by name and ADR-0217 says only *the zone-free carriers*.

**Nothing fixes which of them the retained form spans**, and item 1 of ADR-0218's price is *a kind for
a carrier whose state is internal*. Whether that is one kind, four or five is undetermined, and
settling it is a prerequisite to sizing the repair rather than a detail of it. That is a gap in a
price two records have now published.

### The verdict

**Writable, and at a price no floor of this unit can pay.** Floor 2 refuses nothing and yields no
ground. Floor 1 is not a leg but a runtime-floor decision, now taken with the measurement in hand
rather than waiting on one. Floor 3 is ADR-0218's three items, of which the first has an unfixed
multiplier and the third is unsized. **There is no fourth negative**, and saying so is worth as much
as the three that came before it: the catalogue *can* follow the language into what it has just
shipped, and what stands in the way is a bill rather than a principle.

## Consequences

`environments` is confirmed as a constant that verifies nothing and can refuse nothing, and its entry
in the open list gains the first consequence anybody has been able to attach to it.

ADR-0150's unmeasured claim is measured and holds; the day it named has arrived, and what was a wait
is now a decision.

Nothing is repaired. `THE_PACKAGE_VERSION` stays at `1.2.0`, nothing under `contracts/` moved, and no
digest moves — this record touches no encoder, no frozen field and no workflow.

## What would reopen this

* **Node 26 reaching LTS**, expected in October 2026. It removes the sharpest objection to raising the
  contributor floor, which is that the floor would be a runtime nodejs.org marks `lts=no`.
* **A second implementation shipping Temporal.** Every figure of ADR-0216 and every figure here is
  V8's, at two builds. SpiderMonkey or JavaScriptCore refusing where both of these answer would
  reopen ADR-0216's residue rather than this record's pricing.
* **`environments` gaining a reader.** The floor-2 verdict rests on the field being a constant nothing
  executes. A guard or a page that read it would make what a contract declares there a claim, and the
  question this record answers negatively would have to be asked again.
* **A candidate whose requirement is a runtime brand rather than a version.** That is the shape
  `environments` was written for, and it is the one under which the field could be made false. Nothing
  in this catalogue has ever met one.
* **The carrier set of the retained form being fixed.** It is what multiplies item 1 of ADR-0218's
  price, and until somebody rules on it the first of the three repairs has no size.

## More Information

Measured at `a0bbf86`, Windows, on node v24.15.0 and on Node 26.8.1 obtained from nodejs.org's own
release index and unpacked outside the tree. Every probe was a throwaway in a scratchpad; nothing
inside the repository was edited to take a reading, and `git status --porcelain` was empty either
side of the measurements. `npm run freeze` is green both before and after, three guards, under both
runtimes.

The pricing draws on [ADR-0216](0216-the-residue-is-three-decisions-and-the-language-answers-one-of-them-two-ways.md)
for the residue, [ADR-0217](0217-r5-is-read-on-what-the-packages-do-and-never-on-how-often-they-are-downloaded.md)
for the retained form, [ADR-0218](0218-the-format-carries-a-generic-and-what-refuses-the-retained-form-is-not-the-generic.md)
for the three repairs, and [ADR-0219](0219-no-form-over-values-this-catalogue-already-spells-is-the-retained-form.md)
for the route round the first of them being closed. The draft guard is
[ADR-0215](0215-the-fourth-search-is-conducted-on-the-surface-that-arrived-after-the-third.md)'s.
