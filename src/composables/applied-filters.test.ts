import type { Card } from './types'
import { describe, expect, it } from 'vitest'
import { hasImageFilter, rarityFilter, traitFilter } from '../components/filters/filter-descriptions'
import { AppliedFilterCollection, useFilteredList } from './applied-filters'

describe('add filter', () => {
  it('cards matching the filter option pass', () => {
    const cards = [
      { trait: ['Fire'] } as Card,
      { trait: ['Cold'] } as Card,
      { trait: ['Fire', 'Evocation'] } as Card,
    ]
    const filters = new AppliedFilterCollection()
    filters.addFilter(traitFilter, 'Fire')

    const result = useFilteredList(cards, filters)

    expect(result).toHaveLength(2)
    expect(result.every(c => c.trait.includes('Fire'))).toBe(true)
  })

  it('card with an empty array for the filtered field does not pass', () => {
    const cards = [{ trait: [] as string[] } as Card, { trait: ['Fire'] } as Card]
    const filters = new AppliedFilterCollection()
    filters.addFilter(traitFilter, 'Fire')

    expect(useFilteredList(cards, filters)).toHaveLength(1)
  })

  it('no cards pass when the option matches nothing', () => {
    const cards = [{ trait: ['Fire'] } as Card, { trait: ['Cold'] } as Card]
    const filters = new AppliedFilterCollection()
    filters.addFilter(traitFilter, 'Divine')

    expect(useFilteredList(cards, filters)).toHaveLength(0)
  })

  it('card must match all chosen options on the same filter', () => {
    const cards = [
      { trait: ['Fire', 'Cold'] } as Card,
      { trait: ['Fire'] } as Card,
      { trait: ['Cold'] } as Card,
    ]
    const filters = new AppliedFilterCollection()
    filters.addFilter(traitFilter, 'Fire')
    filters.addFilter(traitFilter, 'Cold')

    const result = useFilteredList(cards, filters)

    expect(result).toHaveLength(1)
    expect(result[0].trait).toContain('Fire')
    expect(result[0].trait).toContain('Cold')
  })

  it('card must match all applied filters', () => {
    const cards = [
      { trait: ['Fire'], rarity: 'common' } as Card,
      { trait: ['Fire'], rarity: 'rare' } as Card,
      { trait: ['Cold'], rarity: 'common' } as Card,
    ]
    const filters = new AppliedFilterCollection()
    filters.addFilter(traitFilter, 'Fire')
    filters.addFilter(rarityFilter, 'common')

    const result = useFilteredList(cards, filters)

    expect(result).toHaveLength(1)
    expect(result[0].trait).toContain('Fire')
    expect(result[0].rarity).toBe('common')
  })

  it('valueFilter uses exact match — partial string does not pass', () => {
    const cards = [{ rarity: 'uncommon' } as Card, { rarity: 'common' } as Card]
    const filters = new AppliedFilterCollection()
    filters.addFilter(rarityFilter, 'common')

    const result = useFilteredList(cards, filters)

    expect(result).toHaveLength(1)
    expect(result[0].rarity).toBe('common')
  })

  it('single-option filter: card with a non-empty image array passes', () => {
    const cards = [
      { image: ['img.png'] } as Card,
      {} as Card,
    ]
    const filters = new AppliedFilterCollection()
    filters.addFilter(hasImageFilter, '')

    const result = useFilteredList(cards, filters)

    expect(result).toHaveLength(1)
    expect(result[0].image).toHaveLength(1)
  })

  it('single-option filter: card with no image does not pass', () => {
    const cards = [{} as Card, {} as Card]
    const filters = new AppliedFilterCollection()
    filters.addFilter(hasImageFilter, '')

    expect(useFilteredList(cards, filters)).toHaveLength(0)
  })
})
