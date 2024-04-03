import { makeStyles } from "tss-react/mui";

export type IStyleParams = {
  paddingTop: string,
  paddingBot: string
};

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: "MainLayout",
  uniqId: "main_layout",
})((theme, { params }, classes) => {
  return {
    childrenContainer: {
      paddingTop: params.paddingTop,
      paddingBottom: params.paddingBot
    }
  };
});

export default useStyles;
