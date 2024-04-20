import { mergeStyleSets, IStyleFunctionOrObject, IDropdownStyleProps, IDropdownStyles } from '@fluentui/react';

interface IViewMedicationsClassNames {
    'wc-DosageForm--container': string;
    'wc-DosageForm--optionItem': string;
    'wc-DosageForm--optionIcon': string;
}

export const getClassNames = (): IViewMedicationsClassNames => {
    return mergeStyleSets({
        'wc-DosageForm--container': {
            width: '100%',
        },
        'wc-DosageForm--optionIcon': {
            color: '#4426D9',
            marginRight: '8px',
            margin: '0px',
        },
        'wc-DosageForm--optionItem': {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
        },
    });
};

export const dropdownStyle: IStyleFunctionOrObject<IDropdownStyleProps, IDropdownStyles> = {
    subComponentStyles: {
        multiSelectItem: {
            checkbox: {
                display: 'none',
            },
        },
    },
};
