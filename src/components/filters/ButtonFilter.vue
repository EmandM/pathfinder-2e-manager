<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'

const { options, initialSelected } = defineProps<{
  options: string[]
  initialSelected?: string[]
}>()
const emit = defineEmits<{
  change: [value: string[]]
}>()

const selected: Ref<string[]> = ref(initialSelected || [])
const isEven = options ? !(options.length % 2) : false;
</script>

<template>
  <div>
    <div>
      <el-checkbox-group v-model="selected" @change="emit('change', selected)">
        <el-checkbox-button v-for="(opt, index) in options" :key="opt" :value="opt" :class="{ penultimate: index === (options.length - 2), evenCount: isEven, isEven: !!(index % 2) }">
          {{ opt }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
  </div>
</template>

<style scoped>
.ep-checkbox-group {
  display: grid;
  grid-template-rows: repeat(2, 31px);
  grid-auto-flow: column;
}
.ep-checkbox-button:deep() .ep-checkbox-button__inner {
  padding: 8px;
  height: 31px;
  width: 32px;
}

.ep-checkbox-button.is-checked:deep() .ep-checkbox-button__inner {
  background-color: var(--ep-color-primary-light-9);
  color: black;
}

.ep-checkbox-button.is-checked:deep() .ep-checkbox-button__inner {
  background-color: var(--ep-color-primary-light-9);
  color: black;
}

/* Round the corner of the border */
.ep-checkbox-button:first-child:deep() .ep-checkbox-button__inner {
  border-bottom-left-radius: 0;
}
.ep-checkbox-button:nth-child(2):deep() .ep-checkbox-button__inner {
  border-bottom-left-radius: var(--ep-border-radius-base);
  border: var(--ep-border);
}
.ep-checkbox-button:last-child.evenCount:deep() .ep-checkbox-button__inner {
  border-top-right-radius: 0;
}
.ep-checkbox-button.penultimate:not(.evenCount):deep() .ep-checkbox-button__inner {
  border-bottom-right-radius: var(--ep-border-radius-base);
}
.ep-checkbox-button.penultimate.evenCount:deep() .ep-checkbox-button__inner {
  border-top-right-radius: var(--ep-border-radius-base);
}

.ep-checkbox-button.isEven:deep() .ep-checkbox-button__inner {
  border-top-color: transparent;
}
.ep-checkbox-button:nth-child(n+3):deep() .ep-checkbox-button__inner {
  border-left-color: transparent;
}

.ep-checkbox-button.is-checked:deep() .ep-checkbox-button__inner {
  background-color: var(--ep-color-primary-light-9);
  border-color: var(--ep-checkbox-button-checked-border-color);
  color: black;
}


</style>
