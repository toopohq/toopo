---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/identifier.ts
  - packages/catalogue/every-contract.ts
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: registry-storage
    guard: every-case-is-addressable-across-the-whole-contract
---

# An address is a name, never a rendering of the data it addresses

## Context and Problem Statement

Four things in this catalogue are addressed: a case of block 4.4, a guard, a group of a table, and a
benchmark profile. Each is cited from outside the file that declares it — an API response names a case,
a URL anchors on a group, a battery pins a guard, a benchmark figure names a profile — and each was
first written as whatever read best beside the row it stood on.

A string that reads well beside its data is a string derived from that data, and a derived string moves
when the data moves. That is a broken link in every consumer at once, and it is silent.

## Considered Options

- Render the address from the data it addresses, so that it always reads true.
- A name, chosen once, frozen with the contract's major version.

## Decision Outcome

Every case of block 4.4 carries an `id`: a **name**, in kebab-case, unique within the contract and
**frozen with its major version**. The guards that assert a case are addressed by it —
[ADR-0019](0019-a-guard-is-addressed-by-a-pair-and-its-title-is-a-sentence.md) generalised this rule to
every guard in the catalogue.

How a case is addressed: a name, in kebab-case, unique within the contract, frozen with its major.

A **name**, and not a rendering of the case's own data - that distinction is the whole content of this
decision. `"1e400" -> overflow` restates the row it addresses, so it can be wrong about it, and block
4.4 makes every case one line of public documentation, where false documentation is worse than none.
`overflow-past-the-largest-double` claims nothing about the data, so there is nothing for it to drift
from. The published line goes on being rendered from the data; an identifier addresses a case, it does
not describe it.

A name is also stable under mutation, which is what the instrument needs and what two of the three
prototypes did not give it. They titled their guards by rendering the very data a specification battery
injects into, so a mutant that changed an expectation reddened a guard under a title the unmutated
contract does not contain and left the calibrated one silent. Measured: a hundred guards of
`number/parse@1` and eighty-six of `date/add@1` stood declared silent in a block, as an artefact of the
apparatus rather than a fact about either contract, because attribution identifies a guard by its title
and could not see the one that spoke. `array/group-by@1` carried an explicit title and did not have the
problem, which is the exemplar this generalises.

The reason that outlives the instrument belongs to the registry rather than to any one contract. An API
response that cites a case, a URL anchor on a contract's page, a validation report naming the case a
submission failed - each of them needs an address, and an address that changes breaks links. So it is
frozen with the major version, under the discipline a reason set already carries: the name is chosen
once, and renaming one costs `name@2`.

The shape itself is `identifier.ts`, because the registry addresses a case, a guard and a mutant by the
same one and cannot import a test framework to find out what it looks like.

### The rule reapplied to a guard, where it had not been

**A name, never a rendering of the data the guard asserts over** — the rule block 4.4 already carries
for a case identifier, restated here because guard identifiers were created without it being reapplied
to them, and nine of them had drifted. The test is mechanical: *the identifier and the assertion carry
the same number, so the two can be edited apart.* `three-needs-are-answered-without-the-api` listed
four, and its own comment said that a fourth appearing silently would mean something had moved off the
API without anyone saying so. A fourth appeared, the list was updated, the name was not, and the guard
written to detect a silent change was blinded by its own name. Renaming is the repair rather than
correcting the number, because a name that has to be edited whenever the data moves is not an address.

### What separates a count from a state, which is what decides the next case

**A count and a state are not the same thing, and this is what separates them: falsifying the name and
reddening the guard are the same event, or they are not.** An identifier that renders a *state*
disappears with the claim it carries — `nothing-is-measured-yet` asserts `toEqual([])` three times and
holds no number to drift from, so the day a figure is measured the guard is retired rather than
renumbered. An identifier that renders a *count* survives the data: the list grows, the assertion is
edited, the name stays, and it has become a lie. That is the rule to apply to the next case, and it
decides it without a second opinion.

