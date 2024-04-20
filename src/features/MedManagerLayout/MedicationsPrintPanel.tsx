import React, { useState, useEffect } from "react";

import { useReactToPrint } from "react-to-print";
import {
  Dropdown,
  ResponsiveMode,
  DatePicker,
  Stack,
  PrimaryButton,
  DayOfWeek,
  Checkbox,
} from "@fluentui/react";

import { useGetDataForPrintPages } from "src/common/hooks/useGetDataForPrintPages";
import SubHeaderLayout from "src/common/components/Layout/SubHeaderLayout";

import PrintableContentContainer from "src/features/PrintableContent/PrintableContentContainer";
import MedicationsPrint from "src/features/PrintableContent/MedicationsPrint";
import { sortMedsToDisplayBasedOnFilters } from "./helpers";
import { theme } from "src/theme";
import { medsSelectedDropdownOptions, selectOptions } from "./helpers";
import CalendarPrint from "../PrintableContent/CalendarPrint/CalendarPrint";
import {
  ICalendarEvent,
  createMedicationCalendarEventsBasedOnMedicationsData,
  mergeRRuleDataIntoMedicationData,
  sortEventData,
} from "../PrintableContent/CalendarPrint/helpers";
import { MedicationWithRRule } from "../Medications/helpers";
import { Prescription } from "src/types/Medication";
import { useGetTimezoneInfo } from "src/common/hooks/useGetTimezoneInfo";

const datePickerstyles = {
  statusMessage: {
    marginTop: 0,
  },
};

interface IMedicationPrintProps {
  onDismiss: () => void;
  meds: any;
}

const defaultStartDate = new Date(Date.now());
let defaultEndDate = new Date(Date.now());
defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);

const defaultStartDateUTC = defaultStartDate.toISOString();

