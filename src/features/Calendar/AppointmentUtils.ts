import { IComboBoxOption } from "@fluentui/react";
import { Appointment } from "src/types/Appointment";
import { timeNumbersDropDownOptions } from "../../utils/utils";

export type AppointmentFormikValues = {
  appointment: {
    active?: boolean;
    id?: string;
    name: string;
    startDate: Date;
    endDate: Date;
    startTimeNumber: string;
    startTimeAmPm: string;
    endTimeNumber: string;
    endTimeAmPm: string;
    address: {
      addressLine1: string;
      city: string;
      state: string;
      zipCode: string;
      displayAddress: string;
    };
  };
};

export const getTimeIndicies = (
  startTimeNumber: string,
  endTimeNumber: string
) => {
  const startTime = startTimeNumber;
  const endTime = endTimeNumber;
  const startIndex = timeNumbersDropDownOptions.findIndex(
    (val) => val.key === startTime
  );
  const endIndex = timeNumbersDropDownOptions.findIndex(
    (val) => val.key === endTime
  );

  return [startIndex, endIndex];
};

export const getAddAppointmentMutationValues = (
  values: AppointmentFormikValues
) => {
  const appointmentValues = getBaseAppointmentMutationValues(values);
  return { variables: { input: appointmentValues } };
};

export const getUpdateAppointmentMutationValues = (
  values: AppointmentFormikValues,
  id: string
) => {
  let appointmentValues = getBaseAppointmentMutationValues(values);
  return { variables: { input: { id: id, ...appointmentValues } } };
};

const getBaseAppointmentMutationValues = (values: AppointmentFormikValues) => {
  const {
    name,
    startDate,
    startTimeAmPm,
    startTimeNumber,
    endDate,
    endTimeAmPm,
    endTimeNumber,
    address,
  } = values.appointment;

  const startDateTime = convertValuesToDateTimeString(
    startDate,
    startTimeNumber,
    startTimeAmPm
  );
  const endDateTime = convertValuesToDateTimeString(
    endDate,
    endTimeNumber,
    endTimeAmPm
  );

  const appointmentValues = {
    description: name,
    location: {
      addressLine1: address.addressLine1,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      freeTextAddress: address.displayAddress,
    },
    recurrence: "",
    startDateTime: startDateTime,
    endDateTime: endDateTime,
  };

  return appointmentValues;
};

export const validateAppointmentValues = (values: AppointmentFormikValues) => {
  const errors: any = {};
  const {
    name,
    startDate,
    startTimeAmPm,
    startTimeNumber,
    endDate,
    endTimeAmPm,
    endTimeNumber,
  } = values.appointment;

  if (!name) {
    errors.name = "Required";
  }

  if (startDate.getDate() === endDate.getDate()) {
    if (startTimeAmPm === endTimeAmPm) {
      const [startIndex, endIndex] = getTimeIndicies(
        startTimeNumber,
        endTimeNumber
      );
      if (startIndex > endIndex) {
        errors.appointment = {
          endTimeNumber: `End time can't be before start`,
        };
      }
    } else if (endTimeAmPm == "AM" && startTimeAmPm === "PM") {
      errors.appointment = { endTimeNumber: `End time can't be before start` };
    }
  }

  return errors;
};

export const convertValuesToDateTimeString = (
  date: Date,
  timeNumber: string,
  amPm: string
) => {
  const [hoursString, minutesString] = timeNumber.split(":");
  let hours = parseInt(hoursString);
  const minutes = parseInt(minutesString);
  if (amPm === "PM" && hours !== 12) {
    hours += 12;
  } else if (amPm === "AM" && hours === 12) {
    hours = 0;
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );
};

interface IGetTimeTextInput {
  startDateTime: string;
  endDateTime: string;
}
export const getTimeText = ({
  startDateTime,
  endDateTime,
}: IGetTimeTextInput) => {
  let timeText = "";
  if (startDateTime && endDateTime) {
    const [startDateTimeHours, startDateTimeAmPm, startDateTimeMinutesString] =
      getTimeStrings(startDateTime);
    const [endDateTimeHours, endDateTimeAmPm, endDateTimeMinutesString] =
      getTimeStrings(endDateTime);

    timeText = `${startDateTimeHours}:${startDateTimeMinutesString} ${startDateTimeAmPm}-
        ${endDateTimeHours}:${endDateTimeMinutesString} ${endDateTimeAmPm}`;
  }

  return timeText;
};

const getTimeStrings = (dateString: string): [number, string, string] => {
  const dateTime = new Date(dateString);

  let [dateTimeHours, dateTimeMinutes] = [
    dateTime.getHours(),
    dateTime.getMinutes(),
  ];
  let dateTimeAmPm = "AM";

  if (dateTimeHours > 12) {
    dateTimeHours -= 12;
    dateTimeAmPm = "PM";
  } else if (dateTimeHours === 0) dateTimeHours = 12;
  else if (dateTimeHours === 12) dateTimeAmPm = "PM";

  const dateTimeMinutesString =
    dateTimeMinutes < 10
      ? `0${dateTimeMinutes.toString()}`
      : dateTimeMinutes.toString();

  return [dateTimeHours, dateTimeAmPm, dateTimeMinutesString];
};

