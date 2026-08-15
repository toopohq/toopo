---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - docs/decisions/
confirmed-by: []
---

# Record decisions in MADR format, addressed by number

## Context and Problem Statement

The prose of this repository is not filler. It carries measurements, it names what would invalidate
each decision, and it is what has stopped the same mistake being made three times. It is also in the
same file as the code, and it does not have the same reader.

Measured over the whole repository: 19 761 lines of prose against 34 902 of code, a ratio of 0.57.
Four files carry it worst:

```
packages/registry/contract-record.ts        prose 434 / code 123   3.53
mutation/mutants.ts                         prose 232 / code 100   2.32
packages/catalogue/every-contract.ts        prose 459 / code 214   2.14
packages/registry/implementation-record.ts  prose 271 / code 150   1.81
```

Somebody opening `contract-record.ts` to read a type reads 434 lines of essay before reaching one.
Nothing is to be deleted; the question is only where it lives, and under what address it can still be
found from the line it explains.

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
| `governs` | the code this decision rules, as repository-relative paths | a back-link that is data can be resolved; one that is prose cannot |
| `confirmed-by` | the guards that keep it, each as the pair `(battery, guard)` | `Confirmation` in prose does not resolve either |

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
- The four worst files can be brought down to a readable ratio with nothing deleted.
- Somebody looking for *why* now has one place to look, rather than one place per file.
- A `docs/` folder now exists in a repository whose rules enumerate what may be here. That enumeration
  gains decision records in the same change, because a rule broken knowingly while waiting for a future
  unit is a rule that has stopped being applied.

## Confirmation

**Nothing resolves `governs` or `confirmed-by` today.** They are `one-directional` in this
repository's own vocabulary: they look like verified references and no mechanism checks that the paths
exist, that the guards exist, or that the code they name cites the ADR back. A reader who does not find
this paragraph will trust them.

What would close it is a guard resolving both fields in both directions — the shape
`every-clean-refusal-resolves-to-the-guard-it-names` already has in `packages/cli/breakage.test.ts`. It
is not built here because a guard moves one of the seven suite totals this unit is required to hold at
472 / 314 / 27 / 183 / 85 / 42 / 16, and paying that is the next unit's to do.

Until then the link is kept by hand in one direction only: the code cites `ADR-NNNN`, and the ADR lists
what it governs.

## What would reopen this

- A guard resolving `governs` and `confirmed-by`, which closes the paragraph above and is the one thing
  this format is currently missing.
- A second language in the catalogue, if it turned out that decisions needed to be scoped by language
  the way contract addresses are.
- MADR itself moving. The format is pinned at 4.0.0 here; a 5.0 renaming sections would be adopted or
  refused deliberately, not inherited.

## More Information

- [MADR](https://adr.github.io/madr/) — the format, its releases and its templates.
- [The MADR template](https://github.com/adr/madr/blob/develop/template/adr-template.md) — the section
  list this one follows.
- [adr.github.io](https://adr.github.io/) — Nygard's original and the wider family.
