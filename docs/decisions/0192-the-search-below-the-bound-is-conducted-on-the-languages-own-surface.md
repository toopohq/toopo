---
status: accepted
date: 2026-09-01
governs:
  - CLAUDE.md
confirmed-by: []
---

# The search below the bound is conducted on the language's own surface

> **This record is committed in two halves and the order is the evidence.** *The method, declared
> before the first probe* and the prediction closing it were written and committed at **`998b6f7`**,
> before any candidate had been looked at; everything else was added afterwards. A criterion written
> after the results bends to them, and a record claiming otherwise is worth exactly what its own
> history says — so the history is the claim, and it is checkable: **that section is byte-identical
> between `998b6f7` and this commit**, heading to the last line of the prediction. What did move
> afterwards is named here so the claim is not read as wider than it is — *What would reopen this*,
> the consequences, the coordinates, and this note, which cannot describe a commit it precedes.
> [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) is the discipline this
> follows, where a condition written a year in advance is what decided a question nobody could have
> argued down on the day.

## Context and Problem Statement

[ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md) settles that a
demand signal may decide what is **measured** and never what is **refused**, and its argument for
permitting the first half is that a selection error self-corrects: the candidate is measured,
permanent rule 7 decides, and a false alarm costs one probe.

**That clause has a premise, and one standing bound breaks it.**
[ADR-0163](0163-there-is-no-eighth-contract-and-the-case-family-came-closest.md) declares at its line
447 that *what was left out is the ecosystem below about 20 M weekly downloads, which is where a
function with a real disagreement and no audience would sit.* Below that bound the candidate is never
measured at all, so the error is as final and as silent as a refusal error while wearing the shape of
no decision. Two searches have now run under it.

**`CLAUDE.md`'s open list says what would close it, in as many words**: *a search conducted below the
bound, whose result is publishable whether or not it finds anything.* This is that search, and it is
the third.

## Decision Drivers

* **A floor cannot be repaired by being lowered.** Any threshold recreates the defect at a new number.
  A bound at 1 M excludes below 1 M with exactly the silence a bound at 20 M excludes below 20 M. The
  entry is not about where the line is; it is about a line nothing revisits.
* **The previous two searches were lists and not sweeps.** `CLAUDE.md` records it: the ten refused
  briefly in ADR-0163 and the four in ADR-0158 are *every one of which names a candidate somebody
  proposed rather than one a sweep returned*. A list of proposals reproduces the proposer, and two
  proposers who read the same ecosystem propose from the same place.
* **A demand figure may not enter a refusal.** ADR-0191's criterion, applied to a search rather than
  argued about. What is stronger here and is free: the axis below is not demand at all, so no figure
  enters selection either.
* **A negative is a result.** ADR-0163 established it by titling itself *There is no eighth contract*.
  The window is therefore declared before it is looked through, so that finding nothing cannot be
  answered by widening it.

## Considered Options

* **Lower the floor** — the same search with a smaller number
* **Sweep npm's own ranking below the bound** — the ecosystem enumerated directly
* **Sweep the language's own surface**, which needs no floor because it is finite
* **Take no search and leave the entry** — refused by the brief and by the entry itself

## Decision Outcome

**Chosen: the language's own surface, swept whole, with no demand floor of any kind.** The search is
conducted under the method declared below, and its result — a candidate or none — is published either
way.

### The method, declared before the first probe

#### The window, and why it carries no floor

**The population is every operation the declared runtime's standard library exposes.** The standard
library is finite, so it is a population without a threshold to bound it. That is the whole reason for
choosing this axis over a smaller number: a floor is what the open entry is about, and an axis needing
none is the only thing that answers it rather than moving it.

**The axis is chosen from a measurement rather than from taste, and the measurement is ADR-0191's.**
Three of the six published contracts — `number/parse@1`, `date/add@1`, `number/round@1` — are language
traps whose package families sum to **25, 117 and 130 562 weekly downloads**, ranking **33rd, 32nd and
31st of 34**. All three sit far below ADR-0163's bound. So the band that bound excluded is not a
margin: it is where half of this catalogue's published work already lives, and the thing that reaches
it is a different question rather than a lower number.

