---
status: accepted
date: 2026-08-17
decision-makers: Mathis Perron
governs:
  - packages/registry/serialise.ts
  - packages/registry/contract-record.ts
  - packages/registry/the-catalogue.ts
  - packaging/reachable.ts
confirmed-by:
  - battery: registry-storage
    guard: the-shared-surface-is-what-the-harness-reaches
  - battery: registry-storage
    guard: a-changed-shared-file-moves-the-digest
  - battery: registry-storage
    guard: a-fetched-harness-resolves-every-import-it-carries
  - battery: registry-storage
    guard: the-snapshot-names-no-blob-the-registry-cannot-serve
---

# A contract freezes what its guards call, not only the files it owns

## Context and Problem Statement

Permanent rule 6 says a published version is frozen for life. [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md)
made that checkable — a binding records the commit it was published from and the frozen half is rebuilt
there and compared — and `publishContract` states the consequence at length: *every byte of every file
the contract declares, all seven of them, comments and blank lines included.*

Seven files. Four of them import a module that is not one of the seven.

```
contract.ts          -> packages/catalogue/every-contract.ts
edge-cases.ts        -> packages/catalogue/every-contract.ts, packages/catalogue/identifier.ts
edge-cases.test.ts   -> packages/catalogue/every-contract.ts
properties.test.ts   -> packages/catalogue/every-contract.ts
```

`harnessOf` hashes the folder. Nothing hashed what the folder calls.

### Measured at `e8f68ca`, three perturbations, one at a time

**The verification could be emptied with no address moving.** `expectUniversalPropertiesAnswered` was
replaced by a body that asserts nothing, and `npm run ledger` was asked again:

```
before   typescript/string/slugify@1   8753bb972e614de3bdb6a4c27cd227d0a6bdc617c5ba5c6c5eabb392a23a78a1
after    typescript/string/slugify@1   8753bb972e614de3bdb6a4c27cd227d0a6bdc617c5ba5c6c5eabb392a23a78a1
```

All eight lines identical to the byte. Then the same defect the emptied guard exists to refuse was put
into a contract — `deterministic` declared `applicable: false`, while the call site still passes an
inapplicable list of two — and the guard was run under both versions of the shared file:

```
shared guard emptied     Tests  1 passed | 16 skipped
shared guard restored    ×  universal-properties-answered
                         +    "deterministic"
```

**Shared data was already covered, and that is what makes the finding precise rather than sweeping.**
One letter changed in `NO_AMBIENT_OUTPUT_FINDING` moved all four contract digests — `8753bb97…` to
`40cab03f…` for `string/slugify@1`. A constant interpolated into a declaration reaches the record and
is frozen; the functions the test files *call* reach nothing the record carries. The split is not
between *this repository's code* and *somebody else's*, it is between **what a contract says** and
**what checks what it says**, and only the first was frozen.

**A guard address of all five contracts could be renamed with no digest moving.** `CASE_TABLE_IS_JUSTIFIED`
was changed from `every-case-is-justified` to `every-case-carries-a-reason`; the ledger did not move.
The convention says an address is *frozen with the contract's major*. Four of the catalogue's own guard
addresses live in shared code and were frozen by nothing.

### The other half, which is the auditor's

Permanent rule 5 makes auditability the product, and `needs.ts` writes the need out: *run a contract's
own suite against an implementation, without asking anyone*, requiring *every file of the harness, as
bytes, each addressed by its digest*. `endpoints.ts` answered it with *the harness digests it names
cover every file transitively.*

A reader who fetched every file the snapshot named held four files importing
`../../../../packages/catalogue/every-contract.js`, which was a blob of no snapshot, an address of no
endpoint, and absent from the playground's module map. **The suite could not resolve its own imports.**
Both halves are one hole: what is outside the digest is what nobody serves, because the emission serves
what the snapshots name.

## Considered Options

