---
status: accepted
date: 2026-08-23
decision-makers: Mathis Perron
governs:
  - CLAUDE.md
confirmed-by: []
---

# The seventh contract is `object/deep-equal`, and ten refusals say why

## Context and Problem Statement

The catalogue holds six contracts and five installable ones. What makes the product more useful is
the catalogue, because it is what a visitor meets on arrival; the internal debts left on this
repository's open list are invisible from outside. So the question is which function is the seventh.

**The research that chose the sixth does not exist.** It cost a session, it measured candidates and
refused them, and it lives in a conversation: no record names one of them, and `CLAUDE.md` names none
either. A refused candidate is worth as much as a retained one — it is a measurement somebody paid
for — and losing it means the next search starts from nothing. **This record exists so that the
eighth search starts from here.**

The problem is therefore two problems. Which function, and where does the answer live.

## Decision Drivers

* **Permanent rule 7.** A contract exists only if it provides something the language does not give
  trivially — non-obvious behaviour, real edge cases, an algorithm, or the correction of a language
  trap. This is the bar, and `array/group-by@1` established that clearing it is not a property a
  contract acquires once and keeps: the language moves, so the catalogue re-examines itself against
  it.
* **The language has moved twice this year.** ES2024 shipped Array Grouping, which refused
  `array/group-by@1`; Temporal is finished and awaiting ES2027, which is what put `date/add@1`'s
  `againstTheLanguage` field into the standing. A candidate at stage 3 is dead before it is born, so
  the proposals are read rather than remembered.
* **A disagreement that is a defect, not a preference.** Several utilities have implementations that
  differ. What is worth a contract is where the differences are *wrong answers*, because that is what
  this catalogue sells; where they are product choices, publishing a seventh answer adds one more
  thing a caller has to choose between.
* **Publication is for ever.** Whatever is settled here is frozen for the life of the major, so a
  candidate whose hard part is a taste is a candidate that freezes a taste.
* **The address must be admissible mechanically**, which ADR-0142 made possible: a name is checked
  against `CONTRACT_NAME` and against the addresses `imagined-addresses.ts` holds, rather than by
  somebody rereading a list.

## Considered Options

Eleven candidates were measured. Each is written up below with the measurement that decided it,
whether it was retained or refused, because that is the whole reason this record exists.

* `object/deep-equal` — **retained**
* `string/camel-case` and the case-conversion family — refused, with regret
* `string/truncate` — refused
* `object/deep-merge` — refused
* `number/format-bytes` — refused
* `semver/compare` — refused
* `string/escape-html` — refused
* `number/parse-duration` — refused
* `number/is-close` — refused
* `array/chunk`, `array/binary-search`, `function/debounce`, `string/word-wrap`, `string/strip-ansi`
  — refused briefly, each on one fact

**Four of these were remembered as having been refused during the sixth contract's search.** Three
are refused again here and one is not: `object/deep-equal` is refused no longer, because the
measurement does not support the refusal. `string/truncate` is refused for a **different and better
reason** than the remembered one, which matters more than the verdict — the remembered reason was one
this catalogue had already overruled, and it would have refused a good contract if it had been right.

### What the language is doing, read on the day

Read from `tc39/proposals` on 2026-08-23. ES2024 finished Array Grouping. ES2025 finished
`Math.sumPrecise`, `Uint8Array` to and from Base64, `RegExp.escape`, the new Set methods,
`Error.isError` and sync iterator helpers. ES2027 has Temporal, Joint Iteration and Explicit Resource
Management finished and awaiting publication. Stage 3 carries iterator chunking, Iterator Includes
and Iterator Join. Records and Tuples was withdrawn at the April 2025 plenary and subsumed by
Composites, which is stage 1.

Four of the eleven are refused on that reading alone.

## Decision Outcome

**Chosen: `object/deep-equal`**, because it clears permanent rule 7 on three of that rule's four
clauses at once, because nothing in the language answers it and nothing in flight would, because two
widely used implementations return `true` for two plainly different Sets, and because it is the only
candidate measured that arrives with an oracle the platform itself defines.

