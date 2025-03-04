import type { Card } from './types'
import { useRouter } from 'vue-router'

let printList: Card[] = []

export function usePrinter() {
  const router = useRouter()

  return function goToPrint(items: Card[]): void {
    printList = items
    void router.push('/print')
  }
}

// export

export function loadItemsToPrint(): Card[] {
  return printList
}
