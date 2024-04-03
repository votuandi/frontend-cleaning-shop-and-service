import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps, useMediaQuery, Box } from '@mui/material'
import useStyles from './AppSortPanel.styles'
import router from 'next/router'
import { MENU } from '@/utils/constants/menu.constant'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import { CouponSortType, ServiceSortType, SortOderType, SortSettingsType, SortType } from '@/types/common'
import { useState } from 'react'
import { COUPON_SORT, SERVICE_SORT, SORT, SORT_ORDER } from '@/utils/constants/common.constant'
import theme from '@/assets/theme'

type IProps = {
  settings: SortSettingsType
  onApplySort: (settings: SortSettingsType) => void
  type?: 'service' | 'productGift' | 'coupon'
}

const AppSortPanel = (props: IProps, ref: React.ForwardedRef<any>) => {
  const { t, i18n } = useTranslation()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(320))

  const type = props.type ?? 'productGift'

  const [sort, setSort] = useState<SortType | CouponSortType | ServiceSortType>(props?.settings?.sort ?? '')
  const [sortOrder, setSortOrder] = useState<SortOderType>(props.settings?.sortOrder)

  const handleReset = () => {
    setSort('')
    setSortOrder('ASC')
  }

  const handleApply = () => {
    props.onApplySort({
      sort: sort,
      sortOrder: sortOrder,
    })
  }

  const { classes } = useStyles({
    params: {},
  })

  return (
    <Box
      sx={{
        width: isSmallScreen ? '240px' : '300px',
        display: 'flex',
        flexDirection: 'column',
        filter: 'drop-shadow(0px 4px 4px rgba(149, 157, 165, 0.3))',
      }}
      ref={ref}
    >
      <img className="ml-auto mr-5" src="/icon/arrow-sort.svg" alt="" />
      <Box
        sx={{
          width: isSmallScreen ? '240px' : '300px',
          height: 'fit-content',
          backgroundColor: '#fff',
          marginTop: '-4px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span className="text-base not-italic font-normal text-[#333] text-center px-6 py-3 mx-auto">{t('Sort')}</span>
        <span className="text-base not-italic font-normal text-[#333] bg-[#E6E6E6] px-6 py-3">{t('Sort by')}</span>
        {(type === 'productGift' ? SORT : type === 'service' ? SERVICE_SORT : COUPON_SORT).map((item, index) => {
          return (
            <div className="w-full h-fit px-6 py-3 flex flex-row justify-between items-center text-base not-italic font-normal text-[#333]" key={index}>
              <span
                className="cursor-pointer"
                onClick={() => {
                  console.log(item.value)

                  setSort(item.value as SortType | CouponSortType | ServiceSortType)
                }}
              >
                {item.name}
              </span>
              {item.value === sort && <img src="/icon/check.svg" alt="" />}
            </div>
          )
        })}
        <span className="text-base not-italic font-medium text-[#333] bg-[#E6E6E6] px-6 py-3">{t('Sort order')}</span>
        {SORT_ORDER.map((item, index) => {
          return (
            <div className="w-full h-fit px-6 py-3 flex flex-row justify-between items-center text-base not-italic font-normal text-[#333]" key={index}>
              <div className="flex flex-row gap-2 justify-center items-center">
                <img src={`/icon/${item.value}.svg`} alt="" />
                <span className="cursor-pointer" onClick={() => setSortOrder(item.value as SortOderType)}>
                  {item.name}
                </span>
              </div>
              {item.value === sortOrder && <img src="/icon/check.svg" alt="" />}
            </div>
          )
        })}
        <div className="w-full h-fit px-6 py-3 gap-3 flex flex-row justify-between items-center border-t-[1px] solid border-[#E6E6E6]">
          <button className="w-[120px] h-8 rounded-lg border-[1px] solid border-[#0596A6] text-[#0596A6] text-sm font-medium" onClick={handleReset}>
            {t('Reset')}
          </button>
          <button className="w-[120px] h-8 rounded-lg border-[1px] solid bg-[#0596A6] text-white text-sm font-medium" onClick={handleApply}>
            {t('Apply')}
          </button>
        </div>
      </Box>
    </Box>
  )
}

export default React.forwardRef(AppSortPanel)
