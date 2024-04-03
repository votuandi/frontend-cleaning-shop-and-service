import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Select from '@mui/material/Select'

import { type SelectProps, type MenuProps, Box } from '@mui/material'
import useStyles from './AppDropdown.styles'
import { useEffect, useState } from 'react'
import { capitalize } from 'lodash'

export type IDropdownItem = {
  label: string
  value: number | string
}

type AppDropdownProps = {
  label?: string
  items: IDropdownItem[]
  width?: string
  height?: string
  startIcon?: string
} & Omit<SelectProps, 'variant'>

const AppDropdown = (props: AppDropdownProps, ref: React.ForwardedRef<any>) => {
  const [isSelected, setIsSelect] = useState<boolean>(false)

  const {
    className,
    items,
    label,
    width,
    height,
    classes: muiClasses,
    fullWidth,
    error,
    required,
    id,
    disabled,
    sx,
    placeholder,
    children,
    value = props.multiple ? [] : '',
    renderValue,
    MenuProps,
    defaultValue,
    startIcon,
    onChange,
    ...rest
  } = props

  const { classes } = useStyles({
    params: {
      isSelected: isSelected,
      width: width ?? '100%',
      height: height ?? 'fit-content',
      error: error,
    },
  })

  const menuProps: Partial<MenuProps> = {
    classes: {
      list: classes.list,
      paper: classes.paper,
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    // getContentAnchorEl: null,
  }

  useEffect(() => {
    setIsSelect(items.map((x) => x.value).includes(value as any))
  }, [value])

  return (
    <div>
      <FormControl
        sx={{
          minWidth: 'fit-content',
          width: width ?? '100%',
          height: height ?? 'fit-content',
        }}
        className={classes.formControl}
      >
        {/* {startIcon && <img width={30} height={30} src={startIcon} alt="" />} */}

        <Select
          classes={{
            select: classes.select,
            icon: classes.selectIcon,
          }}
          ref={ref}
          value={value}
          onChange={onChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          MenuProps={menuProps}
          IconComponent={ExpandMoreIcon}
          label={label}
          // defaultValue={defaultValue}
          // renderValue={(value) => {
          //   return (
          //     <Box sx={{ display: "flex", gap: 1 }}>
          //       {startIcon && (
          //         <img width={30} height={30} src={startIcon} alt="" />
          //       )}
          //       {items.filter((x) => x.value === value)[0].label}
          //     </Box>
          //   );
          // }}
        >
          {label && (
            <MenuItem value="">
              <em>{label ?? 'none'}</em>
            </MenuItem>
          )}
          {items.map((item, index) => {
            return (
              <MenuItem value={item.value} key={index}>
                {capitalize(item.label)}
              </MenuItem>
            )
          })}
        </Select>
        {/* <FormHelperText>Without label</FormHelperText> */}
        <div className="w-fit h-full absolute flex justify-center items-center left-3">
          <img className="w-6 h-6 " src={startIcon} alt="" />
        </div>
      </FormControl>
    </div>
  )
}

export default React.forwardRef(AppDropdown)
