import type { RemovableRef } from '@vueuse/core'
import type { Card } from './types'
import { useStorage } from '@vueuse/core'

const defaultListName = 'bookmarks'

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
  }

  private activeList(): BookmarkList {
    return this.lists.value.at(this.active.value)
  }

  private getList(name: string): BookmarkList | undefined {
    return this.lists.value.find(list => list.name === name)
  }

  private isDuplicateName(nameToCheck: string): boolean {
    return !!this.getList(nameToCheck)
  }

  createList() {
    let name = defaultListName
    let i = 0
    while (this.isDuplicateName(name)) {
      i++
      name = `${defaultListName}-${i}`
    }

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
      this.createList()
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
    if (!item) {
      console.error(`setName was called on list ${id} which doesn't exist`)
      return
    }
    if (this.isDuplicateName(name)) {
      console.error(`setName was called on list ${id} with non-unique name ${name}`)
      return
    }
    item.name = name
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

  isBookmarked(card: Card): boolean {
    return !!this.activeList().bookmarked[card.id]
  }

  hasBookmark(listName: string, cardId: string): boolean {
    return !!this.getList(listName)?.bookmarked[cardId]
  }

  activeName(): string {
    return this.activeList().name
  }

  getListNames(): string[] {
    return this.lists.value.map(list => list.name)
  }
}

const defaultList: BookmarkList[] = [{
  name: defaultListName,
  bookmarked: {},
}]

export function useBookmarks() {
  const lists = useStorage('bookmarkLists', defaultList)
  const active = useStorage('activeBookmarkList', 0)
  return new Bookmarker(lists, active)
}
