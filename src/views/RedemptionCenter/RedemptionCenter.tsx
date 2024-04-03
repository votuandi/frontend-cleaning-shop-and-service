/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import { Button, Grid, IconButton, InputAdornment, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './RedemptionCenter.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import AppSortPanel from '@/components/AppSortPanel'
import { CouponSortType, SortSettingsType } from '@/types/common'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import couponApi from '@/utils/api/coupon/coupon.api'
import { ICouponItem } from '@/utils/api/coupon'
import CouponItem from '@/components/CouponItem'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import theme from '@/assets/theme'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

const ITEMS_PER_PAGE = [4, 6, 8, 10, 12]

export default function RedemptionCenter() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const sortPanelRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))
  const isSmallItem = useMediaQuery(theme.breakpoints.down(600))
  const dispatch = useDispatch()

  const [listCoupon, setListCoupon] = useState<ICouponItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showPerPage, setShowPerPage] = useState<number>(6)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [sortSettings, setSortSetting] = useState<SortSettingsType>({ sort: '', sortOrder: 'ASC' })
  const [showSortPanel, setShowSortPanel] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [showRedeemPopup, setShowRedeemPopup] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [selectCoupon, setSelectedCoupon] = useState<ICouponItem>()
  const [selectedAmount, setSelectedAmount] = useState<number>(1)

  let handleRedeem = (id: string | number) => {
    let selected = listCoupon.find((x) => x.id === id)
    if (selected) {
      setSelectedCoupon(selected)
      setShowRedeemPopup(true)
    }
  }

  let handleClickPopup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  let handleConfirmRedeem = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
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
            <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={`You haven't signed in. Go to log in now?`} />,
            document.getElementById('popup-root') // Replace 'popup-root' with your root element id
          )
        })
        if (confirmation) {
          gotoPage('/sign-in')
        } else {
          setShowRedeemPopup(false)
          return
        }
      } else {
        if (!selectCoupon?.id) return
        let res = await couponApi.redeem({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            coupon_id: selectCoupon?.id,
            redeemed_qty: selectedAmount,
          },
        })
        if (res.data.status) {
          setShowRedeemPopup(false)
          setShowSuccess(true)
          setSelectedAmount(0)
        } else {
          dispatch(setAlertMessageState(`${t('Redeeming coupon failed.')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
          setShowRedeemPopup(false)
        }
      }
    } catch (error) {
      console.log(error)
      dispatch(setAlertMessageState(t('Error when redeeming coupon')))
      setShowRedeemPopup(false)
    }
  }

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
      getListCoupon(e.target.value, 1)
    } else setCurrentPage(1)
  }

  let handleApplySort = (settings: SortSettingsType) => {
    setSortSetting(settings as SortSettingsType)
  }

  let getListCoupon = async (_limit: number, _page: number) => {
    try {
      let res = await couponApi.getList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          limit: _limit,
          page: _page,
          sort: sortSettings.sort as CouponSortType,
          sort_direction: sortSettings.sortOrder,
          keyword: keyword,
        },
      })
      if (res.data.status) {
        setListCoupon(res.data.params.Coupon)
        let resTotal = !isNaN(res.data.params.total_record) ? Number(res.data.params.total_record) : 0
        let resLimit = !isNaN(res.data.params.limit) ? Number(res.data.params.limit) : 0
        let _totalPage = resTotal <= resLimit ? 1 : resTotal % resLimit === 0 ? resTotal / resLimit : Math.floor(resTotal / resLimit) + 1

        setTotalPage(_totalPage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async () => {
    await getListCoupon(showPerPage, currentPage)
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
    getListCoupon(showPerPage, currentPage)
  }, [currentPage])

  useEffect(() => {
    getListCoupon(showPerPage, currentPage)
  }, [sortSettings, keyword])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <>
      <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6 relative">
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('redemption center').toUpperCase()}</h1>
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
                {!isSmallScreen && t('Sort')}
              </Button>
              {showSortPanel && (
                <div className="absolute top-full pt-2 right-0 z-50" ref={sortPanelRef}>
                  <AppSortPanel type="coupon" settings={sortSettings} onApplySort={handleApplySort} />
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
                onClick={() => gotoPage('/member-center/my-coupon')}
              >
                {!isSmallScreen && <span>{t('My coupon')}</span>}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full h0-fit bg-white">
          <div className="w-full h-fit flex flex-row flex-wrap gap-[1rem] justify-center md:justify-between items-center">
            {listCoupon?.map((item, index) => {
              return (
                <div className={`${isSmallItem ? 'w-full' : 'w-full max-w-[560px]'} mx-auto md:mx-left`} key={index}>
                  <CouponItem item={item} onRedeem={handleRedeem} />
                </div>
              )
            })}
            {listCoupon.length % 2 === 1 && <div className={`w-full ${isSmallScreen ? ' h-0' : 'max-w-[560px] h-[120px]'} mx-auto`}></div>}
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
        </div>
        {showRedeemPopup && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-[#021f3195] flex justify-center items-center z-50" onClick={() => setShowRedeemPopup(false)}>
            <div
              className="w-[90vw] max-w-[530px] h-fit max-h-[90vh] bg-white rounded-2xl p-16 flex flex-col justify-center items-center gap-10 text-center"
              onClick={handleClickPopup}
            >
              <div className="w-full h-fit flex flex-col justify-center items-center gap-3">
                <span className="text-[#0596A6] text-2xl font-semibold">{t('Redeem')}</span>
                <span className="text-[#666] text-base font-normal">{t('You can exchange your points for coupons by choosing the number of coupons you want')}</span>
              </div>
              <div className="w-full h-fit flex flex-col justify-center items-center gap-6">
                <div className="w-full h-fit flex flex-col justify-center items-center gap-4">
                  <span className="text-[#999] text-base font-medium">{t('Total points')}</span>
                  <span className="text-[#0596A6] text-[40px] font-bold">{(selectCoupon?.consume ? Number(selectCoupon?.consume) : 0) * selectedAmount}</span>
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-center gap-3">
                  <span className="text-[#999] text-base font-medium">{t('Coupon')}</span>
                  <TextField
                    className={classes.pickAmountTextField}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <IconButton onClick={() => setSelectedAmount((x) => (x === 0 ? 0 : x - 1))}>
                          <RemoveIcon />
                        </IconButton>
                      ),
                      endAdornment: (
                        <IconButton onClick={() => setSelectedAmount((x) => x + 1)}>
                          <AddIcon />
                        </IconButton>
                      ),
                    }}
                    value={selectedAmount}
                    // onChange={(e: any) => setAmountRedeem(e.target.value)}
                  ></TextField>
                </div>
                <button
                  className={`w-fit h-fit px-12 mx-auto text-center py-[10px] rounded-lg text-base not-italic font-medium leading-[normal] text-white ${
                    selectedAmount === 0 ? 'bg-[#a9a5a5]' : 'bg-[#0596A6]'
                  }`}
                  onClick={handleConfirmRedeem}
                  disabled={selectedAmount === 0}
                >
                  {t('Confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccess && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-[#021f3195] flex justify-center items-center">
            <div className="w-fit max-w-[90vw] h-fit max-h-[90vh] bg-white rounded-2xl p-16 flex flex-col justify-center items-center gap-6 text-center relative">
              <img className="w-8 h-8" src="/icon/success.png" alt="" />
              <span className="text-[#16B364] text-lg font-medium">Redeem successfully</span>
              <img className="w-5 h-5 absolute top-3 right-3 cursor-pointer" src="/icon/ic-close.svg" alt="" onClick={() => setShowSuccess(false)} />
            </div>
          </div>
        )}
      </div>
      <div id="popup-root"></div>
    </>
  )
}
