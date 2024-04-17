import { GetProvidersQuery, SearchAddressQuery } from 'src/graphQL/serverMocks/graphQLGeneratedCode';

export type AddressResult = SearchAddressQuery['addressSearch']['result']['results'][0];
export type Address = SearchAddressQuery['addressSearch']['result']['results'][0]['address'];
export type CurrentProviderAddress = GetProvidersQuery['careRecipientProviders']['providers'][0]['address'];
