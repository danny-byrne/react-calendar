import { FontWeights, mergeStyleSets } from "@fluentui/react";
import { CustomCardType } from "./CustomCard";
import { colors } from "@src/common/styles/colors";

interface ICustomCardClassNames {
  "wc-CustomCard--container": string;
  "wc-CustomCard--cardContent": string;
  "wc-CustomCard--text": string;
  "wc-CustomCard--buttonIcon": string;
  "wc-CustomCard--clickableCardContent": string;
  "wc-CustomCard--cardHeader": string;
}

export const getClassNames = (
  buttonType: CustomCardType = CustomCardType.Middle,
  customClass: any = {}
): ICustomCardClassNames => {
  return mergeStyleSets({
    "wc-CustomCard--container": [
      {
        width: "100%",
        height: "auto",
        backgroundColor: colors.fabric.neutrals.white,
        color: "#292827",
        border: "none",
        gap: 6,
        padding: "10px 16px 10px",
        // needed to prevent FluentUI styling override after click
        ":hover": {
          backgroundColor: customClass.backgroundColor
            ? customClass.backgroundColor
            : colors.fabric.neutrals.white,
          borderBottomColor: colors.fabric.neutrals.gray30,
          boxShadow:
            "0px 0.6px 1.8px rgba(0, 0, 0, 0.1), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13);",
        },
      },
      buttonType === CustomCardType.Only && {
        borderRadius: "12px",
      },
      buttonType === CustomCardType.Bottom && {
        borderRadius: "0px 0px 12px 12px",
      },
      buttonType === CustomCardType.Top && {
        borderRadius: "12px 12px 0px 0px",
      },
      buttonType === CustomCardType.Middle && {
        borderRadius: "0px",
      },
      customClass,
    ],
    "wc-CustomCard--cardContent": {
      width: "100%",
      fontSize: 16,
    },
    "wc-CustomCard--clickableCardContent": {
      width: "100%",
      color: colors.fabric.neutrals.WCprimary,
      fontSize: 16,
      fontWeight: FontWeights.regular,
      position: "relative",
      left: -2,
      cursor: "pointer",
    },
    "wc-CustomCard--cardHeader": {
      width: "100%",
      fontSize: 16,
      fontWeight: FontWeights.semibold,
    },
    "wc-CustomCard--text": {
      fontSize: "1rem",
    },
    "wc-CustomCard--buttonIcon": {
      color: colors.fabric.neutrals.WCprimary,
      justifySelf: "flex-end",
      position: "relative",
      top: "2px",
    },
  });
};
