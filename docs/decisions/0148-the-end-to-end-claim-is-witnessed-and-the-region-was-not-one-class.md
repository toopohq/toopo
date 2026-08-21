---
status: accepted
date: 2026-08-21
decision-makers: Mathis Perron
governs:
  - mutation/registry-storage.battery.ts
confirmed-by:
  - battery: registry-storage
    guard: the-served-bytes-are-the-committed-bytes
  - battery: registry-storage
    guard: a-rendered-set-of-bindings-reads-back-as-itself
  - battery: registry-storage
    guard: a-fetched-harness-resolves-every-import-it-carries
---

# The end-to-end claim is witnessed, and the region it sat in was never one class

## Context and Problem Statement

ADR-0145 retired `I-01` and `I-08` to survivors. Both only differ from the reference where the
working tree differs from what the registry serves, and no checkout git produces has such a tree, so
their two-year-old `killed` pins claimed a kill nobody could reproduce. That left a region of nine
guard addresses unwitnessed, and the battery asked for a mutant in as many words:

> **It is reachable and the mutant that would reach it is not written here.** It would have to make
> the serialised bytes differ from the committed ones on a tree that agrees with its index - an edit
> inside `canonical.ts` rather than one that chooses which bytes to read - and whether one exists
> that the three unit guards above do not already catch first is a question of its own.

Two things had to be settled. Whether such a mutant exists at all — because if none does, the
end-to-end reading is confirmed by construction rather than by measurement, and ADR-0064, whose
`confirmed-by` names `the-served-bytes-are-the-committed-bytes`, is a record nothing reddens. And
what any answer does about the other eight addresses in that region, which the paragraph above
treats as one class with the first.

## Decision Drivers

- A mutant written to make a guard witnessed, that no reader would recognise as a real defect, is a
  guard dressed as a measurement. It has to name a plausible defect like the 730 beside it.
- A negative is a publishable result and a better one, but only if it is demonstrated rather than
  surveyed.
- `CLAUDE.md` refuses a list that believes itself exhaustive. Whatever is left over has to say which
  of two states it is in: *no mutant is written*, or *nobody looked*.

## Considered Options

- Write a mutant for the end-to-end guard and leave the region's other eight addresses declared.
- Settle all four guards the region names, each in its own module.
- Establish that no such mutant exists and reclassify the region as a demonstration.

## Decision Outcome

**All four, and the answer to the central question is yes.** Three cells are written — `I-65`, `I-66`
and `I-67` — and they witness five of the region's nine addresses. What is left is four, with a
measured reason rather than a request for mutants.

### The coordinates

Measured at `8b6aa89`, on a checkout `git ls-files --eol` reports as **454 tracked files `i/lf w/lf`,
zero CRLF in the index or the working tree**. The two remaining files are `i/-text`, which git does
not convert; they are the two this repository writes `0x00` into deliberately. So the condition that
made `I-01` and `I-08` red on one machine does not exist here, and every reading below is taken on a
tree that agrees with its index.

The control is the registry suite at **407 assertions over 24 files, zero failing**, which is the
same population ADR-0145 read. Verdicts are read from vitest's json reporter with `--reporter=default`
named beside it, for the reason `mutation/run.ts` measured: the json reporter alone under
`--typecheck` collects a fraction of the suite and says nothing.

**The pins are read on two platforms, because that is the whole of what ADR-0145 was about.** A red on
the machine that wrote a pin is what `I-01` and `I-08` had for two years. The full battery was replayed
here on Windows at 80 of 85 killed, every cell agreeing with its pin and no guard unaccounted for; the
gate ADR-0146 built then selected `registry-storage` on the push of `c58c8cd` and replayed all 85 on
`ubuntu-latest`, unfiltered, green. So the three cells are red on two operating systems rather than on
the one that wrote them.

### The mutant, and why the escape is one-sided

`servedBytes` decodes UTF-8, drops a byte-order mark, replaces CRLF, and re-encodes. `I-65` names the
encode side `latin1`.

**The three unit guards stay green, and that is measured rather than expected.** All three assert an
ASCII result — `'a\nb\n'` twice and `'const a = 1\n'` — so any edit agreeing with the reference on
ASCII passes every one of them. The end-to-end guard reddens on **seven files**.

The sibling edit one line up, on the *decode* side, was measured for the same reason and **is caught**:
it reddens `a-byte-order-mark-is-not-content`. That guard is the only one of the three whose input
carries a non-ASCII byte, and it carries it on the input, which is exactly why it constrains the
decode side and why nothing constrains the encode side. So the escape is not a gap somebody left; it
is where the three guards' own alphabet ends.

