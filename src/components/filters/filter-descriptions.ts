import type { Card } from '~/composables/types'
import { useBookmarks } from '~/composables/bookmark-storage'
import * as color from './filter-colors'

export type Filter = FilterClass<keyof Card>
abstract class FilterClass<K extends keyof Card> {
  name: string
  key: K
  color: string
  options: string[]

  constructor(name: string, key: K, color: string) {
    this.name = name
    this.key = key
    this.color = color
  }

  abstract isMatch(cardValue: Card[K], filterOption: string): boolean

  hydrate(cards: Card[]) {
    const set = new Set<string>()

    for (const card of cards) {
      const values: Card[keyof Card] = card[this.key]

      if (Array.isArray(values)) {
        for (const value of values) {
          set.add(`${value}`)
        }
      }
      else if (typeof values === 'object') {
        console.warn('Unimplemented - object fields')
      }
      else {
        set.add(`${values}`)
      }
    }

    this.options = [...set]
  }
}

type KeysMatching<T> = { [K in keyof Card]-?: Card[K] extends T ? K : never }[keyof Card]

class StringArrayFilter<K extends KeysMatching<Array<string>>> extends FilterClass<K> {
  constructor(name: string, key: K, color: string) {
    super(name, key, color)
  }

  isMatch(value: Array<string>, filterOption: string): boolean {
    return value.includes(filterOption)
  }
}

class ValueFilter<K extends KeysMatching<string | number>> extends FilterClass<K> {
  constructor(name: string, key: K, color: string) {
    super(name, key, color)
  }

  isMatch(value: string | number, filterOption: string): boolean {
    return value === filterOption
  }
}

// bookmarkManager is reactive, it will be kept up-to-date under the hood by Vue
const bookmarkManager = useBookmarks()

class BookmarkFilter extends FilterClass<'id'> {
  constructor(color: string) {
    super('Bookmarks', 'id', color)
  }

  isMatch(cardId: string, filterOption: string): boolean {
    return bookmarkManager.hasBookmark(filterOption, cardId)
  }

  hydrate(_cards: Card[]): void {
    this.options = bookmarkManager.getListNames()
  }
}

const baseFilters: Filter[] = [
  new StringArrayFilter('Traits', 'trait', color.red),
  new StringArrayFilter('Source', 'source', color.yellow),
  new ValueFilter('Rarity', 'rarity', color.limegreen),
  new StringArrayFilter('Source Category', 'source_category', color.green),
  new BookmarkFilter(color.purple),
]

export interface FiltersForPage {
  shortcut?: Filter
  selectable: Filter[]
}
const filterByPage: { [key: string]: FiltersForPage } = {
  spell: {
    shortcut: new ValueFilter('Spell Type', 'spell_type', color.darkblue),
    selectable: [
      new StringArrayFilter('Tradition', 'tradition', color.orange),
      new StringArrayFilter('Saving Throw', 'saving_throw', color.pink),
      new ValueFilter('Actions', 'actions', color.bluegreen),
    ],
  },
  weapon: {
    shortcut: new StringArrayFilter('Weapon Category', 'weapon_category', color.darkblue),
    selectable: [
      new StringArrayFilter('Damage Type', 'damage_type', color.pink),
      new StringArrayFilter('Weapon Group', 'weapon_group', color.darkorage),
      new StringArrayFilter('Weapon Type', 'weapon_type', color.softRed),
    ],
  },
  equipment: {
    selectable: [
      new ValueFilter('Category', 'item_category', color.bluegreen),
    ],
  },
  skill: {
    selectable: [
      new StringArrayFilter('Attribute', 'attribute', color.blue),
    ],
  },
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

// Level filter is handled separately as it is displayed separately
const defaultLevel = ['1', '2', '3', '4', '5', '6']
export function useLevelFilter(page: string): string[] {
  if (page === 'spell') {
    return [...defaultLevel]
  }
  return ['0', ...defaultLevel, `${defaultLevel.length + 1}`]
}
