---
status: accepted
date: 2026-09-03
governs:
  - CLAUDE.md
confirmed-by: []
---

# The complement of the twelve refusals is four clauses, and the language trap is one source of one

> **This record lands in one commit, and that is the honest form rather than the impressive one.**
> [ADR-0192](0192-the-search-below-the-bound-is-conducted-on-the-languages-own-surface.md) committed
> its method before its first probe, so its own history proves the method did not move to fit the
> result. This unit did not do that. The criterion below was derived from the twelve grounds and
> tested against the thirty-four addresses **before `string/to-filename` was measured**, and it did
> not move afterwards — but it was never committed first, so **nothing here proves that order and it
> is asserted**. Splitting the file into two commits now would produce a diff that suggests a
> discipline the work did not have, which is worse than the assertion.
>
> **One of the two candidates is outside the claim entirely.** `string/truncate-to-bytes` was refuted
> while this unit was still being planned, before the criterion existed. The criterion did not decide
> it and it is no evidence for the criterion. **`string/to-filename` is the only candidate this
> criterion has ever been applied to**, and it is the whole of the evidence that the criterion does
> any work.

## Context and Problem Statement

[ADR-0192](0192-the-search-below-the-bound-is-conducted-on-the-languages-own-surface.md) reads twelve
refusal grounds off twenty-seven refusals and applies them mechanically. They are negative by
construction: each says when a candidate is **not** a contract. What a candidate must **be** is
written once in that record, at its line 130, in one sentence:

> **A candidate is retained where permanent rule 7 is met positively and none of R1 to R12 fires**:
> the language's own answer is wrong or surprising on inputs a competent developer meets, and the
> correct answer is decidable

**That sentence covers three of the six installable contracts, and the record that carries it holds
the measurement that says so.** Its own calibration table, forty lines below, reads
`string/levenshtein@1`'s incumbent as **`none`** — not in the population at all — and
`string/slugify@1`'s as `String.prototype.normalize`, *in population* with **reading yields it: no**.
Neither has a language answer that could be wrong. Under the only positive criterion this repository
possesses, two of its six installable contracts are refused.

**The failure has no event, which is why it took the known answer to see it.** Nothing was red. The
sentence is true of the three contracts it names — `number/parse@1`, `date/add@1` and
`number/round@1` — and it has never been asked about the other three, because a criterion is applied
by a person deciding to write a contract and a contract nobody writes leaves no trace. It is
ADR-0191's *the failure has no event*, arriving on the criterion rather than on the population bound.

## Decision Drivers

* **Permanent rule 7** is the thing being made positive, and it is four alternatives rather than one:
  *non-obvious behaviour, real edge cases, an algorithm, or the correction of a language trap.* The
  sentence above is the fourth alternative written as though it were the rule.
* **The known answer exists and refusing to use it would be choosing the criterion that flatters the
  result.** Thirty-four addresses, of which six must pass and twenty-eight must fail.
* **A criterion derived from the twelve cannot be bent to admit a candidate**, where one invented for
  this unit could. The twelve were fixed before this unit's field was known.
* **[ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md)** has
  already established that no demand signal supplies it: three signals below a coin flip, and the
  cause — a demand signal measures where an ecosystem is busy, rule 7 asks where the language is
  wrong, and where the language is wrong there is no busy ecosystem.

## Considered Options

1. **One criterion admitting all six.**
2. **Two criteria, one per family**, with a stated rule for which family a candidate is in.
3. **Leave the negative form alone**, on the ground that twelve refusals applied mechanically are
   what a search needs and a positive criterion is what an author needs.

## Decision Outcome

**One criterion, four clauses, each the complement of a group of the twelve.** A candidate is a
contract when all four hold.

