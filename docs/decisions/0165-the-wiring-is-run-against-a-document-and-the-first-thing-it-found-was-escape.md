---
status: accepted
date: 2026-08-25
decision-makers: Mathis Perron
governs:
  - packages/site/start.ts
  - packages/site/vitest.config.ts
  - mutation/site.battery.ts
  - mutation/census.ts
confirmed-by:
  - battery: site
    guard: the-command-copied-is-the-one-the-block-spells-at-the-moment-it-is-pressed
  - battery: site
    guard: escape-closes-a-panel-of-answers-and-it-stays-closed
  - battery: site
    guard: escape-closes-the-panel-and-brings-the-reader-back-to-the-field
  - battery: site
    guard: a-slot-that-declares-nothing-is-left-alone
  - battery: site
    guard: a-way-that-was-measured-to-fail-says-so-and-one-that-runs-says-nothing
  - battery: site
    guard: a-page-with-no-slots-on-it-has-nothing-built-into-it
---

# The wiring is run against a document, and the first thing it found was Escape

## Context and Problem Statement

ADR-0157 took every decision out of `packages/site/start.ts` and left the delivery behind: finding an
element, building one, writing a value into it, wiring an event. It refused a headless browser for the
fourth time, and it wrote down why the refusal was not the whole answer:

> The need is also **not the one the three earlier refusals priced**. Those wanted a page laid out and
> so wanted a rendering engine. This wants a module executed against a document, which is a different
> tool at a different price. That question is left open and better posed rather than answered here.

This is that question answered. What was left unkept was five behaviours rather than a file: appending,
event handling, focus, `navigator.clipboard`, and reading `dataset`. `what-a-control-says.test.ts`
states the residue in its own header — *they do not keep `start.ts` calling any of it. A guard over
`theSpellingShownFor` is green on the day the control stops asking for it.*

**The file exported no name**, so nothing could import it, and a mutant injected into it had nothing
able to kill it. `mutation/census.ts` recorded that as an absence and never a refusal: *a cell there
would have been a guaranteed survivor, which is what an empty column in this table looks like from the
inside.*

## Decision Drivers

* The only part of this product a visitor touches with a mouse was the only part nothing verified.
* One dev dependency was admitted for this unit, and stage rule 3 asks that it cannot reach the product
  and that the mechanism stopping it is executable.
* The site battery replays its suite once per injected defect, so anything a guard pays is paid 122
  times over.
* A guard that cannot fail is worse here than no guard, because it reads as coverage.

## Considered Options

### The four candidates, and what each was measured to implement

The probe is **33 claims taken line by line from `start.ts`** rather than from a list of DOM features,
so a candidate that passes is one the five behaviours can be guarded on.

**`linkedom@0.18.13` fails 6 of the 33** — no `document.baseURI`, no `label.htmlFor`, `focus()` does
not set `activeElement`, no `FocusEvent`, no `focusout` at blur, and `new KeyboardEvent` throws a
`TypeError`. Three of the five behaviours are outside it.

**`jsdom@30.0.1` and `happy-dom@20.11.6` pass everything but one.** jsdom implements no
`navigator.clipboard` at all, which is one of the five; happy-dom implements it, and `writeText` then
`readText` returns `npx toopo add string/slugify` to the byte. Both accept a clipboard that refuses, so
the failure arm is reachable either way, and both parse the real emitted contract page — 61 795 B —
and find all four injection points.

|  | packages | disk | one guard file, 24 windows over the real page |
| --- | --- | --- | --- |
| jsdom | 38 | 26 MB | 1 227 / 1 257 ms |
| happy-dom | **9** | 19 MB | **513 / 536 ms** |

**What decided it is the types**, because `packages/site/tsconfig.json` declares
`lib: ["ES2022", "DOM"]`. Under this repository's own `typescript@7.0.2`, jsdom ships no declarations
(`TS7016`) and would need `@types/jsdom` — two packages where one was allowed — and happy-dom's
`Document` is not `lib.dom`'s (`TS2740`, sixty properties missing), so handing a document to a
parameter does not compile.

That inverted the approach and produced the answer used: **the `happy-dom` environment vitest already
ships**, which `pnpm-lock.yaml` has listed as an optional peer of vitest since before this unit. The
globals are vitest's, the types are `lib.dom`'s, `start.ts` keeps the shape it has in a browser, and
there is no cast anywhere. Warm cost, measured: **324 / 322 ms** per suite run, the 4.13 s of a first
run being vite's dependency optimisation and paid once.

### Refused: a real browser

