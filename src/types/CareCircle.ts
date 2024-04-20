import {
    InviteStatus,
    Roles,
    RelationshipsToLovedOne,
    GetCareTeamQuery,
} from '@srcc/graphQL/serverMocks/graphQLGeneratedCode';
export type CareCircle = {
    name?: string;
    careCircleMembers?: CareCircleMember[];
};

export type CareCircleMember = GetCareTeamQuery['usersCareCircle']['careCircleMembers'][0];

export type CareGiver = {
    displayName?: string;
    id?: string;
    relationship?: RelationshipsToLovedOne;
};

export type Invite = {
    id?: string;
    deliveryMethod?: string;
    inviteFromName?: string;
    inviteRecipientEmail?: string;
    status?: InviteStatus;
    careGiverAccepted?: string;
    makeAdmin: boolean;
    makeEmergencyContact: boolean;
    relationshipToLovedOne: RelationshipsToLovedOne;
};

export type UserProfile = {
    id?: string;
    role?: Roles;
};