**What the window excludes, stated before it is looked through**: a candidate that is neither a
language trap nor above ADR-0163's 20 M. For such a candidate the ecosystem is the only enumeration
available, and enumerating the ecosystem needs a floor. **So this search narrows the open entry and
cannot close it**, and that is written here rather than discovered at the end — an entry closed by a
search that never covered its population would be the defect this unit exists to repair, committed by
the repair.

#### How the population is enumerated

**A sweep, and the sweep is mechanical.** Every own property name of every standard built-in reachable
in the runtime, together with the own property names of each one's prototype, taken from a script's
output and rebuilt at a stated commit. Not a list of things anybody proposed.

**The residue is then read whole rather than sampled.** Members are excluded only by criteria declared
in advance and applied mechanically; whatever survives is read one at a time against the acceptance
rule. A total reading over a derived population is this repository's preferred shape — *a total map
over a union beats a pass over real data* — and it is what makes *nothing was found* mean something.

**What the reading inherits is published rather than hidden.** Two judgements are the assistant's: the
classification of a global as a standard built-in rather than a host facility, and the rule 7 reading
of each in-scope operation. Both are published so that a reader may dispute a row, on ADR-0191's
treatment of its own family mapping.

#### The acceptance rule, derived from the twenty-seven refusals rather than invented

A rule written for this search could be bent to admit a candidate the searcher liked. These are read
off what this catalogue has already refused, so they were fixed before the field was known. **A
candidate is refused where any one of them holds, and not one of them carries a figure.**

| | ground | established by |
| --- | --- | --- |
| **R1** | the language gives it, or a live proposal is giving it | `array/chunk`, `array/zip`, `array/unique`, `number/clamp`, `string/dedent`, `object/size`, `object/deep-clone`, `url/join` |
| **R2** | a written normative specification outside this catalogue is the contract | `semver/compare`, `string/compare-natural`, `string/pluralise` |
| **R3** | it is one expression over built-ins | `string/truncate`, `array/unique` |
| **R4** | the disagreement is a product choice, with nothing to be wrong against | `number/parse-duration`, `object/flatten`, `object/deep-merge`, `string/parse-query-string` |
| **R5** | there is no ecosystem to disagree | `string/strip-ansi`, `number/is-close` |
| **R6** | it is not a pure deterministic function of its arguments | `function/debounce`, `array/shuffle` |
| **R7** | the signature cannot carry the answer | `string/escape-html` |
| **R8** | it is one algorithm behind several renderings, so it is not one contract | `string/camel-case`, `string/word-wrap` |
| **R9** | its case table cannot be served readably | `array/binary-search`, `function/debounce` |
| **R10** | the residue is one decision | `semver/compare`, `string/compare-natural`, `object/flatten` |
| **R11** | nothing is at stake | `number/format-bytes` |
| **R12** | it collides with a question a frozen contract already settles | `string/camel-case` against `string/slugify@1` |

**A candidate is retained where permanent rule 7 is met positively and none of R1 to R12 fires**: the
language's own answer is wrong or surprising on inputs a competent developer meets, and the correct
answer is decidable — which is the trap clause of rule 7, and the clause `number/parse@1`,
`date/add@1` and `number/round@1` were each published under.

**Demand's role in this search is none.** ADR-0191 permits a figure to decide what is measured; the
axis here is not demand, so no figure decides even that. No refusal written below quotes one.

#### The prediction, written before the first probe

**The most probable outcome is that the sweep returns a small number of real traps and that every one
of them dies on R1 or R3**, because the standard library is the most-read surface in the language and
a trap that survives reading is usually one the committee is already repairing. I predict **at most
one candidate survives**, and that if one does it is in numeric formatting or precision, where the
language's answers are surprising for reasons no proposal removes.

