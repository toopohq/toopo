---
status: accepted
date: 2026-09-04
governs:
  - CLAUDE.md
confirmed-by: []
---

# The format carries a generic, and what refuses the retained form is not the generic

> **This record writes no contract and moves no digest.** It asks one question of the machinery —
> whether the registry can carry a generic signature — and answers it by measurement at `7c1cf96`.
> The ledger is byte-identical across it, `18cc4e82…` before and after, and `npm run freeze` is green
> on three guards either side.

## Context and Problem Statement

ADR-0216 left the fourth search with a candidate whose *unit* was unsettled, and ADR-0217 narrowed the
three shapes to one: a polymorphic `add` over the zone-free carriers, whose return type follows its
argument. Before a line of that contract is written, the format has to be shown to carry it. A
contract published on a shape the machinery cannot serve is a contract frozen for the life of its
major on a defect nobody can repair.

The reading that opened this unit was that **the catalogue has never published a generic signature**,
taken from the nine `text:` declarations of `the-catalogue.ts`, all of them concrete, with
`object/deep-equal@1`'s `(left: unknown, right: unknown)` the widest.

**That reading is a grep artefact, and correcting it is what made the rest of the unit cheap.** There
are **ten** export texts and not nine, and the tenth is generic: `array/group-by@1` declares

    <T, K>(
      items: readonly T[],
      keyOf: (item: T, index: number) => K,
    ) => Map<K, T[]>

as a template literal over four lines, which a sweep for `text: '` cannot see. So the question was
never *can the format carry a generic* — it was *how far does the one it already carries get*, which
is a question with an artefact behind it rather than a prediction.

## Decision Drivers

* Permanent rule 6. Whatever the format cannot carry on the day a contract is published, it cannot be
  taught afterwards for that major.
* The three outcomes were named in advance: it carries; it does not and the repair is small; it does
  not and the repair touches `contractSnapshot`, which stops the unit.
* Measurement rather than reading. A format that *should* carry a generic is what this repository
  refuses.

## Decision Outcome

**The format carries a generic, on all four pieces, and the retained form is refused for a reason
that has nothing to do with the generic.** The outcome is the second of the three, the repair is
named below, it is not taken, and it does not touch `contractSnapshot`.

### The frozen `exports` field

`serialiseContract` carries the type parameter list byte for byte — `text` on the served record is
identical to the source declaration. `parametersOf` reads it: `signature.ts` already holds
`afterTypeParameters`, which counts angle brackets and skips `=>`, and it returns

    [{ name: 'items', type: 'readonly T[]' },
     { name: 'keyOf', type: '(item: T, index: number) => K' }]

`field-map.ts` classes `surface.exports[].text` `executable`, and the guard behind that classification
is `every-declared-type-occurs-in-the-contract-%s`, which requires `contract.ts` to hold
`export type ${typeName} = ${text}` flattened. For a generic that is a **generic function type alias**,
which is legal TypeScript and which `contracts/typescript/array/group-by/contract.ts:165` writes today.

`contractSnapshot` takes the whole surface, so the type parameters are inside the digest — and they
are load-bearing rather than merely present. Measured: the snapshot is
`caf4e401fbf5b55c090bcb4531b06f5c44da635a265878bc098df9d5f82cfa37`, and the same record with the type
parameters replaced by `unknown` hashes to
`c165697aebb3d282e43f387d04e604d561beda8a11893080710a957dfcb63895`. **The freeze covers a type
parameter list**, which is the half that could not have been repaired after publication.

### `signature.test-d.ts`

It is one of `THE_SEVEN_FILES`, so a generic contract carries one by construction, and the question is
what it can assert of a return type that follows its argument. The answer is written and running:
`array/group-by@1`'s type test holds the identity check *and* call-site inference —
`groupBy(USERS, (user) => user.team)` against `Map<string, User[]>` — four instantiations of the key
type, a negative `.not.toEqualTypeOf`, and three `@ts-expect-error` refusals. Its header names the
trap in advance: *a mutant can keep the declared shape while breaking what a caller's
`groupBy(users, (u) => u.team)` produces at the call site*.

It is not decorative and a red says so. `node run-vitest.ts run --typecheck group-by` is 5 files, 97
tests, no type errors. Narrowing one word of `reference.ts:33`, `Map<K, T[]>` to
`Map<K, readonly T[]>`, reddens **six of the eight signature guards** and exits 1. The reference was
restored and the tree is clean.

