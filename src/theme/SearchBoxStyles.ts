import { ISearchBoxStyles } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";

export const SearchBoxStyles: ISearchBoxStyles = {
  root: {
    height: "50px",
    paddingLeft: "16px",
    borderColor: colors.fabric.neutrals.gray40,
    ":hover": {
      borderColor: colors.fabric.neutrals.WCprimary,
    },
    "&.is-active": {
      paddingLeft: "16px",
    },
    "&.ms-Callout": {
      paddingLeft: "0",
    },
  },
  field: {
    color: colors.fabric.neutrals.WCprimary,
  },
};
