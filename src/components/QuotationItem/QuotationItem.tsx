import * as React from 'react'
import parse from 'html-react-parser'
import useStyles from './QuotationItem.styles'
import router from 'next/router'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from 'lodash/kebabCase'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { IQuotationItem } from '@/utils/api/transaction'

type IProps = {
  item: IQuotationItem
  type: string
}

const NewsItem = ({ item, type }: IProps) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()

  return (
    <div
      className="w-full h-fit rounded-2xl hover:shadow-md border-[1px] solid border-[#E6E6E6] cursor-pointer flex flex-col gap-2 px-6 py-5"
      onClick={() => gotoPage(`/member-center/my-quotation/${i18n.language === 'en-US' ? _kebabCase(item?.QuotationDetail[0]?.title) : ''}-${item.id}`)}
    >
      <div className="w-fit h-fit flex flex-row gap-2 justify-center items-center">
        <span className="text-[18px] font-semibold text-[#b3b3b3]">{t('Quotation')}</span>
        <span className="text-[18px] font-semibold text-[#1a1a1a]">#{item?.id}</span>
        <span className="bg-[#2970FF] rounded-md px-2 text-xs text-white">{t(type)}</span>
      </div>
      <div className="w-fit h-fit flex flex-row gap-2 justify-center items-center">
        <CalendarMonthOutlinedIcon sx={{ width: '24px', height: '24px', color: '#666666' }} />
        <span className="text-[#666] text-sm">{item?.created}</span>
      </div>
      <div className="w-fit h-fit flex flex-row gap-2 justify-center items-center">
        <img className="w-[68px] h-[68px] rounded-lg flex-1" src={item?.QuotationDetail[0]?.thumbnail_image} alt="" />
        <div className="h-fit w-fit flex flex-col gap-1 justify-center items-start">
          <span className="text-black text-xs">{item?.service_type}</span>
          <span className="text-black text-lg font-semibold">{item?.QuotationDetail[0]?.title}</span>
        </div>
      </div>
    </div>
  )
}

export default NewsItem
