---
status: accepted
date: 2026-09-05
governs:
  - packages/registry/value.ts
  - packages/site/literal.ts
  - CLAUDE.md
confirmed-by:
  - battery: registry-storage
    guard: a-temporal-carrier-is-encoded-as-itself
  - battery: registry-storage
    guard: a-temporal-carrier-survives-the-wire
  - battery: registry-storage
    guard: a-temporal-carrier-is-seen-by-the-walk
---

# The first price is paid, and the arm nobody listed is where the work was

## Context and Problem Statement

ADR-0218 prices three repairs for an eighth contract. Item 1 is *`value.ts` gains a kind for a carrier
whose state is internal, with `decode` and `literal`*; ADR-0223 sized it at five sites, two of which the
compiler names; ADR-0231 measured that adding one moves no published digest. **The owner ruled that the
three prices bind before the contract, so they are paid now** and the runtime question is deferred to
the day the contract itself is written.

**And ADR-0218:181 said none of it could be exercised**: *none of the above can be exercised on the
matrix this repository runs*. The owner's reading was that this is true of the **value** and not of the
**arm** — a string tag exists without `Temporal` existing — and asked for it to be measured by writing
it rather than asserted.

## Decision Drivers

* **The guard comes before the arm, and is seen red for the right reason.** A red because the double is
  malformed proves nothing; the message has to say the kind is missing.
* **The three sites the compiler is silent about are the work.** ADR-0223 measured that a kind added by
  following the compiler alone decodes to `undefined` and is invisible to the walk, with every page
  still rendering.
* **Item 2 is a different unit.** ADR-0218 separates *`value.ts` gains a kind … with `decode` and
  `literal`* from *`literal.ts` gains its spelling*, and the line between them decides what `literal`
  gets here.

## Considered Options

* **Wait for a runtime carrying `Temporal`.** Refused by the owner: the prices bind before the contract.
* **Add the kind and test it against the catalogue's own records.** Refused: no record holds a carrier,
  so the guards would be vacuous.
* **A double matching a carrier on every property the encoder reads.** Retained, with its limit
  declared in the code and here.

## Decision Outcome

### The red, and its message

Five guards were written first. On the tree at `d1983b3` they fail, **5 failed | 34 passed**, and the
message is not *instance where temporal was expected*:

> `UnencodableValue: probe holds a Temporal.PlainTime, which the registry does not model. Encoding it as
> anything else would publish a value the contract does not declare; extend packages/registry/value.ts
> deliberately instead.`

**So the double is well formed — the encoder recognises it as a carrier and refuses it by name.** The
red is the missing kind and nothing else.

### And that message corrects ADR-0218

That record says a carrier *encodes to `{"kind":"instance","className":"…","fields":[]}`*. **It does
not.** `unmodelled` returns `a ${tag}` for any tag that is not `Object`, and a carrier's tag is
`Temporal.PlainTime`, so `encodeAt` **throws** before reaching the instance arm. A contract carrying one
could not be serialised at all — which is a sharper statement of the same price and is why the record's
own item 1 is right for a reason it did not give.

### The double, and what it is measured against

Measured on Chrome 152 against `PlainTime`, `PlainYearMonth` and `Duration`:

| what the encoder reads | a real carrier | the double |
| --- | --- | --- |
| `Object.prototype.toString` | `[object Temporal.<name>]` | same, tag on the prototype |
| own properties | **none**, on all three | none |
| `String(value)` | the ISO form | the ISO form |
| prototype | not `Object.prototype` | not `Object.prototype` |

The double sits on a prototype rather than carrying its two members itself **because a carrier's
`Object.keys` is empty** — one with own fields would be encoded down a different arm and would prove
nothing about this one.

### The sites, and there are more than five

| site | who names it | what it costs |
| --- | --- | --- |
| `EncodedValue` | the author | the arm |
| **`unmodelled`** | **nobody** | one line, without which the arm below never runs |
| `encodeAt` | silent | the arm |
| `everyValueIn` | silent | one case |
| `decode` | silent | one case |
| `literal.ts` | **compiler**, `TS2366` at 209 | one case |
| `read-literal.test.ts` | **compiler**, `TS2741` at 314 | one sample |
| **`read-literal.ts`** | **a guard** | see below |

**The compiler named exactly the two ADR-0223 measured, at the same two line numbers.** What that record
did not name is `unmodelled`, and it is the one that decides whether any of the rest runs: the refusal
fires at line 567 and the `Date` arm is at 638, so **an arm placed by the `Date` precedent alone is
dead**. ADR-0231's throwaway arm was placed exactly there — its measurement stands, because an arm that
never runs also changes no digest, but its *placement* was wrong and only writing the guard found it.

`value.ts`'s own comment had said so all along — *the two lists are one list read twice* — which is a
declaration doing its job for a reader who arrives at it, and saying nothing to one who does not.

### The site ADR-0223 measured as free, and it is not

That record says *`hasASpelling` and `read-literal.ts` cost nothing, both being derived from
`WITHOUT_A_SPELLING` rather than listing the kinds again*. **Derived, and not free.** With the kind
spelled as `Temporal.PlainTime.from('12:30:00')`,
`every-arm-of-an-encoded-value-is-read-back-or-refused-by-name` reddens:

> `UnreadableLiteral: \`Temporal.PlainTime.from('12:30:00')\` cannot be read as a value: \`Temporal.Pla\`
> begins no value this reader knows, at character 1.`

**The guard's own name gives the two ways out** — read back, or refused by name — and ADR-0218's split
picks the second: its item 1 gives `literal` an arm, its item 2 gives it *the spelling*. So `temporal`
joins `WITHOUT_A_SPELLING` as `<a carrier `, the case table prints `<a carrier Temporal.PlainTime,
12:30:00>`, and the reader refuses it by the same declaration that refuses the other three. **A spelling
that cannot be read back would be a lie a reader could paste**, which is the argument the brackets
already exist for.

### What was paid, and what it cost

`packages/registry/value.ts` — the kind on `EncodedValue`, `temporalCarrierOf` beside `tagOf`, its line
in `unmodelled`, the arm in `encodeAt`, a case in `everyValueIn`, a case in `decode`.
`packages/site/literal.ts` — the entry in `WITHOUT_A_SPELLING` and the arm that prints it.
`packages/site/read-literal.test.ts` — the sample.
`packages/registry/round-trip.test.ts` — five guards.
`mutation/census.ts` — that file's row, **34 → 39**.
`mutation/registry-storage.battery.ts` — **`E-27`**, which removes the arm while leaving the kind
declared, so nothing throws and nothing fails to compile and the carrier falls through to the record
arm. It reddens the five together, which is the claim it makes: **the three silent sites are one arm's
worth of work**.

### The readings

| | |
| --- | --- |
| ledger | `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11` — **the reference** |
| `pnpm freeze` | 3 passed, either side |
| `packages/registry` | 472 passed | 
| `packages/site` | 187 passed |
| `packages/cli` | 196 passed |
| `packaging` | 24 passed |
| `tsc -p tsconfig.json` | clean |
| `pnpm anchors` | 934 anchors, none loose |

**The ledger not moving is ADR-0231's condition holding**: the arm intercepts nothing already encoded,
because no value in this catalogue carries a `Temporal.` tag.

## Consequences

**Item 1 of ADR-0218 is paid.** A Temporal carrier is encodable, decodable and walked, and a contract
declaring one can be serialised — which before this it could not be at all, `unmodelled` refusing it by
name.

**ADR-0218 is corrected on how it failed**: not an instance holding nothing, but a refusal.
**ADR-0223 is corrected on two counts**: `unmodelled` is a site it does not name and is the one that
makes the others run, and `read-literal.ts` is not free. **ADR-0231's arm was in the wrong place**, which
its own measurement could not see.

**Item 2 is untouched and is now sharper**: the spelling is what would take `temporal` out of
`WITHOUT_A_SPELLING`, and until it does, a case table names the carrier rather than building it.

**No digest moved**, nothing under `contracts/` was touched, no contract is written, `engines`,
`suites.yml` and the contributor floor are unchanged, and `THE_PACKAGE_VERSION` stays at `1.2.0`.

## What would reopen this

* **A runtime carrying `Temporal` on the matrix.** The five guards are rewritten against real carriers,
  the double is deleted, and `decode` reaches for the namespace instead of rebuilding a surface. **That
  is the whole of what the double does not prove**: that a real carrier presents the tag, and that
  `Temporal.<name>.from(rendered)` returns the value. Both were measured on Chrome 152 — lossless on
  three carriers of three — and neither is exercised by anything that runs here.
* **Item 2 being paid**, which removes the `WITHOUT_A_SPELLING` entry and makes `read-literal.ts` learn
  the form.
* **A carrier whose ISO rendering is not what `from` reads back.** The pair is lossless on the three
  retained; a fourth entering the arity would need its own reading.
* **A value in this catalogue gaining a `Temporal.` tag**, which would put the arm on the path of a
  published digest and make ADR-0231's condition bite.

## More Information

### Coordinates

Measured on **2026-09-05** against the tree at `d1983b3`, node v24.15.0, Windows. The carrier readings
are Chrome **152.0.7977.77** headless, the build ADR-0216 and ADR-0223 used, with the draft guard
passing. The red was taken before the arm existed; the green after it.

### Why `confirmed-by` names three addresses and the cell names five

**The two vocabularies are different and neither is wrong.** `guardsCollectedIn` reads a guard's
*written* title, so an `it.each` of three rows is collected once, as
`a-temporal-carrier-is-encoded-as-itself` with the interpolation taken off — which is the open list's
own entry about a per-contract decision having no citable guard, met here on a per-carrier one. The
battery reads a real run's `failedGuards`, which carry the executed titles, so `E-27` names the three
rows. Citing the rows here fails
`every-guard-a-decision-names-is-one-its-suite-collects`; naming the family in the battery would fail
the pin.

**And `E-27` reddens the five together.** There is no cell aimed at one of them alone, stated rather
than left to a census reading: the arm is one edit and the three silent sites fall with it, so *alone*
is not reachable for any of them by a plausible mutant.
