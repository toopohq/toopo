---
status: accepted
date: 2026-09-05
governs:
  - packages/site/playground.ts
  - mutation/site.battery.ts
  - CLAUDE.md
confirmed-by:
  - battery: site
    guard: a-carrier-declared-as-a-bounded-type-parameter-gets-a-form-read-as-a-literal
  - battery: site
    guard: a-type-parameter-the-signature-does-not-bind-to-the-carriers-is-refused-by-name
  - battery: site
    guard: every-field-a-form-reads-as-a-literal-is-named-on-its-page-with-the-reason-it-is-one
---

# The third price is paid, and the key is a name rather than a type

> **`three false counts` is four claims of which three are false, and the one this record repeats from
> ADR-0235 misses the sharpest.** That header's paragraph also reads *two `build`s that are not the
> identity*; measured at `50ff990` and at HEAD, **one build is not the identity at both**, so it was
> false the day it was written where *Four types* was true then and is six now. The Consequence below
> is otherwise unchanged, and the three were repaired — with the reason each refusal to repair them
> lapsed, neither costing nor paying item 3 being what that unit does.
> [ADR-0240](0240-three-compiler-silences-with-three-causes-and-the-costing-that-counted-twice.md).
>
> **And §1's *the site nobody lists is the work* folds three sites into one class that measurement
> separates.** Compiler-silence holds of all three and for three different causes; *named by nobody*
> holds of two, ADR-0232's own table recording that a guard named `read-literal.ts`; and
> *reader-visible* holds of one, `unmodelled` throwing where nothing catches it.

## Context and Problem Statement

ADR-0235 costed ADR-0218's item 3 and split it in two: **3a**, the key, a prerequisite payable today
with no runtime; **3b**, a reader who can press the button, blocked on `Temporal` and never item 3's
price. The owner has ruled the one thing that record left open — the reading is **`a-literal`** — so 3a
is taken here and 3b is not.

**His reason is the measurement and not a preference**, and it is worth carrying because it inverts
which branch looks cheap: `the-text-itself` would have to choose a carrier from text that names none,
which it can do for a string carrying a date **or** a time and never for one carrying both — and every
such string is accepted by `PlainTime` and `PlainYearMonth` alike, which are exactly the two carriers
whose verdicts this contract exists to publish. That cost is permanent and sits on the contract's own
subject. `a-literal`'s cost expires with a runtime that carries `Temporal`.

**What ADR-0235 left unresolved and this record must not leave implicit** is the key. `AS_AN_ARGUMENT`
is indexed by declared type text and `parametersOf` renders a generic carrier as `carrier: T`, so the
key would be `T` — a *variable* name, which means every parameter anybody calls `T`.

## Decision Drivers

* **The red is seen with its message before the green**, which is how items 1 and 2 were paid.
* **A collision is taken or avoided explicitly.** ADR-0235 measured that no cell can redden on a key
  that lies, so leaving the choice implicit would be shipping a silence the instrument cannot reach.
* **The site nobody lists is the work.** `unmodelled` at price 1, the reader at price 2, and
  `spelledFields` here — three units, three compiler-silent sites that reach a reader.

## Considered Options

* **Key `T`, accept the collision as it stands.**
* **Key on something richer than the variable — the bound.**
* **Key `T` and check the meaning where the evidence is.**

## Decision Outcome

### 1. The key is `T`, and the boundary is what decided it

**The third option, and the measurement that chose it is about where the lookup runs.** A richer key
is available at build time: `playgroundOf` holds the `ExportRecord` and its `text`, which carries the
whole signature and therefore the bound. It is **not** available at `declaredBy` and `argumentsOf`,
which take `readonly ParameterRecord[]` — `{name, type}` and nothing else — and are the two the browser
calls. `start.ts` receives those as JSON, so keying on the bound means widening what crosses that
boundary, in a module whose whole subject is that a page carries the reading rather than re-deriving
it.

**So the key is the variable and the meaning is checked where the evidence is.**
`whatAnUnboundCarrierCosts` runs in `playgroundOf`, before any lookup, and refuses a bare type
parameter the export's own signature does not bind to `PlainTime`, `PlainYearMonth` and `Duration`.

**What each branch costs, stated rather than implied.** Accepting the collision as it stands costs the
first future contract declaring `<T>(x: T)` a carrier field in silence, with **no cell able to redden
on it** — `a-parameter-type-the-form-cannot-build-stops-the-site-and-names-itself` is total over a type
the table does *not* hold, so a key that lies is outside its population by construction. Avoiding it by
keying on the bound costs the table its readability twice over: a key that is a union of three names,
and a boundary widened so the browser can compute it. **What is paid instead** is a row whose key a
reader cannot understand alone — mitigated only by the paragraph above it — and one narrow reading of
the signature text, which is not a second parser: it asks whether a name is bound and never what the
parameters are.

### 2. The red, with its message, before the green

Three guards written first. Two red:

    ThePlaygroundCannotBeBuilt: … its parameter `input` is declared `T`, which no field of this
    site knows how to build. Extend AS_AN_ARGUMENT in packages/site/playground.ts deliberately …

is the whole of item 3a, and it is what the first guard met. The second met a refusal for the **wrong
reason** — it threw and named `T`, and never `PlainTime`, because today's refusal is *unknown type*
rather than *unbound carrier*:

    expected [Function] to throw error including 'PlainTime' but got 'the playground for a
    foreign T cannot…'

**The third was born green**, and that is the finding rather than an omission: `spelledFields` has had
no guard of any kind since it was written, so the first thing written for it passes over the literal
fields the catalogue already has. Its event is named — a literal entry whose reason the page fails to
carry — and item 3a is the entry that gives it one.

After the change: **192 of 192**, `tsc` clean.