Address checked mechanically against this repository's own declarations, rather than by rereading:
`object/deep-equal` satisfies `CONTRACT_NAME` as `packages/registry/address.ts` writes it, does not
begin with `THE_IMAGINED_DOMAIN_PREFIX`, and is none of the nine addresses
`packages/registry/imagined-addresses.ts` holds.

### The rule 7 measurement

What the language gives for comparing two values structurally is `===`, which answers a question
nobody asked, and the thing a developer reaches for first is comparing two `JSON.stringify` results.
**Measured over nine pairs, that comparison is wrong on seven of them**: `false` for `{a: 1, b: 2}`
against `{b: 2, a: 1}`; `true` for `{a: undefined}` against `{}`; `true` for `{a: NaN}` against
`{a: null}`; `true` for a `Date` against its own ISO string; `true` for a populated `Map` against an
empty one and for a populated `Set` against an empty one; `true` for `-0` against `0`. It throws on a
cyclic value and on a BigInt.

The cause is one line of the language and it is worth writing down, because it is what makes the
whole family of defects below inevitable: `Object.keys(new Set([1]))` is `[]`, and
`Object.keys(new Map([['a', 1]]))` is `[]`. A collection carries its contents somewhere no property
walk reaches.

That is the trap clause of rule 7, measured rather than asserted.

### The disagreement, which is the argument

Seven implementations over twenty-eight pairs: **eleven are answered differently by at least two of
them**. That figure is the weakest thing here, because a disagreement can be taste. What follows is
not taste.

**Two implementations answer `true` for two plainly different Sets.** `fast-deep-equal@3.1.3` and
`dequal/lite@2.0.3` both answer `true` for `new Set([1])` against `new Set([2])`, for
`new Set([1, 2])` against `new Set([1])`, for `new Map([['a', 1]])` against `new Map([['a', 2]])`,
and for `new Map([['a', 1]])` against an empty `Map`. They are not comparing a collection at all —
they walk own enumerable properties, of which a `Set` has none, and conclude that two empty objects
match. **The failure is a silent `true` on a comparison a caller is using to decide something.**
`fast-deep-equal` is the most-installed deep comparison in the ecosystem; its README opens with *The
fastest deep equal with ES6 Map, Set and Typed arrays support* and its Features section then says the
default entry point is ES5 and that Maps and Sets need `fast-deep-equal/es6`.

**The door you are told to use is wrong in the other direction.** `fast-deep-equal/es6` answers
`false` for `new Set([{id: 1}])` against `new Set([{id: 1}])`, and `false` for
`new Map([[{k: 1}, 'v']])` against the same shape, because it tests membership with `has`, which is
reference identity. One entry point says two different Sets are equal and the other says two
identical Sets are not.

**Three of six break on a value compared with its own structured clone.** `deepEqual(x,
structuredClone(x))` must be `true` for any cloneable `x` — reflexivity under a copy, and an oracle
this catalogue has not had since `string/levenshtein@1`'s axioms. Measured over eighteen cloneable
values, three break at least one implementation: `new Float64Array([NaN, 1.5])` against its own clone
is `false` from `fast-deep-equal/es6`, `dequal` and `deep-equal(strict)`, because they compare
elements with `===`; a `Set` holding objects against its own clone is `false` from
`fast-deep-equal/es6`; and a cyclic value against its own clone is a `RangeError` from
`fast-deep-equal`, `fast-deep-equal/es6` and `dequal`.

**On depth, the strictest implementation is the weakest.** Two identical chains of plain objects:
`util.isDeepStrictEqual` throws `RangeError` at depth 1 000, `lodash.isEqual` at 5 000,
`deep-equal(strict)` a `TypeError` at 5 000, and `fast-deep-equal` and `dequal` at 10 000. A
thousand-deep structure is a linked list or a parsed tree, not a pathological input.

**Four of six ignore symbol-keyed data entirely.** `{[k]: 1}` against `{[k]: 2}` for one shared
symbol is `true` from `fast-deep-equal`, `fast-deep-equal/es6`, `dequal` and `deep-equal(strict)`,
and `false` from `lodash.isEqual` and `util.isDeepStrictEqual`. Two objects whose data differs
compare equal, silently.

