import { mergeStyleSets, FontWeights } from "@fluentui/react";
import { FONT_FAMILY, PRINT_BORDER_STYLE } from "@src/common/styles/constants";
import { colors } from "@src/common/styles/colors";

interface IActivitiesClassNames {
  "wc-MedicationsPrint--innerContent": string;
  "wc-MedicationsPrint--MedicationsLabelContainer": string;
  "wc-MedicationsPrint--MedicationsGrid": string;
  "wc-MedicationsPrint--MedicationsGridLabel": string;
  "wc-MedicationsPrint--MedicationContent": string;
  "wc-MedicationsPrint--MedicationsPageContainer": string;
  "wc-MedicationsPrint--MedicationContainer": string;
  "wc-MedicationsPrint--allMedicationsStatusLabel": string;
  "wc-MedicationsPrint--headerBuffer": string;
  "wc-MedicationsPrint--columnNamesContainer": string;
}
export const ACTIVITY_TOKEN_GAP = 5;

const borderRadius = "5px";
const MEDICATION_CONTAINER_HEIGHT = 95;
const ACTIVITY_GRID_HEIGHT =
  5 * (MEDICATION_CONTAINER_HEIGHT + ACTIVITY_TOKEN_GAP);

export const getClassNames = (numberOfColumns): IActivitiesClassNames => {
  const columnsWidth = `${100 / numberOfColumns}%`;
  return mergeStyleSets({
    "wc-MedicationsPrint--innerContent": {
      height: "100%",
      width: "100%",
      fontFamily: FONT_FAMILY,
      color: colors.windcrest.printColor,
    },
    "wc-MedicationsPrint--MedicationsPageContainer": {
      height: 740,
      width: "100%",
    },
    "wc-MedicationsPrint--MedicationsLabelContainer": {
      fontWeight: FontWeights.semibold,
      fontSize: "14px",
      height: "25px",
    },
    "wc-MedicationsPrint--MedicationsGrid": {
      width: "100%",
      height: ACTIVITY_GRID_HEIGHT,
    },
    "wc-MedicationsPrint--MedicationsGridLabel": {
      width: columnsWidth,
      height: "20px",
      fontSize: "12px",
      paddingLeft: "4px",
    },
    "wc-MedicationsPrint--MedicationContainer": {
      width: "100%",
      height: MEDICATION_CONTAINER_HEIGHT,
      border: PRINT_BORDER_STYLE,
      borderRadius: borderRadius,
    },
    "wc-MedicationsPrint--MedicationContent": {
      width: columnsWidth,
      paddingLeft: "6px",
      fontSize: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "wc-MedicationsPrint--postPageBreakMargin": {
      height: "30px",
      width: "100%",
    },
    "wc-MedicationsPrint--columnNamesContainer": {
      backgroundColor: "#EDEBE9",
      borderRadius: borderRadius,
    },
    "wc-MedicationsPrint--headerBuffer": {
      height: "40px",
      width: "100%",
    },
    "wc-MedicationsPrint--footerContent": {
      fontSize: "10px",
    },
    "wc-MedicationsPrint--activitiesLabelContainer": {},
    "wc-MedicationsPrint--allMedicationsStatusLabel": {
      fontWeight: FontWeights.semibold,
      fontSize: "12px",
    },
  });
};
