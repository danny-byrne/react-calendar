import React from 'react';
import { Stack, Text, Toggle } from '@fluentui/react';

import { getClassNames } from './ToggleRow.classNames';

interface ToggleRowProps {
    text: string;
    testId: string;
    checked: boolean;
    onChange: (e, checked) => void;
    onOffText?: boolean;
    disabled?: boolean;
    bold?: boolean;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
    text,
    testId,
    checked,
    onChange,
    onOffText = false,
    disabled = false,
    bold = false,
}) => {
    const classNames = getClassNames();
    return (
        <Stack horizontal className={classNames['wc-ToggleRow--toggleRow']}>
            <Text
                className={bold ? classNames['wc-ToggleRow--boldToggleText'] : classNames['wc-ToggleRow--toggleText']}
            >
                {text}
            </Text>
            <Toggle
                className={classNames['wc-ToggleRow--toggleDisplay']}
                data-testid={testId}
                onText={onOffText ? 'On' : 'Yes'}
                offText={onOffText ? 'Off' : 'No'}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
        </Stack>
    );
};

export default ToggleRow;
