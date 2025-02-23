<script lang="ts" setup>
import { repository } from '~/../package.json'

import spells from '~/assets/data/spell.json'
</script>

<template>
  <div class="spells">
    <div v-for="spell in spells">
      {{spell._source.markdown}}
    </div>
  </div>
</template>

<style lang="scss">
</style>
