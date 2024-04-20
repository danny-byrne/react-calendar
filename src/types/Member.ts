import { Roles } from "@src/graphQL/serverMocks/graphQLGeneratedCode";
import { GetMemberQuery } from "@src/graphQL/serverMocks/graphQLGeneratedCode";
import { RelationshipsToLovedOne } from "@src/graphQL/serverMocks/graphQLGeneratedCode";

export type Member = {
  id: string;
  displayName?: string;
  email?: string;
  firstName?: string;
  imageBase64?: string;
  relationship?: string;
  surname?: string;
  profile?: UserProfile;
  mobile?: string;
};

export type UserProfile = {
  id?: string;
  role?: Roles;
};

export type IMemberEditFormikProps = {
  values: {
    isEmergencyContact: boolean;
    isAdmin: boolean;
    relationshipToLovedOne: RelationshipsToLovedOne;
    timeZoneID: string;
  };
  setFieldValue: (_, item) => void;
};

export type CareCircleMembers =
  GetMemberQuery["usersCareCircle"]["careCircleMembers"];
export type UserData =
  GetMemberQuery["usersCareCircle"]["careCircleMembers"][0];
export type CareGiver =
  GetMemberQuery["usersCareCircle"]["careCircleMembers"][0]["careGiver"];
export type Profile =
  GetMemberQuery["usersCareCircle"]["careCircleMembers"][0]["profile"];
