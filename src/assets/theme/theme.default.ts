import { createTheme } from '@mui/material/styles'
import { TypographyOptions } from '@mui/material/styles/createTypography'

import generalStyles from './general.styles'
import overridesStyles from './overrides.styles'
import customStyles from './custom.styles'
import appColors from './appColor'

const muiTheme = createTheme()

const fontFamily = 'var(--font-app), sans-serif'

const typography: TypographyOptions = {
  fontFamily: fontFamily,
  fontWeightBlack: 900,
  fontWeightExtraBold: 800,
  fontWeightBold: 700,
  fontWeightSemiBold: 600,
  fontWeightMedium: 500,
  fontWeightRegular: 400,
  fontWeightLight: 300,
  captionReg12: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(12),
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  bodyReg14: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(14),
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  bodyReg16: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(16),
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  bodyMed14: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(14),
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  bodyMed16: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(16),
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  titleSemi20: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(20),
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  headerSemi35: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(20),
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  button: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(14),
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textTransform: 'initial',
  },
  body1: undefined,
  body2: undefined,
  caption: undefined,
  h1: undefined,
  h2: undefined,
  h3: undefined,
  h4: undefined,
  h5: undefined,
  h6: undefined,
  overline: undefined,
  subtitle1: undefined,
  subtitle2: undefined,
}

const defaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      mobile: 300,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      tablet: 900 - 0.01,
      desktop: 1200,
    },
    keys: ['xs', 'mobile', 'sm', 'md', 'desktop', 'lg', 'xl'],
  },
  palette: {
    primary: {
      main: appColors.pinkDark,
      contrastText: muiTheme.palette.common.white,
    },
    secondary: {
      dark: appColors.neutralDark,
      main: appColors.neutral,
      light: appColors.neutralLight,
    },
    error: {
      main: appColors.error,
      contrastText: muiTheme.palette.common.white,
    },
    background: {
      default: appColors.neutralLightest,
    },
    divider: appColors.neutralLight,
    text: {
      primary: appColors.neutralDark,
      secondary: appColors.neutral,
      disabled: appColors.neutral,
    },
    common: {
      ...appColors,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParams: any) => `
				${generalStyles(themeParams)}
				${overridesStyles(themeParams)}
        ${customStyles(themeParams)}
			`,
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          zIndex: 1350,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: 'bodyReg14',
        variantMapping: {
          bodyReg14: 'p',
          bodyMed14: 'p',
          bodyMed16: 'p',
          bodyReg16: 'p',
          captionReg12: 'p',
          button: 'p',
          headerSemi35: 'p',
          titleSemi20: 'p',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: typography,
  zIndex: {
    backdrop: 1350,
  },
  transitions: {
    duration: {
      aos: 1000,
      switchMedium: 500,
    },
  },
})

export default defaultTheme
