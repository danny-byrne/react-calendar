import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoolean } from "@fluentui/react-hooks";
import { useQueryStringParams } from "src/common/hooks/useQueryStringParams";
import { usePanelWidth } from "src/common/hooks/usePanelWidth";
import {
  useGetAppointmentsQuery,
  useGetPrescriptionsQuery,
  useGenerateQuestionsForProviderQuery,
  useAppointmentDeleteMutation,
} from "src/graphQL/serverMocks/graphQLGeneratedCode";

import { Panel, Stack, Text, PanelType, Spinner } from "@fluentui/react";
import { Back, DeleteDialog } from "src/common/components";
import SubHeaderLayout from "src/common/components/Layout/SubHeaderLayout";
import ActionButtonRow from "src/common/components/ActionButtonRow/ActionButtonRow";
import ReusableCardList from "src/common/components/ReusableCardList/ReusableCardList";
import AppointmentEdit from "./AppointmentEdit";

import RouterConfig from "src/app/RouterConfig";
import { Prescription } from "src/types/Medication";
import { PanelStyleOverrides } from "src/common/components/Panel/PanelStyleOverrides";
import { PagesWithDelete } from "src/common/components/dialogs/EndMedicationDialog";
import { Appointment } from "src/types/Appointment";
import { monthsFullNames } from "src/utils/utils";
import { getToday } from "src/utils/dates";
import { getClassNames } from "./AppointmentView.classNames";

import {
  getAdjustedTime,
  useGetTimezoneInfo,
} from "src/common/hooks/useGetTimezoneInfo";

