import * as React from 'react'

import { FormControl, FormLabel, InputAdornment, InputLabel, OutlinedInput, TextField, TextFieldProps } from '@mui/material'
import useStyles from './AppEditTextField.styles'
import { ReactNode, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

type AppTextFieldProps = {
  name: string
} & Omit<TextFieldProps, 'variant'>

const AppEditTextField = (props: AppTextFieldProps, ref: React.ForwardedRef<any>) => {
  const { className, error, label, required, classes: muiClasses, ...rest } = props

  const { locale } = useRouter()

  const { classes } = useStyles({
    params: {},
  })

  return (
    <FormControl sx={{ width: props.fullWidth ? '100%' : 'fit-content' }} className={classes.formControl}>
      {label && <FormLabel required={required}>{props.label}</FormLabel>}
      <TextField ref={ref} error={!!error} {...rest} />
    </FormControl>
  )
}

export default React.forwardRef(AppEditTextField)
