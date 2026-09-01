---
status: accepted
date: 2026-08-25
governs:
  - mutation/run.ts
  - mutation/measure.ts
confirmed-by:
  - battery: meta
    guard: a-run-cut-short-is-told-from-a-run-that-reddened
  - battery: meta
    guard: a-verdict-is-asked-of-the-absence-before-the-evidence
---

# The instrument stops reporting a verdict it did not measure

## Context and Problem Statement

`site · W-97` takes the template-token rescan out of the comment reader. Measured at `505fddb` over
the ten modules a browser fetches, the reader then **never finishes** on three of them —
`playground.ts`, `literal.ts` and `value.ts`, the three the seventh contract grew. Its defect stopped
being a wrong answer and became non-termination.

`runSuite` spawned vitest with neither a `timeout` nor a `maxBuffer`, so the battery waited for it
indefinitely: the owner watched sixty-five minutes of one run while `measure.ts` sat at **zero seconds
of processor time** and its child spun. `suites.yml` bounds a job at forty minutes, so CI fails loudly
rather than looping — which is what makes this blocking without being an emergency.

**Two entries of the open list were one fault at one call**, and the same call carries both options:

* *That a cell's verdict is the verdict of a mutant that ran* — node's default `maxBuffer` of
  1 048 576 bytes kills a loud red run before vitest writes its report, and the cell then reads
  `killed-by-typecheck`: a mutant that ran and was caught, reported as one that did not compile.
* *That a run the instrument cannot finish is a verdict* — the same shape arriving from time instead
  of from bytes.

Underneath both is one sentence: **the instrument reports a verdict it did not measure.**

## Decision Drivers

* A verdict derived from an absence cannot tell one absence from another.
* A bound that made hanging cells look finished would be worse than no bound.
* The instrument's own claim is that every cell carries a measured verdict.

## Considered Options

* Bound the run and let a bounded run count as `killed`.
* Bound the run and let it count as `survived`.
* Bound the run and give what it produces a name of its own.

## Decision Outcome

**Chosen: bound both, and name what a bounded run produces.**

### The trap, which is why the bound alone would have bought nothing

```ts
const verdictOf = (green, failedGuards) =>
  green ? 'survived' : failedGuards.length === 0 ? 'killed-by-typecheck' : 'killed'
```

`killed-by-typecheck` is derived from an **absence** — red, with no guard named. A run cut short before
it can write a report is red with no guard named. So a `timeout` added without a verdict to carry it
would have turned every hanging cell into one more `killed-by-typecheck`, and the repair would have
measured nothing while looking finished.

### What separates them, measured rather than assumed

At `505fddb`, `execFileSync` on this platform:

| what happened | `status` | `signal` | `code` |
| --- | --- | --- | --- |
| an ordinary non-zero exit | `1` | `null` | absent |
| past its bound | `null` | `SIGTERM` | `ETIMEDOUT` |
| past its buffer | `null` | `SIGTERM` | `ENOBUFS` |
| both at once | `null` | `SIGTERM` | `ENOBUFS` |
| a child that cannot start | `9` | `null` | absent |

**`code` is the discriminator and nothing else is.** `signal` is `SIGTERM` for both bounded cases and
tells them apart from each other not at all. **`killed` is `undefined` in every one of the six**, so
the field that looks like the answer is not one here — it was proposed and refused on the reading. A
run both over its buffer and hanging reports `ENOBUFS`: the buffer fires first.

And the report itself: measured, a run stopped by its bound writes **no report at all**, where a mutant
the compiler refuses reddens *with* a report — the syntax-error probe reported 17 assertions of the 29
the census declares, none failed.

### One addition suffices, and that is measured too

A bounded run is not `killed` — nothing reddened — and not `survived` — nothing passed. Counting it as
`killed` would let a battery go green because a suite got slow, which is *green by losing its
population*, refused everywhere in this repository. Counting it as `survived` would read a real
detection as a miss.

So `not-measured`, and only that one. **With the unmeasured cases taken out of it,
`killed-by-typecheck` stops being an absence in disguise**: the child exited non-zero, a report exists,
and nothing in it failed — a positive reading. Five cells pin it, one in each spec battery, and each
injects a value outside a vocabulary the contract declares.

**It cannot be pinned.** `Expectation` takes `PinnableVerdict = Exclude<Verdict, 'not-measured'>`, so
no battery may declare a cell unmeasurable, and a cell that measures it disagrees with whatever it was
pinned at — which already fails the run. No second term in the exit code, because a disagreement is
one.

### The two numbers, chosen against readings

**600 seconds.** One run of each configuration this instrument spawns, measured at `505fddb`:
contracts 1.4 s, validation 2.5 s, site 5.4 s, cli 10.8 s, registry 14.9 s, packaging 14.9 s, meta
39.4 s. Ten minutes is fifteen times the slowest, which leaves room for a runner slower than this
machine, and it sits under the forty minutes `suites.yml` allows a job — so a bounded cell reports
rather than being cut off with everything else.

**`1 << 28`.** `packages/registry/determinism.test.ts`'s value, reached for rather than invented. It
does not make an overflow impossible, which is why one is still reported by name.

## Consequences

* Good: a cell nobody could measure says so, in a battery that then fails.
* Good: the calibration refuses a control it could not measure before it calls it red — where the old
  message would have printed *is red* with an empty list of guards under it.
* Bad: it changes what every battery measures, so a full `npm run mutation` is owed. Any cell reading
  `killed-by-typecheck` through the buffer path will start reading its true verdict.
* Bad: a bound is a number, and a runner slow enough to cross it turns a real reading into
  `not-measured`. That fails the run rather than passing it, which is the right direction, but it is a
  red nobody caused.

## What would reopen this

**A legitimate run crossing the bound reopens the number, not the mechanism.** The reading that chose
it is one machine's; a `not-measured` on a cell that has always been green is that event, and the
answer is to re-take the seven readings rather than to raise the number by feel.

**A second discriminator reopens the sorting.** `code` separates what node throws today. A node that
reported a bound differently — or a platform where `ENOBUFS` never appears — would need the reading
re-taken; the guard over the sorting is what would notice, because it names the three inputs.

**And `killed-by-typecheck` reopens if a sixth thing starts producing it.** It is a positive reading
now because three ways of learning nothing were taken out of it. A fourth would put it back where it
was, and the way to find out is the same as the way this was found: watch what a cell reports when the
apparatus, rather than the mutant, is what failed.

## More Information

### What the repair actually is, in one line

The `catch {}` became a `catch (thrown)`. Everything else follows from reading the error instead of
discarding it — which is the whole of both entries, and is why they close together rather than one
after the other.

### W-97 does not change

Correcting the cell so that it fits the instrument was refused, for the third time this week and for
the same reason: the mutant is a real defect, and a cell rewritten to avoid what the apparatus cannot
measure is a measurement of the apparatus.
