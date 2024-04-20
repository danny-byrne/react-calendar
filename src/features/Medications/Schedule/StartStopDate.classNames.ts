import { mergeStyleSets } from '@fluentui/react';

interface IOptionalContainerClassNames {
    'wc-StartStopDate--container': string;
    'wc-StartStopDate--startDate': string;
    'wc-StartStopDate--stopDate': string;
    'wc-StartStopDate--optionalButton': string;
    'wc-StartStopDate--stopDateButton': string;
    'wc-StartStopDate--stopDateContainer': string;
}

export const getClassNames = (): IOptionalContainerClassNames => {
    return mergeStyleSets({
        'wc-StartStopDate--container': {
            alignItems: 'start',
            width: '100%',
        },
        'wc-StartStopDate--startDate': {
            width: '100%',
            paddingBottom: '8px',
        },
        'wc-StartStopDate--stopDate': {
            width: '100%',
        },
        'wc-StartStopDate--optionalButton': {
            marginTop: 30,
        },
        'wc-StartStopDate--stopDateButton': {
            border: 'none',
        },
        'wc-StartStopDate--stopDateContainer': {
            alignItems: 'center',
        },
    });
};
