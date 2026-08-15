---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/browser.ts
  - packages/site/read-literal.ts
confirmed-by:
  - battery: site
    guard: every-case-replays-through-the-stripped-artefact-a-browser-runs
  - battery: site
    guard: every-import-a-browser-module-keeps-is-a-module-the-site-writes
  - battery: site
    guard: a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing
  - battery: site
    guard: what-runs-in-your-browser-is-said-once-and-beside-the-playground
---

# What runs in a reader's browser, and how it gets there

## Context and Problem Statement

A playground has to run this repository's own modules in a browser. Everything here is TypeScript, and
the registry serves TypeScript: what a browser executes is therefore neither the file the registry
serves nor the file the digest covers.

## Considered Options

- Bundle the modules.
- Compile them with `tsc` in a subprocess.
- Strip the types with node's own stripper, and ship the module graph as it is.

## Decision Outcome

**The `.js` specifiers this repository already writes are what make the playground free.** Every
relative import is written `./literal.js` for `literal.ts`, because `verbatimModuleSyntax` asks for it.
A browser resolves exactly that spelling natively, so a module graph written for a typechecker turns
out to be one a browser can load: no bundler, no rewriting, and the whole of the work is stripping the
types. The site's layout *is* the source's layout, and a reader who opens `/site/read-literal.js` sees
the file it came from rather than a bundle corresponding to nothing.

**Node's own stripper rather than a compiler**, and it is the only one available: `typescript@7.0.2`
ships a native compiler and no JavaScript API — `node_modules/typescript/lib/` holds `tsc.js` and a
version string — so a compiler here would mean a subprocess, and a subprocess would put a page's
content behind something no guard can reach. `stripTypeScriptTypes` refuses what it cannot erase rather
than guessing, which is the direction of failure this repository asks for.

**The replay guard imports the stripped artefact, not the TypeScript module it came from.** Importing
the module would measure something adjacent to what is shipped: it would establish that the arguments
are built correctly and leave unmeasured the one thing stripping can break — that the JavaScript
answers what the TypeScript did. So the reference is fetched by digest through the port, stripped by
the site's own function, and imported from a `data:` URL, which needs no disk because a reference
imports nothing. **That is what turns `stripTypeScriptTypes` being experimental from a declared risk
into a thing measured on every run**, which is the treatment `node:util.diff` already received.

## Consequences

**The one sentence about the gap lives beside the playground and nowhere else.** The JavaScript that
answers a reader is neither the file the registry serves nor the file the digest covers — both are
TypeScript. It is said where somebody is looking at an answer that transformation produced, and saying
it again under *What you can check yourself* would blur the section that is about the frozen
definition, where nothing has changed.

**A page is complete with no JavaScript, and the form is built by the script rather than served inert.**
A form in the HTML that does nothing without JavaScript is a control that lies about being one, and an
empty section tells a reader something is missing without telling them what. Without the script the
section is two paragraphs saying what a playground would do, which is prose rather than a hole. The
`script` node carries attributes and no children, so `document.ts`'s rule that no node holds raw markup
survives a script on the page.

**What the port had to gain, and the sentence that had to go.** `blob` was refused from the site's port
on the argument that *the site publishes no byte of anybody's source* — true of a page that only
renders, false of one that runs something, and a snapshot cannot stand in because it lists a file and
hashes it and a list of hashes does not execute. `needs.ts` had no need for it either. Three more
sentences fell in the same unit and were repaired in place rather than left to be found: *serves no
byte at all* in `packages/site/local-source.ts`, *no script* in `document.ts`, and
`NOT_THIS_UNIT['pre-fill-the-playground']`, the debt this closes.

## Confirmation

`every-case-replays-through-the-stripped-artefact-a-browser-runs` is the load-bearing one, and the
reason it imports the artefact rather than the module is in the Decision Outcome above: the other
reading measures something adjacent to what ships.
`every-import-a-browser-module-keeps-is-a-module-the-site-writes` is what keeps the no-bundler claim
true as the graph grows — a browser module reaching a file the site does not write is a page that 404s
in somebody's browser and nowhere else.

## What would reopen this

`stripTypeScriptTypes` leaving experimental status, or being removed. The first changes nothing and the
second is what the replay guard exists to make loud: it fails on the day the stripping stops agreeing,
rather than on the day somebody reads a release note.

## More Information

- [ADR-0028](0028-what-a-playground-demonstrates-and-what-it-refuses-to-show.md) — what the running
  code is for.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
