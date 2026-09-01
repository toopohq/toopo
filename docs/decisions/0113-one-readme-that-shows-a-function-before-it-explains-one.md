---
status: accepted
date: 2026-08-18
governs:
  - mutation/root-documents.ts
confirmed-by:
  - battery: meta
    guard: every-figure-the-readme-gives-about-the-catalogue-is-one-the-contracts-declare
  - battery: meta
    guard: every-contract-the-catalogue-holds-is-named-on-the-readme
  - battery: meta
    guard: every-field-the-readme-quotes-from-a-case-is-the-one-the-contract-declares
  - battery: meta
    guard: every-property-the-readme-names-is-one-the-contracts-suite-collects
---

# One README that shows a function before it explains one

> **The section this record's title names has been superseded by
> [ADR-0114](0114-a-front-page-that-shows-the-registry-and-not-a-function.md), and on none of the
> triggers below.** *What would reopen this* named a sixth contract, per-version READMEs, a second
> language and a retired contract; none of them happened. What was wrong is the population the reading
> below was taken over: the thirteen READMEs measured are libraries of functions, this repository is a
> registry that publishes them under a method which is the product, and the one member of the right
> group — `shadcn/ui`, the same distribution model — was classed as an exception instead of read as the
> comparison. The demonstration of five calls is gone, and with it one of the five guards. **What is
> kept is what was measured rather than what was concluded from it**: the thirteen readings, the
> one-file decision and the age it costs, and the repair of 187 to 157.

## Context and Problem Statement

`README.md` is read by the two audiences that arrive knowing nothing: the visitor to
`npmjs.com/package/toopo` and the visitor to `github.com/toopohq/toopo`. Measured at `919ad88`, it
held **three fenced blocks, all of them `sh`; zero function calls; zero lines of TypeScript.** Its
thirteen lines of code were an install command and twelve lines of `pnpm`, eleven of which are
development commands.

A registry of utility functions whose front page shows no utility function. A reader left it knowing
that the project measures its own tests, and not knowing what the product produces.

**And one of its figures was false.** It read *between them the four installable contracts settle 187
named edge cases*. 187 is the total over all **five**; the four settle **157**, the missing 30 being
`array/group-by@1`, which is refused and has no page. The true figure was already published one folder
away — `packages/site/read-literal.test.ts` has carried *157 of the 187 cases sit on contracts that
have a page* since [ADR-0055](0055-totality-by-the-compiler-beats-a-pass-over-the-data.md) — and
nothing connected the two. `mutation/readme.test.ts` resolved every figure the page gave about the
*instrument* and had no opinion about the catalogue at all, so the one upstream nobody had aimed a
guard at is the one that published a wrong number.

Two smaller faults sat with it. Eight lines on the mechanics of `npx` occupied the third position,
before a reader knew what the product did. And the seven `pnpm run` commands at the foot were a
verbatim duplicate of the block `CONTRIBUTING.md` already carries, addressed to somebody who had
already decided to contribute.

### What the ecosystem does, read rather than remembered

Thirteen READMEs were fetched raw from their repositories and measured with a script, not
characterised from memory: `date-fns`, `drizzle-orm`, `es-toolkit`, `hono`, `lodash`, `ofetch`,
`radash`, `remeda`, `shadcn/ui`, `@sindresorhus/slugify`, `ts-pattern`, `valibot`, `zod`.

| | |
| --- | --- |
| carry no code at all | 2 — `shadcn/ui` (18 lines) and `drizzle-orm`, both signposts to a documentation site |
| first non-shell fence | line 17, 19, 20, 26, 30, 31, 36, 37, 43, 48, 56 — median **31** |
| print an answer beside a call | **8 of 13** (`//=>`, `// Output:` or a `console.log`) |
| carry a block of `npm run` development commands | **1 of 13** — `lodash`, and it builds the distribution rather than listing tasks |

The order they say things in is near-uniform: what it is, the first call, install, docs, contributing,
licence — and `date-fns` and `es-toolkit`, the two closest in kind, both put the call *before* the
install. Nobody enumerates their test suites. `@sindresorhus/slugify`, the direct competitor of the
contract shown here, reaches its first call at line 17 and it is four lines long:
`slugify('I ♥ Dogs') //=> 'i-love-dogs'`.

