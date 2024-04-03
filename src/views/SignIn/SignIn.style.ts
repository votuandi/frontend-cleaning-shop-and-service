import { useMediaQuery } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

type IStyleParams = {
  coverBannerHeight: number
  coverBannerWidth: number
  coverBannerUrl: string
}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'SignIn',
  uniqId: 'sign_in',
})((theme, { params }, classes) => {
  return {
    halfSide: {
      height: '100vh',
      overflow: 'auto',
    },

    formContainer: {
      width: '100%',
      maxWidth: useMediaQuery(theme.breakpoints.down(760)) ? '100%' : '450px',
      height: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: useMediaQuery(theme.breakpoints.down(760)) ? 'start' : 'center',
      alignItems: 'center',
      gap: 60,
      margin: 'auto',
      overflow: 'auto',
    },

    logo: {
      width: '140px',
      height: '140px',
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
  }
})

export default useStyles
