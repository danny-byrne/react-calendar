import React, { FormEvent } from 'react';
import { Stack, Dropdown, IDropdownOption, DropdownMenuItemType, Text } from '@fluentui/react';
import { getClassNames } from './DosageForm.classNames';
import { colors } from 'src/common/styles/colors';
import { trackFieldChanged } from 'src/wcpConsentInit';

interface DoseSelectorProps {
    value: number;
    setValue: (number) => void;
    unit: string;
    setUnit: (string) => void;
}

const doseValueOptions = (): any[] => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
        options.push({ key: i, text: i.toString() });
    }

    return options;
};

const doseUnitOptions = [
    { key: 'formatHeader', text: 'Types', itemType: DropdownMenuItemType.Header },
    { key: 'pill', text: 'pill(s)' },
    { key: 'tablet', text: 'tablet(s)' },
    { key: 'capsule', text: 'capsule(s)' },
    { key: 'puff', text: 'puff(s)' },
    { key: 'drop', text: 'drop(s)' },
    { key: 'spray', text: 'spray' },
    { key: 'inhalation', text: 'inhalation' },
    { key: 'patch', text: 'patch(es)' },
    { key: 'lozenge', text: 'lozenge(s)' },
    { key: 'suppository', text: 'suppository' },
    { key: 'injection', text: 'injection(s)' },
    { key: 'measurementHeader', text: 'Measurements', itemType: DropdownMenuItemType.Header },
    { key: 'mg', text: 'mg' },
    { key: 'mcg', text: 'mcg' },
    { key: 'g', text: 'g' },
    { key: 'mL', text: 'mL' },
];

const DoseSelector: React.FC<DoseSelectorProps> = ({ value, setValue, unit, setUnit }) => {
    const onDoseValueChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        trackFieldChanged('doseValue');
        setValue(item.key);
    };

    const onDoseUnitChange = (event: FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        trackFieldChanged('doseUnit');
        setUnit(item.key);
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
            <Text>Take</Text>
            <Dropdown
                id="doseValue"
                data-testid={'doseValue'}
                defaultSelectedKey={value}
                onRenderOption={onRenderOption}
                onChange={onDoseValueChange}
                options={doseValueOptions()}
                styles={{ dropdown: { width: 60 } }}
            />
            <Dropdown
                id="dosageUnit"
                data-testid={'dosageUnit'}
                defaultSelectedKey={unit}
                onRenderOption={onRenderOption}
                onChange={onDoseUnitChange}
                options={doseUnitOptions}
                styles={{ dropdown: { width: 140 } }}
            />
        </Stack>
    );
};

export default DoseSelector;