**I may be wrong, and the shape of being wrong is worth naming in advance**: the sweep could return a
trap that is real, unrepaired and unproposed, in which case this search publishes an eighth candidate
and the next unit writes it. It could equally return nothing at all, which ADR-0163 established is a
result.

**What I predict the calibration will show** — the window run against the 34 addresses this catalogue
has ruled on, which is the known answer: the demand axis reaches the three package-backed published
contracts and misses the three traps; this axis reaches the traps. I predict the two together reach
more of the six than either alone, and I do not predict either reaches all six.

### What the sweep returned

**Everything below this line was added after the method above was committed**, and the diff of this
file is what says the method did not move to fit it.

**The population, at `998b6f7` on Node v24.15.0.** 135 globals, partitioned totally — the probe throws
rather than let one through — into **84 excluded** by seven declared groups and **51 in scope**. Those
51 yield **592 members**, of which **443 are operations**; the rest are 90 accessors, 42 numeric
constants, 15 symbols and 2 objects.

**The first version of the sweep was a population narrower than its claim, and that is published
rather than repaired in silence.** It walked own properties of each named object and of its
`.prototype`, which reaches nothing of `%TypedArray%.prototype`: the twelve typed arrays carry
`constructor` and `BYTES_PER_ELEMENT` and inherit their **36** operations from a shared intrinsic that
is an own property of nothing reachable by name. The repair walks each prototype chain and reaches the
seven unnamed iterator intrinsics through real instances. **It is ADR-0189's lesson arriving on the
sweep that was written knowing it** — a sweep aimed at somebody else's blind spot has one of its own —
and it was caught by the holder breakdown reading `31 BYTES_PER_ELEMENT` where it should have read
thirty-one operations.

**The classification is total and it is checkable rather than asserted.** *I read all 443* is a claim;
what stands in its place is a probe that assigns each operation a ground by a declared rule and
**refuses to print if one is unassigned or claimed twice**. Measured: **443 operations, 443 assigned.**

| ground | operations | |
| --- | --- | --- |
| R5 | 106 | the specification fixes the answer and nothing disagrees |
| R2 | 80 | a normative specification outside this catalogue — ECMA-402, WHATWG URL and Encoding |
| R6 | 57 | stateful, mutating, iterator-valued or not a function of its arguments |
| R7 | 55 | the object model or a byte window, whose answer the signature cannot carry |
| R3 | 30 | one expression, or a conversion with nothing to settle |
| R9 | 29 | takes a function, so its case table cannot be served readably |
| R1 | 26 | the language ships the answer, or ships the repair |
| annex-b | 20 | legacy, normative only for web compatibility |
| **the reading stopped here** | **40** | — |

### The forty, and why not one of them is an eighth contract

**Four of the forty are this catalogue's own published work**, which is the calibration rather than a
result: `parseInt` and `parseFloat` are `number/parse@1`; `Math.round` is `number/round@1`;
`Date.prototype.setMonth` and `setDate` are `date/add@1`; and `Object.keys` answering `[]` for a `Set`
is `object/deep-equal@1`'s trap clause — measured here rather than recalled,
`Object.keys(new Set([1, 2]))` answers `[]`. `Object.groupBy` and `Map.groupBy` are the operations that
refused `array/group-by@1`. **The axis reaches the catalogue, including the contract it turned down.**

**The rest are refused on grounds fixed before the field was known, and not one refusal below carries
a figure.**

* **`Number.prototype.toFixed`, `toPrecision`, `toExponential`** — the strongest candidate, and the one
  the prediction named. Refused on **R8 and R12**, and the measurement is what decides it rather than
  the resemblance. Over 27 cases, `toFixed` and `number/round@1` followed by padding **differ on 10**;
  and `Number(v.toFixed(p))` differs from `round(v, p)` **on the same 10**. So the whole of the
  disagreement is the rounding, and the rounding is a published contract's subject: `number/round@1`
  is frozen, its `inputDomain` reads *It is not a formatter - the answer is a number and never text*,
  and its `description` already names `(1.005).toFixed(2)` as the trap it corrects. A formatter either
  adopts that rule — publishing one algorithm behind a second rendering, which is `string/camel-case`'s
  refusal exactly — or contradicts it, at which point the catalogue holds two rules for one question,
  which is R12 in as many words. **What is left once the rounding is removed is the sign on `-0.00` and
  the exponent threshold at 1e21**, and a contract is not written for one decision.
