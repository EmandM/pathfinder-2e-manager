<script setup lang="ts">
import { ref } from 'vue'

// const { options} = defineProps<{
//   options: string[];
// }>()

const checkboxGroup2 = ref(['Shanghai'])
const cities = [1, 2, 3, 4, 5]

// const emit = defineEmits<{
//   change: [value: string]
//   close: []
// }>()

// const value = ref('');
// const handleChange = () => {
//   emit('change', value.value);
//   value.value = '';
// }
</script>

<template>
  <div>
    <div class="demo-button-style">
      <el-checkbox-group v-model="checkboxGroup2">
        <el-checkbox-button v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
  </div>
</template>

<style scoped>
.ep-checkbox-button >>> .ep-checkbox-button__inner {
  padding: 12px;
}
</style>
