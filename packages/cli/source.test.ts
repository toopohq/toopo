import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { ENDPOINTS, portFaults } from '../registry/endpoints.js'
import { NEEDS } from '../registry/needs.js'
import { imaginedSource } from './imagined-source.js'
import { THE_PUBLISHED_IMPLEMENTATION_VERSION } from '../registry/publication.js'
import { THE_PUBLISHED_VERSION, localSource } from './local-source.js'
import { THE_ENDPOINT_BEHIND } from './source.js'

/**
 * The port, and the frontier between an installer and the working tree it happens to be sitting in.
 *
 * The frontier guard is the load-bearing one. `source.ts` states in prose that serialising this
 * repository is a stand-in for a publication and never a source of distribution - and a sentence in a
 * header is exactly the kind of rule this repository keeps finding nothing behind. What keeps it is
 * that one module reaches the serialisation and every other module of this folder would fail this
 * guard for doing so.
 */

const HERE = import.meta.dirname

const THE_SERIALISATION = ['registry/the-catalogue', 'registry/serialise']

describe('where an installer gets what it installs', () => {
  it('every-method-of-the-port-answers-an-endpoint-that-exists', () => {
    const known = new Set(ENDPOINTS.map((endpoint) => endpoint.id))

    expect(Object.values(THE_ENDPOINT_BEHIND).filter((endpoint) => !known.has(endpoint))).toEqual([])
    expect(portFaults(THE_ENDPOINT_BEHIND,imaginedSource())).toEqual([])
  })

  /**
   * A source reaching past the read API is the failure this port exists to prevent: it would be an
   * installer depending on an answer no endpoint publishes, and therefore on a registry it can only be
   * ours.
   */
  it('a-source-carrying-more-than-the-port-declares-is-refused', () => {
    // `contract-binding` is the endpoint the port most looks like it should carry and deliberately
    // does not - `source.ts` argues it at length - so it is the right thing for a source to be
    // caught offering.
    const wider = { ...imaginedSource(), contractBinding: () => null }

    expect(portFaults(THE_ENDPOINT_BEHIND,wider as never)).toEqual([
      'the source carries `contractBinding`, which the port does not declare - a client reaching ' +
        'for it would be reaching past the read API',
    ])
  })

  /**
   * Every need any command of this folder has is answered by an endpoint the port carries, and the
   * port carries nothing else. Two statements about one design, and the disagreement between them is
   * what would say that a command had grown a dependency nobody wrote down.
   *
   * **Over every `cli-` consumer rather than over `cli-add`, which is a repair.** The identifier used
   * to name one command, and a name that has to be edited whenever the data moves is not an address -
   * the rule the catalogue already carries for a case and a guard. It had already gone stale without
   * anybody noticing: `cli-update` arrived with two needs an endpoint answers, and this guard was
   * checking neither. `cli-search` would have been the third and fourth.
   *
   * The needs answered without the API are excluded, and that is the half worth naming: pointing an
   * import at a shared copy is `packages/cli/rewrite.ts`, and detecting a local modification is the lockfile.
   * Neither is an endpoint, both are needs, and a port that carried one would be a registry publishing
   * an opinion about code it does not parse.
   */
  it('the-port-answers-every-need-behind-it-and-nothing-else', () => {
    const mine = NEEDS.filter(
      (need) => need.consumer.startsWith('cli-') && need.answeredWithoutTheApi === undefined,
    )
    const answered = new Set(
      ENDPOINTS.filter((endpoint) => Object.values(THE_ENDPOINT_BEHIND).includes(endpoint.id)).flatMap(
        (endpoint) => endpoint.answers,
      ),
    )

    expect(mine.filter((need) => !answered.has(need.id)).map((need) => need.id)).toEqual([])
  })

  /**
   * The frontier, read off the folder rather than promised in a header.
   *
   * A text search over the source rather than a syntax tree, and that is a deliberate limit: this is a
   * discipline about which module may know about the working tree, not a security filter, and the one
   * thing it has to catch is a second module importing the serialisation because it was convenient.
   */
  it('nothing-but-the-local-adapter-reaches-the-serialisation', () => {
    const reaching = readdirSync(HERE)
      .filter((name) => name.endsWith('.ts'))
      .filter((name) => {
        const text = readFileSync(join(HERE, name), 'utf8')

        return THE_SERIALISATION.some((module) => text.includes(`from '../${module}.js'`))
      })

    expect(reaching).toEqual(['local-source.ts'])
  })

  /**
   * The version this stand-in binds at is the version the registry published, and not a second opinion.
   *
   * **The guard this replaces asserted the string was visibly false, and it was the right guard for as
   * long as it was.** Nothing was published, so `0.0.0-local` was the honest answer and a `1.0.0` here
   * would have named a release that existed nowhere. Published, the failure inverts: a version this
   * client invents is one `toopo.lock` records against an address the registry never minted, and a
   * lockfile whose whole value is that it can be checked offline against a published fact would be
   * naming a fact nobody published.
   *
   * It is resolved against `publication.ts` rather than against a literal, which is the leg that was
   * missing while the string named nothing: the registry mints the version, and this restates it
   * because a client may not import another client.
   */
  it('the-local-source-binds-the-version-the-registry-published', async () => {
    expect(THE_PUBLISHED_VERSION).toBe(THE_PUBLISHED_IMPLEMENTATION_VERSION)

    const bindings = await localSource().implementationBindings({
      language: 'typescript',
      name: 'string/slugify',
      major: 1,
    })

    expect(bindings.map((binding) => binding.address.version)).toEqual([
      THE_PUBLISHED_IMPLEMENTATION_VERSION,
    ])
  })

  /**
   * `array/group-by@1` was considered and decided against, so the index has to find it and must never
   * offer it. A registry whose search contradicted its own refusals page would be publishing two
   * answers to one question.
   */
  it('a-refused-contract-is-in-the-index-and-is-not-installable', async () => {
    const entries = (await localSource().contractIndex()).entries
    const refused = entries.find((entry) => entry.address.name === 'array/group-by')

    expect(refused?.installable).toBe(false)
    // Which entry is not installable rather than how many are: the count was a figure a publication
    // retired, and it read `toHaveLength(5)` through two of them.
    expect(entries.filter((entry) => !entry.installable).map((entry) => entry.address.name)).toEqual([
      'array/group-by',
    ])
  })
})
