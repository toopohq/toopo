---
status: accepted
date: 2026-08-23
decision-makers: Mathis Perron
governs:
  - packages/site/what-a-control-says.ts
  - packages/site/start.ts
  - packages/site/searching.ts
  - packages/site/playground.ts
  - packages/site/browser.ts
confirmed-by:
  - battery: site
    guard: the-copy-control-names-the-command-and-never-itself
  - battery: site
    guard: every-word-the-copy-control-carries-says-something-the-others-do-not
  - battery: site
    guard: a-command-this-control-cannot-take-apart-is-one-it-refuses-to-rewrite
  - battery: site
    guard: the-way-the-page-serves-is-the-one-the-control-opens-marked
  - battery: site
    guard: a-refused-way-shows-the-spelling-that-works
  - battery: site
    guard: a-refused-way-carries-its-measurement-and-a-way-that-runs-carries-nothing
  - battery: site
    guard: a-reader-who-is-searching-is-never-shown-nothing
  - battery: site
    guard: a-query-whose-every-word-is-known-is-told-that-and-not-an-empty-list
  - battery: site
    guard: a-result-links-to-the-contracts-own-address-under-the-root-of-the-site
  - battery: site
    guard: an-answer-about-a-query-the-reader-has-left-is-not-shown
  - battery: site
    guard: both-answers-are-fetched-once-however-often-a-reader-types
  - battery: site
    guard: a-catalogue-that-failed-is-asked-again-on-the-next-keystroke
  - battery: site
    guard: nothing-answering-is-told-apart-from-a-host-that-answered-something-else
  - battery: site
    guard: a-diagnostic-is-called-where-the-answer-is-null-and-nowhere-else
  - battery: site
    guard: a-module-loaded-before-a-reader-acts-is-one-the-entry-point-imports-outright
---

# The decision a control makes leaves the file nothing executes

## Context and Problem Statement

`packages/site/start.ts` builds the copy control, the choice of package manager, the search field in
the masthead and the playground's form. It is everything on this site a visitor touches with a mouse,
and **nothing in this repository has ever verified that any of it does what it says.**

It is not *no test covers it*. It is stronger and it is measured: the module **exports zero names**, so
nothing can import it, no guard can call into it, and no mutant injected into it could ever be killed.
`mutation/site.battery.ts` has declared `contractPath: 'packages/site'` since it was written, so a cell
there was always mechanically possible; there were none, and nothing anywhere recorded that as a
decision. It was an absence, never a refusal.

The entry for it on `CLAUDE.md`'s list of what this repository declares and nothing keeps had been
there since ADR-0156, and it named the closure as *a document in the site suite, which means a DOM
environment, which means a sixth dev dependency for one file of fifty lines.* **That sentence is wrong
twice** and this unit was opened by asking it for evidence rather than acting on it.

### What was measured before anything was decided

At `17cc9bf`, over the executable text of `start.ts` - the source with its types stripped and its
argument removed, which is the artefact a browser receives - by the rule that a line is *delivery* as
soon as it names the document, the navigator, or an object that came from one:

| | lines | | bytes | |
| --- | --- | --- | --- | --- |
| delivery | 117 | 51.1 % | 4 902 | 63.4 % |
| decision | 55 | 24.0 % | 2 126 | 27.5 % |
| structure | 57 | 24.9 % | 698 | 9.0 % |

**That 27.5 % is a floor and the rule is why.** A line is classed delivery as soon as it touches an
element, including the lines whose *content* is a pure decision written straight into one. Eighteen of
the 117 are exactly that, named one at a time rather than estimated - the `aria-label` built twice, the
three words the copy button carries, `command.nodeValue = ...`, the refusal text and its `hidden` flag,
`item.href`, the stale-answer comparison, the message of a `throw`. They weigh **979 bytes**. Corrected:

```
delivery (net)   3 923   50.8 %
decision         3 105   40.2 %
structure          698    9.0 %
```

**Two fifths of the file was a claim about what a visitor reads, expressed as an argument to
`setAttribute`.** The file is 457 lines, not fifty. And the entry's conclusion - that a document is
what stands in the way - is contradicted by its own subject: a document is what stands in the way of
the *other* three fifths.

