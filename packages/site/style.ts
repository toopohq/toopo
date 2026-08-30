/**
 * The visual system, as the one string every page carries.
 *
 * **That sentence used to end *and nothing else loads*, and ADR-0176 is what made it false.** The
 * sheet now opens on an `@font-face` and a page therefore fetches one file: Geist's latin subset,
 * same-origin, addressed by its own digest. It is the only thing a page goes and gets, it is 29 400 B,
 * and the prose is the whole of what is set in it. `font.ts` holds the address, the licence and the
 * measurement that decided the monospace is not part of the bargain.
 *
 * **It is a module of its own because `document.ts` reached the ceiling this repository sets for a
 * file, and because the split was already there**: that file holds a node model and three projections
 * of it - what a page *is* - and this holds what a page *looks like*. Nothing here knows about a node,
 * and nothing there knows about a rule.
 *
 * `served-stylesheet.ts` is the only importer, and taking the comments out of this string is the whole
 * of the coupling; `document.ts` writes what that hands back into one `style` element. The four guards
 * over this stylesheet read it back out of the rendered HTML rather than importing it, so they measure
 * what a reader is served and did not move when this did.
 */

/**
 * The stylesheet, which is the whole of what this site loads beyond the page itself.
 * ADR-0115 is the system it declares: the scale, the unit, the roles and the one accent.
 *
 * Inline rather than a file, and that is a measurement about the launch rather than a preference:
 * every page is served once each, so a second request costs a round trip and a cache entry that buys
 * nothing until somebody reads a second page. **The argument holds without counting the pages**,
 * which is the form to reach for first - and this paragraph is where that was learnt rather than
 * where it is asserted: it counted them twice, and both figures were wrong inside three units of
 * being written.
 *
 * **The arithmetic that will overturn it is known and is not today's**: this text is repeated in
 * every page of the tree, so a catalogue of a thousand contracts
 * carries a thousand copies, and at that size a file and one request is the cheaper half by orders
 * of magnitude. It is written here rather than acted on because a copy per page is not a
 * problem at this size and because a file would be a second address with a cache policy nothing here
 * derives.
 *
 * **What made that paragraph true was measured rather than believed, and the reading moved the
 * threshold further away.** What a page carries is this sheet with its comments taken out - the prose
 * below is a maintainer's and never a reader's - which is 3 267 B in brotli against the 11 236 B the
 * annotated string weighs. A linked file would buy 3 264 B per page after the first and cost a round
 * trip before the first paint. `served-stylesheet.ts` carries the whole of that comparison beside the
 * removal that produced it. ADR-0141.
 *
 * **So write the reason down here and keep writing it down.** The prose in this file is the reason a
 * length holds the value it holds, it is what the header of every section below exists for, and it
 * costs a reader nothing at all.
 *
 * No image. **One web font, and that clause used to read *and no web font*.** ADR-0115 refused one and
 * named the condition that would reopen it - coverage, and not weight. ADR-0176 measured a candidate
 * against that condition and it closed half of it: Geist covers every code point this site's prose
 * carries, so the prose is set in it, and Geist Mono is served in no subset that carries U+2192, so
 * the monospace is not. The face is same-origin, 29 400 B, and addressed by its own digest. `font.ts`
 * is where that argument lives, beside the bytes it is about.
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
 * **There are two greys and not three, and this is the paragraph the redesign walked back into.**
 * ADR-0115 removed a `faint` below `dim` on a reading: it carried the case identifier, the rail's
 * label and the page you are on, and answered 2.64:1 on light paper against the 4.5:1 that text under
 * 24px owes a reader. `dim` was 5.45:1, so there was no room underneath it for a fourth legible step,
 * and a colour that is only *nearly* legible is worse than one step fewer.
 *
 * **The palette above is the owner's and its third grey is back, at the value he ruled.** Measured at
 * ADR-0176 over the artboard's own values, `--dim` - the artboard calls it `faint` - answered
 * **3.51:1 on dark paper and 2.81:1 on light**, and worst of all **2.49:1 on light card**. So the role
 * ADR-0115 removed for measuring 2.64:1 came back measuring 2.64:1 on wash, eight months later, in a
 * repository that exists so that figures do not drift.
 *
 * **It was recorded rather than corrected for exactly one unit, because the design is the owner's and
 * he had not ruled.** He ruled: the ink clears the floor against every ground it is painted on, in
 * both themes. The values are the ones ADR-0176's own reopening clause named - `#7c868a` on dark and
 * `#636d71` on light - so nothing here was invented, and they are taken because they measure rather
 * than because they were written down. Re-measured at ADR-0178 over the four grounds: dark answers
 * **5.23, 5.01, 4.65 and 4.56**, light answers **5.12, 4.81, 4.53 and 4.67**, and the binding ground
 * is the card in both. ADR-0178.
 *
 * The prose is set in Geist since ADR-0176 and the monospace is still whatever the reader's own system
 * uses, which is the half of *downloads nothing* that survived.
 *
 * ---------------------------------------------------------------------------
 * No line on this site is bounded, and what the measure still sizes
 * ---------------------------------------------------------------------------
 *
 * 45 to 75 characters is the span a line stays readable across. The top of that span bounded every
 * `h1`, `h2`, `h3`, `h4`, `p` and `li` this site served until ADR-0134, where the owner withdrew it:
 * a width stated in characters and a layout that follows the screen are contradictory, and the layout
 * is what he wanted. **So no rule here caps a line at anything**, and a paragraph is as wide as
 * whatever holds it.
 *
 * **`--measure` survives, and it is worth being exact about what it is now.** It sizes three boxes,
 * none of which is a line of prose: the call column of a settled case, the half of the card that
 * carries a signature, and the floor a list of contracts puts a second column beside the first at.
 * `--the-longest-line: 75` therefore names the width of a call column, which is not what it says.
 * ADR-0134 records that as the orphan it is rather than repairing it here, because every one of those
 * three boxes was named untouchable by the same decision.
 *
 * **The conversion is a measurement, because CSS has no unit for the average character.** Over the 688
 * prose elements of the eight pages at 1240 and at 390, read with one Range per character grouped by
 * line box, the densest line was 1.393 characters per ch. `ch` is the advance of `0` and not the
 * average character, which is why a conversion is needed at all.
 *
 * **The three numbers are declared apart rather than pre-multiplied into one length**, so that each is
 * a fact somebody can re-measure on its own and none of them is a compromise wearing another's name.
 *
 * **Two readings that used to stand here have been withdrawn rather than restated.** That the pair
 * rendered 69 characters against a declared 75, and that the remaining 8.6% could not be spent, were
 * both measured at `0cec957` and were both about a ceiling on prose. They were true of the site that
 * had one. ADR-0132 and ADR-0133 hold them with their coordinates; nothing here re-asserts them,
 * because a reading kept past the rule it was taken under is the defect this repository names most
 * often.
 *
 * **The argument is here and not beside the rule, and the reason is bytes.** This stylesheet is inline
 * in every page of the tree, so a comment inside the template literal is served to every reader as
 * many times as there are pages; a comment out here is not. **More than half of what this file serves
 * is comment**, which is what makes the split worth making rather than merely tidy.
 *
 * **The count that used to stand there is withdrawn rather than corrected, and it is the reason this
 * paragraph is worth reading twice.** It read *4 672 of the 13 323 bytes served*, with no commit
 * beside it - true the day it was written, and wrong by a factor of two before anybody read it again,
 * because the quantity moves every time this file is edited. A present-tense count of a moving
 * quantity is the defect `CLAUDE.md` names most often, and this paragraph was an instance of it while
 * arguing for a discipline. What replaces it is a claim that survives an edit, and the exact figures
 * are stamped in ADR-0135 where a date makes them honest.
 *
 * ---------------------------------------------------------------------------
 * A box folds where the language allows and scrolls only where it does not
 * ---------------------------------------------------------------------------
 *
 * ADR-0135 is the record and the measurements; this is the rule, because four rules below are
 * consequences of it and none of them reads as one on its own.
 *
 * **A `pre` used to say: as wide as its longest line, and past what is available it scrolls rather
 * than wraps.** The first half is about a block *wider* than its content - `width: fit-content`
 * replacing a 2 183px box around a 356px signature - and the second was never put against a screen
 * *narrower* than a type declaration. One rule carried both, so the second inherited an argument made
 * for the first: at 390 a contract page hid four to six blocks behind their own scrollbars, worst
 * 361px behind a 325px window.
 *
 * **They are two cases.** A signature has break points - a space, a comma, an arrow. A digest has
 * none. So `white-space: pre-wrap` takes the break points the text already has, and `overflow-wrap`
 * stays `normal` so a token with nowhere to break keeps its shape and its block scrolls. What tells
 * them apart is the text and no longer which element carries it.
 *
 * **Two blocks opt out, in opposite directions, and both are the same test applied.** The install
 * command takes `anywhere`, because a command is not a signature: its longest token is an address a
 * reader has to read and copy in full, and a line break inserts no character. The playground's answer
 * takes `anywhere` too, because it renders what the settled cases render - a call and what it
 * answered - and those already break anywhere; the two were one shape wrapping two ways.
 *
 * **The wordmark opts out the other way.** `overflow-wrap: anywhere` on `body` exists so a
 * 64-character digest cannot push a page sideways, and it makes *any* word's min-content one
 * character - so a flex row squeezed the site's own name to nothing and introduced it as `toop` over
 * `o` on every page below about 479. `normal` gives the word its width back, and a flex item cannot
 * be shrunk under its min-content. The control beside the install command is the same reading on a
 * different object: `flex: none`, because a control is not text that reflows.
 *
 * **And what a linked-to element clears is the sticky bar, which the two now share terms for.** CSS
 * cannot read a rendered height, so the clearance is built from the bar's own declarations - its
 * padding, and its content at the tallest that content gets. **The bar's height is the menu's and
 * never the wordmark's**, which is why repairing the wordmark made this worse before the menu's own
 * row gap made it better: giving the name its 44px back takes them from the menu, which wraps one row
 * further and pays the height straight back. The one term that is data rather than a length is how
 * many rows the menu wraps to, and `CLAUDE.md` carries it among what nothing keeps.
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
 * `toMarkdown`. Caught and surviving are told apart by the word. *
 * ---------------------------------------------------------------------------
 * Why the three thresholds are the numbers they are
 * ---------------------------------------------------------------------------
 *
 * A media query cannot read a custom property - `var()` is not allowed in the condition, in any
 * browser - so a threshold can only ever be a number. What the entry in `CLAUDE.md` asked for is not
 * that it stop being one: it is that the number be the arithmetic of the tracks it separates, written
 * where somebody can check it. Each of the three carries its sum beside it now, and the reasoning is
 * here rather than there because this stylesheet is inline in every page of the tree.
 *
 * **Two columns, 50rem** - the wider of the two arrangements, because one condition serves both.
 * `--measure` and `--aside` resolve against `ch`, which is a property of the reader's own face, so
 * these sums are taken at the advance this machine measured, 8.625px, and are exact only there. The
 * terms are what is derived; rounding up to a whole rem is the slack that covers the rest.
 *
 * The floor each arrangement gives its content column is one whole readable line and never two, and
 * that is what the container query buys: a settled case folds on the width of its own container, so
 * `main` no longer has to be wide enough for a case row before a navigation may stand beside it.
 *
 * **Three columns, 97rem.** It used to be the arithmetic of its own tracks - 240 + 933 + 268 + 96 -
 * and the 933 was the content column's ceiling, which ADR-0134 removed; the sum stopped existing and
 * the number stood with nothing behind it. What restores it is not that ceiling: it is that a case row
 * has a width again, two measures and the gutter between them. **The value does not move.** It was
 * 97rem typed and it is 97rem derived - the number was right and its justification was gone, and those
 * are different defects.
 *
 * **The case row, 58rem, and it is a container query.** This was the one that was not merely underived
 * but unanswerable: a viewport condition cannot know whether a navigation is standing beside the
 * content, so 52rem meant one thing on a domain page and another on a contract page, and no arithmetic
 * could have covered both. `main` declares the containment and nothing about the page around the row
 * enters its sum.
 *
 * **The direction of that rounding was measured rather than chosen.** At 59rem the row folded back to
 * one column at exactly the width the third column appears: the shell hands `main` 933px there, the sum
 * wants 933, and a scrollbar takes 15 of the slack the shell's own rounding had left. So widening a
 * window made the case rows stack, which is a reader dragging an edge and watching the page get worse.
 * Rounded down, the arrangement that gives the row least room still gives it enough, and the two tracks
 * are squeezed by at most 5px. A switch that lands on the micron is not a derived threshold, it is one
 * nobody controls - ADR-0134 refused a candidate for exactly that.
 */

