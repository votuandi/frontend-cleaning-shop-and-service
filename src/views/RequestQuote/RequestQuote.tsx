/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { serviceApi, transactionApi } from '@/utils/api'
import * as Yup from 'yup'
import { Form, Formik, useFormik } from 'formik'
import { FormControl, FormLabel, Grid, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import useStyles from './RequestQuote.style'
import { capitalizeFirstLetterAllWords, getYYYYMMDD, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetServiceDetailResponse } from '@/utils/api/service'
import AppFormTextField from '@/components/AppFormTextField'
import theme from '@/assets/theme'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

const INITIAL_VALUES = {
  name: '',
  email: '',
  areaCode: '',
  phone: '',
  estimatedImplementDate: getYYYYMMDD(Date.now() / 1000),
  title: '',
  address: '',
  inputMessage: '',
}

export default function RequestQuote() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const { query } = router
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(900))
  const dispatch = useDispatch()

  const [serviceId, setServiceId] = useState<string>('')
  const [serviceDetail, setServiceDetail] = useState<IGetServiceDetailResponse>()

  let getServiceDetail = async (sid?: string) => {
    try {
      let res = await serviceApi.getDetail({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          service_id: sid ? sid : serviceId,
        },
      })
      if (res.data.status) {
        setServiceDetail(res.data.params)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('Name is required')),
    email: Yup.string().required(t('Email is required')).email(t('Invalid email address')),
    areaCode: Yup.string().required(t('Area Code is required')),
    phone: Yup.number().required(t('Phone number is required')),
    estimatedImplementDate: Yup.string().required(t('Estimated implement date required')),
    title: Yup.string().required(t('Title is required')),
    address: Yup.string().required(t('Address is required')),
    inputMessage: Yup.string().required(t('Message is required')),
  })

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const storageAvailable = localStorageAvailable()
        const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
        if (!accessToken) {
          // if (confirm("You haven't signed in. Go to log in now?")) {
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
          } else return
        } else {
          let res = await transactionApi.createQuotation({
            params: {
              language: locale === 'en-US' ? 'eng' : 'zho',
              token: accessToken,
              name: values.name,
              email: values.email,
              country_code: values.areaCode,
              phone: values.phone,
              implemented_date: values.estimatedImplementDate,
              address: values.address,
              service_id: serviceId,
              title: values.title,
              message: values.inputMessage,
            },
          })
          if (res.data.status) {
            dispatch(setAlertMessageState(t('We have received your quotation!')))
            formik.resetForm()
          } else {
            dispatch(setAlertMessageState(t('Sending your quotation failed. Please try again!')))
          }
        }
      } catch (error) {
        console.log(error)
        dispatch(setAlertMessageState(t('Sending your quotation failed. Please try again!')))
      }
    },
  })

  useEffect(() => {
    if (isMounted()) return
    if (query.sid) {
      setServiceId(query.sid as string)
      getServiceDetail(query.sid as string)
    }
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    getServiceDetail()
  }, [locale])

  const { classes } = useStyles({
    params: {
      isError: false,
    },
  })
  let isMounted = useIsMounted()

  return (
    <>
      <div className={`w-full h-fit flex flex-col justify-start items-start gap-10 px-6 ${isSmallScreen ? 'py-5' : 'py-10'}`}>
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-row flex-wrap gap-1">
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/news')}>
              {capitalizeFirstLetterAllWords(t('news & promotions'))}
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3]">{serviceDetail?.type_name}</span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3]">{serviceDetail?.category_name}</span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('Request a quote')}</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-4 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('Request a quote').toUpperCase()}</h1>
          </div>
          <p className="text-[#808080] text-base font-normal mt-2">{serviceDetail?.ServiceLanguage?.introduction}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit()
          }}
          className="w-full h-fit flex flex-col gap-6"
        >
          <div className="w-full flex flex-row flex-wrap justify-between items-center border-b-[1px] solid border-[#E6E6E6] py-[10px]">
            <div className="w-fit flex flex-row justify-center items-center gap-2 mr-5">
              <span className="text-[#4d4d4d] text-base font-normal">{t('Categories')}</span>
              <span className="text-[#1a1a1a] text-base font-medium">{serviceDetail?.category_name}</span>
            </div>
            <div className="w-fit flex flex-row justify-center items-center gap-2">
              <span className="text-[#3a3434] text-base font-normal">{capitalizeFirstLetterAllWords(t('service'))}</span>
              <span className="text-[#1a1a1a] text-base font-medium">{serviceDetail?.ServiceLanguage?.title}</span>
            </div>
          </div>
          <Grid container spacing={'30px'}>
            <Grid item xs={12} md={6}>
              <AppFormTextField
                fullWidth
                required
                label={capitalizeFirstLetterAllWords(t('name'))}
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                helperText={formik.touched.name && formik.errors.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                placeholder={t('Enter your name')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppFormTextField
                fullWidth
                required
                label={capitalizeFirstLetterAllWords(t('email'))}
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                helperText={formik.touched.email && formik.errors.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                placeholder="example@abc.com"
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'col' }}>
              <FormControl className={classes.formControl}>
                <FormLabel required={true}>Phone/Whatsapp</FormLabel>
                <div className="w-full flex flex-row gap-4 justify-center items-start">
                  <TextField
                    sx={{
                      width: 'fit-content',

                      '& .MuiFormHelperText-root': {
                        color: '#DA1E28',
                        fontSize: 12,
                      },
                    }}
                    type="text"
                    id="areaCode"
                    name="areaCode"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.areaCode}
                    helperText={formik.touched.areaCode && formik.errors.areaCode}
                    error={formik.touched.areaCode && Boolean(formik.errors.areaCode)}
                    hiddenLabel
                    placeholder="+34"
                  />
                  <TextField
                    sx={{
                      width: '100%',

                      '& .MuiFormHelperText-root': {
                        color: '#DA1E28',
                        fontSize: 12,
                      },
                    }}
                    id="phone"
                    name="phone"
                    hiddenLabel
                    placeholder={t('Enter your phone number')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    helperText={formik.touched.phone && formik.errors.phone}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                  />
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              {/* <AppFormTextField
              fullWidth
              required
              label={'Estimated implement date'}
              id="estimatedImplementDate"
              name="estimatedImplementDate"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.estimatedImplementDate}
              helperText={formik.touched.estimatedImplementDate && formik.errors.estimatedImplementDate}
              error={formik.touched.estimatedImplementDate && Boolean(formik.errors.estimatedImplementDate)}
              placeholder="Enter estimated implement date"
            /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl
                  sx={{
                    width: '100%',
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
                  <FormLabel required>{t('Estimated Implement Date')}</FormLabel>
                  <DatePicker
                    // label="Birthday"
                    name="estimatedImplementDate"
                    value={dayjs(formik.values.estimatedImplementDate)}
                    onChange={(date) => formik.setFieldValue('estimatedImplementDate', getYYYYMMDD(dayjs(date).toString()), true)}
                    format="YYYY/MM/DD"
                  />
                </FormControl>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppFormTextField
                fullWidth
                required
                label={t('Title')}
                id="title"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                helperText={formik.touched.title && formik.errors.title}
                error={formik.touched.title && Boolean(formik.errors.title)}
                placeholder={t('Enter title')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppFormTextField
                fullWidth
                required
                label={t('Address')}
                id="address"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                helperText={formik.touched.address && formik.errors.address}
                error={formik.touched.address && Boolean(formik.errors.address)}
                placeholder={t('Enter your address')}
              />
            </Grid>
            <Grid item xs={12}>
              <AppFormTextField
                fullWidth
                required
                rows={5}
                label={t('Message')}
                id="inputMessage"
                name="inputMessage"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.inputMessage}
                helperText={formik.touched.inputMessage && formik.errors.inputMessage}
                error={formik.touched.inputMessage && Boolean(formik.errors.inputMessage)}
                placeholder={t('Enter your message')}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button type="submit" className="w-fit h-12 rounded-lg border-[1px] solid bg-[#0596A6] text-white text-lg font-medium px-8 mx-auto">
                {t('Get a quotation')}
              </button>
            </Grid>
          </Grid>
        </form>
      </div>
      <div id="popup-root"></div>
    </>
  )
}
