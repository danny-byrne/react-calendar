import { FontWeights, mergeStyleSets } from '@fluentui/react';
import { BREAKPOINTS } from 'src/app/Breakpoints';
import { colors } from 'src/common/styles/colors';
import { modalLayer } from 'src/features/Medications/zIndex';

interface ITogetherTimeLayoutClassNames {
    'wc-MedManagerLayout--medListContainer': string;
    'wc-MedManagerLayout--firstTimeContainer': string;
    'wc-MedManagerLayout--firstTimeTitle': string;
    'wc-MedManagerLayout--firstTimeSubTitle': string;
    'wc-MedManagerLayout--firstTimeSearchBox': string;
    'wc-MedManagerLayout--fullPageContainer': string;
}

export const getClassNames = (): ITogetherTimeLayoutClassNames => {
    return mergeStyleSets({
        'wc-MedManagerLayout--medListContainer': {
            paddingBottom: '4rem',
        },
        'wc-MedManagerLayout--addButton': {
            width: '95%',
            margin: 'auto',
            paddingBottom: 5,
        },
        'wc-MedManagerLayout--firstTimeContainer': {
            alignItems: 'center',
        },
        'wc-MedManagerLayout--firstTimeTitle': {
            textAlign: 'center',
            fontSize: '1.5rem',
            paddingBottom: '8px',
            paddingTop: '8px',
            fontWeight: FontWeights.semibold,
        },
        'wc-MedManagerLayout--firstTimeSubTitle': {
            fontSize: '1rem',
            paddingBottom: '24px',
        },
        'wc-MedManagerLayout--firstTimeSearchBox': {
            width: '327px',
            [BREAKPOINTS.DESKTOP_SMALL]: {
                width: '480px',
            },
        },
        'wc-MedManagerLayout--fullPageContainer': {
            height: '100%',
        },
        'wc-MedManagerLayout--printButton': {
            [BREAKPOINTS.MOBILE]: {
                position: 'relative',
                top: 10,
                left: '70%',
            },
            color: colors.fabric.neutrals.WCprimary,
            borderRadius: '100px',
            border: '1px solid',
            height: '40px',
            width: '40px',
            zIndex: modalLayer,
        },
    });
};
