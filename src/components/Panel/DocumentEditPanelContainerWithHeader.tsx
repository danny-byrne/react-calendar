import React from 'react';
import { Stack } from '@fluentui/react';

import SubHeaderLayout from 'src/common/components/Layout/SubHeaderLayout';
import { getClassNames } from './PanelContainerWithHeader.classNames';

interface IDocumentEditPanelContainerWithHeaderProps {
    title: string;
    actionButtonText?: string;
    onClickActionButton?: () => void;
    onClose: () => void;
    onDelete?: () => void;
    children?: React.ReactNode;
    actionButtonDisabled: boolean;
}

export const DocumentEditPanelContainerWithHeader: React.FC<IDocumentEditPanelContainerWithHeaderProps> = ({
    title,
    actionButtonDisabled,
    onClose,
    actionButtonText,
    onClickActionButton,
    children,
}) => {
    const classNames = getClassNames();

    return (
        <Stack className={classNames['wc-PanelContainerWithHeader--subHeaderContainer']}>
            <SubHeaderLayout
                title={title}
                actionButtonText={actionButtonText}
                onClickActionButton={onClickActionButton}
                onClose={onClose}
                actionButtonDisabled={actionButtonDisabled}
                isPanel
            >
                {children}
            </SubHeaderLayout>
        </Stack>
    );
};
