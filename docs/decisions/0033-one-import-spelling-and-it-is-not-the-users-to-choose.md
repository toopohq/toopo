---
status: accepted
date: 2026-08-15
governs:
  - packages/cli/report.ts
  - packages/cli/rewrite.ts
confirmed-by:
  - battery: cli-install
    guard: an-import-line-is-printed-ready-to-copy
  - battery: cli-install
    guard: the-import-line-follows-the-configured-directory
  - battery: cli-install
    guard: an-import-line-names-the-diagnostic-beside-the-answer
  - battery: cli-install
    guard: the-users-tsconfig-is-never-read
---

# One import spelling, and it is not the user's to choose

## Context and Problem Statement

`toopo add` ends by telling somebody how to use what it just wrote. A path is not what anybody types in
an import, and the extension a specifier carries is a question every TypeScript project answers
differently — so the obvious move is to detect the user's toolchain and match it.

## Considered Options

- Detect the user's module resolution and write the specifier their toolchain expects.
- Write one spelling, and argue it from what Toopo's own files do.

## Decision Outcome

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
with its measurement, because whoever meets it wants to know it is known. `packages/cli/toopo.ts` had already
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

## Consequences

`the-users-tsconfig-is-never-read` is a guard rather than a sentence, because the alternative to this
decision is a whole class of behaviour — reading a project's configuration to decide what to print — and
the cheapest way to keep a decision like that is to make its absence checkable.

## Confirmation

The three guards over the line hold what it says: that it is a copyable import rather than a path, that
it follows the configured directory rather than the one the tool would have proposed, and that a
contract publishing a diagnostic has both names on the line. The fourth holds the absence.

## What would reopen this

The alias import style, which `toopo.json`'s `version: 1` exists to carry. `init` would detect an alias
prefix once and record it, and the line would then have two spellings and a recorded reason to choose
between them — which is a setting with two possible values, and therefore one this project may write.

## More Information

- [ADR-0032](0032-what-an-installation-looks-like-on-disk.md) — where the file the specifier names lands.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
