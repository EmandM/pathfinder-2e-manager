<script setup lang="ts">
import { useBookmarks } from '~/composables/bookmark-storage'

const manager = useBookmarks()

function handleListCreate() {
  console.log('create clicked')
  manager.createList()
}
</script>

<template>
  <div class="container bookmark-page py-4">
    <div class="bookmark-item"
        v-for="(list, index) in manager.lists.value"
        :key="index">
      <BookmarkManager
        :list="list"
        :is-active="index === manager.active.value"
        @set-name="(name: string) => manager.setName(index, name)"
        @set-active="manager.setActive(index)"
        @delete="manager.deleteList(index)"
      />
    </div>
    <div class="add-list py-6 px-2">
      <el-button type="primary" @click="handleListCreate">
        Create new list<el-icon class="el-icon--right">
          <i-msl-add-2 />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bookmark-item {
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
