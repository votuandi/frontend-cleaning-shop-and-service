import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'EditMyProfile',
  uniqId: 'edit_my_profile',
})((theme, { params }, classes) => {
  return {
    root: {},
    changeImageBtn: {
      color: '#0596A6',
      backgroundColor: '#EFF7FA',
      padding: '9px 16px',
      borderRadius: 8,
      fontWeight: 500,
    },

    deleteBtn: {
      color: '#F03E3E',
      backgroundColor: '#E6E6E6',
      padding: '9px 16px',
      borderRadius: 8,
      fontWeight: 500,
    },

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

    submitBtn: {
      color: '#fff',
      backgroundColor: '#0596A6',
      padding: '12px 24px',
      minWidth: 280,
      fontSize: 18,
      fontWeight: 500,
      width: 'fit-content',
      margin: 'auto',
    },

    formContainer: {
      width: '100%',
      maxWidth: '450px',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 60,
      margin: 'auto',
    },
  }
})

export default useStyles
