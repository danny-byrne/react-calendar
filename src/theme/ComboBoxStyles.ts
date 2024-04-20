import { IComboBoxStyles } from '@fluentui/react';
import { colors } from 'src/common/styles/colors';

export const comboBoxStyles: IComboBoxStyles = {
    root: {
        CaretDownButton: {
            backgroundColor: 'red',
        },
        height: '50px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingLeft: '16px',
        color: colors.fabric.neutrals.WCprimary,
        width: '100%',
        cursor: 'pointer',
        '&.ms-ComboBox-option': {
            paddingTop: '30px',
        },
        '& .ms-ComboBox-CaretDown-button': {
            right: '8px',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: 'transparent',
            },
        },
        '&:after': {
            borderColor: colors.fabric.neutrals.gray60,
        },
        '&:hover::after': {
            borderColor: `${colors.fabric.neutrals.WCprimary} !important`,
        },
    },
    label: '',
    container: '',
    divider: '',
    errorMessage: '',
    header: '',
    input: {
        cursor: 'pointer',
    },
    inputDisabled: '',
    labelDisabled: '',
    optionsContainer: {
        marginLeft: '8px',
    },
    optionsContainerWrapper: {
        width: '100%',
    },
    rootDisabled: {
        borderRadius: '12px',
    },
    rootDisallowFreeForm: '',
    rootError: '',
    rootFocused: '',
    rootHovered: '',
    rootPressed: {
        '& .ms-ComboBox-CaretDown-button': {
            backgroundColor: 'transparent',
            cursor: 'pointer',
        },
    },
    screenReaderText: '',
    callout: {
        maxHeight: '400px !important',
    },
};
