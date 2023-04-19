import dayjs from 'dayjs'

export enum DateTemplate {
  DDMMYYYY = 'DD / MM / YYYY',
  DDMMMMYYYY = 'DD MMMM YYYY',
}

export enum DateTimeTemplate {
  DDMMYYYYHHmm = 'DD / MM / YYYY HH:mm',
}

export const formatDate = (date) => dayjs(date).format(DateTemplate.DDMMYYYY)
export const formatDateTime = (date) => dayjs(date).format(DateTimeTemplate.DDMMYYYYHHmm)
