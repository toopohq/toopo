---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: site
    guard: a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence
  - battery: registry-storage
    guard: a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands
  - battery: registry-storage
    guard: a-sentence-rendered-whole-is-not-also-a-complement
---

# A carried string a page prints as a paragraph is a sentence

The register of a prose field, settled: a paragraph is a sentence.

## Context and Problem Statement

`identity.relationToTheLanguage` had no register: three of its four written values were clauses and
one was a sentence, and the page prints the value bare. Two contract pages therefore published a
fragment as a standalone paragraph for as long as the field had existed.

## Considered Options

- Declare the field a clause and let the page frame it, as the page already frames `couplingRule` and
  a table's `purpose`.
- Declare that a value printed as a paragraph of its own is a sentence.

## Decision Outcome

**A string this record carries that a page prints as a paragraph of its own opens like a sentence and
ends in a full stop.** It is not a style preference: a paragraph is a block, and a block that reads as
a fragment is a block the reader has to attach to the one above it - the class
`no-element-runs-into-the-one-beside-it` is written for, one level down, where the two things run
together inside one string instead of across two elements.

The register was decided by a census rather than by taste. Over the four contracts the registry
serves, `summary`, `description` and `inputDomain` are sentences twelve times out of twelve; of the
four `relationToTheLanguage` values ever written, the one that is a sentence is `array/group-by@1`'s
and it agrees with all twelve, while the three clauses are the exception. The alternative - declare
the field a clause and let the page frame it, as the page already frames `couplingRule` and a table's
`purpose` - is refused by the same census: `array/group-by@1`'s value is *two* sentences, so no frame
fits it, and a frame that fitted would have to be re-decided for prose that is already written.

### The predicate

The register itself, as a predicate: it opens like a sentence and it ends like one.

Shape and nothing else, which is what separates it from a lint over prose. *Is this well written* is a
judgement and would be the class `CLAUDE.md` prices and refuses; *does this begin with a capital and
end in a full stop* is decidable, is the whole of what a rendering needs, and cannot be wrong about
what it claims.

