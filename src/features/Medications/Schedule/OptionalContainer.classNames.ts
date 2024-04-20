import { mergeStyleSets } from '@fluentui/react';

interface IOptionalContainerClassNames {
    'wc-OptionalContainer--dismissButton': string;
    'wc-OptionalContainer--container': string;
}

export const getClassNames = (): IOptionalContainerClassNames => {
    return mergeStyleSets({
        'wc-OptionalContainer--container': {
            alignItems: 'flex-start',
            padding: '10px 0',
            width: '100%',
        },
        'wc-OptionalContainer--dismissButton': {
            minWidth: '0px',
            padding: '6px',
            border: 'none',
        },
    });
};
