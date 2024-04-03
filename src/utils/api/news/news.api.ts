import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import type { IGetListNewsPayload, IGetNewsDetailPayload } from './news.api.types'

const newsApi = {
  getListNews: (payload: IGetListNewsPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/news/news/list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
  getNewsDetail: (payload: IGetNewsDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/news/news/detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default newsApi
