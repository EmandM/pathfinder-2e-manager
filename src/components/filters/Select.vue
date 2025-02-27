<!-- Uses Element select component https://element-plus.org/en-US/component/select.html -->

<template>
  <div>
    <el-text class="select-label">{{title}}</el-text>
      <div class="flex">
      <el-select
        v-model="value"
        filterable
        size="large"
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
      <el-button 
        v-if="isClosable" 
        class="closebutton" 
        :icon="Close"
        @click="emit('close')"
        circle/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'

const { title, options} = defineProps<{
  title: string;
  options: string[];
  isClosable?: boolean;
}>()
const emit = defineEmits<{
  change: [value: string]
  close: []
}>()

const value = ref('');
const handleChange = () => {
  emit('change', value.value);
  value.value = '';
}
</script>

<style scoped>
.closebutton.ep-button {
  margin: auto 0;
  padding: 8px;
}
</style>