**Bounding the domain does not dissolve the disagreement, and that was the test that mattered.** The
design this record proposes bounds the input to the values `structuredClone` can carry — a boundary
the platform defines rather than one this catalogue invents. If bounding it had collapsed the
disagreement, there would be nothing left to settle. Measured over fourteen distinct pairs all inside
that boundary, across five implementations, **seven are still disputed**: `-0` nested in an object, a
sparse array against a dense one, `RegExp.lastIndex`, two `Error`s differing in `message`, two
differing in `cause`, two invalid `Date`s, and two structurally identical cyclic graphs.

### Where the language stands, with the date of each proposal's last movement

Nothing in ECMAScript compares two arbitrary values structurally, and no proposal would. Three were
checked, each with its last push, because *there is a proposal* and *the language is coming for this*
are different sentences.

| proposal | stage | last push | what it would give |
| --- | --- | --- | --- |
| Composites | 1 | 2026-08-18 | value equality for purpose-built, frozen, string-keyed structures compared with `===` after interning. Shallow. Cannot hold cycles, cannot take symbol keys, and cannot be asked about two objects that already exist. |
| Array Equality | 1 | 2021-04-22 | `Array.prototype.equals`, deep, scoped to arrays. Five years dormant. |
| Comparisons | 1 | 2026-06-11 | under investigation, and its open question is explicitly whether it should cover rich equality comparisons. Its subject is assertion functions, which throw rather than answer. |

**Composites is the live one and it is the wrong shape.** It gives equality to data you built as a
Composite and says nothing about a graph a caller already holds. **`Comparisons` is the real risk and
it is named here rather than smoothed**: stage 1, scope undecided, and if it ever ships a deep
comparison then this contract is re-examined under `array/group-by@1`'s own rule. ADR-0150 built the
field that would say so on a published contract, and using it moves no digest.

### The strongest argument against, and why it does not carry

**`util.isDeepStrictEqual` exists and is arguably the best implementation measured.** It is the one
that distinguishes `-0` from `0`, refuses a sparse array against a dense one, reads
`RegExp.lastIndex` and `Error.cause`, and does not ignore symbol keys. If this contract's argument
were *browsers do not have it*, that is a **polyfill argument**, and `array/group-by@1` refused
exactly that: a contract whose value has an expiry date is a polyfill wearing a specification.

It does not transfer. `Map.groupBy` is **in the language**, specified by TC39, on every runtime for
ever, and restating it is redundant against a document more rigorous and more public than the
contract. `util.isDeepStrictEqual` is one host's assertion helper: it specifies nothing, no second
implementation is held to it, it is absent from `browser` — a declared target of every contract in
this catalogue — and, measured above, it is the first of six to fall over on depth. **No normative
specification of structural equality exists anywhere**; that was searched for and none was found. The
honest sentence for `relationToTheLanguage` is that the language gives nothing, one host gives
something good and unspecified, and the ecosystem gives five answers of which two are silently wrong.

**A second objection, weaker and real.** The domain segment says `object` while the input domain is
any structured-cloneable value, most of which are not objects. `value/deep-equal` would be honest and
nobody searches for it. `object/deep-equal` is chosen for findability, the tension is recorded rather
than hidden, and `object/` is the domain that will later hold whatever else of that family this
catalogue admits.

### Consequences

* **`never mutates its arguments` becomes applicable and violable for the first time on an arbitrary
  graph.** It is inapplicable on four of the five published contracts and applicable on `date/add@1`
  over a single `Date`. Here both arguments are arbitrary object graphs, and the mutant is not
  hypothetical: marking visited objects to detect cycles is the textbook technique, and an
  implementation that forgets to unmark leaves the caller's data changed. **This would be the first
  published contract where all four universal properties are applicable with a plausible mutant
  each**, which is worth more to the instrument than the contract is worth to the catalogue.
* **A fourth domain and a domain page holding one contract.** ADR-0121 refused a domain page with an
  empty list; a page with one entry is what `/typescript/array/` has been since ADR-0127, so the shape
  is settled. The emitted tree gains two addresses — a contract page and a domain page — stated as a
  delta rather than as a total, because every present-tense page count this repository has written has
  drifted.
