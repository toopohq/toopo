/**
 * Experiment material - the outcome type site 5 produces, declared once so that both arms return
 * exactly the same thing. The caller has to tell the two failures apart: a retention window nobody
 * can read is a configuration mistake, while an expiry outside the representable range is a request
 * nobody can answer.
 */

export type ExpiryOutcome =
  | { readonly kind: 'ok'; readonly date: Date }
  | { readonly kind: 'unreadable-retention' }
  | { readonly kind: 'out-of-range' }
