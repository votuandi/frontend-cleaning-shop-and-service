import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps, Grid, Box, Typography, Button } from '@mui/material'
import useStyles from './AppAlert.styles'
import router from 'next/router'
import { FOOTER, MENU } from '@/utils/constants/menu.constant'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import AppButton from '../AppButton'
import { setAlertMessageState } from '@/slice/alertSlice'

type IProps = {}

const AppAlert = (props: IProps, ref: React.ForwardedRef<any>) => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const alert = useSelector((state: RootState) => state.alert)
  const dispatch = useDispatch()

  let handleCloseAlert = () => {
    dispatch(setAlertMessageState(''))
  }

  useEffect(() => {}, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#00000010',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          width: '90vw',
          maxWidth: '527px',
          height: 'fit-content',
          minHeight: '268px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          borderTop: '10px solid #0596A6',
          boxShadow: '0px 4px 70px 0px rgba(0, 0, 0, 0.25)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#1a1a1a',
            }}
          >
            Alert
          </Typography>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#000',
            }}
          >
            {alert.message}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* <Button
            variant="text"
            sx={{
              textDecorationLine: 'underline',
              color: '#0596A6',
              fontSize: '20px',
              fontWeight: 500,
            }}
            onClick={handleCloseAlert}
          >
            Cancel
          </Button> */}
          <AppButton
            color="primary"
            variant="contained"
            width="130px"
            sx={{
              color: '#fff',
              fontSize: '20px',
              fontWeight: 500,
            }}
            onClick={handleCloseAlert}
          >
            OK
          </AppButton>
        </Box>
      </Box>
    </Box>
  )
}

export default React.forwardRef(AppAlert)
