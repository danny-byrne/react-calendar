/*eslint-disable*/
import { Stack } from "@fluentui/react";
import DayTime from "@src/components/DayTime";

import { inputErrorStyles } from "@src/features/Medications/constants";

import { RRuleValues } from "@src/helpers/medications";

import { Prescription } from "@src/types/Medication";
import { capitalizeOnlyFirstLetter } from "@src/common/helpers/textFormatting";

export interface MedicationWithRRule extends Prescription {
  rRuleParams?: RRuleValues;
}

export const scheduleDropdownStyles = {
  callout: { height: "180px" },
};

const frequencyIntervalOptions = {
  DAILY: "days",
  WEEKLY: "weeks",
  MONTHLY: "months",
  YEARLY: "years",
  HOURLY: "hours",
};
const getDailyScheduleText = (recurrenceFrequency, frequencyInterval) => {
  let frequencyIntervalText = "";

  switch (true) {
    case recurrenceFrequency === 1:
      frequencyIntervalText = capitalizeOnlyFirstLetter(
        frequencyInterval.toLowerCase()
      );
      break;
    case recurrenceFrequency > 1:
      frequencyIntervalText = `Every ${recurrenceFrequency} ${frequencyIntervalOptions[frequencyInterval]}`;
      break;
  }

  return { frequencyIntervalText };
};

export const getFrequencyHeaderAndContent = (
  prescription: MedicationWithRRule,
  careRecipientTimezone?: string
) => {
  let frequencyText = "",
    frequencyContent = null,
    dosageInformation = null;
  if (!prescription?.rRuleParams) {
    return { frequencyText, frequencyContent, dosageInformation };
  }
  const dosage = prescription?.dosages?.length ? prescription.dosages[0] : null;
  const rRuleParams = prescription?.rRuleParams;
  const frequencyParsed = rRuleParams?.frequencyParsed;
  const doseValue = dosage?.value;
  const doseUnit = dosage?.unit;

  const medIsASetIntervalsSchedule = rRuleParams?.interval > 0;

  const medStartDate = new Date(
    rRuleParams?.scheduleStartDate
  ).toLocaleDateString();

  const dosageAmount = dosage?.value;
  let timeFormatted, recurrenceFrequencyCount, daysOfWeekParsed;

  if (prescription && prescription.rRuleParams) {
    const { rRuleParams } = prescription;
    console.log({ rRuleParams });
    ({ timeFormatted, recurrenceFrequencyCount, daysOfWeekParsed } =
      rRuleParams);
  }

  //TODO: this method is very confusinng find another way.
  const medTimeDisplay = timeFormatted + " " + careRecipientTimezone;

  // const frequencyBaseValue = medIsASetIntervalsSchedule ? rRuleParams?.interval : frequencyParsed;
  const frequencyBaseValue = frequencyParsed;

  const { frequencyIntervalText } = getDailyScheduleText(
    recurrenceFrequencyCount,
    frequencyBaseValue
  );

  const daysOfWeekText = daysOfWeekParsed?.length
    ? `On ${daysOfWeekParsed.join(", ")}`
    : null;

  const frequencyTextBasedOffFrequencyAndWeekDays =
    daysOfWeekText ?? `${frequencyIntervalText}`;

  frequencyText = `${frequencyTextBasedOffFrequencyAndWeekDays} starting ${medStartDate}`;
  dosageInformation = `Take ${doseValue} ${doseUnit}`;
  frequencyContent = (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      verticalAlign="center"
      key={medTimeDisplay}
    >
      <div>Take {dosageAmount}: </div>
      <div>
        <DayTime time={medTimeDisplay} />
      </div>
    </Stack>
  );

  return { frequencyText, frequencyContent, dosageInformation };
};

export const getInputErrorStyles = ({ hasError, defaultStyle, errorStyle }) => {
  const errorStyles = hasError ? errorStyle : null;
  const combinedStyles = { ...defaultStyle, ...errorStyles };
  return combinedStyles;
};

