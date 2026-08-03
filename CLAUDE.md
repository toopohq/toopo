# Toopo

A registry of utility functions verified against public, executable contracts, distributed as
source code copied into the user's codebase.

A **contract** is the complete, executable behavioural specification of one function: identity,
TypeScript signature, property-based invariants, named and settled edge cases, and benchmark
profiles. The contract is owned by the registry; implementations compete underneath it and are
interchangeable.

The product of this project is the contract, not the utility code. **If the verification is
decorative, the project has no reason to exist.** That sentence is the acceptance criterion for
every change made here.

## Current stage

**The five hand-written prototype contracts are done, and with them the stage that produced the
format.** They were written with no shared abstraction so that the format would emerge from
repetition instead of being designed up front; what they turned out to repeat identically now lives
in `catalogue/`, and the checklist a sixth contract is measured against is `contractAnatomy` in that
same file. The uncertainty of this project was in the contract format, and it has been spent.

Next comes the registry — data schema, immutable storage, read API, publishing tool — and beside it the
conformance controller. That controller does **not** make `contractAnatomy` executable, and the triage
below says why: three of its eleven entries are settled by a syntax tree, four need a module a stage
has already vetted, and four are a reader's for ever. No API, CLI or website exists yet, deliberately
and in that order.

- The five are written: `number/parse@1`, `date/add@1`, `array/group-by@1`, `string/levenshtein@1`,
  `string/slugify@1`. The third is a format prototype that will not be published, because ES2024
  shipped `Map.groupBy` and it answers what the contract specifies. The project specification records
  that refusal and the rule it establishes. The fourth is the first whose properties are strong by
  nature — the axioms of a metric — and its table is a third the size of the first's as a result. The
  fifth is the first with no oracle of any kind: measured over fifty-seven samples, the four most used
  slug libraries agree on seven, so nothing about its answers is true and every one of them has to be
  argued for.
- Project name: Toopo. CLI command `toopo`, lockfile `toopo.lock`.

## Error convention — settled, catalogue-wide

A fallible function returns `T | null` and publishes a diagnostic export **beside** it:
`describe<X>Failure(...)`, returning a reason literal owned by that contract, or `null`. No type is
shared between features — each contract declares its own literals.

Every contract that publishes a diagnostic carries a **coupling property**: a call fails exactly
when it has a description. Without it the two exports can drift, and an implementation that
optimises the answering path while leaving the diagnostic one alone will diverge on any input the
named cases do not cover.

Three forms were built and measured across both prototype contracts. The union
`{ ok, value } | { ok, reason }` ties this one on detection, so the error convention is not a
verification question. Read that tie at the strength it was actually measured: on `date/add@1` it is
a full-battery tie, every mutant under both lenses; on `number/parse@1` it rests on four mutants
under one lens. What decided it is that this form is **additive**: a contract can ship
`name@1` with no diagnostic and gain one later without breaking anyone, whereas putting the reason
in the return type freezes it into the major version on day one. Known costs are recorded in the
project specification, together with what would invalidate the decision.

Those measurements are replayable, at three annotated tags whose messages say what each one proves:
`evidence/error-convention-round-1` (two forms, six call sites), `evidence/error-convention-round-2`
(three forms on both contracts, and the batteries the detection tie comes from) and
`evidence/error-convention-round-3` (the callers that need the value and the reason at once). They
are tags rather than branches because the conclusion is on `main` and nobody should be reading three
dead working states — but a published sentence with no replayable measurement behind it is an
opinion, which is the one thing this repository sells against.

**The reason set of a contract is frozen with its major version.** Adding a literal, removing one,
or splitting one all break a caller that switches exhaustively — so the partition is chosen once,
deliberately, and a later change costs `name@2`. The additivity that decided this convention covers
gaining a diagnostic, not reshaping one.

## Case identifiers — settled, catalogue-wide

Every case of block 4.4 carries an `id`: a **name**, in kebab-case, unique within the contract and
**frozen with its major version**. The guards that assert a case are addressed by it — see
*Guard identifiers* below, which generalised this rule to every guard in the catalogue.

A name, and not a rendering of the case's own data. `"1e400" -> overflow` restates the row it
addresses, so it can be wrong about it, and §4.4 makes every case one line of public documentation —
where false documentation is worse than none. The published line goes on being rendered from the
data; the identifier only addresses the case.

The measurement that forced it: the two fallible contracts titled their guards out of the very data a
specification battery injects into, so a mutant that changed an expectation reddened a guard under a
title the unmutated contract does not contain, and left the calibrated one silent — a hundred guards
of `number/parse@1` and eighty-six of `date/add@1` declared silent as an artefact of the apparatus.
`array/group-by@1` carried an explicit name and did not have the problem.

