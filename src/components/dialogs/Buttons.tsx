import React from 'react';
import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import { getClassNames } from './Buttons.classNames';

interface ButtonProps {
    disabled?: boolean;
    onBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
    saveText?: string;
}

const Buttons = (props: ButtonProps) => {
    const classNames = getClassNames();
    const { disabled, onBack, saveText } = props;
    return (
        <Stack horizontal tokens={{ childrenGap: 7 }} className={classNames['wc-DialogButtons--buttonsContainer']}>
            <DefaultButton className={classNames['wc-DialogButtons--cancelButton']} onClick={onBack} text="Cancel" />
            <PrimaryButton className={classNames['wc-DialogButtons--buttonSize']} type="submit" disabled={disabled}>
                {saveText ?? 'Save'}
            </PrimaryButton>
        </Stack>
    );
};

export default Buttons;
