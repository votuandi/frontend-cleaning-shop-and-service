/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { newsApi, productApi, promotionApi, transactionApi } from '@/utils/api'
import { Box, Grid, IconButton, MenuItem, Select, Slide, TextField, Typography, useMediaQuery } from '@mui/material'
import useStyles from './QuotationDetail.style'
import parse from 'html-react-parser'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetQuotationDetailResponse } from '@/utils/api/transaction'
import { capitalize } from 'lodash'
import theme from '@/assets/theme'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

type Query = {
  slug: string
}

const TAB_TITLES = ['Description', 'Term']

export default function QuotationDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))
  const dispatch = useDispatch()

  const [quotationId, setQuotationId] = useState<number | string>(0)
  const [quotationDetail, setQuotationDetail] = useState<IGetQuotationDetailResponse>()

  let getQuotationDetail = async (_id?: number | string) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    try {
      _id = _id ?? quotationId
      let res = await transactionApi.getQuotationDetail({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          quotation_id: _id,
          token: accessToken!,
        },
      })
      if (res.data.status) {
        setQuotationDetail(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let addQuotationToCart = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) console.log('Login session is over!')
    else
      try {
        let res = await transactionApi.addQuotationToCart({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            quotation_id: quotationId,
            token: accessToken!,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(t('Add quotation successfully!')))
          router.reload()
        } else {
          dispatch(setAlertMessageState(`${t('Add quotation failed.')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
        }
      } catch (e) {
        console.log(e)
      }
  }

  let FetchData = async (_couponId?: number | string) => {
    await getQuotationDetail(_couponId)
  }

  useEffect(() => {
    if (isMounted()) return
    const _id = query.slug.split('-').reverse()[0]
    setQuotationId(_id)
    FetchData(_id)
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className={`w-full h-fit flex flex-col justify-start items-start gap-8 ${isSmallScreen ? 'px-4 py-6' : 'py-10 px-6'}`}>
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex flex-row flex-wrap gap-1">
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
            {t('member center')}
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center/my-quotation')}>
            {t('My quotation')}
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('Quotation detail')}</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3  border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('Quotation detail').toUpperCase()}</h1>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col gap-8">
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>{t('SALES NUMBER')}</Typography>
              <Typography className={classes.topItemValue}>{quotationDetail?.id}</Typography>
            </Box>
            <img src="/icon/ic-quotation-sales-number.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>{t('STATUS')}</Typography>
              <Typography className={classes.topItemValue}>{quotationDetail?.status?.replace('_', '').toUpperCase()}</Typography>
            </Box>
            <img src="/icon/ic-quotation-status.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>{t('QUOTATION DATE')}</Typography>
              <Typography className={classes.topItemValue}>{quotationDetail?.created?.split(' ')[0]}</Typography>
            </Box>
            <img src="/icon/ic-quotation-date.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>{t('ESTIMATED IMPLEMENT DATE')}</Typography>
              <Typography className={classes.topItemValue}>{quotationDetail?.estimated_date?.split(' ')[0]}</Typography>
            </Box>
            <img src="/icon/ic-quotation-estimated-implememt-date.svg" alt="" />
          </Grid>
        </Grid>
        <div className="w-full h-fit flex flex-col gap-6">
          <Grid
            container
            className={classes.gridContainer}
            sx={{
              borderBottom: '1px solid #EFF7FA',
            }}
          >
            {isSmallScreen ? (
              <>
                <Grid item xs={4} className={classes.botTitle}>
                  {t('Date')}
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}></Grid>
                <Grid item xs={4} className={classes.botTitle}>
                  {t('Service')}
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}>
                  <span className="text-[#333] text-base font-medium">{quotationDetail?.QuotationDetail[0]?.title}</span>
                  <span className="text-[#333] text-base font-normal">
                    {quotationDetail?.service_type} - {quotationDetail?.service_category}
                  </span>
                  <span className="text-[#666] text-base font-normal text-justify">{quotationDetail?.QuotationDetail[0]?.introduction}</span>
                  <div className="w-full text-[#666] text-base font-normal text-justify">{parse(quotationDetail?.QuotationDetail[0]?.description ?? '')}</div>
                </Grid>
                <Grid item xs={4} className={classes.botTitle}>
                  {t('Quantity')}
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}></Grid>
                <Grid item xs={4} className={classes.botTitle}>
                  {t('Price')}
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}>
                  <span className="text-[#1A1A1A] text-base font-semibold">HK$ {quotationDetail?.QuotationDetail[0]?.price}</span>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={2} className={classes.botTitle}>
                  {t('Date')}
                </Grid>
                <Grid item xs={7} className={classes.botTitle}>
                  {t('Service')}
                </Grid>
                <Grid item xs={1} className={classes.botTitle}>
                  {t('Quantity')}
                </Grid>
                <Grid item xs={2} className={classes.botTitle}>
                  {t('Price')}
                </Grid>
                <Grid item xs={2} className={classes.botContentItem}></Grid>
                <Grid item xs={7} className={classes.botContentItem}>
                  <span className="text-[#333] text-base font-medium">{quotationDetail?.QuotationDetail[0]?.title}</span>
                  <span className="text-[#333] text-base font-normal">
                    {quotationDetail?.service_type} - {quotationDetail?.service_category}
                  </span>
                  <span className="text-[#666] text-base font-normal text-justify">{quotationDetail?.QuotationDetail[0]?.introduction}</span>
                  <div className="w-full text-[#666] text-base font-normal text-justify">{parse(quotationDetail?.QuotationDetail[0]?.description ?? '')}</div>
                </Grid>
                <Grid item xs={1} className={classes.botContentItem}></Grid>
                <Grid item xs={2} className={classes.botContentItem}>
                  <span className="text-[#1A1A1A] text-base font-semibold">HK$ {quotationDetail?.QuotationDetail[0]?.price}</span>
                </Grid>
              </>
            )}
          </Grid>
          <div className={`w-fit h-fit flex flex-row gap-[10px] items-baseline ${isSmallScreen ? 'm-0' : 'ml-auto mr-[96px]'}`}>
            <span className="text-[#999] text-sm font-medium uppercase">{t('Total amount')}</span>
            <span className="text-[#06455E] text-[20px] font-semibold uppercase">HK$ {quotationDetail?.total}</span>
          </div>

          <Grid container className={classes.gridContainer}>
            <Grid item xs={2}></Grid>
            <Grid
              item
              md={7}
              xs={12}
              sx={{
                color: '#666',
                padding: isSmallScreen ? '0' : '0 24px',
              }}
            >
              {parse(quotationDetail?.notes ?? '')}
            </Grid>
          </Grid>
        </div>
      </div>
      <button
        className={`w-fit h-fit px-12 mx-auto text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white ${
          quotationDetail?.status !== 'replied' ? 'bg-[#d0cece]' : ' bg-[#0596A6]'
        }`}
        onClick={addQuotationToCart}
        disabled={quotationDetail?.status !== 'replied'}
      >
        {t('Add to cart')}
      </button>
    </div>
  )
}
