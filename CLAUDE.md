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

The registry's first three pieces are written — data schema, immutable storage, read API — and beside
them the validation pipeline's first stage. Next to them now stands `toopo init` and `toopo add`, which
came **before** the rest of the pipeline and before the publishing tool, and the reason is recorded in
rule 1 below rather than left to look like impatience. Beside all of it the conformance controller,
which does **not** make `contractAnatomy` executable: the triage below says why — three of its eleven
entries are settled by a syntax tree, four need a module a stage has already vetted, and four are a
reader's for ever. Beside them now `toopo update`, the command permanent rule 4 is about, and with it
the two-phase write that closes three of the four situations `cli/breakage.ts` declared as breaking
badly. Then `toopo search`, the only command that reads no project at all and the one that finally
makes `identity.searchAliases` executable — a field declared in the first session of this project and
validated by nothing until now. **The CLI is finished at six commands with `toopo remove`, and with it
the way out the client did not have**: before it, the only way to uninstall was to edit `toopo.lock` by
hand, and the tool put a deleted folder straight back. Beside it `toopo list`, the only command that
reads no *registry*, and the pair is the shape of the whole client — one question answered without a
project, one answered without a server. No server and no website exists, deliberately.

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

## What an installation looks like on disk — settled

**A feature lands in `<domain>/<name>/`, and its entry file is named after the feature.**
`src/lib/toopo/string/slugify/slugify.ts`. The domain stays a folder, so `number/parse` and
`string/parse` never collide and no artificial prefix is needed. The file is not called `reference.ts`:
that name says what the file was in *our* catalogue and nothing about what it holds, and in the user's
editor every installed feature would otherwise open a tab under one name. It is the same reasoning that
already stripped our internal rules out of the three references — the implementation file is the only
one that becomes somebody else's code, and it is written for them.

**A folder from the first file, rather than a flat file promoted to a folder later.** The promotion has
to be invisible to whoever wrote the import, and it is not. Measured on node v24.15.0, at the spelling a
published source writes:

```
cjs  ./x.js -> MODULE_NOT_FOUND       cjs  ./x -> x/index.js
esm  ./x.js -> ERR_MODULE_NOT_FOUND   esm  ./x -> ERR_UNSUPPORTED_DIR_IMPORT
```

Only the extensionless spelling collapses the two, and a published source writes the extension because
that is the only form that resolves under both module systems and under `node16`. So an implementation
gaining a second file would move the path every dependent had written. The folder costs one level of
nesting on a single-file feature and the import path never moves again.

**The cost, which is that every cross-feature import is rewritten.** The catalogue serves its entry file
as `reference.ts` — `contractAnatomy` requires that name at five of five — so a published `number/clamp`
names its dependency as `../../string/pad/reference.js`, and that specifier is wrong the moment the file
lands as `pad.ts`. *Naming the file after the feature and needing no rewriting between features are
incompatible*, and the first wins because it is the one argued from the user's editor. What softens it
is that the rewriting mechanism is needed anyway for a shared file, and that both jobs are one rule:
**a specifier is repointed when the file it names did not land where the specifier says it would.**

**A shared file is recognised by its digest and never by its path**, written once in the folder of
whichever carrier the resolution reaches first, with the other carriers repointed at it — and an entry
file is exempt, because a feature's entry file is its identity and collapsing two would leave a folder
with no file named after it.

**The lockfile carries two digests per file, and that is a finding rather than a field somebody
wanted.** A file whose import was repointed is not the bytes the registry served, so an entry holding
only the served digest would report every rewritten file as locally modified from the instant it was
written — the failure `canonical.ts` closes for line endings, arriving through a door the installer
itself opens. `served` is what a comparison with the registry is made against; `sha256` is what the
offline check — the one whose whole value is that it needs nothing from us — compares against.

**A version minted by the local stand-in is visibly false.** `0.0.0-local`, never `1.0.0`. A number that
looks published and is not turns the lockfile's own argument against it, since its whole value is that
it can be checked offline against a published fact; and the day publication exists these entries are
greppable in any lockfile in the world.

