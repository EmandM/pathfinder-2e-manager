import type { actionToImage } from '~/composables/action-to-image'

export interface Card {
  id: string
  primary_source: string
  category: string
  name: string
  actions_number: number
  actions: keyof typeof actionToImage
  target: string
  markdown: string
  source: string[]
  source_category: string[]
  trait: string[]
  trait_raw: string[]
  trait_group: string[]
  rarity: string
  range: number
  level: number
  spell_type: string
  tradition: string[]
  saving_throw: string[]
  damage_type: string[]
  weapon_category: string[]
  weapon_group: string[]
  weapon_type: string[]
  item_category: string
  item_subcategory: string
  image: string[]
  type: string
  text: string
  description: string
  features: { [feature: string]: string }[]
  primary_source_category: string
  release_date: string
  url: string
  attribute: string[]
  size: string[1]
  skill: string[]
  skill_markdown: string

  // Created on hydrate filters to avoid having to .toLowerCase() every time we search
  search_text: string
  is_trained: boolean
}

export enum FilterState {
  includes = 'include',
  excludes = 'exclude',
  inactive = 'inactive',
}
