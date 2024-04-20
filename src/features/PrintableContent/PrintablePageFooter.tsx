import React from "react";
import { Stack } from "@fluentui/react";

import { getClassNames } from "./PrintableContentContainer.classNames";
import { MicrosoftLogo } from "@src/assets/Misc/MicrosoftLogo/MicrosoftLogo";
import { IRecipientDataType } from "@src/common/hooks/useGetDataForPrintPages";

const stackTokens = { childrenGap: 5 };

interface IPageFooterProps {
  includePageBreak: boolean;
  pageNumber: number;
  recipientData: IRecipientDataType;
}
const PrintablePageFooter: React.FC<IPageFooterProps> = ({
  includePageBreak,
  pageNumber,
  recipientData,
}) => {
  const classNames = getClassNames();

  return (
    <Stack className={classNames["wc-PrintableContent--footerContent"]}>
      <Stack horizontal horizontalAlign="space-between">
        <div>Windcrest</div>
        <div>Printed By: {recipientData.me}</div>
      </Stack>
      <Stack horizontal horizontalAlign="space-between">
        <div>For reference only. For information contact care circle admin</div>
        <Stack
          horizontal
          tokens={stackTokens}
          className={classNames["wc-PrintableContent--msLogo"]}
        >
          <MicrosoftLogo monotone />
          <div>Microsoft</div>
        </Stack>
      </Stack>
      <Stack horizontal horizontalAlign="center">
        <div>{`Pg ${pageNumber}`}</div>
      </Stack>
      {includePageBreak && (
        <div className={classNames["wc-PrintableContent--pageBreak"]} />
      )}
    </Stack>
  );
};

export default PrintablePageFooter;
