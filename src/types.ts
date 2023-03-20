export enum OrderType {
  BIOLOGY = 'BIOLOGY',
  TOXYCOLOGY = 'TOXYCOLOGY',
  PHYSICOCHEMISTRY = 'PHYSICOCHEMISTRY',
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
  EMPTY = 'To pole jest wymagane',
  INVALID_EMAIL = 'Adres email jest nieprawidłowy',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type OrderStatus = OrderStatuses.NEW | OrderStatuses.PICKED_UP | OrderStatuses.DELIVERED | OrderStatuses.CLOSED

export type AutocompleteOptionType = {
  id: string
  label: string
}
