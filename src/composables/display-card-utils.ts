import type { Card } from './types'

class DisplayUtils {
  private card
  constructor(card: Card) {
    this.card = card
  }

  public isCreature(): boolean {
    return this.card.category === 'creature' && !this.card.print_image
  }

  public printWide(): boolean {
    return this.isCreature() || (this.card.xl_card && !this.card.print_image)
  }

  public printLong(): boolean {
    return this.isCreature() && this.card.xl_card
  }

  public isRune(): boolean {
    return (!!this.card.item_category && this.card.item_category.toLowerCase() === 'runes')
  }

  public printAsShortRune(): boolean {
    return this.isRune() && !this.card.full_rune
  }
}

export function calculateCardDisplay(card: Card) {
  return new DisplayUtils(card)
}
