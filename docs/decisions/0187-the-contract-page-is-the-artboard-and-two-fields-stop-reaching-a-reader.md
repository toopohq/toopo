---
status: accepted
date: 2026-08-31
decision-makers: Mathis Perron
governs:
  - packages/site/contract-page.ts
  - packages/site/style.ts
  - packages/site/components.ts
  - packages/site/catalogue.ts
confirmed-by:
  - battery: site
    guard: the-command-a-reader-runs-and-the-signature-they-read-are-two-shapes
  - battery: site
    guard: what-is-frozen-and-what-the-registry-may-rewrite-are-never-one-section
  - battery: site
    guard: a-use-case-shows-its-call-its-answer-and-its-caveat
  - battery: site
    guard: every-page-is-reachable-from-the-front-page
  - battery: site
    guard: a-component-is-painted-by-its-own-rules-and-by-nothing-else
---

# The contract page is the artboard, and two fields stop reaching a reader

## Context and Problem Statement

The contract page is the last page of the redesign and the only one nobody had touched: it had moved
by sixteen lines since the redesign began, in a commit about factoring, and the owner read it and said
it did not look like the artboard. That was exact.

It is also 99 % of this site at a thousand contracts, and the page a stranger lands on from a search.
It carried twelve sections and 72 900 served bytes where `Toopo.dc.html`'s `isDetail` state draws four
and an aside.

## Decision Outcome

**The page is the artboard's `isDetail` state.** Breadcrumb, the mono title with its greyed domain,
two badges, one sentence, the install bar with the one accent control on the page, the frozen callout,
Signature, Source, Examples, and an aside of category, date, verification, ecosystem and version.

**Six sections stop being laid out**, on the owner's ruling: the settled cases, the properties, the
benchmark profiles, the re-examinations against the language, the checking sentence and the batteries'
own measurement. **The data is not withdrawn** — `snapshot/`, `contract-binding` and
`implementation-bindings` publish every one of them, which is the division `refusals` and the method
page already make: the repository and the origin carry the proof, and the site sells what is used.

**What the artboard adds is the source itself**, whole, in the six syntax inks
([ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md)
declared them, [ADR-0178](0178-every-ink-clears-the-floor-and-an-asymmetry-is-what-decided-the-last-one.md) their floor).
It is checked before a byte of it is rendered: `Held` carries the implementation's own bytes and
`catalogue.ts` refuses a blob that does not hash to the address its snapshot announces, at the frontier
every snapshot already crosses. A page whose subject is that everything on it can be checked may not
render a program nobody compared.

### Four corrections to the artboard, each from a record

The breadcrumb reads `catalogue` where the artboard writes `catalog`: this project spells the word once
and spells it that way ([ADR-0140](0140-the-page-a-reader-arrives-at-is-a-door.md)).

The signature is the record's own type — `type Slugify = (text: string) => string` — and never the
artboard's composed declaration, because composing one needs the type parsed and
[ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) refuses a second parser in as many words.

**The aside's `Tests` block says what is served.** The artboard draws `12 tests passing` over a green
dot and a link to a test suite; no test count exists in the registry, and a green dot is a verdict the
accent never means ([ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md)). What is served is stronger: the
settled cases are frozen for the life of the major, and the frozen definition is a document a reader
can fetch. *41 settled cases, frozen for life* is a sentence only this catalogue can say;
*12 tests passing* is what any site says.

**The artboard's `Rust — soon` and `pip — soon` rows are not rendered at all.** A second language is
recorded here as a thing that does not exist, and a *soon* nobody decided is a declaration nothing
keeps — the class this repository refuses.

### Five departures were the assistant's, and a browser found every one

None was found by reading. The lede carried `identity.description`, twenty lines of frozen prose in
the register the artboard gives one sentence. The install bar sat at 301px in a 708px column, because
this site's own `pre` rule sizes a block to its content. The three section labels wore the document's
`h2` border and 16px of padding — the eyebrow owns its box now, which is what the component layer is
for and which **no guard could have said**, a bare tag being the document's own typography and
therefore admitted by
[ADR-0183](0183-a-component-owns-its-class-and-nothing-outside-it-may-paint-it.md)'s matcher. A call
and its caveat were 10px apart and so were a caveat and the next call, so an example is one block.

And the frozen prose stood between the summary and the command: measured at 1440, the bar sat at about
700px where the artboard draws it at about 265. **The artboard's order is restored** and the
description takes its own section under the callout. The artboard has no opinion about where that
prose goes, because its own data has no such field; what it draws keeps the order it draws.

### The page's own title broke in half at 320

`string/levenshte` / `in`. CSS offers no soft-wrap opportunity after a slash, so `string/levenshtein`
was one unbreakable word and `body`'s `overflow-wrap: anywhere` — declared for the 64-character
digest — broke it wherever it ran out. The domain is its own box now and the title reads `string/` /
`levenshtein`: derived from what an address *is* rather than from a width, so no condition is written
and a longer name is answered by the same rule. `object/deep-equal` was already breaking at its own
hyphen, which is where a hyphenated name breaks, and is unmoved.

It is
[ADR-0185](0185-a-type-size-follows-the-reader-and-a-breakpoint-is-measured.md)'s open entry arriving
on this page rather than a thing to file.

