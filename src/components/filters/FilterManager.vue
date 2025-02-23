<template>
  <div class="flex flex-wrap gap-4">
    <Select title="Choose a filter" :options=options @change="showFilterSelect" />

    <Select
        v-for="[_, item] in shownFilters"
        :title="item.name"
        :options="item.options"
        @change="(value: String) => addFilter(item.name, value)"
      />
  </div>
  <div class="selected filters">
    <FilterTag v-for="tag in inUse"
      :title="tag.displayName"
      :active="tag.active"
      :color="tag.color"
      @change="() => tag.active = !tag.active"
      @close="() => removeFilter(tag)" />
  </div>
</template>

<script setup lang="ts">
import Select from './Select.vue';
import { ref, type Ref } from 'vue'
import { allFilters, type Filter } from './filter-descriptions';

const shownFilters: Ref<Map<String, Filter>> = ref(new Map());
const options = ref(allFilters.map((filter) => filter.name).sort());

function remove<T>(list: T[], predicate: (item: T) => boolean): boolean {
  const index = list.findIndex(predicate);
  console.log("findindex", index);
  if (index > -1) {
    list.splice(index, 1);
    console.log("did splice", list);
    return true;
  }
  return false;
}

const showFilterSelect = (name: String) => {
  let newFilter = allFilters.find((filter) => filter.name == name);
  if (newFilter == undefined) {
    console.error("selected filter doesn't exist", name)
    return;
  }
  shownFilters.value.set(name, newFilter);
  remove(options.value, (opt) => opt == name);
};

type SelectedFilter = {
  type: String;
  value: String;
  displayName: String;
  active: boolean;
  color: String
}
const inUse: Ref<SelectedFilter[]> = ref([]);

function addFilter(type: String, name: String) {
  const tag = type + " - " + name;
  let filter = shownFilters.value.get(type)
  if (!filter) {
    return;
  }
  
  remove(filter.options, (obj) => obj == name);
  inUse.value.push({
    type,
    value: name,
    displayName: tag,
    active: true,
    color: filter?.color,
  });
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


</script>

<style scoped>

</style>