const MedicationsPrintPanel: React.FC<IMedicationPrintProps> = ({
  onDismiss,
  meds,
}) => {
  const printMedicationsRef = React.useRef<HTMLDivElement>(null);
  const recipientData = useGetDataForPrintPages();
  const { careRecipientTimezone } = useGetTimezoneInfo();

  const [medsDataForCalendarPrintView, setMedsDataForCalendarPrintView] =
    useState([]);
  const [medsToDisplayForListView, setMedsToDisplayForListView] = useState([]);
  const [titleColumns, setTitleColumns] = useState([]);
  const [pageLabel, setPageLabel] = useState("");

  const [filterValues, setFilterValues] = useState({
    printRangeStart: defaultStartDateUTC,
    printRangeEnd: defaultEndDate,
    medsFilter: selectOptions.All,
    includeUpcomingRefills: true,
    includeRefillsPastAndPresent: false,
    showAsCalendarSchedule: false,
  });

  //todo: useMemo
  useEffect(() => {
    const medicationsFilteredByActiveAndWithDosage: MedicationWithRRule[] = meds
      .filter((prescription) => {
        return !prescription.endDate && prescription.dosages.length > 0;
      })
      .map((prescription) => {
        return mergeRRuleDataIntoMedicationData(
          prescription,
          careRecipientTimezone
        );
      });

    const medicationsWithNoDosageInfo: Prescription[] = meds.filter(
      (prescription) => {
        return !prescription.endDate && prescription.dosages.length === 0;
      }
    );

    const medicationsScheduledAndNonScheduled:
      | MedicationWithRRule[]
      | Prescription[] = [
      ...medicationsFilteredByActiveAndWithDosage,
      ...medicationsWithNoDosageInfo,
    ];

    const filterValuesWithStartDateAsDate = {
      ...filterValues,
      /**This is to remedy a strange bug where the start date was being
       * rerendered three weeks in the future on compponent mount */
      printRangeStart: new Date(filterValues.printRangeStart),
    };

    const medicationCalendarEvents: Array<ICalendarEvent> =
      createMedicationCalendarEventsBasedOnMedicationsData(
        medicationsFilteredByActiveAndWithDosage,
        filterValuesWithStartDateAsDate
      );

    const { weeks } = sortEventData(medicationCalendarEvents);

    setMedsDataForCalendarPrintView(weeks);

    const { medsPrintDisplay, titleColumns, pageLabel } =
      sortMedsToDisplayBasedOnFilters(
        medicationsScheduledAndNonScheduled,
        filterValuesWithStartDateAsDate
      );

    setMedsToDisplayForListView(medsPrintDisplay);
    setTitleColumns(titleColumns);
    setPageLabel(pageLabel);
  }, [filterValues, meds]);

  const handlePrint = useReactToPrint({
    content: () => printMedicationsRef.current,
    documentTitle: "Medications",
  });

  useEffect(() => {
    const today = new Date(Date.now());

    if (filterValues.medsFilter === selectOptions.Today) {
      setFilterValues({
        ...filterValues,
        printRangeStart: today.toUTCString(),
        printRangeEnd: today,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues.medsFilter]);

  const medListViewSelectedAndMedsToPrint =
    medsToDisplayForListView.length && !filterValues.showAsCalendarSchedule;
  const calendarViewSelectedAndMedsToPrint =
    medsDataForCalendarPrintView.length && filterValues.showAsCalendarSchedule;

  const printButtonText =
    medListViewSelectedAndMedsToPrint || calendarViewSelectedAndMedsToPrint
      ? "Print"
      : "No Medications to Print";

  const showAsCalendarView = filterValues.showAsCalendarSchedule;

  const filterStartDate = new Date(filterValues.printRangeStart);

  const disablePrintButton =
    (filterValues.showAsCalendarSchedule &&
      !medsDataForCalendarPrintView.length) ||
    (!filterValues.showAsCalendarSchedule && !medsToDisplayForListView.length);

  return (
    <>
      <SubHeaderLayout title="Print Medications" onClose={onDismiss} isPanel>
        <Stack verticalAlign="space-between" style={{ height: "95%" }}>
          <Stack tokens={{ childrenGap: 10 }}>
            <DatePicker
              styles={datePickerstyles}
              id="print-range-start"
              label="Include mediations from"
              data-testid="printRangeStart"
              firstDayOfWeek={DayOfWeek.Sunday}
              value={filterStartDate}
              onSelectDate={(date) => {
                const dateUTC = date.toUTCString();
                trackFieldChanged("printRangeStart");
                setFilterValues({ ...filterValues, printRangeStart: dateUTC });
              }}
              placeholder="Select a date"
            />
            <DatePicker
              styles={datePickerstyles}
              id="printRangeEnd"
              data-testid="print-range-end"
              firstDayOfWeek={DayOfWeek.Sunday}
              minDate={filterStartDate}
              value={filterValues.printRangeEnd}
              onSelectDate={(date) => {
                setFilterValues({ ...filterValues, printRangeEnd: date });
              }}
              placeholder="Select a date"
            />
            <Dropdown
              label="Medications"
              selectedKey={filterValues.medsFilter}
              onChange={(_, item) => {
                setFilterValues({
                  ...filterValues,
                  medsFilter: String(item.key),
                });
              }}
              options={medsSelectedDropdownOptions}
              responsiveMode={ResponsiveMode.large}
            />
            <>
              <Checkbox
                data-testid={"includeUpcomingRefillsToggle"}
                styles={theme.components.Checkbox.styles}
                label="Include Upcoming Refills"
                checked={filterValues.includeUpcomingRefills}
                onChange={(e, checked) => {
                  setFilterValues({
                    ...filterValues,
                    includeUpcomingRefills: checked,
                  });
                }}
              />
              <Checkbox
                data-testid={"includeRefillsPastAndPresentToggle"}
                styles={theme.components.Checkbox.styles}
                label="Include Refills Past and Present"
                checked={filterValues.includeRefillsPastAndPresent}
                onChange={(e, checked) => {
                  setFilterValues({
                    ...filterValues,
                    includeRefillsPastAndPresent: checked,
                  });
                }}
              />
              <Checkbox
                data-testid={"printCalendarViewToggle"}
                styles={theme.components.Checkbox.styles}
                label="Print Calendar View"
                checked={filterValues.showAsCalendarSchedule}
                onChange={(e, checked) => {
                  setFilterValues({
                    ...filterValues,
                    showAsCalendarSchedule: checked,
                  });
                }}
                disabled={!medsToDisplayForListView.length}
              />
            </>

            <PrimaryButton
              text={printButtonText}
              onClick={handlePrint}
              disabled={disablePrintButton}
              style={{ marginTop: 50 }}
            />
          </Stack>
        </Stack>
      </SubHeaderLayout>
      <PrintableContentContainer ref={printMedicationsRef}>
        {showAsCalendarView ? (
          <CalendarPrint
            recipientData={recipientData}
            weeksData={medsDataForCalendarPrintView}
          />
        ) : (
          <MedicationsPrint
            recipientData={recipientData}
            medications={medsToDisplayForListView}
            titleColumns={titleColumns}
            pageLabel={pageLabel}
          />
        )}
      </PrintableContentContainer>
    </>
  );
};

export default MedicationsPrintPanel;
