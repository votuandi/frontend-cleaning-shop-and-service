/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { newsApi, productApi, promotionApi, transactionApi } from '@/utils/api'
import { Box, Grid, IconButton, MenuItem, Select, Slide, TextField, Typography, useMediaQuery } from '@mui/material'
import useStyles from './OrderDetail.style'
import parse from 'html-react-parser'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetQuotationDetailResponse, IOrder } from '@/utils/api/transaction'
import { capitalize } from 'lodash'
import theme from '@/assets/theme'

type Query = {
  slug: string
}

export default function OrderDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))

  const [orderId, setOrderId] = useState<number | string>(0)
  const [orderDetail, setOrderDetail] = useState<IOrder>()

  let getQuotationDetail = async (_id?: number | string) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    try {
      _id = _id ?? orderId
      let res = await transactionApi.getOrderDetail({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          inv_id: _id,
          token: accessToken!,
        },
      })
      if (res.data.status) {
        setOrderDetail(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async (_couponId?: number | string) => {
    await getQuotationDetail(_couponId)
  }

  useEffect(() => {
    if (isMounted()) return
    const _id = query.slug.split('-').reverse()[0]
    setOrderId(_id)
    FetchData(_id)
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-10 py-10 px-6 relative">
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex flex-row flex-wrap gap-1">
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
            Member center
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center/my-quotation')}>
            My order
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">Order detail</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3  border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">ORDER DETAIL</h1>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col gap-8">
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>DATE</Typography>
              <Typography className={classes.topItemValue}>{orderDetail?.date}</Typography>
            </Box>
            <img src="/icon/ic-quotation-date.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>ORDER ID</Typography>
              <Typography className={classes.topItemValue}>{orderDetail?.inv_number}</Typography>
            </Box>
            <img src="/icon/ic-order-invoice.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>PAYMENT</Typography>
              <Typography className={classes.topItemValue}>{orderDetail?.payment_method_id}</Typography>
            </Box>
            <img src="/icon/ic-order-card.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={3} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>STATUS</Typography>
              <Typography className={classes.topItemValue}>{capitalize(orderDetail?.status?.replaceAll('_', ' '))}</Typography>
            </Box>
            <img src="/icon/ic-quotation-status.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={6} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>ADDRESS</Typography>
              <Typography className={classes.topItemValue}>{orderDetail?.phone}</Typography>
              <Typography className={classes.topItemValue}>{orderDetail?.address}</Typography>
            </Box>
            <img src="/icon/ic-order-map.svg" alt="" />
          </Grid>
          <Grid item xs={12} md={6} className={classes.topItem}>
            <Box className={classes.topTexts}>
              <Typography className={classes.topItemTitle}>ESTIMATE DELIVERY </Typography>
              <Typography className={classes.topItemValue}>{orderDetail?.estimated_delivery}</Typography>
            </Box>
            <img src="/icon/ic-quotation-estimated-implememt-date.svg" alt="" />
          </Grid>
        </Grid>
        <div className="w-full h-fit flex flex-col gap-6">
          {isSmallScreen ? (
            Array.isArray(orderDetail?.Item) &&
            orderDetail.Item.map((item, index) => (
              <Grid
                key={index}
                container
                className={classes.gridContainer}
                sx={{
                  borderBottom: '1px solid #EFF7FA',
                }}
              >
                <Grid item xs={4} className={classes.botTitle}>
                  Product
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}>
                  <div className="w-full h-[56px] flex flex-row justify-start items-start gap-4" key={index}>
                    <img className="w-[56px] h-[56px] rounded-lg border-[1px] solid border-[#E6E6E6]" src={item.image} alt="" />
                    <div className="w-full h-full flex flex-row flex-wrap justify-between items-center">
                      <div className="w-[220px] h-full flex flex-col justify-center items-start gap-1">
                        <span className="text-[#202020] text-base font-semibold text-1-line">{item.ItemInfo?.name}</span>
                        <div className="flex flex-row gap-1">
                          <span className="text-[#B3B3B3] text-sm font-normal">SKU:</span>
                          <span className="text-[#0596A6] text-sm font-normal">{item.ItemInfo?.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={4} className={classes.botTitle}>
                  Category
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}>
                  <span className="text-[#1a1a1a] font-normal text-base">{capitalize(item.category?.replaceAll('_', ' '))}</span>
                </Grid>
                <Grid item xs={4} className={classes.botTitle}>
                  Price
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}>
                  <span className="text-[#1a1a1a] font-normal text-base">HK$ {item.price}</span>
                </Grid>
                <Grid item xs={4} className={classes.botTitle}>
                  Quantity
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}>
                  <span className="text-[#1a1a1a] font-normal text-base">{item.qty}</span>
                </Grid>
                <Grid item xs={4} className={classes.botTitle}>
                  Sub total
                </Grid>
                <Grid item xs={8} className={classes.botContentItem}>
                  <span className="text-[#1a1a1a] font-normal text-base">HK$ {item.total_amount}</span>
                </Grid>
              </Grid>
            ))
          ) : (
            <Grid
              container
              className={classes.gridContainer}
              sx={{
                borderBottom: '1px solid #EFF7FA',
              }}
            >
              <Grid item xs={4} className={classes.botTitle}>
                Product
              </Grid>
              <Grid item xs={2} className={classes.botTitle}>
                Category
              </Grid>
              <Grid item xs={2} className={classes.botTitle}>
                Price
              </Grid>
              <Grid item xs={2} className={classes.botTitle}>
                Quantity
              </Grid>
              <Grid item xs={2} className={classes.botTitle}>
                Sub total
              </Grid>
              {Array.isArray(orderDetail?.Item) &&
                orderDetail.Item.map((item, index) => (
                  <Grid
                    container
                    className={classes.gridContainer}
                    sx={{
                      borderBottom: '1px solid #EFF7FA',
                    }}
                    key={index}
                  >
                    <Grid item xs={4} className={classes.botContentItem}>
                      <div className="w-full h-[56px] flex flex-row justify-start items-start gap-4" key={index}>
                        <img className="w-[56px] h-[56px] rounded-lg border-[1px] solid border-[#E6E6E6]" src={item.image} alt="" />
                        <div className="w-full h-full flex flex-row flex-wrap justify-between items-center">
                          <div className="w-[220px] h-full flex flex-col justify-center items-start gap-1">
                            <span className="text-[#202020] text-base font-semibold text-1-line">{item.ItemInfo?.name}</span>
                            <div className="flex flex-row gap-1">
                              <span className="text-[#B3B3B3] text-sm font-normal">SKU:</span>
                              <span className="text-[#0596A6] text-sm font-normal">{item.ItemInfo?.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={2} className={classes.botContentItem}>
                      <span className="text-[#1a1a1a] font-normal text-base">{capitalize(item.category?.replaceAll('_', ' '))}</span>
                    </Grid>
                    <Grid item xs={2} className={classes.botContentItem}>
                      <span className="text-[#1a1a1a] font-normal text-base">HK$ {item.price}</span>
                    </Grid>
                    <Grid item xs={2} className={classes.botContentItem}>
                      <span className="text-[#1a1a1a] font-normal text-base">{item.qty}</span>
                    </Grid>
                    <Grid item xs={2} className={classes.botContentItem}>
                      <span className="text-[#1a1a1a] font-normal text-base">HK$ {item.total_amount}</span>
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          )}

          <Grid container className={classes.gridContainer}>
            <Grid item xs={0} md={8}></Grid>
            <Grid item xs={4} md={2}>
              <span className="text-[#999] text-sm font-medium uppercase text-left">Temporary</span>
            </Grid>
            <Grid item xs={8} md={2}>
              <span className="text-[#1a1a1a] text-base font-semibold uppercase text-left">HK$ {orderDetail?.total_amount}</span>
            </Grid>
            <Grid item xs={0} md={8}></Grid>
            <Grid item xs={4} md={2}>
              <span className="text-[#999] text-sm font-medium uppercase text-left">delivery fee</span>
            </Grid>
            <Grid item xs={8} md={2}>
              <span className="text-[#1a1a1a] text-base font-semibold uppercase text-left">HK$ {orderDetail?.shipping_fee}</span>
            </Grid>
            <Grid item xs={0} md={8}></Grid>
            <Grid item xs={4} md={2}>
              <span className="text-[#999] text-sm font-medium uppercase text-left">Shipping promotions</span>
            </Grid>
            <Grid item xs={8} md={2}>
              <span className="text-[#16B364] text-base font-semibold uppercase text-left">HK$ -{orderDetail?.shipping_disc_amount}</span>
            </Grid>
            <Grid item xs={0} md={8}></Grid>
            <Grid item xs={4} md={2}>
              <span className="text-[#999] text-sm font-medium uppercase text-left">coupon</span>
            </Grid>
            <Grid item xs={8} md={2}>
              <span className="text-[#16B364] text-base font-semibold uppercase text-left">HK$ -{orderDetail?.disc_amount}</span>
            </Grid>
            <Grid item xs={0} md={8}></Grid>
            <Grid item xs={4} md={2}>
              <span className="text-[#999] text-sm font-medium uppercase text-left">Gift card</span>
            </Grid>
            <Grid item xs={8} md={2}>
              <span className="text-[#16B364] text-base font-semibold uppercase text-left">HK$ -{orderDetail?.deposit}</span>
            </Grid>
            <Grid item xs={0} md={8}></Grid>
            <Grid item xs={4} md={2}>
              <span className="text-[#999] text-sm font-medium uppercase text-left">GRAND TOTAL</span>
            </Grid>
            <Grid item xs={8} md={2}>
              <span className="text-[#06455E] text-[20px] font-semibold uppercase text-left">HK$ {orderDetail?.grand_total}</span>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}
