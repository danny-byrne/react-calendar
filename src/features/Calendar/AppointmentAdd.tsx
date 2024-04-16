import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCreateAppointmentMutation } from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import { useFeedbackService } from 'src/services/FeedbackService';

import { PanelContainerWithHeader } from 'src/common/components/Panel/PanelContainerWithHeader';
import AppointmentForm from './AppointmentForm';

import RouterConfig from 'src/app/RouterConfig';
import { ERROR_MESSAGES } from 'src/app/Strings';
import { Form, Formik } from 'formik';

import { getToday } from 'src/utils/dates';
import {
    AppointmentFormikValues,
    getAddAppointmentMutationValues,
    validateAppointmentValues,
} from './AppointmentUtils';

interface IAppointmentAddProps {
    onDismiss: () => void;
}

const initialValues: AppointmentFormikValues = {
    appointment: {
        name: '',
        startDate: getToday(),
        endDate: getToday(),
        startTimeNumber: '',
        startTimeAmPm: 'AM',
        endTimeNumber: '',
        endTimeAmPm: 'AM',
        address: {
            addressLine1: '',
            city: '',
            state: '',
            zipCode: '',
            displayAddress: '',
        },
    },
};

const AppointmentAdd: React.FC<IAppointmentAddProps> = ({ onDismiss }) => {
    const { setErrorToast } = useFeedbackService();
    const navigate = useNavigate();

    const [saveDisabled, setSaveDisabled] = useState(false);
    const [createAppointment, { loading }] = useCreateAppointmentMutation({
        refetchQueries: ['GetAppointments', 'GetCareRecipientTimeline'],
        onCompleted: () => {
            navigate(RouterConfig.Calendar + '?status=added', { replace: true });
        },
        onError: () => {
            setErrorToast(ERROR_MESSAGES.ADD_APPOINTMENT);
            setSaveDisabled(false);
        },
    });

    return (
        <>
            <Formik
                validate={(values) => {
                    const errors = validateAppointmentValues(values);
                    return errors;
                }}
                initialValues={initialValues}
                onSubmit={async (values) => {
                    setSaveDisabled(true);

                    const addAppointmentValues = await getAddAppointmentMutationValues(values);
                    await createAppointment(addAppointmentValues);

                    setSaveDisabled(false);
                }}
            >
                {(formik) => (
                    <Form>
                        <PanelContainerWithHeader
                            title={'Add Event'}
                            onClose={onDismiss}
                            {...{ formik }}
                            actionButtonText={'Save'}
                            loading={saveDisabled || loading}
                            onClickActionButton={() => {
                                if (!saveDisabled) {
                                    formik.handleSubmit();
                                }
                            }}
                        >
                            <AppointmentForm formik={formik} onDismiss={onDismiss} />
                        </PanelContainerWithHeader>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default AppointmentAdd;
