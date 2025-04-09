<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { repository } from '~/../package.json'
import { toggleDark } from '~/composables'

const route = useRoute()
const activeIndex = computed(() => route.path)
</script>

<template>
  <el-menu
    class="page-header"
    mode="horizontal"
    :ellipsis="false"
    :default-active="activeIndex"
    router
  >
    <el-menu-item index="/">
      Pathfinder 2e manager
    </el-menu-item>
    <el-menu-item index="/search/spell">
      Spells
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        Items
      </template>
      <el-menu-item index="/search/weapon">
        Weapons
      </el-menu-item>
      <el-menu-item index="/search/armor">
        Armor
      </el-menu-item>
      <el-menu-item index="/search/shield">
        Shields
      </el-menu-item>
      <el-menu-item index="/search/alchemical">
        Alchemical
      </el-menu-item>
      <el-menu-item index="/search/runes">
        Runes
      </el-menu-item>
      <el-menu-item index="/search/equipment">
        Equipment
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        World
      </template>
      <el-menu-item index="/search/creature">
        Creatures
      </el-menu-item>
      <el-menu-item index="/search/creature-family">
        Creature Family
      </el-menu-item>
      <el-menu-item index="/search/deity">
        Deities
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        Rules
      </template>
      <el-menu-item index="/search/action">
        Actions
      </el-menu-item>
      <el-menu-item index="/search/feat">
        Feats
      </el-menu-item>
      <el-menu-item index="/search/trait">
        Traits
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/bookmarks">
      Bookmark manager
    </el-menu-item>

    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="w-full cursor-pointer border-none bg-transparent"
        style="height: var(--el-menu-item-height)"
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
  &.el-menu--horizontal.el-menu--horizontal > .el-menu-item:nth-child(5) {
    margin-right: auto;
  }
}
</style>
