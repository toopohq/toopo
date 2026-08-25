---
status: accepted
date: 2026-08-25
decision-makers: Mathis Perron
governs:
  - CLAUDE.md
confirmed-by: []
---

# There is no eighth contract, and the case family came closest

## Context and Problem Statement

The catalogue holds seven contracts and six installable ones. ADR-0158 chose the seventh and, more
usefully, wrote down the ten candidates it refused with the measurement that refused each — so that
the eighth search would start from something rather than from nothing. This is that search, and its
first job is to find out whether that record has bought anything.

Two days separate the two readings. That is short enough that most of this record is a *re-reading*
rather than a re-measurement, and short enough that the interesting question is not *what changed*
but *what did ADR-0158 assert rather than measure*. Three of its sentences turned out to be
assertions, and two of the three are wrong.

## Decision Drivers

* **Permanent rule 7, in both directions.** `array/group-by@1` established that clearing the bar is
  not a property a contract acquires once and keeps: the language moves. It moves both ways — a
  candidate refused because a proposal was coming is a candidate again if the proposal stalled — so
  every proposal load-bearing on a refusal is read again with its stage and its last push.
* **A refusal is a measurement somebody paid for.** Re-measuring all ten would waste what ADR-0158
  bought. What is re-taken is what rests on a stage, what rests on an assertion, and what the seventh
  contract's own cost has since made answerable.
* **Two questions the seventh contract cost a whole unnoticed unit to learn.** *Can the registry
  serve this candidate's cases?* was never asked before `object/deep-equal@1` was recommended, and
  the answer arrived as work. It is asked here in advance, of every candidate retained.
* **A negative is a result.** A catalogue of seven with no obvious eighth is worth more than a
  mediocre eighth frozen for the life of its major, and the search is written so that the ninth
  starts from here in turn.

## Considered Options

* the ten refusals of ADR-0158, re-examined rather than re-measured
* `string/camel-case` and the case-conversion family — re-examined first, and refused a third time
* `object/flatten` — new, measured, refused
* `string/compare-natural` — new, measured, refused
* ten further candidates refused briefly, each on one fact

## Decision Outcome

**Chosen: no eighth contract is published.** The ten refusals hold. Not one proposal load-bearing on
a refusal has moved. The two new candidates measured in full are refused on rules this catalogue
already established. The case family is refused a third time, and for the first time on a leg that
was measured rather than regretted.

**The catalogue is not closed and nothing here says it should be.** What is settled is that the
eighth is not among the candidates this repository has now looked at twice, and that the next
search's cheapest move is a decision about families rather than another sweep of the ecosystem.

### The prediction this search wrote down before it measured anything

**Written on 2026-08-25, before the first probe ran**, in the plan the owner approved: *the most
probable outcome is that the ten hold and no new candidate passes, and I may be wrong — that is what
phases 1 and 4 are for.*

It held, and the way it held is worth more than the fact. **It was right about the outcome and wrong
about the reason.** The plan expected `string/camel-case`'s refusal to survive on the two legs
ADR-0158 gave it. Measured, one of those two legs is refuted and the other is weaker than stated —
and what refuses the candidate is a third leg neither record had, plus a criterion written down in
ADR-0023 a hundred and forty records ago. A prediction that reaches the right verdict through the wrong
argument is a prediction that was not doing the work it looked like it was doing, and it is recorded
that way rather than as a hit.

### What the language is doing, read on the day

Read on **2026-08-25** from `tc39/proposals` and from each proposal's own repository, because *there
is a proposal* and *the language is coming for this* are different sentences and only the second
refuses a contract.

| proposal | stage | last push | what it bears on |
| --- | --- | --- | --- |
| Iterator Chunking | 3 | 2026-07-06 | refuses `array/chunk` |
| Composites | 1 | 2026-08-18 | the `object/deep-equal@1` watch |
| Array Equality | 1 | 2021-04-22 | the same watch, five years dormant |
| Comparisons | 1 | 2026-06-11 | the same watch, and the real risk |
| Smart Unit Preferences in `Intl.NumberFormat` | 1 (ECMA-402) | 2026-01-23 | `number/format-bytes` |
| `Math.clamp` | 2 | 2025-08-24 | refuses `number/clamp` |
| `String.dedent` | 2 | 2023-08-21 | refuses a dedent candidate |
| Joint Iteration | 4, ES2027 | 2026-05-29 | refuses an `array/zip` |