* **Two commits and not one**, ADR-0106's rule arriving a third time: `PUBLISHED_FROM` gains an
  address, and the commit that mints a digest cannot name itself as the commit it was published from.
* **Nothing frozen moves.** `contractAnatomy`'s `measured` fields are stamped observations and its own
  header says a further contract does not falsify one, so `packages/catalogue/every-contract.ts` does
  not need to be touched — which matters, because touching it rebinds all six published digests at
  once.
* **The price, measured on the sixth rather than estimated.** `number/round@1` took ten commits from
  `b03915c` to `7c9906c`, 92 files, +3 653 and −266, of which two commits were refactors owed anyway;
  its publication commit alone touched 20 files for +1 482 and −99. The folder is 1 705 lines across
  eight files, and `string/slugify@1`'s is 2 071 across seven. **A deep-equal folder will be at the
  top of that range and probably past it**, because the case table is the contract and this candidate
  has more to settle than any of the six.

### The first slice, and it is a stopping condition rather than a task

**Nobody has written the cycle-detecting walk.** Before any other line of `object/deep-equal@1` is
written, the writing unit writes the reference implementation and establishes that it holds `Map`,
`Set`, typed arrays, `Error` and `ArrayBuffer` while staying under this repository's function and
file length bars, without a marker property left on a caller's object.

**If it does not pass cleanly, this decision is wrong and the unit says so** rather than making the
contract fit. That is the whole point of putting it first: a contract is frozen for the life of its
major, and an implementation that had to be bent to fit is one the catalogue would carry for ever.

### One thing the writing unit may not do yet

**`reference.ts` is not written until the licence banner is settled.** The owner is deciding whether
to remove the copyright lines from installed files; they live in `reference.ts`, which is one of the
seven hashed files, so removing them from the existing contracts moves five published digests and is
refused by the freeze. One available outcome is that the change starts at the seventh contract.

**The banner freezes with the contract.** So `reference.ts` waits for that decision, and this
paragraph carries the date it was written — 2026-08-23 — rather than a condition that would expire
with nothing noticing, which is ADR-0153's finding one floor down.

## What would reopen this

* **`Comparisons` reaching stage 2 with rich equality comparisons in scope**, or any proposal that
  would put a structural comparison of two arbitrary values in the language. That is the event that
  refused `array/group-by@1`, and it refuses this one the same way. Its last movement is stamped in
  the table above so the next reading knows what it is comparing against.
* **The first slice failing.** If the walk cannot be written cleanly under this repository's bars,
  the decision is void and the runner-up is reconsidered on its own terms.
* **A rule for families of one algorithm.** `string/camel-case` is refused below because four cased
  renderings share one word-splitting algorithm and this catalogue has no shape for that. The day it
  has one, that candidate is the first thing to look at, and its disagreement rate is the highest
  measured here.
* **A better demand signal than npm downloads.** Two refusals below lean partly on install counts,
  which measure installs and not decisions. Both should be re-taken if a signal about what people
  actually ask for ever exists.

## The ten refusals, each with the measurement that refused it

### `string/camel-case` and the case-conversion family — refused, with regret

**The highest disagreement rate measured here.** Over twenty-nine inputs, **nineteen** are answered
differently by at least two of `change-case@5.4.4`, `camelcase@9.0.0`, `scule@1.3.0` and
`lodash@4.18.1`; for `kebabCase`, fifteen of twenty-nine. Some of it is spectacular — `change-case`
answers `"version_2Point_0"` for `"version 2 point 0"`, an underscore in the output of a camel-caser
— and some is a real fork: `lodash` folds diacritics, answering `eteChaud` for `ÉtéChaud` and
`strasseWagen` for `straße wagen`, and the other three do not.

**Two things refuse it and neither is the disagreement.**

