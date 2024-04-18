import React from 'react';
import { Stack, Icon, FontWeights } from '@fluentui/react';

import { getClassNames } from '../PrintableContentContainer.classNames';
import { SCHEDULE_DAY_HEIGHT, CALENDAR_BG_COLOR } from './constants';

import { EventTypes, getDayLabel, calendarEventPositions } from './helpers';
import { DayBlock, Event } from './CalendarPrint';

const classNames = getClassNames();

interface IRenderEventsInput {
    events: DayBlock;
    day: number;
    range: string[];
}

export const renderEvents = ({ events, day, range }: IRenderEventsInput): JSX.Element[] => {
    let column = day + 1;
    //create a table of events keyed by startTime
    const startDay = new Date(events[0].startDate);
    const dayLabel = getDayLabel(startDay);

    const eventsKeyedByStartTime = {};
    for (let i = 0; i < events.length; i++) {
        const currentEvent = events[i];
        let currentEventStartTime = currentEvent.startTime;

        //compare current event end time with next even start time
        if (eventsKeyedByStartTime[currentEventStartTime]) {
            eventsKeyedByStartTime[currentEventStartTime].push(currentEvent);
        } else {
            eventsKeyedByStartTime[currentEventStartTime] = [currentEvent];
        }
    }
    const dayLabelCell = (
        <div
            style={{
                gridColumnStart: column,
                gridColumnEnd: column + 2,
                gridRowStart: 1,
                gridRowEnd: 2,
                borderRight: '1px solid black',
                borderBottom: '1px solid black',
                borderTop: '1px solid black',
                backgroundColor: CALENDAR_BG_COLOR,

                paddingLeft: 4,
            }}
        >
            {dayLabel}
        </div>
    );

    //initial block is day label
    let eventBlocks = [dayLabelCell];

    for (let eventBlockTime in eventsKeyedByStartTime) {
        const timeSpecificEvents = eventsKeyedByStartTime[eventBlockTime];

        if (timeSpecificEvents.length > 1) {
            const cell = createMultiEventCell({
                events: timeSpecificEvents,
                column,
                range,
            });
            eventBlocks.push(cell);
        } else {
            const cell = createSingleEventCell({
                event: timeSpecificEvents[0],
                column,
                range,
            });
            eventBlocks.push(cell);
        }
    }

    return eventBlocks;
};

const dayLabelRowOffsetConsideringDaysRowInGrid = 2;
const minimumTimeRangeLengthToDetermineEventCellHeightExpansions = 38;

interface ICreateSingeEventCellInput {
    event: Event;
    column: number;
    range: string[];
}

const createSingleEventCell = ({ event, column, range }: ICreateSingeEventCellInput): JSX.Element => {
    const startPosition = range.indexOf(event.startTime) + dayLabelRowOffsetConsideringDaysRowInGrid;
    let endPosition = range.indexOf(event.endTime) + dayLabelRowOffsetConsideringDaysRowInGrid;
    const eventIsAHalfHourCell = endPosition - startPosition === 2;

    if (eventIsAHalfHourCell && range.length > minimumTimeRangeLengthToDetermineEventCellHeightExpansions) {
        endPosition += 1;
    }

    const content = createCellContent(event);

    let columnStart = column;
    let columnEnd = column + 2;
    if (event.position === calendarEventPositions.left) {
        columnEnd -= 1;
    } else if (event.position === calendarEventPositions.right) {
        columnStart += 1;
    }

    return (
        <EventCell
            isMulti={false}
            rowStart={startPosition}
            rowEnd={endPosition}
            columnStart={columnStart}
            columnEnd={columnEnd}
        >
            {content}
        </EventCell>
    );
};

interface IDetermineCellEventPositionInput {
    events: DayBlock;
    range: string[];
    column: number;
}

interface IDetermineMultiEventCellPositionOutput {
    multiEventCellEndPosition: number;
    startPosition: number;
    columnEnd: number;
    columnStart: number;
}

const determineMultiEventCellPositioning = ({
    events,
    range,
    column,
}: IDetermineCellEventPositionInput): IDetermineMultiEventCellPositionOutput => {
    let latestEndTimeIndex = range.indexOf(events[0].endTime);
    const startPosition = range.indexOf(events[0].startTime) + dayLabelRowOffsetConsideringDaysRowInGrid;

    for (let i = 1; i < events.length; i++) {
        const event = events[i];
        const eventEndTimeIndex = range.indexOf(event.endTime);
        if (eventEndTimeIndex > latestEndTimeIndex) {
            latestEndTimeIndex = eventEndTimeIndex;
        }
    }
    let endPosition: number = latestEndTimeIndex + dayLabelRowOffsetConsideringDaysRowInGrid;
    const numberOfEventsToCombine = events.length;
    const halfHourInterval = 2;

    let endPositionOfCombinedHalfHourCells = startPosition + numberOfEventsToCombine * halfHourInterval;
    let multiEventCellEndPosition =
        endPositionOfCombinedHalfHourCells > endPosition ? endPositionOfCombinedHalfHourCells : endPosition;
    const expandCellHeight: boolean = range.length > minimumTimeRangeLengthToDetermineEventCellHeightExpansions;

    //if a large hour range is shrinking half hour hour cells enough that the text spills out, expand the cell
    if (expandCellHeight) {
        multiEventCellEndPosition += Math.floor(numberOfEventsToCombine / 2);
    }

    let columnStart = column;
    let columnEnd = column + 2;
    if (events[0].position === calendarEventPositions.left) {
        columnEnd -= 1;
    } else if (events[0].position === calendarEventPositions.right) {
        columnStart += 1;
    }

    return { multiEventCellEndPosition, startPosition, columnEnd, columnStart };
};