* **`atob` and `btoa`** — refused on **R1**, read rather than assumed: *Uint8Array to/from Base64* is
  **stage 4 and finished**, listed in `tc39/proposals`' finished set for 2026. This runtime does not
  have it — `Uint8Array.prototype.toBase64` is `undefined` at v24.15.0 — which makes it `date/add@1`'s
  shape rather than an escape: a contract published now is `array/group-by@1` written again, knowingly.
  **R2 stands behind it**, RFC 4648 specifying the alphabet, the padding and the URL-safe variant.
* **`JSON.parse` and `JSON.stringify`** — refused on **R1**, and the repair is measured in this runtime
  rather than read off an index: `JSON.rawJSON` and `JSON.isRawJSON` are functions here, and a reviver
  receives `context.source`. The precision loss is real — `JSON.parse('{"id":12345678901234567890}')`
  answers `12345678901234567000` — and the language has shipped both halves of the fix. A serialiser
  that survives more types is a **superset grammar somebody invents**, which is R4 and
  `string/parse-query-string`'s refusal.
* **`Object.entries` and `Object.values`** — they carry `Object.keys`'s two traps and are refused on the
  half that is not already published. The `Set` hole is `object/deep-equal@1`'s. The other is the
  ordering, integer-like keys coming first whatever the source order: that is **R2**, ECMA-262
  specifying it exactly, and **R5** behind it, since nothing in the ecosystem answers differently.
* **`structuredClone`, `Object.assign`, `Object.freeze`** — shallow against deep is `object/deep-merge`'s
  and `object/deep-clone`'s refusal already taken: **R1** for the clone, **R4** for the merge, where
  concatenating or replacing an array is a product choice no measurement settles.
* **`Array.prototype.sort` and `%TypedArray%.prototype.sort`** — **R9** before anything else, since a
  comparator is an argument with no spelling; then **R3**, the repair being `(a, b) => a - b`; then
  **R1**, `toSorted` having shipped.
* **`Array.prototype.indexOf` against `includes` on `NaN`** — **R1**. `includes` is the language's own
  repair and it is in this runtime.
* **`Array.prototype.flat`, `Math.max`, `Math.min`** — **R3**. A default depth of one is repaired by an
  argument, and `Math.max()` answering `-Infinity` is a fact about an empty maximum rather than a defect.
* **`String.prototype.padStart`, `padEnd`, `slice`, `split`** — the UTF-16 code-unit question, refused
  on **R12**: `string/levenshtein@1` chose code points, declared the choice in `identity` and wrote into
  its own `inputDomain` that the variants *answer different questions and are separate contracts*.
  `string/truncate` was then refused on **R3** for this exact shape.
* **`String.prototype.toLowerCase`, `toUpperCase`, `normalize`, `trim`, `replace`, `replaceAll`** —
  **R2**. Unicode's default case conversion, UAX #15 and ECMA-262's replacement patterns are written
  normative specifications, and **R5** stands behind each: nothing in the ecosystem answers differently.
* **`encodeURIComponent` and `decodeURIComponent`** — **R2**, RFC 3986.
* **`Date.parse`** — **R1**. Temporal is stage 4 and is the language's answer to parsing a date that is
  not ISO; `date/add@1` already carries the arithmetic.
* **`Number.prototype.toString` at a radix** — **R5** and **R11**. Fractional radix conversion is
  surprising and nothing disagrees about it, and rule 7 has no clause for a rendering nobody's invoice
  depends on.

**So the search returns no eighth contract**, and that is a result rather than a gap — ADR-0163 having
established it by titling itself *There is no eighth contract*.

### The prediction is scored, and it was right for a reason worth reading

