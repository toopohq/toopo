#!/usr/bin/env node
/**
 * The file somebody runs when they installed `toopo`.
 *
 *   npx toopo add string/slugify
 *
 * It names the registry that travelled in the archive and hands it to `command.ts`, which is the same
 * three lines `toopo.ts` writes about the other registry. Everything below this file is identical in
 * both, and that is the point of the port.
 *
 * **It is the only module that knows where the artefact sits**, which is why `packaged-source.ts`
 * takes an artefact rather than a path: a source that opened a file would put the port's own answers
 * behind a fixture nobody can write, and `command.ts` states the property that would cost.
 *
 * The path is resolved against this file rather than against the working directory, because the
 * working directory is the user's project and this file is somewhere under their `node_modules`. The
 * layout it assumes - the artefact one level up from the compiled entry point - is the one
 * `packaging/tsconfig.dist.json` emits and `packaging/archive.test.ts` installs and runs.
 *
 * The thunk is not called until a command needs a registry, so `toopo` with no arguments prints its
 * usage without reading a file.
 */

import { join } from 'node:path'

import { ARTEFACT_FILE, readArtefact } from './artefact.js'
import { run } from './command.js'
import { packagedSource } from './packaged-source.js'

await run(() => packagedSource(readArtefact(join(import.meta.dirname, '..', ARTEFACT_FILE))))
