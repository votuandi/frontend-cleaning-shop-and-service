/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { IGetListNewsResponse, INewsItem } from '@/utils/api/news'
import { newsApi, promotionApi } from '@/utils/api'
import NewsItem from '@/components/NewsItem'
import { Grid, MenuItem, Select } from '@mui/material'
import useStyles from './News.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import { IPromotionItem } from '@/utils/api/promotion'
import PromotionItem from '@/components/PromotionItem'
import { number } from 'yup'
import { capitalizeFirstLetter } from '@/utils/helpers/common'

const TAB_TITLES = ['news', 'promotion']
const ITEMS_PER_PAGE = [4, 6, 8, 10, 12]

export default function News() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const { query } = useRouter()

  const [listNews, setListNews] = useState<INewsItem[]>([])
  const [listPromotion, setListPromotion] = useState<IPromotionItem[]>([])
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(6)
  const [totalPage, setTotalPage] = useState<number>(1)

  let handleChangeTab = (index: number) => {
    setCurrentTab(index)
    if (currentPage === 1) {
      if (index === 0) getListNews(showPerPage, 1)
      else getListPromotion(showPerPage, 1)
    } else setCurrentPage(1)
  }

  let handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  let handleChangeShowPerPage = (e: any) => {
    setShowPerPage(e.target.value)
    if (currentPage === 1) {
      if (currentTab === 0) getListNews(e.target.value, 1)
      else getListPromotion(e.target.value, 1)
    } else setCurrentPage(1)
  }

  let getListNews = async (_limit: number, _page: number) => {
    try {
      let res = await newsApi.getListNews({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: _limit,
          page: _page,
        },
      })
      if (res.data.status) {
        setListNews(res.data.params.News)
        let _totalPage =
          res.data.params.total_record <= res.data.params.limit
            ? 1
            : res.data.params.total_record % res.data.params.limit === 0
            ? res.data.params.total_record / res.data.params.limit
            : Math.floor(res.data.params.total_record / res.data.params.limit) + 1
        setTotalPage(_totalPage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getListPromotion = async (_limit: number, _page: number) => {
    try {
      let res = await promotionApi.getList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: _limit,
          page: _page,
        },
      })
      if (res.data.status) {
        setListPromotion(res.data.params.Gift)
        let _totalPage =
          res.data.params.total_record <= res.data.params.limit
            ? 1
            : res.data.params.total_record % res.data.params.limit === 0
            ? res.data.params.total_record / res.data.params.limit
            : Math.floor(res.data.params.total_record / res.data.params.limit) + 1
        setTotalPage(_totalPage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async (_tab?: number) => {
    let _currentTab = _tab ?? currentTab
    if (_currentTab === 0) await getListNews(showPerPage, currentPage)
    else await getListPromotion(showPerPage, currentPage)
  }

  useEffect(() => {
    if (isMounted()) return
    setCurrentTab(query.tab ? Number(query.tab.toString()) : 0)
    FetchData(query.tab ? Number(query.tab.toString()) : 1)
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  useEffect(() => {
    if (currentTab === 0) getListNews(showPerPage, currentPage)
    else getListPromotion(showPerPage, currentPage)
  }, [currentPage])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
      <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
        <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('news & promotions').toUpperCase()}</h1>
      </div>
      <div className="w-full h-fit flex flex-row flex-wrap justify-start items-center gap-5">
        {TAB_TITLES.map((tab, index) => {
          return (
            <button
              className={`py-[10px] text-base not-italic font-medium leading-[normal] text-[#0596A6] ${
                currentTab === index ? 'border-b-[2px] solid border-[#0596A6] text-[#0596A6]' : 'text-[#666]'
              }`}
              key={index}
              onClick={() => handleChangeTab(index)}
            >
              {capitalizeFirstLetter(t(tab))}
            </button>
          )
        })}
      </div>
      {currentTab === 0 ? (
        <div className="w-full h-fit flex flex-row flex-wrap justify-center xl:justify-between items-center gap-8">
          {listNews.map((newItem, index) => {
            return <NewsItem item={newItem} key={index}></NewsItem>
          })}
        </div>
      ) : (
        <Grid container gap={0} className="w-full h-fit">
          {listPromotion.map((promotionItem, index) => {
            return (
              <Grid item xs={12} mobile={6} md={4} lg={3} className="w-full mb-6">
                <PromotionItem item={promotionItem} key={index}></PromotionItem>
              </Grid>
            )
          })}
        </Grid>
      )}
      <div className="w-full h-fit justify-between items-center flex-wrap flex-row flex">
        <div className="w-fit h-fit flex flex-row items-center justify-center gap-4 text-sm not-italic font-normal leading-[normal] text-[#808080]">
          <span>{t('Showing')}</span>
          <Select labelId="demo-simple-select-label" IconComponent={KeyboardArrowDownIcon} value={showPerPage} onChange={handleChangeShowPerPage} className={classes.showPerPage}>
            {ITEMS_PER_PAGE.map((item, index) => {
              return (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              )
            })}
          </Select>
          <span>{t('items per page')}</span>
        </div>
        <AppPagination count={totalPage} page={currentPage} onChange={handleChangePage} />
      </div>
    </div>
  )
}
