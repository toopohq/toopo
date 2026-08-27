#!/usr/bin/env node
/**
 * The file somebody runs when they installed `toopo`.
 * ADR-0092 is why the catalogue is no longer beside it.
 *
 *   npx toopo add string/slugify
 *
 * It names the registry this project publishes and hands it to `command.ts`, which is the same three
 * lines `toopo.ts` writes about the other registry. Everything below this file is identical in both,
 * and that is the point of the port.
 *
 * **It is the only module that names an origin**, which is the shape the artefact already had: one
 * file knows where the registry is, and nothing under it can be given a different one. There is no
 * flag, no environment variable and no probe. A knob here would let an installation be served from
 * somewhere this project does not control, and the single thing a client cannot check by arithmetic is
 * exactly the thing such a knob would move - which digest a name resolves to. Permanent rule 3 is that
 * sentence, and `source.ts` is where the frontier it draws is kept.
 *
 * The thunk is not called until a command needs a registry, so `toopo` with no arguments prints its
 * usage without opening a socket.
 *
 * **The code is assigned rather than exited on, and ADR-0168 is why.** `run` answers what this process
 * should end with; nothing under it stops node, because a command that had reached the registry and
 * then called `process.exit` aborted on a libuv assertion on win32 - printing a line no reader can act
 * on over a refusal that was correct, and ending with a code git-bash reads as *command not found*.
 */

import { THE_ORIGIN } from '../registry/address.js'
import { run } from './command.js'
import { httpSource } from './http-source.js'

process.exitCode = await run(() => httpSource(THE_ORIGIN))