**Not one of them has moved.** Composites, Array Equality and Comparisons carry the same last-push
timestamps ADR-0158 published two days ago, to the day. The proposals index itself last moved on
**2026-07-23**, which is *before* ADR-0158 read it — so the stage lists both records read are the
same document, and the agreement between the two readings establishes reproducibility rather than
stability.

**So the language reopens nothing and refuses nothing new.** `object/deep-equal@1` owes no
`againstTheLanguage` answer today, and `array/chunk` stays refused for the reason it was refused.

**Two stage 2 proposals strengthen a refusal rather than creating one.** `Amount` — a number carrying
a unit — sits at stage 2 beside Smart Unit Preferences at stage 1. `number/format-bytes` was refused
because nothing is at stake, not because a proposal was coming; that refusal is unchanged, and the
language moving underneath it is now a second reason rather than the first.

### `string/camel-case` re-examined, which is what this unit was asked to do first

ADR-0158 refused it **with regret**, on two legs. Both were re-examined against a measurement, and
the result is that the record's verdict was right and its argument was not.

**Every figure below is over the same four libraries at the same versions ADR-0158 resolved** —
`change-case@5.4.4`, `camelcase@9.0.0`, `scule@1.3.0`, `lodash@4.18.1` — on Node v24.15.0, which is
also ADR-0158's runtime. The two readings are therefore directly comparable.

#### Leg A — *it is a family and not a function* — is refuted for the decomposition and holds for a different reason

The decomposition to test is `string/split-words`: one algorithm, one contract, the four cased
renderings becoming a join at the call site. **The measurement says the decomposition is real.**

Over twenty-nine inputs, recovering each library's implied word list from its own kebab-case answer
and re-rendering it as camelCase, PascalCase and snake_case: **82 of 87 rows are reproduced exactly by
the split.** Where the disagreement lives is the question that decides the leg, and it lives in the
split:

| where the four libraries disagree | inputs, of 29 |
| --- | --- |
| the split itself | **17** |
| the rendering, with the split agreeing | **3** |

All three rendering disagreements are one library — `scule` preserves a word's interior casing where
the other three normalise it, giving `xMLHttpRequest`, `parseHTMLString` and `aLLCAPS`. So a
`string/split-words@1` would carry the whole algorithm, and a caller's own line recovers camelCase:
over the same twenty-nine inputs the one-expression rendering **reaches a three-of-four majority on
24 and matches all four on 12**, and its five misses are the split forks already counted rather than
new ones.

**What refuses it is ADR-0023, and by that record's own deciding criterion rather than by a judgement
taken here.** ADR-0023 settles what an alias may be: *an alias that promises what we do not do costs
trust*, and it kills `string similarity` on `string/levenshtein@1` because *it is a different function
with a different output shape — so the alias is a lie whether or not that contract is ever written*.
`camel case` on a word splitter is that sentence exactly: the reader who types it wants a string and
receives an array. So `string/split-words@1` may be published and may not declare a single phrase
anybody would type to reach it.

**And the resolution this search went looking for is not there, which was checked rather than
assumed.** `useCases` looked like the mechanism that would ship the four renderings beside the
splitter as verified artefacts — they are standing, executable, and replayed by
`every-use-case-replays-through-the-stripped-artefact-a-browser-runs`. Read: a use case carries
`text` and `expected` and the guard **calls the contract's own shipped export with them**. It is one
call of the function, not a caller's composition, so `splitWords(x).map(…).join('')` cannot be
expressed as one. ADR-0158's sentence — *nothing in this catalogue's format resolves that* — stands,
tested.

#### Leg B — *it collides with `string/slugify@1`* — is weaker than ADR-0158 stated

The claim is that a case contract must answer the question slugify froze about `é`. Measured over six
accented inputs across the three libraries that expose a kebab renderer, separating **where the word
boundaries are** from **how the word comes back spelled**:

| input | word counts | distinct spellings |
| --- | --- | --- |
| `ÉtéChaud` | 2, 2, 2 | 2 |
| `café-au-lait` | 3, 3, 3 | 2 |
| `naïveté` | 1, 1, 1 | 2 |

