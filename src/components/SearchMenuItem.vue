<script setup lang="ts">
const { topic } = defineProps<{
  topic: string
}>()
</script>

<template>
  <el-menu-item :index="`/search/${topic}`">
    <router-link :to="{ name: '/search/[topic]', params: { topic } }">
      <slot />
    </router-link>
  </el-menu-item>
</template>

<style scoped lang="scss">
.el-menu-item.el-menu-item a {
  color: inherit
}
</style>
