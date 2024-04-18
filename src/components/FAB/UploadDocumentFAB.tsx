import React from 'react';
import { getClassNames } from './FloatingActionButton.classNames';
import { Stack, IconButton } from '@fluentui/react';

interface FloatingActionButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const UploadDocumentFAB: React.FC<FloatingActionButtonProps> = ({ onClick, disabled }) => {
    const classNames = getClassNames(disabled);

    return (
        <Stack horizontal className={classNames['wc-FloatingActionButton--fabContainer']}>
            <IconButton
                iconProps={{ iconName: 'Add' }}
                data-testid={'UploadDocumentFab'}
                onClick={disabled ? null : onClick}
                className={classNames['wc-FloatingActionButton--fab']}
            />
        </Stack>
    );
};

export default UploadDocumentFAB;
