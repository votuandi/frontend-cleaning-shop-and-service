import * as React from 'react'

import { FormControl, InputAdornment, InputLabel, OutlinedInput, TextField, TextFieldProps } from '@mui/material'
import useStyles from './AppTextField.styles'
import { ReactNode, useRef, useState } from 'react'
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
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
} & Omit<TextFieldProps, 'variant'>

const AppTextField = (props: AppTextFieldProps, ref: React.ForwardedRef<any>) => {
  const { className, label, width, classes: muiClasses, fullWidth, error, required, id, disabled, sx, placeholder, defaultValue, startIcon, onChange, onKeyDown, ...rest } = props

  const { locale } = useRouter()
  const dateRef = useRef(null)
  const inputRef = useRef(null)

  // const [isError, setIsError] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [inpValue, setInpValue] = useState<string>(props.value ? props.value.toString() : '')

  let handleDateChange = (e: React.ChangeEvent) => {
    setInpValue((e as any).target.value)
    if (typeof onChange !== undefined) {
      onChange!(e as any)
    }
  }

  let handleClickShowPassword = () => setShowPassword((show) => !show)

  let handleFocus = (e: any) => {
    try {
      ;(dateRef.current as any).showPicker()
    } catch (error) {
      // console.log(error);
    }
  }

  let handleClick = (e: any) => {
    if (props.type == 'date') handleFocus(e)
  }

  let handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const { classes } = useStyles({
    params: {
      locale: locale!,
      required: props.required ?? false,
      isError: error,
      width: props.width ?? '100%',
      paddingLeft: typeof startIcon === 'string' ? '0 30px' : '0',
    },
  })

  return props.type === 'date' ? (
    <FormControl variant="outlined" className={classes.formControl} ref={ref}>
      <OutlinedInput
        ref={inputRef}
        type="text"
        endAdornment={
          props.type === 'password' ? (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: '#fff' }}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null
        }
        placeholder={label}
        value={inpValue}
        // onChange={tr}
        onFocus={handleFocus}
        onClick={handleClick}
      />
      {startIcon && (
        <div className="w-fit h-full absolute left-3 flex justify-center items-center">
          <img className="w-6 h-6" src={startIcon} />
        </div>
      )}
      {props.type === 'date' && <input type="date" className="w-0 h-0 absolute left-0 bottom-0" ref={dateRef} onChange={handleDateChange} />}
    </FormControl>
  ) : (
    <FormControl variant="outlined" className={classes.formControl}>
      {/* <InputLabel sx={{ color: "#fff" }}>{label}</InputLabel> */}
      <OutlinedInput
        inputRef={inputRef}
        onKeyDown={onKeyDown}
        type={props.type === 'password' ? (!showPassword ? 'password' : 'text') : props.type ? props.type : 'text'}
        endAdornment={
          props.type === 'password' ? (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: '#fff' }}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null
        }
        inputProps={{ style: { backgroundColor: 'transparent' } }}
        // startAdornment={
        //   startIcon ? (
        //     <InputAdornment position="start">
        //       {typeof startIcon === "string" ? (
        //         <img src={startIcon} />
        //       ) : (
        //         startIcon
        //       )}
        //     </InputAdornment>
        //   ) : null
        // }
        placeholder={label}
        onChange={onChange}
        onFocus={handleFocus}
        onClick={handleClick}
      />
      {startIcon && (
        <div className="w-fit h-full absolute left-3 flex justify-center items-center">
          <img className="w-6 h-6" src={startIcon} />
        </div>
      )}
    </FormControl>
  )
}

export default React.forwardRef(AppTextField)
