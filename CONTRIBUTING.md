# Contributing

This catalogue can receive an implementation, an input where ours is wrong, and a correction to a
search alias. It cannot receive a contract. That is not a policy about who is trusted — it is
arithmetic about what a contract freezes, and the arithmetic is below so you can check it rather than
take it.

**There is nowhere to send anything today.** This repository has no public remote, nothing is
published, and the pipeline that would judge a submission is built as far as its first stage. This
file exists so that the first person to ask gets an answer instead of a project journal.

## What a contract costs to accept

A published contract major is frozen for life. An incompatible change to it does not edit it: it
creates `name@2` beside `name@1`, and `name@1` goes on being served for ever. So every value a
contract publishes is either something we can put right the day it reads badly, or something we are
stuck with.

Counted over the five contracts in this repository:

**279 frozen.** 187 case identifiers, 48 group identifiers, 27 benchmark profile names,
9 failure-reason literals, 7 export names and 1 supporting type name.

**82 corrigible.** 62 search aliases, and the 20 reasons a contract gives for whether each universal
property applies to it.

More than three frozen for every one that can be put right.

Those figures carry no date, because they are not a transcription: `mutation/contributing.test.ts`
derives every one of them from the five contract records and requires this file to publish it. If a
case is added tomorrow, this page goes red rather than stale.

Those families are frozen for two different reasons, and the difference is worth knowing before you
argue with the number. A case identifier, a group identifier, a benchmark profile name and
a failure-reason literal are frozen because each is an **address**: an API response cites one, a page
anchors a URL on one, a validation report names the case a submission failed — and an address that
changes breaks a link somebody has already shared. An export name and a supporting type name are
frozen by permanent rule 6 instead: renaming one is an incompatible evolution, and an incompatible
evolution creates `name@2`.

Two things are deliberately not in either column.

The **verdict** beside each of those 20 reasons — whether a universal property is applicable — can be
weakened and not strengthened. Declaring an applicable property inapplicable narrows what the
contract claims and breaks nobody; the other direction turns a conformant implementation into a
non-conformant one, which is exactly what permanent rule 6 forbids.

And **20 declarations belong to one contract and to no other** — `metricAxioms`, `theRule`,
`outputAlphabet`, `keyFunctionRules` among them. The registry carries them and does not
interpret them, by construction: a vocabulary that fitted all twenty would be a vocabulary invented
here rather than found in the contracts. Whether one of them is right is a judgement no tool in this
repository takes, and no reviewer can take it quickly.

**That is why a contract is not receivable at any volume.** Reviewing one means being right, once and
for ever, about several hundred addresses that a later correction cannot reach — and being right about
the declarations the schema cannot help with. It is not that a stranger would do it badly. It is that
nobody can do it at the speed a queue would arrive at, and a queue of contracts reviewed at that speed
would freeze its mistakes into the one thing this registry sells.

## Three contributions this catalogue can take

They are in order of what they cost to accept, and the cheapest is the most valuable.

### An input where an implementation is wrong

The best thing you can send is a value, and the answer it should have given.

Block 4.4 of every contract is a table of named, settled edge cases, and **adding a case to a group
that already exists costs nothing**: no address moves, no caller breaks, no version changes. The
schema has carried a provenance for exactly this since the day it was written — `found-in-the-wild`,
beside `specified` and `found-by-mutation` — and **no case in this catalogue has ever used it**. Every
edge case here was found by writing the contract or by mutating the implementation. Not one came from
somebody using the thing.

It is also the contribution that settles fastest, because nothing about it is a matter of taste: it
either contradicts the contract or it does not.

### An implementation

An implementation freezes nothing. The contract it competes under already exists, is already public,
and is already executable — permanent rule 5 forbids hiding a contract's tests, and the harness is
served as files anybody can fetch and run. So an implementation is judged by running it, and being
wrong costs a revision rather than a major version.

