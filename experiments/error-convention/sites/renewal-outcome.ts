/**
 * Experiment material - the outcome the four-link chain produces, declared once so that the three
 * forms return exactly the same thing. Writing it three times would put five identical lines into
 * each measurement and measure the type declaration instead of the unwrapping.
 *
 * Four failure kinds because the chain has four links and a caller who is told only "it failed"
 * cannot act: an unreadable trial length is a form to correct, a trial end outside the range is a
 * request nobody can answer.
 */

export type RenewalOutcome =
  | { readonly kind: 'ok'; readonly renewsAt: Date }
  | { readonly kind: 'unreadable-trial' }
  | { readonly kind: 'trial-out-of-range' }
  | { readonly kind: 'unreadable-grace' }
  | { readonly kind: 'grace-out-of-range' }
