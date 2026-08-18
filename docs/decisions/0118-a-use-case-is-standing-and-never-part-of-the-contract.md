---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/snapshot.ts
  - packages/registry/the-five.ts
confirmed-by:
  - battery: site
    guard: a-use-case-shows-its-call-its-answer-and-its-caveat
---

# A use case is standing, and never part of the contract

## Context and Problem Statement

The owner of the product read the contract page built at
[ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) and made one criticism: it
never says what the function is for in real life. Measured at `7bdbb33` on `string/slugify@1`: **3 800
visible words under eight sections of one weight**, and not one line of it about a job somebody has.

So the page owes a section of use cases — a call as somebody would make it, and the one thing to know
before relying on it. The question this record answers is *where that text lives*, and it turned out
to have exactly one answer rather than several.

**`string/slugify@1` is published.** Its contract snapshot is bound at `15aeb6c` to
`855107daf43419d2ca8f2f01e1a8e39b5de127974c287b75867fa5bdf1443ce1`, and
`every-published-binding-still-hashes-to-what-it-was-published-as` rebuilds that commit and compares.
Two measurements, taken before anything was written:

| what is changed | digest of the contract snapshot |
| --- | --- |
| nothing | `855107da…` |
| one alias added to `identity.searchAliases` | `5fe0ecfa…` |
| a `useCases` field added to `identity` | `bd256afd…` |
| **one comment appended to `contract.ts`** | `84403f0c…` |

The fourth row is the one that decides. `contractSnapshot` freezes `harness`, and `harness` carries
the `sha256` of all seven files — so **a published contract cannot gain a byte in its own folder**,
whatever field the byte belongs to. Both of the obvious homes are closed by permanent rule 6, firing
correctly.

## Considered Options

- A field of `identity`, declared in the contract's `contract.ts`.
- A field of `identity`, declared outside the folder.
- The text in `packages/site/`, owned by the generator.
- A field of the **standing**, declared beside `lifecycle`.

## Decision Outcome

**The standing, and not because it is where the field fits — because it is the mechanism written for
exactly this question.**

`CONTRACT_STANDING_FIELDS` asks one thing of every field a contract record grows: *may the registry
change its mind about this after publication?* An answer of yes puts the field there whatever else it
is. And the comment above that list had already named this field before it existed — *two candidates
already exist on paper and neither is filled today: anything the registry curates about a contract, as
`tags` are one level down.* A use case is the first of the two.

The proposal this record was opened with was *a field of the contract, optional, not frozen with the
major*. That reads on the right category and misses the one that decides. **Not frozen with the major
and outside the folder are two different properties**, and only the second is enforced by anything: a
field of `identity` is inside the digest whether or not a record says it is curation, and a byte in
`contract.ts` is inside the digest whether or not it is a field at all.

The third option is refused for a reason that is not about digests. The registry owns what the
catalogue says about a contract; the generator renders it. Text about a contract living in
`packages/site/` would make the site the author of catalogue content, which is an inversion — and it
is precisely what would make the text impossible to keep, because nothing would then serve it to
anybody but this one page.

### What the reader is told, and why it is now arithmetic

The section carries the sentence *nothing here is part of the contract: the settled cases below are
what is guaranteed, and these are only how the guarantee gets used.* Under the frozen options that
sentence would have been an assertion. Under this one it is a fact anybody can check: **measured, all
eight ledger digests are identical to the byte with four use cases declared on a published contract**,
and `npm run freeze` is green. *Not a guarantee* and *not in the registry* are two different things,
exactly as they are for an alias.

### It carries no identifier, and that follows from the same decision

Every other row of this schema that a page renders has a frozen kebab-case address, because something
cites it: a URL anchors on a case, a battery pins a mutant, a report names a profile. Nothing cites a
use case. It is curation in [ADR-0023](0023-an-alias-is-a-query-whose-best-answer-is-this-contract.md)'s
sense, which is what makes it rewritable the day it reads badly — and an address on a thing that may be
rewritten is an address that will one day name something else. The visible consequence is that the four
card headings are the only headings on the page with no anchor beside them.

### The call is a value, and there is no code around it

The mock-up drew the call inside a snippet, with a line of surrounding code above and below. That is
refused. `data` is written the way a case of block 4.4 is written — the arguments first, named as the
signature names them and in its order, then the answer — so `theCallOf` reads it and the replay
executes it. Lines of unexecuted code beside an executed one would put a transcription on the one page
whose whole argument is that everything on it was checked, which is the defect
[ADR-0114](0114-a-front-page-that-shows-the-registry-and-not-a-function.md) took out of the README.

