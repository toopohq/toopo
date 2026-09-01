---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/address.ts
  - packages/cli/plan.ts
confirmed-by:
  - battery: registry-storage
    guard: every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract
  - battery: registry-storage
    guard: a-rendered-address-is-the-spelling-frozen-with-the-major
  - battery: registry-storage
    guard: no-two-contracts-share-an-address
---

# The language is part of an address, and of every rendering of one

## Context and Problem Statement

`ContractAddress` has carried a `language` since the day it was written, `sameContract` compares it and
the lockfile writes it — and `renderContract` dropped it. So the URL, the page path, the case anchor and
the licence header frozen into every installed file were built without it.

What made it survivable is what made it invisible: each consumer sees one rendering, and no consumer of
one rendering can notice a coordinate missing from all of them.

## Considered Options

- Leave the language out of the rendering, since one catalogue has one language.
- Carry it in every rendering, at its full spelling.
- Carry an abbreviation, `ts/`.

## Decision Outcome

**Catalogues of different languages carry different contracts.** A Python `number/parse` is not the
TypeScript one: there will be resemblances, nothing can guarantee them, and each language settles its
own traps. The measurement that decided it is that 24 per cent of the named cases are not shareable,
and on two of the five contracts it is half — because their input domain *is* the language's type
system. A contract half of whose cases do not apply to half the languages is not shared, it is vague.

So the language is a coordinate of a contract's identity, and the question was never whether to add it
to the address: `ContractAddress` has carried `language` since the day it was written, `sameContract`
compares it, the lockfile writes it, and `THE_WORDS_FOR` is total over it. **What dropped it was
`renderContract`** — so the URL, the page path, the case anchor and the licence header of every
installed file were built without it. The deadline was the first installation and not publication: a
header is frozen into a repository nobody here will ever see again, and a redirect repairs a site's own
links for everybody at once and repairs those for nobody.

**One rendering, one spelling, and the abbreviation was refused on a measurement.** `typescript/` costs
22 bytes per copied file against 6 for `ts/` — 0.94 per cent of the smallest one, 110 bytes over the
five — so the full spelling costs 16 bytes a file more and buys the absence of a correspondence table
between two spellings of one value. `licence.ts` refused the literal MIT notice at +52 per cent on that
same figure; there is no arbitration at 0.68.

**The schema was ready, and that is the field's own promise met rather than asserted.** Widening
`Language` to `'typescript' | 'python'` and typechecking all six projects gives **exactly one error**:
`THE_WORDS_FOR` in `packages/cli/search.ts`, which is total over it by construction and says so. One site, in a
repository of fifty-odd modules that pass an address around, is what a coordinate written before it had
a second value buys.

### There is no short form

**There is no short form anywhere, and the argument is a measured defect rather than consistency.** A
language-less rendering for local use reads as an economy — a screen line is not frozen, and every
address inside one client carries one language. It is refused because that form has already produced a
defect, in a *key* rather than on a screen. `planInstall` keys the features of one plan by this string;
with the language dropped, two contracts of two languages carrying one name collide there, and the
refusal is false:

```
before   number/parse@1 is asked for at two versions in one install -
         number/parse@1/reference@1.0.0 and number/parse@1/reference@1.0.0.

after    two different files would both be written to number/parse.ts: the one served as
         number/parse/reference.ts and another with a different digest.
```

It names a cause no measurement establishes — *two versions* — and prints one string twice as the
evidence that two things differ, which is *a diagnostic that names a cause no measurement establishes*
reached through a map key. **A form that lives on a screen reaches a bug report, then an issue, then a
key.** The cost is real and is the only one in this unit paid continuously — eleven characters on every
line of `toopo list` and `toopo search` — and the way out, the day it is worth taking, is a *layout*: a
column states a value once for a whole screen and is still one spelling. Never a second string.

