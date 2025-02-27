import * as color from './filter-colors';
import { ItemSource, KeyOfType } from '~/composables/item-types';

export type FilterFunction<T> = (itemValue: T, options: Set<string>) => boolean;

export type Filter = FilterDescription<keyof ItemSource>;
type FilterDescription<T extends keyof ItemSource> = {
  name: string;
  key: T;
  options: string[];
  color: string;
  matches: FilterFunction<ItemSource[T]>;
};

function andStringArrayMatch<T extends Array<string>>(item: T, options: Set<string>): boolean {
  for (const opt of options) {
    if (!item.includes(opt)) {
      return false;
    }
  }
  return true;
}

function fieldMatch<T extends string>(item: T, options: Set<string>): boolean {
  for (const opt of options) {
    if (item !== opt) {
      return false;
    }
  }
  return true;
}

const baseFilters: Filter[] = [{
  name: "Traits",
  key: 'trait',
  options: [],
  color: color.red,
  matches: andStringArrayMatch,
}, {
  name: "Source",
  key: 'source',
  options: [],
  color: color.yellow,
  matches: andStringArrayMatch
}, {
  name: "Rarity",
  key: 'rarity',
  options: [],
  color: color.limegreen,
  matches: fieldMatch
}, {
  name: "Source Category",
  key: 'source_category',
  options: [],
  color: color.green,
  matches: andStringArrayMatch
}];

export function useFiltersForPage(pageName: string): Filter[] {
  if (!pageHasFilters(pageName)) {
    return [...baseFilters];
  }

  return [...baseFilters, ...allFilters[pageName]];
}

export const allFilters: {[key: string]: Filter[]} = {
  spells: [
    {
      name: "Tradition",
      key: 'tradition',
      options: [],
      color: color.orange,
      matches: andStringArrayMatch,
    }, {
      name: "Saving Throw",
      key: 'saving_throw',
      options: [],
      color: color.pink,
      matches: andStringArrayMatch
    }, {
      name: "Actions",
      key: 'actions',
      options: [],
      color: color.bluegreen,
      matches: fieldMatch
    }, {
      name: "Level",
      key: 'level',
      options: [],
      color: color.blue,
      matches: fieldMatch
    }, {
      name: "Spell Type",
      key: 'spell_type',
      options: [],
      color: color.darkblue,
      matches: fieldMatch
    },
  ],
  weapons: [
    {
      name: "Damage Type",
      key: 'damage_type',
      options: [],
      color: color.pink,
      matches: andStringArrayMatch
    },{
      name: "Weapon Category",
      key: 'weapon_category',
      options: [],
      color: color.purple,
      matches: andStringArrayMatch
    },{
      name: "Weapon Group",
      key: 'weapon_group',
      options: [],
      color: color.darkorage,
      matches: andStringArrayMatch
    },{
      name: "Weapon Type",
      key: 'weapon_type',
      options: [],
      color: color.softRed,
      matches: andStringArrayMatch
    },
  ],
  equipment: [
    {
      name: 'Category',
      key: 'item_category',
      options: [],
      color: color.purple,
      matches: fieldMatch,
    }
  ]
};

type PageFilterList = keyof typeof allFilters & string;
function pageHasFilters(page: string): page is PageFilterList {
  return allFilters[page as PageFilterList] !== undefined;
}
