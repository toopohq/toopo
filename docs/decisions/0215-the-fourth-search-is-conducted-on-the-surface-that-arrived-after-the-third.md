---
status: accepted
date: 2026-09-04
governs:
  - CLAUDE.md
confirmed-by: []
---

# The fourth search is conducted on the surface that arrived after the third

> **This record is committed in two halves and the order is the evidence.** *The method, declared
> before the first probe* and the prediction closing it were written and committed before any
> operation of the population had been read against the acceptance rule; everything else was added
> afterwards. A criterion written after the results bends to them, and a record claiming otherwise is
> worth exactly what its own history says — so the history is the claim, and it is checkable: that
> section is byte-identical between the method commit and this one, heading to the last line of the
> prediction. What moved afterwards is named here so the claim is not read as wider than it is — *What
> the sweep returned* onwards, *What would reopen this*, the consequences, the coordinates, and this
> note, which cannot describe a commit it precedes.
> [ADR-0192](0192-the-search-below-the-bound-is-conducted-on-the-languages-own-surface.md) is the
> record this follows in form as well as in subject, and
> [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) is the discipline both
> follow.

## Context and Problem Statement

[ADR-0192](0192-the-search-below-the-bound-is-conducted-on-the-languages-own-surface.md) swept the
language's own surface — 592 members of 51 in-scope globals, of which **443 are operations** — assigned
every operation a ground, and returned no eighth contract. **Its first reopening trigger is this
unit**, in its own words:

> **The standard library growing.** The population is a snapshot of one runtime at one version. Every
> proposal that reaches stage 4 adds operations to it, and each addition is a row this sweep did not
> read. The sweep is cheap to re-run and names the commit and runtime it was taken on so that it can
> be.

**Temporal is that proposal.** It reached stage 4 in March 2026, which
[ADR-0150](0150-a-frozen-contract-cannot-say-where-it-stands-so-the-registry-says-it.md) records; and
ADR-0192's population is Node v24.15.0's, where it is absent — re-measured on this machine at
`46a8a9f`, `typeof globalThis.Temporal` is `undefined`. **So the whole of Temporal was outside the
swept population.**

**And it was outside that population while deciding a row of it, which is the sharpest form the trigger
takes.** ADR-0192 refuses `Date.parse` on **R1** in these words: *Temporal is stage 4 and is the
language's answer to parsing a date that is not ISO; `date/add@1` already carries the arithmetic.* A
surface that refuses a candidate and is itself never read is a motive doing a subject's work.

**The observation that opened the unit is the family distribution, and it is measured here rather than
recalled.** Over every contract address the four search records name — ADR-0158, ADR-0163, ADR-0192 and
ADR-0207, matched as a backticked `domain/name` — there are **31 distinct addresses**: `string` 12,
`array` 7, `object` 5, `number` 4, and one each of `function`, `semver` and `url`. **`date` carries
nought.** The reading that prompted the unit put `string` at 10; the difference is that this rule
counts `string/split-words`, which is a decomposition rather than a candidate, and ADR-0207's two
calibration additions. **The load-bearing figure is the same under either rule and it is the zero**:
the catalogue has published a `date` contract and has never refused a `date` candidate, which is what a
family whose surface arrived after every sweep looks like.

## Decision Drivers

* **The trigger is the record's own, and firing it costs less than arguing about it.** ADR-0192 says
  the sweep is cheap to re-run and names its runtime so that it can be. Declining to re-run it while
  citing it is the shape this repository's open list exists to refuse.
* **A negative is a result.** ADR-0163 established it by titling itself *There is no eighth contract*,
  and ADR-0192 published a second. The window is therefore declared before it is looked through, so
  that finding nothing cannot be answered by widening it.
* **The runtime is the whole difficulty, and it has three states rather than two.** A search that reads
  Temporal through a polyfill measures the polyfill. A search that reads it through
  `--harmony-temporal` measures a draft the specification has since changed. Only a shipped stage-4
  engine measures what a reader receives, and the guard that separates the three is part of the method
  rather than an afterthought.
* **R2 is the question, and it has to be posed narrowly or it decides too much.** *Is Temporal
  specified* answers itself and closes the family by construction. The question this catalogue has
  already answered elsewhere is narrower, and the answer is published rather than to be invented.
