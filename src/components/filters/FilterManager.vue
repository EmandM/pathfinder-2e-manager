<script setup lang="ts">
import type { Ref } from 'vue'
import type { Filter } from './filter-descriptions'
import type { AppliedFilterCollection } from '~/composables/applied-filters'
import { ref, watch, watchEffect } from 'vue'
import { capitalizeFirstLetter } from '~/composables/capitalize'
import { remove } from '~/composables/remove'
import { FilterState } from '~/composables/types'
import Select from './Select.vue'

const { filterList, levelOptions, appliedFilters, shortcut, rehydrateCount } = defineProps<{
  filterList: Filter[]
  levelOptions: string[]
  appliedFilters: AppliedFilterCollection
  shortcut?: Filter
  rehydrateCount: number
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

// Shown filters represents the sub dropdown lists
const shownSubDropdowns: Ref<Map<string, Filter>> = ref(new Map())
const mainDropdownOptions = ref(filterList.map(filter => filter.name).sort())
watchEffect(() => mainDropdownOptions.value = filterList.map(filter => filter.name).sort())

const shownFilterTags: Ref<SelectedFilter[]> = ref([])
function updateOptions() {
  for (const filter of shownFilterTags.value) {
    const inputFilter = filterList.find(f => f.key === filter.filter.key)
    if (!inputFilter) {
      console.error('couldn\'t update filter options, filter was undefined, this shouldn\'t happen')
      return
    }
    filter.filter.options = inputFilter.options.sort()
  }
}
// The change in the rehydrate count indicates that the filters have been rehydrated and so need to be redrawn
watch(() => rehydrateCount, updateOptions)

// Display the filters that are already applied (local state)
appliedFilters.filters.forEach((applied, _) => {
  // Don't hydrate the shortcut filter
  if (shortcut && applied.filter.key === shortcut.key) {
    return
  }

  showFilterSelect(applied.filter.name, true)
  applied.appliedOptions.forEach((state, value) => {
    addFilter(applied.filter, value, state)
  })
  emit('change')
})

let shortcutTags: SelectedFilter[] = []
watchEffect(() => {
  shortcutTags = shortcut?.options?.map((opt) => {
    const currentState = appliedFilters.getAppliedState(shortcut, opt)
    return {
      filter: shortcut,
      selectedValue: opt,
      displayName: capitalizeFirstLetter(opt),
      initialState: currentState || FilterState.inactive,
    }
  }) || []
})

function onChange() {
  emit('change')
  // setTimeout(updateOptions)
}

function showFilterSelect(name: string, init: boolean = false) {
  const newFilter = filterList.find(filter => filter.name === name)
  if (newFilter === undefined) {
    console.warn('selected filter doesn\'t exist', name)
    return
  }

  if (newFilter.isSingleOption) {
    addFilter(newFilter, '')
  }
  else {
    // Do a deep object copy of the filter so we don't intefer with underlying state
    const filter: Filter = newFilter
    const existing = appliedFilters.filters.get(newFilter.key)

    if (!existing || init) {
      filter.options = [...newFilter.options].sort()
    }
    else {
      // if filters are already applied from this select, remove their values from the filter.
      filter.options = [...newFilter.options.filter(val => !existing.appliedOptions.has(val))].sort()
    }

    shownSubDropdowns.value.set(name, filter)
  }

  mainDropdownOptions.value = remove(mainDropdownOptions.value, name)
};

function hideFilterSelect(name: string) {
  mainDropdownOptions.value.push(name)
  mainDropdownOptions.value.sort()
  shownSubDropdowns.value.delete(name)
};

function addFilter(filter: Filter, selected: string, initialState?: FilterState) {
  // If this filter is not a single option, remove this option from the list of options
  if (!filter.isSingleOption) {
    filter.options = [...remove(filter.options, selected)]
    shownSubDropdowns.value.set(filter.name, filter)
  }

  shownFilterTags.value.push({
    filter,
    selectedValue: selected,
    displayName: filter.getTag(selected),
    initialState,
  })

  // initialState is only passed on page load. We don't want to edit the filter list on page load.
  if (!initialState) {
    appliedFilters.addFilter(filter, selected)
    onChange()
  }
}

function removeFilterTag(removeTag: SelectedFilter) {
  if (removeTag.filter.isSingleOption) {
    // If it's a single option tag, add it back to the main dropdown
    mainDropdownOptions.value.push(removeTag.filter.name)
    mainDropdownOptions.value.sort()
  }
  else {
    // Otherwise add it back to the sub-dropdown
    const subDropdown = shownSubDropdowns.value.get(removeTag.filter.name)
    if (subDropdown) {
      subDropdown.options.push(removeTag.selectedValue)
      subDropdown.options.sort()
    }
  }

  // Remove from the tag display
  shownFilterTags.value = remove(shownFilterTags.value, removeTag.displayName, 'displayName')
  // Remove from doing the filter for the cards
  appliedFilters.removeFilter(removeTag.filter.key, removeTag.selectedValue)
  // Call onChange so that we can re-filter
  onChange()
};

function handleTagState(tag: SelectedFilter, state: FilterState) {
  console.log('Updating tag ', tag, 'to state', tag.selectedValue, state)
  appliedFilters.updateState(tag.filter.key, tag.selectedValue, state)
  onChange()
}

function handleLevelFilter(selected: string[]) {
  appliedFilters.setLevelFilter(selected)
  onChange()
}

function handleSearch(search: string) {
  appliedFilters.setSearchString(search)
  onChange()
}
</script>

<template>
  <div class="shortcutAndPrint manager-row flex">
    <div class="flex grow flex-wrap">
      <FilterTag
        v-for="tag in shortcutTags"
        :key="tag.displayName"
        :title="tag.displayName"
        :initial-state="tag.initialState"
        :color="tag.filter.color"
        @change="(newState: FilterState) => handleTagState(tag, newState)"
      />
    </div>

    <el-button type="primary" class="print-button" @click="emit('print')">
      Print
      <el-icon class="el-icon--right">
        <i-msl-print-outline />
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

    <Select title="Choose a filter" :options="mainDropdownOptions" @change="showFilterSelect" />

    <Select
      v-for="[name, item] in shownSubDropdowns"
      :key="name"
      :title="item.name"
      :options="item.options"
      is-closable
      @change="(value: string) => addFilter(item, value)"
      @close="() => hideFilterSelect(item.name)"
    />
  </div>
  <div class="selected-filters manager-row">
    <FilterTag
      v-for="tag in shownFilterTags"
      :key="tag.displayName"
      :title="tag.displayName"
      :initial-state="tag.initialState"
      :color="tag.filter.color"
      closable
      @change="(newState: FilterState) => handleTagState(tag, newState)"
      @close="() => removeFilterTag(tag)"
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
