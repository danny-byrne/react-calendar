import {
  mergeStyleSets,
  FontWeights,
  IDocumentCardImageStyleProps,
  IDocumentCardImageStyles,
  IStyleFunctionOrObject,
} from "@fluentui/react";
import { BREAKPOINTS } from "@src/common/styles/Breakpoints";
import { colors } from "src/common/styles/colors";

interface ICarePlanClassNames {
  "wc-CareRecipient--Persona": string;
  "wc-CareRecipient--Name": string;
  "wc-CareRecipient--PrimaryDetails": string;
  "wc-CareRecipient--PrimaryDetailsHeader": string;
  "wc-CareRecipient--SecondaryDetails": string;
  "wc-CareRecipient--DetailLabels": string;
  "wc-CareRecipient--Separator": string;
  "wc-CareRecipient--Stack": string;
  "wc-CareRecipient--accordion": string;
  "wc-CareRecipient--birthDate": string;
  "wc-CareRecipient--numberOfRefills": string;
  "wc-CareRecipient--editButton": string;
  "wc-CareRecipientCard--Card": string;
  "wc-CareRecipientCard--Persona": string;
  "wc-CareRecipientCard--DetailButton": string;
  "wc-CareRecipientCard--Name": string;
  "wc-CareRecipientCard--FullName": string;
  "wc-CareRecipientCard--Details": string;
  "wc-CareRecipientCard--PrimaryDetails": string;
  "wc-CareRecipientCard--SecondaryDetails": string;
  "wc-CareRecipientEdit--accordion": string;
  "wc-CareRecipientMedicalID--Empty": string;
  "wc-CareRecipientMedicalID--Detail": string;
  "wc-CareRecipientMedicalID--Separator": string;
  "wc-CareRecipientMedicalID--Heading": string;
  "wc-CareRecipientCard--DetailsContainer": string;
}

export const getClassNames = (): ICarePlanClassNames => {
  return mergeStyleSets({
    "wc-CareRecipient--Persona": { paddingLeft: 30 },
    "wc-CareRecipient--Name": {
      fontWeight: FontWeights.semibold,
      fontSize: "1.5rem",
      textTransform: "capitalize",
    },
    "wc-CareRecipient--PrimaryDetails": {
      color: colors.fabric.neutrals.WCprimary,
      fontWeight: FontWeights.semibold,
      fontSize: "1.0rem",
    },
    "wc-CareRecipient--PrimaryDetailsHeader": {
      color: colors.fabric.neutrals.WCprimary,
      fontWeight: FontWeights.semibold,
      fontSize: "1.1rem",
      paddingLeft: 10,
    },
    "wc-CareRecipient--SecondaryDetails": {
      marginTop: 24,
      color: colors.fabric.neutrals.black,
      fontWeight: FontWeights.semibold,
      fontSize: "1rem",
    },
    "wc-CareRecipient--DetailLabels": {
      marginTop: 24,
      color: colors.fabric.neutrals.black,
      fontWeight: FontWeights.semilight,
      fontSize: ".9rem",
    },
    "wc-CareRecipient--Separator": {
      paddingTop: ".8rem",
      paddingBottom: "0rem",
    },
    "wc-CareRecipient--Stack": {
      width: "100%",
      paddingBottom: 10,
    },
    "wc-CareRecipient--accordion": {
      marginBottom: 14,
    },
    "wc-CareRecipientEdit--accordion": {
      marginBottom: 14,
      width: "100%",
      maxWidth: 480,
    },
    "wc-CareRecipient--birthDate": {
      flex: "3",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        flex: "1",
      },
      paddingTop: "16px",
    },
    "wc-CareRecipient--numberOfRefills": {
      flex: "1",
      paddingLeft: "6px",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        flex: "1",
      },
    },
    "wc-CareRecipient--editButton": {
      height: "40px",
    },
    "wc-CareRecipient--contentSubContainer": {
      justifyContent: "center",
      width: "100%",
      maxWidth: 480,
    },
    "wc-CareRecipient--formContainer": {
      width: "100%",
      paddingBottom: "5rem",
    },
    "wc-CareRecipientCard--DetailButton": {
      fontWeight: FontWeights.semibold,
      fontSize: "1rem",
      textTransform: "capitalize",
      align: "end",
      width: 175,
      height: 40,
      marginLeft: -30,
      color: colors.fabric.neutrals.WCprimary,
      [BREAKPOINTS.DESKTOP_SMALL]: {
        marginBottom: "1rem",
        color: colors.fabric.neutrals.white,
      },
    },
    "wc-CareRecipientCard--Card": {
      width: "100%",
      boxShadow:
        "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)",
      elevationDepth: "4",
      borderRadius: "12px",
      marginTop: 0,
    },
    "wc-CareRecipientCard--Persona": {
      marginTop: -45,
      marginLeft: 24,
      marginBottom: -15,
      marginRight: 0,
    },
    "wc-CareRecipientCard--Name": {
      fontWeight: FontWeights.semibold,
      fontSize: "1.3rem",
      marginBottom: "1rem",
      textTransform: "capitalize",
      horizontalAlign: "center",
    },
    "wc-CareRecipientCard--FullName": {
      marginTop: 7,
      marginLeft: -40,
      [BREAKPOINTS.DESKTOP_SMALL]: {
        marginLeft: 24,
      },
    },
    "wc-CareRecipientCard--Details": {
      marginTop: 24,
      marginLeft: 20,
      width: "93%",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        marginLeft: 24,
      },
    },
    "wc-CareRecipientCard--PrimaryDetails": {
      color: colors.fabric.neutrals.WCprimary,
      fontWeight: FontWeights.semibold,
      fontSize: "1.0rem",
      paddingRight: 30,
      horizontalAlign: "center",
    },
    "wc-CareRecipientCard--SecondaryDetails": {
      color: colors.fabric.neutrals.black,
      fontWeight: FontWeights.regular,
      fontSize: "0.9rem",
      paddingRight: 30,
      paddingBottom: "8px",
      horizontalAlign: "center",
      marginTop: "8px",
      [BREAKPOINTS.DESKTOP_SMALL]: {
        marginTop: 0,
      },
    },
    "wc-CareRecipientMedicalID--Empty": {
      color: colors.fabric.neutrals.gray90,
      fontWeight: FontWeights.semibold,
      fontSize: "20px",
      paddingTop: "4px",
      paddingBottom: 10,
    },
    "wc-CareRecipientMedicalID--Detail": {
      color: colors.fabric.neutrals.black,
      fontWeight: FontWeights.semibold,
      fontSize: "20px",
      paddingTop: "4px",
      paddingBottom: 10,
    },
    "wc-CareRecipientMedicalID--Heading": {
      paddingTop: 10,
    },
    "wc-CareRecipientMedicalID--Separator": {
      marginTop: 15,
      marginBottom: 15,
    },
    "wc-CareRecipientCard--DetailsContainer": {
      width: "100%",
    },
  });
};

export const coverPhotoStyle: IStyleFunctionOrObject<
  IDocumentCardImageStyleProps,
  IDocumentCardImageStyles
> = {
  root: {
    borderTopRightRadius: "12px",
    borderTopLeftRadius: "12px",
  },
};
