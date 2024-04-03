import { CancelToken, RawAxiosRequestHeaders } from 'axios'
import { IProductGiftItem } from '../transaction'

type Payload = {
  cancelToken?: CancelToken
}

export type IGetProductDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    product_id: string | number
  }
} & Payload

export type IGetProductDetailResponse = {
  id: string
  service_type_id: string
  product_category_id: string
  slug: string
  sku: string
  price: string
  discount_amount: string
  image: string
  enabled: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
  category_name: string
  service_type: string
  price_after_discount: string
  ProductLanguage: ProductLanguage
  ProductImage: string[]
  related_product: IProductGiftItem[]
}

export type ProductLanguage = {
  id: string
  product_id: string
  alias: string
  name: string
  short_description: string
  description: string
  detail: string
}