It predicted **at most one candidate survives**, and that if one did it would be **in numeric
formatting or precision**. Measured: **none survives, and the one that came closest is
`Number.prototype.toFixed`** — numeric formatting, as named. **The prediction was right about the
location and about the outcome, and its argument was half wrong**: it expected the survivors to die on
R1 or R3, and the strongest died on R8 and R12 — a collision with something this catalogue had already
frozen rather than with the language. ADR-0163 recorded the same asymmetry about its own prediction and
it is recorded again here: reaching the right verdict through a different argument is a prediction that
was not doing the work it looked like it was doing.

### The calibration, run on the known answer

**Refusing to calibrate would be choosing the window that flatters the result.** The question a window
has to answer is whether it reaches the contracts this catalogue has already published — and *reaching*
splits in two, which no earlier reading here has separated: whether the contract's incumbent operation
is **in the population**, and whether **reading it yields the contract**.

| published contract | its incumbent, in this population | in population | reading yields it |
| --- | --- | --- | --- |
| `number/parse@1` | `parseInt`, `parseFloat` | yes | **yes** |
| `number/round@1` | `Math.round` | yes | **yes** |
| `date/add@1` | `Date.prototype.setMonth` | yes | **yes** |
| `object/deep-equal@1` | `Object.keys` on a `Set` | yes | **yes** |
| `string/slugify@1` | `String.prototype.normalize` | yes | no |
| `string/levenshtein@1` | none | **no** | no |

**Five of six are in the population and four of six are yielded**, and the gap between those two
columns is the honest part: `normalize` is swept, read and refused on R2, and no amount of reading it
composes a slug. A contract that *uses* a built-in is not a contract the built-in leads you to.

**Against the axis it replaces, on ADR-0191's own figures.** Those three language traps have package
families summing to 25, 117 and 130 562 weekly downloads and rank 33rd, 32nd and 31st of 34, so
ADR-0163's bound reaches **three of six** — `object/deep-equal@1`, `string/levenshtein@1` and
`string/slugify@1`, the three with a package family. **Neither axis reaches this catalogue alone and
the two together reach all six**, overlapping on exactly one contract. That is the calibration's
finding: the bound was not trimming a margin, it was excluding half the published catalogue, and the
half it excluded is the half this window was built for.

**Those figures decide what was looked at and nothing else.** ADR-0191 permits that and forbids the
converse, and the converse does not occur: no refusal in the forty above quotes a number.

## What would reopen this

* **A candidate below the bound that is not a language trap.** This window does not reach one, which
  is stated above rather than found at the end. The open entry survives this search narrowed to
  exactly that band, and what would reach it is an enumeration of the ecosystem that does not need a
  floor — which nothing available provides.
* **The standard library growing.** The population is a snapshot of one runtime at one version. Every
  proposal that reaches stage 4 adds operations to it, and each addition is a row this sweep did not
  read. The sweep is cheap to re-run and names the commit and runtime it was taken on so that it can
  be.
* **A refusal ground being wrong.** R1 to R12 are read off twenty-seven refusals, and a refusal can be
  wrong — ADR-0163 found that one of the two legs ADR-0158 gave `string/camel-case` was refuted. A
  ground that falls reopens every candidate this search refused under it.
* **The registry gaining a readable spelling for a function argument.** R9 refuses higher-order
  candidates on the catalogue rather than on themselves, which is ADR-0163's own reopening trigger
  arriving here as a rule. It is the largest single ground below the specification ones — **29 of the
  443** — so it is the change that would most enlarge a future sweep's field.
* **`number/round@1` reaching a second major.** The strongest candidate died on a collision with a
  frozen contract rather than on its own merits, which is a refusal a later catalogue can overturn
  where R1 and R2 refusals are not. It is the one of the forty that is refused by this catalogue
  rather than by the language or by a standards body.

### Consequences

* **The open entry on the population bound narrows and does not close**, and the band it narrows to
  was named before the search rather than after it: a candidate that is neither a language trap nor
  above ADR-0163's bound. Nothing here reaches one, because enumerating the ecosystem needs a floor and
  a floor is what the entry is about.
