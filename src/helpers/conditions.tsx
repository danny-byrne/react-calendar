const setConditionInput = (values, type) => {
    let variables;
    if (type === 'add') {
        variables = {
            input: {
                condition: {
                    name: values.condition.conditionName,
                    iCD10Code: values.condition.icd10Code,
                },
                conditionStartDateRelativePeriodStart: null,
                conditionStartDateRelativePeriodEnd: null,
                conditionStartDateDay: null,
                conditionStartDateYear: null,
                conditionStartDateMonth: null,
                conditionEndDateRelativePeriodStart: null,
                conditionEndDateRelativePeriodEnd: null,
                conditionEndDateDay: null,
                conditionEndDateYear: null,
                conditionEndDateMonth: null,
            },
        };
    } else {
        variables = {
            input: {
                id: values.condition.id,
                condition: {
                    name: values.condition.conditionName,
                    iCD10Code: values.condition.icd10Code,
                },
                conditionStartDateRelativePeriodStart: null,
                conditionStartDateRelativePeriodEnd: null,
                conditionStartDateDay: null,
                conditionStartDateYear: null,
                conditionStartDateMonth: null,
                conditionEndDateRelativePeriodStart: null,
                conditionEndDateRelativePeriodEnd: null,
                conditionEndDateDay: null,
                conditionEndDateYear: null,
                conditionEndDateMonth: null,
            },
        };
    }

    if (values.conditionStarted.unsureOfSpecificYear) {
        variables.input.conditionStartDateRelativePeriodStart = values.conditionStarted.relativeStart;
        variables.input.conditionStartDateRelativePeriodEnd = values.conditionStarted.relativeEnd;
        variables.input.conditionStartDateDay = null;
        variables.input.conditionStartDateYear = null;
        variables.input.conditionStartDateMonth = null;
    } else {
        variables.input.conditionStartDateDay = values.conditionStarted.day;
        variables.input.conditionStartDateYear = values.conditionStarted.year;
        variables.input.conditionStartDateMonth = values.conditionStarted.month;
    }
    if (!values.isCurrentlyActive) {
        if (values.conditionEnded.unsureOfSpecificYear) {
            variables.input.conditionEndDateRelativePeriodStart = values.conditionEnded.relativeStart;
            variables.input.conditionEndDateRelativePeriodEnd = values.conditionEnded.relativeEnd;
        } else {
            variables.input.conditionEndDateDay = values.conditionEnded.day;
            variables.input.conditionEndDateYear = values.conditionEnded.year;
            variables.input.conditionEndDateMonth = values.conditionEnded.month;
        }
    }

    return variables;
};

export { setConditionInput };
