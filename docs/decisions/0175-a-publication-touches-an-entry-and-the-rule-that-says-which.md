---
status: accepted
date: 2026-08-29
governs:
  - packages/registry/field-map.ts
confirmed-by:
  - battery: registry-storage
    guard: every-class-a-declared-pattern-names-is-one-the-answers-witness
---

# A publication touches an entry, and the rule that says which

## The rule, written before it was applied

This section is first for ADR-0174's reason: the classification below is its application, and what a
session needs when the catalogue next grows is the rule and not the verdicts.

The question is **not** *does a reader meet this entry* — that is ADR-0167's, and it answered a
different one. It is:

> **Does publishing an eighth contract touch this entry?**
>
> An entry is **touched** when at least one of four tests holds, each requiring evidence quoted from
> the repository:
>
> | | test | what it asks |
> | --- | --- | --- |
> | **T1** | population | does one more contract enlarge the population the entry declares? |
> | **T2** | gate | does a publication pass through or have to satisfy what the entry names? |
> | **T3** | recurrence | would the eighth contract reproduce the defect by being written the ordinary way? |
> | **T4** | staleness | does the entry state, in the present tense and without a stamp, a figure a publication falsifies? |
>
> **The burden of proof goes both ways.** *Touched* is shown, never assumed. *Untouched* is written
> as **no test produced evidence**, and is refuted by producing it.
>
> And a second test, applied only to the touched:
>
> **W — the window.** Is the repair available **only** before the eighth contract's digest is minted?
> **Yes** when what would carry it is inside `contractSnapshot`. **No** when it lives anywhere a later
> commit still reaches — a standing field, the registry, the site, the client, the instrument, a
> record, or `CLAUDE.md`.

T1, T2 and T3 were the owner's. **T4 is the addition, and the symmetry of the burden is what makes
the classification falsifiable**: without it, *untouched* is an absence of evidence that looks exactly
like an absence of work.

## Context and Problem Statement

The catalogue will grow, and the question put was *everything that has to be done before the next
one*. The open list carries 58 entries under its own subheading. Most of them have nothing to do with
a publication, and *everything* cannot mean 58 — so the first task was a rule, and the rule had to be
written down before it was applied or it would have been fitted to whatever was found.

There are two outputs and only one has a deadline. An entry closed after the publication is closed
just as well. **A thing the contract had to carry on its first day, missed at the freeze, is missed
for the life of the major** — which is what ADR-0171 measured for a profile's name, three units
before this one.

## Decision Outcome

### What the rule returns, at `210bc7c`

Population rebuilt by command: **58** entries under `**Still open, and what each one now costs.**`,
plus the two the file sets above it.

| | |
| --- | --- |
| untouched | **12** — entries 1, 7, 19, 20, 21, 23, 27, 28, 33, 43, 44, 49 |
| touched | **48** of 60 |
| of the touched, **W = yes** | **20** |
| of the touched, inert either way | 6 |

**The answer is small, and that is the result rather than a disappointment.** *Touched* is not
*broken*: of the 48, nearly all are either *the eighth contract must be written with care* or *this
counter will move*. **Nothing gates a publication that is broken.** Four things were actually false,
and all four are repaired here.

### The four that were false

**A per-contract arithmetic, stale for one commit.** `suites.yml` declared *a contract adds 36 guards
to the registry suite* with eight formulae under it. Re-derived from the sources rather than from a
fit — a file collects `(it.each(eachContract)) * n + (plain it)` — the eight rebuild to
`mutation/census.ts` exactly, **289 against 289**. Seven formulae hold; `against-the-catalogue` is
`8n + 12` where the file said `11n - 4`, so **a contract adds 33 guards and not 36**. `483d197`
replaced seven parameterised guards with one and added one, taking that row from 73 to 68, and left
the derivation beside it unswept. What stands on the old count — 56 s, 3.3 cells, the joint line — is
9 % high in the generous direction and is written down as not re-derived rather than quietly left.

**Two counts a publication makes false, on the two documents a reader arrives at.** `README.md` read
*the **six** installable contracts settle **237 named edge cases*** and `CONTRIBUTING.md` read
*counted over the **seven** contracts*. In both the figure is derived and guarded and the word beside
it is typed and guarded by nothing. Both are digits now and both are derived; seen red on a wrong
word, each guard naming its own claim.

**The field map declared two frozen fields corrigible.** The comment above `caseTables[].groups[].note`
read *not frozen: a title and a note are corrected the day they read badly*. `contractSnapshot`
carries `caseTables` whole. It is the second sentence of that file corrected for claiming what the
code refutes; ADR-0171 corrected the first.

**And `CLAUDE.md` cited a stratum the map has never held.** It said `caseTables[].cases[].rationale`
is `documentary`; `git log -S` over the whole graph finds no commit where the map spelled it that
way. It changes nothing the entry claims — both strata mean nothing reads the sentence — and it is a
citation of the code inside the paragraph whose job is to name where somebody should look.

### The entry that closed, and what closed it