* **`CLAUDE.md` carries the narrowed entry**, replacing the sentence this record's first commit put
  there while the search was under way.
* **No contract is published and none is proposed.** The unit that follows this one is not a contract.
* **No digest moves and nothing under `contracts/` is touched.** `pnpm freeze` is green before and
  after, `pnpm ledger` is byte-identical across the unit, and `THE_PACKAGE_VERSION` does not move.
* **Nothing goes to npm.** This unit publishes a record.

## More Information

* [ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md) is the
  criterion this search is conducted under, and the record whose surviving entry it answers.
* [ADR-0163](0163-there-is-no-eighth-contract-and-the-case-family-came-closest.md) is the second
  search, the record that declared the bound, and the source of R1, R4, R9 and R10.
* [ADR-0158](0158-the-seventh-contract-is-object-deep-equal-and-ten-refusals-say-why.md) is the first
  search and the source of R2, R3, R5, R6, R7, R8, R11 and R12.
* [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) is why the method is
  committed before the search rather than written up beside its result.
* [ADR-0018](0018-a-published-count-carries-its-coordinates.md) is why every figure below carries the
  commit it was measured at and the population it counted.

### Why `confirmed-by` is empty

The subject of this record is which evidence may enter a search, and a search is argued in prose in a
record. Nothing here reads a record's reasoning — the closure four entries of `CLAUDE.md`'s open list
already name, price and refuse as a lint over prose. It is declared rather than left blank, on
[ADR-0186](0186-a-decision-that-rules-no-code-declares-that-absence-with-its-reason.md)'s rule for the
neighbouring field.

### What this search could not settle

**The window is one runtime at one version**, and it is a snapshot rather than a property. The
population is Node **v24.15.0**'s, so an operation that arrives with the next stage-4 proposal is a row
this sweep did not read — and two of the forty were refused *because* something is arriving that this
runtime does not yet hold.

**Two judgements are the assistant's and a reader may dispute either.** The partition of 135 globals
into 84 excluded and 51 in scope is a declaration, checked for totality and not for correctness. And
the classification of 443 operations into nine grounds is a reading; the probe proves that every
operation received exactly one ground, and nothing proves the ground is the right one.

**The reading of a trap is not a measurement of one.** Thirty-nine of the forty were refused by
argument from a ground; **one was measured**, because R8 and R12 are the two grounds where a
resemblance can be mistaken for an identity, and the 10-of-27 reading is what turns *this looks like
`number/round@1`* into *the whole of the disagreement is its subject*.

**The band the entry narrows to is not bounded here.** *Every candidate that is neither a language trap
nor above 20 M weekly* is not enumerable from this repository, and no figure is offered for its size,
because a figure would be an estimate wearing a count's clothes.

### Coordinates

The method was written and committed against this repository at **`ea00a08`**, with the tree clean and
`pnpm meta` green at **10 files and 115 tests**; it landed at **`998b6f7`**, where `pnpm meta` was green
at the same reading, and **no probe had run**. Every figure below that line was measured on
**2026-09-01**, on **Node v24.15.0**, against the tree at `998b6f7`. TC39 stages were read from
`tc39/proposals`' own index and finished list through the GitHub API on the same day; `Uint8Array
to/from Base64` was read off the finished list rather than the stage index, which is why it is stated
as finished rather than as stage 3.

**The demand figures quoted in the window argument and in the calibration are ADR-0191's**, taken at
`3cec9a8` for the window ending 2026-08-29, and they are cited rather than re-measured. They decide
what was looked at. **No refusal in this record quotes a figure.**

### Where the probes live

The four probes and their raw output are not in this repository — stage rule 5 keeps working material
out — and each figure above names the population it was taken over and the runtime it was taken on, so
that it can be rebuilt. The two that carry the load are the surface sweep, which throws rather than
leave a global unclassed, and the classification, which exits non-zero rather than leave an operation
unassigned.
