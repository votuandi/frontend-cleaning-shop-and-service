/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import { transactionApi } from '@/utils/api'
import { Box, Button, Grid, InputAdornment, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './MyOrders.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import SortIcon from '@mui/icons-material/Sort'
import { IOrder, IProductGiftItem } from '@/utils/api/transaction'
import OnlineShopItem from '@/components/OnlineShopItem'
import AppSortPanel from '@/components/AppSortPanel'
import { FilterType, OrderFilterType, RedeemedCouponFilterType, ServiceTypeType, SortOderType, SortSettingsType, SortType } from '@/types/common'
import { isNumber } from 'lodash'
import AppFilterPanel from '@/components/AppFilterPanel'
import { SERVICE_TYPE } from '@/utils/constants/common.constant'
import { LEFT_MENU_ONLINE_SHOP } from '@/utils/constants/menu.constant'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import theme from '@/assets/theme'
import OrderItem from '@/components/OrderItem'
import NoResultDisplay from '@/components/NoResultDisplay'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

const ITEMS_PER_PAGE = [3, 6, 9, 12, 15]

export default function MyOrders() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const sortPanelRef = useRef(null)
  const filterPanelRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))
  const transStatusList = useSelector((state: RootState) => state.memberSetting.trans_status)

  const [orderList, setOrderList] = useState<IOrder[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(9)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [status, setStatus] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false)
  const [filterValue, setFilterValue] = useState<string>('')

  let handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  let handleCloseFilterPanel = () => {
    setShowFilterPanel(false)
  }

  let toggleShowFilterPanel = () => {
    setFilterValue(status)
    setShowFilterPanel((x) => !x)
  }

  useOnClickOutside(filterPanelRef, handleCloseFilterPanel)

  let handleChangeShowPerPage = (e: any) => {
    setShowPerPage(e.target.value)
    if (currentPage === 1) {
      getOrderList(e.target.value, 1)
    } else setCurrentPage(1)
  }

  let handleApplyFilter = (filter: FilterType | RedeemedCouponFilterType | ServiceTypeType | OrderFilterType) => {
    setStatus(filter as OrderFilterType)
  }

  let getOrderList = async (_limit: number, _page: number) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      // if (confirm("You haven't signed in. Go to log in now?")) {
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
          <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={`You haven't signed in. Go to log in now?`} />,
          document.getElementById('popup-root') // Replace 'popup-root' with your root element id
        )
      })
      if (confirmation) {
        gotoPage('/sign-in')
      } else {
        gotoPage('/')
      }
    } else
      try {
        let res = await transactionApi.getOrderList({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            limit: _limit,
            page: _page,
            status: status,
            keyword: keyword,
          },
        })
        if (res.data.status) {
          setOrderList(res.data.params.Data)
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

  let handleReset = () => {
    setFilterValue('')
    setStatus('')
  }

  let handleApply = () => {
    setStatus(filterValue)
  }

  let FetchData = async () => {
    await getOrderList(showPerPage, currentPage)
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
    getOrderList(showPerPage, currentPage)
  }, [currentPage])

  useEffect(() => {
    console.log(status)

    getOrderList(showPerPage, currentPage)
  }, [status, keyword])

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
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('My orders')}</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('My orders').toUpperCase()}</h1>
          </div>
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
                  <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', filter: 'drop-shadow(0px 4px 4px rgba(149, 157, 165, 0.3))' }}>
                    <img className="ml-auto mr-5" src="/icon/arrow-sort.svg" alt="" />
                    <div className="w-[300px] h-fit bg-white -mt-1 rounded-2xl flex flex-col">
                      <span className="text-base not-italic font-normal text-[#333] text-center px-6 py-3 mx-auto">
                        {t('Filter')} & {t('Sort')}
                      </span>
                      <span className="text-base not-italic font-normal text-[#333] bg-[#E6E6E6] px-6 py-3">{t('Status')}</span>
                      {Array.isArray(transStatusList) &&
                        transStatusList.map((item, index) => {
                          return (
                            <div className="w-full h-fit px-6 py-3 flex flex-row justify-between items-center text-base not-italic font-normal text-[#333]" key={index}>
                              <span className="cursor-pointer" onClick={() => setFilterValue(item.id)}>
                                {item.name}
                              </span>
                              {item.id === filterValue && <img src="/icon/check.svg" alt="" />}
                            </div>
                          )
                        })}
                      <div className="w-full h-fit px-6 py-3 gap-3 flex flex-row justify-between items-center border-t-[1px] solid border-[#E6E6E6]">
                        <button className="w-[120px] h-8 rounded-lg border-[1px] solid border-[#0596A6] text-[#0596A6] text-sm font-medium" onClick={handleReset}>
                          {t('Reset')}
                        </button>
                        <button className="w-[120px] h-8 rounded-lg border-[1px] solid bg-[#0596A6] text-white text-sm font-medium" onClick={handleApply}>
                          {t('Apply')}
                        </button>
                      </div>
                    </div>
                  </Box>
                </div>
              )}
            </div>
          </div>
        </div>

        <Box
          sx={{
            width: '100%',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
          }}
        >
          <div className="w-full h-fit flex flex-col gap-6 justify-center items-center">
            {Array.isArray(orderList) && orderList.length > 0 ? orderList.map((item, index) => <OrderItem item={item} key={index} />) : <NoResultDisplay />}
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
        </Box>
      </div>
      <div id="popup-root"></div>
    </>
  )
}
