<script lang="ts" setup>
import type { Ref } from 'vue'
import type { Filter } from './filters/filter-descriptions'
import type { Item } from '~/composables/item-types'
import { ref } from 'vue'
import { useFilteredList, usePersistentAppliedFilters } from '~/composables/applied-filters'
import { dataImporter } from '~/composables/data-importer'
import { hydrateFilterOptions } from '~/composables/hydrate-filters'
import { useFiltersForPage } from './filters/filter-descriptions'

const { pageName } = defineProps<{
  pageName: string
}>()

const filters: Filter[] = useFiltersForPage(pageName)
const filterList: Ref<Filter[]> = ref([])
const appliedFilters = usePersistentAppliedFilters(pageName)
const spells: Item[] = []
const displayedItems: Ref<Item[]> = ref([])
let filter: Iterator<Item>
const numItemsToLoad = 20

// Import the data
const data = dataImporter(pageName, (data) => {
  filterList.value = hydrateFilterOptions(data as Item[], filters)
  spells.push(...data as Item[])
  setupFilter()
})

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
  <FilterManager :filter-list="filterList" :applied-filters="appliedFilters" @change="setupFilter" />
  <el-divider>
    <el-icon><star-filled /></el-icon>
  </el-divider>
  <div v-if="data.isLoaded" v-infinite-scroll="loadItems" class="cards">
    <Item v-for="item in displayedItems" :key="item._id" :source="item._source" />
  </div>
  <div v-else class="cards">
    Loading!
  </div>
</template>

<style lang="scss" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(3, 245px);
  justify-content: start;
}
</style>
