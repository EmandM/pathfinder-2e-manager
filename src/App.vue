<template>
  <el-config-provider namespace="ep">
    <PageHeader />
    <div class="main-container container">
        <RouterView />
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
  padding: 2rem;
}
</style>
