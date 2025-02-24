<!-- Uses Element tag component https://element-plus.org/en-US/component/tag.html -->

<template>
    <el-tag
      :hit="props.active"
      :color="color"
      size="large"
      class="tag"
      :class="{ active: props.active }"
      closable
      @click="handleChange"
      @close="emit('close')"
      round>
      {{ props.title }}
    </el-tag>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { disabled } from './filter-colors';

const props = defineProps<{title: string, active: boolean, color: string}>();

const color = ref(props.color);

const emit = defineEmits<{
  change: []
  close: []
}>();

const handleChange = () => {
  const isActive = !props.active;
  color.value = isActive ? props.color : disabled;
  emit('change');
}


</script>

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