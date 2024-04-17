import { mergeStyleSets, FontSizes, FontWeights } from '@fluentui/react';
import { BREAKPOINTS } from 'src/app/Breakpoints';
import { LOCAL_STORAGE_KEYS } from 'src/app/Strings';
import { colors } from '../../styles/colors';

const HEADER_HEIGHT = 56;
const SUBHEADER_HEIGHT = 48;

interface ILayoutClassNames {
    'wc-SubHeaderLayout--container': string;
    'wc-SubHeaderLayout--subHeader': string;
    'wc-SubHeaderLayout--subHeaderText': string;
    'wc-SubHeaderLayout--rightSide': string;
    'wc-SubHeaderLayout--editButton': string;
    'wc-SubHeaderLayout--removeButton': string;
    'wc-SubHeaderLayout--separator': string;
    'wc-SubHeaderLayout--contentContainer': string;
    'wc-SubHeaderLayout--centeringContainer': string;
}

export const getClassNames = (height, isPanel): ILayoutClassNames => {
    const CONTENT_CONTAINER_HEIGHT = height - HEADER_HEIGHT - SUBHEADER_HEIGHT;

    const maxHeight = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.MAX_HEIGHT));
    // Panel height conditionally uses maxHeight from LocalStorage if height is smaller than 300px as a
    // fix for the panel height being cut in half if the panel is opened when the keyboard is open on Android
    const panelHeight = height < 300 ? maxHeight - HEADER_HEIGHT - SUBHEADER_HEIGHT : CONTENT_CONTAINER_HEIGHT;

    return mergeStyleSets({
        'wc-SubHeaderLayout--container': {
            width: '100%',
            backgroundColor: colors.windcrest.headerBackground,
        },
        'wc-SubHeaderLayout--subHeader': {
            display: 'flex',
            height: '3.5rem',
            flexDirection: 'row',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.windcrest.pageBackground,
            borderRadius: '12px 0px 0px 0px',
        },
        'wc-SubHeaderLayout--subHeaderText': {
            fontSize: FontSizes.size16,
            fontWeight: FontWeights.semibold,
        },
        'wc-SubHeaderLayout--rightSide': {
            display: 'flex',
            width: 'auto',
            alignItems: 'center',
        },
        'wc-SubHeaderLayout--editButton': {
            borderRadius: '100px',
            height: '36px',
        },
        'wc-SubHeaderLayout--removeButton': {
            color: colors.fabric.neutrals.WCprimary,
            borderRadius: '100px',
            border: '1px solid',
            height: '40px',
            width: '40px',
        },
        'wc-SubHeaderLayout--separator': {
            padding: 0,
            height: '1px',
        },
        'wc-SubHeaderLayout--contentContainer': [
            {
                height: `${CONTENT_CONTAINER_HEIGHT}px`,
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '24px',
                paddingBottom: '11rem',
                backgroundColor: colors.windcrest.pageBackground,
                overflowY: 'auto',
                overflowX: 'hidden',

                [BREAKPOINTS.MOBILE]: {
                    width: 'calc(calc(100%) - 50px)',
                },
                [BREAKPOINTS.DESKTOP_MEDIUM]: {
                    width: '971px',
                    justifyContent: 'flex-start',
                },
            },
            // Panels do not include header or footer
            isPanel && {
                height: panelHeight,
            },
        ],
        'wc-SubHeaderLayout--centeringContainer': {
            height: '100%',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            // Small desktops implement layout as block, less than Small
            // and greater than Medium implement as flex to grow padding evenly
            [BREAKPOINTS.DESKTOP_SMALL]: {
                display: 'block',
            },
            [BREAKPOINTS.DESKTOP_MEDIUM]: {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
            },
        },
    });
};
