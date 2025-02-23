<script lang="ts" setup>
import { repository } from '~/../package.json'

import markdownit from 'markdown-it'
const md = markdownit({html: true, breaks: true})

import spells from '~/assets/data/spell.json'

function GetSpells() {
  return spells.filter(s => s._source.primary_source == "Player Core");
}

</script>

<template>
  <div class="spells">
    <div v-for="spell in GetSpells()">
      <span v-html="md.render(spell._source.markdown)" />
    </div>
  </div>
</template>

<style lang="scss">
</style>
