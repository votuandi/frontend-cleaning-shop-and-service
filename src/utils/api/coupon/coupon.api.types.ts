import { CancelToken, RawAxiosRequestHeaders } from 'axios'

type Payload = {
  cancelToken?: CancelToken
}

export type IGetListCouponPayload = {
  params: {
    language: 'eng' | 'zho'
    page?: number
    limit?: number
    sort?: 'type' | ''
    sort_direction?: 'ASC' | 'DESC'
    keyword?: string
  }
} & Payload

export type IGetListCouponResponse = {
  limit: number
  page: number
  total_record: number
  Coupon: ICouponItem[]
}

export type ICouponItem = {
  id: string
  coupon_type_id: string
  service_type_id: string
  amount: string
  unit_type: string
  consume: string
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
  service_type: string
  available_qty: number
  CouponLanguage: ICouponLanguage
  msg_point: string
}

export type ICouponLanguage = {
  id: string
  coupon_id: string
  alias: string
  name: string
  content: string
  terms: string
}

export type IGetCouponDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    coupon_id: string | number
    token?: string | undefined
  }
} & Payload

export type IGetCouponDetailResponse = ICouponItem

export type IRedeemCouponPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    coupon_id: string | number
    redeemed_qty: string | number
  }
} & Payload

export type IRedeemCouponResponse = {
  member_coupon_id: string
  coupon_id: string
  member_id: string
  coupon_expiry_date: string
  new_data: INewData
}

export type INewData = {
  MemberCoupon: IMemberCoupon
  MemberPoint: IMemberPoint[]
  Point: IPoint
}

export type IMemberCoupon = {
  member_id: string
  coupon_id: string
  expiry_date: string
  is_used: number
  id: string
  code: string
  updated: string
  updated_by: string
}

export type IMemberPoint = {
  member_id: string
  point_type_id: number
  expiry_date: string
  member_coupon_id: string
  status: number
  remark: string
  reference_number: string
  points: number
}

export type IPoint = {
  old_point: number
  new_point: number
}

export type IGetRedeemedCouponsPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    type: 'all' | 'active' | 'past'
    keyword?: string
    limit?: string | number
    page?: string | number
  }
} & Payload

export type IGetRedeemedCouponsResponse = {
  limit: string | number
  page: string | number
  total_record: string | number
  coupon: IRedeemedCoupon[]
}

export type IRedeemedCoupon = {
  id: string
  member_coupon_distribution_id: string
  member_id: string
  code: string
  coupon_id: string
  expiry_date: string
  is_used: boolean
  used_date: string
  amount: string
  qrcode: string
  updated: string
  updated_by: string
  created: string
  created_by: string
  image: string
  thumbnail_image: string
  CouponLanguage: ICouponLanguage
  is_expired: boolean
  service_type: string
}

export type IGetRedeemedCouponDetailPayload = {
  params: {
    language: 'eng' | 'zho'
    token: string
    member_coupon_id: string | number
  }
} & Payload

export type IGetRedeemedCouponDetailResponse = {
  id: string
  member_coupon_distribution_id: string
  member_id: string
  code: string
  coupon_id: string
  expiry_date: string
  is_used: boolean
  used_date: string
  amount: string
  qrcode: string
  updated: string
  updated_by: string
  created: string
  created_by: string
  image: string
  thumbnail_image: string
  service_type: string
  CouponLanguage: ICouponLanguage
  is_expired: boolean
  consume: string | number
}