* **A conclusion about every future stage-4 API needs a population behind it.** If R2 closes this
  family, the same argument closes every family whose API the language has delivered. ADR-0192 did not
  refuse the language's surface by argument; it swept 443 operations and gave each one a ground. A
  refusal of that reach is exactly the shape that owes a sweep.

## Considered Options

* **Argue R2 from the published records and close the family** — one hour, no population
* **Measure Temporal through a polyfill** — measures the polyfill
* **Measure Temporal through `--harmony-temporal` on Node 24** — measures V8 13.6's pre-stage-4 draft
* **Measure Temporal on a shipped stage-4 engine, and sweep the whole surface whatever R2 returns**

## Decision Outcome

**Chosen: the sweep, whole, on a shipped stage-4 engine, under the method declared below.** Its result
— a candidate or none — is published either way, and **no contract is written in either case**: this
unit says whether there is one.

**The sweep is taken even if R2 closes the family early**, and the reason is the reach of that
conclusion rather than the reusability of the population. R2 closing `date` because the language
delivered the API closes every family whose API the language delivers, which is a statement about every
stage-4 proposal still to come. This repository does not accept a conclusion of that reach on an
argument alone.

### The method, declared before the first probe

#### The runtime, and the guard against the draft

**Temporal is reachable on this machine in two states and only one of them is the language.** Measured
at `46a8a9f`, before any operation was read:

| runtime | `Temporal` | `TimeZone` | `Calendar` | what it is |
| --- | --- | --- | --- | --- |
| Chrome 152.0.7977.77, headless, no flag | present | absent | absent | **the language** |
| Node 24.15.0, `--harmony-temporal --no-node-snapshot` | present | **present** | **present** | V8 13.6's pre-stage-4 draft |
| Node 24.15.0, bare | absent | — | — | ADR-0192's population |
| Node 25.6.0 (V8 14.1), bare, `--harmony-temporal`, `--js-staging`, `--harmony` | absent | — | — | — |
| Bun 1.3.8 | absent | — | — | — |

**The middle row is a category this unit had to discover rather than one it was given.** It is neither
a polyfill nor the language: it is the language's own engine, at a draft the specification has since
changed, and it is more dangerous than a polyfill precisely because it looks like the right source.
`Temporal.TimeZone` and `Temporal.Calendar` were removed from the proposal before stage 4, and both are
still there. ADR-0150 characterised this build when it replayed `date/add@1` against it and published
its third divergence as *a suspicion and not an established divergence* for exactly this reason.

**So every probe of this unit carries a guard, and the guard runs before the probe's own question.** A
probe asserts that `Temporal.TimeZone` and `Temporal.Calendar` are **absent** and that the namespace's
own property names are **exactly** the nine the specification defines — `Duration`, `Instant`, `Now`,
`PlainDate`, `PlainDateTime`, `PlainMonthDay`, `PlainTime`, `PlainYearMonth`, `ZonedDateTime` — and
**refuses to print anything if either fails**. A reading taken on the draft is not a weaker reading of
the language; it is a reading of something else.

**The locale and zone are pinned and declared**, because they are data rather than code and this unit's
own R13 is about that: probes run under `--lang=en-US`, and the host zone at the time of reading is
recorded with every figure that could depend on one.

**Node 26 is not installed and will not be installed for this unit.** Chrome answers, costs nothing and
is what a reader receives. If a second engine turns out to be needed to arbitrate a candidate, this
unit stops and says so rather than installing one.

#### The window, and what it excludes

**The population is every operation the Temporal proposal adds to the runtime.** That is not the same
set as *everything reachable from `Temporal`*, and the difference was measured before the rule was
fixed: `Date.prototype.toTemporalInstant` is a `function` under Chrome 152 and `undefined` under bare
Node 24.15.0, so the proposal adds at least one operation outside its own namespace, and a population
defined by reachability from `Temporal` would have dropped it in silence.

So the population is enumerated in two parts, both derived rather than listed: everything reachable
from `Temporal` by the rule below, **plus** every operation the proposal adds elsewhere, found by
comparing the Temporal-bearing engine against a runtime with no Temporal in it and declared row by row.

**What this window excludes, stated before it is looked through**, on ADR-0192's own treatment of its
bound:

* **The rest of the standard library**, which ADR-0192 read at Node v24.15.0 and which is not re-read
  here. Where V8 14.x has changed an operation ADR-0192 classified, this sweep does not see it.
* **Every proposal below stage 4**, and every stage-4 proposal other than Temporal that landed between
  V8 13.6 and Chrome 152's V8. This window is Temporal's, named in advance, and the residue is one more
  row for the next re-run rather than something this record covers.
* **Anything about `date/add@1`'s frozen half.** This unit reads the language; it does not reopen a
  published contract, and permanent rule 6 forbids the repair the reading might suggest.

**So this search narrows ADR-0192's first reopening trigger and does not close it.** The trigger is
about the standard library growing, and this reads one proposal's worth of that growth. Saying so here
rather than at the end is what stops a repair committing the defect it repairs.

#### How the population is enumerated

**ADR-0192's rule, restated so that the two sweeps are comparable.** Every own property name of each
constructor the namespace holds and of that constructor's prototype; namespace objects that are not
constructors — `Temporal.Now` is one — are recursed into rather than skipped. A member whose descriptor
carries a getter or a setter is an **accessor**; a member whose value is a function is an
**operation**; anything else is a **value**. Only operations are read against the acceptance rule, and
the counts of all three are published so that the partition is checkable rather than asserted.

**The classification refuses to print rather than leaving a row unresolved.** The probe exits non-zero
if any operation receives no ground or more than one, on ADR-0192's own shape — *I read all 443* is a
claim; a probe that cannot finish without assigning every row is a measurement.

**What the reading inherits is published rather than hidden.** Two judgements are the assistant's: that
an operation belongs to the proposal rather than to the pre-existing surface, and the rule 7 reading of
each in-scope operation. Both are published so that a reader may dispute a row.

#### R13 and R2, posed before any candidate

**These two are posed first because they are the two that sweep widest, and because deciding them in
the middle of a candidate list is deciding them to suit a candidate.**

**R13 — a contract must give one answer on every runtime.**
[ADR-0207](0207-the-complement-of-the-twelve-refusals-is-four-clauses.md) settles it as the thirteenth
ground, under **P4**, and settles what kind of ground it is: *it is a constraint on the specification
rather than a refusal of a subject: it eliminated a **unit** for `string/truncate` without refusing the
candidate, which was refused on R3.* [ADR-0158](0158-the-seventh-contract-is-object-deep-equal-and-ten-refusals-say-why.md)
is where the measurement was taken, on graphemes: a function whose answer follows the runtime's ICU
version settles its question differently on two machines, which is not a contract.

**The distinction that is posed here rather than decided in flight**: time zones are tzdata, and tzdata
is a runtime datum exactly as ICU's Unicode tables are. So **R13 is expected to kill the zone-dependent
unit and is not expected to refuse the `date` family**, in the same way it eliminated graphemes without
refusing `string/truncate`. A calendar-shaped or a duration-shaped candidate is not touched by it.
Whether that expectation holds is a reading, and it is taken before any candidate is weighed.

**ADR-0207 names this unit's other possible product**: *R13 gaining a sole instance. It refuses nothing
in the population today.* If a zone-dependent operation is the first address R13 refuses on its own,
that is a ground acquiring its first instance, and it is reported whether or not anything else survives.

**R2 — a written normative specification outside this catalogue is the contract.** ADR-0192 reads it
off `semver/compare`, `string/compare-natural` and `string/pluralise`: cases where implementing the
specification *is* the function.

**The question is not whether Temporal is specified.** Posed that way it answers itself, and it closes
every family whose API the language has delivered. **The narrow question is whether a specification
says what an operation does, or says what the right answer is** — and this catalogue has already
answered it, in frozen prose, on a published contract.

`number/parse@1` settles four behaviours ECMA-262 normatively specifies, and contradicts all four. Its
own `identity.description` names them: *`Number("")` returns 0, `Number(" ")` returns 0, `Number("0x1F")`
returns 31, `parseFloat("1.2.3")` returns 1.2.* And the comment above its `inputDomain` states the
resolution rather than leaving it to be inferred:

> the same string may legitimately parse under a different domain, since a reader of JavaScript source
> literals must accept `0x1F` and `1_000` while this one must not.

**The domain is what separates them.** ECMA-262 specifies what `Number()` does, normatively and
completely, for the domain of JavaScript source literals. It is not a specification of what parsing
human-authored decimal text should answer, and `identity.inputDomain` says so in as many words — *not a
reader for JavaScript source literals, not a locale-aware parser*.

**So R2 is applied to each Temporal operation as this question**: is there a domain, other than the one
the specification is written for, in which the right answer differs? Where there is none, R2 fires.
Where there is one, R2 does not, and the operation goes on to the other twelve grounds.

**The catalogue already holds one reading that bears on it and it is cited rather than assumed.**
ADR-0150 replayed all forty-three cases of `date/add@1`'s block 4.4 against `ZonedDateTime.add` under
`constrain`: **thirty-eight agree and five part, for three causes** — the empty duration, which Temporal
refuses and the contract answers as the neutral element; fields of opposite sign, which Temporal
rejects; and a field carrying `NaN`. That reading was taken on the draft engine, and its third cause is
published as a suspicion for that reason. **This unit holds the engine ADR-0150 could not get**, so
re-taking it is available and is reported as a second product rather than folded into the search.

#### The acceptance rule

**R1 to R13 as ADR-0207 holds them, read off this catalogue's own refusals rather than written for this
search.** A candidate is refused where any one fires. A candidate is retained where permanent rule 7 is
met positively and none fires: the language's own answer is wrong or surprising on inputs a competent
developer meets, and the correct answer is decidable.

**Not one ground carries a figure**, on [ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md)'s
rule. Demand decides nothing here, not even what is measured: the axis is a namespace, so the whole of
it is read.

#### The prediction, written before the first probe

**The most probable outcome is that no candidate survives, and that R2 is what most of the population
dies on** — Temporal is a large, recently-argued specification whose committee spent years settling
exactly the questions a contract would settle, and *what the right answer is* was the proposal's own
subject in a way it was not ECMA-262's subject for `Number()`.

**I predict, and the three outcomes are named here so that none can afterwards read as a rescue:**

1. **No candidate, and R2 does the killing on the arithmetic and comparison operations.** Most likely.
   The `date` family then closes for a reason **specific to Temporal** — that its specification settles
   the right answer and not merely the behaviour — and not for the general reason.
2. **No candidate, and R2's narrow form turns out not to separate anything here**, so the family closes
   for the general reason that the language delivered the API. This is the outcome with the widest
   consequence and the one I hold least likely, because the `number/parse@1` resolution is published
   and the domain distinction is real.
3. **A candidate survives.** I hold this least likely of the three but not negligible, and if one
   arrives I expect it to be **duration-shaped or parsing-shaped rather than zone-shaped**, because
   R13 is expected to take the zone-dependent unit first.

**I predict R13 gains its first sole instance** on a zone-dependent operation, and that it eliminates a
unit without refusing a subject.

**I predict the population is between 120 and 160 operations**, from a crude walk taken before the rule
was fixed which returned 133 operations, 99 accessors and 24 values over 256 members — a first-order
reading that did not yet carry the two-part window or the recursion rule, and which is therefore quoted
as an expectation rather than as a count.

**I may be wrong, and the shape of being wrong is worth naming.** The sweep could return a trap that is
real, unrepaired and unproposed — Temporal is young enough that its first widely-met surprise may not
yet have been argued about anywhere — in which case this search publishes an eighth candidate and a
later unit decides whether to write it.

## What would reopen this

*Written after the sweep.*

## More Information

### Where the probes live

*Written after the sweep.*

### Coordinates

The method was written and committed against this repository at `46a8a9f`, with the tree clean and
`pnpm meta` green at **11 files and 124 tests**, and **no operation had been read against the
acceptance rule**. The runtime readings in *The runtime, and the guard against the draft* and the two
population readings in *The window* and *The prediction* were taken on **2026-09-04** at that same
commit, before the method was committed, because the method could not be written without knowing
whether a stage-4 engine existed at all; each names the engine it was taken on.

### Why `confirmed-by` is empty

Nothing here reads a record's reasoning. A search's conclusion is prose about a population outside this
repository, and the closure four entries of `CLAUDE.md`'s open list already name, price and refuse — a
validation stage reading this repository's own strings — is what would reach it. It is declared rather
than left blank, on ADR-0186's rule for the neighbouring field.
