import { CancelToken, RawAxiosRequestHeaders } from 'axios'

type Payload = {
  cancelToken?: CancelToken
}

export type IGetListServicePayload = {
  params: {
    language: 'eng' | 'zho'
    page?: number
    limit?: number
    service_type?: 'car_cleaning' | 'commerce_cleaning' | 'home_cleaning' | ''
    sort_direction?: 'categories' | 'type' | ''
    category_id?: string
    direction?: 'DESC' | 'ASC'
    keyword?: string
  }
} & Payload

export type IGetListServiceResponse = {
  limit: number
  page: number
  total_record: number
  Service: IServiceItem[]
}

export type IServiceItem = {
  id: string
  slug: string
  service_type_id: string
  service_category_id: string
  content_image: string
  image: string
  thumbnail_image: string
  intro_image: string
  sorting: string
  enabled: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
  category_name: string
  type_name: string
  ServiceLanguage: IServiceLanguage
}

export type IServiceLanguage = {
  id: string
  service_id: string
  alias: string
  title: string
  subtitle: string
  description: string
  introduction: string
}

export type IGetServiceDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    service_id: number | string
  }
} & Payload

export type IGetServiceDetailResponse = IServiceItem