Its teeth are the files carrying a code point in **U+0080–U+00FF**, measured over all 47 files of the
harness and the shared surface: `date/add@1` carries one, the `±` of its summary; `string/slugify@1`
carries nine of its fifty-eight; `string/levenshtein@1` carries a single `U+1F600`, which is above
U+00FF and is therefore already a `?` after one pass, surviving the second unchanged.

### The other three guards, which were never the same question

The paragraph quoted above said *an edit inside `canonical.ts`*. **That is true of the first guard and
false of the other three**, and the sentence is repaired where it stands rather than only here.
`a-rendered-set-of-bindings-reads-back-as-itself` is `readBindings(renderBindings(b))` over
`rebinding.ts`: it never touches a served byte, and no edit to `canonical.ts` of any kind can redden
it. They were in one list because `I-01` and `I-08` happened to be the only cells reddening all of
them, which is a fact about two retired cells and not about the guards.

`I-66` writes a binding with a space where the format declares one tab. `I-67` serves a contract's own
files and not the files they import, which is the state ADR-0105 closed.

### The fourth guard has two halves and its name belongs to the dead one

`a-blob-answer-hashes-to-its-address` produces two kinds of fault per file, and they were measured
apart:

| half | what it compares | red on |
|---|---|---|
| `servedBlobFaults` | `servedBytes(servedBytes(x))` against `servedBytes(x)` — **idempotence** | 6 files |
| `addressedBy === file.sha256` | `servedBytes(x)` against `servedBytes(x)` | **0 — never** |

`servedBlob` calls `servedBytes`, and `file.sha256` is `digestOfBytes(servedBytes(...))` of the same
file, so the half the guard is *named after* compares two evaluations of one expression on one input.
**No edit to `servedBytes` can separate them.** What has teeth is the check beside it, which applies
that expression twice and therefore reads idempotence — a claim its name does not mention. The counts
confirm the mechanism exactly: under `I-65` the suite reports one fault on `date/add@1` and five on
`string/slugify@1`, which are the six files.

**What is claimed about the dead half is narrower than it looks, deliberately.** It is dead under any
mutant of `servedBytes`. Whether it is dead under everything reachable is a different sentence: it can
only differ if the record's path-to-digest association is wrong, `harnessOf` refuses any disagreement
between the declaration and the folder, and the association comes from a single `map` over one sorted
list. **I looked there and found no plausible mutant. That is not the same as none existing**, and the
distinction is the one `CLAUDE.md` requires of an entry that reports an absence.

## Consequences

- Five of the region's nine addresses are witnessed. The region is now four blob addresses — the four
  contracts `I-65` does not move — and its reason is the measurement above rather than a request.
- The remaining four are named by a filter over `onEach`, keyed on a constant naming *why* the other
  two are reached. A seventh contract therefore lands in the region by default, which is the correct
  default: a guard is unwitnessed until something measures it.
- The README's derived totals move: 730 cells to **733**, 691 caught to **694**. The survivor count and
  its classification do not move, both new regions being kills.
- **ADR-0064 keeps its `confirmed-by` unchanged, and this record is the argument for that.** The
  concern was real — a record whose confirming guard is reddened by nothing is what this repository
  refuses elsewhere — but the repair was never to withdraw the citation. It was to give the guard a
  witness, which is what `I-65` is. The citation always named the right guard; what was missing was
  underneath it. Had the answer been that no such mutant exists, the record would have had to say so
  in its own head, and the citation would have had to become a statement about a guard confirmed by
  construction.

### What this does not establish

`I-65`'s teeth on a clean tree are the files carrying a code point in U+0080–U+00FF, of which this
catalogue has three across two contracts. **If the catalogue were pure ASCII, this mutant would
survive**, and the end-to-end guard would be back where ADR-0145 left it. So the witness rests on a
property of what the catalogue happens to contain rather than on a property of `servedBytes`, and it
is written down here because nothing keeps it: a contract whose harness lost its last Latin-1
supplement character would take a pin with it, and the replay is what would say so.

## What would reopen this

- A seventh contract carrying a code point in U+0080–U+00FF: it joins `REACHED_BY_A_LATIN_1_RE_ENCODING`
  and leaves the region, and the constant is where that is recorded.
- A mutant reddening `addressedBy === file.sha256`. It would have to make the record's path-to-digest
  association wrong, and it would settle the sentence this record deliberately leaves open.
- Any change to `harnessOf`'s single `map`, which is the whole of what stands between that half and a
  witness.

## More Information

ADR-0145 retired the two cells and named the question. ADR-0105 is the state `I-67` restores.
ADR-0087 is the rule the fourth guard's named half breaks — a guard perturbs the claim, never the
object derived from it — and this is its fourth recorded instance.
