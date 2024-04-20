import {
  RelationshipsToLovedOne,
  Month,
} from "@src/graphQL/serverMocks/graphQLGeneratedCode";
import { getDateAtMidday, getToday } from "./dates";
import { isValidPhone, phoneRegex } from "./validators";
import { CareGiver } from "@src/types/Member";
import { IComboBoxOption } from "@fluentui/react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthsFullNames = [
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
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const weekdaysFull = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const refillDropDown = [
  { key: 6, text: "6" },
  { key: 5, text: "5" },
  { key: 4, text: "4" },
  { key: 3, text: "3" },
  { key: 2, text: "2" },
  { key: 1, text: "1" },
];

// TODO: Update with activity frequency options
const activityFrequencyDropdown = [
  { key: "SPECIFIC_DATE", text: "Specific Date" },
  { key: "REPEAT_DAYS", text: "Repeat Days" },
];

const whichDaysOptions = [
  { key: 0, text: "Sunday", selected: false },
  { key: 1, text: "Monday", selected: false },
  { key: 2, text: "Tuesday", selected: false },
  { key: 3, text: "Wednesday", selected: false },
  { key: 4, text: "Thursday", selected: false },
  { key: 5, text: "Friday", selected: false },
  { key: 6, text: "Saturday", selected: false },
];

const setIntervals: string = "Set intervals";

const timesPerDayDropDown = [
  { key: 1, text: "1x" },
  { key: 2, text: "2x" },
  { key: 3, text: "3x" },
  { key: 4, text: "4x" },
  { key: 5, text: "5x" },
  { key: setIntervals, text: setIntervals },
];

const doseDropDown = [
  { key: 1, text: "Take 1" },
  { key: 2, text: "Take 2" },
  { key: 3, text: "Take 3" },
  { key: 4, text: "Take 4" },
  { key: 5, text: "Take 5" },
  { key: 6, text: "Take 6" },
  { key: 7, text: "Take 7" },
];

//the order of timesDropDownOptions is important as it determines the sort order of Medications in many views
const timesDropDownOptions = [
  { key: "12:00AM", text: "12:00AM" },
  { key: "12:30AM", text: "12:30AM" },
  { key: "1:00AM", text: "1:00AM" },
  { key: "1:30AM", text: "1:30AM" },
  { key: "2:00AM", text: "2:00AM" },
  { key: "2:30AM", text: "2:30AM" },
  { key: "3:00AM", text: "3:00AM" },
  { key: "3:30AM", text: "3:30AM" },
  { key: "4:00AM", text: "4:00AM" },
  { key: "4:30AM", text: "4:30AM" },
  { key: "5:00AM", text: "5:00AM" },
  { key: "5:30AM", text: "5:30AM" },
  { key: "6:00AM", text: "6:00AM" },
  { key: "6:30AM", text: "6:30AM" },
  { key: "7:00AM", text: "7:00AM" },
  { key: "7:30AM", text: "7:30AM" },
  { key: "8:00AM", text: "8:00AM" },
  { key: "8:30AM", text: "8:30AM" },
  { key: "9:00AM", text: "9:00AM" },
  { key: "9:30AM", text: "9:30AM" },
  { key: "10:00AM", text: "10:00AM" },
  { key: "10:30AM", text: "10:30AM" },
  { key: "11:00AM", text: "11:00AM" },
  { key: "11:30AM", text: "11:30AM" },
  { key: "12:00PM", text: "12:00PM" },
  { key: "12:30PM", text: "12:30PM" },
  { key: "1:00PM", text: "1:00PM" },
  { key: "1:30PM", text: "1:30PM" },
  { key: "2:00PM", text: "2:00PM" },
  { key: "2:30PM", text: "2:30PM" },
  { key: "3:00PM", text: "3:00PM" },
  { key: "3:30PM", text: "3:30PM" },
  { key: "4:00PM", text: "4:00PM" },
  { key: "4:30PM", text: "4:30PM" },
  { key: "5:00PM", text: "5:00PM" },
  { key: "5:30PM", text: "5:30PM" },
  { key: "6:00PM", text: "6:00PM" },
  { key: "6:30PM", text: "6:30PM" },
  { key: "7:00PM", text: "7:00PM" },
  { key: "7:30PM", text: "7:30PM" },
  { key: "8:00PM", text: "8:00PM" },
  { key: "8:30PM", text: "8:30PM" },
  { key: "9:00PM", text: "9:00PM" },
  { key: "9:30PM", text: "9:30PM" },
  { key: "10:00PM", text: "10:00PM" },
  { key: "10:30PM", text: "10:30PM" },
  { key: "11:00PM", text: "11:00PM" },
  { key: "11:30PM", text: "11:30PM" },
];

