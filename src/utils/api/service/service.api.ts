import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import { IGetListServicePayload, IGetServiceDetailPayload } from './service.api.types'

const serviceApi = {
  getList: (payload: IGetListServicePayload) => {
    return commonAxios.post<AxiosResponseData>('/api/service/services/list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
  getDetail: (payload: IGetServiceDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/service/services/detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default serviceApi
