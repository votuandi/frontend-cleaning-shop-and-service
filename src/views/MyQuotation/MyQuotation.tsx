/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import { transactionApi } from '@/utils/api'
import { Box, Button, Grid, InputAdornment, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './MyQuotation.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import { IQuotationItem } from '@/utils/api/transaction'
import AppFilterPanel from '@/components/AppFilterPanel'
import { FilterType, OrderFilterType, RedeemedCouponFilterType, ServiceTypeType, SortOderType, SortSettingsType, SortType } from '@/types/common'
import { capitalize, isNumber } from 'lodash'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import QuotationItem from '@/components/QuotationItem'
import NoResultDisplay from '@/components/NoResultDisplay'
import theme from '@/assets/theme'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

const ITEMS_PER_PAGE = [3, 6, 9, 12, 15]
const TAB_TITLES: ('waiting_response' | 'replied')[] = ['waiting_response', 'replied']

export default function MyQuotation() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const filterPanelRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))

  const [quotationList, setQuotationList] = useState<IQuotationItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(9)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [type, setType] = useState<FilterType>('all')
  const [serviceType, setServiceType] = useState<ServiceTypeType>('')
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')

  const [currentTab, setCurrentTab] = useState<number>(0)

  let handleChangeTab = (index: number) => {
    setCurrentTab(index)
    if (currentPage === 1) {
      getQuotationList(showPerPage, 1, TAB_TITLES[index])
    } else setCurrentPage(1)
  }

  let handleSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      setKeyword(e.target.value)
    }
  }

  let handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  let handleCloseFilterPanel = () => {
    setShowFilterPanel(false)
  }

  let toggleShowFilterPanel = () => {
    setShowFilterPanel((x) => !x)
  }

  let handleClickServiceTypeBtn = (value: ServiceTypeType) => {
    setServiceType((x) => (x === value ? '' : value))
  }

  useOnClickOutside(filterPanelRef, handleCloseFilterPanel)

  let handleChangeShowPerPage = (e: any) => {
    setShowPerPage(e.target.value)
    if (currentPage === 1) {
      getQuotationList(e.target.value, 1)
    } else setCurrentPage(1)
  }

  let handleApplyFilter = (settings: FilterType | RedeemedCouponFilterType | ServiceTypeType | OrderFilterType) => {
    setServiceType(settings as ServiceTypeType)
  }

  let getQuotationList = async (_limit: number, _page: number, _type?: 'waiting_response' | 'replied') => {
    _type = _type ?? TAB_TITLES[currentTab]
    try {
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
        } else gotoPage('/')
      } else {
        let res = await transactionApi.getQuotationList({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            type: _type,
            limit: _limit,
            page: _page,
            keyword: keyword,
            service_type: serviceType,
          },
        })
        if (res.data.status) {
          setQuotationList(res.data.params.Quotation ?? [])
          console.log(res.data.params)

          let resTotal = !isNaN(res.data.params.total_record) ? Number(res.data.params.total_record) : 0
          let resLimit = !isNaN(res.data.params.limit) ? Number(res.data.params.limit) : 0
          let _totalPage = resTotal <= resLimit ? 1 : resTotal % resLimit === 0 ? resTotal / resLimit : Math.floor(resTotal / resLimit) + 1

          setTotalPage(_totalPage)
        } else {
          console.log(res)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async () => {
    await getQuotationList(showPerPage, currentPage)
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
    getQuotationList(showPerPage, currentPage)
  }, [currentPage])

  useEffect(() => {
    getQuotationList(showPerPage, currentPage)
  }, [type, serviceType, keyword])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <>
      <div className={`w-full h-fit flex flex-col justify-start items-start gap-8 ${isSmallScreen ? 'px-4 py-6' : 'py-10 px-6'}`}>
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-row flex-wrap gap-1">
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
              {capitalizeFirstLetter(t('member center'))}
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('My quotation')}</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('My quotation').toUpperCase()}</h1>
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
              <Button variant="outlined" className={classes.filterBtns} startIcon={<TuneIcon />} onClick={toggleShowFilterPanel}>
                {t('Filter')}
                {serviceType !== '' && <img src="/icon/ic-reddoc.svg" alt="" />}
              </Button>
              {showFilterPanel && (
                <div className="absolute top-full pt-2 right-0 z-50" ref={filterPanelRef}>
                  <AppFilterPanel type="quotation" value={serviceType} onApplyFilter={handleApplyFilter} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row flex-wrap gap-4">
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
                  {t(capitalize(tab.replace('_', ' ')))}
                </button>
              )
            })}
          </div>
        </div>
        <div className="w-full h-fit">
          <Box
            sx={{
              width: '100%',
              gap: '40px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="w-full h-fit flex flex-col flex-wrap gap-4 justify-center items-center">
              {Array.isArray(quotationList) && quotationList.length > 0 ? (
                quotationList?.map((item, index) => {
                  return <QuotationItem key={index} item={item} type={capitalize(TAB_TITLES[currentTab].replace('_', ' '))} />
                })
              ) : (
                <NoResultDisplay />
              )}
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
      </div>
      <div id="popup-root"></div>
    </>
  )
}