const timeNumbersDropDownOptions: IComboBoxOption[] = [
  { key: "12:00", text: "12:00" },
  { key: "12:15", text: "12:15" },
  { key: "12:30", text: "12:30" },
  { key: "12:45", text: "12:45" },
  { key: "1:00", text: "1:00" },
  { key: "1:15", text: "1:15" },
  { key: "1:30", text: "1:30" },
  { key: "1:45", text: "1:45" },
  { key: "2:00", text: "2:00" },
  { key: "2:15", text: "2:15" },
  { key: "2:30", text: "2:30" },
  { key: "2:45", text: "2:45" },
  { key: "3:00", text: "3:00" },
  { key: "3:15", text: "3:15" },
  { key: "3:30", text: "3:30" },
  { key: "3:45", text: "3:45" },
  { key: "4:00", text: "4:00" },
  { key: "4:15", text: "4:15" },
  { key: "4:30", text: "4:30" },
  { key: "4:45", text: "4:45" },
  { key: "5:00", text: "5:00" },
  { key: "5:15", text: "5:15" },
  { key: "5:30", text: "5:30" },
  { key: "5:45", text: "5:45" },
  { key: "6:00", text: "6:00" },
  { key: "6:15", text: "6:15" },
  { key: "6:30", text: "6:30" },
  { key: "6:45", text: "6:45" },
  { key: "7:00", text: "7:00" },
  { key: "7:15", text: "7:15" },
  { key: "7:30", text: "7:30" },
  { key: "7:45", text: "7:45" },
  { key: "8:00", text: "8:00" },
  { key: "8:15", text: "8:15" },
  { key: "8:30", text: "8:30" },
  { key: "8:45", text: "8:45" },
  { key: "9:00", text: "9:00" },
  { key: "9:15", text: "9:15" },
  { key: "9:30", text: "9:30" },
  { key: "9:45", text: "9:45" },
  { key: "10:00", text: "10:00" },
  { key: "10:15", text: "10:15" },
  { key: "10:30", text: "10:30" },
  { key: "10:45", text: "10:45" },
  { key: "11:00", text: "11:00" },
  { key: "11:15", text: "11:15" },
  { key: "11:30", text: "11:30" },
  { key: "11:45", text: "11:45" },
];

const timeKeys = timesDropDownOptions.map((element) => {
  return element.key;
});

const getTimeIndex = (time) => {
  const trimmedTime = time?.charAt(0) === "0" ? time.slice(1) : time;
  const index = timeKeys.indexOf(trimmedTime);

  return index;
};

let medicationCourseDaysDropDown = [
  { key: 1, text: "1" },
  { key: 2, text: "2" },
  { key: 3, text: "3" },
  { key: 4, text: "4" },
  { key: 5, text: "5" },
  { key: 6, text: "6" },
  { key: 7, text: "7" },
  { key: 8, text: "8" },
  { key: 9, text: "9" },
  { key: 10, text: "10" },
  { key: 11, text: "11" },
  { key: 12, text: "12" },
  { key: 13, text: "13" },
  { key: 14, text: "14" },
  { key: 15, text: "15" },
  { key: 16, text: "16" },
  { key: 17, text: "17" },
  { key: 18, text: "18" },
  { key: 19, text: "19" },
  { key: 20, text: "20" },
  { key: 21, text: "21" },
  { key: 22, text: "22" },
  { key: 23, text: "23" },
  { key: 24, text: "24" },
  { key: 25, text: "25" },
  { key: 26, text: "26" },
  { key: 27, text: "26" },
  { key: 28, text: "28" },
  { key: 29, text: "29" },
  { key: 30, text: "30" },
];

