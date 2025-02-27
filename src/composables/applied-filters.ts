import type { Item, ItemSource } from './item-types'
import type { Filter } from '~/components/filters/filter-descriptions'
import { ref } from 'vue'

interface AppliedFilter {
  filter: Filter
  appliedValues: Set<string>
}

export class AppliedFilterCollection {
  filters: Map<keyof ItemSource, AppliedFilter> = new Map()

  addFilter(filter: Filter, selectedValue: string) {
    let set = this.filters.get(filter.key)
    if (!set) {
      set = {
        filter,
        appliedValues: new Set(),
      }
      this.filters.set(filter.key, set)
    }

    set.appliedValues.add(selectedValue)
  }

  removeFilter(filterKey: keyof ItemSource, selectedValue: string) {
    const set = this.filters.get(filterKey)
    if (!set) {
      console.error('tried to remove a tag that was never added')
      return
    }
    set.appliedValues.delete(selectedValue)
    if (set.appliedValues.size <= 0) {
      this.filters.delete(filterKey)
    }
  }

  toggleFilter(filterKey: keyof ItemSource, selectedValue: string) {
    const filter = this.filters.get(filterKey)
    if (!filter) {
      console.error('tried to toggle a tag that was never added')
      return
    }
    if (filter.appliedValues.has(selectedValue)) {
      filter.appliedValues.delete(selectedValue)
    }
    else {
      filter.appliedValues.add(selectedValue)
    }
  }
}

// Global state
const selectedByPage = ref<Map<string, AppliedFilterCollection>>(new Map())

// This function gets a managed, persisted collection of filters per page.
export function usePersistentAppliedFilters(pageName: string): AppliedFilterCollection {
  let appliedFilters = selectedByPage.value.get(pageName)
  if (!appliedFilters) {
    appliedFilters = new AppliedFilterCollection()
    selectedByPage.value.set(pageName, appliedFilters)
  }

  return appliedFilters
}

// Creates an iterator that iterates over all the valid items of the list.
// Valid items are items that match all of the passed in filters.
export function* useFilteredList(list: Item[], filters: AppliedFilterCollection): Iterator<Item> {
  let i = 0
  while (i < list.length) {
    if (doFilter(list[i], filters)) {
      yield list[i]
    }
    i++
  }
}

function doFilter(item: Item, collection: AppliedFilterCollection): boolean {
  const source = item._source

  for (const [type, applied] of collection.filters) {
    const itemKey = source[type]
    if (!itemKey) {
      return false
    }

    if (!applied.filter.matches(source[type], applied.appliedValues)) {
      return false
    }
  }

  return true
}
