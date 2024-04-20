import React from 'react';
import { FormikProps } from 'formik';
import { Stack, DefaultButton, DatePicker, DayOfWeek, Icon } from '@fluentui/react';

import OptionalContainer from './OptionalContainer';
import { getClassNames } from './StartStopDate.classNames';

import { getDateAtMidday } from 'src/utils/dates';
import { getInputErrorStyles } from '../helpers';
import { inputErrorStyles } from 'src/features/Medications/constants';

interface StartStopDateProps {
    formik: FormikProps<{
        startDate: Date;
        stopDate?: Date;
    }>;
    errors?: any;
}

const StartStopDate: React.FC<StartStopDateProps> = (props) => {
    const classNames = getClassNames();
    const { formik, errors } = props;
    const [showStopDate, setShowStopDate] = React.useState(formik.values.stopDate === null);
    const [startDateTime, setStartDateTime] = React.useState(getDateAtMidday(formik.values.startDate));
    const [stopDateTime, setStopDateTime] = React.useState(getDateAtMidday(formik.values.stopDate));

    const datePickerstyles = {
        statusMessage: {
            marginTop: 0,
        },
    };

    const optionalStyles = {
        dismissButton: {
            marginTop: 30,
        },
        container: {
            width: '100%',
            padding: 0,
        },
    };

    React.useEffect(() => {
        formik.setFieldValue('startDate', getDateAtMidday(startDateTime));
        formik.setFieldValue('stopDate', getDateAtMidday(stopDateTime));
    }, [startDateTime, stopDateTime]);

    const minDate = new Date(Date.now());

    const datePickerCombinedStyles = getInputErrorStyles({
        hasError: errors.dateOverlap,
        defaultStyle: datePickerstyles,
        errorStyle: inputErrorStyles.datepicker,
    });

    return (
        <Stack className={classNames['wc-StartStopDate--container']}>
            <DatePicker
                styles={datePickerCombinedStyles}
                className={classNames['wc-StartStopDate--startDate']}
                id="startDate"
                label="Start Date"
                data-testid="startDate"
                firstDayOfWeek={DayOfWeek.Sunday}
                minDate={minDate}
                onSelectDate={(date) => {
                    trackFieldChanged('startDate');
                    formik.setFieldValue('startDate', getDateAtMidday(date));
                    setStartDateTime(getDateAtMidday(date));
                }}
                {...formik.getFieldProps('startDate')}
                placeholder="Select a date"
                onAfterMenuDismiss={() => formik.setTouched({ ...formik.touched, startDate: true })}
                textField={{ errorMessage: errors?.dateOverlap }}
            />
            {showStopDate && (
                <DefaultButton
                    data-testid={'stop-date'}
                    onClick={() => {
                        trackClick('stop-date');
                        setShowStopDate(false);
                    }}
                    className={classNames['wc-StartStopDate--stopDateButton']}
                >
                    <Stack horizontal className={classNames['wc-StartStopDate--stopDateContainer']}>
                        <Icon iconName="CirclePlus" /> &nbsp; Stop Date
                    </Stack>
                </DefaultButton>
            )}
            {!showStopDate && (
                <OptionalContainer
                    test-dataid="optional-container"
                    styles={optionalStyles}
                    onDismiss={function (): void {
                        trackClick('optional-container');
                        setShowStopDate(true);
                        formik.setFieldValue('stopDate', undefined);
                    }}
                >
                    <DatePicker
                        styles={datePickerCombinedStyles}
                        className={classNames['wc-StartStopDate--stopDate']}
                        id="stopDate"
                        data-testid="stopDate"
                        label="Stop Date"
                        firstDayOfWeek={DayOfWeek.Sunday}
                        placeholder="When does this end?"
                        onSelectDate={(date) => {
                            trackFieldChanged('stopDate');
                            formik.setFieldValue('stopDate', getDateAtMidday(date));
                            setStopDateTime(getDateAtMidday(date));
                        }}
                        {...formik.getFieldProps('stopDate')}
                        onBlur={() => formik.setTouched({ ...formik.touched, stopDate: true })}
                        textField={{ errorMessage: errors?.dateOverlap }}
                    />
                </OptionalContainer>
            )}
        </Stack>
    );
};

export default StartStopDate;
