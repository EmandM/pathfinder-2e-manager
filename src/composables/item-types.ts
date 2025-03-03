export interface Item {
  _id: string
  _source: ItemSource
}

export interface ItemSource {
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

  // Created on hydrate filters to avoid having to .toLowerCase() every time we search
  _searchText: string
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

export type FilterFunction<T> = (itemValue: T, options: FilterValues) => boolean

export type Filter = {
  [K in keyof ItemSource]: {
    name: string
    key: K
    options: string[]
    color: string
    matches: FilterFunction<ItemSource[K]>
  }
}[keyof ItemSource]
