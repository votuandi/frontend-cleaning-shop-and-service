import * as React from 'react'

import { FormControlLabel, Checkbox, CheckboxProps, Box, CircularProgress } from '@mui/material'
import useStyles from './AppCircularProgress.styles'
import { useRouter } from 'next/router'

const AppCheckBox = () => {
  const { locale } = useRouter()

  const { classes } = useStyles({
    params: {},
  })

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        zIndex: 99,
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default AppCheckBox