What is absent is as consistent as what is present: no architecture, no roadmap, no status, and no
attempt to be the documentation.

### One file or two

npm and GitHub render the same file to two readers with different errands, and two files would serve
each better on the day they were written.

Measured at `919ad88` from `registry.npmjs.org/toopo`: the package has four published versions, and
npm holds **one** README for the package — a single top-level `readme`, no per-version copy — taken
from the latest publish. It was byte-identical to the working tree's. So the same file is already read
at two different ages: GitHub shows `HEAD`, npm shows the last publication.

Relative links were checked and kept. `packages/registry/publication.ts` already records why
`repository.url` is the manifest field whose absence would cost most, and that it is what makes the
README's relative links resolve on a package page.

## Considered Options

- Leave the page as it was and correct the figure.
- Two documents: a short `README.md` for npm and a longer one for GitHub.
- One document, rebuilt, showing a call and its answer before it explains anything.

## Decision Outcome

Chosen: **one document, rebuilt.**

A second file would be a second statement of one thing, free to disagree the day either is edited —
which is what this repository refuses on every other surface, and it refuses it here without even the
consolation of a mechanism: no guard can hold two pieces of prose in agreement, and a lint over prose
has been priced and declined four times in `CLAUDE.md`. The drift would also be systematic rather than
accidental, because the two files would be edited by people arriving with different errands, which is
the very difference that argued for splitting them.

**What one file costs the npm reader is named rather than waved at, and it is not links.** It is age:
npm shows the README of the last publication, so an edit reaches GitHub immediately and npm only at
the next version. This unit is an instance — it publishes nothing, so the two surfaces diverge until
something else is released. The cost is bounded by the fact that every figure on the page is derived
from the catalogue or the instrument and cannot drift *within* a version, and it buys the thing a
split cannot: there is one text, and it is the one that was checked.

### A function is visible before anything is explained

`string/slugify@1` is demonstrated in the second fenced block, which opens at **line 17** — earlier
than ten of the thirteen READMEs measured above, level with the eleventh, and the remaining two carry
no code at all. Five calls with their answers, three of them what a reader expects and two of them
what nobody does:

```
slugify('日本語テキスト')      //=> '日本語テキスト'
slugify('Привет мир')        //=> 'привет-мир'
```

It was chosen because its most interesting property fits on one line: the output is Unicode, not
ASCII. A reader arriving from *slugify javascript* expects the opposite, which is why the contract's
own case table puts those rows in a group called `the-surprise-in-front`.

**Every one of the five lines is a row of that table**, and a guard says so rather than the prose. The
comparison is against the case table and deliberately not against the implementation: running
`slugify` in the guard would establish that the page agrees with the code, and comparing against the
table establishes that it agrees with the *specification*, which is the object this project publishes.
`edge-cases.test.ts` ties those two together already, once, where it belongs.

### What a contract is, shown rather than defined

A reader cannot guess it, and it is the product. The page quotes one row whole —
`cyrillic-is-kept`, with its identifier, its group, its answer, its provenance and the first sentence
of its rationale — so that `slugify('Привет мир')` above is visibly not an example somebody wrote for
a README. Every field of the quotation is read off the row by a guard, including which sentence the
ellipsis truncates at, because a quotation truncated by hand is a paraphrase nobody checked.

Beside it the page names two properties by their identifiers, `p2-idempotence` and
`p8-one-separator-per-gap`, and both are resolved against the guards the contract's suite collects.
An address printed on a front page and resolving nowhere is this repository's own recurring defect;
before this unit the README had never carried an address at all.

The table itself is not reproduced. One row and two identifiers are enough to show the shape, and the
contract's page carries the rest.

### Every number is derived

`5 contracts, 4 of them installable and 1 refused` and `157 named edge cases` are computed from the
lifecycles and case tables of the serialised records, never transcribed — so a sixth contract, or a
fifth publication, reddens the page rather than quietly falsifying it. The table of contracts is
resolved separately from the counts, because a count and a list are two claims and the count is the
one that stays true while the list rots.

