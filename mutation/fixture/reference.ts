/**
 * A toy shaped like a contract, so that the instrument can be measured against something.
 *
 * **This is not a template, and nothing here is a contract.** It has no identity, no signature
 * block, no universal properties, no benchmark profiles and no rationale for anything it answers,
 * because none of that is what it is for. A real contract is a folder under `contracts/`, and
 * `catalogue/every-contract.ts` says what one is made of; copying this file would produce something
 * that looks like verification and is not.
 *
 * What it is for is cost. Every guard the instrument carries is a guard nothing measures, and a
 * meta-test that runs the whole catalogue suite once per meta-cell is a meta-test that gets written
 * once and run never. Three tests over three lines is what makes a complete meta pass cheap enough
 * to actually run, which is the only thing that decides whether the guards below stay honest.
 *
 * It is deliberately minimal and must stay so. A fixture that grows becomes a second contract format
 * competing with the real one, and the next person copies it believing they are doing the right
 * thing.
 */

export const doubled = (value: number): number => value * 2
