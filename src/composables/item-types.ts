export interface Item {
  _id: string
  _source: ItemSource
}

export interface ItemSource {
  primary_source: string
  name: string
  actions_number: number
  actions: keyof typeof actionToImage
  target: string
  markdown: string
  source: string[]
  trait: string[]
  rarity: string
  range: number
  spell_type: string
  level: number

  [key: string]: any
}

export const actionToImage = {
  'Reaction': '/img/action_reaction_black.png',
  'Single Action': '/img/action_single_black.png',
  'Two Actions': '/img/action_double_black.png',
  'Three Actions': '/img/action_triple_black.png',
  'Single Action to Three Actions': '/img/action_range_black.png',
  'Free Action': '/img/action_free_black.png',
}