**The boundaries are unanimous and only the spelling differs**, and only `lodash` folds. So a splitter
returning the input's own characters answers nothing slugify answers, and leg B dissolves entirely for
the decomposition. For a camel-caser the question is live — but a JavaScript identifier may carry `é`,
so preserving is defensible for that target where folding is defensible for a URL, and the two
contracts would be right for two different jobs. It is the documentation debt ADR-0158 itself called
*not fatal*, and it is not a refusal.

Two of the six inputs — `straße wagen` and `crème brûlée` — return a word count of 1 from `scule`,
which fails to split them at all. That is a defect in one library rather than a fork, and it is named
here so the count above is not read as a three-way disagreement.

#### Leg C — the digit fork — is what actually refuses `string/camel-case` on its own

Neither record had this. Over twenty inputs carrying a digit, **7 are disputed and 5 split exactly two
against two**:

| input | change-case | camelcase | scule | lodash |
| --- | --- | --- | --- | --- |
| `foo2bar` | `foo2bar` | `foo2Bar` | `foo2bar` | `foo2Bar` |
| `a1b2c3` | `a1b2c3` | `a1B2C3` | `a1b2c3` | `a1B2C3` |
| `sha256sum` | `sha256sum` | `sha256Sum` | `sha256sum` | `sha256Sum` |
| `point3d` | `point3d` | `point3D` | `point3d` | `point3D` |
| `test123case` | `test123case` | `test123Case` | `test123case` | `test123Case` |

The fork is whether a lower-case letter following a digit begins a new word. **Neither answer is
wrong**: `point3D` reads better than `point3d`, and `sha256sum` is a command name that `sha256Sum`
mangles. The fork is also sharply bounded — every input whose digit is already followed by a capital
is unanimous, across `v2Point0`, `utf8Decoder`, `parseInt32`, `html5Parser`, `base64Encode`,
`md5Hash`, `vector2D`, `ipv4Address`, `oauth2Token`, `h1Heading`, `mp3File` and `x86Assembly`.

That is `string/truncate`'s refusal arriving on a different candidate: a contract freezing one of them
for the life of a major is freezing a preference.

#### Two refusals, and the second survives the first

**This record first wrote that a rule for families of one algorithm was the highest-value opening the
search had found, and quoted 442.55 M weekly against it. That framing was wrong and the owner refused
it on the record's own leg C**, hours after it was published: leg C refuses `string/camel-case`
*independently of the format*, so a format change cannot be what stands between this catalogue and
that demand.

**Measured rather than conceded, because the question it turns on is where the fork lives.** If the
digit fork were a rendering decision, each member of the family would meet it separately and a member
might escape. It is not. Over the five evenly split inputs, **the shared word split is itself disputed
5 of 5** — `lodash` reads `foo2bar` as `['foo', '2', 'bar']`, `sha256sum` as `['sha', '256', 'sum']`
and `point3d` as `['point', '3', 'd']`, where `change-case` and `scule` read each as one word.

**And no rendering escapes it: camelCase, kebab-case, snake_case and PascalCase are each disputed 5 of
5.** The shape differs and the difference is the population rather than the fork — camelCase and
PascalCase split evenly because four implementations answer them, kebab-case and snake_case run two
against one because `camelcase` exposes no kebab renderer. It is one fork, in one place, and that place
is the algorithm every member shares.

**So the two refusals are independent and the second is the load-bearing one.** A families rule would
relocate the fork from four contracts to one; it would not dissolve it, because whatever is published —
`string/split-words@1` or `string/camel-case@1` — has to answer whether `foo2bar` is one word or three,
and nothing in the use of either constrains that answer. **The 442.55 M is what the catalogue is giving
up, and it is not what a format change would buy back.** It is written this way so the ninth search does
not read a format decision as a door to this demand.

**The obvious counter was tested and it is why this leg is decisive rather than merely true.**
`string/slugify@1` was published with *worse* agreement than this — four libraries agreeing on seven
of fifty-seven samples — so ecosystem disagreement alone cannot refuse a contract, and a record
claiming it does would be overruled by this catalogue's own fifth publication. What separates them is
the sentence ADR-0158 wrote about `number/parse-duration`: **slugify's use — a URL — constrains the
answers even with no oracle.** Here the use is an identifier, and it constrains the accent question
and does not constrain the digit one. What would be frozen is a preference with nothing above it.

