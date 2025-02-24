import { ref, type Ref, reactive, } from "vue";
import { Item } from "./data-importer";

export class AppliedFilterCollection {
  filters: Map<string, Map<string, AppliedFilter>> = new Map();

  addFilter(type: string, value: string) {
    let set = this.filters.get(type);
    if (!set) {
      set = new Map();
      this.filters.set(type, set)
    }

    set.set(value, {
      filterType: type,
      filterValue: value,
      enabled: true,
    });
  }

  removeFilter(type: string, value: string) {
    let set = this.filters.get(type);
    if (!set) {
      console.error("tried to remove a tag that was never added");
      return;
    }
    set.delete(value);
    if (set.entries.length == 0) {
      this.filters.delete(type);
    }
  }

  toggleFilter(type: string, value: string) {
    let filter = this.filters.get(type)?.get(value);
    if (!filter) {
      console.error("tried to toggle a tag that was never added");
      return;
    }
    filter.enabled = !filter.enabled;
  }

  doFilter(item: Item): boolean {
    let source = item._source;

    for (let [type, filters] of this.filters) {
      let itemKey = source[type];
      if (!itemKey) {
        return false;
      }

      for (let [value, filter] of filters) {
        if (!filter.enabled) {
          continue;
        }

        if (!itemKey.includes(filter.filterValue)) {
          return false;
        }
      }
    }

    return true;
  }
}

export type AppliedFilter = {
  filterType: string;
  filterValue: string;
  enabled: boolean;
};
// export type AppliedFilterCollection = AppliedFilter[];

// Global state
const selectedByPage = ref<Map<string, AppliedFilterCollection>>(new Map());

export function usePersistentAppliedFilters(pageName: string): AppliedFilterCollection {
  let appliedFilters = selectedByPage.value.get(pageName);
  if (!appliedFilters) {
    appliedFilters = new AppliedFilterCollection();
    selectedByPage.value.set(pageName, appliedFilters);
  }

  return appliedFilters;
}