`playwright` is 2 npm packages, which is fewer than happy-dom's 9. **It is refused on the
multiplication and not on the package count**: a ~150 MB binary, an install step on both matrix legs,
and a browser launch on each of the site battery's 122 cells. That cost was not measured, and the
refusal is written as a judgement about scale rather than as a reading.

### Refused: parameterising the builders with a document

The tempting shape is `copyControl(where: Document)`, which needs no globals. It does not compile
against either candidate, measured above — and it would also have been a second statement about the
browser inside the product, which `start.ts`'s own header refuses for type declarations.

### Refused: a hand-written fake document

It would prove that a builder calls a fake this repository wrote, which is not that a value reaches an
element — the weak guard `CLAUDE.md`'s own entry refuses in as many words, because it reads as
coverage.

## Decision Outcome

**`start.ts` exports four builders** — `copyControl`, `managerControl`, `searchControl`,
`playgroundControl` — and `start()` stays the composition it was. `packages/site/start.test.ts` runs
each of them against a document happy-dom parses from a page `theSite` really renders, and carries
twelve guards.

### What it found before it guarded anything

**Escape never closed the search panel in the one case the feature exists for.** The handler read

```ts
paint(THE_PANEL_IS_CLOSED)
field.focus()
```

and its own comment says why the refocus is there: *an example is a button inside the panel, so closing
while one of them is focused would drop the reader on the document body.* Closing first **detaches that
example**, so the focus event that follows arrives from a node no longer in the slot, reads as a reader
engaging the field, and runs the query again.

Measured at `2ae8b50`, on a real contract page, in the three states a reader can press Escape from:

| state | panel, immediately | panel, once settled |
| --- | --- | --- |
| field empty, focus on an example | **2 children** — the invitation, back | 2 children |
| query typed, focus on a result | 0 children | **1 child** — the answer, back |
| field already focused | 0 children | 0 children |

So it closed only when the field already had the focus, which is the case the refocus was not written
for. The repair is two lines: move the focus **before** closing, and treat a focus arriving from inside
the slot as what it is — not a reader arriving. That second half is the same distinction the
`focusout` handler beside it already makes, so no new state was added to the product.

### Four perturbations left the guards green, and three of them were holes

Every guard was applied against a defect written for it before it was believed. **Four came back green,
and they are worth more than the twelve reds.**

* **A slot that declares nothing is a different page from a page with no slot.** Dropping the check on
  `data-search` altogether left the guard green, because the page it built carried no masthead for the
  check to have mattered on. A second guard was written for the slots-present case.
* **A refusal read by `textContent` is one nobody is shown.** Setting `refusal.hidden = true`
  unconditionally left the guard green: it was asserting that the words were composed, never that the
  paragraph was revealed.
* **Escape on a panel of answers is a different claim from Escape on an invitation.** The invitation is
  repainted synchronously, so a close that happens last wins whatever else ran; an answer is awaited, so
  it lands *after* the close. Only the second makes the focus condition load-bearing. A guard was
  written for it.
* **The fourth is not a hole.** `playgroundControl` opens
  `if (container === null || declared === undefined)`, and the first clause carries no behaviour —
  `declared` is read through `container?.dataset`. Removing it is `TS18047: 'container' is possibly
  'null'`, so the compiler holds it and no run can see it.

**A thirteenth guard was written, passed, and was struck out**: *a page with no playground container is
left alone*. Two plausible defects were written for it and both left it green, and the only mutant that
reaches its subject does not compile. A guard whose subject is enforced by the type system is a guard
that cannot fail, and it is recorded in `start.test.ts` where somebody would otherwise write it again.

### Twelve cells, and every guard is named by one

`mutation/site.battery.ts` gains W-122 to W-133 — the first cells to inject into `start.ts`. Each was
applied to the working tree and run before it was written down.

Replayed at `d0c8fe6`, all twelve are **killed as expected**, the battery exits 0, and it says *every
guard of this contract is either witnessed or accounted for* with **nothing unaccounted for**.

**Seven of the twelve guards have a cell that reddens them alone** — W-122, W-124, W-125, W-126,
W-127, W-129 and W-130. The other five are only ever reddened alongside a neighbour, which is the
ordinary state of this battery rather than a finding: the block written one unit earlier reports the
same for its own guards, because a cell aimed at one claim usually trips a second. What the instrument
refuses is a guard nothing reddens at all, and there is none.