#### And the demand is the highest measured anywhere in this search

Weekly npm downloads, read on 2026-08-25, quoted as orders because they count installs and not
decisions:

| family | weekly | packages summed |
| --- | --- | --- |
| the case family | **442.55 M** | `camelcase`, `decamelize`, `lodash.camelcase`, `change-case`, `param-case`, `snake-case`, `camelcase-keys`, `lodash.snakecase`, `lodash.kebabcase`, `scule`, `to-case` |
| deep-equal | 293.58 M | `fast-deep-equal`, `dequal` |
| levenshtein | 101.43 M | `fastest-levenshtein`, `leven`, `js-levenshtein` |
| slugify | 23.62 M | `slugify`, `slug`, `@sindresorhus/slugify`, `limax` |

**These are not ADR-0158's figures and are not comparable to them.** That record quoted the
levenshtein family at 244 M and the slugify family at 26 M over populations it did not enumerate; the
populations above are enumerated so that this table can be rebuilt. What the table is read for is one
comparison and not a rank: the case family is **1.5 times** the family standing behind the contract
this catalogue published two days ago.

**So this is the most expensive refusal in the record**, and it is written at length for that reason.
Somebody will want to overturn it, and what they need is the leg that decides it — the digit fork
against a use that does not constrain — rather than the two legs ADR-0158 gave.

### Two questions the seventh contract taught this search to ask in advance

`object/deep-equal@1` cost an unplanned unit because nobody asked whether the registry could carry
its case table before recommending it. Both questions are asked here of every candidate, and the
first produced a refusal nothing else in this search would have found.

#### Can the registry serve this candidate's cases?

The registry's vocabulary is nineteen kinds, and what it *cannot* spell is a closed declaration —
`WITHOUT_A_SPELLING` in `packages/site/literal.ts`, three arms: a function, a value whose contents
cannot be read, an instance of a class. Measured at `3daae2f` by serialising every contract of the
catalogue and rendering each case as `theCallOf` renders it on a page:

| contract | cases | with an argument that has no spelling |
| --- | --- | --- |
| `array/group-by@1` | 30 | **30** |
| `object/deep-equal@1` | 49 | 5 |
| `number/parse@1` | 50 | 0 |
| `date/add@1` | 43 | 0 |
| `string/levenshtein@1` | 23 | 0 |
| `string/slugify@1` | 41 | 0 |
| `number/round@1` | 31 | 0 |

**A higher-order contract publishes a case table nobody can read.** Every one of `array/group-by@1`'s
thirty cases renders as `groupBy([1, 2, 3, 4, 5], <a function, served as a file>)` with the answer
beside it — and the key function, which is half of what the case settles, is not in the record. The
reader recovers it only by fetching the harness file, and the playground cannot open on such a case at
all, because `read-literal.ts` refuses those three words by construction.

**Nobody has ever seen this**, which is why it took a probe rather than a reading: `array/group-by@1`
is refused, a turned-down contract's page renders no case table, and so thirty unreadable calls have
been serialised and never rendered.

**It refuses two of ADR-0158's ten a second time.** `array/binary-search` takes a comparator and
`function/debounce` returns a closure; both were refused on other grounds, and both now carry a
refusal about the catalogue rather than about themselves. The correlation is not a cause — group-by
was refused because `Map.groupBy` shipped — but the catalogue has never published a contract whose
case table is mostly unreadable, and the one contract at 100 % is the one it turned down.

#### And does the widened registry reopen any of the ten?

`object/deep-equal@1` took the vocabulary to nineteen kinds — `map`, `error`, `boxed`, `typed-array`,
`instant`, `big-integer`, `opaque`, `instance` arrived with it. The question is whether a candidate
written off for what its cases contain is now servable.

**No, and the reason is that none of the ten was refused on that ground.** Read one at a time, the ten
were refused for a product choice, an external normative specification, a signature that cannot carry
the context, one expression over two built-ins, a proposal at stage 3, or demand. Not one names the
registry. **The widening reopens nothing**, and this is written down as a result rather than left as a
blank, because the same widening is what makes a *new* candidate's rich case table cheap — which is
what the two candidates below were looked for under.

