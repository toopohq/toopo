/**
 * Which way round the page is, and the one place the answer is spelled.
 *
 * **Nothing here is needed to read.** The palette in `style.ts` is dark by declaration and light under
 * `prefers-color-scheme: light`, both in CSS, so a reader running no JavaScript at all gets the theme
 * their own system is set to and every word of the page. What this module adds is an override for the
 * reader whose system is set to one thing and who wants the other, and an override is the definition
 * of an enrichment: it changes nothing for anybody who never asks for it.
 *
 * ADR-0115 refused a toggle in as many words - *there is no toggle and nothing is remembered: the
 * reader's system already carries that preference and a second copy of it would be a second statement
 * to drift.* That argument is sound and the owner has overruled it, which ADR-0176 records as an
 * overruling rather than as a discovery: unlike the palette, this half of ADR-0115 named no condition
 * that would reopen it, so nothing was met and somebody decided.
 *
 * **What the drift argument was right about is answered here rather than dismissed.** The second copy
 * exists - it is a string in a reader's own browser - and it can disagree with their system. The
 * disagreement is bounded by making the stored value mean *the reader asked for this*, never *the
 * reader's system is this*: nothing writes it except a press of the button, and a reader who has never
 * pressed it has nothing stored and therefore nothing that can be out of date.
 *
 * ---------------------------------------------------------------------------
 * Why one script is in the head, blocking, when nothing else here is
 * ---------------------------------------------------------------------------
 *
 * A deferred module runs after the first paint. A reader who chose light on a dark system would
 * therefore meet a dark page and watch it turn, on every navigation - which is worse than no button,
 * because it is the reader's own choice arriving late and visibly. The only cure is to set the
 * attribute before anything is painted, and the only thing that runs before a paint is a blocking
 * script in the head.
 *
 * That is the whole of what it does. It reads one key, checks it against two values, sets one
 * attribute, and swallows any failure - a browser with storage disabled throws on the read, and the
 * page it would otherwise break is a page that has no reason to care.
 */

/** The two ways round a page can be, as the union everything else is total over. */
export type Theme = 'light' | 'dark'

/** Both of them, so that a reader of a stored value has something to check it against. */
export const THE_THEMES: readonly Theme[] = ['light', 'dark']

/**
 * Where a reader's own choice is kept, in their own browser and nowhere else.
 *
 * Namespaced, because the origin is shared with nothing today and that is a fact about a deployment
 * rather than a promise.
 */
export const THE_THEME_KEY = 'toopo-theme'

/** The attribute the palette's two overrides key off. One spelling, three readers. */
export const THE_THEME_ATTRIBUTE = 'data-theme'

/**
 * The script the head carries, as the string it is served as.
 *
 * It is written out rather than composed from the constants above, and that is a trade taken with the
 * eyes open: composing it would put `${...}` inside a string that is injected into HTML, and the one
 * thing a script element must never be is assembled. What keeps the two in step is
 * `the-script-that-sets-the-theme-agrees-with-the-stylesheet-that-reads-it`, which reads this text for
 * the key and the attribute and compares them with the constants - so a rename that touched one and
 * not the other is red rather than silent.
 *
 * There is no `<` anywhere in it, so nothing in it can close the element that carries it.
 */
export const THE_THEME_SCRIPT =
  `try{var t=localStorage.getItem('toopo-theme');` +
  `if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`

/** Whether something read out of a reader's browser is one of the two things it may be. */
export const isATheme = (value: unknown): value is Theme =>
  typeof value === 'string' && (THE_THEMES as readonly string[]).includes(value)
