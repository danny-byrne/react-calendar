import { IDocumentCardStyles } from '@fluentui/react';
import { colors } from 'src/common/styles/colors';

export const documentCardStyles: IDocumentCardStyles = {
    root: {
        borderRadius: '12px',
        borderColor: colors.fabric.neutrals.white,
        boxShadow: '0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)',
        width: '100%',
        maxWidth: '100%',
    },
};
