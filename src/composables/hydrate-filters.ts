import type { Card } from './types'
import type { FiltersForPage } from '~/components/filters/filter-descriptions'
// import { cantripFilter, focusFilter } from './item-types'

export function hydrateFilterOptions(items: Card[], filters: FiltersForPage) {
  const toFilter = [...filters.selectable]
  if (filters.shortcut) {
    toFilter.push(filters.shortcut)
  }
  const toHydrate = new Map(toFilter.map(filter => [filter?.key, new Set<string>()]))

  for (const item of items) {
    for (const filter of toFilter) {
      if (!filter) {
        console.warn('error with filter descriptions, filter is undefined')
        continue
      }

      const values: Card[keyof Card] = item[filter.key]
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

  for (const filter of toFilter) {
    const set = toHydrate.get(filter.key)
    if (!set) {
      continue
    }
    filter.options = [...set]
  }

  return filters
}

const defaultLevel = ['1', '2', '3', '4', '5', '6']
export function useLevelFilter(page: string): string[] {
  if (page === 'spell') {
    // return [cantripFilter, focusFilter, ...defaultLevel]
    return [...defaultLevel]
  }
  return ['0', ...defaultLevel, `${defaultLevel.length + 1}`]
}
