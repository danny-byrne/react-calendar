import PropTypes from 'prop-types';
import React from 'react';
import { Text, Stack, Icon } from '@fluentui/react';
import { getClassNames } from './FloatingActionButton.classNames';
interface FloatingActionButtonProps {
    onClick: () => void;
}

const EmailFAB: React.FC<FloatingActionButtonProps> = (props) => {
    const classNames = getClassNames(false);

    return (
        <Stack
            horizontal
            className={classNames['wc-FloatingActionButton--emailContainer']}
            tokens={{ childrenGap: '16px' }}
        >
            <Text className={classNames['wc-FloatingActionButton--fabHeaderText']}>Email</Text>
            <div
                data-testid={'EmailFAB'}
                onClick={props.onClick}
                className={classNames['wc-FloatingActionButton--fabWithText']}
            >
                <Icon iconName={'Mail'} className={classNames['wc-FloatingActionButton--icon']} />
            </div>
        </Stack>
    );
};

EmailFAB.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default EmailFAB;
