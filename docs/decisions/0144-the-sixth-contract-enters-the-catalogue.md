---
status: accepted
date: 2026-08-20
governs:
  - packages/registry/the-catalogue.ts
  - packages/registry/local-read-api.ts
  - packages/site/playground.ts
  - mutation/number-round.battery.ts
  - mutation/number-round-spec.battery.ts
confirmed-by:
  - battery: registry-storage
    guard: every-binding-anchors-a-commit-and-the-check-reaches-all-of-them
  - battery: freeze
    guard: every-published-binding-still-hashes-to-what-it-was-published-as
  - battery: freeze
    guard: nothing-this-tree-binds-escapes-the-freeze-check
  - battery: site
    guard: every-contract-the-index-lists-has-a-page-at-its-own-address
---

# The sixth contract enters the catalogue, and what a catalogue costs when it grows

## Context and Problem Statement

[ADR-0143](0143-the-decimal-the-caller-wrote-and-not-the-double-the-machine-stored.md) wrote
`number/round@1` in full and published it nowhere. Its own consequences section said so: *the contract
exists on disk, complete and measured by its own suite, and nothing published says it exists.*
Everything about it was reversible.

This unit takes the other half. It is the first publication since the four of
[ADR-0106](0106-publishing-and-anchoring-are-two-acts.md), and it is the first time this repository
has grown a catalogue rather than founded one.

**There is no intermediate state.** `every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns`
is bidirectional, so a battery cannot name the folder until the contract is in the catalogue; and
`local-read-api.ts` sends anything that is not `never-published` through `publishContract`, so entering
the catalogue *is* publishing. The two batteries and the catalogue entry are one commit by
construction, measured rather than assumed: adding the batteries alone leaves that guard naming
`contracts/typescript/number/round` twice.

## Decision Outcome

`number/round@1` is `published`, its reference bound at `1.0.0`, and the catalogue is six.

### Publishing and anchoring are two acts, a second time

`PUBLISHED_FROM` was one constant for eight bindings, because one publication minted all eight. Its
own comment had written this change down in advance - *a catalogue that publishes a sixth contract
later anchors it at a different commit, and this becomes a map keyed by address, which is a change
this file should take on the day it happens and not before* - and the day arrived. The map landed one
commit early, green and reversible, so that the pair which cannot be green stays as small as the
mechanism requires.

**Both freeze guards are red on the commit that publishes and green on the commit that anchors, and
that is the shape rather than an accident.** A commit cannot contain its own identifier, so the commit
that mints a digest can never record where. Round's binding falls back to `THE_UNPUBLISHED_REVISION`
in between, which is the door `nothing-this-tree-binds-escapes-the-freeze-check` and
`every-binding-anchors-a-commit-and-the-check-reaches-all-of-them` both refuse - the same statement in
two suites, split by cost, which ADR-0107 argues.

### The playground had to decide what a number is, and it had refused to guess

`number/round@1` is the first contract whose call takes a `number`, and `AS_AN_ARGUMENT` stopped the
build rather than coercing one. Its header had named this day: *a sixth contract declaring a fourth
type does not compile until somebody has decided whether that type is typed or spelled.*

It is read as text and not as a literal, on the pattern `Date` already sets. **What settles it is what
a typo does.** `Number` answers `NaN` for text that is not a number, and this contract declares
`value-not-finite` and refuses it - so a mistyped field is answered by the contract's own refusal,
which is the one thing that page exists to show. A field refusing first would put an unverified
refusal in front of a verified one. A contract refusing is a contract answering.

The reading gained two members rather than one. `opensOn` turns the declared value of the case the form
opens on into the field's text, and `declares` turns what a reader typed back into the value a case row
prints - text, then declared, then argument. Both are required rather than optional, on the same rule
the reading itself carries: a type added here decides how it opens and how it prints, and there is no
member to leave out. `String(-0)` is `"0"`, so `number` spells the sign the way the case table spells
it, on the one value this contract settles a case on because its sign is not recoverable from its text.

### Three transcriptions and one guard were wrong in a way only a sixth contract could show

`every-reference-has-no-dependencies` compared against five empty arrays, the index against a map of
five names, the installable count against four. Each is a literal a guard compares a reading against,
which is what makes it a comparison rather than a tautology - so each was carried by hand.

`a-group-note-is-read-between-the-heading-and-the-first-case` searched a converted reading for
*unconverted* prose. Every group note that existed happened to carry no marks, and round's carries
`Object.is` and `===`, so the guard had been green for want of an instance. It compares through
`asRead` now, as the assertion one line below it already did.

## Consequences

**The catalogue's search got worse, measurably, and the measurement is the finding.** A third
`describe…Failure` export takes `describe` and `failure` from two contracts to three, past
`TELLS_THE_CONTRACTS_APART`, and `number/parse@1`'s exports field drops from three telling words to
one. `parse yaml` now answers `number/parse@1` where it answered nothing. The one repair the constant
admits was measured and refused: at a ceiling of three, `remove accents from string` answers
`number/parse@1` instead. Both values break exactly one query of the negative corpus, and three breaks
the better one.

`CLAUDE.md` carries it as a debt with both readings, because what this measured is not one line of a
corpus: **it is the first reading of what the matching rule does as the catalogue grows**, and it
degraded at the sixth contract.

**What is frozen from here is the whole of `contracts/typescript/number/round/`** - the seven files,
`language.test.ts`, comments and blank lines included - plus the shared harness every contract
imports. The repair for anything that has to change is `number/round@2` beside it.

## What would reopen this

- A seventh contract, at which point the coordinate map gains a third distinct commit and the reading
  of `TELLS_THE_CONTRACTS_APART` is taken again. The two readings above are what it is taken against.
- A contract whose call takes a type `AS_AN_ARGUMENT` does not hold, which stops the build the way
  this one did.
- The matching rule learning to tell a word the query *leaves out* from a word it *adds*, which is
  what would let `parse yaml` return to the negative corpus.
