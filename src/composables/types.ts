import type { Filter } from '~/components/filters/filter-descriptions'

export interface Card {
  id: string
  primary_source: string
  name: string
  actions_number: number
  actions: keyof typeof actionToImage
  target: string
  markdown: string
  source: string[]
  source_category: string[]
  trait: string[]
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
  type: string
  text: string
  description: string
  features: { [feature: string]: string }

  // Created on hydrate filters to avoid having to .toLowerCase() every time we search
  search_text: string
}

export const actionToImage = {
  'Reaction': '/img/action_reaction_black.png',
  'Single Action': '/img/action_single_black.png',
  'Two Actions': '/img/action_double_black.png',
  'Three Actions': '/img/action_triple_black.png',
  'Single Action to Three Actions': '/img/action_range_black.png',
  'Free Action': '/img/action_free_black.png',
}

export const cantripFilter = 'C'
export const focusFilter = 'F'

export enum FilterState {
  includes = 'include',
  excludes = 'exclude',
  inactive = 'inactive',
}

export type FilterValues = Map<string, FilterState>

export interface AppliedFilter {
  filter: Filter
  appliedValues: FilterValues
}
