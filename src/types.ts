import { Customer, Order, Return, User } from '@prisma/client'

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
  PAUSED = 'PAUSED',
}

export enum ReturnStatuses {
  NEW = 'NEW',
  SET = 'SET',
  CLOSED = 'CLOSED',
  PAUSED = 'PAUSED',
}

export enum ErrorMessages {
  EMPTY = 'To pole jest wymagane',
  INVALID_EMAIL = 'Adres email jest nieprawidłowy',
  TYPE_REQUIRED = 'Typ zlecenia jest wymagany',
  TYPE_MIN_LENGTH = 'Wybierz minimum jeden typ',
  INVALID_CONFIRM_PASSWORD = 'Podane hasła nie są takie same',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type OrderStatus =
  | OrderStatuses.NEW
  | OrderStatuses.PICKED_UP
  | OrderStatuses.DELIVERED
  | OrderStatuses.CLOSED
  | OrderStatuses.PAUSED

export type ReturnStatus = ReturnStatuses.NEW | ReturnStatuses.SET | ReturnStatuses.CLOSED | ReturnStatuses.PAUSED

export type AutocompleteOptionType = {
  id: string
  label: string
}

export enum Paths {
  ORDERS = 'ORDERS',
  RETURNS = 'RETURNS',
}

export type CurrentPath = Paths.ORDERS | Paths.RETURNS

export enum ReturnContent {
  DOC = 'DOC',
  MAT = 'MAT',
  MATDOC = 'MAT+DOC',
}

export type OrderExtended = Order & { handleBy?: User; customer?: Customer; registeredBy?: User }
export type ReturnExtended = Return & { handleBy?: User; customer?: Customer; registeredBy?: User }

// export type ReturnContent
