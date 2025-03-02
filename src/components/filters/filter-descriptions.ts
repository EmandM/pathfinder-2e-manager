import type { Filter, FilterValues, ItemSource } from '~/composables/item-types'
import { FilterState } from '~/composables/item-types'
import * as color from './filter-colors'

function andStringArrayMatch<T extends Array<string>>(item: T, options: FilterValues): boolean {
  for (const [value, state] of options) {
    if (state === FilterState.includes && !item.includes(value)) {
      return false
    }
    else if (state === FilterState.excludes && item.includes(value)) {
      return false
    }
  }
  return true
}

function fieldMatch<T extends string | number>(item: T, options: FilterValues): boolean {
  for (const [value, state] of options) {
    if (state === FilterState.includes && item !== value) {
      return false
    }
    else if (state === FilterState.excludes && item === value) {
      return false
    }
  }
  return true
}

const baseFilters: Filter[] = [{
  name: 'Traits',
  key: 'trait',
  options: [],
  color: color.red,
  matches: andStringArrayMatch,
}, {
  name: 'Source',
  key: 'source',
  options: [],
  color: color.yellow,
  matches: andStringArrayMatch,
}, {
  name: 'Rarity',
  key: 'rarity',
  options: [],
  color: color.limegreen,
  matches: fieldMatch,
}, {
  name: 'Source Category',
  key: 'source_category',
  options: [],
  color: color.green,
  matches: andStringArrayMatch,
}]

export const allFilters: { [key: string]: Filter[] } = {
  spell: [
    {
      name: 'Tradition',
      key: 'tradition',
      options: [],
      color: color.orange,
      matches: andStringArrayMatch,
    },
    {
      name: 'Saving Throw',
      key: 'saving_throw',
      options: [],
      color: color.pink,
      matches: andStringArrayMatch,
    },
    {
      name: 'Actions',
      key: 'actions',
      options: [],
      color: color.bluegreen,
      matches: fieldMatch,
    },
    {
      name: 'Spell Type',
      key: 'spell_type',
      options: [],
      color: color.darkblue,
      matches: fieldMatch,
    },
  ],
  weapon: [
    {
      name: 'Damage Type',
      key: 'damage_type',
      options: [],
      color: color.pink,
      matches: andStringArrayMatch,
    },
    {
      name: 'Weapon Category',
      key: 'weapon_category',
      options: [],
      color: color.purple,
      matches: andStringArrayMatch,
    },
    {
      name: 'Weapon Group',
      key: 'weapon_group',
      options: [],
      color: color.darkorage,
      matches: andStringArrayMatch,
    },
    {
      name: 'Weapon Type',
      key: 'weapon_type',
      options: [],
      color: color.softRed,
      matches: andStringArrayMatch,
    },
  ],
  equipment: [
    {
      name: 'Category',
      key: 'item_category',
      options: [],
      color: color.purple,
      matches: fieldMatch,
    },
  ],
}

type PageFilterList = keyof typeof allFilters & string
function pageHasFilters(page: string): page is PageFilterList {
  return allFilters[page] !== undefined
}

export function useFiltersForPage(pageName: string): Filter[] {
  if (!pageHasFilters(pageName)) {
    return [...baseFilters]
  }

  return [...baseFilters, ...allFilters[pageName]]
}
