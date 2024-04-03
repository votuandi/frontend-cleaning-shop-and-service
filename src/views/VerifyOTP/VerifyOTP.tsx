/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './VerifyOTP.style'
import { Grid } from '@mui/material'
import AppDropdown from '@/components/AppDropdown'
import AppCheckBox from '@/components/AppCheckBox'
import AppLanguageSwitch from '@/components/AppLanguageSwitch'
import AppButton from '@/components/AppButton'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import { capitalizeFirstLetter, gotoPage } from '@/utils/helpers/common'
import AppTextField from '@/components/AppTextField'
import { authApi } from '@/utils/api'
import router from 'next/router'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

type ICoverBannerSize = {
  width: number
  height: number
}

export default function VerifyOTP() {
  /* ---------------------- */
  /* HOOKS AND LIBS */
  /* ---------------------- */
  const { t, i18n } = useTranslation()
  const coverBannerRef = useRef(null)
  const inputRef: any[] = []
  for (let i = 0; i < 6; i++) {
    inputRef.push(useRef(null))
  }
  const dispatch = useDispatch()

  /* ---------------------- */
  /* UI STATE */
  /* ---------------------- */
  const [coverBannerSize, setCoverBannerSize] = useState<ICoverBannerSize>({
    width: 0,
    height: 0,
  })
  const [inputOTP, setInputOTP] = useState<string[]>(inputRef.map((x) => ''))
  const [done, setDone] = useState<boolean>(false)
  const [isWrongOTP, setIsWrongOTP] = useState<boolean>(false)

  /* ---------------------- */
  /* UI FUNCTION */
  /* ---------------------- */
  let handleInputOtp = (index: number, value: string) => {
    let newInputOTP = [...inputOTP]
    newInputOTP[index] = value
    setInputOTP(newInputOTP)
    if (value.length > 0 && index < inputRef.length - 1) {
      inputRef[index + 1].current.focus()
    }
  }

  let onVerify = async () => {
    await verifyOtp()
  }

  let onResend = () => {
    requestOtp(true)
  }

  /* ---------------------- */
  /* CALL API */
  /* ---------------------- */
  let requestOtp = async (isNew?: boolean) => {
    try {
      let params = getParams()
      let res = await authApi.requestOtp({
        params: {
          language: i18n.language === 'en-US' ? 'eng' : 'zho',
          country_code: params.areaCode,
          phone: params.phone,
          verify_type: params.type as 'register' | 'forgot_password',
        },
      })
      if (!res.data.status) {
        console.log(res)

        dispatch(setAlertMessageState(`${t('Requested OTP Code failed!')}\n${capitalizeFirstLetter(res.data.message.replaceAll('_', ' '))}`))
        // router.back()
      } else {
        if (!isNew) return
        dispatch(setAlertMessageState(t('Requested new OTP Code successfully!')))
      }
    } catch (error) {
      console.log(error)
      // dispatch(setAlertMessageState('Requested OTP Code failed. Try again'))
      // router.back()
    }
  }

  let verifyOtp = async () => {
    try {
      let params = getParams()
      let res = await authApi.verifyOtp({
        params: {
          language: i18n.language === 'en-US' ? 'eng' : 'zho',
          country_code: params.areaCode,
          phone: params.phone,
          verify_type: params.type as 'register' | 'forgot_password',
          code: inputOTP.join(''),
        },
      })
      if (res.data.status) {
        let token = await res.data.params.token
        if (params.type === 'register') {
          localStorage.setItem('access_token', token)
          setDone(true)
        } else {
          localStorage.setItem('verification_token', token)
          gotoPage('/reset-password', `?params=${params.areaCode.split('+')[1]}__${params.phone}`)
        }
        setIsWrongOTP(true)
      } else {
        dispatch(setAlertMessageState(t('Your code is incorrect!')))
        setIsWrongOTP(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (done) {
      // new Promise((resolve) => setTimeout(resolve, 3000)).finally(() => {
      //   gotoPage("/");
      // });
      gotoPage('/')
    }
  }, [done])

  let getParams = () => {
    let urlParams = new URLSearchParams(window.location.search)
    let _areaCode = urlParams ? (urlParams.get('params') ? `+${urlParams.get('params')!.split('__')[0]}` : '') : ''
    let _phone = urlParams ? (urlParams.get('params') ? urlParams.get('params')!.split('__')[1] : '') : ''
    let _type = urlParams ? (urlParams.get('params') ? urlParams.get('params')!.split('__')[2] : '') : ''
    return {
      areaCode: _areaCode,
      phone: _phone,
      type: _type,
    }
  }

  useEffect(() => {
    if (isMounted()) return
    let params = getParams()
    if (params.type === 'register') {
      new Promise((resolve) => setTimeout(resolve, 3000)).finally(() => {
        requestOtp()
      })
    }

    ;(inputRef[0].current as any).focus()
  }, [])

  const { classes } = useStyles({
    params: {},
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
          <div className="w-fit h-fit flex flex-row justify-center items-center cursor-pointer gap-2" onClick={() => router.back()}>
            <img className="w-auto h-3" src="/icon/ic-arrow-left-white.svg" alt="" />
            <span className="text-xs not-italic font-[14px]">{capitalizeFirstLetter(t('back'))}</span>
          </div>
          <div className="flex flex-col w-full h-fit justify-start items-start">
            <h1 className="text-[40px] not-italic font-bold leading-[100%] tracking-[0.4px] mb-6">{'Verify mobile number'}</h1>
            <span className="text-base not-italic font-normal leading-[normal] mb-2">{t('Enter the OTP receive to')}</span>
            <span className="text-[#01B7CB] text-lg not-italic font-semibold leading-[normal]">{`${getParams().areaCode} ${getParams().phone}`}</span>
          </div>
          <div className="relative flex flex-row justify-between items-center w-full  max-w-[450px]">
            {inputRef.map((refItem, index) => {
              return (
                <input
                  className={`w-14 h-14 pc:w-14 pc:h-20 pc:mx-4 border border-solid bg-[#06455E] text-lg text-center not-italic font-semibold leading-[normal] rounded-lg ${
                    isWrongOTP ? 'border-[#FF6261]' : 'border-[#0596A6]'
                  }`}
                  maxLength={1}
                  type="text"
                  name={`otp_${index}`}
                  id={`otp_${index}`}
                  ref={refItem}
                  key={index}
                  onChange={(e) => handleInputOtp(index, e.target.value)}
                />
              )
            })}
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-4">
            <button className="w-full h-fit py-3 bg-[#0596A6] rounded-lg" onClick={() => onVerify()}>
              <span className="text-xl not-italic font-semibold leading-[normal]">{t('Verify')}</span>
            </button>
            <div className="flex flex-row justify-center items-center gap-[10px] text-base not-italic font-medium leading-[normal]">
              <span className="text-white">{t('Don’t receive OTP ?')}</span>
              <span className="text-[#01B7CB] cursor-pointer" onClick={onResend}>
                {t('Resend')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
