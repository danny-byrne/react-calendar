import { usePanelWidth } from './usePanelWidth';
import { useQueryStringParams } from './useQueryStringParams';

export const useAddPanelControls = () => {
    const { addSearchParam, getSearchParam, removeSearchParam } = useQueryStringParams();

    const showAdd = getSearchParam('mode') === 'add';
    const showAddPanel = () => addSearchParam({ mode: 'add' });
    const showAddPanelWithCustomParameter = (parameter: string) =>
        addSearchParam({ mode: 'add', parameter: parameter });
    const showAddPanelWithDrugInfo = (id: string, drugName: string) => {
        addSearchParam({ mode: 'add', id: id, drugName: drugName });
    };

    const hideAddPanel = () => {
        removeSearchParam('mode');
        removeSearchParam('id');
        removeSearchParam('drugName');
        removeSearchParam('parameter');
    };
    const status = getSearchParam('status');
    const customWidth = usePanelWidth();

    return {
        showAdd,
        showAddPanel,
        showAddPanelWithDrugInfo,
        showAddPanelWithCustomParameter,
        hideAddPanel,
        status,
        customWidth,
    };
};
