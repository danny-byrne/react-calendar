import { mergeStyleSets } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";

interface IReuseableCardButtonListClassNames {
  "wc-ReusablePrintButton--button": string;
}

export const getClassNames = (isRow): IReuseableCardButtonListClassNames => {
  return mergeStyleSets({
    "wc-ReusablePrintButton--button": {
      position: "relative",
      top: isRow ? 10 : 0,
      color: colors.fabric.neutrals.WCprimary,
      borderRadius: "100px",
      border: "1px solid",
      height: "40px",
      width: "40px",
    },
  });
};
