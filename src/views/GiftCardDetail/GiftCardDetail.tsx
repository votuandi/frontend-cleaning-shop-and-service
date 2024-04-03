/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { newsApi, productApi, promotionApi, transactionApi } from '@/utils/api'
import { Grid, IconButton, MenuItem, Select, Slide, TextField, useMediaQuery } from '@mui/material'
import useStyles from './GiftCardDetail.style'
import parse from 'html-react-parser'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetProductDetailResponse } from '@/utils/api/product'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Slider from 'react-slick'
import OnlineShopItem from '@/components/OnlineShopItem'
import { IGetPromotionsDetailResponse } from '@/utils/api/promotion'
import theme from '@/assets/theme'
import { capitalize } from 'lodash'
import { setGlobalCart } from '@/slice/cartSlice'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

type Query = {
  slug: string
}

const TAB_TITLES = ['Description', 'Term']

export default function GiftCardDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600))
  const dispatch = useDispatch()

  const [giftId, setGiftId] = useState<number | string>(0)
  const [giftDetail, setGiftDetail] = useState<IGetPromotionsDetailResponse | null>(null)
  const [currentTab, setCurrentTab] = useState<number>(0)

  const addToCart = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        console.log('You have not signed in yet!')
        gotoPage('/sign-in')
      }
      let res = await transactionApi.addToCart({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
          item_type: 'gift',
          item_id: giftId,
          qty: 1,
        },
      })
      if (res.data.status) {
        dispatch(setAlertMessageState(`Added 1 ${giftDetail?.GiftLanguage?.name} to cart successfully!`))
        await getCart()
      } else {
        dispatch(setAlertMessageState(`${t('Adding to cart failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
      }
    } catch (error) {
      console.log(error)
      dispatch(setAlertMessageState(t('Adding to cart failed!')))
    }
  }

  let getCart = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        console.log('You have not signed in yet!')
        gotoPage('/sign-in')
      }
      let res = await transactionApi.getCart({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
        },
      })
      if (res.data.status) {
        dispatch(setGlobalCart(res.data.params))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddToCart = async (e: any) => {
    await addToCart()
  }

  let getGiftDetail = async (_giftId?: number | string) => {
    try {
      _giftId = _giftId ?? giftId
      let res = await promotionApi.getPromotionDetail({
        params: {
          language: 'eng',
          gift_id: _giftId,
        },
      })
      if (res.data.status) {
        setGiftDetail(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async (_giftId?: number | string) => {
    await getGiftDetail(_giftId)
  }

  useEffect(() => {
    if (isMounted()) return
    const _giftId = query.slug.split('-').reverse()[0]
    setGiftId(_giftId)
    FetchData(_giftId)
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
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/online-shop')}>
            Online shop
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3]">Gift card</span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">Gift card detail</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">GIFT CARD DETAIL</h1>
        </div>
      </div>
      <div className={`w-full h-fit flex flex-col gap-[46px] ${isSmallScreen ? 'px-0 py-0' : 'px-6 py-10'}`}>
        <img className="h-full max-h-[400px] w-auto max-w-full mx-auto" src={giftDetail?.image} alt="" />
        <div className="w-full h-fit flex flex-col gap-2">
          <h1 className="text-[#1a1a1a] text-2xl font-semibold">{giftDetail?.GiftLanguage.name}</h1>
          <span className="text-[#06455E] text-2xl font-bold">{`HK$ ${giftDetail?.price}`}</span>
          <div className="flex flex-row flex-wrap justify-start items-center gap-2">
            <span className="text-[#808080] text-base font-normal">Expired date</span>
            <span className="text-[#1a1a1a] text-base font-medium">{`${giftDetail?.publish_date.split(' ')[0].replaceAll('-', '/')} - ${giftDetail?.unpublish_date
              .split(' ')[0]
              .replaceAll('-', '/')}`}</span>
          </div>
        </div>
        <div className="w-full h-fit flex flex-col gap-6 -mt-8">
          <div className="w-full h-fit flex flex-row flex-wrap justify-start items-center gap-5">
            {TAB_TITLES.map((tab, index) => {
              return (
                <button
                  className={`py-[10px] text-base not-italic font-medium leading-[normal] text-[#0596A6] ${
                    currentTab === index ? 'border-b-[2px] solid border-[#0596A6] text-[#0596A6]' : 'text-[#666]'
                  }`}
                  key={index}
                  onClick={() => setCurrentTab(index)}
                >
                  {tab}
                </button>
              )
            })}
          </div>
          <div className="w-full h-fit text-[#999] text-base font-normal">
            {parse((currentTab === 0 ? giftDetail?.GiftLanguage?.content : giftDetail?.GiftLanguage?.terms) ?? '')}
          </div>
        </div>
        <button
          className="w-fit h-fit px-12 mx-auto text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white"
          onClick={handleAddToCart}
        >
          {t('Add to cart')}
        </button>
      </div>
    </div>
  )
}