The reason that outlives the instrument is the registry's: an API response citing a case, a URL
anchor on a contract's page, a validation report naming the case a submission failed — each needs an
address, and an address that changes breaks links. Renaming one therefore costs `name@2`, exactly as
reshaping a reason set does.

## Guard identifiers — settled, catalogue-wide

Every guard carries an **identifier**: a name, in kebab-case, unique within its contract and **frozen
with its major version**. A guard's title is that identifier, then ` :: `, then a sentence for
whoever reads the runner's output — or the identifier alone, when it says everything. Batteries pin
identifiers, attribution reports identifiers, and `calibrate()` refuses a guard whose title carries
no well-formed one, or two guards of one contract answering to one.

A guard needs two things and they are not the same object. It needs an **address** — a battery pins
it, an attribution cites it, and a validation report will one day put it in front of a submitter. And
it needs a **sentence**, because test output is read by people. One string doing both means every
reword breaks a pin, and it means a title rendered from the contract's own data renames the guard a
specification mutant reddens.

That second failure was measured rather than argued. LS-13 of `string-levenshtein-spec` relabels the
`identical` benchmark profile as `far` — a profile that claims to time the fast path, published as
timing the worst case. Before this rule its guard reddened under `identical - every sample is far`, a
title the unmutated contract does not contain, so calibration never saw it and attribution had
nothing to attribute. The battery passed, reported thirteen of thirteen defects killed, and went on
calling that region one no mutant probes — while a mutant probed it. The refusal the instrument is
built around, *a declaration a mutant contradicts is stale*, could not fire. After the change it
fires, the declaration had to go, and `identical` left the unprobed list. **That is the one class of
defect these identifiers make detectable.** The other 466 guards are a tidying for the registry, and
it is recorded as one rather than dressed up.

**A name, never a rendering of the data the guard asserts over** — the rule block 4.4 already carries
for a case identifier, restated here because guard identifiers were created without it being reapplied
to them, and nine of them had drifted. The test is mechanical: *the identifier and the assertion carry
the same number, so the two can be edited apart.* `three-needs-are-answered-without-the-api` listed
four, and its own comment said that a fourth appearing silently would mean something had moved off the
API without anyone saying so. A fourth appeared, the list was updated, the name was not, and the guard
written to detect a silent change was blinded by its own name. Renaming is the repair rather than
correcting the number, because a name that has to be edited whenever the data moves is not an address.

**A count and a state are not the same thing, and this is what separates them: falsifying the name and
reddening the guard are the same event, or they are not.** An identifier that renders a *state*
disappears with the claim it carries — `nothing-is-measured-yet` asserts `toEqual([])` three times and
holds no number to drift from, so the day a figure is measured the guard is retired rather than
renumbered. An identifier that renders a *count* survives the data: the list grows, the assertion is
edited, the name stays, and it has become a lie. That is the rule to apply to the next case, and it
decides it without a second opinion.

What this does *not* forbid is a number that names the subject of a case rather than tallying a
collection — `two-decimal-points`, `p4-triangle-inequality`, `signature-accepts-two-strings`. An
identifier derived from a *frozen* address stays an address, which is what `${id}-described` and the
`eachContract` slug are.

**A benchmark profile's name is frozen with the major version**, for the reason a case identifier and
a guard identifier already are: the registry will cite it in a benchmark figure, the site will make it
a URL anchor, and a validation report will name the profile a submission failed. It was already an
address in fact — the five specification batteries pin `profile-<name>` identifiers and one of them
documents `profile-identical` as *the address* in as many words — and it was the only derived
identifier in the catalogue that nothing declared frozen. Twenty-eight guards were left alone: the gap
was the missing declaration, not the names.

**And the freeze is a policy, not a mechanism, which is said here rather than discovered later.** A
mutant that renames a profile still renames the guard built from it. Where a battery pins that
identifier the rename is caught, because the pinned `by` no longer matches; where it only appears in a
silence declaration, what the rename produces is a declaration naming nothing and a new unaccounted
silence. Neither is a guard over the freeze itself. `benchmarks.profiles[].name` is therefore
classified `one-directional` in `field-map.ts` — a real declaration that nothing here enforces — and
what closes the class for every address at once is the pre-flight refusal of a pin naming a guard no
guard carries, recorded in the launch debts below.

