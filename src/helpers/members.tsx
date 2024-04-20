import { Roles } from 'src/graphQL/serverMocks/graphQLGeneratedCode';
import AdminIcon from 'src/assets/UserRoles/AdminIcon';
import CreatorIcon from 'src/assets/UserRoles/CreatorIcon';
import MemberIcon from 'src/assets/UserRoles/MemberIcon';

export const getRoleIcon = (role: Roles) => {
    let RoleIcon = undefined;

    switch (role) {
        case Roles.Owner:
            RoleIcon = CreatorIcon;
            break;
        case Roles.Contributor:
            RoleIcon = AdminIcon;
            break;
        case Roles.Reader:
            RoleIcon = MemberIcon;
            break;
    }

    return RoleIcon;
};
