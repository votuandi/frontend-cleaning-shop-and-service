/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './SignIn.style'
import { Box, Grid, useMediaQuery } from '@mui/material'
import AppDropdown from '@/components/AppDropdown'
import AppCheckBox from '@/components/AppCheckBox'
import AppLanguageSwitch from '@/components/AppLanguageSwitch'
import AppButton from '@/components/AppButton'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import AppTextField from '@/components/AppTextField'
import { authApi, settingApi } from '@/utils/api'
import { IGetMemberSettingResponse } from '@/utils/api/setting'
import theme from '@/assets/theme'
import { setAlertMessageState } from '@/slice/alertSlice'
import { useDispatch } from 'react-redux'

type ICoverBannerSize = {
  width: number
  height: number
}

export default function SignIn() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const coverBannerRef = useRef(null)
  const phoneInputRef = useRef<HTMLInputElement | null>(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(760))
  const dispatch = useDispatch()

  const [coverBannerSize, setCoverBannerSize] = useState<ICoverBannerSize>({
    width: 0,
    height: 0,
  })
  const [memberSettings, setMemberSettings] = useState<IGetMemberSettingResponse | null>(null)
  const [areaCode, setAreaCode] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  let handlePasswordChange = (e: any) => {
    setPassword(e.target.value)
  }

  let handleAreaCodeChange = (e: any) => {
    setAreaCode(e.target.value)
  }

  let handlePhoneChange = (e: any) => {
    setPhone(e.target.value)
  }

  /* ---------------------- */
  /* CALL API */
  /* ---------------------- */
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

  let signIn = async () => {
    try {
      let res = await authApi.signIn({
        params: {
          country_code: areaCode,
          phone: phone,
          password: password,
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })
      if (res.data.status) {
        let token = res.data.params.new_token
        localStorage.setItem('access_token', token)
        gotoPage('/')
      } else {
        dispatch(setAlertMessageState(t('Login failed')))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await signIn()
    }
  }

  let FetchData = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (accessToken) gotoPage('/')
    await getMemberSettings()
  }

  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus()
    }
    if (isMounted()) return
    FetchData()
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData()
  }, [locale])

  useEffect(() => {
    const updateSize = () => {
      let _width = window.innerWidth / 2 - 80
      let _height = Math.floor((_width * 928) / 732)
      if (_height > window.innerHeight - 80) {
        _height = window.innerHeight - 80
        _width = Math.floor((_width * 732) / 928)
      }
      console.log(_width, _height)

      setCoverBannerSize({
        height: _height,
        width: _width,
      })
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
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
      {isSmallScreen ? (
        <Box
          sx={{
            width: '160px',
            height: '160px',
            margin: '45px auto',
            padding: '30px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Box sx={{ zIndex: 3, position: 'absolute', top: '30px', left: '30px' }}>
            <img className="w-[100px] h-[100px] z-10" src="/icon/logo.svg" alt="" />
          </Box>
          <Box
            sx={{
              width: '160px',
              height: '160px',
              padding: '30px',
              backgroundColor: 'rgba(127, 222, 255, 0.80)',
              filter: 'blur(75px)',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          ></Box>
        </Box>
      ) : (
        <img className={classes.logo} src="/icon/logo.svg" alt="" />
      )}
      <Box
        sx={{
          height: isSmallScreen ? '100%' : 'fit-content',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isSmallScreen ? 'space-evenly' : 'center',
        }}
      >
        <div className={classes.inputFields}>
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
            <AppTextField onKeyDown={handleKeyPress} label={t('Phone number')} width="100%" onChange={handlePhoneChange} ref={phoneInputRef} autoComplete="new-phone" />
          </div>
          <AppTextField
            onKeyDown={handleKeyPress}
            type="password"
            label={capitalizeFirstLetter(t('password'))}
            width="100%"
            onChange={handlePasswordChange}
            startIcon="/icon/password.svg"
            autoComplete="new-pw"
          />
          <div className="flex flex-row justify-between items-center ">
            <AppCheckBox label={t('Remember me')} />
            <p className="text-[#01B7CB] text-sm not-italic font-medium leading-[normal] underline cursor-pointer" onClick={() => gotoPage('/forgot-password')}>
              {t('Forgot your password?')}
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full h-fit gap-4 justify-center items-center">
          <AppLanguageSwitch />
          <AppButton variant="contained" sx={{ padding: '12px 0' }} width="100%" onClick={async () => signIn()}>
            <span>{t('Login')}</span>
          </AppButton>
          <div className="flex justify-center items-center w-full">
            <div className={`flex flex-row flex-wrap justify-center items-center gap-[10px] ${classes.createAccountTexts}`}>
              <p>{t('Don’t have an account?')}</p>
              <p className="text-[#01B7CB] cursor-pointer" onClick={() => gotoPage('/register')}>
                {t('Create an account')}
              </p>
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}
