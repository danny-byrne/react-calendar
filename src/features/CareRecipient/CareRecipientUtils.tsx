import { IChoiceGroupOption, Stack, TextField } from "@fluentui/react";
import React from "react";
// import { BloodTypes, MeasurementSystem } from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import { getDateAtMidday } from "@src/utils/dates";
import { formatPhoneNumber } from "@src/utils/utils";
import {
  isValidEmail,
  isValidFeet,
  isValidInches,
} from "@src/utils/validators";
import { getClassNames } from "./CareRecipient.classNames";

const classNames = getClassNames();

const setInitValues = (dataProfile, photoChanged, timezone) => {
  const imperial =
    dataProfile?.measurementSystemPreference === MeasurementSystem.Imperial;
  const formattedPhoneNumber = dataProfile?.phone
    ? formatPhoneNumber(dataProfile.phone)
    : "";

  return {
    firstName: dataProfile?.firstName ?? "",
    lastName: dataProfile?.lastName ?? "",
    email: dataProfile?.email ?? "",
    phone: formattedPhoneNumber,
    address: {
      addressLine1: dataProfile?.address?.addressLine1 ?? "",
      city: dataProfile?.address?.city ?? "",
      country: dataProfile?.address?.country ?? "",
      state: dataProfile?.address?.state ?? "",
      zipCode: dataProfile?.address?.zipCode ?? "",
      displayAddress: dataProfile?.address?.freeTextAddress ?? "",
    },
    timezone: timezone,
    measurementSystemPreference:
      dataProfile?.measurementSystemPreference ?? MeasurementSystem.Imperial,
    feet:
      dataProfile?.height && imperial ? convertToFeet(dataProfile?.height) : "",
    inches:
      dataProfile?.height && imperial
        ? convertToInches(dataProfile?.height)
        : "",
    pounds:
      dataProfile?.weight && imperial
        ? Number((Number(dataProfile?.weight) * kilogramsToPounds).toFixed(2))
        : "",
    meters:
      dataProfile?.height && !imperial
        ? Number(dataProfile?.height / 100).toFixed(0)
        : "",
    centimeters:
      dataProfile?.height && !imperial ? Number(dataProfile?.height % 100) : "",
    kilograms:
      dataProfile?.weight && !imperial ? Number(dataProfile?.weight) : "",
    bloodType: dataProfile?.bloodType ?? null,
    dOB: dataProfile?.dOB ? getDateAtMidday(new Date(dataProfile?.dOB)) : null,
    photoChanged: photoChanged ? photoChanged : false,
  };
};
const onKeyDown = (
  ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  pattern: RegExp
) => {
  if (!pattern.test(ev.key)) {
    ev.preventDefault();
  }
};

const getErrorMessageEmail = (value: string): string => {
  if (!value) {
    return "";
  }
  if (!isValidEmail(value)) {
    return `Please enter a valid email address.`;
  }
};

const getErrorMessageFeet = (value: string): string => {
  if (!isValidFeet(value)) {
    return `Please enter a valid height.`;
  }
};

const getErrorMessageInches = (value: string): string => {
  if (!isValidInches(value)) {
    return `Please enter a valid height.`;
  }
};

const bloodTypeDropDown = [
  { key: "A-", text: "A-" },
  { key: "A+", text: "A+" },
  { key: "AB-", text: "AB-" },
  { key: "AB+", text: "AB+" },
  { key: "B-", text: "B-" },
  { key: "B+", text: "B+" },
  { key: "O-", text: "O-" },
  { key: "O+", text: "O+" },
];

const measurementSystemPreferenceChoiceGroupOptions: IChoiceGroupOption[] = [
  { key: "Imperial (USA)", text: "Imperial (USA)" },
  { key: "Metric", text: "Metric" },
];
const centimetersToInches = 2.54;
const kilogramsToPounds = 2.205;

const convertToInches = (height) => {
  return Number(((Number(height) / centimetersToInches) % 12).toFixed(2));
};
const convertToFeet = (height) => {
  return (
    (Number(height) / centimetersToInches - Number(convertToInches(height))) /
    12
  ).toFixed(0);
};

const HeightWeightFields = (formik) => {
  const system = formik.values?.measurementSystemPreference;
  const imperial = system === MeasurementSystem.Imperial;
  const primaryHeight = imperial ? "feet" : "meters";
  const secondaryHeight = imperial ? "inches" : "centimeters";
  const weight = imperial ? "pounds" : "kilograms";

  return (
    <>
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <TextField
          label={"Height - " + primaryHeight}
          name={primaryHeight}
          onKeyDown={(ev) => onKeyDown(ev, /[.,A-Za-z0-9\b\0 ]/)}
          {...formik.getFieldProps(primaryHeight)}
          onGetErrorMessage={getErrorMessageFeet}
          deferredValidationTime={1000}
          className={classNames["wc-CareRecipient--Stack"]}
        />
        <TextField
          label={secondaryHeight}
          name={secondaryHeight}
          onKeyDown={(ev) => onKeyDown(ev, /[.,A-Za-z0-9\b\0 ]/)}
          onGetErrorMessage={getErrorMessageInches}
          deferredValidationTime={1000}
          {...formik.getFieldProps(secondaryHeight)}
          className={classNames["wc-CareRecipient--Stack"]}
        />
      </Stack>
      <TextField
        label={"Weight (" + weight + ")"}
        name={weight}
        onKeyDown={(ev) => onKeyDown(ev, /[.,A-Za-z0-9\b\0 ]/)}
        {...formik.getFieldProps(weight)}
      />
    </>
  );
};

const careRecipientAge = (dOB) => {
  if (dOB) {
    const today = getDateAtMidday(new Date());
    const birthDate = getDateAtMidday(new Date(dOB));
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  }
  return "";
};

export {
  setInitValues,
  onKeyDown,
  getErrorMessageEmail,
  getErrorMessageFeet,
  getErrorMessageInches,
  bloodTypeDropDown,
  centimetersToInches,
  kilogramsToPounds,
  convertToInches,
  convertToFeet,
  measurementSystemPreferenceChoiceGroupOptions,
  HeightWeightFields,
  careRecipientAge,
};
