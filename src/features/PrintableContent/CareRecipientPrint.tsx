import React from 'react';
import { Stack } from '@fluentui/react';

import { getClassNames } from './CareRecipientPrint.classNames';
import PrintablePageHeader from 'src/features/PrintableContent/PrintablePageHeader';
import PrintablePageFooter from 'src/features/PrintableContent/PrintablePageFooter';
import { IRecipientDataType, IHealthHistoryDataType } from 'src/common/hooks/useGetDataForPrintPages';
import { PRINT_ELEMENT_GAP, rowHeights, elementLabels } from './constants';

import { createPages } from './helpers';
interface IMedicationsPrintProps {
    recipientData: IRecipientDataType;
    healthHistoryData: IHealthHistoryDataType;
    filterValues: {
        printRangeStart: Date;
        printRangeEnd: Date;
        includeBasicInformation: boolean;
        includeAllergies: boolean;
        includeVaccinations: boolean;
        includeHealthHistory: boolean;
        includeEmergencyContacts: boolean;
        includePharmacies: boolean;
        includeProviders: boolean;
    };
}

interface IMedicationsPageProps {
    pageNumber: number;
    blocks: any;
}

const BASIC_INFO_TITLE_COLUMNS = ['Blood Type', 'Phone', 'Email', 'Address'];
const ALLERGY_TITLE_COLUMNS = ['Allergy', 'Reaction Level', 'Notes'];
const IMMUNIZATION_TITLE_COLUMNS = ['Vaccine', 'Date Received'];
const CONDITION_TITLE_COLUMNS = ['Name', 'Date'];
const PROVIDER_TITLE_COLUMNS = ['Name', 'Contact', 'Specialty', 'Address'];
const PHARMACY_TITLE_COLUMNS = ['Name', 'Phone Number', 'Address'];

const classNames = getClassNames();

const createTitleColumns = (titles) => {
    return (
        <Stack horizontal className={classNames['wc-CareRecipientPrint--columnNamesContainer']}>
            {titles.map((title) => {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={title} className={classNames['wc-CareRecipientPrint--MedicationsGridLabel']}>
                        {title}
                    </div>
                );
            })}
        </Stack>
    );
};

const createBlock = ({ rows, label, titleColumns, rowHeight }) => {
    const titleColumnsRow = createTitleColumns(titleColumns);
    return (
        <>
            <div className={classNames['wc-CareRecipientPrint--LabelContainer']}>{label}</div>
            <Stack className={classNames['wc-CareRecipientPrint--Grid']}>
                {titleColumnsRow}

                {rows.map((row) => {
                    const values = Object.values(row);

                    return (
                        <Stack
                            key={Math.random()}
                            className={
                                classNames[
                                    `wc-CareRecipientPrint--InfoContainer${
                                        rowHeight === rowHeights.large ? '--large' : ''
                                    }`
                                ]
                            }
                            verticalAlign="space-evenly"
                        >
                            <Stack horizontal>
                                {values.map((content) => {
                                    return (
                                        <Stack
                                            key={Math.random()}
                                            className={classNames['wc-CareRecipientPrint--GridContent']}
                                            verticalAlign="center"
                                        >
                                            {content}
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    );
                })}
            </Stack>
        </>
    );
};

const CareRecipientPrint = (props: IMedicationsPrintProps) => {
    const { recipientData, filterValues, healthHistoryData } = props;

    const {
        careRecipientPrintInfo,
        careRecipientAllergies,
        careRecipientImmunizations,
        careRecipientConditions,
        careRecipientProviders,
        careRecipientPharmacies,
    } = healthHistoryData;
    const {
        includeBasicInformation,
        includeAllergies,
        includeVaccinations,
        includeHealthHistory,
        includePharmacies,
        includeProviders,
    } = filterValues;

    const elements = [
        //determine which data to print based on what's been checked
        {
            rows: includeBasicInformation ? careRecipientPrintInfo : [],
            rowHeight: rowHeights.large,
            label: elementLabels.basicInformation,
            titleColumns: BASIC_INFO_TITLE_COLUMNS,
        },
        {
            rows: includeAllergies ? careRecipientAllergies : [],
            rowHeight: rowHeights.small,
            label: elementLabels.allergies,
            titleColumns: ALLERGY_TITLE_COLUMNS,
        },
        {
            rows: includeVaccinations ? careRecipientImmunizations : [],
            rowHeight: rowHeights.small,
            label: elementLabels.vaccinations,
            titleColumns: IMMUNIZATION_TITLE_COLUMNS,
        },
        {
            rows: includeHealthHistory ? careRecipientConditions : [],
            rowHeight: rowHeights.large,
            label: elementLabels.conditions,
            titleColumns: CONDITION_TITLE_COLUMNS,
        },
        {
            rows: includeProviders ? careRecipientProviders : [],
            rowHeight: rowHeights.large,
            label: elementLabels.providers,
            titleColumns: PROVIDER_TITLE_COLUMNS,
        },
        {
            rows: includePharmacies ? careRecipientPharmacies : [],
            rowHeight: rowHeights.large,
            label: elementLabels.pharmacies,
            titleColumns: PHARMACY_TITLE_COLUMNS,
        },
    ].filter((element) => {
        return element.rows.length > 0;
    });

    const pages = createPages(elements);

    const CareRecipientPage: React.FC<IMedicationsPageProps> = ({ pageNumber, blocks }) => {
        const pageBlocks = blocks.map((block) => createBlock(block));
        return (
            <>
                {pageNumber > 1 && <div className={classNames['wc-CareRecipientPrint--headerBuffer']} />}

                <Stack className={classNames['wc-CareRecipientPrint--PageContainer']} verticalAlign="space-between">
                    <div>
                        <PrintablePageHeader recipientData={recipientData} />
                        <Stack tokens={{ childrenGap: PRINT_ELEMENT_GAP }}>{pageBlocks}</Stack>
                    </div>
                    <PrintablePageFooter
                        includePageBreak={pageNumber !== pages.length}
                        pageNumber={pageNumber}
                        recipientData={recipientData}
                    />
                </Stack>
            </>
        );
    };

    return (
        <div className={classNames['wc-CareRecipientPrint--innerContent']}>
            {pages.map((blocks, i) => {
                return <CareRecipientPage pageNumber={i + 1} blocks={blocks} key={Math.random()} />;
            })}
        </div>
    );
};

export default CareRecipientPrint;
