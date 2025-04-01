import type { Filter } from '~/components/filters/filter-descriptions'
import type { actionToImage } from '~/composables/action-to-image'

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
  primary_source_category: string
  release_date: string
  url: string

  // Created on hydrate filters to avoid having to .toLowerCase() every time we search
  search_text: string
}

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
