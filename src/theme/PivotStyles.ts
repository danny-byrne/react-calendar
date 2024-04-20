import { IPivotStyles } from '@fluentui/react';
import { palette } from './Palette';
import { PIVOT_BUTTON_WIDTH } from 'src/app/Styles';

export const pivotStyles: IPivotStyles = {
    link: {
        height: '30px',
        borderRadius: '100px',
        width: `${PIVOT_BUTTON_WIDTH}px`,
    },
    root: {
        backgroundColor: '#F2F1FD',
        borderRadius: '100px',
        height: '30px',
        lineHeight: '30px',
    },
    linkIsSelected: [
        {
            borderRadius: '100px',
            backgroundColor: palette.themePrimary,
            height: '30px',
            lineHeight: '30px',
        },
    ],
    linkContent: {
        fontSize: '14px',
        width: '90px',
        height: '30px',
        lineHeight: '30px',
    },
    text: '',
    count: '',
    icon: '',
    linkInMenu: '',
    overflowMenuButton: '',
};
