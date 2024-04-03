import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import { IGetListPromotionPayload, IGetPromotionDetailPayload } from './promotion.api.types'

const promotionApi = {
  getList: (payload: IGetListPromotionPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/coupon/gifts/list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
  getPromotionDetail: (payload: IGetPromotionDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/coupon/gifts/detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default promotionApi
