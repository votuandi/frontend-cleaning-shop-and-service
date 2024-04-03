/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { IGetListNewsResponse, INewsItem } from '@/utils/api/news'
import { newsApi, promotionApi, transactionApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { Box, Checkbox, Grid, IconButton, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './Checkout.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import { IPromotionItem } from '@/utils/api/promotion'
import PromotionItem from '@/components/PromotionItem'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { ICart, ICartDetailGetCart, ICartDetailItem, ICartDetailItemGetCart, ICartGetCart } from '@/utils/api/transaction'
import AppCheckBox from '@/components/AppCheckBox'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import _, { capitalize, isNumber } from 'lodash'
import couponApi, { IRedeemedCoupon } from '@/utils/api/coupon'
import RedeemedCouponItem from '@/components/RedeemedCouponItem'
import { IGetAddressDetailResponse, IGetAddressListResponse, IGetMemberDataResponse } from '@/utils/api/member'
import memberApi from '@/utils/api/member/member.api'
import { number } from 'yup'
import AppCircularProgress from '@/components/AppCircularProgress'
import theme from '@/assets/theme'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

export default function Checkout() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const router = useRouter()
  const { query } = router
  const inpDepositRef = useRef(null)
  const lgScreen = useMediaQuery(theme.breakpoints.down(1100))
  const mdScreen = useMediaQuery(theme.breakpoints.down(800))
  const dispatch = useDispatch()

  const [listRedeemedCoupon, setListRedeemedCoupon] = useState<IRedeemedCoupon[]>([])
  const [cart, setCart] = useState<ICartGetCart>()
  const [listCartDetailItem, setListCartDetailItem] = useState<ICartDetailGetCart[]>([])
  // const [listCheck, setListCheck] = useState<boolean[]>([])
  const [listQty, setListQty] = useState<number[]>([])
  const [addressId, setAddressId] = useState<string>('')
  const [addressData, setAddressData] = useState<IGetAddressDetailResponse>()
  const [memberData, setMemberData] = useState<IGetMemberDataResponse>()
  const [inpDeposit, setInpDeposit] = useState<number>(0)
  const [chooseAddress, setChooseAddress] = useState<boolean>(false)
  const [addressList, setAddressList] = useState<IGetAddressListResponse>([])
  const [selectedCouponId, setSelectedCouponId] = useState<number | string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [firstTouch, setFirstTouch] = useState<boolean>(false)

  const debouncedCallAPI = useCallback(
    _.debounce(async (cart_detail_id: string | number, newQty: string | number) => {
      await updateCartItem(cart_detail_id, newQty)
    }, 500),
    []
  )

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
        setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
        // if (listCheck.length === 0) setListCheck(Array(res.data.params.CartDetail.length).fill(true))
      }
    } catch (error) {
      console.log(error)
    }
  }

  let removeCartItem = async (cart_detail_id: string | number, _qty: string | number) => {
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
        <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={t('Do you really want to remove this items?')} />,
        document.getElementById('popup-root') // Replace 'popup-root' with your root element id
      )
    })
    if (confirmation) {
      // if (confirm('Do you really want to remove this items?')) {
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
            qty: _qty,
            is_delete: 1,
          },
        })
        if (res.data.status) {
          setCart(res.data.params.Cart)
          setListCartDetailItem(res.data.params.CartDetail)
          // setListCheck(Array(res.data.params.CartDetail.length).fill(true))
          setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
        }
      } catch (error) {
        console.log(error)
      }
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
        setCart(res.data.params.Cart)
        setListCartDetailItem(res.data.params.CartDetail)
        // setListCheck(Array(res.data.params.CartDetail.length).fill(true))
        setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getAddressList = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else
      try {
        let res = await memberApi.getAddressList({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
          },
        })
        if (res.data.status) {
          setAddressList(res.data.params)
        } else {
          dispatch(setAlertMessageState(capitalize(res.data.message.replaceAll('_', ' '))))
          gotoPage('/sign-in')
        }
      } catch (error) {
        console.log(error)
        dispatch(setAlertMessageState(t('Error when loading your profile data')))
        gotoPage('/')
      }
  }

  let getRedeemedCoupon = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else {
      try {
        let res = await couponApi.getRedeemedCoupons({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            type: 'active',
            token: accessToken,
          },
        })
        if (res.data.status) {
          setListRedeemedCoupon(res.data.params?.coupon)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  let getMemberData = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else {
      try {
        let res = await memberApi.getMemberData({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
          },
        })
        if (res.data.status) {
          setMemberData(res.data.params)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  let getAddressData = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else {
      try {
        let res = await memberApi.getAddressDetail({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            address_id: addressId,
          },
        })
        if (res.data.status) {
          setAddressData(res.data.params)
          setAddressId(res.data.params.id)
          return res.data.params?.id
        } else {
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
              <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={t('You have not added any address. Go to your address to add new one.')} />,
              document.getElementById('popup-root') // Replace 'popup-root' with your root element id
            )
          })
          if (confirmation) {
            // if (confirm('You have not added any address. Go to your address to add new one.')) {
            gotoPage('/member-center/my-address')
          } else {
            router.back()
          }
        }
      } catch (error) {
        console.log(error)
        return undefined
      }
    }
  }

  let updateShoppingCart = async (cartDetailIds?: string, _addressId?: string | number) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      console.log('You have not signed in yet!')
      gotoPage('/sign-in')
    } else
      try {
        setIsLoading(true)

        let cartIdList =
          cartDetailIds ??
          listCartDetailItem
            // .filter((_, i) => listCheck[i])
            .map((x) => x.id)
            .join(',')
        let res = await transactionApi.updateShoppingCart({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
            cart_detail_id: cartIdList,
            deposit: inpDeposit,
            member_coupon_id: selectedCouponId ?? '',
            address_id: _addressId ? _addressId : addressId,
          },
        })
        if (res.data.status) {
          setCart(res.data.params.Cart)
          setListCartDetailItem(res.data.params.CartDetail)
          setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
          setIsLoading(false)
        } else {
          dispatch(setAlertMessageState(`${t('Error when updating your shopping cart.')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
  }

  let handleChooseAddress = (newAddressId: string) => {
    if (newAddressId === addressId) setChooseAddress(false)
    else setAddressId(newAddressId)
  }

  // let toggleCheckList = (index: number) => {
  //   let newCheckList = [...listCheck]
  //   newCheckList[index] = !newCheckList[index]
  //   setListCheck(newCheckList)
  // }

  let gotoNextStep = () => {
    let cid = listCartDetailItem.map((x) => x.id).join('_')

    gotoPage(`/checkout/choose-payment-method`, `?cart=${cid}&address=${addressId}&deposit=${inpDeposit}&coupon=${selectedCouponId}`)
    // gotoPage('/checkout/choose-payment-method')
  }

  let FetchData = async () => {
    setIsLoading(true)
    await getCart()
    if (query.cid) {
      let cardDetailIds = (query.cid as string).replaceAll('_', ',')

      let defaultAddressId = await getAddressData()
      await updateShoppingCart(cardDetailIds, defaultAddressId)
    } else {
      dispatch(setAlertMessageState(t('Loading failed. Back to Home page!')))
      gotoPage('/')
      return
    }
    await getRedeemedCoupon()
    await getMemberData()
    await getAddressList()
    setIsLoading(false)
  }

  let handleChangeQty = (index: number, _value: number) => {
    if (listQty[index] === 1 && _value < 1) return
    let newListQty = [...listQty]
    let newQty = newListQty[index] + _value
    newListQty[index] = newQty
    setListQty(newListQty)

    let cart_detail_id = listCartDetailItem[index]?.id
    debouncedCallAPI(cart_detail_id, newQty)
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
    getAddressData()
    setChooseAddress(false)
  }, [addressId])

  useEffect(() => {
    if (!isMounted()) return

    updateShoppingCart()
  }, [selectedCouponId, inpDeposit])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <>
      <div className={`w-full h-fit flex items-stretch bg-[#EFF7FA] relative ${mdScreen ? 'flex-col gap-0' : 'flex-row gap-5'}`}>
        {isLoading && <AppCircularProgress />}
        <div className="w-full h-fit flex flex-col px-6 py-10 bg-white">
          <div className="pl-3 flex flex-row justify-between items-center border-l-[7px] solid border-[#0596a6]">
            <h1 className="text-[#06455E] text-lg font-semibold">{t('Checkout').toUpperCase()}</h1>
          </div>
          <div className="w-full h-fit flex flex-col">
            {listCartDetailItem?.map((item, index) => {
              return (
                <div className="w-full h-[100px] mt-6 flex flex-row justify-start items-center gap-4" key={index}>
                  <img className={`${lgScreen ? 'w-[74px] h-[74px]' : 'w-[100px] h-[100px]'} rounded-lg border-[1px] solid border-[#E6E6E6]`} src={item.Item.image} alt="" />

                  <div className={`w-full flex flex-row flex-wrap justify-between items-center ${lgScreen ? 'h-[74px]' : 'h-full'}`}>
                    <div className={`w-[220px] h-full flex flex-col items-start gap-1 ${lgScreen ? 'justify-between' : 'justify-center'}`}>
                      <span className={`text-[#202020] font-semibold text-1-line ${lgScreen ? 'text-sm' : 'text-base'}`}>{item.Item?.name}</span>
                      <span className={`text-[#999] font-normal ${lgScreen ? 'text-[10px]' : 'text-xs'}`}>{item.Item?.service_type}</span>
                      <span className={`text-[#333] font-normal ${lgScreen ? 'text-[10px]' : 'text-xs'}`}>{item.Item?.categories}</span>
                      {lgScreen && (
                        <TextField
                          className={classes.smallPickAmountTextField}
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <IconButton onClick={() => handleChangeQty(index, -1)}>
                                <RemoveIcon />
                              </IconButton>
                            ),
                            endAdornment: (
                              <IconButton onClick={() => handleChangeQty(index, 1)}>
                                <AddIcon />
                              </IconButton>
                            ),
                          }}
                          value={listQty[index]}
                          onChange={(e: any) => {}}
                        ></TextField>
                      )}
                    </div>
                    {!lgScreen && (
                      <TextField
                        className={classes.pickAmountTextField}
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <IconButton onClick={() => handleChangeQty(index, -1)}>
                              <RemoveIcon />
                            </IconButton>
                          ),
                          endAdornment: (
                            <IconButton onClick={() => handleChangeQty(index, 1)}>
                              <AddIcon />
                            </IconButton>
                          ),
                        }}
                        value={listQty[index]}
                        onChange={(e: any) => {}}
                      ></TextField>
                    )}
                    {lgScreen ? (
                      <div className="flex flex-col justify-between items-end h-full">
                        <span className="text-[#053E56] text-[16px] font-semibold text-center">{`HK$ ${item.price}`}</span>
                        <button className="bg-[#F0F0F0] p-[6px] rounded-[50%]" onClick={() => removeCartItem(item.id, item.qty)}>
                          <img className="w-[18px] h-[18px]" src="/icon/ic-trash.svg" alt="" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-[#053E56] text-[24px] font-semibold text-center">{`HK$ ${item.price}`}</span>
                        <button className="bg-[#F0F0F0] p-2.5 rounded-[50%]" onClick={() => removeCartItem(item.id, item.qty)}>
                          <img className="w-[18px] h-[18px]" src="/icon/ic-trash.svg" alt="" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="pl-3 flex flex-row justify-between items-center border-l-[7px] solid border-[#0596a6] mt-10">
            <h1 className="text-[#06455E] text-lg font-semibold">{t('Coupon').toUpperCase()}</h1>
          </div>

          <Grid container className={classes.couponContainer} spacing="24px">
            {listRedeemedCoupon?.map((item, index) => (
              <Grid item xs={12} lg={6} key={index}>
                <div
                  className={`w-full max-w-[560px] h-[120px] mx-auto bg-white rounded-lg shadow-[10px_0px_5px_0px_rgba(225,233,236,1)]  flex flex-row relative ${
                    !item?.is_expired && !item?.is_used ? 'hover:border-[1px] hover:solid border-[#7b7f8210]' : ''
                  }`}
                >
                  <img className="w-[120px] h-[120px] mx-auto max-w-full rounded-l-lg flex-1 cursor-pointer" src={item.image} alt="" />
                  <div className="w-full h-full px-5 py-3 flex flex-col justify-between">
                    <span className="bg-[#06455E] w-fit text-white px-[10px] py-[5px] rounded text-xs font-normal cursor-pointer">{item?.service_type}</span>
                    <span className="text-[#1a1a1a] w-fit text-xl font-semibold cursor-pointer">{item?.CouponLanguage?.name}</span>
                    <div className="w-full h-fit flex flex-row justify-between items-center">
                      <div className="w-fit h-fit flex flex-row justify-center items-center text-base font-normal gap-1 cursor-pointer">
                        <span className="text-[#666]">{t('Valid')}:</span>
                        <span className="text-[#1a1a1a]">{item?.expiry_date}</span>
                      </div>
                      {selectedCouponId === item?.id ? (
                        <span className="text-[#d33b3b] text-xl font-semibold cursor-pointer" onClick={() => setSelectedCouponId('')}>
                          {t('Remove')}
                        </span>
                      ) : (
                        <span className="text-[#0596A6] text-xl font-semibold cursor-pointer" onClick={() => setSelectedCouponId(item?.id)}>
                          {t('Apply')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
        <div className={`flex flex-col py-5 px-3 shrink-0 bg-white ${mdScreen ? 'w-full' : 'w-[260px]'}`}>
          {chooseAddress ? (
            <div className="px-3 py-2.5 flex flex-col rounded-lg bg-[#F0F2F7] w-full gap-2">
              <span className="text-[#808080] text-sm font-normal">{t('Choose address')}</span>
              {addressList.map((item, index) => (
                <div
                  className="pb-2 px-1 w-full flex flex-col gap-1 border-b-[1px] solid border-[#99999950] hover:shadow-sm hover:bg-[#e0e2e6] rounded-lg cursor-pointer"
                  onClick={() => handleChooseAddress(item?.MemberAddress?.id)}
                >
                  <span className="text-[#1A1A1A] text-base font-semibold">{item?.MemberAddress?.name}</span>
                  <span className="text-[#808080] text-xs font-normal">{item?.MemberAddress?.phone}</span>
                  <span className="text-[#1a1a1a] text-sm font-normal">{item?.MemberAddress?.address}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2.5 flex flex-col rounded-lg bg-[#F0F2F7] w-full gap-2">
              <div className="w-full flex flex-row justify-between items-center">
                <span className="text-[#808080] text-sm font-normal">{t('Address')}</span>
                <img className="w-[18px] h-[18px] cursor-pointer" src="/icon/ic-edit.svg" alt="" onClick={() => setChooseAddress(true)} />
              </div>
              <div className="w-full flex flex-row justify-start items-center gap-2">
                <img className="w-[18px] h-[18px]" src="/icon/ic-call.svg" alt="" />
                <span className="text-[#333] text-sm font-normal">{addressData?.phone}</span>
              </div>
              <div className="w-full flex flex-row justify-start items-start gap-2">
                <img className="w-[18px] h-[18px]" src="/icon/map.svg" alt="" />
                <span className="text-[#333] text-sm font-normal">{addressData?.address}</span>
              </div>
            </div>
          )}

          <div className="px-3 py-2.5 flex flex-col rounded-lg bg-[#F0F2F7] w-full gap-2 mt-4">
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-[#808080] text-sm font-normal">{t('Deposit')}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center gap-2">
              <span className="text-[#333] text-xs font-normal">{t('My deposit')}</span>
              <span className="text-[#FFB81A] text-base font-normal">HK$ {memberData?.deposit}</span>
            </div>
            <Grid container sx={{ width: '100%' }}>
              <Grid item xs={9} sx={{ paddingRight: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input type="number" className="px-3 py-2 rounded-lg bg-white text-[#1A1A1A] text-sm font-normal w-full" placeholder={t('Enter price')} ref={inpDepositRef} />
              </Grid>
              <Grid item xs={3}>
                <button
                  className="py-2 w-full rounded-lg bg-[#0596A6] text-white text-base font-medium"
                  onClick={() => setInpDeposit((inpDepositRef?.current as any)?.value ?? '')}
                >
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
              <span className="text-[#333] text-sm font-normal">{t('Discount')}</span>
              <span className="text-[#333] text-sm font-medium">{cart?.disc_amount}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center mt-3">
              <span className="text-[#333] text-sm font-normal">{t('Deposit')}</span>
              <span className="text-[#333] text-sm font-medium">{cart?.deposit}</span>
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
            onClick={() => gotoNextStep()}
          >
            {t('Process to payment')}
          </button>
        </div>
      </div>
      <div id="popup-root"></div>
    </>
  )
}
