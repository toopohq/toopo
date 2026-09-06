---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# The third price is two prices counted as one, and only one of them is a prerequisite

> **The count of false counts is short by one, and the one it misses is the sharper of the two
> failures.** This record names three claims in `playground.ts`'s header — *Four types*, *what two of
> the four spell*, *the two types reading it* — and the same paragraph carries a fourth: *two `build`s
> that are not the identity*. Measured at `50ff990`, the commit that wrote it, **one build is not the
> identity and one has been ever since**, so that clause was false the day it was written and has never
> moved, where *Four types* was true there and drifted. **Two failures of two different kinds in one
> sentence**, which is what this list separates as rules 1 to 2 against rule 3. The three named here are
> correct as far as they go and the classification of the header as a different class stands; what is
> corrected is *three*. The three false counts are repaired and the fourth claim of that paragraph —
> `number` as the fourth type the sixth contract declared — was read and holds.
> [ADR-0240](0240-three-compiler-silences-with-three-causes-and-the-costing-that-counted-twice.md).
>
> **And the site table of §3 is the one costing of the four that its payer does not correct**, which
> that record reads as the method rather than as luck: counting the sites twice is what found
> `spelledFields`, and the three costings that counted once were each corrected by the unit that paid.

## Context and Problem Statement

ADR-0218 prices three repairs for an eighth contract. Items 1 and 2 are paid — ADR-0232 gave `value.ts`
the `temporal` kind, ADR-0234 gave `literal.ts` the spelling and `read-literal.ts` a reader that refuses
loudly by name. **Item 3 is the last, and this unit costs it without taking it.**

Four things had to be established, and each was stated before it was measured:

1. what the playground can do today and what it lacks, with the `T` collision **measured rather than
   recalled** — on what exactly, and what happens if it is ignored;
2. the site count, as at price #1, **and especially the site the compiler does not name** — a lesson paid
   twice already, `unmodelled` at price #1 and the reader at price #2;
3. what is exercisable today and what is not — where item 3 runs into the runtime, if it does;
4. **whether item 3 is a prerequisite for the contract or only for the playground.** If a three-arity
   contract is publishable with a playground that refuses to open its cases, item 3 is a deferrable
   price and not a prerequisite, and that would be the finding.

**Nothing is repaired here.** No key is added, `packages/site/playground.ts` is not edited, no contract is
written, nothing under `contracts/` moves, and the ledger reads
`18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11` on both sides.

## Decision Drivers

* **A collision recalled is not a collision measured.** The claim in front of this unit was that the key
  would be `T` and that `T` collides. On what, and with what consequence, are two different questions and
  neither is answered by the sentence.
* **The count that matters is of the sites nothing names.** Price #1 cost five sites of which the compiler
  named two; the three it did not name were where the work was, and one of them — `unmodelled` — was the
  arm that decided whether the kind was reachable at all. Price #2 repeated it with `read-literal.ts`.
* **A design is not wanted.** The owner ruled it out in as many words: the cost and the shape of the
  problem, not a solution drawn. So the reading below says what a reading has to choose between and never
  which choice to make.

## Considered Options

Not applicable: this unit takes no decision about the interface. What it decides is the **classification**
of item 3 — prerequisite or deferrable — and that is settled by measurement rather than chosen.

## Decision Outcome

### 1. What the table holds, and what the catalogue declares

`AS_AN_ARGUMENT` is at `packages/site/playground.ts:165`, declared `Readonly<Record<string, Argument>>` and
**keyed by declared type text**. It holds **five** entries — `string`, `Duration`, `Date`, `number`,
`unknown` — where its own header at line 141 says *Four types*. The fifth arrived with
`object/deep-equal@1` and the header did not move.

What the catalogue declares, read off `serialiseContract` over `theCatalogue`, is **seven distinct
parameter types** across every export of every contract:

| declared type | occurrences | where |
| --- | --- | --- |
| `string` | 5 | `parseNumber`, `describeParseFailure`, `levenshtein` ×2, `slugify` |
| `number` | 4 | `round` ×2, `describeRoundFailure` ×2 |
| `Date` | 2 | `addToDate`, `describeAddFailure` |
| `Duration` | 2 | `addToDate`, `describeAddFailure` |
| `unknown` | 2 | `deepEqual` ×2 |
| `readonly T[]` | 1 | `groupBy` |
| `(item: T, index: number) => K` | 1 | `groupBy` |

