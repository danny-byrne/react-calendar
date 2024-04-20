import { getInitialMedicationValues } from 'src/features/Medications/constants';
import {
    handleMedicationSubmit,
    validateMedicationsForm,
    createStrengthDropdownOptionKey,
    getDoses,
    getDateValues,
    getDateAtMidDayToLocaleDate,
    getTakenForId,
    addNewText,
    required,
    formErrors,
} from '../medications';
import { capitalizeFirstLetter } from 'src/common/helpers/textFormatting';
import { MedicationCreateVariables } from 'src/types/Medication';

import { getToday } from 'src/utils/dates';

const initialMedicationValues = getInitialMedicationValues();

const testMedName = 'test name',
    testDrugId = '1',
    testStrengthOutput = '81mg',
    testDispensableDrugId = '00261647',
    testStrengthUnit = 'mg',
    testMedStrength = '81',
    testStrength = createStrengthDropdownOptionKey({
        dispensableDrugID: testDispensableDrugId,
        medStrength: testMedStrength,
        medStrengthUnit: testStrengthUnit,
    }),
    testStrengthDropdown = [{ key: testStrength, text: '81mg' }];

let medValues = {
    ...initialMedicationValues,
    name: testMedName,
};

const medInput = {
    values: medValues,
    routedDoseFormDrugId: testDrugId,
    type: 'add',
    dispensableDrugId: undefined,
    strengthDropDown: [],
};

const medMutationPrescriptionVariables = {
    directions: '',
    medication: {
        name: capitalizeFirstLetter(testMedName),
        routedDoseFormDrugId: testDrugId,
        dispensableDrugId: undefined,
    },
    overTheCounter: true,
    dosages: [],
    strengthValue: null,
    takenFor: null,
};

describe('Initial Med creation', () => {
    test('A medication with no name cannot be saved', () => {
        const errors = validateMedicationsForm(initialMedicationValues, false);
        expect(errors).toEqual({ name: required });
    });

    test('A medication with no strength can be saved ', () => {
        const errors = validateMedicationsForm(medValues, false);
        const medWithNoStrengthAvailableOnSubmitOutput = { prescription: { ...medMutationPrescriptionVariables } };
        const variables = handleMedicationSubmit(medInput) as MedicationCreateVariables;
        expect(errors).toEqual({});
        expect(variables).toEqual(medWithNoStrengthAvailableOnSubmitOutput);
    });

    test('A medication with strengths available and none selected cannot be saved', () => {
        const errors = validateMedicationsForm(medValues, true);
        expect(errors).toEqual({ strength: formErrors.strengthRequired });
    });

    test('medication strengths, strength units and dispensableDrugIds are combined for dropdownoption keys', () => {
        const optionKey = createStrengthDropdownOptionKey({
            dispensableDrugID: testDispensableDrugId,
            medStrength: testMedStrength,
            medStrengthUnit: testStrengthUnit,
        });
        expect(optionKey).toBe(testStrength);
    });

    test('A medication with an available strength selected can be saved', () => {
        const strengthSelectedValues = { ...medValues, strength: testStrength };
        const errors = validateMedicationsForm(strengthSelectedValues, true);
        expect(errors).toEqual({});

        const strengthSelectedOnSubmitInput = {
            ...medInput,
            strengthDropDown: testStrengthDropdown,
            values: strengthSelectedValues,
            dispensableDrugId: testDispensableDrugId,
        };
        const strengthSelectedOnSubmitOutput = {
            prescription: {
                ...medMutationPrescriptionVariables,
                medication: {
                    ...medMutationPrescriptionVariables.medication,
                    dispensableDrugId: testDispensableDrugId,
                },
                strengthValue: testStrengthOutput,
            },
        };
        const variables = handleMedicationSubmit(strengthSelectedOnSubmitInput) as MedicationCreateVariables;
        expect(variables).toEqual(strengthSelectedOnSubmitOutput);
    });

    test('Medication with RefillChecked and no refill date selected cannot be saved', () => {
        const medWithRefillCheckedAndNoRefillDate = {
            ...medValues,
            refillChecked: true,
        };
        const errors = validateMedicationsForm(medWithRefillCheckedAndNoRefillDate, false);
        expect(errors).toEqual({ refillDate: formErrors.refillDateRequired });
    });

    test('Medication with Refill and date can be saved', () => {
        const refillDate = getToday();
        const medWithRefillValues = {
            ...medValues,
            refillChecked: true,
            refillDate,
        };
        const errors = validateMedicationsForm(medWithRefillValues, false);
        expect(errors).toEqual({});

        const validRefillAndRefillDateSelectedOnSubmitInput = {
            ...medInput,
            values: medWithRefillValues,
        };
        const validRefillAndDateOnSubmitOutput = {
            prescription: {
                ...medMutationPrescriptionVariables,
                refill: {
                    refillDate: getDateAtMidDayToLocaleDate(refillDate),
                },
            },
        };
        const variables = handleMedicationSubmit(
            validRefillAndRefillDateSelectedOnSubmitInput,
        ) as MedicationCreateVariables;
        expect(variables).toEqual(validRefillAndDateOnSubmitOutput);
    });
});

