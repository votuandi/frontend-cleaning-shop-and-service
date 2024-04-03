import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps, Grid, Box } from '@mui/material'
import useStyles from './AppConfirmPopup.styles'
import router from 'next/router'
import { FOOTER, MENU } from '@/utils/constants/menu.constant'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

type IProps = {
  message: string
  onCancel: Function
  onConfirm: Function
}

const AppConfirmPopup = (props: IProps, ref: React.ForwardedRef<any>) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()

  useEffect(() => {}, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: '#021F31F2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
      }}
      ref={ref}
    >
      <Grid
        container
        sx={{
          borderRadius: '16px',
          backgroundColor: 'white',
          width: 'fit-content',
          height: 'fit-content',
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            padding: '32px 50px 24px 50px',
            borderBottom: '1px solid #E6E6E6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span className="text-black text-lg font-semibold text-center">{props.message}</span>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            borderRight: '1px solid #E6E6E6',
            py: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span className="text-black text-base font-normal w-fit mx-auto cursor-pointer" onClick={() => props.onCancel()}>
            {t('Cancel')}
          </span>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            py: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="text-[#0596A6] text-semibold font-normal text-center" onClick={() => props.onConfirm()}>
            {t('Confirm')}
          </span>
        </Grid>
      </Grid>
    </Box>
  )
}

export default React.forwardRef(AppConfirmPopup)
