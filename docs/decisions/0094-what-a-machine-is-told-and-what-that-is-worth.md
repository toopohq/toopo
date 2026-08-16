---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - packages/site/document.ts
  - packages/site/indexing.ts
  - packages/site/paths.ts
confirmed-by:
  - battery: site
    guard: the-markdown-projection-keeps-the-structure-and-changes-the-markup
  - battery: site
    guard: every-heading-of-a-page-is-a-heading-in-its-markdown
  - battery: site
    guard: a-mark-in-prose-is-escaped-and-a-mark-in-code-is-not
  - battery: site
    guard: a-code-span-is-delimited-by-a-run-the-code-cannot-close
  - battery: site
    guard: every-page-has-its-markdown-beside-it-at-the-same-address
  - battery: site
    guard: the-structured-data-is-json-a-consumer-reads-back-as-what-the-page-shows
  - battery: site
    guard: the-structured-data-a-page-publishes-is-the-record-it-renders
  - battery: site
    guard: only-a-page-about-one-contract-says-it-is-source-code
  - battery: site
    guard: every-page-is-listed-for-a-retriever-as-the-markdown-beside-it
---

# What a machine is told, and what each half of it is measured to be worth

## Context and Problem Statement

Increasingly it is an assistant that picks the function a developer installs, and this site served a
crawler two files: `robots.txt` and `sitemap.xml`. A retriever that opened a contract page got HTML and
nothing else.

Three things were proposed: a Markdown twin of every page, an `/llms.txt` index at the root, and
JSON-LD on every page. The brief that asked for them said the first had an established effect and the
second was uncertain. **Both halves of that were wrong, and measuring them is what this record is
mostly about** — because a mechanism built for an effect nobody has measured is a decoration, and a
decoration that ships is frozen.

## Considered Options

- A second generator that renders each page to Markdown.
- A third projection of the value a page already is.
- Serve only the reading `toText` already produces.

## Decision Outcome

### The Markdown is a third projection, and the tag set is closed to make it one

`toHtml` and `toText` were already two projections of one tree ([ADR-0024](0024-a-page-is-a-value-with-two-projections.md)).
A Markdown renderer is the obvious place to write a second generator, and a second generator is two
statements of one document that drift until one lies — which is the failure this repository names in
every folder it has.

So `toMarkdown` is a third table over the same tree, walked by one function. What made that affordable
is the half that had to change underneath it: **`Tag` is now a closed union of the fifteen tags this
repository builds a node with**, and each projection is a total map over it. A sixteenth tag does not
compile until every projection has said what it does with it, which is
[ADR-0054](0054-make-the-omission-impossible.md)'s shape on the thing that had just become twice as easy
to forget.

The separator table used to be a partial record with *no separator* as its fallback, and it carried
eight tags — `table`, `tr`, `ol`, `dl`, `dt`, `dd`, `header`, `footer` — that no call site writes. Both
facts are gone with it. The fallback is the exact shape of the defect W-64 published: an element that
carried no separator was put where a block belonged, and the summary after it began mid-line on the
first screen of the site.

**The projection is strict, and nothing selects what to publish.** A page's Markdown carries what its
HTML carries, including the two paragraphs that describe a playground no text file can offer. The
alternative was a declaration on a node meaning *not in the Markdown*, and it was refused on what it
would do to the guard: *the projections agree except where we said they need not* is a guard with a
configurable exit, green on exactly what it is told to ignore, and nobody rereads a list of exceptions.
The strict projection does not lie either — it describes what the page contains. If a block reads badly
as Markdown, that says it was written for a medium rather than for its content, and the repair is the
block.

### The Markdown saves about a third, and that is arithmetic rather than a claim about robots

Measured at `c493e68`, HTML against the Markdown projection: **20 364 B against 33 917 B for
`number/parse@1`**, and 60.0 %, 64.9 %, 64.1 %, 64.4 % over the four contract pages. The front page is
48.2 % and the method page is 90.0 %.

**The premise this unit was commissioned on was that a page is thirty-three kilobytes of markup around a
few kilobytes of content, and that is false here.** A contract page is 59–64 % readable text before any
of this. The 60–80 % savings the industry quotes are measured against framework-generated HTML; this
site has no framework, no font, no image, no request, and a 1.6 kB inline stylesheet. It was already
lean, which is exactly what makes the byte argument weak on it.

What survives as the argument is narrower and does not depend on any robot's behaviour: **an agent that
already has the URL pays about a third less and needs no HTML parser**, and it keeps the outline —
headings, lists, code — that `toText` throws away. That is the whole of it, and it is written that way
so nobody later reads this as a prediction that was made and met.

### `/llms.txt` is built for its cost, against a measured absence of effect

Checked in primary: SE Ranking's study over nearly 300 000 domains reports **10.13 % adoption**, and its
XGBoost modelling found that **removing the `llms.txt` variable improved the model's predictions**,
concluding *"no correlation between AI citations and LLMs.txt"*. On logs it says GPTBot *"sometimes
fetches"* the file and that this *"doesn't happen often"*.
<https://seranking.com/blog/llms-txt/>

Also checked in primary, on the *other* half of the brief: SALT.agency's argument against Markdown-only
pages presents **no measurements at all** — it argues from absence of evidence, states there is *"no
solid evidence that Markdown for bots improves visibility or citation rates"*, and quotes John Mueller
calling the approach a *"stupid idea"*. <https://salt.agency/blog/ai-markdown-pages/>

