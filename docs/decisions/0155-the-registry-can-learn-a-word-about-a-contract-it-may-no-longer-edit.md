---
status: accepted
date: 2026-08-22
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/snapshot.ts
  - packages/registry/search.ts
confirmed-by:
  - battery: registry-storage
    guard: every-declared-alias-finds-its-own-contract-first
  - battery: registry-storage
    guard: every-phrase-an-entry-offers-is-a-phrase-the-search-reads
  - battery: registry-storage
    guard: a-learned-term-is-one-the-contract-was-not-already-found-by
  - battery: registry-storage
    guard: a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare
  - battery: registry-storage
    guard: a-corpus-of-real-queries-ranks-the-right-contract-first
---

# The registry can learn a word about a contract it may no longer edit

## Context and Problem Statement

`number/parse@1` declares `int` and not `integer`. `answers` lets a query shorten a word the
catalogue carries and never extend one — measured and argued in `search.ts`, because a symmetric
prefix answers `stringify` with all three contracts carrying `string` — so `integer` reaches nothing
at all.

Measured at `91b7314`, over eight ordinary ways of asking for this function:

| written with | answered by `number/parse@1` | silent |
| --- | --- | --- |
| `int` | 8 | **0** |
| `integer` | 0 | **8** |

```
string to int                            -> typescript/number/parse@1
convert a string to an int               -> typescript/number/parse@1
parse a string as an int                 -> typescript/number/parse@1
turn a string into an int                -> typescript/number/parse@1
how do I convert a string to an int      -> typescript/number/parse@1
javascript string to int                 -> typescript/number/parse@1
safely convert a string to an int        -> typescript/number/parse@1
read an int from a string                -> typescript/number/parse@1

string to integer                        -> nothing
convert a string to an integer           -> nothing
parse a string as an integer             -> nothing
turn a string into an integer            -> nothing
how do I convert a string to an integer  -> nothing
javascript string to integer             -> nothing
safely convert a string to an integer    -> nothing
read an integer from a string            -> nothing
```

The two spellings are one request, and the longer one is what somebody writing a sentence reaches
for. This is the most-asked-for function in the catalogue.

### The repair the catalogue prescribes is one nobody may carry out

`search.ts` has said since it was written what to do about a query only a description could have
answered: *the repair belongs in `identity.searchAliases`, where it is frozen, reviewed and served*.
ADR-0035 says the same in as many words. One alias — `string to integer` — answers seven of the
eight.

`contractSnapshot` freezes `identity` whole, and `number/parse@1` has been published since `d3a5166`.
So the prescription is not a repair: nobody may carry it out, on five of the catalogue's six
contracts. `CLAUDE.md` has carried that as two entries — one saying the alias mechanism does the
opposite of what ADR-0023 decides, one saying a record prescribes a repair nobody can make — and this
is what closes their instances.

### It is a family and not a phrase

`integer` is not one missing alias. Every sentence in the table above is a different request that
happens to contain the word, so what is missing is a *word*, and a repair that answered one of the
eight would be a repair of the wrong size.

## Decision Drivers

- **No published digest may move.** Permanent rule 6, which is the whole security argument of this
  project and the thing every lockfile in the world would hold.
- **A search that always answers something is the one nobody believes twice.** That is what
  `search.ts` is shaped around and it is not traded for a convenience.
- **The cheapest contribution this project invites has to be one it can accept.** ADR-0023 invites it
  by name.
- **No guard may quietly stop covering half its subject.** ADR-0152 closed that class three days ago,
  and the change contemplated here is exactly what would open it again.

## Considered Options

### A. Let the matching rule reach the near word

Teach `answers` that `integer` and `int` are one word — an edit distance, a stem, or the symmetric
prefix this file was first written with and removed.

Refused. It is the property `search.ts` exists to hold, given away: a rule that reaches a near word
reaches *every* near word, so a misspelling stops answering nothing and the catalogue starts having
an opinion about everything anybody types. The reading that killed it was taken before this record
and is **not restated here**: it counted typos an edit-distance rule would answer, over a population
this record cannot rebuild, and a figure quoted without its population is what ADR-0018 refuses. What
survives without it is the argument, which is structural: `search.ts` already carries the measured
refusal of the symmetric prefix — `stringify` answering all three contracts carrying `string`,
`datepicker` and `dateline` answering `date/add@1` — and edit distance is that failure with a wider
radius.

### C. Bind a second contract digest under one address

ADR-0023 names it: *being wrong about an alias costs a revision*. A revision would let `identity` be
corrected under a frozen address, which repairs this and the four other instances at once.