Two rules govern how one is written, and they are declared in
`packages/catalogue/reference-implementation.ts` rather than here, so that the tool enforcing them reads the
same sentence you do:

- **It states its own signature and its own private types.** Annotating the export with the contract's
  own type would make the compiler enforce conformance at authoring time and leave the contract's
  signature test unable to fail — a guard that proves nothing.
- **It does not delegate to a built-in that does the same job.** The mutation battery injects its
  defects into the implementation. One that forwards to the runtime has no lines to inject them into,
  so the verification could no longer be shown to catch anything.

### A correction to a search alias

An alias is the one field of a contract's identity that is not frozen, and the reason is that nobody
links to one. No answer cites an alias, no URL anchors on one, and correcting one breaks nobody's
code — it is curation rather than addressing, so it is repaired the day it is found.

What makes it worth a contribution is that the rule is easy to state and the trap is not.
**An alias is a query whose best answer is this contract, never a phrase that relates to it.** The
property that every alias retrieves its own contract first is satisfied by a lying alias, because the
alias is in the index and therefore matches the contract that declares it by construction. Eight were
removed on that reading; the whole argument is ADR-0023.

## What exists of the validation pipeline, and what does not

**Stage 1 exists. Stages 2 to 7 do not.** A submission can be read without being run, and nothing
more: there is no verified execution, no benchmark, no conformance report, and no command that takes
a submission — `analyseImplementation` is a function with no caller outside its own folder's tests.

Stage 1 never imports what it analyses, because importing is executing and stage 1 is the filter that
runs before anything executes. Everything it decides is read off a syntax tree, and one thing off the
compiler's binder. It has five rules, each with a frozen identifier a report can cite:

- `imports-only-a-registry-feature` — a feature depends on other registry features and on the
  language, and on nothing else.
- `states-its-own-signature` — the first reference-implementation rule above, made executable.
- `reaches-no-ambient-state` — a name the submission did not declare is refused **unless it is
  permitted**. The list is what a pure function may name; `fetch`, `document`, `crypto`, `require` and
  the one nobody has thought of are refused with no entry anywhere, because a list of bad names fails
  open on the global nobody anticipated.
- `builds-no-code-at-run-time` — `eval`, the `Function` constructor, and the spellings that reach them
  sideways.
- `calls-no-method-its-contract-forbids` — read off the contract's own published requirements rather
  than off a list this tool holds. `date/add@1` declares the local-time methods an implementation may
  not call, in public, and stage 1 reads that declaration rather than a transcription of it.

**The filter is lexical where it reads a method, and therefore evadable on purpose.** That is
measured rather than admitted: `packages/validation/the-boundary.test.ts` pins both columns — the evasions the
reader sees and the ones it does not — so closing one is a deliberate move from one list to the other
rather than a drift. Stage 1 is a filter, not a proof, and the stages that do not exist yet are what
the boundary is waiting for.

## Working in this repository

```sh
pnpm install
pnpm test            # the contracts' own suite
pnpm run registry    # the registry's schema, storage and read API
pnpm run validation  # stage 1 of the submission pipeline
pnpm run cli         # the six commands
pnpm run site        # the generator
pnpm run packaging   # builds the archive, installs it, runs toopo out of it
pnpm run meta        # the mutation instrument's own guards
```

**`pnpm -r` is not the entry point, and it is worth knowing why rather than being told.** This
repository is a pnpm workspace, so the command exists and it answers `exit=0` having run nothing —
which is the one shape everything here is written against, a green that checked nothing. The seven
suites above are seven *perimeters of verification*, and only four of them are packages: `pnpm test`
is `contracts/`, `pnpm run meta` is `mutation/`, and `pnpm run packaging` is `packaging/`, none of
which is a package, each for a reason recorded where it lives. Making the scripts follow the packages
would make two divisions coincide that do not, and on the day they diverge further it is the packaging
division that would win against the verification one. One root script per suite is one statement per
suite, which is already the right shape.