**No setting exists that has one possible value.** `toopo.json` carries `version` and `directory` and
nothing else. The alias import style is coming and is not here, so there is no `imports` field to accept
and ignore — a setting that is written and not honoured is a promise not kept, and `version: 1` is what
carries the migration when the second style arrives. `init` will detect the alias prefix once and record
it; `add` will go on consulting nothing but this file. We record what the user told us, we do not
inspect their build.

## One import spelling, and it is not the user's to choose — settled

**`toopo add` prints the import line, not the file path.** A path is not what anybody writes in an
import, and the defect was measured by committing it: `./src/lib/toopo/...` typed into a project where
`init` had chosen `lib/toopo`, by somebody with the installer's source in front of them. The line
carries the *configured* directory and says it is written from the project root — the specifier depends
on which file the import sits in, and this tool does not read the user's sources.

**The extension is `.js`, there is exactly one, and it is a property of what Toopo writes rather than of
the user's toolchain.** Our own installed files import each other with `.js`, so any other suggestion
would tell the user to spell one thing one way while our files spell it another. Measured on TypeScript
7.0.2 under `"type": "module"`, target ES2022:

```
./x.js   bundler OK      node16 OK      nodenext OK
./x.ts   bundler TS5097  node16 TS5097  nodenext TS5097   without allowImportingTsExtensions
./x      bundler OK      node16 TS2835  nodenext TS2835
moduleResolution node10 → TS5108, removed from TypeScript 7
```

**And what decides it is the measurement nobody had taken: the import *inside* our own file.** Node
v24.15.0, native type stripping, `"type": "module"`:

```
entry .ts → internal .ts   runs
entry .js                  ERR_MODULE_NOT_FOUND
entry .ts → internal .js   ERR_MODULE_NOT_FOUND, on the internal import
```

So `.ts` appears to work only because all five contracts are one file. **The first multi-file feature
breaks under node's own runtime whatever the user writes**, because our internal import is `.js` and
node does not remap it. That is a limit of node rather than of us, and it is declared in `breakage.ts`
with its measurement, because whoever meets it wants to know it is known. `cli/toopo.ts` had already
measured the same fact for this repository's own entry point, and shows what working around it costs:
fifteen lines of `node:module` we can register for ourselves and cannot register inside somebody else's
program.

**Nothing is detected and nothing is recorded.** There was no toolchain question to answer, so
`toopo.json` stays at `version: 1` with two fields and the rule above holds unchanged.

**The export names come from the contract, through `ServedIndexEntry`.** An export name is not derivable
from an address — `number/parse` exports `parseNumber` — it lives in `identity.exportName` and
`surface.exports`, and the installer's port deliberately carries no `contract-binding`, so nothing it
fetched held it. Reading the names off the installed source would have the installer publish an opinion
drawn from code rather than from the contract. Measured, because that type calls itself deliberately
small: the canonical index goes from 2 594 to 2 969 bytes over the five — 14.5 per cent of what is still
the smallest thing the registry serves.

## What an update is, and what it will not do — settled

**Acceptance is a second command, never a prompt.** `toopo update` shows and writes nothing;
`toopo update --apply` writes. What that protects had never been named and is the property this folder
would lose first: **everything this tool decides is reachable from a guard, with no process, no working
directory and no clock.** It is what keeps `command.ts` thin, and it is why `add` could be measured end
to end without a sandbox. The first interactive prompt written here takes it away, and takes it away
silently — so the sentence lives in `command.ts` and in `update.ts`, where whoever wants one will read
it.

**The whole project is planned every time, and there is no `toopo update <feature>`.** Deduplication is a
property of a plan and not of a feature — which carrier of a shared file keeps it depends on what else is
being installed — so a plan built for one feature in a project holding four would move files the other
three own. Planning everything and applying part of it is the only shape that cannot do that.

**Six answers about a file, decided by two questions.** *Does this have to change* — the bytes we would
write are not the bytes the lockfile says we wrote. *Did the user change it* — the bytes on disk are not
the bytes the lockfile says we wrote. Both asked against `sha256`, which is the half of the lockfile's
two digests that exists for exactly this.

