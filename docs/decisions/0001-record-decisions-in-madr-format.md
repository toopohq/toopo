---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/decisions.ts
confirmed-by:
  - battery: meta
    guard: every-decision-declares-what-it-governs-and-what-keeps-it
  - battery: meta
    guard: no-decision-governs-a-guard-file
  - battery: meta
    guard: every-decision-says-what-would-reopen-it
  - battery: meta
    guard: every-path-a-decision-governs-exists
  - battery: meta
    guard: every-file-a-decision-governs-cites-it-back
  - battery: meta
    guard: every-guard-a-decision-names-is-one-its-suite-collects
  - battery: meta
    guard: every-decision-a-file-cites-exists
  - battery: meta
    guard: every-decision-a-record-links-to-is-the-one-it-names
---

# Record decisions in MADR format, addressed by number

## Context and Problem Statement

The prose of this repository is not filler. It carries measurements, it names what would invalidate
each decision, and it is what has stopped the same mistake being made three times. It is also in the
same file as the code, and it does not have the same reader.

Measured at `0ca0b3a^`, over the 227 tracked `.ts` files: 19 887 lines of prose against 35 028 of code,
a ratio of 0.568. Four files carried it worst, at that same commit:

```
packages/registry/contract-record.ts        prose 434 / code 123   3.53
mutation/mutants.ts                         prose 232 / code 100   2.32
packages/catalogue/every-contract.ts        prose 459 / code 214   2.14
packages/registry/implementation-record.ts  prose 271 / code 150   1.81
```

Somebody opening `contract-record.ts` to read a type reads 434 lines of essay before reaching one.
Nothing is to be deleted; the question is only where it lives, and under what address it can still be
found from the line it explains.

**Every row is stamped `0ca0b3a^` because this record first published them unstamped, and the first row
was false one commit later — in the commit that published it.** That is the fault ADR-0018 exists
against, committed by a record that cites it; [ADR-0018](0018-a-published-count-carries-its-coordinates.md)
now carries it as its second measurement of how hard its own rule is to keep.

The repository-wide figure first published here — 19 761 against 34 902 — is replaced rather than
corrected in place. Its *ratio* was right, and its two counts are each 126 away from what the
classifier that reproduces all four rows above gives at that commit. No single tracked file accounts for
the gap and the cause is not established, so none is named.

### The threshold, and why it subtracts an address

A line carrying an `ADR-NNNN` is an address, not an essay, and counting it as prose punishes exactly the
behaviour this format rewards. Measured at `032cb94`: `contract-record.ts` stood at a raw 0.276 and read
as a regression against the 0.24 it reached in `0ca0b3a`, when twenty-six of its thirty-four prose lines
are citations and its residual argument is eight lines over one hundred and twenty-three. So the
threshold a file is held to is

```
(prose - lines carrying a record address) / code  <=  0.25
```

which is invariant to the growth of this folder: each new record adds one line to the raw numerator and
one to the subtrahend, so a file cannot drift over the line by being well cited.

**One limit, declared with the measurement rather than discovered later.** A line can carry both an
address and an argument, and it will be subtracted. The hole is bounded — a line is a line, so a
forty-line essay cannot hide behind a number — but it exists, and what closes it is the convention that
a citation is one to three lines, not the counter.

## Considered Options

- Leave the prose in the source.
- Nygard's original format: Title, Status, Context, Decision, Consequences.
- MADR 4.0.0, the Markdown Any Decision Record.

## Decision Outcome

Chosen: **MADR 4.0.0**, in `docs/decisions/`, with two front matter fields and one section of this
repository's own.

