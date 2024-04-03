import { makeStyles } from 'tss-react/mui'

export type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AppEditTextField',
  uniqId: 'app_edit_text_field',
})((theme, { params }, classes) => {
  return {
    formControl: {
      '& .MuiFormLabel-root': {
        color: '#4d4d4d',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: '500',

        '& .MuiFormLabel-asterisk': {
          color: '#DA1E28',
        },
      },

      '& .MuiInputBase-input': {
        border: 'none',
        color: '#1a1a1a',
      },

      '& .MuiInputBase-formControl': {
        border: 'none',
      },

      '& .MuiInputBase-root': {
        borderRadius: 8,
        backgroundColor: '#F3F6F9',

        '&:hover': {},
      },

      '& .MuiFormLabel-asterisk': {},

      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '0',
      },

      '& input': {
        color: '#1a1a1a',
      },
    },
  }
})

export default useStyles