| | clause | the grounds it negates |
| --- | --- | --- |
| **P1** | **The vacancy.** Nobody has already settled it: the language does not answer it and no live proposal is about to, no normative specification outside this catalogue fixes the answer, and the correct answer is not one expression over built-ins. | ¬R1 ¬R2 ¬R3 |
| **P2** | **The stake.** A wrong answer is in circulation, the disagreement has a right side rather than being a product choice, and being on the wrong side costs the reader something. | ¬R4 ¬R5 ¬R11 |
| **P3** | **The unit.** It is one function rather than one algorithm behind several renderings, and what is left to settle after the unavoidable choice is more than one decision. | ¬R8 ¬R10 |
| **P4** | **The form.** This catalogue can hold it: pure and deterministic in its arguments, a signature that can carry the answer, a case table that serves readably, no collision with a question a frozen contract already settles, and an answer that does not follow the runtime. | ¬R6 ¬R7 ¬R9 ¬R12 ¬R13 |

### Where the sentence at ADR-0192:130 goes wrong, which is one word

**It negates R1 by requiring the language to answer wrongly, where the complement of *the language
gives it* is *the language does not give it*.** Those are not the same set. The first demands an
incumbent and then faults it; the second is satisfied by silence. Every contract in the second set
and outside the first is a contract this criterion admits and that sentence refuses — which is
`string/levenshtein@1` and `string/slugify@1`, measured above.

It is not a slip of phrasing. The sentence is *the trap clause of rule 7* promoted to be the whole of
rule 7, and the record says as much in its own next line — **the clause `number/parse@1`,
`date/add@1` and `number/round@1` were each published under.** Three contracts named, three contracts
covered, and the sentence written as though it ranged over all of them.

### The two families are two sources of one clause, and that is the finding

The obvious reading of the failure is that there are two kinds of contract here and they need two
criteria — a *trap* family, where the language answers and is wrong, and a *vacancy* family, where the
language is silent and the ecosystem disagrees with itself. **The measurement says they are one
clause with two sources.**

P2 asks that a wrong answer be in circulation. It does not ask who is circulating it, and the two
groups differ only in the answer to that. In the trap family the wrong answer is the language's own;
in the vacancy family it is the ecosystem's. R1 and R5 are the two grounds that refuse the two halves
of that one condition — *the language gives it* and *there is no ecosystem to disagree* — and
negating them separately is what produced the appearance of two families.

**What makes this a finding rather than a tidier phrasing is that the two sources are exactly the two
axes the two searches ran on, and the calibration for both is already published.** ADR-0192's own
figures:

| | reaches | which contracts |
| --- | --- | --- |
| the demand axis, ADR-0163 and ADR-0191 | **3** of 6 | `object/deep-equal@1`, `string/levenshtein@1`, `string/slugify@1` |
| the language-surface axis, ADR-0192 | **4** of 6 | `number/parse@1`, `number/round@1`, `date/add@1`, `object/deep-equal@1` |
| both | 1 | `object/deep-equal@1` |
| either | **6** of 6 | the whole installable catalogue |

Two searches, two axes, neither reaching this catalogue alone and the two together reaching all of
it — and P2 is what they are two halves of. **Writing two criteria would have written the two search
axes into the acceptance rule**, which is the one place a search method must not appear: a candidate
is not better or worse for the axis that happened to find it.

### The test on the known answer

Run at `1907df5` over a declaration checked against the records — every refused address must occur at
the line declared for it, no address may be declared twice, no ground may be named that the
derivation does not map, and the catalogue's own seven are read off `contracts/typescript/` rather
than transcribed. The probe refuses to print if a row is unassigned.

**Population 34: 27 refused, 1 published and turned down, 6 installable.** It reproduces ADR-0191's
count exactly and by its rule — *distinct candidate addresses refused* — 13 addresses named in
ADR-0158's refusal section and 14 in ADR-0163's, with `string/camel-case` refused in both, which is
that record's 28 refusal events against 27 addresses. **No discrepancy to publish**, which is worth
saying because ADR-0191 found three counting rules giving three answers and this reading had to
reproduce one of them rather than a fourth.

| | refused by the clause | |
| --- | --- | --- |
| P1 | **15** of 28 | the vacancy |
| P2 | **8** | the stake |
| P3 | **5** | the unit |
| P4 | **5** | the form |

