<template>
    <el-tag
      :hit="props.active"
      :color="color"
      size="large"
      class="tag"
      :class="{ inactive: !props.active }"
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

const props = defineProps<{title: String, active: boolean, color: string}>();

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
.tag {
  color: black;
  margin: 12px 4px;
}
.tag.inactive {
  color: grey;
}
</style>