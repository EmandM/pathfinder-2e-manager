<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  const router = useRouter()
  const path = localStorage.getItem('path')
  if (path) {
    // eslint-disable-next-line no-debugger
    debugger
    localStorage.removeItem('path')
    void router.push(path)
  }
})
</script>

<template>
  <PageHeader />
  <div class="main-container container">
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<style>
#app {
  /* text-align: center; */
  color: var(--el-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--el-menu-item-height) - 4px);
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
