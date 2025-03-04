<script setup lang="ts">
import { useBookmarks } from '~/composables/bookmark-storage'

const manager = useBookmarks()

function handleListCreate() {
  console.log('create clicked')
  manager.createList()
}
</script>

<template>
  <BookmarkManager
    v-for="(list, index) in manager.lists.value"
    :key="index"
    :list="list"
    :is-active="index === manager.active.value"
    @set-name="(name) => manager.setName(index, name)"
    @set-active="manager.setActive(index)"
    @delete="manager.deleteList(index)"
  />
  <div>
    <el-button type="primary" @click="handleListCreate">
      Create new list<el-icon class="el-icon--right">
        <Plus />
      </el-icon>
    </el-button>
  </div>
</template>

<style scoped>

</style>
