import { useUserTiersQuery } from "api/user.api";
import { FeatureKeys } from "types";

interface Props {
    /**
     * The features the user needs to have access to
     */
    features: FeatureKeys[];
    /**
     * The operator to use when checking the features
     * whether the user has access to all of them or at least one
     */
    operator?: 'AND' | 'OR';
}

interface ReturnProps {
    hasAccess: (props: Props) => boolean;
}

export const useFeatureFlag = (): ReturnProps => {
    /**
     * Here you can implement your own logic to get the feature flag value
     */
    const { data: userTier } = useUserTiersQuery();

    const hasAccess = (props: Props) => {
        const { features, operator = "AND" } = props;
        if (!userTier) return false;

        const { featureAccess } = userTier?.tier;
        let access = false;
        if (features.length > 0) {
            /**
             * If a feature is passed, then we need to check the user has access
             * to all the features passed unless the operator is OR then we only
             * need to check they have access to at least one of the features
             */
            if (operator === 'OR') {
                for (const feature of features) {
                    if (typeof featureAccess[feature] === "boolean" && featureAccess[feature]) {
                        access = true;
                        break;
                    }
                }
            } else {
                for (const feature of features) {
                    if (typeof featureAccess[feature] === "boolean" && !featureAccess[feature]) {
                        access = false;
                        break;
                    } else {
                        access = true;
                    }
                }
            }
        } else {
            /**
             * If no feature is passed, then we assume that the user has access to the page
             */
            access = true;
        }

        return access;
    };

    return {
        hasAccess,
    };
};
