---
status: accepted
date: 2026-08-21
decision-makers: Mathis Perron
governs:
  - .github/workflows/suites.yml
confirmed-by: []
---

# The batteries are read on two runners, and three pins turn out to mean three different things

## Context and Problem Statement

`CLAUDE.md` carries an entry saying that a battery's disagreement with itself is read by nobody: `npm
run battery <name>` ends by pairing every guard of its suite against the mutants that redden it, and
no workflow runs it. What closes it is a job.

`.github/workflows/suites.yml` refuses that job in its own header, and the refusal is not about
minutes:

> A pin is calibrated against runs on the machine that wrote it: ADR-0053 is why a draw count and a
> rate are read together, and ADR-0077 is why no rate obtained by reproducing a generator is
> trustworthy to better than an order of magnitude. A replay on another platform therefore produces
> disagreements nobody can attribute to a defect rather than to the platform - a red on which no
> action is possible.

**That argument had never been tested.** No battery injecting into a real folder had ever been run
anywhere but on the machine that wrote its pins. So the argument was an expectation in the file that
acts on it, and this unit replaces it with a reading.

**One sentence of that entry was already false when it was published, and that is the shape rule 3 of
that section names.** `fc41c4e` (2026-08-07) added
`a-battery-invoked-under-a-lower-case-drive-letter-collects-its-suite`, which spawns `measure.ts
fixture` as a child and asserts `every cell agrees with the verdict this battery pins for it`; it is
collected by `mutation/vitest.config.ts`, which is the `meta` step of `suites.yml`. The entry was
written eleven days later, at `456ee44`, and reads *and not one battery*. It was written from an
assumption rather than from a reading, in a commit called *a battery nobody runs*.

What the fixture establishes is narrower than the sentence it refutes: two mutants, one arm, no
property-based guard. It shows the **mechanism** works on Linux - git's own state, the injection, the
restore, the calibration, the census - and never that the instrument agrees with itself in front of a
real folder.

## Decision Drivers

- The refusal in `suites.yml` decides what continuous integration may run, and it rests on an argument
  nobody has measured.
- A criterion written after seeing a result is written by the result.
- Three of the four known instances of the debt live in `packages/cli` and `packages/registry`, so any
  prescription that excludes those two folders keeps a gate and discards what justifies it.

## Considered Options

- Write the gates against the expectation in `suites.yml`.
- Take the reading first, on one platform.
- Take the reading on both platforms, the second only if the first says something the first cannot
  settle.

## Decision Outcome

**The reading is taken on both, and the criterion was committed before either result existed.**

The criterion lived in the header of a throwaway workflow, pushed at `26e2000` before any run of it
had finished, so git holds it at a timestamp the results do not have. It classified a disagreeing cell
by **reproduction** and never by reading the cell:

1. re-run on the same image at the same commit; agreeing the second time makes it a **draw**, seeds
   being unfrozen by decision;
2. disagreeing twice there and agreeing on the machine that wrote the pins makes it the **platform**;
3. disagreeing there too makes it a **defect** of this repository, found by the run rather than caused
   by it.

Its threshold - *more than two batteries in the platform bucket, or any contract battery in it, and
the two-gate form does not survive* - was written in the same commit.

### The coordinates

    Linux    run 32425759814   ubuntu24 20260816.277.1   node v24.19.0   git 2.55.0
             at 26e2000, which is 7c9906c plus one workflow file
    Windows  run 32431274756   windows-latest            node v24.19.0
             at 92f60d8, which is 26e2000 plus the job that runs it
    21 batteries, 758 cells, one job each, all started within 32 s of one another

    Linux    19 of 21 agree   89.8 min of battery time    25.1 min of wall clock
    Windows  20 of 21 agree  117.7 min of battery time    33.6 min of wall clock

**This block published `commit 26e2000` for both legs, and it was wrong on the day it was written.**
`gh run view 32431274756 --json headSha` answers `92f60d8`, and at `26e2000` the Windows job does not
exist - so no replay there could produce the column the coordinate sat under.

**It is not a figure that moved.** `git diff --numstat 26e2000 92f60d8` reports
`94 0 .github/workflows/the-reading.yml` and nothing else, so both legs measured the same bytes and every number
above stands exactly as it is. What was wrong is the coordinate, and a coordinate that was never the
measurement's is a defect ADR-0018 has no clause for: its rules are written against a stamp going
stale, and this one was false at birth. **It is the second such in one week**, the first being the
sentence *and not one battery* this record repairs above - published eleven days after `fc41c4e`
refuted it.

Both commits are reachable from the annotated tag `evidence/the-batteries-on-two-runners`, which is
what let the branch be deleted without killing the five citations of `26e2000` this repository holds.

`22.18.0` is deliberately unread. `suites.yml` carries two runtime floors because the question there
is which runtimes pass; a battery measures what a suite catches and not which runtime ran it, which is
the argument the `site` job already makes for itself. Any gate written against this reading inherits
that absence.

    battery                  linux   windows          battery                 linux   windows
    cli-install              1497s     1970s          number-round               56s      54s
    registry-storage         1260s     1201s          validation-stage-1         54s     108s
    cli-update                707s     1061s          number-parse               53s      94s
    site                      578s      763s          string-levenshtein         41s      82s
    cli-remove                461s      653s          number-round-spec          40s      57s
    array-group-by            188s      242s          date-add-spec              21s      33s
    string-slugify            150s      197s          string-slugify-spec        17s      25s
    date-add                   80s      115s          string-levenshtein-spec    16s      27s
    packaging                  71s      208s          array-group-by-spec        16s      22s
    cli-search                 70s      127s          number-parse-spec          10s      20s
                                                      fixture                     3s       5s

### What the reading says

**The instrument runs whole on both platforms.** There are no unattributable disagreements. There are
four, and each of them attributes - to three different causes, which is the finding.

    cell            linux x2   windows runner   this machine        class
    C-64            survives   killed           killed              the platform
    I-01, I-08      survives   survives         killed / survives   the checkout
    S-12            survives   survives         survives            a defect

**`C-64` is the platform, and it is one cell.** Its guard is
`a-project-is-removed-while-another-process-still-holds-it`, which is a POSIX and Windows difference
about a file another process holds. It is green on `windows-latest` and on the machine that wrote it,
and red on `ubuntu-latest` twice.

**`I-01` and `I-08` are not the platform. They are the checkout, and that is measured on one machine
in both directions.** Their mutant makes the digest depend on the working tree's bytes rather than on
the bytes the registry serves - the cell's own description says *so the digest depends on the reader's
git configuration*. `git ls-files --eol` reported **9 tracked files of 451** carrying `w/crlf` where
their attribute declares `eol=lf`. With those nine as they were, `I-01` is `killed as expected`;
normalised to LF, with the control green at 407 tests either way and nothing else changed, `I-01`
**survives**. A fresh checkout has nothing for the mutant to differ on, which is why both runners agree
with each other and not with this machine.

**Those two pins were false on the day they were written**, and the interval says so:

    ec5c712   2026-08-03 17:03:20   .gitattributes gains `* text=auto eol=lf`, beside canonical.ts
    c12b979   2026-08-03 17:05:04   I-01 and I-08 are pinned killed

One hundred and four seconds. `.gitattributes` does not renormalise a working directory that is
already there, so the nine files stayed as they were and the pins were seen red - while for every
clone made after that commit the condition had already been abolished. It is the same shape as the
entry above: written from the state of one machine rather than from what the repository would produce.

**What loses its witness is the assembly and not the promise.** Three unit guards of
`packages/registry/determinism.test.ts` have teeth on every platform, because they call `servedBytes`
on constructed buffers: `a-crlf-source-is-served-as-its-lf-form`, `a-byte-order-mark-is-not-content`
and `normalising-changes-the-digest`. What has no witness on a clean checkout is
`the-served-bytes-are-the-committed-bytes`, the end-to-end claim - **and that guard declares its own
limit in as many words**, under a heading that reads *Where this guard has teeth, said out loud*. What
was never declared is that its two pins inherited that limit.

**`S-12` is a defect, and its cause is measured end to end rather than named.** The cell removes
camel-case splitting from the tokeniser and pins `killed(['a-query-the-catalogue-cannot-answer-answers-nothing'])`.

    five contracts, `parse yaml` in the negative corpus     S-12 killed, exit 0
    five contracts, `parse yaml` removed                    S-12 SURVIVES
    six contracts, `parse yaml` in the corpus               the unmutated control is RED
    six contracts, as committed                             S-12 survives, on three environments

**The four states, named so that a reader can rebuild each of them, which this record did not say and
had to.** *Five contracts* is `50ff990^`, and the corpus is the array inside
`a-query-the-catalogue-cannot-answer-answers-nothing` in `packages/registry/search.test.ts`, whose
last entry there is `'parse yaml',`. So the first row is that commit as committed; the second is that
commit with the one line removed; the third is `50ff990` with the same line put back; the fourth is
`50ff990` as committed. **Two of the four are trees no commit of this repository holds**, which is
why the file and the line are written out here rather than a commit identifier being offered for each
row. The throwaway commit that carried the second was deleted with the branch, and nothing cited it.

`parse yaml` did not leave the file at the sixth contract, it left the array: `50ff990` takes the
entry out and writes two paragraphs about why, so a reader grepping the name at the tip finds the
argument and not the corpus.

So `parse yaml` was the one query in that corpus which made the mutant detectable; the sixth contract
forced it out - ADR-0144 removed it because the control is red with it - and the pin went with it, with
nothing saying so. It is [ADR-0130](0130-a-contract-page-publishes-what-its-own-suite-did-not-catch.md)'s
rule arriving again: checking that a change does not move what you feared says nothing about what it
moves.

### What was tried to restore it, with the criterion written first

A query enters the negative corpus because somebody would type it and the catalogue must stay silent -
never because it kills a mutant. So: a list of fifteen candidate queries was written in full and frozen
**before any of them was run**, generated by asking which utilities somebody would look for that this
catalogue does not hold, and never by asking what would break this mutant. A candidate is admissible
only if the unmutated catalogue answers it nothing; among admissible ones that restore detection, the
**first in the written order** is taken, so that the choice cannot be tuned; and if none does, no second
list is written.

Three were inadmissible, and they are worth naming because they are the precision debt rather than the
trial: `parse json safely` and `random integer between two numbers` answer `number/parse@1` at 100, and
`parse a query string` answers it at 150.

**None of the twelve admissible candidates restores detection.** The mutant changed nothing for any of
the fifteen, admissible or not - identical answers on both sides. Read beside the battery's own verdict,
where `S-12` survives and therefore no guard of `packages/registry/` reddens at all, the statement is
wider than one guard: **at six contracts, removing the camel-case split changes nothing the registry
suite can observe.** This is the second time this cell has gone silent; its own comment records the
first, and ADR-0136 is what had made it detectable again.

### Consequences

**Good.** The refusal in `suites.yml` is replaced by a reading, and it is not confirmed: there are no
disagreements nobody can attribute. The gates of unit B can therefore run on `ubuntu-latest` like
everything else in that file, and the whole cost of doing so is one cell.

**Good, and it is the point of the exercise.** The reading found three defects at the tip of `main`
that eight green suites, a green `meta`, a green `tsc` and a green run of continuous integration did
not: `S-12`'s pin, `I-01` and `I-08`'s pins, and eighteen guards named `…-number-round` that
`registry-storage` accounts for in neither direction. All three arrived with `50ff990`, which touches
six files under `packages/registry/`.

**This paragraph went on to say *so the gate this reading was taken for would have been red on that
push*, and `50ff990` was not a push.** `gh run list` holds no run for it, nor for the two commits
after it: the five from `50ff990` to `7c9906c` were pushed together, and GitHub starts one run per
push on the tip. A gate sees `github.event.before .. github.sha`, so the range it would have seen is
`bc88230..7c9906c`. The claim is true at that tip and ADR-0146 carries the replay that shows it -
selection, control green at 407 tests, `S-12` disagreeing, exit 1, against a run of `suites.yml` that
concluded `success`. Corrected here rather than left, because a commit named as a push is a
coordinate that was never the event's.

**Bad, and stated rather than smoothed.** A count this repository publishes as a fact had never been
compared with a reading on any machine. `README.md` says **694 are caught**, derived from what the
batteries *pin* rather than from what a run produces. On a clean checkout of either platform it is
three lower than that before any repair, and the coordinate that was missing is not a machine and not
an operating system: it is that no reading had ever been taken against the declaration.

**Bad.** The reading is of one commit. Nothing here says the batteries agree at the next one, which is
what unit B's gates exist to answer.

## What would reopen this

- A reading at a second commit disagreeing with this one, which is the only thing that could show the
  four disagreements to be less stable than they look.

  **This clause read *Every figure here is of `26e2000`* and that was false twice.** The Windows
  column is of `92f60d8`, which the coordinates above now say; and the causal chain that identified
  `S-12` is **four trees, three of which are neither** - `bc88230` with the corpus, `bc88230` with
  `parse yaml` taken out of it, `50ff990` with the corpus, and `50ff990` as committed. So the
  populations are three and not one: the battery table and the agreement counts, of one tree read on
  two legs; the four disagreements, of the same; and the `S-12` chain, of four.
- `22.18.0` being read, which this deliberately did not do. A disagreement on that leg would say the
  runtime floor is a coordinate of a pin as well, which nothing here claims either way.
- A pin whose verdict depends on the environment arriving a second time, which is what would turn the
  per-cell platform declaration this reading leaves to unit B into a shape rather than one exception.
- The three unit guards of `determinism.test.ts` losing their teeth, at which point the promise itself
  and not only its assembly would be unwitnessed - which is the question this record deliberately does
  not open, and which `ADR-0064` already carries in its `confirmed-by`.

## More Information

The reading was taken on a throwaway branch carrying one workflow file and nothing else. It never
touched `suites.yml`, because a branch runs its own copy of every workflow and editing that file there
would have edited the gate that keeps a branch from deploying and from publishing.

**The branch is gone and the two commits are not.** `evidence/the-batteries-on-two-runners` is
annotated at `92f60d8` and reaches `26e2000` by ascent, which is the fourth use of a mechanism this
repository already had rather than an exception to anything - `CLAUDE.md` struck the clause forbidding
tags when the two rewrites refuted it. What the tag keeps readable beyond the criterion is
`the-reading.yml` itself: a job reading `THE_BATTERIES` with no install and handing the names to a
matrix through `fromJSON` is the shape the gates in `suites.yml` are built on, and it had already run
twice before either of them existed.

`confirmed-by` is empty, and that is a state ADR-0001 admits rather than an omission: this record is a
reading, and what it decides is what the next unit builds. The guards that would confirm it do not
exist yet.
