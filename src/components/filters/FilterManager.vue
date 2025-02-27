<script setup lang="ts">
import type { Ref } from 'vue'
import type { Filter } from './filter-descriptions'
import type { AppliedFilterCollection } from '~/composables/applied-filters'
import { ref, watchEffect } from 'vue'
import Select from './Select.vue'

const { filterList, appliedFilters } = defineProps<{
  filterList: Filter[]
  appliedFilters: AppliedFilterCollection
}>()
const emit = defineEmits<{
  change: []
}>()

interface SelectedFilter {
  displayName: string
  filter: Filter
  selectedValue: string
  active: boolean
}

const shownFilters: Ref<Map<string, Filter>> = ref(new Map())
const options = ref(filterList.map(filter => filter.name).sort())
watchEffect(() => options.value = filterList.map(filter => filter.name).sort())
const inUse: Ref<SelectedFilter[]> = ref([])

appliedFilters.filters.forEach((applied, _) => {
  showFilterSelect(applied.filter.name, true)
  applied.appliedValues.forEach((value) => {
    addFilter(applied.filter.name, value, true)
  })
  emit('change')
})

function showFilterSelect(name: string, init: boolean = false) {
  const newFilter = filterList.find(filter => filter.name === name)
  if (newFilter === undefined) {
    console.error('selected filter doesn\'t exist', name)
    return
  }

  // Do a deep object copy of the filter so we don't intefer with underlying state
  const filter = Object.assign({}, newFilter)
  const existing = appliedFilters.filters.get(newFilter.key)
  if (!existing || init) {
    filter.options = [...newFilter.options].sort()
  }
  else {
    // if filters are already applied from this select, remove their values from the filter.
    filter.options = [...newFilter.options.filter(val => !existing.appliedValues.has(val))].sort()
  }

  shownFilters.value.set(name, filter)
  options.value = remove(options.value, name)
};

function hideFilterSelect(name: string) {
  options.value.push(name)
  options.value.sort()
  shownFilters.value.delete(name)
};

function addFilter(type: string, name: string, init: boolean = false) {
  const tag = `${type} - ${name}`
  const filter = shownFilters.value.get(type)
  if (!filter) {
    return
  }
  filter.options = [...remove(filter.options, name)]

  inUse.value.push({
    filter,
    selectedValue: name,
    displayName: tag,
    active: true,
  })
  if (!init) {
    appliedFilters.addFilter(filter, name)
    emit('change')
  }
}

function removeFilter(removeTag: SelectedFilter) {
  const filter = shownFilters.value.get(removeTag.filter.name)
  if (filter) {
    filter.options.push(removeTag.selectedValue)
    filter.options.sort()
  }
  inUse.value = remove(inUse.value, removeTag.displayName, 'displayName')
  appliedFilters.removeFilter(removeTag.filter.key, removeTag.selectedValue)
  emit('change')
};

function handleActiveChange(tag: SelectedFilter) {
  tag.active = !tag.active
  appliedFilters.toggleFilter(tag.filter.key, tag.selectedValue)
  emit('change')
}

function remove<T>(list: T[], toRemove: T[keyof T], itemKey?: keyof T): T[] {
  const index = list.findIndex(val => toRemove === (itemKey ? val[itemKey] : val))
  if (index > -1) {
    list.splice(index, 1)
  }
  else {
    console.error('error removing item', toRemove, 'from list', list, 'item not found')
  }
  return list
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <LevelFilter />
    <Select title="Choose a filter" :options="options" @change="showFilterSelect" />

    <Select
      v-for="[name, item] in shownFilters"
      :key="name"
      :title="item.name"
      :options="item.options"
      is-closable
      @change="(value: string) => addFilter(item.name, value)"
      @close="() => hideFilterSelect(item.name)"
    />
  </div>
  <div class="selected filters">
    <FilterTag
      v-for="tag in inUse"
      :key="tag.displayName"
      :title="tag.displayName"
      :active="tag.active"
      :color="tag.filter.color"
      @change="() => handleActiveChange(tag)"
      @close="() => removeFilter(tag)"
    />
  </div>
</template>

<style scoped>

</style>
