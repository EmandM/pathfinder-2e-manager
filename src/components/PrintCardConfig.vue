<script setup lang="ts">
import type { Card } from '~/composables/types'
import { computed, ref } from 'vue'
import IconEdit from '~icons/material-symbols-light/edit'
import { usePrintCustomization } from '~/composables/print'

const { source } = defineProps<{
  source: Card
}>()

const printer = usePrintCustomization()
const existing = printer.getConfiguredOverride(source.id)
const noOverride = computed(() => !printer.getConfiguredOverride(source.id))

const count = ref((existing?.count || existing?.count === 0) ? existing.count : 1)
const description = ref(existing?.description || source.description)
const name = ref(existing?.name || source.name)
const traits = ref(existing?.trait_raw || source.trait_raw)
const xlCard = ref(existing?.xl_card || false)
const printImage = ref(existing?.print_image || false)
const imageDisabled = !source.image

const descriptionDialogVisible = ref(false)
const traitDialogVisible = ref(false)
const nameDialogVisible = ref(false)

function handleCountChange(value: number | undefined) {
  if (!value || value < 0) {
    count.value = 0
    value = 0
  }
  printer.setCount(source.id, value)
}

function handleDescriptionCancel() {
  description.value = printer.getConfiguredOverride(source.id)?.description ?? source.description
  descriptionDialogVisible.value = false
}

function handleDescriptionSave() {
  printer.setDescription(source.id, description.value)
  descriptionDialogVisible.value = false
}

function handleTraitsCancel() {
  traits.value = printer.getConfiguredOverride(source.id)?.trait_raw ?? source.trait_raw
  traitDialogVisible.value = false
}

function handleTraitsSave() {
  printer.setTraits(source.id, traits.value)
  traitDialogVisible.value = false
}

function handleNameCancel() {
  name.value = printer.getConfiguredOverride(source.id)?.name ?? source.name
  nameDialogVisible.value = false
}

function handleNameSave() {
  printer.setField(source.id, 'name', name.value)
  nameDialogVisible.value = false
}

function handleXlCardChange(newVal: boolean) {
  printer.setFlag(source.id, 'xl_card', newVal)
}

function handlePrintImage(newVal: boolean) {
  printer.setFlag(source.id, 'print_image', newVal)
}

function handleReset() {
  printer.resetOverride(source.id)
  count.value = 1
  description.value = source.description
}
</script>

<template>
  <div class="item">
    <div class="name-container">
      <span class="name">{{ source.name }}</span>
      <el-button :icon="IconEdit" class="edit-name" circle size="small" @click="nameDialogVisible = true" />
    </div>

    <div class="actions">
      <div class="action">
        <el-checkbox v-model="xlCard" label="XL" @change="handleXlCardChange" />
        <el-checkbox v-model="printImage" label="print image" :disabled="imageDisabled" @change="handlePrintImage" />
      </div>
      <el-button class="action" plain @click="descriptionDialogVisible = true">
        Description
      </el-button>
      <el-button class="action" plain @click="traitDialogVisible = true">
        Traits
      </el-button>
      <el-input-number v-model="count" class="action" :min="0" @change="handleCountChange" />
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

  <el-dialog v-model="nameDialogVisible" :title="source.name" width="500" draggable>
    <el-input v-model="name" />

    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="reset"
          type="warning"
          :disabled="name === source.name"
          @click="() => name = source.name"
        >
          Reset
        </el-button>
        <el-button @click="handleNameCancel">Cancel</el-button>
        <el-button type="success" @click="handleNameSave">
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

  .name-container {
    display: flex;
    align-items: center;

    .edit-name {
      margin: 0 8px;
      // height: 24px;
      // width: 24px;
    }
  }

  .actions {
    display: flex;

    .action {
      margin-left: 0.5rem;

      .el-checkbox {
        margin-right: 8px;
      }

      &.el-input-number {
        width: 100px;
      }
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
