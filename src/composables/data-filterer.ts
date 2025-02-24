import { Item } from "./data-importer";
import { AppliedFilterCollection } from "./selected-tags";


class Filterer {
  applied: AppliedFilterCollection;

  constructor(applied: AppliedFilterCollection) {
    this.applied = applied
  }
}