Refused for this unit. Nothing implements it, it is priced in ADR-0023 as a unit of the publishing
tool, and the reading that killed it as a *near-term* repair — a duplicate the search cannot tell
apart — was likewise taken before this record and is not restated. It stays where ADR-0023 put it:
the thing that would close the alias entry properly, unbuilt.

### B. A standing field the registry may add phrases to

Taken.

## Decision Outcome

**`ContractRecord.alsoFoundBy`**, a standing field beside `useCases` and `againstTheLanguage`,
carrying the phrases the registry learned people ask a contract by after that contract's own aliases
were frozen. `number/parse@1` declares one: `string to integer`.

Each entry is three fields — `term`, `howItIsAsked`, `whyThisContract` — and `search.ts` reads the
term as an alias, because that is what it is.

### The argument that was given for freezing it, and why it is reversed

The question put to the owner was whether the frozen half must remain the complete account of what a
contract answers. The answer given first was yes, and this record is where it is withdrawn, because
this repository measured the opposite in the same week.

ADR-0154 measured `slugify a blog post` against this catalogue's own six publications and it answered
**0, 0, 0, 1, 4, 4**. The negative half of the same trial had one query answered at one, two, three
and four contracts, **none at five**, and one again at six. Nothing about any contract moved across
any of those readings. What a query reaches is a function of the whole catalogue — a word stops
telling the contracts apart as contracts arrive — so the account was never complete and could not
have been. A field inside the digest would be promising, for the life of a major, something no
contract has ever been able to promise.

The cleaner statement is the one this repository already reached for `againstTheLanguage`: **what the
registry measures is not what the contract is held to**. How somebody finds a function is not part of
what the function is obliged to do. That is curation, and the family is `useCases` and `tags`.

### Why ADR-0128 does not apply, which is a question about content and not about genus

ADR-0128 refuses a standing field that restates something the frozen half already publishes, and it
refuses it on the **content**: *what a contract refuses to be* is already in `identity.inputDomain`,
in prose, on every contract, so a field for it would be one half of a duplicate that permanent rule 6
makes unremovable for the life of the majors — neither side ever repairable.

Nothing here restates anything. A frozen alias is a phrase the contract's author wrote at
publication; a phrase nobody wrote is in no field at all. There is no half of the contract to point
at instead, which is the whole test ADR-0128 applies.

### What it costs: the review has no occasion

ADR-0023's alias review happens **at publication**. It caught eight phrases naming something their
contract refuses to do — `remove accents from string` on `string/slugify@1` being the one this
repository still cites, because `Straße` stays `straße`. A term added to `alsoFoundBy` arrives at a
moment nothing marks, so there is no occasion at which that review runs.

That is a cost and not a reason to refuse, and three things are done about it rather than one.

1. **The two questions the review asks are written down separately and kept.** A false alias answers
   `howItIsAsked` truthfully and `whyThisContract` falsely; a term nobody types answers the second and
   fails the first. Folded into one paragraph it is the failing half that goes unwritten.
2. **The half a guard can compute is computed.**
   `a-learned-term-is-one-the-contract-was-not-already-found-by` rebuilds the catalogue without each
   learned term and requires the phrase to answer something other than that contract, so a term that
   buys nothing reddens — and it reddens on a *publication* as readily as on a bad term, which is the
   half a person would never look for.
3. **The door is shut where the review is still on offer.**
   `a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare` refuses a learned term on a
   contract whose `identity` is still open, so the standing is what a frozen contract falls back to
   and never a shorter route past a review that was available. It is total over `Lifecycle['state']`
   by the compiler.

**What none of that recovers is the judgement**, and no guard ever will: `search.test.ts` has said
since it was written that the alias trial reviews the search and never the aliases. What would
recover it is the next publication's alias review sweeping the learned terms of every contract as
well as the frozen ones, which is a convention and not a mechanism. It is on `CLAUDE.md`'s list of
what this repository declares and nothing keeps.

### The population that would have shrunk, and the red that says it did not

`every-declared-alias-finds-its-own-contract-first` swept `entry.searchAliases`, which was every
phrase a contract was offered as. Giving the registry a second place to put one takes half its
subject away with nothing saying so — which is precisely the class ADR-0152 closed three days before
this record, arriving on the change that would have caused it.

The population is now a **declaration**, `A_WAY_OF_BEING_FOUND`, keyed by `keyof ServedIndexEntry`, so
a field added to the answer does not compile until somebody has said whether it holds phrases. **The
compiler forces a row and cannot judge it**, so the row is judged by a second guard:
`every-phrase-an-entry-offers-is-a-phrase-the-search-reads` compares that declaration against what
`fieldsOf` in `search.ts` actually reads as an alias, and both directions are a real event.

