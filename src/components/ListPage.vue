<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { usePersistentAppliedFilters, useFilteredList } from '~/composables/applied-filters';
import { dataImporter, DataType } from '~/composables/data-importer';
import { type Item } from '~/composables/item-types';

const { pageName } = defineProps<{
  pageName: DataType;
}>()

const appliedFilters = usePersistentAppliedFilters(pageName);
const spells: Item[] = [];
let displayedItems: Ref<Item[]> = ref([]);
let filter: Iterator<Item>;
const numItemsToLoad = 20;

// Import the data
const data = dataImporter(pageName, (data) => {
  spells.push(...data as Item[]);
  setupFilter();
});

// Empty the displayed list and create the iterator
// setupFilter is called each time the filters change
function setupFilter() {
  filter = useFilteredList(spells, appliedFilters);
  displayedItems.value = [];
  loadItems();
}

// Load the requested number of items into the displayed list
// loadItems is called for the infinite scroll
function loadItems() {
  for (let i = 0; i < numItemsToLoad; i++) {
    let item = filter.next();
    if (!item.done) {
      displayedItems.value.push(item.value)
    }
  }
}
</script>

<template>
  <FilterManager :pageName="pageName" :appliedFilters="appliedFilters" @change="setupFilter"/>
  <el-divider>
    <el-icon><star-filled /></el-icon>
  </el-divider>
  <div class="cards" v-if="data.isLoaded"  v-infinite-scroll="loadItems">
    <Item v-for="item in displayedItems" :source="item._source" />
  </div>
  <div class="cards" v-else>
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
