import React from "react";
import { Stack, Icon } from "@fluentui/react";

import Avatar, { AvatarSizes } from "@src/common/components/Avatar";

import {
  getClassNames,
  ACTIVITY_TOKEN_GAP,
} from "./ActivitiesPrint.classNames";
import PrintablePageHeader from "@src/features/PrintableContent/PrintablePageHeader";
import PrintablePageFooter from "@src/features/PrintableContent/PrintablePageFooter";
import { formatPhoneNumber } from "@src/utils/utils";
import { IRecipientDataType } from "@src/common/hooks/useGetDataForPrintPages";

const stackTokens = { childrenGap: 5 };

const COLUMN_TITLES = ["Activity Name", "Phone", "Availability", "Details"];

const ITEMS_PER_PAGE = 5;

const classNames = getClassNames();

const titleColumns = (
  <Stack
    horizontal
    className={classNames["wc-ActivitiesPrint--columnNamesContainer"]}
  >
    {COLUMN_TITLES.map((title) => {
      return (
        <div
          key={title}
          className={classNames["wc-ActivitiesPrint--ActivitiesGridLabel"]}
        >
          {title}
        </div>
      );
    })}
  </Stack>
);

interface IHeaderProps {
  showActivitiesLabel: boolean;
}

interface IActivitiesPrintProps {
  experiences: any;
  recipientData: IRecipientDataType;
}

interface IActivityPageProps {
  experiences: any;
  pageNumber: number;
}

const ActivitiesPrint = (props: IActivitiesPrintProps) => {
  const { experiences, recipientData } = props;
  let chunkedExperiences = [];
  for (let i = 0; i < experiences.length; i += ITEMS_PER_PAGE) {
    let currentChunk = experiences.slice(i, i + ITEMS_PER_PAGE);
    chunkedExperiences.push(currentChunk);
  }

  const HeaderContent: React.FC<IHeaderProps> = ({ showActivitiesLabel }) => (
    <>
      <PrintablePageHeader recipientData={recipientData} />

      <div
        className={classNames["wc-ActivitiesPrint--ActivitiesLabelContainer"]}
      >
        {showActivitiesLabel && (
          <Stack horizontal verticalAlign="center" tokens={stackTokens}>
            <Icon
              iconName="Family"
              className={classNames["wc-ActivitiesPrint--familyIcon"]}
            />
            <div>All Activities</div>
          </Stack>
        )}
      </div>
    </>
  );

  const ExperiencesBlock = ({ experiences }) => {
    return (
      <Stack
        className={classNames["wc-ActivitiesPrint--ActivitiesGrid"]}
        tokens={stackTokens}
      >
        <Stack tokens={{ childrenGap: ACTIVITY_TOKEN_GAP }}>
          {experiences.map((experience) => {
            const {
              details,
              availability,
              phoneNumber,
              title,
              id: experienceId,
            } = experience;

            const careCircleMembers =
              experience?.careCircle?.careCircleMembers || [];

            const participatingCareCircleMembers = careCircleMembers.filter(
              (member) => {
                const memberExperiencesIds = member.experienceOccurrences.map(
                  (experience) => {
                    return experience.experience.id;
                  }
                );
                return memberExperiencesIds.includes(experienceId);
              }
            );

            const activityCareCircleMembers =
              participatingCareCircleMembers.map((member) => {
                return {
                  image: member.careGiver.imageBase64,
                  name: member.careGiver.displayName,
                };
              });

            const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

            const experienceColumns = [
              title,
              formattedPhoneNumber,
              availability,
            ];
            return (
              <>
                <Stack
                  className={
                    classNames["wc-ActivitiesPrint--ActivityContainer"]
                  }
                  verticalAlign="space-evenly"
                >
                  <Stack horizontal>
                    {experienceColumns.map((content) => {
                      return (
                        <Stack
                          className={
                            classNames["wc-ActivitiesPrint--ActivityContent"]
                          }
                          verticalAlign="center"
                          key={content}
                        >
                          {content}
                        </Stack>
                      );
                    })}
                    <Stack
                      className={
                        classNames[
                          "wc-ActivitiesPrint--ActivityContent-Details"
                        ]
                      }
                      verticalAlign="center"
                    >
                      {details}
                    </Stack>
                  </Stack>
                  <Stack
                    horizontal
                    className={
                      classNames["wc-ActivitiesPrint--ActivityMembersContent"]
                    }
                    verticalAlign="center"
                    tokens={stackTokens}
                  >
                    {activityCareCircleMembers.map((member) => (
                      <Avatar
                        size={AvatarSizes.small}
                        base64={member.image}
                        key={member.image}
                        name={member.name}
                      />
                    ))}
                  </Stack>
                </Stack>
              </>
            );
          })}
        </Stack>
      </Stack>
    );
  };

  const ActivityPage: React.FC<IActivityPageProps> = ({
    experiences,
    pageNumber,
  }) => {
    return (
      <>
        {pageNumber > 1 && (
          <div className={classNames["wc-ActivitiesPrint--headerBuffer"]} />
        )}

        <Stack
          className={classNames["wc-ActivitiesPrint--ActivityPageContainer"]}
          verticalAlign="space-between"
        >
          <Stack>
            <HeaderContent showActivitiesLabel={pageNumber === 1} />
            {titleColumns}
            <ExperiencesBlock experiences={experiences} />
          </Stack>
          <PrintablePageFooter
            includePageBreak={pageNumber !== chunkedExperiences.length}
            pageNumber={pageNumber}
            recipientData={recipientData}
          />
        </Stack>
      </>
    );
  };

  return (
    <div className={classNames["wc-ActivitiesPrint--innerContent"]}>
      {chunkedExperiences.map((chunk, i) => {
        // eslint-disable-next-line react/no-array-index-key
        return (
          <ActivityPage
            experiences={chunk}
            pageNumber={i + 1}
            key={`key-${i}`}
          />
        );
      })}
    </div>
  );
};

export default ActivitiesPrint;
