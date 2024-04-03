import { Theme } from "@mui/material/styles";

const styleOverrides = (theme: Theme) => {
  return `
    .text-primary {
      color: ${theme.palette.primary.main};
    }
    .content{
      flex-grow: 0;
    }
    .body-page {
      height: fit-content;
      width: 100vw;
      position: relative;
      
    },
    .mySwiper{
      transition-timing-function: linear !important; 
    }
	`;
};

export default styleOverrides;
