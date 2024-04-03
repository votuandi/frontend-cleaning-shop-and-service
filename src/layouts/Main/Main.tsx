import AppHeader from '@/components/AppHeader'
import React, { useEffect, useRef, useState } from 'react'
import useStyles from './Main.styles'
import AppFooter from '@/components/AppFooter'
import { Box } from '@mui/material'
import AppAlert from '@/components/AppAlert'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useIsMounted } from 'usehooks-ts'
import { useTranslation } from 'next-i18next'
import { settingApi } from '@/utils/api'
import { IGetMemberSettingResponse } from '@/utils/api/member'
import { setCountryCodeDataSetting, setGenderDataSetting, setLanguageDataSettings, setTransStatusDataSetting } from '@/slice/memberSettingSlice'

type MainProps = {
  children: React.ReactNode
}

const Main = (props: MainProps) => {
  const { children } = props
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const headerRef = useRef(null)
  const footerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const [footerHeight, setFooterHeight] = useState<number>(0)
  const alert = useSelector((state: RootState) => state.alert)
  const dispatch = useDispatch()

  const { classes } = useStyles({
    params: {
      paddingTop: `${70 + headerHeight}px`,
      paddingBot: `${70 + footerHeight}px`,
    },
  })

  const getMemberSetting = async () => {
    try {
      let res = await settingApi.getMemberSettings({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })
      if (res.data.status) {
        let memberSetting: IGetMemberSettingResponse = res.data.params
        dispatch(setCountryCodeDataSetting(memberSetting.country_code))
        dispatch(setGenderDataSetting(memberSetting.gender))
        dispatch(setLanguageDataSettings(memberSetting.lang))
        dispatch(setTransStatusDataSetting(memberSetting.trans_status))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const FetchData = async () => {
    getMemberSetting()
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
    if (!headerRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      setHeaderHeight(headerRef.current ? (headerRef.current as any).offsetHeight : 0)
    })
    resizeObserver.observe(headerRef.current)
    return () => resizeObserver.disconnect() // clean up
  }, [])

  useEffect(() => {
    if (!footerRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      setFooterHeight(footerRef.current ? (footerRef.current as any).offsetHeight : 0)
    })
    resizeObserver.observe(footerRef.current)
    return () => resizeObserver.disconnect() // clean up
  }, [])

  let isMounted = useIsMounted()

  return (
    <div className="flex flex-col justify-between items-center w-screen min-h-screen relative bg-[#EFF7FA]">
      <AppHeader ref={headerRef} />
      <div className={`w-screen h-full pb-[70px] bg-[#EFF7FA] ${classes.childrenContainer}`}>
        <div className="w-full h-fit max-w-[1280px] bg-white mx-auto">{children}</div>
      </div>
      <AppFooter ref={footerRef} />
      {alert.message.length > 0 && <AppAlert />}
    </div>
  )
}

export default Main
