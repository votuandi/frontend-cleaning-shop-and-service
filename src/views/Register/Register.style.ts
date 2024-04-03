import { useMediaQuery } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

type IStyleParams = {
  coverBannerHeight: number
  coverBannerWidth: number
  coverBannerUrl: string
}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'Register',
  uniqId: 'register',
})((theme, { params }, classes) => {
  return {
    formContainer: {
      width: '100%',
      maxWidth: '450px',
      height: 'fit-content',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: useMediaQuery(theme.breakpoints.down(760)) ? 0 : 60,
      margin: useMediaQuery(theme.breakpoints.down(760)) ? '8px auto' : '50px auto',
    },

    coverContainer: {
      backgroundImage: "url('/img/account-cover.png')",
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      position: 'relative',
      width: '100%',
      height: '100%',
    },

    logo: {
      width: '100px',
      height: '100px',
    },

    inputFields: {
      width: '100%',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    },

    createAccountTexts: {
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'normal',
    },

    selectAC: {
      width: '100%',
      color: '#eee',
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
    selectIconAC: {
      position: 'relative',
      color: '#0596A6',
      fontSize: '14px',
    },
    paperAC: {
      borderRadius: 0,
      marginTop: 8,
      boxShadow: '0px 8px 16px 0px rgba(129, 83, 202, 0.25);',
    },
    listAC: {
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

    FCTF: {
      '& .MuiFormControl-root': {
        marginTop: '0px !important',
      },
    },

    TF: {
      borderColor: '#0596A6',
      '& input': {
        color: '#fff',

        '&::placeholder': {
          color: '#fff',
          opacity: 1,
        },
      },
      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0596A6' },
    },
  }
})

export default useStyles
