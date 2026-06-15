import type { Card } from '../composables/types.ts'

/**
 * Gets a single list of items as defined by the given regexes
 * @param markdown Markdown text from the card
 * @param blockRegex Regex indicating the block to search for
 * @param itemRegex Rexex indicating separate items within the block
 * @returns List of items
 */
function getInnerFromRegexes(markdown: string, blockRegex: RegExp, itemRegex: RegExp): string[] {
  const blocks = markdown.match(blockRegex)
  if (!blocks) {
    return []
  }

  let out: string[] = []
  blocks.forEach((actionBlock) => {
    const ids = actionBlock.match(itemRegex)
    if (!ids) {
      return
    }
    if (out) {
      out.push(...ids)
    }
    else {
      out = ids
    }
  })

  return out
}

/**
 * Defines blocks of info and whether the items in this block are trained
 */
interface SkillInfo {
  isTrained: boolean
  skills: string[]
}

/**
 * Defines blocks of info and whether the items in this block are trained
 */
class ActionToSkill {
  actionsToInfo: Map<string, SkillInfo>

  constructor() {
    this.actionsToInfo = new Map()
  }

  add(key: string, skill: string, isTrained: boolean) {
    let current = this.actionsToInfo.get(key)
    if (current) {
      current.skills.push(skill)
    }
    else {
      current = {
        skills: [skill],
        isTrained,
      }
    }
    this.actionsToInfo.set(key, current)
  }

  addMany(keys: string[], skill: string, isTrained: boolean) {
    for (const key of keys) {
      this.add(key, skill, isTrained)
    }
  }

  get(key: string): SkillInfo | undefined {
    return this.actionsToInfo.get(key)
  }

  isPopulated(): boolean {
    return this.actionsToInfo.size > 0
  }
}

let actionToSkill = new ActionToSkill()

const untrainedGeneral = /<title((?!<\/title>).)*Untrained General Actions<\/title>.*?(?=<title|$)/s
const untrained = /<title((?!<\/title>).)*Untrained Actions<\/title>.*?(?=<title|$)/s
const trainedGeneral = /<title((?!<\/title>).)*Trained General Actions<\/title>.*?(?=<title|$)/s
const trained = /<title((?!<\/title>).)*Trained Actions<\/title>.*?(?=<title|$)/s
const idRegex = /(?<=id=").*?(?=")/gs
const nameRegex = /(?<=- \[).*?(?=\])/gs
export function saveRelatedActions(card: Card) {
  const trainedIds = getInnerFromRegexes(card.markdown, trained, idRegex) || []
  actionToSkill.addMany(trainedIds, card.skill[0], true)

  const untrainedIds = getInnerFromRegexes(card.markdown, untrained, idRegex) || []
  actionToSkill.addMany(untrainedIds, card.skill[0], false)

  const trainedGeneralIds = getInnerFromRegexes(card.markdown, trainedGeneral, nameRegex) || []
  actionToSkill.addMany(trainedGeneralIds, card.skill[0], true)

  const untrainedGeneralIds = getInnerFromRegexes(card.markdown, untrainedGeneral, nameRegex) || []
  actionToSkill.addMany(untrainedGeneralIds, card.skill[0], false)
}

export function checkActionToSkill(firstEntry: Card) {
  if (firstEntry.category === 'skill') {
    if (actionToSkill.isPopulated()) {
      console.error('actionToSkill object is already populated. Ensure skill scrape is not processed twice')
    }
    actionToSkill = new ActionToSkill()
  }

  if (firstEntry.category === 'action') {
    if (!actionToSkill) {
      console.error('actionToSkill object is unpopulated. Ensure skill scrape is processed before action scrape')
    }
  }
}

export function applySkillToAction(action: Card): Card {
  if (!actionToSkill) {
    console.error('actionToSkill object is unpopulated. Ensure skill scrape is processed before action scrape')
    return action
  }

  const skills = action.associated_skill || []
  let isTrained = false

  const idInfo = actionToSkill.get(action.id)
  if (idInfo) {
    skills.push(...idInfo.skills)
    isTrained = idInfo.isTrained
  }
  const nameInfo = actionToSkill.get(action.name)
  if (nameInfo) {
    skills.push(...nameInfo.skills)
    if (idInfo && idInfo.isTrained !== nameInfo.isTrained) {
      console.warn(`${action.id} has conflicting action trained information`)
    }
    isTrained = nameInfo.isTrained
  }

  action.associated_skill = skills
  action.is_trained = isTrained
  return action
}
