import React, { useEffect, useState } from 'react';
import { useQueryStringParams } from 'src/common/hooks/useQueryStringParams';
import { useIsMobile } from 'src/common/hooks/useMediaQueries';
import {
    useGetPrescriptionsWithScheduleQuery,
    useMedicationSearchLazyQuery,
} from 'src/graphQL/serverMocks/graphQLGeneratedCode';

import { Stack, PivotItem, Spinner, Text } from '@fluentui/react';
import { FloatingActionButton } from 'src/common/components';
import MedicationAdd from 'src/features/Medications/MedicationAdd';
import { getClassNames } from './MedManagerLayout.classNames';
import SubHeaderWithFilterLayout from 'src/common/components/Layout/SubHeaderWithFilterLayout';
import { ISuggestionItem } from 'src/common/components/AutoCompleteSearch';
import { useFilterState, FilterKeys, NoFilterKey } from 'src/common/hooks/useFilterState';
import { MedicationAllList, MedicationRefillsList, MedicationTodayList } from '../Medications';
import { useFeedbackService } from 'src/services/FeedbackService';
import SubHeaderLayout from 'src/common/components/Layout/SubHeaderLayout';
import MedicationSearchQuery from '../Medications/MedicationSearch';
import { MEDICATIONS_POLLING_INTERVAL } from 'src/app/Constants';
import MedicationsPrintPanel from './MedicationsPrintPanel';
import { getClassNames as getFABClassNames } from 'src/common/components/FAB/FloatingActionButton.classNames';

import { ERROR_MESSAGES } from 'src/app/Strings';
import { AddPanel } from 'src/common/components/Panel/AddPanel';
import { PrintPanel } from 'src/common/components/Panel/PrintPanel';
import { useAddPanelControls } from 'src/common/hooks/useAddPanel';
import { usePrintPanelControls } from 'src/common/hooks/usePrintPanel';
import { usePageVisibility } from 'src/common/hooks/usePageVisibility';
import { useNavigate } from 'react-router';
import RouterConfig from 'src/app/RouterConfig';

