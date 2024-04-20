import React from "react";
import {
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Text,
} from "@fluentui/react";
import { Form, Formik } from "formik";
import {
  useDeleteMedicationMutation,
  useEndMedicationMutation,
} from "@src/graphQL/serverMocks/graphQLGeneratedCode";
import RouterConfig from "@src/app/RouterConfig";
import { useNavigate } from "react-router";

const dialogStyles = { main: { maxWidth: 450 } };

export enum PagesWithDelete {
  medication,
  member,
  condition,
  provider,
  pharmacy,
  immunization,
  allergy,
  appointment,
}

const dialogContentProps = {
  type: DialogType.normal,
  title: "Remove medication",
  closeButtonAriaLabel: "Close",
};

const NO_LONGER_TAKING = "noLongerTaking";
const DELETE = "delete";
const THEY_ARE_NO_LNGER_TAKING_TEXT =
  "They are no longer taking this medication";

interface DeleteDialogProps {
  hidden: boolean;
  toggleHideDialog: () => void;
  id: string;
}
const EndMedicationDialog: React.FC<DeleteDialogProps> = ({
  hidden,
  toggleHideDialog,
  id,
}) => {
  const navigate = useNavigate();

  const modalProps = React.useMemo(
    () => ({
      isBlocking: false,
      styles: dialogStyles,
    }),
    []
  );

  const [deleteMedication] = useDeleteMedicationMutation({
    variables: { id: id },
    refetchQueries: ["GetPrescriptions"],
    errorPolicy: "all",
    onCompleted: () => {
      navigate(RouterConfig.Medications + "?status=deleted", { replace: true });
    },
  });

  const [moveMedicationToNoLongerTaking] = useEndMedicationMutation({
    variables: { id: id },
    refetchQueries: ["GetPrescriptionsWithSchedule", "GetMedication"],
    onCompleted: () => {
      navigate(RouterConfig.Medications + "?status=moved", { replace: true });
    },
  });

  return (
    <Dialog
      hidden={hidden}
      onDismiss={toggleHideDialog}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      <Formik
        initialValues={{
          choice: NO_LONGER_TAKING,
        }}
        onSubmit={async (values) => {
          if (values.choice === DELETE) {
            deleteMedication();
          } else {
            moveMedicationToNoLongerTaking();
          }
        }}
      >
        {(formik) => (
          <Form>
            <Text>{THEY_ARE_NO_LNGER_TAKING_TEXT}</Text>
            <DialogFooter>
              <DefaultButton onClick={toggleHideDialog} text="Cancel" />
              <PrimaryButton onClick={formik.submitForm} text="Confirm" />
            </DialogFooter>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EndMedicationDialog;
