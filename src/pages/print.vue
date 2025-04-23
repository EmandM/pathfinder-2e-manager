<script setup lang="ts">
import { ref } from 'vue'
import { usePrintCustomization } from '~/composables/print'
import IconExclamation from '~icons/material-symbols-light/warning'

const printer = usePrintCustomization()
let toPrint = printer.loadItemsToPrint()
let toConfigure = printer.loadItemsToConfigure()
let hasOverride = printer.watchHasOverrides()

const isConfigureMode = ref(false)

function handleConfigureClick() {
  isConfigureMode.value = true
}
function handlePrint() {
  if (isConfigureMode.value) {
    toPrint = printer.loadItemsToPrint()
    isConfigureMode.value = false
  }
  else {
    window.print()
  }
}

function handleReset() {
  printer.resetOverrides()
  toPrint = printer.loadItemsToPrint()
}
</script>

<template>
  <div class="print-header">
    <el-button v-if="!isConfigureMode" type="info" class="configure-btn" @click="handleConfigureClick">
      Configure
    </el-button>
    <el-button type="primary" class="print-button" @click="handlePrint">
      Print
      <el-icon v-if="!isConfigureMode" class="el-icon--right">
        <i-msl-print-outline />
      </el-icon>
    </el-button>

    <el-popconfirm
        v-if="hasOverride"
        title="Are you sure to reset all print overrides?"
        confirm-button-type="danger"
        cancel-button-type="info"
        icon-color="#DD2C00"
        :icon="IconExclamation"
        @confirm="handleReset"
      >
        <template #reference>
          <el-button type="warning" class="reset-btn">
            Reset all overrides
          </el-button>
        </template>
      </el-popconfirm>
  </div>
  <div v-if="!isConfigureMode" class="cards">
    <Card v-for="item in toPrint" :key="item.id" :source="item" is-print />
  </div>

  <div v-else class="configuration">
    <div v-for="item in toConfigure" class="config">
      <PrintCardConfig 
        :key="item.id" 
        :source="item" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.print-header {
  display: flex;
  padding: 1rem 0;

  .reset-btn {
    margin-left: auto;
  }
}

.reset-btn {
    margin-left: auto;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 245px);
  justify-content: start;
}

.configuration {
  width: 100%;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
