export const getFullName = (list, id) => {
  if (id) {
    const { firstName, lastName } = list[id]
    return `${firstName} ${lastName}`
  }
}
