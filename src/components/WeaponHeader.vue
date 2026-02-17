<script setup lang="ts">
import type { Card } from '~/composables/types'
import { useStatBlock, useWeaponTypeImage } from '~/composables/image-finder'

const { source } = defineProps<{
  source: Card
}>()
</script>

<template>
  <div style="margin-top: 2px">
    <div style="display: flex; flex-wrap: wrap">
      <img :src="useWeaponTypeImage(source.weapon_type)" class="weapon-icon" alt="Dice to hit">
      <div class="stat-block">
        <img :src="useStatBlock()" class="stat-block-icon" alt="Stat block">
        <div class="stat-block-title">
          <b v-if="source.weapon_type === 'Ranged'">Dex</b><b v-else>Str</b><b>Prof</b><b>Item</b>
        </div>
      </div>
      <div v-if="source.damage_die > 1" style="display: flex; flex: 1">
        <div class="dicier">D{{ source.damage_die }}</div>
        <span style="flex: 1" />
        <div style="flex-direction: column; display: flex;">
          <span style="font-size: 0.9em; height: 9px">O <b>B</b></span>
          <span style="font-size: 0.9em; height: 9px">O <b>P</b></span>
          <span style="font-size: 0.9em; height: 9px">O <b>S</b></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@font-face {
  font-family: Dicier;
  src: url('/fonts/Dicier/Dicier-Round-Light.woff2');
}

.dicier {
  font-family: Dicier, sans-serif;
  font-feature-settings: 'cv24' 1;
  font-size: 28px;
  line-height: 1.2;
  color: brown;
  margin-bottom: -2em;
}

.weapon-icon {
  height: 32px;
  padding-right: 0.2em;
  padding-bottom: 0.1em;
  vertical-align: middle;
  // This changes Black image to Brown (https://codepen.io/sosuke/pen/Pjoqqp)
  -webkit-filter: invert(22%) sepia(48%) saturate(2931%) hue-rotate(339deg) brightness(89%) contrast(92%);
  filter: invert(22%) sepia(48%) saturate(2931%) hue-rotate(339deg) brightness(89%) contrast(92%);
}

.dice-icon {
  vertical-align: middle;
  -webkit-filter: invert(1);
  filter: invert(1);
}

.stat-block {
  display: inline-grid;
  width: 6.5em;
  padding-right: 0.4em;
}

.stat-block-title {
  display: flex;
  justify-content: space-evenly;
}

.stat-block-title b {
  font-weight: 700;
  font-size: 0.8em;
}

.stat-block-icon {
  width: 100%;
  height: auto;
}
</style>