**Uniqueness is per contract.** The instrument can only break inside a contract — a battery injects
into one folder, and attribution already filters guards to the contract under measurement — and the
registry will address a guard by the pair `(contract identity, guard identifier)`, exactly as it
addresses a case. A globally unique identifier would encode the contract into the name, duplicating
what the pair already carries and making a contract rename a rename of every guard. The cost is
stated so it is not discovered later: **the registry schema must always carry the pair, never the
identifier alone.** Fifteen identifier strings are held by more than one contract today.

**Three identifiers belong to the catalogue rather than to a contract**, and only three:
`every-case-is-addressed`, `every-case-is-justified` and `universal-properties-answered`. Those are
not five guards that resemble each other — the helper *is* the guard, one function applied five times
— so each is a constant exported from `catalogue/every-contract.ts` and a contract cannot rename it
locally. Renaming one costs a major on the whole catalogue, the discipline everything in that file
already carries. The other twelve shared strings are five contracts asking the same question about
different data: *resemblance is not duplication*, the rule the catalogue already applies to
`outputsAreEqual`, so each contract owns its own and two may coincide.

**The separator is ` :: `, and it is ASCII on purpose.** It cannot occur inside an identifier,
because an identifier has no spaces, so the split cannot be wrong. An em dash reads better and would
have been the first non-ASCII code point in any title in the catalogue: measured, none of the 467
carries one, and `number/parse@1` is where the cost of a stray non-ASCII character in a source file
was paid once already.

**What this does not cover, and it is not an oversight.** `npm test` will never see a duplicate
identifier: a guard cannot enumerate the tests vitest collected, so the refusal lives in
`calibrate()`, where the identities are already gathered. A contributor who writes a duplicate learns
it from the first battery they run, not from the suite.

## What a property settles — settled, catalogue-wide

A property that pins an exact answer on a generated family settles **exactly the decisions its
alphabet represents, and no others**. So for every decision a contract publishes about what its
answer should *be* — rather than about the shape of that answer — a reviewer can check that one of
two things is true: a representative of the decision is in the arbitrary, or a named case of block
4.4 settles it. The battery has to carry a mutant that says which, because the two look identical
from the outside.

Measured on `string/slugify@1`, whose battery reads the whole of block 4.4 blind on a second lens.
Twenty-one of its twenty-two behaviour defects still die on that column: shape properties turn out to
carry far more of the content than the table was written expecting. The twenty-second transliterates
Cyrillic, and it answers a well-formed, lower-case, idempotent slug that retains a subsequence — so
every property is satisfied, every benchmark profile keeps its class, and one guard in the whole
suite kills it: a named case. The control is a mutant folding the sharp s, the same kind of curation
decision from the same table the ecosystem writes, which dies on both columns — because the arbitrary
that draws well-formed slugs carries a sharp s and carries no Cyrillic.

What this forbids is the reading that a property is strong and a case is bookkeeping. A property is
as wide as its alphabet. Widening that alphabet is how a decision becomes property-checkable, and it
is a deliberate act with a cost — every symbol added is a decision the contract can no longer change
without the property going red, which is exactly what freezing means.

## Replaying a divergence — settled, catalogue-wide

A contract that answers differently from what the ecosystem or the language answers carries a guard
that **replays** the divergence on the rows where it happens, rather than asserting it in prose. The
guard names the exact set of cases that diverge, so a specification drifting back towards the common
answer takes the measurement refusing that answer with it, and the drift is red instead of silent.

Three contracts carry one, in three shapes: `array/group-by@1` in a file of its own against
`Object.groupBy`, `string/levenshtein@1` by recoding its table into UTF-16 code units,
`string/slugify@1` by narrowing its alphabet to ASCII. The shapes differ because what is being
diverged from differs; what is identical is that the divergence is measured on the contract's own
table rather than described.

`number/parse@1` and `date/add@1` both diverge — from `Number` and from every library's fractional
month — and neither carries such a guard. That is recorded here as a debt against this rule rather
than as an exception to it.

## The security filter fails closed — settled

**A name a submission has not declared is refused unless it is permitted.** The rule that replaced a
list of twenty-three forbidden globals is a list of what a pure function may name, and everything
else — `fetch`, `document`, `crypto`, `require`, and the one nobody has thought of — is refused with
no entry anywhere. A list of the bad names fails open on the global nobody anticipated, and *nobody
anticipated it* is the failure mode that matters. On the mechanism the whole supply-chain argument
rests on, failing closed is the only defensible direction.

