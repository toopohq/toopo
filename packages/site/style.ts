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
 * every page is served once each, where a second request costs a round trip and a cache entry buys
 * nothing until somebody reads a second page. **It counted the pages once and the count was wrong**,
 * as every count of them written into prose here has been within three units of being written; the
 * argument never needed one, which is the form to reach for first.
 *
 * **The arithmetic that will overturn it is known and is not today's**: this text is repeated in
 * every page of the tree, so a catalogue of a thousand contracts
 * carries a thousand copies, and at that size a file and one request is the cheaper half by orders
 * of magnitude. It is written here rather than acted on because a copy per page is not a
 * problem at this size and because a file would be a second address with a cache policy nothing here
 * derives.
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
 * **The pair renders 69 characters and not 75, and the gap is that margin rather than an error.**
 * Re-measured at `0cec957` over the 4 429 lines of every file of HTML in the tree at 1440, by
 * ADR-0122's method - one Range per character, grouped into line boxes by vertical overlap: the
 * densest line in a box of exactly this measure is 1.3342 characters per ch, and the worst line
 * rendered anywhere is 69. The model is exact rather than indicative - 75 * 1.3342 / (1.393 * 1.04)
 * is 69.1 - so the 8.6% between the two figures is 4% of declared drift and 4.2% of density that has
 * fallen since it was taken on eight pages.
 *
 * **It cannot be spent, and both reasons are arithmetic.** Measured at the same commit, the same
 * width and the same population: at 1.3876, the density re-measured with the drift kept, the measure
 * is 466px, the content column 972 and the worst line 72; at 1.3342, the density with no margin at
 * all, the measure is 485, the column 1 010 and one line reaches 77. The ceiling breaks because
 * density is not stationary - a wider box breaks the same sentences at different words and the
 * density rises to meet it. And the column grows twice as fast as the line, being two of them, so
 * widening prose to fill a column widens the column by more than it fills. ADR-0132.
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
 * **A catalogue that publishes its failures does not tint them red.** The method page names every
 * mutant this repository's suite did not catch beside the ones it did, and every contract page
 * carries cases that exist because a defect got past the suite. Colouring those would sort this repository's own evidence into things
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

  /* The span a line stays readable across, both ends of it, and what one character of this face
     costs. The header has stated that span as 45 to 75 since it was written and derived only its
     top; a column of secondary matter is what the bottom names, and it is a bound already argued
     for rather than a constant somebody chose for a sidebar. */
  --the-longest-line: 75;
  --the-shortest-line: 45;
  --characters-per-ch: 1.393;
  --the-methods-drift: 1.04;
  --measure: calc(var(--the-longest-line) * 1ch / (var(--characters-per-ch) * var(--the-methods-drift)));
  --aside: calc(var(--the-shortest-line) * 1ch / (var(--characters-per-ch) * var(--the-methods-drift)));
  /* What a block of this catalogue may be, for the two that would otherwise take whatever is
     offered. A column of prose is at most a measure, so a block of two columns of prose is at most
     two of them and the gap between: a settled case is a call beside an argument, and the use cases
     are jobs read two abreast. It bounds the use-case grid and, through the shell, the content
     column. The widest block this catalogue puts on a page is a case row, and measured under these
     rules it asks for 905px against the 933 this resolves to - so the bound is a ceiling and not a
     squeeze. */
  --two-columns: calc(2 * var(--measure) + var(--s10));
  /* The navigation column, named rather than repeated: the shell's ceiling is the rail plus what
     stands beside it, and a rail declared in two places is a rail that drifts. */
  --rail: 15rem;
  /* What one contract of a list needs before another may stand beside it. At a measure a list is two
     abreast exactly where its column is two measures wide and one everywhere else, which is a
     breakpoint nobody has to write and nobody can be wrong about; at a two-columns it is one at every
     width. Whether an index reads better in one column or two is a judgement that will be taken
     again, and this is the whole of where it is taken. */
  --a-contract-in-a-list: var(--measure);

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
/* A full-bleed column: the track asks its content how wide it wants to be, stops at what a block of
   this catalogue may be, and the two elements that lay themselves out span the whole width. It is
   one declaration rather than a wrapper on every page.

   It used to ask for a measure, and a measure bounds a line rather than a box - so the four pages
   with no rail had their card, their code blocks and their lists bound by a rule about prose.
   Measured at 456ee44: 446px of ink on a 2 560px screen, 17.5% of it. ADR-0122. */
