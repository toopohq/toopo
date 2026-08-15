# Toopo

**Utility functions you copy into your project, each verified against a public, executable
contract.** Not a dependency: the source lands in your repository and it is yours.

Every utility library asks you to trust it. Toopo publishes the specification instead — the
signature, the invariants that must hold for every input, and every edge case named, settled and
argued for — and hands you an implementation that is measured against it in public.

```sh
toopo add string/slugify
```

One file lands in `src/lib/toopo/string/slugify/slugify.ts`, with its digest recorded in
`toopo.lock`. It imports nothing. There is no runtime, no wrapper, no resolution step: after the
install, nothing of ours runs in your program.

> **Nothing is published yet.** The command above is what a contract page tells you to type, and
> `toopo` is not on npm, `toopo.dev` serves nothing, and `package.json` carries `"private": true` on
> purpose. What works today is cloning this repository and running the suites below. Publication is
> a decision, not a missing feature.

## Why you can believe any of it

Because the tests are measured, and the measurement is a command you can run.

This repository carries 19 mutation batteries. They inject **631 deliberate defects** into it — each
one a committed file naming the exact edit it makes and the verdict it must produce — and re-run the
whole suite once per defect. **595 are caught.** The 36 that survive are each classified, and the
split is published with the total because a survivor count alone reads as a count of holes: 12 are
equivalent mutants, 7 are behaviour the contract declines to specify, 4 are unreachable on this
catalogue, 12 exist only where a lens deliberately took the suite's sight away, and **exactly one is
a debt**.

```sh
pnpm install
pnpm run mutation    # about half an hour; replays all 631 cells and prints the total
pnpm run tally       # prints it again from what the replay left, measuring nothing
```

A high score does not say the code is correct. It says the tests notice the defects that were
tried — and here the defects that were tried are files you can read.

The figures above are read off committed code and checked by a guard, so this page cannot drift from
what the instrument declares. What you get by running the command is different in kind: it is what
happened on your machine.

## What is in the catalogue

Five contracts, four of them installable.

| Contract | What it settles |
| --- | --- |
| `typescript/number/parse@1` | Turning text into a number without `Number`'s traps |
| `typescript/date/add@1` | Calendar arithmetic, including what a fractional month means |
| `typescript/string/levenshtein@1` | Edit distance, over code points rather than code units |
| `typescript/string/slugify@1` | Text to a URL-safe identifier, Unicode rather than ASCII |
| `typescript/array/group-by@1` | **Refused.** ES2024 shipped `Map.groupBy` and it answers the contract |

The fifth is published as a refusal rather than quietly dropped, with the argument and the
measurement that decided it. A registry that only ever says yes is not curating anything.

Between them the four installable contracts settle **187 named edge cases**, each with an
identifier frozen for the life of the major version, so that a report, a URL anchor and an API
response can all cite the same one.

- [toopo.dev](https://toopo.dev) — the catalogue, one page per contract, with a playground that runs
  the implementation on what you type
- [toopo.dev/method/](https://toopo.dev/method/) — how the verification is measured, and what it
  does not establish

## Limits, stated rather than discovered

- **One implementation per contract.** The contract's whole design is that implementations compete
  underneath it and are interchangeable; today each has exactly one, ours. Benchmark figures are
  empty for the same reason — there is no reference machine and nothing to compare against.
- **No submissions yet.** The validation pipeline that judges a third-party implementation exists
  at its first stage only.
- **TypeScript only**, and every address says so: `typescript/number/parse@1` is the contract's page,
  the first line of every file you install, and what `toopo.lock` records. A second language would
  bring its own contracts rather than sharing these, and it renames none of these addresses. The
  command takes no prefix — `toopo add number/parse` — because the language is which client you ran,
  not something you choose per install.
- **A published contract major is frozen for life.** An incompatible change creates `name@2` beside
  `name@1` and never edits `name@1`. That is the promise the whole registry is built to keep, and
  it is why so little has been published.

## Licence

This repository is MIT. **What `toopo add` copies into your project is MIT-0** — the MIT licence
with its attribution clause removed — so you owe nothing for the code you receive: no notice, no
attribution, no mention anywhere.

The two-line header on those files is provenance, not a condition. Its first line is the address of
the contract that file was verified against, so whoever finds it in six months can look up what it
is meant to do. You may delete it.

[LICENSE](LICENSE) carries both texts and the reason for the split. The perimeter is derived from
what the installer actually copies rather than from a list of paths, because a legal boundary kept
by a declaration nothing enforces is how a file ends up in somebody else's repository under the
wrong licence.

## Working on it

```sh
pnpm test            # the contracts' own suite
pnpm run registry    # the registry's schema, storage and read API
pnpm run validation  # stage 1 of the submission pipeline
pnpm run cli         # the six commands
pnpm run site        # the generator
pnpm run packaging   # builds the archive, installs it, runs toopo out of it
pnpm run meta        # the mutation instrument's own guards
```

[CONTRIBUTING.md](CONTRIBUTING.md) says what this catalogue can receive and what it cannot — an
implementation, an input where ours is wrong, a correction to a search alias, and never a contract.
The reason is arithmetic rather than a policy, and it is counted there so you can check it.

`CLAUDE.md` is where the project stands: what exists, what does not, what is still open with what each
entry costs, and the rules a session works under. **It is not a specification**, and it is not what to
read before contributing.

Every decision that has been settled is a record in [docs/decisions/](docs/decisions), one file each,
addressed by number and cited as `ADR-0007`. Each carries the measurement it rests on, the alternatives
that were refused, the guards that keep it, and what would reopen it. The filenames are the index.
