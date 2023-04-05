import { OrderType } from '@src/types'
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

export const renameDownloadFile = (filename) => filename.split('_').slice(1).join('_')

export const getCurrentUserNameFromSession = ({ session, initials }: { session: Session; initials?: boolean }) => {
  const data = session?.user
  if (!data) return ''
  const { firstName, lastName } = data
  if (firstName && lastName) {
    return initials ? `${firstName.charAt(0)}${lastName.charAt(0)}` : `${firstName} ${lastName}`
  }
}
