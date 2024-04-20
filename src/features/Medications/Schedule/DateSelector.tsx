import React from 'react';
import { DatePicker, DefaultButton, Stack, Text, defaultDatePickerStrings } from '@fluentui/react';


interface DateSelectorProps {
    value?: Date;
    setValue: (Date) => void;
    label: string;
    showClear?: boolean;
    minDate?: Date;
}

const DateSelector: React.FC<DateSelectorProps> = ({ value, setValue, label, showClear, minDate }) => {
    const onDateChange = (date: Date): void => {
        setValue(date);
        trackFieldChanged(label);
    };

    const onClear = (): void => {
        setValue(undefined);
        trackFieldChanged(label);
    };

    return (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 14 }}>
            <Text>{label}</Text>
            <DatePicker
                ariaLabel={label}
                value={value}
                onSelectDate={onDateChange}
                strings={defaultDatePickerStrings}
                styles={{ root: { width: 200 } }}
                minDate={minDate}
            />

            {showClear && <DefaultButton text="Clear" onClick={onClear} />}
        </Stack>
    );
};

export default DateSelector;
