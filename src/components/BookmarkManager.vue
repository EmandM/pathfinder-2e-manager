<script setup lang="ts">
import type { BookmarkList } from '~/composables/bookmark-storage'
import { ref, watchEffect } from 'vue'
import { usePrinter } from '~/composables/print'

const { list, isActive } = defineProps<{
  list: BookmarkList
  isActive: boolean
}>()
const emit = defineEmits<{
  setActive: []
  delete: []
  setName: [name: string]
}>()

const goToPrint = usePrinter()

const listName = ref(list.name)
const activeChecked = ref(isActive)
watchEffect(() => activeChecked.value = isActive)

const numItems = ref(Object.keys(list.bookmarked).length)
watchEffect(() => numItems.value = Object.keys(list.bookmarked).length)

function handleActiveClick() {
  emit('setActive')
}
function handlePrint() {
  goToPrint(Object.values(list.bookmarked))
}
</script>

<template>
  <div class="list flex">
    <div>
      <div>
        <b>List name</b>
      </div>
      <div>
        <el-input v-model="listName" style="width: 240px" @change="emit('setName', listName)" />
      </div>
    </div>

    <div>
      <div>
        <b>Item Count</b>
      </div>
      <div>
        {{ numItems }}
      </div>
    </div>

    <div>
      <el-radio-group v-model="activeChecked" @change="handleActiveClick">
        <el-radio :value="true">
          Active
        </el-radio>
      </el-radio-group>
      <!-- <el-checkbox :checked="isActive" label="Active" size="large" @change="emit('setActive')" /> -->
    </div>

    <el-button type="primary" class="print-button" @click="handlePrint">
      Print
      <el-icon class="el-icon--right">
        <Printer />
      </el-icon>
    </el-button>
    <el-button type="warning" @click="emit('delete')">
      Delete <el-icon class="el-icon--right">
        <Delete />
      </el-icon>
    </el-button>
  </div>
</template>

<style scoped>

</style>
