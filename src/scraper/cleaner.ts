function getDescription(markdown: string): string {
  const split = markdown.indexOf('---')
  return markdown.substring(split + 3).replaceAll('---', '').trim()
}

function getFeatures(markdown: string): { feature: string; value: string }[] {
  let match = markdown.match(/<column.*?(<row.*<\/row>).*?<\/column>/s);
  if (match) {
    return match[1]
      .replaceAll(/\*\* ?\r\n/g, '** ')
      .matchAll(/\*\*(.+?)\*\* (.+?)[\n\r]/gs)
      .map(a => {
        return {feature: a[1], value: a[2]}
      })
      .toArray()
  }
  return null;
}

function lowerSearchText(text: string): string {
  return text.toLowerCase()
}

export function cleanSearch(search: any[]) {
  let cleanMap = [];
  search.forEach((item) => {
    item._source.description = getDescription(item._source.markdown);
    item._source.search_text = lowerSearchText(item._source.text);
    item._source.features = getFeatures(item._source.markdown);
    cleanMap.push(item._source);
  })
  return cleanMap;
}
