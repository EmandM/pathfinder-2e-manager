<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

let route = useRoute('/search/[topic]');
let pageName = ref(route.params.topic)
</script>

<template>
  <ListPage :pageName="pageName" />
</template>