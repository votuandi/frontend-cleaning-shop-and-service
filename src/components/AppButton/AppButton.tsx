import * as React from 'react'

import { ButtonProps, Button, FormControl } from '@mui/material'
import useStyles from './AppButton.styles'

type AppButtonProps = {
  label?: string
  width?: string
  height?: string
  padding?: string
} & ButtonProps

const AppButton = (props: AppButtonProps, ref: React.ForwardedRef<any>) => {
  const { className, label, width, classes: muiClasses, id, disabled, sx, placeholder, defaultValue, onChange, onClick, children, ...rest } = props

  const bgColor = sx ? ((sx as any).backgroundColor ? (sx as any).backgroundColor : null) : null
  const color = sx ? ((sx as any).color ? (sx as any).color : null) : null

  const { classes } = useStyles({
    params: {
      width: props.width ?? 'auto',
      height: props.height ?? 'auto',
      padding: props.padding ?? 'auto',
      color: color,
      bgColor: bgColor,
    },
  })

  return (
    <FormControl className={classes.formControl} ref={ref}>
      <Button variant={props.variant} sx={sx} startIcon={props.startIcon} endIcon={props.endIcon} onClick={props.onClick} {...rest}>
        {props.children}
      </Button>
    </FormControl>
  )
}

export default React.forwardRef(AppButton)