body {
  display: grid;
  grid-template-columns: 1fr fit-content(min(var(--two-columns), calc(100% - var(--s10)))) 1fr;
  margin: 0; padding: 0 0 var(--s24);
  font: var(--t3)/1.62 var(--sans); color: var(--body); background: var(--paper);
  /* A contract's digest is 64 characters with nothing to break at, and it is prose rather than code:
     without this the sentence carrying it pushes the whole page sideways on a narrow screen.
     anywhere and not break-word, which is the same rendering and a different intrinsic size: the
     second breaks the word without counting the break in min-content, so the track above - which
     asks its content how wide it wants to be - was floored by the unbroken digest and ran past the
     viewport at 390. Measured on the method page: 400px of track in a 375px window. No backtick in
     this comment, for the reason the use-case grid's comment gives. */
  overflow-wrap: anywhere;
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
/* As wide as its longest line, and past what is available it scrolls rather than wraps - which is
   the sentence the overflow already made, now also about the box. A code block wider than its own
   content is an empty box with a border: measured at 2 183px around a 356px signature. */
pre {
  margin: 0 0 var(--s4); padding: var(--s3) var(--s4); overflow-x: auto; width: fit-content; max-width: 100%;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 6px; color: var(--ink);
}
/* Only the bottom, because the top belongs to whatever precedes it. Setting the shorthand here beat
   the standing gap under a heading on specificity, and the method page had one section in eleven
   whose opening sentence touched its own title - measured at 0px against 12 everywhere else. A
   paragraph already opens with no top margin, so the zero was saying nothing and costing that. */
.lede { font-size: var(--t2); line-height: 1.45; color: var(--body); margin-bottom: var(--s5) }
.meta { color: var(--dim); font-size: var(--t5) }
/* The same trap a fourth time: the shorthand's top outranks the gap under a heading, and the
   refusals page opened each refusal's summary touching the address above it. */
.why { margin-bottom: 0; color: var(--dim) }
/* The tag is the outline and the class is the look: a group sits at h3 or at h4 depending on
   whether its contract has one table or two, and it must read the same either way. */
.table { color: var(--dim); font-weight: 600; margin: var(--s10) 0 0 }
.group:target { background: var(--target); box-shadow: 0 0 0 var(--s2) var(--target); border-radius: 2px }
.anchor { color: var(--dim); text-decoration: none; font-size: var(--t6); float: right }
.anchor:hover { color: var(--accent) }
/* The title line of a list item, at whatever tag the outline asks for: a contract's name on the front
   page is a heading because it titles a section, and must not take the standing margin of one - nor
   its rule, which the list item already draws. Measured: a domain page listing its contracts at h2
   drew two lines 13px apart, one from the item and one from the heading inside it. */
.call { display: block; margin: 0 0 var(--s2); border-top: 0; padding-top: 0 }
/* Bottom only, for the reason the lede carries: the shorthand's zero beat the standing gap under a
   heading on specificity, and a section opening on a list touched its own title. */
ul.plain { list-style: none; padding: 0; margin-bottom: var(--s4) }
ul.plain > li { padding: var(--s3) 0; border-top: 1px solid var(--rule) }
/* A list of contracts, on the two pages that publish one. auto-fit takes as many tracks as the floor
   allows and no more, so the column decides the count and no width is written: the rule above still
   draws each item's own line, and the rows line up because every track is the same width. */
ul.contracts {
  display: grid; column-gap: var(--s10);
  grid-template-columns: repeat(auto-fit, minmax(min(var(--a-contract-in-a-list), 100%), 1fr));
}

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

/* The column is placed by the grid and never by source order, because the two answer different
   questions. A reader on a phone gets the page and then the navigation; a reader on a laptop gets the
   navigation on the left of it. Placing it puts the content first in the DOM, which is what a screen
   reader announces and what a text projection reads, and CSS order would have made those two disagree. */
/* One shell and three arrangements, each asked for by what the page actually holds rather than by a
   class the page remembers to carry. A shell with a table of contents has a column on both sides of
   the content; one with a column of secondary matter has it on the right; one with neither has the
   navigation and the content. Every ceiling is its own arrangement's tracks and gutters added up, so
   the day a track moves the layout follows without a number here being edited.

   Narrow is one column and has no ceiling to give: the viewport is the bound, and a page that stacks
   has nothing to centre. ADR-0123. */
.shell { display: grid; grid-template-columns: minmax(0, 1fr); margin: 0 auto; width: 100% }
.beside { padding: var(--s6) var(--s6) 0 }
.aside { padding: var(--s6) var(--s6) 0 }
/* Three blocks in one column, told apart by a line and the space around it. On the adjacent sibling
   rather than on every block, so the first one does not open with a rule under the heading it has
   just been given by the column it sits in. */
.aside > section + section { margin-top: var(--s8); padding-top: var(--s6); border-top: 1px solid var(--rule) }
/* The bottom is not symmetry: a figure ends at zero so that its own two lines hold together, and
   without this the last label touched the sentence under it - measured at 0px in a browser. The top
   is the standing gap off the heading these already have. */
.aside .figures { margin: var(--s3) 0 var(--s5) }
.aside p { font-size: var(--t5); color: var(--dim) }
.aside .figure strong { font-size: var(--t2) }
.rail-label {
  margin: 0 0 var(--s2); font-family: var(--mono); font-size: var(--t6);
  letter-spacing: .06em; text-transform: uppercase; color: var(--dim);
}
.rail-label a { color: inherit; text-decoration: none }
.rail-label a:hover { color: var(--ink) }
ul.toc { list-style: none; padding: 0; margin: 0 }
ul.toc > li { padding: var(--s) 0 }
ul.toc a { color: var(--dim); text-decoration: none; font-size: var(--t5) }
ul.toc a:hover { color: var(--ink) }

/* Where you are in the catalogue, above what is on the page you are reading. The two are separate
   elements rather than one list, because the rail names sections of this page and this names other
   pages, and one guard walks the first. */
.where { margin: 0 0 var(--s8) }
ul.siblings, ul.domains { list-style: none; padding: 0; margin: 0 0 var(--s6); font-family: var(--mono) }
ul.siblings > li, ul.domains > li { padding: var(--s) var(--s3); font-size: var(--t5) }
ul.siblings a, ul.domains a { color: var(--body); text-decoration: none }
ul.siblings a:hover, ul.domains a:hover { color: var(--ink) }
/* The accent means you are here, which is one of the two things it is allowed to mean. */
ul.siblings > li.here, ul.domains > li.here {
  color: var(--ink); background: var(--wash);
  border-left: 2px solid var(--accent); border-radius: 0 5px 5px 0; padding-left: var(--s2);
}
.rail { margin: 0 }
/* No ceiling of its own, and the sentence that used to stand here was right about the wrong element.
   It read: capped at what its widest block needs and not at what is left over. That is what a card,
   a case table and a code block each now say about themselves, so the column has nothing left to
   say - and on the column it said it to everything else too, including the blocks that gain by being
   wide. ADR-0122. */
main { padding: var(--s6) var(--s6) 0; min-width: 0; display: block }

/* The half a reader decides on, two abreast where there is room for two.

   The floor is a measure, so a second column appears exactly where it would be a column of prose and
   never a squeezed one - the same condition ul.contracts folds on, and no width is written for it.
   The sections are what the grid places; they were flat in the document until this unit, and a run of
   headings with their bodies between them is not something any layout can put beside anything.

   **A section left alone on its row keeps the measure it has today**, which is what makes this a gain
   and not an exchange: the arrangement can only ever fill width that was empty. Measured on
   number/parse@1 at 1440: the opening falls from 2 334px of height to 1 504. ADR-0132. */
.opening {
  display: grid; align-items: start; gap: 0 var(--s10);
  grid-template-columns: repeat(auto-fit, minmax(min(var(--measure), 100%), 1fr));
}
.opening > section { min-width: 0 }

/* The column's width, and read across rather than down.

   It was as wide as its own content, which is right for a block and was wrong for this one: the card
   is the first thing on the page and the thing that tells a reader how wide the page is, and at 580
   in a 933 column it said 580 while every table under it said 905. Measured at 0cec957: 353px of
   nothing to the right of it, identical at 1280, 1440, 1920 and 2560.

   **Widening it alone was measured and refused**: the void moved inside, 727px unused beside the
   address and 590 beside the command, which is the reading ADR-0122 had already recorded one floor
   up. So what changed is the arrangement and not the width - what it is, how to get it and what it
   answers on one side, what it costs on the other.

   The fold is the sum of the two bases and the gap, which is two shortest lines and a gutter: no
   width is written here and none was read off a screen. ADR-0132. */
.card {
  display: flex; flex-wrap: wrap; gap: var(--s5) var(--s10); align-items: flex-start;
  border: 1px solid var(--edge); border-radius: 10px; background: var(--card); padding: var(--s6);
  max-width: 100%;
}
/* The half that carries a signature grows and the half that carries three numbers does not: a pre
   does not wrap at any width, so a signature in the narrow half is a signature a reader scrolls.
   Measured on number/parse@1 at 1440 with the two halves even: 455px of type in a 422px box. */
.card > .identity { flex: 1 1 var(--measure); min-width: 0 }
.card > .figures { flex: 0 1 var(--aside); min-width: 0 }
.address { margin: 0 0 var(--s2); font-size: var(--t5); color: var(--dim) }
/* The mono face names what the registry addresses - a contract, a command, a value - and never a
   sentence. A contract page's title is a function's name; "Nothing is served at this address" is not. */
.card h1 { font-family: var(--mono); font-weight: 500; margin: 0 0 var(--s3) }
/* The ceiling is only what the card's is: the block is as wide as its own command, which the rule
   over every pre already says, and 44ch was a guess at the longest one. It is restated because it is
   more specific than that rule, and 44ch left the block 34px past a 390 viewport once the card
   stopped handing it a width. */
pre.install { display: flex; align-items: center; gap: var(--s4); background: var(--paper); max-width: 100%; font-size: var(--t4) }
pre.install .copy {
  margin-left: auto; border: 0; border-left: 1px solid var(--edge); background: none;
  padding: var(--s2) 0 var(--s2) var(--s4); font: inherit; font-size: var(--t5);
  color: var(--dim); cursor: pointer;
}
pre.install .copy:hover { color: var(--accent) }
pre.answer { margin: var(--s5) 0 0; background: var(--paper); font-size: var(--t4) }
/* The shape of a command rather than a command: the front page's, which names every address at once
   and therefore none. It takes the install block's size and not its class, because the class is what
   a copy control looks for and this is the one command on the site that would answer nothing if a
   reader ran what they had copied. */
pre.shape { font-size: var(--t4); color: var(--dim) }
pre.shape code { color: var(--ink) }
/* No rule above them and no margin off what precedes them: they sit beside the identity rather than
   under the command, so a separator here would draw a line across half a card. Where they wrap under
   it, on a narrow screen and in the column beside the front page, the gap is what separates them and
   it always was. */
.figures {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr)); gap: var(--s4);
  margin: 0;
}
.figure { margin: 0; font-size: var(--t5); color: var(--dim) }
.figure strong { display: block; font-family: var(--mono); font-size: var(--t2); font-weight: 500; color: var(--ink) }

