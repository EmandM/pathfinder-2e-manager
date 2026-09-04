import type { Card } from './types'

export function isRune(card: Card): boolean {
  return (!!card.item_category && card.item_category.toLowerCase() === 'runes')
}
