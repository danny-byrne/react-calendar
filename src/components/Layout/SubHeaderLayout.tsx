import React from "react";

import {
  Stack,
  Text,
  IconButton,
  Separator,
  PrimaryButton,
} from "@fluentui/react";
import { getClassNames } from "./SubHeaderLayout.classNames";
import { useIsMobile } from "@src/common/hooks/useMediaQueries";

import { useWindowDimensions } from "@src/common/hooks/useMediaQueries";

export interface SubHeaderLayoutProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  actionButtonText?: string;
  actionButtonDisabled?: boolean;
  onClickActionButton?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  deleteButtonDisabled?: boolean;
  isPanel?: boolean;
  customHeaderChildren?: any;
  onClickUploadDocument?: (e) => void;
  showActionButton?: boolean;
}

const mobileHeightOffset: number = 200;

const SubHeaderLayout: React.FC<SubHeaderLayoutProps> = ({
  children,
  title,
  onClose,
  actionButtonText,
  actionButtonDisabled,
  onClickActionButton,
  onDelete,
  onShare,
  deleteButtonDisabled,
  isPanel,
  customHeaderChildren,
  onClickUploadDocument,
  showActionButton = true,
}) => {
  let { height } = useWindowDimensions();
  const isMobile = useIsMobile();
  height = isMobile ? height - mobileHeightOffset : height;

  const classNames = getClassNames(height, isPanel);

  const documentUploader = React.useRef(null);

  const handleOnClick = () => {
    documentUploader.current.click();
  };

  return (
    <div className={classNames["wc-SubHeaderLayout--centeringContainer"]}>
      {/* Button row should only render on mobile when it's wrapping a panel */}
      {(!isMobile || isPanel) && (
        <div className={classNames["wc-SubHeaderLayout--container"]}>
          <div className={classNames["wc-SubHeaderLayout--subHeader"]}>
            <div>
              <Text className={classNames["wc-SubHeaderLayout--subHeaderText"]}>
                {title}
              </Text>
            </div>
            <Stack
              className={classNames["wc-SubHeaderLayout--rightSide"]}
              horizontal
              tokens={{ childrenGap: 16 }}
            >
              {actionButtonText && (
                <>
                  {showActionButton && (
                    <PrimaryButton
                      data-testid={actionButtonText}
                      text={actionButtonText}
                      className={classNames["wc-SubHeaderLayout--editButton"]}
                      onClick={() => {
                        if (onClickUploadDocument) {
                          handleOnClick();
                        } else {
                          onClickActionButton();
                        }
                      }}
                      disabled={actionButtonDisabled}
                    />
                  )}
                  <input
                    ref={documentUploader}
                    type="file"
                    onChange={onClickUploadDocument}
                    style={{
                      display: "none",
                    }}
                  />
                </>
              )}
              {/* Conditionally render buttons dependent on whether or not 
                            they have an onClick function */}
              {onShare && (
                <IconButton
                  data-testid={"Share"}
                  className={classNames["wc-SubHeaderLayout--removeButton"]}
                  ariaLabel={"share-button"}
                  iconProps={{ iconName: "Share" }}
                  onClick={() => {
                    onShare();
                  }}
                />
              )}
              {onDelete && (
                <IconButton
                  data-testid={"Delete"}
                  className={classNames["wc-SubHeaderLayout--removeButton"]}
                  ariaLabel={"remove-button"}
                  iconProps={{ iconName: "Delete" }}
                  onClick={() => {
                    onDelete();
                  }}
                  disabled={deleteButtonDisabled}
                />
              )}
              {onClose && (
                <IconButton
                  data-testid={"Cancel"}
                  className={classNames["wc-SubHeaderLayout--removeButton"]}
                  ariaLabel={"cancel-button"}
                  iconProps={{ iconName: "Cancel" }}
                  onClick={() => {
                    onClose();
                  }}
                  disabled={false}
                />
              )}
              {customHeaderChildren}
            </Stack>
          </div>
          <Separator className={classNames["wc-SubHeaderLayout--separator"]} />
        </div>
      )}
      <div className={classNames["wc-SubHeaderLayout--contentContainer"]}>
        {children}
      </div>
    </div>
  );
};

export default SubHeaderLayout;
