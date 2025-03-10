<script setup lang="ts">
import type { BookmarkList } from '~/composables/bookmark-storage'
import { computed, ref, watchEffect } from 'vue'
import { usePrinter } from '~/composables/print'
import IconExclamation from '~icons/material-symbols-light/warning'

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
const numItems = computed(() => Object.keys(list.bookmarked).length)

const activeChecked = ref(isActive)
watchEffect(() => activeChecked.value = isActive)

function handleActiveClick() {
  emit('setActive')
}
function handlePrint() {
  goToPrint(Object.values(list.bookmarked))
}
</script>

<template>
  <div class="bookmark-list">
    <div class="b-list-item">
      <div class="label main-label">
        Name:
      </div>
      <div>
        <el-input v-model="listName" style="width: 240px" @change="emit('setName', listName)" />
      </div>
    </div>

    <div class="b-list-item">
      <div class="label">
        Item Count:
      </div>
      <div class="text-primary">
        {{ numItems }}
      </div>
    </div>

    <div>
      <el-radio-group v-model="activeChecked" @change="handleActiveClick">
        <el-radio :value="true">
          Active
        </el-radio>
      </el-radio-group>
    </div>

    <div class="flex">
      <el-button type="primary" class="print-button" @click="handlePrint">
        Print
        <el-icon class="el-icon--right">
          <i-msl-print-outline />
        </el-icon>
      </el-button>


      <el-popconfirm 
        title="Are you sure to delete this?"
        confirm-button-type="danger"
        cancel-button-type="info"
        icon-color="#DD2C00"
        :icon="IconExclamation"
        @confirm="emit('delete')">
        <template #reference>
          <el-button type="warning">
            Delete
            <el-icon class="el-icon--right">
              <i-material-symbols-light-delete-outline />
            </el-icon>
          </el-button>
        </template>
      </el-popconfirm>
      
    </div>
  </div>
</template>

<style scoped lang="scss">
.bookmark-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.b-list-item {
  display: flex;
  align-items: center;

  .label {
    color: var(--el-text-color-regular);
    font-size: var(--el-font-size-base);
    margin-right: 5px;

    &.main-label {
      font-size: var(--el-font-size-medium);
    }
  }

  .text-primary {
    font-size: var(--el-font-size-medium);
    color: var(--el-color-primary);
  }
}
</style>
