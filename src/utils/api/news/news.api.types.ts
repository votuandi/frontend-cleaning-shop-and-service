import { CancelToken, RawAxiosRequestHeaders } from 'axios'

type Payload = {
  cancelToken?: CancelToken
}

export type IGetListNewsPayload = {
  params: {
    language: 'eng' | 'zho'
    page?: number
    limit?: number
  }
} & Payload

export type IGetListNewsResponse = {
  limit: number
  page: number
  total_record: number
  News: INewsItem[]
}

export type INewsItem = {
  id: string
  slug: string
  publish_date: string
  unpublish_date: string
  image: string
  thumbnail_image: string
  sorting: string
  enabled: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
  NewsLanguage: INewsLanguage
}

export type INewsLanguage = {
  id: string
  news_id: string
  alias: string
  title: string
  subtitle: string
  content: string
}

export type IGetNewsDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    news_id: number | string
  }
} & Payload

export type IGetNewsDetailResponse = INewsItem
