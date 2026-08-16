---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - packages/site/playground.ts
  - packages/site/contract-page.ts
  - packages/site/start.ts
confirmed-by:
  - battery: site
    guard: an-invisible-code-point-a-reader-typed-is-named-in-the-output
  - battery: site
    guard: a-text-field-hands-over-what-was-typed
  - battery: site
    guard: a-case-a-text-field-cannot-carry-is-the-one-that-carries-a-line-break
  - battery: site
    guard: a-field-refuses-a-value-of-the-wrong-type-before-the-contract-is-called
---

# A field is typed or spelled, and the declared type decides which

## Context and Problem Statement

The playground is the one thing on this site that is computed rather than rendered, and it is where a
reader forms an opinion. Its field held a TypeScript literal, so somebody who wanted to try `hello`
was refused for not writing `'hello'`, and somebody who wanted `42` had to write `'42'`. A page that
exists to ask *what does this contract answer for your input* was teaching a notation instead.

**`read-literal.ts` is not the defect and is not being replaced.** It answers *how is this value
spelled*, correctly, and that is the right question for a pre-filled case — which is what it was
written for. It is the wrong question for the field beside it, because *a value is typed* and *a value
is spelled* are two questions and only the second was ever being asked.

The argument that settled the literal is in
[ADR-0028](0028-what-a-playground-demonstrates-and-what-it-refuses-to-show.md) and it is real:
`contracts/typescript/number/parse/edge-cases.ts` settles `'1\u00A0000'` and `'1 000'` to opposite
answers, and the two are the same eight glyphs on screen — which is why that file, and this paragraph,
name the character instead of pasting it. A field holding raw text was said to reintroduce that
ambiguity inside the playground.

**What was never measured is that the page already had the defect.** The output line was

```
parseNumber(…) → null
```

where `(…)` is three literal dots and not a summary. Both spellings answer `null`, so a reader who
typed either one was told nothing whatever about which of the two the page had read. The literal field
did not solve the ambiguity; it moved it from the output to the input, where the reader had to spell
it and therefore already knew the answer.

### What was measured

**Over the catalogue**, at this commit. Four pages carry a playground — `array/group-by@1` has no page
— and they hold **six fields**: four `string`, one `Date`, one `Duration`. **Five of the six hold a
value that is a string**, because `Date` is already spelled as one and turned into an instant by
`new Date(…)`. One does not: `Duration` is an object with named fields. So three of the four pages are
entirely expressible as text and `date/add@1` is mixed — which is what refuses a single control for a
whole form, before any question of taste.

**Over the 180 case values** standing in a field position that could be read as text: **17 carry a
code point that is invisible or that renders on top of its neighbour, and exactly one carries a line
break.**

**In Chrome**, setting a field's value and reading it back, with the code points constructed in the
page so that nothing was normalised in transit:

| what was set | `<input type=text>` | `<textarea>` |
| --- | --- | --- |
| no-break space, narrow no-break space, byte order mark | survives | survives |
| combining mark, zero-width joiner sequence | survives | survives |
| a lone surrogate, `U+D83D` | **survives** | survives |
| `'\t\n 7 \r\n'` | **drops `U+000A` and `U+000D`** | **drops `U+000D`** |

**One sentence of ADR-0028 does not survive that measurement**, and it is corrected there rather than
contradicted here: *a raw field could not have expressed a lone surrogate at all* is false — the field
carries it whole. The clause beside it, that a reader cannot **type** one, is true, and the two were
written as one sentence.

So a text field carries sixteen of the seventeen invisible values byte for byte, and the one it cannot
carry it cannot carry in a `<textarea>` either.

## Considered Options

- Keep the literal, and accept that the field teaches a notation.
- Text everywhere, and drop the case a text field cannot carry.
- Text everywhere, with a control on each field for switching back to the literal.
- A reading per declared type, with the limit declared on the case that causes it.

## Decision Outcome

**Chosen: a reading per declared type, in `AS_AN_ARGUMENT`, with the limit declared on the case that
causes it.**

`AS_AN_ARGUMENT` is already the closed table that stops the build on a type it does not know. It gains
one member, `readAs`, in two forms with no way to spell a third:

- `the-text-itself` — what a reader types is the value. `string` and `Date` take it.
- `a-literal` — the field spells a value, `read-literal.ts` reads it, and the arm carries **why** this
  type has no spelling as a line of text. `Duration` takes it.

**The refusal machinery moved inside the literal arm, and that is the shape doing the work.**
`spelledBy` and `wanted` exist because a literal can spell anything at all; a text field cannot receive
the wrong type, because what a reader types is a string and both types read as text are spelled as
strings. Putting them beside both readings would have left a member that is dead in one of them.

**A sixth contract introducing a fourth type does not compile until somebody has decided which reading
it gets.** That is what [ADR-0054](0054-make-the-omission-impossible.md) asks for before a
rule is written in prose, and it is why this is not a paragraph in `CONTRIBUTING`.

### The output names the call it made

The ellipsis is replaced by the call, written through `literal`:

```
parseNumber('42') → 42
parseNumber('1\u00A0000') → null   describeParseFailure('1\u00A0000') → 'separator'
parseNumber('1 000') → null        describeParseFailure('1 000') → 'not-decimal'
```

