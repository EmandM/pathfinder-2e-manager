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
      :color="tag.filter.color"
      @change="() => handleActiveChange(tag)"
      @close="() => removeFilter(tag)" />
  </div>
</template>

<script setup lang="ts">
import Select from './Select.vue';
import { ref, type Ref } from 'vue'
import { allFilters, type Filter } from './filter-descriptions';
import { type AppliedFilterCollection } from '~/composables/applied-filters';
import { type ItemSource } from '~/composables/item-types';

const { pageName, appliedFilters } = defineProps<{
  pageName: string;
  appliedFilters: AppliedFilterCollection;
}>()
const emit = defineEmits<{
  change: []
}>()

type SelectedFilter = {
  displayName: string;
  filter: Filter<keyof ItemSource>;
  selectedValue: string;
  active: boolean;
}

const shownFilters: Ref<Map<string, Filter<keyof ItemSource>>> = ref(new Map());
const options = ref(allFilters.map((filter) => filter.name).sort());
const inUse: Ref<SelectedFilter[]> = ref([]);

appliedFilters.filters.forEach((applied, _) => {
  showFilterSelect(applied.filter.name, true);
  applied.appliedValues.forEach((value) => {
    addFilter(applied.filter.name, value, true);
  })
  emit('change');
});

function showFilterSelect(name: string, init: boolean = false) {
  let newFilter = allFilters.find((filter) => filter.name == name);
  if (newFilter == undefined) {
    console.error("selected filter doesn't exist", name)
    return;
  }
  const filter = Object.assign({}, newFilter);
  filter.options = [...newFilter.options].sort();

  shownFilters.value.set(name, filter);
  options.value = remove(options.value, name);
};

function addFilter(type: string, name: string, init: boolean = false) {
  const tag = type + " - " + name;
  let filter = shownFilters.value.get(type);
  if (!filter) {
    return;
  }
  filter.options = [...remove(filter.options, name)];

  inUse.value.push({
    filter: filter,
    selectedValue: name,
    displayName: tag,
    active: true,
  });
  if (!init) {
    appliedFilters.addFilter(filter, name);
    emit('change');
  }
}

function removeFilter(removeTag: SelectedFilter) {
  let filter = shownFilters.value.get(removeTag.filter.name);
  if (filter) {
    filter.options.push(removeTag.selectedValue);
    filter.options.sort()
  }
  inUse.value = remove(inUse.value, removeTag.displayName, 'displayName');
  appliedFilters.removeFilter(removeTag.filter.key, removeTag.selectedValue);
  emit('change');
};

function handleActiveChange(tag: SelectedFilter) {
  tag.active = !tag.active;
  appliedFilters.toggleFilter(tag.filter.key, tag.selectedValue);
  emit('change');
}

function remove<T>(list: T[], toRemove: T[keyof T], itemKey?: keyof T): T[] {
  const index = list.findIndex((val) => toRemove == (itemKey ? val[itemKey] : val));
  if (index > -1) {
    list.splice(index, 1);
  } else {
    console.error("error removing item", toRemove, "from list", list, "item not found");
  }
  return list;
}

</script>

<style scoped>

</style>