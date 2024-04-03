/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { newsApi, promotionApi, transactionApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { Checkbox, Grid, IconButton, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './Cart.style'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { ICart, ICartDetailGetCart, ICartDetailItem, ICartDetailItemGetCart, ICartGetCart } from '@/utils/api/transaction'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import _ from 'lodash'
import { number } from 'yup'
import { useDispatch } from 'react-redux'
import { setGlobalCart } from '@/slice/cartSlice'
import theme from '@/assets/theme'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

export default function Cart() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const dispatch = useDispatch()
  const lgScreen = useMediaQuery(theme.breakpoints.down(1100))
  const mdScreen = useMediaQuery(theme.breakpoints.down(800))

  const [cart, setCart] = useState<ICartGetCart>()
  const [listCartDetailItem, setListCartDetailItem] = useState<ICartDetailGetCart[]>([])
  const [listCheck, setListCheck] = useState<boolean[]>([])
  const [listQty, setListQty] = useState<number[]>([])
  const [totalAmount, setTotalAmount] = useState<string>('')

  // const debouncedCallAPI = _.debounce(async (cart_detail_id: string | number, newQty: string | number) => {
  //   await updateCartItem(cart_detail_id, newQty)
  // }, 3000)

  const debouncedCallAPI = useCallback(
    _.debounce(async (cart_detail_id: string | number, newQty: string | number) => {
      await updateCartItem(cart_detail_id, newQty)
    }, 3000),
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
        setListCheck(Array(res.data.params.CartDetail.length).fill(true))
        setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
        await getCart()
        // console.log('cart', _.isEqual(res.data.params.Cart, cart))
        // console.log('cart_detail', _.isEqual(res.data.params.CartDetail, listCartDetailItem))
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
      //   gotoPage('/sign-in')
      // }
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
          dispatch(setGlobalCart(res.data.params))
          setListCartDetailItem(res.data.params.CartDetail)
          setListCheck(Array(res.data.params.CartDetail.length).fill(true))
          setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
          let _totalAmount = 0
          ;(res.data.params.CartDetail as ICartDetailGetCart[]).forEach((x) => {
            _totalAmount += parseFloat(x.price) * parseInt(x.qty)
          })
          setTotalAmount(_totalAmount.toFixed(2).padEnd(6, '0'))
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
        dispatch(setGlobalCart(res.data.params))
        setListCartDetailItem(res.data.params.CartDetail)
        setListCheck(Array(res.data.params.CartDetail.length).fill(true))
        setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
        let _totalAmount = 0
        ;(res.data.params.CartDetail as ICartDetailGetCart[]).forEach((x) => {
          _totalAmount += parseFloat(x.price) * parseInt(x.qty)
        })
        setTotalAmount(_totalAmount.toFixed(2).padEnd(6, '0'))
      }
    } catch (error) {
      console.log(error)
    }
  }

  let removeAllCartItems = async () => {
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
        <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={t('Do you really want to clean your cart?')} />,
        document.getElementById('popup-root') // Replace 'popup-root' with your root element id
      )
    })
    if (confirmation) {
      // if (confirm('Do you really want to clean your cart?')) {
      try {
        const storageAvailable = localStorageAvailable()
        const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
        if (!accessToken) {
          console.log('You have not signed in yet!')
          gotoPage('/sign-in')
        }
        let res = await transactionApi.removeAllCartItems({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
          },
        })
        if (res.data.status) {
          setCart(res.data.params.Cart)
          dispatch(setGlobalCart(res.data.params))
          setListCartDetailItem(res.data.params.CartDetail)
          setListCheck(Array(res.data.params.CartDetail.length).fill(true))
          setListQty(res.data.params.CartDetail ? (res.data.params.CartDetail as ICartDetailGetCart[]).map((x) => Number(x.qty)) : [])
          setTotalAmount('0')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  let FetchData = async () => {
    await getCart()
  }

  let handleChangeQty = (index: number, _value: number) => {
    if (listQty[index] === 1 && _value < 1) return
    setTotalAmount((parseFloat(totalAmount) + _value * parseFloat(listCartDetailItem[index].price)).toFixed(2).padEnd(6, '0'))
    let newListQty = [...listQty]
    let newQty = newListQty[index] + _value
    newListQty[index] = newQty
    setListQty(newListQty)
    let cart_detail_id = listCartDetailItem[index]?.id
    debouncedCallAPI(cart_detail_id, newQty)
  }

  let toggleCheckList = (index: number) => {
    let newCheckList = [...listCheck]
    newCheckList[index] = !newCheckList[index]
    setListCheck(newCheckList)
    let _totalAmount = 0
    newCheckList.forEach((item, index) => {
      if (item) {
        _totalAmount += parseFloat(listCartDetailItem[index].price) * parseInt(listCartDetailItem[index].qty)
      }
    })
    setTotalAmount(_totalAmount.toFixed(2).padEnd(6, '0'))
  }

  let gotoCheckout = () => {
    let cartIdList = listCartDetailItem
      .filter((_, i) => listCheck[i])
      .map((x) => x.id)
      .join('_')
    gotoPage(`/checkout`, `?cid=${cartIdList}`)
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
    <>
      <div className={`w-full h-fit flex flex-row items-stretch bg-[#EFF7FA] ${mdScreen ? 'flex-col gap-0' : 'flex-row gap-5'}`}>
        <div className="w-full h-fit flex flex-col px-6 py-5 bg-white">
          <div className="pb-2.5 flex flex-row justify-between items-center border-b-[1px] solid border-[#F0F0F0]">
            <h1 className="text-[#06455E] text-lg font-semibold">{t('Order')}</h1>
            <button className="bg-[#F0F0F0] p-2.5 rounded-[50%]" onClick={removeAllCartItems} disabled={!Array.isArray(listCartDetailItem) || listCartDetailItem.length === 0}>
              <img className="w-[18px] h-[18px]" src="/icon/ic-delete.svg" alt="" />
            </button>
          </div>
          <div className="w-full h-fit flex flex-col">
            {listCartDetailItem?.map((item, index) => {
              return (
                <div className="w-full h-[100px] mt-6 flex flex-row justify-start items-center gap-4" key={index}>
                  <Checkbox defaultChecked={listCheck[index]} sx={{ color: '#0596A6' }} onChange={() => toggleCheckList(index)} />
                  <img className={`${lgScreen ? 'w-[74px] h-[74px]' : 'w-[100px] h-[100px]'} rounded-lg border-[1px] solid border-[#E6E6E6]`} src={item.Item.image} alt="" />

                  <div className={`w-full flex flex-row flex-wrap justify-between items-center ${lgScreen ? 'h-[74px]' : 'h-full'}`}>
                    <div className={`w-[220px] h-full flex flex-col items-start gap-1 ${lgScreen ? 'justify-between' : 'justify-center'}`}>
                      <span className={`text-[#202020] font-semibold text-1-line ${lgScreen ? 'text-sm' : 'text-base'}`}>{item.Item.name}</span>
                      <span className={`text-[#999] font-normal ${lgScreen ? '10px' : 'text-xs'}`}>{item.Item.service_type}</span>
                      <span className={`text-[#333] font-normal ${lgScreen ? 'text-[10px]' : 'text-xs'}`}>{item.Item.categories}</span>
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
        </div>
        <div className={`flex flex-col py-5 px-3 shrink-0 bg-white gap-6 ${mdScreen ? 'w-full' : 'w-[260px]'}`}>
          <div className="bg-[#F0F2F7] w-full h-fit flex flex-row flex-wrap gap-2 justify-between items-center px-3 py-2.5 rounded-lg ">
            <span className="text-[#333] text-sm font-normal">{t('Total')}</span>
            <span className="text-[#06455E] text-lg font-semibold">HK$ {totalAmount}</span>
          </div>
          <button
            disabled={!Array.isArray(listCartDetailItem) || listCartDetailItem.length === 0}
            className={`w-full h-fit text-center py-2.5 rounded-lg text-base not-italic font-medium leading-[normal] text-white ${
              Array.isArray(listCartDetailItem) && listCartDetailItem.length > 0 ? 'bg-[#0596A6]' : 'bg-[#8d8d8d6c]'
            }`}
            onClick={gotoCheckout}
          >
            {t('Checkout')}
          </button>
        </div>
      </div>
      <div id="popup-root"></div>
    </>
  )
}