### What an eighth contract would cost, which is now a figure

`registry-storage` holds **94 cells at `3daae2f`**, counted from `THE_BATTERIES` rather than taken
from the workflow's own comment, and reproducing it. The whole instrument is **672 cells over 23
batteries**, and the matrix is `9 + 2n` jobs, so an eighth contract takes it to 25.

A contract adds 36 guards to the registry suite and 56 s, which is 3.3 cells; the joint line at eight
contracts is 133 cells. **So the margin an eighth contract would leave is 39 cells**, and its own two
batteries land on jobs of their own rather than on that bound. This is not a refusal and nothing here
was refused on it — it is the figure ADR-0158 could not state, recorded so that the ninth search does
not have to derive it again.

### Consequences

* **`CLAUDE.md` is repaired in the commit that carries this record.** Two of its sentences were false
  at `3daae2f` — *The catalogue is six contracts* and *The seventh is decided and not written* — while
  a third sentence four hundred lines above says the seventh is published. Both false ones were
  written by ADR-0158, which declares `governs: CLAUDE.md`; this record succeeds it and is the change
  that touches that zone.
* **No refusal here rests on anything unkept**, so the open list gains no entry from the search
  itself. **The repair found one and it is named rather than filed**, because a unit whose subject is
  which function comes eighth is not where this repository's backlog is decided. Nothing derives the
  contract roster of `CLAUDE.md` from the catalogue: `theCatalogue` knows it holds seven and the
  sentence saying *six* was prose, so a guard-rich repository carried a false count for two days with
  every suite green. It is the class the entry about page counts already names one population over,
  and the population here is different — every statement in this repository of how many contracts
  exist. What would close it is the same thing three entries of that list already name and refuse, a
  validation stage reading this repository's own strings. Reachable and not taken.
* **No digest moves and nothing under `contracts/` is created.** This unit writes a record and repairs
  a paragraph.

## What would reopen this

* **A rule for families of one algorithm**, which ADR-0158 named and which this record first framed
  wrongly. **It opens the category and it does not open the demand**, and the correction is in
  *Two refusals, and the second survives the first* above. It is a real question about the format and
  it is not the door to 442.55 M weekly installs; the next search should reach for it because four
  contracts publishing one algorithm is a format defect, never because opening it would make the case
  family admissible.
* **A mechanism that lets a case table carry a function readably**, which would reopen
  `array/binary-search` and every higher-order candidate at once, and which the measurement above
  prices: today such a contract publishes thirty calls a reader cannot check.
* **`Comparisons` reaching stage 2 with rich equality comparisons in scope**, which is
  `object/deep-equal@1`'s watch rather than an eighth-contract question, carried forward from
  ADR-0158 with its last push re-read here.
* **Iterator Chunking stalling**, which would return `array/chunk` to the field. It is at stage 3 and
  moved on 2026-07-06.
* **A better demand signal than npm downloads.** Unchanged from ADR-0158 and now leaned on twice more.

## The candidates measured

### `object/flatten` — new, refused

Four implementations over twenty inputs: **12 are disputed.** That reads well and it is not the
reading that decides it.

**What the four agree on is the defect.** `flatten({'a.b': 1})` answers `{'a.b': 1}` from all four,
and `unflatten` of that answers `{a: {b: 1}}` — so a key that was literally `a.b` silently becomes a
nested object. `flatten({'a.b': 1, a: {b: 2}})` answers `{'a.b': 2}` from all four: two distinct
pieces of data collapse into one and one is destroyed. Measured over six round trips, **two lose
data**.

**What they disagree about is all invented.** `dot-object` writes `a[0]` where `flat` and `flattie`
write `a.0`; `flatten-anything` does not descend into arrays at all; `flattie` drops `null`, an empty
object, an empty array, a `Date`, a `Map`, a `Set` and a `RegExp` where the other three keep them.
Separator, array syntax and what survives are three product choices, and there is nothing to be wrong
against — which is `number/parse-duration`'s refusal in as many words: the use constrains nothing.

