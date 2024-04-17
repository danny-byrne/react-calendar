import { GetPharmaciesQuery } from 'src/graphQL/serverMocks/graphQLGeneratedCode';

export type Pharmacy = GetPharmaciesQuery['careRecipientPharmacies']['pharmacies'][0];
