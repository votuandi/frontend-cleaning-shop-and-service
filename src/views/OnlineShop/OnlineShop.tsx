/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import { transactionApi } from '@/utils/api'
import { Box, Button, Grid, InputAdornment, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './OnlineShop.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import SortIcon from '@mui/icons-material/Sort'
import { IProductGiftItem } from '@/utils/api/transaction'
import OnlineShopItem from '@/components/OnlineShopItem'
import AppSortPanel from '@/components/AppSortPanel'
import { FilterType, OrderFilterType, RedeemedCouponFilterType, ServiceTypeType, SortOderType, SortSettingsType, SortType } from '@/types/common'
import { isNumber } from 'lodash'
import AppFilterPanel from '@/components/AppFilterPanel'
import { SERVICE_TYPE } from '@/utils/constants/common.constant'
import { LEFT_MENU_ONLINE_SHOP } from '@/utils/constants/menu.constant'
import { capitalizeFirstLetterAllWords, gotoPage } from '@/utils/helpers/common'
import theme from '@/assets/theme'
import NoResultDisplay from '@/components/NoResultDisplay'

const ITEMS_PER_PAGE = [3, 6, 9, 12, 15]

export default function OnlineShop() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const sortPanelRef = useRef(null)
  const filterPanelRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))

  const [listProductGift, setListProductGift] = useState<IProductGiftItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(9)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [sortSettings, setSortSetting] = useState<SortSettingsType>({ sort: '', sortOrder: 'ASC' })
  const [type, setType] = useState<FilterType>('all')
  const [serviceType, setServiceType] = useState<ServiceTypeType>('')
  const [showSortPanel, setShowSortPanel] = useState<boolean>(false)
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')

  let handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  let handleCloseSortPanel = () => {
    setShowSortPanel(false)
  }

  let toggleShowSortPanel = () => {
    setShowSortPanel((x) => !x)
  }

  let handleCloseFilterPanel = () => {
    setShowFilterPanel(false)
  }

  let toggleShowFilterPanel = () => {
    setShowFilterPanel((x) => !x)
  }

  let handleClickServiceTypeBtn = (value: ServiceTypeType) => {
    console.log(value)

    setServiceType((x) => (x === value ? '' : value))
    setCurrentPage(1)
  }

  useOnClickOutside(sortPanelRef, handleCloseSortPanel)
  useOnClickOutside(filterPanelRef, handleCloseFilterPanel)

  let handleChangeShowPerPage = (e: any) => {
    setShowPerPage(e.target.value)
    if (currentPage === 1) {
      getListProductGift(e.target.value, 1)
    } else setCurrentPage(1)
  }

  let handleApplySort = (settings: SortSettingsType) => {
    setSortSetting(settings)
  }

  let handleApplyFilter = (filter: FilterType | RedeemedCouponFilterType | ServiceTypeType | OrderFilterType) => {
    setType(filter as FilterType)
  }

  let getListProductGift = async (_limit: number, _page: number) => {
    try {
      let res = await transactionApi.getListProductGift({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: _limit,
          page: _page,
          type: type,
          sort: sortSettings.sort,
          sort_direction: sortSettings.sortOrder,
          service_type: serviceType,
          keyword: keyword,
        },
      })
      if (res.data.status) {
        setListProductGift(res.data.params.Data)
        let resTotal = !isNaN(res.data.params.total_record) ? Number(res.data.params.total_record) : 0
        let resLimit = !isNaN(res.data.params.limit) ? Number(res.data.params.limit) : 0
        let _totalPage = resTotal <= resLimit ? 1 : resTotal % resLimit === 0 ? resTotal / resLimit : Math.floor(resTotal / resLimit) + 1

        setTotalPage(_totalPage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let handleSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      setKeyword(e.target.value)
    }
  }

  let FetchData = async () => {
    await getListProductGift(showPerPage, currentPage)
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
    getListProductGift(showPerPage, currentPage)
  }, [currentPage])

  useEffect(() => {
    getListProductGift(showPerPage, currentPage)
  }, [sortSettings, type, serviceType, keyword])

  useEffect(() => {
    if (router.query.filter === 'all' || 'gift' || 'product') {
      setType(router.query.filter as 'all' | 'gift' | 'product')
    }
  }, [])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6 relative">
      <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
        <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">ONLINE SHOP</h1>
      </div>
      <div className="w-full h-fit flex flex-row justify-between items-stretch gap-3">
        <TextField
          className={classes.searchBox}
          sx={{ borderRadius: 8, backgroundColor: '#fff', width: 500, color: '#1a1a1a' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#1a1a1a' }} />
              </InputAdornment>
            ),
          }}
          placeholder={`${t('Search')}...`}
          onKeyDown={handleSearchKeyDown}
        ></TextField>
        <div className="w-fit h-full flex flex-row justify-center items-center gap-3 relative">
          <div className="relative">
            <Button
              variant="outlined"
              className={classes.filterBtns}
              sx={{
                '& .MuiButton-startIcon': {
                  margin: isSmallScreen ? 0 : 'auto',
                },
              }}
              startIcon={<TuneIcon />}
              onClick={toggleShowFilterPanel}
            >
              {!isSmallScreen && t('Filter')}
            </Button>
            {showFilterPanel && (
              <div className="absolute top-full pt-2 right-0 z-50" ref={filterPanelRef}>
                <AppFilterPanel type="shop" value={type} onApplyFilter={handleApplyFilter} />
              </div>
            )}
          </div>
          <div className="relative">
            <div className="relative">
              <Button
                variant="outlined"
                className={classes.filterBtns}
                sx={{
                  '& .MuiButton-startIcon': {
                    margin: isSmallScreen ? 0 : 'auto',
                  },
                }}
                startIcon={<SortIcon />}
                onClick={toggleShowSortPanel}
              >
                {!isSmallScreen && t('Sort')}
              </Button>
              {showSortPanel && (
                <div className="absolute top-full pt-2 right-0 z-50" ref={sortPanelRef}>
                  <AppSortPanel settings={sortSettings} onApplySort={handleApplySort} type="service" />
                </div>
              )}
            </div>
            {showSortPanel && (
              <div className="absolute top-full pt-2 right-0 z-50" ref={sortPanelRef}>
                <AppSortPanel settings={sortSettings} onApplySort={handleApplySort} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex flex-row flex-wrap gap-4">
        {SERVICE_TYPE.map((item, index) => {
          return (
            <Button
              variant="contained"
              className={item.value === serviceType ? classes.typeFilterSelectedBtn : classes.typeFilterBtn}
              key={index}
              onClick={() => handleClickServiceTypeBtn(item.value as ServiceTypeType)}
            >
              {capitalizeFirstLetterAllWords(t(item.name))}
            </Button>
          )
        })}
      </div>
      <Box
        sx={{
          width: isSmallScreen ? '100vw' : '100%',
          height: 'fit-content',
          backgroundColor: '#FBFBFB',
          margin: isSmallScreen ? '0 -24px' : '0',
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'start',
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            padding: isSmallScreen ? '16px' : '30px 0 30px 20px',
            width: isSmallScreen ? '100%' : '260px',
            flexShrink: 0,
          }}
        >
          <div className="w-full h-fit flex flex-col bg-white">
            {LEFT_MENU_ONLINE_SHOP.map((item, index) => {
              return (
                <div className="w-full h-fit px-6 py-[18px] flex flex-row gap-4 cursor-pointer items-center" key={index} onClick={() => gotoPage(item.path)}>
                  <img className="w-[60px] h-7" src={item.image} alt="" />
                  <span className="text-base not-italic font-medium leading-[normal] text-[#333]">{capitalizeFirstLetterAllWords(t(item.title))}</span>
                </div>
              )
            })}
          </div>
        </Box>
        <Box sx={{ padding: isSmallScreen ? '16px' : '30px', width: '100%' }}>
          <div className="w-full h-fit flex flex-row flex-wrap gap-[1rem] justify-center items-center">
            {Array.isArray(listProductGift) && listProductGift.length > 0 ? (
              <Grid container sx={{ width: '100%' }}>
                {listProductGift?.map((item, index) => {
                  return (
                    <Grid item xs={12} mobile={6} md={4} lg={3} key={index} sx={{ padding: '4px' }}>
                      <OnlineShopItem item={item} />
                    </Grid>
                  )
                })}
              </Grid>
            ) : (
              <NoResultDisplay />
            )}
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
      </Box>
    </div>
  )
}