---
status: accepted
date: 2026-08-22
governs:
  - packages/site/contract-page.ts
confirmed-by:
  - battery: site
    guard: what-is-frozen-and-what-the-registry-may-rewrite-are-never-one-section
---

# What a contract freezes and what the registry may rewrite are two sections

## Context and Problem Statement

[ADR-0150](0150-a-frozen-contract-cannot-say-where-it-stands-so-the-registry-says-it.md) gave the
registry a way to say where a published contract stands against a language that moved under it, and
put the three statements it produced at the tail of *What it does* on the contract page. The owner
read the page and refused the placement in one sentence: somebody who arrives to find out what the
function does meets `ZonedDateTime.add` under `constrain`, V8 13.6 and a forty-three-case comparison
before reading what it is for.

**The complaint is about an order and the measurement is about a distance.** How far a reader travels
from the top of *What it does* to *What it is for, and what it is not*, measured at `57afaa7` in a
browser, on `/typescript/date/add@1/`:

| width | before |
| --- | --- |
| 320 | 2 584px |
| 390 | 2 037px |
| 768 | 1 026px |
| 1440 | 713px |

On a phone that is two and a half screens of somebody else's specification standing in front of the
sentence nobody skips. Nothing on the page is false and nothing is broken; it is auditor's matter laid
in an ordinary reader's path.

### The half that is not about an order at all

`identity.description` is inside `contractSnapshot`. It is frozen for the life of the major, a reader
may rely on it, and permanent rule 6 means nobody here can correct it. A re-examination is **standing**
— the mechanism [ADR-0118](0118-a-use-case-is-standing-and-never-part-of-the-contract.md) built
precisely so the registry could change its mind about something after publication.

Under one heading they rendered as consecutive paragraphs of one weight. The page said *this function
adds a duration to a `Date`* and *Temporal parts from it on five rows* in one breath, with nothing
telling a reader which of the two is bound and which is this morning's reading. `In practice` carries
a sentence for exactly this reason and has since ADR-0118 — *nothing here is part of the contract* —
and the second standing field arrived without one.

That is the defect worth a record. The order is what was noticed; the mixture is what was wrong.

## Considered Options

- Leave it inside *What it does*, moved after *What it is for, and what it is not*.
- A section of its own, second, immediately after *What it does*.
- A section of its own, last above the line.
- Folded into *How this contract measured*, which already carries measurements.
- At the head of the Reference half, below the line.

## Decision Outcome

**A section of its own, `#against-the-language`, titled *Where it stands against the language*, last
in the summary half — with a lede naming its author.**

### Why the half ADR-0150 chose is kept

The divider's own lede draws the two halves: everything above answers *whether this function does what
you need*, everything below is *what it is bound to do*. A re-examination is the first of those and
never the second. Temporal existing changes nothing this contract is obliged to do, and the binding it
would have to move is frozen at `94c5acc7…` for life — so the question it answers is a deciding
question, and the last two options are refused on the same sentence.

*How this contract measured* is refused a second time for a reason of subject rather than of half: it
is this implementation's own batteries, one population, projected at this address. A reading taken
against somebody else's specification is not in it, and a heading covering both would be a heading
covering two populations.

### Why last rather than second

**Every reader asks what the function is for; only a reader who already knows the language moved asks
this.** Moving conditional matter from inside the first section to immediately after it moves it by
very little — it is still the second thing on the page. What the page has instead is a register that
climbs: what the function does, then a form to try it on, then a measurement carrying a commit and the
limits of the runtime it was read on, and then the Reference half, which is denser still. The
re-examination is the top of the summary half's range, so it sits at the seam.

**The reader ADR-0150 was written for is served better and not worse.** That record's argument was a
reader arriving from a search in 2027 who asks one question before any other. A rail entry naming the
question answers them from anywhere on the page in one click, which is faster than *near the top of
section one*, where they have to read to find out. The rail is derived from the sections, so the entry
arrived with nobody writing it.

**A rail entry was counted as a cost and is not one.** ADR-0150 read *it costs no rail entry, which is
what a derived table of contents buys*. `In practice` costs one and nobody calls that a cost. A saving
of one line in a list, bought by leaving matter unnamed and unskippable, is the wrong side of that
trade at any length — and this block is 562px at 1440, which is not a small length.

### Why a lede, on a page whose content was not to change

The three statements cannot say who wrote them. The sentence added says that, and nothing else:

> What the registry has measured about this contract since it was published, which the contract itself
> cannot say. Nothing here is part of what the function is bound to do — the definition below is
> frozen, and a re-examination reports on it rather than changing it.

It is `In practice`'s lede arriving on the second standing field, and ADR-0118 is the argument in both
places. **It counts nothing**, so a second re-examination lands under it with nobody editing it, which
is [ADR-0018](0018-a-published-count-carries-its-coordinates.md)'s rule on the one sentence
this unit adds.

### What moved and what did not

Nothing the registry holds moved. `againstTheLanguage`, its three fields, their visibility and their
verification are ADR-0150's and untouched; the change is `packages/site/contract-page.ts` and the guard
beside it. **Measured at `57afaa7` and again on the finished tree, all six contract digests are
identical to the byte**, the refused contract included:

| contract | digest |
| --- | --- |
| `typescript/number/parse@1` | `d5071a58…` |
| `typescript/date/add@1` | `94c5acc7…` |
| `typescript/array/group-by@1` | `1dd17492…` |
| `typescript/string/levenshtein@1` | `e231dc9d…` |
| `typescript/string/slugify@1` | `855107da…` |
| `typescript/number/round@1` | `7418dfc5…` |

