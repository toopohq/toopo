import { describe, it, expect } from 'vitest'

import type { ContractAddress } from './address.js'
import { contractAddressFaults, isImagined, renderContract } from './address.js'
import * as IMAGINED from './imagined-addresses.js'
import { REPOSITORY_ROOT, TheAddressIsImagined, serialiseContract } from './serialise.js'
import { theFive } from './the-five.js'
import type { ContractSource } from './serialise.js'

/**
 * The two halves of a space no contract may enter and every fixture stands in.
 *
 * **Either one alone is decorative, which is why there are two.** A guard asking whether an address
 * begins with `imagined-`, on its own, is a guard over a convention with a test in front of it -
 * nothing would refuse the prefix, so the prefix would buy nothing. A guard asking whether
 * `serialiseContract` refuses that prefix, on its own, defends a space nobody stands in - born green
 * and staying green for ever. The first says *this is where the fixtures are*, the second says *this
 * is where the catalogue cannot go*, and the reservation is the pair.
 *
 * ADR-0142 is the argument, the measurement of the nine addresses this replaced, and what the pair
 * does not reach.
 */

/** Whether a value of the imagined module is an address rather than something else it may export. */
const isAddress = (value: unknown): value is ContractAddress =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as ContractAddress).name === 'string' &&
  typeof (value as ContractAddress).major === 'number'

/**
 * Every address `imagined-addresses.ts` declares, read off its exports rather than off a list.
 *
 * **The population is the module and never an enumeration**, which is the finding this unit is
 * founded on: three successive hand-written sweeps of this repository counted six, then eight, then
 * nine fixture addresses, and nothing distinguished the ones that were missed. A guard over a list
 * would have the same defect one floor up - it would be total over whatever somebody remembered.
 */
const EVERY_IMAGINED_ADDRESS: readonly ContractAddress[] = Object.values(IMAGINED).filter(isAddress)

describe('the space a fixture stands in and a contract may not', () => {
  /**
   * Every address a fixture stands at is one the catalogue refuses.
   *
   * **The event is a fixture taking an address the catalogue could publish**, which is what nine of
   * them held until ADR-0142 and what nothing reported. It costs the day somebody writes the contract:
   * `number/round` was the imagined graph's root, the address `the-sixth-contract.test.ts` wrote a
   * record against, and the name the catalogue then decided to publish - three fixtures and a
   * catalogue entry at one address, found by setting out to write the contract rather than by any
   * check here.
   *
   * The well-formedness half is not a formality: an address the *shape* refuses would be refused for
   * the wrong reason, and a fixture would be standing somewhere `contractAddressFaults` objects to
   * rather than somewhere the catalogue declines to go. The reservation has to leave the shape alone,
   * and this is what says it does.
   */
  it('every-address-a-fixture-stands-at-is-one-the-catalogue-refuses', () => {
    expect(EVERY_IMAGINED_ADDRESS.length).toBeGreaterThan(0)

    const admissible = EVERY_IMAGINED_ADDRESS.filter((address) => !isImagined(address.name))
    expect(admissible.map(renderContract)).toEqual([])

    const malformed = EVERY_IMAGINED_ADDRESS.filter(
      (address) => contractAddressFaults(address).length > 0,
    )
    expect(malformed.map(renderContract)).toEqual([])
  })

  /**
   * The catalogue refuses a contract offered at one of those addresses.
   *
   * Over a real contract of the five with its address moved, rather than over a source written for
   * this guard: what is under measurement is the door every folder becomes a served record through, so
   * the thing put through it has to be something that otherwise passes. A hand-built source could be
   * refused for a reason it was built to carry.
   *
   * **It perturbs the address and nothing else**, which is the claim rather than the object derived
   * from it: the same source serialises without complaint at its own address, one line up.
   */
  it('the-catalogue-refuses-a-contract-offered-at-an-address-a-fixture-stands-at', () => {
    const [first] = theFive
    const contract = first as ContractSource

    expect(() => serialiseContract(REPOSITORY_ROOT, contract)).not.toThrow()

    const moved: ContractSource = {
      ...contract,
      address: { ...contract.address, name: `imagined-${contract.address.name}` },
    }

    expect(() => serialiseContract(REPOSITORY_ROOT, moved)).toThrow(TheAddressIsImagined)
  })
})
