<!-- Uses Element tag component https://element-plus.org/en-US/component/tag.html -->

<script setup lang="ts">
import { ref } from 'vue'
import { disabled } from './filter-colors'

const props = defineProps<{ title: string, active: boolean, color: string }>()

const emit = defineEmits<{
  change: []
  close: []
}>()

const color = ref(props.color)

function handleChange() {
  const isActive = !props.active
  color.value = isActive ? props.color : disabled
  emit('change')
}
</script>

<template>
  <el-tag
    :hit="props.active"
    :color="color"
    size="large"
    class="tag"
    :class="{ active: props.active }"
    closable
    round
    @click="handleChange"
    @close="emit('close')"
  >
    {{ props.title }}
  </el-tag>
</template>

<style scoped>
.tag.ep-tag {
  color: grey;
  margin: 12px 4px;
}
.tag.active {
  color: black;
}
.tag.ep-tag.active:deep() .ep-tag__close {
  color: black;
  border-color: black;
}
</style>
