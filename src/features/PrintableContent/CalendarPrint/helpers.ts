import {
    DAY_LABEL_ROW_HEIGHT,
    WEEK_DAYS,
    SCHEDULE_HOURS_DISPLAY_WIDTH,
    DAY_LENGTH_FIFTEEN_MINUTE_INCREMENTS,
    SCHEDULE_DAY_HEIGHT,
    SCHEDULE_GRID_WIDTH,
} from './constants';

import { AppointmentInput } from './CalendarPrintPanel';
import { DayBlock } from './CalendarPrint';
import { MedicationWithRRule } from 'src/features/Medications/helpers';
import { getScheduleIncrementValue, parseRRule } from 'src/helpers/medications';
import { Frequency } from 'rrule';

const MEDICATION_BLOCK_MINUTES = 30;

export const getDaysBetweenDates = (startDate: Date, endDate: Date): number => {
    // Convert the dates to UTC format
    const startUTC: Date = new Date(startDate.toUTCString());
    const endUTC: Date = new Date(endDate.toUTCString());

    // Calculate the difference in milliseconds
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const timeDifference: number = endUTC.getTime() - startUTC.getTime();

    // Calculate the number of days
    const daysDifference: number = Math.round(timeDifference / millisecondsPerDay);

    return daysDifference;
};

export const getStartWeekBasedOnIncomingEventDates = (events: ICalendarEvents): string => {
    const firstEventDate = events[0]?.startDateTime;
    //get the date on monday of the week of the first event
    const firstEventDayOfWeek = new Date(firstEventDate).getDay();
    //get the monday of the week of the first event
    const dateOfMondayOfFirstEventWeek = new Date(firstEventDate).getDate() - (firstEventDayOfWeek - 1);
    const startDay = new Date(firstEventDate).setDate(dateOfMondayOfFirstEventWeek);
    //millisecond format to utc date format
    const startWeekDay = new Date(startDay).toUTCString();
    return startWeekDay;
};

interface ISortEventDataReturnValue {
    weeks: IWeek[];
}

export const sortEventData = (events: ICalendarEvents): ISortEventDataReturnValue => {
    const sortedEvents = events.sort((a, b) => {
        return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
    });

    const { numWeeks, startDate } = findStartDateAndWeeksRange(sortedEvents);

    let eventsKeyedByDates = setKeyedEventsByDate(sortedEvents);

    const weeks = setWeeklyEvents({ eventsKeyedByDates, startDate, numWeeks });

    return { weeks };
};

interface IFindStartDateAndWeeksRangeReturnValue {
    numWeeks: number;
    startDate: Date;
}

const findStartDateAndWeeksRange = (events: ICalendarEvents): IFindStartDateAndWeeksRangeReturnValue => {
    const lastEventDate = events[events.length - 1]?.startDateTime;
    const lastEventDayOfWeek = new Date(lastEventDate).getDay();
    const dateOfSundayOfLastEventWeek = new Date(lastEventDate).getDate() + (7 - lastEventDayOfWeek);
    const endDateTime = new Date(lastEventDate).setDate(dateOfSundayOfLastEventWeek);
    const endWeekDay = new Date(endDateTime).toUTCString();
    const startWeekDay = getStartWeekBasedOnIncomingEventDates(events);
    const startDate: Date = new Date(startWeekDay);
    const endDate: Date = new Date(endWeekDay);
    const daysBetween: number = getDaysBetweenDates(startDate, endDate);

    const numWeeks = Math.ceil(daysBetween / 7);
    return { numWeeks, startDate };
};

interface IEventsKEyedByDatesReturnValue {
    [key: string]: ICalendarEvent[];
}

