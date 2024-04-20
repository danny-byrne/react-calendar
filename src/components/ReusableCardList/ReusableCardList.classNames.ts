import { mergeStyleSets } from "@fluentui/react";
import { BREAKPOINTS } from "@src/app/Breakpoints";

interface IReusableCardListClassNames {
  "wc-ReusableCardList--list": string;
  "wc-ReusableCardList--separatorColorContainer": string;
  "wc-ReusableCardList--separatorMarginContainer": string;
  "wc-ReusableCardList--separator": string;
}

export const getClassNames = (): IReusableCardListClassNames => {
  return mergeStyleSets({
    "wc-ReusableCardList--list": {
      width: "100%",
      boxShadow:
        "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);",
      borderRadius: "12px",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        marginRight: 8,
      },
    },
    "wc-ReusableCardList--separatorColorContainer": {
      backgroundColor: "white",
      height: "2px",
    },
    "wc-ReusableCardList--separatorMarginContainer": {
      marginLeft: "16px",
      height: "1px",
    },
    "wc-ReusableCardList--separator": {
      padding: "0px",
      height: "1px",
    },
  });
};
