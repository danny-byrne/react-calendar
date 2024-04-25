// import { useGetCareRecipientProfileQuery } from "@src/graphQL/serverMocks/graphQLGeneratedCode";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useGetTimezoneInfo = () => {
  // const { data: careRecipientProfileData } = useGetCareRecipientProfileQuery();
  // const careRecipientTimezone =
  //   careRecipientProfileData?.careRecipientProfile?.timeZoneID;
  const appUserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // console.log({ appUserTimezone });
  const careRecipientTimezone = appUserTimezone;
  const careRecipientTimezoneFormatted = removeUnderscoreFromTimezone(
    careRecipientTimezone
  );

  return {
    appUserTimezone,
    careRecipientTimezone,
    careRecipientTimezoneFormatted,
  };
};

export const getAdjustedTime = ({
  startDateTime,
  endDateTime,
  careRecipientTimezone,
  appUserTimezone,
}) => {
  const careRecipeintStartTimeLocal = dayjs(startDateTime)
    .tz(careRecipientTimezone)
    .format("h:mm A");
  const careRecipientEndTimeLocal = dayjs(endDateTime)
    .tz(careRecipientTimezone)
    .format("h:mm A");
  const appUserStartTimeLocal = dayjs(startDateTime)
    .tz(appUserTimezone)
    .format("h:mm A");

  const careRecipientTimezoneFormatted = removeUnderscoreFromTimezone(
    careRecipientTimezone
  );

  const timeText = `${careRecipeintStartTimeLocal} - ${careRecipientEndTimeLocal} ${careRecipientTimezoneFormatted}`;

  return {
    timeText,
    careRecipientEndTimeLocal,
    careRecipientTimezone,
    appUserStartTimeLocal,
  };
};

export const getTimezoneOffsetForCareRecipient = ({
  careRecipientTimezone,
  dateTime,
}) => {
  return dayjs(dateTime).tz(careRecipientTimezone).format();
};

const removeUnderscoreFromTimezone = (timezone) => {
  return timezone?.replace(/_/g, " ") ?? null;
};