Seen red, at `91b7314` plus this change, by marking the new field `null` in the declaration — the
silent shrink itself:

```
 ❯ search.test.ts (14 tests | 1 failed)
     × every-phrase-an-entry-offers-is-a-phrase-the-search-reads
+   "typescript/number/parse@1: \"string to integer\" is read and this trial does not sweep it",
 Tests  1 failed | 411 passed (412)
```

**The alias trial stayed green through it**, which is the finding rather than the repair: 411 of 412
passed while the guard whose whole subject is the aliases lost one and reported nothing.

The other direction, by stopping `fieldsOf` from reading the field, reddens three:
`every-declared-alias-finds-its-own-contract-first`,
`every-phrase-an-entry-offers-is-a-phrase-the-search-reads`, and the corpus on all eight rows.

### What was measured

- **The eight forms.** 0 of 8 answered before, 8 of 8 after, all first. They are in the corpus, so
  the claim is a guard rather than a reading somebody took.
- **The six contract digests, before and after, identical to the byte.**

  ```
  typescript/number/parse@1        d5071a580382120a9e7f72eb998a2958df5c1c50d3629c5775d2e5528635410a
  typescript/date/add@1            94c5acc700678b60dd2565e8c68bec4172dfbd482371f489b3c89ac279795e47
  typescript/array/group-by@1      1dd17492e2e8764947dfb73a4bba2346c4a5f01296045763cea55289b6817bbd
  typescript/string/levenshtein@1  e231dc9d9434f9a6907e10ed001dbf1d034ac5560a01af30ac1d95ab1d1f21a9
  typescript/string/slugify@1      855107daf43419d2ca8f2f01e1a8e39b5de127974c287b75867fa5bdf1443ce1
  typescript/number/round@1        7418dfc5de093b77643d5be7852083c24fbf7fb3ab0f89056b6a0983ad97bc12
  ```

  `npm run freeze` is green beside them, which is the stronger statement: it rebuilds each binding at
  the commit it records rather than comparing this tree with itself.
- **`contract-index` goes 3 550 → 3 586 canonical bytes**, +36 for one term on one contract. The
  index carries the phrase and never the two sentences beside it; those travel in `contract-binding`,
  which is one contract rather than all of them.
- **The catalogue's declared words go 91 → 92**, and `integer` is declared by one contract, so it
  tells the contracts apart. `string`, `to` and the rest are unmoved.

### What is deliberately not done

**The other four instances of the closed entry are not repaired.** `typo tolerance`,
`spelling suggestion`, `date maths` and `validate a numeric input` are the phrases ADR-0136 measured
as answering nothing, and every one of them is now *reachable*. They are left, because each needs an
alias review of its own and one of them probably fails it: somebody typing `spelling suggestion`
would be handed an edit-distance function, which is the shape of `remove accents from string` on
`string/slugify@1` — the liar ADR-0023 removed. Making four judgements under the cover of a mechanism
decision is what this repository refuses elsewhere, and the entry stays open with its instances
reachable rather than closed.

**A learned term does not reach the contract page.** `identity.searchAliases` does not either: an
alias is retrieval and not matter a reader is owed, and putting one on the page would be the first
time this site published a retrieval detail as reader-facing prose. It is public — `contract-binding`
carries every term with both sentences — so an auditor can read the argument without a reader having
to.

## What would reopen this

- **A revision arrives.** If the registry ever binds a second contract digest under one address —
  ADR-0023's word, priced there and unbuilt — then `identity.searchAliases` becomes correctable and
  this field's population stops growing. It does not become removable: what is already learned is
  served, and moving a phrase into `identity` would move a digest. So a revision makes this the
  *older* of two doors rather than the only one.
- **The review acquires an occasion.** If a mechanism ever marks the moment a learned term enters —
  the validation stage reading this repository's own strings is the one three entries of `CLAUDE.md`
  already name — the convention above becomes a guard and the first cost of this record is paid.
- **A term is measured to be wrong.** Nothing here reviews a phrase against what its contract does,
  and the day one of these is found naming something its contract refuses, the count of how many were
  written and how many were wrong is the reading that decides whether three fields were enough.

## More Information

- ADR-0023 decides that an alias is not frozen with the major, and is the record this one makes true
  for a published contract — by a second field rather than by unfreezing the first.
- ADR-0035 prescribes the repair this record makes available.
- ADR-0128 refuses the third standing field, and its test — content, not genus — is the one applied
  here.
- ADR-0150 put a re-examination in the standing on the argument this record generalises.
- ADR-0152 closed the class of guard that cannot see its own population shrink, three days before the
  change that would have opened it again.
- ADR-0154 measured what a query reaches across six publications, which is the reading that reverses
  the argument for freezing this.
