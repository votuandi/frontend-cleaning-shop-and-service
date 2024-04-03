import { makeStyles } from 'tss-react/mui'

export type IStyleParams = {
  isSelected: boolean
  width: string
  height: string
  error: boolean | undefined
}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AppDropdown',
  uniqId: 'app_dropdown',
})((theme, { params }, classes) => {
  return {
    formControl: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

      '& .MuiInputBase-root': {
        color: '#fff',
        borderColor: params.error ? 'red' : '#0596A6',
        borderWidth: 'px',
        borderStyle: 'solid',
        borderRadius: '8px',
        minWidth: 'fit-content',
        justifyContent: 'center',
        width: params.width,
        height: params.height,

        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: params.error ? 'red' : '#0596A6',
        },
        '& .MuiSelect-select': {
          paddingRight: '0px',
          marginTop: 8,
        },
      },

      '& svg': {
        // margin: '0 12px'
        width: '24px',
        height: '24px',
        color: '#fff',
        position: 'absolute',
        right: 12,
        top: 16,
      },
      '& .MuiSvgIcon-root': {
        marginLeft: '12px !important',
      },

      '& .AppDropdown-select': {},
    },
    select: {
      width: '100%',
      color: '#fff',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 'normal',
      paddingLeft: 48,
      // letterSpacing: "3.6px",
      // textTransform: "uppercase",
      '&:focus': {
        backgroundColor: 'transparent',
      },
    },
    selectIcon: {
      position: 'relative',
      color: '#0596A6',
      fontSize: '14px',
    },
    paper: {
      borderRadius: 0,
      marginTop: 8,
      boxShadow: '0px 8px 16px 0px rgba(129, 83, 202, 0.25);',
    },
    list: {
      paddingTop: 0,
      paddingBottom: 0,
      '& li': {
        paddingTop: 8,
        paddingBottom: 8,
        color: '#0596A6',
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        // letterSpacing: "3.6px",
        // textTransform: "uppercase",
      },
      '& li.Mui-selected': {
        color: '#fff',
        background: '#0596A6',
      },
      '& li.Mui-selected:hover': {
        background: '#0596A6',
      },
    },
  }
})

export default useStyles
