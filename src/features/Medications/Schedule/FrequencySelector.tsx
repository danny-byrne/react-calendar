import React, { FormEvent } from 'react';
import { Stack, Dropdown, IDropdownOption, Text } from '@fluentui/react';
import { getClassNames } from './DosageForm.classNames';
import { colors } from 'src/common/styles/colors';
import { trackFieldChanged } from 'src/wcpConsentInit';
import { Frequency } from 'rrule';

interface FrequencySelectorProps {
    frequency: Frequency;
    setFrequency: (string) => void;
    count: number;
    setCount: (number) => void;
}

const getFrequencyCountOptions = (): any[] => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
        options.push({ key: i, text: i.toString() });
    }

    return options;
};

const frequencyCountOptions = getFrequencyCountOptions();

const frequencyOptions = [
    { key: Frequency.DAILY, text: 'day' },
    { key: Frequency.WEEKLY, text: 'week' },
];

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ count, setCount, frequency, setFrequency }) => {
    const onFrequencyCountChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        trackFieldChanged('frequencyCount');
        setCount(item.key);
    };

    const onFrequencyChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        trackFieldChanged('frequency');
        setFrequency(item.key);
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

    return (
        <Stack
            className={getClassNames['wc-DosageForm--container']}
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 14 }}
        >
            <Text>Repeat every</Text>
            <Dropdown
                id="frequencyCount"
                data-testid={'frequencyCount'}
                selectedKey={count}
                onRenderOption={onRenderOption}
                onChange={onFrequencyCountChange}
                options={frequencyCountOptions}
                styles={{ dropdown: { width: 60 } }}
            />
            <Dropdown
                id="frequency"
                data-testid={'frequency'}
                selectedKey={frequency}
                onRenderOption={onRenderOption}
                onChange={onFrequencyChange}
                options={frequencyOptions}
                styles={{ dropdown: { width: 75 } }}
            />
        </Stack>
    );
};

export default FrequencySelector;
