<!-- Uses Element select component https://element-plus.org/en-US/component/select.html -->

<template>
  <div class="">
    <div class="select-label">{{title}}</div>
    <el-select
      v-model="value"
      size="large"
      filterable
      style="width: 180px"
      @change="handleChange()"
    >
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { title, options} = defineProps<{
  title: string
  options: string[]
}>()
const emit = defineEmits<{
  change: [value: string]
}>()

const value = ref('');
const handleChange = () => {
  console.log('selected:', value.value);
  emit('change', value.value);
  value.value = '';
}
</script>

<style scoped>

</style>