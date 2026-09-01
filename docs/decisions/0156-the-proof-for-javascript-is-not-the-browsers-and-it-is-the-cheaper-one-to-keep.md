---
status: accepted
date: 2026-08-22
governs:
  - packages/site/served-modules.ts
  - packages/site/browser.ts
  - packages/validation/typescript-api.ts
confirmed-by:
  - battery: site
    guard: every-module-a-reader-runs-carries-no-comment
  - battery: site
    guard: a-module-a-reader-runs-is-the-program-its-source-declares
  - battery: site
    guard: a-contracts-reference-reaches-a-reader-with-its-argument-intact
  - battery: site
    guard: no-module-a-reader-runs-carries-a-comment-a-tool-reads
---

# The proof for JavaScript is not the browser's, and it is the cheaper one to keep

## Context and Problem Statement

ADR-0141 took the argument out of the stylesheet a reader downloads and refused to do the same to the
browser modules, in a section of its own. It gave three reasons, and the third settled it: *the
verification above does not transfer* - `CSSStyleSheet.replaceSync` and a rule-by-rule comparison have
no JavaScript equivalent, so the second half would land without the check that makes the first
defensible.

The question this unit was opened to answer is that one and only that one. **What is the proof, for
JavaScript, that stands where a walk over `cssRules` stood for CSS?** Until it is answered the change
is not defensible, because a green suite establishes that what the suite exercises works and not that
nothing moved.

**The answer is that the proof exists, that it is not the browser's, and that it can be a guard where
the CSS one could only ever be a reading.** The refusal was right about the form and its conclusion
was inverted.

### What the argument is worth, re-measured before it was used

Measured at `43db0c2` on the built tree, by the compiler's parser read over the served bytes:

| | bytes |
| --- | --- |
| the fourteen served modules | 175 400 |
| their comments, 62 % | 107 979 |

**The figure that decides is not that one.** 107 979 B is the tree, and no reader loads fourteen
modules. In brotli at quality 11, each response compressed on its own, read across the change:

| | before | after | saved |
| --- | --- | --- | --- |
| the five modules every page loads | 25 569 | 6 094 | **19 475** |
| the four a playground adds | 16 328 | 7 120 | 9 208 |
| a contract page, all nine and the reference | 43 163 | 14 480 | **28 683** |

ADR-0141 bought 7 919 B per page. This is **2.46 times that on every page of the tree**, and **3.62
times on a contract page**. The five modules were 6.7 times the weight of the front page document and
are now 1.6.

**The figures in the commit that carried this are the simulated ones and these are the shipped ones**,
which is ADR-0141's own recorded mistake arriving one unit later: it published figures taken by
substituting a variant that was never shipped, and wrote *simulate the artefact you are going to ship,
or measure after*. The five modules were predicted at 6 090 B and shipped at 6 094. The record carries
the tree; the commit does not.

## Considered Options

### What JavaScript offers where CSS offers `cssRules`: nothing, measured four ways

The CSS proof works because the browser exposes a **total, re-serialised, comment-free** form of the
artefact and is itself the consumer. Every candidate for that role in JavaScript was read off the
runtime rather than reasoned about:

- **`Function.prototype.toString` returns source text, comments included.** Two functions with the
  same behaviour and different prose stringify differently, and the prose is present in the result. The
  one place an engine hands back a representation of code, it hands back exactly what differs.
- **A function's observable surface is `name` and `length`**, and both are equal for two functions with
  *different bodies*. A comparison of shape is blind to a body.
- **A module namespace exposes names and values**, and no body at all.
- **V8's code cache is not a normal form**: two sources differing only in a comment produce cached data
  of the same length and different bytes.

**There is no `cssRules` for JavaScript**, in a browser or in node. That is a fact rather than an
impression, and it is what makes everything below a second-best rather than a preference.

### Refused: treating a green suite as the check

