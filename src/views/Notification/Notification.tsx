/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { IGetListNewsResponse, INewsItem } from '@/utils/api/news'
import { newsApi, promotionApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { Grid, MenuItem, Select } from '@mui/material'
import useStyles from './Notification.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import { IPromotionItem } from '@/utils/api/promotion'
import PromotionItem from '@/components/PromotionItem'
import memberApi from '@/utils/api/member/member.api'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { INotificationItem } from '@/utils/api/member'
import { number } from 'yup'
import AppConfirmPopup from '@/components/AppConfirmPopup'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

const TAB_TITLES = ['News', 'Promotion']
const ITEMS_PER_PAGE = [5, 10, 15, 20]

export default function Notification() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const dispatch = useDispatch()

  const [notificationList, setNotificationList] = useState<INotificationItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [isShowConfirmPopup, setIsShowConfirmPopup] = useState<boolean>(false)

  let handClickNotify = (item: INotificationItem) => {
    if (item.url && item.url.length > 0) {
      gotoPage(item.url)
    } else gotoPage(`/notification/${item?.id}`)
  }

  let handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  let handleChangeShowPerPage = (e: any) => {
    if (currentPage === 1) {
      getNotificationList(e.target.value)
    } else setShowPerPage(e.target.value)
  }

  let getNotificationList = async (_showPerPage?: number) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      // console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else
      try {
        let res = await memberApi.getNotificationList({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            limit: _showPerPage ?? showPerPage,
            page: currentPage,
            token: accessToken,
          },
        })
        if (res.data.status) {
          setNotificationList(res.data.params.Data)
          let _totalPage =
            res.data.params.total_record <= res.data.params.limit
              ? 1
              : res.data.params.total_record % res.data.params.limit === 0
              ? res.data.params.total_record / res.data.params.limit
              : Math.floor(res.data.params.total_record / res.data.params.limit) + 1
          setTotalPage(_totalPage)
        }
      } catch (error) {
        console.log(error)
      }
  }

  let deleteNotification = async (_id: number | string) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      // console.log('Your sign-in session is over. Please sign in again!')
      // gotoPage('/sign-in')
      return
    } else
      try {
        let res = await memberApi.deleteNotification({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            member_push_id: _id,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(t('Delete notification successfully!')))
          await getNotificationList()
        } else `${t('Delete notification failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`
      } catch (error) {
        console.log(error)
      }
  }

  let FetchData = async () => {
    getNotificationList()
  }

  useEffect(() => {
    if (isMounted()) return
    FetchData()
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  useEffect(() => {
    FetchData()
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [showPerPage])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('NOTIFICATIONS')}</h1>
        </div>
        <button className="flex flex-row px-6 py-3 gap-2 rounded-lg bg-[#E6E6E6]">
          <img className="w-6 h-6" src="/icon/ic-gray-delete.svg" alt="" />
          <span className="text-[#B3B3B3] ">{t('Delete all')}</span>
        </button>
      </div>
      <div className="w-full flex flex-col gap-3">
        {notificationList?.map((item, index) => (
          <div className="w-full px-6 py-4 bg-[#F0F2F7] flex flex-col gap-2 relative" key={index}>
            <div className="flex flex-row flex-wrap gap-3 items-center">
              <div className="flex flex-row gap-1 items-center">
                <img src="/icon/ic-noti-calendar.svg" alt="" />
                <span className="text-[#999] text-sm font-normal">{item?.start_date?.split(' ')[0].replaceAll('-', '/')}</span>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <img src="/icon/ic-noti-time.svg" alt="" />
                <span className="text-[#999] text-sm font-normal">{item?.start_date?.split(' ')[1]}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-start w-[80%]">
              <span className="text-[#1A1A1A] text-lg font-semibold cursor-pointer" onClick={() => handClickNotify(item)}>
                {item?.name}
              </span>
              <span className="text-[#666] text-xs font-base">{item?.short_description}</span>
            </div>
            <div className="h-full w-fit absolute py-4 right-6 top-0 flex flex-col justify-between items-center">
              {item?.read === '' && <img className="w-3 h-3" src="/icon/ic-reddoc.svg" alt="" />}
              <img className="cursor-pointer" src="/icon/ic-trash.svg" alt="" onClick={() => deleteNotification(item.id)} />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-fit justify-between items-center flex-wrap flex-row flex">
        <div className="w-fit h-fit flex flex-row items-center justify-center gap-4 text-sm not-italic font-normal leading-[normal] text-[#808080]">
          <span>{t('Showing')}</span>
          <Select labelId="demo-simple-select-label" IconComponent={KeyboardArrowDownIcon} value={showPerPage} onChange={handleChangeShowPerPage} className={classes.showPerPage}>
            {ITEMS_PER_PAGE.map((item, index) => {
              return (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              )
            })}
          </Select>
          <span>{t('items per page')}</span>
        </div>
        <AppPagination count={totalPage} page={currentPage} onChange={handleChangePage} />
      </div>
    </div>
  )
}
