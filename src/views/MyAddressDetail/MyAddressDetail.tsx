/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import router, { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './MyAddressDetail.style'
import { Button, Divider, FormControl, FormControlLabel, Grid, InputLabel, Radio, Switch, TextField } from '@mui/material'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetAddressDetailResponse, IGetAddressListResponse, IGetProfileDataResponse } from '@/utils/api/member'
import memberApi from '@/utils/api/member/member.api'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import AppEditTextField from '@/components/AppEditTextField'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import ReactDOM from 'react-dom'
import AppConfirm from '@/components/AppConfirm'

type Query = {
  slug: string
}

const DEFAULT_INITIAL_VALUE = {
  name: '',
  default: true,
  address: '',
  phone: '',
}

export default function MyAddressDetail() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const query = router.query as unknown as Query
  const dispatch = useDispatch()

  const [addressId, setAddressId] = useState<string | number>()
  const [initialValues, setInitialValues] = useState<typeof DEFAULT_INITIAL_VALUE>(DEFAULT_INITIAL_VALUE)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('Name is required')),
    address: Yup.string().required(t('Address is required')),
    phone: Yup.number().required('Phone number is required'),
  })

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) gotoPage('/sign-in')
      try {
        let res = await memberApi.updateAddress({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
            name: values.name,
            address: values.address,
            phone: values.phone,
            is_default: values.default ? 1 : 0,
            address_id: addressId!,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(t('Updating address successfully!')))
        } else {
          dispatch(setAlertMessageState(`${t('Updating address failed.')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
        }
      } catch (error) {
        console.log(error)
        dispatch(setAlertMessageState(t('Updating address failed')))
      }
    },
  })

  const handleDeleteAddress = async () => {
    // if (!confirm('Would you like to delete this address?')) {
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
        <AppConfirm onConfirm={handleConfirm} onCancel={handleCancel} message={`${t('Would you like to delete this address?')}`} />,
        document.getElementById('popup-root') // Replace 'popup-root' with your root element id
      )
    })
    if (!confirmation) {
      return
    }
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      return
    } else {
      try {
        let res = await memberApi.updateAddress({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            address_id: addressId!,
            is_default: formik.values.default ? 1 : 0,
            name: formik.values.name,
            phone: formik.values.phone,
            address: formik.values.address,
            is_delete: 1,
          },
        })
        if (res.data.status) {
          dispatch(setAlertMessageState(t('Delete address successfully!')))
          gotoPage('/member-center/my-address')
        } else {
          dispatch(setAlertMessageState(`${t('Delete address failed!')}\n${capitalize(res.data.message.replaceAll('_', ' '))}`))
        }
      } catch (error) {
        console.log(error)
        dispatch(setAlertMessageState(t('Delete address failed!')))
      }
    }
  }

  const getAddressDetail = async (_id?: string | number) => {
    if (_id) {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) gotoPage('/sign-in')
      let res = await memberApi.getAddressDetail({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
          address_id: _id,
        },
      })
      if (res.data.status) {
        let addressDetail = res.data.params as IGetAddressDetailResponse
        formik.setValues({
          name: addressDetail.name,
          default: addressDetail.is_default,
          address: addressDetail.address,
          phone: addressDetail.phone,
        })
      } else {
        dispatch(setAlertMessageState(t('Loading address data failed!')))
      }
      try {
      } catch (error) {
        console.log(error)
        dispatch(setAlertMessageState(t('Loading address data failed!')))
      }
    } else {
      dispatch(setAlertMessageState(t('Loading address data failed!')))
      router.back()
    }
  }

  let FetchData = async (_id?: number | string) => {
    await getAddressDetail(_id)
  }

  useEffect(() => {
    if (isMounted()) return
    const _id = query.slug.split('-').reverse()[0]
    setAddressId(_id)
    FetchData(_id)
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    FetchData(addressId)
  }, [locale])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <>
      <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-full h-fit flex flex-row flex-wrap gap-1">
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
              {capitalizeFirstLetter(t('member center'))}
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center/my-address')}>
              {t('My address')}
            </span>
            <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
            <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{capitalizeFirstLetter(t('edit my address'))}</span>
          </div>
          <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
            <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('edit my address').toUpperCase()}</h1>
          </div>
        </div>
        <div className="w-full h-fit flex flex-col gap-10">
          <form onSubmit={formik.handleSubmit} className="w-full h-fit flex flex-col gap-8">
            <Grid container spacing="30px" sx={{ width: '100%' }}>
              <Grid item xs={12} lg={6}>
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
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel sx={{ color: '#4d4d4d', fontSize: '16px', fontStyle: 'normal', fontWeight: '500' }}>{t('Default')}</InputLabel>
                <FormControl sx={{ padding: '16px' }}>
                  <Switch name="default" checked={formik.values.default} onChange={formik.handleChange} sx={{ marginLeft: '-12px' }} />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={6}>
                <AppEditTextField
                  label={t('Address')}
                  fullWidth
                  required
                  margin="normal"
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <AppEditTextField
                  label={t('Phone number')}
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
              <Grid item xs={12} lg={6}>
                <button
                  type="button"
                  className="w-full min-w-[280px] h-12 rounded-lg border-[1px] border-[#0596A6] solid bg-white text-[#0596A6] text-lg font-medium px-8 mx-auto"
                  onClick={handleDeleteAddress}
                >
                  {t('Delete')}
                </button>
              </Grid>
              <Grid item xs={12} lg={6}>
                <button type="submit" className="w-full min-w-[280px] h-12 rounded-lg border-[1px] solid bg-[#0596A6] text-white text-lg font-medium px-8 mx-auto">
                  {t('Save')}
                </button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
      <div id="popup-root"></div>
    </>
  )
}
