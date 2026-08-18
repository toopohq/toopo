---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - mutation/root-documents.ts
confirmed-by:
  - battery: meta
    guard: every-file-the-readme-says-a-contract-holds-is-one-the-contract-declares
  - battery: meta
    guard: the-header-the-readme-shows-is-the-one-the-installer-writes
---

# A front page that shows the registry and not a function

## Context and Problem Statement

[ADR-0113](0113-one-readme-that-shows-a-function-before-it-explains-one.md) repaired a real defect and
produced another one, and it did it cleanly: the demonstration it added is checked by guards, and every
figure on the page resolves. What was wrong was not the execution, it was the object being shown.

Measured at `4318d0c`: `README.md` held 160 lines, four fenced blocks, **11 occurrences of `slugify`**,
and its lines 6 to 58 — **53 of 160** — were about one function. The demonstration opened at line 17
with five calls and their answers. `@sindresorhus/slugify`, the direct competitor of the contract shown,
reaches its first call at line 17 and prints an answer beside it. **The two pages showed the same kind
of thing in the same place**, and nothing a stranger saw on arrival distinguished a registry from an
ordinary slug library.

The product of this repository is not `slugify`. It is what makes `slugify` checkable: an executable
contract, cases named and frozen for life, code that lands in the reader's own repository, and a
verification measured in public. That is the object the first page has to show.

### Where a measurement turned against the decision that cited it

ADR-0113 fetched thirteen READMEs and measured them with a script rather than characterising them from
memory. That reading is good and it is kept. **The fault is in the population, not in the count**:
8 of 13 print an answer beside a call, the majority was followed, and all thirteen are *libraries of
functions*. This repository is not one. It is a registry that publishes them under a method which is
itself the product.

One member of that list is in the same situation — `shadcn/ui`, the same distribution model, source
copied into the reader's project rather than installed as a dependency. ADR-0113 measured it at 18
lines, carrying no code and pointing at a documentation site, and **classed it among the exceptions
instead of reading it as the comparison group**.

This is [ADR-0018](0018-a-published-count-carries-its-coordinates.md)'s rule arriving on a decision
rather than on a figure. *A count carries the population counted* is usually a caution about what a
number means; here the number was right, the population was the wrong one, and a majority over the
wrong population is not evidence of anything.

## Considered Options

- Keep the demonstration and add registry material around it.
- Carry no code at all, on `shadcn/ui`'s shape, and let the site demonstrate.
- Carry code throughout, showing registry objects and never a function's behaviour.

## Decision Outcome

Chosen: **code throughout, showing registry objects.**

**The test every block has to pass is that no competitor could print it.** Applied to each block rather
than to the page: the seven files of a contract, a row of a case table, the two lines an installer
writes. An install command is exempt and the exemption is stated rather than smuggled — it is a
coordinate and not a claim, and every README on earth has one.

**Carrying no code at all was refused on this repository's own discipline.** *Derive the sentence from
the fact rather than assert it beside* is what everything else here is held to, and a front page that
only asserts *verified against a public, executable contract* is the weakest form available. It is a
form `shadcn/ui` can afford because its documentation site carries the showing; ours does too, and the
front page still has thirty seconds in which to make a stranger want to open it.

### The order, and why the header is not third

The first draft of this unit put the two-line licence header third, the seven files fourth and the
quoted row fifth. That was wrong twice.

**A pointer is unreadable before its target.** `// typescript/string/slugify@1 - https://…` says nothing
to somebody who does not yet know that a contract is an object with an address; third, it asks the
reader to hold a string until it becomes meaningful two blocks later. **And three structures in a row
produce nothing**: a header, a file listing and a JSON object, one after another, are three shapes and
no result.

So the order is the seven files, then one row of the case table, then the header. The middle block is a
*result* — an answer with the argument for it attached — and it is what earns the third. The first two
read as one movement rather than as two blocks: the listing names seven files and the row opens one of
them.

### What a stranger knows after thirty seconds

The criterion is *after thirty seconds a reader can say what this does that `lodash` does not*. It is
not mechanical and no guard here keeps it, so what is recorded is the reading itself, block by block:

| | |
| --- | --- |
| the opening sentence | code copied into your repository, not a dependency — a `shadcn/ui` reader would say the same |
| the install line | one command, nothing to install first |
| **the seven files** | **one is the implementation, six are the verification, all seven readable before installing** |
| the quoted row | the specification is named cases with frozen identifiers, each carrying its argument |
| the header | the file in your repository points back at the contract, and asks nothing of you |

**The answer lands at the third block**, and that is a fact about the order rather than about the
sentence: nothing structural may be placed in front of it. The measurement stays where ADR-0113 put it,
six blocks later, because it argues the verification and means nothing before a reader knows what is
verified — and the opening promises it **without a figure**, on ADR-0018's first rule, so that promising
it costs the page nothing it then has to keep.

### What the removal of the demonstration does not cost

The five calls are gone, and with them the paragraph arguing that a slug keeps other people's writing
systems. **The surprise survives one floor down**: the row the page quotes is `cyrillic-is-kept`, it
carries `text: 'Привет мир'` and `expected: 'привет-мир'`, and its group is `the-surprise-in-front`. A
reader still meets the answer nobody expects — as a case that was settled and argued for, rather than
as a trick played in a fence. That is the object this project publishes, so it is the better of the two
places for it to appear.

Measured on the page this unit writes: `slugify` occurs **6 times against 11**, and **every one of the
six is an address or a path** — the install command, the installed file's location, the two halves of
the header line, the import, and the catalogue table. None is a call.

## Consequences

- `every-answer-the-readme-shows-is-a-case-the-contract-settles` is deleted with the block it read, in
  the same commit, and ADR-0113's `confirmed-by` loses that line. A guard whose subject has gone would
  have been worse than never having had one.
- `theCatalogueRecordIn` joins `theCatalogueRecords` in `mutation/root-documents.ts`, so `theFive` is
  still read from exactly one place under `mutation/` — which is the whole reason that module exists.
- The licence section no longer describes the two-line header, because the page now shows it. One
  duplication removed and none created.
- The page is 173 lines against 160, and the growth is entirely in what it shows.

## Confirmation

Two guards, both under `meta`, named in `confirmed-by` above. One resolves the seven file names the page
lists against the harness the contract declares, in both directions; the other requires the two header
lines the page shows to be byte for byte what `licenceHeaderOf` writes — the same comparison
`every-file-the-installer-copies-is-marked-mit-0` already makes over the five copied files, so the page
is held to a mechanism rather than to a transcription somebody checked once.

**Both were born red**, on the page as ADR-0113 left it: seven files declared and none shown, and the
header absent. The reds are in this unit's commit message. The four guards ADR-0113 keeps are unchanged
and still resolve.

**What no guard here establishes.** The seven lines of the listing say what each file *holds*, and only
the *names* are resolved — a description that drifted would be invisible. It fails in the safe
direction, since a wrong description is a sentence and a wrong name is a broken address. The import path
the page prints inline is still unguarded, exactly as ADR-0113 declared it, and for the same reason:
resolving it means building an `InstalledEntry` and a `Configuration` inside a guard about a Markdown
file. And the thirty-second criterion above is a reading, not a measurement — it is what a reader is
expected to take away, and the only thing that can refute it is a reader.

## What would reopen this

- **A second implementation of any contract.** *One of them is the implementation* is written in the
  page's central block, and it becomes false as written the day a contract carries two.
- **The demonstrated contract changing to one with a different anatomy.** `array/group-by@1` carries
  nine files, not seven; the block would have to say so or show another contract. `DEMONSTRATED` in
  `mutation/readme.test.ts` is still the single line that moves.
- **A real reader failing the thirty-second criterion.** It is the only condition here that nothing
  executable can raise, and it is the one this record was written to answer.
- Everything ADR-0113 lists that has not happened: a sixth contract, per-version READMEs on npm, a
  second language in the catalogue.

## More Information

- [ADR-0113](0113-one-readme-that-shows-a-function-before-it-explains-one.md) — the thirteen readings,
  the one-file decision and the repair of 187 to 157, all kept.
- [ADR-0110](0110-a-feature-lands-as-a-file-and-its-folder-sits-beside-it.md) — the installed path the
  page prints.
- [ADR-0105](0105-a-contract-freezes-what-its-guards-call.md) — the harness the file listing is
  resolved against, and what a contract freezes beyond its own seven files.