It is what the objection to this change would have been reduced to, and it is refused in the sentence
this repository already lives by. A suite is total over what it exercises. **`packages/site/start.ts`
exports nothing** - measured, zero exported names - so nothing can import it and nothing runs it, and
it is 7 532 of the 42 530 bytes of executable text in the nine modules. The module that builds the
search field and the copy control is the one no test reaches.

### Refused: a reader of JavaScript written from scratch

ADR-0141 priced this as *a JavaScript reader handling strings, template literals and regular expression
literals, whose mis-reading costs executed code rather than bytes*. That price is real and was paid
before it was refused: a reader written for this unit, by somebody who had just enumerated the
hazards, **agreed with the parser on the six files it finished and looped for ever on the seventh**.

### Refused: the compiler's scanner, looped over

The obvious in-process reading, and it is wrong on this repository's own modules. Measured on
`packages/registry/address.js`: a bare `scan()` loop reports **10 comments and 9 644 bytes** where the
parser reports **25 and 16 358**. It loses the parity of a template literal at line 204 - without the
parser to ask for `reScanTemplateToken`, the closing backtick of a substitution reads as an opening one
- and the prose of this repository is full of backticks, so it never resynchronises.

**It raised no error. It returned a plausible number.** That single reading is the whole argument for
everything that follows.

### Refused: the parser in the build

`typescript/unstable/sync` loads a *project* and spawns the compiler. `browser.ts` refuses a subprocess
in the path of a page's content, and that refusal stands. What did not stand is the premise it was
written on, repaired in its own commit: the paragraph claimed `typescript@7.0.2` ships *no JavaScript
API*, offering `lib/` holding `tsc.js` and a version string as evidence. The evidence is true and
establishes nothing - the API is under `dist/`, reached through an `exports` map naming eleven entries
including `./unstable/ast` and `./unstable/ast/scanner`. **There is an in-process JavaScript API**, and
what TypeScript 7 removed is a standalone parser. `packages/validation/typescript-api.ts` has stated it
correctly since it was written: two files, one fact, one of them wrong, and the wrong one is the file
somebody opens to ask this exact question.

### Refused: taking the argument out of a contract's reference too

The five `reference.js` are 23 644 B of the 175 400 and carry **15 417 B of comment** - 14 % of
everything this unit could have taken. It is refused for two reasons and neither is about bytes.
`contract-page.ts` publishes *the JavaScript this runs is that contract's own `reference.ts` with its
types stripped*, on the one page whose subject is that this catalogue can be checked; a second removal
makes that sentence false. And the file is frozen for the life of the major, so every step the served
artefact takes away from the one the digest covers is a step an auditor's fetch stops establishing.

**It costs a reader nothing**, which is what makes the refusal cheap: no reference is among the five
modules a page loads before a reader acts, so the per-page figures above do not move by a byte. The
real seam is 92 562 B and not 107 979.

`asAContractsReference` is the second function and
`a-contracts-reference-reaches-a-reader-with-its-argument-intact` is what stops somebody reaching for
the shorter name.

## Decision Outcome

`packages/site/served-modules.ts` holds a reader built out of the compiler's scanner, driven.

**The scanner does the language and this file does the two ambiguities it cannot resolve alone** -
whether a `/` opens a regular expression or divides, and where a template literal resumes after a
substitution. Escapes, unicode, line terminators and numeric literals are the compiler's and are
already right. Measured over the served modules, neither arm is born green: **21 regular expression
literals and 74 template substitutions**.

The replacement is the one the specification names: a comment carrying a line terminator becomes one,
because it *is* one for automatic semicolon insertion; a comment carrying none becomes a space, which
keeps two tokens apart without inventing a line break.

### The proof, and why it is a third party's

The equivalent of walking `cssRules` and comparing `cssText` is **walking both syntax trees and
comparing every node on its kind, its child count and the value at it if it is a leaf**.

Never the node's own source text, which is the reading this guard was written with first and which
cannot fail: an enclosing node's text carries the comments inside it, so two modules differing only in
comments differ at every node that contains one. `cssText` is a re-serialisation and not a slice of the
sheet, and this is the same move.