The one real defect dissolves the moment a contract declares that no key may contain the separator,
and a contract is not written for one decision. Demand is **40.0 M weekly** over `flat`, `flattie`,
`flatten`, `dot-object` and `flatten-anything`, which is above the slugify family and well below the
levenshtein one.

### `string/compare-natural` — new, refused

`natural-compare@1.4.0` is 144.68 M weekly, which is what made it worth measuring rather than
dismissing. Over twenty-two pairs against `natural-orderby@5.0.0` and `Intl.Collator` with
`numeric: true`: **9 are disputed, and `Intl.Collator` agrees with `natural-compare` on 17 of 22.**

**The language ships this and ECMA-402 specifies it**, which is `array/group-by@1`'s refusal with the
specification inside TC39 rather than outside it. The nine disputes are locale and interpretation
rather than wrong answers: `x` against `X` is a case-ordering choice, `ä` against `z` is German
against Swedish, and `3.14` against `3.9` depends on whether the string is a decimal or a version —
`natural-orderby` reads it one way and the other two the other.

The residue is one decision: `Intl.Collator` answers **0** for `a02` against `a2`, which makes two
different strings equal to a comparator. That is a real defect and it is one decision, and a contract
is not written for one decision — `semver/compare`'s own words, arriving on a second candidate.

### Ten refused briefly, each on one fact

* **`array/zip`** — Joint Iteration is finished and awaiting ES2027.
* **`object/deep-clone`** — `structuredClone` is on every declared target, and `object/deep-equal@1`
  is already specified against exactly its domain.
* **`array/unique`, `array/intersection`, `array/difference`** — the new Set methods finished in
  ES2025, and `[...new Set(x)]` is one expression over two built-ins.
* **`number/clamp`** — `Math.clamp` is stage 2, and the address is one `imagined-addresses.ts` holds.
* **`string/dedent`** — `String.dedent` is stage 2.
* **`object/size`** — `Object.keysLength` is stage 2.
* **`string/parse-query-string`** — `URLSearchParams` is in the language; `qs`'s bracket syntax for
  arrays is an invented grammar, which is `number/parse-duration`'s refusal.
* **`url/join`** — `new URL(relative, base)` is the platform's own oracle, and a contract restating it
  is `semver/compare`.
* **`array/shuffle`** — it is not deterministic, and this catalogue's format assumes determinism at
  three separate points, which is `function/debounce`'s refusal.
* **`string/pluralise`** — an English data table with no oracle, and `Intl.PluralRules` already
  answers the category question.

## More Information

### Coordinates

Every figure above was measured on **2026-08-25**, on **Node v24.15.0**, against this repository at
**`3daae2f`**. No probe ran inside the tree, and `git status` was clean before and after.

Library versions, each resolved at the head of its range on the day. The first four are **the same
versions ADR-0158 resolved**, which is what makes the case-family readings comparable between the two
records: `change-case@5.4.4`, `camelcase@9.0.0`, `scule@1.3.0`, `lodash@4.18.1`, `flat@6.0.1`,
`dot-object@2.1.5`, `flattie@1.1.1`, `flatten-anything@4.0.2`, `natural-compare@1.4.0`,
`natural-orderby@5.0.0`.

Proposal stages and last pushes were read from `tc39/proposals` and from each proposal's own
repository through the GitHub API on the same day.

### What this search could not settle

**The candidate list is not complete and this record does not claim it is** — the same claim
`CLAUDE.md`'s open list refuses about itself. Twelve new candidates were considered and ten of them
are refused on one fact rather than on a measurement; a fact can be wrong. What a reader may take is
that each entry here is real and each measurement replayable from the versions named.

**The bound on the search was declared in advance and it was not reached.** The plan the owner
approved allowed at most eight new candidates measured; two were measured in full and ten refused
briefly, and the search stopped because the refusals stopped being interesting rather than because
the bound bound.

**What was left out is the ecosystem below about 20 M weekly downloads**, which is where a function
with a real disagreement and no audience would sit. That is a deliberate narrowing on ADR-0158's own
reading of what demand figures are worth, and it is stated rather than smoothed: a candidate refused
for lack of demand and a candidate never looked at are not the same thing.

### Where the probes live

The probes and their raw output are not in this repository — stage rule 5 keeps working material out
— and every figure above names the population it was taken over so that it can be rebuilt from the
versions listed.
