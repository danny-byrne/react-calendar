import { Stack, Text } from "@fluentui/react";
import { getClassNames } from "./Calendar.classNames";
import { getAdjustedTime } from "@src/common/hooks/useGetTimezoneInfo";

const classNames = getClassNames();

interface IExampleAppointmentProps {
  titleText: string;
  timetext: string;
  locationName?: string;
}

const AppointmentCard: React.FC<IExampleAppointmentProps> = ({
  titleText,
  timetext,
  locationName,
}) => {
  return (
    <Stack>
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <div className={classNames["wc-Calendar--appointmentBar"]} />
        <Stack>
          <Text className={classNames["wc-Calendar--appointmentText"]}>
            {titleText}
          </Text>
          <Text className={classNames["wc-Calendar--appointmentTime"]}>
            {timetext}
          </Text>
        </Stack>
      </Stack>
      {locationName && (
        <Text className={classNames["wc-Calendar--appointmentLocationText"]}>
          {locationName}
        </Text>
      )}
    </Stack>
  );
};

export const getButtonPropsList = ({
  appointments,
  appUserTimezone,
  careRecipientTimezone,
}) => {
  return appointments.map((appointment) => {
    const { startDateTime, endDateTime } = appointment;

    const { timeText } = getAdjustedTime({
      startDateTime,
      endDateTime,
      careRecipientTimezone,
      appUserTimezone,
    });

    return {
      // onClick: () => navigate(RouterConfig.Appointment(appointment.id)),
      onClick: () => console.log("clicked"),
      content: (
        <AppointmentCard
          titleText={appointment.description}
          timetext={timeText}
        />
      ),
    };
  });
};