*It is a family and not a function.* camelCase, kebab-case, snake_case and PascalCase are **one
algorithm** — deciding where the words are — and four renderings of its output. Four contracts
sharing one algorithm publish the algorithm four times; publishing the algorithm alone as
`string/split-words` publishes something nobody types into a search box. Nothing in this catalogue's
format resolves that, and inventing the resolution inside a unit that wanted a seventh contract is
the move this repository refuses.

*It collides with a contract already frozen.* `string/slugify@1` settles what happens to `é` — folded
to its base letter by canonical decomposition, argued at length, frozen for the life of the major. A
case contract must answer the same question and `lodash` shows both answers are live, so **the
catalogue would publish two rules for one question**, with no page explaining the difference to a
reader holding both. Not fatal — the two functions serve different ends — but a debt taken on at
publication, which is the worst moment to take one.

### `string/truncate` — refused, and the remembered reason was not the reason

**The remembered refusal was that it has four good definitions of length. That is true and it is not
a refusal**, because this catalogue had already overruled it: `string/levenshtein@1` faced the same
three units, **chose Unicode code points**, declared the choice in `identity`, and wrote into its own
`inputDomain` that the variants *answer different questions and are separate contracts*. The rule
existed before this search began, and truncate was entitled to it.

**Graphemes are eliminated by a measurement rather than by preference, and the measurement is
levenshtein's.** Grapheme boundaries follow the Unicode version of the runtime's ICU — the machine
this was measured on reports ICU 78.2 and Unicode 17.0 — so a contract settling truncation in
graphemes settles it differently on two runtimes, which is not a contract. Measured over six samples
at their given limits, the three units answer differently on five: `a😀b` truncated to 2 is a lone
high surrogate in code units and `a😀` in code points and graphemes; `👨‍👩‍👧xy` truncated to 1 is
half a surrogate pair, one person, or the whole family.

**What refuses it is what is left once the choice is made.** With code points chosen — the only
choice available — the whole function is

```js
Array.from(text).slice(0, limit).join('')
```

**One expression, built out of two language built-ins.** That is what permanent rule 7 forbids in as
many words, and it is written here in this form deliberately, so that the candidate cannot be raised
again in six months on the strength of a refusal that was about the units.

The decisions that remain — whether the ellipsis is inside the budget, whether to stop at a word
boundary, whether to cut from the middle — have no true answer, and a contract freezing one of them
for the life of a major is freezing a preference.

### `object/deep-merge` — refused, and the security argument is dead

Measured over ten pairs against `deepmerge@4.3.1`, `lodash@4.18.1` and `defu@6.1.7`: **three are
disputed.** Arrays give three distinct answers — `[1,2,3]` by concatenation, `[3,2]` by index,
`[3,1,2]` by prepending; an explicit `undefined` is dropped by one and kept by two; an explicit
`null` is kept by two and ignored by one. Nested objects, object over scalar, scalar over object,
`Date`, `RegExp` and empty object over a value are unanimous.

**The argument that would have carried it is gone.** Prototype pollution was the reason to specify a
merge, and all three implementations are hardened: feeding each of them
`JSON.parse('{"__proto__":{"polluted":"yes"}}')` and
`JSON.parse('{"constructor":{"prototype":{"polluted2":"yes"}}}')` leaves `Object.prototype` untouched
in six of six trials. A contract cannot sell a defence nobody is still exposed to.

What is left is three disagreements that are all product choices: whether merging two arrays
concatenates or replaces depends on whether the array is a list or a value, and no measurement
decides it.

### `number/format-bytes` — refused, nothing is at stake

**All sixteen values tried are answered differently by at least two of `pretty-bytes@7.1.1`,
`filesize@11.0.22`, `bytes@3.1.2` and `Intl`**, and that unanimity of disagreement is exactly why it
fails: `1024` is `1.02 kB`, `1 KiB`, `1KB` or `1K byte` depending on who is asked, and **none of them
is wrong.** They are different products — SI against IEC, two significant digits against five, a
space against none.

**The language half is genuinely missing and does not rescue it.** Measured: `Intl.NumberFormat`
rejects `kibibyte` and `mebibyte` with a `RangeError`, accepts `byte`, `kilobyte`, `terabyte` and
`petabyte` but **does not scale** — asked for `1536` with `unit: 'gigabyte'` it answers `1,536 GB` —
and `notation: 'compact'` puts an SI prefix on the unit rather than choosing one, giving `1.5K byte`.
*Smart Unit Preferences in Intl.NumberFormat* is stage 1, which is a live threat to a frozen contract.

