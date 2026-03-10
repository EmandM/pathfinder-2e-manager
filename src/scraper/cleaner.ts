/* eslint-disable regexp/no-super-linear-backtracking */
import type { Card } from '../composables/types.ts'
import { useAonLink } from '../composables/aon-link.ts'
import { applySkillToAction, checkActionToSkill, saveRelatedActions } from './actionSkills.ts'

function prefixImageLinks(description: string): string {
  return description.replace(/src="\/images\//g, `src="${useAonLink('/images/')}`)
}

function logCardError(card: Card, error: string) {
  console.warn(`[Category ${card.category}][Card ${card.name}] ${error}`)
}

/**
 * Gets the markdown of the card.
 * Removes nested items from card markdown (nested items will have their own result).
 */
function getMarkdown(card: Card): string {
  const split = card.markdown.matchAll(/<title.*?(?=<title|$)/gs)
  let headerBlock = ''
  for (const match of split) {
    let isHeaderBlock = false
    const text = match[0]
    const titleTag = text.match(/<title(.*?)<\/title>/s)
    if (!titleTag || !titleTag[0] || !titleTag[1]) {
      logCardError(card, 'No title text was found')
      continue
    }

    const titleText = titleTag[1]
    if (titleText.includes('level="1"')) {
      isHeaderBlock = true
      headerBlock = text
      if (card.category === 'creature' || card.item_parent_id) {
        continue
      }
    }

    if (titleText.includes(card.name)) {
      if (card.category === 'creature' || !isHeaderBlock) {
        return headerBlock + text
      }
      return text
    }
  }
  logCardError(card, 'no relevant markdown found. Using header')
  return headerBlock
}

/**
 * Gets the text (markdown text without formatting) of the card.
 * Removes nested items from card text (nested items will have their own result).
 * (e.g. potions with lesser, minor, major versions).
 */
function getText(card: Card): string {
  if (!['alchemical', 'armor', 'equipment', 'runes', 'shield', 'weapon-group', 'weapon'].includes(card.category)) {
    if (card.category !== 'feat' && card.text.match(/<title.*?(?=<title|$)/gs)) {
      logCardError(card, 'skipping text category that may have composable text')
    }
    return card.text
  }

  // const split = card.markdown.matchAll(/<title.*?(?=<title|$)/gs)
  const split = card.text.matchAll(/<title.*?(?=<title|$)/gs)
  let headerBlock = ''
  for (const match of split) {
    let isHeaderBlock = false
    const text = match[0]
    const titleTag = text.match(/<title(.*?)>/s)
    if (!titleTag || !titleTag[1]) {
      logCardError(card, 'No title text was found')
      continue
    }

    if (titleTag[1].includes('level="1"')) {
      isHeaderBlock = true
      headerBlock = text
      if (card.category === 'creature') {
        continue
      }
    }

    if (text.includes(card.name)) {
      if (card.category === 'creature' || !isHeaderBlock) {
        return headerBlock + text
      }
      return text
    }
  }
  logCardError(card, 'no relevant text found. Using header')
  return headerBlock
}

function getBasicDescription(markdown: string): string {
  const split = markdown.indexOf('---')
  let description = markdown.substring(split + 3)
    .replaceAll('---', '')
  description = description.replace(/<title.*/gs, '')
  description = prefixImageLinks(description)
  return description.trim()
}

function getComplexDescription(markdown: string): string {
  let description = ''
  const descBlocks = markdown
    .matchAll(/(?:---\s*|<\/?column.*?>|<\/sup>(?!,)|pg. \d+(?:, .*? pg. \d+)*)(.*?)(?=\*\*|<|\/>|---|##|$)/gs)
  for (const line of descBlocks) {
    if (!line[1]) {
      continue
    }
    // check if the line has any letters in it (sometimes strange formatting characters get matched)
    const hasWords = line[1].match(/[A-Z]/gi)
    if (hasWords) {
      description += line[1]
    }
  }
  return description.trim()
}

/**
 * Reformats the Archives of Nethys result for manager usage.
 * - Splits markdown and text to remove nested items (nested items will each have their own result).
 * - Breaks out relevant info into new keys on the card
 * - Removes unnecessary keys from the card
 */
function formatCard(card: Card): Card {
  /*
   * Splice the markdown to deduplicate information and only include relevant info
   * When items have multiple versions (e.g. potion (Lesser), potion (Minor)...) each version will have an entry
   * Each version's entry will include all of the other versions so we want to remove the duplicated info
  */
  let markdown = getMarkdown(card)
  // Strip any pathfinder society note out of the markdown
  const pfsNotes = markdown.matchAll(/_\[.+\]\(\/pathfinder-society\)(.*?)_/gs)
  for (const note of pfsNotes) {
    card.pfs_note = note[1]
    markdown = markdown.substring(0, note.index) + markdown.substring(note.index + note[0].length)
  }

  // backgrounds have inconsistent bolding of skills that's causing issues
  if (card.category === 'background') {
    markdown = markdown.replaceAll(/\*\*(Charisma|Constitution|Dexterity|Intelligence|Strength|Wisdom)\*\*/g, '$1')
  }

  // make sure that tables don't have breaks inside them
  markdown = markdown.replaceAll(/(<table>.*?)<\/?br\s*\/?>(.*?<\/table>)/gs, '$1$2')

  // Assign back to the card
  card.markdown = markdown
  card.search_text = getText(card).toLowerCase()

  /*
   * Break the features out of the markdown.
   * Features are in the markdown as **<key>** <value>
   * The markdown will separate groups of features in <column> blocks
   * We maintain the groups so that we can display dividers in-between the groups
   * Therefore features is an array of objects with key-value features
  */
  const useBasicDescription = card.category === 'spell'
    || (card.category === 'equipment' && markdown.includes('<ul>'))

  const columns = markdown.matchAll(/(?<=<column.*?>).*?(?=<\/column>|<column|$)/gs)

  const featBlocks = [] as Card['features']
  for (const col of columns) {
    if (useBasicDescription && col[0].includes('---')) {
      continue
    }
    // Collect the features
    const feats = col[0]
      .replaceAll(/<br ?\/>/g, '\n\n')
      // Rexexr: (<actions string=\"[\w\s]*\" \/>)(?:\\r|\\n)\\n
      .replaceAll(/(<actions string="[\w\s]*" \/>)(?:\r|\n)\n/g, '$1 ')
      .replaceAll(/\*\*[\w\s]*\*\*(?:\r|\n)\n\*\*/g, '**')
      // Rexexr (?:\*\*(.+?)\*\*|## (.+?)<row .+?>)(.+?)(?:(?=(?:\\r|\\n)\]n)|$)
      .matchAll(/(?:\*\*(.+?)\*\*|## (.+?)<row .+?>)(.+?)(?:(?=(?:\r|\n)\n)|$)/gs)
    const group: [string, string][] = []
    let hasFeats = false
    const seenDamage = false
    for (const feature of feats) {
      let [key, value] = getFeature(feature)
      if (key) {
        hasFeats = true

        // The markdown uses <row> tags to indicate a newline
        if (value.match(/<\/?row>/)) {
          value = value.replaceAll(/<\/?row>/g, ' ')

          group.push(['newline', ''])
        }

        group.push([key.trim(), value.trim()])

        if (key === 'Damage') {
          if (!seenDamage) {
            group.splice(group.length - 2, 0, ['newline', ''])
          }
          group.push(['newline', ''])
        }
      }
    }
    if (hasFeats) {
      featBlocks.push(group)
    }
  }
  // Assign back to the card
  if (featBlocks) {
    card.features = featBlocks
  }

  /*
   * Calculate the description from the calculated markdown
   */
  const description = useBasicDescription
    ? getBasicDescription(markdown)
    : getComplexDescription(markdown)
  card.description = prefixImageLinks(description)

  /*
   * The skills are sometimes duplicated
  */
  if (card.skill) {
    card.skill = new Set(card.skill).values().toArray()
  }

  /*
   * Clean out unneded keys (needs to be last)
  */
  const extra_keys = ['exclude_from_search', 'text']
  for (const key of Object.keys(card)) {
    if (key.includes('_markdown') || extra_keys.includes(key))
      // @ts-expect-error Parameter 'name' implicitly has an 'any' type.ts(7006)
      delete card[key]
  }

  return Object.fromEntries(Object.entries(card).sort()) as Card
}

function getFeature(pair: RegExpExecArray): [string, string] {
  const key = pair[1] || pair[2]
  const value = pair[3]

  if (key === 'Price' && value === '—') {
    return [key, '0p']
  }

  if (key === 'Source') {
    return ['', '']
  }

  const linkText = key.match(/\[(.+?)\]\(.+?\)/s)
  if (linkText) {
    return [linkText[1], value]
  }

  // Tables have ## headings that are handled weird otherwise
  const tableText = value.match(/##(.+?)<row .*?>(.*)$/s)
  if (tableText) {
    return [tableText[1], tableText[2]]
  }

  return [key, value]
}

const validOldSources = ['Troubles in Otari', 'Book of the Dead', 'Secrets of Magic', 'Guns & Gears (Remastered)', 'Ancestry Guide', 'Treasure Vault']
const excludedSources = ['Pathfinder Adventure Path #219: Lord of the Trinity Star']
/**
 * Returns true if the source was published after the remaster started.
 * Some older sources are manually included.
 * Also removes all cards that are sourced from the pathfinder comics.
 */
function isAValidEntry(item: Card): boolean {
  if (item.primary_source_category === 'Comics') {
    return false
  }
  if (Date.parse(item.release_date) < Date.parse('2023-08-02') && !validOldSources.includes(item.primary_source)) {
    return false
  }
  if (item.item_child_id) {
    console.log('Skipping item with children:', item.name)
    return false
  }
  if (excludedSources.includes(item.primary_source)) {
    return false
  }
  return true
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

    // Uncomment to print off matching file for testing
    // if (card.name === 'Gurlunk') {
    //   console.log('\n')
    //   console.log(JSON.stringify(item))
    //   console.log('\n')
    // }

    if (card.category === 'skill') {
      saveRelatedActions(card)
    }

    if (card.category === 'action') {
      card = applySkillToAction(card)
    }

    card = formatCard(item._source)

    cleanMap.push(card)
  })

  return cleanMap
}