### 3. `spelledFields`, driven rather than read

The site no list names is treated by building a page for a contract retyped to the carrier shape and
reading what a reader would receive, in all three directions:

| the contract | what the page says |
| --- | --- |
| `number/parse@1` as published | no such sentence — its field is text |
| retyped to `<T extends PlainTime \| PlainYearMonth \| Duration>(carrier: T) => T` | *input is written as a literal instead, exactly the way the examples above are written, because what it takes is a Temporal carrier, which names itself in the spelling because the same string is otherwise taken by more than one of them.* |
| retyped to `<T>(carrier: T) => T` | the page **cannot be built**, and the refusal names the bound |

**The sentence is composed from the entry's own `because`** and is now asserted by a guard total over
the pages, so a literal field that arrives unexplained is a red rather than a silence.

**That guard was written badly and CI is what said so.** Its first version called
`theSite(localSource())` **inside the loop**, rebuilding the whole site and re-reading the registry once
per contract. It passed here and **timed out at 5 854 ms against a 5 000 ms bound on the runner**,
taking `suites-on-windows` and — through a red control at calibration, `control RED (192 tests)` —
`batteries (site)` with it. One cause, two red jobs, and neither of them the code this unit changed.

**It is the defect ADR-0165 measured and repaired one file over**, recommitted here: that record
established `localSource()` at 268 ms against `theSite`'s 9 and took a suite from 3.3 s to 0.16 s by
calling them once. Built once, the site suite goes **5.95 s → 3.13 s**, so this one guard was costing
nearly three seconds of it. **What it cost is a red push and the reading is worth more than the
repair**: a guard whose verdict depends on how fast the machine is has no verdict, and nothing local
could have said so — the same class ADR-0204 met on a load flake, arriving on a guard written by hand
rather than on a bound.

### 4. The cells, one guard apiece where one guard is separable

* **`W-181`** neuters `A_TYPE_PARAMETER` so no declared type is seen as a variable, leaving the entry
  in place: the refusal never fires and a bounded carrier still builds. Pins
  `a-type-parameter-the-signature-does-not-bind-to-the-carriers-is-refused-by-name`.
* **`W-182`** renames the key rather than deleting it, so `noUnusedLocals` does not make it a
  `killed-by-typecheck` measuring the compiler. **It pins two, and that is a property of the pair**:
  the guard that a bounded carrier builds and the guard that an unbound one is refused both need the
  entry to exist, so no single edit to the table separates them — `W-181` is what isolates the second.
* **`W-183`** points `spelledFields` at the fields read as text, so the page tells a reader to type the
  wrong ones differently. Pins
  `every-field-a-form-reads-as-a-literal-is-named-on-its-page-with-the-reason-it-is-one`.

**Three guards, three cells, and the count moves with both halves**: the census goes
`playground.test.ts` 19 → 21 and `pages.test.ts` 26 → 27, and the README 998 → 1 001 and 956 → 959.
That pair is what ADR-0237 measured the absence of, and it is the reason it is stated here rather than
assumed.

### 5. The limit, written where it is read

**The field refuses by name until a runtime carries `Temporal`, and that runtime is what lifts it.**
It is written in the entry's own `spelledBy` comment, where somebody reading the tag test arrives —
`read` refuses the spelling one step earlier on a runtime without `Temporal`, which is ADR-0234's
ruling, so `spelledBy` is unreached there. It is item 3b, it is not this price, and ADR-0235 measured
that the replay reddens on such a contract whether or not this key exists.

## Consequences

* **A contract over the zone-free carriers can now be published**: the build no longer stops at its
  parameter, which ADR-0235 established was a hard prerequisite rather than an editorial choice.
* **The collision is taken and is not silent.** A future `T` bound to anything else is refused at the
  build with a sentence naming the bound it lacks — where before it would have been built as a carrier
  with nothing able to say so.
* **`spelledFields` has a guard**, three units after the class was first named, and a cell aimed at it.
* **`playground.ts` still carries three false counts of its own table's size** — *Four types* at what is
  now six, and two beside it. They are left, as ADR-0235 left them, and this record says so rather than
  repairing them in silence: a count in a costing unit is the thing that unit exists to measure, and a
  count corrected inside the unit that changes what it counts is a correction nobody can check.
* **Item 3b is untouched**, and no contract is written. Whether this catalogue publishes an eighth is
  unchanged and is the owner's.

## What would reopen this

* **A runtime carrying `Temporal` on the matrix.** `spelledBy` becomes reachable, the reader stops
  refusing, and the limit written in the entry is lifted — which is item 3b arriving rather than this
  decision failing.
* **A second contract declaring a bare type parameter.** The bound check admits exactly the three
  carriers ADR-0225 settled; a contract generic over something else is refused, correctly, and would
  reopen whether the key should be the variable at all.
* **A parameter type that is a type variable this pattern does not match.** `A_TYPE_PARAMETER` is
  `^[A-Z][0-9]?$`, which is `T`, `K`, `T1`; a contract naming one `TCarrier` would be keyed as an
  ordinary type and would slip past the check into the *unknown type* refusal — a worse message for the
  same fault, and the reason that pattern is stated in one place.
* **The boundary moving.** If `declaredBy` and `argumentsOf` ever receive the export rather than the
  parameters, the argument in §1 falls and keying on the bound becomes available without widening
  anything.

## More Information

* ADR-0218 prices the three repairs; ADR-0232 and ADR-0234 pay items 1 and 2; ADR-0235 costs item 3 and
  splits it; ADR-0236 measured the ambiguity that decided the owner's branch.
* ADR-0225 settled the arity at three, which is what the bound names; ADR-0217 is where the polymorphic
  form survived and the generic became necessary.
* ADR-0237 is why the census and the README are moved in the same commit as the guards.
