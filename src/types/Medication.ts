import {
  GetPrescriptionsWithScheduleQuery,
  MedicationPrescriptionCreateInput,
  MedicationPrescriptionUpdateInput,
  RefillUpdateInput,
} from "@src/graphQL/serverMocks/graphQLGeneratedCode";

export type MedicationCreateVariables = {
  prescription: MedicationPrescriptionCreateInput;
};
export type UpdateMedicationVariables = {
  prescription: MedicationPrescriptionUpdateInput;
};

export type RefillUpdateVariables = {
  refill: RefillUpdateInput;
};

export type Prescription =
  GetPrescriptionsWithScheduleQuery["careRecipientMedicationPrescriptions"]["prescriptions"][0];

export type Refill =
  GetPrescriptionsWithScheduleQuery["careRecipientMedicationPrescriptions"]["prescriptions"][0]["refills"][0];
