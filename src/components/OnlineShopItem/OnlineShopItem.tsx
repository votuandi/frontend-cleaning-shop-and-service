import * as React from 'react'
import parse from 'html-react-parser'
import useStyles from './OnlineShopItem.styles'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from 'lodash/kebabCase'
import { useState } from 'react'
import transactionApi, { IProductGiftItem } from '@/utils/api/transaction'
import { Box, IconButton, TextField, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import theme from '@/assets/theme'
import { capitalize } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalCart } from '@/slice/cartSlice'
import { RootState } from '@/store'
import { setAlertMessageState } from '@/slice/alertSlice'
import ReactDOM from 'react-dom'
import AppConfirm from '../AppConfirm'

type IProps = {
  item: IProductGiftItem
}

const OnlineShopItem = ({ item }: IProps) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const { classes } = useStyles()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(500))
  const dispatch = useDispatch()
  const alert = useSelector((state: RootState) => state.alert)

  const [value, setValue] = useState<number>(1)

  const addToCart = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
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
          <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message="You have not signed in yet. Would you like to sign in?" />,
          document.getElementById('popup-root') // Replace 'popup-root' with your root element id
        )
      })
      // if (confirm('You have not signed in yet. Would you like to sign in?')) gotoPage('/sign-in')
      if (confirmation) {
        gotoPage('/sign-in')
      }
    } else
      try {
        let res = await transactionApi.addToCart({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
            item_type: item.type,
            item_id: item.id,
            qty: value,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(`Added ${value} ${item.name} to cart successfully!`))
          await updateCartAfterAdd()
        } else {
          dispatch(setAlertMessageState(`${t('Adding to cart failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
        }
      } catch (error) {
        console.log(error)
        dispatch(setAlertMessageState(t('Adding to cart failed!')))
      }
  }

  let updateCartAfterAdd = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      // if (confirm('You have not signed in yet. Would you like to sign in?')) gotoPage('/sign-in')
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
          <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message="You have not signed in yet. Would you like to sign in?" />,
          document.getElementById('popup-root') // Replace 'popup-root' with your root element id
        )
      })
      if (confirmation) {
        gotoPage('/sign-in')
      }
    } else
      try {
        let res = await transactionApi.getCart({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
          },
        })
        if (res.data.status) {
          dispatch(setGlobalCart(res.data.params))
        } else {
          dispatch(setAlertMessageState(`Adding to cart failed!\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
        }
      } catch (error) {
        console.log(error)
      }
  }

  const handleAddToCart = async (e: any) => {
    e.stopPropagation()
    if (value === 0) return
    await addToCart()
  }

  const goToDetail = () => {
    if (item.type === 'product') {
      gotoPage(`online-shop/product/${_kebabCase(item.name)}-${item.id}`)
    } else if (item.type === 'gift') {
      gotoPage(`online-shop/gift-card/${_kebabCase(item.name)}-${item.id}`)
    }
  }

  const handleChangeQty = (e: any, qty: number) => {
    e.stopPropagation()
    if (value === 1 && qty < 1) return
    setValue((x) => x + qty)
  }

  return (
    <>
      <div
        className="w-full max-w-[287px] h-[410px] mx-auto bg-white rounded-lg shadow-md hover:border-[1px] hover:solid border-[#7b7f8210] cursor-pointer flex flex-col gap-[10px]"
        onClick={goToDetail}
      >
        <Box
          sx={{
            width: '100%',
            height: '287px',
            backgroundImage: `url('${item.image}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        ></Box>
        {/* <img className="w-auto h-[160px] mx-auto max-w-full rounded-t-lg flex-1" src={item.image} alt="" /> */}
        <div className={`w-full h-full flex flex-col justify-between ${isSmallScreen ? 'px-3 py-4' : 'px-4 pb-5'}`}>
          <div className="w-full h-fit flex flex-col gap-1 justify-start items-start">
            <h3 className="text-base not-italic font-semibold leading-[normal] text-[#202020] text-2-line">{item.name}</h3>
            <span className="text-xs not-italic font-normal leading-[normal] text-[#999] text-1-line">{item.service_type}</span>
            <span className="text-xs not-italic font-normal leading-[normal] text-black text-1-line">{item.categories}</span>
          </div>
          <div className="w-full h-fit flex flex-row justify-start items-center flex-wrap">
            <span className={`text-[#06455E] mr-2 font-bold ${isSmallScreen ? 'text-base' : 'text-2xl'}`}>{`HK$ ${item.price_after_discount}`}</span>
            <span className={`text-[#666] font-normal ${isSmallScreen ? 'text-sm' : 'text-base'}`}>{`HK$ ${item.price}`}</span>
          </div>
          <div className="w-full h-fit flex flex-col gap-2">
            <TextField
              className={classes.pickAmountTextField}
              type="number"
              InputProps={{
                startAdornment: (
                  <IconButton onClick={(e) => handleChangeQty(e, -1)}>
                    <RemoveIcon sx={{ color: '#1a1a1a' }} />
                  </IconButton>
                ),
                endAdornment: (
                  <IconButton onClick={(e) => handleChangeQty(e, 1)}>
                    <AddIcon sx={{ color: '#1a1a1a' }} />
                  </IconButton>
                ),
              }}
              value={value}
              onChange={(e: any) => setValue(e.target.value)}
            ></TextField>
            <button className="w-full h-fit text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white" onClick={handleAddToCart}>
              {t('Add to cart')}
            </button>
          </div>
        </div>
        <div id="popup-root"></div>
      </div>
    </>
  )
}

export default OnlineShopItem
