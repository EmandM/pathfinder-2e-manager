<script lang="ts" setup>
import markdownit from 'markdown-it';


const { markdown } = defineProps<{
  markdown: string
}>();

const md = markdownit({html: true, breaks: true});

const text = md.render(markdown);

</script>

<template>
  <span v-html="text" />
</template>

<style lang="scss">
</style>
