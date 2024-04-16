import React from 'react';

import { Stack, TextField, ComboBox, DatePicker, DayOfWeek, Dropdown, ResponsiveMode, Label } from '@fluentui/react';
import { ErrorMessage, FormikProps } from 'formik';
import { GrayLine } from 'src/common/components';
import AddressSearch from 'src/common/components/AutoCompleteSearch/AddressSearch/AddressSearch';

import { getClassNames } from './AppointmentForm.classNames';
import { trackFieldChanged } from 'src/wcpConsentInit';
import { timeNumbersDropDownOptions } from 'src/utils/utils';
import { getDateAtMidday } from 'src/utils/dates';
import { getEndTimeValues } from './AppointmentUtils';
import { AppointmentFormikValues } from './AppointmentUtils';

interface IAppointmentFormProps {
    onDismiss: () => void;
    formik: FormikProps<AppointmentFormikValues>;
}

const AppointmentForm: React.FC<IAppointmentFormProps> = (props) => {
    const { formik } = props;
    const classNames = getClassNames();

    const StartTime = () => {
        return (
            <Stack className={classNames['wc-AppointmentForm--timingText']}>
                <Label required>Start Time</Label>
                <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <ComboBox
                        className={classNames['wc-AppointmentForm--timeComponent']}
                        id={`startTime`}
                        data-testid="cal-start-time"
                        selectedKey={formik.values.appointment.startTimeNumber}
                        onChange={(_, item) => {
                            const [endTimeItem, endTimeAmPm] = getEndTimeValues(
                                item,
                                formik.values.appointment.startTimeAmPm,
                            );
                            trackFieldChanged('startTimeNumber');
                            formik.setFieldValue(`appointment.startTimeNumber`, item.key);
                            formik.setFieldValue(`appointment.endTimeAmPm`, endTimeAmPm);
                            formik.setFieldValue(`appointment.endTimeNumber`, endTimeItem.key);
                        }}
                        placeholder="Select time"
                        options={timeNumbersDropDownOptions}
                        useComboBoxAsMenuWidth
                    />
                    <Dropdown
                        className={classNames['wc-AppointmentForm--timeComponent']}
                        options={[
                            { key: 'AM', text: 'AM' },
                            { key: 'PM', text: 'PM' },
                        ]}
                        id="startTimeAmPm"
                        data-testid="cal-ampm-start"
                        responsiveMode={ResponsiveMode.large}
                        selectedKey={formik.values.appointment.startTimeAmPm}
                        onChange={(_, item) => {
                            formik.setFieldValue('appointment.startTimeAmPm', item.key);
                            formik.setFieldValue('appointment.endTimeAmPm', item.key);
                        }}
                    />
                </Stack>
            </Stack>
        );
    };

    const EndTime = () => {
        return (
            <Stack className={classNames['wc-AppointmentForm--timingText']}>
                <Stack horizontal>
                    <Label required>End Time</Label>
                    <ErrorMessage name="appointment.endTimeNumber" />
                </Stack>
                <Stack
                    horizontal
                    tokens={{ childrenGap: 16 }}
                    className={classNames['wc-AppointmentForm--timeContainer']}
                >
                    <ComboBox
                        className={classNames['wc-AppointmentForm--timeComponent']}
                        id={`startTime`}
                        data-testid="cal-end-time"
                        selectedKey={formik.values.appointment.endTimeNumber}
                        onChange={(_, item) => {
                            trackFieldChanged('endTimeNumber');
                            formik.setFieldValue(`appointment.endTimeNumber`, item.key);
                        }}
                        placeholder="Select time"
                        options={timeNumbersDropDownOptions}
                        useComboBoxAsMenuWidth
                    />
                    <Dropdown
                        className={classNames['wc-AppointmentForm--timeComponent']}
                        options={[
                            { key: 'AM', text: 'AM' },
                            { key: 'PM', text: 'PM' },
                        ]}
                        id="endTimeAmPm"
                        data-testid="cal-ampm-end"
                        responsiveMode={ResponsiveMode.large}
                        selectedKey={formik.values.appointment.endTimeAmPm}
                        onChange={(_, item) => {
                            formik.setFieldValue('appointment.endTimeAmPm', item.key);
                        }}
                    />
                </Stack>
            </Stack>
        );
    };

    return (
        <Stack verticalAlign="space-between" className={classNames['wc-AppointmentForm--container']}>
            <Stack tokens={{ childrenGap: 24 }}>
                <Stack tokens={{ childrenGap: 16 }} className={classNames['wc-AppointmentForm--timeContainer']}>
                    <TextField
                        label={'Title'}
                        required
                        placeholder="Appointment Name"
                        data-testid="cal-name"
                        onChange={(value) => formik.setFieldValue('appointment.name', value)}
                        {...formik.getFieldProps('appointment.name')}
                    />
                    <AddressSearch
                        formik={formik}
                        defaultTerm={formik.values.appointment.address.displayAddress}
                        aria-label="Address Search"
                        placeholder="Search for an address"
                    />
                </Stack>
                <GrayLine />
                {/* End date will be added when All Day feature is implemented
                    as for right now, only use StartDate as date */}
                <Stack tokens={{ childrenGap: 16 }}>
                    <DatePicker
                        label={'Date'}
                        id="startDate"
                        data-testid="cal-date"
                        firstDayOfWeek={DayOfWeek.Sunday}
                        onSelectDate={(date) => {
                            trackFieldChanged('startDate');
                            formik.setFieldValue('appointment.startDate', getDateAtMidday(date));
                        }}
                        {...formik.getFieldProps('appointment.startDate')}
                        placeholder="Select a date"
                        isRequired
                    />
                    <StartTime />
                    <EndTime />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default AppointmentForm;
