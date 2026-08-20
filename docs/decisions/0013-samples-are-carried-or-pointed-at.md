---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
confirmed-by: []
---

# A profile's samples are carried, or pointed at

## Context and Problem Statement

The samples of one profile, carried or pointed at.

**Why the schema names `samples` at all.** It is the one field of a profile beyond the three already
named that all five contracts call by the same name, with the same role - measured, five of five, over
five vocabularies that share nothing else. That is the catalogue's own bar for naming something, and
letting it fall into `data` would throw away a measurement.

## Considered Options

- One arm: carry the samples.
- One arm: point at the expression that produced them.
- Two arms, chosen per profile by a judgement.
- Two arms, chosen per profile by a size threshold.

## Decision Outcome

**Why there are two arms.** A contract may write its samples or produce them, and four of the five
produce at least one - `.repeat`, `range`, `wordOfLength`, `repeated`; only `date/add@1` is entirely
written. The frontier this record is built on is why the second arm cannot be avoided: `range` is a
function, so by the time the registry reads a module the fifty thousand numbers are there and the three
lines that made them are not. A record can hold the numbers or nothing.

So the second arm holds neither, and holds instead what makes the omission checkable: the expression,
the count, the size of what was left out, and the digest of the canonical encoding the first arm would
have carried. A reader fetches `contract.ts` - already served, already hashed - evaluates it,
re-encodes, and compares. Nothing has to be taken on trust.

**The union is written before anything is published, and that is the whole reason it is written now.**
Adding an arm to a union a caller switches on is a breaking change, so a record that shipped with one
arm would cost `name@2` across the catalogue the first time a contract needed the other.

**Which arm a profile uses is a judgement, made once, and frozen with the major.** It is not a size
policy: a threshold would let a contract's record change shape because it gained an argument, and the
shape of a record is exactly what publication freezes. The judgement is stated instead - a sample is
carried when a reader is better served by the value than by the expression that produced it - and
measured, that flips between 3.1 kB and 7.3 kB of encoded samples. Six profiles of the five sit above
it and twenty-two below, and the six are the six whose values are repetition.

### The carried arm

Carried. Twenty-two of the twenty-eight profiles of the five.

### The pointed-at arm

Pointed at. Six of the twenty-eight: the five generated profiles of `array/group-by@1`, whose samples
encode to 1.73 MB each for three of them, and `long-inputs` of `number/parse@1`, whose value is five
thousand zeros and whose expression says so in eleven characters.

`producedBy`:

The expression in the contract's own `contract.ts` that produces them, transcribed.

Beside it sit three values, each of them read off the module rather than declared:

- `count` — Read from the module. How many samples the expression produced.
- `encodedBytes` — Read from the module. The size of the omission, in bytes of canonical encoding.
- `sha256` — Read from the module. The digest of the canonical encoding of the carried arm.

And on the profile itself, `class`:

The class every sample of this profile must belong to, from the vocabulary above.

## Consequences

The one transcribed thing in this arm, and therefore the only one that can be wrong.
`against-the-catalogue.test.ts` requires it to occur in that file, whitespace normalised - the discipline a
declared type already carries - so a contract that replaced `range(50_000)` with fifty thousand
literals would take the text with it and redden the guard. What that does not catch is a text that
survives for another reason: the same expression written twice, or left behind in a comment. Recorded
as `one-directional` in `field-map.ts` for exactly that gap.

**It does not close before the launch, and it is the assumed price of this arm.** Tying an expression
to the samples of one particular profile would mean evaluating it, and the frontier this record is
built on is precisely that a generator is a function the registry cannot hold - so any stronger guard
would have to re-run the contract's own module and compare it with itself. Requiring the transcribed
texts to be distinct within a contract would close it and would force a lie, because the instance in
the five is two profiles that genuinely draw the same three ranges.

This is [ADR-0010](0010-a-transcription-is-guarded-by-its-occurrence.md) applied to a value where
occurrence is materially weaker than it is on a signature.

## Confirmation

`packages/registry/against-the-catalogue.test.ts` resolves the transcribed expression against the
contract's own `contract.ts`. Nothing resolves it against the samples it claims to have produced, and
the paragraph above is the declaration of that gap rather than a promise to close it.

## What would reopen this

The validation pipeline. `CLAUDE.md` lists `benchmarks.profiles[].samples.producedBy` among the
declarations nothing keeps, and names the pipeline as what closes them, because it is the only thing
that will ever read a declared name against what it describes.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).

### What block 4.5 costs, measured

Block 4.5, and the one place where the code/data frontier has a size you can measure.

**A published size here names three coordinates, and each one was bought by a figure that went wrong
without it.** The serialisation, because there are three of them and they differ by a factor of six.
The divisor, because a kibibyte and a kilobyte are the same word in any comment that does not say
which. The commit, because a record grows, and without it a reader who re-measures and gets something
else cannot tell *this figure was wrong* from *the tree has moved*. So what follows is **the canonical
text of a whole record in bytes, divided by 1000, measured at `1db7dfb`** - the canonical text because
that is the form a digest is taken over, and 1000 because `packages/cli/report.ts` prints a kilobyte
that way and one repository holds one kilobyte.

The five records are 35.7, 53.7, 47.5, 34.6 and 45.0 kB, in the order `theCatalogue` holds them, and block
4.5 is between 6.9 and 34.0 per cent of each. `array/group-by@1` writes `range(50_000)` three times,
and carrying its six profiles rather than pointing at them takes its record to 5479.9 kB, of which 99.2
per cent is this block. The one that would otherwise be a hundred times the size of the others is the
second largest of the five.

What the six omit: 7.1, 1772.2, 1772.2, 1771.8, 102.9 and 14.1 kB. Two of those digests are equal -
`one-group-per-element` and `single-group` really do draw the same three ranges - which is the same
fact from underneath as the transcription gap `the-catalogue.ts` names beside them.

**This paragraph has been wrong twice, and the two failures are why the coordinates are listed rather
than left to be assumed.**

Its first version published 71-152 kB, 24.2 MB and 99.4 per cent, and none of the three reproduces.
Measured three ways on the records those figures described: flat gave 32.2-49.7 kB, 5.22 MB and 99.2
per cent; two-space indent 52.5-113.6 kB, 19.92 MB and 93.4 per cent; four-space indent 70.8-172.1 kB,
33.72 MB and 92.4 per cent. No serialisation produces that triple, and the share and the sizes cannot
have come from one measurement. Those numbers are left in the unit that measurement used rather than
restated here: the divisor it used is the subject of the next paragraph, and re-deriving them would
need the tree they described. That failure is where *a published size names the serialisation it was
taken under* came from.

Its second version named the serialisation and not the divisor, **and every figure it published was a
kibibyte called a kilobyte**. Re-measured at `52866f9`, the commit that published them: the records
come to 32.9, 50.8, 45.7, 32.9 and 42.7 kB against a published 32.1, 49.6, 44.6, 32.1 and 41.7, and the
omissions to 1772.2 kB against a published 1730.6. The ratio is 1.024 throughout, and the *share*
reproduced exactly - a ratio cancels the divisor, which is how the error survived beside a figure that
checked out. `packages/cli/report.ts` divides by 1000 and C-44 of `cli-install` exists to kill an
implementation that does not, so the repository already executed the decimal kilobyte one folder from a
comment publishing the binary one.

It also called that record the third largest when it was the second, at `52866f9` as at `1db7dfb`.
That one needed no divisor to be wrong.
