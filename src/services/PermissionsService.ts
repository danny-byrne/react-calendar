import { LOCAL_STORAGE_KEYS } from "@src/app/Strings";
import { Roles } from "@src/graphQL/serverMocks/graphQLGeneratedCode";

export interface IPermissionsService {
  getHasAdminPermissions: () => boolean;
  getIsOwner: () => boolean;
  getPermissions: () => Roles;
  setPermissions: (role: Roles) => void;
  clearPermissions: () => void;
  setAgreements: (
    agreesHasConsentToManageLoveOnesHealth: string,
    agreesToTermsAndPrivacy: string,
    understandsIntendedAppUse: string,
    understandsMicrosoftUseOfTheirData: string,
    understandsNotPermittedToUsePlatformForMinors: string,
    agreesToOpenAiUse: string
  ) => void;
  getAgreements: () => {
    agreesHasConsentToManageLoveOnesHealth: string;
    agreesToTermsAndPrivacy: string;
    understandsIntendedAppUse: string;
    understandsMicrosoftUseOfTheirData: string;
    understandsNotPermittedToUsePlatformForMinors: string;
    agreesToOpenAiUse: string;
  };
}

export const usePermissionsService = (): IPermissionsService => {
  const adminRoles = [Roles.Contributor, Roles.Owner];

  return {
    getHasAdminPermissions: () => {
      const cachedRole = localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE) as Roles;
      return adminRoles.includes(cachedRole);
    },
    getIsOwner: () => {
      const cachedRole = localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE) as Roles;
      return cachedRole === Roles.Owner;
    },
    getPermissions: () => {
      const cachedRole = localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE) as Roles;
      return cachedRole;
    },
    setPermissions: (role: Roles) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, role);
    },
    setAgreements: (
      agreesHasConsentToManageLoveOnesHealth?: string,
      agreesToTermsAndPrivacy?: string,
      understandsIntendedAppUse?: string,
      understandsMicrosoftUseOfTheirData?: string,
      understandsNotPermittedToUsePlatformForMinors?: string,
      agreesToOpenAiUse?: string
    ) => {
      if (agreesHasConsentToManageLoveOnesHealth)
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.AGREE_CONSENT_TO_MANAGE_HEALTH,
          agreesHasConsentToManageLoveOnesHealth
        );

      if (agreesToTermsAndPrivacy) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.AGREE_TO_TOS,
          agreesToTermsAndPrivacy
        );
      }

      if (understandsIntendedAppUse) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.AGREE_UNDERSTANDS_USAGE,
          understandsIntendedAppUse
        );
      }

      if (understandsMicrosoftUseOfTheirData) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.AGREE_UNDERSTANDS_DATA_USE,
          understandsMicrosoftUseOfTheirData
        );
      }
      if (understandsNotPermittedToUsePlatformForMinors) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.UNDERSTANDS_MINORS_NOT_PERMITTED,
          understandsMicrosoftUseOfTheirData
        );
      }
      if (agreesToOpenAiUse) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.AGREE_TO_OPENAI,
          agreesToOpenAiUse
        );
      }
    },
    getAgreements: () => {
      const agreesHasConsentToManageLoveOnesHealth = localStorage.getItem(
        LOCAL_STORAGE_KEYS.AGREE_CONSENT_TO_MANAGE_HEALTH
      );
      const agreesToTermsAndPrivacy = localStorage.getItem(
        LOCAL_STORAGE_KEYS.AGREE_TO_TOS
      );
      const understandsIntendedAppUse = localStorage.getItem(
        LOCAL_STORAGE_KEYS.AGREE_UNDERSTANDS_USAGE
      );
      const understandsMicrosoftUseOfTheirData = localStorage.getItem(
        LOCAL_STORAGE_KEYS.AGREE_UNDERSTANDS_DATA_USE
      );
      const understandsNotPermittedToUsePlatformForMinors =
        localStorage.getItem(
          LOCAL_STORAGE_KEYS.UNDERSTANDS_MINORS_NOT_PERMITTED
        );
      const agreesToOpenAiUse = localStorage.getItem(
        LOCAL_STORAGE_KEYS.AGREE_TO_OPENAI
      );
      return {
        agreesHasConsentToManageLoveOnesHealth,
        agreesToTermsAndPrivacy,
        understandsIntendedAppUse,
        understandsMicrosoftUseOfTheirData,
        understandsNotPermittedToUsePlatformForMinors,
        agreesToOpenAiUse,
      };
    },
    clearPermissions: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ROLE);
    },
  };
};