/* No top of its own: under a heading the standing gap applies, and elsewhere the margin above
   collapses into it. Declaring one made a gap of 16 and then of 0, in both directions, where every
   other section heading is followed by 12. */
ul.chips { display: flex; flex-wrap: wrap; gap: var(--s2); list-style: none; padding: 0; margin-bottom: 0 }
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
   one template literal, and one would end it.
   The ceiling is the one thing here a track cannot say for itself: auto-fit takes whatever it is
   offered, so at 2 560 the four cards stood alone in a row 1 892px wide while nothing else on the
   page passed 950. Two abreast is what the floor was chosen for, and this is that decision holding
   at every width rather than at 1240. */
.use-cases {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  gap: var(--s4); margin: 0 0 var(--s4); max-width: var(--two-columns);
}
.use-case { border: 1px solid var(--edge); border-radius: 9px; background: var(--card); padding: var(--s5) }
.use-case h3 { margin: 0 0 var(--s2); font-size: var(--t4) }
/* The bottom only, and it is the same trap this stylesheet names four times above: a shorthand on a
   class outranks the standing gap under a heading, so a use case opened 8px under its own title where
   every other heading on the site is followed by 12. Found by the sweep this unit built rather than by
   an eye, and pre-dating it - measured on string/slugify@1 at all four widths. */
