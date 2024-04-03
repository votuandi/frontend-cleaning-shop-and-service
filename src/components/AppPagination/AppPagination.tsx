import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps, Pagination, PaginationItem, PaginationProps, useMediaQuery, IconButton } from '@mui/material'
import useStyles from './AppPagination.styles'
import router from 'next/router'
import { MENU } from '@/utils/constants/menu.constant'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import theme from '@/assets/theme'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

type IProps = {} & Omit<PaginationProps, 'variant'>

const AppPagination = (props: IProps, ref: React.ForwardedRef<PaginationProps>) => {
  const { className, classes: muiClasses, id, disabled, sx, placeholder, defaultValue, page, count, onChange, ...rest } = props
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(800))
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()

  const PrevIcon = () => {
    return isSmallScreen ? (
      <IconButton sx={{ width: '24px', height: '24px' }}>
        <KeyboardArrowLeftIcon sx={{ width: '24px', height: '24px' }} />
      </IconButton>
    ) : (
      <span>{t('Prev')}</span>
    )
  }

  const NextIcon = () => {
    return isSmallScreen ? (
      <IconButton sx={{ width: '24px', height: '24px' }}>
        <KeyboardArrowRightIcon sx={{ width: '24px', height: '24px' }} />
      </IconButton>
    ) : (
      <span>{t('Next')}</span>
    )
  }

  return (
    <Pagination
      className={classes.root}
      onChange={onChange}
      count={count}
      page={page}
      renderItem={(item) => <PaginationItem slots={{ previous: PrevIcon, next: NextIcon }} {...item} />}
    />
  )
}

export default React.forwardRef(AppPagination)
