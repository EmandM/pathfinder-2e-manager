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
  saving_throw: string
  item_category: string
  item_child_id?: string[]
  item_parent_id?: string
  item_subcategory: string
  image: string[]
  type: string
  text: string
  description: string
  features: [string, string][][]
  pfs: string
  pfs_note: string
  primary_source_category: string
  release_date: string
  url: string
  attribute: string[]
  size: string[1]
  skill: string[]

  // Weapon
  deity: string[]
  damage_type: string[]
  weapon_category: string[]
  weapon_group: string[]
  weapon_type: string[]

  // Hazard
  hazard_type: string
  complexity: string

  // Action
  associated_skill: string[] // added manually to track the skill associated with an action
  is_trained: boolean

  // Created on hydrate filters to avoid having to .toLowerCase() every time we search
  search_text: string

  // Print configuration
  xl_card: boolean
  print_image: boolean
}

export enum FilterState {
  includes = 'include',
  excludes = 'exclude',
  inactive = 'inactive',
}

export type KeysMatching<X, T> = { [K in keyof X]-?: X[K] extends T ? K : never }[keyof X]