**The refusal is that nothing is at stake.** A wrong slug breaks a URL and a wrong rounding breaks an
invoice; a byte string reading `1.02 kB` where the reader wanted `1 KiB` disappoints somebody. The
edge cases — `0.5`, `NaN`, `Infinity`, negatives — are real and shallow, and rule 7 has no clause for
*a rendering somebody would like standardised*.

### `semver/compare` — refused, the specification is the contract

**Between the two real implementations the algorithm does not disagree.** Over seventeen pairs,
`semver@7.8.5` and `compare-versions@6.1.1` differ on **three**, and all three are about what counts
as a version rather than about ordering: `1.2`, `1` and `01.0.0` are refused by `semver` with a throw
and accepted by `compare-versions`. Every precedence question — `1.0.0-alpha` before `1.0.0`,
`alpha.1` before `alpha.beta`, `alpha.beta` before `beta`, build metadata ignored, `alpha.10` after
`alpha.9` — is answered identically by both.

That is what a **written normative specification** does. SemVer 2.0.0 states precedence in numbered
clauses, it is public, and it is more rigorous than a contract here would be. This is
`array/group-by@1`'s refusal with the specification coming from outside TC39 rather than inside it,
and the argument transfers exactly: publishing a fifth thing a caller has to choose between is not
the answer to a disagreement somebody has already settled. The residue is one decision, and a
contract is not written for one decision.

### `string/escape-html` — refused, the right answer is not in the signature

Seven of eleven inputs are disputed across six implementations, and **the disagreement is cosmetic**:
`'` comes back as `&#39;` from `escape-html@1.0.3` and `lodash`, `&#x27;` from `he@1.2.0` and
`&apos;` from `entities@8.0.0` — three spellings a browser reads identically in HTML5.
`entities.encodeHTML` additionally escapes `(`, `)`, `/` and `=`, which is harmless over-escaping.

**What refuses it is the shape rather than the measurement.** The correct escaping depends on where
the text lands — a text node, a quoted attribute, an unquoted attribute, a URL, a script body — and
the signature `(text: string) => string` cannot carry that. A contract that freezes one context and
is called from another is a security defect with this catalogue's name on it. The one place a
contract could help is `&apos;`, which is XML and not HTML4, and a single trap is not a contract.

### `number/parse-duration` — refused, the grammar is invented

Over twenty inputs, `ms@2.1.3` and `parse-duration@2.1.8` differ on eight, and seven of the eight are
`ms` answering `undefined` where the other parses, because `ms` takes one unit and `parse-duration`
takes an expression. That is scope and not disagreement.

**The interesting agreement is what refuses it: both answer `1M` as one minute**, so months are
unreachable, and both answer `1y` as 31 557 600 000 ms, which is 365.25 days. Neither is wrong,
because there is nothing to be wrong against. Unlike `string/slugify@1`, where the use — a URL —
constrains the answers even with no oracle, the use here constrains nothing.

### `number/is-close` — refused, there is no ecosystem to disagree

The five definitions of *close* — absolute tolerance, relative tolerance, Python's `math.isclose` from
PEP 485, `Number.EPSILON`, and four ULPs — disagree on six of ten pairs, including `1e9` against
`1e9 + 1` and `0` against `1e-15`. That reads well and proves nothing: **all five were written for
the probe**. There is no widely used JavaScript implementation to compare, so the disagreement is
between definitions in a textbook rather than between answers people are shipping. PEP 485 also
carries `semver/compare`'s problem.

### Four refused on one fact each

* **`array/chunk`** — *iterator chunking* is stage 3. A contract published now is `array/group-by@1`
  written again, knowingly. Its family is 1.8 M weekly installs, the smallest measured.
* **`array/binary-search`** — 2.8 M weekly installs across two packages, against 26 M for the family
  standing in for `string/slugify@1`. The algorithm is real and the edge cases — leftmost against
  rightmost duplicate, comparator contract, `NaN` — are real; nobody is asking.
