<script lang="ts" setup>
import { dataImporter } from '~/composables/data-importer';

let data = dataImporter('spells');


function GetSpells() {
  if (!data.data) {
    return;
  }
  return data.data.filter(s => s._source.primary_source == "Player Core");
}

</script>

<template>
  <div class="spells">
    <div v-if="data.data" v-for="spell in GetSpells()">
      <Item :markdown="spell._source.markdown" />
    </div>
  </div>
</template>

<style lang="scss">
</style>