const setKeyedEventsByDate = (events: ICalendarEvents): IEventsKEyedByDatesReturnValue => {
    let eventsKeyedByDates = {};
    events.forEach((event) => {
        // get date at midday of event.startDateTime
        const eventDate = new Date(event.startDateTime);
        eventDate.setHours(12, 0, 0, 0);
        //chage Date type to string for key
        const eventDateKey = eventDate.toUTCString();
        //if eventHashTable already has a key of eventDateKey, add the event to the array of events
        const formattedEvent = formatEventInfoForPrint(event);

        if (eventsKeyedByDates[eventDateKey]) {
            eventsKeyedByDates[eventDateKey].push(formattedEvent);
        } else {
            //if eventHashTable does not have a key of eventDateKey, create a new array with the event
            eventsKeyedByDates[eventDateKey] = [formattedEvent];
        }
    });
    return eventsKeyedByDates;
};

interface ISetWeeklyEventsInputValue {
    eventsKeyedByDates: IEventsKEyedByDatesReturnValue;
    startDate: Date;
    numWeeks: number;
}

interface IWeek {
    days: ICalendarEvents[];
    startDay: Date;
}

const setWeeklyEvents = ({ eventsKeyedByDates, startDate, numWeeks }: ISetWeeklyEventsInputValue): IWeek[] => {
    let weeks = [];
    let referenceDate = startDate;
    for (let week = 0; week < numWeeks; week++) {
        //currentWeek is an array of 7 days, starts on a monday
        let currentWeek = {
            days: [],
            startDay: new Date(referenceDate),
        };
        for (let day = 0; day < 7; day++) {
            //figure out date of current day
            const thisDaysDate = new Date(referenceDate);
            thisDaysDate.setHours(12, 0, 0, 0);
            const thisDaysDateKey = thisDaysDate.toUTCString();
            //if table has a key of current day, add the event to the current day
            if (eventsKeyedByDates[thisDaysDateKey]) {
                currentWeek.days[day] = eventsKeyedByDates[thisDaysDateKey];
            }
            //increment referenceDate
            referenceDate.setDate(referenceDate.getDate() + 1);
        }
        weeks.push(currentWeek);
    }

    const result = weeks.filter((week) => week.days.length > 0);

    return result;
};

const formatEventInfoForPrint = (event): ICalendarEvent => {
    const startDate = event.startDateTime;

    const startTime = formatTime(event.startDateTime);
    const endTime = formatTime(event.endDateTime);

    return {
        type: event.__typename,
        startDate,
        description: event.description,
        startTime: startTime,
        endTime: endTime,
        location: event.location,
        ...event,
    };
};

export enum EventTypes {
    appointment = 'Appointment',
    prescription = 'Prescription',
}

