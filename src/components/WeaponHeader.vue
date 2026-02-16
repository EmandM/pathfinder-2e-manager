<script setup lang="ts">
import type { Card } from '~/composables/types'
import { useDiceImage, useStatBlock, useWeaponTypeImage } from '~/composables/image-finder'

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
        <img :src="useDiceImage(source.damage_die)" class="dice-icon" :alt="source.damage">
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
.weapon-icon {
  height: 30px;
  padding-right: 0.2em;
  padding-bottom: 0.1em;
  vertical-align: middle;
}

.dark .weapon-icon {
  -webkit-filter: invert(1);
  filter: invert(1);
}

.dice-icon {
  vertical-align: middle;
  -webkit-filter: invert(1);
  filter: invert(1);
}

.dark .dice-icon {
  -webkit-filter: invert(0);
  filter: invert(0);
}

.stat-block {
  display: inline-grid;
  width: 6.5em;
  padding-right: 0.3em;
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

.dark .stat-block-icon {
  -webkit-filter: invert(1);
  filter: invert(1);
}
</style>