**Every one of the 28 fails at least one clause, and 23 of the 27 refused fail exactly one** — the
criterion is not scraping past them on a technicality. **The 6 installable fail none.**
`array/group-by@1` fails P1, which is the calibration rather than a result: the language shipped
`Map.groupBy` while it was being written, and this catalogue turned it down for that.

**What the reading establishes and what it does not**, because the two halves are not the same kind
of statement. Mechanical: that the declaration agrees with the records, that the ground-to-clause map
is total over the twelve and that no ground is mapped and unused, and that every refused address
carries a ground that lands on a clause. A reading: that the six installable fail none — four facts
per contract, twenty-four in all, declared in the probe and checkable by anybody against the records,
and computed by nothing. **A criterion whose positive half is a reading is what this is**, and no
arrangement of a probe changes that.

## The thirteenth ground

**A contract must give one answer on every runtime, and R1 to R12 do not ask it.**

[ADR-0158](0158-the-seventh-contract-is-object-deep-equal-and-ten-refusals-say-why.md) eliminated
graphemes as a unit for `string/truncate` on exactly this, in a measurement the twelve never
carried: *grapheme boundaries follow the Unicode version of the runtime's ICU … so a contract
settling truncation in graphemes settles it differently on two runtimes, which is not a contract.*

**The arbitration is R6 against R13 and it goes both ways before a measurement settles it.** By its
text — *not a pure deterministic function of its arguments* — R6 arguably reaches it: the runtime's
Unicode table is not an argument. By what R6 establishes it does not: `function/debounce` is a
stateful closure over elapsed time and `array/shuffle` is randomness, and both are about the call
rather than about the environment.

**What settles it is what R6 is executed by.** This catalogue operationalises R6 in two guards that
every contract carries — `determinism`, the same call twice, and `no-ambient-input-from-history`, the
same call before and after an arbitrary history. Run at `1907df5` on node v24.15.0, ICU 78.2,
Unicode 17.0, over a grapheme-length function built on `Intl.Segmenter`, five samples, a thousand
runs each:

| | |
| --- | --- |
| `determinism` | **green** |
| `no-ambient-input-from-history` | **green** |
| the control — a function whose second call answers differently | **red**, 3 then 0 |

**Both green, and the control red beside them.** R6 as this catalogue can execute it does not reach a
function whose answer follows the runtime, and a ground that exists only as prose a reader might
extend is not a ground this catalogue keeps. So it is **R13**, under P4, and it is a constraint on
the specification rather than a refusal of a subject: it eliminated a *unit* for `string/truncate`
without refusing the candidate, which was refused on R3.

**R13 refuses no address of the thirty-four on its own**, and that is published rather than hidden. It
is a ground born with no sole instance, justified by the event it would catch — a candidate whose only
interesting question is grapheme-shaped, or normalisation-shaped, or collation-shaped — on this
repository's own rule that a guard finding nothing on the day it is written is justified by the event
and by what that event costs. What that event costs here is a contract frozen for the life of a major
that answers differently on somebody else's machine.

**The samples are in the record because the reading is one runtime's.** `क्ष` is one cluster here and
is one only under GB9c, a rule that entered at Unicode 15.1; `👨‍👩‍👧` is one cluster of five code
points. That two runtimes really differ is ADR-0158's measurement and not this one's — this unit
measured that **R6 cannot see the difference**, which is the half the arbitration needed.

## The two candidates

### `string/truncate-to-bytes` — refuted before the criterion existed, by the primitive

The proposal was to cut a string to N bytes of UTF-8, specified on code points rather than on
graphemes, and its argument was that the obvious approach is wrong. **Half of that argument holds and
it is the wrong half.** Measured at `1907df5` on node v24.15.0 over `"aé😀b"`, eight bytes:

| N | `Buffer.from(s).subarray(0, N).toString()` | `TextEncoder.prototype.encodeInto` |
| --- | --- | --- |
| 2 | `"a�"` | `"a"` |
| 4 | `"aé�"` | `"aé"` |
| 7 | `"aé😀"` | `"aé😀"` |

