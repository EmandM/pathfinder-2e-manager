import type { AppliedFilter, Filter, FilterFunction, Item, ItemSource } from './item-types'
import { ref } from 'vue'
import { cantripFilter, FilterState, focusFilter } from './item-types'

export class AppliedFilterCollection {
  filters: Map<Filter['key'], AppliedFilter> = new Map()

  addFilter(filter: Filter, selectedValue: string) {
    let set = this.filters.get(filter.key)
    if (!set) {
      set = {
        filter,
        appliedValues: new Map(),
      }
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

  // Levels are weird. It's the only thing with an OR match and no exclude. Do them special
  levelFilter: Set<string> = new Set();
  setLevelFilter(levels: string[]) {
    this.levelFilter = new Set(levels);
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

  if (!levelMatch(source, collection.levelFilter)) {
    return false;
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

function transformer<K extends keyof ItemSource>(matchFunc: FilterFunction<ItemSource[K]>): FilterFunction<ItemSource[keyof ItemSource]> {
  return matchFunc
}

// When filtering on levels, use an OR match instead of an AND
function levelMatch(source: ItemSource, levels: Set<string>): boolean {
  // Every level is valid if no levels are selected for the filter
  if (levels.size <= 0) {
    return true
  }

  if (levels.has(`${source.level}`)){
    return true
  }
  // Check for cantrip
  if (source?.spell_type === 'Cantrip' && levels.has(cantripFilter)){
    return true
  }
  // Check for focus
  if (source?.spell_type === 'Focus' && levels.has(focusFilter)){
    return true
  }
  console.log(source?.spell_type)
  return false
}