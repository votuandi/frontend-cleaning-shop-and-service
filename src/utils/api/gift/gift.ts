import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import { IGetGiftDetailPayload } from './gift.api.types'

const giftApi = {
  getDetail: (payload: IGetGiftDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/coupon/gifts/detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default giftApi
