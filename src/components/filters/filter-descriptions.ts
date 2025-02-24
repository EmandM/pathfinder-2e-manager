import * as color from './filter-colors';

export type Filter = {
  name: string;
  key: string;
  options: string[]
  color: string
};

const traits: Filter = {
  name: "Traits",
  key: 'trait',
  options: [
    "It's",
    "a",
    "femininominon",
  ],
  color: color.red,
};

const levels: Filter = {
  name: "Levels",
  key: 'level',
  options: [
    "now",
    "I'm",
    "in",
    "a",
    "holy",
    "revival",
  ],
  color: color.orange,
};

const book: Filter = {
  name: "Primary Source",
  key: 'primary_source',
  options: [
    "Player Core",
  ],
  color: color.yellow,
};

export const allFilters: Filter[] = [
  traits,
  levels,
  book,
];



const softRed = "#ffd6a5"