What this does *not* forbid is a number that names the subject of a case rather than tallying a
collection — `two-decimal-points`, `p4-triangle-inequality`, `signature-accepts-two-strings`. An
identifier derived from a *frozen* address stays an address, which is what `${id}-described` and the
`eachContract` slug are.

### A benchmark profile's name

**A benchmark profile's name is frozen with the major version**, for the reason a case identifier and
a guard identifier already are: the registry will cite it in a benchmark figure, the site will make it
a URL anchor, and a validation report will name the profile a submission failed. It was already an
address in fact — the five specification batteries pin `profile-<name>` identifiers and one of them
documents `profile-identical` as *the address* in as many words — and it was the only derived
identifier in the catalogue that nothing declared frozen. No guard was touched: the gap was the
missing declaration, not the names. That sentence used to publish a count of the guards left alone,
and the count was wrong by one before anybody read it back — a state does not drift where a tally
does, which is the rule this file already carries and had not applied to itself here.

**The freeze was a policy rather than a mechanism when this was written, and the pre-flight made it
one.** A mutant that renames a profile still renames the guard built from it: all five
`profiles.test.ts` construct the title in a loop over `benchmarkProfiles`, so no title is ever left
behind and **a guard resolving the record against those titles could not fail** — which is what
disqualifies the obvious mechanism rather than any argument about its worth. What is resolved instead
is what a *battery* names, and both spellings this paragraph once called unguarded — a pin that stops
matching, a silence declaration naming nothing — are refused in `calibrate()` before a verdict exists.
Measured at `277a637`: the five declare **27** profiles, the suite collects **27** guard titles
`profile-<name>`, and **27 of 27** are named by a battery, so every one resolves.
`benchmarks.profiles[].name` stays `one-directional` in `field-map.ts` for its **other** half — a name
makes a claim about its own samples that no guard reads — and that half is one of the debts `CLAUDE.md`
keeps under *What the repository declares and nothing keeps*.

## Consequences

Renaming any of the four costs `name@2`. That is the price of the decision and not an accident of it:
each of them is cited from somewhere this repository cannot see, and a published major is frozen for
life.

The alias is the one field of `identity` that is *not* an address, and it is exempt for exactly this
reason — [ADR-0023](0023-an-alias-is-a-query-whose-best-answer-is-this-contract.md) carries that
asymmetry and the trap that hides a wrong alias.

## Confirmation

`every-case-is-addressable-across-the-whole-contract` in
`packages/registry/against-the-five.test.ts` holds the half a guard can hold: that every case
identifier is well formed and that no two cases of one contract answer to one address, across both
tables where a contract carries two. `isFrozenIdentifier` in `packages/catalogue/identifier.ts` is the
one statement of what the shape is, and the registry, the catalogue and the instrument all read it from
there.

**The freeze itself is kept by nothing, and saying so is the point.** Renaming an identifier is a legal
edit that leaves every suite green — the address is frozen by review and by the cost of a major, not by
a guard, because a guard would have to hold the previous name to notice. What a guard *can* hold is
that the new name is well formed and unique, which is what the one above does.

And no guard can establish that a name is a *name* rather than a rendering of the row beside it. That
is the judgement this record exists to settle, and the mechanical test above — *the identifier and the
assertion carry the same number* — is what a reviewer applies where a guard cannot.

## What would reopen this

A consumer that needs an address to be readable rather than stable — a page that wanted to print the
identifier to a reader instead of anchoring on it. The rule survives that by rendering the data beside
the address, which is what a case's published line already does, so the event that genuinely reopens it
is a second kind of address whose readers all live inside this repository.

## More Information

- [ADR-0019](0019-a-guard-is-addressed-by-a-pair-and-its-title-is-a-sentence.md) — the guard's own two
  objects, an address and a sentence.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — the same rule about drift, arriving
  on a figure in prose rather than on an identifier.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