The naive slice is wrong, as claimed. **`encodeInto` is right**, because WHATWG Encoding requires it
to stop before a sequence it cannot finish, and it reports how far it read. So the correct answer is
`new TextDecoder().decode(dest.subarray(0, encoder.encodeInto(text, dest).written))` — built out of
two standard objects and settling the whole subject. **R3 fires**, which is `string/truncate`'s own
refusal arriving on its neighbour.

**The residue was counted at two decisions and the primitive settles both.** Code points against
graphemes is not a decision this candidate had: `string/levenshtein@1` chose code points and ADR-0158
recorded that the variants are separate contracts, and R13 above eliminates graphemes outright. The
lone surrogate was the second, and it is settled too — measured, `encodeInto("\uD800", …)` answers
`read: 1, written: 3` and writes `EF BF BD`, so the primitive resolves it to U+FFFD and does not ask.
**R10 fires** on what is left, which is nothing.

**And R2 fires beside them**, which is the sharpest of the three: `TextEncoder.prototype.encodeInto`
is WHATWG Encoding, and ADR-0192 classes that family under R2 among its eighty operations. **The
search published one unit before this one had already read and classed the operation that answers
this candidate.** Nobody noticed, because a sweep classes an operation by its ground and never by the
candidates it forecloses.

So it fails **P1** on three grounds, and it fails it for a reason no reading of the ecosystem would
have reached — R5 was named in advance as the ground that would decide, and it was never asked.

### `string/to-filename` — refused on R4 and R8, and the thesis was right for the wrong reason

The proposal was to turn an arbitrary string into a safe filename. The thesis put to this unit was
that **R4 kills it: the Windows reserved names are facts, but what to replace a `/` with is a product
choice.** The verdict is right and the evidence is not, and both halves are measured.

**P1 holds, and the one-expression route is decisively wrong.** Over a corpus of 27 hostile inputs at
`1907df5`, against `sanitize-filename@1.6.4` and `filenamify@7.0.3`:

| | wrong on |
| --- | --- |
| `s.replace(/[<>:"/\\\|?* -]/g, '-')` — the one expression | **14** of 27 |
| `sanitize-filename@1.6.4` | **10** of 27 |
| `filenamify@7.0.3` | 0 of 27 |

*Wrong* is checkable rather than a taste: a produced name that is empty, that is `.` or `..`, that is
reserved on Windows, that holds a forbidden character, that ends in a dot or a space, or that exceeds
255 bytes. **The three disagree on 23 of the 27.** So R3 does not fire and **R5 does not fire** — there
is an ecosystem, it disagrees with itself, and the most-installed member answers the **empty string**
for `CON`, `con.txt`, `NUL`, `COM1`, `..`, `.` and three more. An empty string is not a filename; it is
a refusal spelled as a value indistinguishable from a short name, which is the shape ADR-0020 exists
to replace.

**R12 does not fire, and the evidence is the dot.** `string/slugify@1` run over the same corpus
produces a *usable* filename on **18 of 25** inputs — but of the 15 inputs carrying an extension, it
destroys the extension on **15**: `con.txt` becomes `con-txt`, `Quarterly Report 2026.pdf` becomes
`quarterly-report-2026-pdf`. A function that removes the one character a filename is organised around
is answering a different question, and the frozen contract does not reach this one.

**What refuses it is the target, and nobody named it.** The right answer is a function of the
filesystem the name is for, and the filesystem is not in the signature. Measured over 22 inputs
against the two constraint sets — POSIX.1-2017, where a name may hold any byte but `/` and NUL, and
Windows, which forbids `<>:"/\|?*` and the control range, forbids the device names, and strips a
trailing dot or space:

| | |
| --- | --- |
| inputs the two targets answer **differently** | **14** of 22 |
| inputs both leave alone | 4 |
| inputs both repair | 4 |

`a:b.txt`, `a*b.txt`, `report.` and `CON` are all perfectly legal names on ext4 and all unusable on
NTFS. **And the disagreement runs both ways**: `é` two hundred times plus `.txt` is 404 bytes and 204
UTF-16 units, so it is legal on NTFS, which caps at 255 units, and illegal on ext4, which caps at 255
bytes. There is no containment between the two targets to take an intersection of and call the answer.