describe('Prescribed medications', () => {
    test('Adding a new Provider requires one to be searched and selected', () => {
        const inputWithAddNewProviderDetailsMissing = {
            ...medValues,
            overTheCounter: false,
            provider: {
                ...medValues.provider,
                id: addNewText,
                providersAvailable: true,
                firstName: '',
            },
        };
        const errors = validateMedicationsForm(inputWithAddNewProviderDetailsMissing, false);
        expect(errors).toEqual({ providerNeeded: formErrors.providerDetailsNeeded });
    });
    test("Adding an 'other' Provider requires one to be searched and selected", () => {
        const inputWithOtherProviderDetailsMissing = {
            ...medValues,
            overTheCounter: false,
            provider: {
                ...medValues.provider,
                id: addNewText,
                other: true,
            },
        };
        const errors = validateMedicationsForm(inputWithOtherProviderDetailsMissing, false);
        expect(errors).toEqual({ providerNeeded: formErrors.otherProviderNameRequired });
    });
    test('Adding a provider with valid entries can be saved', () => {
        const testProviderId = 'b7e828e2-aadb-45af-9799-7a7ac8e88b4c';

        const inputWithAlreadyExistingProviderValues = {
            ...medValues,
            overTheCounter: false,
            provider: {
                ...medValues.provider,
                id: testProviderId,
                providersAvailable: true,
                providerSelected: false,
            },
        };
        const errors = validateMedicationsForm(inputWithAlreadyExistingProviderValues, false);
        expect(errors).toEqual({});

        const existingProviderSelectedValidOnSubmitInput = {
            ...medInput,
            values: inputWithAlreadyExistingProviderValues,
        };

        const scheduleCustomOnSubmitOutput = {
            prescription: {
                ...medMutationPrescriptionVariables,
                overTheCounter: false,
                prescribingProvider: { id: testProviderId },
            },
        };
        const variables = handleMedicationSubmit(
            existingProviderSelectedValidOnSubmitInput,
        ) as MedicationCreateVariables;
        expect(variables).toEqual(scheduleCustomOnSubmitOutput);
    });
});

describe('Additional helper functions', () => {
    test('getDoses returns valid output when passing in scheduleBlocks', () => {
        const mockScheduleBlocksInput = [
            { timeOfDayUtc: '3:30PM', dosageValue: '1' },
            { timeOfDayUtc: '4:30PM', dosageValue: '2' },
        ];
        const getDosesOutput = [
            { time: '3:30PM', value: 1 },
            { time: '4:30PM', value: 2 },
        ];
        const doseValues = getDoses(mockScheduleBlocksInput);
        expect(doseValues).toEqual(getDosesOutput);
    });
    test('getDateValues returns valid output', () => {
        const date = getToday();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const expectedGetTodayOutput = [year, month, day];
        expect(getDateValues(date)).toEqual(expectedGetTodayOutput);
    });

    test('getTakenForId returns valid outputs for add New and regular', () => {
        const addNewResult = getTakenForId(addNewText);
        const idResult = getTakenForId('1');
        expect(addNewResult).toBeNull();
        expect(idResult).toBe('1');
    });

    test('getDateAtMiddDayToLocaleDate returns valid result', () => {
        const date = new Date('11-14-22');
        const toLocale = getDateAtMidDayToLocaleDate(date);
        expect(toLocale).toBe('November 14, 2022');
    });

    //additional tests to write
    //getInitSelectedWhichDays
    //getMedicationCourses
    //setInitValues

    //non medication add related helpers
    //addScheduleBlocks
    //occursOnDay
    //getRefillUpdateVariables
});
