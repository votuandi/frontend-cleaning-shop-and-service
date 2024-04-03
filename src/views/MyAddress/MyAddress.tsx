/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Router, useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import useStyles from './MyAddress.style'
import { Button, Divider, Grid, Radio } from '@mui/material'
import { capitalizeFirstLetter, gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetAddressListResponse, IGetProfileDataResponse } from '@/utils/api/member'
import memberApi from '@/utils/api/member/member.api'
import router from 'next/router'
import { capitalize } from 'lodash'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'

export default function MyAddress() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const dispatch = useDispatch()

  const [listAddress, setListAddress] = useState<IGetAddressListResponse>([])

  let updateDefaultAddress = async (_id: string | number) => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      dispatch(setAlertMessageState(t('Expired login. Please login!')))
      gotoPage('/sign-in')
    } else
      try {
        let res = await memberApi.updateDefaultAddress({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
            address_id: _id,
            is_default: 1,
          },
        })
        if (res.data.status) {
          // dispatch(setAlertMessageState('Updating default address successfully!'))
          router.reload()
        } else {
          dispatch(setAlertMessageState(t('Updating default address failed!')))
        }
      } catch (error) {
        console.log(error)
      }
  }

  let FetchData = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) gotoPage('/sign-in')
    try {
      let res = await memberApi.getAddressList({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken!,
        },
      })
      if (res.data.status) {
        setListAddress(res.data.params)
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
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
      <div className="w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit flex flex-row flex-wrap gap-1">
          <span className="text-xs not-italic font-normal leading-[normal] text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center')}>
            {capitalizeFirstLetter(t('member center'))}
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">{t('My address')}</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{t('Address list').toUpperCase()}</h1>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col gap-10">
        <div className="w-full h-fit flex flex-col gap-3">
          {listAddress.map((item, index) => (
            <div key={index} className="px-6 py-5 gap-5 flex flex-col w-full h-fit bg-[#F0F2F7]">
              <div className="w-full h-fit flex flex-row flex-wrap gap-3 justify-start items-center relative">
                <Radio
                  checked={item?.MemberAddress?.is_default}
                  sx={{
                    cursor: 'pointer',
                    '& .MuiSvgIcon-root': {
                      fontSize: '24px',
                      color: '#0596A6',
                      marginLeft: '-9px',
                    },
                  }}
                  onClick={async () => updateDefaultAddress(item.MemberAddress.id)}
                />
                <span className="text-[#1a1a1a] text-lg font-semibold">{item?.MemberAddress?.name} |</span>
                <span className="text-[#666] text-lg font-normal">{item?.MemberAddress?.phone}</span>
                <button className=" absolute right-0 top-0">
                  <img className="w-6 h-6" src="/icon/ic-edit.svg" onClick={() => gotoPage(`/member-center/my-address/${item.MemberAddress.id}`)} />
                </button>
              </div>
              <div className="w-full flex flex-row justify-between items-center">
                <span className="text-[#333] text-base font-normal">{item.MemberAddress.address}</span>
                {item?.MemberAddress?.is_default && (
                  <button className="border-[1px] solid border-[#06455E] rounded-lg bg-transparent px-3">
                    <span className="text-[#06455E] font-medium text-sm ">{t('Default')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          className="w-full min-w-[280px] h-12 rounded-lg border-[1px] solid bg-[#0596A6] text-white text-lg font-medium px-8 mx-auto"
          onClick={() => gotoPage('/member-center/my-address/add-new-address')}
        >
          + {t('Add new address')}
        </button>
      </div>
    </div>
  )
}
