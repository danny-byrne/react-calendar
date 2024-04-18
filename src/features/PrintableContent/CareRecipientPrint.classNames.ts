import { mergeStyleSets, FontWeights } from '@fluentui/react';
import { FONT_FAMILY, PRINT_BORDER_STYLE } from 'src/common/styles/constants';
import { colors } from 'src/common/styles/colors';
import {
    PRINT_PAGE_HEIGHT,
    INFORMATION_ROW_HEIGHT_LARGE,
    INFORMATION_ROW_HEIGHT_SMALL,
    COLUMN_NAMES_HEIGHT,
    CATEGORY_LABEL_HEIGHT,
    CATEGORY_LABEL_MARGIN,
} from './constants';

interface IActivitiesClassNames {
    'wc-CareRecipientPrint--innerContent': string;
    'wc-CareRecipientPrint--LabelContainer': string;
    'wc-CareRecipientPrint--Grid': string;
    'wc-CareRecipientPrint--MedicationsGridLabel': string;
    'wc-CareRecipientPrint--GridContent': string;
    'wc-CareRecipientPrint--PageContainer': string;
}
export const PRINT_CONTENT_TOKEN_GAP = 5;
export const PAGE_CONTENT_CONTAINER_HEIGHT = 740;

const borderRadius = '5px';

export const getClassNames = (): IActivitiesClassNames => {
    return mergeStyleSets({
        'wc-CareRecipientPrint--innerContent': {
            height: '100%',
            width: '100%',
            fontFamily: FONT_FAMILY,
            color: colors.windcrest.printColor,
        },
        'wc-CareRecipientPrint--PageContainer': {
            height: PRINT_PAGE_HEIGHT,
            width: '100%',
        },
        'wc-CareRecipientPrint--LabelContainer': {
            fontWeight: FontWeights.semibold,
            fontSize: '14px',
            height: CATEGORY_LABEL_HEIGHT,
            marginBottom: CATEGORY_LABEL_MARGIN,
        },
        'wc-CareRecipientPrint--Grid': {
            width: '100%',
            border: PRINT_BORDER_STYLE,
            borderRadius: borderRadius,
        },
        'wc-CareRecipientPrint--MedicationsGridLabel': {
            width: '20%',
            height: '20px',
            fontSize: '12px',
            paddingLeft: '4px',
        },
        'wc-CareRecipientPrint--InfoContainer': {
            width: '100%',
            height: INFORMATION_ROW_HEIGHT_SMALL,
        },
        'wc-CareRecipientPrint--InfoContainer--large': {
            width: '100%',
            height: INFORMATION_ROW_HEIGHT_LARGE,
        },
        'wc-CareRecipientPrint--GridContent': {
            width: '20%',
            paddingLeft: '6px',
            fontSize: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        'wc-CareRecipientPrint--postPageBreakMargin': {
            height: '30px',
            width: '100%',
        },
        'wc-CareRecipientPrint--columnNamesContainer': {
            backgroundColor: '#EDEBE9',
            borderRadius: borderRadius,
            height: COLUMN_NAMES_HEIGHT,
        },
        'wc-CareRecipientPrint--headerBuffer': {
            height: '30px',
            width: '100%',
        },
        'wc-CareRecipientPrint--footerContent': {
            fontSize: '10px',
        },
        'wc-CareRecipientPrint--activitiesLabelContainer': {},
        'wc-CareRecipientPrint--allMedicationsStatusLabel': {
            fontWeight: FontWeights.semibold,
            fontSize: '12px',
        },
    });
};
