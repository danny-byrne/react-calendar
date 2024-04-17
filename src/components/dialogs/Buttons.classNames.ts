import { mergeStyleSets } from '@fluentui/react';
import { colors } from 'src/common/styles/colors';

interface IActionsClassNames {
    'wc-DialogButtons--buttonsContainer': string;
    'wc-DialogButtons--buttonSize': string;
    'wc-DialogButtons--cancelButton': string;
    'wc-DialogButtons--defaultButton': string;
}

const BUTTON_WIDTH = '18%';

export const getClassNames = (): IActionsClassNames => {
    return mergeStyleSets({
        'wc-DialogButtons--buttonsContainer': {
            paddingTop: '1rem',
            justifyContent: 'flex-end',
        },
        'wc-DialogButtons--buttonSize': {
            width: BUTTON_WIDTH,
        },
        'wc-DialogButtons--cancelButton': {
            width: BUTTON_WIDTH,
            ':hover': {
                backgroundColor: colors.fabric.neutrals.gray20,
            },
        },
        'wc-DialogButtons--defaultButton': {
            ':hover': {
                backgroundColor: colors.fabric.neutrals.gray20,
            },
        },
    });
};
