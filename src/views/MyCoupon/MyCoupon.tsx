/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import { Button, Grid, InputAdornment, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './MyCoupon.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import AppSortPanel from '@/components/AppSortPanel'
import { FilterType, RedeemedCouponFilterType, ServiceTypeType, SortOderType, SortSettingsType, SortType } from '@/types/common'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import couponApi from '@/utils/api/coupon/coupon.api'
import { ICouponItem, IRedeemedCoupon } from '@/utils/api/coupon'
import CouponItem from '@/components/CouponItem'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import RedeemedCouponItem from '@/components/RedeemedCouponItem'
import SortIcon from '@mui/icons-material/Sort'
import theme from '@/assets/theme'
import AppFilterPanel from '@/components/AppFilterPanel'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

const ITEMS_PER_PAGE = [4, 6, 8, 10, 12]

export default function MyCoupon() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const sortPanelRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))
  const isSmallItem = useMediaQuery(theme.breakpoints.down(600))

  const [listRedeemedCoupon, setListRedeemedCoupon] = useState<IRedeemedCoupon[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(6)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [filterSettings, setFilterSetting] = useState<RedeemedCouponFilterType>('all')
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [sortSettings, setSortSetting] = useState<SortSettingsType>({ sort: '', sortOrder: 'ASC' })
  const [showSortPanel, setShowSortPanel] = useState<boolean>(false)

  let handleSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      setKeyword(e.target.value)
    }
  }

  let handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  let handleCloseSortPanel = () => {
    setShowSortPanel(false)
  }

  let toggleShowSortPanel = () => {
    setShowSortPanel((x) => !x)
  }

  useOnClickOutside(sortPanelRef, handleCloseSortPanel)

  let handleChangeShowPerPage = (e: any) => {
    setShowPerPage(e.target.value)
    if (currentPage === 1) {
      getListRedeemedCoupons(e.target.value, 1)
    } else setCurrentPage(1)
  }

  let handleApplyFilter = (settings: RedeemedCouponFilterType) => {
    setFilterSetting(settings as RedeemedCouponFilterType)
  }

  let getListRedeemedCoupons = async (_limit: number, _page: number) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : undefined
    if (!accessToken) {
      // if (confirm("You haven't signed in yet.\nWould you like to log in for redeem this coupon?")) {
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
          <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={`You haven't signed in yet.\nWould you like to log in?`} />,
          document.getElementById('popup-root') // Replace 'popup-root' with your root element id
        )
      })
      if (confirmation) {
        gotoPage('/sign-in')
      } else {
        gotoPage('/')
      }
    } else {
      try {
        let res = await couponApi.getRedeemedCoupons({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            limit: _limit,
            page: _page,
            type: filterSettings,
            keyword: keyword,
            token: accessToken,
          },
        })
        if (res.data.status) {
          setListRedeemedCoupon(res.data.params?.coupon)
          let resTotal = !isNaN(res.data.params.total_record) ? Number(res.data.params.total_record) : 0
          let resLimit = !isNaN(res.data.params.limit) ? Number(res.data.params.limit) : 0
          let _totalPage = resTotal <= resLimit ? 1 : resTotal % resLimit === 0 ? resTotal / resLimit : Math.floor(resTotal / resLimit) + 1

          setTotalPage(_totalPage)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  let FetchData = async () => {
    await getListRedeemedCoupons(showPerPage, currentPage)
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
    getListRedeemedCoupons(showPerPage, currentPage)
  }, [currentPage])

  useEffect(() => {
    getListRedeemedCoupons(showPerPage, currentPage)
  }, [filterSettings, keyword])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <>
      <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-row flex-wrap gap-1">
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
              {capitalizeFirstLetter(t('member center'))}
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('My coupon')}</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('My coupon').toUpperCase()}</h1>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row justify-between items-stretch gap-3">
          <TextField
            sx={{ borderRadius: 8, backgroundColor: '#fff', width: 500, color: '#1a1a1a' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1a1a1a' }} />
                </InputAdornment>
              ),
            }}
            placeholder={`${t('Search')}...`}
            className={classes.customTextField}
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
                startIcon={<SortIcon />}
                onClick={toggleShowSortPanel}
              >
                {!isSmallScreen && t('Filter')}
              </Button>
              {showSortPanel && (
                <div className="absolute top-full pt-2 right-0 z-50" ref={sortPanelRef}>
                  <AppFilterPanel type="coupon" value={filterSettings} onApplyFilter={handleApplyFilter} />
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#0596A6',
                  '& .MuiButton-startIcon': {
                    margin: isSmallScreen ? 0 : 'auto',
                  },
                }}
                className={classes.couponBtns}
                startIcon={<ConfirmationNumberOutlinedIcon />}
                onClick={() => gotoPage('/redemption-center')}
              >
                {!isSmallScreen && <span>{capitalizeFirstLetter(t('redemption center'))}</span>}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full h0-fit bg-white">
          <div className="w-full h-fit flex flex-row flex-wrap gap-[1rem] justify-center md:justify-between items-center">
            {listRedeemedCoupon?.map((item, index) => {
              return (
                <div className={`${isSmallItem ? 'w-full' : 'w-full max-w-[560px]'} mx-auto md:mx-left`} key={index}>
                  <RedeemedCouponItem item={item} />
                </div>
              )
            })}
            {listRedeemedCoupon.length % 2 === 1 && <div className={`w-full ${isSmallScreen ? ' h-0' : 'max-w-[560px] h-[120px]'} mx-auto`}></div>}
          </div>
          <div className="w-full h-fit justify-between items-center flex-wrap flex-row flex mt-8 gap-4">
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
        </div>
      </div>
      <div id="popup-root"></div>
    </>
  )
}
