import React from 'react';
import { usePrintPanelControls } from 'src/common/hooks/usePrintPanel';

import { Panel, PanelType } from '@fluentui/react';
import { PanelStyleOverrides } from './PanelStyleOverrides';

interface IPrintPanelProps {
    children: React.ReactNode;
}

export const PrintPanel: React.FC<IPrintPanelProps> = ({ children }) => {
    const { hidePrintPanel, showPrint, customWidth } = usePrintPanelControls();

    return (
        <Panel
            isOpen={showPrint}
            isLightDismiss
            hasCloseButton={false}
            onDismiss={hidePrintPanel}
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
