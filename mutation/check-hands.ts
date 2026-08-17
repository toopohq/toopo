/**
 * Every paragraph of prose this repository holds, with the number of commits that wrote it.
 *
 *     npm run hands
 *     npm run hands -- CLAUDE.md
 *
 * The entry point is separate from `hands.ts` for the reason `check-anchors.ts` is separate from
 * `anchors.ts`: a module a guard can import must not print a report when it is imported.
 */

import { readHands, renderHands, renderOneFile } from './hands.ts'

const path = process.argv[2]

process.stdout.write(path === undefined ? renderHands(readHands()) : renderOneFile(path))
