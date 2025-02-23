import { ref, type Ref, reactive, } from "vue";

type AppliedFilter = {
  filterType: String;
  filterValue: String;
};
type AppliedFilterCollection = AppliedFilter[];

const selectedByPage = ref<Map<String, Ref<AppliedFilterCollection>>>(new Map());

export function usePersistAppliedFilters() {
  // local state, created per-component
  const appliedFilters = ref<AppliedFilterCollection>([])

  return {
    appliedFilters,
  }
}