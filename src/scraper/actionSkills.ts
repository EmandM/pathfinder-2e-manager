import type { Card } from '../composables/types.ts'

function getInnerFromRegexes(markdown: string, outerRegex: RegExp, innerRegex: RegExp): Card['id'][] {
  const blocks = markdown.match(outerRegex)
  if (!blocks) {
    return []
  }

  let out: Card['id'][] = null
  blocks.forEach((actionBlock) => {
    const ids = actionBlock.match(innerRegex)
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

  return out || []
}

interface SkillInfo {
  isTrained: boolean
  skills: string[]
}

interface InfoMap {
  [key: string]: SkillInfo
}

class ActionToSkill {
  actionsToInfo: InfoMap

  constructor() {
    this.actionsToInfo = {} as InfoMap
  }

  add(key: string, skill: string, isTrained: boolean) {
    if (this.actionsToInfo[key]) {
      this.actionsToInfo[key].skills.push(skill)
    }
    else {
      this.actionsToInfo[key] = {
        skills: [skill],
        isTrained,
      }
    }
  }

  addMany(keys: string[], skill: string, isTrained: boolean) {
    for (const key of keys) {
      this.add(key, skill, isTrained)
    }
  }

  get(key: string): SkillInfo {
    return this.actionsToInfo[key]
  }
}

let actionToSkill: ActionToSkill = null
let nameToSkill: ActionToSkill = null

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
    if (actionToSkill || nameToSkill) {
      console.error('actionToSkill object is already populated. Ensure skill scrape is not processed twice')
    }
    actionToSkill = new ActionToSkill()
    nameToSkill = new ActionToSkill()
  }

  if (firstEntry.category === 'action') {
    if (!actionToSkill || !nameToSkill) {
      console.error('actionToSkill object is unpopulated. Ensure skill scrape is processed before action scrape')
    }
  }
}

export function applySkillToAction(action: Card): Card {
  if (!actionToSkill) {
    return
  }

  const skills = action.skill || []
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

  action.skill = skills
  action.is_trained = isTrained
  return action
}
