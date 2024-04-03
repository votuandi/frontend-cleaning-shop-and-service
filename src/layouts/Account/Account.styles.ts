import { makeStyles } from 'tss-react/mui'

type IStyleParams = {
  coverBannerHeight: number
  coverBannerWidth: number
  coverBannerUrl: string
}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AccountLayout',
  uniqId: 'account_layout',
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
      width: '100%',
      overflow: 'auto',
      position: 'relative',
      padding: 0,

      '& .slick-dots': {
        bottom: '60px',
        height: '20px',

        '& li': {
          margin: '0 -5px',
        },
      },
    },

    formContainer: {
      width: '100%',
      maxWidth: '450px',
      height: 'fit-content',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 60,
      margin: 'auto',
      fontFamily: 'Noto Sans HK',
    },

    coverContainer: {
      backgroundImage: "url('/img/account-cover.jpg')",
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      position: 'relative',
      width: '100%',
      height: '100%',
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
      fontFamily: "'Noto Sans HK', sans-serif",
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'normal',
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
        backgroundImage: `url('${params.coverBannerUrl}')`,
        backgroundSize: `${params.coverBannerWidth}px ${params.coverBannerHeight}px`,
        backgroundPosition: 'left bottom',
      },
    },

    btbContainer: {
      height: `${Math.floor((params.coverBannerHeight / 928) * 78)}px`,
      width: '100%',
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
      zIndex: 2,

      '&:hover': {
        // backgroundImage: `url("${params.coverBannerUrl}")`
        backgroundImage: `url('${params.coverBannerUrl}')`,
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

    rightSide: {
      width: params.coverBannerWidth,
      height: params.coverBannerHeight,
      position: 'relative',
      // clipPath: `polygon(0px ${Math.floor(params.coverBannerHeight/928*78+12)}px,
      // ${Math.floor(params.coverBannerWidth/732*95+12)}px ${Math.floor(params.coverBannerHeight/928*78+12)}px,
      // ${Math.floor(params.coverBannerWidth/732*95+12)}px 0px,
      // ${params.coverBannerWidth}px 0px,
      // ${params.coverBannerWidth}px ${Math.floor(params.coverBannerHeight*(1-78/928)-12)}px,
      // ${Math.floor(params.coverBannerWidth*(1-162/732)-12)}px ${Math.floor(params.coverBannerHeight*(1-78/928)-12)}px,
      // ${Math.floor(params.coverBannerWidth*(1-162/732)-12)}px ${params.coverBannerHeight}px,
      // ${Math.floor(params.coverBannerWidth/732*95+12)}px ${params.coverBannerHeight}px,
      // ${Math.floor(params.coverBannerWidth/732*95+12)}px ${Math.floor(params.coverBannerHeight*(1-78/928)-12)}px,
      // 0px ${Math.floor(params.coverBannerHeight*(1-78/928)-12)}px)`,

      // borderRadius: "20px"
      WebkitClipPath: 'url(#my-clip-path)',
      clipCath: 'url(#my-clip-path)',
      backgroundSize: `${params.coverBannerWidth}px ${params.coverBannerHeight}px`,
      zIndex: 2,
    },
    flt_svg: {
      visibility: 'hidden',
      position: 'absolute',
      width: '0px',
      height: '0px',
    },

    imgInSlick: {
      width: params.coverBannerWidth,
      height: params.coverBannerHeight,
    },
  }
})

export default useStyles
