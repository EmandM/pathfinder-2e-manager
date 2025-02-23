import { ref, type Ref, reactive, } from "vue";

export type AppliedFilter = {
  filterType: string;
  filterValue: string;
};
type AppliedFilterCollection = AppliedFilter[];

// Global state
const selectedByPage = ref<Map<string, Ref<AppliedFilterCollection>>>(new Map());

export function usePersistentAppliedFilters(pageName: string): Ref<AppliedFilterCollection> {
  let appliedFilters = selectedByPage.value.get(pageName);
  if (!appliedFilters) {
    appliedFilters = ref<AppliedFilterCollection>([]);
    selectedByPage.value.set(pageName, appliedFilters);
  }

  return appliedFilters;
}

