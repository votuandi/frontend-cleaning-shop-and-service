/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { IGetListNewsResponse, IGetNewsDetailResponse, INewsItem } from '@/utils/api/news'
import { newsApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { MenuItem, Select } from '@mui/material'
import useStyles from './NotificationDetail.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import parse from 'html-react-parser'
import AppPagination from '@/components/AppPagination'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetNotificationDetailResponse, INotificationItem } from '@/utils/api/member'
import memberApi from '@/utils/api/member/member.api'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

type Query = {
  slug: string
}

export default function NotificationDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const dispatch = useDispatch()

  const [notificationId, setNotificationId] = useState<number | string>(0)
  const [notificationDetail, setNotificationDetail] = useState<IGetNotificationDetailResponse>()

  let getNewsDetail = async (_id?: number | string) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else
      try {
        _id = _id ?? notificationId
        let res = await memberApi.getNotificationDetail({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            member_push_id: _id ?? notificationId,
          },
        })
        if (res.data.status) {
          setNotificationDetail(res.data.params)
        }
      } catch (error) {
        console.log(error)
      }
  }

  let deleteNotification = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('Your sign-in session is over. Please sign in again!')
      gotoPage('/sign-in')
    } else
      try {
        let res = await memberApi.deleteNotification({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            member_push_id: notificationId,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(t('Delete notification successfully!')))
          gotoPage('/notification')
        } else `${t('Delete notification failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`
      } catch (error) {
        console.log(error)
      }
  }

  let FetchData = async (_newsId?: number | string) => {
    await getNewsDetail(_newsId)
  }

  useEffect(() => {
    if (isMounted()) return
    const _id = query.slug.split('-').reverse()[0]
    setNotificationId(_id)
    FetchData(_id)
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
      <div className="w-full h-fit flex flex-row justify-between items-center">
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-row flex-wrap gap-1">
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/notification')}>
              {capitalizeFirstLetter(t('Notifications'.toUpperCase()).toLowerCase())}
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('Notification detail')}</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('Notification detail').toUpperCase()}</h1>
          </div>
        </div>
        <button className="flex flex-row px-6 py-3 gap-2 rounded-lg bg-[#E6E6E6]" onClick={deleteNotification}>
          <img className="w-6 h-6" src="/icon/ic-gray-delete.svg" alt="" />
          <span className="text-[#B3B3B3] break-keep">{t('Delete')}</span>
        </button>
      </div>

      <div className="w-full h-fit flex flex-col justify-center items-center gap-[10px]">
        <span className="text-base not-italic font-normal leading-[normal] text-[#666]">{notificationDetail?.pushed}</span>
        <h1 className="text-black text-[28px] not-italic font-medium leading-[normal]">{notificationDetail?.name}</h1>
      </div>
      {notificationDetail?.images.map((item, index) => (
        <img className="max-w-full h-auto mx-auto" src={item} alt="" key={index} />
      ))}
      <div className="text-base not-italic font-normal leading-[normal] text-[#666] px-10">{parse(notificationDetail?.full_content ?? '')}</div>
    </div>
  )
}
