import { BREAKPOINTS } from 'src/app/Breakpoints';
import { colors } from 'src/common/styles/colors';

export const PanelStyleOverrides = {
    main: {
        'background-color': colors.windcrest.pageBackground,
        boxShadow: '0px 0.6px 1.8px rgba(0, 0, 0, 0.1), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13);',
        borderRadius: '12px 0px 0px 0px',
        [BREAKPOINTS.DESKTOP_SMALL]: {
            top: '48px',
        },
    },
    content: {
        padding: '0px',
        top: '100px',
    },
    commands: {
        padding: '0px',
    },
    scrollableContent: {
        'overflow-y': 'hidden',
        'overflow-x': 'hidden',
    },
};
