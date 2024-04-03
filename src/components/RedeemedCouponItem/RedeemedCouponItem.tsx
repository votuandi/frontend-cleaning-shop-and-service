import * as React from 'react'
import parse from 'html-react-parser'
import useStyles from './RedeemedCouponItem.styles'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from 'lodash/kebabCase'
import { useState } from 'react'
import { IProductGiftItem } from '@/utils/api/transaction'
import { IconButton, TextField, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { ICouponItem, IRedeemedCoupon } from '@/utils/api/coupon'
import theme from '@/assets/theme'

type IProps = {
  item: IRedeemedCoupon
}

const RedeemedCouponItem = ({ item }: IProps) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600))

  const gotoDetail = () => {
    gotoPage(`/member-center/my-coupon/${_kebabCase(item.CouponLanguage.name)}-${item.id}`)
  }

  return (
    <div
      className={`w-full cursor-pointer ${
        isSmallScreen ? ' h-[100px]' : 'max-w-[560px] h-[120px]'
      } mx-auto bg-white rounded-lg shadow-[10px_0px_5px_0px_rgba(225,233,236,1)] hover:border-[1px] hover:solid border-[#7b7f8210] flex flex-row relative`}
      onClick={gotoDetail}
    >
      <img className={`${isSmallScreen ? 'w-[100px] h-[100px]' : 'w-[120px] h-[120px]'} mx-auto max-w-full rounded-l-lg flex-1 cursor-pointer`} src={item.image} alt="" />
      <div className={`w-full h-full flex flex-col justify-between ${isSmallScreen ? 'px-3 py-2' : 'px-5 py-3'}`}>
        <span className={`bg-[#06455E] w-fit text-white rounded font-normal cursor-pointer ${isSmallScreen ? 'px-[5px] py-[2px] text-[10px] ' : 'px-[10px] py-[5px] text-xs'}`}>
          {item?.service_type}
        </span>
        <span className={`text-[#1a1a1a] w-fit font-semibold cursor-pointer ${isSmallScreen ? 'text-lg' : 'text-xl'}`} onClick={gotoDetail}>
          {item?.CouponLanguage?.name}
        </span>
        <div className="w-full h-fit flex flex-row justify-between items-center">
          <div className={`w-fit h-fit flex flex-row justify-center items-center font-normal gap-1 cursor-pointer ${isSmallScreen ? 'text-[10px]' : 'text-base'}`}>
            <span className="text-[#666]">{t('Valid')}:</span>
            <span className="text-[#1a1a1a]">{item?.expiry_date}</span>
          </div>
        </div>
      </div>
      {item?.is_used && (
        <div className={`w-full ${isSmallScreen ? ' h-[100px]' : 'max-w-[560px] h-[120px]'} rounded-lg bg-[#f4f5f5e9] flex justify-center items-center absolute z-10`}>
          <span className="rotate-[-18.979deg] text-[#FC2525] text-[40px] font-semibold">{t('Used')}</span>
        </div>
      )}
      {item?.is_expired && (
        <div className={`w-full ${isSmallScreen ? ' h-[100px]' : 'max-w-[560px] h-[120px]'} rounded-lg bg-[#f4f5f5e9] flex justify-center items-center absolute z-10`}>
          <span className="rotate-[-18.979deg] text-[#06455E] text-[40px] font-semibold">{t('Expired')}</span>
        </div>
      )}
    </div>
  )
}

export default RedeemedCouponItem
