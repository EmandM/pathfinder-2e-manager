<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  const router = useRouter()
  const path = localStorage.getItem('404redirect')
  if (path) {
    localStorage.removeItem('404redirect')
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
  color: var(--el-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--el-menu-item-height) - 4px);
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
