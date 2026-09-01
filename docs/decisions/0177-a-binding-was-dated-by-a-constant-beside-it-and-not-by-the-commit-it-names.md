---
status: accepted
date: 2026-08-30
governs:
  - packages/registry/publication.ts
  - packages/registry/local-read-api.ts
  - packages/registry/rebinding.ts
  - packages/registry/rebuild.ts
  - packages/cli/local-source.ts
  - packages/site/local-source.ts
confirmed-by:
  - battery: freeze
    guard: every-published-binding-is-dated-by-the-commit-it-names
  - battery: registry-storage
    guard: a-binding-dated-by-something-other-than-its-own-commit-is-refused
  - battery: registry-storage
    guard: a-binding-dated-by-its-own-commit-is-accepted-whatever-the-offset
  - battery: registry-storage
    guard: a-binding-that-names-no-commit-is-not-dated-against-one
  - battery: registry-storage
    guard: a-commit-whose-date-cannot-be-read-is-refused
  - battery: registry-storage
    guard: a-binding-serving-an-instant-nobody-can-read-is-refused
  - battery: registry-storage
    guard: the-commit-is-asked-once-however-many-bindings-share-it
---

# A binding was dated by a constant beside it and not by the commit it names

## Context and Problem Statement

`ServedContractBinding.publishedAt` says, in `snapshot.ts`'s own words, *when a binding was made*.
`CONTRACT_BINDING_NATURES` classes it `bound-for-life`, which is this repository telling a reader they
may treat it as fixed.

Measured on 2026-08-30 against the live origin at `22ccd46`, every one of the twelve named answers
that carries the field answered the same instant:

```
/typescript/number/parse@1/contract-binding          2026-08-17T00:00:00.000Z
/typescript/number/parse@1/implementation-bindings   2026-08-17T00:00:00.000Z
/typescript/date/add@1/contract-binding              2026-08-17T00:00:00.000Z
/typescript/date/add@1/implementation-bindings       2026-08-17T00:00:00.000Z
/typescript/string/levenshtein@1/…                   2026-08-17T00:00:00.000Z   (both)
/typescript/string/slugify@1/…                       2026-08-17T00:00:00.000Z   (both)
/typescript/number/round@1/…                         2026-08-17T00:00:00.000Z   (both)
/typescript/object/deep-equal@1/…                    2026-08-17T00:00:00.000Z   (both)
```

`PUBLISHED_FROM` in `local-read-api.ts` says which commit each of those bindings was minted at, and
git says when each of those commits happened:

| binding | published from | authored |
| --- | --- | --- |
| the four founding contracts | `d3a5166` | 2026-08-17 |
| `number/round@1` | `50ff990` | **2026-08-20** |
| `object/deep-equal@1` | `3ec621c` | **2026-08-24** |

**So four of the six contracts were right and two were wrong, by three days and by seven.** A contract
and its reference are two answers, so **four of the twelve were wrong**: two named a moment three days
before the binding existed, and two named one seven days before.

### The cause is not a typo, it is where the two halves lived

A publication is one fact with two halves: the commit it was made at, and when. The commit lived in
`local-read-api.ts`, keyed by address, because [ADR-0144](0144-the-sixth-contract-enters-the-catalogue.md)
turned it into a map the day a second publication needed one. The instant lived in `publication.ts`,
as `THE_PUBLICATION_INSTANT`, a single constant — because on the day it was written there had been one
publication and one constant answered for all of it.

**Nothing tied them.** A third row was added to the map by the seventh contract, and the constant one
file over went on answering for the first publication. There was no moment at which anybody wrote
something false: each half was edited correctly, on its own terms, and the pair went wrong.

### Why nothing was red

The field is in **no digest** — `snapshot.ts` keeps both `publishedAt` and `publishedFrom` out of the
frozen half by construction, so `npm run freeze` was green throughout. It is in **no lockfile** — a
real install writes `installedAt` and `servedFrom` and never this. It is in **no page** — swept over
`packages/site/`, nothing renders it. And it is in **no module of the archive**.

So the only surface on which it was wrong is the audit surface: the answer a reader fetches when they
want to know what this registry says about its own past. Which is the one surface this repository
exists for.

## Decision Outcome

**The two halves are one declaration, the instant is read off the commit rather than declared beside
it, and a guard refuses a pair that has come apart.**

### `THE_PUBLICATIONS`, in `publication.ts`