MADR is what a stranger recognises. It is maintained at [adr.github.io/madr](https://adr.github.io/madr/),
its 4.0.0 release is of September 2024, and its filename convention is `NNNN-title-with-dashes.md` in
a `docs/decisions` folder — all of which is followed here rather than reinvented.

**What decided it against Nygard is `Confirmation`.** MADR 4.0 renamed that section from `Validation`,
and it is the section that says *how one checks the decision is being kept*. It is the only slot in any
mainstream template for that question, and it is the question this repository exists to ask: a
declaration nothing keeps is decorative, and that sentence is the acceptance criterion for every change
made here. Most projects leave `Confirmation` empty. Here it holds guard identifiers, which are already
frozen addresses.

Nygard's format has no slot for a refused alternative either, and this repository argues from refused
alternatives constantly — *the alternative was measured and refused* is the shape of most paragraphs
being moved. `Considered Options` and `Pros and Cons of the Options` take that prose without
reformatting it.

### The address is the number, and the title is prose

An ADR is cited as `ADR-0007`, never as a path. The number is the address and the slug is a rendering
of the title, so rewording the title breaks no citation.

This is not a preference. It is the rule this catalogue already applies to a case identifier, to a
guard identifier, to a reason literal and to a benchmark profile name: **an address is a name, a title
is a sentence, and one string doing both means every rewording breaks a pin.** A citation carrying the
slug would make a reworded title a broken link, which is the failure the whole rule exists against.

### Two fields beyond MADR's own

| Field | What it holds | Argued by |
| --- | --- | --- |
| `governs` | the code this decision rules, as repository-relative paths to files | a back-link that is data can be resolved; one that is prose cannot |
| `confirmed-by` | the guards that keep it, each as the pair `(suite, guard)` | `Confirmation` in prose does not resolve either |

**`governs` names code and never a guard, and the division is kept rather than described.** A test file
under `governs` states, as a path, what `confirmed-by` states as a resolvable pair — and two statements
of one fact drift. This one already had: ADR-0010 named `against-the-five.test.ts` under `governs` while
declaring `confirmed-by: []`, so the record said in an unresolvable form that a guard kept it and in a
resolvable one that none did. `no-decision-governs-a-guard-file` is what refuses it now.

**It names files rather than paths of any kind**, which is what makes the back-link something a reader
opens. The one entry that was not a file was this record naming `docs/decisions/` — the folder holding
this record, so ADR-0001 governed itself. It names the module that reads this format instead.

**Required, and never empty.** After the sweep that built the guards, no decision here governs nothing,
so a member for declaring that absence would be a shape with no instance — which is what `field-map.ts`
calls a speculative field and deletes. The day a decision genuinely rules no code, what it takes is an
absence declared with its reason, on the treatment `OwnDeclaration.executableBy` already receives: never
a field left out, which reads exactly like a field forgotten.

**A guard is named by the pair, never by the identifier alone**, and that is not a flourish. A guard
identifier is unique within the suite a battery measures, and fifteen identifier strings in this
catalogue are held by more than one contract — so an identifier on its own is not an address.
`packages/registry/address.ts` publishes `GuardAddress` as exactly that pair and publishes no unpaired
form, which is the rule this field obeys rather than reinvents:

```yaml
confirmed-by:
  - battery: registry-storage
    guard: the-absorbed-state-is-constructible
```

**The first coordinate names a suite, and nineteen of the twenty names are batteries.** The twentieth
is `meta`, and it is a coordinate completed rather than widened: `readme.test.ts` and
`contributing.test.ts` have been guards for as long as `mutation/` has existed, no battery injects
there, and a coordinate with nineteen values made two existing guards unaddressable — it described part
of the repository as though it were the whole.

**The two are not of equal strength, and reading them as equals is the mistake this paragraph exists to
prevent.** A guard addressed under a battery has its detection power measured: mutants say what it
catches, and a cell that stops catching is a red. A guard addressed under `meta` has nothing measuring
what it is worth, because no battery injects into `mutation/` — which is
`packages/registry/verifiability.ts`'s line, that the instrument measures the catalogue and is not part
of it. *A decision confirmed by a battery is kept by a guard shown to catch something; a decision
confirmed by `meta` is kept by a guard that runs.* This record is one of the second kind.

### One section beyond MADR's own

`## What would reopen this` is required. `DeferredNeed.until` in `packages/site/source.ts` is the
precedent and carries the argument: a deferral aimed at the wrong event is one nobody revisits, and a
reason ages into a description of the past where a trigger stays checkable. A decision with no stated
trigger is frozen by accident rather than on purpose.

### No index file, and no template file

The directory listing is the index, because the filenames carry the titles. A generated index is a
second statement of what the folder already says, and a second statement drifts.

A template file is refused for the same reason: this ADR *is* the specification of the format, and a
template beside it would be a second statement of the required sections, free to disagree with this one
the day either is corrected. A new ADR is written by copying an existing one, which is what anybody
does with a template anyway.

## Consequences

- A decision is one file, at a stable address, citable from the line it explains.
- The four worst files came down to a readable ratio with nothing deleted. Measured at `c4f0426`:
  `contract-record.ts` 0.065, `mutants.ts` 0.140, `implementation-record.ts` 0.147,
  `every-contract.ts` 0.159, against the threshold of 0.25 stated above. The repository stands at
  19 104 lines of prose against 35 249 of code, a raw ratio of 0.542, with the code unchanged from
  `032cb94` — nothing was deleted, 850 lines of prose moved.
- Somebody looking for *why* now has one place to look, rather than one place per file.
- A `docs/` folder now exists in a repository whose rules enumerate what may be here. That enumeration
  gains decision records in the same change, because a rule broken knowingly while waiting for a future
  unit is a rule that has stopped being applied.

## Confirmation

`mutation/decisions.ts` reads every record and `mutation/decisions.test.ts` resolves what it finds, in
both directions of each family. The eight guards are named in `confirmed-by` above, and between them
they establish that both fields are declared and well formed, that `governs` names files and not
guards, that every path resolves and every file it names cites the decision back, that every pair names
a guard its suite collects, that no `ADR-NNNN` written anywhere in this repository names a record that
does not exist, that a link between two records is about the record it names, and that every record
says what would reopen it.

**They were written because the fields were `one-directional`, and the measurement is what makes that
worth recording rather than the word.** On the sixteen records of the first batch — written and
reviewed in one sitting — **7 of the 25 files a decision governed never cited it back, and the
twenty-sixth entry was a directory: 28 per cent of one link family broken in reviewed work.** Two of
those were a record contradicting itself rather than merely pointing nowhere. ADR-0010 declared
`confirmed-by: []` while naming its own guard's file under `governs`, and ADR-0008 named a guard
identifier that is the title of no `it(...)` anywhere, because the guard is an `it.each` whose written
title ends `-%s`.

**What the guards do not establish** is that a decision is *right*, or that the code named is all the
code ruled: a file a decision governs and nobody listed is invisible here, exactly as a sixth stage-1
rule is invisible to `contributing.test.ts`. It fails in the safe direction — the record understates its
own scope rather than promising a reach it has not got.

## What would reopen this

- A second language in the catalogue, if it turned out that decisions needed to be scoped by language
  the way contract addresses are.
- MADR itself moving. The format is pinned at 4.0.0 here; a 5.0 renaming sections would be adopted or
  refused deliberately, not inherited.
- A decision that genuinely rules no code, which is what the `governs` paragraph above prices: it is
  refused today, and the shape it would take is an absence declared with its reason.

## More Information

- [MADR](https://adr.github.io/madr/) — the format, its releases and its templates.
- [The MADR template](https://github.com/adr/madr/blob/develop/template/adr-template.md) — the section
  list this one follows.
- [adr.github.io](https://adr.github.io/) — Nygard's original and the wider family.
