/**
 * Every anchor of every battery, resolved against the tree as it stands.
 *
 *     npm run anchors
 *     npm run anchors -- packages/registry/contract-record.ts
 *
 * The entry point is separate from `anchors.ts` for the reason `tally.ts` is separate from
 * `score.ts`: a module a guard can import must not print a report when it is imported.
 */

import { readAnchors, renderEveryFile, renderLoose, renderOneFile } from './anchors.ts'

const reading = readAnchors()
const path = process.argv[2]

/** The failure goes first, because it is the answer and the listing is only the evidence. */
if (reading.loose.length > 0) {
  process.stdout.write(renderLoose(reading))
  process.exitCode = 1
}

process.stdout.write(path === undefined ? renderEveryFile(reading) : renderOneFile(reading, path))