The one refusal it can make wrongly is named rather than left to be met: a sentence that legitimately
opens on a lower-case identifier. Five exist in this catalogue's prose today - `parseFloat("1.2.3")
answers…`, `luxon…` - and all five are mid-string, where nothing asks. A paragraph that opened that
way would be refused and would have to be rewritten, which is the loud direction and the cheap one.

### The walk

Every string a record carries, at any depth.

Both guards of the register need it and neither may own it, so it is here, beside the rule. It takes
`unknown` for the reason `pathsIn` does: a `ContractRecord` and the `FrozenContract` a page is built
from are two types over one shape, and the walk is about the shape. Nothing is skipped and no field is
named - a walk that knew which fields hold prose would be the list this rule exists without.

### Why no guard about elements can see this class

**It is the neighbour of [ADR-0025](0025-what-separates-two-elements-in-a-reading.md), and neither
guard there can see it.**
`no-element-runs-into-the-one-beside-it` asks whether two sibling *elements* run together. Both defects
filed against this unit sit in a `<p>` whose only child is a text node, so there is no pair inside it to
look at; one level up, the paragraph's own neighbours are a `<p>` ending `\n\n` and an `<h2>`, so the
predicate is false there too. Measured over the seven pages: **595 sibling pairs of elements, 0
colliding.** That guard's subject is the boundary *between two elements*; these are boundaries *inside
one string*, and no predicate over element pairs reaches them. **A declared limit rather than a hole** —
and the reason the class has been found three times by a reader and never by a guard.

### The three instances in the catalogue

**Three instances in the catalogue and not two, and the third was found by the measurement rather than by
a reader.** `DETERMINISM_ORDERING_FINDING` is a clause all five contracts composed as `` `…own first
answer. ${it} - X is that mutant here.` ``. `NO_AMBIENT_OUTPUT_FINDING` is the same clause at the *head*
of a reason, opening a paragraph in lower case on four pages — three lines from the first in the same
file, and invisible to everybody who had read that file. Both are sentences now, and the ten composition
sites lost the joins that hid them.

### Two guards, and they partition the class

**Two guards, and they are a partition rather than a pair: a value stands alone or it is embedded.**
`a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence` derives its population from the two things
that already exist — every string the record carries, and every paragraph of the page — so **no list of
prose fields exists anywhere to drift**. Measured: 212 paragraphs are a carried string and 6 were
fragments, which is every instance of the class and nothing else. What the derivation buys is the
exclusions: `couplingRule` and a table's `purpose` are punctuated *by the page*, so their paragraph is
not the carried string and they fall out on their own rather than being named.
`a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands` takes the half no field-shaped guard
can reach, because a shared value is embedded and the string it lands in is a sentence whatever the seam
does. What the catalogue shares is whatever it exports; what is prose is whatever carries a space, which
is the one thing an identifier of this repository can never do — the argument ` :: ` was already chosen
on. Nine exported strings, five of them prose, two of the five in a record.

### The third guard, and the sentence that was well formed and false

**The reading of the seven pages found two more, and one is not a fragment but a false sentence.**
`whyNotFrozen` was composed after a full stop, which is the catalogue defect verbatim on a value the page
composes rather than a contract. And `WHAT_A_SIGNATURE_DOES_NOT_PROVE`, a whole sentence, sat in the slot
where the page writes `This does not establish ${butNot}.` — publishing *This does not establish a
signature attests who published this snapshot and from what build*, which **denies the claim two lines
above it**. Every other `butNot` of that table is a complement. **No shape check could ever have caught
it: the composed sentence is well formed and false**, which is the half of this class that register
cannot reach, and `a-sentence-rendered-whole-is-not-also-a-complement` is what does.

**A guard that claims detection is not excused by a price, and a required field of one word is what said
so.** That third guard was first declared an unprobed region of `registry-storage`, with the cost of a
cell written out: a cell moves the published count, which `README.md` transcribes and `THE_REPLAY.spread`
describes as a population that has run, so it obliges a full replay to restamp. `UnprobedRegion` refused
the entry — `nature` is required, the value would have been `claims detection`, and `run.ts` says what
that means with no nuance: never having been red, such a guard is decorative until a mutant reaches it.
**The type turned a price into a decision**, which is *Make the omission impossible* arriving on the
instrument's own declarations. I-32 is the cell, and the replay behind it is what this section's figures
are stamped on.

**The five instances of the seam guard are out of reach, and the construction is the direction a damaged
string fails in.** The seam is composed in a contract folder; `serialise.ts` is the only module of
`registry/` the string passes through and it copies it. To redden the guard an edit would have to produce
a *misplaced* occurrence, and every edit that damages the string removes the occurrence instead. Measured
rather than argued: `reason: property.reason` replaced by `reason: ''` leaves the whole registry suite
green, those five included.

## Consequences

The limit is declared rather than discovered: **a contract the catalogue refused has no page**, so
nothing asks this of `array/group-by@1`'s prose. That is the limit every guard about a page already
has, and it is the right one here - a clause is not wrong in a record, it is wrong rendered as a
paragraph.

Two neighbours stay outside the rule and are named so they are not read as oversights. A table's
`purpose` and `couplingRule` are punctuated *by the page*, so their paragraph is not the carried
string and they fall out of the derivation on their own.

**Two neighbours are named and left, because their register is not this one's and neither is frozen.** A
table's `purpose` is rendered as a lower-case paragraph on the three contracts with one table — the page
supplies its full stop and not its capital — and it cannot simply become a sentence, because it is an
`h3` on the two contracts with two tables. The refusals page prints `decidedAgainst` and `keptAs` as bare
lower-case paragraphs, and there the `h3` directly above each one is its label, which is the shape a
clause is entitled to. Both are decisions about a rendering rather than about frozen prose, so the cost
of leaving them is a regeneration and not a repository somebody else owns.

**Filling the two contracts that carry no `relationToTheLanguage` is a separate decision about content
and is still owed** — the debt [ADR-0009](0009-relation-to-the-language-is-optional.md) and
[ADR-0022](0022-a-divergence-is-replayed-rather-than-asserted.md) both name.

## Confirmation

**What keeps it is two guards, and they are a partition rather than a pair.** A value is standing
alone or it is embedded, and nothing else. `a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence`
in `packages/site/pages.test.ts` takes every string this record carries and asks it of each one that is
the whole reading of a paragraph - 212 of them today, derived from the page and the record, so a prose
field added tomorrow is covered with nothing edited here.
`a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands` in
`packages/registry/against-the-catalogue.test.ts` takes the other half: a value the catalogue shares between
contracts is composed into a longer string, so no field-shaped guard can see its seam.

## What would reopen this

A page that frames a carried string rather than printing it bare. The rule is about what a *rendering*
does with a value, so a second rendering of the same field is what would put it back in question —
which is why `couplingRule` and a table's `purpose` are outside it rather than exceptions to it.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
The two contracts that carry no `relationToTheLanguage` at all are
[ADR-0009](0009-relation-to-the-language-is-optional.md).
