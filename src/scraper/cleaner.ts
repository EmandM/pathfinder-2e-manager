/* eslint-disable regexp/no-super-linear-backtracking */
import type { Card } from '../composables/types.ts'
import { useAonLink } from '../composables/aon-link.ts'
import { applySkillToAction, checkActionToSkill, saveRelatedActions } from './actionSkills.ts'

function prefixImageLinks(description: string): string {
  return description.replace(/src="\/images\//g, `src="${useAonLink('/images/')}`)
}

function getNamedBlock(text: string, name: string): string {
  const split = text.matchAll(/<title.*?(?=<title|$)/gs)
  for (const match of split) {
    const text = match[0]
    if (text.includes(name)) {
      return text
    }
  }
  return ''
}

// removes nested items from card markdown and text (nested items will have their own result)
function splitCardText(card: Card): Card {
  let markdown = getNamedBlock(card.markdown, card.name)
  let text = card.text

  let composeText = false
  if (['alchemical', 'armor', 'equipment', 'feat', 'runes', 'shield', 'weapon-group', 'weapon'].includes(card.category)) {
    text = getNamedBlock(card.text, card.name)
    composeText = true
  }

  if (card.category === 'creature') {
    markdown += getNamedBlock(card.markdown, 'level="2"')
    text = card.text
  }
  else if (markdown.includes('level="2"')) {
    const titleBlock = getNamedBlock(card.markdown, 'level="1"')
    markdown = titleBlock + markdown

    if (composeText) {
      const firstBlock = getNamedBlock(card.markdown, 'level="1"')
      text += firstBlock + text
    }
  }

  const columns = markdown.matchAll(/(?<=<column.*?>).*?(?=<\/column>|<column)|(?<=>(?!.*<)).+$/gs)
  const featBlocks = [] as Card['features']
  for (const col of columns) {
    // Collect the features
    const feats = col[0]
      .replaceAll(/\*\* ?\r\n/g, '** ')
      .matchAll(/\*\*(.+?)\*\*(.*?)(?=\r|\n)/gs)
    const allFeatures = {}
    let hasFeats = false
    for (const feature of feats) {
      const [key, value] = getFeature(feature)
      if (key) {
        hasFeats = true
        allFeatures[key] = value.trim()
      }
    }
    if (hasFeats) {
      featBlocks.push(allFeatures)
    }
  }

  // Check for description
  let description = ''
  const descBlocks = markdown
    .matchAll(/(?:---\s*|<column.*?>|<\/sup>|pg. \d+)(.*?)(?=\*\*|<|\/>|---|$)/gs)
  for (const line of descBlocks) {
    if (!line[1]) {
      continue
    }
    description += line[1]
  }

  if (featBlocks) {
    card.features = featBlocks
  }

  card.markdown = markdown
  card.text = text
  card.description = prefixImageLinks(description.trim())

  return card
}

function getFeature(pair: RegExpExecArray): [string, string] {
  const key = pair[1]
  const value = pair[2]

  if (key === 'Price' && value === '—') {
    return [key, '0p']
  }

  if (key === 'Source') {
    return ['', '']
  }

  return [key, value]
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
    let card = item._source
    if (!isAValidEntry(card)) {
      return
    }

    if (card.category === 'skill') {
      saveRelatedActions(card)
    }

    if (card.category === 'action') {
      card = applySkillToAction(card)
    }

    card = splitCardText(item._source)

    card.search_text = lowerSearchText(card.text)

    cleanMap.push(card)
  })

  return cleanMap
}
