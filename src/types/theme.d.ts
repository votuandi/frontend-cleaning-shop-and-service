import React from "react";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    mobile: true;
    tablet: true;
    desktop: true;
  }

  interface ZIndex {
    backdrop: number;
    bottomBar: number;
  }

  interface Duration {
    aos: number;
    switchMedium: number;
  }

  interface CommonColors {
    blue: string;

    pinkDark: string;
    pink: string;
    pinkLight: string;
    pinkLighter: string;
    pinkLightest: string;

    neutralDark: string;
    neutral: string;
    neutralLight: string;
    neutralLighter: string;
    neutralLightest: string;
  }

  interface TypeBackground {}

  interface FontStyleOptions {
    fontWeightBlack: number;
    fontWeightExtraBold: number;
    fontWeightSemiBold: number;
  }

  interface TypographyVariants {
    headerSemi35: React.CSSProperties;

    titleSemi20: React.CSSProperties;

    bodyReg16: React.CSSProperties;
    bodyMed16: React.CSSProperties;
    bodyReg14: React.CSSProperties;
    bodyMed14: React.CSSProperties;

    captionReg12: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headerSemi35?: React.CSSProperties;

    titleSemi20?: React.CSSProperties;

    bodyReg16?: React.CSSProperties;
    bodyMed16?: React.CSSProperties;
    bodyReg14?: React.CSSProperties;
    bodyMed14?: React.CSSProperties;

    captionReg12?: React.CSSProperties;
  }

  interface Theme {
    app: {};
  }

  interface ThemeOptions {
    app?: {};
  }
}

declare module "@mui/material/styles/createTypography" {
  interface FontStyle
    extends Required<{
      fontWeightBlack?: React.CSSProperties["fontWeight"];
      fontWeightExtraBold?: React.CSSProperties["fontWeight"];
      fontWeightSemiBold?: React.CSSProperties["fontWeight"];
    }> {}
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    headerSemi35: true;

    titleSemi20: true;

    bodyReg16: true;
    bodyMed16: true;
    bodyReg14: true;
    bodyMed14: true;

    captionReg12: true;

    h1: false;
    h2: false;
    h3: false;
    h4: false;
    h5: false;
    h6: false;
    body1: false;
    body2: false;
    subtitle1: false;
    subtitle2: false;
    caption: false;
    overline: false;
  }
}
