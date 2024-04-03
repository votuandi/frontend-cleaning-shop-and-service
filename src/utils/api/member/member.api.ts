import commonAxios from '@/utils/axios/common.axios'

import type { AxiosResponseData } from '@/utils/axios'
import {
  IAddAddressPayload,
  ICountUnreadNotificationPayload,
  IDeleteNotificationPayload,
  IGetAddressDetailPayload,
  IGetAddressListPayload,
  IGetMemberDataPayload,
  IGetNotificationDetailPayload,
  IGetNotificationListPayload,
  IGetPointHistoryPayload,
  IGetPointWillExpirePayload,
  IGetProfileDataPayload,
  ILogoutPayload,
  IUpdateAddressPayload,
  IUpdateAvatar,
  IUpdateDefaultAddressPayload,
  IUpdateProfilePayload,
} from './member.api.types'
import { ILoginPayload } from '../auth'
import { IGetMemberSettingPayload } from '../setting'

const memberApi = {
  getMemberData: (payload: IGetMemberDataPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/get_data_member.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getProfile: (payload: IGetProfileDataPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/get_data_member.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  updateProfile: (payload: IUpdateProfilePayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/update_profile.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getAddressList: (payload: IGetAddressListPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/get_address_list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  addAddress: (payload: IAddAddressPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/create_new_address.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getAddressDetail: (payload: IGetAddressDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/get_address.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  updateDefaultAddress: (payload: IUpdateDefaultAddressPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/update_default_address.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  updateAddress: (payload: IUpdateAddressPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/update_address.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getNotificationList: (payload: IGetNotificationListPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_pushes/list.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getNotificationDetail: (payload: IGetNotificationDetailPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_pushes/notification_detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  deleteNotification: (payload: IDeleteNotificationPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_pushes/delete_notification.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  logout: (payload: ILogoutPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/logout.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  updateAvatar: (payload: IUpdateAvatar) => {
    return commonAxios.post<AxiosResponseData>('/api/member/members/change_avatar.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getPointHistory: (payload: IGetPointHistoryPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_points/get_point_history.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getPointWillExpire: (payload: IGetPointWillExpirePayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_points/get_point_detail.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  countUnreadNotification: (payload: ICountUnreadNotificationPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_pushes/count_unread.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },

  getMemberSetting: (payload: IGetMemberSettingPayload) => {
    return commonAxios.post<AxiosResponseData>('/api/member/member_pushes/get_data_settings.json', {
      ...payload.params,
      cancelToken: payload.cancelToken,
    })
  },
}

export default memberApi
