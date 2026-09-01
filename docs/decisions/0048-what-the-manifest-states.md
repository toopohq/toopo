---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/publication.ts
confirmed-by:
  - battery: registry-storage
    guard: the-public-fields-npm-shows-are-the-ones-this-code-declares
---

# What the manifest states, and the order a publication takes

## Context and Problem Statement

A guard read two fields of `package.json` and called itself *the public fields npm shows*. The two it
did not read were `repository`, absent, and `author`, carrying a name with no address — so the guard
whose subject is what npm shows was green over a page that would have offered no link to the code.

## Considered Options

- Extend the guard to the two fields somebody noticed.
- Make the population every field that resolves to something declared in code.

## Decision Outcome

**A guard that names a population and enumerates part of it fails on exactly the part nobody
enumerated.** `the-public-fields-npm-shows-are-the-ones-this-code-declares` read `license` and
`homepage`. The two fields it did not read were `repository`, absent, and `author`, carrying a name
with no address — so the guard whose subject is *what npm shows* was green over a page that would have
offered no link to the code. The repair is the population and not the two entries: every field of the
manifest that resolves to something declared in code is asserted, and a fifth belongs there the day it
is declared.

**`packages/registry/publication.ts` exists because a declaration a battery cannot reach is an assertion nothing
measures.** The guard lives in `registry/`, a battery injects into one folder, and `packages/cli/diff.ts` — where
the runtime floor's own sentence already sat — is in another. That is what decided the module, ahead of
any argument about where the fact belongs; the three values are then together because none of them is a
licence and none is a contract address.

**The runtime floor is derived from what the code calls, and two APIs agree.** `node:util`'s `diff`,
which `dist/packages/cli/diff.js` imports, and `node:module`'s `registerHooks`, which every entry point of this
repository reaches through `typescript-imports.ts`, are both declared `@since v22.15.0` by
`@types/node@26.1.2` — read off the types this repository installs rather than off anybody's memory.
**The 23 line is refused rather than assumed**, because nothing readable here establishes either API
anywhere in it, and refusing a runtime that cannot be established is the closed direction the security
filter already takes. `engines` is what npm reads *before* installing, so it is the only place this
project can refuse a runtime instead of crashing on it: without it, an install on Node 18 succeeds and
`toopo` fails at import inside a node internal, in front of somebody who has just typed the line a
contract page gave them.

**One field, two populations, and the gap is declared rather than closed.** A consumer installs
compiled JavaScript and 22.15 is enough for them. A contributor runs `node run-vitest.ts`, which needs
a runtime that strips types with no flag — a later version, as `packages/cli/diff.ts` says, and one no source
here names. It is not named because the only machine that could measure it runs v24.15.0, and what
would close it is a run on a 22.x runtime.

**`git+` is a prefix and not a second address.** npm's own documentation gives that spelling for
`repository.url`, the rendering of the field belongs to a page nothing here can reach, and where a
measurement is unavailable the convention belongs to whoever owns the format. The address itself
survives inside it word for word.

## Consequences

**The order is the site's order, arriving on a second artefact: the repository answers before the
package is published.** A `repository` npm cannot resolve produces a page with no link to the code and
nothing saying a link was meant — on a package whose whole argument is *go and check*. It is harmless
while `private: true` holds and frozen into every published version afterwards, exactly as a licence
header is frozen into somebody else's repository. **This costs nothing to obey while nothing is
published, which is why it is written down now rather than met by luck later** — the sentence
[ADR-0044](0044-what-an-archive-is-and-what-it-may-not-be.md) already carries, on the field instead of
on the site.

**A transcript is redacted of what is not its subject and never of its subject.** `vitest-entry-point.ts`
published one machine's home directory inside a measurement whose subject is the *case* of a path
segment. The case of every segment shown is the spelling that was really run; the home directory the
measurement never depended on is elided. A measurement missing its subject is worth nothing, and one
missing the rest is worth what it always was. It will be asked again of every transcript this
repository publishes, which is why it is a rule and not a repair.

## Confirmation

One guard, over a population rather than over a list: every field of the manifest that resolves to
something declared in code. What it cannot hold is the two fields that resolve to nothing — a
description and a keyword list are prose about the tool, and a guard comparing prose against prose is a
copy of the prose.

## What would reopen this

A fifth manifest field that becomes a fact rather than prose. `engines` was the fourth, and it became
one on the day the runtime floor was derived from `@types/node` instead of remembered.

## What could not be measured from here

**What could not be measured from here, named with what would settle it.** How npmjs.com renders a README — specifically whether it rewrites `[LICENSE](LICENSE)` and
`[CONTRIBUTING.md](CONTRIBUTING.md)` against `repository`, which is the documented behaviour and the
reason neither file needs adding to the tarball. And whether GitHub detects this repository as MIT:
`LICENSE` carries the MIT text followed by an MIT-0 appendix, and licence detection wants a close match
to a known text, so the plausible outcome is *View license* rather than *MIT*. Both are answered in
thirty seconds by somebody looking at the two pages on the day they go public, and neither is worth a
mechanism before then.

## More Information

- [ADR-0047](0047-what-licence-covers-what.md) — the licence this manifest transcribes.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
