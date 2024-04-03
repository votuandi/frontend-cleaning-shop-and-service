import { makeStyles } from "tss-react/mui";

export type IStyleParams = {
  locale: string;
  width: string;
  height: string;
  confirmPolicy: boolean | undefined
};

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: "AppInput",
  uniqId: "app_input",
})((theme, { params }, classes) => {
  return {
    formLabelControl: {
      width: params.width,
      height: params.height,

      "& .MuiFormLabel-asterisk": {
        color: "#FF3747",
        fontFamily: "'Noto Sans HK', sans-serif",
        fontSize: "18px",
        fontStyle: "normal",
        fontWeight: "700",
        lineHeight: "200%",
        // letterSpacing: params.locale === "en-US" ? 0 : "3.6px",
        textTransform: "uppercase",
      },

      "& .MuiTypography-root": {
        color: params.confirmPolicy ? "#fff" : "#0596A6",
        textAlign: "start",
        fontFamily: "'Noto Sans HK', sans-serif",
        fontSize: params.confirmPolicy ? 14 : 18,
        fontStyle: "normal",
        fontWeight: params.confirmPolicy ? 400 : 500,
        lineHeight: params.confirmPolicy ? "normal" : "200%",
        // letterSpacing: params.locale === "en-US" ? 0 : "3.6px",
      },

    },
  };
});

export default useStyles;
