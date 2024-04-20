import { mergeStyleSets, FontSizes } from '@fluentui/react';

interface ToggleRowClassNames {
    'wc-ToggleRow--toggleText': string;
    'wc-ToggleRow--toggleRow': string;
    'wc-ToggleRow--toggleDisplay': string;
    'wc-ToggleRow--boldToggleText': string;
}

export const getClassNames = (): ToggleRowClassNames => {
    return mergeStyleSets({
        'wc-ToggleRow--toggleRow': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        'wc-ToggleRow--toggleText': {
            font: 'Segoe UI',
            fontSize: FontSizes.size16,
            lineHeight: '28px',
        },
        'wc-ToggleRow--boldToggleText': {
            font: 'Segoe UI',
            fontWeight: '600',
            fontSize: FontSizes.size16,
            lineHeight: '28px',
        },
        'wc-ToggleRow--toggleDisplay': {
            marginBottom: '0px',
        },
    });
};