```
must change, untouched      updated          write it, with the diff
unchanged, edited           kept             leave it, and say so
must change, edited         conflict         hold the whole feature back
unchanged, untouched        unchanged        nothing at all
gone from disk              restored         put it back
already the new bytes       already-written  a run was interrupted here, not an edit
```

The last one is what closes the partial-write window without a journal.

**A conflict is diffed as the file is on disk against what would be written**, which states the
consequence of accepting rather than describing the upstream change in the abstract; `git diff` already
shows the user their own change better than this could. The other reading — reconstruct what we
originally wrote and isolate the upstream change — **cannot be built from the lockfile**, and finding
that out is worth recording: the lockfile records only the files that were *written*, so a shared blob's
second carrier is deduplicated away and has no entry, and the old relocation is not recoverable from it.

**A conflicted feature is held back whole**, and so is anything carrying one of its files or importing
it. A feature half at one version and half at another is a combination nobody published.

**Nothing is removed while anything is held back**, and that rule was found by reading the report rather
than the code: the second publication of the imagined graph has `number/round` drop `number/sign`, and a
held-back `number/round` runs the old code that imports it still — so removing it would break a build in
order to tidy a folder. The blunt form is deliberate; the exact one costs a fetch per held-back feature
and a fallback, to win one run of tidiness in a situation the user is already resolving.

**The fourth defect a consumer has found in this schema is `LockedFeature.askedFor`.** The lockfile did
not say which features the user had typed, and an update has two ways to guess, both wrong for different
reasons. Treating every entry as a root climbs a dependency to whatever its own binding names today
rather than to the one its dependent was published against — a combination nobody published. Deriving
the roots from the edges reads precisely what an update is trying to find out has moved, and gets the
ordinary case wrong anyway: a `string/pad` installed directly *and* pulled in by `number/round` would
never again be updated on its own. It is **sticky towards true**, and that case found a second defect in
`add`: asking by name for something already held as a dependency answered "nothing to do" and recorded
nothing, after which a later update would have removed what the user had asked for. Fourth after
`dependencyDepth`, `ProfileSamples` and the two digests — smaller than the three before it, and in the
lockfile rather than in the served schema.

## What a search may answer, and what it must not — settled

**Every word of a query must be answered by something the contract carries.** It is the only rule
under which a search over this catalogue can answer *nothing*, and a search that always answers
something is the one nobody believes twice. Measured over twenty utilities the catalogue does not
hold — `debounce`, `deep clone`, `uuid`, `flatten nested array` — it answers nothing twenty times.
`sort array` is the case that decides the rule: `array` is half of a contract's own name.

**A word a contract cannot answer is set aside for that contract, and what remains must then name one
of its own names, exports or aliases in full.** Without it, `convert a string to a number in
javascript` answers nothing, because `in` occurs in one contract's summary and not in the one being
asked for. A list of words to ignore was refused: it decides invisibly which words carry meaning, and
`to`, `by` and `from` carry it here — twenty-seven of the sixty-two aliases hold one of them. That
figure used to read *fourteen*, and it was wrong: it was also the figure `cli/arguments.ts` published
for a different claim, the aliases carrying a space, where the true number was fifty-six of seventy.
Both are measured now rather than restated, which is the only thing that stops a number from migrating
onto a claim it was never about.

**A query may shorten a word the catalogue carries and may never extend one.** A symmetric prefix reads
better and was measured: it answers `stringify` with all three contracts carrying `string`, and
`datepicker` and `dateline` with `date/add@1`. The English plural is bought back explicitly and nothing
else about English is claimed. There is no typo tolerance, and calling `string/levenshtein@1` from the
CLI was refused twice over — it would buy the behaviour the first rule exists to refuse, and it would
take `cli/` across the frontier `source.ts` holds.

**The description is not in the index, and the aliases are its searchable surface.** Measured: the five
index to 2 969 bytes and their descriptions alone to 6 187, so carrying them would more than triple the
one document
every search pays for. A query only a description could have answered is a **missing alias**, and the
repair belongs in `identity.searchAliases` where it is frozen, reviewed and served.