**The disk path is the one rendered thing that does not carry it, and not because no collision exists.**
`destinationOf` builds `number/parse.ts` from `contract.name` alone, so the path carries neither
the language nor the major: what governs it is *one feature lands in one place*, and adding the language
alone would put half an address into a string that deliberately is not one. The collision was measured
and something else already refuses it — `placedByPath` finds two digests at one path and refuses by name
with nothing written — and that refusal is *true* only because the address carries the language. So the
protection is in the refusal rather than in the path, and putting it in both would be two mechanisms
over one fault with nothing to say for themselves on the day they disagree. The argument lives in
`packages/cli/plan.ts`, where somebody would go to remove the asymmetry.

**The command takes no prefix, and that is `command.ts`'s own shape on a second subject.** `toopo add
number/parse` is unchanged: `chooseContract` filters on `entry.address.name` and never reads a language
from what the user typed. *Which registry an installation came from is a static fact about which file
was run* — `toopo` is the TypeScript client and a future Python one is another program, so the language
is a property of the entry point rather than of the project, exactly as the registry already is.

## Consequences

**A rendered address is what code emits; prose names a contract with the coordinates its reader needs.**
That line had to be drawn, because a mechanical prefix swept 50 comments, two guard-title sentences and
one case rationale before anybody looked. It is the same line the command sits on: a person writes the
coordinates they mean and the machine supplies the rest, because a machine cannot choose. What is not
covered by it is a comment making a factual claim about the value — `search.ts` saying *the name is the
rendered address, `number/parse@1`* became false and was repaired.

## Confirmation

**The guards are the first this repository has ever pointed directly at `packages/registry/address.ts`.** The
module that owns every address the project has — a case, a guard, a contract, an implementation, a
mutant — was covered the way a road is covered by the traffic on it: `packages/site/pages.test.ts` resolved
`pageOf` against `renderContract`, `indexing.test.ts` resolved `contractUrl` against the sitemap,
`publication.test.ts` compared `licenceHeaderOf` with five real files. Each is a guard over its own
consumer that happens to travel through here, and **no consumer of one rendering is in a position to
notice a coordinate missing from all of them.** That is what let the omission live for as long as the
address has existed.

Two mechanisms, both total by the compiler. `COORDINATE` is keyed by `keyof ContractAddress`, so a
coordinate added to the address does not compile until somebody says what it looks like rendered; the
record of renderings is keyed by `keyof typeof ADDRESS`, so an export added to the module does not
compile until it is either rendered or declared to carry no contract, with a reason. A pass over real
addresses could not do either job: every address in this catalogue carries one language, so it would
confirm that the renderings agree with each other about a coordinate none of them prints.

**I-31 is what makes the guard worth having over the family rather than over one function, and its
width is the measurement.** A rendering that interpolates the contract's parts instead of calling
`renderContract` reddens **exactly one guard** in `registry/`, against I-30's five — because everything
that resolves a rendering resolves it against `renderContract`, so a form that stops going through it
stops being compared with anything. The abbreviation was built and refused as a third cell: rendering
`ts/` reddens exactly I-30's five, so it establishes nothing that cell does not, and the refusal is
recorded in I-30 rather than left for somebody to propose again.

**And the closing control is the half a mechanical replacement always needs.** 73 literal addresses were
rewritten across eight test files, and a mechanical replacement over expected strings is exactly what
makes a suite green for the wrong reason. So `renderContract` was broken one last time, after
everything else, against the whole suite: **30 guards redden, of which 2 are this unit's and 28 existed
before it**, across `registry/`, `cli/`, `site/` and `packaging/`. Had only the new file caught it, 71
assertions would have quietly stopped saying anything about addresses. The contracts' own suite stays
green at 472, correctly — nothing in `contracts/` renders an address.

## What would reopen this

A second language in the catalogue, which is the event the coordinate exists for and which would turn
every measurement above from a projection into an observation.

## More Information

- [ADR-0006](0006-the-shape-is-neutral-and-the-content-is-typescript.md) — the record shape a second
  language would carry.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
