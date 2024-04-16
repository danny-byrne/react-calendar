import { FontWeights, mergeStyleSets } from '@fluentui/react';
import { colors } from 'src/common/styles/colors';

interface IAppointmentViewClassNames {
    'wc-AppointmentView--titleText': string;
    'wc-AppointmentView--cardTitleText': string;
    'wc-AppointmentView--medTitleText': string;
    'wc-AppointmentView--medConditionText': string;
    'wc-AppointmentView--sectionHeaderText': string;
    'wc-AppointmentView--questionText': string;
}

export const getClassNames = (): IAppointmentViewClassNames => {
    return mergeStyleSets({
        'wc-AppointmentView--titleText': {
            fontWeight: FontWeights.bold,
            fontSize: '1.875rem',
            lineHeight: '1.875rem',
        },
        'wc-AppointmentView--cardTitleText': {
            fontWeight: FontWeights.semibold,
            fontSize: '1rem',
            lineHeight: '1.25rem',
        },
        'wc-AppointmentView--medTitleText': {
            fontWeight: FontWeights.semibold,
            fontSize: '1rem',
            lineHeight: '1.25rem',
        },
        'wc-AppointmentView--medConditionText': {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: colors.fabric.neutrals.gray150,
        },
        'wc-AppointmentView--sectionHeaderText': {
            fontWeight: FontWeights.semibold,
            color: colors.windcrest.sectionHeaderGray,
        },
        'wc-AppointmentView--questionText': {
            color: colors.windcrest.questionGray,
            fontStyle: 'italic',
        },
    });
};
