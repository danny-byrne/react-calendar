import { ITextFieldStyles, ITextFieldStyleProps } from '@fluentui/react';
import { colors } from 'src/common/styles/colors';
import { palette } from './Palette';

export const textFieldStyles = (props: ITextFieldStyleProps): ITextFieldStyles => ({
    fieldGroup: {
        borderRadius: '12px',
        borderColor: colors.fabric.neutrals.gray40,
        height: '50px',
        ':hover': {
            borderColor: colors.fabric.neutrals.WCprimary,
        },
    },
    prefix: '',
    suffix: '',
    field: {
        color: props.disabled ? colors.fabric.neutrals.gray130 : palette.themePrimary,
        borderRadius: '12px',
        paddingLeft: '16px',
        paddingRight: '8px',
        fontSize: '16px',
        fontWeight: '400',
        '.ms-TextField-fieldGroup:hover &': {
            color: colors.fabric.neutrals.gray130,
        },
        '.ms-TextField-fieldGroup:focus &': {
            color: colors.fabric.neutrals.WCprimary,
        },
    },
    icon: '',
    description: '',
    wrapper: {
        borderRadius: '50px',
    },
    errorMessage: '',
    subComponentStyles: undefined,
    revealButton: {
        borderRadius: '50px',
    },
    revealSpan: '',
    revealIcon: '',
    root: {
        borderRadius: '50px',
    },
});