That is not a surprise and it is measured rather than reasoned about, because it is the whole reason
this field lives in the standing: a contract page is not in any snapshot, so a page may be rebuilt for
the life of the major and an address never moves.

### Consequences

**The distance to the job falls by more than half at every width**, and the page grows by about one
per cent:

| width | to the job, before | after | *What it does*, before | after | page, before | after |
| --- | --- | --- | --- | --- | --- | --- |
| 320 | 2 584px | 1 099px | 3 316px | 1 831px | 29 824px | 30 194px |
| 390 | 2 037px | 891px | 2 613px | 1 467px | 24 540px | 24 859px |
| 768 | 1 026px | 450px | 1 343px | 768px | 18 002px | 18 216px |
| 1440 | 713px | 321px | 952px | 561px | 13 260px | 13 415px |

What is left in *What it does* at 1440 is 561px, and all of it is the contract's own frozen prose. The
new section is 562px of registry prose under its own name. The page is 155px longer at 1440 — the
heading and the lede — which is 1.2%, and it is the same 1.2% at all four widths.

**The rail gained an entry and the outline gained a heading**, so the Markdown twin, the sitemap's
outline and `the-rail-of-a-page-names-every-section-of-it-and-only-those` all follow from the one
array. `#what-it-is-for` and every other address on the page are unchanged, so no link written to this
page has broken.

**One page of fifteen is affected**, because `date/add@1` is the only contract declaring the field. The
section is absent where the field is, for the reason `In practice` is: the registry serves it only when
it holds something, so no page renders this heading with nothing under it.

## Confirmation

`what-is-frozen-and-what-the-registry-may-rewrite-are-never-one-section` in
`packages/site/pages.test.ts` walks each contract page section by section and refuses a heading that
reads both a frozen sentence and a revisable one. **Seen red on the state this record replaces** — the
three paragraphs put back at the tail of *What it does* and the new section dropped, which is
`57afaa7`'s page exactly:

```
× what-is-frozen-and-what-the-registry-may-rewrite-are-never-one-section
  + [ "typescript/date/add@1: \"What it does\" reads a frozen sentence and a revisable one as one" ]
```

**The neighbour is `a-re-examination-reaches-the-reader`, and the red above is what shows neither can
see the other's defect.** That guard stayed green through it — 134 of 135 passing, the one failure
being this one — because all three statements still arrived on the page. It asks about arrival; this
asks about company. Dropping `whatItEstablishes` reddens that one and leaves this one green.

**It has a cell rather than an argument.** `W-95` of the site battery puts the re-examination back
beside the frozen description, which is the plausible edit and not an attack: somebody with a
re-examination to render reaches for the section that already answers *what does this function do*, and
the page that comes out reads well and every sentence on it is true.

**What is kept is the mixture and never the position, and that is stated rather than discovered.** The
guard refuses a heading carrying both kinds of prose; it says nothing about which section comes first,
so moving this one to second in the half leaves it green. That is deliberate and it is not an entry for
the list of what this repository declares and nothing keeps: *last above the line* is a judgement about
a register, argued here and re-arguable by anybody who reads the page, where *frozen prose and
revisable prose do not share a heading* is a rule about what the catalogue promises. Only the second is
worth a guard, and a guard over the first would pin a layout to a decision somebody is entitled to take
again.

**The page was rendered and read, at four widths and in both themes**, which is the reading ADR-0150
could not take and which is recorded there rather than here. The whole tree was swept on both sides of
the change — 15 pages × 4 widths × 2 trees, 120 renderings: **0 elements painted outside the viewport,
0 blocks scrolling sideways, 0 pages scrolling sideways**, and `scrollWidth` equal to the viewport
everywhere. The section was read at 390 in dark, where its prose sits at 24 · 366 in a 390 viewport,
inside the body's own gutters.

## What would reopen this

**A second re-examination on one contract.** The section renders a list and today the list is one
entry. Two make it long enough that the question is whether each entry wants a heading of its own, and
the answer is not decided here.

**A contract carrying both `useCases` and `againstTheLanguage`.** They have never been rendered
together — `string/slugify@1` has the first and `date/add@1` the second — so the summary half has never
carried both standing sections at once, and the order between them is declared rather than read.

**A re-examination that concludes something other than *this stands*.** This one is comfortable, which
is what makes the ordering above safe: a reader who never reaches the section loses nothing they needed.
A re-examination reporting a real overlap would be matter every reader wants, and the placement would be
taken again with that in front of somebody rather than this.

## More Information

**ADR-0150 carried two sentences that were false, and this unit found both by rendering the page.**
The first is recorded in that record and repaired there: it declared that nobody had looked at the page
and named what stood in place of looking, and the owner has since looked.

The second is smaller and is the same class one floor down. That record argued the placement as *under
*What it does*, beside `identity.relationToTheLanguage` — which is where the four contracts that carry
that field already answer it*. **`date/add@1` does not carry that field.** Nor does `number/parse@1`;
the four that do are `array/group-by@1`, `number/round@1`, `string/levenshtein@1` and
`string/slugify@1`, and the adjacency therefore did not exist on the only page in the tree that renders
a re-examination. It was true of the code's shape and false of every rendering of it — which is what a
reading of a source rather than of a page produces, and what the first sentence had already cost.