Not checked in primary, and named as such rather than cited: a figure of 408 `/llms.txt` fetches in
500 million AI bot visits over ninety days, and Google's stated position of July 2025. Both reached this
record through aggregators only. <https://ai.aeo.press/the-state-of-llms-txt-in-2026> was opened and
carries no measurement of any kind, contrary to how it is summarised elsewhere.

So the file is built on its cost — one file, derived from a list this repository already holds — and on
nothing else. **Neither half of what this unit adds has an established effect on what any crawler does,
and they are at the same level of evidence, which is none.** The one thing that is established is the
arithmetic above.

### JSON-LD is a value in the head, and the measurement is what put it there

It was going to be a node. Measured before it was written: a payload written as a text child goes
through `escapeText`, and **the content of a `script` element is raw text that no browser decodes** — so
`JSON.parse` succeeds and the `description` field reads
`accents &amp; marks folded, &lt;script&gt; refused` to every consumer. Valid structured data, corrupt
values, nothing red. The second half is worse: a text node reaches `toText`, so the instrument this
whole folder is steered by would be reading a JSON blob as part of the page.

So it sits beside the title, which is the other thing a page says about itself and does not say to a
reader. No projection sees it, and [ADR-0024](0024-a-page-is-a-value-with-two-projections.md)'s rule
that no node holds raw markup is untouched — this is not a node. The one escape is `<` written as its
JSON code point, which is an escape belonging to the format the value is in rather than to the document
it sits in, so a consumer reads back the character the page shows and no value can close the element
early.

**`SoftwareSourceCode` is on the four contract pages and on nothing else.** The catalogue is a list, the
method page is an argument, the refusals page is a judgement; giving them the type because the field
exists would publish a false `@type` in the part of a page written to be believed without being read.
The field is total and they answer `null`, which is a statement rather than an omission.

**`license` is `THE_COPIED_LICENCE` and not the repository's.** This repository is MIT and what a reader
takes is MIT-0 ([ADR-0047](0047-what-licence-covers-what.md)); publishing `MIT` in the one field a
scanner reads as a fact about the file in front of it would be that record's most expensive defect,
arriving through the machine-readable door. W-73 is that mutant.

## Consequences

**The tree grows from 66 files to 74, and the hosting wall moves from 1 537 contracts to 1 427.**
Measured at `c493e68` and after: the deployment is `14P + R + 17` where it was `13P + R + 13`, with `P`
published contracts and `R` refused ones — a Markdown twin per page, three of them fixed, and one
`llms.txt`.

**[ADR-0052](0052-what-an-emitted-tree-is.md) published `11N + 3` and a wall at 1 817, and that figure
is about a subtree.** It counts the emitted *answers* and not the pages, the modules or the crawler
files, where a static host counts everything it serves. Its own arithmetic is also short by one against
its own measurement — `11 × 4 + 3` is 47 where it measured 48, because a refused contract's
`implementation-bindings` is in neither term. Both are corrected there rather than restated here, in
this commit, because two formulas that coexist means the second one lies.

**Two guards were reopened, which is the riskiest thing in this unit and is written down as such.**
`a-page-loads-nothing-and-runs-nothing` was a regular expression refusing `<script` and `<link`
anywhere; the head now carries a `rel="alternate"`, which declares a representation and fetches nothing.
It is now three assertions that each say what they mean. `the-generator-knows-of-no-domain-but-the-one-it-publishes-on`
admits `schema.org` beside `www.sitemaps.org`: both are vocabulary identifiers, neither is ever fetched,
and JSON-LD requires that exact IRI. **The criterion for both was that the mutant stays red, and it was
replayed rather than argued** — W-24 reddens the first alone, W-62 the second alone.

**`every-page-is-reachable-from-the-front-page` was reading every `href` in the served string**, so the
alternate link counted as navigation. It now walks the anchors of the body, which is the discipline this
folder already runs on and what the guard always meant.

**Two guard names rendered a count and went false.** `...-in-both-projections` and
`the-two-crawler-files-...` were named for how many of a thing there were, so falsifying the name and
reddening the guard stopped being the same event the moment a third arrived —
[ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md)'s own criterion, met on this
repository's own guard names.

## Confirmation

`the-markdown-projection-keeps-the-structure-and-changes-the-markup` and
`every-heading-of-a-page-is-a-heading-in-its-markdown` are the pair over the thing the third projection
exists for; the second counts headings in the tree against heading lines in the output, two sides
neither of which is derived from the projection under test. `a-mark-in-prose-is-escaped-and-a-mark-in-code-is-not`
holds the escaping in both directions, which is the only form in which it can be kept — one direction
alone is satisfied by escaping everything or nothing.
`a-code-span-is-delimited-by-a-run-the-code-cannot-close` holds a derivation no current output exercises,
for the reason `a-path-that-would-break-the-xml-is-escaped` exists.
`every-page-has-its-markdown-beside-it-at-the-same-address` is what makes a bare `href="index.md"` right
rather than lucky.

## What would reopen this

A crawler publishing that it reads `/llms.txt`, which would turn the cost argument above into an effect
argument and is the event that record is waiting for. And a page that has to carry structured data no
single `@type` fits — a contract page describing several artefacts — which is where a total field
holding one shape stops being enough.

## More Information

- [ADR-0024](0024-a-page-is-a-value-with-two-projections.md) — the shape this extends.
- [ADR-0031](0031-what-a-crawler-is-told.md) — the two files this joins at the root.
- [ADR-0047](0047-what-licence-covers-what.md) — the licence the payload publishes, and why it is the
  copied one.
- [ADR-0052](0052-what-an-emitted-tree-is.md) — the tree this adds a file per page to.
