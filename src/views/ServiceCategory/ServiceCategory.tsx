/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import { serviceApi, transactionApi } from '@/utils/api'
import { Box, Button, Grid, InputAdornment, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './ServiceCategory.style'
import { LEFT_MENU_ALL_SERVICE, LEFT_MENU_SERVICE_CATEGORY } from '@/utils/constants/menu.constant'
import { IServiceItem } from '@/utils/api/service'
import Slider from 'react-slick'
import parse from 'html-react-parser'
import theme from '@/assets/theme'
import { gotoPage } from '@/utils/helpers/common'
import ServiceItem from '@/components/ServiceItem'
import NoResultDisplay from '@/components/NoResultDisplay'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'

type Query = {
  slug: string
}

const ITEMS_PER_PAGE = [6, 9, 12, 15]

const SLIDER_SETTINGS = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
}

export default function ServiceCategory() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const router = useRouter()
  const query = router.query as unknown as Query
  const sliderRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(900))

  const [serviceCategoryList, setServiceCategoryList] = useState<IServiceItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [serviceList, setServiceList] = useState<IServiceItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(9)
  const [totalPage, setTotalPage] = useState<number>(1)

  let handleChangeShowPerPage = (e: any) => {
    setShowPerPage(e.target.value)
    if (currentPage === 1) {
      getListService(e.target.value, 1)
    } else setCurrentPage(1)
  }

  let getListService = async (_limit: number, _page: number) => {
    try {
      let res = await serviceApi.getList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: _limit,
          page: _page,
          category_id: selectedCategory,
        },
      })
      if (res.data.status) {
        setServiceList(res.data.params.Service)
        let resTotal = !isNaN(res.data.params.total_record) ? Number(res.data.params.total_record) : 0
        let resLimit = !isNaN(res.data.params.limit) ? Number(res.data.params.limit) : 0
        let _totalPage = resTotal <= resLimit ? 1 : resTotal % resLimit === 0 ? resTotal / resLimit : Math.floor(resTotal / resLimit) + 1

        setTotalPage(_totalPage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getServiceListCategory = async () => {
    try {
      let res = await serviceApi.getList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          service_type: query.slug.replaceAll('-', '_') as 'car_cleaning' | 'commerce_cleaning' | 'home_cleaning' | '',
        },
      })
      if (res.data.status) {
        setServiceCategoryList(Array.isArray(res.data.params.Service) ? res.data.params.Service : [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  let handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  let FetchData = async () => {
    await getServiceListCategory()
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
    getListService(showPerPage, currentPage)
  }, [selectedCategory])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return isSmallScreen ? (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10">
      <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid mx-4">
        <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t(query.slug.replaceAll('-', ' ')).toUpperCase()}</h1>
      </div>
      <div className="w-full h-fit px-4 py-5 gap-[18px] flex flex-col bg-[#FBFBFB]">
        <div className="w-full h-fit flex flex-col bg-white">
          {serviceCategoryList.map((item, index) => {
            return (
              <div className="w-full h-fit px-6 py-[18px] flex flex-row gap-4 cursor-pointer items-center" key={index} onClick={() => setSelectedCategory(item.id)}>
                <img className="w-[60px] h-7" src={item?.thumbnail_image} alt="" />
                <span className="text-base not-italic font-medium leading-[normal] text-[#333]">{item?.category_name}</span>
              </div>
            )
          })}
          <div className="w-full h-fit px-6 py-[18px] flex flex-row gap-4 cursor-pointer items-center" onClick={() => gotoPage('/redemption-center')}>
            <img className="w-[60px] h-7" src="/img/ic-coupon.png" alt="" />
            <span className="text-base not-italic font-medium leading-[normal] text-[#333]">{t('Coupon')}</span>
          </div>
        </div>
        {selectedCategory ? (
          <Box sx={{ width: '100%' }}>
            <div className="w-full h-fit flex flex-row flex-wrap gap-[1rem] justify-center items-center">
              <Grid container sx={{ width: '100%' }}>
                {Array.isArray(serviceList) && serviceList.length > 0 ? (
                  serviceList?.map((item, index) => {
                    return (
                      <Grid item xs={6} key={index} sx={{ padding: '4px' }}>
                        <ServiceItem item={item} />
                      </Grid>
                    )
                  })
                ) : (
                  <NoResultDisplay />
                )}
              </Grid>
            </div>
            <div className="w-full h-fit justify-between items-center flex-wrap flex-row flex mt-8">
              <div className="w-fit h-fit flex flex-row items-center justify-center gap-4 text-sm not-italic font-normal leading-[normal] text-[#808080]">
                {!isSmallScreen && <span>{t('Showing')}</span>}
                <Select
                  labelId="demo-simple-select-label"
                  IconComponent={KeyboardArrowDownIcon}
                  value={showPerPage}
                  onChange={handleChangeShowPerPage}
                  className={classes.showPerPage}
                  sx={{ bgcolor: '#fff' }}
                >
                  {ITEMS_PER_PAGE.map((item, index) => {
                    return (
                      <MenuItem value={item} key={index}>
                        {isSmallScreen ? `${item} items` : item}
                      </MenuItem>
                    )
                  })}
                </Select>
                {!isSmallScreen && <span>{t('items per page')}</span>}
              </div>
              <AppPagination count={totalPage} page={currentPage} onChange={handleChangePage} />
            </div>
          </Box>
        ) : (
          <>
            <img className="w-full h-auto" src={`/img/${query.slug}-1.png`} alt="" />
            <div className="w-full relative">
              <Slider {...SLIDER_SETTINGS} ref={sliderRef}>
                {serviceCategoryList.map((item, index) => {
                  return (
                    <div className="w-full flex flex-col" key={index}>
                      <div className="w-full flex justify-center items-center">
                        <span className="text-black text-xl font-bold mx-auto text-center">{item?.ServiceLanguage?.title}</span>
                      </div>
                      <div className="mt-5 text-[#666] font-normal text-base text-5-line">{parse(item?.ServiceLanguage?.description)}</div>
                      {/* <button
                    className="mt-6 w-fit h-fit flex flex-row justify-center items-center gap-3 px-6 text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white"
                    // onClick={}
                  >
                    Get a quotation
                    <img className="w-8 h-8" src="/icon/CaretCircleRight.svg" alt="" />
                  </button> */}
                    </div>
                  )
                })}
              </Slider>
              <img className="absolute left-0 top-0 z-10 w-9 h-9 cursor-pointer" src="/icon/ic-circle-left.png" alt="" onClick={() => (sliderRef.current as any).slickPrev()} />
              <img className="absolute right-0 top-0 z-10 w-9 h-9 cursor-pointer" src="/icon/ic-circle-right.png" alt="" onClick={() => (sliderRef.current as any).slickNext()} />
            </div>
            <img className="w-full h-auto mt-10" src={`/img/${query.slug}-2.png`} alt="" />
            <img className="w-full h-auto" src={`/img/${query.slug}-3.png`} alt="" />
            <img className="w-full h-auto" src={`/img/${query.slug}-4.png`} alt="" />
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
      <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
        <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t(query.slug.replaceAll('-', ' ')).toUpperCase()}</h1>
      </div>

      <div className="w-full h0-fit bg-[#FBFBFB]">
        <div className="w-full h-fit flex flex-row justify-start items-start">
          <div className={classes.leftContain}>
            <div className="w-full h-fit flex flex-col bg-white">
              {serviceCategoryList.map((item, index) => {
                return (
                  <div className="w-full h-fit px-6 py-[18px] flex flex-row gap-4 cursor-pointer items-center" key={index} onClick={() => setSelectedCategory(item.id)}>
                    <img className="w-[60px] h-7" src={item?.thumbnail_image} alt="" />
                    <span className="text-base not-italic font-medium leading-[normal] text-[#333]">{item?.category_name}</span>
                  </div>
                )
              })}
              <div className="w-full h-fit px-6 py-[18px] flex flex-row gap-4 cursor-pointer items-center" onClick={() => gotoPage('/redemption-center')}>
                <img className="w-[60px] h-7" src="/img/ic-coupon.png" alt="" />
                <span className="text-base not-italic font-medium leading-[normal] text-[#333]">{t('Coupon')}</span>
              </div>
            </div>
          </div>
          <div className={classes.rightContain}>
            {selectedCategory ? (
              <Box sx={{ width: '100%' }}>
                <div className="w-full h-fit flex flex-row flex-wrap gap-[1rem] justify-center items-center">
                  <Grid container sx={{ width: '100%' }}>
                    {Array.isArray(serviceList) && serviceList.length > 0 ? (
                      serviceList?.map((item, index) => {
                        return (
                          <Grid item xs={12} md={6} lg={4} key={index} sx={{ padding: '4px' }}>
                            <ServiceItem item={item} />
                          </Grid>
                        )
                      })
                    ) : (
                      <NoResultDisplay />
                    )}
                  </Grid>
                </div>
                <div className="w-full h-fit justify-between items-center flex-wrap flex-row flex mt-8">
                  <div className="w-fit h-fit flex flex-row items-center justify-center gap-4 text-sm not-italic font-normal leading-[normal] text-[#808080]">
                    {!isSmallScreen && <span>{t('Showing')}</span>}
                    <Select
                      labelId="demo-simple-select-label"
                      IconComponent={KeyboardArrowDownIcon}
                      value={showPerPage}
                      onChange={handleChangeShowPerPage}
                      className={classes.showPerPage}
                      sx={{ bgcolor: '#fff' }}
                    >
                      {ITEMS_PER_PAGE.map((item, index) => {
                        return (
                          <MenuItem value={item} key={index}>
                            {isSmallScreen ? `${item} items` : item}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {!isSmallScreen && <span>{t('items per page')}</span>}
                  </div>
                  <AppPagination count={totalPage} page={currentPage} onChange={handleChangePage} />
                </div>
              </Box>
            ) : (
              <div className="w-full h-fit flex flex-col justify-normal items-center bg-white">
                <img className="w-full h-auto" src={`/img/${query.slug}-1.png`} alt="" />
                <Grid container sx={{ width: '100%' }} spacing="50px">
                  <Grid
                    item
                    xs={6}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                      fontSize: 32,
                      fontWeight: 700,
                      gap: '8px',
                      marginTop: '60px',
                    }}
                  >
                    <span className="text-[#262524]">Best</span>
                    <span className="text-[#0596A6]">car</span>
                    <span className="text-[#262524]">wash service</span>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="max-w-[400px] -mt-12 relative">
                      <Slider {...SLIDER_SETTINGS} ref={sliderRef}>
                        {serviceCategoryList.map((item, index) => {
                          return (
                            <div className="w-full flex flex-col" key={index}>
                              <div className="w-full flex justify-center items-center">
                                <span className="text-black text-xl font-bold mx-auto text-center">{item?.ServiceLanguage?.title}</span>
                              </div>
                              <div className="mt-5 text-[#666] font-normal text-base text-5-line">{parse(item?.ServiceLanguage?.description)}</div>
                              {/* <button
                              className="mt-6 w-fit h-fit flex flex-row justify-center items-center gap-3 px-6 text-center py-[10px] rounded-lg bg-[#0596A6] text-base not-italic font-medium leading-[normal] text-white"
                              // onClick={}
                            >
                              Get a quotation
                              <img className="w-8 h-8" src="/icon/CaretCircleRight.svg" alt="" />
                            </button> */}
                            </div>
                          )
                        })}
                      </Slider>
                      <img
                        className="absolute left-0 top-0 z-10 w-9 h-9 cursor-pointer"
                        src="/icon/ic-circle-left.png"
                        alt=""
                        onClick={() => (sliderRef.current as any).slickPrev()}
                      />
                      <img
                        className="absolute right-0 top-0 z-10 w-9 h-9 cursor-pointer"
                        src="/icon/ic-circle-right.png"
                        alt=""
                        onClick={() => (sliderRef.current as any).slickNext()}
                      />
                    </div>
                  </Grid>
                </Grid>
                <img className="w-full h-auto mt-10" src={`/img/${query.slug}-2.png`} alt="" />
                <div className="w-full flex flex-row flex-wrap justify-around mt-5">
                  <img className="w-[40%] h-auto" src={`/img/${query.slug}-3.png`} alt="" />
                  <img className="w-[40%] h-auto" src={`/img/${query.slug}-4.png`} alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
