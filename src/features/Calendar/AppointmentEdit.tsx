import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAppointmentUpdateMutation } from "@src/graphQL/serverMocks/graphQLGeneratedCode";
import { useFeedbackService } from "@src/services/FeedbackService";

import { Form, Formik } from "formik";
import { PanelContainerWithHeader } from "@src/common/components/Panel/PanelContainerWithHeader";
import { Appointment } from "@src/types/Appointment";
import AppointmentForm from "./AppointmentForm";

import RouterConfig from "@src/app/RouterConfig";
import { ERROR_MESSAGES } from "@src/app/Strings";
import {
  getAppointmentEditInitialValues,
  getUpdateAppointmentMutationValues,
  validateAppointmentValues,
} from "./AppointmentUtils";

interface IAppointmentEditProps {
  onDismiss: () => void;
  appointment: Appointment;
}

const AppointmentEdit: React.FC<IAppointmentEditProps> = ({
  onDismiss,
  appointment,
}) => {
  const { setErrorToast } = useFeedbackService();
  const navigate = useNavigate();

  const [saveDisabled, setSaveDisabled] = useState(false);
  const [updateAppointment, { loading }] = useAppointmentUpdateMutation({
    refetchQueries: ["GetAppointments", "GetCareRecipientTimeline"],
    onCompleted: () => {
      navigate(RouterConfig.Appointment(appointment.id) + "?status=edited", {
        replace: true,
      });
    },
    onError: () => {
      setErrorToast(ERROR_MESSAGES.EDIT_APPOINTMENT);
      setSaveDisabled(false);
    },
  });

  const initialValues = getAppointmentEditInitialValues(appointment);

  return (
    <>
      <Formik
        validate={(values) => {
          const errors = validateAppointmentValues(values);

          return errors;
        }}
        initialValues={initialValues}
        onSubmit={async (values) => {
          setSaveDisabled(true);

          const updateAppointmentValues =
            await getUpdateAppointmentMutationValues(values, appointment.id);
          await updateAppointment(updateAppointmentValues);

          setSaveDisabled(false);
        }}
      >
        {(formik) => (
          <Form>
            <PanelContainerWithHeader
              title={"Edit Event"}
              onClose={onDismiss}
              {...{ formik }}
              actionButtonText={"Save"}
              loading={saveDisabled || loading}
              onClickActionButton={() => {
                if (!saveDisabled) {
                  formik.handleSubmit();
                }
              }}
            >
              <AppointmentForm formik={formik} onDismiss={onDismiss} />
            </PanelContainerWithHeader>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AppointmentEdit;