A test that cannot fail is not a test. Before claiming a suite is green, break the code on its real
failure condition and watch it go red — that is the acceptance criterion for every change here, and it
is the reason the mutation batteries exist.

```sh
pnpm run battery <name>  # replay one battery
pnpm run mutation        # replay all nineteen
```

**Which of the two you want depends on what you touched, and the answer is almost never the second
one.** A battery injects into exactly one folder, so only the batteries whose folder you edited can
say anything about your change. Measured at `4dc8a69` on one machine:

| what you changed | what to run | what it costs |
| --- | --- | --- |
| one contract | its two batteries — `<name>` and `<name>-spec` | **63 s to 2 min 41 s**, depending on the contract |
| `packages/registry/` | `registry-storage` | 8 min 32 s |
| `packages/cli/` | `cli-install`, `cli-remove`, `cli-search`, `cli-update` | 20 min 33 s together |
| `packages/site/` | `site` | 3 min 25 s |
| `packaging/`, `mutation/` | `packaging`, `fixture` | under a minute |

A contributor adding a contract runs two batteries and waits about two minutes. The ten batteries the
five contracts carry cost 8 min 26 s together — less than `cli-install` alone, which is 9 min 46 s.
**The expensive batteries are the client's and the registry's, and nothing you do to a contract
requires running them.**

A full replay is 42 min 16 s at that commit, and it is worth that on exactly two occasions: before a
release, and before anything is published to a registry, because that is the last commit at which a
wrong verdict is still correctable. Read every figure here as one run on one machine — the method
page publishes the spread this repository has measured between replays of identical work, and it is
minutes rather than seconds.

**One thing that will cost you half an hour if nobody says it: if you add or remove a test file, add
it to `mutation/census.ts` in the same change.** The instrument compares what a run collected against
what the repository declares, and the comparison happens at the *calibration* of each battery — so an
undeclared file does not fail fast. It fails at whichever battery collects that folder, which in a
full replay can be thirty-four minutes in. That is the control working, and it is worth knowing
before you launch rather than after.

If you touch a folder a battery injects into, that battery is what says whether your change is
measured. A guard added to such a folder must be **witnessed** by a mutant that reddens it or
**declared** — out of that battery's reach by construction, or a region no defect probes yet — and the
instrument refuses to report a verdict until every guard is one or the other. This is the discipline,
not a formality: a guard nothing can redden is the defect this project exists to refuse.

Commits are conventional and atomic: `type: description`, with `feat`, `fix`, `refactor`, `docs`,
`test`, `chore`, `perf` and `ci`. Everything written here is in English — code, identifiers, comments,
tests, commit messages.

## Licence

This repository is MIT. **What the installer copies into somebody's project is MIT-0** — MIT with its
attribution clause removed — so a user owes nothing for the code they receive. The perimeter between
the two is derived from what the installer actually copies rather than from a list of paths, because a
legal boundary kept by a declaration nothing enforces is how a file ends up in somebody else's
repository under the wrong licence. If you add a reference implementation, its two-line header is
written by that derivation and not by hand.

## Where the reasoning lives

`CLAUDE.md` is where the project stands: what exists, what does not, what is still open with what each
entry costs, and the rules a session works under.

**Every decision that has been settled is a record in [docs/decisions/](docs/decisions)**, one file
each, addressed by number and cited as `ADR-0007`. Each carries the measurement it rests on, the
alternatives that were refused, the guards that keep it, and what would reopen it. That is where to
look when you want to know *why* something is the way it is — and nine guards resolve what a record
names, in both directions, so a path or a guard it cites is one you can open.

**Neither is a specification, and neither is the document to read before contributing.** This file is.
Where a decision here has a longer argument behind it, the argument is in the module that owns the
decision — `packages/catalogue/every-contract.ts` for what every contract shares,
`packages/catalogue/reference-implementation.ts` for how an implementation is written,
`packages/registry/contract-record.ts` for what the registry holds, `packages/validation/source.ts` for what stage 1 can
and cannot see.