const createMultiEventCell = ({ events, column, range }: IDetermineCellEventPositionInput): JSX.Element => {
    const { multiEventCellEndPosition, startPosition, columnEnd, columnStart } = determineMultiEventCellPositioning({
        events,
        range,
        column,
    });

    const multiEventContent = events.map((event) => {
        const content = createCellContent(event);
        return content;
    });

    return (
        <EventCell
            isMulti
            rowStart={startPosition}
            rowEnd={multiEventCellEndPosition}
            columnStart={columnStart}
            columnEnd={columnEnd}
        >
            {multiEventContent}
        </EventCell>
    );
};

interface IEventCellProps {
    isMulti: boolean;
    children: React.ReactNode;
    rowStart: number;
    rowEnd: number;
    columnStart: number;
    columnEnd: number;
}

const EventCell: React.FC<IEventCellProps> = ({
    children,
    isMulti,
    rowStart,
    rowEnd,
    columnStart,
    columnEnd,
}): JSX.Element => {
    return (
        <Stack
            verticalAlign="start"
            horizontalAlign="start"
            className={classNames['wc-PrintableContent--eventCell']}
            key={Math.random()}
            tokens={{ childrenGap: isMulti ? 2 : null }}
            style={{
                gridRowStart: rowStart,
                gridRowEnd: rowEnd,
                gridColumnStart: columnStart,
                gridColumnEnd: columnEnd,
            }}
        >
            {children}
        </Stack>
    );
};

const createCellContent = (event: Event): JSX.Element => {
    const dosingInformation =
        event.type === EventTypes.prescription ? `Take ${event.dosageInfo} at ${event.startTime}` : null;
    return event.type === EventTypes.appointment ? (
        <div>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 2 }}>
                <Icon iconName="Family" />
                <div>{event.description}</div>
            </Stack>
            <div>{`${event.startTime} - ${event.endTime}`}</div>
        </div>
    ) : (
        <div>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 2 }}>
                <Icon iconName="Pill" />
                <div>{event.description}</div>
            </Stack>
            <div>{dosingInformation}</div>
        </div>
    );
};

export const createHourLabels = (labels: string[], numRows: number): JSX.Element[] => {
    const numHours = numRows / 4;
    const hourHeight = SCHEDULE_DAY_HEIGHT / numHours;
    const emptyCell = (
        <div
            style={{
                gridColumnStart: 1,
                gridColumnEnd: 2,
                gridRowStart: 1,
                gridRowEnd: 2,
                backgroundColor: CALENDAR_BG_COLOR,
            }}
        />
    );

    let hoursDisplay = [emptyCell];
    let i = 0;
    let startRow = 2,
        endRow = 6;
    while (i < labels.length) {
        let label = labels[i];
        const element = (
            <div
                style={{
                    gridColumnStart: 1,
                    gridColumnEnd: 2,
                    gridRowStart: startRow,
                    gridRowEnd: endRow,
                    backgroundColor: CALENDAR_BG_COLOR,
                    paddingLeft: 20,
                }}
            >
                <div
                    style={{
                        transform: `translateY(-${hourHeight / 5 - 1}px)`,
                        fontWeight: FontWeights.semibold,
                    }}
                >
                    {label}
                </div>
            </div>
        );
        hoursDisplay.push(element);
        i++;
        startRow = endRow;
        endRow += 4;
    }
    return hoursDisplay;
};

export const generateGridLines = (numRows: number, numColumns: number): JSX.Element[] => {
    const gridLines = [];
    for (let i = 1; i <= numRows + 1; i += 2) {
        const rowLine = (
            <div
                key={Math.random()}
                style={{
                    gridColumnStart: 2,
                    gridColumnEnd: numColumns + 2,
                    gridRowStart: i,
                    gridRowEnd: i + 1,
                    borderBottom: '1px dotted black',
                }}
            />
        );
        gridLines.push(rowLine);
    }
    for (let i = 1; i <= numColumns + 1; i += 2) {
        const columnLine = (
            <div
                key={Math.random()}
                style={{
                    gridColumnStart: i,
                    gridColumnEnd: i + 1,
                    gridRowStart: 1,
                    gridRowEnd: numRows + 2,
                    borderRight: '1px solid black',
                }}
            />
        );
        gridLines.push(columnLine);
    }
    return gridLines;
};
