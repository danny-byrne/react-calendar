import React from 'react';
import { useAddPanelControls } from 'src/common/hooks/useAddPanel';

import { Panel, PanelType } from '@fluentui/react';
import { PanelStyleOverrides } from './PanelStyleOverrides';

interface IAddPanelProps {
    children: React.ReactNode;
}

export const AddPanel: React.FC<IAddPanelProps> = ({ children }) => {
    const { showAdd, hideAddPanel, customWidth } = useAddPanelControls();

    return (
        <Panel
            isOpen={showAdd}
            isLightDismiss
            hasCloseButton={false}
            onDismiss={hideAddPanel}
            data-testid="addPanel"
            onRenderNavigation={() => null}
            onRenderHeader={() => null}
            styles={PanelStyleOverrides}
            type={PanelType.custom}
            customWidth={customWidth}
            allowTouchBodyScroll
        >
            {children}
        </Panel>
    );
};
