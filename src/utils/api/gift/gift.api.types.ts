import { CancelToken, RawAxiosRequestHeaders } from 'axios'

type Payload = {
  cancelToken?: CancelToken
}

export type IGetGiftDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    gift_id: string | number
  }
} & Payload

export type IGetGiftDetailResponse = {
  id: string
  amount: string
  unit_type: string
  price: string
  limit_by_day: string
  limit_by_month: string
  limit_by_total: string
  publish_date: string
  unpublish_date: string
  redeem_start_date: string
  redeem_end_date: string
  available_type_id: string
  expiry_date: string
  expiry_range: string
  quantity: string
  image: string
  thumbnail_image: string
  sorting: string
  enabled: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
  available_qty: string
  GiftLanguage: GiftLanguage
}

export type GiftLanguage = {
  id: string
  gift_id: string
  alias: string
  name: string
  content: string
  terms: string
}