const intervalsDropdown = [
  { key: 2, text: "Every 2 hours" },
  { key: 4, text: "Every 4 hours" },
  { key: 6, text: "Every 6 hours" },
  { key: 8, text: "Every 8 hours" },
];

const familyRelationshipDropdownOptions = [
  { key: RelationshipsToLovedOne.Child, text: "Child" },
  { key: RelationshipsToLovedOne.FamilyMember, text: "Family Member" },
  { key: RelationshipsToLovedOne.Friend, text: "Friend" },
  { key: RelationshipsToLovedOne.Grandparent, text: "Grandparent" },
  { key: RelationshipsToLovedOne.Neighbor, text: "Neighbor" },
  { key: RelationshipsToLovedOne.Parent, text: "Parent" },
  { key: RelationshipsToLovedOne.Partner, text: "Partner" },
  { key: RelationshipsToLovedOne.Sibling, text: "Sibling" },
  { key: RelationshipsToLovedOne.Spouse, text: "Spouse" },
];

const getRelationshipText = (
  relationshipToLovedOne: RelationshipsToLovedOne,
  blankIfNotSet: boolean = false
) => {
  const defaultText = blankIfNotSet ? "" : "Edit to set a relationship";
  const relationship = familyRelationshipDropdownOptions.filter(
    (obj) => obj.key === relationshipToLovedOne
  );
  const text = relationship.length > 0 ? relationship[0].text : defaultText;
  return text;
};

const getRelationshipCardText = (
  relationship: string,
  relationshipToLovedOne: RelationshipsToLovedOne,
  hasAdminPermissions: boolean
) => {
  if (relationshipToLovedOne !== RelationshipsToLovedOne.NotSet) {
    return relationship;
  } else if (hasAdminPermissions) {
    return "Set the Relationship";
  } else {
    return "";
  }
};

const isNotRunningInJest = () => {
  return process.env.JEST_WORKER_ID === undefined;
};

const monthDropdownOptions = [
  { key: Month.January, text: "January" },
  { key: Month.February, text: "February" },
  { key: Month.March, text: "March" },
  { key: Month.April, text: "April" },
  { key: Month.May, text: "May" },
  { key: Month.June, text: "June" },
  { key: Month.July, text: "July" },
  { key: Month.August, text: "August" },
  { key: Month.September, text: "September" },
  { key: Month.October, text: "October" },
  { key: Month.November, text: "November" },
  { key: Month.December, text: "December" },
];

const getDaysDropdownOptions = (year: number, month: number) => {
  const getMonthIndex = (month) => {
    const isMatch = (input) => input.key === month;
    return monthDropdownOptions.findIndex(isMatch);
  };
  const getDaysAccordingToMonth = (year: number, month: number) => {
    return getDateAtMidday(new Date(year, month, 0)).getDate();
  };

  let numberOfDays = 31;
  if (month && year) {
    numberOfDays = getDaysAccordingToMonth(year, getMonthIndex(month));
  }

  const dayMenuOptions = [...Array(numberOfDays).keys()];
  return dayMenuOptions.map((number) => {
    let offsetDay = number + 1;
    return { key: offsetDay, text: offsetDay.toString() };
  });
};

const curYear = getToday().getFullYear();
const fiveYearsAgo = curYear - 5,
  tenYearsAgo = curYear - 10;

enum RelativeDate {
  InTheLast5Years = "IN_THE_LAST5_YEARS",
  InTheLast5to10Years = "IN_THE_LAST5_TO_10_YEARS",
  MoreThan10YearsAgo = "MORE_THAN10_YEARS_AGO",
  Custom = "CUSTOM",
}

const getTimeFrameDropdownOptions = ({
  timeframe,
  relativeStart,
  relativeEnd,
}) => {
  const options = [
    {
      key: RelativeDate.InTheLast5Years,
      text: `Since ${fiveYearsAgo} (within previous 5 years)`,
    },
    {
      key: RelativeDate.InTheLast5to10Years,
      text: `${tenYearsAgo} - ${fiveYearsAgo} (5 to 10 years ago)`,
    },
    {
      key: RelativeDate.MoreThan10YearsAgo,
      text: `Before ${tenYearsAgo} (more than 10 years ago)`,
    },
  ];
  if (timeframe === RelativeDate.Custom) {
    options.unshift({
      key: RelativeDate.Custom,
      text: `Between ${relativeStart} and ${relativeEnd}`,
    });
  }
  return options;
};

