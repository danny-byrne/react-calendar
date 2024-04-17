import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';

import SubHeaderLayout from 'src/common/components/Layout/SubHeaderLayout';
import { getClassNames } from './PanelContainerWithHeader.classNames';

interface IPanelContainerWithHeaderProps {
    title: string;
    // formik set to any because all that's needed is logic for disabling save.
    // Children relying on formik types will be defined outside of this component.
    formik: any;
    actionButtonText?: string;
    onClickActionButton?: () => void;
    onClose: () => void;
    onDelete?: () => void;
    children?: React.ReactNode;
    loading?: boolean;
    onlyDisableOnLoading?: boolean;
    showActionButton?: boolean;
}

export const PanelContainerWithHeader: React.FC<IPanelContainerWithHeaderProps> = ({
    title,
    formik,
    onClose,
    actionButtonText,
    onClickActionButton,
    children,
    loading,
    onlyDisableOnLoading = false,
    showActionButton = true,
}) => {
    const classNames = getClassNames();

    const [saveDisabled, setSaveDisabled] = useState(true);

    useEffect(() => {
        //save is disabled unless formik is both valid and dirty
        const formikIsNotReady = loading || !(formik.isValid && formik.dirty);
        setSaveDisabled(onlyDisableOnLoading ? loading : formikIsNotReady);
    }, [formik, loading]);

    return (
        <Stack className={classNames['wc-PanelContainerWithHeader--subHeaderContainer']}>
            <SubHeaderLayout
                title={title}
                actionButtonText={actionButtonText}
                onClickActionButton={onClickActionButton}
                onClose={onClose}
                actionButtonDisabled={saveDisabled}
                isPanel
                showActionButton={showActionButton}
            >
                {children}
            </SubHeaderLayout>
        </Stack>
    );
};
