import type { Card } from '../composables/types.ts'

function removeExtraFromDescription(description: string): string {
  return description.replace(/<title.*/gs, '')
}

function getDescription(markdown: string): string {
  const split = markdown.indexOf('---')
  let description = markdown.substring(split + 3)
    .replaceAll('---', '')
  description = removeExtraFromDescription(description)
  return description.trim()
}

function getFeatures(markdown: string): Card['features'] | undefined {
  const match = markdown.match(/<column.*?(<row.*<\/row>).*?<\/column>/s)
  if (match) {
    const features = match[1]
      .replaceAll(/\*\* ?\r\n/g, '** ')
      .matchAll(/\*\*(.+?)\*\* (.+?)[\n\r]/gs)
    const allFeatures = {}
    for (const feature of features) {
      allFeatures[feature[1]] = feature[2]
    }
    return allFeatures
  }
}

function lowerSearchText(text: string): string {
  return text.toLowerCase()
}

function isAValidEntry(item: Card): boolean {
  if (item.primary_source_category === 'Comics') {
    return false
  }
  if (Date.parse(item.release_date) < Date.parse('2023-08-02') && item.primary_source !== 'Treasure Vault') {
    return false
  }
  return true
}

export interface SearchEntry {
  _source: Card
}

export function cleanSearch(search: SearchEntry[]): Card[] {
  const cleanMap: Card[] = []
  search.forEach((item) => {
    if (!isAValidEntry(item._source)) {
      return
    }

    item._source.description = getDescription(item._source.markdown)
    item._source.search_text = lowerSearchText(item._source.text)

    const features = getFeatures(item._source.markdown)
    if (features) {
      item._source.features = features
    }

    cleanMap.push(item._source)
  })
  return cleanMap
}
