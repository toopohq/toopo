---
status: accepted
date: 2026-08-30
governs:
  - packages/site/what-a-card-says.ts
  - packages/site/contract-page.ts
confirmed-by: []
---

# What a card says is shared, and what it looks like is not

## Context and Problem Statement

The redesign's front page is a grid of contract cards: name, signature, summary, install command. Unit
2 has to build one.

**It would have been the third.** `contract-page.ts` opens on a `.card` carrying the address, the short
name, the summary, an *Install* block and a *Signature* block. `domain-page.ts` lists each contract as
the same thing without the signature — and says so in its own comment, written before this record
existed:

> The same four things the card of its own page opens on, in the same order, because a reader scanning
> a domain and a reader landing on a contract are asking the same question and the second should not
> have to learn a new layout to answer it.

And then computes them again.

## Decision Outcome

**The sentence a card makes is decided once. The markup is not shared.**

### What was duplicated was arithmetic, to the character

Both files carried these two expressions:

```
caseTables.reduce((count, table) => count + table.cases.length, 0)
files.reduce((total, file) => total + file.bytes, 0)
```

So the figures a reader chooses on had two statements, and two statements of one figure are two things
that can come to disagree. `whatItCosts` makes them once — cases, bytes, files and imports — beside
the address, the name, the domain, the summary, the signature and the command.

### The markup is deliberately not shared, and that is the decision rather than a shortfall

A card on a contract's own page opens with an `h1`. A card in a domain's list opens with an `h2` inside
an `li`. A card on the front page is a cell of a grid. **Those are three page outlines rather than
three renderings of one thing**, and `the-rail-of-a-page-names-every-section-of-it-and-only-those`
reads the outline.

A builder returning one fixed tree would have to be told the tag, the heading level and the wrapper —
at which point it is a template with three call sites and no claim of its own, and every page's outline
becomes a parameter of a function in another file.

**Resemblance is not duplication and identical arithmetic is**, which is the line `CLAUDE.md` already
draws about `outputsAreEqual`: three functions answering the same question about different data stay
apart, and one expression written twice does not.

It is the shape `what-a-control-says.ts` already has one file over, for the reason ADR-0157 gave: the
decision about *what is said* is separated from the delivery, so that something other than a browser
can hold it to account.

### The signature is the record's own form, and the alternative needs a parser

The artboard writes a signature as a declaration — `slugify(input: string): string`. What the frozen
record holds is a type, and a contract page has rendered `type Slugify = (text: string) => string`
since ADR-0116.

**Composing the declaration from the type means parsing the type**, and
[ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) refuses that in as many words: a copy of a
parser is not a second opinion, it is the same statement written where nobody will maintain it.

So every surface shows the form the record holds. **That is what lets the front page carry a signature
without `contract-index` gaining a field**: the generator holds `Held`, the signature is derived from
it, and a searched card is the static card filtered rather than a card rebuilt from the wire.

### A cast went with it

`contract-page.ts` read
`contract.surface.exports.find((entry) => entry.role === 'the-answer') as ExportRecord` — a cast over a
`find` that can miss, which would have handed `undefined` to a template and rendered
`type undefined = undefined`. `theAnswerOf` refuses with a sentence instead. Nothing in the catalogue
can reach it today, because stage 1's `states-its-own-signature` requires the export; the cast was
still a claim the type system had been told not to check.

## Consequences

The site suite is **unchanged at 183** — no guard added or removed, no census row moved.

**`noUnusedLocals` found two bindings the factoring made dead** — `THE_INVOCATION` and `implementation`
in `contract-page.ts` — which is the flag ADR-0174 turned on doing exactly what it was turned on for.

**Byte-identity of the rendered pages is not claimed from the suite, and the reason is worth writing
down.** A green suite says every claim the repository makes still holds; it does not say a reader
receives the same bytes. The comparison that would say so is a build here against the deployed origin,
and it has one obstacle that is a property of this site rather than of this change: **every page
carries the 40-character revision it was built from**, so two builds at two commits differ on every
page by construction. The comparison is only meaningful with that run masked.

**A first attempt at it was invalid twice over and is recorded because the failure is instructive.** It
compared `packages/site/out` against the origin without noticing that `npm run site:build` had exited
1 — `theRevision` refuses a dirty tree, by design — so what was compared was a stale artefact from an
earlier commit. It reported *0 of 18 identical* and every line of it was noise. **A probe that reads an
output directory has to read the exit code of the thing that wrote it**, and this one did not.

## Confirmation

`confirmed-by` is empty. This change adds no guard: what it does is remove a second statement of two
expressions, and the guards that were already over both surfaces are what hold the result. The site
suite is the confirmation, and it is unchanged — which for a refactor is the assertion rather than the
absence of one.

The masked comparison against the origin is taken in the commit that follows this one, because it
cannot be taken from a dirty tree.

## What would reopen this

**A fourth surface that shows a card.** The sentence is shared and the markup is not, so a fourth
surface costs a rendering and no arithmetic. If a fourth ever wants a *fifth* field, it is added here
and every surface can choose to show it.

**A signature form the record can produce.** If a contract ever declares its surface as a
declaration rather than as a type — which is a change to the frozen half and therefore to the next
contract, never to these seven — the artboard's spelling stops needing a parser and this refusal is
re-read.

## More Information

- [ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) — why the declaration is not composed from
  the type.
- [ADR-0157](0157-the-decision-a-control-makes-leaves-the-file-nothing-executes.md) — the shape this
  module borrows: the decision separated from the delivery.
- [ADR-0174](0174-a-disappearance-nothing-noticed-is-a-question-and-not-a-verdict.md) — the flags that
  found the two dead bindings.