**What makes the closed form affordable is the catalogue's perimeter, and it was measured rather than
assumed.** The five reference implementations between them read seven free identifiers — `Array`,
`Date`, `Map`, `Math`, `Number`, `Object`, `undefined` — and every `.ts` file of `contracts/` adds
only seven more. The permitted list is drawn at the ECMAScript standard library minus what reaches
beyond the call, which a reader can check; `eval`, `Function`, `globalThis`, `Intl`, `WeakRef`,
`FinalizationRegistry`, `SharedArrayBuffer` and `Atomics` are the language's own names that stay out,
each with its reason. **`Intl` is the one I decided against the brief on**: every one of its
constructors falls back to the host's default locale when none is supplied, which is ambient input of
exactly the family `Date.now` is.

**The false-refusal cost is zero on the catalogue, and one existing false refusal was closed.** The
rule asks the compiler's binder where a name is bound rather than reading names, so a parameter
called `process` is a parameter. That is what makes the closed list strictly stronger than the open
one in both directions at once — without it, the same lexical reading either refuses the parameter or
lets a shadowed global through, and there is no third answer. The measured boundary moved from six
refused lines to eight: one evasion closed (`const evaluate = eval`, a capture with no call to read),
two new spellings caught (`{ fetch }`, and a free read of a name another scope binds), and the
over-refusal gone.

**Types are out of scope on purpose.** A type is erased and reaches nothing, so refusing one would buy
nothing and would cost the whole of `lib.*.d.ts` in the permitted list.

## What the repository declares and nothing keeps — closes before the launch

One form, found four times in a single sweep and certain to be found again: **a thing that behaves
like a rule, with nothing making it hold.** The vocabulary for it already exists — `one-directional`
— and the list is kept here rather than scattered, because it is what the publishing tool has to
close. A published version is frozen for life, so a declaration that is decorative at launch is
decorative for ever.

**Closed by stage 1 of the validation pipeline.**

- `staticAnalysisRequirements` of `date/add@1` — stage 1 reads the twenty forbidden local-time methods
  off the contract itself and refuses a submission that calls one. The record classifies the field
  `executable` and **carries the address of the guard**, which serialisation refuses if it does not
  resolve — the treatment `found-by-mutation` already had, applied to the other claim a record makes
  about its own verification.
- `referenceImplementationRules` — its first rule is what `states-its-own-signature` refuses, and the
  refusal a submitter reads is **that declaration's own sentence** rather than a retelling of it. It
  moved to `catalogue/reference-implementation.ts` for a mechanical reason worth recording: production
  code cannot import a file that imports vitest, and `every-contract.ts` does because three of its
  exports *are* guards. Its second rule stays a reader's and `contractAnatomy` says why.

**Still open, and what each one now costs.**

- `contractAnatomy` — triaged entry by entry against stage 1's own constraint, *readable in the source
  alone, without evaluating the module*: **three of the eleven are settled by the source alone, four
  need the module, four are a reader's and no stage will ever take them.** So the conformance
  controller is not "`contractAnatomy` made executable"; it is three entries, and a fourth stage that
  evaluates a vetted module takes four more. The triage is data on each entry and one guard keeps the
  half that can be kept — a new entry with no verdict is refused.
- `CLOCK_DEPENDENCE_RULE` — declared, cited in prose, imported by nothing executable. It is one of the
  four a reader keeps: which guards *can* depend on elapsed time is a judgement about what a defect
  could do to a guard.
- `benchmarks.profiles[].name` — frozen by the section above, enforced by nothing.
- `outputAlphabet` of `string/slugify@1` and `benchmarks.profiles[].samples.producedBy`, the two
  `one-directional` fields the schema already carried, with GS-11 as the measurement.

**Four more instances were found by building the address rather than by looking for them, and that is
the argument for building mechanisms rather than lists.** Ten entries of `TYPESCRIPT_SURFACE` were
guarded and read by nothing, so the guard covered a dependency the analyser did not have.
`GuardAddress`, `renderGuard` and `guardAddressFaults` were declared in `address.ts` and used by
nothing — the address this unit needed already existed, unused. Four `ownDeclarations` claimed
`executable` and named no guard; one of them, `keyFunctionRules`, turned out to be `structural` — no
guard runs an implementation against it. And M-08 of `array/group-by@1` pinned one of the four guards
it reddens where the repository's own rule says name all of a set of five or fewer, which is how
`profileKeyFunctions` had no citable guard to point at.

