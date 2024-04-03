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
    root: {
      backgroundColor: '#06455E',
      position: 'relative',
      width: '100vw',
      height: '100vh',
    },

    halfSide: {
      height: '100vh',
      overflow: 'auto',
    },

    formContainer: {
      width: '100%',
      maxWidth: '450px',
      height: 'fit-content',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 60,
      margin: 'auto',
    },

    leftBtn: {
      width: `${Math.floor((params.coverBannerWidth / 732) * 95)}px`,
      height: `${Math.floor((params.coverBannerHeight / 928) * 78)}px`,
      position: 'absolute',
      left: 0,
      bottom: 0,
      backgroundColor: '#fff',
      borderRadius: 24,
      outline: 'solid 12px #06455E',
      cursor: 'pointer',

      '&:hover': {
        // backgroundImage: `url("${params.coverBannerUrl}")`
        backgroundImage: "url('/img/account-cover.png')",
        backgroundSize: `${params.coverBannerWidth}px ${params.coverBannerHeight}px`,
        backgroundPosition: 'left bottom',
      },
    },

    rightBtn: {
      width: `${Math.floor((params.coverBannerWidth / 732) * 162)}px`,
      height: `${Math.floor((params.coverBannerHeight / 928) * 78)}px`,
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: '#fff',
      borderRadius: 24,
      outline: 'solid 12px #06455E',
      cursor: 'pointer',

      '&:hover': {
        // backgroundImage: `url("${params.coverBannerUrl}")`
        backgroundImage: "url('/img/account-cover.jpg')",
        backgroundSize: `${params.coverBannerWidth}px ${params.coverBannerHeight}px`,
        backgroundPosition: `right ${params.coverBannerWidth}px bottom 0px`,
      },
    },

    insideBtn: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  }
})

export default useStyles