import { THE_FONT_FACE, THE_SANS_STACK } from './font.js'

export const STYLE = `
${THE_FONT_FACE}
:root {
  --s: .25rem;
  --s2: calc(var(--s) * 2); --s3: calc(var(--s) * 3); --s4: calc(var(--s) * 4);
  --s5: calc(var(--s) * 5); --s6: calc(var(--s) * 6); --s8: calc(var(--s) * 8);
  --s10: calc(var(--s) * 10); --s12: calc(var(--s) * 12); --s16: calc(var(--s) * 16);
  --s24: calc(var(--s) * 24);

  --t1: 1.625rem; --t2: 1.1875rem; --t3: 1rem; --t4: .9375rem; --t5: .8125rem; --t6: .6875rem;

  /* The dark palette, and it is the default rather than the exception since ADR-0176. The values
     are the owner's, read off the artboard; the role names are this repository's, because ADR-0115
     decided that a colour is named for what it does and the artboard names its colours for what
     they are. The two vocabularies map one to one - bg, bg2, bg3, line, line2, text, muted, faint
     become paper, wash, card, rule, edge, ink, body, dim - so nothing was invented and nothing was
     dropped. */
  /* --target is the artboard's accent-dim, which it declares translucent. It is written opaque here
     and it is the same colour a reader is shown: rgba(63, 214, 183, .09) composed over the paper it
     is painted on. A ground has to be opaque for the legibility rule to mean anything - an ink read
     against a translucent token is read against a colour nobody sees - so the composition is done
     once, here, rather than left for a guard to guess at. */
  --paper: #0b0d0e; --wash: #101314; --card: #171b1d; --rule: #1f2426; --edge: #2d3336;
  --ink: #e6e9ea; --body: #98a2a6; --dim: #7c868a;
  --accent: #3fd6b7; --target: #101f1d;

  /* The span a line stays readable across, both ends of it, and what one character of this face
     costs. Since ADR-0134 neither end bounds a line: the top sizes three boxes that are not lines
     and the bottom is the column of secondary matter, which is a bound already argued for rather
     than a constant somebody chose for a sidebar. The header says which boxes and why the top's
     name outlived its job. */
  --the-longest-line: 75;
  --the-shortest-line: 45;
  --characters-per-ch: 1.393;
  --the-methods-drift: 1.04;
  --measure: calc(var(--the-longest-line) * 1ch / (var(--characters-per-ch) * var(--the-methods-drift)));
  --aside: calc(var(--the-shortest-line) * 1ch / (var(--characters-per-ch) * var(--the-methods-drift)));
  /* The navigation column, named rather than repeated: a rail declared in two places is a rail
     that drifts. */
  --rail: 15rem;
  /* The floor a figure of the card's strip needs before another may stand beside it, which is the
     widest label one carries set on one line. Measured in a browser over the three of every
     published contract page: the widest is "bytes, one file" at 116px, and 9rem is 144px, so the
     three go abreast wherever the card is wider than 27rem and stack under it. */
  --a-figure: 9rem;
  /* What one contract of a list needs before another may stand beside it: a second column appears
     only where each track is still a whole readable line, and the count follows the screen from
     there. It read, until ADR-0134, that a list is two abreast exactly where its column is two
     measures wide - which was arithmetic about a column that no longer has a width, so the value is
     kept and its reason is not. Measured at 7c15c69 on the front page: one column to 1280, then two,
     three, four and five, with no track ever under 464px.

     It is still spelt as the measure, and that is a coupling rather than a derivation - the two
     agree on a number and no longer on a meaning. Whether an index reads better in one column or
     two is a judgement that will be taken again, and this is the whole of where it is taken. */
  --a-contract-in-a-list: var(--measure);

  /* The four lengths the artboard measures the front page in, declared here so that every ceiling and
     every track on that page is a name rather than a number - which is what
     every-ceiling-on-a-box-is-derived-and-never-typed and its neighbour ask of one.

     They are the design's own and they are in rem so that a reader who has changed their text size
     takes the whole page with them: 1100, 760, 600 and 300 at the browser's default. The page is
     wider than the prose pages on purpose, and the reason is that a grid of cards is not a column of
     text - --measure bounds a line and has no opinion about a row of three. ADR-0182. */
  --the-page: 68.75rem;
  --the-opening: 47.5rem;
  --the-lede-line: 37.5rem;
  --a-card: 18.75rem;
  /* What a contract's name takes in a row of arrivals, so the four signatures beside them start on
     one edge. The artboard writes 150px; it is a name and not a ceiling, which is why it is here. */
  --a-name-in-a-row: 9.375rem;

  /* The prose is Geist and the monospace is the system's, which is one decision and not two halves
     of an unfinished one. ADR-0115 refused a web font on coverage and named what would reopen it;
     Geist Mono fails that condition on its first term, so the face this site downloads is asked for
     the prose alone - where the whole population above U+007F is three code points it covers.
     font.ts carries the measurement and what a second face would cost. */
  --sans: ${THE_SANS_STACK};
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* Declared because two rules need it and one of them is arithmetic. */
  --the-line: 1.62;

  /* The one hairline this site draws, named because two things now depend on it: the rules that draw
     a border, and the arithmetic that has to know how tall a bordered box is. */
  --the-hairline: 1px;

  /* The narrowest a query field may be before it stops being one. Measured rather than derived, the
     way the row count below is: at this basis the field takes its own row under 390 and leaves the
     menu a single row from 600 up, which is the bar at its shortest on both sides of that. It is in
     characters because what the box holds is characters. ADR-0137. */
  --the-shortest-query: 14;
  --the-query-field: calc(var(--the-shortest-query) * 1ch);

  /* What a linked-to element has to clear: the sticky bar, in the bar's own terms. The header says
     why the terms are shared and which one of them is data rather than a length. ADR-0135.

     The field is a second term since ADR-0137, and it is the term that made the sum wrong before it
     was added: measured in a browser, the bar at 320 went from 106 to 126 while this said 103, so
     every address a page publishes landed 23px behind it. The field takes its own row where the bar
     is tallest, so it enters the sum as a row and a gap rather than as a maximum. */
  --the-menu-at-its-tallest: 1;
  --the-field-at-its-tallest: calc(
    var(--t5) * var(--the-line) + var(--s) * 2 + var(--the-hairline) * 2
  );
  --the-sticky-bar: calc(
    var(--s3) * 2 +
    var(--the-field-at-its-tallest) + var(--s6) +
    var(--the-menu-at-its-tallest) * var(--t5) * var(--the-line) +
    (var(--the-menu-at-its-tallest) - 1) * var(--s2)
  );

  /* Dark first, because it is the palette declared above and the one a reader gets when their
     system has no preference to state. The two overrides below restate it for the case where a
     reader has pressed the button, so that a form control and the page agree about which way round
     they are. */
  color-scheme: dark light;

  /* On the scroll container and not on each target: a list of selectors is a list that forgets
     one, and this one had - the playground section carried no offset at all. The bar, and the
     standing gap off it that a heading already takes from what precedes it. */
  scroll-padding-top: calc(var(--the-sticky-bar) + var(--s3));
}
/* The light palette, which a reader reaches two ways and which is therefore written twice.
   ---------------------------------------------------------------------------

   **The duplication is the language's and not a shortcut, and it is guarded rather than watched.**
   Light has to apply under two independent conditions - the reader's system says light, or the
   reader pressed the button - and a selector list cannot span a media query, so no arrangement of
   plain CSS states these values once. light-dark() does, and it was measured and refused: it needs
   Chrome 123 and Safari 17.5, where this sheet's own :has() already needs Firefox 121 and
   Chrome 105, so it would raise the floor to May 2024 on two engines to save twelve declarations -
   and a reader below that floor gets a page with no colours at all rather than a page that degrades.
   What removes the risk instead is the-palette-a-reader-gets-from-the-button-is-the-palette-their-system-would-have-given-them,
   which compares the two blocks and reddens on any character between them. ADR-0176.

   **Nothing here is needed to read.** The first block is a media query, so a reader running no
   JavaScript at all gets their own system's palette; the second is an attribute nothing sets unless
   somebody presses a button. :not([data-theme='dark']) is what lets the dark override work without
   a third copy: a reader who asked for dark falls back to :root above, which is already dark.

   **--accent is #0c7f68 here and #3fd6b7 above, and that difference is the one correction this
   unit made to the artboard.** The artboard declares two accent tokens - a vivid one it paints
   buttons and rings with, and a darkened one it sets accent *text* in - and leaves the vivid one
   unchanged in light. This sheet has had one accent role since ADR-0115 and it carries both jobs:
   a { color: var(--accent) } and :focus-visible { outline: 2px solid var(--accent) }. Left
   vivid, the ring measured **1.76:1** against light paper where WCAG 1.4.11 owes a non-text
   indicator 3:1 - keyboard focus invisible on a light system. The value taken is the artboard's own
   darkened one, so the fix introduces no colour the owner did not choose: the ring is **4.76:1** and
   a link clears 4.5:1 on paper. What it does not clear is 4.5:1 on wash and card - 4.47 and 4.22 -
   and that is the artboard's value, recorded in ADR-0176 rather than changed here. */
@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    --paper: #fafbfb; --wash: #f2f4f4; --card: #e9eeee; --rule: #e3e8e9; --edge: #cfd7d8;
    --ink: #151a1b; --body: #5b6569; --dim: #636d71;
    --accent: #0c7a64; --target: #e7f3f1;
  }
}
:root[data-theme='light'] {
  --paper: #fafbfb; --wash: #f2f4f4; --card: #e9eeee; --rule: #e3e8e9; --edge: #cfd7d8;
  --ink: #151a1b; --body: #5b6569; --dim: #636d71;
  --accent: #0c7a64; --target: #e7f3f1;
}
/* Two rules that carry no colour, so the button cannot introduce one. They exist so that a reader
   who has overridden their system gets form controls, scrollbars and a caret on the same side of the
   page as the palette. */
:root[data-theme='light'] { color-scheme: light }
:root[data-theme='dark'] { color-scheme: dark }
* { box-sizing: border-box }
/* A full-bleed column: one gutter, the page, the same gutter, and the two elements that lay
   themselves out span the whole width. It is one declaration rather than a wrapper on every page.

   The middle track used to stop at two measures, which is a width stated in characters - and a width
   stated in characters is the thing this site no longer has. What is left is the viewport and the
   gutter, so the page is as wide as the screen at every width. The gutter is half the spacing step
   the ceiling used to subtract, so the narrow end of the range is unmoved: at 390 the content was
   335px before this rule changed and is 335px after it. ADR-0134. */
/* align-content: start, and it is a repair rather than a tidiness. A grid with vertical free
   space stretches its auto rows into it, so on any page shorter than the window the masthead
   grows: measured at 1440 on the front page, 247px instead of 56, and growing with the screen
   because a wider screen makes a shorter page. Every page of this site had been taller than the
   window until one became a door, which is why nothing had ever seen it. It is a no-op wherever
   there is no free space, which is every other page. ADR-0140. */
body {
  display: grid; align-content: start;
  grid-template-columns: var(--s5) minmax(0, 1fr) var(--s5);
  margin: 0; padding: 0 0 var(--s24);
  font: var(--t3)/var(--the-line) var(--sans); color: var(--body); background: var(--paper);
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
h1, h2, h3, h4 { color: var(--ink) }
h1 { font-size: var(--t1); font-weight: 600; letter-spacing: -.02em; margin: 0 0 var(--s3) }
/* A page whose title is a direct child of the body has no card and no main to stand it off the
   masthead, and measured in a browser the two were touching at a gap of 0. */
body > h1 { margin-top: var(--s10) }
h2 {
  font-size: var(--t3); font-weight: 600; margin: var(--s12) 0 0;
  padding-top: var(--s4); border-top: 1px solid var(--rule);
}
h3, h4 { font-size: var(--t4); font-weight: 600; margin: var(--s8) 0 0 }
h2 + p, h2 + ul, h3 + p, h4 + p { margin-top: var(--s3) }
p { margin: 0 0 var(--s4) }
code, pre { font-family: var(--mono); font-size: .875em }
/* As wide as its longest line, which is what keeps a code block from being an empty box with a
   border: measured at 2 183px around a 356px signature. Past what is available it folds where the
   language allows and scrolls only where it does not - a signature has break points and a digest
   has none, so pre-wrap takes the first and normal protects the second. The header carries the
   argument and what it was measured against. ADR-0135. */
pre {
  margin: 0 0 var(--s4); padding: var(--s3) var(--s4); overflow-x: auto; width: fit-content; max-width: 100%;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 6px; color: var(--ink);
  white-space: pre-wrap; overflow-wrap: normal;
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
/* A contract's name is set in the face the registry addresses everything in, wherever it is
   written. It was the only place on this site where one was not: the card's title, the column
   beside a page and the front page's catalogue are all mono, and a domain page's list was sans -
   so the same name read as two different kinds of thing depending on which page you were on. */
.call { display: block; margin: 0 0 var(--s2); border-top: 0; padding-top: 0 }
h2.call, h3.call { font-family: var(--mono); font-weight: 500 }
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

/* The front page's catalogue: a domain says what it holds and the names are the list.

   The domain is a label and the names are the matter, which is the opposite of how this read when
   the two were both headings with a link in them - a reader met nine equal entries and could not
   tell a domain from a contract. So the heading takes the eyebrow this site already uses for a
   column's label, and the names take the mono face the registry addresses everything else in.

   The floor is --aside, the shortest line this palette declares. A column of one-word names is the
   one place on this site where that bound is a floor rather than a ceiling, and it is a declared
   length rather than a width chosen for a list. */
h3.domain {
  margin: var(--s8) 0 var(--s3); font-size: var(--t6); font-weight: 400;
  letter-spacing: .09em; text-transform: uppercase; color: var(--dim);
}
main > h3.domain:first-of-type { margin-top: var(--s5) }
ul.names {
  list-style: none; padding: 0; margin: 0;
  display: grid; gap: var(--s2) var(--s10);
  grid-template-columns: repeat(auto-fit, minmax(min(var(--aside), 100%), 1fr));
}
ul.names a { font-family: var(--mono); font-size: var(--t4) }
/* The one word a reader needs before they click, in the colour that is not a verdict. */
ul.names li { color: var(--dim); font-size: var(--t5) }

.masthead {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--s6);
  padding: var(--s3) var(--s6); margin: 0; border-bottom: 1px solid var(--rule);
  position: sticky; top: 0; z-index: 20; background: var(--paper);
}
/* The one word on this site that may not be broken, and the body's own rule was breaking it: with
   anywhere a word's min-content is one character, so a flex row squeezed the name to nothing.
   ADR-0135. */
.wordmark { margin: 0; font-family: var(--mono); font-size: var(--t3); color: var(--ink); overflow-wrap: normal }
.wordmark a { color: var(--ink); text-decoration: none }
/* Two gaps and not one: side by side these are three destinations and need telling apart, stacked
   they are one list. It is also what the bar costs a phone, the menu being what decides the
   masthead's height and never the wordmark. ADR-0135. */
ul.menu {
  display: flex; flex-wrap: wrap; gap: var(--s2) var(--s5);
  list-style: none; padding: 0; margin: 0 0 0 auto; font-size: var(--t5);
}
ul.menu a { color: var(--body); text-decoration: none }
ul.menu a:hover { color: var(--accent) }
ul.menu .here { color: var(--dim) }

/* The theme override, which is empty until a script fills it and is therefore a box with no size
   of its own. It is styled as the search field is styled - the same hairline, the same rule colour -
   because it sits beside it and the two are the only controls the masthead has. The word inside is
   set in the mono face for the reason every other one-word control on this site is: it is a token
   and not a sentence.

   The button is served by nobody. A reader with no JavaScript meets this element empty, which is
   what the slot is for, and gets their theme from prefers-color-scheme instead. ADR-0176. */
.masthead .theme { display: flex; align-items: center }
.theme-button {
  font: inherit; font-family: var(--mono); font-size: var(--t6); line-height: var(--the-line);
  color: var(--body); background: var(--paper);
  border: var(--the-hairline) solid var(--rule); border-radius: 6px;
  padding: 0 var(--s2); cursor: pointer;
}
.theme-button:hover { color: var(--ink); border-color: var(--edge) }

/* The field is a phrase and never a paragraph, so it is the shortest line this palette declares -
   a length already argued for as one somebody reads across, rather than a width chosen for a box.
   It grows to that and stops, which leaves the menu where it was. ADR-0137. */
.masthead .search { position: relative; flex: 1 1 var(--the-query-field); max-width: var(--aside); min-width: 0 }
.masthead .search input {
  width: 100%; font-family: var(--mono); font-size: var(--t5); line-height: var(--the-line);
  color: var(--ink); background: var(--paper); border: var(--the-hairline) solid var(--rule);
  padding: var(--s) var(--s2);
}
/* The accent means *you can act on this*, which is exactly what a focused field is. ADR-0115. */
.masthead .search input:focus-visible { outline: none; border-color: var(--accent) }
.masthead .search input::placeholder { color: var(--dim) }

/* A panel over the page rather than in it: the masthead is sticky, so results that pushed the
   document down would move the text a reader was reading. Its ceiling is the room under the bar and
   not a number - the bar's own height, taken off the viewport, with one gap left below. */

/* Empty is the closed state, and it is the whole of the closed state - there is no second way to
   hide this box. It is where the panel is when nobody is searching, which for most readers of most
   pages is always. The rule is old and did nothing for its whole life, because the script filled the
   panel as it built it; start.ts now empties it, and that is what makes this line load-bearing
   rather than decorative. */
.answers:empty { display: none }
.answers {
  position: absolute; top: calc(100% + var(--s)); left: 0; right: 0; z-index: 30;
  max-height: calc(100vh - var(--the-sticky-bar) - var(--s6)); overflow-y: auto;
  background: var(--paper); border: var(--the-hairline) solid var(--rule); padding: var(--s2);
}
.answers .why { font-size: var(--t5); color: var(--dim); margin: 0 0 var(--s2) }
.answers .why:last-child { margin-bottom: 0 }
ul.examples { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: var(--s) }
ul.examples button {
  font-family: var(--mono); font-size: var(--t5); color: var(--body);
  background: none; border: var(--the-hairline) solid var(--rule); padding: var(--s) var(--s2); cursor: pointer;
}
ul.examples button:hover { color: var(--accent); border-color: var(--accent) }
/* A result is one target and not three, so it is a block link with its parts stacked inside it. */
a.answer { display: block; text-decoration: none; padding: var(--s2); color: var(--body) }
a.answer:hover { background: var(--wash) }
a.answer .name { display: block; font-family: var(--mono); font-size: var(--t5); color: var(--ink) }
a.answer .summary { display: block; font-size: var(--t5); color: var(--body) }
a.answer .mark { display: block; font-size: var(--t6); color: var(--dim) }

/* A label a screen reader hears and a sighted reader does not, which is what the field's own
   placeholder cannot be: a placeholder disappears the moment somebody types. */
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap;
}

/* The column is placed by the grid and never by source order, because the two answer different
   questions. A reader on a phone gets the page and then the navigation; a reader on a laptop gets the
   navigation on the left of it. Placing it puts the content first in the DOM, which is what a screen
   reader announces and what a text projection reads, and CSS order would have made those two disagree. */
/* One shell and three arrangements, each asked for by what the page actually holds rather than by a
   class the page remembers to carry. A shell with a table of contents has a column on both sides of
   the content; one with a column of secondary matter has it on the right; one with neither has the
   navigation and the content.

   None of the three has a ceiling. Each carried one until ADR-0134 - its own tracks and gutters added
   up, which was honest arithmetic over a term stated in characters - and the term is gone, so what
   bounds every arrangement at every width is the viewport. Narrow is one column and never had a
   ceiling to give. ADR-0123, ADR-0134. */
.shell { display: grid; grid-template-columns: minmax(0, 1fr); width: 100% }
/* The container a settled case reads its own width from. Named rather than anonymous, so the
   query below says which box it is asking about and a second container added later cannot
   silently answer for this one. */
main { container-type: inline-size; container-name: the-page; min-width: 0 }
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
/* **A certificate head and not a panel.** The card is ruled at the top, sits on the paper, and puts
   the three figures in a strip under the identity rather than a column beside it. What a contract
   page is - a measurement, stated with its method and bound to a digest - is a document with a
   rule across it, and a rounded box on a tinted ground says panel.

   The arrangement above was two halves side by side, and the reading that produced it is kept in the
   comment above because it was right about the void it was fixing. What replaced it is not a wider
   card: it is a card that stops competing with the prose under it for the reader's first look. */
.card {
  display: grid; gap: var(--s6);
  border: 0; border-top: 2px solid var(--ink); border-radius: 0; background: none;
  padding: var(--s5) 0 0; max-width: 100%;
}
/* The half that carries a signature grows and the half that carries three numbers does not: a pre
   does not wrap at any width, so a signature in the narrow half is a signature a reader scrolls.
   Measured on number/parse@1 at 1440 with the two halves even: 455px of type in a 422px box. */
.card > .identity { display: grid; gap: var(--s5); min-width: 0 }
/* A datasheet strip: what lands on a reader's disk, ruled top and bottom and read across. The
   registry that leads this distribution model does not state this at all, so it is the one figure
   on the page that nobody else offers - which is why it stopped being secondary matter in a column. */
.card > .figures {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--a-figure)), 1fr));
  border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); min-width: 0;
}
/* No bottom margin: the identity is a grid and its gap is what separates these. A shorthand here
   adds to the gap instead of replacing it, which is the trap this stylesheet already names four
   times above - it cost 20px between the address and the title the first time the card became a
   grid. */
.address { margin: 0; font-size: var(--t5); color: var(--dim) }
/* The mono face names what the registry addresses - a contract, a command, a value - and never a
   sentence. A contract page's title is a function's name; "Nothing is served at this address" is not. */
.card h1 { font-family: var(--mono); font-weight: 700; margin: 0 }
/* The ceiling is only what the card's is: the block is as wide as its own command, which the rule
   over every pre already says, and 44ch was a guess at the longest one. It is restated because it is
   more specific than that rule, and 44ch left the block 34px past a 390 viewport once the card
   stopped handing it a width. */
/* The command folds inside its own half of the row and the control keeps its place beside it, at
   every width - nothing here wraps the row. anywhere and not the pre rule's normal, because a
   command is not a signature: its longest token is an address a reader has to be able to read and
   copy in full, and a line break inserts no character. ADR-0135. */
/* **The one thing on this page a reader can act on, and the only thing carrying the accent.**
   ADR-0115 gives the accent two meanings and this is the first of them. It is the largest monospace
   on the page, on a wash, behind a heavy left edge - none of which the signature has, because the
   two were the same shape in the same box and a visitor arriving from a search could not tell which
   of them to run. */
pre.install {
  display: flex; align-items: center; gap: var(--s4);
  background: var(--target); border: 1px solid var(--accent); border-left-width: var(--s2);
  padding: var(--s4) var(--s5); color: var(--ink);
  max-width: 100%; font-size: var(--t3); overflow-wrap: anywhere;
}
/* A field of a card and never a section of the page: it names what the block under it is, which is
   what tells the command from the signature before either is read. A heading here would be a rail
   entry pointing at nothing. */
.label {
  margin: 0; font-size: var(--t6); letter-spacing: .09em; text-transform: uppercase; color: var(--dim);
}
.get, .sig { display: grid; gap: var(--s2); min-width: 0 }
/* The label on the left and the choice on the right, on one baseline. The row wraps rather than
   squeezing, because four manager names beside a word is the first thing to run out of room. */
.get-head { display: flex; align-items: baseline; gap: var(--s4); flex-wrap: wrap }
ul.managers { display: flex; gap: var(--s3); list-style: none; margin: 0 0 0 auto; padding: 0 }
/* The chosen one is marked by the accent under it, which is *you are here* - the second of the two
   things ADR-0115 lets the accent mean, and the same mark the catalogue column already uses. */
ul.managers button {
  font-family: var(--mono); font-size: var(--t6); letter-spacing: .04em;
  color: var(--dim); background: none; border: 0; border-bottom: 2px solid transparent;
  padding: 0 0 1px; cursor: pointer;
}
ul.managers button:hover { color: var(--body) }
ul.managers button[aria-pressed='true'] { color: var(--ink); border-bottom-color: var(--accent) }
/* Struck through and legible rather than dimmed away: a way that does not run is published, and a
   reader has to be able to read both the name and the reason under it. */
ul.managers button[data-refused] { text-decoration: line-through }
p.refusal { margin: 0; font-size: var(--t5); color: var(--dim) }
/* As wide as its own label and never narrower: a control is not text that reflows. Left to shrink
   it took the command's anywhere and offered a reader cop over y. */
pre.install .copy {
  flex: none;
  margin-left: auto; border: 0; border-left: 1px solid var(--edge); background: none;
  padding: var(--s2) 0 var(--s2) var(--s4); font: inherit; font-size: var(--t5);
  color: var(--dim); cursor: pointer;
}
pre.install .copy:hover { color: var(--accent) }
/* What a reader reads rather than runs, so it takes the frame off instead of putting one on: no
   ground, no border, one hairline under it. The distance from the command above is the whole point -
   they carry the same face and must not carry the same weight. */
pre.answer {
  margin: 0; padding: 0 0 var(--s3); background: none;
  border: 0; border-bottom: 1px solid var(--rule); border-radius: 0;
  font-size: var(--t4);
}
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

   It carried a ceiling of two measures until ADR-0134, and the sentence that argued it is the whole
   of why it is gone: at 2 560 the four cards stood alone in a row 1 892px wide while nothing else on
   the page passed 950. What made them stand alone was the page being capped and this block not; with
   the cap gone the complaint has no subject, and a ceiling whose argument has been withdrawn is a
   length nobody is deriving any more. */
.use-cases {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  gap: var(--s4); margin: 0 0 var(--s4);
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
/* A row whose halves are an identifier and an argument, and which does NOT become two columns.

   Measured at 1440 over the method page's hundred rows, three ways: committed, 283 prose lines
   over 75 characters at 25 192px; stacked with the argument bounded, 88 at 35 640; and as a case
   row of two columns, 88 at 41 402. **The columns buy nothing here** - the same reading for 5 762px
   more - because the left half is one short identifier against a paragraph, so half the width
   carries no height. On a contract page the left half is a call, often folding to several lines,
   and there the columns pay. Same shape, opposite answer, and only the data says which.

   The whole of the gain is that the argument is a cell with a width, which it already had.
   ADR-0139. */
.stacked { padding: var(--s3) 0; border-top: 1px solid var(--rule) }
.case {
  display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s2) var(--s10);
  padding: var(--s5) 0; border-top: 1px solid var(--rule);
}
.case:target { background: var(--target); box-shadow: 0 0 0 var(--s3) var(--target); border-radius: 2px }
.what { min-width: 0 }
.what .call { margin: 0 0 var(--s2) }
.what code { color: var(--ink); line-height: 1.55; overflow-wrap: anywhere }
.case-id { margin: 0; font-size: var(--t6) }
.case-id a { font-family: var(--mono); color: var(--dim); text-decoration: none }
.case-id a:hover { color: var(--accent) }
/* The argument is a cell of a table and a cell has a width, which is what makes it a column. It
   carries this one whether the row is split or stacked, so a reader gets the same line either side
   of the threshold below - without it, the stacked row let an argument fill the content column and
   read 114 characters at 1024.

   Nothing here bounds a line of page prose: ADR-0134 removed that and it stays removed. */
.argument { max-width: var(--measure) }
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
/* A call and what it answered, which is the settled cases' own content arriving live - so it breaks
   where they break rather than where a pre does. The two were rendering one shape and wrapping two
   ways. */
#playground pre { margin: 0; background: var(--paper); border-color: var(--edge); overflow-wrap: anywhere }

/* The wider of the two arrangements below:
     main | aside   --measure + --s6 + --aside + 2 * --s6  = 49.14rem
     beside | main  --rail + --s6 + --measure + 2 * --s6   = 47.40rem
   The header says what a media query can and cannot evaluate. */
@media (min-width: 50rem) {
  .shell { gap: var(--s6); padding: 0 var(--s6) }
  main { padding: var(--s10) 0 0 }

  /* Where you are in the catalogue, and then the page. */
  .shell:has(.beside) { grid-template-columns: var(--rail) minmax(0, 1fr) }
  .shell:has(.beside) .beside { grid-area: 1 / 1 }
  .shell:has(.beside) main { grid-area: 1 / 2 }

  /* The page, and then what a reader may skip. */
  .shell:has(.aside) { grid-template-columns: minmax(0, 1fr) var(--aside) }
  .shell:has(.aside) main { grid-area: 1 / 1 }
  .shell:has(.aside) .aside { grid-area: 1 / 2 }

  .beside, .aside { position: sticky; top: var(--s12); align-self: start }
  .aside { padding: var(--s10) 0 0 var(--s6); border-left: 1px solid var(--rule) }
  .beside { padding: var(--s10) 0 0 }
}

/* --rail + --s6 + (2 * --measure + --s10) + --s6 + --aside + 2 * --s6 = 96.04rem.
   The value did not move; what came back is its arithmetic. The header says how. */
@media (min-width: 97rem) {
  .shell:has(.rail) { grid-template-columns: var(--rail) minmax(0, 1fr) var(--aside) }
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
/* The row's own two tracks and the gutter between them:
     2 * --measure + --s10 = 58.30rem, rounded DOWN to 58.
   The header says why this is a container query and why the rounding goes that way. */
@container the-page (min-width: 58rem) {
  /* Two measures and not a measure beside whatever is left. The second track was 1fr, so the
     argument grew with the screen and read 354 characters at 2560 - which is an artefact rather
     than a reading, on the half of this page a reader actually reads.

     The width was arrived at twice and the two agree to a pixel. Measured in a browser over the 41
     arguments of string/slugify@1 at 1920, the widest column at which no argument line exceeds 75
     characters is 28rem, or 448px; --measure, which is this stylesheet's own 75 characters taken
     through its declared density and drift, resolves to 447px. So the row is symmetric by
     construction rather than by a constant somebody chose for the right-hand side. */
  .case { grid-template-columns: minmax(0, var(--measure)) minmax(0, var(--measure)) }
}

/* --- The front page, implemented from the artboard. Every length below is the design's own, and
       where one is not, ADR-0182 says which and why.

       The bar, the hero and the grid all sit in a 1100px column with a 24px gutter - the artboard's
       one measurement that repeats, and the reason the front page is wider than the prose pages: a
       grid of cards is not a column of text and the measure has no opinion about it. --- */

.masthead {
  position: sticky; top: 0; z-index: 40;
  border-bottom: 1px solid var(--rule);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; gap: var(--s4);
  max-width: var(--the-page); margin: 0 auto; padding: 0 var(--s6); height: 56px;
}
/* The four squares and the name, on one baseline. The mark takes the accent on one quarter, which is
   the second thing ADR-0115 lets the accent mean and the only decoration on this site. */
.masthead .wordmark { margin: 0; font-family: var(--mono); font-size: 16px; font-weight: 600; letter-spacing: -.02em }
.masthead .wordmark a, .masthead .wordmark > span {
  display: flex; align-items: center; gap: 9px; color: var(--ink); text-decoration: none;
}
.mark { flex: none }
.mark .quiet { fill: currentColor; opacity: .32 }
.mark .lit { fill: var(--accent) }
/* The bar pushes everything after the wordmark to the right, which is the artboard's spacer div
   expressed as a margin rather than as an empty element carrying no content. */
.masthead .search { margin-left: auto }
.masthead ul.menu { display: flex; align-items: center; gap: 2px; list-style: none; margin: 0; padding: 0 }
.masthead ul.menu li { padding: 0; border: 0 }
.masthead ul.menu a, .masthead ul.menu .here {
  display: block; font-size: 13.5px; color: var(--body);
  padding: var(--s2) var(--s3); border-radius: 6px; text-decoration: none;
}
.masthead ul.menu a:hover { color: var(--ink); text-decoration: none }
.masthead ul.menu .here { color: var(--dim) }

main.shelf { display: block; padding: 0 }

/* The opening: centred, in a column narrower than the grid under it, so the headline and the sentence
   read as one block rather than spanning the page. */
.hero { max-width: var(--the-opening); margin: 0 auto; padding: 72px var(--s6) 0; text-align: center }
/* Forty pixels, which is a seventh step this scale did not have. ADR-0115 declared six sizes and no
   seventh on the argument that a page needing one more has stopped distinguishing and started
   decorating - and a landing headline is a register the six do not carry: --t1 is 26px and is the
   title of a contract page, which is a different job on a different page. ADR-0182 records the
   overruling with its scope, which is this one element. */
.hero h1 {
  font-size: 40px; line-height: 1.14; font-weight: 600; letter-spacing: -.03em;
  margin: 0 0 14px; text-wrap: pretty; color: var(--ink); font-family: var(--sans);
}
.hero .lede {
  font-size: 16px; color: var(--body); margin: 0 auto 30px; line-height: 1.55;
  max-width: var(--the-lede-line); text-wrap: pretty;
}
/* The field is built into this by start.ts and the box is drawn here, so that what a reader sees is
   the artboard's control rather than a browser's default input. */
.hero .find { position: relative; text-align: left }
.hero .find input {
  width: 100%; height: 54px; padding: 0 66px 0 var(--s6);
  background: var(--wash); border: 1px solid var(--edge); border-radius: 8px;
  color: var(--ink); font: inherit; font-size: 15.5px;
  transition: border-color .15s, box-shadow .15s;
}
.hero .find input::placeholder { color: var(--dim) }
.hero .find input:focus-visible {
  outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--target);
}
.hero .sifted { margin: var(--s3) 0 0; font-size: var(--t6); color: var(--dim); text-align: left }
.hero .sifted:empty { display: none }

/* The domains, as ways into the part of the catalogue filed under each. */
.chips {
  display: flex; flex-wrap: wrap; gap: var(--s2); justify-content: center;
  margin: 18px 0 0; padding: 0; list-style: none;
}
.chips li { padding: 0; border: 0 }
a.chip {
  display: inline-block; font-family: var(--mono); font-size: 12px;
  padding: 5px 11px; border-radius: 6px; text-decoration: none;
  border: 1px solid var(--rule); background: var(--wash); color: var(--body);
  transition: border-color .15s, color .15s;
}
a.chip:hover { border-color: var(--edge); color: var(--ink); text-decoration: none }
a.chip .count { opacity: .55; margin-left: var(--s) }

.listing { max-width: var(--the-page); margin: 0 auto; padding: 52px var(--s6) 20px }
.recent { max-width: var(--the-page); margin: 0 auto; padding: 16px var(--s6) 48px }
/* The label over a list, which is the artboard's one heading style on this page: small, spaced,
   upper case, and the colour of secondary matter. */
.listing h2, .recent h2 {
  font-size: 12.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  color: var(--body); margin: 0 0 14px;
}
.recent h2 { margin-bottom: 10px }

/* As many cards abreast as a 300px floor allows, which is what puts three on a 1100px column and one
   on a phone with no width written anywhere. */
.offers {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--a-card)), 1fr)); gap: 12px;
  margin: 0; padding: 0; list-style: none;
}
.offers > li {
  display: flex; flex-direction: column; gap: 8px;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 8px;
  padding: 14px 16px 12px; min-width: 0;
  transition: border-color .15s;
}
.offers > li:hover { border-color: var(--edge) }
.offers .head { display: flex; align-items: center; gap: 8px; min-width: 0 }
.offers .named { margin: 0; flex: 1; min-width: 0 }
.offers ul.marks { display: flex; align-items: center; gap: 8px; list-style: none; margin: 0; padding: 0; flex: none }
.offers ul.marks li { padding: 0; border: 0 }
.offers a.call {
  font-family: var(--mono); font-size: 13.5px; font-weight: 500;
  flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--ink); text-decoration: none;
}
.offers a.call:hover { text-decoration: underline }
.offers a.call .of { color: var(--body) }
/* The mark and the language, which say what is frozen and in what. Neither is a link and neither is
   a status the accent may carry - the accent here is the frozen mark's own ground, which is the one
   place ADR-0115 lets it mean this is settled rather than you can act. */
.offers .stable {
  display: flex; align-items: center; gap: 4px; flex: none;
  font-size: 10.5px; font-weight: 500; color: var(--accent);
  background: var(--target); border-radius: 4px; padding: 2px 6px;
}
.offers .language {
  flex: none; font-family: var(--mono); font-size: 10.5px; color: var(--body);
  border: 1px solid var(--edge); border-radius: 4px; padding: 1px 5px;
}
/* A signature is one line a reader reads as a whole, so it is clipped rather than wrapped - the rule
   ADR-0135 wrote for a block narrower than its content, applied where the design asks for one line. */
.offers .shape {
  display: block; font-family: var(--mono); font-size: 12px; color: var(--body);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
}
/* Two lines and then an ellipsis, which is what keeps every card the same height in a row. */
.offers .why {
  margin: 0; font-size: 12.5px; color: var(--body); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.offers .install {
  display: flex; align-items: center; gap: 8px;
  margin: 2px 0 0; padding: 9px 0 0; border-top: 1px solid var(--rule);
  background: none; border-radius: 0; color: var(--dim);
  font-family: var(--mono); font-size: 11px; overflow-wrap: anywhere; min-width: 0;
}
.offers .install .copy {
  margin-left: auto; flex: none;
  font-family: var(--mono); font-size: 11px;
  background: var(--card); border: 1px solid var(--rule); border-radius: 5px;
  padding: 3px 8px; color: var(--body); cursor: pointer;
  transition: color .15s, border-color .15s;
}
.offers .install .copy:hover { color: var(--ink); border-color: var(--edge) }

/* One rule between rows and none around them, which is what a list of four reads as when it is a
   table of arrivals rather than a set of cards. */
.recent-rows {
  display: flex; flex-direction: column;
  border: 1px solid var(--rule); border-radius: 8px; overflow: hidden;
  margin: 0; padding: 0; list-style: none;
}
.recent-rows li { padding: 0; border: 0 }
.recent-rows li + li a.row { border-top: 1px solid var(--rule) }
a.row {
  display: flex; align-items: center; gap: 14px; padding: 11px 16px;
  background: var(--wash); color: var(--ink); text-decoration: none;
  transition: background .15s; min-width: 0;
}
a.row:hover { background: var(--card); text-decoration: none }
a.row .call { margin: 0; font-family: var(--mono); font-size: 13px; font-weight: 500; min-width: var(--a-name-in-a-row); flex: none }
a.row .shape {
  margin: 0; flex: 1; min-width: 0; font-family: var(--mono); font-size: 12px; color: var(--body);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
a.row .when { margin: 0; font-size: 12px; color: var(--dim); white-space: nowrap; flex: none }

/* The three arguments, ruled off from the catalogue above them. */
.why {
  border-top: 1px solid var(--rule);
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--aside)), 1fr)); gap: 28px;
  max-width: var(--the-page); margin: 0 auto; padding: 40px var(--s6) 44px;
}
.why h3 { font-size: 14.5px; font-weight: 600; margin: 0 0 6px; color: var(--ink) }
.why p { font-size: 13px; color: var(--body); line-height: 1.6; margin: 0 }

/* Not on the artboard, and here because no page is removed in this unit: a page nothing links to is
   one every-page-is-reachable-from-the-front-page refuses. ADR-0182. */
.elsewhere {
  max-width: var(--the-page); margin: 0 auto; padding: 0 var(--s6) 48px;
  font-size: var(--t6); color: var(--dim);
}
`.trim()
