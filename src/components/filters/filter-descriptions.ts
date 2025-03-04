import type { Filter, FilterValues } from '~/composables/types'
import { FilterState } from '~/composables/types'
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

export interface FiltersForPage {
  shortcut?: Filter
  selectable: Filter[]
}
const filterByPage: { [key: string]: FiltersForPage } = {
  spell: {
    shortcut: {
      name: 'Spell Type',
      key: 'spell_type',
      options: [],
      color: color.darkblue,
      matches: fieldMatch,
    },
    selectable: [
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

    ],
  },
  weapon: { selectable: [
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
  ] },
  equipment: { selectable: [
    {
      name: 'Category',
      key: 'item_category',
      options: [],
      color: color.purple,
      matches: fieldMatch,
    },
  ] },
}

type PageFilterList = keyof typeof filterByPage & string
function pageHasFilters(page: string): page is PageFilterList {
  return filterByPage[page] !== undefined
}

export function useFiltersForPage(pageName: string): FiltersForPage {
  if (!pageHasFilters(pageName)) {
    return { selectable: [...baseFilters] }
  }
  const forPage = filterByPage[pageName]
  return {
    shortcut: forPage.shortcut,
    selectable: [...baseFilters, ...forPage.selectable],
  }
}
