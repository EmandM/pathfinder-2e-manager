<script lang="ts" setup>
import type { Ref } from 'vue'
import type { Filter } from './filters/filter-descriptions'
import type { Card } from '~/composables/types'
import { ref } from 'vue'
import { useFilteredList, usePersistentAppliedFilters } from '~/composables/applied-filters'
import { useBookmarks } from '~/composables/bookmark-storage'
import { dataImporter } from '~/composables/data-importer'
import { usePrinter } from '~/composables/print'
import { useFiltersForPage, useLevelFilter } from './filters/filter-descriptions'

const { pageName } = defineProps<{
  pageName: string
}>()

/*
 * Page behaviour configuration
 */
let offset = 0
const limit = 50

/*
 * Empty page state
 * Will be hydrated when the data is loaded
 */
const filterList: Ref<Filter[]> = ref([]) // List of filters for the filter manager
const shortcut: Ref<Filter | undefined> = ref() // Shortcut filter for the filter manager
const cards: Card[] = [] // all cards for the current page
let filteredCards: Card[] = [] // all cards that match the current applied filters
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
  // push all the data into the card list
  cards.push(...data as Card[])

  // Pre-add the shortcut filters
  if (filters.shortcut) {
    filters.shortcut.hydrate(cards)
    shortcut.value = filters.shortcut

    appliedFilters.addShortcutFilter(filters.shortcut)
  }

  doFilter()
})

// Called each time the filters change
function doFilter() {
  console.log('filtering')

  filteredCards = useFilteredList(cards, appliedFilters)

  // Use the filtered cards to update the options for the filters
  for (const filter of filters.selectable) {
    filter.hydrate(filteredCards, appliedFilters.getAppliedValues(filter))
  }

  displayed.value = []
  offset = 0
  loadItems()
}

// Load the requested number of items into the displayed list
// loadItems is called for the infinite scroll
function loadItems() {
  console.log('loading items')
  if (offset === filteredCards.length) {
    console.log('at end')
    return
  }
  const nextLimit = Math.min(offset + limit, filteredCards.length)
  displayed.value.push(...filteredCards.slice(offset, nextLimit))
  offset = nextLimit
}

// Gather all the items that are valid for the current filters
// Pass those items to the usePrint composable to load the print page
function doPrint() {
  goToPrint(filteredCards)
}
</script>

<template>
  <FilterManager
    :shortcut="shortcut"
    :filter-list="filterList"
    :level-options="levelFilter"
    :applied-filters="appliedFilters"
    @change="doFilter"
    @print="doPrint"
  />
  <el-divider>
    <el-icon><i-msl-star-rounded /></el-icon>
  </el-divider>
  <div v-if="data.isLoaded" v-infinite-scroll="loadItems" infinite-scroll-distance="500" class="cards">
    <Card
      v-for="card in displayed"
      :key="card.id"
      :source="card"
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
