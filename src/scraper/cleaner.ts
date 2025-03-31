function getDescription(markdown: string): string {
  const split = markdown.indexOf('---')
  return markdown.substring(split + 3).replaceAll('---', '').trim()
}

function getFeatures(markdown: string): {} {
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
  return null
}

function lowerSearchText(text: string): string {
  return text.toLowerCase()
}

function isAValidEntry(item: any): boolean {
  if (item._source.primary_source_category === 'Comics') {
    return false
  }
  if (Date.parse(item._source.release_date) < Date.parse('2023-08-02') && item._source.primary_source !== 'Treasure Vault') {
    return false
  }
  return true
}

export function cleanSearch(search: any[]) {
  const cleanMap = []
  search.forEach((item) => {
    if (!isAValidEntry(item)) {
      return
    }
    item._source.description = getDescription(item._source.markdown)
    item._source.search_text = lowerSearchText(item._source.text)
    item._source.features = getFeatures(item._source.markdown)
    cleanMap.push(item._source)
  })
  return cleanMap
}
