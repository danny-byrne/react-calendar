import React from "react";
import { Stack, Persona } from "@fluentui/react";
import { AvatarSizes } from "@src/common/components/Avatar";
import { getClassNames } from "./PrintableContentContainer.classNames";

import { formatPhoneNumber } from "@src/utils/utils";
import { IRecipientDataType } from "@src/common/hooks/useGetDataForPrintPages";

const stackTokens = { childrenGap: 5 };

interface IPrintablePageHeaderProps {
  recipientData: IRecipientDataType;
}

const classNames = getClassNames();

const PrintablePageHeader: React.FC<IPrintablePageHeaderProps> = ({
  recipientData,
}) => {
  return (
    <>
      <Stack
        className={classNames["wc-PrintableContent--headerContent"]}
        verticalAlign="space-between"
      >
        <Stack horizontal horizontalAlign="space-between">
          <PersonalDetailsHeaderSection recipientData={recipientData} />
          <EmergencyContactHeaderSection recipientData={recipientData} />
        </Stack>
        <div className={classNames["wc-PrintableContent--horizontalLine"]} />
      </Stack>
    </>
  );
};

const PersonalDetailsHeaderSection: React.FC<IPrintablePageHeaderProps> = ({
  recipientData,
}) => {
  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
      <Persona
        hidePersonaDetails
        imageUrl={recipientData.careRecipientPhoto}
        data-testid="avatar"
        size={AvatarSizes.large}
        text={recipientData.name}
      />
      <Stack
        tokens={stackTokens}
        className={classNames["wc-PrintableContent--headerContent--details"]}
      >
        <div className={classNames["wc-PrintableContent--semiBoldText"]}>
          {recipientData.name}
        </div>
        <div>Birthday: {recipientData.dateOfBirth}</div>
        <div>Age: {recipientData.age}</div>
      </Stack>
    </Stack>
  );
};

const EmergencyContactHeaderSection: React.FC<IPrintablePageHeaderProps> = ({
  recipientData,
}) => {
  const emContactName = recipientData?.emergencyContact?.name;

  return (
    <Stack tokens={stackTokens}>
      {emContactName && (
        <>
          <div className={classNames["wc-PrintableContent--semiBoldText"]}>
            Emergency Contact:
          </div>
          <div className={classNames["wc-PrintableContent--EmContactName"]}>
            {emContactName}
          </div>
          <div>
            {formatPhoneNumber(recipientData.emergencyContact.phoneNumber)}
          </div>
        </>
      )}
    </Stack>
  );
};

export default PrintablePageHeader;