.use-case > p { margin-bottom: var(--s3); font-size: var(--t4) }
.use-case .call {
  margin: 0 0 var(--s3); padding: var(--s3); background: var(--paper);
  border: 1px solid var(--rule); border-radius: 6px;
}
.use-case .call code { color: var(--ink); line-height: 1.55; overflow-wrap: anywhere }
.use-case .why { margin: 0; font-size: var(--t5) }

/* One width for every row, so the rules between them line up, and that width is what a case asks
   for. On the container and not on the row: a row sized to its own content would leave the
   separators ragged, which is the one thing a table of forty-one cases must not be. */
.cases { margin: 0; width: fit-content; max-width: 100% }
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
  .shell { gap: var(--s6); padding: 0 var(--s6) }
  main { padding: var(--s10) 0 0 }

  /* Where you are in the catalogue, and then the page. */
  .shell:has(.beside) {
    grid-template-columns: var(--rail) minmax(0, 1fr);
    max-width: calc(var(--rail) + var(--two-columns) + 3 * var(--s6));
  }
  .shell:has(.beside) .beside { grid-area: 1 / 1 }
  .shell:has(.beside) main { grid-area: 1 / 2 }

  /* A page whose widest block is a line is bound by the line, and not by the widest block this
     catalogue is able to hold. The blocks that ask for more than a measure name themselves here,
     each of them having said so about itself further up; a list of contracts is one of them only
     where it has a second entry to put in a second column, which is the condition auto-fit itself
     folds on.

     **fit-content is what asks the content, and it is scoped rather than general for a measured
     reason.** Under an indefinite constraint repeat(auto-fit, ...) repeats once, so a track that
     asks a two-abreast list how wide it wants to be is answered *one contract*. Measured at
     0cec957 with the same declaration unscoped: the string family fell from 909px of ink to 493
     and the front page from 923 to 505. Every page this selector reaches holds no such list.
     ADR-0132. */
  .shell:has(.beside):not(:has(.card, .cases, .chips, .use-cases, .contracts > li:nth-child(2))) {
    grid-template-columns: var(--rail) fit-content(var(--two-columns));
    width: fit-content; max-width: 100%;
  }

  /* The page, and then what a reader may skip. */
  .shell:has(.aside) {
    grid-template-columns: minmax(0, 1fr) var(--aside);
    max-width: calc(var(--two-columns) + var(--aside) + 3 * var(--s6));
  }
  .shell:has(.aside) main { grid-area: 1 / 1 }
  .shell:has(.aside) .aside { grid-area: 1 / 2 }

  .beside, .aside { position: sticky; top: var(--s12); align-self: start }
  .aside { padding: var(--s10) 0 0 var(--s6); border-left: 1px solid var(--rule) }
  .beside { padding: var(--s10) 0 0 }
}

