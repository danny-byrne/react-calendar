import React from 'react';
import { getClassNames } from './FloatingActionButton.classNames';
import { Text, Stack, IconButton } from '@fluentui/react';

interface FloatingActionButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const CopyLinkFAB: React.FC<FloatingActionButtonProps> = ({ onClick, disabled }) => {
    const classNames = getClassNames(disabled);

    return (
        <Stack
            horizontal
            className={classNames['wc-FloatingActionButton--copyLinkContainer']}
            tokens={{ childrenGap: '16px' }}
        >
            <Text className={classNames['wc-FloatingActionButton--fabHeaderText']}>Copy Link</Text>
            <IconButton
                iconProps={{ iconName: 'Document' }}
                data-testid={'CopyLinkFab'}
                onClick={disabled ? null : onClick}
                className={classNames['wc-FloatingActionButton--fabWithText']}
            />
        </Stack>
    );
};

export default CopyLinkFAB;
