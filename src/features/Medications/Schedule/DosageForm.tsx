import React, { useEffect } from 'react';

import { getClassNames } from './DosageForm.classNames';
import DayOfWeekSelector from './DayOfWeekSelector';
import TimeSelector from './TimeSelector';
import DateSelector from './DateSelector';
import DoseSelector from './DoseSelector';
import FrequencySelector from './FrequencySelector';
import { Weekday, Frequency } from 'rrule';
import { Stack, Text } from '@fluentui/react';

import { FormikProps } from 'formik';

import { ToggleRow } from 'src/common/components';

export interface DosageFormValues {
    doseValue: number;
    doseUnit: string;
    scheduleStartDate: Date;
    frequencyCount: number;
    frequency: Frequency;
    daysOfWeek: Weekday[];
    hour: number;
    minute: number;
    meridiem: string;
    scheduleEndDate: Date | null;
    ruleAsString: string;
    intervalHoursAmount: number;
    isSetIntervalsSchedule: boolean;
    intervalEndHour: number;
    intervalEndMinute: number;
    intervalEndMeridiem: string;
}

interface DosageFormProps {
    formik: FormikProps<{
        dosageValues: DosageFormValues;
    }>;
}

export enum MERIDIEMS {
    AM = 'AM',
    PM = 'PM',
}

const DosageForm: React.FC<DosageFormProps> = ({ formik }) => {
    const { values } = formik;
    const { dosageValues } = values;

    const {
        doseValue,
        doseUnit,
        scheduleStartDate,
        frequencyCount,
        frequency,
        daysOfWeek,
        hour,
        minute,
        meridiem,
        scheduleEndDate,
        ruleAsString,
        intervalHoursAmount,
        isSetIntervalsSchedule,
        intervalEndHour,
        intervalEndMinute,
        intervalEndMeridiem,
    } = dosageValues;

    useEffect(() => {
        //handle interval time overlaps
        let newIntervalEndHour = hour + intervalHoursAmount;

        if (isSetIntervalsSchedule) {
            if (newIntervalEndHour > 12) {
                newIntervalEndHour = newIntervalEndHour - 12;
            }
            //if both hours are set to 12 and meridiems are identical, set the end hour to intervalHoursAmount
            if (hour == 12 && intervalEndHour == 12 && meridiem === intervalEndMeridiem) {
                (value) => formik.setFieldValue('dosagesValues.intervalHoursAmount', value);
            }

            if (hour != 12 && meridiem === intervalEndMeridiem && intervalEndHour <= hour) {
                const newEndMeridiem = intervalEndMeridiem;
                formik.setFieldValue('dosagesValues.intervalEndHour', meridiem);
                formik.setFieldValue('dosagesValues.intervalEndMeridiem', newEndMeridiem);
            }
            if (intervalEndMeridiem === MERIDIEMS.AM && meridiem === MERIDIEMS.PM) {
                formik.setFieldValue('dosagesValues.intervalEndMeridiem', MERIDIEMS.PM);
                formik.setFieldValue('dosagesValues.intervalEndHour', newIntervalEndHour);
            }
        }
    }, [isSetIntervalsSchedule, hour, minute, meridiem, intervalEndHour, intervalEndMeridiem]);

    //handle date overlaps
    useEffect(() => {
        if (scheduleEndDate && scheduleEndDate < scheduleStartDate) {
            const newEndDate = new Date(scheduleStartDate);
            newEndDate.setDate(newEndDate.getDate() + 1);
            formik.setFieldValue('dosagesValues.scheduleEndDate', newEndDate);
        }
    }, [scheduleStartDate]);

    const medIsADailySchedule = frequencyCount === 1 && frequency === Frequency.DAILY;

    const everyDayIsSelected = daysOfWeek.length === 7;
    const daysAreSelected = daysOfWeek.length > 0 && !everyDayIsSelected;

    //todo: account for frequencyCount of  >  1

    useEffect(() => {
        if (daysAreSelected) {
            formik.setFieldValue('frequency', Frequency.WEEKLY);
        } else if (everyDayIsSelected) {
            formik.setFieldValue('frequency', Frequency.DAILY);
        }
    }, [daysOfWeek]);

    //var displayFrequency
    //if frequency is Hourly, we're on a set interval schedule,
    // in which case we display the frequency based on days selected
    // all = Daily, selected days = Weekly

    const frequencyToDisplay = frequency === Frequency.HOURLY ? Frequency.DAILY : frequency;

    return (
        <Stack className={getClassNames['wc-DosageForm--container']} tokens={{ childrenGap: 14 }}>
            <DoseSelector
                value={doseValue}
                setValue={(value) => formik.setFieldValue('dosageValues.doseValue', value)}
                unit={doseUnit}
                setUnit={(value) => formik.setFieldValue('dosageValues.doseUnit', value)}
            />

            <DateSelector
                value={scheduleStartDate}
                setValue={(value) => formik.setFieldValue('dosageValues.scheduleStartDate', value)}
                label={'Starting on'}
            />

            <FrequencySelector
                count={frequencyCount}
                setCount={(value) => formik.setFieldValue('dosageValues.frequencyCount', value)}
                frequency={frequencyToDisplay}
                setFrequency={(value) => formik.setFieldValue('dosageValues.frequency', value)}
            />

            {/* todo: weekly set dropdown selected day to current */}
            <DayOfWeekSelector
                setDaysOfWeek={(value) => formik.setFieldValue('dosageValues.daysOfWeek', value)}
                daysOfWeek={daysOfWeek}
                medIsADailySchedule={medIsADailySchedule}
                frequencyCount={frequencyCount}
            />

            <ToggleRow
                text="Set Intervals"
                onOffText
                checked={isSetIntervalsSchedule}
                onChange={(e, checked) => formik.setFieldValue('dosageValues.isSetIntervalsSchedule', checked)}
                testId={`dosage-set-intervals`}
            />

            {isSetIntervalsSchedule && (
                <TimeSelector
                    hour={hour}
                    minute={minute}
                    meridiem={meridiem}
                    interval={intervalHoursAmount}
                    intervalEndHour={intervalEndHour}
                    intervalEndMinute={intervalEndMinute}
                    intervalEndMeridiem={intervalEndMeridiem}
                    setHour={(value) => formik.setFieldValue('dosageValues.hour', value)}
                    setMinute={(value) => formik.setFieldValue('dosageValues.minute', value)}
                    setMeridiem={(value) => formik.setFieldValue('dosageValues.meridiem', value)}
                    setInterval={(value) => formik.setFieldValue('dosageValues.intervalHoursAmount', value)}
                    setIntervalEndHour={(value) => formik.setFieldValue('dosageValues.intervalEndHour', value)}
                    setIntervalEndMinute={(value) => formik.setFieldValue('dosageValues.intervalEndMinute', value)}
                    setIntervalEndMeridiem={(value) => formik.setFieldValue('dosageValues.intervalEndMeridiem', value)}
                    isSetIntervalsSchedule={isSetIntervalsSchedule}
                />
            )}

            <DateSelector
                value={scheduleEndDate}
                setValue={(value) => formik.setFieldValue('dosageValues.scheduleEndDate', value)}
                label={'Until'}
                showClear
                minDate={scheduleStartDate}
            />

            <Text style={{ fontStyle: 'italic' }}>{ruleAsString}</Text>
        </Stack>
    );
};

export default DosageForm;