**This repairs a defect that was already there rather than adding a feature.** `(…)` said nothing about
what had been received, on the one part of this site that is computed. The two spellings of `1 000`
now print apart, which is the distinction the whole section rests on and which the literal field was
carrying only because the reader supplied it.

`literal` is reached and not copied — it is already in `THE_BROWSER_GRAPH`, and its `INVISIBLE` class is
already exactly the class of code points that shows nothing or shows on top of its neighbour.
[ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md).

**It is never conditioned on what the arguments hold.** A line computed from what arrived cannot fail
to name an invisible code point; a line asking *is there anything invisible here* can be wrong about
its own question, and would then be silent exactly where it was needed.
[ADR-0043](0043-derive-the-sentence-from-the-fact.md).

### The limit is declared on the case that causes it

`tabs-and-newlines` of `number/parse@1` is the one case of the catalogue a text field cannot carry. Its
own row says so, and names the code points that would be lost.

**A control on every field was refused, and the price is what refused it.** Five fields would have
carried a control, on every page, for one case in a hundred and eighty — and a reader arriving to try
`1,5` would have had to understand a choice of mode before asking their question. A case carries a
sentence where it is relevant; five fields carry a control where it is not.

**It is computed from the case rather than authored on it.** A case gaining a line break says so on
the day it does, and a case losing one stops saying it. A sentence somebody wrote on one row would be
a remark; one derived from the row is a rule.

The case stays rendered and its answer stays published. What a reader loses is the ability to retype
that one input, and they are told so where they would ask.

## Consequences

- **The playground answers the question it was built to ask.** `hello` is an answer to *what string?*,
  and so is `42`, and so is an empty field.
- **`read-literal.ts` keeps its whole grammar, measured rather than assumed.** `playground.ts` is its
  only importer outside its own test, and `argumentsOf` reads before it judges the type — so the one
  `Duration` field feeds the entire reader. Driven through that field alone: **22 arms of 22**, twenty
  parsing and two refusing by name, including the list, the set, the pattern, the symbol, the shared
  `#1 =` label and all three escape forms. Nothing became dead.
- **The site suite goes from 97 guards to 100.** Two guards changed subject without changing address:
  `a-field-refuses-a-value-of-the-wrong-type-before-the-contract-is-called` now measures the `Duration`
  field, which is the only one where a value can still be spelled wrongly, and
  `a-date-is-the-one-argument-this-site-constructs` builds its instant from text.
- **Four sentences of this repository were false the moment the code changed, and are repaired in the
  same commit** — ADR-0028's section and its lone-surrogate clause, `read-literal.ts`'s header, the
  comment over `two-inputs-that-look-alike-are-read-apart`, and the paragraph a contract page publishes
  above the form. That paragraph is now computed from the fields, so a page cannot claim a reading its
  own form does not have.

## Confirmation

The four guards named above are collected by `packages/site/playground.test.ts` and measured by the
`site` battery.

**Both new guards were seen red on their real failure condition before being trusted.** Printing the
call with `String(argument)` instead of `literal(encode(…))`:

```
AssertionError: expected 'parseNumber(1 000)' to be 'parseNumber(\'1\u00A0000\')'
Expected: "parseNumber('1\u00A0000')"
Received: "parseNumber(1 000)"
```

and narrowing the stripped class from `/[\r\n]/` to `/[\r]/`:

```
-   "typescript/number/parse@1#tabs-and-newlines.input: \\n \\r",
+   "typescript/number/parse@1#tabs-and-newlines.input: \\r",
```

**Which assertion carries the first guard is worth recording, because the obvious one does not.** The
pair `parseNumber('1\u00A0000')` against `parseNumber('1 000')` is asserted unequal, and it
**passes on the mutant**: two strings differing at one code point are unequal whether or not either is
escaped. What catches it is the assertion on the spelling itself. This is
[ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md) arriving on an
assertion rather than on a guard — the inequality is derived from the claim, and only the claim is
worth perturbing.

**What these guards do not establish** is that a reader finds the output readable, which no guard here
can. What stands behind that is the same thing ADR-0028 recorded: the page opened in a real browser,
typed into, and read.

## What would reopen this

- **A contract whose answer is not a string and not an object**, which is the first type that would
  have to choose a reading with no precedent to copy. A `number` parameter is the obvious one, and it
  would have to decide whether `1e400` in a text field is the number or the text.
- **A `<textarea>` becoming the field**, which is the only way `tabs-and-newlines` could be retyped —
  and it still could not, measured: it drops the carriage return. What would actually close that is a
  field that is not an HTML text control at all, at a price no case of this catalogue justifies.
- **A second case carrying a line break**, which would move the limit from a fact about one row to a
  fact about the catalogue, and is the point at which a control per field is worth pricing again.
- **A contract whose cases are not all typeable for a reason other than a line break.** The class was
  measured over the code points an `<input>` drops; a browser that sanitised anything else would be a
  new measurement and a new sentence.

## More Information

- [ADR-0028](0028-what-a-playground-demonstrates-and-what-it-refuses-to-show.md) — what a playground
  demonstrates, whose section on the literal field this decision replaces.
- [ADR-0029](0029-what-runs-in-a-readers-browser.md) — what a reader's browser runs, which this does
  not change: the stripped reference and nothing else.