export const getCustomScheduleErrorsAndTouchedValues = (
  touched,
  errors,
  currentFormikPathIndex
) => {
  const currentMedicationCourseTouched = touched.medicationCourse ?? null;

  const timesPerDayTouched = currentMedicationCourseTouched
    ? currentMedicationCourseTouched[currentFormikPathIndex]?.timesPerDay
    : null;

  const medicationCourseErrors = errors.medicationCourse ?? null;
  const timesPerDayError = medicationCourseErrors
    ? medicationCourseErrors[currentFormikPathIndex]?.timesPerDay
    : null;

  const showTimesPerDayError = timesPerDayTouched && timesPerDayError;
  const timesPerDayDropdownCombinedStyles = getInputErrorStyles({
    hasError: showTimesPerDayError,
    defaultStyle: scheduleDropdownStyles,
    errorStyle: inputErrorStyles.dropdown,
  });

  const setIntervalsTouchedDoses = currentMedicationCourseTouched?.length
    ? currentMedicationCourseTouched[currentFormikPathIndex]?.doses
    : null;

  const setIntervalDoseHasBeenTouched = setIntervalsTouchedDoses?.length
    ? setIntervalsTouchedDoses[currentFormikPathIndex]?.value
    : null;

  const currentMedicationCourseErrors = errors?.medicationCourse
    ? errors?.medicationCourse[currentFormikPathIndex]
    : null;

  const setIntervalsDoseError = currentMedicationCourseErrors?.doses?.length
    ? currentMedicationCourseErrors?.doses[currentFormikPathIndex]?.value
    : null;

  const setIntervalDoseHasError =
    setIntervalDoseHasBeenTouched && setIntervalsDoseError;
  const setIntervalsDoseCombinedStyles = getInputErrorStyles({
    hasError: setIntervalDoseHasError,
    defaultStyle: scheduleDropdownStyles,
    errorStyle: inputErrorStyles.dropdown,
  });

  const intervalTimeError =
    errors?.medicationCourse?.[currentFormikPathIndex]?.scheduleInterval;
  const setIntervalIntervalHasBeenTouched =
    currentMedicationCourseTouched?.length
      ? currentMedicationCourseTouched[currentFormikPathIndex]?.scheduleInterval
      : null;

  const intervalTimeHasError =
    setIntervalIntervalHasBeenTouched && intervalTimeError;
  const setIntervalsIntervalCombinedStyles = getInputErrorStyles({
    hasError: intervalTimeHasError,
    defaultStyle: scheduleDropdownStyles,
    errorStyle: inputErrorStyles.dropdown,
  });

  const startTimeHasError =
    errors?.medicationCourse?.[currentFormikPathIndex]
      ?.scheduleIntervalStartTime;
  const startTimeHasBeenTouched = currentMedicationCourseTouched?.length
    ? currentMedicationCourseTouched[currentFormikPathIndex]
        ?.scheduleIntervalStartTime
    : null;

  const intervalStartTimeHasError =
    startTimeHasBeenTouched && startTimeHasError;
  const startTimeCombinedStyles = getInputErrorStyles({
    hasError: intervalStartTimeHasError,
    defaultStyle: scheduleDropdownStyles,
    errorStyle: inputErrorStyles.dropdown,
  });

  const endTimeHasError =
    errors?.medicationCourse?.[currentFormikPathIndex]?.scheduleIntervalEndTime;

  const endTimeHasBeenTouched = currentMedicationCourseTouched?.length
    ? currentMedicationCourseTouched[currentFormikPathIndex]
        ?.scheduleIntervalEndTime
    : null;

  const intervalEndTimeHasError = endTimeHasBeenTouched && endTimeHasError;

  const endTimeCombinedStyles = getInputErrorStyles({
    hasError: intervalEndTimeHasError,
    defaultStyle: scheduleDropdownStyles,
    errorStyle: inputErrorStyles.dropdown,
  });

  return {
    endTimeCombinedStyles,
    intervalEndTimeHasError,
    startTimeCombinedStyles,
    intervalStartTimeHasError,
    setIntervalsIntervalCombinedStyles,
    intervalTimeHasError,
    setIntervalsDoseCombinedStyles,
    setIntervalDoseHasError,
    timesPerDayDropdownCombinedStyles,
    showTimesPerDayError,
  };
};
