import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import type {
  IGetAccountBannerPayload,
  IGetCompanySettingPayload,
  IGetDeliveryMethodSettingPayload,
  IGetFooterSettingPayload,
  IGetMemberSettingPayload,
  IGetPaymentMethodListPayload,
} from './setting.api.types'

const settingApi = {
  getMemberSettings: (payload: IGetMemberSettingPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/get_data_settings.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
  getAccountBanner: (payload: IGetAccountBannerPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/setting/banners/list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
  getCompanySettings: (payload: IGetCompanySettingPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/setting/settings/get_setting.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
  getPaymentMethodList: (payload: IGetPaymentMethodListPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/setting/payment_methods/list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
  getDeliveryMethodSetting: (payload: IGetDeliveryMethodSettingPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/setting/settings/get_delivery_setting.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getFooterSetting: (payload: IGetFooterSettingPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/setting/settings/get_footer_setting.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default settingApi
