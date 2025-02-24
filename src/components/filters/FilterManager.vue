<template>
  <div class="flex flex-wrap gap-4">
    <Select title="Choose a filter" :options=options @change="showFilterSelect" />

    <Select
        v-for="[_, item] in shownFilters"
        :title="item.name"
        :options="item.options"
        @change="(value: string) => addFilter(item.name, value)"
      />
  </div>
  <div class="selected filters">
    <FilterTag v-for="tag in inUse"
      :title="tag.displayName"
      :active="tag.active"
      :color="tag.color"
      @change="() => handleActiveChange(tag)"
      @close="() => removeFilter(tag)" />
  </div>
</template>

<script setup lang="ts">
import Select from './Select.vue';
import { ref, type Ref } from 'vue'
import { allFilters, type Filter } from './filter-descriptions';
import { type AppliedFilterCollection, usePersistentAppliedFilters, type AppliedFilter } from '~/composables/selected-tags';

const { pageName, appliedFilters } = defineProps<{
  pageName: string;
  appliedFilters: AppliedFilterCollection;
}>()
const emit = defineEmits<{
  change: [value: AppliedFilterCollection]
}>()

type SelectedFilter = {
  type: string;
  value: string;
  displayName: string;
  active: boolean;
  color: string
}

const shownFilters: Ref<Map<string, Filter>> = ref(new Map());
const options = ref(allFilters.map((filter) => filter.name).sort());
const inUse: Ref<SelectedFilter[]> = ref([]);

for (var i=0; i<appliedFilters.length; i++) {
  let filter = appliedFilters[i];
  if (!shownFilters.value.has(filter.filterType)) {
    showFilterSelect(filter.filterType, true);
  }
  addFilter(filter.filterType, filter.filterValue, true);
}

function updateAppliedFilters() {
  const updatedFilters = inUse.value
    .filter((fil) => fil.active)
    .map<AppliedFilter>((fil) => {
      return {
        filterType: fil.type,
        filterValue: fil.value,
      } as AppliedFilter;
    });
  emit('change', updatedFilters)
}

function showFilterSelect(name: string, init: boolean = false) {
  let newFilter = allFilters.find((filter) => filter.name == name);
  if (newFilter == undefined) {
    console.error("selected filter doesn't exist", name)
    return;
  }
  shownFilters.value.set(name, newFilter);
  remove(options.value, (opt) => opt == name);
  if (!init) {
    updateAppliedFilters();
  }
};

function addFilter(type: string, name: string, init: boolean = false) {
  const tag = type + " - " + name;
  let baseFilter = shownFilters.value.get(type);
  if (!baseFilter) {
    return;
  }
  const filter = Object.assign({}, baseFilter);
  filter.options = [...baseFilter.options];

  remove(filter.options, (obj) => obj == name);
  inUse.value.push({
    type,
    value: name,
    displayName: tag,
    active: true,
    color: filter?.color,
  });

  if (!init) {
    updateAppliedFilters();
  }
}

const removeFilter = (removeTag: SelectedFilter) => {
  console.log(removeTag);
  let filter = shownFilters.value.get(removeTag.type);
  if (filter) {
    filter.options.push(removeTag.value);
    filter.options.sort()
  }
  remove(inUse.value, (tag) => tag.displayName == removeTag.displayName);
};

function handleActiveChange(tag: SelectedFilter) {
  tag.active = !tag.active;
  updateAppliedFilters();
}

function remove<T>(list: T[], predicate: (item: T) => boolean): void {
  const index = list.findIndex(predicate);
  if (index > -1) {
    list.splice(index, 1);
  }
}

</script>

<style scoped>

</style>