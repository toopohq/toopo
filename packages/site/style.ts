/**
 * The visual system, as the one string every page carries and nothing else loads.
 *
 * **It is a module of its own because `document.ts` reached the ceiling this repository sets for a
 * file, and because the split was already there**: that file holds a node model and three projections
 * of it - what a page *is* - and this holds what a page *looks like*. Nothing here knows about a node,
 * and nothing there knows about a rule.
 *
 * `document.ts` is the only importer, and writing the string into one `style` element is the whole of
 * the coupling. The two guards over this stylesheet read it back out of the rendered HTML rather than
 * importing it, so they measure what a reader is served and did not move when this did.
 */

/**
 * The stylesheet, which is the whole of what this site loads beyond the page itself.
 * ADR-0115 is the system it declares: the scale, the unit, the roles and the one accent.
 *
 * Inline rather than a file, and that is a measurement about the launch rather than a preference:
 * seven pages served once each, where a second request costs a round trip and a cache entry buys
 * nothing until somebody reads a second page. **The arithmetic that will overturn it is known and is
 * not today's**: this text is repeated in every page of the tree, so a catalogue of a thousand
 * contracts carries a thousand copies, and at that size a file and one request is the cheaper half by
 * orders of magnitude. It is written here rather than acted on because seven copies is not a problem
 * and because a file would be a second address with a cache policy nothing here derives.
 *
 * No image, and no web font: ADR-0115 carries what the second refusal costs and what would reverse
 * it, measured rather than assumed.
 *
 * **This paragraph used to end "and no script", and the playground took that clause and not the one
 * after it.** What it was actually protecting survives untouched: *a contract page that needs
 * JavaScript to be read is a page a crawler and a screen reader read differently from a person.* A
 * page is still read without a line of it - the signature, the settled cases, the properties, the
 * profiles and the digest are all in the served HTML. What the script adds is the one thing static
 * HTML cannot do, which is answer an input nobody wrote down in advance, and `start.ts` builds its
 * own form so that a reader without JavaScript meets prose rather than a control that does nothing.
 *
 * ---------------------------------------------------------------------------
 * Six sizes, one unit, and roles rather than colours
 * ---------------------------------------------------------------------------
 *
 * The scale is six steps and there is no seventh: a page that needs one more size is a page that has
 * stopped distinguishing things and started decorating them. Every length that separates anything is
 * a multiple of `--s`, declared as such rather than rounded to it, so the rhythm is a consequence of
 * one number instead of a habit.
 *
 * The colours are named for what they *do* - paper, wash, card, rule, edge, ink, body, dim - so that
 * the dark palette is the same document with different values and never a second stylesheet.
 *
 * **There are two greys and not three, and a measurement is what removed the third.** The mock-ups
 * carry a `faint` below `dim`, and it was carrying the case identifier, the rail's label and the page
 * you are on. Read in a browser: 2.64:1 on light paper, 3.37:1 on dark, and 2.37:1 on a case somebody
 * had just followed a link to - against the 4.5:1 that text under 24px owes a reader. `dim` itself is
 * 5.45:1, so there was no room underneath it for a fourth legible step, and a colour that is only
 * *nearly* legible is worse than one step fewer. What tells the identifier apart from the argument
 * beside it is now the size and the face, which is what a scale is for.
 *
 * `dim` itself is a shade lighter in the dark palette than the mock-ups draw it, for the same reason
 * and on the same reading: `#8b857d` clears 4.5:1 on paper and on wash and answers **4.24:1 on a case
 * somebody has just followed a link to**, which is the one row where a reader is certain to be looking.
 * A ground that lifts is a ground the ink has to lift with.
 * `system-ui` and `ui-monospace` first, so the page is set in whatever the reader's own system uses
 * and downloads nothing.
 *
 * ---------------------------------------------------------------------------
 * The measure is counted in characters, and it is on the line rather than on the box
 * ---------------------------------------------------------------------------
 *
 * 45 to 75 characters is the span a line stays readable across, and 75 is the ceiling held here.
 *
 * **`ch` is the advance of `0` and not the average character, so a box capped in `ch` under-constrains
 * everything set smaller than it.** That is not a detail: the worst line this site ever served was 169
 * characters, and it was small print in a wide box - a cap on the box would have left it exactly
 * there. So `--measure` is declared on the element that carries the prose, where `ch` resolves against
 * the face the line is actually set in, and one declaration gives every step of the scale its own 75.
 *
 * **The conversion is a measurement, because CSS has no unit for the average character.** Over the 688
 * prose elements of the eight pages at 1240 and at 390, read with one Range per character grouped by
 * line box, the densest line was 1.393 characters per ch.
 *
 * **Density is a property of the text, so it moves when the column moves**: the same sweep answered
 * 1.339 before this measure existed and 1.393 once the column had narrowed to it, because a narrower
 * box breaks the same sentence at different words. It is a fixed point reached by iterating, and 1.04
 * is the drift across one turn. ADR-0077 is why it is applied rather than noted - a repair is chosen
 * for its margin, and a margin inside the method's own error has bought nothing. Measured over four
 * candidates: 1.34 leaves 2 lines over the ceiling at a worst of 78, 1.40 leaves none at 73, 1.45
 * leaves none at 70, and 1.50 leaves none at 69 while pulling the typical line down to 61.
 *
 * **The three numbers are declared apart rather than pre-multiplied into one length**, so that each is
 * a fact somebody can re-measure on its own and none of them is a compromise wearing another's name.
 *
 * **The argument is here and not beside the rule, and the reason is bytes.** This stylesheet is inline
 * in every page of the tree, so a comment inside the template literal is served to every reader as
 * many times as there are pages; a comment out here is not. Measured: 4 672 of the 13 323 bytes served
 * are comments already, and writing this one beside its constant cost 2 843 bytes per page.
 *
 * ---------------------------------------------------------------------------
 * The accent never says a status
 * ---------------------------------------------------------------------------
 *
 * One accent, and it means *you can act on this or you are here*: a link, a focus ring, a hover, the
 * page you are on, the case you followed a link to. It never means good or bad, and there is no
 * second colour that could.
 *
 * **A catalogue that publishes its failures does not tint them red.** The method page names 35
 * surviving mutants beside 632 caught ones, and every contract page carries cases that exist because
 * a defect got past the suite. Colouring those would sort this repository's own evidence into things
 * a reader is meant to feel bad about, which is the opposite of why they are published - and it would
 * make the reading and the page say different things, since a colour survives neither `toText` nor
 * `toMarkdown`. Caught and surviving are told apart by the word.
 */
