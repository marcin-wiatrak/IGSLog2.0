import { OrderStatuses, ReturnStatuses } from '@src/types'

export const orderStatusName = (status) => {
  switch (status) {
    case OrderStatuses.NEW:
      return 'Zarejestrowane'
    case OrderStatuses.PICKED_UP:
      return 'Odebrane'
    case OrderStatuses.DELIVERED:
      return 'Dostarczone'
    case OrderStatuses.CLOSED:
      return 'Zakończone'
    case OrderStatuses.PAUSED:
      return 'Wstrzymane'
  }
}

export const returnStatusName = (status) => {
  switch (status) {
    case ReturnStatuses.NEW:
      return 'Zarejestrowane'
    case ReturnStatuses.SET:
      return 'Zwrot ustalony'
    case ReturnStatuses.CLOSED:
      return 'Zakończone'
    case ReturnStatuses.PAUSED:
      return 'Wstrzymane'
  }
}
