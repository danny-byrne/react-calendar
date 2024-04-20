import { mergeStyleSets } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";

interface IActionButtonRowClassNames {
  "wc-ActionButtonRow--removeButton": string;
  "wc-ActionButtonRow--buttonRow": string;
  "wc-ActionButtonRow--buttonSeparator": string;
}

export const getClassNames = (inline: boolean): IActionButtonRowClassNames => {
  return mergeStyleSets({
    "wc-ActionButtonRow--removeButton": {
      color: colors.fabric.neutrals.WCprimary,
      borderRadius: "100px",
      border: "1px solid",
      marginLeft: "0.5rem!important",
    },
    "wc-ActionButtonRow--buttonRow": [
      {
        width: "100%",
        justifyContent: "center",
      },
      inline && {
        justifyContent: "flex-end",
      },
      !inline && {
        paddingTop: "1rem",
      },
    ],
    "wc-ActionButtonRow--buttonSeparator": {
      margin: "0 1.5rem",
    },
  });
};
