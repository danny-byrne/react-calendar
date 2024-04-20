import { Stack, DayOfWeek } from "@fluentui/react";

import { formatPhoneNumber } from "@src/utils/utils";
import { getDateAtMidday } from "@src/utils/dates";

import {
  MedicationWithRRule,
  getFrequencyHeaderAndContent,
} from "../Medications/helpers";
import { Frequency } from "rrule";

import { IMedicationsPrintFilterValues } from "../PrintableContent/CalendarPrint/helpers";

const createMedicationDetailColumn = (details) => {
  return (
    <Stack>
      {details.map((detail) => {
        return detail ? <div>{detail}</div> : null;
      })}
    </Stack>
  );
};

export const MEDICATION_PRINT_PAGE_LABELS = {
  All: "All Medications",
  Refills: "Refills",
  Current: "Current Medications",
};

export const selectOptions = {
  All: "All",
  Refills: "Refills",
  Today: "Today",
};

export const medsSelectedDropdownOptions = [
  { key: selectOptions.All, text: selectOptions.All },
  { key: selectOptions.Refills, text: selectOptions.Refills },
  { key: selectOptions.Today, text: selectOptions.Today },
];

const DEFAULT_MEDS_COLUMN_TITLES = [
  "Name & Strength",
  "Instructions",
  "Notes",
  "Provider",
  "Pharmacy",
];
const REFILL_MEDS_COLUMN_TITLES = [
  "Name & Strength",
  "Next refill",
  "Pharmacy",
  "Provider",
];

export const todaysDate = new Date();

export const todaysDateAtMiddayUTC = getDateAtMidday(todaysDate).toUTCString();
export const todaysDateAtMidnightMilliseconds = new Date(
  todaysDate
).setUTCHours(0, 0, 0, 0);
export const todaysDateAtMidnight = new Date(todaysDateAtMidnightMilliseconds);
export const todaysDateAtMidnightIso = todaysDateAtMidnight.toISOString();

export const currentDayString = DayOfWeek[todaysDate.getDay()];
export const todaysAbsoluteDateInMilliseconds = todaysDate.getTime();

export const sortMedsToDisplayBasedOnFilters = (medData, filter) => {
  const activeMeds = medData
    .filter((med) => !med.endDate)
    .sort((a, b) => a.medication.name.localeCompare(b.medication.name));
  const inactiveMeds = medData
    .filter((med) => med.endDate)
    .sort((a, b) => a.medication.name.localeCompare(b.medication.name));

  const medsSortedByActive = [...activeMeds, ...inactiveMeds];

  const selectedFilter = filter.medsFilter;

  const filteredMeds = filterMedsBasedOnIncomingFilters({
    meds: medsSortedByActive,
    selectedFilter,
    filterValues: filter,
  });

  const medsPrintDisplay = getMedicationPrintDisplayValues(
    filteredMeds,
    selectedFilter
  );

  const { pageLabel, titleColumns } =
    getPageLabelAndTitleColumns(selectedFilter);

  return { medsPrintDisplay, titleColumns, pageLabel };
};

const filterMedsBasedOnIncomingFilters = ({
  meds,
  selectedFilter,
  filterValues,
}) => {
  const filteredMeds = meds.filter((med) => {
    const {
      startDate,
      startDateToCompare,
      filterDateStart,
      filterDateEnd,
      medHasRefills,
      endDateToCompare,
      medIsTakenToday,
    } = extractScheduleInformation({ medication: med, filterValues });

    const startDateIsAfterFilterDateEnd = startDateToCompare > filterDateEnd;
    const endDateBeforeFilterDateStart = endDateToCompare < filterDateStart;

    const medIsOutOfDateRange =
      startDateIsAfterFilterDateEnd || endDateBeforeFilterDateStart;
    const medHasAStartDateAndIsWithinFilterDatesRange =
      startDate && !medIsOutOfDateRange;

    if (selectedFilter === selectOptions.All) {
      if (medHasAStartDateAndIsWithinFilterDatesRange) {
        return med;
      } else if (!startDate) {
        //if no schedule info entered, there will be no startDate, include in list
        return med;
      }
    }
    const filterOptionIsRefillsAndMedHasRefills =
      selectedFilter === selectOptions.Refills && medHasRefills;
    if (filterOptionIsRefillsAndMedHasRefills) {
      if (filterValues.includeUpcomingRefills) {
        const refillDate = new Date(med.refills[0].refillDate).getTime();
        const rightNow = new Date(Date.now()).getTime();
        if (refillDate > rightNow) {
          return med;
        }
      }
      if (filterValues.includeRefillsPastAndPresent) {
        return med;
      }
    }

    if (selectedFilter === selectOptions.Today && medIsTakenToday) {
      return med;
    }
  });

  return filteredMeds;
};

