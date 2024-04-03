import * as React from 'react'
import parse from 'html-react-parser'
import useStyles from './OrderItem.styles'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import _kebabCase from 'lodash/kebabCase'
import { useState } from 'react'
import { IOrder, IProductGiftItem } from '@/utils/api/transaction'
import { Box, IconButton, TextField, Typography, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { ICouponItem } from '@/utils/api/coupon'
import theme from '@/assets/theme'
import { ORDER_STATUS_DISPLAY } from '@/utils/constants/transaction.constant'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { capitalize } from 'lodash'

type IProps = {
  item: IOrder
}

const OrderItem = ({ item }: IProps) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600))

  const [isShowMore, setIsShowMore] = useState<boolean>(false)

  const gotoDetail = () => {
    gotoPage(`/member-center/my-order/${item.id}`)
  }

  const toggleShowMore = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setIsShowMore((x) => !x)
  }

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        border: '1px solid #E1E9EC',
        borderRadius: '16px',
        padding: '10px 24px',
      }}
      className="hover:drop-shadow-md"
      onClick={gotoDetail}
    >
      <div className="flex flex-row text-lg font-semibold items-center flex-wrap">
        <span className="text-[#b3b3b3] mr-2">{t('Order')}</span>
        <span className="text-[#1a1a1a] mr-2">#{item?.inv_number}</span>
        <Typography
          sx={{
            color: 'white',
            fontSize: '12px',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: item?.color_code,
          }}
        >
          {capitalize(item?.status)}
        </Typography>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <img className="w-[18px] h-[18px]" src="/icon/ic-calendar-fill.svg" alt="" />
        <span className="text-[#999] text-[12px]">
          {item.date?.split(' ')[0]} at {item.date.split(' ')[1]}
        </span>
      </div>
      {Array.isArray(item.Item) &&
        item.Item.slice(0, isShowMore ? item.Item.length : 1).map((cartItem, index) => {
          return (
            <div className="w-full h-[100px] flex flex-row justify-start items-start gap-4 mt-2" key={index}>
              <img className="w-[100px] h-[100px] rounded-lg border-[1px] solid border-[#E6E6E6]" src={cartItem.image} alt="" />
              <div className="w-full h-full flex flex-row flex-wrap justify-between items-center">
                <div className="w-[220px] h-full flex flex-col justify-center items-start gap-1">
                  <span className="text-[#202020] text-base font-semibold text-1-line">{cartItem.ItemInfo?.name}</span>
                  <div className="flex flex-row gap-1">
                    <span className="text-[#B3B3B3] text-sm font-normal">SKU:</span>
                    <span className="text-[#0596A6] text-sm font-normal">{cartItem.ItemInfo?.id}</span>
                  </div>
                  <span className="text-[#B3B3B3] text-sm font-normal">
                    {t('Quantity')}: {cartItem.qty}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      {Array.isArray(item.Item) && item.Item.length > 1 && (
        <div className="flex flex-row gap-[2px] items-center cursor-pointer mt-2" onClick={toggleShowMore}>
          <span className="text-[#808080] text-sm font-normal">
            {isShowMore ? t('Show less items') : `${t('More')} ${Array.isArray(item.Item) && item.Item.length - 1} ${t('items')}`}
          </span>
          {isShowMore ? (
            <KeyboardArrowUpIcon sx={{ color: '#808080', width: '20px', height: '20px' }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: '#808080', width: '20px', height: '20px' }} />
          )}
        </div>
      )}
    </Box>
  )
}

export default OrderItem
