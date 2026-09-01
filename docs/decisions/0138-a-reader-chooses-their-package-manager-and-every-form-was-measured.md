---
status: accepted
date: 2026-08-19
governs:
  - packages/registry/address.ts
  - packages/site/contract-page.ts
  - packages/site/start.ts
confirmed-by:
  - battery: site
    guard: the-ways-a-page-hands-over-are-the-declared-ways-and-the-one-it-prints-runs
  - battery: site
    guard: every-command-the-site-tells-a-reader-to-run-carries-the-invocation
  - battery: site
    guard: a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing
---

# A reader chooses their package manager, and every form offered was measured against the published package

## Context and Problem Statement

A contract page prints one install command. The owner asked for what the registries of this
distribution model offer — a choice of package manager, with the command rewritten for the one you
use.

The request is ordinary and the risk in it is not. **This repository has already shipped a command
that does not run**, on the surface where somebody is being told to run it: four published surfaces
printed the bare `toopo`, which answers `command not found` for anybody who has installed nothing —
which is exactly who a contract page is for. It was the first thing a visitor tried and it failed.
[ADR-0054](0054-make-the-omission-impossible.md) is the treatment; `THE_INVOCATION`
is the constant that came out of it, and it carries three measured situations in its own comment.

Offering four managers multiplies that surface by four. Three of the four spellings had never been
run by anything in this repository.

## Considered Options

### Refused: transcribe the four forms from another registry's page

The cheapest, and it would have shipped a broken one. **Measured on 2026-08-19 against `toopo@1.0.4`
as npm serves it**, each in its own empty project:

| form | result |
| --- | --- |
| `npx toopo add string/slugify` | exit 0, file written |
| `pnpm dlx toopo add string/slugify` | exit 0, same digest |
| `bunx toopo add string/slugify` | exit 0, same digest |
| `yarn dlx toopo add string/slugify` | **exit 1, nothing written** |

The three that work write a file hashing to `1a8ae9d1…`, which is the blob this catalogue announces —
so they do not merely run, they land the same bytes.

`yarn dlx` fails and Yarn names its own cause: it applies its builtin compatibility patch to
`typescript`, and the patch fails with `ENOENT … lstat '/node_modules/typescript/lib/_tsc.js'`
because TypeScript 7 does not hold that file. `typescript@7.0.2` is this package's one runtime
dependency, which is what puts it in the way.

**The control is what makes that a cause rather than a guess.** `yarn dlx cowsay` in the same shell,
the same minute, exits 0 and prints its cow. Yarn works on that machine and fails on this package.
Without that reading the failure could have been Yarn's, and a cause named without it is what
[ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) refuses.

### Refused: omit yarn

The quiet option, and it sends a reader to try it. A manager missing from a list of four reads as an
oversight rather than as a refusal, and the reader who notices goes and runs the obvious spelling —
arriving at the same failure by a longer road, with nothing to tell them it was known.

This catalogue publishes the contracts it turned down with the measurement each refusal rests on, and
publishes every mutant its own suite failed to catch. **The same treatment applies when the thing
refused is its own.**

### Refused: keep the page static and print four commands at once

Four commands stacked is four times the card's most important block, three quarters of it noise for
any one reader, and it makes the page choose nothing. It also does not solve the reader it exists
for: somebody with only Bun still has to know which line is theirs.

### Chosen: a declared table, handed over as data, with the choice built in the browser

`THE_WAYS_TO_RUN_IT` sits beside `THE_INVOCATION` in `packages/registry/address.ts`, because that
file is already where *the words a reader types* are declared and measured. Each entry carries a
manager, a spelling, and — when it does not run — the measurement that refused it. The page hands
the table over in `data-ways` and `start.ts` builds the control, which is the arrangement the
masthead's search already has.

`deno` is absent because it was **not measured**, not because it fails: it is not on the machine the
readings were taken on. A fifth entry inferred from the shape of the other four is precisely what
this table exists against.

## Decision Outcome

**A reader chooses their package manager, and the site offers no form it has not run.**

### The fourth thing on this site that needs JavaScript, and the argument is a capability

Three exist: the playground runs a reader's own input, the search answers a query, the copy control
writes to the clipboard. Each buys something static HTML cannot do. A manager selector could easily
be a fourth that buys only comfort — and if it did, it would not be worth the rule it sits under.

It is not. **`npx` requires Node.** A reader who has only Bun cannot run the served spelling at all,
and `bunx` is the one form that works for them. That is a capability, of the same kind as the other
three.

**What is not claimed is the reverse.** Whether `npx` fails in an environment with no Node was *not
measured here* — no such machine was available — so the argument rests on Bun being reachable rather
than on npm being unreachable. Stated rather than assumed, because the tempting version of this
sentence is the one nobody checked.

**The rule that governs all four holds.** Without JavaScript the page carries one command as prose,
it is the spelling measured to work whether or not anything is installed, and there is no control
that does nothing. A reader without JavaScript is told nothing about yarn — and is offered nothing
about yarn either, so the page makes no claim it cannot keep.

### What the guards reach, and what they do not

`the-ways-a-page-hands-over-are-the-declared-ways-and-the-one-it-prints-runs` asserts two things that
fail differently: the table a page hands over is deep-equal to the declared one, so a fifth manager
cannot be typed into a template; and the spelling the page prints is the invocation, so no edit makes
the served command a refused one. Both were seen red before they were believed — the first on a
`deno` entry added to the page, the second on the page printing `yarn dlx`, which reddens
`every-command-the-site-tells-a-reader-to-run-carries-the-invocation` as well.

**What no guard here reaches is whether a spelling in that table really runs.** That is a measurement
against the published package, taken by hand, and it is written in the table's own comment with the
versions it was taken at: npm 11.12.1, pnpm 10.24.0, bun 1.3.8, yarn 4.6.0 through corepack 0.34.6.
A guard implying otherwise would be one this repository could not keep, and `CLAUDE.md` carries the
entry rather than this record pretending to cover it.

### A defect this removed on the way past

`copyControl` read the command **once, when it was built**, and the comment explaining why was right
about the defect it was avoiding: after the button is appended, the element's text is the command
plus the word `copy`. Reading once stopped being safe the moment the command became something a
reader can change — a control that captured the string at build time would go on offering the first
spelling for ever. It now reads the text node at the moment it is used, and `theCommandIn` is the one
statement of where the command lives.

## What would reopen this

A reading that `npx` fails where no Node is installed would move the capability argument from one
manager to two, and is the measurement this record is missing rather than one it refuses.

A machine with `deno` on it makes a fifth entry measurable, and the table is written to take one.

And the whole of the yarn row disappears the day this package stops declaring `typescript` as a
runtime dependency — which is a decision about the archive, not about the site, and is its own unit.
