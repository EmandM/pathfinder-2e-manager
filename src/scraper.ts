import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Client } from '@elastic/elasticsearch'

const config = {
  // These values should be static, and tell the scraper how to access the AON elastic instance.
  root: 'https://elasticsearch.aonprd.com/',
  index: 'aon',

  // Comment out any targets you do not want to scrape.
  targets: [
    'action',
    'ancestry',
    'archetype',
    'armor',
    'article',
    'background',
    'class',
    'condition',
    'creature',
    'creature-family',
    'deity',
    'equipment',
    'feat',
    'hazard',
    // "rules",
    'runes',
    'skill',
    'shield',
    'spell',
    'source',
    'trait',
    'weapon',
    'weapon-group',
  ],
}

// More complicated queries copied from archive of nethys
const advancedQueries = {
  runes: { bool: { filter: [{ query_string: { query: 'category:(armor OR equipment OR shield OR siege-weapon OR vehicle OR weapon) item_category:"Runes" !category:item-bonus', default_operator: 'AND', fields: ['name', 'legacy_name', 'remaster_name', 'text^0.1', 'trait_raw', 'type'], minimum_should_match: 0 } }, { bool: { must_not: { exists: { field: 'remaster_id' } } } }], must_not: [{ exists: { field: 'item_child_id' } }, { term: { exclude_from_search: true } }] } },
  spell: { bool: { filter: [{ query_string: { query: 'category:spell -trait:mythic !category:item-bonus', default_operator: 'AND', fields: ['name', 'legacy_name', 'remaster_name', 'text^0.1', 'trait_raw', 'type'], minimum_should_match: 0 } }, { bool: { must_not: { exists: { field: 'remaster_id' } } } }], must_not: [{ exists: { field: 'item_child_id' } }, { term: { exclude_from_search: true } }] } },
  equipment: { bool: { filter: [{ query_string: { query: 'category:(armor OR equipment OR shield OR siege-weapon OR vehicle OR weapon)  !category:item-bonus', default_operator: 'AND', fields: ['name', 'legacy_name', 'remaster_name', 'text^0.1', 'trait_raw', 'type'], minimum_should_match: 0 } }, { bool: { must_not: { exists: { field: 'remaster_id' } } } }], must_not: [{ exists: { field: 'item_child_id' } }, { term: { exclude_from_search: true } }] } },
  alchemical: { bool: { filter: [{ query_string: { query: 'category:(armor OR equipment OR shield OR siege-weapon OR vehicle OR weapon) item_category:"Alchemical Items" !category:item-bonus', default_operator: 'AND', fields: ['name', 'legacy_name', 'remaster_name', 'text^0.1', 'trait_raw', 'type'], minimum_should_match: 0 } }, { bool: { must_not: { exists: { field: 'remaster_id' } } } }], must_not: [{ exists: { field: 'item_child_id' } }, { term: { exclude_from_search: true } }] } },
}

const client = new Client({
  node: config.root,
})

async function retrieveTargets() {
  for (const target of config.targets.sort()) {
    try {
      let query: any = advancedQueries[target as keyof typeof advancedQueries]
      if (!query) {
        query = { match: { category: target } }
      }

      const search = await client.search({
        index: config.index,
        from: 0,
        size: 10000,
        query,
        sort: [{ level: { order: 'asc' } }, { price: { order: 'asc' } }, { 'name.keyword': { order: 'asc' } }, '_doc'],
      })

      console.log(`Retrieved ${search?.hits?.hits?.length} for target ${target}`)
      const destinationDir = path.join(process.cwd(), '/public/data')
      mkdirSync(destinationDir, {
        recursive: true,
      })
      console.log('writing to:', path.join(destinationDir, `${target}.json`))
      writeFileSync(
        path.join(destinationDir, `${target}.json`),
        JSON.stringify(search?.hits?.hits),
      )
    }
    catch (err) {
      console.error('Error writing to file', err)
    }
  }
}

// eslint-disable-next-line antfu/no-top-level-await
await retrieveTargets()
