/* eslint-disable max-len */
/*eslint-disable*/
import { Weekday, rrulestr, Frequency, datetime, RRule } from "rrule";
import {
  Dosage,
  MedicationCourse,
} from "@src/features/Medications/MedicationMutationTypes";
// import {
//   DosageCreateInput,
//   Pharmacy,
// } from "@src/graphQL/serverMocks/graphQLGeneratedCode";
import { timesDropDownOptions, formatPhoneNumber } from "@src/utils/utils";
import { DAYS } from "@src/utils/dates";

import {
  MedicationCreateVariables,
  UpdateMedicationVariables,
  RefillUpdateVariables,
  Prescription,
} from "@src/types/Medication";
import { capitalizeFirstLetter } from "@src/common/helpers/textFormatting";
import { MERIDIEMS } from "@src/utils/constant";

import { MedicationFormikType } from "@src/features/Medications/MedicationForm";
import { dateOptions, getDateAtMidday } from "@src/utils/dates";
// import { locale } from "@src/features/AppProfile/constants";

import { isValidPhone } from "@src/utils/validators";
import { todaysDateAtMidnightIso } from "@src/features/MedManagerLayout/helpers";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { initialDosageValues } from "@src/features/Medications/constants";
const locale = "en-US";
dayjs.extend(utc);
dayjs.extend(timezone);

export const formErrors = {
  strengthRequired: "Medication strength required",
  refillDateRequired: "Refill date required",
  scheduleFrequencyRequired: "Schedule frequency required",
  dateOverlap: "Start date must be before stop date",
  providerDetailsNeeded: "Provider details needed",
  otherProviderNameRequired: `'Other' Provider last name required `,
  conditionNeedsSelection: "Condition needs to be selected or added",
  selectTimesPerDay: "Select times per day",
  selectDosageValues: "Select all doses and times",
  selectMedicationCourseLength: "Select length of medication course",
  medicationCourseDays: "Select times per day",
  medicationCourseDuplicateDays: "Days cannot be duplicates",
  repeatDaysNoDaysSelected: "Select days for Repeat Days Schedule",
  dosageInformationRequiredForRepeatDays: "Dose needed",
};

const addNewText = "addNew";

const getDoses = (scheduleBlocks) => {
  return scheduleBlocks.map((block) => {
    return {
      time: block.timeOfDayUtc,
      value: parseInt(block.dosageValue),
    };
  });
};

const getDateValues = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return [year, month, day];
};

type RRuleValues = {
  scheduleStartDate: Date | null;
  frequency: Frequency;
  frequencyParsed: string;
  recurrenceFrequencyCount: number | null;
  hour: number | null;
  minute: number | null;
  meridiem: string;
  scheduleEndDate: Date | null;
  daysOfWeek: Weekday[] | null;
  timeFormatted: string | null;
  daysOfWeekParsed: string[] | null;
  medIsTakenToday: boolean;
  timezone: string;
  allDates: string[];
  interval: number | null;
  count: number | null;
};

function enumValuesToArray<T extends Record<string, any>>(enumObject: T) {
  return Object.keys(enumObject).filter((key) => isNaN(parseInt(key)));
}

const frequencyArray = enumValuesToArray(Frequency);

interface IParseRRuleInput {
  inputString: string | null;
  careRecipientTimezone?: string;
}

const pullIntegersFromDateMatch = (match) => {
  const integersFromMatch = match.map((str) => parseInt(str));
  const [, year, month, day] = integersFromMatch;
  return [year, month, day];
};