`outputAlphabet`'s missing direction had been *priced and not taken* for three units, on an
unmeasured trigger the entry itself named: whether `\p{M}` had a real witness among
`string/slugify@1`'s answers. **The measurement was taken and is favourable** — `\p{L}` witnessed by
`日本語テキスト`, `\p{M}` by three answers (`हिन्दी`, `eَ`, `x́`), `\p{Nd}` by `٤٢` — so the guard is
total over the catalogue and exempts nobody.

**The route that looked obvious was refused on its own arithmetic, and this is the finding worth more
than the guard.** Deriving the population from `THE_FROZEN_HALF_IS_STILL_OPEN`, as ADR-0171's profile
guard does, scopes a guard to unpublished contracts — and `string/slugify@1` is the only contract in
the catalogue declaring a pattern at all, so that guard would have been **born on an empty population
and could not have failed**. A mechanism written later can look like it dissolves an older blocker
and be the wrong shape for it: ADR-0171's population is right where the published contracts *cannot*
satisfy a rule, and wrong here, where they can and do.

**`I-74` is worth more than its own subject.** It keeps only a case's arguments, so every answer the
catalogue publishes leaves the record while each case still begins with the call serialisation checks
— no refusal, a page simply unable to render an answer. Measured: **459 of 460 registry guards pass
and the new one is the failure**. The registry could stop carrying what every case answers and,
before this guard, nothing in that suite would have said so.

### The two entries that were priced

**A field the digest freezes that nothing reads.** 58 paths inside the digest, **17 read by nothing**.
The population is *derivable* — the paths of `contractSnapshot`'s output whose `FIELD_MAP` stratum
gives no reader — which is why it is an entry of its own and not a clause of the one about a
contract's prose: that one names five kinds of sentence, and a named list shrinks in silence. It had
named five where there are seventeen. **Ten are named by no entry at all**, and one is
`benchmarks.profiles[].description`, the exact twin of the `name` ADR-0171 measured and wrote a rule
for three units ago.

**An address a frozen file cites whose target lives outside the frozen perimeter.** 31 addresses
quoted in `contracts/`, **27 declared inside the perimeter**, two deliberate negatives, one union
member the compiler protects, and one live: `object/deep-equal/reference.ts:9` cites
`states-its-own-signature`, declared only in `packages/validation/states-its-own-signature.ts`.

### What the next contract has to carry

Ten lines, in `CLAUDE.md` where a session writing a contract reads. Each says why it is only
repairable before the freeze. **The half that keeps it honest is the second one** — what was taken off
after measuring: the address, the use cases, the cells and pins, the learned terms, each repairable
afterwards and each named so nobody puts it back.

## Consequences

The classification is a reading and not a mechanism. An entry has no address, ADR-0118 refuses one on
rewritable prose, and a guard keyed to an entry's text reddens when somebody rewrites it — ADR-0112's
refusal. So nothing holds this reading to the list, exactly as ADR-0167 records of its own.

**A live instance of the first priced entry was created by this unit**, which is the cost worth
stating. `string/slugify@1` publishes `ownDeclarations[].verification` of `one-directional` for
`outputAlphabet`, on the strength of GS-11 surviving. The guard here reads that missing direction, so
the published stratum now understates what verifies the field — and `ownDeclarations` is inside the
digest, so it says `one-directional` for the life of the major. `npm run freeze` is green across the
change, which is the freeze keeping its promise rather than failing.

**A false citation was produced while this unit was being briefed, and it is recorded because of where
it happened.** The brief named three entries as declaring their own growth with a publication.
`CLAUDE.md:1556` and `CLAUDE.md:2064` do. The third, `CLAUDE.md:2632`, reads *it grows by one with each
**gate*** — its population is the four `timeout-minutes` declarations and it grows with gates, not with
contracts. The line was real, the sentence was real, and the attribution was not. That is how a false
citation is made, in the file whose subject is declarations nothing keeps.

## Confirmation

`every-class-a-declared-pattern-names-is-one-the-answers-witness` is the guard, `registry-storage ·
I-74` is the cell, and it was seen red alone against 459 passing guards. The two document guards were
seen red on a wrong word, each naming its own claim. The eight formulae rebuild to the census, 289
against 289. `npm run freeze` is green and no published digest moved.

## What would reopen this

The rule reopens where its own refutation clause names: **an entry a publication demonstrably worsens
that none of T1 to T4 reaches** is a missing fifth test, and the rule is wrong as written rather than
the entry misclassified. A `W = yes` line found reachable afterwards through a standing field moves
out of the eighth contract's list and into the priced half — that is ADR-0155's mechanism, and it has
happened once already.

The eighth contract's list reopens on every publication, because it is a list of what is settled
before a digest and each publication mints one. Its tenth line reopens on measurement rather than on
argument: it carries a coordinate because it is a reading of what seven contracts happen to hold, and
an eighth that holds otherwise is what it is watching for.

## More Information

ADR-0167 is the earlier reading of this list under a different question and is what this one is
modelled on. ADR-0171 is the profile name, the worked example of a debt only the next contract can
avoid, and the source of the population shape refused here. ADR-0128 is why an entry describing what
the code does not have names where it looked.
