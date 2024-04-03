/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './Register.style'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuProps,
  Select,
  TextField,
  useMediaQuery,
} from '@mui/material'
import AppDropdown from '@/components/AppDropdown'
import AppTextField from '@/components/AppTextField'
import AppCheckBox from '@/components/AppCheckBox'
import AppLanguageSwitch from '@/components/AppLanguageSwitch'
import AppButton from '@/components/AppButton'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import { capitalizeFirstLetter, getYYYYMMDD, gotoPage } from '@/utils/helpers/common'
import { IGetMemberSettingResponse } from '@/utils/api/setting'
import { authApi, settingApi } from '@/utils/api'
import { FormikProps, useFormik } from 'formik'
import * as Yup from 'yup'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import theme from '@/assets/theme'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

type ICoverBannerSize = {
  width: number
  height: number
}

type InitialValueType = {
  areaCode: string
  phone: string
  email: string
  name: string
  dob: string
  password: string
  confirmPassword: string
  gender: string
  referAreaCode: string
  referPhone: string
  confirmPapa: boolean
  confirmPolicy: boolean
}

const DEFAULT_INITIAL_VALUE: InitialValueType = {
  areaCode: '+852',
  phone: '',
  email: '',
  name: '',
  dob: '',
  password: '',
  confirmPassword: '',
  gender: '',
  referAreaCode: '+852',
  referPhone: '',
  confirmPapa: false,
  confirmPolicy: false,
}