**The mechanism that closes the class for every address at once is a pre-flight refusal of a pin that
names a guard no guard carries.** It is cheap — seconds against the ten minutes a battery costs — and
it turns a stale case identifier, guard identifier or profile name from a silence into an error, with
no renaming anywhere. It has been set aside twice. It opens the unit after the validation pipeline's
first stage, and it is written down here so that there is no third time. Note what it is *not*: a
guard address today resolves against the guards a battery **names**, which is a real refusal and a
weaker one than asking whether the guard exists.

## Rules for this stage

1. **The registry is being designed, one piece at a time, in this order**: data schema, then
   immutable storage, then the read API, then the publishing tool. Only the piece currently under
   way exists; the others do not, deliberately, because each one constrains the next. The CLI and
   the website come after all four. Everything lives in this one repository, in folders — releases
   are independent, the history is not.

   **The catalogue ships at five contracts.** The showcase domain moves to after the launch: every
   remaining uncertainty is on the user's side — whether `toopo add` feels good, whether search
   finds something in ten seconds, whether a contract page convinces — and none of them is
   answerable in private. Anything published freezes for life, so the known debts close before the
   launch, not after.
2. **The no-abstraction suspension has ended**, having done its job: three contracts were written by
   hand with no shared code, and what they turned out to repeat *identically* now lives in
   `catalogue/`, under the freeze discipline stated at the top of that file. The bar for adding
   anything there is not "the contracts repeat it" but "the contracts repeat it identically, and
   what it says belongs to the registry rather than to any one feature". Resemblance is not
   duplication: three functions that answer the same question about different data stay apart.
3. Dev dependencies are limited to `typescript`, `vitest`, `fast-check`, and `@types/node`. The last
   one is types-only, has no runtime footprint and cannot reach distributed code; without it the
   mutation instrument would either sit outside the typechecker or be written in plain JavaScript,
   and an unchecked `.ts` file would claim a guarantee the repository does not give it. Feature code
   still has zero runtime dependencies of any kind.
4. The root `package.json` carries `"private": true`, so nothing can be published by accident.
5. Working notes, planning documents and status reports do not belong in this repository. Only
   contracts, implementations, tests, the evidence produced by running them, and the instrument that
   produces that evidence — including its own fixtures.
6. **Fixtures for the instrument live under `mutation/`, never under `contracts/`.** `contracts/` is
   the catalogue and nothing else. A fixture is a toy shaped like a contract so that the instrument
   can be mutation-tested in seconds rather than minutes; a meta-test nobody runs is a decorative
   guard, and the cost of running one is what decides whether it gets run. A fixture is deliberately
   minimal, is never a template for a real contract, and says so in its own header.

## Permanent rules

These outlive the current stage and are not open to trade-off.

1. **No runtime indirection.** No dynamic resolution, no wrapper component, no network call at
   execution time. The only indirection is the user's import path, resolved at install time.
2. **No external npm dependency inside a feature.** A feature depends only on other registry
   features and on native language and runtime APIs. Wrapping an existing library is rejected on
   principle.
3. **No distribution from an external source.** Installations are served only from the registry's
   immutable snapshot, never from a third-party repository.
4. **Never update user code silently.** Notification, readable diff, explicit acceptance.
5. **Never hide a contract's tests.** Contracts are public in full; security by obscurity on them
   is forbidden. Auditability is the product.
6. **No breaking change to a published contract major.** A published version is frozen for life;
   an incompatible evolution creates `name@2` alongside `name@1`.
7. **Nothing trivial in the catalogue.** A contract exists only if it provides something the
   language does not give trivially — non-obvious behaviour, real edge cases, an algorithm, or the
   correction of a language trap.
8. **No validation bypass**, including for the founder's own submissions.

## Conventions

- English everywhere: code, identifiers, comments, tests, commit messages, documentation.
- Conventional commits, atomic. Never push and never create a remote.
- TypeScript `strict: true`.

## Verification discipline

This project sells verification. A decorative guard here is not a technical defect, it is a defect
of the thesis.

- A test that cannot fail is not a test. Before claiming a suite is green, break the implementation
  on its real failure condition and show the red output.
- A guard that is structurally incapable of failing must be recorded as inapplicable, with the
  reason — never written as a passing test that proves nothing.
- Every universal property carries a status — applicable or not applicable — together with its
  reason. One declared applicable must have been seen red on at least one plausible mutant.
- Distinguish what you **measured** (quote the command and its output) from what you **assume**.
  A coherent explanation is not a measurement.
- Report what you left out. Never narrow the scope silently.

## Asking questions

On a genuine ambiguity, blocker, or trade-off: stop and ask directly in the conversation, in prose.
Never use the `AskUserQuestion` tool. Resolve trivia yourself.
