---
status: accepted
date: 2026-08-18
governs:
  - packages/site/chrome.ts
  - packages/site/start.ts
confirmed-by:
  - battery: site
    guard: a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing
  - battery: site
    guard: what-runs-in-your-browser-is-said-once-and-beside-the-playground
---

# A card, and then everything, with nothing folded away

## Context and Problem Statement

The contract page answers two readers who want opposite things. Somebody in a hurry needs the name,
the sentence, the command, the cost and the signature, and needs them on the first screen. Somebody
who arrived from a search for this exact behaviour came for the argument behind every settled case —
and there are 23 to 50 of those per contract.

Claude Design drew three directions and put them through a differential trial on the densest real
contract, `date/add@1`: 50 cases, two tables, twelve groups, calls with two arguments and an answer in
two parts.

## Considered Options

- **The document.** One column, full unfold, headings and cases in reading order.
- **The summary and the table.** Three columns, a domain rail, a section rail, and each case as one
  line that opens on demand.
- **The card and the groups.** An identity card, then groups as folded panels with a chip bar over
  them.

## Decision Outcome

**The document, with the card of the third direction, and nothing behind a fold.**

The trial eliminated the second: at `date/add@1` three neighbouring calls agree on their first thirty
characters and differ only in the last twenty, which is exactly what a single truncated line cuts off.
A reader sees three identical rows. Wrapping saves them and gives back the compactness that was the
direction's whole argument.

Between the first and the third, the fold is what decided it, and the argument is this repository's
rather than a preference. **Auditability is the product.** A page whose argument is the product,
hiding its argument by default, gives up the only claim it makes. At fifty cases a fold no longer buys
useful length either — eight screens is a long article, and a table of contents buys the same movement
without hiding anything. What the third direction had that was necessary, a bar that lets a reader
jump to a group, works exactly as well over groups that are open.

### The card, and what is in it

The address, the short name as the title, the summary, the install command with a copy control, four
figures, and the answer's signature. The heading is the last segment of the contract's name and not
its whole address: the address sits above it and the document title carries it in full, so a heading
that repeated it would spend the largest type on the page saying one thing twice.

Each figure is **one paragraph and not two**, and the reading is why. Split into a value and a label
the page reads `3 332` and then `bytes, one file` as two separate things, where
`the-cost-a-page-states-is-what-lands-and-not-what-is-served` asks for `3 332 bytes` — and it is right
to, because that is the sentence a reader is owed and two stacked fragments are not one sentence. The
large mono figure over a small label is what the stylesheet makes of a `strong`; the sentence survives
underneath it.

`0 imports` is read off `dependsOn` rather than asserted. The page used to state *It imports nothing*
in prose, which was true and was a sentence nothing kept.

### The table of contents is derived, and a section's address is a name

The sections are a value. The rail reads it and the headings are read off the same list, because a
rail listing the sections and a body rendering them are two statements of one outline — and the day a
section is added, the rail is the half that does not move.

A section's identifier is a literal beside its title and never a slug of it, which is ADR-0017
arriving on a page anchor: `41 settled cases` gains a case whenever somebody settles one, and an
address that rendered it would move with it.

### A case shows the address it answers to

`number/parse@1#ordinary-integer` is what a bug report cites, what the batteries pin and what the
major freezes, and the page publishing it was rendering it into an attribute and a one-character link.
It is shown now, so the link needs no separate marker and the standalone `#` beside a case is gone
rather than added to.

It is written `#ordinary-integer` and not `ordinary-integer`. That is the fragment a reader appends to
this page's URL, and it is also what keeps
`a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence` satisfied rather than evaded: that guard
refuses a value the registry carries standing alone in a paragraph, and it is right to — an identifier
is an address and not prose. The `#` is what says so.

### `main` is the sixteenth tag

A page carrying a masthead and a table of contents makes whoever navigates by landmark cross both
before reaching a word of the contract. The remedy is the landmark rather than a rule about how many
links may come first. Three projections said what they do with it before it compiled, which is what
the closed tag set is for.

### The masthead carries no search field

Search is not built. A field that searches nothing is precisely what
`a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` refuses, so the rule this
repository already keeps is applied before it can be broken rather than after. The copy control is
built by `start.ts` for the same reason, and reads the command before appending itself — afterwards
the element's text is the command plus the word `copy`.

The masthead was written three times in three files before this. It is one function now, and the menu
is passed in because `theSite` is the one place that knows the refusals page exists only when
something has been refused.

## Consequences

**A contract page costs about a third more.** Measured over the built tree, `21df25d` against
`b667425`: `string/slugify@1` goes from 35 191 to 46 471 bytes (+32 %), `date/add@1` from 38 631 to
50 067 (+30 %), `number/parse@1` from 34 676 to 45 724 (+32 %), `string/levenshtein@1` from 25 041 to
34 191 (+37 %). About 5 800 of each is the stylesheet, which every page pays; the rest is the card,
the rail, the chip bars and the case identifiers. The whole tree goes from 1 089 510 to 1 171 097
bytes, +7 %, over the same 78 files.

The Markdown twins grow too, 13 % to 18 % on the four, and that is the backticks of ADR-0117 becoming
code spans rather than escaped punctuation. `packages/site/start.js` goes from 5 475 to 7 078 bytes,
which is the copy control.

Three guards were repaired for one cause and it is the cause worth keeping. The rail repeats every
section title, so a guard locating a section with `indexOf` over the reading found the rail rather
than the heading — and `what-runs-in-your-browser-is-said-once-and-beside-the-playground` was
requiring a sentence to precede `Properties` while reading the rail's entry for it. A separator does
not save such a guard either: a heading ends a reading with a blank line and a list item with one
newline, but the *last* item of a list is followed by the list's own newline and the two become
indistinguishable. `underEachHeading` walks the value instead, descending only to the level that holds
the headings, which keeps the rail out by construction.

**The domain rail the trial recommended is not built.** It calls a domain page that does not exist,
and the grid this page lays out leaves the column it will occupy. The address in the card is
deliberately not a breadcrumb of links for the same reason: one of its two segments has nowhere to go.

## Confirmation

`the-rail-of-a-page-names-every-section-of-it-and-only-those` in `packages/site/pages.test.ts`
compares the rail's destinations against the addressed sections of the page. **It cannot fail today
and its own comment says so**: both halves come from one array, so what it establishes is that the
derivation is self-consistent, which is the trap ADR-0087 names. It is written for a named event — a
rail written out by hand, the ordinary way a table of contents comes into existence — and for what
that event costs, which is a section nobody can reach on the page that will be most of this site,
silently, because every link still resolves and every heading is still there. Red on a rail built from
`sections.slice(1)`.

`a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` is what keeps the search
field out of the masthead and the copy control out of the served HTML.
`every-case-is-anchored-by-the-identifier-its-address-is-made-of` is what keeps the shown identifier
the contract's own.

## What would reopen this

A contract whose case count makes the full unfold unreadable. The trial's premise is that eight
screens is a long article and that a table of contents is enough movement for it; a contract at two
hundred cases is a different object and the fold would have to be argued again — against the same
sentence, that auditability is the product.

## More Information

- [ADR-0027](0027-what-a-contract-page-publishes-and-what-it-leaves-out.md) — what this page publishes
  and what it leaves out, which this record does not change.
- [ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md) — the system this page
  is dressed in.
- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — why a section's identifier
  is a name beside its title rather than a slug of it.
- [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md) — the trap the rail
  guard states rather than escapes.
