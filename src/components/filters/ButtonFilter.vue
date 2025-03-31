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
const isEven = options ? !(options.length % 2) : false
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
.el-checkbox-group {
  display: grid;
  grid-template-rows: repeat(2, 31px);
  grid-auto-flow: column;
}
.el-checkbox-button:deep() .el-checkbox-button__inner {
  padding: 8px;
  height: 31px;
  width: 32px;
}

.el-checkbox-button.is-checked:deep() .el-checkbox-button__inner {
  background-color: var(--el-color-primary-light-9);
  color: black;
}

.el-checkbox-button.is-checked:deep() .el-checkbox-button__inner {
  background-color: var(--el-color-primary-light-9);
  color: black;
}

/* Round the corner of the border */
.el-checkbox-button:first-child:deep() .el-checkbox-button__inner {
  border-bottom-left-radius: 0;
}
.el-checkbox-button:nth-child(2):deep() .el-checkbox-button__inner {
  border-bottom-left-radius: var(--el-border-radius-base);
  border: var(--el-border);
}
.el-checkbox-button:last-child.evenCount:deep() .el-checkbox-button__inner {
  border-top-right-radius: 0;
}
.el-checkbox-button.penultimate:not(.evenCount):deep() .el-checkbox-button__inner {
  border-bottom-right-radius: var(--el-border-radius-base);
}
.el-checkbox-button.penultimate.evenCount:deep() .el-checkbox-button__inner {
  border-top-right-radius: var(--el-border-radius-base);
}

.el-checkbox-button.isEven:deep() .el-checkbox-button__inner {
  border-top-color: transparent;
}
.el-checkbox-button:nth-child(n + 3):deep() .el-checkbox-button__inner {
  border-left-color: transparent;
}

.el-checkbox-button.is-checked:deep() .el-checkbox-button__inner {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-checkbox-button-checked-border-color);
  color: black;
}
</style>
