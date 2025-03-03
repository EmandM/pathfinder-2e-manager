<script lang="ts" setup>
import type { Ref } from 'vue'
import type { Filter, Item } from '~/composables/item-types'
import { ref } from 'vue'
import { useFilteredList, usePersistentAppliedFilters } from '~/composables/applied-filters'
import { dataImporter } from '~/composables/data-importer'
import { hydrateFilterOptions, hydrateLevelFilter } from '~/composables/hydrate-filters'
import { useFiltersForPage } from './filters/filter-descriptions'

const { pageName } = defineProps<{
  pageName: string
}>()

const filterList: Ref<Filter[]> = ref([])
const appliedFilters = usePersistentAppliedFilters(pageName)
const spells: Item[] = []
const displayedItems: Ref<Item[]> = ref([])
let filter: Iterator<Item>
const numItemsToLoad = 20
const filters = useFiltersForPage(pageName)

// Import the data
const data = dataImporter(pageName, (data) => {
  filterList.value = hydrateFilterOptions(data as Item[], [...filters.selectable, filters.shortcut])
  spells.push(...data as Item[])

  // Pre-add the shortcut filters
  if (filters.shortcut) {
    appliedFilters.addShortcutFilter(filters.shortcut)
  }
  setupFilter()
})
const levelFilter = hydrateLevelFilter(pageName)

// Empty the displayed list and create the iterator
// setupFilter is called each time the filters change
function setupFilter() {
  filter = useFilteredList(spells, appliedFilters)
  displayedItems.value = []
  loadItems()
}

// Load the requested number of items into the displayed list
// loadItems is called for the infinite scroll
function loadItems() {
  for (let i = 0; i < numItemsToLoad; i++) {
    const item = filter.next()
    if (!item.done) {
      displayedItems.value.push(item.value)
    }
  }
}
</script>

<template>
  <FilterManager
    :shortcut="filters.shortcut"
    :filter-list="filterList"
    :level-options="levelFilter"
    :applied-filters="appliedFilters"
    @change="setupFilter"
  />
  <el-divider>
    <el-icon><star-filled /></el-icon>
  </el-divider>
  <div v-if="data.isLoaded" v-infinite-scroll="loadItems" class="cards">
    <Card v-for="item in displayedItems" :key="item._id" :source="item._source" />
  </div>
  <div v-else class="cards">
    Loading!
  </div>
</template>

<style lang="scss" scoped>
.cards {
  margin: auto;
}
@media (min-width: 576px) {
  .cards {
    max-width: 540px;
  }
}
@media (min-width: 768px) {
  .cards {
    max-width: 720px;
  }
}
@media (min-width: 992px) {
  .cards {
    max-width: 960px;
  }
}
@media (min-width: 1200px) {
  .cards {
    max-width: 1140px;
  }
}
</style>
