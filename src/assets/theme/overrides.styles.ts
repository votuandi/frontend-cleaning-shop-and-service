import { Theme } from "@mui/material/styles";

const styleOverrides = (theme: Theme) => {
  return `
		.Toastify__toast-container {
			z-index: ${theme.zIndex.snackbar};
			font-family: ${theme.typography.bodyReg14.fontFamily};
			font-size: ${theme.typography.bodyReg14.fontSize};
			line-height: ${theme.typography.bodyReg14.lineHeight};
			font-weight: ${theme.typography.bodyReg14.fontWeight};
			color: ${theme.palette.text.primary};
		}

		.animate__animated.animate__entering-screen__duration {
			--animate-duration: ${theme.transitions.duration.enteringScreen}ms;
		}
		.animate__animated.animate__leaving-screen__duration {
			--animate-duration: ${theme.transitions.duration.leavingScreen}ms;
		}
		.animate__animated.animate__switch-medium__duration {
			--animate-duration: ${theme.transitions.duration.switchMedium}ms;
		}
	`;
};

export default styleOverrides;
