import { ref, type Ref } from "vue";

const paths = {
  'spells': '/data/spell.json',
};

type ItemSource = {
  primary_source: string;
  [key: string]: string | string[];
}

export type Item = {
  _source: ItemSource;
}

const importCache: Map<string, Ref<ImportResult>> = new Map();

export type ImportResult = {
  isLoaded: boolean;
  data: Item[];
}

export function dataImporter(type: keyof typeof paths, onImport: (data: Item[]) => void): Ref<ImportResult> {
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
