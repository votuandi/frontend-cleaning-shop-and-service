/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './MyProfile.style'
import { Button, Divider, Grid, useMediaQuery } from '@mui/material'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetProfileDataResponse } from '@/utils/api/member'
import memberApi from '@/utils/api/member/member.api'
import { capitalize } from 'lodash'
import theme from '@/assets/theme'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

export default function MyProfile() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(700))
  const dispatch = useDispatch()

  const [profile, setProfile] = useState<IGetProfileDataResponse>()

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
        setProfile(res.data.params)
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

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className={`w-full h-fit flex flex-col justify-start items-start gap-8 ${isSmallScreen ? 'px-4 py-6' : 'py-10 px-6'}`}>
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex flex-row flex-wrap gap-1">
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
            {capitalizeFirstLetter(t('member center'))}
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('My profile')}</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('My profile').toUpperCase()}</h1>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col gap-12">
        <div className={`w-full h-fit px-3 py-1.5 flex gap-[70px] justify-start items-center ${isSmallScreen ? 'flex-col' : 'flex-row'}`}>
          <img className="w-[180px] h-[180px] rounded-[50%]" src={profile?.image ? profile.image : '/icon/ic-avt.png'} alt="" />
          <div className="w-full h-fit flex flex-col justify-start items-start gap-6">
            <Grid container spacing={'16px'}>
              <Grid xs={4} md={3}>
                <span className="text-[#808080] text-base font-normal">{capitalizeFirstLetter(t('name'))}</span>
              </Grid>
              <Grid xs={8} md={9}>
                <span className="text-[#1a1a1a] text-base font-semibold">{profile?.name}</span>
              </Grid>
            </Grid>

            <Grid container spacing={'16px'}>
              <Grid xs={4} md={3}>
                <span className="text-[#808080] text-base font-normal">{capitalizeFirstLetter(t('email'))}</span>
              </Grid>
              <Grid xs={8} md={9}>
                <span className="text-[#1a1a1a] text-base font-semibold">{profile?.email}</span>
              </Grid>
            </Grid>

            <Grid container spacing={'16px'}>
              <Grid xs={4} md={3}>
                <span className="text-[#808080] text-base font-normal">{capitalizeFirstLetter(t('birthday'))}</span>
              </Grid>
              <Grid xs={8} md={9}>
                <span className="text-[#1a1a1a] text-base font-semibold">{profile?.date_of_birth}</span>
              </Grid>
            </Grid>

            <Grid container spacing={'16px'}>
              <Grid xs={4} md={3}>
                <span className="text-[#808080] text-base font-normal">{t('Phone number')}</span>
              </Grid>
              <Grid xs={8} md={9}>
                <span className="text-[#1a1a1a] text-base font-semibold">{`${profile?.country_code} ${profile?.phone}`}</span>
              </Grid>
            </Grid>
          </div>
        </div>
        <button
          className="w-fit min-w-[280px] h-12 rounded-lg border-[1px] solid bg-[#0596A6] text-white text-lg font-medium px-8 mx-auto"
          onClick={() => gotoPage('/member-center/my-profile/edit')}
        >
          {capitalizeFirstLetter(t('edit'))}
        </button>
      </div>
    </div>
  )
}
