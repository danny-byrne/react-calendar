import { GetActivitiesQuery } from "@src/graphQL/serverMocks/graphQLGeneratedCode";

export type Activity =
  GetActivitiesQuery["careCircleExperiences"]["experiences"][0];
export type MemberWithActivities =
  GetActivitiesQuery["careCircleExperiences"]["experiences"][0]["careCircle"]["careCircleMembers"][0];