const getMedicationPrintDisplayValues = (
  filteredMedications,
  selectedFilter
) => {
  const medPrintDisplayValues = filteredMedications.map((medication) => {
    const {
      medName,
      nextRefillDate,
      pharmacyLocation,
      pharmacyName,
      pharmacyPhoneNumber,
      providerName,
      instructions,
      notes,
      providerAddress,
    } = extractMedicationInformation(medication);

    const pharmacyDetails = [
      pharmacyName,
      pharmacyLocation,
      pharmacyPhoneNumber,
    ].filter(
      (element) => element !== undefined && element !== null && element !== ""
    );
    const providerDetails = [providerName, providerAddress].filter(
      (element) => element !== undefined && element !== null && element !== ""
    );

    const providerBlock = createMedicationDetailColumn(providerDetails);
    const pharmacyBlock = createMedicationDetailColumn(pharmacyDetails);
    const allMedsColumns = [
      medName,
      instructions,
      notes,
      providerBlock,
      pharmacyBlock,
    ];
    const refillMedsColumns = [
      medName,
      nextRefillDate,
      pharmacyBlock,
      providerBlock,
    ];
    const medicationColumns =
      selectedFilter === selectOptions.Refills
        ? refillMedsColumns
        : allMedsColumns;

    const medActiveStatusWithColumns = {
      isActive: !medication.endDate,
      columns: medicationColumns,
    };
    return medActiveStatusWithColumns;
  });

  return medPrintDisplayValues;
};

export const getProviderName = (nameInput) => {
  if (!nameInput) {
    return "";
  } else {
    const firstName = nameInput.firstName ?? "";
    const lastName = nameInput.lastName ?? "";
    return `${firstName} ${lastName}`;
  }
};

const createMedInstructions = (med) => {
  const { frequencyText, dosageInformation } =
    getFrequencyHeaderAndContent(med);

  return (
    <Stack>
      <div>{frequencyText}</div>
      {dosageInformation}
    </Stack>
  );
};

interface IExtractMedicationInformationInput {
  medication: MedicationWithRRule;
  filterValues: IMedicationsPrintFilterValues;
}

const extractScheduleInformation = ({
  medication,
  filterValues,
}: IExtractMedicationInformationInput) => {
  const dosage = medication.dosages[0];
  const rRuleParams = medication?.rRuleParams;

  const medIsRepeatDays = rRuleParams?.daysOfWeekParsed?.length > 0;

  const startDate = rRuleParams?.scheduleStartDate;
  const endDate = rRuleParams?.scheduleEndDate;
  const values = {
    startDate: startDate,
    endDate: endDate,
    medHasEnded: false,
    filterDateEnd: filterValues.printRangeStart,
    filterDateStart: filterValues.printRangeStart,
    medHasRefills: medication.refills.length > 0,
    rRuleValues: rRuleParams,
    startDateToCompare: startDate ?? null,
    endDateToCompare: endDate ?? null,
    medIsRepeatDaysSchedule: medIsRepeatDays,
    medIsDailySchedule:
      rRuleParams?.frequency === Frequency.DAILY && !medIsRepeatDays,
    medIsTakenToday: rRuleParams?.medIsTakenToday,
    dosage: dosage,
  };

  values.startDate = rRuleParams?.scheduleStartDate;
  values.endDate = rRuleParams?.scheduleStartDate;

  values.medHasEnded =
    new Date(todaysAbsoluteDateInMilliseconds) > values.endDateToCompare;

  return values;
};

const extractMedicationInformation = (medication) => {
  const medName = `${medication.medication.name}  ${
    medication?.strengthValue ?? ""
  }`;
  const nextRefillDate = medication?.refills[0]?.refillDate;
  const pharmacyName = medication?.refills[0]?.pharmacy?.name;
  const pharmacyLocation =
    medication?.refills[0]?.pharmacy?.location?.singleLineAddress;
  const pharmacyPhoneNumber = formatPhoneNumber(
    medication?.refills[0]?.pharmacy?.phoneNumber
  );
  const providerName = getProviderName(medication?.prescribingProvider);
  const instructions = createMedInstructions(medication);
  const conditionName = medication?.takenFor?.condition?.name
    ? medication?.takenFor?.condition?.name
    : "";
  const directions = medication?.directions ?? "";
  const notes = conditionName + " " + directions;
  const providerAddress =
    medication?.prescribingProvider?.singleLineAddress ?? null;

  const result = {
    medName,
    nextRefillDate,
    pharmacyLocation,
    pharmacyName,
    pharmacyPhoneNumber,
    providerName,
    instructions,
    notes,
    providerAddress,
  };

  return result;
};

const getPageLabelAndTitleColumns = (selectedFilter) => {
  let pageLabel = "";
  let titleColumns = DEFAULT_MEDS_COLUMN_TITLES;
  if (selectedFilter === selectOptions.Refills) {
    titleColumns = REFILL_MEDS_COLUMN_TITLES;
    pageLabel = MEDICATION_PRINT_PAGE_LABELS.Refills;
  } else if (selectedFilter === selectOptions.All) {
    pageLabel = MEDICATION_PRINT_PAGE_LABELS.All;
  } else {
    pageLabel = MEDICATION_PRINT_PAGE_LABELS.Current;
  }
  return { pageLabel, titleColumns };
};
