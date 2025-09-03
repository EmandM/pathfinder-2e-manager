import type { Ref } from 'vue'
import type { Card } from './types'
import { ref, watch } from 'vue'

const importCache: Map<string, Ref<ImportResult>> = new Map()

export interface ImportResult {
  isLoaded: boolean
  data: Card[]
}

export function dataImporter(type: string, onImport: (data: Card[]) => void): Ref<ImportResult> {
  const cached = importCache.get(type)
  if (cached) {
    if (cached.value.isLoaded) {
      onImport(cached.value.data)
    }
    else {
      watch(
        cached,
        (cached) => {
          if (!cached.isLoaded) {
            console.error('error in data-import cache: watch should only trigger on isLoaded')
          }
          onImport(cached.data)
        },
        { once: true },
      )
    }
    return cached
  }

  const importResult: Ref<ImportResult> = ref({
    isLoaded: false,
    data: [],
  })
  importCache.set(type, importResult)

  const path = `${import.meta.env.BASE_URL}/data/${type}.json`
  fetch(path)
    .then(async res => res.json() as Promise<Card[]>)
    .then((jsonData) => {
      importResult.value.isLoaded = true
      importResult.value.data = jsonData
      onImport(jsonData)
    })
    .catch(err => console.log('error loading data:', err))
    .finally(() => importResult.value.isLoaded = true)

  return importResult
}

export function dataImportAll(types: string[], onImport: (data: Card[]) => void): void {
  const promises = Array.from({ length: types.length })

  for (let i = 0; i < types.length; i++) {
    promises[i] = new Promise((resolve, _) => {
      dataImporter(types[i], (cards) => {
        resolve(cards)
      })
    })
  }

  void Promise.all(promises).then((results: Card[]) => {
    const allCards = results.flat()
    onImport(allCards)
  })
}
