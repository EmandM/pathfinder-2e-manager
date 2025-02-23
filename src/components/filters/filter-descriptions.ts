import * as color from './filter-colors';

export type Filter = {
  name: String;
  options: String[]
  color: String
};

const traits: Filter = {
  name: "Traits",
  options: [
    "It's",
    "a",
    "femininominon",
  ],
  color: color.red,
};

const levels: Filter = {
  name: "Levels",
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

export const allFilters: Filter[] = [
  traits,
  levels,
];



const softRed = "#ffd6a5"