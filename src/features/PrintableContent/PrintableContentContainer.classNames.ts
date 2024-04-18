import { mergeStyleSets, FontWeights } from '@fluentui/react';
import { FONT_FAMILY } from 'src/common/styles/constants';
import { colors } from 'src/common/styles/colors';
import { PRINT_PAGE_HEIGHT, PRINT_HEADER_HEIGHT, PRINT_FOOTER_HEIGHT, HEADER_BUFFER_HEIGHT } from './constants';
import {
    SCHEDULE_CONTAINER_HEIGHT,
    SCHEDULE_CONTAINER_WIDTH,
    SCHEDULE_HOURS_DISPLAY_WIDTH,
    DAY_LABEL_ROW_HEIGHT,
    SCHEDULE_GRID_HEIGHT,
    SCHEDULE_DAY_HEIGHT,
} from './CalendarPrint/constants';

const BORDER_HEIGHT = 1;

interface IPrintableContentClassNames {
    'wc-PrintableContent--printableContent': string;
    'wc-PrintableContent--EmContactName': string;
    'wc-PrintableContent--semiBoldText': string;
    'wc-PrintableContent--horizontalLine': string;
    'wc-PrintableContent--headerContent': string;
    'wc-PrintableContent--headerContent--details': string;
    'wc-PrintableContent--footerContent': string;
    'wc-PrintableContent--pageBreak': string;
    'wc-PrintableContent--msLogo': string;
    'wc-PrintableContent--persona': string;
    'wc-PrintableContent--timeframeText': string;
    'wc-PrintableContent--scheduleContainer': string;
    'wc-PrintableContent--hoursDisplay': string;
    'wc-PrintableContent--scheduleGrid': string;
    'wc-PrintableContent--dayContainer': string;
    'wc-PrintableContent--dayLabelCell': string;
}

export const getClassNames = (): IPrintableContentClassNames => {
    return mergeStyleSets({
        'wc-PrintableContent--printableContent': {
            ['@media print']: {
                display: 'block',
                ['@page']: { size: 'landscape' },
                padding: '30px',
                left: 0,
            },
            position: 'relative',
            left: 1000,
        },
        'wc-PrintableContent--headerContent': {
            height: PRINT_HEADER_HEIGHT,
            width: '100%',
            fontSize: '16px',
            fontFamily: FONT_FAMILY,
        },
        'wc-PrintableContent--headerContent--details': {
            width: '200px',
        },
        'wc-PrintableContent--horizontalLine': {
            height: '1px',
            width: '100%',
            position: 'relative',
            top: -5,
            backgroundColor: 'black',
        },
        'wc-PrintableContent--semiBoldText': {
            fontWeight: FontWeights.semibold,
        },
        'wc-PrintableContent--EmContactName': {
            width: '150px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        },
        'wc-PrintableContent--footerContent': {
            height: PRINT_FOOTER_HEIGHT,
            fontSize: '10px',
        },
        'wc-PrintableContent--PageContainer': {
            height: PRINT_PAGE_HEIGHT,
            width: '100%',
        },
        'wc-PrintableContent--headerBuffer': {
            height: HEADER_BUFFER_HEIGHT,
            width: '100%',
        },
        'wc-PrintableContent--pageBreak': {
            breakAfter: 'page',
        },
        'wc-PrintableContent--msLogo': {
            filter: 'greyscale(1)',
        },
        'wc-PrintableContent--persona': {
            marginLeft: '1px',
            marginTop: '1px',
        },
        'wc-PrintableContent--innerContent': {
            height: '100%',
            width: '100%',
            fontFamily: FONT_FAMILY,
            color: colors.windcrest.printColor,
        },
        'wc-PrintableContent--scheduleContainer': {
            height: SCHEDULE_CONTAINER_HEIGHT,
            width: SCHEDULE_CONTAINER_WIDTH,
        },
        'wc-PrintableContent--scheduleGrid': {
            width: '100%',
            height: SCHEDULE_GRID_HEIGHT,
            overflow: 'hidden',
        },
        'wc-PrintableContent--dayContainer': {
            height: SCHEDULE_DAY_HEIGHT,
            borderRight: '1px solid #C4C4C4',
        },
        'wc-PrintableContent--dayLabelCell': {
            borderBottom: `${BORDER_HEIGHT}px solid black`,
            paddingLeft: '5px',
            height: DAY_LABEL_ROW_HEIGHT - BORDER_HEIGHT,
            backgroundColor: 'lightgreen',
            borderRight: `${BORDER_HEIGHT}px solid black`,
        },
        'wc-PrintableContent--dayLabelHeightBuffer': {
            height: DAY_LABEL_ROW_HEIGHT,
            backgroundColor: 'lightgreen',
        },
        'wc-PrintableContent--hoursDisplay': {
            width: SCHEDULE_HOURS_DISPLAY_WIDTH,
            overflow: 'hidden',
            height: '100%',
        },
        'wc-PrintableContent--hourLabel': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            borderBottom: '1px dotted black',
        },
        'wc-PrintableContent--eventCell': {
            border: '1px solid black',
            borderRadius: 10,
            backgroundColor: 'white',
            zIndex: 5,
            paddingLeft: 3,
            paddingTop: 1,
            fontSize: '.6rem',
        },
        'wc-PrintableContent--timeframeText': {
            height: DAY_LABEL_ROW_HEIGHT,
            fontWeight: FontWeights.semibold,
        },
        'wc-PrintableContent--halfHourCellsContainer': {
            height: '100%',
        },
        'wc-PrintableContent--halfHourCell': {
            borderBottom: '1px dotted black',
        },
    });
};

interface IScheduleContainerProps {
    gridTemplateRows: string;
    gridTemplateColumns: string;
}

export const getScheduleGridClassNames = ({ gridTemplateRows, gridTemplateColumns }: IScheduleContainerProps) => {
    return mergeStyleSets({
        'wc-PrintableContent--scheduleContainer': {
            height: SCHEDULE_CONTAINER_HEIGHT,
            width: SCHEDULE_CONTAINER_WIDTH,
            display: 'grid',
            gridTemplateRows: gridTemplateRows,
            gridTemplateColumns: gridTemplateColumns,
        },
    });
};
