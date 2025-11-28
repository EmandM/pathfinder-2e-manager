<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBookmarks } from '~/composables/bookmark-storage'

const route = useRoute('/view/[bookmarkList]')
const bookmarkListName = ref(route.params.bookmarkList)
const bookmarkManager = useBookmarks();

const cards = bookmarkManager.getCardsInList(bookmarkListName.value);
</script>

<template>
  <ListPage :page-name="`view-${bookmarkListName}`" :collection="cards" />
</template>
