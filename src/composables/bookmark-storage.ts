import type { RemovableRef } from '@vueuse/core'
import type { Card } from './types'
import { useStorage } from '@vueuse/core'

export interface BookmarkList {
  name: string
  bookmarked: {
    [key: Card['id']]: Card
  }
}

class Bookmarker {
  lists: RemovableRef<BookmarkList[]>
  active: RemovableRef<number>

  constructor(lists: RemovableRef<BookmarkList[]>, active: RemovableRef<number>) {
    this.lists = lists
    this.active = active

    // this.lists.value.forEach(list => list.bookmarked = new Map<string, Card>(Object.entries(list.bookmarked)))
  }

  private activeList(): BookmarkList {
    return this.lists.value.at(this.active.value)
  }

  createList(name: string = '') {
    console.log('creating')
    const newList: BookmarkList = {
      name,
      bookmarked: {},
    }
    this.lists.value.push(newList)
  }

  deleteList(id: number) {
    if (id === this.active.value) {
      console.error('cannot delete active bookmark list')
      return
    }
    this.lists.value.splice(id, 1)

    if (this.lists.value.length <= 0) {
      this.createList('default')
    }
  }

  setActive(id: number) {
    if (id > this.lists.value.length) {
      console.error('invalid bookmark list index')
      return
    }
    this.active.value = id
  }

  setName(id: number, name: string) {
    const item = this.lists.value.at(id)
    if (item) {
      item.name = name
    }
    else {
      console.error(`setName was called on list ${id} which doesn't exist`)
    }
  }

  toggleBookmark(card: Card) {
    const active = this.activeList()
    const bookmark = active.bookmarked[card.id]
    if (bookmark) {
      active.bookmarked[card.id] = undefined
    }
    else {
      active.bookmarked[card.id] = card
    }
  }

  isBookmarked(card: Card) {
    return !!this.activeList().bookmarked?.[card.id]
  }

  activeName(): string {
    return this.activeList().name
  }
}

const defaultList: BookmarkList[] = [{
  name: 'default',
  bookmarked: {},
}]

export function useBookmarks() {
  const lists = useStorage('bookmarkLists', defaultList)
  const active = useStorage('activeBookmarkList', 0)
  return new Bookmarker(lists, active)
}
