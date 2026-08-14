/**
 * A toy contract module, so that a submission can be caught importing the type of its own contract.
 *
 * **This is a fixture, not a template.** It carries one declared type and nothing else - no identity,
 * no properties, no case table, no benchmark profiles. A real contract is a folder of seven files and
 * is described in `packages/catalogue/every-contract.ts`; nothing here is a model for one, and it is named
 * `contract.ts` for the single reason that the rule under test recognises a contract module by that
 * name.
 */

export type Doubles = (value: number) => number