**`T` is not among them.** The two the table does not model are `array/group-by@1`'s, and that contract is
refused, so it has no page and no playground — which is why five keys serve six installable contracts
exactly.

### 2. The collision, measured

**It is not a collision with an existing key**, and that is the first thing the reading corrects: nothing in
this catalogue declares a bare `T`, so `AS_AN_ARGUMENT['T']` would land on an empty slot.

**It is a collision between a global key and a per-signature name**, and `parametersOf` is what makes it
unavoidable. Measured over the forms an eighth contract could take:

| signature | `parametersOf` |
| --- | --- |
| `<T extends PlainDate \| PlainTime \| PlainYearMonth \| Duration>(carrier: T, duration: Duration) => T` | `carrier: T`, `duration: Duration` |
| `<T extends PlainDate \| PlainTime \| PlainYearMonth>(carrier: T, duration: Duration) => T` | `carrier: T`, `duration: Duration` |
| `<T>(carrier: T, duration: Duration) => T` | `carrier: T`, `duration: Duration` |
| `<T extends () => void>(run: T) => void` | `run: T` |

**The four-carrier bound, the three-carrier bound and no bound at all render identically.** So the key
carries nothing that could tell one contract's `T` from another's — and the information is not missing from
the snapshot, it is dropped by the key: `ExportRecord.text` transcribes the whole signature and
`ExportRecord.parameters` is *read off it*, so the bound is one field away and the table cannot see it.

**What happens if it is ignored has a witness that exists today, and it is silent.** The mechanism is key-text
equality with no owner, and a key that already exists demonstrates it. Retyping `number/parse@1`'s `input`
to `Duration` and calling `playgroundOf`:

    BUILDS   input: Duration read as a-literal

`date/add@1`'s entry is used for `number/parse@1`'s parameter, no refusal fires, and the page renders. The
control is `number`, which **refuses** — but for the reading's reason and not the lookup's: *the case it
opens on writes a string there, which this type has no spelling for*. So the lookup itself refuses nothing;
what refuses is whether the chosen reading has an opinion about the opening value, and `a-literal` has
none — `unknown`'s `spelledBy` is `() => true` **by declaration**, in a comment that says its message is
unreachable.

**The one guard over the table is green through all of it.**
`a-parameter-type-the-form-cannot-build-stops-the-site-and-names-itself` retypes every export to
`Comparator` and asserts the refusal; it is total over *a type the table does not hold* and blind to *a key
the table holds meaning the wrong thing*. `W-37` is its cell and makes the lookup fall back to `string` —
which is the same defect the collision produces, arriving from the other side and pinned. **A key added
deliberately is `W-37` made permanent for every future contract whose parameter happens to spell it, and no
cell can redden on it.**

### 3. The sites, and the two nobody lists

**The rule, stated before the count**: a site is a place that has to be read or written for one key to be
added honestly. It is counted twice, because the two counts answer different questions and price #1's rule
answers only the first.

**By ADR-0223's rule — places whose text has to change — the count is two.**

* `AS_AN_ARGUMENT` itself, at `playground.ts:165`.
* The file's own header, at lines 99, 141 and 158, whose three counts of the table's size are already
  false at five and would be false by two at six.

**The compiler names one of them and it is inside the change.** `Argument` requires `readAs`, `build` and
`note`, and `Reading` is a discriminated union whose arms have no optional member, so an entry that has not
chosen a reading does not compile — which is the ADR-0054 shape the header claims and which holds. **It
names no site anywhere else, and the reason is the type**: `Readonly<Record<string, Argument>>` is an index
signature where `EncodedValue` is a union, so where price #1's new member made `literal.ts` and
`read-literal.test.ts`'s `EVERY_ARM` fail to compile, a new key here changes no type at all. **The
hand-written refusal at `playground.ts:451`–`457` is the evidence rather than the reading**: a union would
not need one.

**By behaviour the count is five, and all five are silent.**

| site | what a new entry does there |
| --- | --- |
| `theTextFor`, `playground.ts:481` | decides whether the opening case loads; a wrong reading throws about the *case*, not about the type |
| `declaredBy`, `playground.ts:584` | the literal path calls `read` — price #2's reader — and the text path calls `declares` |
| `argumentsOf` → `build`, `playground.ts:602` | constructs the argument the contract is called with |
| `spelledFields`, `contract-page.ts:118` | composes a sentence a reader meets, out of the entry's own `because` |
| `start.ts:690` | the browser calls `declaredBy` then `argumentsOf` on every press |

