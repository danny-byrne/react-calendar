import { mergeStyleSets } from '@fluentui/react';

interface IMicrosoftLogoClassNames {
    'wc-MicrosoftLogo--logoContainer': string;
}

export const getClassNames = (): IMicrosoftLogoClassNames => {
    return mergeStyleSets({
        'wc-MicrosoftLogo--logoContainer': {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            height: 21,
            width: 21,
        },
        'wc-MicrosoftLogo--square': {
            height: 9.5,
            width: 9.5,
            margin: 0.5,
        },
    });
};
