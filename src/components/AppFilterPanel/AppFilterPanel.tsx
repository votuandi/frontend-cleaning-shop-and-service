import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps } from '@mui/material'
import useStyles from './AppFilterPanel.styles'
import router from 'next/router'
import { MENU } from '@/utils/constants/menu.constant'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import { FilterType, ServiceTypeType, RedeemedCouponFilterType, SortOderType, SortSettingsType, SortType, OrderFilterType } from '@/types/common'
import { useEffect, useState } from 'react'
import { FILTER, REDEEM_COUPON_FILTER, SERVICE_TYPE } from '@/utils/constants/common.constant'

type IProps = {
  // setting: FilterType | RedeemedCouponFilterType | ServiceTypeType
  onApplyFilter: (type: FilterType | RedeemedCouponFilterType | ServiceTypeType | OrderFilterType) => void
  type: 'shop' | 'coupon' | 'quotation' | 'order'
  value?: FilterType | RedeemedCouponFilterType | ServiceTypeType | OrderFilterType
}

const AppFilterPanel = (props: IProps, ref: React.ForwardedRef<any>) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()

  const [setting, setSetting] = useState<FilterType | RedeemedCouponFilterType | ServiceTypeType | OrderFilterType>(props.type === ('quotation' || 'order') ? '' : 'all')

  const handleReset = () => {
    setSetting(props.type === ('quotation' || 'order') ? '' : 'all')
  }

  const handleApply = () => {
    props.onApplyFilter(setting)
  }

  useEffect(() => {
    console.log(props.value)

    if (props.value) {
      setSetting(props.value)
      console.log(props.value, setting)
    }
  }, [])

  return (
    <div className={classes.root} ref={ref}>
      <img className="ml-auto mr-5" src="/icon/arrow-sort.svg" alt="" />
      <div className="w-[300px] h-fit bg-white -mt-1 rounded-2xl flex flex-col">
        <span className="text-base not-italic font-normal text-[#333] text-center px-6 py-3 mx-auto">{t('Filter')}</span>
        {(props.type === 'shop' ? FILTER : props.type === 'coupon' ? REDEEM_COUPON_FILTER : SERVICE_TYPE).map((item, index) => {
          return (
            <div className="w-full h-fit px-6 py-3 flex flex-row justify-between items-center text-base not-italic font-normal text-[#333]" key={index}>
              <span className="cursor-pointer" onClick={() => setSetting(item.value as FilterType | RedeemedCouponFilterType | ServiceTypeType)}>
                {item.name}
              </span>
              {item.value === setting && <img src="/icon/check.svg" alt="" />}
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
      </div>
    </div>
  )
}

export default React.forwardRef(AppFilterPanel)
