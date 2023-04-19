import { OrderStatuses, OrderType, ReturnStatuses } from '@src/types'
import { Session } from 'next-auth'

export const getFullName = (list, id) => {
  if (id) {
    const { firstName, lastName } = list[id]
    return `${firstName} ${lastName}`
  }
}

export const translatedType = {
  [OrderType.TOXYCOLOGY]: 'Toksykologia',
  [OrderType.BIOLOGY]: 'Biologia',
  [OrderType.PHYSICOCHEMISTRY]: 'Fizykochemia',
  [OrderType.FATHERHOOD]: 'Ustalanie ojcostwa',
}

export const translatedStatus = {
  [OrderStatuses.NEW]: 'Zarejestrowany',
  [OrderStatuses.PICKED_UP]: 'Odebrany',
  [OrderStatuses.DELIVERED]: 'Dostarczony',
  [OrderStatuses.CLOSED]: 'Zakończony',
  [ReturnStatuses.NEW]: 'Zarejestrowany',
  [ReturnStatuses.SET]: 'Zwrot ustalony',
  [ReturnStatuses.CLOSED]: 'Zakończony',
}

export const renameDownloadFile = (filename) => filename.split('_').slice(1).join('_')

export const getCurrentUserNameFromSession = ({ session, initials }: { session: Session; initials?: boolean }) => {
  const data = session?.user
  if (!data) return ''
  const { firstName, lastName } = data
  if (firstName && lastName) {
    return initials ? `${firstName.charAt(0)}${lastName.charAt(0)}` : `${firstName} ${lastName}`
  }
}

export const formatFullName = (personalData) => {
  if ('firstName' in personalData) {
    return `${personalData.firstName} ${personalData.lastName}`
  }
}
