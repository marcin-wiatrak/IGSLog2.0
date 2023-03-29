import { OrderType } from '@src/types'

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
