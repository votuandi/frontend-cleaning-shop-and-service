import { makeStyles } from 'tss-react/mui'

export type IStyleParams = {
  locale: string
  required: boolean
  isError: boolean | undefined
  width: string
  paddingLeft: number | string
}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AppPasswordInput',
  uniqId: 'app_password_input',
})((theme, { params }, classes) => {
  return {
    formControl: {
      minWidth: 'fit-content',
      width: params.width,

      '& .MuiInputBase-root': {
        color: '#0596A6',
        justifyContent: 'center',
        padding: params.paddingLeft,
        borderRadius: '8px',
        gap: 8,

        '&::-webkit-calendar-picker-indicator': {
          display: 'none',
          '-webkit-appearance': 'none',
        },

        '& input': {
          color: '#fff',

          '&::placeholder': {
            color: '#fff',
            opacity: 1,
          },
        },

        '&:hover': {
          borderColor: params.isError ? 'red' : '#0596A6',
        },
      },

      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1px',
        borderColor: params.isError ? 'red' : '#0596A6',
        borderStyle: 'solid',
        borderRadius: '8px',

        '&:hover': {
          borderColor: params.isError ? 'red' : '#0596A6',
        },
      },

      '& .MuiFormLabel-asterisk': {
        color: '#FF3747',
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: '200%',
        // letterSpacing: "3.6px",
        // textTransform: "uppercase",
      },

      '&:hover': {
        borderColor: params.isError ? 'red' : '#0596A6',
      },
    },
  }
})

export default useStyles