A `Publication` is `{ from, at }`. Three of them — one per publication this catalogue has had — and a
map from rendered address to the publication that minted it. `local-read-api.ts` reads it; the map and
the three commit constants moved out of that file with their prose.

**A pair rather than two maps, because the failure is exactly a row moving in one of them alone.**

### The author date, and not the committer date

Measured on this history: `d3a5166` was authored at `12:57:32+02:00` and committed at `13:02:48+02:00`.
The two really do part here, so the choice is not theoretical.

The author date is taken, for two reasons that agree. This repository has reissued its history twice
under a record ([ADR-0095](0095-what-a-repository-says-about-its-own-history-resolves.md),
[ADR-0124](0124-the-co-signature-leaves-the-history.md)) and reserves the right to do it again; a rewrite
moves a committer date and leaves an author date alone, so a date derived from the committer would go
red after a rewrite that changed nothing. And `publishedAt`'s own comment asks *when somebody decided*,
which is when the work was authored.

### The instant, and not the day

The constant this replaces was written to the day, at midnight, on a stated argument: *a clock reading
is neither derivable nor falsifiable here, so what is written is the coarsest true thing.*

**Both halves of that are now false.** The commit is where the reading comes from, so it is derivable;
`every-published-binding-is-dated-by-the-commit-it-names` reads it back, so it is falsifiable. The
coarse form stopped being the honest one and became a rounding away from a fact in hand — and midnight
is a moment at which the binding did not exist, which the day resolution was quietly asserting.

The reason for the coarseness died with the repair, so the coarseness goes with it.

### What the twelve answers now say

| binding | before | after |
| --- | --- | --- |
| the four founding contracts, and their references | `2026-08-17T00:00:00.000Z` | `2026-08-17T10:57:32.000Z` |
| `number/round@1`, and its reference | `2026-08-17T00:00:00.000Z` | `2026-08-20T21:40:02.000Z` |
| `object/deep-equal@1`, and its reference | `2026-08-17T00:00:00.000Z` | `2026-08-24T20:39:38.000Z` |

**Four of the twelve move to a different day; eight move by ten hours and fifty-seven minutes** — the
eight that were right about the day and are now right about the moment.

### `bound-for-life` is what decided the direction, rather than what refused it

The field declares that a reader may treat it as fixed, and that is an argument for *not* changing a
served value. It was put to the owner as the one arbitration of the unit, and he ruled: **the promise
is about the truth and not about the bytes.** Serving 17 August for a binding made on the 24th does
not keep that promise, it breaks it in silence. Correcting makes the field true; not correcting makes
the declaration decorative, which is the defect this repository exists to refuse.

### `decidedOn` is deliberately not touched

`/refusals` carries `decidedOn` for `array/group-by@1`, and it is fed by the same constant. It is a
different field with a different meaning: a refusal mints no binding, names no commit and can be
rebuilt at nothing, so there is no coordinate to read a date off. What it carries is the moment the
refusal entered a published ledger.

**Whether that is the date the decision was taken is a question this repository has not answered**, and
answering it inside a unit about `publishedAt` would be two decisions in one commit. It is written down
in `publication.ts`, beside the constant that now has that one use.

### The stand-ins date correctly and still anchor nothing

`packages/cli/local-source.ts` and `packages/site/local-source.ts` read the same declaration for `at`
and keep `THE_UNPUBLISHED_REVISION` for `from`. That is the split `snapshot.ts` already draws: the
instant is a fact about the catalogue and is true wherever it is served, while the commit is a claim
that *this* tree can be rebuilt at it — which a working tree cannot make.

It matters beyond tidiness: the site's pages are rendered from that stand-in, so a page that one day
says when a contract arrived reads a true date rather than a stand-in's.

## Consequences

**Twelve named answers change their content. No address moves, no digest moves, and the ledger is
byte-identical** — measured, `npm run ledger` before and after produce the same twelve lines.

`THE_PACKAGE_VERSION` does not move: nothing importable changed, and the client does not read this
field.

The registry suite goes **460 tests to 466**; the freeze suite goes **2 to 3**.

`publication.ts` gains its first import — `THE_UNPUBLISHED_REVISION`, taken from where it is argued
rather than restated.

**A guard is added to a suite no battery replays**, which is a price this repository has already
accepted twice and states rather than discovers: no mutant reddens
`every-published-binding-is-dated-by-the-commit-it-names`, so its detecting power is not measured by
the instrument. What stands in its place is the confirmation below, in which the original defect was
put back and it reddened alone.