### The warning is a field

A use case is worth reading for its warning — a slug is lossy, two headings collide, an edited title
moves a page. As a second paragraph of the description, nothing refuses a use case written without one.
As a required field, one does. `CaseRecord.rationale`, `UniversalPropertyRecord.reason` and
`CaseGroup.note` are the same shape for the same reason, three times over.

**Four use cases on `string/slugify@1`, because there are four different warnings** and not because the
mock-up drew four. A fifth was drafted and dropped: a filename on a case-insensitive file system, which
`inputDomain` already refuses in as many words — a card arguing against the contract's own declared
domain would be the page contradicting itself two sections apart. Nothing in the schema or on the page
states the number; the section's own sentence deliberately does not count the cards, on
[ADR-0018](0018-a-published-count-carries-its-coordinates.md)'s rule.

## Consequences

**Editing either shared file still rebinds all five addresses, and this changes nothing about that.**
What is new is a place to put text about a published contract at all, which did not exist: before this
record, the honest answer to *may we say more about `string/slugify@1`* was no.

**`the-frozen-half-and-the-standing-half-partition-a-contract` gave up half of what it asked.** The
standing gained its first optional member, so a list of every declared standing field is no longer what
any one contract holds. The guard now compares against the standing fields *that record carries*, which
keeps the defect it exists for — a field added to the record and to neither half still reddens — and
loses the question *is every declared standing field filled*. That question is about the catalogue and
not about a contract, and it is asked once, by
`every-standing-field-a-contract-declares-is-carried-by-one`. Without it, a standing field nothing
fills would be invisible by construction: every contract would simply not carry it.

**`publicContract` omits the key rather than serving an `undefined`.** `pathsIn` treats anything that
is not an object as a leaf, so writing it unconditionally emits the bare path `useCases` on the four
contracts declaring none — and what would be classified there is an absence.

**Two anchors of `registry-storage` moved.** I-12 attached to the last member of
`ServedContractBinding` and to the last line of its builder, and both were `lifecycle` until the
standing gained a second field. They are re-anchored on the new last member, which is what the mutant
needs to attach to.

## Confirmation

Two guards, in two files, because the record and the page are two claims.

`every-use-case-replays-through-the-stripped-artefact-a-browser-runs` calls the shipped module — the
same stripped `reference.ts` a browser runs, through the same `replayed` and the same `shipped` the 41
settled cases go through — and refuses a declared answer the function does not produce. Seen red
before being believed: with `' Café  '` declared as answering `'café'`, it reports
``typescript/string/slugify@1#A tag typed by hand: slugify(' Café  ') answers 'cafe' where the row
declares 'café'``.

`a-use-case-shows-its-call-its-answer-and-its-caveat` asks the other half, and the two are genuinely
different: the replay never looks at a page, so a rendering that dropped the caveat or printed the
argument where the answer goes would publish a false demonstration with the replay green. Seen red on
both conditions. Dropping `paragraph(entry.caveat, …)` reports four faults, one per card. Rendering
`written` where `answered` belongs reports **three**, not four — `slugify` answers `日本語テキスト` for
`日本語テキスト`, so on that one card the two halves of the call are the same string and the defect is
invisible. That is the argument for the other three existing.

Both are measured by the instrument rather than asserted here: W-16 drops the warning from every card,
W-17 shows a use case answering its own argument, and W-17 is written down as a mutant the *replay*
does not catch.

## What would reopen this

A second contract declaring use cases, which is the next unit and is deliberately not this one:
sixteen texts written before the form has been read on a real page would be fifteen too many.

And a use case that somebody wants to link to. That is the day the no-identifier decision above is
tested for real, and the answer is not to mint one quietly — an address that may be rewritten is worse
than none, so what would have to change first is that a use case stops being rewritable.

## More Information

- [ADR-0023](0023-an-alias-is-a-query-whose-best-answer-is-this-contract.md) — the record whose
  category this borrows, and whose own claim about the freeze is now contradicted by the mechanism;
  the head of that record and `CLAUDE.md` both carry it.
- [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) — the mechanism that made
  permanent rule 6 red rather than declared, and therefore the reason the two obvious homes are closed.
- [ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) — the publication that turned all of this
  from a design preference into a constraint.
- [ADR-0119](0119-the-page-is-read-in-two-halves.md) — the section this field is rendered in.