Counted as claims rather than as bytes, which is what actually decides the shape of a unit: **twenty-two
things a guard could assert, against five wiring behaviours that genuinely need a document.**

### `searching.ts` was in a different state, and worse in one direction

Found while measuring the first. It exports four names, no test imported it, and the site battery
injected nothing into it either. Where `start.ts` is unreachable by construction, this was **reachable
the whole time and simply not reached** - and it carried a declaration in its own comment, *a rejected
promise is not kept, the next keystroke asks again*, with nothing behind it.

ADR-0137 had already written the condition under which its separation from `start.ts` would start to
pay: *the two are one file's worth of separation that only matters once something else runs a query.*
A guard is that something else. The split was made in advance for this moment.

### Two published figures do not reproduce, and the files did not move

ADR-0156 and `CLAUDE.md` both publish *7 532 bytes of executable text, 17.7 % of the 42 530 the nine
modules carry.* Measured at `17cc9bf`: `git diff --stat 80e3821..17cc9bf` over all nine modules is
empty, and `served-modules.ts` - the reader - did not move either. Four readings of the phrase were
tried:

| | `start.ts` | the nine | share |
| --- | --- | --- | --- |
| comments out, whitespace kept | 9 556 | 59 327 | 16.1 % |
| comments out, blank lines and indentation out | 7 954 | 42 369 | 18.8 % |
| types really removed, comments out | 9 364 | 45 385 | 20.6 % |
| the same, tightened | 7 811 | 38 692 | 20.2 % |
| **published** | **7 532** | **42 530** | **17.7 %** |

The second approaches the total to 161 bytes and misses the file by 422. **No reading rebuilds both.**
Neither figure is corrected - both are stamped, and ADR-0018's rule is that a stamped reading stays as
it was taken. What replaces them is the table above, which carries its rule as well as its commit. The
gap is in the rule, and the rule was the half that was never written down.

## Considered Options

### Refused: a headless browser, for the fourth time and on a reason that is new

Three entries of `CLAUDE.md` already price one and refuse it, one of them with the argument that *a
unit repairing a layout is not where one decides to add a tool to the repository, because the decision
would be taken by whoever most wants the layout to land.* That argument applies to this unit with the
word `layout` replaced, and it is why the tool is refused here even though this unit could use one.

**The measurement is what makes the refusal something other than obedience to a precedent.** Twenty-two
of the twenty-seven claims are functions from `string`, `boolean` and flat records to `string`. None of
them needs a document; what needs one is the wiring, and the wiring is what is left over.

The need is also **not the one the three earlier refusals priced**. Those wanted a page laid out and so
wanted a rendering engine. This wants a module executed against a document, which is a different tool
at a different price. That question is left open and better posed rather than answered here.

### Refused: `document.ts`'s node vocabulary as the target of the extraction

The tempting shape for *what a control says* is a tree, and `document.ts` already has one - `Node`,
`el`, `text`, two projections and a battery behind it. It is refused twice over and both are
measurements rather than tastes.

Its `Tag` is a closed union of **seventeen** names with no `button`, `input`, `label` or `span` in it.
`CLAUDE.md` already records the last time somebody wanted to widen it and refused, and widening a union
that is small on purpose is a decision, not a step inside another unit. And the module weighs **23 933
bytes** and imports `paths.js` and `served-stylesheet.js`, into a browser graph kept to nine modules on
a measurement.

**Neither cost is worth paying for decisions that are strings.** The widest of them is the search
panel, and it is a union of four flat shapes with a list inside one.

### Refused: sharing `ReadOneAddress` rather than declaring a second one

`packaging/what-npm-holds.ts` declares `(url: string) => Promise<{ status, body }>` and
`what-the-origin-lists.ts` imports it. `searching.ts` now needs the same shape, and there is a precedent
for the cross-folder import in either direction - `packages/registry/serialise.ts` reaches into
`packaging/reachable.js` today.

