import { useQueryStringParams } from './useQueryStringParams';
import { usePanelWidth } from './usePanelWidth';

export const usePrintPanelControls = () => {
    const { addSearchParam, getSearchParam, removeSearchParam } = useQueryStringParams();
    const customWidth = usePanelWidth();

    const showPrint = getSearchParam('mode') === 'print';
    const showPrintPanel = () => addSearchParam({ mode: 'print' });
    const hidePrintPanel = () => removeSearchParam('mode');

    return {
        hidePrintPanel,
        showPrint,
        showPrintPanel,
        customWidth,
    };
};
