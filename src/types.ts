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

export type OrderStatus = OrderStatuses.NEW | OrderStatuses.PICKED_UP | OrderStatuses.DELIVERED | OrderStatuses.CLOSED