- Leave it, and record the gap in the list of what nothing keeps.
- Inline the shared guards back into each contract folder, so that the seven files are self-contained.
- Declare what a contract reaches outside its folder, freeze it with the contract, and serve it.

## Decision Outcome

Chosen: **`sharedHarness` on the contract record and inside the frozen half, derived from a walk over
what the harness imports and refused on any disagreement with a declaration.**

Leaving it was refused on the first measurement. A declaration that a published version is frozen for
life, with the verification outside the freeze, is this project's central promise held to the letter and
not in substance — and it is the failure that costs most, because every lockfile in the world would be
holding a digest that means less than it says.

Inlining was refused because it is [ADR-0080](0080-what-may-live-in-the-catalogue-package.md) reversed:
five copies of four guards, which is the duplication the catalogue package exists to remove, bought to
avoid modelling one field.

### The declaration and the walk are two statements, and the disagreement is the guard

`THE_SHARED_FILES` in `the-catalogue.ts` names the files; `sharedHarnessOf` takes the transitive closure of
the relative specifiers written in the declared files, keeps what lands outside the folder, and refuses
either direction. A list derived from the walk could not disagree with the walk — the shape `files` and
the folder listing already have one level down, and the reason `harnessOf` is written as it is.

**Both directions are real and they are not the same failure.** Reached and not declared is the defect
above: unfrozen code deciding a frozen contract's verdicts. Declared and not reached freezes bytes the
contract does not depend on, so an edit somewhere it never reads rebinds its address for nothing.

**The closure is taken over sources and not over the compiler's output**, which is the opposite of what
`packaging/reachable.ts` does and for the opposite reason. `verbatimModuleSyntax` erases a type-only
import from the output, and a type-only import is *not* erased from what a contract's guards check:
`npm test` runs with `--typecheck`, thirteen `@ts-expect-error` directives sit in the five
`signature.test-d.ts`, and `Provenance` — imported `import type` by all five `edge-cases.ts` — is a
template-literal type constraining what a case may claim about where it came from. A walk over the
output would have missed `identifier.ts` on every contract.

### One parser, reached, and the file does not move

ADR-0026 forbids the second copy of a parser, so `specifiersIn` and the walk are exported from
`packaging/reachable.ts` and what differs between the two callers — how a specifier becomes a file —
is passed in.

**The module stays under `packaging/` although two folders now read it, and that is a trade rather than
an oversight.** The layering would read better one folder up. What decides against moving it is the
instrument: A-07 of the `packaging` battery edits `reachable.ts` by name to measure that the parser sees
a specifier leaving its folder, and a battery may edit only the folder under measurement — so moving the
file makes that cell unreachable from the battery whose subject it is. A measured cell is worth more
than a tidier import. `reachable.ts` imports nothing but `node:fs` and `node:path`, so there is no cycle
to pay for it.

### What this costs, stated rather than discovered

**Editing either shared file rebinds all five contract addresses at once.** ADR-0080 wrote that sentence
when the package was created — *a field added here, a literal removed here or a name changed here is not
one edit: it is a breaking change to the whole catalogue at once* — and nothing computed it. This unit
does not invent the rule; it makes the bill arrive. After publication the only repair to either file is
five new majors, which is the price of the bar that record sets for putting anything there.

### What is deliberately left outside, and what it would cost to bring in

`vitest` and `fast-check` decide verdicts too, and no digest here names them. They are bare specifiers,
so the walk does not see them, and that is the boundary rather than an oversight.

**Freezing them was priced and refused.** Measured: 30 releases of the `vitest` 4.x line and 15 of the
`fast-check` 4.x line exist, both at their head as of this record. Inside the digest, each of those 45
releases would have rebound five addresses, so permanent rule 6 would put this catalogue somewhere past
`@46` — and a security patch in a test runner would cost a major on every contract in the registry. A
digest that moves with a third party's release cadence is not a statement about the contract.

