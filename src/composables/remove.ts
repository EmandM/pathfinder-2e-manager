export function remove<T>(list: T[], toRemove: T[keyof T], itemKey?: keyof T): T[] {
  const index = list.findIndex(val => toRemove === (itemKey ? val[itemKey] : val))
  if (index > -1) {
    list.splice(index, 1)
  }
  else {
    console.error('error removing item', toRemove, 'from list', list, 'item not found')
  }
  return list
}