/* Three columns, and one of the three widths this stylesheet types rather than derives - the only
   one of them whose arithmetic is written down. The other two are the conditions below and above,
   64rem and 52rem, and they carry no comment at all; the list in CLAUDE.md holds all three.

   A media query cannot read a custom property - var() is not allowed in the condition, in any
   browser, and no backtick may be written here either because the whole stylesheet is one template
   literal - so the threshold is the arithmetic of the three tracks and their four gutters, taken on
   this machine's system font and rounded up to the next whole rem: 240 + 933 + 268 + 96 resolves to
   1 537px, and 97rem is 1 552. What makes the rounding safe rather than lucky is that the content
   track is minmax(0, 1fr): a face whose zero is wider than this one squeezes the middle column
   rather than pushing the page past the viewport.

   The table of contents is what asks for the third column, so a page without one does not declare a
   track it has nothing to put in. */
@media (min-width: 97rem) {
  .shell:has(.rail) {
    grid-template-columns: var(--rail) minmax(0, 1fr) var(--aside);
    max-width: calc(var(--rail) + var(--two-columns) + var(--aside) + 4 * var(--s6));
  }
  /* The column beside the content becomes its two halves, which is the one way a table of contents
     crosses to the other side of the page without leaving its parent in the document. Reparenting is
     what CSS cannot do; dissolving the box around two things already written in order is what it can,
     and the reading a screen reader gets is the one it got before. */
  .shell:has(.rail) .beside { display: contents }
  .shell:has(.rail) .where {
    grid-area: 1 / 1; position: sticky; top: var(--s12); align-self: start;
    margin: 0; padding: var(--s10) 0 0;
  }
  .shell:has(.rail) .rail {
    grid-area: 1 / 3; position: sticky; top: var(--s12); align-self: start;
    padding: var(--s10) 0 0 var(--s6); border-left: 1px solid var(--rule);
  }
}
@media (min-width: 52rem) {
  /* The call column is as wide as a call may be, and a call here is a paragraph rather than a pre,
     so that is the measure. It was 34ch, which named nothing: measured at 456ee44, that folded 50 of
     50 calls on number/parse@1 and 43 of 43 on date/add@1 onto more than one line, and 325 rendered
     lines carried the 157 calls of the four pages. At the measure it is 223. */
  .case { grid-template-columns: minmax(0, var(--measure)) minmax(0, 1fr) }
}
`.trim()
