import React, { FormEvent } from 'react';
import { Stack, Dropdown, IDropdownOption, Text } from '@fluentui/react';
import { getClassNames } from './DosageForm.classNames';
import { colors } from 'src/common/styles/colors';

interface TimeSelectorProps {
    setHour: (hour: number) => void;
    setMinute: (minute: number) => void;
    setMeridiem: (meridiem: string) => void;
    setInterval: (interval: number) => void;
    setIntervalEndHour: (hour: number) => void;
    setIntervalEndMinute: (minute: number) => void;
    setIntervalEndMeridiem: (meridiem: string) => void;
    hour: number;
    minute: number;
    meridiem: string;
    intervalEndHour: number;
    intervalEndMinute: number;
    intervalEndMeridiem: string;
    interval: number;
    isSetIntervalsSchedule: boolean;
}

const getHourOptions = (): any[] => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
        options.push({ key: i, text: i.toString() });
    }

    return options;
};

const hourOptions = getHourOptions();

const minuteOptions = [
    { key: 0, text: '00' },
    { key: 30, text: '30' },
];

const meridiemOptions = [
    { key: 'AM', text: 'AM' },
    { key: 'PM', text: 'PM' },
];

const TimeSelector: React.FC<TimeSelectorProps> = ({
    setHour,
    setMinute,
    setMeridiem,
    setInterval,
    setIntervalEndHour,
    setIntervalEndMinute,
    setIntervalEndMeridiem,
    hour,
    minute,
    meridiem,
    intervalEndHour,
    intervalEndMinute,
    intervalEndMeridiem,
    interval,
    isSetIntervalsSchedule,
}) => {
    const onHourChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setHour(Number(item.key));
    };

    const onMinuteChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setMinute(Number(item.key));
    };

    const onMeridiemChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setMeridiem(item.key.toString());
    };

    const onIntervalEndHourChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setIntervalEndHour(Number(item.key));
    };

    const onIntervalEndMinuteChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setIntervalEndMinute(Number(item.key));
    };

    const onIntervalEndMeridiemChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setIntervalEndMeridiem(item.key.toString());
    };

    const onIntervalChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setInterval(Number(item.key));
    };

    // ensure the proper style is applied to the rendered dropdown options.
    const onRenderOption = (option: IDropdownOption): JSX.Element => {
        return (
            <div className={getClassNames['wc-DosageForm--optionItem']}>
                <div style={option.selected ? { color: colors.fabric.neutrals.WCprimary } : null}> {option.text}</div>
                {option.selected}
            </div>
        );
    };

    const timeText = isSetIntervalsSchedule ? 'Starting' : 'At';

    return (
        <Stack tokens={{ childrenGap: 14 }}>
            <Stack
                className={getClassNames['wc-DosageForm--container']}
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 14 }}
            >
                <Text>Interval Time: Every </Text>
                <Dropdown
                    id="interval-time"
                    data-testid={'interval-time'}
                    selectedKey={interval}
                    onRenderOption={onRenderOption}
                    onChange={onIntervalChange}
                    options={hourOptions}
                />
                <Text>hour</Text>
            </Stack>
            <Stack
                className={getClassNames['wc-DosageForm--container']}
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 14 }}
            >
                <Text>{timeText}</Text>
                <Dropdown
                    id="hour"
                    data-testid={'hour'}
                    selectedKey={hour}
                    onRenderOption={onRenderOption}
                    onChange={onHourChange}
                    options={hourOptions}
                />
                <Text>:</Text>
                <Dropdown
                    id="minute"
                    data-testid={'minute'}
                    selectedKey={minute}
                    onRenderOption={onRenderOption}
                    onChange={onMinuteChange}
                    options={minuteOptions}
                />

                <Dropdown
                    id="meridiem"
                    data-testid={'meridiem'}
                    selectedKey={meridiem}
                    onRenderOption={onRenderOption}
                    onChange={onMeridiemChange}
                    options={meridiemOptions}
                />
            </Stack>
            {isSetIntervalsSchedule && (
                <Stack
                    className={getClassNames['wc-DosageForm--container']}
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 14 }}
                >
                    <Text>Ending </Text>
                    <Dropdown
                        id="hour"
                        data-testid={'hour'}
                        selectedKey={intervalEndHour}
                        onRenderOption={onRenderOption}
                        onChange={onIntervalEndHourChange}
                        options={hourOptions}
                    />
                    <Text>:</Text>
                    <Dropdown
                        id="minute"
                        data-testid={'minute'}
                        selectedKey={intervalEndMinute}
                        onRenderOption={onRenderOption}
                        onChange={onIntervalEndMinuteChange}
                        options={minuteOptions}
                    />

                    <Dropdown
                        id="meridiem"
                        data-testid={'meridiem'}
                        selectedKey={intervalEndMeridiem}
                        onRenderOption={onRenderOption}
                        onChange={onIntervalEndMeridiemChange}
                        options={meridiemOptions}
                    />
                </Stack>
            )}
        </Stack>
    );
};

export default TimeSelector;
