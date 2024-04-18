import React from 'react';
import { IconButton } from '@fluentui/react';
import { getClassNames } from './FloatingActionButton.classNames';
interface FloatingActionButtonProps {
    onClick: () => void;
    fabOpen?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, fabOpen = false }) => {
    const disabled = false;
    const classNames = getClassNames(disabled);

    return (
        <IconButton
            data-testid={'FAB'}
            className={classNames['wc-FloatingActionButton--fab']}
            onClick={onClick}
            iconProps={{ iconName: !fabOpen ? 'Add' : 'Cancel' }}
            ariaLabel={'action button'}
        />
    );
};

export default FloatingActionButton;
