import { mergeStyleSets, FontWeights } from '@fluentui/react';
import { FONT_FAMILY, PRINT_BORDER_STYLE } from 'src/common/styles/constants';
import { colors } from 'src/common/styles/colors';
interface IActivitiesClassNames {
    'wc-ActivitiesPrint--innerContent': string;
    'wc-ActivitiesPrint--headerContent': string;
    'wc-ActivitiesPrint--horizontalLine': string;
    'wc-ActivitiesPrint--semiBoldText': string;
    'wc-ActivitiesPrint--ActivitiesLabelContainer': string;
    'wc-ActivitiesPrint--ActivitiesGrid': string;
    'wc-ActivitiesPrint--ActivitiesGridLabel': string;
    'wc-ActivitiesPrint--ActivityContent': string;
}
export const ACTIVITY_TOKEN_GAP = 5;

const borderRadius = '5px';
const ACTIVITY_CONTAINER_HEIGHT = 100;
const ACTIVITY_GRID_HEIGHT = 5 * (ACTIVITY_CONTAINER_HEIGHT + ACTIVITY_TOKEN_GAP);
const ACTIVITY_CONTENT_HEIGHT = 60;
const ACTIVITY_MEMBERS_HEIGHT = ACTIVITY_CONTAINER_HEIGHT - ACTIVITY_CONTENT_HEIGHT;

export const getClassNames = (): IActivitiesClassNames => {
    return mergeStyleSets({
        'wc-ActivitiesPrint--innerContent': {
            height: '100%',
            width: '100%',
            fontFamily: FONT_FAMILY,
            color: colors.windcrest.printColor,
        },
        'wc-ActivitiesPrint--headerContent': {
            height: '70px',
            width: '100%',
            fontSize: '16px',
            marginBottom: '5px',
            fontFamily: FONT_FAMILY,
        },
        'wc-ActivitiesPrint--horizontalLine': {
            backgroundColor: colors.windcrest.printColor,
            height: '1px',
            width: '100%',
        },
        'wc-ActivitiesPrint--semiBoldText': {
            fontWeight: FontWeights.semibold,
        },
        'wc-ActivitiesPrint--ActivityPageContainer': {
            height: 740,
            width: '100%',
        },
        'wc-ActivitiesPrint--ActivitiesLabelContainer': {
            fontWeight: FontWeights.semibold,
            fontSize: '12px',
            height: '25px',
        },
        'wc-ActivitiesPrint--ActivitiesGrid': {
            width: '100%',
            height: ACTIVITY_GRID_HEIGHT,
        },
        'wc-ActivitiesPrint--ActivitiesGridLabel': {
            width: '15%',
            height: '20px',
            fontSize: '12px',
            paddingLeft: '4px',

            'nth-child(n + 4)': {
                width: '55%',
            },
        },
        'wc-ActivitiesPrint--ActivityContainer': {
            width: '100%',
            height: ACTIVITY_CONTAINER_HEIGHT,
            border: PRINT_BORDER_STYLE,
            borderRadius: borderRadius,
        },
        'wc-ActivitiesPrint--ActivityContent': {
            width: '15%',
            paddingLeft: '6px',
            fontSize: '12px',
            height: ACTIVITY_CONTENT_HEIGHT,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        'wc-ActivitiesPrint--ActivityContent-Details': {
            width: '55%',
            paddingLeft: '6px',
            fontSize: '12px',
            height: ACTIVITY_CONTENT_HEIGHT,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        'wc-ActivitiesPrint--ActivityMembersContent': {
            width: '100%',
            height: ACTIVITY_MEMBERS_HEIGHT,
            paddingLeft: '6px',
        },
        'wc-ActivitiesPrint--EmContactName': {
            width: '150px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        },
        'wc-ActivitiesPrint--pageBreak': {
            breakAfter: 'page',
        },
        'wc-ActivitiesPrint--postPageBreakMargin': {
            height: '30px',
            width: '100%',
        },
        'wc-ActivitiesPrint--columnNamesContainer': {
            backgroundColor: '#EDEBE9',
            borderRadius: borderRadius,
        },

        'wc-ActivitiesPrint--headerBuffer': {
            height: '40px',
            width: '100%',
        },
        'wc-ActivitiesPrint--footerContent': {
            fontSize: '10px',
        },
        'wc-ActivitiesPrint--activitiesLabelContainer': {},
        'wc-ActivitiesPrint--msLogo': {
            filter: 'greyscale(1)',
        },
    });
};
