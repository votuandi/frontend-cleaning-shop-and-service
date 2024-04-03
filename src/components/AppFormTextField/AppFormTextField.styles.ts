import { makeStyles } from 'tss-react/mui'

export type IStyleParams = {
  locale: string
  required: boolean
  isError: boolean | undefined
  width: string
}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AppFormTextField',
  uniqId: 'app_form_text_field',
})((theme, { params }, classes) => {
  return {
    formControl: {
      minWidth: 'fit-content',
      width: params.width,

      '& fieldset': { border: 'none' },

      '& .MuiFormLabel-root': {
        color: '#4d4d4d',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: '16px',
        letterSpacing: '0.32px',
        marginBottom: 4,

        '& .MuiFormLabel-asterisk': {
          color: '#DA1E28',
        },
      },

      '& .MuiInputBase-root': {
        backgroundColor: '#f3f6f9',
        borderRadius: 8,

        '&:hover': {},

        '& input': {
          color: params.isError ? '#DA1E28' : '#161616',
          backgroundColor: '#f3f6f9',
          borderRadius: 8,
          border: 'none',
        },

        '& textarea': {
          color: params.isError ? '#DA1E28' : '#161616',
          backgroundColor: '#f3f6f9',
          borderRadius: 8,
          border: 'none',
        },
      },

      '& .MuiFormHelperText-root': {
        color: '#DA1E28',
        fontSize: 12,
      },
    },
  }
})

export default useStyles
