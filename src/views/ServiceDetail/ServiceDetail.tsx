/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { IGetListNewsResponse, IGetNewsDetailResponse, INewsItem } from '@/utils/api/news'
import { newsApi, serviceApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { MenuItem, Select, useMediaQuery } from '@mui/material'
import useStyles from './ServiceDetail.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import parse from 'html-react-parser'
import AppPagination from '@/components/AppPagination'
import { gotoPage } from '@/utils/helpers/common'
import { IGetServiceDetailResponse } from '@/utils/api/service'
import theme from '@/assets/theme'

type Query = {
  slug: string
}

export default function ServiceDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600))

  const [serviceId, setServiceId] = useState<number | string>(0)
  const [serviceDetail, setServiceDetail] = useState<IGetServiceDetailResponse | null>(null)

  let getServiceDetail = async (_id?: number | string) => {
    try {
      _id = _id ?? serviceId
      let res = await serviceApi.getDetail({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          service_id: _id,
        },
      })
      if (res.data.status) {
        setServiceDetail(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async (_id?: number | string) => {
    await getServiceDetail(_id)
  }

  useEffect(() => {
    if (isMounted()) return
    const _id = query.slug.split('-').reverse()[0]
    setServiceId(_id)
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
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex flex-row flex-wrap gap-1">
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer">{serviceDetail?.type_name}</span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer">{serviceDetail?.category_name}</span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{serviceDetail ? serviceDetail?.ServiceLanguage?.title : ''}</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{serviceDetail?.type_name}</h1>
        </div>
      </div>

      <img className="max-w-full h-auto mx-auto" src={serviceDetail?.image ?? ''} alt="" />
      <div className="w-full h-fit flex flex-col justify-center items-center gap-1">
        <h3 className="text-sm not-italic font-normal leading-[normal] text-black">{serviceDetail?.type_name}</h3>
        <h3 className="text-sm not-italic font-normal leading-[normal] text-[#666]">{serviceDetail?.category_name}</h3>
        <h1 className="text-[28px] not-italic font-semibold leading-[normal] text-[#06455E]">{serviceDetail?.ServiceLanguage?.title}</h1>
        <span className="text-sm not-italic font-normal leading-[normal] text-black">{serviceDetail?.ServiceLanguage?.subtitle}</span>
      </div>
      <div className={`w-full h-fit flex flex-col gap-3 ${isSmallScreen ? 'px-0' : 'px-10'}`}>
        <span className="text-base not-italic font-medium leading-[normal] text-black">{t('Description')}</span>
        <div className="text-base not-italic font-normal leading-[normal] text-[#666] [&>p]:mb-3 text-justify">
          {serviceDetail ? parse(serviceDetail?.ServiceLanguage?.description ?? '') : ''}
        </div>
      </div>
    </div>
  )
}