**What the gap actually leaves open is smaller than it looks, and it is a question rather than a
promise**: an auditor who reproduces this suite and gets a different verdict cannot tell whether the
contract moved or their environment did. What answers that is a declaration and not a freeze — the exact
resolved versions a contract's verdicts were last observed under, carried as a **standing** field, which
is what `CONTRACT_STANDING_FIELDS` already describes as *anything a later measurement attaches to an
artefact published without it*. It costs one entry there, one in `FIELD_MAP`, one line of projection, and
it is read from the lockfile rather than typed. **It is not built here**, and what it would be worth
saying plainly: it is `documentary`, it keeps nothing, and calling it a closure of this gap would be the
dressing-up this repository's own list of what nothing keeps exists to refuse.

## Consequences

- A published contract's digest covers what its guards call. Emptying a shared check now moves five
  addresses, which is a re-publication and not an edit.
- An auditor who fetches every file a snapshot names can resolve every import those files carry.
  `a-fetched-harness-resolves-every-import-it-carries` asks it of the served bytes rather than of the
  working tree, because a file this repository holds and does not serve is exactly the hole.
- `endpoints.ts` no longer claims more than it does. *Cover every file transitively* is now true of what
  this repository writes, and the runner is named as what it excludes.
- ADR-0080's `Confirmation` said *nothing guards this, and nothing could*. Its argument was about
  whether something **belongs** in that package, which is still unguarded and still a judgement; the
  freeze it named as what keeps the rule was not happening at all. That section is corrected in place
  with the measurement, rather than deleted.
- Two anchors of `registry-storage` moved with `hashedFile`, which the two lists now share. I-01 and
  I-08 name the same two defects — a working-tree read, and a second read for the size — against the
  parameters the shared reader has.

**And one thing `npm run anchors` cannot see, found by this unit.** It checks that a cell's `find` text
still occurs in its file; it never reads the `replace`. Both anchors here matched again after being
updated while I-01's replacement still named `directory` and `name`, which no longer exist — a mutant
that would have failed to compile rather than injecting the defect it describes, with the anchor check
green. It is recorded in `CLAUDE.md` among what this repository declares and nothing keeps.

## Confirmation

Four guards, each seen red on its own failure condition before being trusted:

- **the registry stops serving the shared surface** — `servedFilesOf` reduced to the harness, which is
  the state this repository was in at `e8f68ca`. Two red, naming the defect file by file: 26 unresolved
  imports across the five, of the form `contracts/typescript/number/parse/properties.test.ts imports
  packages/catalogue/every-contract.ts, which the registry does not serve`, and ten blobs named by a
  snapshot that nothing could have handed over.
- **the shared surface leaves the frozen projection** — 14 red across two files, and 12 of them are the
  schema's own accounting rather than this unit's: `the-frozen-half-and-the-standing-half-partition-a-contract`
  reports `[ 'lifecycle', 'sharedHarness' ]` against `[ 'lifecycle' ]`, and
  `every-frozen-field-of-a-record-moves-the-digest` names `sharedHarness`.
- **the walk stops refusing** — one red carrying ten faults, both directions named for all five, which
  is what folding the five into one guard bought: under five parameterised guards the first assertion
  masked the second and only one direction was ever shown.
- **the walk stops resolving a `.js` specifier to its source** — all four red, reporting `declared and
  not reached: packages/catalogue/every-contract.ts, packages/catalogue/identifier.ts`. This is the one
  that establishes the walk is not vacuous: a closure that found nothing would satisfy *reached implies
  declared* for ever.

### What the instrument charged, after all seven suites were green

The suites do not establish that a guard can catch anything, and this unit paid for that twice in one
replay.

**The census refused first**, at the calibration of the nineteenth battery, 34 minutes in:
`packages/registry/shared-surface.test.ts: collected 4, and the census does not name it`. It is the
composition check `CLAUDE.md` records `assertWholeSuiteRan` as lacking — 355 against 355 would have been
silent while four guards of the contract under measurement sat outside the declaration.

