import type { Card } from '../composables/types.ts'
import { useAonLink } from '../composables/aon-link.ts'
import { applySkillToAction, checkActionToSkill, saveRelatedActions } from './actionSkills.ts'

function removeExtraFromDescription(description: string): string {
  return description.replace(/<title.*/gs, '')
}

function prefixImageLinks(description: string): string {
  return description.replace(/src="\/images\//gs, `src="${useAonLink('/images/')}`)
}

function indexOfEnd(text: string, searchText: string): number {
  let index = text.indexOf(searchText)
  if (index == -1) {
    // return -1 to indicate not found.
    return -1
  }

  return index + searchText.length
}

const markdownDivider = '---'
const titleClose = '</title>'
function getDescription(markdown: string): string {
  let split = indexOfEnd(markdown, markdownDivider)
  if (split == -1) {
    // if markdown divider is not found, look for the end of a title tag.
    split = indexOfEnd(markdown, titleClose)
  }

  let description = markdown.substring(split)
    .replaceAll('---', '')
  description = removeExtraFromDescription(description)
  description = prefixImageLinks(description)
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

const validOldSources = ['Treasure Vault', 'Troubles in Otari']
function isAValidEntry(item: Card): boolean {
  if (item.primary_source_category === 'Comics') {
    return false
  }
  if (Date.parse(item.release_date) < Date.parse('2023-08-02') && !validOldSources.includes(item.primary_source)) {
    return false
  }
  return true
}

function lowerSearchText(text: string): string {
  return text.toLowerCase()
}

export interface SearchEntry {
  _source: Card
}

export function cleanSearch(search: SearchEntry[]): Card[] {
  const cleanMap: Card[] = []

  if (search?.length > 0) {
    checkActionToSkill(search[0]._source)
  }

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

    if (item._source.category == 'skill') {
      saveRelatedActions(item._source)
    }

    if (item._source.category == 'action') {
      item._source = applySkillToAction(item._source)
    }

    cleanMap.push(item._source)
  })

  return cleanMap
}
