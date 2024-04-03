import * as React from 'react'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from 'lodash/kebabCase'
import { ICouponItem } from '@/utils/api/coupon'
import theme from '@/assets/theme'
import { Box } from '@mui/material'

const NoResultDisplay = () => {
  const { t, i18n } = useTranslation()

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        mx: 'auto',
      }}
    >
      <img className="w-20 h-20" src="/img/no-results.png" alt="" />
      <span className="text-[#333] text-lg font-semibold">No matching search result </span>
    </Box>
  )
}

export default NoResultDisplay
