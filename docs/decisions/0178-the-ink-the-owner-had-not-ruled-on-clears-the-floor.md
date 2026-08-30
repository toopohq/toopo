---
status: accepted
date: 2026-08-30
decision-makers: Mathis Perron
governs:
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: every-pair-below-the-legible-floor-is-one-this-repository-declared
---

# The ink the owner had not ruled on clears the floor, and the one he still has not is measured rather than argued

## Context and Problem Statement

[ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) landed the owner's palette
and found that eleven pairs of it fall below the 4.5:1 a reader is owed on text under 24px. It did not
correct them, on a rule it states in as many words: *nobody here may retune a colour the owner chose.*
What it did instead was replace the guard that refused an illegible ink with one that refuses an
**undeclared** illegible ink — eleven rows, exact in both directions.

The owner has now ruled on the larger half.

## Decision Outcome

**`--dim` clears the floor against every ground it is painted on, in both themes. Eight of the eleven
rows are gone. The three that remain are `--accent` on light, and they are declared rather than
corrected.**

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

**A derivation was run beside them and is what says the owner's own values are the right ones.**
Walking his colour toward white or black one part in a thousand, the nearest value that clears every
ground is `#7c8588` on dark and `#666d6f` on light — 4.51:1 and 4.50:1, sitting on the floor. His
named values are a hair further and clear at 4.56 and 4.53, which is margin rather than exactness on a
threshold. They are taken, and the derivation is published so that the next person does not have to
wonder whether a nearer value existed.

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

### The three rows that stay, and what they would cost

`--accent` on light is 4.47:1 on wash, 4.35:1 on target and 4.22:1 on card. It clears at 4.76:1 on
paper, where most links are.

**Measured: `#0c7f68` moved 3.6 % toward black, to `#0c7a64`, clears every ground at 4.50:1.** That is
a smaller move than the one already made to this colour — ADR-0176 took the accent from `#3fd6b7` to
`#0c7f68` to lift the focus ring off 1.76:1.

It is not made, and the reason is the distinction that bought the one exception. The focus ring was a
**failure**: WCAG 1.4.11 owes a non-text indicator 3:1 and it measured 1.76:1, so keyboard focus was
invisible on a light system. These three are a **near miss** — 4.22 against 4.5, on a role the owner
chose and ruled on once already. Correcting a near miss nobody asked for is the thing ADR-0176 refused,
and the instruction that authorised this unit named two inks, of which this is not one.

**So the guard does not return to its strong form**, and that is stated rather than left to look like
an oversight: the instruction asked for it, and it is one ink and one decision away.

## Consequences

`BELOW_THE_LEGIBLE_FLOOR` goes from eleven rows to three. The guard keeps its name and both of its
directions; what changed is its declaration.

The site suite is unmoved at **183 tests** — no guard was added or removed.

**`site · W-24b` loses one of its two directions, measured rather than assumed.** That cell lifts dark
`--paper` a shade. At ADR-0176 it reached both directions at once, because `dim` was declared and every
declared reading moved off its figure. With those eight rows gone it reaches one: the injected palette
puts `body on paper` at 3.94:1 and `dim on paper` at 2.75:1, and both are pairs the declaration does
not name. **The dark half clears everywhere unperturbed**, so those two readings exist only because of
the edit — the reach is narrower and the cell is not weaker.

Nothing else moves. No digest, no address, no served answer: this is a stylesheet.

## Confirmation

Control: **183 passed**. Verdicts read from vitest's JSON reporter.

| the defect | what reddened |
| --- | --- |
| an ink carried below the floor — light `--body` to `#a0a8ab` | `every-pair-below-the-legible-floor-is-one-this-repository-declared`, **alone** |
| a declared row outliving its failure — `--accent` repaired to `#0c7a64`, the three rows left standing | the same, **alone** |

**The second perturbation is the accent repair.** It reddens only because the rows stay, which is the
guard doing exactly what it was rewritten to do — and it means the repair, if the owner rules for it,
is two edits: the value and the three rows.

The arithmetic was taken by a probe outside the tree rather than by reading the guard, so the readings
and the thing they check are independent. Both are the WCAG 2.x relative-luminance formula.

## What would reopen this

**The owner ruling on `--accent`.** The value is measured and written down here; the guard returns to
`every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` on the day the last three rows go,
and `BELOW_THE_LEGIBLE_FLOOR` disappears with them.

**The unit that first paints with a syntax token.** `--tk-c` and its five siblings are undeclared, so
they are outside every reading here. The contract page is where they arrive, and the floor applies to
them the moment they do — `--tk-c` is the comment colour and the artboard writes every example's answer
as a comment, so it is the one that matters most and the one nothing has measured.

**A ground that moves.** Every reading here is an ink against the four grounds this palette declares. A
fifth ground is a new column in the table, and the guard computes it rather than being told.

## More Information

- [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) — the palette, the eleven
  rows, the guard that replaced the strong one, and the reopening clause this unit ran.
- [ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md) — where a role called
  `faint` was removed for measuring 2.64:1, which is the figure it came back at.