const formatTime = (time: Date): string => {
    //get time format in HH:MM with AM/PM in lowercase
    let timeFormat = new Date(time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    //remove the 0 from the beginning of the time if it exists
    timeFormat = timeFormat[0] === '0' ? timeFormat.slice(1) : timeFormat;
    //remove the space between the time and the AM/PM
    let splitTime = timeFormat.split(' ');
    //lowercase am/pm
    splitTime[1] = splitTime[1].toLowerCase();
    timeFormat = splitTime.join('');

    return timeFormat;
};

export const formatDateForDateRangeLabel = (date: Date): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${date.toLocaleString('en-US', { weekday: 'short' })} ${
        monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
    return formattedDate;
};

export const formatDateRange = (startDay: Date, timeZone: string): string => {
    const startDayRangeLabel = new Date(startDay);
    const endDayRangeLabel = new Date(startDay);
    endDayRangeLabel.setDate(endDayRangeLabel.getDate() + 6);
    const formattedStartDay = formatDateForDateRangeLabel(startDayRangeLabel);
    const formattedEndDay = formatDateForDateRangeLabel(endDayRangeLabel);
    return `${formattedStartDay} - ${formattedEndDay} (${timeZone})`;
};

export interface ICalendarEvent {
    description: string;
    startDateTime: Date;
    endDateTime: Date | string;
    dosageInfo?: string;
    location?: string;
}

export interface IBaseFilterValues {
    printRangeStart: Date;
    printRangeEnd: Date;
}

export interface IMedicationsPrintFilterValues extends IBaseFilterValues {
    medsFilter?: string;
    includeUpcomingRefills?: boolean;
    includeRefillsPastAndPresent?: boolean;
    showAsCalendarSchedule?: boolean;
}

export interface ICalendarPrintFilterValues extends IBaseFilterValues {
    showWeekends?: boolean;
    showMedSchedule?: boolean;
    showActivitiesSchedule?: boolean;
}

export interface IFilterValues extends IMedicationsPrintFilterValues, ICalendarPrintFilterValues {}

export const createMedicationCalendarEventsBasedOnMedicationsData = (
    prescriptions: Array<MedicationWithRRule>,
    filterValues: IFilterValues,
): ICalendarEvent[] => {
    let prescriptionsToEvents = [];

    prescriptions.forEach((prescription) => {
        const eventBlocks: ICalendarEvents = createEventsForMedSchedules(prescription, filterValues);
        prescriptionsToEvents.push(...eventBlocks);
    });

    return prescriptionsToEvents;
};

const createEventsForMedSchedules = (
    prescription: MedicationWithRRule,
    filterValues: IFilterValues,
): ICalendarEvents => {
    const dateRange: Array<Date> = createDateRangeForMedicationSchedule({ prescription, filterValues });

    const medScheduleEvents: ICalendarEvents = createEventsBasedOfScheduleBlocks({ dateRange, prescription });

    return medScheduleEvents;
};

interface IPRescriptionWithFilterValuesInput {
    prescription: MedicationWithRRule;
    filterValues: IFilterValues;
}

export type ICalendarEvents = Array<ICalendarEvent | AppointmentInput>;

/*This function takes in a prescription and filter values and returns 
an array of dates that the prescription should be taken on*/
const createDateRangeForMedicationSchedule = ({
    prescription,
    filterValues,
}: IPRescriptionWithFilterValuesInput): Array<Date> => {
    let datesForMedication = [];

    const { startDateForComparison, endDateForComparison } = getStartEndDateForMedication({
        prescription,
        filterValues,
    });

    // eslint-disable-next-line no-unsafe-optional-chaining
    const { daysOfWeekParsed, recurrenceFrequencyCount, frequency } = prescription?.rRuleParams;
    const scheduleFrequencyIsRepeatDays = daysOfWeekParsed?.length > 0;

    if (scheduleFrequencyIsRepeatDays) {
        datesForMedication = getDateRangeFrequencyRepeatDays({
            startDateForComparison,
            endDateForComparison,
            daysOfWeekParsed,
        });
    } else {
        datesForMedication = getDateRange({
            startDateForComparison,
            endDateForComparison,
            frequency,
            recurrenceFrequencyCount,
        });
    }
    return datesForMedication;
};

interface IGetDateRangeRepeatDaysDailyInput {
    startDateForComparison: Date;
    endDateForComparison: Date;
    frequency: number;
    recurrenceFrequencyCount: number;
}

const getDateRange = ({
    startDateForComparison,
    endDateForComparison,
    frequency,
    recurrenceFrequencyCount,
}: IGetDateRangeRepeatDaysDailyInput): ICalendarEvents => {
    let dates = [];
    const dateForComparison = startDateForComparison;

    while (dateForComparison <= endDateForComparison) {
        const dateToIncrement = new Date(dateForComparison);
        dates.push(dateToIncrement);

        if (frequency === Frequency.MONTHLY) {
            dateForComparison.setMonth(dateForComparison.getMonth() + recurrenceFrequencyCount);
        } else if (frequency === Frequency.YEARLY) {
            dateForComparison.setFullYear(dateForComparison.getFullYear() + recurrenceFrequencyCount);
        } else {
            let dayIncrementValue = getScheduleIncrementValue(frequency, recurrenceFrequencyCount);

            dateForComparison.setDate(dateForComparison.getDate() + dayIncrementValue);
        }
    }

    return dates;
};

interface IGetDateRangeRepeatDaysInput {
    startDateForComparison: Date;
    endDateForComparison: Date;
    daysOfWeekParsed: string[];
}

const getDateRangeFrequencyRepeatDays = ({
    startDateForComparison,
    endDateForComparison,
    daysOfWeekParsed,
}: IGetDateRangeRepeatDaysInput): string[] => {
    let dates = [];
    const dateForComparison = startDateForComparison;

    while (dateForComparison <= endDateForComparison) {
        const day = dateForComparison.toLocaleString('en-US', { weekday: 'long' });

        if (daysOfWeekParsed.includes(day)) {
            const dateToAddToRange = dateForComparison.toUTCString();
            dates.push(dateToAddToRange);
        }
        dateForComparison.setDate(dateForComparison.getDate() + 1);
    }

    return dates;
};

interface ICreateEventsBasedOfScheduleBlocksInput {
    dateRange: Array<Date>;
    prescription: MedicationWithRRule;
}

const createEventsBasedOfScheduleBlocks = ({
    dateRange,
    prescription,
}: ICreateEventsBasedOfScheduleBlocksInput): ICalendarEvents => {
    const events = [];

    dateRange.forEach((date) => {
        const { medicationBlockStartDateTime, medicationBlockEndDateTime, medicationDescription } =
            getMedStartEndDateTimesAndDescription({ date, prescription });

        events.push({
            __typename: EventTypes.prescription,
            startDateTime: medicationBlockStartDateTime,
            endDateTime: medicationBlockEndDateTime.toISOString(),
            description: medicationDescription,
            dosageInfo: prescription?.dosages[0]?.value,
            location: '',
        });
    });
    return events;
};

interface IGetMedStartEndDateTimesAndDescriptionInput {
    date: Date;
    prescription: MedicationWithRRule;
}

const getMedStartEndDateTimesAndDescription = ({
    date,
    prescription,
}: IGetMedStartEndDateTimesAndDescriptionInput): {
    medicationBlockStartDateTime: Date;
    medicationBlockEndDateTime: Date;
    medicationDescription: string;
} => {
    const medicationBlockStartDateTime = createDateTimeForMedicationBlockEvent(date, prescription);

    //add 30 minutes to start time for event block height or we can shrink this if we shrink the font size
    const medicationBlockEndDateTime = new Date(medicationBlockStartDateTime);
    medicationBlockEndDateTime.setMinutes(medicationBlockEndDateTime.getMinutes() + MEDICATION_BLOCK_MINUTES);
    const medicationDescription = `${prescription?.medication?.name} ${prescription?.strengthValue ?? ''}`;
    return { medicationBlockStartDateTime, medicationBlockEndDateTime, medicationDescription };
};

const getStartEndDateForMedication = ({
    prescription,
    filterValues,
}: IPRescriptionWithFilterValuesInput): {
    startDateForComparison: Date;
    endDateForComparison: Date;
} => {
    const scheduleStartDate = prescription?.rRuleParams?.scheduleStartDate;
    const scheduleEndDate = prescription?.rRuleParams?.scheduleEndDate;

    const { printRangeStart, printRangeEnd } = filterValues;

    const startDateForComparison = scheduleStartDate > printRangeStart ? scheduleStartDate : printRangeStart;

    let endDateForComparison;
    if (scheduleEndDate) {
        endDateForComparison = scheduleEndDate < printRangeEnd ? scheduleEndDate : printRangeEnd;
    } else {
        endDateForComparison = printRangeEnd;
    }

    return { startDateForComparison, endDateForComparison };
};

const createDateTimeForMedicationBlockEvent = (dateOfMedication: Date, prescription: MedicationWithRRule): Date => {
    const dateTime = new Date(dateOfMedication);
    let hour = null,
        minute = null,
        meridiem = null;
    if (prescription?.rRuleParams) {
        ({ hour, minute, meridiem } = prescription.rRuleParams);
    }
    if (meridiem === 'PM' && hour !== 12) {
        hour += 12;
    }
    dateTime.setHours(hour);
    dateTime.setMinutes(minute);

    return dateTime;
};

export const getDayLabel = (day: Date): string => {
    const dayOfMonth = day.getDate();
    const month = day.getMonth() + 1;
    const dayOfWeek = day.getDay();
    const dayLabel = `${month}/${dayOfMonth}`;
    return `${WEEK_DAYS[dayOfWeek]} ${dayLabel}`;
};

export const getDayOfWeek = (date: Date): string => {
    const medDataDate = new Date(date);
    const day = medDataDate.toLocaleString('en-US', { weekday: 'long' });
    return day;
};

export const calendarEventPositions = {
    left: 'left',
    right: 'right',
    center: 'center',
};

export const determineEventPositioning = (day: DayBlock, range: string[]): DayBlock => {
    let positionedEvents = [...day];

    for (let i = 0; i < positionedEvents.length; i++) {
        const currentEvent = positionedEvents[i];

        const currentEventStartTimeIndex = range.indexOf(currentEvent.startTime);
        const currentEventEndTimeIndex = range.indexOf(currentEvent.endTime);
        if (i < positionedEvents.length - 1) {
            for (let j = i + 1; j < positionedEvents.length; j++) {
                //loop through all proceeding events with j except the last one
                const nextEvent = positionedEvents[j];
                const nextEventStartTimeIndex = range.indexOf(nextEvent.startTime);
                const currentEventHasSameStartTimeAsNext = currentEventStartTimeIndex === nextEventStartTimeIndex;

                const currentEventEndsBeforeNextEvent = currentEventEndTimeIndex <= nextEventStartTimeIndex;

                const currentEventOverlapsNext =
                    !currentEventHasSameStartTimeAsNext && currentEventEndTimeIndex > nextEventStartTimeIndex;

                if (currentEventHasSameStartTimeAsNext || currentEventEndsBeforeNextEvent) {
                    currentEvent.overlapsNext = false;
                    nextEvent.overlapsPrevious = false;
                } else if (currentEventOverlapsNext) {
                    currentEvent.overlapsNext = true;
                    nextEvent.overlapsPrevious = true;
                    if (currentEvent.position === calendarEventPositions.left) {
                        nextEvent.position = calendarEventPositions.right;
                    } else if (currentEvent.position === calendarEventPositions.right) {
                        nextEvent.position = calendarEventPositions.left;
                    }
                }

                if (!currentEvent.position) {
                    if (currentEvent.overlapsNext) {
                        currentEvent.position = calendarEventPositions.left;
                    }
                    if (nextEvent.overlapsPrevious) {
                        nextEvent.position = calendarEventPositions.right;
                    }
                }
            }
        }
        if (!currentEvent?.position) {
            currentEvent.position = calendarEventPositions.center;
        }
    }
    return positionedEvents;
};

interface IGetEarliestAndLatestTimesAndIndexesReturnValue {
    earliestStartTimeIndex: number;
    latestEndTimeIndex: number;
    earliestTime: string;
    latestTime: string;
}

const getEarliestAndLatestTimesAndIndexes = (days: DayBlock[]): IGetEarliestAndLatestTimesAndIndexesReturnValue => {
    let earliestStartTimeIndex = getMinuteIndex(days[0][0].startTime),
        latestEndTimeIndex = getMinuteIndex(days[0][0].endTime),
        earliestTime = days[0][0].startTime,
        latestTime = days[0][0].endTime;

    days.forEach((day) => {
        day.forEach((event) => {
            const { startTime, endTime } = event;
            const eventStartTimeIndex = getMinuteIndex(startTime);
            const eventEndTimeIndex = getMinuteIndex(endTime);
            if (eventStartTimeIndex < earliestStartTimeIndex) {
                earliestStartTimeIndex = eventStartTimeIndex;
                earliestTime = startTime;
            }
            if (eventEndTimeIndex > latestEndTimeIndex) {
                latestEndTimeIndex = eventEndTimeIndex;
                latestTime = endTime;
            }
        });
    });
    const endTimeMinutes = getMinutesFromTime(latestTime);
    const startTimeMinutes = getMinutesFromTime(earliestTime);

    switch (endTimeMinutes) {
        case '15':
            latestEndTimeIndex += 3;
            break;
        case '30':
            latestEndTimeIndex += 2;
            break;
        case '45':
            latestEndTimeIndex += 1;
            break;
    }
    switch (startTimeMinutes) {
        case '15':
            earliestStartTimeIndex -= 1;
            break;
        case '30':
            earliestStartTimeIndex -= 2;
            break;
        case '45':
            earliestStartTimeIndex -= 3;
            break;
    }
    return { earliestStartTimeIndex, latestEndTimeIndex, earliestTime, latestTime };
};

interface IGetTimeRangeForWeekReturnValue {
    range: string[];
    hourRangeLabels: string[];
}

export const getTimeRangeForWeek = (days: DayBlock[]): IGetTimeRangeForWeekReturnValue => {
    let { earliestStartTimeIndex, latestEndTimeIndex } = getEarliestAndLatestTimesAndIndexes(days);

    const rangeOfTimes = latestEndTimeIndex - earliestStartTimeIndex;

    if (rangeOfTimes < 32) {
        latestEndTimeIndex = earliestStartTimeIndex + 36;
    }

    const range = DAY_LENGTH_FIFTEEN_MINUTE_INCREMENTS.slice(earliestStartTimeIndex, latestEndTimeIndex + 1);

    const hourRangeLabels = range
        .filter((time) => {
            return getMinutesFromTime(time) === '00';
        })
        .map((time) => {
            return time.slice(0, time.length - 5) + time.slice(time.length - 2, time.length);
        });

    return { range, hourRangeLabels };
};

const getMinuteIndex = (time): number => {
    return DAY_LENGTH_FIFTEEN_MINUTE_INCREMENTS.indexOf(time);
};

const getMinutesFromTime = (time): string => {
    return time.slice(time.length - 4, time.length - 2);
};

interface IGetGridDimensionsReturnValue {
    gridTemplateColumns: string;
    gridTemplateRows: string;
    dayWidth: number;
    numRows: number;
    numColumns: number;
}

export const getGridDimensions = (range: string[], daysWithEvents): IGetGridDimensionsReturnValue => {
    //x2 this number to create LR columns for each day
    const numColumns = daysWithEvents.length * 2;

    const dayWidth = SCHEDULE_GRID_WIDTH / numColumns;
    const dayPixelsGridColumnsText = `${dayWidth}px `.repeat(numColumns);
    const gridTemplateColumns = `${SCHEDULE_HOURS_DISPLAY_WIDTH}px ${dayPixelsGridColumnsText}`;

    const numRows = range.length - 1;
    const rowHeight = SCHEDULE_DAY_HEIGHT / numRows;
    const dayPixelsGridRowsText = `${rowHeight}px `.repeat(numRows);
    const gridTemplateRows = `${DAY_LABEL_ROW_HEIGHT}px ${dayPixelsGridRowsText}`;

    return { gridTemplateColumns, gridTemplateRows, dayWidth, numRows, numColumns };
};

export const mergeRRuleDataIntoMedicationData = (prescription, careRecipientTimezone: string) => {
    const schedule = prescription.dosages[0].schedule;
    const rRuleParams = parseRRule({ inputString: schedule, careRecipientTimezone });

    return {
        ...prescription,
        rRuleParams,
    };
};