**The child count is what makes it a comparison of trees rather than of a sequence.** A pre-order list
of kinds is not injective over trees of varying arity; one term buys the difference between the guard's
name and what the guard does.

**The price is that this parser is not the one that will run the code, and that is a real weakening
rather than a formality.** For CSS the browser parsed and the browser rendered, so both readings came
from the consumer. Here the consumer is V8 and it exposes no tree. What makes the substitute
acceptable is not that it is close enough: it is that this repository already trusts this parser with
more. `typescript/unstable/sync` is what stage 1 of the validation pipeline reads a submission with. A
parser trusted to decide *does this enter the catalogue* is one that can be trusted with *is this the
same program*.

And it was checked against the consumer on the one point that matters. A `return` separated from its
value by a comment spanning a line:

| | V8 answers | the parser builds |
| --- | --- | --- |
| the comment kept | `undefined` | `ReturnStatement, ExpressionStatement` |
| replaced by a line terminator | `undefined` | `ReturnStatement, ExpressionStatement` |
| deleted | `42` | `ReturnStatement` |

Case for case, they agree.

### The comparison, measured and perturbed

Measured at `43db0c2` over the fourteen served modules and one planted hazard, **9 637 nodes**:

| | nodes differing |
| --- | --- |
| comments replaced **by the rule** | **0** |
| replaced by nothing at all | 3, all in the planted hazard |
| replaced by a space always | 3, all in the planted hazard |
| one statement deleted | 375 |
| one identifier renamed | 4 |

**On the fourteen real modules all three rules give zero**, because no module of this catalogue carries
the hazard. That zero is the comfortable reading that would let somebody ship the wrong rule, and it is
why the rule is argued from the specification rather than from the corpus.

### The inversion ADR-0141 could not see

ADR-0141 wrote that the verification does not transfer. It is true of the *form* and the consequence is
the opposite of what it suggests. The CSS comparison could never become a guard because it needs a
browser, priced and refused three times on the list of what this repository declares and nothing keeps.
This one needs a **parser**, which is already a runtime dependency and which a suite of this repository
already spawns.

Measured: seven project loads in **0.645 s**, so one complete comparison is about 0.2 s against the
4.02 s the site suite took before this unit. **JavaScript is cheaper to guard here than CSS was**, and
the blind spot ADR-0141 published - *the verification exists and the guard does not* - does not recur.

### Four guards, each seen red on a condition that reddens no other

- `every-module-a-reader-runs-carries-no-comment` - red with the reader bound to identity, with the
  template rescan removed, and with the first comment of each module kept. **Its two neighbours stay
  green on all three.**
- `a-module-a-reader-runs-is-the-program-its-source-declares` - red with the reader taking two bytes
  past the end of every comment. **Its neighbours stay green.**
- `a-contracts-reference-reaches-a-reader-with-its-argument-intact` - red with `referenceOf` pointed at
  the stripping function. **Its neighbours stay green.**
- `no-module-a-reader-runs-carries-a-comment-a-tool-reads` - red with a directive comment written into
  a browser module. **Its neighbours stay green.**

### The first guard was written unable to fail, and a mutant is what said so

It asked `theCommentRangesIn` how many comments were left in the served module - which is asking the
reader to mark its own paper. **A reader that has stopped recognising a comment reports none
remaining.** Measured: with the template rescan removed, the reader misses whole regions of
`address.js` and the guard, written that way, stayed green.

It is `GUARD_PERTURBATION_RULE` exactly - a guard perturbs the claim and never the object derived from
it - and it was not found by re-reading the guard, which looks correct. It was found by the
perturbation that was supposed to redden it not doing so.

What replaces it uses the compiler for the one thing that needs judgement, which regions are literals,
and scans for two adjacent characters everywhere else: outside a literal, `//` and a slash-star open a
comment and nothing else, a regular expression being itself a literal.

### The guard's population is not the reader's, and the neighbour was measured rather than assumed

