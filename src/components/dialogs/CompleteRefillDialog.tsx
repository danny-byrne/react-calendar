import {
    useUpdateMedicationMutation,
    useRefillDeleteMutation,
    MedicationPrescriptionUpdateInput,
    RecordStatus,
} from 'src/graphQL/serverMocks/graphQLGeneratedCode';

import React from 'react';
import { Stack, Dialog, DialogType, DatePicker, DayOfWeek, ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import { Formik, Form } from 'formik';
import { FormFieldGap } from 'src/common/components/Form';
import Buttons from './Buttons';

import { getClassNames } from 'src/features/Medications/MedicationEdit.classNames';
import { Prescription } from 'src/types/Medication';
import { getDateAtMidday, getToday } from 'src/utils/dates';

const dialogStyles = { main: { maxWidth: 450 } };

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Refill Completed',
    closeButtonAriaLabel: 'Close',
};

interface CompleteRefillDialogProps {
    onSave?: () => void;
    onDismiss: () => void;
    hidden: boolean;
    medication: Prescription;
    toggleHideDialog: () => void;
    noLongerTaking?: boolean;
}

const CompleteRefillDialog: React.FC<CompleteRefillDialogProps> = (props) => {
    const modalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: dialogStyles,
        }),
        [],
    );
    const classNames = getClassNames();

    const options: IChoiceGroupOption[] = [
        { key: 'Yes', text: 'Yes' },
        { key: 'No', text: 'No' },
    ];

    const [updateMedication, { loading: updateLoading }] = useUpdateMedicationMutation({
        refetchQueries: ['GetPrescriptionsWithSchedule', 'GetMedication'],
    });

    const [RefillDelete, { loading: deleteLoading }] = useRefillDeleteMutation({
        refetchQueries: ['GetPrescriptionsWithSchedule', 'GetMedication'],
    });

    const filteredRefills = props.medication?.refills?.filter((refill) => refill.recordStatus == RecordStatus.Active);

    return (
        <Dialog
            hidden={props.hidden}
            onDismiss={props.toggleHideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
        >
            <Dialog dialogContentProps={dialogContentProps} />
            <Formik
                validate={(values) => {
                    const errors: any = {};
                    if (!values.refillDate && values.remindOfNextRefill === 'Yes') {
                        errors.refillDate = 'Required';
                    }
                    return errors;
                }}
                initialValues={{
                    id: props.medication.id,
                    refillDate: null,
                    refillId: filteredRefills[0]?.id ?? null,
                    remindOfNextRefill: 'Yes',
                    pharmacy: filteredRefills[0]?.pharmacy ?? null,
                }}
                onSubmit={async (values) => {
                    let update = {
                        prescription: {
                            id: values.id,
                            strengthValue: props.medication.strengthValue,
                        } as MedicationPrescriptionUpdateInput,
                    };
                    if (values.remindOfNextRefill === 'Yes') {
                        update.prescription.refill = {
                            refillDate: values.refillDate.toString(),
                            pharmacy: values.pharmacy ? { id: values.pharmacy?.id } : null,
                        };
                    }
                    await RefillDelete({ variables: { id: values.refillId } });
                    await updateMedication({ variables: update });
                    props.toggleHideDialog();
                }}
            >
                {(formik) => (
                    <Form>
                        <Stack
                            className={classNames['wc-MedicationEdit--formContainer']}
                            tokens={{ childrenGap: FormFieldGap }}
                        >
                            <ChoiceGroup
                                label="Do you want to be reminded of the next refill"
                                required
                                options={options}
                                selectedKey={formik.values.remindOfNextRefill}
                                onChange={(ev, option) => {
                                    formik.setFieldValue('remindOfNextRefill', option.key);
                                }}
                            />
                            {formik.values.remindOfNextRefill === 'Yes' && (
                                <DatePicker
                                    id="refillDate"
                                    label="Remind me"
                                    isRequired
                                    firstDayOfWeek={DayOfWeek.Sunday}
                                    placeholder="Select a date..."
                                    onSelectDate={(date) => {
                                        formik.setFieldValue('refillDate', getDateAtMidday(date));
                                    }}
                                    {...formik.getFieldProps('refillDate')}
                                    textField={{ errorMessage: '' }}
                                    // Set minimum selectable date to Today
                                    minDate={getToday()}
                                />
                            )}
                        </Stack>
                        <Buttons
                            onBack={props.onDismiss}
                            disabled={!(formik.isValid && formik.dirty) || updateLoading || deleteLoading}
                        />
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default CompleteRefillDialog;
