/**
 * The one face this site serves, and the address it is served at.
 *
 * ADR-0176 decides that the prose is set in Geist and the monospace is not. The argument is in that
 * record and the measurement that settled it is worth repeating here, because this file is where
 * somebody will come to add a second face: **Geist Mono is served in no subset that carries U+2192**,
 * the arrow between every call and its answer, of which the emitted tree holds 241 across the six
 * published contract pages. ADR-0115 refused IBM Plex Mono for exactly that, named the condition that
 * would reopen it - *a monospace face that renders U+2192 and the scripts this catalogue settles
 * cases on* - and Geist Mono fails it on the first term. Adding one here sets a monospace run in two
 * faces at two advance widths, mid-line, on every settled case of the catalogue.
 *
 * ---------------------------------------------------------------------------
 * Why the address carries the digest
 * ---------------------------------------------------------------------------
 *
 * `cachePolicyFor` derives a policy from the addressing class and from nothing else, and a font is the
 * clearest `content-addressed` answer this tree has: its bytes never change, because different bytes
 * are a different digest and therefore a different address. So it is held for a year and marked
 * immutable, and staleness is not a thing that can happen to it rather than a thing a header asks a
 * browser not to do. Named, it would have been served `max-age=0, must-revalidate` - a round trip on
 * every page load for a file that has never differed from itself.
 *
 * That is the shape ADR-0170's open entry names for the browser modules and does not take. It is
 * taken here because a font arriving at a named address would have been the second file in this tree
 * whose freshness nobody decided, and one is already an entry.
 *
 * ---------------------------------------------------------------------------
 * Why the reference is root-anchored, which nothing else in a page is
 * ---------------------------------------------------------------------------
 *
 * Every href a page writes is composed by `rootFrom`, so a page four folders down says `../../../../`
 * and a walk over the tree cannot be confused with a walk over the source. **The stylesheet cannot do
 * that**, because there is one of it: `THE_SERVED_STYLESHEET` is a single string inlined into all
 * eight files of HTML, and a `url()` inside it resolves against the *page* rather than against a
 * stylesheet, so one relative spelling would mean seven different addresses. **Eight and seven are
 * not one number stated twice**: the front page and the 404 share a folder, so they would share the
 * address a relative spelling produced, and the other six sit one per contract. Both read
 * *seventeen* until ADR-0195 measured them, which is one stale figure standing for two quantities
 * that were never equal.
 *
 * The alternatives were both refused rather than overlooked. A per-page stylesheet makes `toHtml` take
 * a path it has never needed and writes the face eight times. A `data:` URI costs 39 200 B in
 * every page - 314 kB across the tree - which is twelve times what ADR-0141 removed from the sheet
 * and paid by every reader on every page.
 *
 * What it assumes is that the tree is served from the root of an origin, which `_headers` has assumed
 * since ADR-0170 - every pattern in it begins with `/`. A deployment under a subpath would break this
 * reference and that file together.
 */

import { digestOfBytes } from '../registry/canonical.js'
import { GEIST_LATIN_WOFF2_BASE64 } from './geist.js'

/** The face, decoded once. */
export const THE_FONT_BYTES: Buffer = Buffer.from(GEIST_LATIN_WOFF2_BASE64, 'base64')

/**
 * The first segment the font is served under, which is what `served-headers.ts` turns into a rule.
 *
 * A space of its own rather than a file at the root: `theRuleCovering` gives an address with no
 * segment above it an exact rule and anything deeper a splat, and a second face - or the same face at
 * a second digest, which is what an upgrade is - would otherwise need a second rule written by hand.
 */
export const THE_FONT_SPACE = 'font'

/**
 * Where the face is served, digest and all.
 *
 * Derived from the bytes rather than transcribed beside them, so that replacing the face and moving
 * the address are one event. A digest written down here would be a second statement of what the file
 * is, and the first time the two disagreed the tree would serve one file at another file's address -
 * for a year, marked immutable.
 */
export const THE_FONT_ADDRESS = `${THE_FONT_SPACE}/${digestOfBytes(THE_FONT_BYTES)}.woff2`

/**
 * What the prose is set in, and what renders it where the face has not arrived or is not wanted.
 *
 * The stack behind Geist is the one this site used before it had a face at all, unchanged: it is what
 * a reader sees for the width of one download, and what they keep if the download never lands.
 */
export const THE_SANS_STACK = `Geist, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`

/**
 * The declaration that fetches it.
 *
 * `font-display: swap` and not `optional`, which is a choice about who the first visit is for. Both
 * avoid a blank page; `optional` also avoids the reflow, by declining to use a face that has not
 * already arrived - so a first-time reader would meet the system stack and the design would be
 * something only returning readers see. The face is 29 400 B, same-origin, and inlined CSS discovers
 * it at parse, so what `swap` costs is one reflow on a first visit and nothing afterwards.
 *
 * `font-weight: 100 900` because the file is variable over that whole axis - measured, asking Google
 * for the four weights the design names and asking for the axis return one address - so the four the
 * design uses are four instances of one download rather than four downloads.
 *
 * There is deliberately no `<link rel="preload">`. It would be a second element in the head, and the
 * head carrying exactly one link is the half of `a-page-loads-nothing-and-runs-nothing` that refuses
 * W-24 - the stylesheet moved out into a file. Preloading would buy one round trip and give up the
 * guard that keeps the sheet in the page. ADR-0115 named that trade; this declines it.
 */
export const THE_FONT_FACE = `@font-face {
  font-family: Geist;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(/${THE_FONT_ADDRESS}) format('woff2');
}`
