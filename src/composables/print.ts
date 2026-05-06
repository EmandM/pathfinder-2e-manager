import type { RemovableRef } from '@vueuse/core'
import type { Ref } from 'vue'
import type { Card, KeysMatching } from './types'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface PrintConfiguration {
  count?: number
  xl_card: boolean
  print_image: boolean
}

type Override = PrintConfiguration & Partial<Card>

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

  private assignOverride<T extends keyof Card>(field: T, override: Omit<Override, 'count'>, card: Card) {
    const value = override[field] as Card[T]
    if (value) {
      card[field] = value
    }
  }

  private getOverride(id: Card['id']): Override {
    if (!this.overrides.value[id]) {
      this.overrides.value[id] = {
        xl_card: false,
        print_image: false,
      }
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

    Object.keys(override).forEach((field) => {
      if (field === 'count') {
        return
      }

      const cardField = field as keyof Omit<Override, 'count'>
      this.assignOverride(cardField, override, moddedCard)
    })

    if (override.count === 0) {
      return []
    }

    let toReturn = [moddedCard]

    if (override.print_image) {
      const imageCard = Object.assign({}, moddedCard)
      moddedCard.print_image = false
      toReturn = [moddedCard, imageCard]
    }

    if (override.count) {
      toReturn.push(...Array.from({ length: override.count - 1 }, () => moddedCard))
    }

    return toReturn
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
  setField<T extends keyof Override>(id: Card['id'], fieldName: T, value: Override[T]) {
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

  setFlag(id: Card['id'], flagName: KeysMatching<Override, boolean>, value: boolean) {
    this.setField(id, flagName, value)
  }
}

// Lazy instantiate singleton so tests can setup the mock before anything is created
let printer: Printer
function getPrinter() {
  if (!printer) {
    printer = new Printer()
  }
  return printer
}

export function usePrinter() {
  const router = useRouter()

  return function goToPrint(items: Card[]): void {
    getPrinter().printList.value = items
    void router.push('/print')
  }
}

export function usePrintCustomization() {
  return getPrinter()
}
