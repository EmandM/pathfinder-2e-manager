import type { Filter, Item, ItemSource } from './item-types'
// import { cantripFilter, focusFilter } from './item-types'

export function hydrateFilterOptions(items: Item[], filters: Filter[]) {
  const toHydrate = new Map(filters.map(filter => [filter.key, new Set<string>()]))

  for (const item of items) {
    // Add a search markdown (all lowercase)
    item._source._searchText = item._source.text.toLowerCase()

    for (const filter of filters) {
      const values: ItemSource[keyof ItemSource] = item._source[filter.key]
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
        set.add(`${values}`)
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

const defaultLevel = ['1', '2', '3', '4', '5', '6']
export function hydrateLevelFilter(page: string): string[] {
  if (page === 'spell') {
    // return [cantripFilter, focusFilter, ...defaultLevel]
    return [...defaultLevel]
  }
  return ['0', ...defaultLevel, `${defaultLevel.length + 1}`]
}
