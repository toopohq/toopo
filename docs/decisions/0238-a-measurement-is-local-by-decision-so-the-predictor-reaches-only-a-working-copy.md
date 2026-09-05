---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A measurement is local by decision, so the predictor reaches only a working copy

## Context and Problem Statement

ADR-0237 measured that `npm run predict` is the one thing that could have named ADR-0234's unwitnessed
guard cheaply, and that it could not, because this battery's stored measurement predated the guard
identities. It priced the remedy at one battery run apiece and left the rest owed.

**This unit pays it, and what it establishes is not the payment.** The debt turns out not to be a
property of the repository at all, so *lifting* it is the wrong verb — and the measurement that says so
is one line of `.gitignore` with its reason written beside it.

**Nothing is built.** No guard, no cell, no job, no declaration. `THE_PACKAGE_VERSION` stays at `1.2.0`,
the ledger reads `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11`, nothing under
`contracts/`, `packages/` or `.github/` moves, and neither half of ADR-0218's item 3 is taken.

## Decision Drivers

* **The cheap route is looked for before the expensive one is run.** A CI job that already replays every
  battery exists; whether it does this in one run is a question to answer before spending forty minutes
  of a local machine.
* **A mechanism is verified on a second instance before it is trusted twenty times.** One battery
  flipping could be that battery.
* **A figure is re-measured rather than carried.** ADR-0237 published *twenty-two*, and that number came
  from ADR-0221 rather than from a reading taken here.

## Considered Options

* **`every-battery` in CI** — the job exists, is normally skipped, and replays all twenty-three.
* **A full local `npm run mutation`** — one command, all twenty-three.
* **The batteries that lack identities, one at a time** — the fewest cells re-run.

## Decision Outcome

### 1. `every-battery` cannot do it, and the reason is a decision rather than a limit

`mutation/results/` is in `.gitignore`, and that file carries the reason in its own words:

> The output of one run. What a cell must produce is pinned in its battery, which is the durable
> record; keeping the measurement as well would put the same claim in two places that can drift.

**Two independent consequences, both measured.** A runner writes its measurements into an ephemeral
filesystem and they die with it. And `suites.yml` carries **no `upload-artifact`, no `download-artifact`
and no `actions/cache`** — swept, nought occurrences — so there is no channel by which one could come
back even if somebody wanted it.

**So a measurement is local and disposable by design, and the predictor's reach is a property of a
working copy.** A fresh clone answers `no measurement of this battery is on disk` for all twenty-three.
That is not a defect of `predict`: it reads what a run produced, and this repository deliberately keeps
what a run produced out of the tree.

### 2. The cost, measured rather than derived — and the derivation was low

Nineteen batteries, run one at a time on this machine, each exiting 0:

| | s | | s | | s |
| --- | --- | --- | --- | --- | --- |
| `cli-install` | **857** | `date-add` | 74 | `object-deep-equal` | 25 |
| `cli-update` | 475 | `number-parse` | 64 | `date-add-spec` | 21 |
| `cli-remove` | 238 | `string-levenshtein` | 55 | `string-slugify-spec` | 16 |
| `array-group-by` | 157 | `number-round` | 54 | `string-levenshtein-spec` | 16 |
| `string-slugify` | 121 | `cli-search` | 53 | `array-group-by-spec` | 13 |
| `packaging` | 102 | `number-round-spec` | 33 | `object-deep-equal-spec` | 13 |
| | | | | `number-parse-spec` | 12 |

**Total 2 399 s, 39 min 59 s.**

**The bound derived before the run was about 33 minutes and it was 17 % low.** It came from ADR-0200's
per-battery figures on this same machine, subtracting the four that already carried identities from a
full replay of 60 min 14 s. What broke it is one battery: `cli-install` at **857 s** against that
record's 729 s and 623 s, having gained the cells ADR-0214 wrote. **ADR-0199's rule arriving on its own
remedy** — a bound extrapolated from a population states the cost of that population, and this one was
extrapolated from a population three days stale.

**The full replay was not chosen** because three of the twenty-three already carried identities and two
of those three are the expensive ones — `registry-storage` and `site`, some 30 minutes between them by
ADR-0200's figures — so running everything would have paid for them twice for nothing.

### 3. The mechanism reproduces, verified on a second battery before the other nineteen

`validation-stage-1`, **56 s** against ADR-0200's 55.4 s and 55.6 s on this machine, so the machine is
behaving as it did when those were taken:

    validation-stage-1
      every cell of this measurement agrees with what the battery declares today
    23 battery(s) read: 0 fault(s) a replay would refuse on, 19 question(s) this reading could not ask

**20 → 19.** Rewriting a measurement moves that battery from *I cannot ask* to a real answer, outside
`site` and therefore not a property of `site`. Had it not reproduced, it would have been learned at the
second rather than the twentieth.

### 4. The count at the end, and a first

    23 battery(s) read: 0 fault(s) a replay would refuse on, 0 question(s) this reading could not ask

**Exit 0.** `npm run predict` has never been able to exit 0 before: ADR-0221 shipped it with
twenty-two measurements that could not answer, and it has answered `2` — *a reading that could not be
taken is not a reading that found nothing* — from the day it was written. **And nothing was hiding**:
nought faults across all twenty-three, so the nineteen fresh measurements agree with what their
batteries declare.

### 5. A figure of ADR-0237 is corrected, and it is mine

That record says *the other twenty-two*. Twenty-two is **ADR-0221's** figure, true at its own commit
when `registry-storage` alone carried identities; by the time ADR-0237 was written `fixture` and `site`
carried them too and the number was **twenty**, which `predict`'s own `21 question(s)` before this unit
says arithmetically. It is a stamped figure carried into a present-tense sentence — this repository's
own recurring class, arriving on the record that had just finished describing three mechanisms being
blind.

## Consequences

* **On this machine, a guard added and forgotten is now caught in 185 ms**, by a command, on any of the
  twenty-three folders. That is the whole of what forty minutes bought.
* **On any other machine it is not**, and no push, no job and no artefact changes that. What a
  contributor gets from a fresh clone is `predict` refusing to answer twenty-three times, correctly.
* **The measurements decay.** They answer *every cell of this measurement agrees with what the battery
  declares today*, which is a claim about the cells that measurement holds and about nothing else — so a
  cell added after one is written is named as unheld rather than silently covered, and the reading is
  worth re-taking whenever the instrument grows.
* **The entry in `CLAUDE.md` is corrected on both counts**: the number, and the verb. A debt that
  regenerates per working copy is not one a unit closes.

## What would reopen this

* **A decision to track `mutation/results/`.** It would make the reading durable and shared, and it
  would put a claim in two places that can drift — which is exactly what `.gitignore` refuses and why
  this record does not propose it. Somebody may still decide the drift is worth the reach; that is a
  decision with a record, not a convenience.
* **A `predict` that reads a measurement out of a CI artefact.** It would need an upload, a download and
  a way to trust an artefact a runner wrote, which is three mechanisms where there are none, and it
  would be reading a machine's answer on another machine's tree.
* **A battery whose measurement, rewritten, still cannot answer.** The mechanism reproduced twice here;
  a third that did not would say the guard identities are not the only thing missing.

## More Information

* ADR-0221 built the predictor, published the debt and named the remedy; ADR-0237 measured its first
  instance and is where the *twenty-two* corrected here was repeated.
* ADR-0200 is where the per-battery durations on this machine were measured, and ADR-0199 is the rule
  about extrapolating a bound from one member of a population, which this unit's own estimate broke.
* ADR-0214 added the `cli-install` cells that make that battery 857 s where it was 729.
