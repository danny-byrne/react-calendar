import { mergeStyleSets } from '@fluentui/react';
import { modalLayer } from 'src/features/Medications/zIndex';

interface IPanelContainerWithHeaderClassNames {
    'wc-PanelContainerWithHeader--subHeaderContainer': string;
}

export const getClassNames = (): IPanelContainerWithHeaderClassNames => {
    return mergeStyleSets({
        'wc-PanelContainerWithHeader--subHeaderContainer': {
            overflowX: 'clip',
            zIndex: modalLayer,
        },
    });
};
