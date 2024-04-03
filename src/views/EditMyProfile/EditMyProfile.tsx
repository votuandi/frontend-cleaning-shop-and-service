/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import router, { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './EditMyProfile.style'
import { Button, Divider, FormControl, FormLabel, Grid, IconButton, TextField, useMediaQuery } from '@mui/material'
import { capitalizeFirstLetter, getYYYYMMDD, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import memberApi, { IGetMemberDataResponse, IGetProfileDataResponse, IUpdateProfileInput } from '@/utils/api/member'
import AppEditTextField from '@/components/AppEditTextField'
import * as Yup from 'yup'
import { ErrorMessage, Field, useFormik } from 'formik'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AppConfirmPopup from '@/components/AppConfirmPopup'
import { authApi } from '@/utils/api'
import { capitalize } from 'lodash'
import theme from '@/assets/theme'
import { setAlertMessageState } from '@/slice/alertSlice'
import { useDispatch } from 'react-redux'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format } from 'date-fns'
import AdapterDateFns from '@mui/x-date-pickers/AdapterDateFns'
import dayjs, { Dayjs } from 'dayjs'

type InitialValueType = {
  name: string
  email: string
  birthday: string
  areaCode: string
  phone: string
}

const DEFAULT_INITIAL_VALUE: InitialValueType = {
  name: '',
  email: '',
  birthday: getYYYYMMDD(Date.now()),
  areaCode: '+34',
  phone: '',
}

export default function MemberCenter() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const inputRef: any[] = []
  for (let i = 0; i < 6; i++) {
    inputRef.push(useRef(null))
  }
  const pickAvatarRef = useRef<HTMLInputElement | null>(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600))
  const dispatch = useDispatch()

  const [step, setStep] = useState<number>(0)
  const [isShowConfirmPopup, setIsShowConfirmPopup] = useState<boolean>(false)
  const [profile, setProfile] = useState<IGetProfileDataResponse>()
  const [initialValues, setInitialValues] = useState<InitialValueType>(DEFAULT_INITIAL_VALUE)
  const [inputOTP, setInputOTP] = useState<string[]>(inputRef.map((x) => ''))
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('Name is required')),
    email: Yup.string().required(t('Email is required')).email(t('Invalid email address')),
    birthday: Yup.string().required(t('Birthday is required')),
    areaCode: Yup.string().required(t('Area Code is required')),
    phone: Yup.number().required(t('Phone number is required')),
  })

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        dispatch(setAlertMessageState(t('Your sign-in session is over. Please sign in again')))
        gotoPage('/sign-in')
      } else {
        if (values.areaCode === profile?.country_code && values.phone == profile.phone) {
          await updateProfile({
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            name: values.name,
            email: values.email,
            birthday: values.birthday,
            is_update_phone: 0,
          })
        } else setIsShowConfirmPopup(true)
      }
      // console.log(values)
    },
  })

  let handleUpdateProfileWithNewPhone = async () => {
    await requestOtp()
    setIsShowConfirmPopup(false)
    setStep(1)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedAvatar(event.target.files[0])
    }
  }

  let handleInputOtp = (index: number, value: string) => {
    let newInputOTP = [...inputOTP]
    newInputOTP[index] = value
    setInputOTP(newInputOTP)
    if (value.length > 0 && index < inputRef.length - 1) {
      inputRef[index + 1].current.focus()
    }
  }

  let handleChangeImage = () => {
    if (pickAvatarRef.current) pickAvatarRef.current.click()
  }

  let onVerify = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    let res = await updateProfile({
      language: locale === 'en-US' ? 'eng' : 'zho',
      token: accessToken!,
      name: formik.values.name,
      email: formik.values.email,
      birthday: formik.values.birthday,
      country_code: formik.values.areaCode,
      phone: formik.values.phone,
      code: inputOTP.join(''),
      is_update_phone: 1,
    })
    if (res) {
      gotoPage('/member-center/my-profile')
    }
  }

  let updateProfile = async (params: IUpdateProfileInput) => {
    try {
      let res = await memberApi.updateProfile({
        params: params,
      })
      if (res.data.status) {
        dispatch(setAlertMessageState(t('Update Profile Successfully')))
        return true
      } else {
        dispatch(setAlertMessageState(`${t('Update profile failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  let updateAvatar = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (accessToken) {
      try {
        let res = await memberApi.updateAvatar({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
            avatar: selectedAvatar!,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(t('Change avatar successfully!')))
          router.reload()
        } else {
          dispatch(setAlertMessageState(capitalize(res.data.message.replaceAll('_', ' '))))
        }
      } catch (error) {
        dispatch(setAlertMessageState(t('Update avatar failed')))
      }
    } else {
      dispatch(setAlertMessageState(t('Your login is over. Please log-in again')))
      gotoPage('/sign-in')
    }
  }

  let requestOtp = async () => {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      let res = await authApi.requestOtp({
        params: {
          language: i18n.language === 'en-US' ? 'eng' : 'zho',
          country_code: formik.values.areaCode,
          phone: formik.values.phone,
          verify_type: 'change_phone',
          token: accessToken!,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  let FetchData = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) gotoPage('/sign-in')
    try {
      let res = await memberApi.getProfile({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
        },
      })
      if (res.data.status) {
        const resData = res.data.params as IGetProfileDataResponse
        setProfile(resData)
        formik.setValues({
          name: resData.name,
          email: resData.email,
          birthday: resData.date_of_birth,
          areaCode: resData.country_code,
          phone: resData.phone,
        })
      } else {
        dispatch(setAlertMessageState(capitalize(res.data.message.replaceAll('_', ' '))))
        gotoPage('/sign-in')
      }
    } catch (error) {
      console.log(error)
      dispatch(setAlertMessageState(t('Error when loading your profile data')))
      gotoPage('/')
    }
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
    if (!isMounted()) return
    updateAvatar()
  }, [selectedAvatar])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return step === 0 ? (
    <div className={`w-full h-fit flex flex-col justify-start items-start gap-8 relative ${isSmallScreen ? 'py-4 px-6' : 'py-10 px-12'}`}>
      {isShowConfirmPopup && (
        <AppConfirmPopup message={t('Do you want to change your phone number?')} onCancel={() => setIsShowConfirmPopup(false)} onConfirm={handleUpdateProfileWithNewPhone} />
      )}
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex flex-row flex-wrap gap-1">
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
            {capitalizeFirstLetter(t('member center'))}
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center/my-profile')}>
            {t('My profile')}
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{capitalizeFirstLetter(t('edit'))}</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('edit my profile').toUpperCase()}</h1>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col gap-12">
        <div className="w-full h-fit px-3 py-1.5 flex flex-row gap-3 justify-start items-center">
          <img className="w-[70px] h-[70px] rounded-[50%]" src={profile?.image ? profile.image : '/img/img-avt.png'} alt="" />
          <div className="w-fit h-fit flex flex-row justify-center items-start gap-3">
            <input type="file" accept="image/*" ref={pickAvatarRef} onChange={handleFileChange} className=" absolute -z-20" />
            <Button className={classes.changeImageBtn} onClick={handleChangeImage}>
              {t('Change image')}
            </Button>
            <Button className={classes.deleteBtn} disabled>
              {t('Delete')}
            </Button>
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full h-fit flex flex-col gap-8">
        {/* Name Field */}
        <AppEditTextField
          label={capitalizeFirstLetter(t('name'))}
          fullWidth
          required
          margin="normal"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        {/* Email Field */}
        <AppEditTextField
          label={capitalizeFirstLetter(t('email'))}
          fullWidth
          required
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {/* Birthday Field */}
        {/* <AppEditTextField
          label="Birthday"
          fullWidth
          required
          id="birthday"
          name="birthday"
          type="date"
          value={formik.values.birthday}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.birthday && Boolean(formik.errors.birthday)}
          helperText={formik.touched.birthday && formik.errors.birthday}
        /> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl
            sx={{
              '& .MuiFormControl-root': {
                '& .MuiFormLabel-root': {
                  display: 'none',
                },

                '& fieldset': {
                  display: 'none',
                },

                '& .MuiInputBase-root': {
                  backgroundColor: '#F3F6F9',
                  color: '#1a1a1a',

                  '&:active,:focus,:hover': {
                    border: '2px solid #0596A6',
                  },
                },
              },
              '& .MuiFormLabel-root': {
                color: '#4d4d4d',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '500',

                '& .MuiFormLabel-asterisk': {
                  color: '#DA1E28',
                },
              },
            }}
          >
            <FormLabel required>{capitalizeFirstLetter(t('birthday'))}</FormLabel>
            <DatePicker
              label="Birthday"
              name="birthday"
              value={dayjs(formik.values.birthday)}
              onChange={(date) => formik.setFieldValue('birthday', getYYYYMMDD(dayjs(date).toString()), true)}
              format="YYYY/MM/DD"
            />
          </FormControl>
        </LocalizationProvider>
        {/* ... error handling (optional) */}

        <FormControl className={classes.formControl}>
          <FormLabel required>{t('Phone number')}</FormLabel>
          <Grid container className="w-full" spacing={'16px'}>
            <Grid item xs={3} sm={2} lg={1}>
              <TextField
                required
                margin="normal"
                id="areaCode"
                name="areaCode"
                value={formik.values.areaCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.areaCode && Boolean(formik.errors.areaCode)}
                helperText={formik.touched.areaCode && formik.errors.areaCode}
              />
            </Grid>
            <Grid item xs={9} sm={10} lg={11}>
              <TextField
                fullWidth
                required
                margin="normal"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
          </Grid>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" variant="contained" className={classes.submitBtn}>
          {t('Submit')}
        </Button>
      </form>
    </div>
  ) : (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-12 relative">
      <div className={classes.formContainer}>
        <div className="w-fit h-fit flex flex-row justify-center items-center cursor-pointer gap-2" onClick={() => setStep(0)}>
          <img className="w-auto h-3" src="/icon/Arrow - Left.svg" alt="" />
          <span className="text-xs not-italic font-[14px] text-[#999]">{capitalizeFirstLetter(t('back'))}</span>
        </div>
        <div className="flex flex-col w-full h-fit justify-start items-start">
          <h1 className="text-[40px] not-italic font-bold leading-[100%] tracking-[0.4px] mb-6 text-[#1a1a1a]">{t('Verify mobile number')}</h1>
          <div className="flex flex-row gap-1">
            <span className="text-base text-[#666] not-italic font-normal leading-[normal] mb-2">{t('Enter the OTP receive to')}</span>
            <span className="text-[#01B7CB] text-lg not-italic font-semibold leading-[normal]">{formik.values.phone}</span>
          </div>
        </div>
        <div className="relative flex flex-row justify-center w-fit items-center">
          {inputRef.map((refItem, index) => {
            return (
              <input
                className="w-14 h-14 mx-2 pc:w-14 pc:h-20 pc:mx-4 border border-solid text-[#1a1a1a] border-[#0596A6] text-lg text-center not-italic font-semibold leading-[normal] rounded-lg"
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
            <span className="text-xl not-italic font-semibold leading-[normal]">{capitalizeFirstLetter(t('verify'))}</span>
          </button>
          <div className="flex flex-row justify-center items-center gap-[10px] text-base not-italic font-medium leading-[normal]">
            <span className="text-[#1a1a1a]">{t('Don’t receive OTP ?')}</span>
            <span className="text-[#01B7CB] cursor-pointer" onClick={requestOtp}>
              {t('Resend')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
