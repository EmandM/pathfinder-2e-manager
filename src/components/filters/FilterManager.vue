<script setup lang="ts">
import type { Ref } from 'vue'
import type { AppliedFilterCollection } from '~/composables/applied-filters'
import type { Filter } from '~/composables/item-types'
import { ref, watchEffect } from 'vue'
import { capitalizeFirstLetter } from '~/composables/capitalize'
import { FilterState } from '~/composables/item-types'
import Select from './Select.vue'

const { filterList, appliedFilters, shortcut } = defineProps<{
  filterList: Filter[]
  levelOptions: string[]
  appliedFilters: AppliedFilterCollection
  shortcut?: Filter
}>()
const emit = defineEmits<{
  change: []
  print: []
}>()

interface SelectedFilter {
  displayName: string
  filter: Filter
  selectedValue: string
  initialState?: FilterState
}

const shownFilters: Ref<Map<string, Filter>> = ref(new Map())
const options = ref(filterList.map(filter => filter.name).sort())
watchEffect(() => options.value = filterList.map(filter => filter.name).sort())

const inUse: Ref<SelectedFilter[]> = ref([])
appliedFilters.filters.forEach((applied, _) => {
  // Don't hydrate the shortcut filter
  if (applied.filter.key === shortcut.key) {
    return
  }

  showFilterSelect(applied.filter.name, true)
  applied.appliedValues.forEach((state, value) => {
    addFilter(applied.filter.name, value, state)
  })
  emit('change')
})

let shortcutTags: SelectedFilter[] = []
watchEffect(() => shortcutTags = shortcut.options.map((opt) => {
  return {
    filter: shortcut,
    selectedValue: opt,
    displayName: capitalizeFirstLetter(opt),
    initialState: FilterState.inactive,
  }
}))

function showFilterSelect(name: string, init: boolean = false) {
  const newFilter = filterList.find(filter => filter.name === name)
  if (newFilter === undefined) {
    console.error('selected filter doesn\'t exist', name)
    return
  }

  // Do a deep object copy of the filter so we don't intefer with underlying state
  const filter: Filter = Object.assign({}, newFilter)
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

function addFilter(type: string, name: string, initialState?: FilterState) {
  const tag = `${type} - ${capitalizeFirstLetter(name)}`
  const filter = shownFilters.value.get(type)
  if (!filter) {
    return
  }
  filter.options = [...remove(filter.options, name)]

  inUse.value.push({
    filter,
    selectedValue: name,
    displayName: tag,
    initialState,
  })

  // initialState is only passed on page load. We don't want to edit the filter list on page load.
  if (!initialState) {
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

function handleTagState(tag: SelectedFilter, state: FilterState) {
  appliedFilters.updateState(tag.filter.key, tag.selectedValue, state)
  emit('change')
}

function handleLevelFilter(selected: string[]) {
  appliedFilters.setLevelFilter(selected)
  emit('change')
}

function handleSearch(search: string) {
  appliedFilters.setSearchString(search)
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
  <div class="shortcutAndPrint manager-row flex">
    <FilterTag
      v-for="tag in shortcutTags"
      :key="tag.displayName"
      :title="tag.displayName"
      :initial-state="tag.initialState"
      :color="tag.filter.color"
      @change="(newState: FilterState) => handleTagState(tag, newState)"
    />

    <el-button type="primary" class="print-button" @click="emit('print')">
      Print
      <el-icon class="el-icon--right">
        <Printer />
      </el-icon>
    </el-button>
  </div>
  <div class="manager-row flex flex-wrap gap-4">
    <Search :initial-value="appliedFilters.searchString" @change="handleSearch" />

    <ButtonFilter
      :options="levelOptions"
      :initial-selected="[...appliedFilters.levelFilter]"
      @change="handleLevelFilter"
    />

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
  <div class="selected-filters manager-row">
    <FilterTag
      v-for="tag in inUse"
      :key="tag.displayName"
      :title="tag.displayName"
      :initial-state="tag.initialState"
      :color="tag.filter.color"
      closable
      @change="(newState: FilterState) => handleTagState(tag, newState)"
      @close="() => removeFilter(tag)"
    />
  </div>
</template>

<style scoped>
.print-button {
  padding: 8px;
  margin-left: auto;
}
.manager-row {
  margin: 8px;
}
</style>
