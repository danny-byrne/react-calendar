import { IPermissionsService } from '../PermissionsService';
import { Roles } from 'src/graphQL/serverMocks/graphQLGeneratedCode';

export const usePermissionsService = (): IPermissionsService => {
    return {
        getHasAdminPermissions: () => true,
        getIsOwner: () => true,
        getPermissions: () => Roles.Owner,
        setPermissions: () => null,
        clearPermissions: () => null,
        setAgreements: () => null,
        getAgreements: () => null,
    };
};
