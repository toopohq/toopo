---
status: accepted
date: 2026-08-30
decision-makers: Mathis Perron
governs:
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible
---

# Every ink clears the floor, and what decided the last one was an asymmetry rather than a number

## Context and Problem Statement

[ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) landed the owner's palette
and found that eleven pairs of it fall below the 4.5:1 a reader is owed on text under 24px. It did not
correct them, on a rule it states in as many words: *nobody here may retune a colour the owner chose.*
What it did instead was replace the guard that refused an illegible ink with one that refuses an
**undeclared** illegible ink — eleven rows, exact in both directions — and wrote that this was the
owner's to ratify or overturn.

The owner has now ruled on both.

## Decision Outcome

**Every ink of this palette clears 4.5:1 against every ground it is painted on, in both themes. All
eleven rows are gone, and the guard has the name it carried for a year back.**

### The values are ADR-0176's own, and they are taken because they measure

That record's reopening clause named them: *if that ink lifts — `#606a6e` to `#7c868a` on dark,
`#8f999d` to `#636d71` on light, each measured — the rows go with it.* They were run against all four
grounds rather than the one the clause was written from:

| | paper | wash | card | target | worst |
| --- | --- | --- | --- | --- | --- |
| dark, `#606a6e` | 3.51 | 3.36 | 3.12 | 3.06 | **3.06** |
| dark, `#7c868a` | 5.23 | 5.01 | 4.65 | 4.56 | **4.56** |
| light, `#8f999d` | 2.81 | 2.64 | 2.49 | 2.56 | **2.49** |
| light, `#636d71` | 5.12 | 4.81 | 4.53 | 4.67 | **4.53** |

**The binding ground is the card in both themes**, and it is not the one either record had been
reading: ADR-0176's headline figures were paper and wash, where the ink was already 0.4 to 0.6 better
off than at its worst.

**That is a lesson about reopening clauses rather than a figure about this palette.** ADR-0176 wrote
its clause with values in it and said each was measured. They were — against the ground the sentence
was being written about. A clause that names a value names it against the ground it was written from,
and that is not necessarily the ground that decides. **The values survived the wider reading**, which
is luck rather than method: nothing about how they were chosen guaranteed the card would clear. What
is owed to the next such clause is the sweep before the value is believed, not after.

**A derivation was run beside them, and what it found is the second lesson.** Walking his colour
toward white or black one part in a thousand, the nearest value that clears every ground is `#7c8588`
on dark and `#666d6f` on light — 4.51:1 and 4.50:1, **sitting on the floor**. His named values are a
hair further and clear at 4.56:1 and 4.53:1.

His are taken, and the reason is not that they were written down first. **A design seated on a
threshold is one a re-measurement moves off**: a ground that shifts, a rounding that is read
differently, a fifth surface — and a 4.50 becomes a 4.49, reddening a guard on a decision nobody
revisited. The derivation's job was to prove no nearer value existed, and it did that; the value taken
is the one with margin. **Do not seat a design on a threshold.**

### `--tk-c` was asked for and there is nothing to raise

The instruction named `--faint` and `--tk-c`, and made the second the priority: it carries the
right-hand half of every example on the artboard, which is the answer.

**`--tk-c` is not in this stylesheet.** ADR-0176 declared the palette's ten roles — paper, wash, card,
rule, edge, ink, body, dim, accent, target — and left the six syntax tokens out in as many words:
*nothing paints with them yet, and a declared role nothing uses is dead code. They arrive with the
contract page.* Swept over `style.ts`, `--tk-` occurs nowhere.

So there is no pair to measure and no row to remove. **The artboard's card does not use them either** —
its signature line is `color: var(--muted)`, the artboard's name for `--body`, which clears at 6.52:1
on dark and 5.11:1 on light. The tokens are the *detail* page's, and raising them is a decision that
belongs to the unit that first paints with them.

### The accent moves too, and the argument that carried it is not the one this unit first made

`--accent` on light was 4.47:1 on wash, 4.35:1 on target and 4.22:1 on card, clearing only on paper at
4.76:1. **Measured: `#0c7f68` moved 3.6 % toward black, to `#0c7a64`, clears every ground at 4.50:1** —
a smaller move than ADR-0176 already made to this same colour when it took the accent from `#3fd6b7`
to lift the focus ring off 1.76:1.

**This unit first refused to make it, and the refusal was overruled.** The argument was the
distinction that bought ADR-0176's one exception: the focus ring was a *failure* — WCAG 1.4.11 owes a
non-text indicator 3:1 and it measured 1.76:1 — where these three are a *near miss* on a role the
owner chose. Correcting a near miss nobody asked for is what ADR-0176 refused in as many words.

**Two things were wrong with it and both are worth keeping.**

The rule it leaned on exists to stop a stylesheet eroding the owner's design *in silence*. That reason
does not bite where he has been told and can overrule with a word, which is what happened. A refusal
inherited from a record has to be re-earned against the situation it is being applied to.

