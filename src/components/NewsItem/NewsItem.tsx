import * as React from 'react'
import parse from 'html-react-parser'
import useStyles from './NewsItem.styles'
import router from 'next/router'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from "lodash/kebabCase";
import { INewsItem } from '@/utils/api/news'

type IProps = {
  item: INewsItem
}

const NewsItem = ({ item }: IProps) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()

  return (
    <div
      className="w-full max-w-[560px] h-[120px] rounded-lg hover:shadow-md hover:border-[1px] hover:solid hover:border-[#7b7f8210] cursor-pointer flex flex-row gap-4"
      onClick={() => gotoPage(`/news/${i18n.language === 'en-US' ? _kebabCase(item.NewsLanguage.title) : item.slug}-${item.id}`)}
    >
      <img className="h-full w-auto flex-1" src={item.thumbnail_image} alt="" />
      <div className="w-full flex flex-col justify-start items-start gap-1 p-[2px] pl-0">
        <span className="text-lg not-italic font-semibold leading-[normal] text-[#032E42] text-1-line">{item.NewsLanguage.title}</span>
        <div className="text-xs not-italic font-normal leading-[normal] flex-1 text-4-line text-[#666]">{parse(item.NewsLanguage.content)}</div>
        <div className="w-full h-fit flex flex-row flex-wrap justify-start items-center gap-1">
          <img className="w-[14px] h-[14px]" src="/icon/ic-calendar-fill.svg" alt="" />
          <span className="text-sm not-italic font-normal leading-[normal] text-[#999]">{item.publish_date.replaceAll('-', '/')}</span>
        </div>
      </div>
    </div>
  )
}

export default NewsItem
