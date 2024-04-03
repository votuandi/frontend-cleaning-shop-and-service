/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { newsApi, promotionApi, settingApi, transactionApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, IconButton, MenuItem, Radio, RadioGroup, Select, TextField, Typography, useMediaQuery } from '@mui/material'
import useStyles from './ChoosePaymentMethod.style'
import { gotoPage, isNumber, localStorageAvailable } from '@/utils/helpers/common'
import { ICart, ICartDetailGetCart, ICartDetailItem, ICartDetailItemGetCart, ICartGetCart } from '@/utils/api/transaction'
import AppCircularProgress from '@/components/AppCircularProgress'
import { IGetDeliveryMethodSettingResponse, IPaymentMethodItem } from '@/utils/api/setting'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { capitalize } from 'lodash'
import theme from '@/assets/theme'
import { setAlertMessageState } from '@/slice/alertSlice'
import { useDispatch } from 'react-redux'

type Window = {
  SpiralPG: any
}

export default function ChoosePaymentMethod() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const router = useRouter()
  const { query } = router
  const inpDepositRef = useRef(null)
  const lgScreen = useMediaQuery(theme.breakpoints.down(1100))
  const mdScreen = useMediaQuery(theme.breakpoints.down(800))
  const dispatch = useDispatch()

  const [cart, setCart] = useState<ICartGetCart>()
  const [listCartDetailItem, setListCartDetailItem] = useState<ICartDetailGetCart[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paymentMethodList, setPaymentMethodList] = useState<IPaymentMethodItem[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [deliverMethodSetting, setDeliverMethodSetting] = useState<IGetDeliveryMethodSettingResponse>()
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  let updateCartItem = async (cart_detail_id: string | number, newQty: string | number) => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        console.log('You have not signed in yet!')
        gotoPage('/sign-in')
      }
      let res = await transactionApi.updateCartItem({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
          cart_detail_id: cart_detail_id,
          qty: newQty,
        },
      })
      if (res.data.status) {
        setCart(res.data.params.Cart)
        setListCartDetailItem(res.data.params.CartDetail)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let updateShoppingCart = async (_address: string, _cart: string, _deposit: string, _coupon: string) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else
      try {
        setIsLoading(true)
        let res = await transactionApi.updateShoppingCart({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
            cart_detail_id: _cart.replaceAll('_', ','),
            deposit: Number(_deposit),
            member_coupon_id: _coupon,
            address_id: _address,
            include_delivery: true,
          },
        })
        if (res.data.status) {
          setCart(res.data.params.Cart)
          setListCartDetailItem(res.data.params.CartDetail)
          setIsLoading(false)
        } else {
          dispatch(setAlertMessageState(`${t('Error when updating your shopping cart.')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
  }

  let getPaymentMethodList = async () => {
    try {
      let res = await settingApi.getPaymentMethodList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })
      if (res.data.status) {
        setPaymentMethodList(res.data.params)
      } else {
        dispatch(setAlertMessageState(t('Error when loading payment methods')))
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getDeliveryMethodSetting = async () => {
    try {
      let res = await settingApi.getDeliveryMethodSetting({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })
      if (res.data.status) {
        setDeliverMethodSetting(res.data.params)
      } else {
        dispatch(setAlertMessageState(t('Error when loading delivery method')))
      }
    } catch (error) {
      console.log(error)
    }
  }

  let createNewTransaction = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else
      try {
        setIsLoading(true)
        let res = await transactionApi.createNewTransaction({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            payment_method_id: selectedPaymentMethod,
          },
        })
        if (res.data.status) {
          setErrorMessage(null)
          const script = document.createElement('script')
          script.src = 'https://library-checkout.spiralplatform.com/js/v2/spiralpg.min.js'
          script.async = true
          script.onload = () => {
            if (window.SpiralPG) {
              window.SpiralPG.redirectToPay(res.data.params.session_id, { locale: 'en_US' })
            }
          }
          setIsLoading(false)
          document.head.appendChild(script)
        } else {
          setErrorMessage(capitalize(res.data.message.replaceAll('_', ' ')))
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setErrorMessage(t('Create new transaction failed!'))
        setIsLoading(false)
      }
  }

  let handleChangePaymentMethod = (e: string) => {
    setSelectedPaymentMethod(e)
    // console.log(typeof e)
  }

  let FetchData = async () => {
    setIsLoading(true)
    await updateShoppingCart(query.address as string, query.cart as string, query.deposit as string, isNumber(query.coupon as string) ? (query.coupon as string) : '')
    await getPaymentMethodList()
    await getDeliveryMethodSetting()
    setIsLoading(false)
  }

  useEffect(() => {
    if (isMounted()) return
    FetchData()
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className={`w-full h-fit flex items-stretch bg-[#EFF7FA] relative ${mdScreen ? 'flex-col gap-0' : 'flex-row gap-5'}`}>
      {isLoading && <AppCircularProgress />}
      <div className={`w-full h-fit flex flex-col bg-white gap-6 ${lgScreen ? 'px-4 py-8' : 'px-6 py-10'}`}>
        {errorMessage && <span className="px-[15px] py-[7px] bg-[#EE4B4B] text-white text-base font-normal text-left">{errorMessage}</span>}
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-row flex-wrap gap-1">
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={router.back}>
              {t('Checkout')}
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('Choose payment method')}</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('Choose payment method').toUpperCase()}</h1>
          </div>
        </div>
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedPaymentMethod}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChangePaymentMethod(e.target.value)
            }}
          >
            {paymentMethodList.map((item, index) => {
              return (
                <FormControlLabel
                  sx={{ color: '#1a1a1a' }}
                  value={item.id}
                  control={<Radio />}
                  label={
                    <div className={classes.labelContainer}>
                      <img src={item.image} alt="Male" className={classes.labelImage} />
                      <Typography>{item.PaymentMethodLanguage?.name}</Typography>
                    </div>
                  }
                  key={index}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
        <div className="pl-3 flex flex-row justify-between items-center border-l-[7px] solid border-[#0596a6]">
          <h1 className="text-[#06455E] text-lg font-semibold">{t('Checkout').toUpperCase()}</h1>
        </div>
        <FormControl
          component="fieldset"
          sx={{
            width: '100%',
            padding: lgScreen ? '6px 16px' : '10px 24px',
            borderRadius: '8px',
            backgroundColor: '#EFF7FA',
          }}
        >
          <FormControlLabel
            sx={{ color: '#1a1a1a' }}
            control={<Radio checked />}
            label={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#000', fontSize: lgScreen ? '14px' : '16px', fontWeight: 400 }}>{t('Delivery fee')}</Typography>
                <Typography sx={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: '#fff', color: '#053E56', fontSize: lgScreen ? '14px' : '16px', fontWeight: 500 }}>
                  {deliverMethodSetting?.['system-delivery-fee']}
                </Typography>
              </Box>
            }
          />
        </FormControl>

        <Box
          sx={{
            padding: lgScreen ? '12px' : '15px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '8px',
            border: '1px solid #BFDFD6',
            gap: lgScreen ? '8px' : '12px',
            marginTop: '18px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-18px',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px', backgroundColor: '#fff', padding: '5px 15px' }}>
              <img className={`${lgScreen ? '18px' : 'w-6'} h-auto`} src="/icon/ic-delivery.svg" />
              <span className={`text-[#06455E] ${lgScreen ? 'text-sm' : 'text-base'}`}>
                {t('Estimated delivery')}: {deliverMethodSetting?.['system-delivery-time']}
              </span>
            </Box>
          </Box>
          {listCartDetailItem.slice(0, isShowMore ? listCartDetailItem.length : 1).map((item, index) => {
            return (
              <div className={`w-full h-[100px] flex flex-row justify-start items-center ${lgScreen ? 'gap-2' : 'gap-4'}`} key={index}>
                <img className={`${lgScreen ? 'w-[74px] h-[74px]' : 'w-[100px] h-[100px]'} rounded-lg border-[1px] solid border-[#E6E6E6]`} src={item.Item.image} alt="" />

                <div className="w-full h-full flex flex-row justify-between items-center">
                  <div className={`h-full flex flex-col justify-center items-start gap-1 ${lgScreen ? 'w-[160px]' : 'w-[220px]'}`}>
                    <span className={`text-[#202020] font-semibold text-1-line ${lgScreen ? 'text-sm' : 'text-base'}`}>{item.Item?.name}</span>
                    <span className={`text-[#999] font-normal ${lgScreen ? 'text-[10px]' : 'text-xs'}`}>{item.Item?.service_type}</span>
                    <span className={`text-[#333] font-normal ${lgScreen ? 'text-[10px]' : 'text-xs'}`}>{item.Item?.categories}</span>
                    <span className={`text-[#333] font-normal text-sm`}>x {item.qty}</span>
                  </div>

                  <span className={`text-[#053E56] break-words font-semibold text-center ${lgScreen ? 'text-[16px]' : 'text-[24px]'}`}>{`HK$ ${item.price}`}</span>
                </div>
              </div>
            )
          })}
          {Array.isArray(listCartDetailItem) && listCartDetailItem.length > 1 && (
            <div className="flex flex-row gap-[2px] items-center cursor-pointer" onClick={() => setIsShowMore((x) => !x)}>
              <span className="text-[#808080] text-sm font-normal">{isShowMore ? t('Show less items') : `${t('More')} ${listCartDetailItem.length - 1} ${t('items')}`}</span>
              {isShowMore ? (
                <KeyboardArrowUpIcon sx={{ color: '#808080', width: '20px', height: '20px' }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ color: '#808080', width: '20px', height: '20px' }} />
              )}
            </div>
          )}
        </Box>
      </div>
      <div className={`${mdScreen ? 'w-full' : 'w-[260px]'} flex flex-col py-5 px-3 shrink-0 bg-white`}>
        <div className="px-3 py-2.5 flex flex-col rounded-lg bg-[#F0F2F7] w-full gap-2">
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-[#808080] text-sm font-normal">{t('Address')}</span>
          </div>
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <img className="w-[18px] h-[18px]" src="/icon/ic-call.svg" alt="" />
            <span className="text-[#333] text-sm font-normal">{cart?.phone}</span>
          </div>
          <div className="w-full flex flex-row justify-start items-start gap-2">
            <img className="w-[18px] h-[18px]" src="/icon/map.svg" alt="" />
            <span className="text-[#333] text-sm font-normal">{cart?.address}</span>
          </div>
        </div>

        <div className="px-3 py-2.5 flex flex-col rounded-lg bg-[#F0F2F7] w-full gap-2 mt-4">
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-[#808080] text-sm font-normal">{t('Deposit')}</span>
          </div>
          <div className="w-full flex flex-row justify-between items-center gap-2">
            <span className="text-[#333] text-xs font-normal">{t('My deposit')}</span>
            <span className="text-[#FFB81A] text-base font-normal">{cart?.deposit}</span>
          </div>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={9} sx={{ paddingRight: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <input
                disabled
                type="number"
                className="px-3 py-2 rounded-lg bg-white text-[#1A1A1A] text-sm font-normal w-full"
                placeholder={t('Enter price')}
                ref={inpDepositRef}
              />
            </Grid>
            <Grid item xs={3}>
              <button disabled className="py-2 w-full rounded-lg bg-[#E6E6E6] text-[#B3B3B3] text-base font-medium">
                {t('Apply')}
              </button>
            </Grid>
          </Grid>
        </div>
        <div className="px-3 py-2.5 flex flex-col rounded-lg bg-[#F0F2F7] w-full mt-4">
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-[#333] text-sm font-normal">{t('Temporary')}</span>
            <span className="text-[#333] text-sm font-medium">{cart?.total_amount}</span>
          </div>
          <div className="w-full flex flex-row justify-between items-center mt-3">
            <span className="text-[#333] text-sm font-normal">{t('Delivery fee')}</span>
            <span className="text-[#333] text-sm font-medium">{cart?.shipping_fee}</span>
          </div>
          <div className="w-full flex flex-row justify-between items-center mt-3">
            <span className="text-[#333] text-sm font-normal">{t('Discount')}</span>
            <span className="text-[#16B364] text-sm font-medium">-{cart?.disc_amount}</span>
          </div>
          <div className="w-full flex flex-row justify-between items-center mt-3">
            <span className="text-[#333] text-sm font-normal">{t('Deposit')}</span>
            <span className="text-[#16B364] text-sm font-medium">-{cart?.deposit}</span>
          </div>
          <div className="w-full flex flex-row justify-between items-start gap-2 mt-6">
            <span className="text-[#333] text-sm font-normal">{t('Total')}</span>
            <div className="flex flex-col items-end">
              <span className="text-[#06455E] text-lg font-semibold">HK$ {cart?.grand_total}</span>
              <span className="text-[#808080] text-xs font-normal">({t('Tax included')})</span>
            </div>
          </div>
        </div>
        <button
          className="w-full h-fit text-center py-2.5 rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white mt-6"
          onClick={createNewTransaction}
        >
          {t('Place order')}
        </button>
      </div>
    </div>
  )
}