It is declared a second time anyway. Sharing it properly means a home neither folder owns - which is
`packages/registry/`, reached by both - and that is one new module for a type of one line plus four
files edited in a folder this unit has no business in. The alternative, importing npm's own reader
module into a browser module of the catalogue to borrow a function type, is a dependency no reader can
make sense of. **The duplication is one line, it is named in `searching.ts`'s own header, and what would
close it is priced there.**

### Refused: leaving `searching.ts` for a unit of its own

It would have opened an entry on this list for the second half of one absence, purely because of the
order the work happened in. ADR-0137's reopening condition names this exact moment, and the injection
point it needs is a pattern this repository already has and already guards.

## Decision Outcome

**`packages/site/what-a-control-says.ts` holds every decision the always-loaded controls make**, as
pure functions over strings, booleans and flat records. `start.ts` keeps delivery and nothing else:
finding an element, building one, writing a value into it, wiring an event.

**The playground's four claims went to `playground.ts` instead**, and that is not untidiness. That
module is the deferred half of the browser graph - nine of the thirteen pages never fetch it - so its
decisions belong there rather than in a module every page loads. It already had guards and cells; it now
has `theFieldLabelFor`, `theAnswerShown` and `theWhatWentWrong`.

### What the reader pays, stated rather than smoothed

The split adds a module to the five every page loads before a reader acts. Measured at this commit, by
ADR-0156's own method and reproducing its published figure of 6 094 B exactly:

```
before   26 675 raw    6 094 brotli   5 modules
after    31 398 raw    7 166 brotli   6 modules
the bill  4 723 raw    1 072 brotli
```

**Every page is 1 072 B heavier in brotli**, which gives back 5.5 % of the 19 475 B ADR-0156 removed one
unit ago. `start.ts` itself grew by 286 served bytes rather than shrinking, because the panel is now
painted by one function total over a union and two element builders are named where they were inline.

That is the trade taken knowingly: a kilobyte per page against the only part of this product a visitor
touches having no verification at all.

### The cache became a closure, and that is what made two sentences checkable

`searching.ts` held its promise in a module-level binding. State living in a module is shared by
everything that imports it, so a guard over *a rejected promise is not kept* would have been reading
whatever the guard before it left behind - and the repair for that is a way to reset the cache, which is
a door in the product that exists for the tests.

`arrivingOnce(read)` returns a reader holding its own. One page builds one; one guard builds one. Both
sentences the old comment asserted are now guards, and both have a cell.

### The typed word count the extraction revealed

`const arguments_ = (command.nodeValue ?? '').trim().split(' ').slice(2).join(' ')` is correct for
`npx toopo` and silently wrong for anything else: on `yarn dlx toopo add x` it answers `toopo add x`.
Nothing had ever looked at it, because the served command is always the invocation.

It is `theArgumentsIn` now, derived from `THE_INVOCATION` and answering `null` for a command it cannot
take apart - so the control builds nothing rather than rewriting a command wrongly. **The derivation
itself is not observable and that is published rather than hidden**: on every input the function
accepts, the typed count and the derived one agree, so no guard can separate them. What the guards do
reach is the refusal, which the old spelling did not have. W-104 is that cell.

### The guard the entry point's own list never had

`LOADED_BEFORE_A_READER_ACTS` cited
`every-page-loads-the-search-and-only-a-contract-page-loads-the-playground` in its own comment.
Measured at `17cc9bf`: **no suite in this repository collects that identifier and no record cites it**,
so it was outside `confirmationFaults` and `citationFaults` alike - the class ADR-0126 opened an entry
for, met here by adding a row to the list and asking what would check it.

`a-module-loaded-before-a-reader-acts-is-one-the-entry-point-imports-outright` closes over the entry
point instead: what survives stripping written `from` is fetched before anything happens, what survives
written `import(` is waited for. It is the neighbour of
`every-import-a-browser-module-keeps-is-a-module-the-site-writes` and the two say different things - one
is about *what* a browser loads and one about *when*.

### Twenty-four guards, and the population asserted before each sweep

The site suite goes from 139 guards over 11 files to **163 over 13**. The battery goes from 746 cells to
**765**, all nineteen new ones killed.

