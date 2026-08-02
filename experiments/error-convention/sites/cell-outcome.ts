/**
 * Experiment material - the outcome type site 3 produces, declared once so that both arms return
 * exactly the same thing. Writing it twice would put four identical lines into each measurement and
 * measure the type declaration instead of the unwrapping.
 */

export type CellOutcome =
  | { readonly kind: 'value'; readonly value: number }
  | { readonly kind: 'blank' }
  | { readonly kind: 'invalid' }