export const STYLE = `
:root {
  --s: .25rem;
  --s2: calc(var(--s) * 2); --s3: calc(var(--s) * 3); --s4: calc(var(--s) * 4);
  --s5: calc(var(--s) * 5); --s6: calc(var(--s) * 6); --s8: calc(var(--s) * 8);
  --s10: calc(var(--s) * 10); --s12: calc(var(--s) * 12); --s16: calc(var(--s) * 16);
  --s24: calc(var(--s) * 24);

  --t1: 1.625rem; --t2: 1.1875rem; --t3: 1rem; --t4: .9375rem; --t5: .8125rem; --t6: .6875rem;

  --paper: #fbfaf8; --wash: #f3f1ec; --card: #f6f4f0; --rule: #e2ded7; --edge: #d3cfc7;
  --ink: #1c1b19; --body: #3a3833; --dim: #6b6660;
  --accent: #a0491d; --target: #f6ece4;

  /* The longest line a reader is asked to follow, and what one character of this face costs. */
  --the-longest-line: 75;
  --characters-per-ch: 1.393;
  --the-methods-drift: 1.04;
  --measure: calc(var(--the-longest-line) * 1ch / (var(--characters-per-ch) * var(--the-methods-drift)));

  --sans: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #171614; --wash: #201f1c; --card: #201f1c; --rule: #34322e; --edge: #45423c;
    --ink: #e8e5df; --body: #c5c0b8; --dim: #918b83;
    --accent: #e2905d; --target: #2a231d;
  }
}
* { box-sizing: border-box }
/* A full-bleed column: everything sits in a measure, and the two elements that lay themselves out
   span the whole width. It is one declaration rather than a wrapper on every page. */
body {
  display: grid; grid-template-columns: 1fr min(var(--measure), calc(100% - var(--s10))) 1fr;
  margin: 0; padding: 0 0 var(--s24);
  font: var(--t3)/1.62 var(--sans); color: var(--body); background: var(--paper);
  /* A contract's digest is 64 characters with nothing to break at, and it is prose rather than code:
     without this the sentence carrying it pushes the whole page sideways on a narrow screen. */
  overflow-wrap: break-word;
}
body > * { grid-column: 2 }
body > .masthead, body > .shell { grid-column: 1 / -1 }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }
a { color: var(--accent) }
/* On the element and never on the box around it: a line is counted in the face it is set in. A
   preformatted block is outside it, because code scrolls rather than wraps. */
h1, h2, h3, h4, p, li { max-width: var(--measure) }
h1, h2, h3, h4 { color: var(--ink) }
h1 { font-size: var(--t1); font-weight: 600; letter-spacing: -.02em; margin: 0 0 var(--s3) }
/* A page whose title is a direct child of the body has no card and no main to stand it off the
   masthead, and measured in a browser the two were touching at a gap of 0. */
body > h1 { margin-top: var(--s10) }
h2 {
  font-size: var(--t3); font-weight: 600; margin: var(--s12) 0 0;
  padding-top: var(--s4); border-top: 1px solid var(--rule); scroll-margin-top: var(--s16);
}
h3, h4 { font-size: var(--t4); font-weight: 600; margin: var(--s8) 0 0; scroll-margin-top: var(--s16) }
h2 + p, h2 + ul, h3 + p, h4 + p { margin-top: var(--s3) }
p { margin: 0 0 var(--s4) }
code, pre { font-family: var(--mono); font-size: .875em }
pre {
  margin: 0 0 var(--s4); padding: var(--s3) var(--s4); overflow-x: auto;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 6px; color: var(--ink);
}
.lede { font-size: var(--t2); line-height: 1.45; color: var(--body); margin: 0 0 var(--s5) }
.meta { color: var(--dim); font-size: var(--t5) }
.why { margin: 0; color: var(--dim) }
/* The tag is the outline and the class is the look: a group sits at h3 or at h4 depending on
   whether its contract has one table or two, and it must read the same either way. */
.table { color: var(--dim); font-weight: 600; margin: var(--s10) 0 0 }
.group:target { background: var(--target); box-shadow: 0 0 0 var(--s2) var(--target); border-radius: 2px }
.anchor { color: var(--dim); text-decoration: none; font-size: var(--t6); float: right }
.anchor:hover { color: var(--accent) }
/* The title line of a list item, at whatever tag the outline asks for: a contract's name on the front
   page is a heading because it titles a section, and must not take the standing margin of one. */
.call { display: block; margin: 0 0 var(--s2) }
ul.plain { list-style: none; padding: 0; margin: 0 0 var(--s4) }
ul.plain > li { padding: var(--s3) 0; border-top: 1px solid var(--rule) }

.masthead {
  display: flex; align-items: baseline; gap: var(--s6);
  padding: var(--s3) var(--s6); margin: 0; border-bottom: 1px solid var(--rule);
  position: sticky; top: 0; z-index: 20; background: var(--paper);
}
.wordmark { margin: 0; font-family: var(--mono); font-size: var(--t3); color: var(--ink) }
.wordmark a { color: var(--ink); text-decoration: none }
ul.menu { display: flex; flex-wrap: wrap; gap: var(--s5); list-style: none; padding: 0; margin: 0 0 0 auto; font-size: var(--t5) }
ul.menu a { color: var(--body); text-decoration: none }
ul.menu a:hover { color: var(--accent) }
ul.menu .here { color: var(--dim) }

.shell { display: grid; grid-template-columns: minmax(0, 1fr); max-width: 78rem; margin: 0 auto; width: 100% }
.rail { padding: var(--s6) var(--s6) 0 }
.rail-label {
  margin: 0 0 var(--s2); font-family: var(--mono); font-size: var(--t6);
  letter-spacing: .06em; text-transform: uppercase; color: var(--dim);
}
ul.toc { list-style: none; padding: 0; margin: 0 }
ul.toc > li { padding: var(--s) 0 }
ul.toc a { color: var(--dim); text-decoration: none; font-size: var(--t5) }
ul.toc a:hover { color: var(--ink) }
/* Capped at what its widest block needs and not at what is left over: without it the card stretched
   to 913px to hold a 446px sentence. 45rem is two 22rem use-case tracks and the gap between them. */
main { padding: var(--s6) var(--s6) 0; min-width: 0; display: block; max-width: 45rem }

.card { border: 1px solid var(--edge); border-radius: 10px; background: var(--card); padding: var(--s6) }
.address { margin: 0 0 var(--s2); font-size: var(--t5); color: var(--dim) }
/* The mono face names what the registry addresses - a contract, a command, a value - and never a
   sentence. A contract page's title is a function's name; "Nothing is served at this address" is not. */
.card h1 { font-family: var(--mono); font-weight: 500; margin: 0 0 var(--s3) }
pre.install { display: flex; align-items: center; gap: var(--s4); background: var(--paper); max-width: 44ch; font-size: var(--t4) }
pre.install .copy {
  margin-left: auto; border: 0; border-left: 1px solid var(--edge); background: none;
  padding: var(--s2) 0 var(--s2) var(--s4); font: inherit; font-size: var(--t5);
  color: var(--dim); cursor: pointer;
}
pre.install .copy:hover { color: var(--accent) }
pre.answer { margin: var(--s5) 0 0; background: var(--paper); font-size: var(--t4) }
.figures {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr)); gap: var(--s4);
  margin: var(--s5) 0 0; padding-top: var(--s5); border-top: 1px solid var(--rule);
}
.figure { margin: 0; font-size: var(--t5); color: var(--dim) }
.figure strong { display: block; font-family: var(--mono); font-size: var(--t2); font-weight: 500; color: var(--ink) }

ul.chips { display: flex; flex-wrap: wrap; gap: var(--s2); list-style: none; padding: 0; margin: var(--s4) 0 0 }
ul.chips a {
  display: inline-block; font-family: var(--mono); font-size: var(--t6); color: var(--body);
  border: 1px solid var(--edge); border-radius: 1rem; padding: var(--s) var(--s3); text-decoration: none;
}
ul.chips a:hover { border-color: var(--accent); color: var(--ink) }

/* The line the page is read in two halves across. It is heavier than a section rule and takes the
   largest step of the scale above it, because what it separates is not two sections but two ways of
   reading: everything above answers "is this the one", everything below is the binding itself. */
h2.divides { font-size: var(--t2); margin-top: var(--s16); padding-top: var(--s5); border-top-width: 2px; border-top-color: var(--ink) }
ul.toc > li.divides { margin-top: var(--s3); padding-top: var(--s3); border-top: 1px solid var(--rule) }
ul.toc > li.divides a { color: var(--body) }
ul.toc > li.under { padding-left: var(--s3) }

/* One card per job. The grid is the look; what makes these read differently from a case is that they
   carry a sans-serif heading and no address, which is the record's own decision showing through. */
/* The track is wide enough that four cards land two by two rather than three and an orphan, which is
   what 17rem gave at 1240 and is the only thing about this section a browser had to be asked. The
   min() is what keeps one column from overflowing a narrow viewport: auto-fit honours the minimum
   even when the container is smaller than it. No backtick in this comment - the whole stylesheet is
   one template literal, and one would end it. */
.use-cases { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr)); gap: var(--s4); margin: 0 0 var(--s4) }
.use-case { border: 1px solid var(--edge); border-radius: 9px; background: var(--card); padding: var(--s5) }
.use-case h3 { margin: 0 0 var(--s2); font-size: var(--t4) }
.use-case > p { margin: 0 0 var(--s3); font-size: var(--t4) }
.use-case .call {
  margin: 0 0 var(--s3); padding: var(--s3); background: var(--paper);
  border: 1px solid var(--rule); border-radius: 6px;
}
.use-case .call code { color: var(--ink); line-height: 1.55; overflow-wrap: anywhere }
.use-case .why { margin: 0; font-size: var(--t5) }

.cases { margin: 0 }
.case {
  display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s2) var(--s10);
  padding: var(--s5) 0; border-top: 1px solid var(--rule); scroll-margin-top: var(--s16);
}
.case:target { background: var(--target); box-shadow: 0 0 0 var(--s3) var(--target); border-radius: 2px }
.what { min-width: 0 }
.what .call { margin: 0 0 var(--s2) }
.what code { color: var(--ink); line-height: 1.55; overflow-wrap: anywhere }
.case-id { margin: 0; font-size: var(--t6) }
.case-id a { font-family: var(--mono); color: var(--dim); text-decoration: none }
.case-id a:hover { color: var(--accent) }
.argument > p { margin: 0 0 var(--s2); font-size: var(--t4) }
.argument > p:last-child { margin-bottom: 0 }

#playground { display: block; margin: var(--s4) 0 0; padding: var(--s4); background: var(--wash); border: 1px solid var(--edge); border-radius: 8px }
#playground p { margin: 0 0 var(--s3) }
#playground label { display: block; color: var(--dim); font-size: var(--t5); font-family: var(--mono); margin-bottom: var(--s) }
#playground .why { display: block; font-size: var(--t6); margin-top: var(--s) }
#playground input {
  width: 100%; padding: var(--s2) var(--s3); color: var(--ink); background: var(--paper);
  border: 1px solid var(--edge); border-radius: 6px; font-family: var(--mono); font-size: var(--t4);
}
#playground pre { margin: 0; background: var(--paper); border-color: var(--edge) }

@media (min-width: 64rem) {
  .shell { grid-template-columns: 15rem minmax(0, 1fr); gap: var(--s6); padding: 0 var(--s6) }
  .rail { position: sticky; top: var(--s12); align-self: start; padding: var(--s10) 0 0 }
  main { padding: var(--s10) 0 0 }
}
@media (min-width: 52rem) {
  .case { grid-template-columns: minmax(0, 34ch) minmax(0, 1fr) }
}
`.trim()