**The reason so many of them redden together is worth naming.** These guards build a real page, so
W-02, W-19 and W-20 — cells that break page building outright — trip most of them. That is a coupling
the fixture buys: a guard reading the emitted page is a guard the emission can break. It is the price
of not writing a hand-written fixture, and it is paid rather than hidden.

## Consequences

### What a reader pays, stated rather than smoothed

`start.js` goes from **9 842 to 10 074 served bytes and from 2 276 to 2 319 in brotli**, so every page
of this site is **43 B heavier**. Both readings are `build.ts`'s own output, at `2ae8b50` and at
`d0c8fe6`, and the five other always-loaded modules are unmoved to the byte.

**The commit message of `d0c8fe6` publishes 9 960 and 28 B, and it is wrong.** That reading was taken
with `asABrowserModule` called directly, because the build refuses to stamp a tree that disagrees with
its commit — and it was taken *before the Escape repair was written*. The two-method comparison it
rested on was sound and is still: the five unchanged modules matched to the byte either way, which is
what says the method agreed. **What it could not say is that the file had stopped moving.** A
comparable method does not make a reading current, and the coordinate a figure carries has to name the
tree it was taken from rather than the commit the unit ended up at.

It is corrected here rather than restated, on ADR-0018's own rule, and the commit is left as it stands
because a commit message cannot be corrected — the same shape ADR-0156 recorded when its commit carried
the simulated figures and its record carried the shipped ones.

### What the suite pays, and the mistake that nearly went in

The site suite goes from 13 files and 165 guards to 14 and 177. Its duration goes **4.36 s to 4.52 s**,
which is 0.16 s for twelve guards.

**The first version cost 3.3 s and would have put roughly 6.7 minutes on the battery.** Measured rather
than guessed: `localSource()` costs **268 ms** against `theSite`'s **9 ms**, and it was being called
twice per guard. `pages.test.ts` reads the source once at module level and calls `theSite` inside each
guard; that split is not a habit, it is the whole difference. What the rebuild-inside-each-guard rule
protects is the call that can throw on a defect of this folder, and reading thirty-seven files off disk
is not it.

### The bound, and a figure this repository was carrying from the wrong population

`CLAUDE.md` says the slowest battery job sits at **68 %** of its 40-minute bound. That is
`registry-storage` and it is not this battery. Read off the two runs themselves, same job, same
workflow, same class of runner:

| commit | cells | `batteries (site)` | of the 40-minute bound |
| --- | --- | --- | --- |
| `1a1b0f8` | 122 | 19 min 07 s | 47.8 % |
| `d0c8fe6` | 134 | **22 min 07 s** | **55.3 %** |

So twelve cells cost **three minutes**, and the margin is still eighteen.

**The arithmetic does not close and that is stated rather than smoothed.** Twelve cells at the earlier
run's 9.40 s each predicts 1 min 53 s, and the suite being 0.16 s slower on every one of the 134
predicts 21 s more — 2 min 14 s against 3 min 00 s observed. The remaining **46 s is unaccounted for**.
A shared runner varies, and that is a candidate rather than a measurement: nothing here read it, so
nothing here names it as the cause.

### What none of this proves, written down rather than softened

* **That a real browser exposes `navigator.clipboard` at all.** It needs a secure context and, in some
  browsers, a user gesture. happy-dom's is unconditional. The guards prove what the wiring handed it.
* **That anything reaches the operating system's clipboard.**
* **Layout, visibility, or that a control can be hit.** A correctly built button can be invisible.
* **That a browser fetches and executes this module.** The module graph is outside all of it.
* **That the focus order a reader tabs through is this one.** happy-dom's `focus()` succeeds where a
  browser's refuses — on a hidden or disabled element.
* **And happy-dom is itself a second statement about the browser**, which is exactly what `start.ts`'s
  header refuses for type declarations, on the rule that *a value read off what it describes has no
  second statement to disagree with*. What limits the damage is only that this one is neither written
  nor maintained here. It does not annul the remark.

## What would reopen this

* **A tenth browser module, or a control that stops being reachable.** The four builders are exported;
  a fifth control written inside `start()` would be back where this started.
* **A real browser arriving for another reason.** Three entries of `CLAUDE.md` price one for layout. The
  day it is admitted, the six silences above stop being silences, and the clipboard, the hit test and
  the module graph become guardable.
* **The battery clock approaching its bound.** 47.8 % today, and this unit adds twelve cells to it.

## More Information

The dependency, the stage rule and the measurement that `typescript` really reaches the product are in
the commit that added `happy-dom`. ADR-0157 is the unit that separated the decisions from the delivery
and named this one.
