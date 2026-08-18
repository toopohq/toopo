# Toopo

**Utility functions you copy into your project, each verified against a public, executable
contract.** Not a dependency: the source lands in your repository and it is yours.

```sh
npx toopo add string/slugify
```

One file lands in `src/lib/toopo/string/slugify.ts`, with its digest recorded in `toopo.lock`. It
imports nothing. There is no runtime, no wrapper, no resolution step: after the install, nothing of
ours runs in your program. `npx` is the one spelling that works whether or not you have installed
anything, and on a first run it names the package and its exact version and waits for a word — on a
product whose thesis is that you verify what you receive, that prompt is the first demonstration of
the thesis. `npm install -g toopo` makes the prefix optional.

```ts
import { slugify } from './src/lib/toopo/string/slugify.js'

slugify('Crème Brûlée')      //=> 'creme-brulee'
slugify('Salt & Pepper')     //=> 'salt-pepper'
slugify('  hello   world  ') //=> 'hello-world'

slugify('日本語テキスト')      //=> '日本語テキスト'
slugify('Привет мир')        //=> 'привет-мир'
```

The last two lines are the point, and they are what nobody expects: **the output is Unicode, not
ASCII.** Japanese stays Japanese and Cyrillic stays Cyrillic, because what a slug drops is
punctuation, symbols, emoji and case — not other people's writing systems. A library that
transliterates instead has picked a romanisation scheme on its users' behalf and frozen it into a
table of two thousand entries; this contract picks none, and argues for that at length rather than
asserting it.

Every line above is a row of the contract's table, quoted rather than composed. Which is the next
thing to explain.

## What a contract is

The utility is not the product. **The contract is:** the complete, executable specification of one
function — its TypeScript signature, the invariants that must hold for every input, every edge case
named, settled and argued for, and its benchmark profiles. Implementations compete underneath it and
are interchangeable. The registry owns the contract; you own the copy of the code.

So `slugify('Привет мир')` above is not an example written for a README. It is this row, and
`cyrillic-is-kept` is its address:

```ts
{
  id: 'cyrillic-is-kept',
  group: 'the-surprise-in-front',
  text: 'Привет мир',
  expected: 'привет-мир',
  provenance: 'specified',
  rationale:
    'Cyrillic is lower-cased and kept, and the space between the words becomes one separator. …',
}
```

Beside the table sit the properties, which say what must hold for *every* input rather than for a
named one — `p2-idempotence`, that slugging a slug changes nothing; `p8-one-separator-per-gap`, that
a separator appears exactly between two runs. `toopo add` writes you the implementation and nothing
else. The table that judges it, the properties, the rationales and the benchmarks stay in the open,
at the address written into the first line of the file you installed.

## What is in the catalogue

**5 contracts, 4 of them installable and 1 refused.** The refused one was considered, measured
against what the language now does, and turned down — and it is published here beside the four
rather than deleted, because a catalogue that only shows what it accepted is a catalogue you cannot
check.

| Contract | What it settles |
| --- | --- |
| `typescript/number/parse@1` | Turning text into a number without `Number`'s traps |
| `typescript/date/add@1` | Calendar arithmetic, including what a fractional month means |
| `typescript/string/levenshtein@1` | Edit distance, over code points rather than code units |
| `typescript/string/slugify@1` | Text to a URL-safe identifier, Unicode rather than ASCII |
| `typescript/array/group-by@1` | **Refused.** ES2024 shipped `Map.groupBy` and it answers the contract |

Between them the four installable contracts settle **157 named edge cases**, each with an identifier
frozen for the life of the major version, so that a report, a URL anchor and an API response can all
cite the same one.

- [toopo.dev](https://toopo.dev) — the catalogue, one page per contract, with a playground that runs
  the implementation on what you type
- [toopo.dev/method/](https://toopo.dev/method/) — how the verification is measured, and what it
  does not establish

## Why you can believe any of it

Because the tests are measured, and the measurement is a command you can run.

This repository carries 19 mutation batteries. They inject **667 deliberate defects** into it — each
one a committed file naming the exact edit it makes and the verdict it must produce — and re-run the
whole suite once per defect. **632 are caught.** The 35 that survive are each classified, and the
split is published with the total because a survivor count alone reads as a count of holes: 12 are
equivalent mutants, 6 are behaviour the contract declines to specify, 4 are unreachable on this
catalogue, 12 exist only where a lens deliberately took the suite's sight away, and **exactly one is
a debt**.

```sh
pnpm install
pnpm run mutation    # tens of minutes; replays all 667 cells and prints the total
pnpm run tally       # prints it again from what the replay left, measuring nothing
```

A high score does not say the code is correct. It says the tests notice the defects that were
tried — and here the defects that were tried are files you can read.

Which leaves one thing worth being plain about: **every figure here is read off the batteries in this
repository, where each cell carries the verdict it must produce. That is what this project asserts
about its own tests. It is not yet something you have seen happen.** A guard resolves each figure
against those batteries, so this page cannot drift from what the instrument declares — and drift is
the only thing it protects you from. The command above is what turns the claim into an observation,
and what it prints happened on your machine rather than on ours.

## Limits, stated rather than discovered

- **One implementation per contract.** The contract's whole design is that implementations compete
  underneath it and are interchangeable; today each has exactly one, ours. Benchmark figures are
  empty for the same reason — there is no reference machine and nothing to compare against.
- **No submissions yet.** The validation pipeline that judges a third-party implementation exists
  at its first stage only.
- **TypeScript only**, and every address says so: `typescript/number/parse@1` is the contract's page,
  the first line of every file you install, and what `toopo.lock` records. A second language would
  bring its own contracts rather than sharing these, and it renames none of these addresses. The
  command takes no prefix — `npx toopo add number/parse` — because the language is which client you
  ran, not something you choose per install.
- **A published contract major is frozen for life.** An incompatible change creates `name@2` beside
  `name@1` and never edits `name@1`. That is the promise the whole registry is built to keep, and
  it is why so little has been published.

## Licence

This repository is MIT. **What `toopo add` copies into your project is MIT-0** — the MIT licence
with its attribution clause removed — so you owe nothing for the code you receive: no notice, no
attribution, no mention anywhere. The two-line header on those files is provenance, not a condition;
its first line is the address of the contract that file was verified against, so whoever finds it in
six months can look up what it is meant to do. You may delete it.

[LICENSE](LICENSE) carries both texts and the reason for the split. The perimeter is derived from
what the installer actually copies rather than from a list of paths, because a legal boundary kept
by a declaration nothing enforces is how a file ends up in somebody else's repository under the
wrong licence.

## Where the rest of it is

[CONTRIBUTING.md](CONTRIBUTING.md) says what this catalogue can receive and what it cannot — an
implementation, an input where ours is wrong, a correction to a search alias, and never a contract.
The reason is arithmetic rather than a policy, and it is counted there so you can check it. It also
carries the commands that run each suite.

Every decision that has been settled is a record in [docs/decisions/](docs/decisions), one file each,
addressed by number and cited as `ADR-0007`. Each carries the measurement it rests on, the alternatives
that were refused, the guards that keep it, and what would reopen it. The filenames are the index.

`CLAUDE.md` is where the project stands: what exists, what does not, what is still open with what each
entry costs, and the rules a session works under. **It is not a specification**, and it is not what to
read before contributing.
