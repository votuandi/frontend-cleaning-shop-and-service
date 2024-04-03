/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { IGetListNewsResponse, IGetNewsDetailResponse, INewsItem } from '@/utils/api/news'
import { newsApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { MenuItem, Select } from '@mui/material'
import useStyles from './PromotionDetail.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import parse from 'html-react-parser'
import AppPagination from '@/components/AppPagination'
import { gotoPage } from '@/utils/helpers/common'

type Query = {
  slug: string
}

export default function PromotionDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const [newsId, setNewsId] = useState<number | string>(0)
  const [newsDetail, setNewsDetail] = useState<IGetNewsDetailResponse | null>(null)

  let getNewsDetail = async (_newsId?: number | string) => {
    try {
      _newsId = _newsId ?? newsId
      let res = await newsApi.getNewsDetail({
        params: {
          language: 'eng',
          news_id: _newsId,
        },
      })
      if (res.data.status) {
        setNewsDetail(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async (_newsId?: number | string) => {
    await getNewsDetail(_newsId)
  }

  useEffect(() => {
    if (isMounted()) return
    const _newsId = query.slug.split('-').reverse()[0]
    setNewsId(_newsId)
    FetchData(_newsId)
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
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer">Online shop</span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer">Gift card</span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">Gift card detail</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">GIFT CARD DETAIL</h1>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col justify-center items-center gap-[10px]">
        <span className="text-base not-italic font-normal leading-[normal] text-[#666]">
          {newsDetail?.publish_date ? new Date(newsDetail?.publish_date).toString().split(' ').splice(1, 3).join(' ') : ''}
        </span>
        <h1 className="text-black text-[28px] not-italic font-medium leading-[normal]">{newsDetail?.NewsLanguage?.title}</h1>
        <span className="text-base not-italic font-medium leading-[normal] text-[#333] py-[10px]">{newsDetail?.NewsLanguage?.subtitle}</span>
      </div>
      <img className="max-w-full h-auto mx-auto" src={newsDetail?.image ?? ''} alt="" />
      <div className="text-base not-italic font-normal leading-[normal] text-[#666] px-10">{parse(newsDetail?.NewsLanguage?.content ?? '')}</div>
    </div>
  )
}
