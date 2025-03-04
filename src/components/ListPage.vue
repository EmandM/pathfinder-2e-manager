<script lang="ts" setup>
import type { Ref } from 'vue'
import type { Card, Filter } from '~/composables/types'
import { ref } from 'vue'
import { useFilteredList, usePersistentAppliedFilters } from '~/composables/applied-filters'
import { useBookmarks } from '~/composables/bookmark-storage'
import { dataImporter } from '~/composables/data-importer'
import { hydrateFilterOptions, useLevelFilter } from '~/composables/hydrate-filters'
import { usePrinter } from '~/composables/print'
import { useFiltersForPage } from './filters/filter-descriptions'

const { pageName } = defineProps<{
  pageName: string
}>()

/*
 * Page behaviour configuration
 */
// Number of cards to load at one time
const numItemsToLoad = 20

/*
 * Empty page state
 * Will be hydrated when the data is loaded
 */
const filterList: Ref<Filter[]> = ref([]) // List of filters for the filter manager
const shortcut: Ref<Filter | undefined> = ref() // Shortcut filter for the filter manager
const cards: Card[] = [] // all cards for the current page
let filter: Iterator<Card> // iterator that has the current filters applied
const displayed: Ref<Card[]> = ref([]) // cards to display (generated from filter)

/*
 * Set up composables
 */
const filters = useFiltersForPage(pageName) // Gets filters that are valid for the current page
const appliedFilters = usePersistentAppliedFilters(pageName) // Gets existing AppliedFilterCollection or creates a new one
const levelFilter = useLevelFilter(pageName)
const goToPrint = usePrinter()
const bookmarker = useBookmarks()

// Import the data
const data = dataImporter(pageName, (data) => {
  // Once the data is imported
  // use the imported data to hydrate the options for the filters
  hydrateFilterOptions(data as Card[], filters)
  filterList.value = filters.selectable
  // push all the data into the card list
  cards.push(...data as Card[])

  // Pre-add the shortcut filters
  if (filters.shortcut) {
    appliedFilters.addShortcutFilter(filters.shortcut)
    shortcut.value = filters.shortcut
  }

  setupFilter()
})

// Empty the displayed list and create the iterator
// setupFilter is called each time the filters change
function setupFilter() {
  filter = useFilteredList(cards, appliedFilters)
  displayed.value = []
  loadItems()
}

// Load the requested number of items into the displayed list
// loadItems is called for the infinite scroll
function loadItems() {
  for (let i = 0; i < numItemsToLoad; i++) {
    const item = filter.next()
    if (!item.done) {
      displayed.value.push(item.value)
    }
  }
}

// Gather all the items that are valid for the current filters
// Pass those items to the usePrint composable to load the print page
function doPrint() {
  const printFilter = useFilteredList(cards, appliedFilters)
  const items = []
  let item = printFilter.next()
  while (!item.done) {
    items.push(item.value)
    item = printFilter.next()
  }
  goToPrint(items)
}
</script>

<template>
  <FilterManager
    :shortcut="shortcut"
    :filter-list="filterList"
    :level-options="levelFilter"
    :applied-filters="appliedFilters"
    @change="setupFilter"
    @print="doPrint"
  />
  <el-divider>
    <el-icon><star-filled /></el-icon>
  </el-divider>
  <div v-if="data.isLoaded" v-infinite-scroll="loadItems" class="cards">
    <Card
      v-for="card in displayed"
      :key="card._id"
      :source="card._source"
      :is-bookmarked="bookmarker.isBookmarked(card)"
      @bookmark-click="bookmarker.toggleBookmark(card)"
    />
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
