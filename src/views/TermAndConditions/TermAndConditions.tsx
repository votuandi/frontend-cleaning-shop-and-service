/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import router, { useRouter } from 'next/router'
import { useIsMounted } from 'usehooks-ts'
import { Grid, MenuItem, Select } from '@mui/material'
import useStyles from './TermAndConditions.style'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppPagination from '@/components/AppPagination'
import parse from 'html-react-parser'
import { settingApi } from '@/utils/api'

type Query = {
  slug: string
}

const TAB_TITLES = ['News', 'Promotion']
const ITEMS_PER_PAGE = [5, 10, 15, 20]

export default function Notification() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const query = router.query as unknown as Query

  const [title, setTitle] = useState<'Term and condition' | 'Privacy policy'>()
  const [content, setContent] = useState<string>('')

  let getContent = async () => {
    try {
      let res = await settingApi.getCompanySettings({
        params: {
          language: locale === 'en-US' ? 'eng' : 'zho',
          name: title === 'Term and condition' ? 'content-terms-and-conditions' : 'content-privacy-policy',
        },
      })
      if (res.data.status) {
        setContent(res.data.params.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isMounted()) return
    setTitle(query.slug === 'terms-and-conditions' ? 'Term and condition' : 'Privacy policy')
  }, [])

  useEffect(() => {
    if (!isMounted()) return
    setTitle(query.slug === 'terms-and-conditions' ? 'Term and condition' : 'Privacy policy')
  }, [locale])

  useEffect(() => {
    getContent()
  }, [title])

  const { classes } = useStyles({ params: {} })
  let isMounted = useIsMounted()

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-8 py-10 px-6">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row w-fit h-fit justify-center items-center gap-8 pl-3 border-l-[8px] border-[#0596A6] border-solid">
          <h1 className="text-lg not-italic font-semibold leading-[normal] text-[#1A1A1A]">{title?.toUpperCase()}</h1>
        </div>
      </div>
      <div className="w-full text-[#666] cms">{parse(content)}</div>
    </div>
  )
}
