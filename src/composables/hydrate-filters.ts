import type { Card } from './types'
import type { FiltersForPage } from '~/components/filters/filter-descriptions'

export function hydrateFilterOptions(cards: Card[], filters: FiltersForPage) {
  console.log('filtering')

  if (filters.shortcut) {
    filters.shortcut.hydrate(cards)
  }

  for (const filter of filters.selectable) {
    filter.hydrate(cards)
  }

  return filters
}