const getTimeFrame = (startYear, endYear) => {
  //figure out how we'll calculate the timeframe of a condition that ages in the db by a few years.
  let timeframe = null;
  if (endYear === curYear && startYear === fiveYearsAgo) {
    timeframe = RelativeDate.InTheLast5Years;
  } else if (endYear === fiveYearsAgo && startYear === tenYearsAgo) {
    timeframe = RelativeDate.InTheLast5to10Years;
  } else if (!startYear && endYear === tenYearsAgo) {
    timeframe = RelativeDate.MoreThan10YearsAgo;
  } else if (startYear === null && endYear === null) {
    timeframe = null;
  } else {
    timeframe = RelativeDate.Custom;
  }

  return timeframe;
};

const getYearDropdownOptions = () => {
  const options = [];
  for (let i = 1920; i <= curYear; i++) {
    options.push({ key: i, text: i.toString() });
  }
  return options.reverse();
};

const yearDropdownOptions = getYearDropdownOptions();

const formatPhoneNumber = (value: string): string => {
  if (!value) {
    return value;
  }

  let sanitizedPhone = sanitizePhoneNumber(value);

  if (sanitizedPhone.length < 4) {
    return sanitizedPhone;
  }

  if (sanitizedPhone.length < 10) {
    // E.g., (425) 1xxx
    return `(${sanitizedPhone.slice(0, 3)}) ${sanitizedPhone.slice(3)}`;
  }

  if (sanitizedPhone.length === 10) {
    // E.g., (425) 123-4567
    return sanitizedPhone.replace(phoneRegex, "($2) $3-$4");
  }

  if (sanitizedPhone.length > 11) {
    sanitizedPhone = sanitizedPhone.slice(0, 11);
  }

  // E.g., +1 (425) 123-4567
  return sanitizedPhone.replace(phoneRegex, "+$1 ($2) $3-$4");
};

/** Strip all non-digits from a phone number
 * E.g, +1 (425) 301-3333 => 14253013333
 */
const sanitizePhoneNumber = (value: string) => {
  if (!value) {
    return value;
  }
  return value.replace(/\D/g, "");
};

const getErrorMessagePhone = (value: string): string => {
  if (!value) {
    return "";
  }
  return isValidPhone(value) ? "" : "Please enter a valid US phone number.";
};

const getTimeZoneText = (
  careGiver: CareGiver,
  canEditTimeZone: boolean
): string => {
  let defaultText = canEditTimeZone
    ? "Edit to set a time zone"
    : "No timezone set";

  if (careGiver.timeZoneID && careGiver.timeZoneGenericName) {
    return careGiver.timeZoneGenericName + " (" + careGiver.timeZoneID + ")";
  } else {
    return defaultText;
  }
};

// Cascade multiple Math.random + Date calls to guarantee uniqueness
const generateUniqueId = () =>
  Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

/** For GraphQL response objects, recursively remove the `__typename` property in the object and sub-objects.
 */
function removeTypename(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => removeTypename(item));
  }
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      if (key !== "__typename") {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export {
  months,
  monthsFullNames,
  weekdays,
  weekdaysFull,
  refillDropDown,
  activityFrequencyDropdown,
  whichDaysOptions,
  timesPerDayDropDown,
  doseDropDown,
  timesDropDownOptions,
  timeNumbersDropDownOptions,
  medicationCourseDaysDropDown,
  intervalsDropdown,
  setIntervals,
  familyRelationshipDropdownOptions,
  getRelationshipText,
  getRelationshipCardText,
  isNotRunningInJest,
  getTimeIndex,
  monthDropdownOptions,
  RelativeDate,
  getTimeFrameDropdownOptions,
  curYear,
  getDaysDropdownOptions,
  getYearDropdownOptions,
  getTimeFrame,
  yearDropdownOptions,
  formatPhoneNumber,
  sanitizePhoneNumber,
  getErrorMessagePhone,
  getTimeZoneText,
  generateUniqueId,
  removeTypename,
};
