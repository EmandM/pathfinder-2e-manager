<script setup lang="ts">
const { topic } = defineProps<{
  topic: string
}>()
</script>

<template>
  <el-menu-item :index="`/search/${topic}`" class="menu-item">
    <router-link :to="{ name: '/search/[topic]', params: { topic } }" class="link-item">
      <slot />
    </router-link>
  </el-menu-item>
</template>

<style scoped lang="scss">
.menu-item.menu-item.menu-item {
  padding: 0;
}

.el-menu-item.el-menu-item a {
  color: inherit;
  padding: 0 var(--el-menu-base-level-padding);
}

.el-menu--popup .el-menu-item.menu-item {
  width: 100%;

  a {
    width: 100%;
  }
}
</style>