The battery goes further than the file: `array-group-by.battery.ts` carries a second lens,
`identity-blind`, which removes the identity assertion precisely to measure which signature mutants
the call-site checks catch without it — *the thing nobody in this repository knew before running it*.

### `harnessOf`, `sharedHarnessOf` and `THE_SEVEN_FILES`

They impose nothing on a signature, and that is measured rather than assumed: both take
`(root, folder, files)` — strings and file names — and `sharedHarnessOf` a fourth list of the same
kind. Neither ever receives a record, a surface or a declared type. A generic is invisible to them by
construction. What `THE_SEVEN_FILES` imposes is one file name, `signature.test-d.ts`, and the section
above is what that file can hold.

### The served page

The type parameter list survives the highlighter and the escaper. `highlighted` is total over its
input — the runs rejoin to the source to the byte, on all three shapes tried — and `renderNode`
escapes `<` and `>`, so the page carries

    &lt;T, K&gt;(...) =&gt; Map&lt;K, T[]&gt;

with no raw `<` left, `extends` inked as a keyword, and `toMarkdown` holding the source verbatim. The
control that makes this readable rather than lucky is that the concrete signature `deep-equal@1`
serves today already renders `=&gt;`, so the escaper was never untried — only the angle brackets were.

**What the page has never done is render one**, and that is a fact about the lifecycle rather than
about the renderer: the tree writes 7 pages and `array/group-by@1` has none, because it is
`never-published`. Its snapshot is computed and its blobs are served — `groupBy` occurs in four served
files, a blob, `contract-index`, `refusals` and `date/add@1`'s `contract-binding` — but it has no
binding and no page.

## What actually refuses the retained form

The playground, and **not for being generic**.

`playgroundOf` refuses `array/group-by@1` today, with `the contract settles no case a form can hold` —
which is about its *cases*, every one of which carries a key function. That is a second branch, and
conflating it with the first is what a reading would have done. Driven separately, by substituting
signatures onto `string/slugify@1`'s record:

| declared signature | playground |
| --- | --- |
| `(text: string) => string` | builds, 1 field |
| `<T>(text: string) => T` | **builds, 1 field** |
| `<T extends string>(text: string) => T` | **builds, 1 field** |
| `<T>(text: T) => T` | refused |
| `<T extends A \| B>(carrier: T, duration: Bag) => T \| null` | refused |
| `(carrier: PlainDate, duration: Bag) => PlainDate` | **refused** |

**A type parameter list is invisible to the playground.** What it refuses is a parameter whose
declared type is not a key of `AS_AN_ARGUMENT` — and the last row is the control that settles the
attribution: a **monomorphic** carrier is refused identically, with the same sentence naming the same
parameter. The obstacle is an unmodelled carrier type, and it would meet a contract with no type
parameters at all.

The refusal is by name and it stops the build: `contract-page.ts:180` calls `playgroundOf` with no
`try`, deliberately — *rendering the page without it would publish a contract page that silently lacks
the one thing on it a reader can try*.

### The deeper half, which the pricing has to carry

Behind the field lies the spelling. `value.ts` encodes a class instance by its **own fields**, and a
carrier keeping its state in internal slots has none. Measured on a stand-in:

    encode(carrier)  ->  { "kind": "instance", "className": "InternalState", "fields": [] }
    hasASpelling     ->  false
    literal          ->  "<an instance of InternalState>"

So a case holding such a carrier is kept out of the form by
`whatKeepsARowFromTheForm` — *its carrier argument has no JavaScript spelling* — and the case table
would render `add(<an instance of PlainDate>, { days: 1 })`. That is ADR-0163's defect, which was
found on a contract the catalogue had turned down, arriving on one it would publish.

`Date` escapes it only because `value.ts` models it specially, as `kind: 'instant'`, and spells it
`new Date(0)`. That is the shape a repair would take, and it is why the repair is not one table row.

### The price, named and not paid

Three things, in the order they bind, none of them `contractSnapshot`:

1. **`value.ts` gains a kind for a carrier whose state is internal**, with `decode` and `literal`
   beside it. It is where a value is encoded and not where a snapshot is assembled, so no published
   digest moves — none of the six holds such a value. It is nevertheless the freeze's own machinery,
   and it is Mathis's to rule on rather than mine.
2. **`literal.ts` gains its spelling**, without which the case table publishes a row that says two
   different things are different — the shape ADR-0164 repaired.
