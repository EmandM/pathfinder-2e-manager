<script setup lang="ts">
import { loadItemsToPrint } from '~/composables/print'

const items = loadItemsToPrint()
</script>

<template>
  <div class="cards">
    <Card v-for="item in items" :key="item.id" :source="item" is-print />
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(3, 245px);
  justify-content: start;
}
</style>