const MedManagerLayout: React.FC = () => {
    const { getSearchParam, removeSearchParam } = useQueryStringParams();
    const isMobile = useIsMobile();
    const { filter, setFilter } = useFilterState(FilterKeys.MedicationList);
    const { setErrorToast, setSuccessToast } = useFeedbackService();
    const isVisible = usePageVisibility();
    const navigate = useNavigate();
    const fabClassNames = getFABClassNames(false);

    const { error, data, loading, startPolling, stopPolling } = useGetPrescriptionsWithScheduleQuery({
        fetchPolicy: 'cache-and-network',
        onError: () => {
            setErrorToast(error.message);
        },
    });

    const { showAddPanel, showAddPanelWithDrugInfo, hideAddPanel, status } = useAddPanelControls();
    const { hidePrintPanel } = usePrintPanelControls();

    const onLinkClick = (item?: PivotItem): void => {
        setFilter(item.props.itemKey);
    };

    const classNames = getClassNames();

    // While this medication list view is mounted (visible),
    // poll for medication data every 10s. Stop polling
    // when this component unmounts.
    useEffect(() => {
        if (isVisible) startPolling(MEDICATIONS_POLLING_INTERVAL);
        return () => stopPolling();
    }, [isVisible]);

    //Strip `mode` from deep-links. This restriction keeps the Back navigation stack healthy.
    //`linkFromToast` used to override deep-link strip if the link is coming from the app itself
    useEffect(() => {
        if (getSearchParam(`mode`) && !getSearchParam('linkFromToast')) {
            removeSearchParam('mode');
        }
    }, []);

    useEffect(() => {
        if (status === 'added' || status === 'edited' || status === 'deleted' || status === 'moved') {
            removeSearchParam('status');
            if (status === 'added') {
                setSuccessToast(`Add another?`, 'Medication added', `Let's go`, () =>
                    navigate(RouterConfig.Medications + '?mode=add&linkFromToast=true', { replace: true }),
                );
            } else if (status === 'moved') {
                setSuccessToast(`Medication moved to No Longer Taking`);
            } else {
                setSuccessToast(`Medication ${status}`);
            }
        }
    });

    // Setting function to undefined hides add button if user is on mobile
    const onClickActionButton = isMobile ? undefined : showAddPanel;

    const MedManagerContent = () => {
        const userHasNoMeds = data?.careRecipientMedicationPrescriptions?.prescriptions.length === 0;
        // Workaround for situation where prescriptions are showing up as empty because user is on a past date
        const userOnTodayPage = filter === 'today';
        return userHasNoMeds && !userOnTodayPage ? <MedManagerFirstTimeExperience /> : <MedManagerFilteredLists />;
    };

    const MedManagerFirstTimeExperience = () => {
        const [MedicationSearch, { loading: searchLoading }] = useMedicationSearchLazyQuery({
            errorPolicy: 'all',
            onError: () => {
                setErrorToast(ERROR_MESSAGES.SEARCH_MEDICATION);
            },
        });

        const [dataResult, setDataResult] = useState<any>();

        const onDebounceComplete = async (searchTermDebounce: string) => {
            if (searchTermDebounce.length > 0) {
                try {
                    const result = await MedicationSearch({ variables: { searchText: searchTermDebounce } });
                    setDataResult(result?.data.medicationSearch.result?.items);
                } catch (error) {
                    setDataResult(null);
                }
            }
            if (searchTermDebounce.length === 0) {
                setDataResult(null);
            }
        };

        const onSuggestionClicked = async (suggestion: ISuggestionItem) => {
            const clickId = suggestion.getSearchId().toString();
            const drugName = suggestion.drugNameDesc;
            showAddPanelWithDrugInfo(clickId, drugName);
        };

        return (
            <SubHeaderLayout title={'Medications'} actionButtonText={'Add'} onClickActionButton={onClickActionButton}>
                <Stack className={classNames['wc-MedManagerLayout--firstTimeContainer']}>
                    <Text className={classNames['wc-MedManagerLayout--firstTimeTitle']}>
                        {`Add Your Loved One's Medications`}
                    </Text>
                    <Text className={classNames['wc-MedManagerLayout--firstTimeSubTitle']}>
                        Keep track of medication details in one place
                    </Text>
                    <div className={classNames['wc-MedManagerLayout--firstTimeSearchBox']}>
                        <MedicationSearchQuery
                            data={dataResult}
                            updateSearchTerm={onDebounceComplete}
                            onSuggestionClicked={onSuggestionClicked}
                            searchLoading={searchLoading}
                            aria-label={'Search for medication'}
                        />
                    </div>
                </Stack>
            </SubHeaderLayout>
        );
    };

    const MedManagerFilteredLists = () => {
        return (
            <SubHeaderWithFilterLayout
                title={'Medications'}
                actionButtonText={'Add'}
                onClickActionButton={onClickActionButton}
                filter={filter}
                onLinkClick={onLinkClick}
                filterButtons={[
                    { headerText: 'Today', itemKey: 'today' },
                    { headerText: 'Refills', itemKey: 'refills' },
                    { headerText: 'All', itemKey: NoFilterKey },
                ]}
                pivotAriaLabel={'Medication All or Refills Pivot'}
                pivotTestId={'medicationPivot'}
            >
                <Stack className={classNames['wc-MedManagerLayout--medListContainer']}>
                    {/* MedicationTodayList pulls in filtered prescription data from it's own query */}
                    {filter === 'today' && <MedicationTodayList />}
                    {filter === NoFilterKey && <MedicationAllList prescriptionData={data} />}
                    {filter === 'refills' && <MedicationRefillsList prescriptionData={data} />}
                </Stack>
            </SubHeaderWithFilterLayout>
        );
    };

    const loadingContainer = (
        <SubHeaderLayout title={'Medications'} actionButtonText={'Add'} onClickActionButton={onClickActionButton}>
            <Spinner />
        </SubHeaderLayout>
    );

    return (
        <Stack className={classNames['wc-MedManagerLayout--fullPageContainer']}>
            {loading ? loadingContainer : <MedManagerContent />}
            {isMobile && (
                <Stack className={fabClassNames['wc-FloatingActionButton--fabContainer']}>
                    <FloatingActionButton onClick={showAddPanel} />
                </Stack>
            )}
            <AddPanel>
                <MedicationAdd onDismiss={hideAddPanel} />
            </AddPanel>
            <PrintPanel>
                <MedicationsPrintPanel
                    onDismiss={hidePrintPanel}
                    meds={data?.careRecipientMedicationPrescriptions?.prescriptions}
                />
            </PrintPanel>
        </Stack>
    );
};

export default MedManagerLayout;
