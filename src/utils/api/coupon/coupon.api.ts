import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import { IGetCouponDetailPayload, IGetListCouponPayload, IGetRedeemedCouponDetailPayload, IGetRedeemedCouponsPayload, IRedeemCouponPayload } from './coupon.api.types'

const couponApi = {
  getList: (payload: IGetListCouponPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/coupon/coupons/list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getDetail: (payload: IGetCouponDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/coupon/coupons/detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  redeem: (payload: IRedeemCouponPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_coupons/redeem.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getRedeemedCoupons: (payload: IGetRedeemedCouponsPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_coupons/get_redeemed_coupon.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getRedeemedCouponDetail: (payload: IGetRedeemedCouponDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_coupons/get_info_redeemed_coupon.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default couponApi