export default function Register() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const phoneInputRef = useRef<HTMLInputElement | null>(null)
  const coverBannerRef = useRef(null)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(760))
  const dispatch = useDispatch()

  const [coverBannerSize, setCoverBannerSize] = useState<ICoverBannerSize>({
    width: 0,
    height: 0,
  })
  const [memberSettings, setMemberSettings] = useState<IGetMemberSettingResponse | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword)
  }

  const validationSchema = Yup.object({
    areaCode: Yup.string().required('Area Code is required'),
    phone: Yup.string().required(t('Phone number is required')),
    email: Yup.string()
      .email(t('Invalid email address'))
      .required(t('Email is required'))
      .test('emailFormat', t('Invalid email address'), (value) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value || '')
      }),
    name: Yup.string()
      .required(t('Name is required'))
      .test('no-blank-space', 'Name cannot be blank spaces', (value) => {
        return /^\s*$/.test(value) ? false : true
      }),
    dob: Yup.string().required(t('Date of Birth is required')),
    password: Yup.string().required(t('Password is required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password') ?? null, undefined], t('Passwords must match'))
      .required(t('Confirm Password is required')),
    gender: Yup.string().required(t('Gender is required')),
    referAreaCode: Yup.string(),
    referPhone: Yup.string(),
    confirmPolicy: Yup.boolean().oneOf([true], t('You must confirm')),
  })

  const formik = useFormik({
    initialValues: DEFAULT_INITIAL_VALUE,
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
      // register()
    },
  })

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

  let register = async () => {
    try {
      let res = await authApi.register({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          country_code: formik.values.areaCode,
          phone: formik.values.phone,
          name: formik.values.name,
          email: formik.values.email,
          password: formik.values.password,
          confirm_password: formik.values.confirmPassword,
          gender_id: formik.values.gender,
          date_of_birth: formik.values.dob,
          referral_member_phone: formik.values.referPhone,
          referral_member_country_code: formik.values.referAreaCode,
          receive_notification: formik.values.confirmPapa ? '1' : '0',
          policy_agreement: formik.values.confirmPolicy ? '1' : '0',
        },
      })
      if (res.data.status) {
        gotoPage('/verify-otp', `?params=${formik.values.areaCode.split('+')[1]}__${formik.values.phone}__register`)
      } else {
        dispatch(setAlertMessageState(`${t('Register failed.')} ${capitalize(res.data.message.replaceAll('_', ' '))}`))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the pressed key is 'Enter'
    if (e.key === 'Enter') {
      // Manually trigger the form submission
      formik.submitForm()
    }
  }

  let FetchData = async () => {
    try {
      await getMemberSettings()
    } catch (error) {
      console.log('FetchData', error)
    }
  }

  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus()
    }
    if (!isMounted()) {
      FetchData()
    }

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
    if (isMounted()) {
      FetchData()
    }

    if (!coverBannerRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      setCoverBannerSize({
        height: coverBannerRef.current ? (coverBannerRef.current as any).offsetHeight : 0,
        width: coverBannerRef.current ? (coverBannerRef.current as any).offsetWidth : 0,
      })
    })
    resizeObserver.observe(coverBannerRef.current)
    return () => resizeObserver.disconnect() // clean up
  }, [locale])

  const { classes } = useStyles({
    params: {
      coverBannerHeight: coverBannerSize.height,
      coverBannerWidth: coverBannerSize.width,
      coverBannerUrl: '/img/account-cover.png',
    },
  })

  const menuProps: Partial<MenuProps> = {
    classes: {
      list: classes.listAC,
      paper: classes.paperAC,
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    // getContentAnchorEl: null,
  }

  let isMounted = useIsMounted()

  return (
    <form className={classes.formContainer} onSubmit={formik.handleSubmit}>
      {isSmallScreen ? (
        <Box
          sx={{
            width: '100px',
            height: '100px',
            margin: '0px auto',
            padding: '20px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Box sx={{ zIndex: 3, position: 'absolute', top: '20px', left: '20px' }}>
            <img className="w-[60px] h-[60px] z-10" src="/icon/logo.svg" alt="" />
          </Box>
          <Box
            sx={{
              width: '100px',
              height: '100px',
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
      <div className={`${classes.inputFields} scrollableDiv`}>
        <div className="flex flex-row w-full h-fit gap-5">
          <FormControl
            fullWidth
            margin="normal"
            sx={{
              minWidth: 'fit-content',
              width: '140px',
              height: '56px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0px !important',

              '& .MuiInputBase-root': {
                color: '#fff',
                borderColor: formik.touched.areaCode && Boolean(formik.errors.areaCode) ? 'red' : '#0596A6',
                borderWidth: 'px',
                borderStyle: 'solid',
                borderRadius: '8px',
                minWidth: 'fit-content',
                justifyContent: 'center',
                width: '140px',
                height: '56px',

                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: formik.touched.areaCode && Boolean(formik.errors.areaCode) ? 'red' : '#0596A6',
                },
                '& .MuiSelect-select': {
                  paddingRight: '0px',
                },
              },

              '& svg': {
                // margin: '0 12px'
                width: '24px',
                height: '24px',
                color: '#fff',
                position: 'absolute',
                right: 12,
                top: 16,
              },
              '& .MuiSvgIcon-root': {
                marginLeft: '12px !important',
              },
              '& .AppDropdown-select': {},
            }}
          >
            <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
              <Select
                classes={{
                  select: classes.selectAC,
                  icon: classes.selectIconAC,
                }}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={menuProps}
                IconComponent={ExpandMoreIcon}
                id="areaCode"
                name="areaCode"
                value={formik.values.areaCode}
                onChange={formik.handleChange}
                error={formik.touched.areaCode && Boolean(formik.errors.areaCode)}
              >
                {memberSettings?.country_code?.map((codeItem) => (
                  <MenuItem key={codeItem.id} value={codeItem.id}>
                    {codeItem.name}
                  </MenuItem>
                ))}
              </Select>
              <div className="w-fit h-full absolute flex justify-center items-center left-3">
                <img className="w-6 h-6 " src="/icon/call.svg" alt="" />
              </div>
            </FormControl>
          </FormControl>
          <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
            <TextField
              inputRef={phoneInputRef}
              id="phone"
              name="phone"
              placeholder={t('Phone number')}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              className={classes.TF}
              InputProps={{
                style: { borderColor: '#0596A6', backgroundColor: 'transparent' },
                placeholder: t('Phone number'),
              }}
              autoComplete="new-phone"
              onKeyDown={handleKeyPress}
            />
          </FormControl>
        </div>
        <FormControl fullWidth margin="normal" className={classes.FCTF} sx={{ margin: '0px !important' }}>
          <TextField
            id="email"
            name="email"
            placeholder={capitalizeFirstLetter(t('Email'))}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            className={classes.TF}
            // autoComplete="new-email"
            InputProps={{
              style: { borderColor: '#0596A6' },
              placeholder: capitalizeFirstLetter(t('email')),
            }}
            inputProps={{ style: { color: '#fff' } }}
            sx={{
              '& .MuiInputBase-root': {
                paddingLeft: '30px',
              },
            }}
            onKeyDown={handleKeyPress}
          />
          <div className="w-fit top-4 absolute left-3 flex justify-center items-center">
            <img className="w-6 h-6" src="/icon/mail.svg" />
          </div>
        </FormControl>
        <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
          <TextField
            id="name"
            name="name"
            placeholder={capitalizeFirstLetter(t('name'))}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            className={classes.TF}
            autoComplete="new-name"
            sx={{
              '& .MuiInputBase-root': {
                paddingLeft: '30px',
              },
            }}
            onKeyDown={handleKeyPress}
          />
          <div className="w-fit top-4 absolute left-3 flex justify-center items-center">
            <img className="w-6 h-6" src="/icon/account.svg" />
          </div>
        </FormControl>
        {/* <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
          <TextField
            id="dob"
            name="dob"
            placeholder="YYYY/MM/DD"
            type="date"
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
            className={classes.TF}
            inputProps={{ style: { backgroundColor: 'transparent' } }}
            sx={{
              '& .MuiInputBase-root': {
                paddingLeft: '30px',
              },
              '& input': {
                colorScheme: 'dark',
              },
            }}
            onKeyDown={handleKeyPress}
          />
          <div className="w-fit top-4 absolute left-3 flex justify-center items-center">
            <img className="w-6 h-6" src="/icon/calendar.svg" />
          </div>
        </FormControl> */}
        <FormControl sx={{ width: '100%' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl
              sx={{
                width: '100%',
                border: `1px solid ${formik.touched.dob && formik.errors.dob ? '#DA1E28' : '#0596A6'}`,
                borderRadius: '12px',

                '&:active,:focus,:hover': {
                  border: `2px solid ${formik.touched.dob && formik.errors.dob ? '#DA1E28' : '#0596A6'}`,
                  borderRadius: '12px',
                },

                '& .MuiFormControl-root': {
                  paddingLeft: '30px',
                  '& .MuiFormLabel-root': {
                    display: 'none',
                  },

                  '& fieldset': {
                    display: 'none',
                  },

                  '& .MuiInputBase-root': {
                    // backgroundColor: '#F3F6F9',
                    color: '#fff',
                  },

                  '& svg': {
                    color: '#F3F6F9',
                  },
                },
                '& .MuiFormLabel-root': {
                  color: '#1a1a1a',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: '500',

                  '& .MuiFormLabel-asterisk': {
                    color: '#DA1E28',
                  },
                },
              }}
            >
              <div className="w-fit top-4 absolute left-3 flex justify-center items-center">
                <img className="w-6 h-6" src="/icon/calendar.svg" />
              </div>
              <DatePicker
                // label="Birthday"
                sx={{ width: '100%' }}
                name="birthday"
                value={dayjs(formik.values.dob)}
                onChange={(date) => formik.setFieldValue('dob', getYYYYMMDD(dayjs(date).toString()), true)}
                format="YYYY/MM/DD"
              />
            </FormControl>
            {formik.touched.dob && formik.errors.dob && <FormHelperText sx={{ color: '#FF6261' }}>{formik.errors.dob}</FormHelperText>}
          </LocalizationProvider>
        </FormControl>

        <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
          <TextField
            id="password"
            name="password"
            placeholder={capitalizeFirstLetter(t('password'))}
            type={showPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            className={classes.TF}
            autoComplete="new-pw"
            sx={{
              '& .MuiInputBase-root': {
                paddingLeft: '30px',
              },
              '& input': {
                colorScheme: 'dark',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ color: '#fff' }}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={handleKeyPress}
          />
          <div className="w-fit top-4 absolute left-3 flex justify-center items-center">
            <img className="w-6 h-6" src="/icon/password.svg" />
          </div>
        </FormControl>
        <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            placeholder={capitalizeFirstLetter(t('confirm password'))}
            type={showConfirmPassword ? 'text' : 'password'}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            autoComplete="new-cpw"
            className={classes.TF}
            sx={{
              '& .MuiInputBase-root': {
                paddingLeft: '30px',
              },
              '& input': {
                colorScheme: 'dark',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility} edge="end" sx={{ color: '#fff' }}>
                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={handleKeyPress}
          />
          <div className="w-fit top-4 absolute left-3 flex justify-center items-center">
            <img className="w-6 h-6" src="/icon/password.svg" />
          </div>
        </FormControl>
        <FormControl
          fullWidth
          margin="normal"
          sx={{
            minWidth: 'fit-content',
            margin: '0px !important',

            '& .MuiInputBase-root': {
              color: '#fff',
              borderColor: formik.touched.gender && Boolean(formik.errors.gender) ? 'red' : '#0596A6',
              borderWidth: 'px',
              borderStyle: 'solid',
              borderRadius: '8px',
              minWidth: 'fit-content',
              justifyContent: 'center',

              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: formik.touched.gender && Boolean(formik.errors.gender) ? 'red' : '#0596A6',
              },
              '& .MuiSelect-select': {
                paddingRight: '0px',
              },
            },

            '& svg': {
              // margin: '0 12px'
              width: '24px',
              height: '24px',
              color: '#fff',
              position: 'absolute',
              right: 12,
              top: 16,
            },
            '& .MuiSvgIcon-root': {
              marginLeft: '12px !important',
            },
            '& .AppDropdown-select': {},
          }}
        >
          <Select
            className={classes.selectAC}
            sx={{
              paddingLeft: '32px !important',
            }}
            id="gender"
            name="gender"
            placeholder={capitalizeFirstLetter(t('gender'))}
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
          >
            <MenuItem value="male">{t('Male')}</MenuItem>
            <MenuItem value="female">{t('Female')}</MenuItem>
          </Select>
          {formik.touched.gender && formik.errors.gender && <FormHelperText sx={{ color: '#FF6261' }}>{formik.errors.gender}</FormHelperText>}
          <div className="w-fit top-4 absolute flex justify-center items-center left-3">
            <img className="w-6 h-6 " src="/icon/gender.svg" alt="" />
          </div>
          {formik.values.gender === '' && <span className="text-white absolute top-4 left-11 text-base font-normal">{capitalizeFirstLetter(t('gender'))}</span>}
        </FormControl>
        <div className="flex flex-row w-full h-fit gap-5">
          <FormControl
            fullWidth
            margin="normal"
            sx={{
              minWidth: 'fit-content',
              width: '140px',
              height: '56px',
              display: 'flex',
              flexDirection: 'col',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0px !important',

              '& .MuiInputBase-root': {
                color: '#fff',
                borderColor: formik.touched.areaCode && Boolean(formik.errors.areaCode) ? 'red' : '#0596A6',
                borderWidth: 'px',
                borderStyle: 'solid',
                borderRadius: '8px',
                minWidth: 'fit-content',
                justifyContent: 'center',
                width: '140px',
                height: '56px',

                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: formik.touched.areaCode && Boolean(formik.errors.areaCode) ? 'red' : '#0596A6',
                },
                '& .MuiSelect-select': {
                  paddingRight: '0px',
                },
              },

              '& svg': {
                // margin: '0 12px'
                width: '24px',
                height: '24px',
                color: '#fff',
                position: 'absolute',
                right: 12,
                top: 16,
              },
              '& .MuiSvgIcon-root': {
                marginLeft: '12px !important',
              },
              '& .AppDropdown-select': {},
            }}
          >
            <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
              <Select
                classes={{
                  select: classes.selectAC,
                  icon: classes.selectIconAC,
                }}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={menuProps}
                IconComponent={ExpandMoreIcon}
                id="referAreaCode"
                name="referAreaCode"
                value={formik.values.referAreaCode}
                onChange={formik.handleChange}
                error={formik.touched.referAreaCode && Boolean(formik.errors.referAreaCode)}
              >
                {memberSettings?.country_code?.map((codeItem) => (
                  <MenuItem key={codeItem.id} value={codeItem.id}>
                    {codeItem.name}
                  </MenuItem>
                ))}
              </Select>
              <div className="w-fit h-full absolute flex justify-center items-center left-3">
                <img className="w-6 h-6 " src="/icon/gift.svg" alt="" />
              </div>
            </FormControl>
          </FormControl>
          <FormControl fullWidth margin="normal" sx={{ margin: '0px !important' }}>
            <TextField
              id="referPhone"
              name="referPhone"
              placeholder={t('referPhone')}
              value={formik.values.referPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.referPhone && Boolean(formik.errors.referPhone)}
              className={classes.TF}
              autoComplete="new-rphone"
              InputProps={{
                style: { borderColor: '#0596A6' },
                placeholder: t("Referer's phone"),
              }}
              inputProps={{ style: { color: '#fff' } }}
              onKeyDown={handleKeyPress}
            />
          </FormControl>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ color: '#0596A6' }}
              id="confirmPapa"
              name="confirmPapa"
              checked={formik.values.confirmPapa}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              color="primary"
            />
          }
          label={t('I accept to receive shop updates, promotions and other marketing information from Cleaning Papa')}
          sx={{ color: '#fff' }}
        />
        <FormControlLabel
          control={
            <Checkbox
              sx={{ color: '#0596A6' }}
              id="confirmPolicy"
              name="confirmPolicy"
              checked={formik.values.confirmPolicy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              color="primary"
            />
          }
          label={t("I agree to the shop's Terms of Use and Privacy Policy")}
          sx={{ color: formik.errors.confirmPolicy ? '#FF6261' : '#fff' }}
        />
      </div>
      <div className="flex flex-col w-full h-fit gap-4 justify-center items-center">
        <AppLanguageSwitch />
        <AppButton type="submit" variant="contained" sx={{ padding: '12px 0' }} width="100%">
          <span>{t('Create an account')}</span>
        </AppButton>
        <div className="flex justify-center items-center w-full">
          <div className={`flex flex-row flex-wrap justify-center items-center gap-[10px] ${classes.createAccountTexts}`}>
            <p>{t('Do have an account?')}</p>
            <p className="text-[#01B7CB] cursor-pointer" onClick={() => gotoPage('/sign-in')}>
              {t('Login')}
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
