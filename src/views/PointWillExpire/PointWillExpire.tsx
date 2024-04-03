/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useIsMounted, useOnClickOutside } from 'usehooks-ts'
import { Box, Button, Grid, InputAdornment, MenuItem, Select, TextField } from '@mui/material'
import useStyles from './PointWillExpire.style'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'
import { IGetPointHistoryResponse, IPointHistoryItem } from '@/utils/api/member'
import memberApi from '@/utils/api/member/member.api'
import NoResultDisplay from '@/components/NoResultDisplay'
import { useDispatch } from 'react-redux'
import { setAlertMessageState } from '@/slice/alertSlice'
import { poweredByHeader } from '@@/next-i18next.config'

export default function PointWillExpire() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const dispatch = useDispatch()

  const [pointWillExpire, setPointWillExpire] = useState<string[]>([])

  let getPointWillExpire = async () => {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
    if (!accessToken) {
      dispatch(setAlertMessageState(t('Please sign in!')))
      gotoPage('/sign-in')
    } else
      try {
        let res = await memberApi.getPointWillExpire({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken,
          },
        })
        if (res.data.status) {
          setPointWillExpire(res.data.params)
        }
      } catch (error) {
        console.log(error)
      }
  }

  let FetchData = async () => {
    await getPointWillExpire()
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
            Member center
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal]  text-[#b3b3b3] cursor-pointer" onClick={() => gotoPage('/member-center/point-history')}>
            Point history
          </span>
          <img className="h-4 w-auto" src="/icon/ic-breack.svg" alt="" />
          <span className="text-xs not-italic font-normal leading-[normal] text-[#333]">Point history</span>
        </div>
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">POINT WILL EXPIRE</h1>
        </div>
      </div>
      <div className="w-full h-fit">
        <Box
          sx={{
            width: '100%',
            gap: '40px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="w-full h-fit flex flex-col flex-wrap gap-8 justify-center items-center">
            {Array.isArray(pointWillExpire) && pointWillExpire.length > 0 ? (
              pointWillExpire?.map((item, index) => {
                return (
                  <div key={index} className="w-full flex flex-row justify-between gap-2 items-center bg-white hover:bg-[#0596a609] hover:rounded-xl cursor-pointer">
                    <div className="w-fit flex flex-row justify-center items-center gap-4">
                      <div className="p-2.5 bg-[#f9f9f9] rounded-[50%] flex justify-center items-center">
                        <img className="w-6 h-6" src="/icon/ic-pointwillexpire.png" alt="" />
                      </div>
                      <div className="flex flex-col items-start justify-start gap-2">
                        <span className="text-black font-medium text-base">{item}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <NoResultDisplay />
            )}
          </div>
        </Box>
      </div>
    </div>
  )
}
