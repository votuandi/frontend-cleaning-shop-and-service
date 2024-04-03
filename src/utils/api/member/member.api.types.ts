import { CancelToken, RawAxiosRequestHeaders } from 'axios'

type Payload = {
  cancelToken?: CancelToken
}

export type IRegisterPayload = {
  params: {
    language: 'eng' | 'zho'
    country_code: string
    phone: string
    name: string
    email: string
    password: string
    confirm_password: string
    gender_id: string
    date_of_birth: string
    referral_member_phone: string
    referral_member_country_code: string
    receive_notification: string
    policy_agreement: string
  }
} & Payload

export type IRegisterResponse = {}

export type IGetMemberDataPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
  }
} & Payload

export type IGetMemberDataResponse = {
  id: string
  referral_member_id: string
  facebook_id: string
  facebook_token: string
  apple_id: string
  code: string
  qrcode_path: string
  image: string
  is_registered: boolean
  name: string
  language_code: string
  gender_id: string
  join_date: string
  country_code: string
  phone: string
  phone_verified: boolean
  password: string
  email: string
  date_of_birth: string
  receive_notification: boolean
  policy_agreement: boolean
  token: string
  enabled: boolean
  is_request_to_be_deleted: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
  points: number
  deposit: number
  data_point: string
}

export type IGetProfileDataPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
  }
} & Payload

export type IGetProfileDataResponse = {
  id: string
  referral_member_id: string
  facebook_id: string
  facebook_token: string
  apple_id: string
  code: string
  qrcode_path: string
  image: string
  is_registered: boolean
  name: string
  language_code: string
  gender_id: string
  join_date: string
  country_code: string
  phone: string
  phone_verified: boolean
  email: string
  date_of_birth: string
  receive_notification: boolean
  policy_agreement: boolean
  token: string
  enabled: boolean
  is_request_to_be_deleted: boolean
  updated: string
  updated_by: string
  created: string
  created_by: string
  points: number
}

export type IGetAddressListPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
  }
} & Payload

export type IMemberAddressItem = {
  id: string
  member_id: string
  name: string
  phone: string
  address: string
  is_default: boolean
}

export type IGetAddressListResponse = {
  MemberAddress: IMemberAddressItem
}[]

export type IAddAddressPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    name: string
    address: string
    phone: string
    is_default: 0 | 1
  }
} & Payload

export type IAddAddressResponse = IMemberAddressItem

export type IGetAddressDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    address_id?: string | number
  }
} & Payload

export type IGetAddressDetailResponse = IMemberAddressItem

export type IUpdateDefaultAddressPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    address_id: string | number
    is_default: 0 | 1
  }
} & Payload

export type IUpdateDefaultAddressResponse = any

export type IUpdateAddressPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    address_id: string | number
    is_delete?: 0 | 1
    is_default: 0 | 1
    name: string
    phone: string
    address: string
  }
} & Payload

export type IUpdateAddressResponse = IMemberAddressItem

export type IGetNotificationListPayload = {
  params: {
    language: 'eng' | 'zho'
    page?: number
    limit?: number
    token: string
  }
} & Payload

export type IGetNotificationListResponse = {
  limit: number
  page: number
  total_record: number
  Data: INotificationItem[]
}

export type INotificationItem = {
  id: string
  member_id: string
  push_history_id: string
  pushed: number
  read: string | number
  is_show_popup: boolean
  is_deleted: boolean
  content_type_id: string
  content_type: string
  item_id: string
  url: string
  name: string
  short_description: string
  full_content: string
  start_date: string
  end_date: string
}

export type IGetNotificationDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    member_push_id: number | string
  }
} & Payload

export type IGetNotificationDetailResponse = {
  id: string
  member_id: string
  push_history_id: string
  pushed: number
  read: number | string
  is_show_popup: boolean
  is_deleted: boolean
  url: string
  name: string
  description: string
  full_content: string
  images: any[]
}

export type IDeleteNotificationPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    member_push_id: number | string
  }
} & Payload

export type IUpdateProfilePayload = {
  params: IUpdateProfileInput
} & Payload

export type IUpdateProfileInput = {
  language: 'eng' | 'zho'
  token: string
  country_code?: string
  phone?: string
  name: string
  email: string
  birthday: string
  code?: string
  is_update_phone: 0 | 1
}

export type ILogoutPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
  }
} & Payload

export type IUpdateAvatar = {
  params: {
    language: 'eng' | 'zho'
    token: string
    avatar: File
  }
} & Payload

export type IGetPointHistoryPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
  }
} & Payload

export type IGetPointHistoryResponse = IPointHistoryItem[]

export type IPointHistoryItem = {
  point_type_slug: string
  point_type_name: string
  status_name: string
  status_slug: string
  points: string
  date: string
  trans_type: string
  icon: string
}

export type ICountUnreadNotificationPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
  }
} & Payload

export type ICountUnreadNotificationResponse = {
  number_unread: number
}

export type IGetPointWillExpirePayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
  }
} & Payload

export type IGetMemberSettingPayload = {
  params: {
    language: 'eng' | 'zho'
  }
} & Payload

export type IGetMemberSettingResponse = {
  country_code: ICountryCodeDataItem[]
  gender: IGenderDataItem[]
  lang: ILanguageDataItem[]
  trans_status: ITransStatusItem[]
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

export type ITransStatusItem = {
  id: string
  name: string
  color_code: string
}