3. **`AS_AN_ARGUMENT` gains a field.** This is the one that is not a row: `T` ranges over a union of
   carriers, so a reader must first choose *which*, and the playground has no notion of a field whose
   type is a choice. Sizing that is a unit of its own.

**And a fourth thing is not a repair at all**: `Temporal` is `undefined` on node v24.15.0, this
machine's runtime, so none of the above can be exercised on the matrix this repository runs. ADR-0150
already records that debt and names the day the matrix reaches Node 26.

## The fragility of R5, and what bounds it

ADR-0217 paid R5 by reading what ten packages do, and it did not fire: `luxon@3.7.2` answers
`InvalidUnitError: Invalid unit dayz` where three others drop the key in silence, so the question is
contested. **That reading is a photograph.** Nothing stops `luxon` aligning with Temporal in a later
major, at which point the ecosystem agrees, R5's condition holds, and the ground that admitted the
candidate would have refused it.

The distinction that bounds this was put to me to verify rather than to restate: *R5 decides
admission, not truth — a contract admitted while the ecosystem diverged does not become false when the
ecosystem converges; its admission argument weakens.*

**It holds, and it holds harder than it was stated, because the mechanism has no arm for the other
reading.** `Lifecycle` is a total union of four:

    'not-yet-published' | 'never-published' | 'published' | 'absorbed-by-the-language'

The only post-publication arm is `absorbed-by-the-language`, and its two fields are `answeredBy` and
`measurement` — **the language**. There is no arm for the ecosystem, no `withdrawn`, and no state a
converging ecosystem could move a contract into. A retroactive R5 has nowhere to put anything, and
that is a compiler-held fact rather than an argument.

Even the arm that does exist does not withdraw. `servedRefusals` builds `absorbed` from
`ledger.contracts` and maps each entry through `servedContractBinding`: an absorbed contract **keeps
its binding**. And `lifecycle` is read at `entry.standing.lifecycle` — the standing half, outside the
digest — so a language takeover cannot move an address either.

The live precedent settles it. Temporal arrived under `date/add@1`, and measured off the served
binding at `7c1cf96`: `lifecycle` is `{"state":"published"}`, the index reports `installable: true`,
the digest is `94c5acc7…` and unmoved, and what carries the event is `againstTheLanguage` — a standing
field. **The language moved under a published contract and the contract stayed published**, with an
annotation rather than a withdrawal. Served `absorbed` holds **0** entries.

**One clause of the framing is corrected, and the correction strengthens it.** `array/group-by@1` is
not a contract the language withdrew. It is `never-published` — refused at the door, before any
publication, because `Map.groupBy` shipped first. Its `installable: false` is a contract nobody was
ever given, not one taken back. So the catalogue has never withdrawn anything, and the schema gives it
no way to.

What R5 can therefore lose is a paragraph of a dossier, not an address.

## What would reopen this

* **A shape whose type parameter carries a parenthesis before the value parameters.**
  `signature.ts`'s header names its own limit — `<T extends (x: number) => void>(a: T)` — and refuses
  it by name rather than misreading it. Nothing in the retained form needs one; a later contract
  might, and it would reopen the first section of this record.
* **The playground gaining a field whose type is a choice.** That is the third item of the price above,
  and building it would move the row this record marks refused. It is the one of the three that is not
  sized here.
* **A carrier this catalogue can already spell.** The refusal measured above is about a value with no
  own fields. A retained form expressed over values `value.ts` already models would not meet it, and
  whether the contract can be written that way is the next unit's question, not this one's.
* **A lifecycle arm for the ecosystem.** The R5 verdict rests on the union having none. Adding one —
  for any reason, including a good one — would make a retroactive R5 able to move a contract, and this
  section is where somebody proposing it should arrive first.
* **`luxon` aligning with Temporal.** It would not falsify anything published; by the paragraph above
  it weakens an admission argument. It is written here so the weakening is met as something predicted
  rather than as something discovered.

## More Information

Measured at `7c1cf96` on node v24.15.0, Windows. Every probe was a throwaway outside the tree; the one
edit inside it — narrowing `reference.ts:33` to see the type test red — was reverted by a counter-edit
and `git status --porcelain` is empty either side. `npm run freeze` is green, 3 guards, and
`node packages/registry/print-ledger.ts` is byte-identical across the unit at
`18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11`.

No contract is written, `THE_PACKAGE_VERSION` stays at `1.2.0`, and nothing under `contracts/` moved.
