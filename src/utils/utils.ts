export const toggleValueInArray = (array, value) => {
  const arrayCopy = [...array]
  return arrayCopy.includes(value) ? arrayCopy.filter((el) => el !== value) : [...arrayCopy, value]
}

export const getCustomerNameById = (customerId, customersArray) => {
  console.log(customerId, customersArray)
  const customer = customersArray.find((item) => item.id === customerId)
  return customer.name
}
