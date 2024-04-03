/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './ResetPassword.style'
import { Grid } from '@mui/material'
import AppDropdown from '@/components/AppDropdown'
import AppCheckBox from '@/components/AppCheckBox'
import AppLanguageSwitch from '@/components/AppLanguageSwitch'
import AppButton from '@/components/AppButton'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import AppTextField from '@/components/AppTextField'
import settingApi, { IGetMemberSettingResponse } from '@/utils/api/setting'
import { authApi } from '@/utils/api'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

type ICoverBannerSize = {
  width: number
  height: number
}

export default function ResetPassword() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const coverBannerRef = useRef(null)
  const inputRef: any[] = []
  for (let i = 0; i < 6; i++) {
    inputRef.push(useRef(null))
  }
  const dispatch = useDispatch()

  const [coverBannerSize, setCoverBannerSize] = useState<ICoverBannerSize>({
    width: 0,
    height: 0,
  })
  const [areaCode, setAreaCode] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorPassword, setErrorPassword] = useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<boolean>(false)
  const [memberSettings, setMemberSettings] = useState<IGetMemberSettingResponse | null>(null)
  const [done, setDone] = useState<boolean>(false)

  let handlePasswordChange = (e: any) => {
    setPassword(e.target.value)
    setErrorPassword(e.target.value.length < 6)
  }

  let handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value)
    setErrorConfirmPassword(e.target.value !== password)
  }

  let resetPassword = async () => {
    try {
      let res = await authApi.resetPassword({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          password: password,
          confirm_password: confirmPassword,
          verification_token: localStorage.getItem('verification_token') ? localStorage.getItem('verification_token')! : '',
          country_code: areaCode,
          phone: phone,
        },
      })
      if (res.data.status) {
        localStorage.removeItem('verification_token')
        setDone(true)
      } else {
        dispatch(setAlertMessageState(t('Reset password failed. Please try again!')))
      }
    } catch (error) {
      console.log(error)
    }
  }

  let onSetPassword = async () => {
    if (password.length === 0) setErrorPassword(true)
    if (confirmPassword.length === 0) setErrorConfirmPassword(true)

    if (password.length === 0 || confirmPassword.length === 0 || errorPassword || errorConfirmPassword) {
      dispatch(setAlertMessageState(t('Please enter the valid values')))
      return
    }

    await resetPassword()
  }

  useEffect(() => {
    let storageAvailable = localStorageAvailable()
    let verificationToken = storageAvailable ? localStorage.getItem('verification_token') : ''
    if (!verificationToken) gotoPage('/sign-in')
    if (isMounted()) return
    let urlParams = new URLSearchParams(window.location.search)
    let _areaCode = urlParams ? (urlParams.get('params') ? `+${urlParams.get('params')!.split('__')[0]}` : '') : ''
    let _phone = urlParams ? (urlParams.get('params') ? urlParams.get('params')!.split('__')[1] : '') : ''
    setAreaCode(_areaCode)
    setPhone(_phone)
    // FetchData();
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    // FetchData();
  }, [locale])

  useEffect(() => {
    if (done) gotoPage('/sign-in')
  }, [done])

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
    <>
      {done ? (
        <div className="w-full max-w-[450px] h-fit min-h-screen flex flex-col justify-center items-center gap-[60px] m-auto">
          <img className="w-[123px] h-[123px]" src="/img/ic-otp-success.png" alt="" />
          <span className="text-2xl not-italic font-semibold leading-[normal]">{t('Enter successfully')}</span>
        </div>
      ) : (
        <div className={classes.formContainer}>
          <div className="w-fit h-fit flex flex-row justify-center items-center cursor-pointer gap-2">
            <img className="w-auto h-3" src="/icon/ic-arrow-left-white.svg" alt="" />
            <span className="text-xs not-italic font-[14px]">{capitalizeFirstLetter(t('back'))}</span>
          </div>
          <div className="flex flex-col w-full h-fit justify-start items-start">
            <h1 className="text-[40px] mx-auto text-center not-italic font-bold leading-[100%] tracking-[0.4px] mb-6">{'Change password'}</h1>
            <span className="text-base not-italic font-normal leading-[normal]">{t('This password should be have atleast 6 character')}</span>
          </div>
          <div className="flex flex-col w-full h-fit gap-5">
            <AppTextField
              type="password"
              label={capitalizeFirstLetter(t('password'))}
              width="100%"
              onChange={handlePasswordChange}
              error={errorPassword}
              startIcon="/icon/password.svg"
            />
            <AppTextField
              type="password"
              label={t('confirm password')}
              width="100%"
              onChange={handleConfirmPasswordChange}
              error={errorConfirmPassword}
              startIcon="/icon/password.svg"
            />
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-4">
            <button className="w-full h-fit py-3 bg-[#0596A6] rounded-lg" onClick={async () => onSetPassword()}>
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
      )}
    </>
  )
}
