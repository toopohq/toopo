---
status: accepted
date: 2026-08-21
decision-makers: Mathis Perron
governs:
  - mutation/run.ts
  - mutation/mutants.ts
  - mutation/published.ts
  - mutation/cli-install.battery.ts
  - packages/site/methodology-page.ts
confirmed-by:
  - battery: meta
    guard: a-cell-the-platform-decides-is-not-measured-off-its-family
  - battery: meta
    guard: every-cell-the-platform-decides-says-why-the-defect-is-not-there
  - battery: meta
    guard: every-cell-the-platform-decides-is-published-beside-the-count-it-enters
  - battery: meta
    guard: the-readme-says-what-caught-means-where-a-defect-is-not-everywhere
  - battery: site
    guard: the-method-page-says-what-caught-means-where-a-defect-is-not-everywhere
---

# A published count carries the platform it is true on, and one cell is not measured where its defect cannot occur

## Context and Problem Statement

[ADR-0145](0145-the-batteries-are-read-on-two-runners.md) read the batteries on two runners and found
four disagreements. Three were repaired. The fourth is `C-64` of `cli-install`, which removes the retry
from `removeDirectory`: **killed on `windows-latest` and on the machine that wrote its pin, survived
twice on `ubuntu-latest`.**

That record established the cause in as many words - *a POSIX and Windows difference about a file
another process holds* - and did not carry it into the classification. The cause matters completely:
POSIX unlinks a directory another process is standing in, so `rmSync` returns on the first attempt, the
retry is never entered, and **there is no defect on POSIX for anything to catch.** It is not a weakness
of the suite there.

The gates of ADR-0146 run on `ubuntu-latest`, so the cell has to be settled before they can be green.

## Decision Drivers

- A verdict that is true where it was measured may not be replaced by a false one to make a figure
  uniform.
- `691 are caught` had no coordinate, and it is the figure this whole project rests on. ADR-0018's rule
  applies hardest where a number is most believed.
- A figure the site publishes must not depend on the machine the site was built on, because nothing in
  the artefact would say which machine that was.

## Considered Options

- Flatten the pin: `survived('a-declared-open-class')` on every platform.
- Remove the cell.
- Make `theMeasurement` take a platform, and publish one platform's figure.
- Publish two figures, one per platform.
- Repair the figure rather than the verdict: the pin carries the platform, a run resolves it, and the
  published count says what *caught* means.

## Decision Outcome

**The last.** The pin says the defect exists on one family of platforms; a run off that family does not
inject at all and answers `not-applicable`; and every figure is derived from the pin **as written**, so
it is the same object on every machine and the platform is published as a term of the count.

Measured before and after: `730` cells, `691` caught, `39` surviving, on this machine and on any other.
Nothing moved.

### Why flattening was refused, which is the option that looked cheapest

`survived(...)` everywhere takes a verdict that is true on Windows - the retry works, removing it is
caught, re-measured at `80748a5` as `C-64 killed as expected` with the control green at 178 tests - and
declares it false so that one number needs no explaining. Two things are wrong with it. A real
assertion disappears, and it is exactly the kind of assertion this instrument exists to make. And the
label would be false in its own right: `a-declared-open-class` means *this repository has written a
limit down*, and this repository has written no limit here. The platform sets one.

### Why it is an applicability and not a fifth nature

`unreachable-on-this-catalogue` is the neighbouring shape and it does not carry this case, for a reason
that is about what it publishes rather than about what it means: its reader-facing sentence says *a
larger catalogue would reach it*. No larger catalogue reaches `C-64`'s region. A different operating
system does, and putting that cell under that sentence would print a false explanation on the method
page.

**A fifth nature is refused too, and that is the stronger half.** A `SurvivalNature` explains why a
**survivor** is not a hole. This cell never survives anywhere: it is caught where its defect exists and
is not measured where the defect cannot occur. Giving it a survival nature would classify as a survivor
a cell that survives on no machine.

What it needs is an **applicability**, and this instrument already has that word. `not-applicable` has
meant *this cell was not measured here* since `measureCell` first refused an arm that cannot express a
defect, and both `score.ts` and `populationOf` already exclude it. The new case is the same refusal
arriving from the operating system instead of from the arm.

### What a run resolves and a figure does not

    the pin        killed(['a-project-is-removed-...']), only on windows, and why
    a run here     resolves it: on POSIX the cell is not injected and answers not-applicable
    a figure       reads the verdict as written: C-64 is one of the 691, everywhere

`expectedHere` is the one place the resolution happens, and `measureCell` asks it rather than comparing
the family itself - so what a run skips and what a run is held to cannot come apart. A second statement
of that rule would fail as a cell measured here and judged by another platform's pin.

### Why the count did not move, and why that is the point rather than a convenience

*Caught* means caught wherever the defect exists. For 729 of these cells that is everywhere; for one it
is one family of platforms. So `691` is true on every machine, and what was missing was never the
number - it was the sentence saying what the number means. `CAUGHT_MEANS_WHERE_THE_DEFECT_EXISTS` is
that sentence, exported once and transcribed by both surfaces, on the treatment
`THE_PINS_ARE_AN_ASSERTION` already gets: two spellings of one admission are two things that can come
apart.

**The cells are named and never counted.** A rank is checked only by rebuilding the whole list, and
both guards over the surfaces sweep `whereThePlatformDecides` entry by entry - so a second such cell
reddens the README and the method page rather than leaving a sentence that quietly means fewer things
than it says.

### The forms that were refused, and what each costs

**`theMeasurement(platform)`** publishes one platform's figure and hides the dependency in an argument
nobody can see in the answer. The site is built on `ubuntu-latest`; a caller that omitted the argument
would publish the build machine's number, silently. That is the defect being repaired, reintroduced as
a default.

**Two figures** doubles nine README figures and the method page's split for one cell, and every reader
afterwards carries the two-ness. It is honest and it costs more than the truth it buys.

**Removing the cell** loses a real assertion about a real defect, on the platform where that defect
happens.

### Consequences

**Good.** No verdict this repository could measure was changed, and no figure moved. The gates of
ADR-0146 can be green on `ubuntu-latest`.

**Good.** `691` stops being a platform's number published bare, which is what it had been since it was
`694`. That was named as ADR-0018 on this project's central measurement, and the number was corrected
without the class being corrected.

**Bad, and it is the honest limit of this unit.** The skip is measured here only through `expectedHere`,
because this machine is `windows` and nothing can make `measureCell` believe otherwise without a seam
written for a test. **The end-to-end reading - `cli-install` green on `ubuntu-latest` with `C-64`
reported `not applicable` - is the first gate's own first run, and it has not been taken yet.** It is
named here rather than left to be assumed covered.

**Bad.** `PlatformFamily` has two values, and that is a claim about filesystems rather than about
`process.platform`. A rule that split three ways would need a third, and nothing here would say so
until a cell needed it.

## What would reopen this

- A second cell of this kind, which would make the two-value split load-bearing rather than sufficient,
  and would be the event ADR-0145 already names as turning a per-cell declaration into a shape.
- The end-to-end reading disagreeing with `expectedHere`, which is the limit stated above arriving as a
  fact.
- A defect that exists on both families and is caught on only one, which this shape cannot express: it
  says *the defect is not there*, not *the suite does not see it there*, and the second would be a
  survivor with a nature rather than an applicability.