export const getEndTimeValues = (
  item: IComboBoxOption,
  startTimeAmPm: string
): [IComboBoxOption, string] => {
  const itemIndex = timeNumbersDropDownOptions.findIndex(
    (val) => val.key === item.key
  );
  let endTimeIndex;
  let endTimeAmPm = startTimeAmPm;
  if (itemIndex < timeNumbersDropDownOptions.length - 5) {
    endTimeIndex = itemIndex + 4;
  } else {
    endTimeAmPm = "PM";

    if (startTimeAmPm === "AM") {
      endTimeIndex = itemIndex + 4 - timeNumbersDropDownOptions.length;
    } else {
      // Not allowing users to set appts to multiple dates, default set
      // overflow times to 11:45 PM
      // formik.setFieldValue(`appointment.endTimeAmPm`, 'PM');
      endTimeIndex = timeNumbersDropDownOptions.length - 1;
    }
  }
  const endTimeItem = timeNumbersDropDownOptions[endTimeIndex];
  return [endTimeItem, endTimeAmPm];
};

export const getAppointmentEditInitialValues = (appointment: Appointment) => {
  const { startDateTime, endDateTime } = appointment;

  const [startHours, startAmPm, startMinutes] = getTimeStrings(startDateTime);
  const [endHours, endAmPm, endMinutes] = getTimeStrings(endDateTime);

  const startTimeNumber = `${startHours}:${
    startMinutes === "0" ? "00" : startMinutes
  }`;
  const endTimeNumber = `${endHours}:${endMinutes === "0" ? "00" : endMinutes}`;

  return {
    appointment: {
      name: appointment.description,
      startDate: new Date(appointment.startDateTime),
      endDate: new Date(appointment.endDateTime),
      startTimeNumber: startTimeNumber,
      startTimeAmPm: startAmPm,
      endTimeNumber: endTimeNumber,
      endTimeAmPm: endAmPm,
      address: {
        addressLine1: appointment.location?.addressLine1,
        city: appointment.location?.city,
        state: appointment.location?.state,
        zipCode: appointment.location?.zipCode,
        displayAddress: appointment.location?.freeTextAddress,
      },
    },
  };
};

export const getCurrentEventStartEndTimes = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const roundedMinutes = (Math.round(minutes / 15) * 15) % 60;
  const currentTime = `${hour}:${roundedMinutes.toString().padStart(2, "0")}`;

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const paddedMonth = (month + 1).toString().padStart(2, "0");
  const paddedDay = day.toString().padStart(2, "0");

  const dateTimeString = `${year}-${paddedMonth}-${paddedDay}T${currentTime}`;
  const currentDateTime = new Date(dateTimeString);
  const oneHourLater = new Date(currentDateTime.getTime() + 3600000);

  return [currentDateTime, oneHourLater];
};

export const isOccuringOn = (appointment: Appointment, selectedDate: Date) => {
  const appointmentStartDate = new Date(appointment.startDateTime);
  const appointmentStartTime = appointmentStartDate.getTime();
  const selectedDateTime = selectedDate.getTime();

  if (appointment.recordStatus == "DELETED") return false;

  if (!appointment.recurrence || appointment.recurrence === "") {
    return appointmentStartDate.toDateString() === selectedDate.toDateString();
  }

  const rules = appointment.recurrence.split(";");
  const freqRule = rules.find((rule) => rule.startsWith("FREQ="));
  const intervalRule = rules.find((rule) => rule.startsWith("INTERVAL="));

  const freq = freqRule.split("=")[1];
  // interval defaults to 1 if not given
  const interval = intervalRule ? parseInt(intervalRule.split("=")[1], 10) : 1;

  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  switch (freq) {
    case "DAILY": {
      const daysDifference = Math.floor(
        (selectedDateTime - appointmentStartTime) / oneDay
      );
      return daysDifference % interval === 0;
    }

    case "WEEKLY": {
      const weeksDifference = Math.floor(
        (selectedDateTime - appointmentStartTime) / oneWeek
      );
      return (
        weeksDifference % interval === 0 &&
        selectedDate.getDay() === appointmentStartDate.getDay()
      );
    }

    case "MONTHLY": {
      const monthsDifference =
        (selectedDate.getFullYear() - appointmentStartDate.getFullYear()) * 12 +
        (selectedDate.getMonth() - appointmentStartDate.getMonth());
      return (
        monthsDifference % interval === 0 &&
        selectedDate.getDate() === appointmentStartDate.getDate()
      );
    }

    case "YEARLY": {
      const yearsDifference =
        selectedDate.getFullYear() - appointmentStartDate.getFullYear();
      return (
        yearsDifference % interval === 0 &&
        selectedDate.getMonth() === appointmentStartDate.getMonth() &&
        selectedDate.getDate() === appointmentStartDate.getDate()
      );
    }

    default:
      return false;
  }
};