## Confirmation

Every guard was put in front of the defect it exists for, one at a time, with the tree restored between
each. Verdicts read from vitest's JSON reporter rather than scraped from a console. Controls: **466
passed** in the registry suite, **3 passed** in the freeze suite.

| the defect | what reddened | of |
| --- | --- | --- |
| **the original defect restored** — every binding dated by `THE_PUBLICATION_INSTANT` | `every-published-binding-is-dated-by-the-commit-it-names`, **alone** | 3 |
| the reader asks git for `%cI` instead of `%aI` | the same, **alone** | 3 |
| the mismatch arm never fires | `a-binding-dated-by-something-other-than-its-own-commit-is-refused`, **alone** | 466 |
| the two instants are compared as written rather than as moments | `a-binding-dated-by-its-own-commit-is-accepted-whatever-the-offset`, **alone** | 466 |
| an unanchored binding is dated against forty zeros | `a-binding-that-names-no-commit-is-not-dated-against-one`, **alone** | 466 |
| a commit date git cannot render is compared instead of refused | `a-commit-whose-date-cannot-be-read-is-refused`, **alone** | 466 |
| an unreadable served instant is compared instead of refused | `a-binding-serving-an-instant-nobody-can-read-is-refused`, **alone** | 466 |
| the commit is asked once per binding rather than once per commit | `the-commit-is-asked-once-however-many-bindings-share-it`, **alone** | 466 |

**The first row is the one that matters**, and it is the control this unit is built on: the defect that
was live on the origin for ten days, put back, reddens the new guard and leaves the two guards that
were watching that ledger green. They were green on it for ten days because it was never their subject.

**The second row is why the author date is not a preference.** `%aI` and `%cI` differ on exactly one of
the three commits, by five minutes, and swapping them reddens the total guard — so the choice is
load-bearing and something reads it.

**One guard was caught covering its neighbour's claim.** `the-commit-is-asked-once-…` asserted the
verdict as well as the count, and the perturbation of the *normalisation* reddened it alongside the
guard whose claim that is. A guard that reddens on its neighbour's defect says nothing on the day the
two disagree, so the verdict assertion was removed and the count kept. It was found by running the
perturbations one at a time and reading which guards came back red, rather than by rereading them.

### What was measured before anything was written

- **The lockfile carries no `publishedAt`.** Measured rather than recalled: `npx toopo@1.1.0 add
  number/round` into an empty project against the live origin writes `installedAt`, `servedFrom` and
  no such field. So no installed project in the world holds the old value.
- **The archive carries no such value.** `npm pack toopo@1.1.0` unpacked holds no `2026-08-17`, and
  `reachable.ts` prunes both stand-ins out of it entirely.
- **No page renders it.** Swept over `packages/site/`, the only occurrences are the two the stand-in
  mints.
- **No digest moves.** `npm run ledger` before and after: twelve lines, identical.

## What would reopen this

**A fourth publication adds a row, and the row carries both halves or it does not compile.** That is
the shape rather than a reminder: `Publication` has two required fields, so a coordinate cannot be
added with the date left to a constant beside it. What the guard adds is that the date has to be the
commit's.

**The `decidedOn` question is open and is written down where somebody will meet it.** If this
repository ever establishes when `array/group-by@1` was decided against, `THE_PUBLICATION_INSTANT`
loses its last use and the refusal gets a coordinate of its own.

**The spelling of the served instant is not this guard's subject.** Both sides are normalised before
they are compared, so a coordinate written in a local offset would pass. Nothing here claims which
rendering a reader receives, and the day something does, it is a second guard and not a widening of
this one.

**The day a rewrite of this history moves an author date, the choice above is wrong.** `git filter-repo`
preserves author dates, which is why the argument holds; a rewrite performed with something that does
not would redden the total guard, and the repair would be to re-read the three commits rather than to
loosen the rule.

## More Information

- [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) — why a binding records a
  commit at all, and why the past is rebuilt rather than recorded.
- [ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) — why a commit that mints an address cannot
  name itself, which is why these coordinates are transcribed.
- [ADR-0107](0107-the-freeze-check-lives-where-nothing-replays-it.md) — the suite this guard joins, and
  the price it states for living where no battery replays it.
- [ADR-0144](0144-the-sixth-contract-enters-the-catalogue.md) — the publication that turned one constant into a
  map, and the moment the two halves parted.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — the rule about a dated number beside a
  present-tense claim, which is what the old constant was.