**So R8 fires** — one algorithm, one rendering per target, which is `string/camel-case`'s leg A and
`string/word-wrap`'s refusal. **And R4 fires under it**, which is the thesis: choosing the target is a
product choice with nothing to be wrong against, because nothing about the use constrains it. Somebody
writing a file on their own Linux server has no reason to strip a colon; somebody writing a
cross-platform export must. Both are real, neither is wrong, and a contract freezing one is freezing a
preference. That is ADR-0163's sentence about `string/camel-case` — *the use, unlike
`string/slugify@1`'s URL, constrains nothing* — arriving on a second candidate.

**Where the thesis was wrong is what it offered as evidence.** The replacement character decides the
legality of **0** of the 27 inputs: `-`, `!` and deletion all produce legal names everywhere, and the
three libraries' disagreement about it is visible on 7 inputs and consequential on none. The choice
that decides 14 of 22 is the one the thesis did not name. **A refusal ground can be correct and its
stated instance be the weakest one available**, which is ADR-0163's own finding about its prediction,
and it is why a ground is measured rather than recognised.

It fails **P2** and **P3**.

## What would reopen this

* **A ground being wrong.** The criterion is the twelve negated and grouped; ADR-0192 already records
  that a ground can fall, and one that falls takes its clause's coverage with it. P1 rests on three
  grounds and P4 on five, so they are the clauses most exposed.
* **A seventh contract published under a clause this criterion refuses.** That is the event the
  known-answer test exists to make recognisable, and it would mean the grouping is wrong rather than
  the grounds.
* **A candidate that passes all four clauses.** None has. The criterion has been applied to exactly
  one candidate and refused it, so *it does work* rests on a single instance and should not be read as
  more.
* **R13 gaining a sole instance.** It refuses nothing in the population today. The first candidate
  refused by it alone is what would say the ground is load-bearing rather than declared.
* **A second reading of the six.** The positive half of the test is twenty-four facts a person
  asserted. A reader who disputes one of them disputes the criterion, and the probe is written so that
  the row is nameable.

### Consequences

* **`CLAUDE.md` carries the criterion** under *How the catalogue is written*, and an entry under what
  this repository declares and nothing keeps.
* **No contract is written and none is proposed.** Two candidates measured, two refused. The
  catalogue stays at seven.
* **The count of refused addresses goes 27 to 29**, and the addresses this catalogue has ruled on
  from 34 to 36.
* **No digest moves and nothing under `contracts/` is touched.** `pnpm freeze` is green before and
  after and `THE_PACKAGE_VERSION` stays at `1.1.1`.
* **Nothing goes to npm.** This unit publishes a record.

## More Information

* [ADR-0192](0192-the-search-below-the-bound-is-conducted-on-the-languages-own-surface.md) is the
  source of the twelve grounds, of the sentence this record refutes, and of the calibration table
  that refutes it.
* [ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md) is why no
  demand signal supplies a positive criterion, and the source of the counting rule this unit's
  population reproduces.
* [ADR-0163](0163-there-is-no-eighth-contract-and-the-case-family-came-closest.md) is the source of
  R1, R4, R9 and R10, and of *the use constrains nothing*, which is what refuses the second candidate.
* [ADR-0158](0158-the-seventh-contract-is-object-deep-equal-and-ten-refusals-say-why.md) is the source
  of the other eight grounds, of `string/truncate`'s refusal, and of the grapheme measurement R13 is
  derived from.
* [ADR-0018](0018-a-published-count-carries-its-coordinates.md) is why every figure here carries the
  commit it was measured at and the population it counted.
* [ADR-0020](0020-a-fallible-function-answers-null-with-its-diagnostic-beside-it.md) is the shape
  `sanitize-filename`'s empty string is a spelling of.

### Why `confirmed-by` is empty

The criterion is a rule applied by a person deciding to write a contract, and this repository holds no
population of candidates for a guard to range over — a candidate nobody writes leaves no artefact.
That is not a price refused; it is the reason no mechanism can exist, and it is written into the entry
`CLAUDE.md` carries rather than left as an omission here.
