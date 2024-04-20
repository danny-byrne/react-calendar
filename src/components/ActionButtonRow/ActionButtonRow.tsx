import React from "react";
import { useQueryStringParams } from "@src/common/hooks/useQueryStringParams";

import { Stack, PrimaryButton, IconButton } from "@fluentui/react";
import { Separator } from "@fluentui/react";

import { getClassNames } from "./ActionButtonRow.classNames";

interface IActionButtonRowProps {
  onDelete?: () => void;
  hideSeparator?: boolean;
  // Whether the row is inline with the back button or in it's own row
  inLine?: boolean;
}

const ActionButtonRow: React.FC<IActionButtonRowProps> = ({
  onDelete,
  hideSeparator = false,
  inLine = false,
}) => {
  const classNames = getClassNames(inLine);
  const actionButtonText = "Edit";
  const { addSearchParam } = useQueryStringParams();
  const showEditPanel = () => addSearchParam({ mode: "edit" });

  return (
    <>
      <Stack className={classNames["wc-ActionButtonRow--buttonRow"]} horizontal>
        <PrimaryButton
          data-testid={actionButtonText}
          text={actionButtonText}
          onClick={showEditPanel}
          type="submit"
        />

        {onDelete && (
          <IconButton
            data-testid={"Delete"}
            className={classNames["wc-ActionButtonRow--removeButton"]}
            iconProps={{ iconName: "Delete" }}
            onClick={onDelete}
          />
        )}
      </Stack>
      {!hideSeparator && (
        <Separator
          className={classNames["wc-ActionButtonRow--buttonSeparator"]}
        />
      )}
    </>
  );
};

export default ActionButtonRow;
