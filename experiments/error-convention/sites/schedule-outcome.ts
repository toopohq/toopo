/**
 * Experiment material - what site 7 produces, and the message it produces for each reason, declared
 * once so that the three forms return exactly the same thing. Writing the map three times would put
 * eight identical lines into each measurement and measure the map instead of the unwrapping.
 *
 * Six reasons and four messages: the two totals that cannot be represented exactly are one thing to
 * a person filling in a form, and so are the two ways a field can fail to be a whole number. That
 * matters to the measurement rather than to the wording - a form that needed only "it worked" or "it
 * did not" would be a site that does not need a reason, and this experiment already has six of
 * those.
 */

export type ScheduleOutcome =
  | { readonly kind: 'scheduled'; readonly runsAt: Date }
  | { readonly kind: 'rejected'; readonly message: string }

export const MESSAGES = {
  'invalid-date': 'That start time is not a date.',
  'unknown-field': 'That duration names a field this calendar does not have.',
  'field-not-whole': 'Durations must be written in whole units.',
  'month-total-not-exact': 'That duration is too large to add exactly.',
  'elapsed-total-not-exact': 'That duration is too large to add exactly.',
  'out-of-range': 'That lands outside the range a date can hold.',
} as const
