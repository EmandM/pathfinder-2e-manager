<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { dataImporter } from '~/composables/data-importer';
import { type AppliedFilterCollection, usePersistentAppliedFilters } from '~/composables/selected-tags';

export type Item = {
  _source: {
    primary_source: string;
    [key: string]: string;
  }
}

const appliedFilters = usePersistentAppliedFilters('spells');
const spells: Item[] = [];
let displayedSpells: Ref<Item[]> = ref([]);

const data = dataImporter('spells', (data) => {
  spells.push(...data as Item[]);
  filterSpells();
});

function filterSpells() {
  console.log("filtering count before", displayedSpells.value.length);
  displayedSpells.value = spells.filter((item) => appliedFilters.doFilter(item));
  console.log("filtering count after", displayedSpells.value.length);
}

</script>

<template>
  <FilterManager pageName="spells" :appliedFilters="appliedFilters" @change="filterSpells"/>
  <el-divider>
    <el-icon><star-filled /></el-icon>
  </el-divider>
  <div class="cards" v-if="data.isLoaded">
    <Item v-for="spell in displayedSpells" :source="spell._source" />
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
