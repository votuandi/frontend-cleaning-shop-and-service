import { makeStyles } from "tss-react/mui";

export type IStyleParams = {
  width: string;
  height: string;
  padding: string;
  color: string | null;
  bgColor: string | null;
};

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: "AppInput",
  uniqId: "app_input",
})((theme, { params }, classes) => {
  return {
    formControl: {
      width: params.width,
      borderRadius: 8,

      "& .MuiButton-contained": {
        backgroundColor: `${
          params.bgColor ? params.bgColor : "#0596A6"
        } !important`,
        borderRadius: 8,
        color: params.color ? params.color : "#FFF",
        fontFamily: "'Noto Sans HK', sans-serif",
        fontSize: "18px",
        fontStyle: "normal",
        fontWeight: "700",
        lineHeight: "normal",
        // letterSpacing: "3.6px",
        minWidth: params.width,
        minHeight: params.height,
        padding: params.padding,
      },

      "& .MuiButton-outlined": {
        borderRadius: 0,
        border: `1px solid ${params.color ? params.color : "#0596A6"}`,
        color: params.color ? params.color : "#0596A6",
        fontFamily: "Noto Sans HK",
        fontSize: "18px",
        fontStyle: "normal",
        fontWeight: "700",
        lineHeight: "normal",
        // letterSpacing: "3.6px",
        minWidth: params.width,
        minHeight: params.height,
        padding: params.padding,
      },
    },
  };
});

export default useStyles;
