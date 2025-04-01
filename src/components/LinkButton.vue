<script setup lang="ts">
import { useAonLink } from '~/composables/aon-link'

const { link } = defineProps<{
  link: string
}>()
</script>

<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    content="Open on Archives of Nethys"
    placement="top"
  >
    <a :href="useAonLink(link)" target="_blank" class="link-icon">
      <el-icon :size="18">
        <i-msl-skull-outline />
      </el-icon>
    </a>
  </el-tooltip>
</template>

<style scoped lang="scss">
.link-icon {
  margin: auto;
}
</style>