**And the ranking has almost nothing to rank, which is a fact about the matching rather than a gap.**
Nought of the eighty-nine aliases and corpus queries answers more than one contract, so inverting the
comparator broke no trial at all. Of 161 distinct words in the index, 25 answer more than one contract
and 7 carry a score that tells them apart — four of those seven are `a`, `by`, `from`, `to`. Two are
real queries. Two constants died of it: an exactness multiplier that moved nothing at 2 or at 100, and
a full-query bonus that could not change an order because no full query has one. **A number that
cannot change an answer at any value is not a rule**, and speculative insurance no guard can reach is
what `field-map.ts` calls a speculative field and deletes.

## What an alias is, and the trap that hides a wrong one — settled, catalogue-wide

**An alias is a query whose best answer is this contract — never a phrase that relates to it.** The
second reading admits everything, because a phrase relates to a contract whenever anybody can explain
the connection and an explanation is always available.

**The property that every alias retrieves its own contract first is satisfied by a lying alias**, and
that is the whole reason this is written down. The alias is in the index, so it matches the contract
that declares it by construction — which is what retrieval *means*. The trial establishes that the
ranking works and says nothing about whether the phrase should have been declared, and it looks exactly
like the opposite. It was green before and after eight aliases were removed.

Two filters, and they are not the same filter. **Mechanical:** read the contract's own exclusions —
every *it is not X* of the input domain, every *that is a different function* of the description — and
refuse any alias that names one. It found five. **A judgement, one alias at a time:** an alias nobody
would type costs weight, an alias promising what we do not do costs trust, and those are different
categories. It found three. The criterion that decides the next case without a second opinion is
**could a better answer exist in this catalogue** — for `string similarity` yes, and it is a different
function with a different output shape, so the alias is a lie whether or not that contract is ever
written; for `how similar are two strings` no, and vagueness is not the fault. *Naming something we are
not* is.

