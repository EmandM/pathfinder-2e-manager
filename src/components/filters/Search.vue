<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

const { initialValue } = defineProps<{
  initialValue?: string
}>()
const emit = defineEmits<{
  change: [string]
}>()

const searchString = ref(initialValue || '')
</script>

<template>
  <div class="searchContainer">
    <el-input
      v-model="searchString"
      class="search"
      clearable
      placeholder="Search items"
      :prefix-icon="Search"
      @change="emit('change', searchString)"
    />
  </div>
</template>

<style scoped>
.searchContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.search {
  width: 200px;
}
</style>
