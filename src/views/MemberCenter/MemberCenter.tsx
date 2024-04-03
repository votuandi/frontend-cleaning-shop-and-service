/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './MemberCenter.style'
import { Button, Divider, Grid, useMediaQuery } from '@mui/material'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import memberApi, { IGetMemberDataResponse } from '@/utils/api/member'
import { capitalize } from 'lodash'
import theme from '@/assets/theme'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

export default function MemberCenter() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(900))
  const dispatch = useDispatch()

  const [memberData, setMemberData] = useState<IGetMemberDataResponse>()

  let FetchData = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) gotoPage('/sign-in')
    try {
      let res = await memberApi.getMemberData({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
        },
      })
      if (res.data.status) {
        setMemberData(res.data.params)
      } else {
        dispatch(setAlertMessageState(capitalize(res.data.message.replaceAll('_', ' '))))
        gotoPage('/sign-in')
      }
    } catch (error) {
      console.log(error)
      dispatch(setAlertMessageState(t('Error when loading your member data')))
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
      <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
        <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('member center').toUpperCase()}</h1>
      </div>
      <div className="w-full h-fit flex flex-col gap-12">
        <div className="w-full h-fit px-3 py-1.5 flex flex-row gap-3 justify-start items-center">
          <img className="w-[70px] h-[70px] rounded-[50%]" src={memberData?.image ? memberData.image : '/icon/ic-avt.png'} alt="" />
          <div className="w-fit h-fit flex flex-col justify-center items-start gap-1">
            <span className="text-black text-lg font-semibold">{memberData?.name}</span>
            <span className="text-[#B3B3B3] text-sm font-normal">{memberData?.email}</span>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row justify-between">
          <Grid container className={classes.gridRow} spacing={isSmallScreen ? 0 : '48px'} rowSpacing={isSmallScreen ? '48px' : 0}>
            <Grid item xs={12} md={6}>
              <div className={classes.gridColumn}>
                <div className={classes.rowItem} onClick={() => gotoPage('/member-center/my-profile')}>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <img src="/icon/ic-member.svg" alt="" />
                    <h3>{t('My profile')}</h3>
                  </div>
                  <img className="cursor-pointer" src="/icon/arrow-right.svg" alt="" />
                </div>
                <Divider />
                <div className={classes.rowItem} onClick={() => gotoPage('/member-center/my-address')}>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <img src="/icon/map.svg" alt="" />
                    <h3>{t('My address')}</h3>
                  </div>
                  <img className="cursor-pointer" src="/icon/arrow-right.svg" alt="" />
                </div>
                <Divider />
                <div className={classes.rowItem}>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <img src="/icon/wallet.svg" alt="" />
                    <h3>{t('My deposit')}</h3>
                    <span>HK$ {memberData?.deposit}</span>
                  </div>
                </div>
                <Divider />
                <div className={classes.rowItem}>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <img src="/icon/point.svg" alt="" />
                    <h3>{t('My point')}</h3>
                    <span>
                      {memberData?.points} {t('points')}
                    </span>
                  </div>
                  <Button className={classes.pointBtn} onClick={() => gotoPage('/member-center/point-history')}>
                    {t('Point history')}
                  </Button>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className={classes.gridColumn}>
                <div className={classes.rowItem} onClick={() => gotoPage('/member-center/my-coupon')}>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <img src="/icon/coupon.svg" alt="" />
                    <h3>{t('My coupon')}</h3>
                  </div>
                  <img className="cursor-pointer" src="/icon/arrow-right.svg" alt="" />
                </div>
                <Divider />
                <div className={classes.rowItem} onClick={() => gotoPage('/member-center/my-quotation')}>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <img src="/icon/quotation.svg" alt="" />
                    <h3>{t('My quotation')}</h3>
                  </div>
                  <img className="cursor-pointer" src="/icon/arrow-right.svg" alt="" />
                </div>
                <Divider />
                <div className={classes.rowItem} onClick={() => gotoPage('/member-center/my-order')}>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <img src="/icon/order.svg" alt="" />
                    <h3>{t('My order')}</h3>
                  </div>
                  <img className="cursor-pointer" src="/icon/arrow-right.svg" alt="" />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}
