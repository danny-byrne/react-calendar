/*eslint-disable*/
import {
  TextField,
  DatePicker,
  DayOfWeek,
  Dropdown,
  Stack,
  Checkbox,
  Separator,
  ResponsiveMode,
  DropdownMenuItemType,
} from "@fluentui/react";
import { FormikProps } from "formik";
import ToggleRow from "@src/components/ToggleRow";
// import {
//     useGetPharmaciesLazyQuery,
//     useGetCareRecipientConditionsLazyQuery,
//     useGetProvidersLazyQuery,
//     RecordStatus,
// } from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import React, { useEffect, useState } from "react";
import { Dose } from "./MedicationMutationTypes";
import { getClassNames } from "./MedicationForm.classNames";
import { theme } from "src/theme";

import { useFeedbackService } from "src/services/FeedbackService";
import { ERROR_MESSAGES } from "src/app/Strings";
import { Provider } from "src/types/Provider";
// import { PharmacyForm, ProviderForm } from "src/common/components/Form";
import { Pharmacy } from "src/types/Pharmacy";
// import ConditionSearch from "src/common/components/AutoCompleteSearch/ConditionSearch/ConditionSearch";
import { addNewText } from "src/helpers/medications";
import { getDateAtMidday, getToday } from "src/utils/dates";
import {
  dropdownErrorStyles,
  datepickerErrorStyles,
} from "src/features/Medications/constants";
import DosageForm, { DosageFormValues } from "./Schedule/DosageForm";

export interface MedicationFormikType {
  strength?: string;
  id?: string;
  conditionId?: string;
  refillId?: string;
  medicationId?: string;
  name: string;
  directions: string;
  condition: {
    conditionId?: string;
    conditionOccurrenceId?: string;
    name?: string;
  };
  refillChecked: boolean;
  scheduleChecked: boolean;
  refillDate: Date;
  doses: Dose[];
  dosageValues: DosageFormValues;
  startDate: Date;
  whichdays: number[];
  scheduleIntervalStartTime: string;
  scheduleIntervalEndTime?: string;
  scheduleInterval?: number;
  overTheCounter?: boolean;
  dateOverlap?: string;
  provider: {
    providersAvailable: boolean;
    phone: string;
    nPI: string;
    firstName: string;
    lastName: string;
    newProvider: boolean;
    id: string;
    displayAddress?: string;
    freeTextAddress?: string;
    providerSelected: boolean;
    address: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      country: string;
      state: string;
      zipCode: string;
    };
    other?: boolean;
  };
  pharmacy: {
    id?: string;
    name?: string;
    phoneNumber: string;
    location: {
      addressLine1: string;
      city: string;
      country: string;
      state: string;
      zipCode: string;
      singleLineAddress?: string;
      freeTextAddress?: string;
    };
    other?: boolean;
  };
  noConditionSelected: any;
}

interface IMedicationFormProps {
  formik: FormikProps<{
    id?: string;
    conditionId?: string;
    refillId?: string;
    medicationId?: string;
    name: string;
    condition: {
      conditionId?: string;
      conditionOccurrenceId?: string;
      name?: string;
    };
    refillChecked: boolean;
    scheduleChecked: boolean;
    refillDate: Date;
    frequency?: string;
    timesPerDay?: string | number;
    doses: Dose[];
    dosageValues: DosageFormValues;
    startDate: Date;
    stopDate?: Date;
    whichdays: number[];
    scheduleIntervalStartTime: string;
    scheduleIntervalEndTime?: string;
    scheduleInterval?: number;
    overTheCounter?: boolean;
    dateOverlap?: string;
    provider: {
      providersAvailable: boolean;
      phone: string;
      nPI: string;
      firstName: string;
      lastName: string;
      newProvider: boolean;
      id: string;
      displayAddress?: string;
      providerSelected: boolean;
      address: {
        addressLine1: string;
        city: string;
        country: string;
        state: string;
        zipCode: string;
      };
      other?: boolean;
    };
    pharmacy: {
      id?: string;
      name?: string;
      phoneNumber: string;
      location: {
        addressLine1: string;
        city: string;
        country: string;
        state: string;
        zipCode: string;
        freeTextAddress?: string;
        singleLineAddress?: string;
      };
      other?: boolean;
    };
    noConditionSelected?: string;
  }>;

  setProvidersAvailable: () => void;
}

const MedicationForm: React.FC<IMedicationFormProps> = (props) => {
  const { formik, setProvidersAvailable } = props;

  const { setErrorToast } = useFeedbackService();
  const classNames = getClassNames();

  const currentDate = getToday();
  const stackTokens = { childrenGap: 10 };

  const [currentProviders, setCurrentProviders] = useState<Provider[]>([]);
  const [currentConditions, setCurrentConditions] = useState([]);
  const [newProvider, setNewProvider] = useState(false);
  const [currentPharmacies, setCurrentPharmacies] = useState<Pharmacy[]>([]);
  const [newPharmacy, setNewPharmacy] = useState(false);
  const [newCondition, setNewCondition] = useState(false);
  const [pharmacyDataLoaded, setPharmacyDataLoaded] = useState(false);
  const [providerDataLoaded, setProviderDataLoaded] = useState(false);

  const [searchCurrentProviders, { loading: searchProvidersLoading }] =
    useGetProvidersLazyQuery({
      onError: () => {
        setErrorToast(ERROR_MESSAGES.GET_PROVIDERS);
      },
    });

  const [searchCurrentPharmacies, { loading: searchPharmaciesLoading }] =
    useGetPharmaciesLazyQuery({
      onError: () => {
        setErrorToast(ERROR_MESSAGES.GET_PHARMACIES);
      },
    });

  const [getCurrentConditions] = useGetCareRecipientConditionsLazyQuery();

  useEffect(() => {
    const getProviders = async () => {
      const results = await searchCurrentProviders();
      const avaiableProviders =
        results.data.careRecipientProviders.providers.filter(
          (provider) => provider.recordStatus == RecordStatus.Active
        );
      setCurrentProviders(avaiableProviders);
      if (Boolean(avaiableProviders.length)) {
        setProvidersAvailable();
      }
      setProviderDataLoaded(true);
    };

    const getPharmacies = async () => {
      const results = await searchCurrentPharmacies();
      setCurrentPharmacies(results.data.careRecipientPharmacies?.pharmacies);
      setPharmacyDataLoaded(true);
    };

    getProviders();
    getPharmacies();
  }, [formik.values.overTheCounter]);

  useEffect(() => {
    const getConditions = async () => {
      const results = await getCurrentConditions();
      const activeConditions =
        results.data.careRecipientConditions.conditions.filter(
          (condition) =>
            condition.recordStatus == RecordStatus.Active &&
            !condition.conditionEndDateRelativePeriodStart &&
            !condition.conditionEndDateYear
        );
      setCurrentConditions(activeConditions);
    };
    getConditions();
  }, []);

  const getProviderDropdown = () => {
    const providerKeys = currentProviders.map((provider) => {
      return {
        key: provider.id,
        text: `${provider.firstName} ${provider.lastName}`,
        val: provider,
      };
    });
    const addNew = {
      key: addNewText,
      text: "Add New",
      val: "",
    };
    const alreadyAddedHeader = {
      key: "alreadyAddedHeader",
      // TODO: Update to be ${careRecipientName}'s Providers once implemented
      text: "Already Added",
      itemType: DropdownMenuItemType.Header,
    };
    const output = [alreadyAddedHeader, ...providerKeys, addNew];

    return output;
  };

  const providerDropdown = getProviderDropdown();

  const activePharmacies = currentPharmacies.filter(
    (pharmacy) => pharmacy.recordStatus == RecordStatus.Active
  );

  const getPharmacyDropdown = () => {
    const pharmacyKeys = activePharmacies.map((pharmacy) => {
      return {
        key: pharmacy.id,
        text: `${pharmacy.name}${
          pharmacy.location.singleLineAddress ? ", " : ""
        }${pharmacy.location.singleLineAddress}`,
        val: pharmacy,
      };
    });
    const addNew = {
      key: addNewText,
      text: "Add New",
      val: "",
    };
    const alreadyAddedHeader = {
      key: "alreadyAddedHeader",
      // TODO: Update to be ${careRecipientName}'s Providers once implemented
      text: "Already Added",
      itemType: DropdownMenuItemType.Header,
    };
    const output = [alreadyAddedHeader, ...pharmacyKeys, addNew];

    return output;
  };

  const pharmacyDropdown = getPharmacyDropdown();

  const getConditionDropdown = () => {
    const conditionDropdownOptions = currentConditions.map((condition) => {
      return {
        key: condition.id,
        text: condition.condition.name,
        val: condition,
      };
    });

    const addNew = {
      key: addNewText,
      text: "Add New",
      val: "",
    };

    //TODO: pull in Care Recipient name to prefix text here
    const existingConditionsHeader = {
      key: "alreadyExistingConditionsHeader",
      text: `Conditions`,
      itemType: DropdownMenuItemType.Header,
    };

    const output = [
      existingConditionsHeader,
      ...conditionDropdownOptions,
      addNew,
    ];

    return output;
  };

  const conditionDropdown = getConditionDropdown();

  const getConditionId = (item) => {
    let { key } = item;
    let conditionId = currentConditions.find((condition) => {
      return condition.id === key;
    }).condition.id;
    return conditionId;
  };

  const showConditionsDropdown = Boolean(currentConditions.length);
  const showProviderDropdown = Boolean(currentProviders.length);
  const showProviderSearch = newProvider || !showProviderDropdown;

  const showPharmacyDropdown = Boolean(activePharmacies.length);
  const showPharmacySearch = newPharmacy || !showPharmacyDropdown;

  const setConditionFieldsForNew = () => {
    const initAddNewCondition = {
      conditionOccurrenceId: addNewText,
      name: null,
      iCD10Code: null,
      conditionId: null,
    };
    formik.setFieldValue("condition", initAddNewCondition);
  };

  const setProviderFieldsForNew = () => {
    formik.setFieldValue("provider.id", addNewText);
    formik.setFieldValue("provider.phone", "");
    formik.setFieldValue("provider.nPI", "");
    formik.setFieldValue("provider.firstName", "");
    formik.setFieldValue("provider.lastName", "");
    formik.setFieldValue("provider.address.addressLine1", "");
    formik.setFieldValue("provider.address.city", "");
    formik.setFieldValue("provider.address.state", "");
    formik.setFieldValue("provider.address.country", "");
    formik.setFieldValue("provider.address.zipCode", "");
    formik.setFieldValue("provider.other", false);
  };

  const setPharmacyFieldsForNew = () => {
    formik.setFieldValue("pharmacy.id", addNewText);
    formik.setFieldValue("pharmacy.phoneNumber", "");
    formik.setFieldValue("pharmacy.name", "");
    formik.setFieldValue("pharmacy.location.addressLine1", "");
    formik.setFieldValue("pharmacy.location.city", "");
    formik.setFieldValue("pharmacy.location.state", "");
    formik.setFieldValue("pharmacy.location.country", "");
    formik.setFieldValue("pharmacy.location.zipCode", "");
    formik.setFieldValue("pharmacy.location.freeTextAddress", "");
  };

  const providersHaveBeenLoadedAndAreEmpty =
    providerDataLoaded &&
    !showProviderDropdown &&
    formik.values.provider.id !== addNewText;

  const pharmaciesHaveBeenLoadedAndAreEmpty =
    pharmacyDataLoaded &&
    !showPharmacyDropdown &&
    formik.values.pharmacy.id !== addNewText;

  if (providersHaveBeenLoadedAndAreEmpty) {
    setProviderFieldsForNew();
  }

  if (pharmaciesHaveBeenLoadedAndAreEmpty) {
    setPharmacyFieldsForNew();
  }

  const requireProvider =
    !formik.values.overTheCounter &&
    showProviderDropdown &&
    formik.values.provider.id === addNewText;

  const refillHasError =
    formik.touched.refillDate && (formik.errors?.refillDate as string);

  const noConditionSelectedError = formik?.errors?.noConditionSelected;
  return (
    <>
      {showConditionsDropdown && (
        <Dropdown
          id="conditions"
          className={classNames["wc-MedicationForm--conditionsDropdown"]}
          label="Condition"
          selectedKey={formik.values.condition.conditionOccurrenceId}
          onChange={(_, item) => {
            if (item.key === addNewText) {
              setNewCondition(true);
              setConditionFieldsForNew();
            } else {
              formik.setFieldValue("condition.iCD10Code", null);
              formik.setFieldValue("condition.name", null);
              formik.setFieldValue(
                "condition.conditionId",
                getConditionId(item)
              );
              formik.setFieldValue("condition.conditionOccurrenceId", item.key);
              setNewCondition(false);
            }
          }}
          options={conditionDropdown}
          placeholder="What is this used to treat?"
          responsiveMode={ResponsiveMode.large}
          styles={noConditionSelectedError ? dropdownErrorStyles : null}
          errorMessage={noConditionSelectedError}
        />
      )}
      {(newCondition || !showConditionsDropdown) && (
        <>
          <ConditionSearch
            formik={formik}
            fromMedManagerView
            aria-label="Condition Search"
            showLabel={!showConditionsDropdown}
          />
        </>
      )}
      <TextField
        // Fluent custom styles can't be applied with classNames
        styles={{
          fieldGroup: {
            height: "72px",
          },
          field: {
            lineHeight: "20px",
          },
        }}
        multiline
        rows={2}
        label="Instructions"
        name="directions"
        resizable={false}
        {...formik.getFieldProps("directions")}
      />
      <Separator />
      <ToggleRow
        aria-label="Add to Schedule?"
        text="Add to schedule?"
        testId="scheduleToggle"
        bold
        checked={formik.values.scheduleChecked}
        onChange={(e, checked) => {
          trackFieldChanged("scheduleToggle");
          formik.setFieldValue("scheduleChecked", checked);
        }}
      />

      {formik.values.scheduleChecked && (
        <>
          <DosageForm formik={formik} />
        </>
      )}
      <Separator />

      <ToggleRow
        text="Has this been prescribed?"
        testId="prescribedToggle"
        bold
        checked={!formik.values.overTheCounter}
        onChange={(e, checked) => {
          trackFieldChanged("prescribedToggle");
          formik.setFieldValue("overTheCounter", !checked);
          // Reset refill info if the user sets the medication to OTC
          if (!checked) {
            setNewProvider(false);

            formik.setFieldValue("refillChecked", false);

            formik.setFieldValue("provider.id", "");
            formik.setFieldValue("provider.phone", "");
            formik.setFieldValue("provider.nPI", "");
            formik.setFieldValue("provider.firstName", "");
            formik.setFieldValue("provider.lastName", "");

            formik.setFieldValue("provider.address.addressLine1", "");
            formik.setFieldValue("provider.address.city", "");
            formik.setFieldValue("provider.address.state", "");
            formik.setFieldValue("provider.address.country", "");
            formik.setFieldValue("provider.address.zipCode", "");
            formik.setFieldValue("provider.other", false);

            formik.setFieldValue("pharmacy.id", "");
            formik.setFieldValue("pharmacy.phoneNumber", "");
            formik.setFieldValue("pharmacy.name", "");

            formik.setFieldValue("pharmacy.location.addressLine1", "");
            formik.setFieldValue("pharmacy.location.city", "");
            formik.setFieldValue("pharmacy.location.state", "");
            formik.setFieldValue("pharmacy.location.country", "");
            formik.setFieldValue("pharmacy.location.zipCode", "");
            formik.setFieldValue("pharmacy.location.freeTextAddress", "");
          }
        }}
      />
      {!formik.values.overTheCounter && (
        <>
          {showProviderDropdown && (
            <Dropdown
              id="currentProviders"
              className={classNames["wc-MedicationForm--numberOfRefills"]}
              label="Provider"
              selectedKey={formik.values.provider.id}
              onChange={(_, item) => {
                setNewProvider(item.key === addNewText);

                //id is checked for 'addNew' in setPrescriptionInput function
                // If current provider is selected, only id is needed for mutation
                formik.setFieldValue("provider.id", item.key);
                formik.setFieldValue("provider.phone", "");
                formik.setFieldValue("provider.nPI", "");
                formik.setFieldValue("provider.firstName", "");
                formik.setFieldValue("provider.lastName", "");

                formik.setFieldValue("provider.address.addressLine1", "");
                formik.setFieldValue("provider.address.city", "");
                formik.setFieldValue("provider.address.state", "");
                formik.setFieldValue("provider.address.country", "");
                formik.setFieldValue("provider.address.zipCode", "");
                formik.setFieldValue("provider.other", false);
              }}
              placeholder="Who prescribed this medication?"
              options={providerDropdown}
              responsiveMode={ResponsiveMode.large}
            />
          )}
          {showProviderSearch && (
            <ProviderForm
              formik={formik}
              providerRequired={requireProvider}
              errors={formik.errors}
            />
          )}
          <Checkbox
            data-testid={"refillToggle"}
            styles={theme.components.Checkbox.styles}
            label="This prescription has refills"
            checked={formik.values.refillChecked}
            onChange={(e, checked) => {
              trackFieldChanged("refillToggle");
              formik.setFieldValue("refillChecked", checked);
            }}
          />
          {formik.values.refillChecked && (
            <Stack>
              <DatePicker
                id="refillDate"
                className={classNames["wc-MedicationForm--nextRefillDate"]}
                label="Next Refill Date"
                firstDayOfWeek={DayOfWeek.Sunday}
                placeholder="Select a date..."
                isRequired
                onSelectDate={(date) => {
                  trackFieldChanged("refillDate");
                  formik.setFieldValue("refillDate", getDateAtMidday(date));
                }}
                {...formik.getFieldProps("refillDate")}
                minDate={currentDate}
                textField={{ errorMessage: refillHasError }}
                styles={refillHasError && datepickerErrorStyles}
                onAfterMenuDismiss={() =>
                  formik.setTouched({ ...formik.touched, refillDate: true })
                }
              />

              {showPharmacyDropdown && (
                <Dropdown
                  id="currentPharmacies"
                  className={classNames["wc-MedicationForm--numberOfRefills"]}
                  label="Pharmacy"
                  selectedKey={formik.values.pharmacy.id}
                  onChange={(_, item) => {
                    setNewPharmacy(item.key === addNewText);

                    //id is checked for 'addNew' in setPrescriptionInput function
                    // If current pharmacy is selected, only id is needed for mutation
                    formik.setFieldValue("pharmacy.id", item.key);
                    formik.setFieldValue("pharmacy.phoneNumber", "");
                    formik.setFieldValue("pharmacy.name", "");

                    formik.setFieldValue("pharmacy.location.addressLine1", "");
                    formik.setFieldValue("pharmacy.location.city", "");
                    formik.setFieldValue("pharmacy.location.state", "");
                    formik.setFieldValue("pharmacy.location.country", "");
                    formik.setFieldValue("pharmacy.location.zipCode", "");
                    formik.setFieldValue(
                      "pharmacy.location.freeTextAddress",
                      ""
                    );
                  }}
                  placeholder="Select a pharmacy"
                  options={pharmacyDropdown}
                  responsiveMode={ResponsiveMode.large}
                />
              )}
              {showPharmacySearch && <PharmacyForm formik={formik} />}
            </Stack>
          )}
        </>
      )}
    </>
  );
};

export default MedicationForm;
