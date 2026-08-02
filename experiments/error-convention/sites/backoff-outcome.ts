/**
 * Experiment material - what site 9 produces, declared once so that the three forms return exactly
 * the same thing.
 *
 * This is the site where one reason is recoverable and the other five are a programming error, which
 * is the shape that makes the reason load-bearing rather than decorative: capping a retry that has
 * run past the end of the representable range is correct, and capping one whose duration was never a
 * whole number would hide the defect behind a plausible date.
 */

export type BackoffOutcome =
  | { readonly kind: 'retry-at'; readonly at: Date }
  | { readonly kind: 'capped'; readonly at: Date }

/** The last instant a `Date` can hold, the ceiling a run of retries is pinned to. */
export const LAST_REPRESENTABLE = new Date(8.64e15)
