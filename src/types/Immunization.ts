import { GetImmunizationsQuery } from "@src/graphQL/serverMocks/graphQLGeneratedCode";

export type Immunization =
  GetImmunizationsQuery["careRecipientImmunizations"]["immunizations"][0];
