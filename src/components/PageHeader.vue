<script lang="ts" setup>
import { repository } from '~/../package.json'
import { toggleDark } from '~/composables'
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const activeIndex = ref("");
watchEffect(() => activeIndex.value = route.path);
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

</script>

<template>
  <el-menu 
    class="page-header"
    mode="horizontal"
    :ellipsis="false"
    :default-active="activeIndex"
    @select="handleSelect"
    router>
    <el-menu-item index="/">Pathfinder 2e manager</el-menu-item>
    <el-menu-item index="/search/spells">Spells</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Items</template>
      <el-menu-item index="/search/weapons">Weapons</el-menu-item>
      <el-menu-item index="/search/armor">Armor</el-menu-item>
      <el-menu-item index="/search/shields">Shields</el-menu-item>
      <el-menu-item index="/search/equipment">Equipment</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/bookmarks">Bookmark manager</el-menu-item>

    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="w-full cursor-pointer border-none bg-transparent"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>

    <el-menu-item h="full">
      <a class="size-full flex items-center justify-center" :href="repository.url" target="_blank">
        <div i-ri-github-fill />
      </a>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss">
.page-header {
  &.ep-menu--horizontal > .ep-menu-item:nth-child(4) {
    margin-right: auto;
  }
}
</style>