## Consequences

**Two standing fields stop reaching a reader anywhere on this site, and that is the cost worth reading
twice.**

[ADR-0150](0150-a-frozen-contract-cannot-say-where-it-stands-so-the-registry-says-it.md) gave the
registry `againstTheLanguage` so a catalogue could say where a frozen contract stands against a
language that moved. [ADR-0161](0161-a-published-contract-can-be-wrong-about-its-own-case-and-only-the-instrument-says-so.md)
gave it `correctionsToFrozenProse` so a reader meets a correction **beside the sentence it corrects**,
on the argument that a reader who meets one three screens later has already believed the rationale.

The re-examinations went with the section the owner removed. The corrections went with the settled
cases, which is worse in kind: `correctionsToFrozenProse` resolves its `about` against a case
identifier, so its only possible surface *was* the case table. Both fields are still served, still
frozen, still in every snapshot — and **no reader of this site meets either.** `object/deep-equal@1`
publishes a rationale this repository has measured to be false, and the correction that says so now
reaches nobody who does not fetch the binding.

That is a consequence of a ruling and not a refutation of it. It is recorded here, and it is the
owner's to decide whether either field earns a surface back.

**Two declarations were found orphaned by sweeping the sheet for properties nothing reads.**
`--a-figure` lost its only reader when the card went; the measurement behind it is about three labels
that have not moved, so it stays on this page's own strip and is deliberately **not** given to the
shared rule, whose other renderer draws wider words. `--the-shortest-query` and `--the-query-field`
have had no reader since `b4e33ea`, four units before this one.

**Eight records stop governing `contract-page.ts` and eleven `confirmed-by` addresses are pruned.**
The precedent is exact: when the front page was rewritten, ADR-0181's commit dropped ADR-0140's guard
from its `confirmed-by`. The front matter is an index of addresses that must resolve; the prose of a
record is a photograph and is not edited. The eight are ADR-0116, ADR-0119, ADR-0130, ADR-0132,
ADR-0133, ADR-0134, ADR-0150 and ADR-0161 — each one about a section this page no longer lays out.
ADR-0096, ADR-0151, ADR-0180 and ADR-0183 still bind it and are cited in it.

**Three cells left the battery and five were re-anchored.** The three go with the guards they
accounted for. The five were re-anchored rather than dropped because each is the **only** accounting
for a guard that survived — dropping one would have failed the next run as unaccounted for, which is
the instrument saying what a reading of the diff would not.

## Confirmation

Every guard named above was seen red on its own failure condition before its green was believed, and
each re-anchored cell was injected by hand and the suite read: all five red on exactly the guards their
pins name and nothing else.

**W-129 read GREEN twice on the way there, and the cause is the finding.** The probe ran `npm run
site`, which is `tsc -p` and then vitest; `run.ts` spawns vitest alone. The mutant is killed by the
project typecheck and reddens its guard under the instrument — measured, identical `TS2339` with the
line as it was before this unit and as it is now. **A probe stricter than the instrument reports a cell
that does not exist.**

In a browser over 17 pages × 13 widths × 2 themes, 442 readings: **zero pages scrolling sideways and
zero elements outside the viewport with nothing holding them.** The first sweep reported 28 faults and
every one was an element inside a scrolling code block — the probe's own blind spot, closed rather than
dismissed. Exactly one code block scrolls per contract page at 320 and 390 and none at 1440, which is
[ADR-0135](0135-a-box-folds-where-the-language-allows-and-scrolls-only-where-it-does-not.md)'s rule behaving as written.

Broken words at 320 and below: **22, every one on `/method/`**, which is ADR-0185's existing entry, and
none on any contract page.

Without JavaScript, on a sandboxed frame that runs nothing: 1 313 words, **zero controls served**, and
the four slots empty but for the one command measured to run with nothing installed.

The tree writes 130 files and **73 answers**, unmoved.

## What would reopen this

- **The owner's ruling on the playground and on the four figures**, both still rendered and neither the
  artboard's, because a capability is not removed by a mock-up that does not show it and a figure is
  not removed by omission.
- **A surface for `againstTheLanguage` or `correctionsToFrozenProse`**, if either earns one. The
  consequence above is the argument; the decision is not this record's.
- **A contract whose implementation is more than one file.** The Source section renders a snippet per
  file already and shows the entry file's own path; what the extra files are labelled is that unit's,
  with the installer's relocation in view.
- **A reference long enough that the source stops being readable on the page.** `object/deep-equal@1`
  is 13 327 characters and its page is 9 863px at 1440. Nothing measured says that is too long; the day
  somebody says it is, the question is whether a source is shown whole or shown at all.

## More Information

- [ADR-0182](0182-the-artboard-is-the-specification-and-a-green-suite-was-not-a-reading-of-the-page.md)
  states the order of authority this page is built under, and it is unchanged: the artboard decides,
  and three things outrank it — the page reads with no JavaScript, every pair of the palette clears the
  floor, and the 73 addresses do not move.
- [ADR-0156](0156-the-proof-for-javascript-is-not-the-browsers-and-it-is-the-cheaper-one-to-keep.md) is why the source is
  read by the compiler's own scanner and never by a reader written here.
