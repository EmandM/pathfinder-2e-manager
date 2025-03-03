import type { Item } from './item-types'
import { useRouter } from 'vue-router'

const router = useRouter()
let printList: Item[] = []

export function doPrint(items: Item[]) {
  printList = items
  void router.push('/print')
}

export function loadItemsToPrint(): Item[] {
  return printList
}