Each sweep asserts that what it sweeps is not empty, because a guard over *every refused way* passes
comfortably when there are none. One of them met the limit rather than the rule: **no query of this
catalogue answers with an installable contract and a refused one at once**, measured over eleven
candidates - `array/group-by@1` is the only contract carrying a refusal and nothing reaches it beside
another. The mixed list is therefore assembled from two real answers rather than met, and no contract is
invented to make it.

### The battery refused the run and named what no reading of mine had

Fourteen cells were written for the twenty-four guards, on a judgement about which defects were
plausible. **Every one of the fourteen killed exactly what it declared, and the run still exited 1**:
five guards had nothing reddening them at all, and the instrument named them one by one rather than
reporting a total that looked healthy.

    a-module-loaded-before-a-reader-acts-is-one-the-entry-point-imports-outright
    what-the-form-prints-when-a-call-throws-is-what-the-call-threw
    what-follows-the-invocation-is-what-the-page-already-asked-for
    a-reader-who-has-not-typed-meets-the-queries-this-catalogue-answers
    a-catalogue-that-could-not-be-read-says-so-in-the-failures-own-words

**Nothing beside the battery could have found them.** The guards were green, the cells were green, the
suite was green, and the count was the count - which is exactly the shape a guard that cannot fail
presents to anybody reading it. W-116 to W-120 are those five, and one of them is instructive on its
own: `what-follows-the-invocation-is-what-the-page-already-asked-for` was believed covered by W-104,
and it is not, because W-104's typed word count and the derived one **agree on every input the function
accepts** - so the cell reddens the refusal and leaves the ordinary answer untouched. W-118 is the
other half of the same function.

This is the discipline working on its own author inside one unit, and it is worth more than the
fourteen: a judgement about which defects are plausible is a judgement, and the accounting is what
makes it answerable.

### The cell this section exists for

W-115 calls a contract's diagnostic before deciding whether to show it. **Both printed lines are byte
for byte what the correct version prints.** The only difference is that a diagnostic now runs on every
keystroke of every successful call, on somebody else's machine, invisibly - and no comparison of the
output could ever say so. It is killed because `theAnswerShown` is handed something to call rather than
something already called, which makes *not calling it* an observable.

## What this unit did not buy

**It does not keep `start.ts` calling any of it.** A guard over `theSpellingShownFor` is green on the
day the control stops asking for it, which is the class this repository has five recorded instances of.
That is the honest limit of a split, it is written into both new files rather than left to be
discovered, and the entry on `CLAUDE.md`'s list closes by half rather than whole.

**A guard reading `start.ts`'s text for the names it calls was considered and is not written.** It would
prove that an identifier appears in a file, not that a value reaches an element, and a weak guard
standing where a real one is missing is worse than the gap - it reads as coverage.

**The residue is five behaviours, not a file.** Appending, wiring events, focus management,
`navigator.clipboard`, reading `dataset`. Whoever prices the tool for those is answering a much smaller
question than the one this unit was handed.

## What would reopen this

A tool that can execute a module against a document, decided on its own merits and not inside a unit
that wants one. On the day there is one, what it has to cover is the five behaviours above and nothing
else - the twenty-two decisions are already answered here.

A second surface running the catalogue's search would reopen `searching.ts`'s shape rather than this
decision, which is ADR-0137's own reopening clause still standing.

## More Information

- [ADR-0156](0156-the-proof-for-javascript-is-not-the-browsers-and-it-is-the-cheaper-one-to-keep.md) —
  where the absence was measured and deliberately not repaired, and whose byte figures this unit gives
  5.5 % back to.
- [ADR-0137](0137-the-site-serves-the-search-the-client-serves.md) — the search this site runs, and the
  clause naming the moment `searching.ts` would need a second caller.
- [ADR-0138](0138-a-reader-chooses-their-package-manager-and-every-form-was-measured.md) — the choice of
  package manager, and the measurement that refuses one of the four.
- [ADR-0126](0126-a-domain-carries-what-it-turned-down.md) — the class the browser graph's own
  comment turned out to be in.
- [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) — why the copy control is built
  rather than served.
- [ADR-0096](0096-a-field-is-typed-or-spelled-and-the-type-decides.md) — why a field holds text, and why
  the answer names the call it was made from.