**The site no list names is `spelledFields`**, and it is the direct analogue of `unmodelled` at price #1 and
of the reader at price #2: compiler-silent, reader-visible, and named neither by ADR-0218's *Where this
looked* — which names `AS_AN_ARGUMENT`, `whatKeepsARowFromTheForm` and `field-map.ts` — nor by any guard.
Measured over the seven pages the tree writes, it speaks on two:

    typescript/date/add@1        duration is written as a literal instead, exactly the way the examples
                                above are written, because what it takes is an object with named fields,
                                which a line of text cannot spell.
    typescript/object/deep-equal@1  left and right are written as a literal instead, … because what it
                                takes is any value at all, which is what this contract compares.

A key read as a literal writes a third such sentence onto the eighth contract's page. **Nothing in this
repository reads that sentence against anything.**

**The second unlisted site is the header's own arithmetic**, which is a different class: not a place the
addition touches but a place it falsifies further. Line 141 reads *Four types* where there are five; line
158 reads *what two of the four spell*, where the two is right and the four is not; line 99 reads *the two
types reading it* where three carry the `the-text-itself` reading. In all three the argument survives the
count's removal, which is this repository's own rule for what to do with them — **and they are recorded
rather than repaired, because this unit was forbidden that file and because a correction landing inside a
costing makes the costing unreadable.**

**And one site was already moved, by price #1, with nobody costing it.** `playgroundOf` opens on the first
case `whatKeepsARowFromTheForm` admits, and that function refuses a row holding a value with no spelling.
Before ADR-0232 a carrier encoded as `instance`, `instance` is in `WITHOUT_A_SPELLING`, so **every** carrier
row was refused and `playgroundOf` would have thrown *the contract settles no case a form can hold* before
ever reaching the type. Measured today: `hasASpelling` answers `true` for
`{"kind":"temporal","typeName":"Temporal.PlainDate","rendered":"2026-01-15"}`. So one of item 3's two
build-time refusals was removed by item 1, and neither record said so.

### 4. Where it runs into the runtime

**At build time it runs into nothing, and that is measured rather than read off the branch.** Building
`number/parse@1`'s playground retyped two ways:

| retyped | reading | the field opens on |
| --- | --- | --- |
| `string` | `the-text-itself` | `42` |
| `unknown` | `a-literal` | `'42'` |

The literal field holds the **written literal, quotes and all**, where the text field holds the decoded
value — which is what says `read` was not called. And `decode` rebuilds a carrier's surface through
`Object.create` without Temporal, which is ADR-0232's declared limit doing real work. **So item 3's
build-time half is runtime-independent, and price #2's carrier refusal cannot reach it.**

**At reader time and at replay time it runs into it, on every runtime the matrix carries.** On node v24.15.0, where
`Temporal` is `undefined`:

    read("Temporal.PlainDate.from('2026-01-15')")
      UnreadableLiteral: `Temporal.PlainDate.from(…)` names a carrier this runtime cannot build:
      `Temporal` is not defined here, so there is nothing to hand the value "2026-01-15" to

That is ADR-0234's ruling firing exactly as it was written to. `start.ts:690` and
`playground.test.ts:131` both take that path.

**And it is not item 3's red.** A stripped reference naming `Temporal` **imports fine** and throws
`ReferenceError: Temporal is not defined` when called, so
`every-case-replays-through-the-stripped-artefact-a-browser-runs` reddens on an eighth contract whether or
not the key exists. The playground's refusal fires one line earlier in `replayed` and is the same red. **Item
3 does not add a runtime dependency the contract did not already have**, which is ADR-0220's contributor
floor and not this price.

### 5. Prerequisite, and the reason is two lines

**Measured at the call site rather than deduced from it.** `contract-page.ts:180` is
`const playground = playgroundOf(contract, name)` with no `try`, and `site.ts:78` maps
`contractPage(one, domain, menu)` over every held contract. Calling `contractPage` on a `Held` whose contract
is retyped:

| retyped | `contractPage` |
| --- | --- |
| — (control) | builds |
| `T` | throws `ThePlaygroundCannotBeBuilt`: *its parameter `input` is declared `T`, which no field of this site knows how to build* |
| `Comparator` | throws, identically |

Nothing between `playgroundOf` and `theSite` catches it — swept, there is no `try` in `site.ts`,
`contract-page.ts` or `playground.ts`. The control is that `theSite` writes **7 pages** unperturbed.

