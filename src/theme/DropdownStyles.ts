import { IDropdownStyles } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";

export const dropdownStyles: IDropdownStyles = {
  root: "",
  label: "",
  dropdown: {
    display: "flex",
    "&:focus:after": {
      borderRadius: "12px",
    },
  },
  title: {
    height: "50px",
    borderColor: colors.fabric.neutrals.gray60,
    display: "flex",
    alignItems: "center",
    paddingLeft: "16px",
    color: colors.fabric.neutrals.WCprimary,
    width: "100%",
    ".ms-Dropdown-titleIsPlaceHolder&": {
      color: colors.fabric.neutrals.gray130,
    },
    ".ms-Dropdown:hover &": {
      borderColor: colors.fabric.neutrals.WCprimary,
      color: colors.fabric.neutrals.gray130,
    },
    ".ms-Dropdown:focus &": {
      color: colors.fabric.neutrals.WCprimary,
    },
  },
  caretDownWrapper: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingRight: "8px",
  },
  caretDown: "",
  errorMessage: "",
  dropdownItemsWrapper: "",
  dropdownItems: "",
  dropdownItem: {
    minHeight: "46px",
    paddingLeft: "16px",
  },
  dropdownItemSelected: {
    minHeight: "46px",
    paddingLeft: "16px",
    backgroundColor: "white",
  },
  dropdownItemDisabled: "",
  dropdownItemSelectedAndDisabled: "",
  dropdownItemHidden: "",
  dropdownOptionText: {
    whiteSpace: "normal",
  },
  dropdownDivider: "",
  dropdownDividerHidden: "",
  dropdownItemHeader: {
    paddingLeft: "16px",
  },
  dropdownItemHeaderHidden: "",
  panel: "",
  callout: {
    maxHeight: "400px !important",
  },
  subComponentStyles: undefined,
};
