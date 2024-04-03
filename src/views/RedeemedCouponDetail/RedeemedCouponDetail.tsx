/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { newsApi, productApi, promotionApi } from '@/utils/api'
import { Grid, IconButton, MenuItem, Select, Slide, TextField } from '@mui/material'
import useStyles from './RedeemedCouponDetail.style'
import parse from 'html-react-parser'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetProductDetailResponse } from '@/utils/api/product'
import Slider from 'react-slick'
import OnlineShopItem from '@/components/OnlineShopItem'
import { IGetPromotionsDetailResponse } from '@/utils/api/promotion'
import couponApi from '@/utils/api/coupon/coupon.api'
import { IGetCouponDetailResponse, IGetRedeemedCouponDetailResponse } from '@/utils/api/coupon'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import AppConfirm from '@/components/AppConfirm'
import ReactDOM from 'react-dom'

type Query = {
  slug: string
}

const TAB_TITLES = ['Description', 'Term']

export default function RedeemedCouponDetail() {
  const router = useRouter()
  const query = router.query as unknown as Query
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const dispatch = useDispatch()

  const [couponId, setCouponId] = useState<number | string>(0)
  const [couponDetail, setCouponDetail] = useState<IGetRedeemedCouponDetailResponse>()
  const [currentTab, setCurrentTab] = useState<number>(0)

  const [showRedeemPopup, setShowRedeemPopup] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [amountRedeem, setAmountRedeem] = useState<number>(1)

  let getCouponDetail = async (_couponId?: number | string) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : undefined
    if (!accessToken) {
      // if (confirm("You haven't signed in yet.\nWould you like to log in for redeem this coupon?")) {
      const confirmation = await new Promise<boolean>((resolve) => {
        const handleConfirm = () => {
          ReactDOM.unmountComponentAtNode(document.getElementById('popup-root')!)
          resolve(true)
        }
        const handleCancel = () => {
          ReactDOM.unmountComponentAtNode(document.getElementById('popup-root')!)
          resolve(false)
        }
        // Render the CustomConfirmPopupComponent with appropriate callbacks

        ReactDOM.render(
          <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={`You haven't signed in yet.\nWould you like to log in for redeem this coupon?`} />,
          document.getElementById('popup-root') // Replace 'popup-root' with your root element id
        )
      })
      if (confirmation) {
        gotoPage('/sign-in')
      } else gotoPage('/')
    } else
      try {
        _couponId = _couponId ?? couponId
        let res = await couponApi.getRedeemedCouponDetail({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            member_coupon_id: _couponId,
            token: accessToken,
          },
        })
        if (res.data.status) {
          setCouponDetail(res.data.params)
        }
      } catch (error) {
        console.log(error)
      }
  }

  let handleConfirmRedeem = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        // if (confirm("You haven't signed in yet.\nWould you like to log in for redeem this coupon?")) {
        const confirmation = await new Promise<boolean>((resolve) => {
          const handleConfirm = () => {
            ReactDOM.unmountComponentAtNode(document.getElementById('popup-root')!)
            resolve(true)
          }
          const handleCancel = () => {
            ReactDOM.unmountComponentAtNode(document.getElementById('popup-root')!)
            resolve(false)
          }
          // Render the CustomConfirmPopupComponent with appropriate callbacks

          ReactDOM.render(
            <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={`You haven't signed in yet.\nWould you like to log in for redeem this coupon?`} />,
            document.getElementById('popup-root') // Replace 'popup-root' with your root element id
          )
        })
        if (confirmation) {
          gotoPage('/sign-in')
        } else {
          setShowRedeemPopup(false)
          return
        }
      } else {
        let res = await couponApi.redeem({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            coupon_id: couponId,
            redeemed_qty: amountRedeem,
          },
        })
        if (res.data.status) {
          setShowRedeemPopup(false)
          setShowSuccess(true)
        } else {
          dispatch(setAlertMessageState(`${t('Redeeming coupon failed.')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
          setShowRedeemPopup(false)
        }
      }
    } catch (error) {
      console.log(error)
      dispatch(setAlertMessageState(t('Error when redeeming coupon')))
      setShowRedeemPopup(false)
    }
  }

  let FetchData = async (_couponId?: number | string) => {
    await getCouponDetail(_couponId)
  }

  useEffect(() => {
    if (isMounted()) return
    const _couponId = query.slug.split('-').reverse()[0]
    setCouponId(_couponId)
    FetchData(_couponId)
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <>
      <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6 relative">
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-row flex-wrap gap-1">
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
              Member center
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center/my-coupon')}>
              My coupon
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">Coupon detail</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">COUPON DETAIL</h1>
          </div>
        </div>
        <div className="w-full h-fit px-6 py-10 flex flex-col gap-[46px]">
          <img className="h-full max-h-[400px] w-auto max-w-full mx-auto" src={couponDetail?.image} alt="" />
          <div className="w-full h-fit flex flex-col gap-6">
            <div className="w-fit h-fit flex flex-col gap-1">
              <span className="text-[#999] text-base font-medium">{couponDetail?.service_type}</span>
              <h1 className="text-[#1a1a1a] text-2xl font-semibold">{couponDetail?.CouponLanguage?.name}</h1>
            </div>
            <div className="flex flex-row flex-wrap w-full h-fit justify-between items-center">
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <span className="text-[#808080] text-base font-normal">Expired date</span>
                <span className="text-[#1a1a1a] text-base font-medium">{couponDetail?.expiry_date.split(' ')[0].replaceAll('-', '/')}</span>
              </div>
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <span className="text-[#808080] text-base font-normal">Point</span>
                <span className="text-[#0596A6] text-base font-semibold">{couponDetail?.consume}</span>
              </div>
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
              {parse((currentTab === 0 ? couponDetail?.CouponLanguage?.content : couponDetail?.CouponLanguage?.terms) ?? '')}
            </div>
          </div>
          <button
            className="w-fit h-fit px-12 mx-auto text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white"
            onClick={() => setShowRedeemPopup(true)}
          >
            Use
          </button>
        </div>
        {showRedeemPopup && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-[#021f3195] flex justify-center items-center">
            <div className="w-[90vw] max-w-[530px] h-fit max-h-[90vh] bg-white rounded-2xl p-16 flex flex-col justify-center items-center gap-10 text-center">
              <div className="w-full h-fit flex flex-col justify-center items-center gap-3">
                <span className="text-[#0596A6] text-2xl font-semibold">Redeem</span>
                <span className="text-[#666] text-base font-normal">You can exchange your points for coupons by choosing the number of coupons you want</span>
              </div>
              <div className="w-full h-fit flex flex-col justify-center items-center gap-6">
                <div className="w-full h-fit flex flex-col justify-center items-center gap-4">
                  <span className="text-[#999] text-base font-medium">Total points</span>
                  <span className="text-[#0596A6] text-[40px] font-bold">{(couponDetail?.consume ? Number(couponDetail?.consume) : 0) * amountRedeem}</span>
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-center gap-3">
                  <span className="text-[#999] text-base font-medium">Coupon</span>
                  <TextField
                    className={classes.pickAmountTextField}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <IconButton onClick={() => setAmountRedeem((x) => (x <= 1 ? 1 : x - 1))}>
                          <RemoveIcon />
                        </IconButton>
                      ),
                      endAdornment: (
                        <IconButton onClick={() => setAmountRedeem((x) => x + 1)}>
                          <AddIcon />
                        </IconButton>
                      ),
                    }}
                    value={amountRedeem}
                    onChange={(e: any) => setAmountRedeem(e.target.value)}
                  ></TextField>
                </div>
                <button
                  className="w-fit h-fit px-12 mx-auto text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white"
                  onClick={handleConfirmRedeem}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccess && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-[#021f3195] flex justify-center items-center">
            <div className="w-fit max-w-[90vw] h-fit max-h-[90vh] bg-white rounded-2xl p-16 flex flex-col justify-center items-center gap-6 text-center relative">
              <img className="w-8 h-8" src="/icon/success.png" alt="" />
              <span className="text-[#16B364] text-lg font-medium">Redeem successfully</span>
              <img className="w-5 h-5 absolute top-3 right-3 cursor-pointer" src="/icon/ic-close.svg" alt="" onClick={() => setShowSuccess(false)} />
            </div>
          </div>
        )}
      </div>
      <div id="popup-root"></div>
    </>
  )
}