**So the answer to question 4 is prerequisite, and the hoped-for finding does not hold.** There is no state
in which a three-arity contract publishes with a playground that refuses to open its cases, because **both**
ways a playground can refuse are build-time throws out of the same un-`try`ed call: an unmodelled type at
`playground.ts:453`, and *the contract settles no case a form can hold* at `playground.ts:369`. A contract
whose page cannot be built stops the whole emission, so the `site` job is red, so `publish` — which declares
`needs: site` — never runs.

**What is the finding is that item 3 is two prices that have been counted as one.**

* **Item 3a — the key, so the build does not fail.** A prerequisite, and **payable today**: two places to
  write, five silent sites to get right, no runtime needed. The compiler names nothing outside the entry.
* **Item 3b — a reader who can press the button, and a replay that runs.** Blocked on `Temporal` existing,
  and **not item 3's price at all**: the contract's own `reference.ts` names the same global, so the replay
  is red on the eighth contract before the playground is reached.

ADR-0218 priced them as one thing and so did every record since. Separated, **the prerequisite is smaller
than the entry says and the blocked half was never item 3's**.

## Consequences

* The eighth contract cannot be published before item 3a is paid, and no amount of willingness to ship a
  page without a playground changes that — the refusal is mechanical and upstream of any editorial choice.
* **Item 3a can be paid before the contract is written**, unlike items 1 and 2, which had to wait for a
  kind and a spelling. Nothing about it needs the contract to exist except the decision of which reading a
  carrier takes, and that decision is the owner's.
* **A key added is a refusal given up.** `theArgumentFor`'s refusal is the only thing standing between a
  future contract's bare `T` and a wrong `Argument` used in silence, and no guard here can replace it: the
  guard that exists is over types the table does not hold.
* Three counts in `playground.ts`'s own prose are false today and nothing reads them. They are recorded and
  not repaired, and this record is where somebody arriving at that file finds out.
* **The `contract-page.ts` sentence is the second time in three units that the unlisted site was the one a
  reader receives.** `unmodelled` decided whether the kind was reachable, `read-literal.ts` decided whether
  a reader could type it back, and `spelledFields` decides what a reader is told about the field. All three
  were compiler-silent; all three were found by sweeping wider than the announcement.

## What would reopen this

* **A runtime carrying `Temporal` on the matrix.** Item 3b stops being blocked, the replay stops being red
  for the reference's reason, and the two prices this record separates become one again — at which point
  the separation is history rather than a plan. ADR-0220 is the decision that would do it.
* **A `try` around `playgroundOf` in `contract-page.ts`.** That is the one edit that would make item 3
  deferrable, and it would publish a contract page silently lacking the one thing on it a reader can try —
  which ADR-0218 refuses in as many words. If that refusal is ever overruled, question 4 is answered the
  other way and this record's classification falls.
* **A parameter type this catalogue declares that is not a type name.** The reading above rests on
  `parametersOf` rendering a type parameter as its bare name; a contract declaring an inline object type or
  a tuple would key the table on text nobody would recognise as a key, and the collision would stop being
  about `T`.
* **A second `a-literal` entry spelled the way `Duration`'s is.** `W-38`'s anchor is the single line
  `spelledBy: (declared) => typeof declared === 'object' && …`, unique in the file today; a second identical
  line makes it ambiguous and `npm run anchors` says so. It is named here so the cell is moved deliberately
  rather than discovered.

## More Information

* ADR-0218 opens the entry and prices the three repairs; ADR-0219 measures that there is no cheap way round
  item 1; ADR-0223 and ADR-0224 settle the arity at four and size item 1 at one kind and five sites.
* ADR-0231 measures that a new kind moves no published digest; ADR-0232 pays item 1; ADR-0233 establishes
  that a stand-in is faithful on the axis that decides; ADR-0234 pays item 2 under the ruling that a reader
  refuses loudly, by name.
* ADR-0220 is the contributor-floor question item 3b is blocked on, and ADR-0217 is where the polymorphic
  shape survived and no contract was written.
* The probes are `params.mjs`, `collision.mjs`, `runtime.mjs`, `prerequisite.mjs`, `where-it-buts.mjs` and
  `the-sentence.mjs`, run at `12c9fee` on node v24.15.0. They are outside the tree, as rule 5 requires of a
  reading that is not a guard.
