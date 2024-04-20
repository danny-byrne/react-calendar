import { ONE, MEDICATION_COURSE_ELEMENT } from "@src/utils/constant";
import { getToday } from "@src/utils/dates";
import { IDatePickerStyles } from "@fluentui/react/lib/DatePicker";
import { Frequency } from "rrule";
import { MERIDIEMS } from "@src/utils/constant";
import { RRule, Weekday } from "rrule";

const initialDaysOfWeek: Weekday[] = [
  RRule.SU,
  RRule.MO,
  RRule.TU,
  RRule.WE,
  RRule.TH,
  RRule.FR,
  RRule.SA,
];

export const initialDosageValues = {
  doseValue: 1,
  doseUnit: "pill",
  scheduleStartDate: new Date(),
  frequencyCount: 1,
  frequency: Frequency.DAILY,
  daysOfWeek: initialDaysOfWeek,
  hour: 8,
  minute: 0,
  meridiem: MERIDIEMS.AM,
  scheduleEndDate: null,
  ruleAsString: "",
  intervalHoursAmount: 1,
  isSetIntervalsSchedule: false,
  intervalEndHour: 8,
  intervalEndMinute: 0,
  intervalEndMeridiem: MERIDIEMS.PM,
};

export const initialMedicationValues = {
  name: "",
  strength: "",
  refillChecked: false,
  scheduleChecked: false,
  refillDate: null,
  frequency: undefined,
  timesPerDay: undefined,
  doses: [],
  dosages: [],
  dosageValues: initialDosageValues,
  startDate: getToday(),
  stopDate: null,
  whichdays: [],
  scheduleIntervalStartTime: "8:00AM",
  scheduleIntervalEndTime: undefined,
  scheduleInterval: undefined,
  medicationCourseCount: ONE,
  medicationCourse: [MEDICATION_COURSE_ELEMENT],
  directions: "",
  overTheCounter: true,
  provider: {
    providersAvailable: false,
    provider: "",
    phone: "",
    nPI: "",
    firstName: "",
    lastName: "",
    displayAddress: "",
    newProvider: false,
    providerSelected: false,
    id: "",
    address: {
      addressLine1: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
    },
    other: false,
  },
  condition: {
    conditionOccurrenceId: null,
    name: null,
    iCD10Code: null,
    conditionId: null,
    conditionStarted: {
      year: null,
      day: null,
      month: null,
      unsureOfSpecificYear: false,
      relativeStart: null,
      relativeEnd: null,
    },
  },
  pharmacy: {
    name: "",
    phoneNumber: "",
    location: {
      addressLine1: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
      freeTextAddress: "",
    },
    other: false,
  },
};

export const getInitialMedicationValues = () => {
  return { ...initialMedicationValues };
};

const errorBarStyles = {
  border: "1px solid red",
  borderRadius: 14,
  ":focus": { border: "1.2px solid #A80000" },
};

export const dropdownErrorStyles = {
  dropdown: {
    ...errorBarStyles,
  },
};

export const comboboxErrorStyles = {
  root: {
    ...errorBarStyles,
  },
};

export const textFieldErrorStyles = {
  field: {
    ...errorBarStyles,
  },
};

export const datepickerErrorStyles: IDatePickerStyles = {
  textField: {
    selectors: {
      ".ms-TextField-fieldGroup": {
        border: "1px solid red !important",
        backgroundColor: "lightred",
        [":onHover"]: {
          border: "2px solid red !important",
        },
        ...errorBarStyles,
      },
    },
  },
  root: "",
  callout: "",
  icon: "",
};

export const inputErrorStyles = {
  dropdown: dropdownErrorStyles,
  combobox: comboboxErrorStyles,
  datepicker: datepickerErrorStyles,
};
