import type { AppliedFilter, Card, CardSource, Filter, FilterFunction } from './types'
import { ref } from 'vue'
import { FilterState } from './types'

export class AppliedFilterCollection {
  filters: Map<Filter['key'], AppliedFilter> = new Map()

  addFilter(filter: Filter, selectedValue: string) {
    let set = this.filters.get(filter.key)
    if (!set) {
      set = { filter, appliedValues: new Map() }
      this.filters.set(filter.key, set)
    }

    set.appliedValues.set(selectedValue, FilterState.includes)
  }

  removeFilter(filterKey: Filter['key'], selectedValue: string) {
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

  // Update the state of a filter (include/exclude/ignore)
  updateState(filterKey: Filter['key'], selectedValue: string, state: FilterState) {
    const filter = this.filters.get(filterKey)
    if (!filter) {
      console.error('tried to toggle a tag that was never added')
      return
    }
    if (filter.appliedValues.has(selectedValue)) {
      filter.appliedValues.set(selectedValue, state)
    }
  }

  addShortcutFilter(filter: Filter) {
    let set = this.filters.get(filter.key)
    if (set) {
      return
    }

    set = { filter, appliedValues: new Map() }
    for (const value of filter.options) {
      set.appliedValues.set(value, FilterState.inactive)
    }
    this.filters.set(filter.key, set)
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

// Creates an iterator that iterates over all the valid items of the list.
// Valid items are items that match all of the passed in filters.
export function* useFilteredList(list: Card[], filters: AppliedFilterCollection): Iterator<Card> {
  let i = 0
  while (i < list.length) {
    if (doFilter(list[i], filters)) {
      yield list[i]
    }
    i++
  }
}

// Decides whether the current card is is valid based on the given filter
function doFilter(item: Card, collection: AppliedFilterCollection): boolean {
  const source = item._source

  if (!levelMatch(source, collection.levelFilter)) {
    return false
  }

  if (collection.searchString && !search(source._searchText, collection.searchString)) {
    return false
  }

  for (const [type, applied] of collection.filters) {
    const itemKey = source[type]
    if (!itemKey) {
      return false
    }

    if (!transformer(applied.filter.matches)(itemKey, applied.appliedValues)) {
      return false
    }
  }

  return true
}

// When filtering on levels, use an OR match instead of an AND
function levelMatch(source: CardSource, levels: Set<string>): boolean {
  // Every level is valid if no levels are selected for the filter
  if (levels.size <= 0) {
    return true
  }

  if (levels.has(`${source.level}`)) {
    return true
  }

  return false
}

// _searchText and searchString are both lowercase to allow case-insensitive matching
function search(text: CardSource["_searchText"], searchString: string) {
  return text.includes(searchString)
}

// make typescript happy
function transformer<K extends keyof CardSource>(matchFunc: FilterFunction<CardSource[K]>): FilterFunction<CardSource[keyof CardSource]> {
  return matchFunc
}
