import { FontWeights, mergeStyleSets } from "@fluentui/react";
import { BREAKPOINTS } from "@src/app/Breakpoints";
import { colors } from "@src/common/styles/colors";

interface IAllergyViewClassNames {
  "wc-Calendar--appointmentBar": string;
  "wc-Calendar--appointmentText": string;
  "wc-Calendar--appointmentTime": string;
  "wc-Calendar--appointmentLocationText": string;
  "wc-Calendar--calendarDayText": string;
  "wc-AllergyView--infoContainer": string;
  "wc-AllergyView--severityContainer": string;
  "wc-AllergyView--name": string;
  "wc-AllergyView--severity": string;
}

export const getClassNames = (): IAllergyViewClassNames => {
  return mergeStyleSets({
    "wc-Calendar--appointmentBar": {
      backgroundColor: colors.fabric.neutrals.WCprimary,
      width: "6px",
      borderRadius: "3px",
    },
    "wc-Calendar--appointmentText": {
      fontSize: "17px",
      lineHeight: "22px",
    },
    "wc-Calendar--appointmentTime": {
      fontsize: "17px",
      lineHeight: "20px",
      fontWeight: 500,
    },
    "wc-Calendar--appointmentLocationText": {
      paddingLeft: "16px",
      fontSize: "12px",
      color: colors.fabric.neutrals.gray130,
    },
    "wc-Calendar--calendarDayText": {
      fontWeight: FontWeights.semibold,
      color: colors.windcrest.sectionHeaderGray,
    },
    "wc-AllergyView--infoContainer": {
      alignItems: "center",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        alignItems: "flex-start",
      },
    },
    "wc-AllergyView--severityContainer": {
      [BREAKPOINTS.DESKTOP_SMALL]: {
        paddingTop: "40px",
      },
    },
    "wc-AllergyView--name": {
      fontWeight: FontWeights.semibold,
      fontSize: "1.5rem",
    },
    "wc-AllergyView--severity": {
      fontWeight: FontWeights.semibold,
      fontSize: "1rem",
      color: colors.fabric.neutrals.WCprimary,
      width: "50%",
    },
  });
};
