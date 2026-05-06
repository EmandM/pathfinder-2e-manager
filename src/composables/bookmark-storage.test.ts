import type { BookmarkList } from './bookmark-storage'
import type { Card } from './types'
import { beforeEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { Bookmarker } from './bookmark-storage'

function makeBookmarker(lists: BookmarkList[] = []) {
  return new Bookmarker(ref(lists), ref(0))
}

function makeCard(id: string): Card {
  return { id, name: `Card ${id}` } as Card
}

describe('bookmarker', () => {
  describe('createList', () => {
    let bookmarker: Bookmarker
    beforeEach(() => {
      bookmarker = makeBookmarker()
    })

    it('deduplicates names by appending an incrementing suffix', () => {
      bookmarker.createList()
      bookmarker.createList()
      bookmarker.createList()
      expect(bookmarker.getListNames()).toEqual(['bookmarks', 'bookmarks-1', 'bookmarks-2'])
    })

    it('reuses base name once another list is renamed', () => {
      bookmarker.createList()
      bookmarker.createList()
      bookmarker.setName(0, 'my list')
      bookmarker.createList()
      expect(bookmarker.getListNames()).toEqual(['my list', 'bookmarks-1', 'bookmarks'])
    })
  })

  describe('deleteList', () => {
    let bookmarker: Bookmarker

    beforeEach(() => {
      bookmarker = makeBookmarker([
        { name: 'bookmarks', bookmarked: {} },
        { name: 'favorites', bookmarked: {} },
      ])
    })

    it('removes the list at the given index', () => {
      bookmarker.deleteList(1)
      expect(bookmarker.getListNames()).toEqual(['bookmarks'])
    })

    it('does not delete the active list', () => {
      bookmarker.deleteList(0)
      expect(bookmarker.getListNames()).toHaveLength(2)
    })

    it('creates a replacement list when the last non-active list is deleted', () => {
      bookmarker.setActive(1)
      bookmarker.deleteList(0)
      expect(bookmarker.active.value).toBe(0)
      expect(bookmarker.getListNames()).toContain('favorites')
      // manually change the active index to something invalid to test the replacement list creation logic
      bookmarker.active.value = 1
      bookmarker.deleteList(0)
      expect(bookmarker.getListNames()).toHaveLength(1)
      expect(bookmarker.getListNames()).toContain('bookmarks')
    })
  })

  describe('setActive', () => {
    let bookmarker: Bookmarker

    beforeEach(() => {
      bookmarker = makeBookmarker([
        { name: 'bookmarks', bookmarked: {} },
        { name: 'favorites', bookmarked: {} },
      ])
    })

    it('sets the active list', () => {
      bookmarker.setActive(1)
      expect(bookmarker.activeName()).toBe('favorites')
    })

    it('ignores an out-of-bounds index', () => {
      bookmarker.setActive(99)
      expect(bookmarker.activeName()).toBe('bookmarks')
    })
  })

  describe('setName', () => {
    let bookmarker: Bookmarker

    beforeEach(() => {
      bookmarker = makeBookmarker([
        { name: 'bookmarks', bookmarked: {} },
        { name: 'favorites', bookmarked: {} },
      ])
    })

    it('renames the list at the given index', () => {
      bookmarker.setName(0, 'my list')
      expect(bookmarker.getListNames()).toContain('my list')
    })

    it('rejects a name already used by another list', () => {
      bookmarker.setName(0, 'favorites')
      expect(bookmarker.getListNames()[0]).toBe('bookmarks')
    })
  })

  describe('toggleBookmark and isBookmarked', () => {
    let bookmarker: Bookmarker
    let card: Card

    beforeEach(() => {
      bookmarker = makeBookmarker()
      bookmarker.createList()
      card = makeCard('1')
    })

    it('returns false before a card is bookmarked', () => {
      expect(bookmarker.isBookmarked(card)).toBe(false)
    })

    it('returns true after toggling a card on', () => {
      bookmarker.toggleBookmark(card)
      expect(bookmarker.isBookmarked(card)).toBe(true)
    })

    it('returns false after toggling a card off', () => {
      bookmarker.toggleBookmark(card)
      bookmarker.toggleBookmark(card)
      expect(bookmarker.isBookmarked(card)).toBe(false)
    })
  })

  describe('hasBookmark', () => {
    let bookmarker: Bookmarker

    beforeEach(() => {
      bookmarker = makeBookmarker()
      bookmarker.createList()
      bookmarker.toggleBookmark(makeCard('1'))
    })

    it('returns true for the correct list and card id', () => {
      expect(bookmarker.hasBookmark('bookmarks', '1')).toBe(true)
    })

    it('returns false for a card id not in the list', () => {
      expect(bookmarker.hasBookmark('bookmarks', '99')).toBe(false)
    })

    it('returns false for an unknown list name', () => {
      expect(bookmarker.hasBookmark('no-such-list', '1')).toBe(false)
    })
  })

  describe('getCardsInList', () => {
    let bookmarker: Bookmarker

    beforeEach(() => {
      bookmarker = makeBookmarker()
      bookmarker.createList()
    })

    it('returns the bookmarked card', () => {
      bookmarker.toggleBookmark(makeCard('1'))
      const cards = bookmarker.getCardsInList('bookmarks')
      expect(cards).toHaveLength(1)
      expect(cards[0].id).toBe('1')
    })

    it('returns an empty array after a bookmark is toggled off', () => {
      const card = makeCard('1')
      bookmarker.toggleBookmark(card)
      bookmarker.toggleBookmark(card)
      expect(bookmarker.getCardsInList('bookmarks')).toHaveLength(0)
    })

    it('returns an empty array for an unknown list name', () => {
      expect(bookmarker.getCardsInList('no-such-list')).toEqual([])
    })
  })
})
