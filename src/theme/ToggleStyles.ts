import { IToggleStyles } from '@fluentui/react';
import { colors } from 'src/common/styles/colors';

export const ToggleStyles: IToggleStyles = {
    label: {},
    root: {},
    container: {
        flexDirection: 'row-reverse',
    },
    pill: {
        border: `1px solid ${colors.fabric.neutrals.WCprimary}`,
        ':hover': {
            border: `1px solid ${colors.fabric.neutrals.WCprimary}`,
        },
    },
    thumb: {
        backgroundColor: `${colors.fabric.neutrals.WCprimary} !important`,
        '.is-checked .ms-Toggle-innerContainer .ms-Toggle-background &': {
            backgroundColor: 'white !important',
        },
    },
    text: { color: colors.fabric.neutrals.WCprimary },
};
