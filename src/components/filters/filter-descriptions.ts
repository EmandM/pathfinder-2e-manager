import type { Card } from '~/composables/types'
import { useBookmarks } from '~/composables/bookmark-storage'
import { capitalizeFirstLetter } from '~/composables/capitalize'
import * as color from './filter-colors'

export type Filter = FilterClass<keyof Card>
abstract class FilterClass<K extends keyof Card> {
  name: string
  key: K
  color: string
  options: string[]

  isSingleOption: boolean
  shouldHide: boolean

  constructor(name: string, key: K, color: string) {
    this.name = name
    this.key = key
    this.color = color
  }

  abstract isMatch(cardValue: Card[K], filterOption: string): boolean

  getLabelText(value: any): string {
    return `${value}`
  }

  // Hydrate all valid options from the given cards, excluding the options pass into toExclude
  hydrate(cards: Card[], toExclude: string[]) {
    const excludeSet = new Set(toExclude)
    const allValues = this.hydrateValues(cards)
    this.options = [...allValues.difference(excludeSet)]
  }

  // Override this to customize how options are collected
  hydrateValues(cards: Card[]): Set<string> {
    const set = new Set<string>()

    for (const card of cards) {
      const values = card[this.key]

      if (Array.isArray(values)) {
        for (const value of values) {
          set.add(this.getLabelText(value))
        }
      }
      else if (typeof values === 'object') {
        console.warn('Unimplemented - object fields')
      }
      else if (typeof values === 'boolean') {
        set.add(this.getLabelText(values))
      }
      else if (values) {
        set.add(this.getLabelText(values))
      }
    }

    return set
  }

  public getTag(option: string) {
    return `${this.name} - ${capitalizeFirstLetter(option)}`
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

class FuzzyStringFilter<K extends KeysMatching<string>> extends FilterClass<K> {
  keysToMatch: Set<string>

  constructor(name: string, key: K, color: string, allowedOptions: string[]) {
    super(name, key, color)
    this.keysToMatch = new Set(allowedOptions)
  }

  isMatch(value: string, filterOption: string): boolean {
    return value.toLowerCase().includes(filterOption.toLowerCase())
  }

  hydrateValues(cards: Card[]): Set<string> {
    const set = new Set<string>()

    for (const card of cards) {
      const value = card[this.key]
      if (!value) {
        continue
      }

      this.keysToMatch.forEach((allowedOption) => {
        if (value.toLowerCase().includes(allowedOption.toLowerCase())) {
          set.add(allowedOption)
        }
      })

      if (this.keysToMatch.isSubsetOf(set)) {
        break
      }
    }
    return set
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

  hydrateValues(_cards: Card[]): Set<string> {
    return new Set(bookmarkManager.getListNames())
  }
}

class BooleanFilter<K extends KeysMatching<boolean>> extends FilterClass<K> {
  trueLabel: string
  falseLabel: string

  constructor(name: string, key: K, color: string, trueLabel: string, falseLabel: string) {
    super(name, key, color)
    this.trueLabel = trueLabel
    this.falseLabel = falseLabel
  }

  isMatch(value: boolean, filterOption: string): boolean {
    return filterOption === this.trueLabel ? value : !value
  }

  getLabelText(value: boolean): string {
    return value ? this.trueLabel : this.falseLabel
  }
}

class HasImageFilter extends FilterClass<'image'> {
  isSingleOption = true
  constructor(color: string) {
    super('Has Image', 'image', color)
  }

  isMatch(value: Array<string>, _: string): boolean {
    return value?.length > 0
  }

  hydrate(_cards: Card[]): void {
    this.options = []
  }

  public getTag(_: string): string {
    return 'Items with images'
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
      new FuzzyStringFilter('Saving Throw', 'saving_throw', color.pink, ['AC', 'Reflex', 'Will', 'Fortitude']),
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
      new ValueFilter('Subcategory', 'item_subcategory', color.blue),
    ],
  },
  skill: {
    selectable: [
      new StringArrayFilter('Attribute', 'attribute', color.blue),
    ],
  },
  action: {
    selectable: [
      new StringArrayFilter('Skill', 'associated_skill', color.bluegreen),
      new StringArrayFilter('Trait group', 'trait_group', color.blue),
      new BooleanFilter('Trained', 'is_trained', color.darkblue, 'Trained action', 'Untrained action'),
      new ValueFilter('Actions', 'actions', color.orange),
    ],
  },
  shield: {
    shortcut: new ValueFilter('Subcategory', 'item_subcategory', color.blue),
    selectable: [],
  },
  creature: {
    selectable: [new HasImageFilter(color.pink)],
  },
  deity: {
    selectable: [new HasImageFilter(color.pink)],
  },
  feat: {
    selectable: [new StringArrayFilter('Skill', 'skill', color.bluegreen)],
  },
  hazard: {
    selectable: [
      new ValueFilter('Hazard Type', 'hazard_type', color.bluegreen),
      new ValueFilter('Complexity', 'complexity', color.blue),
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
