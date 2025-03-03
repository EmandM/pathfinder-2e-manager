<template>
  <el-config-provider namespace="ep">
    <PageHeader />
    <div class="main-container container">
      <RouterView :key="$route.fullPath" />
    </div>
  </el-config-provider>
</template>

<style>
#app {
  /* text-align: center; */
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 4px);
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