**Then the battery refused two silences**: nothing reddened `the-shared-surface-is-what-the-harness-reaches`
or `a-changed-shared-file-moves-the-digest`, and neither was declared out of reach. Two cells answer
them, and both were needed rather than one:

- **I-61** injects the state this repository was in before this record — the frozen half carrying the
  seven files a contract owns and forgetting what its guards call. The projection is emptied rather than
  dropped, because dropping the line leaves `filesNamedBy` spreading `undefined` and the kill arrives as
  a TypeError from a third module: a red about a crash rather than about a freeze.
- **I-62** keeps the declaration and makes the walk decorative, which is I-02's shape one level out.
  `the-shared-surface-is-what-the-harness-reaches` is red *alone* on it, so that guard is load-bearing
  rather than merely present.

The other two were already witnessed and neither by a cell written for them: I-01 reddens
`a-fetched-harness-resolves-every-import-it-carries` by hashing the working tree instead of the served
bytes, and I-04 reddens `the-snapshot-names-no-blob-the-registry-cannot-serve` by blanking harness
digests. That is the argument for both existing, arriving from the instrument rather than from the
author.

### One guard over the five, where the file beside it is five guards

`served-files.test.ts` writes `an-undeclared-file-is-refused` as five addresses and this file writes
four single guards, and the difference is in the subject. A contract declares its **own** file list and
the five do not agree — four carry seven names, `array/group-by@1` carries nine — so that guard is five
claims. `THE_SHARED_FILES` is one list for all five and every defect these can catch is a defect in one
shared reader, so five addresses would be one claim asserted five times: the slug would be a rendering
of the loop variable rather than an address, which is what [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md)
refuses. The contract is named in the fault instead.

**It also turned out to be the only shape a decision can cite, and that is a finding rather than a
convenience.** `guardsCollectedIn` reads a guard's *written* title, so an `it.each` guard is collected
as `…-%s`; `guardAddressFaults` requires a frozen identifier and `%s` is not one. So **no decision in
this repository can name a per-contract guard in `confirmed-by`**, while [ADR-0001](0001-record-decisions-in-madr-format.md)
requires that field to be present and non-empty. Measured: zero of the records cite one today, and the
first attempt to do so here produced nine faults from
`every-guard-a-decision-names-is-one-its-suite-collects`. It is recorded in `CLAUDE.md` among what this
repository declares and nothing keeps, because the collision is silent — a decision whose subject is
per-contract has no way to say what confirms it, and nothing tells its author that.

## What would reopen this

- **A contract reaching something that is not a file** — a JSON import, a wasm module, a generated
  file. The walk resolves a specifier to a path and hashes it; anything reached by another mechanism is
  outside it, exactly as the runner is.
- **A second language.** The closure is written for `verbatimModuleSyntax` and `.js` specifiers naming
  `.ts` files, which is TypeScript's shape and not the registry's.
- **A shared file that is not shared by all five.** `THE_SHARED_FILES` is one list because the five
  reach one set; `the-sixth-contract.test.ts` already carries the other case, a record whose shared
  surface is one file, so the schema does not need to change when it happens.
- **An auditor asking about the runner.** The standing field priced above is not built, and the event
  that would build it is somebody reproducing this suite and disagreeing with it.

## More Information

- [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) — the freeze made checkable,
  and the record whose `publishContract` sentence this one completes.
- [ADR-0080](0080-what-may-live-in-the-catalogue-package.md) — the bar for the shared package, and the
  prose sentence this unit turned into arithmetic.
- [ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) — why `specifiersIn` is exported rather
  than copied.
- [ADR-0043](0043-derive-the-sentence-from-the-fact.md) — a sentence that cannot be false is worth more
  than a sentence somebody checked, which is what a walk buys over a list.
