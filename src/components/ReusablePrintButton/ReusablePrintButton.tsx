import React from 'react';
import { IconButton, Stack } from '@fluentui/react';
import { getClassNames } from './ReusablePrintButton.classNames';

interface IReusablePrintButton {
    onClick: () => void;
    isRow?: boolean;
}

const ReusablePrintButton: React.FC<IReusablePrintButton> = ({ onClick, isRow = false }) => {
    const classNames = getClassNames(isRow);

    const button = (
        <IconButton
            data-testid={'Print'}
            className={classNames['wc-ReusablePrintButton--button']}
            iconProps={{ iconName: 'PrintIcon' }}
            onClick={onClick}
        />
    );
    return isRow ? (
        <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center" horizontalAlign="end">
            {button}
        </Stack>
    ) : (
        button
    );
};

export default ReusablePrintButton;
