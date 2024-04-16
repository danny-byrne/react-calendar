import { FontWeights, mergeStyleSets } from '@fluentui/react';

interface IAppointmentFormClassNames {
    'wc-AppointmentForm--timeContainer': string;
    'wc-AppointmentForm--timeComponent': string;
    'wc-AppointmentForm--cancelText': string;
    'wc-AppointmentForm--appointmentText': string;
    'wc-AppointmentForm--timingText': string;
    'wc-AppointmentForm--timingLabels': string;
    'wc-AppointmentForm--toggleSection': string;
    'wc-AppointmentForm--toggle': string;
    'wc-AppointmentForm--addButton': string;
}

export const getClassNames = (): IAppointmentFormClassNames => {
    return mergeStyleSets({
        'wc-AppointmentForm--timeContainer': {
            justifyContent: 'space-between',
        },
        'wc-AppointmentForm--timeComponent': {
            width: '50%',
        },
        'wc-AppointmentForm--cancelText': {
            fontSize: 16,
            fontWeight: FontWeights.regular,
            color: '#4426D9',
        },
        'wc-AppointmentForm--appointmentText': {
            fontSize: 30,
            fontWeight: FontWeights.bold,
            lineHeight: 30,
        },
        'wc-AppointmentForm--timingText': {
            fontSize: 18,
            fontWeight: FontWeights.bold,
        },
        'wc-AppointmentForm--timingLabels': {
            fontSize: 16,
            fontWeight: FontWeights.regular,
        },
        'wc-AppointmentForm--toggleSection': {
            margin: '10px 0px 10px',
        },
        'wc-AppointmentForm--toggle': {
            marginBottom: 0,
        },
        'wc-AppointmentForm--addButton': {
            marginBottom: 40,
        },
    });
};
