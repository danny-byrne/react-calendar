// import { DateTimeFormatOptions } from '@src/features/Medications/MedicationMutationTypes';
// import { timeZone } from "@src/features/AppProfile/constants";
import { DropdownMenuItemType, IDropdownOption } from "@fluentui/react";
// import { GetAvailableUserTimeZonesQuery } from "@src/graphQL/serverMocks/graphQLGeneratedCode";

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface DateTimeFormatOptions {
  year?: "numeric" | "2-digit" | undefined;
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
  day?: "numeric" | "2-digit" | undefined;
  timeZone?: string | undefined;
}

export const timeZone = "America/Denver";

// a and b are javascript Date objects
export function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function getToday() {
  const today = new Date();
  today?.setHours(12, 0, 0, 0);
  return today;
}

export function getTodayDateOnly() {
  const today = new Date();
  today?.setHours(12, 0, 0, 0);
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function getDateAtMidday(date: Date) {
  date?.setHours(12, 0, 0, 0);
  return date;
}
export function getUTCOffset() {
  return new Date().getTimezoneOffset();
}

export const dateOptions: DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: timeZone,
};

function getLastWeeksDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
}

const lastWeekDate = getLastWeeksDate();

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getDocumentTimeDisplay = (dateInput) => {
  let hour = dateInput.getHours(),
    minute = dateInput.getMinutes();
  let meridiem = "AM";

  if (hour >= 12) {
    meridiem = "PM";
  }
  if (hour >= 13) {
    hour = hour - 12;
  }
  if (minute.toString().length === 1) {
    minute = `0${minute}`;
  }

  return `${hour}:${minute} ${meridiem}`;
};

// format <hour>:<minute><meridiem>
export const getHourFromDocumentTimeDisplay = (timeDisplay) => {
  let hour = parseInt(timeDisplay.split(":")[0]);
  let meridiem = timeDisplay.split(":")[1];
  meridiem = meridiem.substring(meridiem.length - 2, meridiem.length);
  console.log("Meridiem found: " + meridiem);

  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  } else if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  return hour;
};

export const getDocumentCardDisplayDate = (input) => {
  const dateInput = new Date(input);

  let displayDate = "";
  if (dateInput < lastWeekDate) {
    displayDate = `${months[dateInput.getMonth()]} ${dateInput.getDate()}`;
  } else {
    displayDate = `${DAYS[dateInput.getDay()]} at ${getDocumentTimeDisplay(
      dateInput
    )}`;
  }
  return displayDate;
};

export const getDocumentDetailDisplayDate = (input) => {
  const dateInput = new Date(input);

  let displayDate = `${
    months[dateInput.getMonth()]
  } ${dateInput.getDate()}, ${dateInput.getFullYear()}`;

  return displayDate;
};

/** Transforms timezone data received from the `useGetAvailableUserTimeZonesQuery` query into a UI
 * dropdown options object */
export const timeZonesToDropdownOptions = (
  timezoneData: GetAvailableUserTimeZonesQuery
): IDropdownOption[] => {
  const timezoneDropdownOptions = timezoneData.availableUserTimeZones.reduce(
    (allTimezones, currentTimezones) => {
      const header: IDropdownOption = {
        key: currentTimezones.windowsId,
        text: currentTimezones.windowsId,
        itemType: DropdownMenuItemType.Header,
      };
      const timezones = currentTimezones.ianaIds.map((tz) => {
        // Format display timezone. Example: "America/Indiana/Petersburg" -> "Indiana - Petersburg"
        let parts = tz.split("/");
        parts.shift();
        let title = parts.join(" - ").replace(/_/g, " ");
        return { key: tz, text: title } as IDropdownOption;
      });

      return [...allTimezones, header, ...timezones];
    },
    [] as IDropdownOption[]
  );
  return timezoneDropdownOptions;
};
