import { GetAllergiesQuery } from "@src/graphQL/serverMocks/graphQLGeneratedCode";

export type Allergy =
  GetAllergiesQuery["careRecipientAllergies"]["allergies"][0];
