import { FooterContentType } from '@/types/common'
import { CancelToken, RawAxiosRequestHeaders } from 'axios'

type Payload = {
  cancelToken?: CancelToken
}

export type IGetMemberSettingPayload = {
  params: {
    language: 'eng' | 'zho'
  }
} & Payload

export type IGetMemberSettingResponse = {
  country_code: ICountryCodeDataItem[]
  gender: IGenderDataItem[]
  lang: ILanguageDataItem[]
  trans_status: ITransStatusDataItem[]
}

export type ICountryCodeDataItem = {
  id: string
  name: string
}

export type IGenderDataItem = {
  id: string
  name: string
}

export type ILanguageDataItem = {
  id: string
  name: string
}

export type ITransStatusDataItem = {
  id: string
  name: string
  color_code: string
}

export type IGetAccountBannerPayload = {
  params: {
    language: 'eng' | 'zho'
    type: 'registration' | 'homepage'
  }
} & Payload

export type IGetAccountBannerResponse = IBannerItem[]

export type IBannerItem = {
  id: string
  content_type: string
  content_id: string
  publish_date: string
  unpublish_date: string
  image: string
  url: string
  sorting: string
  enabled: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
}

export type CompanySettingsType = 'content-terms-and-conditions' | 'content-privacy-policy' | 'content-about-us'

export type IGetCompanySettingPayload = {
  params: {
    language: 'eng' | 'zho'
    name: CompanySettingsType
  }
} & Payload

export type IGetCompanySettingResponse = {
  id: string
  slug: CompanySettingsType
  type: string
  data: string
  setting_id: string
}

export type IGetPaymentMethodListPayload = {
  params: {
    language: 'eng' | 'zho'
  }
} & Payload

export type IGetPaymentMethodListResponse = IPaymentMethodItem[]

export type IPaymentMethodItem = {
  id: string
  code: string
  image: string
  enabled: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
  PaymentMethodLanguage: IPaymentMethodLanguage
}

export type IPaymentMethodLanguage = {
  id: string
  payment_method_id: string
  alias: string
  name: string
}

export type IGetDeliveryMethodSettingPayload = {
  params: {
    language: 'eng' | 'zho'
  }
} & Payload

export type IGetDeliveryMethodSettingResponse = {
  'system-delivery-time': string
  'system-delivery-fee': string
}

export type IGetFooterSettingPayload = {
  params: {
    language: 'eng' | 'zho'
  }
} & Payload

export type IGetFooterSettingResponse = IFooterSettingItem[]

export type IFooterSettingItem = {
  id: string
  slug: FooterContentType
  type: string
  data: string
}
