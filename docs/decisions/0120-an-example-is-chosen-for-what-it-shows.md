---
status: accepted
date: 2026-08-18
governs:
  - packages/registry/the-catalogue.ts
confirmed-by:
  - battery: site
    guard: a-use-case-shows-its-call-its-answer-and-its-caveat
---

# An example is chosen for what it shows

## Context and Problem Statement

The four use cases [ADR-0118](0118-a-use-case-is-standing-and-never-part-of-the-contract.md) added to
`string/slugify@1` were written in one sitting. Read three passes later by the owner of the product,
**two of the four were French**: `Crème Brûlée, 12 façons` and ` Café  `. The third was English and
the fourth Japanese.

Set beside what the same contract settles, that is narrow. Its 27 named cases reach Japanese, Russian,
Arabic, Hindi, Vietnamese, Greek, Turkish and Norwegian, and **exactly one of them is French**. So the
contract's own evidence is as wide as its claim and the illustrations of it are not.

Nothing was wrong with either example. Both are good calls, both make their point, and both are
answered correctly. What is wrong is a property of the *set*: a reader takes a claim about reach from
a set of examples without being told they are doing it, and this one said something narrower than what
the pages two sections below prove.

**The cause is recoverable and it is the whole reason this is a rule rather than a correction.** The
examples were written by somebody whose own language is French, and the two French ones are the two
that needed a word with an accent in it. Nobody chose French; French was to hand. The owner noticed on
the third pass. **Nobody notices this twice**, and whoever writes the next set will also reach for
what is to hand.

## Considered Options

- Correct the two examples and say nothing.
- A rule in prose, with a guard over the writing systems a set of examples covers.
- A rule in prose, with no guard, and an entry among what nothing keeps.

## Decision Outcome

**A rule in prose, with no guard.**

> **An example is chosen for what it shows.** Where two examples in one set would show the same thing,
> they do not show it in the same language.

The test that decides the next one: *could this example make its point in another language?* If it
could, and something else in the set is already in this one, it changes.

### Why the guard is refused, which is the half worth reading

The proposal was to sweep the Unicode ranges of a set of examples and refuse a set that covers one
writing system. Recognising a language is a heuristic; recognising a **script** is not, so the check
is mechanical and cheap, and that is exactly what makes it worth writing down why it is not written.

**That guard would have been green on the defect that motivated it.** The set already contained
`日本語テキスト`. It covers two writing systems, it always did, and the two French examples are both
Latin — as is the English one beside them. A sweep over scripts sees three Latins and one Han and has
no opinion, which is the correct answer to the question it asks and no answer at all to the question
that was raised.

`CLAUDE.md` states the criterion this fails: *a guard whose event nobody can name is not born green,
it is aimed at nothing.* The event here is *somebody writes a set of examples in their own language*,
and a script sweep does not fire on it — three languages in one script are three languages.

The stronger form, one example per language, cannot be checked at all: deciding that `Crème Brûlée`
and `Café` are the same language and `Kraków` is not is the heuristic the proposal was avoiding.

So this is [ADR-0054](0054-make-the-omission-impossible.md)'s other branch,
taken deliberately: no shape makes the wrong set fail to compile, so the rule is written in prose
**and** recorded among what this repository declares and nothing keeps. The population is every set of
examples the catalogue publishes, which today is four use cases on one contract and will be four per
contract on five.

### The rule is applied in the same change that writes it

A rule written and not applied to its own instance is decorative on the day it is written. ` Café  `
becomes `  Kraków  `, which answers `krakow`.

**`Kraków` was chosen for what it shows and not for being Polish.** The slot is *a tag typed by hand*,
and what it has to show is the three things that happen to sloppy input: the surrounding spaces go,
the case folds, the diacritic folds. `Kraków` shows those three and nothing else. Candidates that
showed more were refused for showing it: `Đà Nẵng` answers `đa-nang`, which is a genuinely interesting
answer — the stroked D survives while the tone marks fold — but it also demonstrates the word-joining
hyphen, which is the job one card above; and `smørrebrød` answers itself unchanged, which is worth a
reader's attention and is not this card's point.

The two that stay are unchanged. `Crème Brûlée, 12 façons` is the flagship call and shows four things
at once; `What NFKC unifies` is about NFKC on Latin and could not be written in another script without
ceasing to be about what it is about. **The rule bites where an example is interchangeable, and those
two are not.**

### What the answer is measured against

`every-use-case-replays-through-the-stripped-artefact-a-browser-runs` calls the shipped module with
these arguments and compares its answer with the declared one, so `krakow` is not a transcription.
Every candidate above was run through `reference.ts` before one was picked.

## Consequences

**Nothing froze.** A use case is standing, so this moves no digest: measured, the eight ledger entries
are identical to the byte either side of the change, `string/slugify@1` still at
`855107daf43419d2ca8f2f01e1a8e39b5de127974c287b75867fa5bdf1443ce1`, and `npm run freeze` is green.
This is the first time [ADR-0118](0118-a-use-case-is-standing-and-never-part-of-the-contract.md)'s
mechanism has been used for what it was built for — the registry changing its mind about a published
contract's curation — rather than for adding it.

**What nothing keeps is the set, not the example.** Each example on its own is verified by the replay.
It is their relation to each other that this rule is about, and no guard reads a set as a set. The
entry is in `CLAUDE.md` among what this repository declares and nothing keeps, and it closes where two
entries there already close: a validation stage reading a submission's own strings, which is priced
and not built.

## What would reopen this

The catalogue gaining a second language. Everything above is about the language a *sample* is written
in, and `typescript` is the only value `ContractAddress.language` takes today. The day there is a
second, the same word means two things one paragraph apart and this record has to say which.

And a set of examples where the rule and the guard stop disagreeing: a contract whose examples are all
one script would be caught by the sweep refused here, and if that ever happens the refusal is worth
re-reading rather than inherited. What it says is that a script sweep does not fire on *this* defect,
not that a set of examples in one script is fine.
