import { GetProvidersQuery } from "@src/graphQL/serverMocks/graphQLGeneratedCode";

export type Provider =
  GetProvidersQuery["careRecipientProviders"]["providers"][0];
