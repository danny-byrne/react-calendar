import React, { useCallback } from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react';

interface ToggleProps {
    name: string;
    value: boolean;
    onChange: (boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ value, onChange, name }) => {
    const onClick = useCallback((): void => {
        onChange(!value);
    }, [onChange, value]);

    if (value) {
        return <PrimaryButton text={name} onClick={onClick} />;
    } else {
        return <DefaultButton text={name} onClick={onClick} />;
    }
};

export default Toggle;
