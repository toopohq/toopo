---
status: accepted
date: 2026-08-18
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

Measured at `4b8e105`: `README.md` held 160 lines, four fenced blocks, **11 occurrences of `slugify`**,
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

### How long the page may be, and where a cut stops being one

This decision set the page's shape and left its size open, and the size was what a reader raised one
unit later. Measured with `wc -w`: **1 551 words at `43470d1`**, where five comparable projects run
from 235 to 674 — those five being reported rather than measured here. The page this section is
committed with holds **1 398**, every fact, limit, figure and argument of the longer one kept.

**A target of 700 was proposed and refused on a floor that was built rather than estimated.** A second
page was written carrying every fact, limit and figure of this one with *every justifying clause
removed* — no *because a catalogue that only shows what it accepted is a catalogue you cannot check*,
no *because a legal boundary kept by a declaration nothing enforces …*, nothing that explains where it
could assert. It measures **1 203 words**. That page was not kept, so this is the one figure here
nobody can rebuild: what to strike is a judgement about which clause explains and which asserts, and
two readers would not draw the line in the same place. Its coordinate is this record's own commit,
which is all a reading of a discarded artefact can carry — the treatment
[ADR-0018](0018-a-published-count-carries-its-coordinates.md) gives every figure this repository
cannot re-derive.

What the floor is made of *is* rebuildable, from the page alone. **282 of the 1 398 words are frozen by
the decisions above**: 158 in the five fenced blocks, 75 in the catalogue table, 49 in the title and its
eight section headings. Thirty-nine more are `THE_PINS_ARE_AN_ASSERTION`, which
`the-readme-says-its-figures-are-an-assertion-and-not-an-observation` requires word for word, and
thirty-nine again are the nine literal claims
`every-figure-in-the-readme-is-the-one-the-instrument-declares` resolves — `**667 deliberate
defects**`, `6 are behaviour the contract declines to specify`, and seven others. That leaves 1 038
free.

Counting what a page asserts is a judgement and not a measurement, so it is given as one: on the order
of eighty distinct facts, which puts this page near thirteen words a fact and a 700-word page near
four. **So what this section leaves is a distance and not a target: about 200 words separate the page
from the floor, and all of them are argument.** Below the floor a cut is the removal of facts under
another name, and the honest form of that request is to name which.

### The ratio that measured a wrap column

The reading that opened the size question was words per line, where this page stood at 9.0 — 1 551
words over 173 lines at `43470d1` — against a median of 3.4 over those same five. **It measures an
editor's setting and not a density.** Reflowing this page's own words at 60 columns instead of 100 —
not one word changed — takes it from 8.6 to 6.1. Measured at `43470d1`: the median non-blank line is
93 characters and none exceeds 105, because this repository wraps prose at 100 columns. The five wrap
nothing, which is reported rather than measured here, their medians sitting between 18 and 55 and
their longest lines reaching 835. GitHub and npm render Markdown as HTML, so no reader sees any of it.

This is [ADR-0030](0030-what-the-method-page-may-say.md)'s rule arriving on a second subject. *An
address is not a figure* says that a run of digits is not evidence of a quantity and that what decides
is the rendering; here a ratio is not evidence of a density, and what decides is the column an author's
editor was set to. Reflowing would have moved it by two points and repaired nothing, which is why the
page is still wrapped where the rest of this repository is.

## Consequences

- `every-answer-the-readme-shows-is-a-case-the-contract-settles` is deleted with the block it read, in
  the same commit, and ADR-0113's `confirmed-by` loses that line. A guard whose subject has gone would
  have been worse than never having had one.
- `theCatalogueRecordIn` joins `theCatalogueRecords` in `mutation/root-documents.ts`, so `theCatalogue` is
  still read from exactly one place under `mutation/` — which is the whole reason that module exists.
- The licence section no longer describes the two-line header, because the page now shows it. One
  duplication removed and none created.
- The page went from 160 lines to 173, and that growth was entirely in what it shows. What it then cost
  in words, and what cutting it back costs, is the two sections above.

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

**The third condition fired on 2026-08-28, and
[ADR-0173](0173-a-decision-named-the-only-condition-nothing-could-raise-and-a-reader-raised-it.md) is
what it opened.** The owner read this page as a stranger and said it makes the project look as though
it were one function. **The count this record repaired was still right** — measured at `1e85f9e`, six
occurrences of `slugify` and none of them a call — and what a count cannot see is an order: the install
naming one contract stood at 3.8 % of the page's words and the word `catalogue` first occurred at
39.3 %, so the page asserted the plural in its opening sentence and proved the singular for the next
two fifths. **The gap is in the test above rather than in its application**: *no competitor could print
this block* grades a block on what it shows and never on where it stands, and a page can pass it block
by block while spending its opening proving the wrong cardinality.

Nothing else here moved. The order of the first two blocks, the refusal of a page carrying no code, the
thirty-second criterion itself and the floor reading are all kept, and ADR-0173 contradicts no sentence
of this record — it was written against them, and two of its own refusals rest on the sentence about
nothing structural standing in front of the answer.

## More Information

- [ADR-0113](0113-one-readme-that-shows-a-function-before-it-explains-one.md) — the thirteen readings,
  the one-file decision and the repair of 187 to 157, all kept.
- [ADR-0110](0110-a-feature-lands-as-a-file-and-its-folder-sits-beside-it.md) — the installed path the
  page prints.
- [ADR-0105](0105-a-contract-freezes-what-its-guards-call.md) — the harness the file listing is
  resolved against, and what a contract freezes beyond its own seven files.