And the near-miss reading was about the number rather than about the role. **`--accent` carries
`a { color }` and `:focus-visible { outline }`** — this stylesheet says so on the line the refusal
quoted. It is not decoration: it is the role that says *you can act here*. A link at 4.22:1 on a card
is a link under the floor a reader is owed, not a shade of one.

**What decided it is the asymmetry, and it is worth stating as a shape.** Leaving the three rows cost
a *mechanism*: the guard stays a declaration for ever and protects no future change to this palette.
Moving the ink cost 3.6 % of one green that nobody can pick out of a line-up. A cost measured in
mechanism against a cost measured in appearance is not a close call, and the near-miss framing had
hidden that by comparing the number to the threshold instead of comparing what each choice gives up.

### So the guard has its old name back

`BELOW_THE_LEGIBLE_FLOOR` is gone and the assertion is `toEqual([])`.
`every-pair-below-the-legible-floor-is-one-this-repository-declared` is
`every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` again — the name it carried for a
year, which ADR-0176 gave up for exactly one unit.

**ADR-0115's `confirmed-by` was updated when ADR-0176 renamed a guard, and this follows that
precedent**: ADR-0176's and this record's front matter both name the new address. What is *not*
rewritten is ADR-0176's confirmation table, which records what reddened on the day it ran, under the
name the guard had then. A rename may move a name; it may not move a reading.

## Consequences

`BELOW_THE_LEGIBLE_FLOOR` is gone. The guard asserts `toEqual([])` and carries the name it had before
ADR-0176 — so the claim is *no ink of this palette is illegible on any ground it paints*, total over
both palettes and computed rather than declared.

**What that buys is a mechanism rather than two hundredths of contrast.** A declaration protects
nothing it does not already name: it would have gone on being green through every future edit to this
palette that stayed inside the eleven rows. The restored claim reddens on any pair, named or not, in
either theme — which is why moving `--accent` by 3.6 % was worth more than the appearance it cost.

The site suite is unmoved at **183 tests** — a rename, and a declaration deleted. No guard was added
or removed, so no census row moves.

**`site · W-24b` keeps both of its directions after all.** The last unit's draft of this record
predicted it would lose one, because with the eleven rows gone there would be no declared row for the
injected palette to strand. That reasoning was about the *declaration*, and the declaration is gone —
the cell lifts dark `--paper` a shade, which carries `body` to 3.94:1 and `dim` to 2.75:1, and the
guard now refuses those outright. **A prediction written against an intermediate state does not
survive the state changing**, and it is recorded here rather than deleted because it was one commit
from being published as a consequence.

Nothing else moves. No digest, no address, no served answer: this is a stylesheet.

## Confirmation

Control: **183 passed**. Verdicts read from vitest's JSON reporter rather than scraped from a console,
with the tree restored between each.

| the defect | what reddened |
| --- | --- |
| an illegible ink on light — `--body` to `#a0a8ab` | `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible`, **alone** |
| an illegible ink on dark — `--dim` to `#4a5254` | the same, **alone** |
| **the accent put back where ADR-0176 left it** — `#0c7a64` to `#0c7f68` | the same, **alone** |

**The third row is the mechanism the trade bought.** Under the declaration that value was the
*expected* state and the guard was green on it; under the restored claim it is a red. That is the
whole of the asymmetry made concrete: the same palette, the same reader, and a guard that now refuses
what it used to record.

The arithmetic was taken by a probe outside the tree rather than by reading the guard, so the readings
and the thing they check are independent. Both are the WCAG 2.x relative-luminance formula.

## What would reopen this

**The unit that first paints with a syntax token.** `--tk-c` and its five siblings are undeclared, so
they are outside every reading here and outside the guard's population — `INKS` names four roles and
none of them is a token. The contract page is where they arrive, and the floor applies to them the
moment they do. **`--tk-c` is the comment colour and the artboard writes every example's answer as a
comment**, so it is the one that matters most and the one nothing has measured. That unit inherits
this record's second lesson: measure against every ground before believing a value, and do not seat
the result on the threshold.

**A ground that moves, or a fifth one.** Every reading here is an ink against the four grounds this
palette declares. The guard computes the cross product rather than being told it, so a fifth ground
joins the sweep by being declared — and the two guards beside it refuse a role that is neither classed
as a ground nor as an ink, which is what stops one arriving unswept.

**A reader owed more than 4.5:1.** The floor is WCAG 2.2's for text below 24px. Nothing here reads a
font size, so an ink used at a size that owes 7:1 would pass this guard and fail a reader. That is a
gap this unit did not close and did not measure.

## More Information

- [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) — the palette, the eleven
  rows, the guard that replaced the strong one for a unit, and the reopening clause this record ran.
- [ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md) — where a role called
  `faint` was removed for measuring 2.64:1, which is the figure it came back at.
