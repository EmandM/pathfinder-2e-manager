<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useBookmarks } from '~/composables/bookmark-storage'

const { isBookmarked } = defineProps<{
  isBookmarked?: boolean
}>()
const emit = defineEmits<{
  click: []
}>()

const bookmarker = useBookmarks()
const activeBookmark = ref(bookmarker.activeName())
watchEffect(() => activeBookmark.value = bookmarker.activeName())

const bookmarkColor = ref(isBookmarked ? '#409efc' : 'black')
watchEffect(() => bookmarkColor.value = isBookmarked ? '#409efc' : 'black')
</script>

<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    :content="`Saving to: ${activeBookmark}`"
    placement="top"
  >
    <el-icon :size="24" class="bookmark-icon" :color="bookmarkColor" @click="emit('click')">
      <Opportunity v-if="isBookmarked" />
      <CollectionTag v-else />
    </el-icon>
  </el-tooltip>
</template>

<style scoped>

</style>
