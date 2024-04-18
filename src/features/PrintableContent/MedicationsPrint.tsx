/*eslint-disable*/
import React from 'react';
import { Stack, Icon } from '@fluentui/react';

import { getClassNames, ACTIVITY_TOKEN_GAP } from './MedicationsPrint.classNames';
import PrintablePageHeader from 'src/features/PrintableContent/PrintablePageHeader';
import PrintablePageFooter from 'src/features/PrintableContent/PrintablePageFooter';
import { MEDICATION_PRINT_PAGE_LABELS } from '../MedManagerLayout/helpers';
import { IRecipientDataType } from 'src/common/hooks/useGetDataForPrintPages';

const stackTokens = { childrenGap: 5 };

const ITEMS_PER_PAGE = 5;

interface IMedicationsPrintProps {
    medications?: any;
    recipientData: IRecipientDataType;
    titleColumns: string[];
    pageLabel: string;
}

interface IMedicationsPageProps {
    medications: any;
    pageNumber: number;
}

const MedicationsPrint = ({ recipientData, medications, titleColumns, pageLabel }: IMedicationsPrintProps) => {
    let chunkedMedications = [];
    for (let i = 0; i < medications.length; i += ITEMS_PER_PAGE) {
        let currentChunk = medications.slice(i, i + ITEMS_PER_PAGE);
        chunkedMedications.push(currentChunk);
    }
    const numberOfColumns = titleColumns.length;
    const classNames = getClassNames(numberOfColumns);

    const medicationTitleColumns = (
        <Stack horizontal className={classNames['wc-MedicationsPrint--columnNamesContainer']}>
            {titleColumns.map((title, i) => {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={`title-${i}`} className={classNames['wc-MedicationsPrint--MedicationsGridLabel']}>
                        {title}
                    </div>
                );
            })}
        </Stack>
    );

    const HeaderContent = () => (
        <>
            <PrintablePageHeader recipientData={recipientData} />

            <div className={classNames['wc-MedicationsPrint--MedicationsLabelContainer']}>
                <Stack horizontal verticalAlign="center" tokens={stackTokens}>
                    <Icon iconName="Pill" />
                    <div>{pageLabel}</div>
                </Stack>
            </div>
        </>
    );

    const MedicationsBlock = ({ medications }) => {
        const activeMeds = [],
            inactiveMeds = [];
        medications.forEach((med) => {
            if (med.isActive) {
                activeMeds.push(med);
            } else {
                inactiveMeds.push(med);
            }
        });

        return (
            <Stack className={classNames['wc-MedicationsPrint--MedicationsGrid']} tokens={stackTokens}>
                <Stack tokens={{ childrenGap: ACTIVITY_TOKEN_GAP }}>
                    {pageLabel === MEDICATION_PRINT_PAGE_LABELS.All && (
                        <div className={classNames['wc-MedicationsPrint--allMedicationsStatusLabel']}>Current</div>
                    )}
                    {activeMeds.map((medication, i) => {
                        const { columns } = medication;
                        return (
                            <>
                                <Stack
                                    className={classNames['wc-MedicationsPrint--MedicationContainer']}
                                    verticalAlign="space-evenly"
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`med-${i}`}
                                >
                                    <Stack horizontal>
                                        {columns.map((content, i) => {
                                            return (
                                                <Stack
                                                    className={classNames['wc-MedicationsPrint--MedicationContent']}
                                                    verticalAlign="center"
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    key={`content-${i}`}
                                                >
                                                    {content}
                                                </Stack>
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            </>
                        );
                    })}
                </Stack>
                {inactiveMeds.length > 0 && (
                    <Stack tokens={{ childrenGap: ACTIVITY_TOKEN_GAP }}>
                        {pageLabel === MEDICATION_PRINT_PAGE_LABELS.All && (
                            <div className={classNames['wc-MedicationsPrint--allMedicationsStatusLabel']}>Past</div>
                        )}
                        {inactiveMeds.map((medication, i) => {
                            const { columns } = medication;
                            return (
                                <>
                                    <Stack
                                        className={classNames['wc-MedicationsPrint--MedicationContainer']}
                                        verticalAlign="space-evenly"
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={`med-${i}`}
                                    >
                                        <Stack horizontal>
                                            {columns.map((content, i) => {
                                                return (
                                                    <Stack
                                                        className={classNames['wc-MedicationsPrint--MedicationContent']}
                                                        verticalAlign="center"
                                                        // eslint-disable-next-line react/no-array-index-key
                                                        key={`content-${i}`}
                                                    >
                                                        {content}
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    </Stack>
                                </>
                            );
                        })}
                    </Stack>
                )}
            </Stack>
        );
    };

    const MedicationsPage: React.FC<IMedicationsPageProps> = ({ medications, pageNumber }) => {
        return (
            <>
                {pageNumber > 1 && <div className={classNames['wc-MedicationsPrint--headerBuffer']} />}

                <Stack
                    className={classNames['wc-MedicationsPrint--MedicationsPageContainer']}
                    verticalAlign="space-between"
                >
                    <Stack>
                        <HeaderContent />
                        {medicationTitleColumns}
                        <MedicationsBlock medications={medications} />
                    </Stack>
                    <PrintablePageFooter
                        includePageBreak={pageNumber !== chunkedMedications.length}
                        pageNumber={pageNumber}
                        recipientData={recipientData}
                    />
                </Stack>
            </>
        );
    };

    return (
        <div className={classNames['wc-MedicationsPrint--innerContent']}>
            {chunkedMedications.map((chunk, i) => {
                // eslint-disable-next-line react/no-array-index-key
                return <MedicationsPage medications={chunk} pageNumber={i + 1} key={`medPage-${i}`} />;
            })}
        </div>
    );
};

export default MedicationsPrint;
