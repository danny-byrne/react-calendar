import React, { useEffect, useState } from "react";
import { Stack, Text, WeeklyDayPicker } from "@fluentui/react";
import { useIsMobile } from "src/common/hooks/useMediaQueries";
import { useAddPanelControls } from "src/common/hooks/useAddPanel";
import { useQueryStringParams } from "src/common/hooks/useQueryStringParams";
import { useLocation, useNavigate } from "react-router";
// import { useGetAppointmentsQuery } from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import { useFeedbackService } from "src/services/FeedbackService";

import FloatingActionButton from "src/components/FAB/FloatingActionButton";
import { getClassNames as getFABClassNames } from "src/components/FAB/FloatingActionButton.classNames";

import { AddPanel } from "src/components/Panel/AddPanel";
import SubHeaderLayout from "src/components/Layout/SubHeaderLayout";
import AppointmentAdd from "./AppointmentAdd";
import ReusableCardList from "src/components/ReusableCardList/ReusableCardList";

import RouterConfig from "src/app/RouterConfig";
import {
  months,
  monthsFullNames,
  weekdays,
  weekdaysFull,
} from "src/utils/utils";
import { getDateAtMidday, getToday } from "src/utils/dates";
//TODO: pull this style into calenbdar styles
// import { weeklydaypickerStyles } from "../Medications/Medications.classNames";
import { getClassNames } from "./Calendar.classNames";
import { Appointment } from "src/types/Appointment";
// import { isOccuringOn } from "./AppointmentUtils";
import ReusablePrintButton from "src/components/ReusablePrintButton/ReusablePrintButton";
import { usePrintPanelControls } from "src/common/hooks/usePrintPanel";
import { PrintPanel } from "src/components/Panel/PrintPanel";
import CalendarPrintPanel from "src/features/PrintableContent/CalendarPrint/CalendarPrintPanel";
import {
  useGetTimezoneInfo,
  getAdjustedTime,
} from "src/common/hooks/useGetTimezoneInfo";

const Calendar: React.FC = () => {
  const { setSuccessToast } = useFeedbackService();
  const { getSearchParam, removeSearchParam } = useQueryStringParams();
  const { showAddPanel, hideAddPanel } = useAddPanelControls();
  const { showPrintPanel, hidePrintPanel } = usePrintPanelControls();

  const fabClassNames = getFABClassNames(false);
  const classNames = getClassNames();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const status = getSearchParam("status");
  const location = useLocation();
  const state = location.state;

  // const { data } = useGetAppointmentsQuery();
  // replace with dummy data until API is set up

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState("");
  const [day, setDay] = useState(1);
  const [isToday, setIsToday] = useState(true);

  const onClickActionButton = isMobile ? undefined : showAddPanel;
  const dayLabels = isMobile ? weekdays : weekdaysFull;

  useEffect(() => {
    if (status === "added" || status === "deleted") {
      removeSearchParam("status");
      setSuccessToast(`Event ${status}`);
    }
  }, [status]);

  useEffect(() => {
    if (state?.mode === "add") {
      showAddPanel();
    }
  }, []);

  useEffect(() => {
    const setSelectedDateAsBeginningOfToday = () => {
      const today = getToday();
      setSelectedDate(today);
      setMonth(monthsFullNames[today.getMonth()]);
      setDay(today.getDate());
    };

    setSelectedDateAsBeginningOfToday();
  }, []);

  //   useEffect(() => {
  //     if (data && selectedDate) {
  //       const filteredAppointments =
  //         data?.careRecipientAppointments?.appointments.filter((appointment) => {
  //           return isOccuringOn(appointment, selectedDate);
  //         });
  //       filteredAppointments.sort((a, b) => {
  //         const aDate = new Date(a.startDateTime).getTime();
  //         const bDate = new Date(b.startDateTime).getTime();

  //         return aDate - bDate;
  //       });
  //       setAppointments(filteredAppointments);
  //     }
  //   }, [data, selectedDate]);

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

  const { appUserTimezone, careRecipientTimezone } = useGetTimezoneInfo();

  const buttonPropsList = appointments.map((appointment) => {
    const { startDateTime, endDateTime } = appointment;

    const { timeText } = getAdjustedTime({
      startDateTime,
      endDateTime,
      careRecipientTimezone,
      appUserTimezone,
    });

    return {
      onClick: () => navigate(RouterConfig.Appointment(appointment.id)),
      content: (
        <AppointmentCard
          titleText={appointment.description}
          timetext={timeText}
        />
      ),
    };
  });

  return (
    <>
      <SubHeaderLayout
        title={"Allergies"}
        actionButtonText={"Add"}
        onClickActionButton={onClickActionButton}
      >
        {isMobile && (
          <Stack
            className={fabClassNames["wc-FloatingActionButton--fabContainer"]}
          >
            <FloatingActionButton onClick={showAddPanel} />
          </Stack>
        )}
        <Stack tokens={{ childrenGap: 8 }}>
          <WeeklyDayPicker
            strings={{
              nextWeekAriaLabel: "Next Week:",
              prevWeekAriaLabel: "Prev Week:",
              goToToday: getToday().toString(),
              shortDays: dayLabels,
              shortMonths: months,
              months: months,
              days: ["1"],
            }}
            initialDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(getDateAtMidday(date));
              setMonth(monthsFullNames[date.getMonth()]);
              setDay(date.getDate());
              setIsToday(date.toDateString() === getToday().toDateString());
            }}
            // styles={weeklydaypickerStyles}
          />
          <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
          >
            <Text className={classNames["wc-Calendar--calendarDayText"]}>
              {month} {day} {isToday && "Today"}
            </Text>
            <ReusablePrintButton onClick={showPrintPanel} />
          </Stack>

          <ReusableCardList buttonPropsList={buttonPropsList} />
        </Stack>
        <AddPanel>
          <AppointmentAdd onDismiss={hideAddPanel} />
        </AddPanel>
      </SubHeaderLayout>
      <PrintPanel>
        <CalendarPrintPanel
          onDismiss={hidePrintPanel}
          //   appointments={data?.careRecipientAppointments?.appointments}
          appointments={[]}
        />
      </PrintPanel>
    </>
  );
};

export default Calendar;
