import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import { IGetProductDetailPayload } from './product.api.types'

const productApi = {
  getDetail: (payload: IGetProductDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/product/products/detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default productApi