The mutation figures are unchanged and keep the guard they already had. The limits — one
implementation per contract, no submissions, TypeScript only, a published major frozen for life — are
kept in full; they are the best thing the page has, and the only thing that moved is where they sit.

### The contributor block is gone rather than shortened

`CONTRIBUTING.md` already carries the identical seven commands. What replaces the block is a sentence
pointing there, which is what twelve of the thirteen READMEs measured do, and what removes a
duplication rather than relocating one. The two replay commands stay, because they belong to the
reader's own verification and not to onboarding: they are what turns the mutation figures from an
assertion into an observation, which the page says in those words.

## Consequences

- The front page shows a function call and its answer, and every answer on it is checked against the
  contract that settles it.
- A figure that had been false for a year is right, and is arithmetic rather than a word.
- One duplication is removed and none is created. `mutation/root-documents.ts` exists because the
  README guard needed the upstream `contributing.test.ts` had been building privately since it was
  written; both now read one function.
- `mutation/readme.test.ts` has two upstreams where it had one, and its header says so. A future
  figure about a third thing is a third block, not a wider claim in the first.
- The page is longer than it was in prose and shorter in ceremony: the seven development commands and
  the eight lines on `npx` are gone, and what replaced them is code.

## Confirmation

**Four guards, where there were five, and the one that went is named rather than dropped quietly.**
`every-answer-the-readme-shows-is-a-case-the-contract-settles` read the demonstration of five calls, and
there is none; [ADR-0114](0114-a-front-page-that-shows-the-registry-and-not-a-function.md) carries what
replaced that block and the two guards over it.

What is left, all under `meta` and named in `confirmed-by` above, establishes that the two catalogue
figures equal what the records give, that every contract the catalogue holds is named on the page, that
every field of the quoted row is the one the contract declares, and that both properties named resolve
to guards the contract's suite collects.

**They are guards that run and not guards shown to catch something**, which is
[ADR-0001](0001-record-decisions-in-madr-format.md)'s distinction and applies to everything under
`meta`: no battery injects into `mutation/`. What stands in for the missing measurement here is that
the first of the five was **born red** — it is what produced the 157 against the page's 187 — and the
other four were seen red on their real conditions before this record was written, with the reds in the
unit's commit message.

**What no guard here establishes** is that the prose is true. The sentence about writing systems, the
claim that a library which transliterates has picked a scheme on its users' behalf, and the
description of what a contract is are argument, and they are held by the contract they describe rather
than by anything executable. The demonstration is checked; the paragraph under it is not, and that is
the same division [ADR-0018](0018-a-published-count-carries-its-coordinates.md) draws between a figure
and a sentence.

The import line the page prints — `./src/lib/toopo/string/slugify.js` — is also unguarded. It is the
shape `packages/cli/report.ts` produces and [ADR-0110](0110-a-feature-lands-as-a-file-and-its-folder-sits-beside-it.md)
settled, transcribed here; resolving it would mean building an `InstalledEntry` and a `Configuration`
inside a guard about a Markdown file, and the failure is visible to the first reader who copies it.
Declared rather than closed.

## What would reopen this

- A sixth contract, or a fifth publication: the counts redden by arithmetic, and whoever repairs them
  decides whether a table of six still belongs on a front page.
- npm rendering per-version READMEs, or GitHub and npm diverging in what they accept. The one-file
  decision rests on there being one text at two ages; a difference in *format* is a different question
  from a difference in age.
- A second language in the catalogue. `typescript/...` is written on the page five times, and a
  registry serving two would have to decide whether the front page shows one or both.
- The demonstrated contract being retired or superseded by `name@2`. `DEMONSTRATED` in
  `mutation/readme.test.ts` is the single line that moves.

## More Information

- [ADR-0054](0054-make-the-omission-impossible.md) — why `RootDocument` is a union and not a string.
- [ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) — the lifecycle the installable count
  reads, and why it is not in a snapshot.
- [ADR-0112](0112-the-prose-that-no-commit-authored.md) — the reading that measures whether a
  paragraph of this repository has been read whole by anybody.
