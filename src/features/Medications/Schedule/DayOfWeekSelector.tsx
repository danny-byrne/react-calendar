/*eslint-disable*/
import React, { useEffect } from 'react';

import Toggle from './Toggle';
import { Stack, Text } from '@fluentui/react';
import { RRule, Weekday } from 'rrule';
interface DayOfWeekSelectorProps {
    setDaysOfWeek: (days: Weekday[]) => void;
    daysOfWeek?: Weekday[];
    medIsADailySchedule: boolean;
    frequencyCount?: number;
}

const daysFirstRow = ['Su', 'Mo', 'Tu', 'We'];
const daysSecondRow = ['Th', 'Fr', 'Sa'];

const daysIntsToAbbreviatedStrings = {
    0: 'Mo',
    1: 'Tu',
    2: 'We',
    3: 'Th',
    4: 'Fr',
    5: 'Sa',
    6: 'Su',
};

const DayOfWeekSelector: React.FC<DayOfWeekSelectorProps> = ({ daysOfWeek, medIsADailySchedule, setDaysOfWeek }) => {
    useEffect(() => {
        console.log({ daysOfWeek, medIsADailySchedule });
    }, [daysOfWeek]);

    const handleDaysOfWeekChange = (day) => {
        const updatedDaysOfWeek = [...daysOfWeek];

        const toggleDayOfWeek = (day) => {
            if (updatedDaysOfWeek.includes(day)) {
                updatedDaysOfWeek.splice(updatedDaysOfWeek.indexOf(day), 1);
            } else {
                updatedDaysOfWeek.push(day);
            }
        };

        switch (day) {
            case 'Su':
                toggleDayOfWeek(RRule.SU);
                break;
            case 'Mo':
                toggleDayOfWeek(RRule.MO);
                break;
            case 'Tu':
                toggleDayOfWeek(RRule.TU);
                break;
            case 'We':
                toggleDayOfWeek(RRule.WE);
                break;
            case 'Th':
                toggleDayOfWeek(RRule.TH);
                break;
            case 'Fr':
                toggleDayOfWeek(RRule.FR);
                break;
            case 'Sa':
                toggleDayOfWeek(RRule.SA);
                break;
            default:
                break;
        }

        setDaysOfWeek(updatedDaysOfWeek);
    };

    const parsedDaysOfWeek = daysOfWeek.map((day) => {
        const { weekday: dayInt } = day;
        return daysIntsToAbbreviatedStrings[dayInt];
    });

    return (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 14 }}>
            <Text>On</Text>
            <Stack tokens={{ childrenGap: 4 }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                    {daysFirstRow.map((day) => (
                        <Toggle
                            value={parsedDaysOfWeek.includes(day)}
                            onChange={() => handleDaysOfWeekChange(day)}
                            name={day}
                        />
                    ))}
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                    {daysSecondRow.map((day) => (
                        <Toggle
                            value={parsedDaysOfWeek.includes(day)}
                            onChange={() => handleDaysOfWeekChange(day)}
                            name={day}
                        />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default DayOfWeekSelector;
