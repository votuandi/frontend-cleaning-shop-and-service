import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps, useMediaQuery } from '@mui/material'
import useStyles from './AppFooter.styles'
import router from 'next/router'
import { FOOTER, MENU } from '@/utils/constants/menu.constant'
import { capitalizeFirstLetterAllWords, gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import theme from '@/assets/theme'
import { IFooterSettingItem } from '@/utils/api/setting'
import { useIsMounted } from 'usehooks-ts'
import { settingApi } from '@/utils/api'

type IProps = {}

const AppFooter = (props: IProps, ref: React.ForwardedRef<any>) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const { classes } = useStyles()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(840))

  const [footerSettings, setFooterSettings] = useState<IFooterSettingItem[]>([])

  const getFooterSettings = async () => {
    try {
      let res = await settingApi.getFooterSetting({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })
      if (res.data.status) {
        setFooterSettings(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const FetchData = async () => {
    await getFooterSettings()
  }

  useEffect(() => {
    if (isMounted()) return
    FetchData()
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  let isMounted = useIsMounted()

  return (
    <div className={`w-screen h-fit absolute bottom-0 left-0 flex flex-col ${classes.root}`} ref={ref}>
      <div className={`w-full max-w-[1280px] h-fit pt-16 pb-12 px-6 flex flex-wrap justify-center items-start ${isSmallScreen ? 'flex-col gap-8' : 'flex-row gap-16'}`}>
        <div className="w-fit hi-ft flex flex-col gap-1.5">
          <div className={`flex flex-row gap-2 justify-start items-center w-full ${isSmallScreen ? 'w-full' : 'max-w-[260px]'}`}>
            <img className="w-6 h-6" src="/icon/ic-footer-phone.png" alt="" />
            <span className="text-[#FDFDFD] text-base font-normal">{footerSettings.find((x) => x.slug === 'content-web-phone')?.data}</span>
          </div>
          <a href={`mailto:${footerSettings.find((x) => x.slug === 'content-web-email')?.data}`}>
            <div className={`flex flex-row gap-2 justify-start items-center w-full ${isSmallScreen ? 'w-full' : 'max-w-[260px]'}`}>
              <img className="w-6 h-6" src="/icon/ic-footer-mail.png" alt="" />
              <span className="text-[#FDFDFD] text-base font-normal">{footerSettings.find((x) => x.slug === 'content-web-email')?.data}</span>
            </div>
          </a>
          <div className={`flex flex-row gap-2 justify-start items-center w-full ${isSmallScreen ? 'w-full' : 'max-w-[260px]'}`}>
            <img className="w-6 h-6" src="/icon/ic-footer-address.png" alt="" />
            <span className="text-[#FDFDFD] text-base font-normal">{footerSettings.find((x) => x.slug === 'content-web-address')?.data}</span>
          </div>
        </div>
        <div className={`flex gap-8 flex-wrap justify-start ${isSmallScreen ? 'flex-col' : 'flex-row'}`}>
          {FOOTER.map((item, index) => {
            return (
              <div className="flex flex-col gap-4" key={index}>
                <h3 className="text-[#FDFDFD] text-sm font-normal">{t(item.title.toLowerCase()).toLowerCase()}</h3>
                {item.items.map((sub, ind) => {
                  return (
                    <span className="text-[#FDFDFD] text-base font-normal cursor-pointer" key={ind} onClick={() => gotoPage(sub.path)}>
                      {capitalizeFirstLetterAllWords(t(sub.name))}
                    </span>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-[#FDFDFD] text-sm font-normal">{t('get in touch').toUpperCase()}</h3>
          <div className="flex flex-row flex-wrap gap-9 justify-start items-center">
            <a href={footerSettings.find((x) => x.slug === 'content-web-facebook')?.data} target="_blank">
              <img src="/icon/ic-footer-facebook.svg" alt="" />
            </a>
            <a href={footerSettings.find((x) => x.slug === 'content-web-instagram')?.data} target="_blank">
              <img src="/icon/ic-footer-instagram.svg" alt="" />
            </a>
            <a href={footerSettings.find((x) => x.slug === 'content-web-youtube')?.data} target="_blank">
              <img src="/icon/ic-footer-youtube.svg" alt="" />
            </a>
            <a href={footerSettings.find((x) => x.slug === 'content-web-whatsapp')?.data} target="_blank">
              <img src="/icon/ic-footer-whatsapp.svg" alt="" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full h-fit py-3.5 bg-[#053E5A] flex justify-center items-center">
        <span className="text-[#FDFDFD] w-fit font-normal text-center text-sm">© 2023 Cleaning papa. All rights reserved.</span>
      </div>
    </div>
  )
}

export default React.forwardRef(AppFooter)
