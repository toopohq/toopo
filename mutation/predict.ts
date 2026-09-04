/**
 * What a replay would refuse on, before paying for one.
 *
 *   npm run predict
 *   npm run predict -- registry-storage
 *
 * **The price this closes is measured rather than argued.** ADR-0212 wrote a predictor for exactly
 * this question, named the three counts a battery refuses on in its own header, implemented two of
 * them, and answered *nought faults*; the replay then refused on the third, at the end of forty-two
 * minutes, and the count it corrected was that record's headline figure. ADR-0206 measures the same
 * debt from the other side: twenty seconds against an hour, twice. A predictor that names three
 * failure modes and checks two reads exactly like one that checks three - same output, same shape,
 * same confidence - which is why the three are imported here from the module that computes them
 * rather than retyped from a reading of it.
 *
 * `prediction.ts` carries what this is exact for and what it is blind to, and that sentence is the
 * one to read before believing any output below.
 *
 * The exit code is three-valued on purpose. Nought is a reading that was taken and agreed; one is a
 * fault a replay would refuse on; two is a question this reading could not ask. Folding the third
 * into the first would publish a false green, which is the whole class this module exists inside.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { StoredMeasurement } from './attribution.ts'
import type { Prediction } from './prediction.ts'
import {
  EXIT,
  exitCodeFor,
  predictionFor,
  renderPrediction,
  whyAMeasurementIsUnreadable,
} from './prediction.ts'
import { THE_INSTRUMENT_FOLDER } from './paths.ts'
import { THE_BATTERIES } from './published.ts'
import type { Battery } from './run.ts'

/**
 * Where one battery's last complete measurement is, and what stands in for it when there is none.
 *
 * A filtered run writes `<name>.partial.json` and `run.ts` says why: replacing a complete measurement
 * with a fragment of one leaves behind something that looks exactly like a result. So a partial file
 * is named here as the reason a reading could not be taken, and never read as though it were one.
 */
const measurementFor = (name: string): StoredMeasurement | string => {
  const complete = join(THE_INSTRUMENT_FOLDER, 'results', `${name}.json`)

  if (!existsSync(complete)) {
    const partial = join(THE_INSTRUMENT_FOLDER, 'results', `${name}.partial.json`)

    return existsSync(partial)
      ? `only a filtered run of this battery has ever been written, and a fragment of a measurement ` +
          `answers for none of the cells it left out. Run \`npm run battery -- ${name}\`.`
      : `no measurement of this battery is on disk. Run \`npm run battery -- ${name}\`.`
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(complete, 'utf8'))
  } catch (error) {
    return `its measurement is not readable JSON: ${(error as Error).message}`
  }

  const why = whyAMeasurementIsUnreadable(parsed)

  return why === null ? (parsed as StoredMeasurement) : `its measurement is malformed: ${why}`
}

const predictFor = (battery: Battery): Prediction => {
  const measurement = measurementFor(battery.name)

  return typeof measurement === 'string'
    ? { battery: battery.name, notCovered: [], stale: [], faults: [], unread: [measurement] }
    : predictionFor(battery, measurement)
}

const [name] = process.argv.slice(2)

const chosen =
  name === undefined ? THE_BATTERIES : THE_BATTERIES.filter((battery) => battery.name === name)

if (chosen.length === 0) {
  throw new Error(
    `${name} is not a battery of this repository. Named batteries: ` +
      `${THE_BATTERIES.map((battery) => battery.name).join(', ')}`,
  )
}

const predictions: readonly Prediction[] = chosen.map(predictFor)

for (const prediction of predictions) process.stdout.write(renderPrediction(prediction))

const faults = predictions.reduce((total, one) => total + one.faults.length, 0)
const unread = predictions.reduce((total, one) => total + one.unread.length, 0)

process.stdout.write(
  `\n${chosen.length} battery(s) read: ${faults} fault(s) a replay would refuse on, ` +
    `${unread} question(s) this reading could not ask\n`,
)

if (faults === 0 && unread === 0) {
  process.stdout.write(
    'every battery read agrees with its own last measurement. That is a statement about the cells ' +
      'that measurement holds and about nothing else: a cell it does not hold is named above.\n',
  )
}

process.exitCode = exitCodeFor(predictions)

if (process.exitCode === EXIT.unread) {
  process.stdout.write(
    '\nexit 2: a reading that could not be taken is not a reading that found nothing.\n',
  )
}
