import { mergeStyleSets } from '@fluentui/react';

interface IAvatarClassNames {
    avatarClass: string;
}

export const getClassNames = (): IAvatarClassNames => {
    return mergeStyleSets({
        avatarClass: {
            height: 40,
            width: 40,
            resizeMode: 'contain',
            marginRight: 14,
        },
    });
};
