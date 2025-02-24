<script lang="ts" setup>
type ItemSource = {
  primary_source: string;

  [key: string]: any;
}


const { source } = defineProps<{
  source: ItemSource
}>();


</script>

<template>
  <div>
    {{source}}
  </div>
</template>

<style lang="scss">
</style>
