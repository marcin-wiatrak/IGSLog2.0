export enum OrderType {
  BIOLOGY = 'BIOLOGY',
  TOXYCOLOGY = 'TOXYCOLOGY',
  PHYSYCOCHEMISTRY = 'PHYSYCOCHEMISTRY',
  FATHERHOOD = 'FATHERHOOD',
}

export type TableOrderDirection = 'asc' | 'desc'

export enum OrderStatuses {
  NEW = 'NEW',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CLOSED = 'CLOSED',
}

export enum ErrorMessages {
  EMPTY = 'To pole nie może być pustę',
  INVALID_EMAIL = 'Adres email jest niepoprawny',
}

export type OrderStatus = OrderStatuses.NEW | OrderStatuses.PICKED_UP | OrderStatuses.DELIVERED | OrderStatuses.CLOSED

export type AutocompleteOptionType = {
  id: string
  label: string
}