`every-import-a-browser-module-keeps-is-a-module-the-site-writes` reads the stripped module, so this
change could have narrowed what it sweeps without anything saying so - the class this repository has
now closed twice. Measured: **9 of 9 modules yield the same specifier set** before and after.

### This folder now has a second file that writes to a disk

`typescript/unstable/sync` opens a project: `DocumentIdentifier` is a path or a URI, it carries no
content, and no overlay accepts bytes - so **a source that is not on a file system cannot be parsed at
all**. The guard therefore writes both readings of every module into a temporary project, parses there,
and removes it.

`build.ts` has been the only file of `packages/site/` that writes to a disk, deliberately, and this is
the second. It was decided before the guard was written rather than discovered while writing it. What
separates it from `packages/cli/rewrite.ts`, which does the same thing, is where the writing lands:
`rewrite.ts` writes into a temporary project because it is about to hand those bytes to a user, and
this writes into one because a guard has no other route to a syntax tree. **Neither the generator nor
anything a reader receives touches a disk because of this file.**

### The blind spot, published rather than left to be found

**A comparison of trees cannot see the removal of a comment that is not for a reader.** A source-map
directive or a purity annotation leaves the tree identical, so the total guard is blind exactly where
the consequence is not syntactic.

`no-module-a-reader-runs-carries-a-comment-a-tool-reads` closes it the way
`a-page-loads-nothing-and-runs-nothing` closes an address in a stylesheet: by refusing the shape rather
than by detecting the loss. It is born green - measured, the served modules carry none - and justified
by the event, which is the day somebody adds a source map to this build.

**A second observable is named and not guarded.** `Function.prototype.toString` returns source text, so
a stripped module's functions stringify differently from an annotated one's. Measured: no browser
module of this repository reads function source, and nothing keeps that true.

## What this unit did not buy

**`packages/site/start.ts` is executed by nothing**, and this unit did not repair it. Measured: it
exports zero names, so nothing can import it; 51 of the 72 exported names of the nine modules appear in
some test file and its own is not among them; its 7 532 bytes of executable text are 17.7 % of the
nine modules'. The entry is on the list of what this repository declares and nothing keeps, and it
gains its count there rather than a repair here.

**A coverage reading was attempted and failed, and it is not published.** The site suite was run under
`NODE_V8_COVERAGE`: 1 027 scripts were captured, two of them this repository's, and **none of the
nine modules** - vitest's workers do not inherit it. The probe reported *100 % executed*, which was the
absence of data rather than a measurement. What stands in its place is the bound above, which says what
the suite *cannot* be exercising rather than what it does.

## The one deployment risk this change annuls for itself

The served modules are not addressed by content and fall through to the host's four-hour default, which
is already recorded as a cost paid on `start.js`: a reader returning inside four hours meets the
repaired HTML and the stale script.

Here that window is harmless, and it is harmless for the guard's own reason. **The old module and the
new one are the same program**, which is precisely what
`a-module-a-reader-runs-is-the-program-its-source-declares` establishes. A reader served the old
JavaScript with the new pages runs what the new JavaScript would have run. It is rare for a change to
remove its own deployment risk, and rarer for the thing that removes it to be the guard the change was
blocked on.

## What would reopen this

- **A module of the graph that carries the hazard.** W-101 survives because no module of this catalogue
  separates a `return` from its value with a comment spanning a line. The day one does, that cell
  starts biting and the survivor count moves.
- **A source map, or any comment a tool reads, in this build.** The fourth guard reddens, and what it
  is protecting is a comparison that cannot see the loss.
- **A tenth browser module arriving through a dynamic import.** The population of this unit's guards is
  `THE_BROWSER_GRAPH`, whose keeper cannot see an `await import` - which is how it lost an edge in
  silence once already. A module that entered the graph that way would be served unstripped and
  unguarded.
- **A parser that does not need a disk.** `typescript/unstable/sync` accepts no in-memory overlay
  today. If one arrives, the second disk writer in this folder stops being necessary and the paragraph
  above it should be re-taken rather than kept.
