import { IModalStyles } from '@fluentui/react';
import { BREAKPOINTS } from 'src/app/Breakpoints';

export const modalStyles: IModalStyles = {
    root: '',
    keyboardMoveIcon: '',
    keyboardMoveIconContainer: '',
    layer: '',
    main: {
        width: '311px',
        [BREAKPOINTS.DESKTOP_SMALL]: {
            width: '560px',
            maxWidth: '100%',
        },
    },
    scrollableContent: '',
};
