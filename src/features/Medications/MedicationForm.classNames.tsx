import { mergeStyleSets } from "@fluentui/react";
import { BREAKPOINTS } from "@src/common/styles/Breakpoints";

interface IMedicationFormClassNames {
  "wc-MedicationForm--nextRefillDate": string;
  "wc-MedicationForm--numberOfRefills": string;
  "wc-MedicationForm--prescriptionToggle": string;
  "wc-MedicationForm--refillDetails": string;
  "wc-MedicationForm--conditionsDropdown": string;
}

export const getClassNames = (): IMedicationFormClassNames => {
  return mergeStyleSets({
    "wc-MedicationForm--prescriptionToggle": {
      width: "100%",
      fontSize: "13px",
    },
    "wc-MedicationForm--nextRefillDate": {
      flex: "3",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        flex: "1",
      },
    },
    "wc-MedicationForm--numberOfRefills": {
      flex: "1",
      paddingLeft: "6px",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        flex: "1",
      },
    },
    "wc-MedicationForm--conditionsDropdown": {
      flex: "1",
    },
    "wc-MedicationForm--refillDetails": {
      justifyContent: "flex-start",
    },
  });
};
