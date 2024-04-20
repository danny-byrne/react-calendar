import React from "react";
import { Stack } from "@fluentui/react";

import {
  getClassNames,
  getScheduleGridClassNames,
} from "../PrintableContentContainer.classNames";
import PrintablePageHeader from "@src/features/PrintableContent/PrintablePageHeader";
import PrintablePageFooter from "@src/features/PrintableContent/PrintablePageFooter";
import { IRecipientDataType } from "@src/common/hooks/useGetDataForPrintPages";
import {
  createHourLabels,
  renderEvents,
  generateGridLines,
} from "./CalendarPrintElements";

import {
  formatDateRange,
  determineEventPositioning,
  getTimeRangeForWeek,
  getGridDimensions,
} from "./helpers";

export interface Event {
  description: string;
  dosageInfo: string;
  endDateTime: string;
  endTime: string;
  location: string;
  startDate: Date;
  startDateTime: Date;
  startTime: string;
  type: string;
  position?: string;
  overlapsNext?: boolean;
  overlapsPrevious?: boolean;
}

export type DayBlock = Event[];

interface IWeekValues {
  startDay: Date;
  days: DayBlock[];
}

interface ICalendarPrintProps {
  recipientData: IRecipientDataType;
  weeksData: IWeekValues[];
}

const classNames = getClassNames();

const CalendarPrint = (props: ICalendarPrintProps) => {
  const { recipientData, weeksData } = props;

  return (
    <div className={classNames["wc-PrintableContent--innerContent"]}>
      {weeksData.map((week, i) => {
        return (
          <CalendarPage
            pageNumber={i + 1}
            key={Math.random()}
            includePageBreak={i !== weeksData.length}
            week={week}
            recipientData={recipientData}
          />
        );
      })}
    </div>
  );
};

interface ICalendarPagePrintProps {
  pageNumber: number;
  includePageBreak: boolean;
  week: IWeekValues;
  recipientData: IRecipientDataType;
}

const CalendarPage: React.FC<ICalendarPagePrintProps> = ({
  pageNumber,
  includePageBreak,
  week,
  recipientData,
}) => {
  const dateRangeLabel = formatDateRange(week.startDay, recipientData.timeZone);

  return (
    <>
      {pageNumber > 1 && (
        <div className={classNames["wc-PrintableContent--headerBuffer"]} />
      )}

      <Stack
        className={classNames["wc-PrintableContent--PageContainer"]}
        verticalAlign="space-between"
      >
        <div>
          <PrintablePageHeader recipientData={recipientData} />
          <div className={classNames["wc-PrintableContent--timeframeText"]}>
            {dateRangeLabel}
          </div>

          <ScheduleSection week={week} />
        </div>
        <PrintablePageFooter
          includePageBreak={includePageBreak}
          pageNumber={pageNumber}
          recipientData={recipientData}
        />
      </Stack>
    </>
  );
};

interface IScheduleSectionProps {
  week: IWeekValues;
}

const ScheduleSection: React.FC<IScheduleSectionProps> = ({ week }) => {
  const { days } = week;
  const daysWithEvents: DayBlock[] = days.filter((day) => day);

  const { range, hourRangeLabels } = getTimeRangeForWeek(daysWithEvents);

  const { gridTemplateColumns, gridTemplateRows, numRows, numColumns } =
    getGridDimensions(range, daysWithEvents);
  const events = daysWithEvents.map((day, i) => {
    //if any data on days at index, grab the specific events
    let renderedEvents = [];
    const hoursColumnOffset = 1;
    const dayColumnIndex = i * 2;
    const positionedEvents = determineEventPositioning(day, range);
    renderedEvents = renderEvents({
      events: positionedEvents,
      day: dayColumnIndex + hoursColumnOffset,
      range,
    });

    return renderedEvents;
  });

  const hoursDisplay = createHourLabels(hourRangeLabels, numRows);

  const scheduleGridClassNames = getScheduleGridClassNames({
    gridTemplateColumns,
    gridTemplateRows,
  });

  const gridLines = generateGridLines(numRows, numColumns);

  return (
    <div
      className={
        scheduleGridClassNames["wc-PrintableContent--scheduleContainer"]
      }
    >
      {hoursDisplay}
      {events}
      {gridLines}
    </div>
  );
};

export default CalendarPrint;
