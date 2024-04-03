import * as React from "react";

import { FormControlLabel, Checkbox, CheckboxProps } from "@mui/material";
import useStyles from "./AppCheckBox.styles";
import { useRouter } from "next/router";

type AppCheckBoxProps = {
  label?: string;
  width?: string;
  height?: string;
  confirmPolicy?: boolean;
} & Omit<CheckboxProps, "margin">;

const AppCheckBox = (props: AppCheckBoxProps, ref: React.ForwardedRef<any>) => {
  const {
    className,
    label,
    width,
    classes: muiClasses,
    required,
    id,
    disabled,
    sx,
    placeholder,
    confirmPolicy,
    defaultValue,
    onChange,
    ...rest
  } = props;

  const { locale } = useRouter();

  const { classes } = useStyles({
    params: {
      locale: locale!,
      width: props.width ?? "auto",
      height: props.height ?? "auto",
      confirmPolicy: confirmPolicy,
    },
  });

  return (
    <FormControlLabel
      className={classes.formLabelControl}
      control={<Checkbox sx={{ color: "#0596A6" }} onChange={props.onChange} />}
      id="inputConfirmAccept"
      label={props.label}
      sx={props.sx}
    />
  );
};

export default React.forwardRef(AppCheckBox);
