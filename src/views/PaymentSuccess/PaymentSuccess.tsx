/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { IGetListNewsResponse, IGetNewsDetailResponse, INewsItem } from '@/utils/api/news'
import { newsApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { Box, MenuItem, Select } from '@mui/material'
import useStyles from './PaymentSuccess.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import parse from 'html-react-parser'
import AppPagination from '@/components/AppPagination'
import { gotoPage } from '@/utils/helpers/common'

type Query = {
  slug: string
}

export default function PaymentSuccess() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const [orderId, setOrderId] = useState<string>('')

  const { classes } = useStyles({ params: {} })

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)

    // Retrieve specific query parameters
    setOrderId(queryParams.get('id')?.toString() ?? '')
  }, [])

  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
      <Box
        sx={{
          width: '100%',
          aspectRatio: 16 / 9,
          backgroundImage: 'url("/img/bg-successful.png")',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        <img className="w-[123px] h-[123px]" src="/img/ic-check-mark.png" alt="" />
        <div className="flex flex-col gap-[10px] justify-center items-center">
          <h2 className="text-[#1a1a1a] text-[24px] font-semibold ">{t('You have paid your order')}</h2>
          <span className="text-[#656565] text-base font-normal">{t('Order No.')}</span>
          <span className="text-[#1a1a1a] text-base font-normal"># {orderId}</span>
        </div>
        <button className="py-2 px-6 w-fit rounded-lg bg-[#0596A6] text-white text-base font-medium" onClick={() => gotoPage(`/member-center/my-order/${orderId}`)}>
          {t('View order')}
        </button>
      </Box>
    </div>
  )
}