const pullIntegersFromRRuleStringDateMatch = (
  input: string,
  careRecipientTimezone: string
) => {
  //note: if we remove careRecipientTimezone from the input string, we will need to adjust the regex pattern
  //use ChatGPT to
  const dtstartMatch = input.match(
    /DTSTART;[^:]*:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/
  );
  const untilMatch = input.match(
    /UNTIL=(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/
  );

  const dtstartDate = `${dtstartMatch[1]}-${dtstartMatch[2]}-${dtstartMatch[3]} ${dtstartMatch[4]}:${dtstartMatch[5]}:${dtstartMatch[6]}`;
  const untilDate = untilMatch
    ? `${untilMatch[1]}-${untilMatch[2]}-${untilMatch[3]} ${untilMatch[4]}:${untilMatch[5]}:${untilMatch[6]}`
    : null;

  const dtStartIntegers = pullIntegersFromDateMatch(dtstartMatch);
  const dtEndIntegers = untilMatch
    ? pullIntegersFromDateMatch(untilMatch)
    : [...dtStartIntegers];

  //adjust these to cr Timezone or they may be off enough to shift the dates by a day
  const dtStart = dayjs.tz(dtstartDate, careRecipientTimezone).toDate();
  const dtUntil = untilDate
    ? dayjs.tz(untilDate, careRecipientTimezone).toDate()
    : null;

  //if no end date provided, make the end date for generating date range one year later than the start year
  if (!untilMatch) {
    let [yearEnd] = dtEndIntegers;
    yearEnd += 1;
    dtEndIntegers[0] = yearEnd;
  }

  const [yearStart, monthStart, dayStart] = dtStartIntegers;
  const [yearEnd, monthEnd, dayEnd] = dtEndIntegers;

  return {
    dtStart,
    dtUntil,
    yearStart,
    monthStart,
    dayStart,
    yearEnd,
    monthEnd,
    dayEnd,
  };
};

const parseRRule = ({
  inputString,
  careRecipientTimezone,
}: IParseRRuleInput): RRuleValues => {
  if (!inputString) return null;

  console.log("parsing RRule, inputString: ", inputString);

  const rRuleParsed = rrulestr(inputString);

  console.log({ rRuleParsed });

  const { options } = rRuleParsed;

  console.log({ options });

  let hour = options.byhour[0],
    minute = options.byminute[0];
  let meridiem = MERIDIEMS.AM;

  if (hour > 12) {
    hour = hour - 12;
    meridiem = MERIDIEMS.PM;
  }

  const minuteString = minute < 10 ? `0${minute}` : minute;
  const timeFormatted = `${hour}:${minuteString}${meridiem}`;

  const { byweekday } = options;

  const daysOfWeek = byweekday?.map((day) => {
    return new Weekday(day);
  });

  const daysOfWeekNonAbbreviated = byweekday?.map((day) => {
    return DAYS[day];
  });

  const frequencyParsed = frequencyArray[options.freq];

  const {
    dtStart,
    dtUntil,
    yearStart,
    monthStart,
    dayStart,
    yearEnd,
    monthEnd,
    dayEnd,
  } = pullIntegersFromRRuleStringDateMatch(inputString, careRecipientTimezone);

  const allDates = rRuleParsed.between(
    datetime(yearStart, monthStart, dayStart),
    datetime(yearEnd, monthEnd, dayEnd)
  );

  const allDatesAtMidnightIso = allDates.map((date) => {
    const dateAtMidnight = new Date(date.setUTCHours(0, 0, 0, 0));
    return dateAtMidnight.toISOString();
  });

  const medIsTakenToday = allDatesAtMidnightIso.includes(
    todaysDateAtMidnightIso
  );

  console.log({ rRuleParsed, options });

  //options.count is the derived count of medications to be taken based on start/end time and interval

  const recurrenceCount = options.freq === RRule.HOURLY ? options.interval : 1;

  const rRulesValues = {
    scheduleStartDate: dtStart,
    scheduleEndDate: dtUntil,
    frequency: options.freq,
    interval: options.interval,
    frequencyParsed,
    //todo: this shouldn't be interval, what should it be?
    recurrenceFrequencyCount: recurrenceCount,
    count: options.count,
    hour: options.byhour[0],
    minute: options.byminute[0],
    meridiem: meridiem,
    daysOfWeek: daysOfWeek ?? [],
    timeFormatted: timeFormatted,
    daysOfWeekParsed: daysOfWeekNonAbbreviated ?? [],
    medIsTakenToday,
    timezone: options.tzid,
    allDates: allDatesAtMidnightIso,
  };

  return rRulesValues;
};

const determineSetIntervalCount = ({
  startHour,
  startMeridiem,
  startMinutes,
  endHour,
  endMeridiem,
  endMinutes,
  intervalHoursAmount,
}) => {
  let count = 0;
  const startTime = createDateWithTime({
    hours: startHour,
    minutes: startMinutes,
    meridiem: startMeridiem,
  });
  const endTime = createDateWithTime({
    hours: endHour,
    minutes: endMinutes,
    meridiem: endMeridiem,
  });
  const dateTimeToCompare = new Date(startTime);
  while (dateTimeToCompare < endTime) {
    count++;
    dateTimeToCompare.setHours(
      dateTimeToCompare.getHours() + intervalHoursAmount
    );
  }

  return count;
};

function createDateWithTime({ hours, minutes, meridiem }) {
  // Validate input values
  if (
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59 ||
    (meridiem !== "AM" && meridiem !== "PM")
  ) {
    throw new Error("Invalid input");
  }

  // Convert hours to 24-hour format if meridiem is 'PM'
  if (meridiem === "PM" && hours !== 12) {
    hours += 12;
  } else if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  // Create a new Date object with the provided time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

const createDosagesForMedicationSubmit = ({
  dosageValues,
  careRecipientTimezone,
}) => {
  const {
    doseValue,
    doseUnit,
    scheduleStartDate,
    frequencyCount,
    daysOfWeek,
    hour,
    minute,
    meridiem,
    scheduleEndDate,
    intervalHoursAmount,
    isSetIntervalsSchedule,
    intervalEndHour,
    intervalEndMinute,
    intervalEndMeridiem,
  } = dosageValues;

  let byHour = hour;
  if (meridiem === "PM" && hour !== 12) {
    byHour = hour + 12;
  }

  let dateStartViaRRUleDatetime = datetime(
    scheduleStartDate.getFullYear(),
    scheduleStartDate.getMonth() + 1,
    scheduleStartDate.getDate()
  );

  let dateEndViaRRUleDatetime = scheduleEndDate
    ? datetime(
        scheduleEndDate.getFullYear(),
        scheduleEndDate.getMonth() + 1,
        scheduleEndDate.getDate()
      )
    : undefined;

  const medIsARepeatDaysSchedule =
    daysOfWeek.length > 0 && daysOfWeek.length < 7;

  //todo: figure out what frquencyCount is being passed and returned as
  const frequencyInterval = medIsARepeatDaysSchedule ? 1 : frequencyCount;

  const intervalToPassToRuleConstructor = isSetIntervalsSchedule
    ? intervalHoursAmount
    : frequencyInterval;

  let intervalCount = null;

  if (isSetIntervalsSchedule) {
    intervalCount = determineSetIntervalCount({
      startHour: hour,
      startMinutes: minute,
      startMeridiem: meridiem,
      endHour: intervalEndHour,
      endMinutes: intervalEndMinute,
      endMeridiem: intervalEndMeridiem,
      intervalHoursAmount,
    });
  }
  let scheduleParams = {
    frequency: RRule.DAILY,
    interval: 1,
    count: intervalCount,
  };

  //if all days are selected and setIntervals is not selected
  if (daysOfWeek.length === 7 && !isSetIntervalsSchedule) {
    //      frequency is daily,
    scheduleParams.frequency = RRule.DAILY;
    scheduleParams.interval = 1;
  }

  //if only certain days are selected,
  if (medIsARepeatDaysSchedule) {
    scheduleParams.frequency = RRule.WEEKLY;
    scheduleParams.interval = 1;
  }

  //if set intervals is selected
  if (isSetIntervalsSchedule) {
    scheduleParams.frequency = RRule.HOURLY;
    scheduleParams.interval = intervalHoursAmount;
  }

  let rule = new RRule({
    freq: scheduleParams.frequency,
    interval: intervalToPassToRuleConstructor,
    byweekday: daysOfWeek,
    //todo: calculate count by end time selected
    count: scheduleParams.count,
    dtstart: dateStartViaRRUleDatetime,
    until: scheduleEndDate ? dateEndViaRRUleDatetime : undefined,
    byhour: Number(byHour),
    byminute: Number(minute),
    tzid: careRecipientTimezone,
  });

  const stringedRRule = rule.toString();

  console.log({ scheduleParams, dosageValues, stringedRRule });

  let dosage: Dosage = {
    value: doseValue,
    unit: doseUnit,
    schedule: stringedRRule,
  };

  return dosage;
  //     // setSetRuleAsString('Take ' + doseValue + ' ' + doseUnit + ' ' + rule.toText());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
};

const getScheduleIncrementValue = (
  frequency: Frequency,
  recurrenceCount: number
) => {
  let incrementValue;

  switch (frequency) {
    case Frequency.DAILY:
      incrementValue = recurrenceCount;
      break;
    case Frequency.WEEKLY:
      incrementValue = recurrenceCount * 7;
      break;

    default:
      throw new Error(`Invalid frequency: ${frequency}`);
  }

  return incrementValue;
};

const sortMedsByTime = (todaysMeds) => {
  let todaysMedsKeyedByTime = {};
  for (let i = 0; i < todaysMeds.length; i++) {
    const medication = todaysMeds[i];
    //form key with hour minute meridiem
    const time = medication.rRuleParams.timeFormatted;
    if (todaysMedsKeyedByTime[time]) {
      todaysMedsKeyedByTime[time].push(medication);
    } else {
      todaysMedsKeyedByTime[time] = [medication];
    }
  }

  return todaysMedsKeyedByTime;
};

const getMedsAccordingToDate = (medications, selectedDate) => {
  const dateToCompare = new Date(selectedDate);
  const selectedDateAtMidnight = new Date(
    dateToCompare.setUTCHours(0, 0, 0, 0)
  );
  const selectedDateAtMidnightToIso = selectedDateAtMidnight.toISOString();

  let todaysMedications = [];
  for (let i = 0; i < medications.length; i++) {
    const currentMedication = medications[i];
    const currentDosages = currentMedication.dosages[0];
    const schedule = currentDosages?.schedule;
    const rRuleParams = parseRRule({ inputString: schedule });

    //if today is selected
    if (rRuleParams?.allDates?.includes(selectedDateAtMidnightToIso)) {
      currentMedication.rRuleParams = rRuleParams;
      todaysMedications.push(currentMedication);
    }
  }
  //create on object that has the time as the key and the value is an array of medications for that time
  let todaysMedsKeyedByTime = sortMedsByTime(todaysMedications);

  return todaysMedsKeyedByTime;
};

export const getIntervalScheduleBlocks = (values) => {
  let intervalScheduleBlocks = [];

  let timesKeys = timesDropDownOptions.map((obj) => obj.key);

  let startTimeIndex = timesKeys.indexOf(values.scheduleIntervalStartTime);
  let endTimeIndex = timesKeys.indexOf(values.scheduleIntervalEndTime);

  let currentTimeIndex = startTimeIndex;

  while (currentTimeIndex <= endTimeIndex) {
    let currentScheduleBlock = {
      dosageValue: values.doses[0].value.toString(),
      timeOfDayUtc: timesKeys[currentTimeIndex],
    };
    intervalScheduleBlocks.push(currentScheduleBlock);
    //increment index in timesKeys by two to increment by hours value
    //as opposed to half hour values, could be an optimization
    const indexIncrementedByHourValue = values.scheduleInterval * 2;
    currentTimeIndex += indexIncrementedByHourValue;
  }
  return intervalScheduleBlocks;
};

export const getIntervalScheduleBlocksForCustom = (
  course: MedicationCourse
) => {
  let intervalScheduleBlocks = [];

  let timesKeys = timesDropDownOptions.map((obj) => obj.key);

  let startTimeIndex = timesKeys.indexOf(
    course.scheduleIntervalStartTime.toString()
  );
  let endTimeIndex = timesKeys.indexOf(
    course.scheduleIntervalEndTime.toString()
  );

  let currentTimeIndex = startTimeIndex;

  while (currentTimeIndex <= endTimeIndex) {
    let currentScheduleBlock = {
      dosageValue: course.doses[0].value.toString(),
      timeOfDayUtc: timesKeys[currentTimeIndex],
    };
    intervalScheduleBlocks.push(currentScheduleBlock);
    //increment index in timesKeys by two to increment by hours value
    //as opposed to half hour values, could be an optimization
    const indexIncrementedByHourValue = course.scheduleInterval * 2;
    currentTimeIndex += indexIncrementedByHourValue;
  }
  return intervalScheduleBlocks;
};

/**if we have selected 'other' in the condition dropdown,
 * conditionOccurrence will be passed as 'other' instead of null.
 * @getTakenForId calculates takenFor.id depending on if a new condition is being created
 * or an existing condition is being assigned to
 *
 * new conditions we create with a medication are passed with
 * takenFor: {
 *     id: null,
 *     {
 *       condition: iCD10Code,
 *       name: condition.name.
 *     }
 * existing conditions are passed with
 *  takenFor: {
 *    id: conditionOccurrenceId,
 *    condition: conditionId,
 *    name: null
 *   }
 */
const getTakenForId = (input) => {
  return input === addNewText ? null : input;
};

const handleMedicationSubmit = ({
  values,
  type,
  routedDoseFormDrugId,
  dispensableDrugId,
  strengthDropDown,
  careRecipientTimezone,
}) => {
  const capitalizedName = capitalizeFirstLetter(values.name);
  const capitalizedDirections = capitalizeFirstLetter(values.directions);
  const cleanedUpStrength = values.strength
    ? strengthDropDown.find((d) => d.key === values.strength).text
    : null;

  //todo: add rrule stuff here.

  const valuesToSave = {
    ...values,
    name: capitalizedName,
    directions: capitalizedDirections,
    strength: cleanedUpStrength,
    routedDoseFormDrugId,
    dispensableDrugId,
    careRecipientTimezone,
  };

  if (type === "add") {
    return setPrescriptionInput(
      valuesToSave,
      "add"
    ) as MedicationCreateVariables;
  } else {
    return setPrescriptionInput(
      valuesToSave,
      "edit"
    ) as UpdateMedicationVariables;
  }
};

const setPrescriptionInput = (values, type) => {
  let variables: MedicationCreateVariables | UpdateMedicationVariables =
    undefined;

  /*when no conditions are present, 
    formik will set conditionOccurrenceId to 'addNew',
    to avoid sending empty condition details when there are none in the dropdown
    only send condition details with the mutation when they have been selected or entered.
    otherwise an empty condition will be created.
    */

  const noConditionsAndNewNotEntered =
    values.condition.conditionOccurrenceId === addNewText &&
    !values.condition.conditionId &&
    !values.condition.iCD10Code;

  const noConditionEntered =
    noConditionsAndNewNotEntered ||
    (!values.condition.conditionOccurrenceId &&
      !values.condition.conditionId &&
      !values.condition.iCD10Code);

  //to avoid creating a blank condition if no condition info has been entered, pass null for takenFor
  if (type === "add") {
    variables = {
      prescription: {
        strengthValue: values.strength,
        takenFor: noConditionEntered
          ? null
          : {
              id: getTakenForId(values.condition.conditionOccurrenceId),
              condition: {
                id: values.condition.conditionId,
                iCD10Code: values.condition.iCD10Code,
                name: values.condition.iCD10Code ? values.condition.name : null,
              },
            },
        medication: {
          name: values.name,
          dispensableDrugId: values.dispensableDrugId,
          routedDoseFormDrugId: values.routedDoseFormDrugId,
        },
        dosages: [],
        directions: values.directions,
        overTheCounter: values.overTheCounter,
      },
    } as MedicationCreateVariables;
  } else {
    variables = {
      prescription: {
        id: values.id,
        strengthValue: values.strength,
        takenFor: noConditionEntered
          ? null
          : {
              id: getTakenForId(values.condition.conditionOccurrenceId),
              condition: {
                id: values.condition.conditionId,
                name: values.condition.iCD10Code ? values.condition.name : null,
                iCD10Code: values.condition.iCD10Code,
              },
            },
        medication: {
          name: values.name,
          dispensableDrugId: values.dispensableDrugId,
          routedDoseFormDrugId: values.routedDoseFormDrugId,
        },
        dosages: [],
        directions: values.directions,
        overTheCounter: values.overTheCounter,
      },
    } as UpdateMedicationVariables;
  }

  if (values.scheduleChecked) {
    // Currently we are only supporting one dosage per prescription.
    const dosageInput: DosageCreateInput = createDosagesForMedicationSubmit({
      dosageValues: { ...values.dosageValues },
      careRecipientTimezone: values.careRecipientTimezone,
    });

    variables.prescription.dosages.push(dosageInput);
  }
  /*Avoid creating a blank pharmacy record when no pharmacy has been selected from the dropdown or entered.
    pharmacy.id will be 'addNew' when there are none in the dropdown
    */
  const newPharmacyInfoEntered = values.pharmacy.name;
  if (values.refillChecked) {
    if (values.pharmacy.id === addNewText && newPharmacyInfoEntered) {
      variables.prescription.refill = {
        refillDate: getDateAtMidDayToLocaleDate(values.refillDate),
        pharmacy: {
          name: values.pharmacy.name,
          phoneNumber: values.pharmacy.phoneNumber,
          location: values.pharmacy.location,
        },
      };
    } else if (values.pharmacy.id && values.pharmacy.id !== addNewText) {
      variables.prescription.refill = {
        refillDate: getDateAtMidDayToLocaleDate(values.refillDate),
        pharmacy: { id: values.pharmacy.id },
      };
    } else {
      variables.prescription.refill = {
        refillDate: getDateAtMidDayToLocaleDate(values.refillDate),
      };
    }
  }

  /**If a current provider is selected, just pass in the provider id.
   * If a new provider is selected, pass in all info for creating a new provider.
   *  Otherwise do not pass in anything.
   *  A med form created when no providers are active in the record will have provider.id as 'addNew'
   * to avoid creating a blank provider record we check for provider values
   * */
  const newProviderInfoEntered =
    values.provider.firstName && values.provider.nPI && !values.provider.other;
  const otherProviderInfoEntered = Boolean(
    values.provider.other && values.provider.lastName
  );

  if (values.provider.id && values.provider.id !== addNewText) {
    variables.prescription.prescribingProvider = { id: values.provider.id };
  } else if (values.provider.id === addNewText) {
    if (newProviderInfoEntered) {
      variables.prescription.prescribingProvider = {
        firstName: values.provider.firstName,
        lastName: values.provider.lastName,
        nPI: values.provider.nPI,
        phoneNumber: values.provider.phone,
        address: {
          addressLine1: values.provider.address.addressLine1,
          city: values.provider.address.city,
          country: values.provider.address.country,
          state: values.provider.address.state,
          zipCode: values.provider.address.zipCode,
          freeTextAddress: values.provider.address.displayAddress,
        },
      };
    } else if (otherProviderInfoEntered) {
      variables.prescription.prescribingProvider = {
        firstName: values.provider.firstName,
        lastName: values.provider.lastName,
        nPI: null,
        phoneNumber: values.provider.phone,
        address: {
          addressLine1: values.provider.address.addressLine1,
          city: values.provider.address.city,
          country: values.provider.address.country,
          state: values.provider.address.state,
          zipCode: values.provider.address.zipCode,
          freeTextAddress: values.provider.address.displayAddress,
        },
      };
    }
  } else {
    variables.prescription.prescribingProvider = undefined;
  }

  return variables;
};

const getDateAtMidDayToLocaleDate = (date) => {
  return getDateAtMidday(date).toLocaleDateString(locale, dateOptions);
};

const getRefillUpdateVariables = (values) => {
  let variables: RefillUpdateVariables = { refill: undefined };
  if (values.refillDate) {
    if (values.pharmacy.id === "addNew") {
      // null check pharmacy name and don't attach it to refill if a name isn't given
      const pharmacy =
        values.pharmacy?.name !== ""
          ? {
              name: values.pharmacy.name,
              phoneNumber: values.pharmacy.phoneNumber,
              location: {
                addressLine1: values.pharmacy.location.addressLine1,
                city: values.pharmacy.location.city,
                freeTextAddress: values.pharmacy.location.freeTextAddress,
                state: values.pharmacy.location.state,
                zipCode: values.pharmacy.location.zipCode,
              },
            }
          : null;

      variables.refill = {
        id: values.refillId,
        refillDate: getDateAtMidDayToLocaleDate(values.refillDate),
        pharmacy: pharmacy,
      };
    } else if (values.pharmacy.id) {
      variables.refill = {
        id: values.refillId,
        refillDate: getDateAtMidDayToLocaleDate(values.refillDate),
        pharmacy: { id: values.pharmacy.id },
      };
    } else {
      variables.refill = {
        id: values.refillId,
        refillDate: getDateAtMidDayToLocaleDate(values.refillDate),
      };
    }
  }

  return variables;
};

const calculateIntervalEndTimeBasedOnStartTimeIntervalAndCount = ({
  startHour,
  startMinute,
  interval,
  count,
}) => {
  console.log("calculating");
  const intervalEndTimes = {
    hour: startHour,
    minute: startMinute,
    meridiem: MERIDIEMS.AM,
  };

  const intervalEndHour = startHour + interval * (count - 1);

  console.log({ intervalEndHour, startHour, interval, count });

  if (intervalEndHour > 12) {
    intervalEndTimes.hour = intervalEndHour - 12;
    intervalEndTimes.meridiem = MERIDIEMS.PM;
  } else {
    intervalEndTimes.hour = intervalEndHour;
  }

  return intervalEndTimes;
};

const setDosageValuesBasedOnIncomingPrescription = (dosage, timezone) => {
  const inputString = dosage.schedule;

  const rRuleParsed = parseRRule({
    inputString,
    careRecipientTimezone: timezone,
  });
  console.log({ rRuleParsed });

  const isSetIntervalsSchedule = rRuleParsed.frequency === Frequency.HOURLY;
  console.log({ isSetIntervalsSchedule });

  const intervalEndTimes = isSetIntervalsSchedule
    ? calculateIntervalEndTimeBasedOnStartTimeIntervalAndCount({
        startHour: rRuleParsed.hour,
        startMinute: rRuleParsed.minute,
        interval: rRuleParsed.interval,
        count: rRuleParsed.count,
      })
    : {
        hour: 5,
        minute: 0,
        meridiem: MERIDIEMS.PM,
      };

  //if count is not null, we are dealing with a set intervals schedule

  //take this and make an objcet with the useStateValues as keys
  //we have to calculate setIntervals end time based on the start time, count and interval.
  const valuesBasedOffOfParsedRRule = {
    doseValue: dosage?.value ?? 1,
    doseUnit: dosage?.unit ?? "pill",
    scheduleStartDate: rRuleParsed?.scheduleStartDate ?? new Date(),
    frequencyCount: rRuleParsed?.recurrenceFrequencyCount ?? 1,
    frequency: rRuleParsed?.frequency ?? Frequency.DAILY,
    daysOfWeek: rRuleParsed?.daysOfWeek?.length ? rRuleParsed.daysOfWeek : [],
    hour: rRuleParsed?.hour ?? 8,
    minute: rRuleParsed?.minute ?? 0,
    meridiem: rRuleParsed?.meridiem ?? MERIDIEMS.AM,
    scheduleEndDate: rRuleParsed?.scheduleEndDate ?? null,
    ruleAsString: "",
    intervalHoursAmount: rRuleParsed.interval,
    isSetIntervalsSchedule,
    //todo: calculate these values based off of RRule parsed
    intervalEndHour: intervalEndTimes.hour,
    intervalEndMinute: intervalEndTimes.minute,
    intervalEndMeridiem: intervalEndTimes.meridiem,
  };

  return valuesBasedOffOfParsedRRule;
};

interface ISetInitValuesInput {
  prescription: Prescription;
  careRecipientTimezone: string;
}

const setInitValues = ({
  prescription,
  careRecipientTimezone,
}: ISetInitValuesInput) => {
  const pharmacy =
    (prescription.refills?.[0]?.pharmacy as Pharmacy) ?? undefined;
  const dosage = prescription.dosages[0];

  const location = pharmacy ? pharmacy.location : undefined;
  const providerFormattedPhoneNumber = prescription.prescribingProvider
    ?.phoneNumber
    ? formatPhoneNumber(prescription.prescribingProvider.phoneNumber)
    : "";
  const pharmacyFormattedPhoneNumber = pharmacy
    ? formatPhoneNumber(pharmacy.phoneNumber)
    : "";

  const dosageInitialValues = prescription.dosages.length
    ? setDosageValuesBasedOnIncomingPrescription(dosage, careRecipientTimezone)
    : initialDosageValues;

  console.log({ dosageInitialValues });

  const initValues: MedicationFormikType = {
    id: prescription.id,
    conditionId: prescription.takenFor?.id,
    refillId: prescription.refills?.[0]?.id,
    medicationId: prescription.medication?.id,
    name: prescription.medication?.name ?? "",
    strength:
      prescription.medication?.dispensableDrugId && prescription.strengthValue
        ? prescription.medication?.dispensableDrugId +
          "," +
          prescription.strengthValue
        : "",
    refillDate: prescription.refills?.[0]?.refillDate
      ? getDateAtMidday(new Date(prescription.refills?.[0]?.refillDate))
      : null,
    refillChecked: prescription.refills?.[0]?.refillDate ? true : false,
    overTheCounter: prescription.overTheCounter,
    scheduleChecked:
      prescription.dosages && prescription.dosages.length > 0 ? true : false,
    directions: prescription.directions ?? "",
    dosageValues: dosageInitialValues,
    provider: {
      phone: providerFormattedPhoneNumber,
      providersAvailable: false,
      nPI: "",
      firstName: prescription.prescribingProvider?.firstName ?? "",
      lastName: prescription.prescribingProvider?.lastName ?? "",
      displayAddress:
        prescription.prescribingProvider?.address?.singleLineAddress ?? "",
      freeTextAddress:
        prescription.prescribingProvider?.address?.freeTextAddress ?? "",
      newProvider: prescription.prescribingProvider ? false : true,
      id: prescription.prescribingProvider?.id,
      providerSelected:
        prescription.prescribingProvider?.id !== "" &&
        prescription.prescribingProvider?.id !== undefined,
      address: {
        addressLine1:
          prescription.prescribingProvider?.address?.addressLine1 ?? "",
        addressLine2:
          prescription.prescribingProvider?.address?.addressLine2 ?? "",
        city: prescription.prescribingProvider?.address?.city ?? "",
        country: prescription.prescribingProvider?.address?.country ?? "",
        state: prescription.prescribingProvider?.address?.state ?? "",
        zipCode: prescription.prescribingProvider?.address?.zipCode ?? "",
      },
      other: false,
    },
    condition: {
      conditionOccurrenceId: prescription?.takenFor?.id,
      name: prescription?.takenFor?.condition?.name,
      conditionId: prescription?.takenFor?.condition?.id,
    },

    pharmacy: {
      phoneNumber: pharmacyFormattedPhoneNumber,
      location: {
        addressLine1: location?.addressLine1,
        city: location?.city,
        country: location?.country,
        state: location?.state,
        zipCode: location?.zipCode,
      },
      id: pharmacy?.id,
      name: pharmacy?.name,
      other: false,
    },
    noConditionSelected: "",
    doses: [],
    startDate: undefined,
    whichdays: [],
    scheduleIntervalStartTime: "",
  };

  return initValues;
};

const required: string = "Required";

const validateMedicationsForm = (
  values,
  medicationRequiresStrength: boolean
): any => {
  const errors: any = {};
  if (!values.name) {
    errors.name = required;
  }

  if (!values.strength && medicationRequiresStrength) {
    errors.strength = formErrors.strengthRequired;
  }
  if (values.refillChecked && !values.refillDate) {
    errors.refillDate = formErrors.refillDateRequired;
  }
  //TODO: Add Date Validation Checks Here for DosageForm Start & Stop Dates... or someone else!!!
  // if (values.scheduleChecked && values?.startDate && values?.stopDate) {
  //     if (values.startDate > values.stopDate) {
  //         errors.dateOverlap = formErrors.dateOverlap;
  //     }
  // }

  if (!values.overTheCounter) {
    if (
      values.provider.id === addNewText &&
      values.provider.providersAvailable &&
      !values.provider.firstName &&
      !values.provider.other
    ) {
      errors.providerNeeded = formErrors.providerDetailsNeeded;
    }
    if (
      values.provider.id === addNewText &&
      values.provider.other &&
      !values.provider.lastName
    ) {
      errors.providerNeeded = formErrors.otherProviderNameRequired;
    }
    if (values.provider.phone && !isValidPhone(values.provider.phone)) {
      errors.providerPhone = "Please enter a valid phone number";
    }
  }

  const { conditionOccurrenceId, iCD10Code } = values.condition;

  if (conditionOccurrenceId === addNewText) {
    if (!iCD10Code) {
      errors.noConditionSelected = formErrors.conditionNeedsSelection;
    }
  }

  return errors;
};

const createStrengthDropdownOptionKey = (val) => {
  return (
    val.dispensableDrugID.toString() +
    "," +
    val.medStrength +
    val.medStrengthUnit
  );
};

export {
  getDoses,
  getDateValues,
  getMedsAccordingToDate,
  setPrescriptionInput,
  setInitValues,
  validateMedicationsForm,
  getRefillUpdateVariables,
  handleMedicationSubmit,
  createStrengthDropdownOptionKey,
  getDateAtMidDayToLocaleDate,
  getTakenForId,
  addNewText,
  required,
  parseRRule,
  RRuleValues,
  getScheduleIncrementValue,
};
