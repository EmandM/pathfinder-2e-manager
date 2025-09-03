import type { RemovableRef } from '@vueuse/core'
import type { Ref } from 'vue'
import type { Card } from './types'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Override {
  count?: number
  description?: string
  trait_raw?: string[]
}

interface PrintCustomisations {
  [key: Card['id']]: Override
}

export interface PrintConfig extends Override {
  card: Card
}

class Printer {
  printList: RemovableRef<Card[]>
  overrides: RemovableRef<PrintCustomisations>
  overrideExists: Ref<boolean>

  constructor() {
    // print list and overrides can be somewhat separate
    this.printList = useStorage('print', [] as Card[])

    this.overrides = useStorage('printConfig', {} as PrintCustomisations)
    this.overrideExists = ref(Object.keys(this.overrides.value).length > 0)
  }

  watchHasOverrides(): Ref<boolean> {
    return this.overrideExists
  }

  private hasOverride(id: Card['id']): boolean {
    return !!this.overrides.value[id]
  }

  private getOverride(id: Card['id']): Override {
    if (!this.overrides.value[id]) {
      this.overrides.value[id] = {}
    }
    return this.overrides.value[id]
  }

  private applyOverride(card: Card): Card[] {
    if (!this.hasOverride(card.id)) {
      return [card]
    }
    // apply overrides here
    const override = this.getOverride(card.id)
    const moddedCard = Object.assign({}, card)

    if (override.description) {
      moddedCard.description = override.description
    }

    if (override.trait_raw) {
      moddedCard.trait_raw = override.trait_raw
    }

    if (override.count) {
      return Array.from({ length: override.count }, () => moddedCard)
    }
    else if (override.count === 0) {
      return []
    }

    return [moddedCard]
  }

  resetOverrides() {
    this.overrides.value = {}
    this.overrideExists.value = false
  }

  resetOverride(id: Card['id']) {
    delete this.overrides.value[id]
    if (Object.keys(this.overrides.value).length === 0) {
      this.overrideExists.value = false
    }
  }

  loadItemsToPrint(): Card[] {
    const toPrint: Card[] = []
    for (const card of this.printList.value) {
      toPrint.push(...this.applyOverride(card))
    }
    return toPrint
  }

  loadItemsToConfigure(): Card[] {
    return this.printList.value
  }

  getConfiguredOverride(id: Card['id']): Override | undefined {
    if (this.hasOverride(id)) {
      return this.getOverride(id)
    }
  }

  // Set Overrides
  private setField<T extends keyof Override>(id: Card['id'], fieldName: T, value: Override[T]) {
    const override = this.getOverride(id)
    override[fieldName] = value
    this.overrides.value[id] = override
    this.overrideExists.value = true
  }

  setCount(id: Card['id'], count: number) {
    this.setField(id, 'count', count)
  }

  setDescription(id: Card['id'], description: string) {
    this.setField(id, 'description', description)
  }

  setTraits(id: Card['id'], trait_raw: string[]) {
    this.setField(id, 'trait_raw', trait_raw)
  }
}

const printer = new Printer()

export function usePrinter() {
  const router = useRouter()

  return function goToPrint(items: Card[]): void {
    printer.printList.value = items
    void router.push('/print')
  }
}

export function usePrintCustomization() {
  return printer
}
