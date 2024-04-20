import React from 'react';
import { Stack, DefaultButton, IStackTokens, IStyle, mergeStyleSets, Icon } from '@fluentui/react';
import { getClassNames } from './OptionalContainer.classNames';

interface OptionalContainerProps {
    onDismiss: () => void;
    styles?: IStyle;
}

const OptionalContainer: React.FC<OptionalContainerProps> = (props) => {
    const horizontalGapStackTokens: IStackTokens = {
        childrenGap: 10,
        padding: 10,
    };

    const classNames = mergeStyleSets(props.styles, getClassNames());

    return (
        <Stack horizontal tokens={horizontalGapStackTokens} className={classNames['wc-OptionalContainer--container']}>
            <DefaultButton
                className={classNames['wc-OptionalContainer--dismissButton']}
                data-testid={'removeStopButton'}
                onClick={props.onDismiss}
            >
                <Icon iconName="Blocked2" />
            </DefaultButton>
            <>{props.children}</>
        </Stack>
    );
};

export default OptionalContainer;
