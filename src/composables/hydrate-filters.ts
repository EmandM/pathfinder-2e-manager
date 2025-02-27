import type { Item } from './item-types'
import type { Filter } from '~/components/filters/filter-descriptions'

export function hydrateFilterOptions(items: Item[], filters: Filter[]) {
  const toHydrate = new Map(filters.map(filter => [filter.key, new Set<string>()]))

  for (const item of items) {
    for (const filter of filters) {
      const values = item._source[filter.key]
      const set = toHydrate.get(filter.key)
      if (!values || !set) {
        continue
      }
      if (Array.isArray(values)) {
        for (const value of values) {
          set.add(`${value}`)
        }
      }
      else if (typeof values === 'object') {
        console.warn('Unimplemented - object fields')
      }
      else {
        set.add(values)
      }
    }
  }

  for (const filter of filters) {
    const set = toHydrate.get(filter.key)
    if (!set) {
      continue
    }
    filter.options = [...set]
  }

  return filters
}
