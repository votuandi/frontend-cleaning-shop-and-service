/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import Slider from 'react-slick'
import { IGetAccountBannerResponse } from '@/utils/api/setting'
import { newsApi, promotionApi, serviceApi, settingApi } from '@/utils/api'
import useStyles from './Home.style'
import { capitalizeFirstLetterAllWords, gotoPage } from '@/utils/helpers/common'
import { INewsItem } from '@/utils/api/news'
import NewsItem from '@/components/NewsItem'
import { Box, Grid, useMediaQuery } from '@mui/material'
import PromotionItem from '@/components/PromotionItem'
import { IPromotionItem } from '@/utils/api/promotion'
import { IServiceItem } from '@/utils/api/service'
import ServiceItem from '@/components/ServiceItem'
import theme from '@/assets/theme'

const SLICK_SETTINGS = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
}

const TAB_TITLES = ['news', 'promotion']

export default function Home() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(640))

  const [banners, setBanners] = useState<IGetAccountBannerResponse>([])
  const [listNews, setListNews] = useState<INewsItem[]>([])
  const [listPromotion, setListPromotion] = useState<IPromotionItem[]>([])
  const [listService, setListService] = useState<IServiceItem[]>([])
  const [currentTab, setCurrentTab] = useState<number>(0)

  let getBanners = async () => {
    try {
      let res = await settingApi.getAccountBanner({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          type: 'homepage',
        },
      })
      if (res.status) {
        setBanners(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getListNews = async () => {
    try {
      let res = await newsApi.getListNews({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: 4,
          page: 1,
        },
      })
      if (res.data.status) {
        setListNews(res.data.params.News)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getListPromotion = async () => {
    try {
      let res = await promotionApi.getList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: 4,
          page: 1,
        },
      })
      if (res.data.status) {
        setListPromotion(res.data.params.Gift)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getListService = async () => {
    try {
      let res = await serviceApi.getList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: 4,
          page: 1,
        },
      })
      if (res.data.status) {
        setListService(res.data.params.Service)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async () => {
    await getBanners()
    await getListNews()
    await getListPromotion()
    await getListService()
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
    <div className="w-full h-fit flex flex-col">
      <div className={`w-full ${isSmallScreen ? 'h-screen' : 'h-[489px]'}`}>
        <Slider {...SLICK_SETTINGS} className={classes.slider}>
          {banners.map((banner, index) => {
            // return <img className={`w-full ${isSmallScreen ? 'h-screen' : 'h-full'}`} src={banner?.image ?? ''} alt="" />
            return (
              <Box
                sx={{
                  width: '100%',
                  height: isSmallScreen ? '100vh' : '489px',
                  backgroundImage: `url('${banner.image}')`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              ></Box>
            )
          })}
        </Slider>
      </div>
      <div className={classes.mainContent}>
        <div className="w-full h-fit flex flex-col gap-8">
          <div className="w-full h-fit flex flex-row justify-between items-center">
            <h3 className="text-[28px] not-italic font-semibold leading-[normal] text-[#1a1a1a]">{capitalizeFirstLetterAllWords(t('news & promotions'))}</h3>
            <span className="text-base not-italic font-normal leading-[normal] text-[#0596A6] cursor-pointer" onClick={() => gotoPage('/news', `&tab=${currentTab.toString()}`)}>
              {capitalizeFirstLetterAllWords(t('view all'))}
            </span>
          </div>
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
                  {capitalizeFirstLetterAllWords(t(tab))}
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
            <div className="w-full h-fit">
              <Grid container gap={0} className="w-full h-fit">
                {listPromotion.map((promotionItem, index) => {
                  return (
                    <Grid item xs={12} mobile={6} md={4} lg={3} className={`w-full ${isSmallScreen ? 'p-1' : 'py-3'}`}>
                      <PromotionItem item={promotionItem} key={index}></PromotionItem>
                    </Grid>
                  )
                })}
              </Grid>
            </div>
          )}
        </div>
        <div className="w-full h-fit flex flex-col gap-8">
          <div className="w-full h-fit flex flex-row justify-between items-center">
            <h3 className="text-[28px] not-italic font-semibold leading-[normal] text-[#1a1a1a]">{t('all services')}</h3>
            <span className="text-base not-italic font-normal leading-[normal] text-[#0596A6] cursor-pointer" onClick={() => gotoPage('/service')}>
              View all
            </span>
          </div>
          <div className="w-full h-fit flex flex-row flex-wrap justify-center xl:justify-between items-center gap-8">
            <div className="w-full h-fit">
              <Grid container gap={0} className="w-full h-fit">
                {listService.map((serviceItem, index) => {
                  return (
                    <Grid item xs={12} mobile={6} md={4} lg={3} className={`w-full ${isSmallScreen ? 'p-1' : 'py-3'}`}>
                      <ServiceItem item={serviceItem} key={index}></ServiceItem>
                    </Grid>
                  )
                })}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
