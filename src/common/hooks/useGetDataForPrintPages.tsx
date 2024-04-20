import { careRecipientAge } from 'src/features/CareRecipient/CareRecipientUtils';
import {
    useGetCareRecipientPhotoQuery,
    useGetCareRecipientProfileQuery,
    useGetCareTeamQuery,
    useGetAllergiesQuery,
    useGetImmunizationsQuery,
    useGetCareRecipientConditionsQuery,
    useGetProvidersQuery,
    useGetPharmaciesQuery,
    RecordStatus,
} from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import { dateOptions, getDateAtMidday } from 'src/utils/dates';
import defaultProfile from 'src/assets/CareRecipient/defaultProfile.jpg';
import { locale } from 'src/features/AppProfile/constants';
import { getProviderName } from 'src/features/MedManagerLayout/helpers';
import { formatPhoneNumber } from 'src/utils/utils';
import { getTimeFrameText } from 'src/features/Conditions/utils';
import { MonthIndicies } from '../helpers/monthFormatting';
import { capitalizeOnlyFirstLetter } from '../helpers/textFormatting';
import { snakeCaseToCapitalized } from '../helpers/textFormatting';

interface AllergyItem {
    name: string;
    severity: string;
    notes: string;
}

interface ImmunizationItem {
    name: string;
    date: number | string;
}

interface ConditionItem {
    name: string;
    date: number | string;
}

interface RecipientInfoRow {
    bloodType: string;
    phoneNumber: string;
    email: string;
    address: string;
}

interface ProviderItem {
    name: string;
    specialty: string;
    contact: string;
    address: string;
}

interface PharmacyItem {
    name: string;
    phoneNumber: string;
    address: string;
}
export interface IRecipientDataType {
    careRecipientPhoto: string;
    dateOfBirth: Date | string;
    age: string | number;
    name: string;
    emergencyContact: {
        name: string;
        phoneNumber: string;
    };
    me: string;
    timeZone: string;
    careRecipientPrintInfo: Array<RecipientInfoRow>;
}

export interface IHealthHistoryDataType {
    careRecipientPrintInfo: Array<RecipientInfoRow>;
    careRecipientAllergies: Array<AllergyItem>;
    careRecipientImmunizations: Array<ImmunizationItem>;
    careRecipientConditions: Array<ConditionItem>;
    careRecipientProviders: Array<ProviderItem>;
    careRecipientPharmacies: Array<PharmacyItem>;
}

const getHealthHistoryItemDate = ({ dateDay, dateMonth, dateYear, dateRelativePeriodStart }) => {
    const month = dateMonth ? MonthIndicies[dateMonth] - 1 : 0;
    const day = dateDay ?? 1;
    const year = dateRelativePeriodStart ?? dateYear;
    const healthHistoryItemDate = new Date(year, month, day);
    return healthHistoryItemDate;
};

const sortProviders = (providerData) => {
    const providers = providerData?.careRecipientProviders?.providers ?? [];

    const sortedProviders = providers
        .filter((provider) => {
            return provider.recordStatus == RecordStatus.Active;
        })
        .map((provider) => {
            return {
                name: getProviderName(provider),
                contact: formatPhoneNumber(provider.phoneNumber),
                specialty: provider.primarySpecialty,
                address: provider.address.singleLineAddress,
            };
        });
    return sortedProviders;
};

const determineIfConditionHasBeenEnteredAsUnsureOfDates = (condition): boolean => {
    return (
        !condition.conditionEndDateDay &&
        !condition.conditionEndDateMonth &&
        !condition.conditionEndDateRelativePeriodEnd &&
        !condition.conditionEndDateRelativePeriodStart &&
        !condition.conditionEndDateYear &&
        !condition.conditionRelativeTimePeriod &&
        !condition.conditionStartDateDay &&
        !condition.conditionStartDateMonth &&
        !condition.conditionStartDateRelativePeriodEnd &&
        !condition.conditionStartDateRelativePeriodStart &&
        !condition.conditionStartDateYear
    );
};

const sortCareRecipientConditions = ({ conditionsData, startDate, endDate }) => {
    const conditions = conditionsData?.careRecipientConditions?.conditions ?? [];
    const sortedConditions = conditions
        .filter((condition) => {
            const conditionDate = getHealthHistoryItemDate({
                dateDay: condition.conditionStartDateDay,
                dateMonth: condition.conditionStartDateMonth,
                dateYear: condition.conditionStartDateYear,
                dateRelativePeriodStart: condition.conditionStartRelativePeriodStart,
            });
            const conditionHasBeenEnteredAsUnsureOfDates = determineIfConditionHasBeenEnteredAsUnsureOfDates(condition);
            const conditionHasRelativeTimePeriod = condition?.conditionRelativeTimePeriod;
            const conditionIsWithinDateFilterRanges = conditionDate > startDate && conditionDate < endDate;
            return (
                condition.recordStatus == RecordStatus.Active &&
                (conditionIsWithinDateFilterRanges ||
                    conditionHasBeenEnteredAsUnsureOfDates ||
                    conditionHasRelativeTimePeriod)
            );
        })
        .map((condition) => {
            const conditionHasBeenEnteredAsUnsureOfDates = determineIfConditionHasBeenEnteredAsUnsureOfDates(condition);
            const conditionHasRelativeTimePeriod = condition?.conditionRelativeTimePeriod;

            if (conditionHasBeenEnteredAsUnsureOfDates) {
                return { name: condition.condition.name, date: `Unsure of date` };
            } else if (conditionHasRelativeTimePeriod) {
                return {
                    name: condition.condition.name,
                    date: `Relative time period : ${snakeCaseToCapitalized(conditionHasRelativeTimePeriod)}`,
                };
            } else {
                const { absoluteDatesAndRelativeTimeframes } = getTimeFrameText(condition);
                //grab the end or start date depending on the length of the array
                const { labelText, yearsText } =
                    absoluteDatesAndRelativeTimeframes[absoluteDatesAndRelativeTimeframes.length - 1];
                //todo: implement allergy notes when that feature exists
                return { name: condition.condition.name, date: `${labelText + yearsText}` };
            }
        });
    return sortedConditions.length ? sortedConditions : [];
};

const sortCareRecipientImmunizations = ({ immunizationsData, startDate, endDate }) => {
    const immunizations = immunizationsData?.careRecipientImmunizations?.immunizations ?? [];

    const sortedImmunizations = immunizations
        .filter((immunization) => {
            const immunizationDate = getHealthHistoryItemDate({
                dateDay: immunization.immunizationDateDay,
                dateMonth: immunization.immunizationDateMonth,
                dateYear: immunization.immunizationDateYear,
                dateRelativePeriodStart: immunization.immunizationDateRelativePeriodStart,
            });
            const immunizationIsWithinDateRangeFilters = immunizationDate > startDate && immunizationDate < endDate;
            return immunization.recordStatus == RecordStatus.Active && immunizationIsWithinDateRangeFilters;
        })
        .map((immunization) => {
            return { name: immunization.vaccineProductAdministered.name, date: immunization.immunizationDateYear };
        });
    return sortedImmunizations;
};

const sortCareRecipientAllergies = (allergiesData) => {
    const allergies = allergiesData?.careRecipientAllergies?.allergies ?? [];

    const sortedAllergies = allergies
        .filter((allergy) => {
            return allergy.recordStatus == RecordStatus.Active;
        })
        .map((allergy) => {
            //todo: implement allergy notes when that's a feature
            return { name: allergy.allergen.name, severity: capitalizeOnlyFirstLetter(allergy.severity), notes: '' };
        });
    return sortedAllergies.length ? sortedAllergies : [];
};

const sortPharmacies = (pharmacyData) => {
    const pharmacies = pharmacyData?.careRecipientPharmacies?.pharmacies ?? [];

    const sortedPharmacies = pharmacies
        .filter((pharmacy) => {
            return pharmacy.recordStatus == RecordStatus.Active;
        })
        .map((pharmacy) => {
            return {
                name: pharmacy.name,
                phoneNumber: formatPhoneNumber(pharmacy.phoneNumber),
                address: pharmacy.location.singleLineAddress,
            };
        });

    return sortedPharmacies;
};

export const useGetDataForPrintPages = (): IRecipientDataType => {
    const { data: photoData } = useGetCareRecipientPhotoQuery();

    const { data: careRecipientProfileData } = useGetCareRecipientProfileQuery();

    const { data: careTeamData } = useGetCareTeamQuery();

    const dataProfile = careRecipientProfileData?.careRecipientProfile;

    const careRecipientPrintInfo = [
        {
            bloodType: dataProfile?.bloodType ?? '',
            sex: dataProfile?.legalSex ?? '',
            phoneNumber: dataProfile?.phone ? formatPhoneNumber(dataProfile.phone) : '',
            email: dataProfile?.email ?? '',
            address: dataProfile?.address?.singleLineAddress ?? '',
        },
    ];

    const photoURL = photoData?.careRecipientPhoto?.careRecipientImageURL ?? defaultProfile;

    const birthday = dataProfile?.dOB
        ? getDateAtMidday(new Date(dataProfile?.dOB)).toLocaleDateString(locale, dateOptions)
        : '';

    const age = dataProfile?.dOB ? careRecipientAge(dataProfile?.dOB) : '';

    const emergencyContact = careTeamData?.usersCareCircle?.careCircleMembers?.filter(
        (member) => member.isEmergencyContact,
    )[0]?.careGiver;

    const recipientData = {
        careRecipientPhoto: photoURL,
        dateOfBirth: birthday,
        age: age,
        name: dataProfile?.firstName + ' ' + (dataProfile?.lastName ?? ''),
        emergencyContact: {
            name: emergencyContact?.displayName,
            phoneNumber: emergencyContact?.mobile,
        },
        me: careTeamData?.me?.displayName,
        timeZone: dataProfile?.timeZoneID,
        careRecipientPrintInfo,
    };

    return recipientData;
};

export const useGetHealthHistoryDataForPrintPages = (startDateFilter, endDateFilter): IHealthHistoryDataType => {
    const { data: careRecipientProfileData } = useGetCareRecipientProfileQuery();

    const { data: allergyData } = useGetAllergiesQuery();

    const { data: immunizationData } = useGetImmunizationsQuery();

    const { data: conditionData } = useGetCareRecipientConditionsQuery();

    const { data: providerData } = useGetProvidersQuery();

    const { data: pharmacyData } = useGetPharmaciesQuery();
    const careRecipientPharmacies = sortPharmacies(pharmacyData);
    const careRecipientProviders = sortProviders(providerData);
    const careRecipientConditions = sortCareRecipientConditions({
        conditionsData: conditionData,
        startDate: startDateFilter,
        endDate: endDateFilter,
    });
    const careRecipientImmunizations = sortCareRecipientImmunizations({
        immunizationsData: immunizationData,
        startDate: startDateFilter,
        endDate: endDateFilter,
    });
    const careRecipientAllergies = sortCareRecipientAllergies(allergyData);

    const dataProfile = careRecipientProfileData?.careRecipientProfile;

    const careRecipientPrintInfo = [
        {
            bloodType: dataProfile?.bloodType ?? '',
            phoneNumber: dataProfile?.phone ? formatPhoneNumber(dataProfile.phone) : '',
            email: dataProfile?.email ?? '',
            address: dataProfile?.address?.singleLineAddress ?? '',
        },
    ];

    const healthHistoryData = {
        careRecipientPrintInfo,
        careRecipientAllergies,
        careRecipientImmunizations,
        careRecipientConditions,
        careRecipientProviders,
        careRecipientPharmacies,
    };

    return healthHistoryData;
};
