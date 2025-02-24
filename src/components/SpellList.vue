<script lang="ts" setup>
import spellImport from '~/assets/data/spell.json';
import { AppliedFilterCollection, usePersistentAppliedFilters } from '~/composables/selected-tags';

export type Item = {
  _source: {
    primary_source: string;
    [key: string]: string;
  }
}

const spells = [...spellImport as Item[]]
let displayedSpells = [] as Item[];
filterSpells([]);

const appliedFilters = usePersistentAppliedFilters('spells');

function filterSpells(filters: AppliedFilterCollection) {
  console.log('calling filter')
  displayedSpells = spells.filter(s => s._source.primary_source == "Player Core");
}

</script>

<template>
  <FilterManager pageName="spells" :appliedFilters="appliedFilters" @change="filterSpells"/>
  <el-divider>
    <el-icon><star-filled /></el-icon>
  </el-divider>
  <div class="spells">
    <div v-for="spell in displayedSpells">
      <Item :markdown="spell._source.markdown" />
    </div>
  </div>
</template>

<style lang="scss">
</style>
