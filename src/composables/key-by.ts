export function keyBy<T>(collection: T[], identity: (item: T) => string): { [key: string]: T } {
  return collection.reduce((result, element) => {
    const key = identity(element)
    result[key] = element
    return result
  }, {})
}
