import { IDatePickerStyles } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";

export const datePickerStyles: IDatePickerStyles = {
  icon: {
    right: "11px",
    color: colors.fabric.neutrals.WCprimary,
    ".ms-TextField-fieldGroup:hover &": {
      color: colors.fabric.neutrals.gray130,
    },
    ".ms-TextField-fieldGroup:focus &": {
      color: colors.fabric.neutrals.WCprimary,
    },
  },
  root: "",
  textField: {
    selectors: {
      ".ms-TextField-fieldGroup": {
        alignItems: "center",
      },
    },
  },
  callout: "",
};
