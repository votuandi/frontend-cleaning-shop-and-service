import * as React from 'react'
import parse from 'html-react-parser'
import useStyles from './ServiceItem.styles'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from 'lodash/kebabCase'
import { useState } from 'react'
import { IServiceItem } from '@/utils/api/service'
import theme from '@/assets/theme'
import { useMediaQuery } from '@mui/material'

type IProps = {
  item: IServiceItem
}

const ServiceItem = ({ item }: IProps) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(640))

  const handleRequestQuote = (e: any) => {
    e.stopPropagation()
    gotoPage('/request-quote', `?sid=${item.id}`)
  }

  return (
    <div
      className={`w-full ${
        isSmallScreen ? 'max-w-full' : 'max-w-[287px]'
      } h-full max-h-[390px] mx-auto rounded-lg shadow-md hover:border-[1px] hover:solid border-[#7b7f8210] cursor-pointer flex flex-col gap-[10px]`}
    >
      <img className="w-full h-[160px] rounded-t-lg flex-1" src={item.image} alt="" />
      <div className="w-full h-full px-4 pb-5 gap-8 flex flex-col justify-between">
        <div className="w-full h-fit flex flex-col gap-1">
          <h3 className="text-base not-italic font-semibold leading-[normal] text-[#202020] text-2-line">{item.ServiceLanguage.title}</h3>
          <span className="text-xs not-italic font-normal leading-[normal] text-[#999] text-1-line">{item.type_name}</span>
          <span className="text-xs not-italic font-normal leading-[normal] text-black text-1-line">{item.category_name}</span>
        </div>
        <div className="w-full h-fit flex flex-col gap-2">
          <button
            className="w-full h-fit text-center py-[10px] rounded-lg bg-white text-base not-italic font-medium leading-[normal] text-[#0596A6] border-[1px] solid border-[#0596A6]"
            onClick={() => gotoPage(`/service/detail/${_kebabCase(item.ServiceLanguage.title)}-${item.id}`)}
          >
            {t('Detail')}
          </button>
          <button className="w-full h-fit text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white" onClick={handleRequestQuote}>
            {t('Quotation')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceItem
