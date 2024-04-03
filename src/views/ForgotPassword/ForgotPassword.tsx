/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import router, { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './ForgotPassword.style'
import { Grid } from '@mui/material'
import AppDropdown from '@/components/AppDropdown'
import AppCheckBox from '@/components/AppCheckBox'
import AppLanguageSwitch from '@/components/AppLanguageSwitch'
import AppButton from '@/components/AppButton'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import { capitalizeFirstLetter, gotoPage } from '@/utils/helpers/common'
import AppTextField from '@/components/AppTextField'
import settingApi, { IGetMemberSettingResponse } from '@/utils/api/setting'
import { authApi } from '@/utils/api'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

const STATIC_AREA_CODE = [
  {
    label: '+852',
    value: 'zho',
  },
  {
    label: '+84',
    value: 'vn',
  },
]

type ICoverBannerSize = {
  width: number
  height: number
}

export default function ForgotPassword() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const coverBannerRef = useRef(null)
  const inputRef: any[] = []
  const dispatch = useDispatch()
  for (let i = 0; i < 6; i++) {
    inputRef.push(useRef(null))
  }

  const [coverBannerSize, setCoverBannerSize] = useState<ICoverBannerSize>({
    width: 0,
    height: 0,
  })
  const [areaCode, setAreaCode] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [memberSettings, setMemberSettings] = useState<IGetMemberSettingResponse | null>(null)

  let handleAreaCodeChange = (e: any) => {
    setAreaCode(e.target.value)
  }

  let handlePhoneChange = (e: any) => {
    setPhone(e.target.value)
  }

  let getMemberSettings = async () => {
    try {
      let res = await settingApi.getMemberSettings({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })
      if (res.data.status) {
        setMemberSettings(res.data.params)
      }
    } catch (error) {
      console.log('getMemberSettings', error)
    }
  }

  let requestOtp = async () => {
    try {
      let res = await authApi.requestOtp({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          country_code: areaCode,
          phone: phone,
          verify_type: 'forgot_password',
        },
      })
      if (res.data.status) {
        dispatch(setAlertMessageState(res.data.params.otp_code))
        gotoPage('/verify-otp', `?params=${areaCode.split('+')[1]}__${phone}__forgot_password`)
      } else {
        dispatch(setAlertMessageState(`${t('Request OTP Code failed.')} ${capitalize(res.data.message.replaceAll('_', ' '))}`))
      }
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async () => {
    await getMemberSettings()
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
    if (!coverBannerRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      setCoverBannerSize({
        height: coverBannerRef.current ? (coverBannerRef.current as any).offsetHeight : 0,
        width: coverBannerRef.current ? (coverBannerRef.current as any).offsetWidth : 0,
      })
    })
    resizeObserver.observe(coverBannerRef.current)
    return () => resizeObserver.disconnect() // clean up
  }, [])

  useEffect(() => {
    if (memberSettings === null) return
    setAreaCode(memberSettings.country_code[0].id)
  }, [memberSettings])

  const { classes } = useStyles({
    params: {
      coverBannerHeight: coverBannerSize.height,
      coverBannerWidth: coverBannerSize.width,
      coverBannerUrl: '/img/account-cover.png',
    },
  })

  let isMounted = useIsMounted()

  return (
    <div className={classes.formContainer}>
      <div className="w-fit h-fit flex flex-row justify-center items-center cursor-pointer gap-2" onClick={() => router.back()}>
        <img className="w-auto h-3" src="/icon/ic-arrow-left-white.svg" alt="" />
        <span className="text-xs not-italic font-[14px]">{capitalizeFirstLetter(t('back'))}</span>
      </div>
      <div className="flex flex-col w-full h-fit justify-start items-start">
        <h1 className="text-[40px] mx-auto text-center not-italic font-bold leading-[100%] tracking-[0.4px] mb-6">{t('Forgot password?')}</h1>
        <span className="text-base not-italic font-normal leading-[normal]">{t('Enter your phone number and we will share a link to create a new password')}</span>
      </div>
      <div className="flex flex-row w-full h-fit gap-5">
        <AppDropdown
          items={
            memberSettings
              ? memberSettings.country_code.map((x) => ({
                  label: x.name,
                  value: x.id,
                }))
              : []
          }
          width="140px"
          value={areaCode}
          startIcon="/icon/call.svg"
          height="56px"
          onChange={handleAreaCodeChange}
        />
        <AppTextField label={t('Phone number')} width="100%" onChange={handlePhoneChange} />
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-4">
        <button className="w-full h-fit py-3 bg-[#0596A6] rounded-lg" onClick={async () => requestOtp()}>
          <span className="text-xl not-italic font-semibold leading-[normal]">{t('Reset password')}</span>
        </button>
        <div className="flex flex-row justify-center items-center gap-[10px] text-base not-italic font-medium leading-[normal]">
          <span className="text-white">{t('Remember password?')}</span>
          <span className="text-[#01B7CB] cursor-pointer" onClick={() => gotoPage('/sign-in')}>
            {t('Login')}
          </span>
        </div>
      </div>
    </div>
  )
}