const AppointmentView: React.FC = () => {
  const { data } = useGetAppointmentsQuery();
  const { id } = useParams();
  const { getSearchParam, addSearchParam, removeSearchParam } =
    useQueryStringParams();

  const classNames = getClassNames();
  const customWidth = usePanelWidth();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment>(null);
  const [timeText, setTimeText] = useState("");
  const [dateText, setDateText] = useState("");
  const [hideDeleteDialog, { toggle: toggleHideDeleteDialog }] =
    useBoolean(true);
  const [medications, setMedications] = useState<Prescription[]>([]);

  const showEdit = getSearchParam("mode") === "edit";
  const showEditPanel = () => addSearchParam({ mode: "edit" });
  const hideEditPanel = () => removeSearchParam("mode");

  // Strip `mode` from deep-links. This restriction keeps the
  // Back navigation stack in a healthy state.
  useEffect(() => {
    if (getSearchParam("mode")) removeSearchParam("mode");
  }, []);

  const { data: medicationData } = useGetPrescriptionsQuery();
  const {
    data: questionData,
    loading: questionLoading,
    refetch: refetchQuestionData,
  } = useGenerateQuestionsForProviderQuery();

  useEffect(() => {
    refetchQuestionData();
  }, []);

  const [deleteAppointment] = useAppointmentDeleteMutation({
    variables: { input: { id: id } },
    refetchQueries: ["GetAppointments", "GetCareRecipientTimeline"],
    errorPolicy: "all",
    onCompleted: () => {
      navigate(RouterConfig.Calendar + "?status=deleted", { replace: true });
    },
  });

  const handleDelete = async (event) => {
    event.preventDefault();
    await deleteAppointment();
    toggleHideDeleteDialog();
  };

  useEffect(() => {
    if (medicationData) {
      setMedications(
        medicationData.careRecipientMedicationPrescriptions?.prescriptions
      );
    }
  }, [medicationData]);

  useEffect(() => {
    if (data) {
      const selectedAppointment =
        data?.careRecipientAppointments?.appointments.filter(
          (appointment) => appointment.id === id
        );
      setAppointment(selectedAppointment[0]);
    }
  }, [data]);

  const { appUserTimezone, careRecipientTimezone } = useGetTimezoneInfo();

  useEffect(() => {
    let dateText = "";
    if (appointment) {
      const { startDateTime, endDateTime } = appointment;

      const { timeText } = getAdjustedTime({
        startDateTime,
        endDateTime,
        careRecipientTimezone,
        appUserTimezone,
      });

      setTimeText(timeText);

      const startDate = new Date(startDateTime);

      dateText = `${
        monthsFullNames[startDate.getMonth()]
      } ${startDate.getDate()}`;
      if (startDate.toDateString() === getToday().toDateString()) {
        dateText = "Today";
      }

      setDateText(dateText);
    }
  }, [appointment]);

  const dateProps = [
    {
      content: (
        <Stack tokens={{ childrenGap: 8 }}>
          <Text className={classNames["wc-AppointmentView--cardTitleText"]}>
            {dateText}
          </Text>
          <Text>{timeText}</Text>
        </Stack>
      ),
    },
    // {
    //     // TODO: Make this dynamic
    //     content: <Text>Reminders</Text>,
    // },
  ];

  const medicationProps = [
    {
      content: (
        <Stack tokens={{ childrenGap: 8 }}>
          <Text className={classNames["wc-AppointmentView--cardTitleText"]}>
            Medications
          </Text>
          {medications.map((medication) => {
            return (
              <Stack key={medication.id}>
                <Text
                  className={classNames["wc-AppointmentView--medTitleText"]}
                >
                  {medication.medication?.name} {medication.strengthValue}
                </Text>
                {medication.takenFor?.condition && (
                  <Text
                    className={
                      classNames["wc-AppointmentView--medConditionText"]
                    }
                  >
                    {medication.takenFor?.condition?.name}
                  </Text>
                )}
              </Stack>
            );
          })}
        </Stack>
      ),
    },
  ];

  const questionProps = [
    {
      content: (
        <Stack tokens={{ childrenGap: 8 }}>
          <Text className={classNames["wc-AppointmentView--cardTitleText"]}>
            Questions for Provider
          </Text>
          {questionLoading ? (
            <Spinner />
          ) : (
            questionData?.questionGenerate?.result?.questions.map(
              (question) => (
                <Text
                  key={question}
                  className={classNames["wc-AppointmentView--questionText"]}
                >
                  {question}
                </Text>
              )
            )
          )}
        </Stack>
      ),
    },
  ];

  return (
    <>
      <SubHeaderLayout
        title={"Appointment Detail"}
        actionButtonText={"Edit"}
        onClickActionButton={showEditPanel}
        onDelete={toggleHideDeleteDialog}
      >
        <DeleteDialog
          hidden={hideDeleteDialog}
          toggleHideDialog={toggleHideDeleteDialog}
          onDelete={handleDelete}
          screen={PagesWithDelete.appointment}
        >
          Delete
        </DeleteDialog>
        <Stack horizontal>
          <Back />
          <ActionButtonRow
            inLine
            onDelete={toggleHideDeleteDialog}
            hideSeparator
          />
        </Stack>
        <Stack tokens={{ childrenGap: 24 }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Text className={classNames["wc-AppointmentView--titleText"]}>
              {appointment?.description}
            </Text>
            {appointment?.location?.freeTextAddress && (
              <Text>{appointment.location.freeTextAddress}</Text>
            )}
          </Stack>

          <ReusableCardList buttonPropsList={dateProps} />
          <Stack tokens={{ childrenGap: 16 }}>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text
                className={classNames["wc-AppointmentView--sectionHeaderText"]}
              >
                Details
              </Text>
              <Stack tokens={{ childrenGap: 16 }}>
                {medications.length > 0 && (
                  <ReusableCardList buttonPropsList={medicationProps} />
                )}
                <ReusableCardList buttonPropsList={questionProps} />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Panel
          isOpen={showEdit}
          isLightDismiss
          hasCloseButton={false}
          onDismiss={hideEditPanel}
          data-testid="editPanel"
          // Disabling navigation container to replace with header in form
          onRenderNavigation={() => null}
          onRenderHeader={() => null}
          styles={PanelStyleOverrides}
          type={PanelType.custom}
          customWidth={customWidth}
          allowTouchBodyScroll
        >
          <AppointmentEdit
            onDismiss={hideEditPanel}
            appointment={appointment}
          />
        </Panel>
      </SubHeaderLayout>
    </>
  );
};

export default AppointmentView;
