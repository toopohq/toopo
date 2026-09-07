/**
 * What a contract needs of the runtime it will be run on, in the one vocabulary it may say it in.
 * ADR-0249.
 *
 * ---------------------------------------------------------------------------
 * Why this is not `environments`, measured rather than argued
 * ---------------------------------------------------------------------------
 *
 * `ContractRecord.environments` carries *the runtimes the contract is written for* - ADR-0006's own
 * sentence - and every contract of this catalogue declares the same three. ADR-0220 measured that it
 * refuses nothing: `readonly string[]`, no union, no vocabulary type, and no reader outside this
 * folder. A constant cannot be contradicted, so loading it with a *requirement* would put two claims
 * in one field, on six records permanent rule 6 forbids re-declaring. ADR-0248 measured the price of
 * both forms and found it nil either way, which is what left the choice to be made on meaning.
 *
 * ---------------------------------------------------------------------------
 * A capability and never a version, and one reading is why
 * ---------------------------------------------------------------------------
 *
 * The obvious spelling of *this needs Node 26* is a version range, and it is wrong in both directions.
 * Measured on this machine at `7fcd444`, node v24.15.0 on V8 13.6.233.17: plain, `Temporal` is
 * `undefined`; under `--harmony-temporal` it is an object of **eleven** own property names, `Calendar`
 * and `TimeZone` among them - the two the erratum removed. **One version answers both *absent* and
 * *present and not the language*, on one machine, a flag apart.** A version does not determine the
 * capability even for a fixed runtime, and across runtimes it does not exist at all: a browser carries
 * Temporal without carrying a Node version.
 *
 * So what is declared is what the code needs to find, and it is checked by looking for it. That also
 * makes the field checkable where it matters - in the runtime that will run the code - which no
 * version range is, because nothing can turn a browser into a version this catalogue could compare.
 *
 * ---------------------------------------------------------------------------
 * The vocabulary is closed, and that is the whole difference from `environments`
 * ---------------------------------------------------------------------------
 *
 * `targetEnvironments` accepts any string, so nothing can be wrong about it. A member added here is a
 * member two other places must answer for: `packages/cli` declares how each is detected, keyed by this
 * union, so a capability nobody can look for does not compile. That is ADR-0054's shape - the rule
 * that makes breaking it a compiler error rather than a sentence.
 */

/**
 * What a contract may say it needs. One member, because one contract needs one thing and a vocabulary
 * written ahead of its instances is the speculation `FIELD_MAP`'s own rule deletes.
 */
export type RuntimeCapability = 'temporal'

/**
 * The vocabulary as a value, for the readers that have to sweep it rather than switch on it.
 *
 * Written out rather than derived, because a union has no runtime form - and it is kept honest by
 * `THE_READING_FOR` in the client, which is keyed by the union and therefore cannot omit a member.
 */
export const THE_RUNTIME_CAPABILITIES: readonly RuntimeCapability[] = ['temporal']

/**
 * What each member means, in the words a refusal has to be able to say to somebody.
 *
 * Keyed by the union, so a member added with no sentence does not compile. It is prose and it is
 * classified as such: what makes the *field* structural is the refusal below, not this.
 */
export const WHAT_A_CAPABILITY_NEEDS: Readonly<Record<RuntimeCapability, string>> = {
  temporal:
    'Temporal in the form the language published - the global exists and does not carry the ' +
    '`Calendar` and `TimeZone` the erratum removed, which a runtime serving the draft behind a flag ' +
    'still does',
}

const isCapability = (word: unknown): word is RuntimeCapability =>
  THE_RUNTIME_CAPABILITIES.includes(word as RuntimeCapability)

export class UnknownRuntimeCapability extends Error {
  constructor(where: string, word: unknown) {
    super(
      `${where} requires \`${String(word)}\` of the runtime, which is not something this catalogue ` +
        `can state. The vocabulary is ${THE_RUNTIME_CAPABILITIES.map((one) => `\`${one}\``).join(', ')}, ` +
        `and it is closed on purpose: a word nothing looks for is a requirement nobody is warned ` +
        `about, which is the state \`environments\` is already in.`,
    )
    this.name = 'UnknownRuntimeCapability'
  }
}

export class ARuntimeRequirementIsMalformed extends Error {
  constructor(where: string, because: string) {
    super(
      `${where} declares a runtime requirement that ${because}. It is inside the digest, so it is ` +
        `settled before publication or never.`,
    )
    this.name = 'ARuntimeRequirementIsMalformed'
  }
}

/**
 * What a contract declared, refused rather than coerced.
 *
 * Called only where the export is present: absent is the ordinary state and means *this contract runs
 * wherever the language does*, which is six of the seven and every contract written before this field
 * existed. An empty list is refused for the reason `useCases` and its three siblings are absent rather
 * than empty - it is a section with nothing in it, and here it would also be a claim that reads as
 * *nothing is required* while occupying the field that says something is.
 */
export const requiredRuntimeOf = (
  declared: unknown,
  where: string,
): readonly RuntimeCapability[] => {
  if (!Array.isArray(declared)) {
    throw new ARuntimeRequirementIsMalformed(where, 'is not a list of capabilities')
  }
  if (declared.length === 0) {
    throw new ARuntimeRequirementIsMalformed(
      where,
      'is empty, where a contract needing nothing of the runtime declares nothing at all',
    )
  }

  for (const word of declared) {
    if (!isCapability(word)) throw new UnknownRuntimeCapability(where, word)
  }

  const capabilities = declared as readonly RuntimeCapability[]
  const seen = new Set(capabilities)
  if (seen.size !== capabilities.length) {
    throw new ARuntimeRequirementIsMalformed(where, 'names one capability more than once')
  }

  return capabilities
}
