import spells from '~/assets/data/spell.json';

const paths = {
  'spells': '~/assets/data/spell.json',
};


export type Item = {
  _source: {
    primary_source: string;
    [key: string]: string;
  }
}

type ImportResult = {
  isLoaded: boolean;
  data?: Item[];
}

export function dataImporter(type: keyof typeof paths): ImportResult {
  // let isLoaded = false;

  // let data;
  // import(paths[type], {
  //   assert: { type: 'json' }
  // }).then((res) => {
  //   data = res.default as Item[]
  // }).catch((err) => {
  //   console.log("error loading data:", err);
  // }).finally(() => {
  //   isLoaded = true;
  // });

  // console.log(data);

  // return {
  //   isLoaded,
  //   data
  // }

  return {
    isLoaded: true,
    data: spells as Item[]
  }
}
