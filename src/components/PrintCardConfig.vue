<script setup lang="ts">
import type { Card } from '~/composables/types'
import { computed, ref } from 'vue'
import { usePrintCustomization } from '~/composables/print'

const { source } = defineProps<{
  source: Card
}>()

const printer = usePrintCustomization()
const existing = printer.getConfiguredOverride(source.id)
const noOverride = computed(() => !printer.getConfiguredOverride(source.id))

const count = ref((existing?.count || existing?.count === 0) ? existing.count : 1)
const description = ref(existing?.description || source.description)
const traits = ref(existing?.trait_raw || source.trait_raw)

const descriptionDialogVisible = ref(false)

const traitDialogVisible = ref(false)

function handleCountChange(value: number | undefined) {
  if (!value || value < 0) {
    count.value = 0
    value = 0
  }
  printer.setCount(source.id, value)
}

function handleDescriptionCancel() {
  description.value = source.description
  descriptionDialogVisible.value = false
}

function handleDescriptionSave() {
  printer.setDescription(source.id, description.value)
  descriptionDialogVisible.value = false
}

function handleTraitsCancel() {
  traits.value = source.trait_raw
  traitDialogVisible.value = false
}

function handleTraitsSave() {
  printer.setTraits(source.id, traits.value)
  traitDialogVisible.value = false
}

function handleReset() {
  printer.resetOverride(source.id)
  count.value = 1
  description.value = source.description
}
</script>

<template>
  <div class="item">
    <span>{{ source.name }}</span>

    <div class="actions">
      <el-input-number v-model="count" class="action" :min="0" @change="handleCountChange" />
      <el-button class="action" plain @click="descriptionDialogVisible = true">
        Edit description
      </el-button>
      <el-button class="action" plain @click="traitDialogVisible = true">
        Edit traits
      </el-button>
      <el-button class="action" plain type="warning" :disabled="noOverride" @click="handleReset">
        Reset
      </el-button>
    </div>
  </div>

  <el-dialog v-model="descriptionDialogVisible" :title="source.name" width="500" draggable>
    <el-input
      v-model="description"
      :rows="10"
      type="textarea"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="reset"
          type="warning"
          :disabled="description === source.description"
          @click="() => description = source.description"
        >
          Reset
        </el-button>
        <el-button @click="handleDescriptionCancel">Cancel</el-button>
        <el-button type="success" @click="handleDescriptionSave">
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="traitDialogVisible" :title="source.name" width="500" draggable>
    <el-input-tag v-model="traits" draggable placeholder="Please input" />

    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="reset"
          type="warning"
          :disabled="traits === source.trait_raw"
          @click="() => traits = source.trait_raw"
        >
          Reset
        </el-button>
        <el-button @click="handleTraitsCancel">Cancel</el-button>
        <el-button type="success" @click="handleTraitsSave">
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;

  .actions {
    display: flex;

    .action {
      margin-left: 1rem;
    }
  }
}

.dialog-footer.dialog-footer {
  text-align: left;
  display: flex;

  .reset {
    margin-right: auto;
  }
}
</style>
