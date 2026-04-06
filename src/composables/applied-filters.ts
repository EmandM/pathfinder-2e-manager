import type { Card } from './types'
import type { Filter } from '~/components/filters/filter-descriptions'
import { ref } from 'vue'
import { FilterState } from './types'

export type FilterValues = Map<string, FilterState>

export interface AppliedFilter {
  filter: Filter
  appliedOptions: FilterValues
}

export class AppliedFilterCollection {
  filters: Map<Filter['key'], AppliedFilter> = new Map()

  addFilter(filter: Filter, selectedValue: string) {
    let set = this.filters.get(filter.key)
    if (!set) {
      set = { filter, appliedOptions: new Map() }
      this.filters.set(filter.key, set)
    }

    set.appliedOptions.set(selectedValue, FilterState.includes)
  }

  removeFilter(filterKey: Filter['key'], selectedValue: string) {
    const set = this.filters.get(filterKey)
    if (!set) {
      console.error('tried to remove a tag that was never added')
      return
    }

    set.appliedOptions.delete(selectedValue)
    if (set.appliedOptions.size <= 0) {
      this.filters.delete(filterKey)
    }
  }

  // Update the state of a filter (include/exclude/ignore)
  updateState(filterKey: Filter['key'], selectedValue: string, state: FilterState) {
    const filter = this.filters.get(filterKey)
    if (!filter) {
      console.error('tried to toggle a tag that was never added')
      return
    }
    if (filter.appliedOptions.has(selectedValue)) {
      filter.appliedOptions.set(selectedValue, state)
    }
  }

  addShortcutFilter(filter: Filter) {
    let set = this.filters.get(filter.key)
    if (set) {
      return
    }
    if (!filter.options) {
      return
    }

    set = { filter, appliedOptions: new Map() }
    for (const value of filter.options) {
      set.appliedOptions.set(value, FilterState.inactive)
    }
    this.filters.set(filter.key, set)
  }

  getAppliedValues(filter: Filter): string[] {
    const internal = this.filters.get(filter.key)
    if (!internal || !internal.appliedOptions) {
      return []
    }
    // const applied = []
    // for (const [key, state] of internal.appliedOptions) {
    //   if (state === FilterState.includes) {

    //   }
    // }
    return Object.keys(internal?.appliedOptions) || []
  }

  /**
   * Gets the current applied state of a given option for a given filter
   * @param filter The filter where to look for the option state
   * @param option The option to get the state for
   * @returns The current FilterState of the option. If the option is not currently applied, undefined is returned.
   */
  getAppliedState(filter: Filter, option: Filter['options'][number]): FilterState | undefined {
    const internal = this.filters.get(filter.key)
    if (!internal) {
      return undefined
    }

    return internal.appliedOptions.get(option)
  }

  // Levels are weird. It's the only thing with an OR match and no exclude. Do them special
  levelFilter: Set<string> = new Set()
  setLevelFilter(levels: string[]) {
    this.levelFilter = new Set(levels)
  }

  // Ensure the search string is lowercase so we can do case-insensive searching
  searchString = ''
  setSearchString(search: string) {
    this.searchString = search.toLowerCase()
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

/**
 * Creates an iterator that iterates over all the valid items of the list.
 * Valid items are items that match all of the passed in filters.
 * @param list unfiltered list of cards
 * @param filters FilterCollection to use for filtering
 * @returns Filtered list of cards
 */
export function useFilteredList(list: Card[], filters: AppliedFilterCollection): Card[] {
  const filteredList: Card[] = []
  for (const card of list) {
    if (doFilter(card, filters)) {
      filteredList.push(card)
    }
  }
  return filteredList
}

// Decides whether the current card is is valid based on the given filter
function doFilter(item: Card, collection: AppliedFilterCollection): boolean {
  if (!levelMatch(item, collection.levelFilter)) {
    return false
  }

  if (collection.searchString && !search(item.search_text, collection.searchString)) {
    return false
  }

  for (const [type, applied] of collection.filters) {
    const itemKey = item[type]

    if (itemKey === undefined && !applied.filter.isSingleOption) {
      return false
    }

    for (const [value, state] of applied.appliedOptions) {
      const isMatch = applied.filter.isMatch(itemKey, value)
      if (state === FilterState.includes && !isMatch) {
        return false
      }
      else if (state === FilterState.excludes && isMatch) {
        return false
      }
    }
  }

  return true
}

// When filtering on levels, use an OR match instead of an AND
function levelMatch(item: Card, levels: Set<string>): boolean {
  // Every level is valid if no levels are selected for the filter
  if (levels.size <= 0) {
    return true
  }

  if (levels.has(`${item.level}`)) {
    return true
  }

  return false
}

// search_text and searchString are both lowercase to allow case-insensitive matching
function search(text: Card['search_text'], searchString: string) {
  return text.includes(searchString)
}