**Naming the built-in a contract is positioned against is deliberate, and the line is that the contract
names it too.** `parseFloat`, `parseInt`, `Object.groupBy`, `Map.groupBy` and `lodash groupBy` are all
argued against by name in their own contract's published prose, which is what lets `toopo search
Map.groupBy` answer *the language ships this now*. `atoi` went out under the same line, because no
contract names it.

**An alias is not frozen with the major**, and it is the only field of `identity` that is not. A case
identifier, a guard identifier, a reason literal and a benchmark profile name are addresses — an API
response cites one, a URL anchors on one — and an address that changes breaks a link. Nobody links to
an alias, no answer cites one, and correcting one breaks nobody's code. It is curation, so it is
repaired the day it is found and does not cost `name@2`.

## Which commands ask twice — settled

**A command that can destroy or overwrite shows first and writes on a second word. A command that can
only refuse writes at once.** `update` and `remove` may replace or delete somebody's file; `add` never
touches a file it did not put there, so asking twice would buy nothing and cost a word.

It is written down — `THE_WRITE_DISCIPLINE` in `cli/arguments.ts` — because the CLI was applying it
without saying it, and an unsaid convention is one the next person breaks by trying to help. A
`toopo add --dry-run` reads as symmetry and would put the opposite default on the opposite half of one
tool, so that half the commands write unless told not to and half refuse unless told to. Nobody would
choose that deliberately, which is exactly why it has to be refusable by pointing at a sentence.

## What the lockfile does not describe — settled

Two claims about `toopo.lock` sound alike and only one is true.

**True: it lets anybody check, with nothing from us, that the bytes on disk are the bytes that were
served.** That is the supply-chain argument of the whole project and it holds entirely.

**False: that it describes the installed graph.** It records what was *written*, never what was
planned. A shared file is written once and the other carrier is repointed at it, so the second
carrier's entry does not name the file it imports — measured on the fixture graph, `number/clamp@1`
records one file and `number/clamp/clamp.ts` imports `../../string/pad/digits.js`. A removal decided
from the lockfile alone would delete `string/pad/digits.ts` while three files that stay import it: not
an incomplete answer, a wrong and silent one.

**And no field would fix it.** Recording the edges closes that instance and not the class:
deduplication is a property of the *plan*, a blob is recognised by its digest and never by a path, and
two roots that depend on nothing can still share a file. The only sufficient record is the plan itself,
which is a cache of something the registry recomputes — a second source of truth that can contradict
the first. So the plan is rebuilt every time, and **that is why a removal needs a registry**.

**The limit, bounded.** Measured over every non-empty root set on the catalogue and on the fixture
graph, 8 of 64 removals reach the registry not at all, and they are exactly the ones that leave no root
behind. A published version is served for life, so *the contract went away* is not a case that exists;
only a registry that cannot answer right now. The refusal explains rather than reports — *this needs to
know what the features that stay import, and only the registry knows* — and it degrades without
destroying: the files stay, nothing breaks, and the same command works when the registry answers.

## What a removal is — settled

**Asking for a feature to go is asking for it to stop being a root**, and everything else follows from
re-planning what remains. So a removal is a reconciliation with one feature demoted, sharing the whole
of its arithmetic with `update`; the measurement that says this is real rather than tidy is that
nineteen of the twenty-five guards that unit added redden on `cli-update`'s battery.

**Two differences, and both are load-bearing.** The roots that stay are bound at the version the
lockfile records, never at what the registry serves today — not merely so that a removal does not
update four other features, but because *which files leave* is decided from that plan, and a root
republished without a dependency would have it planned away while the version on disk still imports it.
And zero roots is an answer rather than an error, which is why the two refusals about a lockfile with
nothing in it stay in `update.ts`.

**Four answers, and the one that matters most is not a refusal.**

```
not in the lockfile         refused, with what the project does hold
held, never asked for       refused, naming the feature that imports it
asked for, still reached    it stays, it stops being a root, and the screen says both
asked for, reached by none  it goes, and so does what only it pulled in
```

The third is where trust is lost, because from outside it looks exactly like nothing happened. *I asked
to take it out and it is still there* is never left to be read off a report with nothing in it.

**Two holes in `update` were found by building it**, and both are closed. A copy deduplicated away was
left on disk claimed by nothing — `add` plans one root at a time, so two features carrying one file are
written twice and the first update afterwards drops one from its entry — and the next command refused
to write there, about a file this tool had written itself. And *nothing is removed while a feature is
held back* was asked of the features still in the plan, so an edited file that kept a **leaving**
feature let its dependencies be deleted underneath the code it left behind.

## Make the omission impossible rather than forbidding it — settled, repository-wide

**Before writing a rule in prose, look for the shape that makes breaking it not compile.** A sentence
in a header is a rule the next contributor never reads; a type that cannot be written the wrong way is
one they cannot get past. Three instances found independently, which is what turned a habit into a
rule:

- **`GuardAddress` carries no unpaired form.** Uniqueness is per contract, so a guard is addressed by
  the pair `(contract, guard)` — and `registry/address.ts` publishes no type holding a guard identifier
  alone. The rule "the registry schema must always carry the pair" was written in prose first, in this
  file; making the unpaired form unrepresentable is what turned it into something the compiler keeps.
- **`VerificationStratum` has a member for deferring and none for omitting.** `stated-per-declaration`
  exists because the visibility guard found a path with no entry at all and a comment explaining why —
  and a comment is not a classification. *Deferring is a decision, omitting is a silence*, and the
  union is what makes the second one impossible to write.
- **`toopo.lock`'s version cannot go stale.** `cli/lockfile.ts` validates through records keyed by
  `keyof LockedFeature` and `keyof InstalledFile`, so a field added to either does not compile until a
  check for it is written — beside the number that has to move. Both shapes had already shipped under
  `"version": 1` before this existed, which is the measurement that motivated it.

The three have one form: **a total map over a type, or a union with no way to spell the absence.** The
question to ask of any new rule is whether that form exists for it. Where it does not, the rule is
written in prose *and* recorded in the list below, so that a declaration nothing keeps is at least
counted.

**It is not free, and the cost is stated so it is not discovered later.** Totality forces a decision at
the moment a type changes, which is the whole value, and it also means a field nobody has an opinion
about must still be given one. `FIELDS_OF` carries `files: Array.isArray` and delegates the elements
elsewhere — the totality guarantees no field goes *unconsidered*, never that every check is one
expression. Claiming more than that would be the decorative form of the same idea.

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
- `Breakage.guard` in `cli/breakage.ts` — every situation the installer refuses cleanly names the guard
  that keeps it, and nothing resolves that name. It is the same class arriving on a fifth kind of
  address, and it closes with the same mechanism as the others.
- **The rule that an alias must not name what its contract refuses to be.** The eight liars are gone
  and the criterion is in `catalogue/every-contract.ts`, but nothing keeps it: the executable form
  needs each contract to publish its exclusions as data, which is a new frozen field on five contracts
  to buy a check that would still be matching words against prose. Looked for, priced, and declared
  rather than dressed as a mechanism — which is the treatment this list exists to give.

**Closed by the two-phase write, which is where they said they would close.** `cli/write.ts` stages every
file beside its destination and renames, so the three situations the installer left throwing whatever
the operating system threw are refusals with a sentence. A folder that cannot be written to fails during
staging, where nothing has been committed — not a pre-flight writability check contradicted afterwards
by the write, which is the shape this repository refuses, but the write itself taken in a phase whose
whole property is that abandoning it costs nothing. A directory where a file must go is asked about by
*kind* before staging, because renaming onto one is `EPERM` on Windows and says nothing a caller can
act on. And a process killed between the first file and the lockfile resolves backwards, because a file
is renamed or it is not and the lockfile is renamed last — `already-written` finishes the job on the
next run, without a journal.

**What the guard for the first one measures is a file sitting where one of our folders must go**, and
that is said rather than glossed: a permission denial is the same catch on the same line, and is not
something a guard can arrange on every platform this runs on. Claiming it was measured would be claiming
more than was.

**Two remain, and both are declared rather than closed.** A rename that fails after staging succeeded —
a file held open by another process on Windows — throws, and closing it would mean every rename being
reversible, which is a journal. And node's own TypeScript runtime meeting a feature of more than one
file, which the section above measures and which is not ours to close.

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
names a guard no guard carries.** It is cheap — seconds against the seventeen minutes the batteries
cost, and this sentence used to say *a battery*, which is wrong by a factor of six and was read that
way once: measured on the replay `toopo remove` owed, the seventeen run in 24 min 17 s and the largest
single one is `cli-install` at 244 s — and
it turns a stale case identifier, guard identifier or profile name from a silence into an error, with
no renaming anywhere. It has been set aside twice. It opens the unit after the validation pipeline's
first stage, and it is written down here so that there is no third time. Note what it is *not*: a
guard address today resolves against the guards a battery **names**, which is a real refusal and a
weaker one than asking whether the guard exists.

## Rules for this stage

1. **The registry is being designed one piece at a time, and the order changed once, deliberately.**
   It was data schema, then immutable storage, then the read API, then the publishing tool, with the
   CLI and the website after all four. The first three are written. **The CLI then moved ahead of the
   publishing tool and of stages 2 to 7 of the validation pipeline**, and the argument is the one the
   decision to launch at five rests on: every remaining uncertainty is on the user's side, and none of
   them is answerable in private. Continuing the pipeline first would have been acting against the
   reason that decision was taken — the pipeline judges submissions, in a closed phase there are none,
   and the five contracts are already measured by their own batteries.

   A second argument decided it, and it is a lesson from this repository rather than a preference:
   both schema defects found so far — a `dependencyDepth` reduced to an unusable summary, and
   `ProfileSamples` carried in full — were found by deriving what a consumer needs. Approaching the
   consumer finds defects design does not. It happened twice more in the unit that wrote `toopo add`,
   on the walk's parameter and on the lockfile's digests, and twice more again in the one that wrote
   `toopo update`: a lockfile that could not say which features had been asked for, and an index that
   could not name what a caller imports. **Four consumers, six defects, none of them found by looking
   at the schema.**

   Only the piece currently under way exists; the others do not, because each one constrains the next.
   Everything lives in this one repository, in folders — releases are independent, the history is not.

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
