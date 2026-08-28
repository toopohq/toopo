---
status: accepted
date: 2026-08-28
decision-makers: Mathis Perron
governs:
  - mutation/root-documents.ts
confirmed-by:
  - battery: meta
    guard: the-readme-names-the-banner-form-it-does-not-show-and-a-contract-that-carries-it
  - battery: meta
    guard: the-readme-names-every-root-an-install-can-write-to
  - battery: meta
    guard: the-import-line-the-readme-shows-is-the-file-it-just-showed
---

# The front page showed one install as though it were the install

## Context and Problem Statement

`README.md` is shipped in the npm tarball and rendered on the package page, so its *What lands in
your project* section is where a stranger learns what an install gives them. It showed the first two
lines of one installed file under the sentence *Its first two lines are all it asks of you*, and the
path that file landed at.

Both are particulars. Measured from npm against the live origin, in two empty projects:

```
lib/toopo/object/deep-equal.ts
  // typescript/object/deep-equal@1 - https://toopo.dev/typescript/object/deep-equal@1/
  // SPDX-License-Identifier: MIT-0

lib/toopo/string/slugify.ts
  // typescript/string/slugify@1 - https://toopo.dev/typescript/string/slugify@1/
  // Copyright (c) 2026 Mathis Perron. SPDX-License-Identifier: MIT-0
```

So a reader installing `object/deep-equal@1` received a second line the page had never shown. The
population, derived from `theCatalogue` crossed with the served index rather than transcribed: **7
contracts, 6 published, 6 installable, 5 carrying `a-copyright-beside-the-marking` and 1 carrying
`the-marking-alone`**, with `array/group-by@1` refused and uninstallable. `THE_CURRENT_BANNER` is
`the-marking-alone`, so **the page taught the legacy form as the rule**.

The paragraph is byte-identical in the tree and in `toopo@1.1.0` as npm serves it — `npm pack` and a
diff put the whole difference in the mutation figures `a31050a` moved — so this is what a reader
meets today rather than something the next release would introduce.

## Considered Options

- Move the demonstration to a contract published after ADR-0159, which is the closure the open list
  named for itself.
- Show both banner forms in the section.
- Attribute the exhibit and name the form it does not show.

## Decision Outcome

**Attribute the exhibit and name the other form**, and repair the second particular in the same
paragraph.

### The named closure would have inverted the defect rather than repaired it

The open list said what would close this: *the demonstration moving to a contract published after
ADR-0159*, that contract existing and being installable. It would put on the page the form **1 of 6**
installable contracts carries, in place of the form **5 of 6** carry.

The defect was never which particular was shown. It was showing one under a sentence that reads as
the deal, and swapping which particular is exhibited leaves that untouched — it moves the wrong
lesson from the majority of readers to a different set of them.

**What misled the entry is the comparison with `LICENSE`.** That file claims *each one says so in its
own first two lines* and shows one example. That is a claim about the **marking**, which both forms
carry, so one example is adequate to it, and
`the-licence-file-shows-the-banner-a-reader-would-receive` correctly requires the example to be of
`THE_CURRENT_BANNER`. The README claimed *all it asks of you*, which is a claim about the **whole
header**. Two surfaces, two claims, two repairs — and the entry treated them as one problem with one
closure.

### The sentence was true and the exhibit was the lie

`licenceHeaderOf` returns two lines in both branches, so *its first two lines are all it asks of you*
is true of every install. What is one of two is the content of the second line. So the sentence
stays and the exhibit is attributed, which is the smallest change that makes the paragraph true.

The other form is named on a contract a reader can install, so the claim is one they can refute in a
terminal rather than one they take from us. And the reason the older form survives is written as what
it is — the bytes are frozen — which turns an apparent inconsistency into a demonstration of the
promise the rest of the page sells.

### The paragraph held a second particular nobody had separated from the first

`proposeDirectory` answers `src/lib/toopo` where the project has a `src` folder and `lib/toopo` where
it has not, and the page named only the first, twice: as the file's location and in the import line.
Measured, the same `toopo add string/slugify` in two projects differing only by that folder:

```
no src/    + lib/toopo/string/slugify.ts       import { slugify } from './lib/toopo/string/slugify.js'
with src/  + src/lib/toopo/string/slugify.ts   import { slugify } from './src/lib/toopo/string/slugify.js'
```

It falls inside this unit's own constraint — that what the page asserts be true of what a reader
receives — and it was found only because the repair was read against that constraint rather than
against the defect that opened it.

## What the guards do and what a first draft of them could not

Three guards, all scoped to the section by its heading. **The scope is not a nicety.** The catalogue
table names every contract, so a guard asking whether the page names one carrying the other form is
answered by that table with the new sentence deleted — the shape ADR-0130 records, a value a guard
looks for appearing twice on the surface it looks at. Each guard refuses an empty section, so
retitling the heading reddens all three rather than emptying their subject in silence.

**`the-import-line-the-readme-shows-is-the-file-it-just-showed` was written, run against its own
failure condition, and passed.** The first repair named both landed paths in code spans, so *the file
above* was ambiguous and either import line satisfied the guard: it could not fail. What fixed it was
the prose rather than the guard — the section now shows one landed file and names the other root as a
folder — and the guard reddens on the half-done repair it exists for, the landed path corrected and
the import line left behind.

`the-readme-names-every-root-an-install-can-write-to` reads one temporary directory twice, before and
after creating `src`, so what separates the two answers is the thing the function tests and nothing
else about either path. The backtick in `` `${root}/ `` is load-bearing: `src/lib/toopo` contains
`lib/toopo`, so a guard asking for both by plain containment is answered by a page naming only the
first.

None of the three rebuilds the installer's naming rule. `install.ts` says why, about itself: the path
is read off the plan rather than rebuilt, because applying that rule twice is how two answers to one
question come to disagree.

## What it costs

Nothing a reader pays and nothing published moves. No contract digest is touched, `npm run freeze` is
green, `THE_PACKAGE_VERSION` stays at `1.1.0`, and the corrected page ships with whatever release the
owner decides next.

The meta suite gains three guards and no census row, because `mutation/vitest.config.ts` is not one of
the six files `census.ts` counts — which is the exemption CLAUDE.md already records, and the price of
it is that no battery witnesses these three.

## Consequences

- A reader of the front page is told which of two forms they are looking at, and given a contract to
  check the other on.
- The open list entry closes with a mechanism, and its own named closure is recorded as wrong rather
  than struck out, because a false closure is worse than none.
- The three guards read the catalogue and the page against each other and **install nothing**. Both
  defects here were found by `npx toopo@1.1.0` against the live origin in two project shapes, which is
  a measurement somebody took and not a mechanism.

## Confirmation

The three guards in `confirmed-by`, each seen red alone on its own condition and green with the other
two:

- the banner guard, with the sentence naming the other form removed;
- the roots guard, with the second root written as prose instead of a code span — which is the first
  draft of this repair, refused by its own guard;
- the import guard, with the landed path corrected and the import line left on the other root.

All three red together when the section heading is retitled, each on its empty-section clause.

## What would reopen this

- A third banner form, which the banner guard refuses by count rather than by waiting for somebody to
  notice.
- A third project shape: `proposeDirectory` is a ternary today, so two readings are total over it, and
  a chain would answer a shape neither reading has.
- A decision to move the README's demonstration to another contract, which is a judgement about which
  contract a stranger should meet first and is not what this record settles.

## More Information

- [ADR-0159](0159-the-copyright-comes-out-of-the-file-that-lands-in-somebody-elses-project.md) — why
  two banner forms are permanent, and the derived guard on `LICENSE` this record deliberately does not
  copy.
- [ADR-0167](0167-the-open-list-is-ordered-by-whether-a-reader-meets-it-and-the-order-is-a-reading.md)
  — the reading that found this entry, and named the closure this record refutes.
- [ADR-0130](0130-a-contract-page-publishes-what-its-own-suite-did-not-catch.md) — the unit where a
  guard looking for a value anywhere on a surface was answered by a copy of it, which is the shape the
  section scoping is defence against.
- [ADR-0110](0110-a-feature-lands-as-a-file-and-its-folder-sits-beside-it.md) — why an install is one
  file, and at that path.
