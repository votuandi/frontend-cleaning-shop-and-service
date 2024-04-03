import * as React from 'react'
import parse from 'html-react-parser'
import useStyles from './PromotionItem.styles'
import { capitalizeFirstLetterAllWords, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from 'lodash/kebabCase'
import { IPromotionItem } from '@/utils/api/promotion'
import { useState } from 'react'
import { transactionApi } from '@/utils/api'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import { capitalize } from 'lodash'
import ReactDOM from 'react-dom'
import AppConfirm from '../AppConfirm'

type IProps = {
  item: IPromotionItem
}

const PromotionItem = ({ item }: IProps) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const locale = i18n.language
  const dispatch = useDispatch()

  const [amount, setAmount] = useState<number>(1)

  let handleAmountChange = (e: any) => {
    setAmount(e.target.value)
  }

  const handleAddToCart = async (e: any) => {
    e.stopPropagation()
    if (amount === 0) return
    await addToCart()
  }

  const handleChangeQty = (e: any, qty: number) => {
    e.stopPropagation()
    if (amount === 0 && qty < 0) return
    setAmount((x) => x + qty)
  }

  const addToCart = async () => {
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
        let res = await transactionApi.addToCart({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            item_type: 'gift',
            item_id: item.id,
            qty: amount,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(`Added ${amount} ${item.GiftLanguage?.name} to cart successfully!`))
        } else {
          dispatch(setAlertMessageState(`${t('Adding to cart failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
        }
      } catch (error) {
        console.log(error)
        dispatch(setAlertMessageState(t('Adding to cart failed!')))
      }
  }

  return (
    <>
      <div
        className="w-full max-w-[287px] h-[390px] mx-auto rounded-lg shadow-md hover:border-[1px] hover:solid border-[#7b7f8210] cursor-pointer flex flex-col gap-[10px]"
        onClick={() => gotoPage(`/news/${_kebabCase(item.GiftLanguage.name)}-${item.id}`)}
      >
        <img className="w-full h-[160px] rounded-t-lg flex-1" src={item.image} alt="" />
        <div className="w-full h-full px-4 pb-5 gap-8 flex flex-col justify-between">
          <div className="w-full h-fit flex flex-col gap-1">
            <h3 className="text-base not-italic font-semibold leading-[normal] text-[#202020] text-2-line">{item.GiftLanguage.name}</h3>
            <h1 className="text-2xl not-italic font-bold leading-[normal] text-[#06455E]">{`HK$ ${item.price}`}</h1>
          </div>
          <div className="w-full h-fit flex flex-col gap-2">
            <div className="w-full h-fit relative">
              <input
                className="w-full py-2 text-center text-black text-base not-italic font-medium leading-[normal] rounded bg-[#F0F0F0]"
                type="text"
                value={amount}
                onChange={handleAmountChange}
              />
              <button className="w-fit h-full absolute top-0 left-0 p-[5px]" onClick={(e) => handleChangeQty(e, -1)}>
                <img className="w-6 h-6 my-auto" src="/icon/ic-minus.svg" alt="" />
              </button>
              <button className="w-fit h-full absolute top-0 right-0 p-[5px]" onClick={(e) => handleChangeQty(e, 1)}>
                <img className="w-6 h-6 my-auto" src="/icon/ic-plus.svg" alt="" />
              </button>
            </div>
            <button className="w-full h-fit text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white" onClick={handleAddToCart}>
              {t('Add to cart')}
            </button>
          </div>
        </div>
      </div>
      <div id="popup-root"></div>
    </>
  )
}

export default PromotionItem
