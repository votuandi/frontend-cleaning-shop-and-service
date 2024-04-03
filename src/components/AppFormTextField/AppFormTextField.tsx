import * as React from 'react'

import { FormControl, FormLabel, InputAdornment, InputLabel, OutlinedInput, TextField, TextFieldProps } from '@mui/material'
import useStyles from './AppFormTextField.styles'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

type AppTextFieldProps = {
  label?: string
  width?: string
  height?: string
  required?: boolean
  startIcon?: string
  maxLength?: number
} & Omit<TextFieldProps, 'variant'>

const AppFormTextField = (props: AppTextFieldProps, ref: React.ForwardedRef<any>) => {
  const {
    className,
    rows,
    label,
    width,
    classes: muiClasses,
    fullWidth,
    error,
    required,
    id,
    disabled,
    sx,
    placeholder,
    defaultValue,
    startIcon,
    maxLength,
    onChange,
    ...rest
  } = props

  const { locale } = useRouter()
  // const [isError, setIsError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [type, setType] = useState<string>()

  let handleClickShowPassword = () => {
    setShowPassword((show) => !show)
  }

  const { classes } = useStyles({
    params: {
      locale: locale!,
      required: required ?? false,
      isError: error,
      width: props.width ?? '100%',
    },
  })

  useEffect(() => {
    setType(props.type ?? 'text')
  }, [])

  return (
    <FormControl className={classes.formControl} ref={ref}>
      {props.label && <FormLabel required={required}>{props.label}</FormLabel>}
      <TextField multiline={rows != undefined && Number(rows) > 1} rows={rows} type={type} hiddenLabel placeholder={placeholder} onChange={onChange} {...rest} />
    </FormControl>
  )
}

export default React.forwardRef(AppFormTextField)