* **`function/debounce`** — 83 M weekly installs and genuine disagreement on leading and trailing
  edges, `maxWait` and cancel/flush. **It is not a pure function**: it returns a stateful closure and
  depends on elapsed time, and this catalogue's format assumes determinism at three separate points —
  `outputsAreEqual`, `propertyRuns` over generated inputs, and benchmark profiles. Admitting it means
  deciding what a contract *is*.
* **`string/word-wrap` and `string/strip-ansi`** — `word-wrap` carries `string/truncate`'s width
  problem with an algorithm choice on top, greedy against Knuth–Plass, which by
  `string/levenshtein@1`'s rule means there are two contracts there. `strip-ansi` is real,
  unspecified and unrivalled — one package, almost all of its installs transitive through `chalk` —
  and a contract has nothing to settle where the ecosystem has one implementation and no
  disagreement.

## More Information

### Coordinates

Every figure above was measured on **2026-08-23**, on **Node 24.15.0** (V8 13.6.233.17-node.48, ICU
78.2, Unicode 17.0), against this repository at **`94dd7f8`**. No probe ran inside the tree.

Library versions, each resolved at the head of its range on the day: `fast-deep-equal@3.1.3`,
`deep-equal@2.2.3`, `dequal@2.0.3`, `lodash@4.18.1`, `deepmerge@4.3.1`, `defu@6.1.7`,
`pretty-bytes@7.1.1`, `filesize@11.0.22`, `bytes@3.1.2`, `change-case@5.4.4`, `camelcase@9.0.0`,
`scule@1.3.0`, `semver@7.8.5`, `compare-versions@6.1.1`, `ms@2.1.3`, `parse-duration@2.1.8`,
`escape-html@1.0.3`, `he@1.2.0`, `entities@8.0.0`.

### What the demand figures are worth, which is less than they look

npm weekly downloads were read for every candidate and they count **installs, not decisions**:
`semver` at 842 M is largely npm installing itself and `strip-ansi` at 510 M is largely `chalk`. They
are quoted as orders and the only reading taken from them is a comparison against what this catalogue
already sells — the levenshtein family at 244 M and the slugify family at 26 M. Two refusals above
lean on that signal and both say so.

### What this search could not settle

**Eleven candidates is not every candidate, and this record does not claim the list is complete** —
the same claim `CLAUDE.md`'s open list refuses about itself. What a reader may take is that each
entry here is real and each measurement replayable.

**The first slice is unmeasured**, which is why it is a stopping condition above rather than a
consequence.

### The count this record went to check, and got wrong first

`CLAUDE.md` published *nineteen records carry `confirmed-by: []`* in the present tense with no rule
and no coordinate beside it. Checking it produced three different answers, and the point is that all
three are arithmetic — what separates them is the rule, which the sentence did not carry.

| rule | reading at `94dd7f8` |
| --- | --- |
| the front matter declares `confirmed-by` inline as `[]` | **21** |
| the literal `confirmed-by: []` occurs anywhere in the file | 22 |
| total occurrences of that literal across all records | 23 |

**21 is the defensible one**, because the claim is about what a record declares. The twenty-second is
**ADR-0001**, which discusses the empty form in prose because it is the record that settles the
format — so the loose rule counts the definition of the field as an instance of it. This was measured
twice: the first reading published here was 22, taken under the loose rule without stating it, and it
was corrected against a count taken under the strict one.

**The sentence is repaired by losing the rank rather than by restating it**, which is what ADR-0018
asks for first: a sentence that can be true without counting does not count. That an empty
`confirmed-by` is a legitimate state is true without a number, `declarationFaults` is what admits it,
and the number moves whenever a record is added — as this record itself does, taking the strict
reading from 21 to 22 on the commit that repairs the sentence.

### Where the probes live

The eleven probes and their raw output are not in this repository — rule 5 keeps working material
out — and every figure above names the population it was taken over so that any of them can be
rebuilt from the versions listed. The probes were written outside the tree and the tree was clean
before and after.
