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
  >
    <el-menu-item index="/" route="/">
      <router-link :to="{ name: '/' }">
        Pathfinder 2e manager
      </router-link>
    </el-menu-item>
    <search-menu-item topic="spell">
      Spells
    </search-menu-item>
    <el-sub-menu index="2">
      <template #title>
        Items
      </template>
      <search-menu-item topic="weapon">
        Weapons
      </search-menu-item>
      <search-menu-item topic="armor">
        Armor
      </search-menu-item>
      <search-menu-item topic="shield">
        Shields
      </search-menu-item>
      <search-menu-item topic="alchemical">
        Alchemical
      </search-menu-item>
      <search-menu-item topic="runes">
        Runes
      </search-menu-item>
      <search-menu-item topic="equipment">
        Equipment
      </search-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        World
      </template>
      <search-menu-item topic="creature">
        Creatures
      </search-menu-item>
      <search-menu-item topic="equipment">
        Creature Family
      </search-menu-item>
      <search-menu-item topic="deity">
        Deities
      </search-menu-item>
      <search-menu-item topic="hazard">
        Hazards
      </search-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        Rules
      </template>
      <search-menu-item topic="action">
        Actions
      </search-menu-item>
      <search-menu-item topic="feat">
        Feats
      </search-menu-item>
      <search-menu-item topic="trait">
        Traits
      </search-menu-item>
      <search-menu-item topic="armor">
        Skills
      </search-menu-item>
    </el-sub-menu>
    <el-menu-item index="/bookmarks">
      <router-link :to="{ name: '/bookmarks' }">
        Bookmark manager
      </router-link>
    </el-menu-item>

    <el-menu-item index="dark" class="toggle" h="full" @click="toggleDark()">
      <button
        class="w-full cursor-pointer border-none bg-transparent"
        style="height: var(--el-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>

    <el-menu-item index="gh" h="full">
      <a class="size-full flex items-center justify-center" :href="repository.url" target="_blank">
        <div i-ri-github-fill />
      </a>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss">
.page-header {
  .toggle {
    margin-left: auto;
  }
}

.el-menu > .el-menu-item a {
  text-decoration: none;
}
</style>
