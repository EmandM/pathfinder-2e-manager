<!-- Uses Element tag component https://element-plus.org/en-US/component/tag.html -->

<script setup lang="ts">
import { ref } from 'vue'
import { FilterState } from '~/composables/item-types'
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
const color = ref(props.initialState !== FilterState.inactive ? props.color : disabled)
const closable = props.closable || false

function changeState() {
  switch (state.value) {
    case FilterState.includes:
      state.value = FilterState.excludes
      break
    case FilterState.excludes:
      state.value = FilterState.inactive
      color.value = disabled
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
    :class="{ active: hasState(FilterState.includes) }"
    :closable="closable"
    round
    @click="changeState"
    @close="emit('close')"
  >
    <el-icon>
      <plus v-if="hasState(FilterState.includes)" />
      <minus v-else-if="hasState(FilterState.excludes)" />
      <hide v-else />
    </el-icon>
    <span class="tag-text">{{ props.title }}</span>
  </el-tag>
</template>

<style scoped>
.tag.ep-tag {
  color: grey;
  margin: 4px;
}
.tag.active {
  color: black;
}
.tag.ep-tag.active:deep() .ep-tag__close {
  color: black;
  border-color: black;
}
.tag.ep-tag:deep() .ep-tag__content {
  display: flex;
}
.tag-text {
  margin: auto;
}
.ep-icon {
  padding-right: 2px;
}
</style>
