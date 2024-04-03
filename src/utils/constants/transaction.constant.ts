import { OrderFilterType } from '@/types/common'

export type ORDER_STATUS_DISPLAY_TYPE = {
  ID: OrderFilterType
  COLOR: string
}

export const ORDER_STATUS_DISPLAY: ORDER_STATUS_DISPLAY_TYPE[] = [
  {
    ID: 'waiting_for_payment',
    COLOR: '#FAC515',
  },
  {
    ID: 'paid',
    COLOR: '#fa8015',
  },
  {
    ID: 'delivery',
    COLOR: '#2970FF',
  },
  {
    ID: 'complete',
    COLOR: '#16B364',
  },
]
