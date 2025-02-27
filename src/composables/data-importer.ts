import { ref, type Ref } from "vue";
import { Item } from "./item-types";

const paths = {
  spells: '/data/spell.json',
  equipment: '/data/equipment.json',
  weapons: '/data/weapon.json',
  armor: '/data/armor.json',
  shields: '/data/shield.json',
};

const importCache: Map<string, Ref<ImportResult>> = new Map();

export type ImportResult = {
  isLoaded: boolean;
  data: Item[];
}

export type DataType = keyof typeof paths;
export function dataImporter(type: string, onImport: (data: Item[]) => void): Ref<ImportResult> {
  if (!isDataType(type)) {
    console.error("invalid page name", type);
    throw("invalid page trying to be imported");
  }

  const cached = importCache.get(type)
  if (cached) {
    console.log(cached.value);
    onImport(cached.value.data);
    return cached;
  }

  let importResult: Ref<ImportResult> = ref({
    isLoaded: false,
    data: []
  })
  importCache.set(type, importResult);
  
  fetch(paths[type])
    .then((res) => res.json())
    .then((jsonData) => {
      importResult.value.isLoaded = true;
      importResult.value.data = jsonData as Item[];
      onImport(jsonData as Item[]);
    })
    .catch((err) => console.log("error loading data:", err))
    .finally(() => importResult.value.isLoaded = true);

  return importResult;
}

function isDataType(type: string): type is DataType {
  return paths[type as DataType] !== undefined;
}
