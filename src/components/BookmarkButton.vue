<script setup lang="ts">
import { computed, } from 'vue'
import { useBookmarks } from '~/composables/bookmark-storage'

const { isBookmarked } = defineProps<{
  isBookmarked?: boolean
}>()
const emit = defineEmits<{
  click: []
}>()

const bookmarker = useBookmarks()
const activeBookmark = computed(() => bookmarker.activeName())
</script>

<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    :content="`${activeBookmark}`"
    placement="top"
  >
    <el-icon 
      :size="24"
      class="bookmark-icon"
      :class="{bookmarked: isBookmarked}"
      @click="emit('click')">
      <i-msl-bookmark-sharp v-if="isBookmarked" />
      <i-msl-bookmark-outline-sharp v-else />
    </el-icon>
  </el-tooltip>
</template>

<style scoped lang="scss">
.bookmark-icon{
  margin-right: -8px;

  &.bookmarked {
    color: var(--el-color-primary);
  }
}
</style>
