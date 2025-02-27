<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute('/search/[topic]')
const pageName = ref(route.params.topic)
</script>

<template>
  <ListPage :page-name="pageName" />
</template>
