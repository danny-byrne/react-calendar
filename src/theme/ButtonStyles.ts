import { IButtonStyles } from '@fluentui/react';
import { colors } from 'src/common/styles/colors';
import { palette } from './Palette';

export const defaultButtonStyles: IButtonStyles = {
    root: {
        borderRadius: '100px',
        borderColor: palette.themePrimary,
        color: palette.themePrimary,
        '&:focus:after': {
            borderRadius: '100px',
        },
    },
    rootHovered: {
        borderColor: colors.fabric.neutrals.WCshade10,
        color: colors.fabric.neutrals.WCshade10,
    },
    rootPressed: {
        borderColor: colors.fabric.neutrals.WCshade20,
        color: colors.fabric.neutrals.WCshade20,
    },
};

export const primaryButtonStyles: IButtonStyles = {
    root: {
        borderRadius: '100px',
        color: colors.fabric.neutrals.white,
        '&:focus:after': {
            borderRadius: '100px',
        },
    },
    rootHovered: {
        color: colors.fabric.neutrals.white,
    },
    rootPressed: {
        color: colors.fabric.neutrals.white,
    },
};
