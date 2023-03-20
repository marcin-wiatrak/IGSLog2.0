export const toggleValueInArray = (array, value) => {
  const arrayCopy = [...array]
  return arrayCopy.includes(value) ? arrayCopy.filter((el) => el !== value) : [...arrayCopy, value]
}
