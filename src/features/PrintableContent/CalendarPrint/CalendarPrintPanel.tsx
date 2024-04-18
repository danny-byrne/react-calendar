import React, { useState, useEffect } from 'react';

import { useReactToPrint } from 'react-to-print';
import { DatePicker, Stack, PrimaryButton, DayOfWeek, Checkbox } from '@fluentui/react';
import { trackFieldChanged } from 'src/wcpConsentInit';
import { useGetDataForPrintPages } from 'src/common/hooks/useGetDataForPrintPages';
import SubHeaderLayout from 'src/common/components/Layout/SubHeaderLayout';

import PrintableContentContainer from 'src/features/PrintableContent/PrintableContentContainer';
import { theme } from 'src/theme';
import CalendarPrint from 'src/features/PrintableContent/CalendarPrint/CalendarPrint';
import { RecordStatus } from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import { useGetPrescriptionsWithScheduleQuery, Appointment } from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import {
    sortEventData,
    createMedicationCalendarEventsBasedOnMedicationsData,
    getDayOfWeek,
    mergeRRuleDataIntoMedicationData,
    ICalendarEvent,
    ICalendarPrintFilterValues,
} from 'src/features/PrintableContent/CalendarPrint/helpers';
import { useGetTimezoneInfo } from 'src/common/hooks/useGetTimezoneInfo';

const datePickerStyles = {
    statusMessage: {
        marginTop: 0,
    },
};

export type AppointmentInput = Pick<
    Appointment,
    'description' | 'endDateTime' | 'id' | 'location' | 'recordStatus' | 'recurrence' | 'startDateTime'
>;

interface ICalendarPrintPanelProps {
    onDismiss: () => void;
    appointments: AppointmentInput[];
}

const weekendDays = ['Saturday', 'Sunday'];
const DEFAULT_FILTER_DATE_RANGE_NUM_DAYS = 14;

