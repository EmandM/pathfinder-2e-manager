<!-- Uses Element tag component https://element-plus.org/en-US/component/tag.html -->

<script setup lang="ts">
import { ref } from 'vue'
import { FilterState } from '~/composables/types'
import { disabled } from './filter-colors'

const props = defineProps<{
  title: string
  initialState?: FilterState
  color: string
  closable?: boolean
}>()

const emit = defineEmits<{
  change: [newState: FilterState]
  close: []
}>()
const state = ref(props.initialState || FilterState.includes)
const color = ref(props.initialState !== FilterState.inactive ? props.color : undefined)
const closable = props.closable || false

function changeState() {
  switch (state.value) {
    case FilterState.includes:
      state.value = FilterState.excludes
      break
    case FilterState.excludes:
      state.value = FilterState.inactive
      color.value = undefined
      break
    case FilterState.inactive:
      state.value = FilterState.includes
      color.value = props.color
  }
  emit('change', state.value)
}

function hasState(want: FilterState) {
  return state.value === want
}
</script>

<template>
  <el-tag
    :hit="hasState(FilterState.includes)"
    :color="color"
    size="large"
    class="tag"
    :class="{ active: hasState(FilterState.includes), inactive: hasState(FilterState.inactive) }"
    :closable="closable"
    round
    @click="changeState"
    @close="emit('close')"
  >
    <el-icon>
      <i-material-symbols-light-visibility v-if="hasState(FilterState.includes)" />
      <i-material-symbols-light-visibility-off v-else-if="hasState(FilterState.excludes)" />
      <i-msl-label-off-outline v-else />
    </el-icon>
    <span class="tag-text">{{ props.title }}</span>
  </el-tag>
</template>

<style scoped>
.tag {
  &.el-tag {
    color: grey;
    margin: 4px;
    cursor: pointer;
  }
  &.active {
    color: black;
  }
  &.inactive {
    background-color: var(--el-fill-color-light);
  }
  &.el-tag.active:deep() .el-tag__close {
    color: black;
    border-color: black;
  }
  &.el-tag:deep() .el-tag__content {
    display: flex;
  }
  &:not(.inactive) {
    color: black;
  }
}
.tag-text {
  margin: auto;
}
.el-icon {
  padding-right: 2px;
}
</style>
