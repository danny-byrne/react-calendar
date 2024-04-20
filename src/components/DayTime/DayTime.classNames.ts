import { mergeStyleSets, FontSizes, FontWeights } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";

interface ILayoutClassNames {
  "wc-Daytime--timeText": string;
  "wc-Daytime--container": string;
  "wc-Daytime--iconContainer": string;
  "wc-Daytime--wrapper": string;
}

export const getClassNames = (): ILayoutClassNames => {
  return mergeStyleSets({
    "wc-Daytime--wrapper": {
      display: "inline-block",
    },
    "wc-Daytime--container": {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50px",
      padding: "5px 8px",
      minWidth: 80,
      maxWidth: 300,
      backgroundColor: colors.fabric.neutrals.PBItint30,
    },
    "wc-Daytime--iconContainer": {
      marginRight: "2px",
      display: "flex",
    },
    "wc-Daytime--timeText": {
      fontSize: FontSizes.size12,
      fontWeight: FontWeights.semibold,
      paddingLeft: "4px",
    },
  });
};
