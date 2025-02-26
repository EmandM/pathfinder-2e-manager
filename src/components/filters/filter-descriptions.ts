import * as color from './filter-colors';
import { ItemSource, KeyOfType } from '~/composables/item-types';

export type FilterFunction<T> = (itemValue: T, options: Set<string>) => boolean;

export type Filter<T extends keyof ItemSource> = {
  name: string;
  key: T;
  options: string[];
  color: string;
  matches: FilterFunction<ItemSource[T]>;
};


const traits = {
  name: "Traits",
  key: 'trait',
  options: [
    "Chaotic",
    "Acid",
    "Trip",
    "Focus",
  ],
  color: color.red,
  matches: andStringArrayMatch,
};

const tradition = {
  name: "Tradition",
  key: 'tradition',
  options: [
    "Primal",
    "Divine",
    "Arcane",
    "Occult",
  ],
  color: color.orange,
  matches: andStringArrayMatch,
};

const book = {
  name: "Source",
  key: 'source',
  options: [
    "Player Core",
    "Core Rulebook",
  ],
  color: color.yellow,
  matches: andStringArrayMatch
};

function andStringArrayMatch<T extends Array<String>>(item: T, options: Set<string>): boolean {
  for (const opt of options) {
    if (!item.includes(opt)) {
      return false;
    }
  }
  return true;
}

export const allFilters: Filter<any>[] = [
  traits,
  // levels,
  book,
  tradition,
];



const softRed = "#ffd6a5"