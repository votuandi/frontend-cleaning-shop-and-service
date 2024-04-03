import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps, useMediaQuery, Box, IconButton } from '@mui/material'
import useStyles from './AppHeader.styles'
import router, { useRouter } from 'next/router'
import { MENU } from '@/utils/constants/menu.constant'
import { capitalizeFirstLetter, capitalizeFirstLetterAllWords, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import memberApi from '@/utils/api/member/member.api'
import { ICountUnreadNotificationResponse, IGetProfileDataResponse } from '@/utils/api/member'
import theme from '@/assets/theme'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import dynamic from 'next/dynamic'
import { capitalize } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { transactionApi } from '@/utils/api'
import { setGlobalCart } from '@/slice/cartSlice'
import { setAlertMessageState } from '@/slice/alertSlice'

type IProps = {}

const simple = (props: any) => <React.Fragment>{props.children}</React.Fragment>
const NoSsr = dynamic(() => Promise.resolve(simple), {
  ssr: false,
})

const AppHeader = (props: IProps, ref: React.ForwardedRef<any>) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const locale = i18n.language
  const profilePanelRef = React.useRef(null)
  const router = useRouter()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(1280))
  const { pathname, asPath, query } = router
  const cart = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch()
  const alert = useSelector((state: RootState) => state.alert)
  useOnClickOutside(profilePanelRef, () => setIsShowProfilePanel(false))

  const [isShowProfilePanel, setIsShowProfilePanel] = useState<boolean>(false)
  const [profile, setProfile] = useState<IGetProfileDataResponse>()
  const [path, setPath] = useState<string>('')
  const [isShowMobileMenu, setIsShowMobileMenu] = useState<boolean>(false)
  const [isShowMobileLanguage, setIsShowMobileLanguage] = useState<boolean>(false)
  const [isShowLanguage, setIsShowLanguage] = useState<boolean>(false)
  const [unreadNotificationAmount, setUnreadNotificationAmount] = useState<ICountUnreadNotificationResponse>({ number_unread: 0 })

  let handleTranslate = (lang: string) => {
    let _locale = lang
    router.push({ pathname, query }, asPath, { locale: _locale })
    window.NextPublic.lang = locale as any
    setIsShowLanguage(false)
  }

  let handleTranslateMb = (lang: string) => {
    handleTranslate(lang)
    setIsShowMobileLanguage(false)
    setIsShowMobileMenu(false)
  }

  let countUnreadNotification = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        return
      }
      let res = await memberApi.countUnreadNotification({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
        },
      })
      if (res.data.status) {
        setUnreadNotificationAmount(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let getCart = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        return
      }
      let res = await transactionApi.getCart({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
        },
      })
      if (res.data.status) {
        dispatch(setGlobalCart(res.data.params))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickAvatar = () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (accessToken) {
      setIsShowProfilePanel(true)
    } else gotoPage('/sign-in')
  }

  const handleClickCart = () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (accessToken) {
      gotoPage('/cart')
    } else gotoPage('/sign-in')
  }

  const handleClickNotify = () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (accessToken) {
      gotoPage('/notification')
    } else gotoPage('/sign-in')
  }

  const handleClickProfile = () => {
    setIsShowProfilePanel(false)
    gotoPage('/member-center')
  }

  const handleClickLogout = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (accessToken) {
      try {
        let res = await memberApi.logout({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
          },
        })

        localStorage.removeItem('access_token')
        gotoPage('/')
      } catch (error) {
        setAlertMessageState(t('Log out failed'))
      }
    } else setAlertMessageState("You haven't signed-in yet.")
  }
  let FetchData = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (accessToken)
      try {
        let res = await memberApi.getProfile({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
          },
        })
        if (res.data.status) {
          setProfile(res.data.params)
        }
      } catch (error) {}
    await getCart()
    await countUnreadNotification()
  }

  useEffect(() => {
    let _path = router.route
    if (_path.includes('[slug]')) {
      _path = _path.replace('[slug]', router.query.slug!.toString())
    }
    setPath(_path)
    if (isMounted()) return
    FetchData()
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  let isMounted = useIsMounted()

  return isSmallScreen ? (
    <div className="w-screen fixed top-0 left-0 z-40">
      <div className="px-4 py-5 flex flex-row justify-between items-center w-screen bg-[#EFF7FA] drop-shadow-md relative">
        <button className=" cursor-pointer" onClick={() => setIsShowMobileMenu((x) => !x)}>
          <img src="/icon/ic-header-menu.png"></img>
        </button>
        <div className="w-fit h-fit flex flex-row gap-3 justify-center items-center">
          <div className="relative">
            <img className="w-10 h-10 cursor-pointer" src="/icon/ic-cart.png" alt="" onClick={handleClickCart} />
            {cart?.cart?.CartDetail?.length > 0 && <img className="absolute right-0 top-0 z-50" src="/icon/ic-reddoc.svg" alt="" />}
          </div>
          <div className="relative">
            <img className="w-10 h-10 cursor-pointer" src="/icon/ic-notification.png" alt="" onClick={handleClickNotify} />
            {unreadNotificationAmount?.number_unread > 0 && <img className="absolute right-0 top-0 z-50" src="/icon/ic-reddoc.svg" alt="" />}
          </div>
          <div className="relative">
            <img className="w-10 h-10 cursor-pointer rounded-[50%]" src={profile?.image ? profile.image : '/icon/ic-avt.png'} alt="" onClick={handleClickAvatar} />
            {isShowProfilePanel && (
              <div
                ref={profilePanelRef}
                className="px-5 py-2.5 rounded-[5px] bg-white shadow-md flex flex-col gap-[10px] text-[#1a1a1a] font-normal text-base absolute top-20 right-0"
              >
                <span className="cursor-pointer" onClick={handleClickProfile}>
                  {capitalizeFirstLetter(t('profile'))}
                </span>
                <span className="cursor-pointer" onClick={handleClickLogout}>
                  {capitalizeFirstLetter(t('logout'))}
                </span>
              </div>
            )}
          </div>
        </div>
        {isShowMobileMenu && (
          <div className="fixed left-0 top-full w-screen h-screen bg-white flex flex-col justify-start">
            <div className="px-4 pt-4 pb-[5px] w-full flex flex-row justify-end">
              <button className="cursor-pointer" onClick={() => setIsShowMobileMenu(false)}>
                <img src="/icon/ic-reject.svg"></img>
              </button>
            </div>
            {MENU.map((item, index) => (
              <span key={index} className="w-full text-left px-4 py-[15px] text-black text-base font-normal cursor-pointer" onClick={() => gotoPage(item.path)}>
                {capitalizeFirstLetterAllWords(t(item.text))}
              </span>
            ))}
            <div className="w-full text-left px-4 py-[15px] text-black text-base font-normal flex flex-row justify-between items-center">
              <span>Language</span>
              <IconButton sx={{ padding: 0 }} onClick={() => setIsShowMobileLanguage((x) => !x)}>
                {isShowMobileLanguage ? <KeyboardArrowUpIcon sx={{ color: '#000' }} /> : <KeyboardArrowDownIcon sx={{ color: '#000' }} />}
              </IconButton>
            </div>
            {isShowMobileLanguage && (
              <NoSsr>
                <div className="w-full flex flex-col">
                  <span className="w-full text-left px-8 py-[15px] text-black text-base font-normal cursor-pointer" onClick={() => handleTranslateMb('en-US')}>
                    English
                  </span>
                  <span className="w-full text-left px-8 py-[15px] text-black text-base font-normal cursor-pointer" onClick={() => handleTranslateMb('zh-HK')}>
                    Hongkong
                  </span>
                </div>
              </NoSsr>
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="w-screen h-fit py-[15px] bg-white fixed top-0 left-0 z-50 shadow-md" ref={ref}>
      <div className="w-full max-w-[1280px] h-fit min-h-[50px] mx-auto flex flex-row justify-between items-center relative">
        {isShowProfilePanel && (
          <div
            ref={profilePanelRef}
            className="px-5 py-2.5 rounded-[5px] bg-white shadow-md flex flex-col gap-[10px] text-[#1a1a1a] font-normal text-base absolute top-[68px] right-0"
          >
            <span className="cursor-pointer" onClick={handleClickProfile}>
              {capitalizeFirstLetter(t('profile'))}
            </span>
            <span className="cursor-pointer" onClick={handleClickLogout}>
              {capitalizeFirstLetter(t('logout'))}
            </span>
          </div>
        )}
        <div className="w-fit h-fit min-h-[50px] flex flex-row items-center justify-center gap-8">
          <img className="w-[50px] h-[50px] cursor-pointer" src="/img/header-logo.png" alt="" onClick={() => gotoPage('/')} />
          <div className="w-fit h-fit min-h-[50px] flex flex-row flex-wrap justify-start items-center">
            {MENU.map((item, index) => {
              return (
                <div
                  className={`w-fit px-[14px] py-2.5 rounded-[40px] cursor-pointer ${item.path === path ? 'bg-[#06455e]' : 'bg-white'}`}
                  onClick={() => gotoPage(item.path)}
                  key={index}
                >
                  <span className={`text-base not-italic font-medium leading-[100%] ${item.path === path ? 'text-white' : 'text-[#B3B3B3]'}`}>
                    {capitalizeFirstLetterAllWords(t(item.text))}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="w-fit h-fit flex flex-row gap-3 justify-center items-center">
          <div className="relative">
            <img className="w-10 h-10 cursor-pointer" src="/icon/ic-cart.png" alt="" onClick={handleClickCart} />
            {cart?.cart?.CartDetail?.length > 0 && <img className="absolute right-0 top-0 z-50" src="/icon/ic-reddoc.svg" alt="" />}
          </div>
          <div className="relative">
            <img className="w-10 h-10 cursor-pointer" src="/icon/ic-notification.png" alt="" onClick={handleClickNotify} />
            {unreadNotificationAmount?.number_unread > 0 && <img className="absolute right-0 top-0 z-50" src="/icon/ic-reddoc.svg" alt="" />}
          </div>
          {isShowLanguage ? (
            <div className="w-[120px] h-10 relative">
              <NoSsr>
                <div className="w-[120px] h-20 rounded-[20px] bg-white border-[1px] solid border-[#2B6176] flex flex-col absolute top-0 left-0">
                  <div
                    className="w-[120px] h-10 py-1 px-[8px] flex flex-row gap-2 items-center justify-start rounded-t-[20px] text-[#1a1a1a] hover:text-white hover:bg-[#2B6176] cursor-pointer"
                    onClick={() => handleTranslate('zh-HK')}
                  >
                    <img className="w-[18px] h-[18px] rounded-[50%]" src="/img/HK_flag.svg" alt="" />
                    <span className="text-base not-italic font-medium leading-[100%]">HongKong</span>
                  </div>
                  <div
                    className="w-[120px] h-10 py-1 px-[8px] flex flex-row gap-2 items-center justify-start rounded-b-[20px] text-[#1a1a1a] hover:text-white hover:bg-[#2B6176] cursor-pointer"
                    onClick={() => handleTranslate('en-US')}
                  >
                    <img className="w-[18px] h-[18px] rounded-[50%]" src="/img/English_flag.svg" alt="" />
                    <span className="text-base not-italic font-medium leading-[100%]">English</span>
                  </div>
                </div>
              </NoSsr>
            </div>
          ) : (
            <div
              className="w-[120px] h-10 py-1 px-[14px] flex flex-row gap-2 items-center justify-center rounded-[40px] bg-[#2B6176] cursor-pointer"
              onClick={() => setIsShowLanguage(true)}
            >
              <img className="w-[18px] h-[18px]" src="/icon/ic-language.svg" alt="" />
              <span className="text-base not-italic font-medium leading-[100%] text-white">{i18n.language === 'en-US' ? 'English' : 'HongKong'}</span>
            </div>
          )}
          <img className="w-10 h-10 cursor-pointer rounded-[50%]" src={profile?.image ? profile.image : '/icon/ic-avt.png'} alt="" onClick={handleClickAvatar} />
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef(AppHeader)