const CalendarPrintPanel: React.FC<ICalendarPrintPanelProps> = ({ onDismiss, appointments }) => {
    const printCalendarRef = React.useRef<HTMLDivElement>(null);
    const recipientData = useGetDataForPrintPages();
    const [weeksData, setWeeksData] = useState([]);

    const handlePrint = useReactToPrint({
        content: () => printCalendarRef.current,
        documentTitle: 'Calendar',
    });

    const { data: medicationsData } = useGetPrescriptionsWithScheduleQuery();
    const { careRecipientTimezone } = useGetTimezoneInfo();

    const defaultStartDate = new Date(Date.now());
    const defaultEndDate = new Date(Date.now());
    defaultStartDate.setHours(0, 0, 0, 0);
    defaultEndDate.setHours(23, 59, 59, 999);
    defaultEndDate.setDate(defaultEndDate.getDate() + DEFAULT_FILTER_DATE_RANGE_NUM_DAYS);

    const [filterValues, setFilterValues] = useState<ICalendarPrintFilterValues>({
        printRangeStart: defaultStartDate,
        printRangeEnd: defaultEndDate,
        showWeekends: true,
        showMedSchedule: true,
        showActivitiesSchedule: true,
    });

    useEffect(() => {
        const filteredAppointments = appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.startDateTime);
            //TODO VNext: this will be swapped with RRule logic, date will be UTC

            return (
                appointmentDate >= filterValues.printRangeStart &&
                appointmentDate <= filterValues.printRangeEnd &&
                appointment.recordStatus === RecordStatus.Active
            );
        });

        let massagedMedicationsData: Array<ICalendarEvent> = [];
        if (
            medicationsData?.careRecipientMedicationPrescriptions?.prescriptions.length &&
            filterValues.showMedSchedule
        ) {
            const { prescriptions } = medicationsData.careRecipientMedicationPrescriptions;
            const medicationsFilteredByActiveWithDosageInfo = prescriptions.filter(
                (prescription) => !prescription.endDate && prescription.dosages.length,
            );

            const medicationsWithParsedRRuleData = medicationsFilteredByActiveWithDosageInfo.map((prescription) => {
                return mergeRRuleDataIntoMedicationData(prescription, careRecipientTimezone);
            });

            massagedMedicationsData = createMedicationCalendarEventsBasedOnMedicationsData(
                medicationsWithParsedRRuleData,
                filterValues,
            );
        }

        let calendarEventData = [...filteredAppointments, ...massagedMedicationsData];

        if (!filterValues.showWeekends) {
            calendarEventData = calendarEventData.filter((event) => {
                const day = getDayOfWeek(event.startDateTime);
                return !weekendDays.includes(day);
            });
        }

        const { weeks } = sortEventData(calendarEventData);

        setWeeksData(weeks);
    }, [filterValues, appointments, medicationsData]);

    const printButtonIsDisabled = !weeksData.length;

    return (
        <>
            <SubHeaderLayout title="Print Settings" onClose={onDismiss} isPanel>
                <Stack verticalAlign="space-between" style={{ height: '95%' }}>
                    <Stack tokens={{ childrenGap: 35 }}>
                        <Stack tokens={{ childrenGap: 10 }}>
                            <DatePicker
                                styles={datePickerStyles}
                                id="print-range-start"
                                label="Print range"
                                data-testid="printRangeStart"
                                firstDayOfWeek={DayOfWeek.Sunday}
                                value={filterValues.printRangeStart}
                                onSelectDate={(date) => {
                                    trackFieldChanged('printRangeStart');
                                    setFilterValues({ ...filterValues, printRangeStart: date });
                                }}
                                placeholder="Select a date"
                            />
                            <DatePicker
                                styles={datePickerStyles}
                                id="printRangeEnd"
                                data-testid="print-range-end"
                                firstDayOfWeek={DayOfWeek.Sunday}
                                minDate={filterValues.printRangeStart}
                                value={filterValues.printRangeEnd}
                                onSelectDate={(date) => {
                                    trackFieldChanged('startDate');
                                    setFilterValues({ ...filterValues, printRangeEnd: date });
                                }}
                                placeholder="Select a date"
                            />
                        </Stack>

                        <Stack tokens={{ childrenGap: 20 }}>
                            <Checkbox
                                data-testid={'showWeekendsToggle'}
                                styles={theme.components.Checkbox.styles}
                                label="Show Weekends"
                                checked={filterValues.showWeekends}
                                onChange={(e, checked) => {
                                    setFilterValues({
                                        ...filterValues,
                                        showWeekends: checked,
                                    });
                                }}
                            />
                            <Checkbox
                                data-testid={'showMedScheduleToggle'}
                                styles={theme.components.Checkbox.styles}
                                label="Show Medication Schedule"
                                checked={filterValues.showMedSchedule}
                                onChange={(e, checked) => {
                                    setFilterValues({
                                        ...filterValues,
                                        showMedSchedule: checked,
                                    });
                                }}
                            />
                            {/* V Next when Activity Timeframes is implememented */}
                            {/* <Checkbox
                                data-testid={'showMedScheduleToggle'}
                                styles={theme.components.Checkbox.styles}
                                label="Show Activities Schedule"
                                checked={filterValues.showActivitiesSchedule}
                                onChange={(e, checked) => {
                                    setFilterValues({
                                        ...filterValues,
                                        showActivitiesSchedule: checked,
                                    });
                                }}
                            /> */}
                        </Stack>
                        <PrimaryButton
                            text={printButtonIsDisabled ? 'No events to print' : 'Print'}
                            onClick={handlePrint}
                            style={{ marginTop: 50 }}
                            disabled={printButtonIsDisabled}
                        />
                    </Stack>
                </Stack>
            </SubHeaderLayout>
            <PrintableContentContainer ref={printCalendarRef}>
                <CalendarPrint recipientData={recipientData} weeksData={weeksData} />
            </PrintableContentContainer>
        </>
    );
};

export default CalendarPrintPanel;
